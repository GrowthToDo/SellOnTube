import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseUsage, normalizeAccounts } from './zernio.js';

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

// --- normalizeAccounts ------------------------------------------------------
// This sits on the account-deactivation signal path. The old `accounts || []`
// fallback meant an unrecognised payload produced an empty list, the verifier
// looped over nothing, and it printed "All clear" during a live disconnect.

test('normalizeAccounts unwraps the { accounts: [...] } envelope', () => {
  const a = [{ _id: 'x', platform: 'twitter', isActive: true }];
  assert.deepEqual(normalizeAccounts({ accounts: a }), a);
});

test('normalizeAccounts accepts a bare array response', () => {
  const a = [{ _id: 'x', platform: 'twitter', isActive: false }];
  assert.deepEqual(normalizeAccounts(a), a);
});

test('normalizeAccounts passes a genuinely empty account list through', () => {
  assert.deepEqual(normalizeAccounts({ accounts: [] }), []);
  assert.deepEqual(normalizeAccounts([]), []);
});

test('normalizeAccounts throws on a differently-keyed envelope instead of returning []', () => {
  assert.throws(() => normalizeAccounts({ data: [{ _id: 'x' }] }), /unexpected shape/);
});

test('normalizeAccounts throws when accounts is present but not an array', () => {
  assert.throws(() => normalizeAccounts({ accounts: { _id: 'x' } }), /unexpected shape/);
});

test('normalizeAccounts throws on an empty, null or undefined body', () => {
  assert.throws(() => normalizeAccounts({}), /unexpected shape/);
  assert.throws(() => normalizeAccounts(null), /unexpected shape/);
  assert.throws(() => normalizeAccounts(undefined), /unexpected shape/);
});
