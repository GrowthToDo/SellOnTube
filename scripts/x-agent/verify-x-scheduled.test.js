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
