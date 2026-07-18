// scripts/linkedin-agent/linkedin-schedule.test.js
// Run: node scripts/linkedin-agent/linkedin-schedule.test.js
import assert from 'assert';
import { buildScheduledFor, buildPayload } from './linkedin-schedule.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (e) {
    console.error(`  FAIL  ${name}`);
    console.error(`         ${e.message}`);
    failed++;
  }
}

// --- buildScheduledFor ---

test('buildScheduledFor: formats date as 9 AM IST (03:30 UTC)', () => {
  const result = buildScheduledFor('2026-03-30');
  assert.strictEqual(result, '2026-03-30T03:30:00Z');
});

test('buildScheduledFor: works for any weekday date', () => {
  const result = buildScheduledFor('2026-04-07');
  assert.strictEqual(result, '2026-04-07T03:30:00Z');
});

// --- buildPayload ---

const basePost = {
  scheduledDate: '2026-03-30',
  dayOfWeek: 'Monday',
  weekdayTheme: 'Strategy',
  sourceTitle: 'The YouTube Acquisition Engine',
  sourceUrl: 'https://sellontube.com/blog/test',
  imageUrl: 'https://sellontube.com/og/test.jpg',
  postAngle: 'test angle',
  linkedinPost: 'Test post body. https://sellontube.com/blog/test',
  hashtags: ['#YouTubeSEO'],
};

test('buildPayload: includes content, scheduledFor, timezone, platforms', () => {
  const payload = buildPayload(basePost, 'acc_test123');
  assert.strictEqual(payload.content, basePost.linkedinPost);
  assert.strictEqual(payload.scheduledFor, '2026-03-30T03:30:00Z');
  assert.strictEqual(payload.timezone, 'Asia/Kolkata');
  assert.deepStrictEqual(payload.platforms, [{ platform: 'linkedin', accountId: 'acc_test123' }]);
});

test('buildPayload: includes mediaItems when zernioImageUrl is passed', () => {
  const payload = buildPayload(basePost, 'acc_test123', 'https://zernio.com/media/abc.png');
  assert.deepStrictEqual(payload.mediaItems, [{ url: 'https://zernio.com/media/abc.png', type: 'image' }]);
});

test('buildPayload: omits mediaItems when no zernioImageUrl', () => {
  const payload = buildPayload(basePost, 'acc_test123');
  assert.strictEqual(payload.mediaItems, undefined);
});

test('buildPayload: includes firstComment when post.firstComment is set', () => {
  const post = { ...basePost, firstComment: 'Full method: https://sellontube.com/x?utm_source=linkedin' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.firstComment, post.firstComment);
});

test('buildPayload: omits firstComment when post.firstComment is null', () => {
  const post = { ...basePost, firstComment: null };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.firstComment, undefined);
});

test('buildPayload: omits firstComment when post.firstComment is empty string', () => {
  const post = { ...basePost, firstComment: '' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.firstComment, undefined);
});

// --- summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
