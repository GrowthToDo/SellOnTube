// scripts/x-agent/x-schedule.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildScheduledForX, buildXPayload } from './x-schedule.js';

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
