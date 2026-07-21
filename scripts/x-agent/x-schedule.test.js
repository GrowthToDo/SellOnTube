// scripts/x-agent/x-schedule.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildScheduledForX,
  buildXPayload,
  findDuplicateDates,
  filterAlreadyScheduled,
  planAttempts,
} from './x-schedule.js';

test('buildScheduledForX pins the slot to 20:00 UTC', () => {
  assert.equal(buildScheduledForX('2026-07-23'), '2026-07-23T20:00:00Z');
});

test('buildScheduledForX never collides with the upload-post 13:30 slot', () => {
  assert.ok(!buildScheduledForX('2026-07-23').includes('13:30'));
});

test('buildXPayload targets twitter with the given account', () => {
  const p = buildXPayload(
    { scheduledDate: '2026-07-23', xPost: 'Boring beats clever.' },
    'acct_123',
  );
  assert.deepEqual(p, {
    content: 'Boring beats clever.',
    timezone: 'Asia/Kolkata',
    platforms: [{ platform: 'twitter', accountId: 'acct_123' }],
    scheduledFor: '2026-07-23T20:00:00Z',
  });
});

test('buildXPayload trims the body and never appends hashtags', () => {
  const p = buildXPayload({ scheduledDate: '2026-07-23', xPost: '  Hook.  ' }, 'a');
  assert.equal(p.content, 'Hook.');
  assert.ok(!p.content.includes('#'));
});

// --- findDuplicateDates (Finding 1) ---

test('findDuplicateDates returns nothing for a clean queue', () => {
  const queue = [{ scheduledDate: '2026-07-21' }, { scheduledDate: '2026-07-22' }];
  assert.deepEqual(findDuplicateDates(queue), []);
});

test('findDuplicateDates flags a date used by two entries', () => {
  const queue = [
    { scheduledDate: '2026-07-21' },
    { scheduledDate: '2026-07-22' },
    { scheduledDate: '2026-07-21' },
  ];
  assert.deepEqual(findDuplicateDates(queue), ['2026-07-21']);
});

test('findDuplicateDates flags every date that repeats, sorted', () => {
  const queue = [
    { scheduledDate: '2026-07-23' },
    { scheduledDate: '2026-07-21' },
    { scheduledDate: '2026-07-23' },
    { scheduledDate: '2026-07-21' },
  ];
  assert.deepEqual(findDuplicateDates(queue), ['2026-07-21', '2026-07-23']);
});

// --- filterAlreadyScheduled (Finding 2) ---

test('filterAlreadyScheduled keeps a post with no matching history', () => {
  const queue = [{ scheduledDate: '2026-07-23', sourceSlug: 'a' }];
  const { toSchedule, alreadyScheduled } = filterAlreadyScheduled(queue, []);
  assert.deepEqual(toSchedule, queue);
  assert.deepEqual(alreadyScheduled, []);
});

test('filterAlreadyScheduled skips a post already scheduled for that date', () => {
  const queue = [
    { scheduledDate: '2026-07-23', sourceSlug: 'a' },
    { scheduledDate: '2026-07-24', sourceSlug: 'b' },
  ];
  const history = [{ date: '2026-07-23', sourceSlug: 'a', status: 'scheduled' }];
  const { toSchedule, alreadyScheduled } = filterAlreadyScheduled(queue, history);
  assert.deepEqual(toSchedule, [queue[1]]);
  assert.equal(alreadyScheduled.length, 1);
  assert.equal(alreadyScheduled[0].post.sourceSlug, 'a');
  assert.equal(alreadyScheduled[0].historyEntry.date, '2026-07-23');
});

test('filterAlreadyScheduled does NOT skip a date only present with a non-scheduled status', () => {
  const queue = [{ scheduledDate: '2026-07-23', sourceSlug: 'a' }];
  const history = [{ date: '2026-07-23', sourceSlug: 'a', status: 'failed' }];
  const { toSchedule, alreadyScheduled } = filterAlreadyScheduled(queue, history);
  assert.deepEqual(toSchedule, queue);
  assert.deepEqual(alreadyScheduled, []);
});

// --- planAttempts (Finding 3) ---

function fakeValidate(invalidSlugs) {
  return (post) =>
    invalidSlugs.includes(post.sourceSlug)
      ? { ok: false, reasons: ['fake invalid'] }
      : { ok: true, reasons: [] };
}

test('planAttempts attempts every post when quota comfortably covers the queue', () => {
  const queue = [{ sourceSlug: 'a', xPost: 'A' }, { sourceSlug: 'b', xPost: 'B' }];
  const plan = planAttempts(queue, [], 5, fakeValidate([]));
  assert.deepEqual(plan.map((e) => e.action), ['attempt', 'attempt']);
});

test('planAttempts defers only once the quota of VALID posts is exhausted', () => {
  // 3 posts, remaining quota 1: only the first valid post should attempt,
  // the rest should be deferred - regardless of position.
  const queue = [
    { sourceSlug: 'a', xPost: 'A' },
    { sourceSlug: 'b', xPost: 'B' },
    { sourceSlug: 'c', xPost: 'C' },
  ];
  const plan = planAttempts(queue, [], 1, fakeValidate([]));
  assert.deepEqual(plan.map((e) => e.action), ['attempt', 'defer', 'defer']);
});

test('planAttempts does not let an invalid earlier post steal quota from a later valid post', () => {
  // Regression for the original bug: queue.slice(0, remaining) sliced BEFORE
  // validation, so an invalid post at position 0 pushed a valid post at
  // position 1 into "deferred" even though quota was never actually spent
  // on the invalid one.
  const queue = [
    { sourceSlug: 'bad', xPost: 'Bad' },
    { sourceSlug: 'good', xPost: 'Good' },
  ];
  const plan = planAttempts(queue, [], 1, fakeValidate(['bad']));
  assert.equal(plan[0].action, 'skip');
  assert.equal(plan[1].action, 'attempt');
});

test('planAttempts skips invalid posts without consuming quota, reporting reasons', () => {
  const queue = [{ sourceSlug: 'bad', xPost: 'Bad' }];
  const plan = planAttempts(queue, [], 5, fakeValidate(['bad']));
  assert.equal(plan[0].action, 'skip');
  assert.deepEqual(plan[0].reasons, ['fake invalid']);
});

test('planAttempts defers everything once remaining is 0', () => {
  const queue = [{ sourceSlug: 'a', xPost: 'A' }];
  const plan = planAttempts(queue, [], 0, fakeValidate([]));
  assert.deepEqual(plan.map((e) => e.action), ['defer']);
});

test('planAttempts (using the real validator) dedups a repeat hook within the same run', () => {
  const post = (slug) => ({
    sourceSlug: slug,
    sourceTitle: 't',
    scheduledDate: '2026-07-23',
    xPost: 'Same opening hook line.\n\nBody text differs here.',
  });
  const queue = [post('first'), post('second')];
  const plan = planAttempts(queue, [], 5);
  assert.equal(plan[0].action, 'attempt');
  assert.equal(plan[1].action, 'skip');
  assert.ok(plan[1].reasons.some((r) => r.includes('dedup')));
});
