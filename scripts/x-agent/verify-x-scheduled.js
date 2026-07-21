// scripts/x-agent/verify-x-scheduled.js
// Reconciles x-queue.json against what Zernio actually holds. A scheduler that
// only checks the HTTP status of its own POST cannot detect a vendor-side
// account disconnect; this can, and exits non-zero so CI or a human sees it.
//
// Run:  node scripts/x-agent/verify-x-scheduled.js

import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { loadEnv, listPosts, getAccounts } from '../lib/zernio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BAD_STATUSES = new Set(['failed', 'cancelled', 'error']);

// Pure: compare our intent against server truth. Returns every discrepancy.
// `boundAccountId` is optional and last: when provided, the top-level
// inactive-account check only fires for the account this pipeline actually
// binds (ZERNIO_X_ACCOUNT_ID); when omitted, every inactive twitter account
// is flagged (legacy behaviour, kept so older call sites/tests still work).
export function reconcile(queue, serverPosts, accounts, boundAccountId) {
  const problems = [];

  for (const a of accounts) {
    if (a.platform === 'twitter' && !a.isActive) {
      const isBound = boundAccountId === undefined || a._id === boundAccountId;
      if (isBound) {
        problems.push(`account "${a.displayName}" (twitter) is inactive on Zernio; posts will not publish`);
      }
    }
  }

  const twitterPosts = serverPosts.filter((p) =>
    (p.platforms || []).some((pl) => pl.platform === 'twitter'),
  );

  let matched = 0;
  for (const q of queue) {
    const hit = twitterPosts.find((p) => (p.scheduledFor || '').startsWith(q.scheduledDate));
    if (!hit) {
      problems.push(`${q.scheduledDate} (${q.sourceSlug}): not found on Zernio`);
      continue;
    }
    matched++;

    const scheduledDate = new Date(hit.scheduledFor);
    if (Number.isNaN(scheduledDate.getTime())) {
      problems.push(`${q.scheduledDate}: unparseable scheduledFor value "${hit.scheduledFor}"`);
    } else if (scheduledDate.getUTCHours() !== 20 || scheduledDate.getUTCMinutes() !== 0) {
      problems.push(`${q.scheduledDate}: wrong slot, server says ${hit.scheduledFor}`);
    }

    if (BAD_STATUSES.has(hit.status)) {
      problems.push(`${q.scheduledDate}: post status is ${hit.status}`);
    }
    for (const pl of hit.platforms || []) {
      if (pl.platform !== 'twitter') continue;
      if (BAD_STATUSES.has(pl.status)) {
        problems.push(`${q.scheduledDate}: twitter status is ${pl.status}`);
      }
      if (pl.accountId && pl.accountId.isActive === false) {
        problems.push(`${q.scheduledDate}: bound to an inactive account`);
      }
    }
  }

  // A leftover or duplicate schedule sitting on Zernio with no matching queue
  // entry is exactly the double-post scare this script exists to catch; the
  // queue walk above can never surface it because it only looks the other way.
  for (const p of twitterPosts) {
    const hasQueueEntry = queue.some((q) => (p.scheduledFor || '').startsWith(q.scheduledDate));
    if (!hasQueueEntry) {
      const date = (p.scheduledFor || '').slice(0, 10) || 'unknown-date';
      problems.push(`orphan on Zernio: ${date} (id ${p._id}) has no queue entry`);
    }
  }

  return { problems, matched };
}

async function main() {
  loadEnv();
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    console.error('[verify-x] ERROR: ZERNIO_API_KEY is not set.');
    process.exit(1);
  }

  const queue = JSON.parse(readFileSync(join(__dirname, 'x-queue.json'), 'utf8'));

  let serverPosts;
  try {
    serverPosts = await listPosts(apiKey);
  } catch (e) {
    console.error(`[verify-x] ERROR: could not fetch posts from Zernio - ${e.message}`);
    process.exit(1);
    return;
  }

  let accounts;
  try {
    accounts = await getAccounts(apiKey);
  } catch (e) {
    console.error(`[verify-x] ERROR: could not fetch accounts from Zernio - ${e.message}`);
    process.exit(1);
    return;
  }

  const { problems, matched } = reconcile(queue, serverPosts, accounts, process.env.ZERNIO_X_ACCOUNT_ID);
  console.log(`[verify-x] ${matched}/${queue.length} queued posts confirmed on Zernio.`);
  if (problems.length) {
    console.error(`[verify-x] ${problems.length} PROBLEM(S):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('[verify-x] All clear.');
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main().catch((err) => {
    console.error(`[verify-x] ERROR: unhandled failure - ${err.message}`);
    process.exit(1);
  });
}
