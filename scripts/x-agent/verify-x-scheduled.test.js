// scripts/x-agent/verify-x-scheduled.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcile } from './verify-x-scheduled.js';

const queue = [{ scheduledDate: '2026-07-23', sourceSlug: 'a', xPost: 'Hook one.' }];
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
  const r = reconcile(queue, [serverPost()], activeAccounts);
  assert.deepEqual(r.problems, []);
  assert.equal(r.matched, 1);
});

test('flags a queued date missing from the server', () => {
  const r = reconcile(queue, [], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('2026-07-23') && p.includes('not found')));
});

test('flags an inactive twitter account', () => {
  const dead = [{ platform: 'twitter', displayName: 'Sell On YouTube', isActive: false }];
  const r = reconcile(queue, [serverPost()], dead);
  assert.ok(r.problems.some((p) => p.includes('inactive')));
});

test('flags a failed or cancelled platform entry', () => {
  const bad = serverPost({
    platforms: [{ platform: 'twitter', status: 'cancelled', accountId: { isActive: true } }],
  });
  const r = reconcile(queue, [bad], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('cancelled')));
});

test('flags a slot that is not 20:00 UTC', () => {
  const wrong = serverPost({ scheduledFor: '2026-07-23T13:30:00.000Z' });
  const r = reconcile(queue, [wrong], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('13:30')));
});

test('flags failed and error platform statuses, not just cancelled', () => {
  const failed = serverPost({
    platforms: [{ platform: 'twitter', status: 'failed', accountId: { isActive: true } }],
  });
  const rFailed = reconcile(queue, [failed], activeAccounts);
  assert.ok(rFailed.problems.some((p) => p.includes('failed')));

  const errored = serverPost({
    platforms: [{ platform: 'twitter', status: 'error', accountId: { isActive: true } }],
  });
  const rError = reconcile(queue, [errored], activeAccounts);
  assert.ok(rError.problems.some((p) => p.includes('error')));
});

test('accepts a same-instant scheduledFor written with a UTC offset instead of Z', () => {
  // 18:00 at UTC-02:00 is the same instant as 20:00 UTC, and the string still
  // starts with the queue date so the queue-walk match logic is unaffected.
  const equivalent = serverPost({ scheduledFor: '2026-07-23T18:00:00-02:00' });
  const r = reconcile(queue, [equivalent], activeAccounts);
  assert.ok(!r.problems.some((p) => p.includes('wrong slot')));
});

test('rejects a genuinely wrong hour even when offset-formatted', () => {
  const wrong = serverPost({ scheduledFor: '2026-07-23T15:00:00-02:00' }); // 17:00 UTC
  const r = reconcile(queue, [wrong], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('wrong slot')));
});

test('flags an unparseable scheduledFor value instead of silently passing', () => {
  const bad = serverPost({ scheduledFor: '2026-07-23T99:99:99' });
  const r = reconcile(queue, [bad], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('unparseable')));
});

test('flags an orphan post on Zernio with no matching queue entry', () => {
  const orphan = serverPost({
    _id: 'p9',
    scheduledFor: '2026-08-05T20:00:00.000Z',
  });
  const r = reconcile(queue, [serverPost(), orphan], activeAccounts);
  assert.ok(
    r.problems.some((p) => p.includes('orphan on Zernio: 2026-08-05') && p.includes('p9')),
  );
});

test('raises no orphan problems when every server post matches a queue entry', () => {
  const r = reconcile(queue, [serverPost()], activeAccounts);
  assert.ok(!r.problems.some((p) => p.includes('orphan')));
});

test('raises the inactive-account problem only for the bound account, not an unrelated one', () => {
  const accounts = [
    { _id: 'acct-bound', platform: 'twitter', displayName: 'Bound Account', isActive: false },
    { _id: 'acct-other', platform: 'twitter', displayName: 'Unrelated Account', isActive: false },
  ];
  const r = reconcile(queue, [serverPost()], accounts, 'acct-bound');
  assert.ok(r.problems.some((p) => p.includes('Bound Account')));
  assert.ok(!r.problems.some((p) => p.includes('Unrelated Account')));
});
