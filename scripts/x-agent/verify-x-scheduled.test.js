// scripts/x-agent/verify-x-scheduled.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcile } from './verify-x-scheduled.js';

// reconcile() takes x-history.json rows (what we actually told Zernio), not
// x-queue.json entries (what we intended to tell it).
const scheduled = [{ date: '2026-07-23', sourceSlug: 'a', status: 'scheduled' }];
const activeAccounts = [{ platform: 'twitter', displayName: 'Sell On YouTube', isActive: true }];

function serverPost(overrides = {}) {
  return {
    _id: 'p1',
    scheduledFor: '2026-07-23T20:00:00.000Z',
    status: 'scheduled',
    platforms: [{ platform: 'twitter', status: 'pending', accountId: { isActive: true } }],
    ...overrides,
  };
}

test('clean state produces no problems', () => {
  const r = reconcile(scheduled, [serverPost()], activeAccounts);
  assert.deepEqual(r.problems, []);
  assert.equal(r.matched, 1);
});

test('flags a queued date missing from the server', () => {
  const r = reconcile(scheduled, [], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('2026-07-23') && p.includes('not found')));
});

test('flags an inactive twitter account', () => {
  const dead = [{ platform: 'twitter', displayName: 'Sell On YouTube', isActive: false }];
  const r = reconcile(scheduled, [serverPost()], dead);
  assert.ok(r.problems.some((p) => p.includes('inactive')));
});

test('flags a failed or cancelled platform entry', () => {
  const bad = serverPost({
    platforms: [{ platform: 'twitter', status: 'cancelled', accountId: { isActive: true } }],
  });
  const r = reconcile(scheduled, [bad], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('cancelled')));
});

test('flags a slot that is not 20:00 UTC', () => {
  const wrong = serverPost({ scheduledFor: '2026-07-23T13:30:00.000Z' });
  const r = reconcile(scheduled, [wrong], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('13:30')));
});

test('flags failed and error platform statuses, not just cancelled', () => {
  const failed = serverPost({
    platforms: [{ platform: 'twitter', status: 'failed', accountId: { isActive: true } }],
  });
  const rFailed = reconcile(scheduled, [failed], activeAccounts);
  assert.ok(rFailed.problems.some((p) => p.includes('failed')));

  const errored = serverPost({
    platforms: [{ platform: 'twitter', status: 'error', accountId: { isActive: true } }],
  });
  const rError = reconcile(scheduled, [errored], activeAccounts);
  assert.ok(rError.problems.some((p) => p.includes('error')));
});

test('accepts a same-instant scheduledFor written with a UTC offset instead of Z', () => {
  // 18:00 at UTC-02:00 is the same instant as 20:00 UTC, and the string still
  // starts with the queue date so the queue-walk match logic is unaffected.
  const equivalent = serverPost({ scheduledFor: '2026-07-23T18:00:00-02:00' });
  const r = reconcile(scheduled, [equivalent], activeAccounts);
  assert.ok(!r.problems.some((p) => p.includes('wrong slot')));
});

test('rejects a genuinely wrong hour even when offset-formatted', () => {
  const wrong = serverPost({ scheduledFor: '2026-07-23T15:00:00-02:00' }); // 17:00 UTC
  const r = reconcile(scheduled, [wrong], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('wrong slot')));
});

test('flags an unparseable scheduledFor value instead of silently passing', () => {
  const bad = serverPost({ scheduledFor: '2026-07-23T99:99:99' });
  const r = reconcile(scheduled, [bad], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('unparseable')));
});

test('flags an orphan post on Zernio with no matching queue entry', () => {
  const orphan = serverPost({
    _id: 'p9',
    scheduledFor: '2026-08-05T20:00:00.000Z',
  });
  const r = reconcile(scheduled, [serverPost(), orphan], activeAccounts);
  assert.ok(
    r.problems.some((p) => p.includes('orphan on Zernio: 2026-08-05') && p.includes('p9')),
  );
});

test('raises no orphan problems when every server post matches a queue entry', () => {
  const r = reconcile(scheduled, [serverPost()], activeAccounts);
  assert.ok(!r.problems.some((p) => p.includes('orphan')));
});

test('raises the inactive-account problem only for the bound account, not an unrelated one', () => {
  const accounts = [
    { _id: 'acct-bound', platform: 'twitter', displayName: 'Bound Account', isActive: false },
    { _id: 'acct-other', platform: 'twitter', displayName: 'Unrelated Account', isActive: false },
  ];
  const r = reconcile(scheduled, [serverPost()], accounts, 'acct-bound');
  assert.ok(r.problems.some((p) => p.includes('Bound Account')));
  assert.ok(!r.problems.some((p) => p.includes('Unrelated Account')));
});

// --- CRITICAL 1: same-date duplicate on Zernio ------------------------------
// .find() examined only the first server post on a date, and the orphan walk
// skipped the second because its date DID match a queue entry. Both halves of
// the net missed a live double-post.

test('flags two server posts sharing one scheduled date as a double-post', () => {
  const p1 = serverPost({ _id: 'p1' });
  const p2 = serverPost({ _id: 'p2' });
  const r = reconcile(scheduled, [p1, p2], activeAccounts);
  assert.ok(
    r.problems.some((p) => p.includes('2026-07-23') && p.includes('double-post')),
    `expected a double-post problem, got ${JSON.stringify(r.problems)}`,
  );
});

test('does not report a double-post when a date holds exactly one server post', () => {
  const r = reconcile(scheduled, [serverPost()], activeAccounts);
  assert.ok(!r.problems.some((p) => p.includes('double-post')));
  assert.deepEqual(r.problems, []);
});

test('inspects every duplicate, not just the first, for slot and status problems', () => {
  const good = serverPost({ _id: 'p1' });
  const bad = serverPost({ _id: 'p2', scheduledFor: '2026-07-23T09:00:00.000Z' });
  const r = reconcile(scheduled, [good, bad], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('wrong slot')));
});

// --- CRITICAL 2: inactive-account check disabling itself --------------------

test('a blank ZERNIO_X_ACCOUNT_ID still flags an inactive twitter account', () => {
  // A bare `ZERNIO_X_ACCOUNT_ID=` in .env yields '' rather than undefined.
  const dead = [{ _id: 'acct-bound', platform: 'twitter', displayName: 'Sell On YouTube', isActive: false }];
  const r = reconcile(scheduled, [serverPost()], dead, '');
  assert.ok(
    r.problems.some((p) => p.includes('inactive')),
    `expected an inactive-account problem, got ${JSON.stringify(r.problems)}`,
  );
});

test('matches an account keyed `id` rather than `_id`', () => {
  const dead = [{ id: 'acct-bound', platform: 'twitter', displayName: 'Bound Account', isActive: false }];
  const r = reconcile(scheduled, [serverPost()], dead, 'acct-bound');
  assert.ok(r.problems.some((p) => p.includes('Bound Account') && p.includes('inactive')));
});

test('flags a bound account that is absent from Zernio account list', () => {
  const accounts = [
    { _id: 'acct-other', platform: 'twitter', displayName: 'Unrelated Account', isActive: true },
  ];
  const r = reconcile(scheduled, [serverPost()], accounts, 'acct-bound');
  assert.ok(
    r.problems.some((p) => p.includes('acct-bound') && p.includes('not present')),
    `expected a missing-bound-account problem, got ${JSON.stringify(r.problems)}`,
  );
});

test('does not flag an unrelated inactive account when the bound one is healthy', () => {
  const accounts = [
    { _id: 'acct-bound', platform: 'twitter', displayName: 'Bound Account', isActive: true },
    { _id: 'acct-other', platform: 'twitter', displayName: 'Unrelated Account', isActive: false },
  ];
  const r = reconcile(scheduled, [serverPost()], accounts, 'acct-bound');
  assert.deepEqual(r.problems, []);
});

// --- IMPORTANT 3: reconcile against history, with an injected clock ---------

test('a quota-deferred queue entry raises no false "not found"', () => {
  // The entry is in x-queue.json but was never handed to Zernio, so it has no
  // history row and must not be reconciled at all.
  const r = reconcile([], [], activeAccounts, undefined, new Date('2026-07-24T00:00:00Z'));
  assert.deepEqual(r.problems, []);
  assert.equal(r.matched, 0);
});

test('a past published server post from a rotated batch is not an orphan', () => {
  const past = serverPost({
    _id: 'p-old',
    scheduledFor: '2026-07-23T20:00:00.000Z',
    status: 'published',
  });
  const nowRows = [{ date: '2026-09-01', sourceSlug: 'later', status: 'scheduled' }];
  const server = [past, serverPost({ _id: 'p-new', scheduledFor: '2026-09-01T20:00:00.000Z' })];
  const r = reconcile(nowRows, server, activeAccounts, undefined, new Date('2026-08-15T00:00:00Z'));
  assert.deepEqual(r.problems, []);
  assert.equal(r.matched, 1);
});

test('a past-instant server post is not an orphan even without a published status', () => {
  const past = serverPost({ _id: 'p-old', scheduledFor: '2026-07-23T20:00:00.000Z' });
  const r = reconcile([], [past], activeAccounts, undefined, new Date('2026-08-15T00:00:00Z'));
  assert.deepEqual(r.problems, []);
});

test('a genuine future orphan is still flagged', () => {
  const future = serverPost({ _id: 'p-ghost', scheduledFor: '2026-09-30T20:00:00.000Z' });
  const r = reconcile([], [future], activeAccounts, undefined, new Date('2026-08-15T00:00:00Z'));
  assert.ok(
    r.problems.some((p) => p.includes('orphan on Zernio: 2026-09-30') && p.includes('p-ghost')),
  );
});

test('reconcile reads no ambient clock: same inputs, same result across calls', () => {
  const future = serverPost({ _id: 'p-ghost', scheduledFor: '2026-09-30T20:00:00.000Z' });
  const a = reconcile([], [future], activeAccounts, undefined, new Date('2026-08-15T00:00:00Z'));
  const b = reconcile([], [future], activeAccounts, undefined, new Date('2026-08-15T00:00:00Z'));
  assert.deepEqual(a, b);
});

test('flags a history row with no usable date rather than silently skipping it', () => {
  const r = reconcile([{ sourceSlug: 'broken', status: 'scheduled' }], [serverPost()], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('broken') && p.includes('no usable date')));
});
