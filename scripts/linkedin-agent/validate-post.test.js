// scripts/linkedin-agent/validate-post.test.js
// Run: node scripts/linkedin-agent/validate-post.test.js
import assert from 'assert';
import { validatePost } from './validate-post.js';

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  PASS  ${name}`); passed++; }
  catch (e) { console.error(`  FAIL  ${name}`); console.error(`         ${e.message}`); failed++; }
}

const good = {
  linkedinPost: 'A'.repeat(1000),
  linkLocation: null,
  firstComment: null,
  hashtags: ['#YouTubeSEO'],
};

test('passes a clean no-link post', () => {
  const r = validatePost(good);
  assert.strictEqual(r.ok, true, r.reasons.join('; '));
});

test('fails when too short', () => {
  const r = validatePost({ ...good, linkedinPost: 'short' });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('length')));
});

test('fails when too long', () => {
  const r = validatePost({ ...good, linkedinPost: 'A'.repeat(1800) });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('length')));
});

test('fails on em dash', () => {
  const r = validatePost({ ...good, linkedinPost: 'A'.repeat(999) + '—' });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('dash')));
});

test('fails on banned phrase', () => {
  const r = validatePost({ ...good, linkedinPost: 'In today’s digital landscape ' + 'A'.repeat(980) });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('banned')));
});

test('comment link: needs firstComment and no URL in body', () => {
  const bad = { ...good, linkLocation: 'comment', firstComment: null };
  assert.strictEqual(validatePost(bad).ok, false);
  const bodyUrl = { ...good, linkLocation: 'comment', firstComment: 'x', linkedinPost: 'see https://x.com ' + 'A'.repeat(980) };
  assert.strictEqual(validatePost(bodyUrl).ok, false);
  const ok = { ...good, linkLocation: 'comment', firstComment: 'Full: https://sellontube.com/x' };
  assert.strictEqual(validatePost(ok).ok, true, validatePost(ok).reasons.join('; '));
});

test('null link: no URL in body and no firstComment', () => {
  const urlInBody = { ...good, linkedinPost: 'go https://x.com ' + 'A'.repeat(985) };
  assert.strictEqual(validatePost(urlInBody).ok, false);
  const hasComment = { ...good, firstComment: 'https://x.com' };
  assert.strictEqual(validatePost(hasComment).ok, false);
});

test('body link (authority-lesson): URL in body, no firstComment', () => {
  const ok = { ...good, linkLocation: 'body', firstComment: null, linkedinPost: 'watch https://youtube.com/watch?v=x ' + 'A'.repeat(960) };
  assert.strictEqual(validatePost(ok).ok, true, validatePost(ok).reasons.join('; '));
  const noUrl = { ...good, linkLocation: 'body' };
  assert.strictEqual(validatePost(noUrl).ok, false);
});

test('fails on more than 3 hashtags', () => {
  const r = validatePost({ ...good, hashtags: ['#a', '#b', '#c', '#d'] });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('hashtag')));
});

test('fails on duplicate hook vs recent history', () => {
  const post = { ...good, linkedinPost: 'Your subscriber count is useless.\n' + 'A'.repeat(980) };
  const r = validatePost(post, ['Your subscriber count is useless.']);
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('dedup') || x.includes('hook')));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
