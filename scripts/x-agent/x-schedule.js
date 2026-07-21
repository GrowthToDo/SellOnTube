// scripts/x-agent/x-schedule.js
// Reads x-queue.json and schedules each link-free post to X via Zernio.
// Separate stream from scripts/linkedin-agent/: different source material
// (published blog posts), different slot (20:00 UTC), different vendor path.
//
// Run:  node scripts/x-agent/x-schedule.js
// Env:  ZERNIO_API_KEY, ZERNIO_X_ACCOUNT_ID

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { loadEnv, getUsage, postToZernio } from '../lib/zernio.js';
import { validateXPost } from './validate-x-post.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The upload-post stream owns 13:30 UTC. This stream owns 20:00 UTC
// (4pm US-Eastern, 1pm Pacific). The gap is deliberate and load-bearing:
// two vendors posting the same account at the same instant is a double-post.
const POST_TIME_UTC = '20:00:00';

export function buildScheduledForX(dateStr) {
  return `${dateStr}T${POST_TIME_UTC}Z`;
}

export function buildXPayload(post, accountId) {
  return {
    content: (post.xPost || '').trim(),
    timezone: 'Asia/Kolkata',
    platforms: [{ platform: 'twitter', accountId }],
    scheduledFor: buildScheduledForX(post.scheduledDate),
  };
}

function saveToHistory(post, zernioId) {
  const p = join(__dirname, 'x-history.json');
  let history = { posts: [] };
  try {
    history = JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    // start fresh if missing or corrupt
  }
  history.posts.unshift({
    date: post.scheduledDate,
    sourceSlug: post.sourceSlug,
    sourceTitle: post.sourceTitle ?? null,
    hook: (post.xPost || '').split('\n')[0].slice(0, 120),
    chars: (post.xPost || '').trim().length,
    zernioId,
    status: 'scheduled',
  });
  history.posts = history.posts.slice(0, 60);
  writeFileSync(p, JSON.stringify(history, null, 2) + '\n');
}

async function main() {
  loadEnv();

  const apiKey = process.env.ZERNIO_API_KEY;
  const accountId = process.env.ZERNIO_X_ACCOUNT_ID;
  if (!apiKey) {
    console.error('[x-schedule] ERROR: ZERNIO_API_KEY is not set.');
    process.exit(1);
  }
  if (!accountId) {
    console.error('[x-schedule] ERROR: ZERNIO_X_ACCOUNT_ID is not set.');
    console.error('  Add it to .env: ZERNIO_X_ACCOUNT_ID=6a59c1f93d50078defbf90b3');
    process.exit(1);
  }

  let queue;
  try {
    queue = JSON.parse(readFileSync(join(__dirname, 'x-queue.json'), 'utf8'));
  } catch (e) {
    console.error(`[x-schedule] ERROR: could not read x-queue.json - ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(queue) || queue.length === 0) {
    console.error('[x-schedule] ERROR: x-queue.json is empty.');
    process.exit(1);
  }

  // Quota preflight. Zernio charges an upload at SCHEDULE time, so a queue
  // longer than the remaining allowance must be truncated on purpose and
  // reported, never silently half-shipped.
  const usage = await getUsage(apiKey);
  console.log(`[x-schedule] Zernio quota: ${usage.used}/${usage.limit} used, ${usage.remaining} remaining (anchor day ${usage.anchorDay})`);
  if (usage.remaining === 0) {
    console.error('[x-schedule] ERROR: no Zernio uploads remaining this cycle. Nothing scheduled.');
    process.exit(1);
  }

  let recentHooks = [];
  try {
    const h = JSON.parse(readFileSync(join(__dirname, 'x-history.json'), 'utf8'));
    recentHooks = (h.posts || []).map((p) => (p.hook || '').trim()).filter(Boolean);
  } catch {
    // no history yet
  }

  const willAttempt = queue.slice(0, usage.remaining);
  const deferred = queue.slice(usage.remaining);
  if (deferred.length) {
    console.warn(`[x-schedule] QUOTA: ${deferred.length} post(s) deferred to next cycle:`);
    for (const p of deferred) console.warn(`             ${p.scheduledDate}  ${p.sourceSlug}`);
    console.warn('');
  }

  let ok = 0;
  let fail = 0;
  for (const post of willAttempt) {
    const label = `${post.scheduledDate}  ${post.sourceSlug}`;
    const check = validateXPost(post, recentHooks);
    if (!check.ok) {
      console.error(`  SKIPPED    ${label}`);
      console.error(`             ${check.reasons.join('; ')}\n`);
      fail++;
      continue;
    }
    try {
      const res = await postToZernio(buildXPayload(post, accountId), apiKey);
      saveToHistory(post, res?._id ?? res?.post?._id ?? null);
      recentHooks.push((post.xPost || '').split('\n')[0].trim());
      console.log(`  SCHEDULED  ${label}`);
      console.log(`             ${buildScheduledForX(post.scheduledDate)} | ${post.xPost.trim().length}/280 chars\n`);
      ok++;
    } catch (err) {
      console.error(`  FAILED     ${label}`);
      console.error(`             ${err.message}\n`);
      fail++;
    }
  }

  console.log(`Done. ${ok} scheduled, ${fail} failed, ${deferred.length} deferred.`);
  console.log('Next: run `npm run x:verify` to confirm Zernio actually holds them.');
  if (fail > 0) process.exit(1);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main();
}
