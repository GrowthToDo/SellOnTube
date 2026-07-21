import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateXPost } from './validate-x-post.js';

const good = {
  scheduledDate: '2026-07-23',
  xPost: 'Four videos a month sounds modest.\n\nYear one it looks like nothing.\nYear two it is the only channel still compounding.',
  sourceSlug: 'compounding-effect-four-videos-a-month',
  sourceTitle: 'The compounding effect of four videos a month',
};

test('passes a clean post', () => {
  assert.deepEqual(validateXPost(good), { ok: true, reasons: [] });
});

test('fails when over 280 characters', () => {
  const r = validateXPost({ ...good, xPost: 'a'.repeat(281) });
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => x.includes('281')));
});

test('fails on any URL', () => {
  const r = validateXPost({ ...good, xPost: 'See https://sellontube.com for more.' });
  assert.ok(r.reasons.includes('contains a URL'));
});

test('fails on em dash', () => {
  const r = validateXPost({ ...good, xPost: 'Views are vanity — pipeline is not.' });
  assert.ok(r.reasons.includes('contains em/en dash'));
});

test('fails on banned phrase', () => {
  const r = validateXPost({ ...good, xPost: 'Time to leverage your channel.' });
  assert.ok(r.reasons.some((x) => x.includes('leverage')));
});

test('fails on curly apostrophe banned phrase', () => {
  const r = validateXPost({ ...good, xPost: 'In today’s market, nobody searches.' });
  assert.ok(r.reasons.some((x) => x.includes('banned phrase:')));
});

test('fails on weekend date', () => {
  const r = validateXPost({ ...good, scheduledDate: '2026-07-25' });
  assert.ok(r.reasons.some((x) => x.includes('weekend')));
});

test('fails on empty body', () => {
  const r = validateXPost({ ...good, xPost: '   ' });
  assert.ok(r.reasons.includes('empty xPost'));
});

test('fails on missing source attribution', () => {
  const r = validateXPost({ ...good, sourceSlug: '' });
  assert.ok(r.reasons.includes('missing sourceSlug'));
});

test('dedups against recent hooks', () => {
  const hook = good.xPost.split('\n')[0];
  const r = validateXPost(good, [hook]);
  assert.ok(r.reasons.includes('dedup: hook already used in recent history'));
});

test('dedups a >120-char hook against a 120-char-truncated history entry', () => {
  // Mirrors saveToHistory: history stores hook.slice(0, 120). A first line
  // longer than 120 chars must still be caught as a repeat.
  const longHook = 'This is a deliberately long opening line that goes on and on well past the one hundred and twenty character truncation boundary used in history.';
  assert.ok(longHook.length > 120);
  const storedHook = longHook.slice(0, 120);
  const r = validateXPost({ ...good, xPost: `${longHook}\n\nSecond line.` }, [storedHook]);
  assert.ok(r.reasons.includes('dedup: hook already used in recent history'));
});
