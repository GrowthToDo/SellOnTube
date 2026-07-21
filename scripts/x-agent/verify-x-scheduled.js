// scripts/x-agent/verify-x-scheduled.js
// Reconciles x-queue.json against what Zernio actually holds. A scheduler that
// only checks the HTTP status of its own POST cannot detect a vendor-side
// account disconnect; this can, and exits non-zero so CI or a human sees it.
//
// Run:  node scripts/x-agent/verify-x-scheduled.js

import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { loadEnv, listPosts } from '../lib/zernio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXPECTED_SLOT = 'T20:00';
const BAD_STATUSES = new Set(['failed', 'cancelled', 'error']);

// Pure: compare our intent against server truth. Returns every discrepancy.
export function reconcile(queue, serverPosts, accounts) {
  const problems = [];

  for (const a of accounts) {
    if (a.platform === 'twitter' && !a.isActive) {
      problems.push(`account "${a.displayName}" (twitter) is inactive on Zernio; posts will not publish`);
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
    if (!(hit.scheduledFor || '').includes(EXPECTED_SLOT)) {
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
  const serverPosts = await listPosts(apiKey);
  const res = await fetch('https://zernio.com/api/v1/accounts', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    console.error(`[verify-x] ERROR: accounts lookup failed with HTTP ${res.status}`);
    process.exit(1);
  }
  const { accounts } = await res.json();

  const { problems, matched } = reconcile(queue, serverPosts, accounts);
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
  main();
}
