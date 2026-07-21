import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseUsage } from './zernio.js';

test('parseUsage extracts limit, used and remaining', () => {
  const raw = {
    planName: 'Free',
    billingAnchorDay: 22,
    limits: { uploads: 20, profiles: 2 },
    usage: { uploads: 3, profiles: 1 },
  };
  assert.deepEqual(parseUsage(raw), {
    limit: 20, used: 3, remaining: 17, anchorDay: 22,
  });
});

test('parseUsage clamps remaining at zero when over quota', () => {
  const raw = { billingAnchorDay: 22, limits: { uploads: 20 }, usage: { uploads: 25 } };
  assert.equal(parseUsage(raw).remaining, 0);
});
