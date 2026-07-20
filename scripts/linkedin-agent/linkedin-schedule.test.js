// scripts/linkedin-agent/linkedin-schedule.test.js
// Run: node scripts/linkedin-agent/linkedin-schedule.test.js
import assert from 'assert';
import {
  buildScheduledFor,
  buildPayload,
  buildXText,
  buildUploadPostForm,
  composeLinkedInContent,
  xLen,
} from './linkedin-schedule.js';

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

test('buildScheduledFor: formats date as 7 PM IST (13:30 UTC)', () => {
  const result = buildScheduledFor('2026-03-30');
  assert.strictEqual(result, '2026-03-30T13:30:00Z');
});

test('buildScheduledFor: works for any weekday date', () => {
  const result = buildScheduledFor('2026-04-07');
  assert.strictEqual(result, '2026-04-07T13:30:00Z');
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
  assert.strictEqual(payload.content, composeLinkedInContent(basePost));
  assert.strictEqual(payload.scheduledFor, '2026-03-30T13:30:00Z');
  assert.strictEqual(payload.timezone, 'Asia/Kolkata');
  assert.deepStrictEqual(payload.platforms, [{ platform: 'linkedin', accountId: 'acc_test123' }]);
});

// --- composeLinkedInContent (hashtags) ---

test('composeLinkedInContent: appends hashtags after a blank line', () => {
  const out = composeLinkedInContent({ linkedinPost: 'Body.', hashtags: ['#A', '#B'] });
  assert.strictEqual(out, 'Body.\n\n#A #B');
});

test('composeLinkedInContent: caps at 3 hashtags', () => {
  const out = composeLinkedInContent({ linkedinPost: 'Body.', hashtags: ['#A', '#B', '#C', '#D'] });
  assert.strictEqual(out, 'Body.\n\n#A #B #C');
});

test('composeLinkedInContent: no trailing block when there are no hashtags', () => {
  assert.strictEqual(composeLinkedInContent({ linkedinPost: 'Body.', hashtags: [] }), 'Body.');
  assert.strictEqual(composeLinkedInContent({ linkedinPost: 'Body.' }), 'Body.');
});

// --- buildXText prefers a bespoke xPost ---

test('buildXText: uses a bespoke xPost verbatim when present', () => {
  const post = { scheduledDate: '2026-07-20', xPost: 'Punchy\n\nline-break tweet.', linkedinPost: 'long body...' };
  assert.strictEqual(buildXText(post), 'Punchy\n\nline-break tweet.');
});

test('buildXText: rejects a bespoke xPost over 280 chars', () => {
  const post = { scheduledDate: '2026-07-20', xPost: 'x'.repeat(281), linkedinPost: 'body' };
  assert.throws(() => buildXText(post), /281 > 280/);
});

test('buildPayload: includes mediaItems when zernioImageUrl is passed', () => {
  const payload = buildPayload(basePost, 'acc_test123', 'https://zernio.com/media/abc.png');
  assert.deepStrictEqual(payload.mediaItems, [{ url: 'https://zernio.com/media/abc.png', type: 'image' }]);
});

test('buildPayload: omits mediaItems when no zernioImageUrl', () => {
  const payload = buildPayload(basePost, 'acc_test123');
  assert.strictEqual(payload.mediaItems, undefined);
});

test('buildPayload: nests firstComment in platformSpecificData when set', () => {
  const post = { ...basePost, firstComment: 'Full method: https://sellontube.com/x?utm_source=linkedin' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.platforms[0].platformSpecificData.firstComment, post.firstComment);
  assert.strictEqual(payload.firstComment, undefined, 'must NOT be top-level');
});

test('buildPayload: no platformSpecificData when firstComment is null', () => {
  const post = { ...basePost, firstComment: null };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.platforms[0].platformSpecificData, undefined);
});

test('buildPayload: no platformSpecificData when firstComment is empty string', () => {
  const post = { ...basePost, firstComment: '' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.platforms[0].platformSpecificData, undefined);
});

// --- buildXText (link-free, upload-post) ---

const shortHookPost = {
  scheduledDate: '2026-07-20',
  linkLocation: null,
  firstComment: null,
  linkedinPost:
    "YouTube has billions of logged-in users every month. Almost none of them will ever buy from you. That's not a problem, it's the whole point.\n\nEvery video you make does one of two jobs.\n\nWhich job is most of your channel actually doing?",
};

test('buildXText: no-link post stays under 280 and carries no URL', () => {
  const x = buildXText(shortHookPost);
  assert.ok(xLen(x) <= 280, `len ${xLen(x)}`);
  assert.ok(!/https?:\/\//.test(x), 'no-link post must not add a URL');
});

test('buildXText: leads with the hook', () => {
  const x = buildXText(shortHookPost);
  assert.ok(x.startsWith('YouTube has billions'), x.slice(0, 40));
});

test('buildXText: appends the closing question when it fits', () => {
  const x = buildXText(shortHookPost);
  assert.ok(x.includes('Which job is most of your channel actually doing?'));
});

test('buildXText: strips the link from a linkLocation=body post (upload-post removes URLs on X)', () => {
  const post = {
    scheduledDate: '2026-07-21',
    linkLocation: 'body',
    firstComment: null,
    linkedinPost: 'Short punchy hook about YouTube pipeline. Read the full breakdown here: https://sellontube.com/blog/x',
  };
  const x = buildXText(post);
  assert.ok(!/https?:\/\//.test(x), 'X text must never contain a URL');
  assert.ok(xLen(x) <= 280, `len ${xLen(x)}`);
});

test('buildXText: strips the URL even when it lives in firstComment', () => {
  const post = {
    scheduledDate: '2026-07-22',
    linkLocation: 'comment',
    firstComment: 'Full method here: https://sellontube.com/tools/roi',
    linkedinPost: 'A tight hook with no link in the body. The rest is a normal LinkedIn post.',
  };
  const x = buildXText(post);
  assert.ok(!/https?:\/\//.test(x), 'X text must never contain a URL');
});

test('buildXText: a very long hook is trimmed to <=280 with an ellipsis', () => {
  const longHook = 'word '.repeat(120).trim() + '.'; // ~600 chars
  const x = buildXText({ scheduledDate: '2026-07-23', linkLocation: null, linkedinPost: longHook });
  assert.ok(xLen(x) <= 280, `len ${xLen(x)}`);
  assert.ok(x.endsWith('…'), 'trimmed text should end with an ellipsis');
});

// --- buildUploadPostForm ---

// Read a FormData instance into a plain { field: [values] } map for assertions.
function formToMap(form) {
  const map = {};
  for (const [k, v] of form.entries()) {
    (map[k] ||= []).push(v);
  }
  return map;
}

test('buildUploadPostForm: sets user, platform[]=x and the repurposed title', () => {
  const map = formToMap(buildUploadPostForm(shortHookPost, 'SellonTube'));
  assert.deepStrictEqual(map.user, ['SellonTube']);
  assert.deepStrictEqual(map['platform[]'], ['x']);
  assert.deepStrictEqual(map.title, [buildXText(shortHookPost)]);
});

test('buildUploadPostForm: title is the X text, not the LinkedIn body', () => {
  const map = formToMap(buildUploadPostForm(shortHookPost, 'SellonTube'));
  assert.notStrictEqual(map.title[0], shortHookPost.linkedinPost);
});

test('buildUploadPostForm: scheduled post carries scheduled_date (13:30 UTC) and timezone', () => {
  const map = formToMap(buildUploadPostForm(shortHookPost, 'SellonTube'));
  assert.deepStrictEqual(map.scheduled_date, ['2026-07-20T13:30:00Z']);
  assert.deepStrictEqual(map.timezone, ['UTC']);
});

test('buildUploadPostForm: publishNow post omits scheduled_date', () => {
  const map = formToMap(buildUploadPostForm({ ...shortHookPost, publishNow: true }, 'SellonTube'));
  assert.strictEqual(map.scheduled_date, undefined);
});

// --- summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
