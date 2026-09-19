// Do B2B YouTube videos that write timestamps actually get chapters?
//
// Produces the first-party figure published on /tools/youtube-timestamp-generator. Re-runnable:
//   node research/chapter-study-2026-09-19.mjs
//
// Method, stated so the number is checkable:
//   1. Search YouTube for a fixed list of buyer-intent B2B queries (search.list, 100 units each).
//   2. Take the top N video IDs from each.
//   3. Fetch them in batched videos.list calls (1 unit per 50) for description AND duration.
//   4. Reuse the SAME parser and the SAME rule checker the tool uses
//      (netlify/functions/lib/parsers.js) so the published number and the tool's own verdict
//      cannot drift apart. The duration is what lets the last-chapter rule be checked, which the
//      tool page itself cannot do because it never fetches the video.
//
// Quota: QUERIES.length * 100 + ceil(videos / 50) units.

import { readFileSync, writeFileSync } from 'node:fs';
import { checkChapters, extractTimestamps, parseIsoDuration, CHAPTER_RULES } from '../netlify/functions/lib/parsers.js';

const QUERIES = [
  'b2b saas demo',
  'crm software comparison',
  'project management software review',
  'marketing automation tutorial',
  'how to choose accounting software',
  'erp software demo',
  'b2b sales training',
  'saas onboarding walkthrough',
];
const PER_QUERY = 15;

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
  const d = await getJson(
    `${B}/videos?part=snippet,contentDetails&id=${all.slice(i, i + 50).join(',')}&key=${KEY}`
  );
  details.push(...(d.items ?? []));
}

let withTimestamps = 0;
let validChapters = 0;
let brokenChapters = 0;
let noTimestamps = 0;
let unknownDuration = 0;
const reasonCounts = new Map();
const failureExamples = [];

for (const v of details) {
  const desc = v.snippet?.description ?? '';
  const seconds = parseIsoDuration(v.contentDetails?.duration ?? '');
  if (seconds === null) unknownDuration++;

  const chapters = extractTimestamps(desc);
  if (chapters.length === 0) {
    noTimestamps++;
    continue;
  }
  withTimestamps++;

  const verdict = checkChapters(chapters, seconds);
  if (verdict.valid) {
    validChapters++;
  } else {
    brokenChapters++;
    if (failureExamples.length < 5) {
      failureExamples.push({ id: v.id, count: chapters.length, first: chapters[0].raw, reasons: verdict.reasons });
    }
    for (const reason of verdict.reasons) {
      // Bucket by rule, not by the sentence, since the sentences carry specific timestamps.
      const bucket = /at least \d+ chapters/.test(reason)
        ? 'fewer than 3 chapters'
        : /must start at 0:00/.test(reason)
          ? 'first chapter does not start at 0:00'
          : /must increase/.test(reason)
            ? 'timestamps out of order'
            : /at least \d+ seconds/.test(reason)
              ? 'a chapter shorter than 10 seconds'
              : /past the end/.test(reason)
                ? 'a chapter at or past the end of the video'
                : /no label/.test(reason)
                  ? 'an unlabelled timestamp'
                  : 'other';
      reasonCounts.set(bucket, (reasonCounts.get(bucket) ?? 0) + 1);
    }
  }
}

const pctBroken = withTimestamps ? Math.round((brokenChapters / withTimestamps) * 100) : 0;
const pctNone = details.length ? Math.round((noTimestamps / details.length) * 100) : 0;
const reasonRows = [...reasonCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([reason, n]) => `| ${reason} | ${n} |`)
  .join('\n');

const out = `# Do B2B videos that write timestamps actually get chapters?

Run: ${new Date().toISOString().slice(0, 10)}
Script: \`research/chapter-study-2026-09-19.mjs\` (re-runnable)

## Method

Searched YouTube for ${QUERIES.length} buyer-intent B2B queries, took the top ${PER_QUERY} videos of each,
then read every description through the same parser the timestamp tool uses
(\`netlify/functions/lib/parsers.js\`) and judged it with the same rule checker. The video duration
comes from \`contentDetails\` in the same call, which is what makes the last-chapter rule checkable.

YouTube's three rules: the first chapter starts at ${CHAPTER_RULES.FIRST_START}:00, there are at
least ${CHAPTER_RULES.MIN_COUNT} chapters, and every chapter runs at least
${CHAPTER_RULES.MIN_SECONDS} seconds.

Queries: ${QUERIES.map((q) => `"${q}"`).join(', ')}

## Result

| | count |
|---|---|
| Videos sampled | ${details.length} |
| With at least one timestamp line in the description | ${withTimestamps} |
| With no timestamps at all | ${noTimestamps} (${pctNone}%) |
| Timestamps that are valid chapters | ${validChapters} |
| **Timestamps that are NOT valid chapters** | **${brokenChapters}** |
| **Share of timestamped descriptions that fail at least one rule** | **${pctBroken}%** |
| Videos whose duration could not be read | ${unknownDuration} |

### Which rule fails

| rule | times broken |
|---|---|
${reasonRows || '| none | 0 |'}

### Examples

${failureExamples.map((e) => `- \`${e.id}\`: ${e.count} timestamps, first at ${e.first}. ${e.reasons.join(' ')}`).join('\n')}

## Published claim

"In a sample of ${details.length} B2B videos, ${withTimestamps} wrote timestamps into the
description and ${brokenChapters} of those (${pctBroken}%) broke at least one of YouTube's three
chapter rules, so the timestamps never became chapters."
`;

writeFileSync(new URL('./chapter-study-2026-09-19.md', import.meta.url), out);
console.log(
  `\nSampled ${details.length} videos. ${withTimestamps} had timestamps. ${brokenChapters} of those (${pctBroken}%) fail at least one rule.`
);
console.log('Wrote research/chapter-study-2026-09-19.md');
