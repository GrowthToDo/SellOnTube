// scripts/x-agent/verify-x-scheduled.js
// Reconciles x-history.json (what we actually told Zernio) against what Zernio
// actually holds. A scheduler that only checks the HTTP status of its own POST
// cannot detect a vendor-side account disconnect; this can, and exits non-zero
// so CI or a human sees it.
//
// Run:  node scripts/x-agent/verify-x-scheduled.js

import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { loadEnv, listPosts, getAccounts } from '../lib/zernio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BAD_STATUSES = new Set(['failed', 'cancelled', 'error']);

// Pure: compare what we actually told Zernio against what Zernio actually
// holds. Returns every discrepancy. No I/O, no ambient clock reads.
//
// `scheduledRows` is x-history.json's `posts` filtered to `status: 'scheduled'`
// - i.e. what was really handed to the vendor - NOT x-queue.json. The queue is
// intent: it still lists quota-deferred entries that were never sent, and it
// rotates once a batch ships, so reconciling against it makes this check report
// false `not found` and false `orphan` problems in ordinary steady state. A
// check that cries wolf stops being read, which is the exact mechanism that let
// the sibling LinkedIn stream die unnoticed for ten days. Each row needs
// `{ date, sourceSlug }`.
//
// `boundAccountId` is optional: when set, only the account this pipeline binds
// (ZERNIO_X_ACCOUNT_ID) is inspected, and its absence from Zernio's list is
// itself a problem. When blank/absent, every twitter account is inspected.
//
// `now` is passed in rather than read, so the past-instant exclusion stays
// deterministic. When it is null the exclusion is skipped, which over-reports
// (fails loud) rather than going quiet.
export function reconcile(scheduledRows, serverPosts, accounts, boundAccountId, now = null) {
  const problems = [];
  const nowMs = now == null ? null : new Date(now).getTime();

  // Account health. Both directions must fail loud: a blank env var yields ''
  // (not undefined), and Zernio may key accounts `id` rather than `_id` - each
  // of those silently matched nothing before, disabling the whole check.
  const bound = (accounts || []).filter(
    (a) =>
      a.platform === 'twitter' &&
      (!boundAccountId || a._id === boundAccountId || a.id === boundAccountId),
  );
  if (boundAccountId && bound.length === 0) {
    problems.push(
      `bound account ${boundAccountId} not present in Zernio's account list; cannot confirm it is active`,
    );
  }
  for (const a of bound) {
    if (!a.isActive) {
      problems.push(`account "${a.displayName}" (twitter) is inactive on Zernio; posts will not publish`);
    }
  }

  const twitterPosts = serverPosts.filter((p) =>
    (p.platforms || []).some((pl) => pl.platform === 'twitter'),
  );

  let matched = 0;
  for (const q of scheduledRows) {
    const date = q.date;
    if (typeof date !== 'string' || !date) {
      problems.push(`history row for "${q.sourceSlug ?? 'unknown'}" has no usable date; cannot reconcile it`);
      continue;
    }

    // COUNT the matches, never take the first. A second post on the same date
    // is a real double-post to real followers, and it is reachable: a POST can
    // commit vendor-side and still throw locally (response timeout, bad JSON),
    // leaving no history row and inviting an operator re-run of that date.
    const hits = twitterPosts.filter((p) => (p.scheduledFor || '').startsWith(date));
    if (hits.length === 0) {
      problems.push(`${date} (${q.sourceSlug}): not found on Zernio`);
      continue;
    }
    if (hits.length > 1) {
      problems.push(`${date}: ${hits.length} posts on Zernio for one queue entry (double-post)`);
    }
    matched++;

    for (const hit of hits) {
      const scheduledDate = new Date(hit.scheduledFor);
      if (Number.isNaN(scheduledDate.getTime())) {
        problems.push(`${date}: unparseable scheduledFor value "${hit.scheduledFor}"`);
      } else if (scheduledDate.getUTCHours() !== 20 || scheduledDate.getUTCMinutes() !== 0) {
        problems.push(`${date}: wrong slot, server says ${hit.scheduledFor}`);
      }

      if (BAD_STATUSES.has(hit.status)) {
        problems.push(`${date}: post status is ${hit.status}`);
      }
      for (const pl of hit.platforms || []) {
        if (pl.platform !== 'twitter') continue;
        if (BAD_STATUSES.has(pl.status)) {
          problems.push(`${date}: twitter status is ${pl.status}`);
        }
        if (pl.accountId && pl.accountId.isActive === false) {
          problems.push(`${date}: bound to an inactive account`);
        }
      }
    }
  }

  // A leftover schedule sitting on Zernio with no matching history row is the
  // other half of the net; the walk above can never surface it because it only
  // looks one way. Already-published posts and past instants are expected
  // residue of previous batches, not orphans.
  for (const p of twitterPosts) {
    const when = p.scheduledFor || '';
    if (scheduledRows.some((q) => q.date && when.startsWith(q.date))) continue;
    if (p.status === 'published') continue;
    const whenMs = new Date(when).getTime();
    if (nowMs !== null && !Number.isNaN(whenMs) && whenMs < nowMs) continue;
    const date = when.slice(0, 10) || 'unknown-date';
    problems.push(`orphan on Zernio: ${date} (id ${p._id}) has no scheduled history entry`);
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

  // Reconcile against what we actually scheduled (history), not what we meant
  // to schedule (queue). See the note on reconcile().
  let historyPosts = [];
  try {
    const h = JSON.parse(readFileSync(join(__dirname, 'x-history.json'), 'utf8'));
    historyPosts = h.posts || [];
  } catch {
    // no history yet: nothing has been handed to the vendor
  }
  const scheduledRows = historyPosts.filter((p) => p.status === 'scheduled');

  let queue = [];
  try {
    queue = JSON.parse(readFileSync(join(__dirname, 'x-queue.json'), 'utf8'));
  } catch {
    // queue is informational here only
  }

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

  const { problems, matched } = reconcile(
    scheduledRows,
    serverPosts,
    accounts,
    process.env.ZERNIO_X_ACCOUNT_ID,
    new Date(),
  );
  console.log(`[verify-x] ${matched}/${scheduledRows.length} scheduled posts confirmed on Zernio.`);

  // Informational, never a problem: queue entries with no history row simply
  // have not been handed to the vendor yet (quota deferral, or a batch not yet
  // run). x-schedule.js is what reports deferrals; this keeps them visible.
  const notYetScheduled = queue.filter(
    (q) => !scheduledRows.some((r) => r.date === q.scheduledDate),
  );
  if (notYetScheduled.length) {
    console.log(`[verify-x] ${notYetScheduled.length} queued post(s) not yet scheduled (informational):`);
    for (const q of notYetScheduled) console.log(`  ${q.scheduledDate}  ${q.sourceSlug}`);
  }

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
