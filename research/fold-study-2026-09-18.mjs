// Where does the first link sit in a B2B YouTube description?
//
// Produces the first-party figure published on /tools/youtube-description-extractor. Re-runnable:
//   node research/fold-study-2026-09-18.mjs
//
// Method, stated so the number is checkable:
//   1. Search YouTube for a fixed list of buyer-intent B2B queries (search.list, 100 units each).
//   2. Take the top N video IDs from each.
//   3. Fetch all of them in one batched videos.list call (1 unit) for the full descriptions.
//   4. Reuse the SAME parser the tool uses (netlify/functions/lib/parsers.js) so the published
//      number and the tool's own output cannot drift apart.
//
// Quota: QUERIES.length * 100 + 1 units.

import { readFileSync, writeFileSync } from 'node:fs';
import { extractLinks, ABOVE_FOLD_CHARS } from '../netlify/functions/lib/parsers.js';

const QUERIES = [
  'b2b saas demo',
  'project management software review',
  'crm software comparison',
  'marketing automation tutorial',
  'how to choose accounting software',
];
const PER_QUERY = 10;

function apiKey() {
  for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith('YOUTUBE_API_KEY=')) return t.slice('YOUTUBE_API_KEY='.length).trim();
  }
  throw new Error('YOUTUBE_API_KEY not found in .env');
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const KEY = apiKey();
const B = 'https://www.googleapis.com/youtube/v3';

const ids = new Set();
for (const q of QUERIES) {
  const d = await getJson(
    `${B}/search?part=snippet&type=video&q=${encodeURIComponent(q)}&maxResults=${PER_QUERY}&relevanceLanguage=en&key=${KEY}`
  );
  for (const it of d.items ?? []) if (it.id?.videoId) ids.add(it.id.videoId);
  console.log(`  "${q}" -> ${d.items?.length ?? 0} videos`);
}

const all = [...ids];
const details = [];
for (let i = 0; i < all.length; i += 50) {
  const d = await getJson(`${B}/videos?part=snippet&id=${all.slice(i, i + 50).join(',')}&key=${KEY}`);
  details.push(...(d.items ?? []));
}

let withLinks = 0;
let firstLinkBelowFold = 0;
let noLinks = 0;
const positions = [];

for (const v of details) {
  const desc = v.snippet?.description ?? '';
  const links = extractLinks(desc);
  if (links.length === 0) {
    noLinks++;
    continue;
  }
  withLinks++;
  positions.push(links[0].charIndex);
  if (!links[0].aboveFold) firstLinkBelowFold++;
}

const pct = withLinks ? Math.round((firstLinkBelowFold / withLinks) * 100) : 0;
const median = positions.length
  ? [...positions].sort((a, b) => a - b)[Math.floor(positions.length / 2)]
  : 0;

const out = `# Where the first link sits in a B2B YouTube description

Run: ${new Date().toISOString().slice(0, 10)}
Script: \`research/fold-study-2026-09-18.mjs\` (re-runnable)

## Method

Searched YouTube for ${QUERIES.length} buyer-intent B2B queries, took the top ${PER_QUERY} videos of
each, then read every description through the same parser the extractor tool uses
(\`netlify/functions/lib/parsers.js\`). "Above the fold" means a character index under
${ABOVE_FOLD_CHARS}, which is roughly what YouTube shows before "...more".

Queries: ${QUERIES.map((q) => `"${q}"`).join(', ')}

## Result

| | count |
|---|---|
| Videos sampled | ${details.length} |
| With at least one link in the description | ${withLinks} |
| With no link at all | ${noLinks} |
| **First link below the fold** | **${firstLinkBelowFold}** |
| **Share of linked descriptions whose first link is below the fold** | **${pct}%** |
| Median character position of the first link | ${median} |

## Published claim

"In a sample of ${details.length} B2B videos, ${pct}% of the descriptions that contained a link put
their first link below the fold."
`;

writeFileSync(new URL('./fold-study-2026-09-18.md', import.meta.url), out);
console.log(`\nSampled ${details.length} videos. ${withLinks} had links. ${pct}% put the first link below the fold. Median position ${median}.`);
console.log('Wrote research/fold-study-2026-09-18.md');
