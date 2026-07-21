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

// Pure: whole-batch precondition. Two queue entries on the same scheduledDate
// resolve to the identical `scheduledFor` instant, which is a visible
// double-post to real followers - exactly the failure the 20:00/13:30 split
// with the upload-post stream exists to prevent, just within one stream.
// A queue with duplicate dates is malformed; it must not be partially shipped.
export function findDuplicateDates(queue) {
  const seen = new Set();
  const dupes = new Set();
  for (const post of queue) {
    if (seen.has(post.scheduledDate)) dupes.add(post.scheduledDate);
    seen.add(post.scheduledDate);
  }
  return [...dupes].sort();
}

// Pure: split the queue into entries that still need scheduling and entries
// that x-history.json already shows as scheduled for that date. Re-running
// after a partial failure, or next cycle when quota refills, must not
// re-schedule work that already went out.
export function filterAlreadyScheduled(queue, historyPosts = []) {
  const scheduledDates = new Map();
  for (const p of historyPosts) {
    if (p.status === 'scheduled' && p.date) scheduledDates.set(p.date, p);
  }
  const toSchedule = [];
  const alreadyScheduled = [];
  for (const post of queue) {
    const hit = scheduledDates.get(post.scheduledDate);
    if (hit) {
      alreadyScheduled.push({ post, historyEntry: hit });
    } else {
      toSchedule.push(post);
    }
  }
  return { toSchedule, alreadyScheduled };
}

// Pure: decide, in queue order, which posts to attempt vs defer, WITHOUT
// pre-slicing by raw position. A post that fails validation consumes no
// quota, so it must not steal a slot from a later valid post. Quota is
// charged at schedule time, so only posts that pass validation count toward
// `remaining`; once that counter is reached, every remaining post - valid or
// not - is deferred to next cycle rather than attempted.
export function planAttempts(queue, recentHooks, remaining, validate = validateXPost) {
  const hooks = [...recentHooks];
  const plan = [];
  let counted = 0;
  for (const post of queue) {
    if (counted >= remaining) {
      plan.push({ post, action: 'defer', reasons: [] });
      continue;
    }
    const check = validate(post, hooks);
    if (!check.ok) {
      plan.push({ post, action: 'skip', reasons: check.reasons });
      continue;
    }
    counted++;
    const hook = (post.xPost || '').split('\n')[0].trim().slice(0, 120);
    if (hook) hooks.push(hook);
    plan.push({ post, action: 'attempt', reasons: [] });
  }
  return plan;
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

  // Whole-batch precondition: a queue with two entries on the same date is
  // malformed (identical scheduledFor instant -> double-post). Reject the
  // entire run rather than partially shipping it.
  const dupeDates = findDuplicateDates(queue);
  if (dupeDates.length) {
    console.error('[x-schedule] ERROR: duplicate scheduledDate values in x-queue.json (would double-post):');
    for (const d of dupeDates) console.error(`  ${d}`);
    process.exit(1);
  }

  let historyPosts = [];
  try {
    const h = JSON.parse(readFileSync(join(__dirname, 'x-history.json'), 'utf8'));
    historyPosts = h.posts || [];
  } catch {
    // no history yet
  }

  // Re-running after a partial failure, or next cycle when quota refills,
  // must not re-schedule posts that already went out.
  const { toSchedule, alreadyScheduled } = filterAlreadyScheduled(queue, historyPosts);
  if (alreadyScheduled.length) {
    console.log(`[x-schedule] ${alreadyScheduled.length} post(s) already scheduled, skipping:`);
    for (const { post, historyEntry } of alreadyScheduled) {
      console.log(`  ALREADY    ${post.scheduledDate}  ${post.sourceSlug} (already scheduled on ${historyEntry.date})`);
    }
    console.log('');
  }

  if (toSchedule.length === 0) {
    console.log('[x-schedule] Nothing new to schedule; every queued post is already recorded in history.');
    console.log(`Done. 0 scheduled, 0 failed, 0 deferred, ${alreadyScheduled.length} already scheduled.`);
    return;
  }

  // Quota preflight. Zernio charges an upload at SCHEDULE time, so a queue
  // longer than the remaining allowance must be truncated on purpose and
  // reported, never silently half-shipped.
  let usage;
  try {
    usage = await getUsage(apiKey);
  } catch (e) {
    console.error(`[x-schedule] ERROR: could not fetch Zernio usage - ${e.message}`);
    process.exit(1);
    return;
  }
  console.log(`[x-schedule] Zernio quota: ${usage.used}/${usage.limit} used, ${usage.remaining} remaining (anchor day ${usage.anchorDay})`);
  if (usage.remaining === 0) {
    console.error('[x-schedule] ERROR: no Zernio uploads remaining this cycle. Nothing scheduled.');
    process.exit(1);
  }

  const recentHooks = historyPosts.map((p) => (p.hook || '').trim()).filter(Boolean);

  // Plan first (validation-aware), then execute. Quota is only spent by
  // posts that actually pass validation, so an invalid post never steals a
  // slot from a later valid one.
  const plan = planAttempts(toSchedule, recentHooks, usage.remaining);

  const deferredEntries = plan.filter((e) => e.action === 'defer');
  if (deferredEntries.length) {
    console.warn(`[x-schedule] QUOTA: ${deferredEntries.length} post(s) deferred to next cycle:`);
    for (const { post } of deferredEntries) console.warn(`             ${post.scheduledDate}  ${post.sourceSlug}`);
    console.warn('');
  }

  let ok = 0;
  let fail = 0;
  for (const entry of plan) {
    const { post, action, reasons } = entry;
    const label = `${post.scheduledDate}  ${post.sourceSlug}`;

    if (action === 'defer') continue; // already reported above

    if (action === 'skip') {
      console.error(`  SKIPPED    ${label}`);
      console.error(`             ${reasons.join('; ')}\n`);
      fail++;
      continue;
    }

    try {
      const res = await postToZernio(buildXPayload(post, accountId), apiKey);
      saveToHistory(post, res?._id ?? res?.post?._id ?? null);
      console.log(`  SCHEDULED  ${label}`);
      console.log(`             ${buildScheduledForX(post.scheduledDate)} | ${post.xPost.trim().length}/280 chars\n`);
      ok++;
    } catch (err) {
      console.error(`  FAILED     ${label}`);
      console.error(`             ${err.message}\n`);
      fail++;
    }
  }

  console.log(`Done. ${ok} scheduled, ${fail} failed, ${deferredEntries.length} deferred, ${alreadyScheduled.length} already scheduled.`);
  console.log('Next: run `npm run x:verify` to confirm Zernio actually holds them.');
  if (fail > 0) process.exit(1);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main().catch((err) => {
    console.error(`[x-schedule] ERROR: unhandled failure - ${err.message}`);
    process.exit(1);
  });
}
