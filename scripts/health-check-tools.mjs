#!/usr/bin/env node
/**
 * health-check-tools.mjs — verify the live tool API endpoints actually work.
 *
 * Why this exists: on 2026-07-08 the transcript vendor died and
 * /api/get-transcript returned HTTP 500 to every visitor for seven weeks. Nobody noticed.
 * Google demoted /tools/youtube-transcript-generator from average position 13 to 41, which
 * cost the site more clicks than every other page combined.
 *
 * THE IMPORTANT DESIGN POINT: each check sends a REAL, VALID payload.
 * A malformed payload proves nothing here. get-transcript happily returned a correct 400 for
 * bad input the whole time it was completely broken for real input. That is exactly how the
 * outage stayed invisible. A cheap liveness ping would not have caught it, and neither would
 * a check that only asserts "the function responds".
 *
 * Pass/fail rule (see `isHealthy`):
 *   5xx, or a network-level failure -> FAIL (the function or its upstream is broken)
 *   404 / 405                       -> FAIL (the route is gone or misconfigured)
 *   429                             -> FAIL (a metered vendor is exhausted; visitors fail too)
 *   other 4xx                       -> PASS (the function is alive and validating input)
 *   2xx                             -> PASS
 *
 * The 404 case was found by mutation-testing this script: a deleted endpoint returns 404,
 * which an ordinary "status < 500" rule reports as healthy. Routing lives in each function's
 * own `export const config = { path }`, so a rename silently unroutes it.
 * The 429 case was added 2026-09-05: with a paid transcript vendor, quota exhaustion is a
 * real outage for every visitor, and "< 500" would have reported it as healthy.
 *
 * Usage:
 *   node scripts/health-check-tools.mjs
 *   node scripts/health-check-tools.mjs --base http://localhost:8888
 *   node scripts/health-check-tools.mjs --self-test    # asserts the pass/fail rule itself
 *
 * In GitHub Actions the PASS/FAIL table is also written to the job summary and each broken
 * tool becomes an `::error::` annotation, so the notification email names the failure.
 */

import { appendFileSync } from 'node:fs';

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = baseIdx !== -1 ? args[baseIdx + 1] : 'https://sellontube.com';
const TIMEOUT_MS = 90_000;

// A stable, short, caption-bearing video. "Me at the zoo", the first YouTube upload.
const TEST_VIDEO = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

/**
 * Coverage note: these are the transcript-dependent functions plus the three biggest
 * click earners. Not every function is checked — generate-script, generate-titles,
 * generate-video-ideas, generate-alternatives, find-video-keywords and youtube-suggest are
 * NOT covered, to keep daily Gemini spend near zero. Add them here if they start earning
 * traffic. This omission is deliberate and stated so the report is not mistaken for
 * full coverage.
 */
const CHECKS = [
  { name: 'get-transcript', path: '/api/get-transcript', body: { url: TEST_VIDEO }, note: 'transcript vendor' },
  { name: 'summarize-transcript', path: '/api/summarize-transcript', body: { videoId: 'jNQXAC9IVRw' }, note: 'transcript cache + Gemini' },
  { name: 'youtube-seo-tool', path: '/api/youtube-seo-tool', body: { videoUrl: TEST_VIDEO }, note: 'YouTube Data API + Gemini' },
  { name: 'generate-tags', path: '/api/generate-tags', body: { videoUrl: TEST_VIDEO }, note: 'transcript vendor (optional)' },
  {
    name: 'generate-description',
    path: '/api/generate-description',
    body: { videoUrl: TEST_VIDEO, ctaLink: 'https://sellontube.com' },
    note: 'transcript vendor (optional)',
  },
  {
    name: 'channel-audit',
    path: '/api/channel-audit',
    body: { channelInput: 'https://www.youtube.com/@MrBeast' },
    note: 'best CTR on site',
  },
  {
    name: 'youtube-rank-check',
    path: '/api/youtube-rank-check',
    body: { keyword: 'youtube seo', channelUrl: 'https://www.youtube.com/@MrBeast' },
    note: 'most clicks on site',
  },
  {
    name: 'cluster-keywords',
    path: '/api/cluster-keywords',
    body: { seed: 'youtube seo', keywords: ['youtube seo', 'youtube marketing'] },
    note: 'autocomplete tool',
  },
];

/** The whole pass/fail rule, in one place, so it can be self-tested. */
export function isHealthy(status) {
  if (status >= 500) return false;
  if (status === 404 || status === 405) return false; // route gone
  if (status === 429) return false; // vendor quota exhausted
  return true;
}

function selfTest() {
  const cases = [
    [200, true], [201, true], [400, true], [401, true], [422, true],
    [404, false], [405, false], [429, false], [500, false], [503, false],
  ];
  const wrong = cases.filter(([s, expected]) => isHealthy(s) !== expected);
  if (wrong.length) {
    console.error('SELF-TEST FAILED for statuses:', wrong.map(([s]) => s).join(', '));
    process.exit(1);
  }
  console.log(`self-test OK (${cases.length} status codes classified as expected)`);
  process.exit(0);
}

async function check({ name, path, body }) {
  const started = Date.now();
  try {
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - started;
    let detail = '';
    if (res.status >= 400) {
      const text = await res.text().catch(() => '');
      detail = text.slice(0, 160).replace(/\s+/g, ' ');
    }
    return { name, ok: isHealthy(res.status), status: String(res.status), ms, detail };
  } catch (err) {
    // A thrown fetch means we could not reach the endpoint at all. That is a failure.
    return {
      name,
      ok: false,
      status: 'NETWORK',
      ms: Date.now() - started,
      detail: String(err.message || err).slice(0, 160),
    };
  }
}

/** GitHub Actions job summary: shows on the run page without opening the log. */
function writeStepSummary(results, failed) {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) return;
  const rows = results.map(
    (r) => `| ${r.ok ? '✅' : '❌'} | \`${r.name}\` | ${r.status} | ${r.ms}ms | ${r.note} | ${r.detail.replace(/\|/g, '\\|')} |`
  );
  const md = [
    `## Tool health: ${results.length - failed.length}/${results.length} healthy`,
    '',
    `Base: ${BASE}`,
    '',
    '| | Tool | Status | Time | Depends on | Detail |',
    '|---|---|---|---|---|---|',
    ...rows,
    '',
    failed.length
      ? 'A 5xx means the function or the third-party service behind it is down. A 429 means a vendor quota is exhausted. Check the Netlify function log, then the vendor status, then the API key.'
      : 'All checked endpoints returned a real response.',
    '',
  ].join('\n');
  try {
    appendFileSync(file, md);
  } catch (e) {
    console.warn('Could not write step summary:', e.message);
  }
}

async function main() {
  if (args.includes('--self-test')) selfTest();

  const results = [];
  for (const c of CHECKS) {
    const r = await check(c);
    results.push({ ...r, note: c.note });
    const mark = r.ok ? 'PASS' : 'FAIL';
    console.log(`${mark}  ${r.name.padEnd(22)} ${r.status.padEnd(8)} ${String(r.ms + 'ms').padEnd(8)} ${r.detail}`);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} healthy  (base: ${BASE})`);
  writeStepSummary(results, failed);

  if (failed.length) {
    console.log('\nBROKEN:');
    for (const f of failed) {
      console.log(`  ${f.name} [${f.note}] -> ${f.status}  ${f.detail}`);
      // Annotation: surfaces in the Actions UI and in the failure email.
      if (process.env.GITHUB_ACTIONS) console.log(`::error title=${f.name} ${f.status}::${f.note}: ${f.detail || 'no body'}`);
    }
    console.log('\nA 5xx means the function or the third-party service behind it is down.');
    console.log('A 429 means a vendor quota is exhausted for every visitor, not just this check.');
    console.log('Check the Netlify function log, then the vendor status, then the API key.');
    process.exit(1);
  }

  console.log('All checked endpoints returned a real response.');
  process.exit(0);
}

main();
