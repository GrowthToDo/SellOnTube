// Run: npm run test:functions
//
// Plain ESM JS so this runs on every Node in the CI matrix without type stripping.

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChapterLinks, extractVideoId, getNonVideoYouTubeError, isValidVideoId, parseStartParam } from './video-id.js';

const ID = 'dQw4w9WgXcQ';

test('extractVideoId reads every supported URL shape', () => {
  assert.equal(extractVideoId(`https://www.youtube.com/watch?v=${ID}`), ID);
  assert.equal(extractVideoId(`https://youtube.com/watch?v=${ID}&t=42s`), ID);
  assert.equal(extractVideoId(`https://youtu.be/${ID}`), ID);
  assert.equal(extractVideoId(`https://youtu.be/${ID}?t=42`), ID);
  assert.equal(extractVideoId(`https://www.youtube.com/embed/${ID}`), ID);
  assert.equal(extractVideoId(`https://www.youtube.com/v/${ID}`), ID);
  assert.equal(extractVideoId(`https://www.youtube.com/shorts/${ID}`), ID);
  assert.equal(extractVideoId(ID), ID, 'a bare 11-char ID is valid input');
  assert.equal(extractVideoId(`  ${ID}  `), ID, 'input is trimmed');
});

test('extractVideoId reads a /live/ URL', () => {
  // The canonical URL for a premiere or an ended livestream, which is most of what a B2B channel
  // publishes. This returned null until 2026-09-18, with no specific error to explain it.
  assert.equal(extractVideoId(`https://www.youtube.com/live/${ID}`), ID);
  assert.equal(extractVideoId(`https://www.youtube.com/live/${ID}?feature=share`), ID);
});

test('extractVideoId returns null for anything that is not a single video', () => {
  assert.equal(extractVideoId(''), null);
  assert.equal(extractVideoId('not a url at all'), null);
  assert.equal(extractVideoId('https://www.youtube.com/'), null);
  assert.equal(extractVideoId('https://www.youtube.com/@MrBeast'), null);
  assert.equal(extractVideoId('https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA'), null);
  assert.equal(extractVideoId('https://vimeo.com/123456789'), null);
  assert.equal(extractVideoId('x'.repeat(2001)), null, 'an over-long string must not match');
  assert.equal(extractVideoId('short'), null, 'a 5-char token is not an ID');
  assert.equal(extractVideoId('waytoolongtobeanid'), null, 'an 18-char token is not an ID');
  assert.equal(extractVideoId(null), null, 'a non-string must not throw');
  assert.equal(extractVideoId(undefined), null);
});

test('a clip URL yields no video ID, because it does not contain one', () => {
  const clip = 'https://www.youtube.com/clip/UgkxbtkRhJHDaQBSGkbVLaMCyOHUPZ0abcde';
  assert.equal(extractVideoId(clip), null);
  assert.match(getNonVideoYouTubeError(clip) ?? '', /clip/i, 'and it must say why');
});

test('a playlist URL that also carries a video ID still yields the video', () => {
  // Intentional: ?v= wins, because the user is looking at a video inside a playlist.
  assert.equal(extractVideoId(`https://www.youtube.com/watch?v=${ID}&list=PLabc123`), ID);
});

test('getNonVideoYouTubeError explains why, for each non-video shape', () => {
  assert.match(getNonVideoYouTubeError('https://www.youtube.com/@MrBeast') ?? '', /channel/i);
  assert.match(getNonVideoYouTubeError('https://www.youtube.com/channel/UCabc') ?? '', /channel/i);
  assert.match(getNonVideoYouTubeError('https://www.youtube.com/c/Something') ?? '', /channel/i);
  assert.match(getNonVideoYouTubeError('https://www.youtube.com/playlist?list=PLabc') ?? '', /playlist/i);
  assert.match(getNonVideoYouTubeError('https://www.youtube.com/') ?? '', /homepage/i);
  assert.equal(getNonVideoYouTubeError('https://example.com/whatever'), null, 'non-YouTube gets no special message');
});

test('getNonVideoYouTubeError trims before testing the anchored homepage pattern', () => {
  // Untrimmed input used to skip the specific message and fall back to the generic one.
  assert.match(getNonVideoYouTubeError('  https://www.youtube.com/  ') ?? '', /homepage/i);
});

test('isValidVideoId gates URL construction', () => {
  assert.equal(isValidVideoId(ID), true);
  assert.equal(isValidVideoId('../../etc/passwd'), false);
  assert.equal(isValidVideoId(''), false);
  assert.equal(isValidVideoId(`${ID}x`), false);
  assert.equal(isValidVideoId(null), false);
});

// ---------------------------------------------------------------------------------------------
// parseStartParam: reading a start time back out of a link someone pasted.
// ---------------------------------------------------------------------------------------------

test('parseStartParam reads every form YouTube itself writes', () => {
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&t=90s`), 90);
  assert.equal(parseStartParam(`https://youtu.be/${ID}?t=90`), 90);
  assert.equal(parseStartParam(`https://www.youtube.com/embed/${ID}?start=90`), 90);
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&t=1m30s`), 90);
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&t=1h2m3s`), 3723);
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}#t=45`), 45);
});

test('parseStartParam returns null rather than a wrong number', () => {
  // A silent 0 would send the viewer to the start of the video and look like the tool working.
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}`), null, 'no start parameter');
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&t=later`), null, 'unparseable value');
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&t=1:30`), null, 'colons are not a YouTube form');
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&t=30m1h`), null, 'units out of order');
  assert.equal(parseStartParam(''), null);
  assert.equal(parseStartParam(null), null);
});

test('parseStartParam does not mistake another parameter for a start time', () => {
  // `list=` and `feature=` sit next to `t=` constantly; a loose regex reads the wrong one.
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&list=PLabc&t=12`), 12);
  assert.equal(parseStartParam(`https://www.youtube.com/watch?v=${ID}&feature=share`), null);
});

// ---------------------------------------------------------------------------------------------
// buildChapterLinks: the three deep links the tool hands a user.
// ---------------------------------------------------------------------------------------------

test('buildChapterLinks emits all three forms at the right second', () => {
  assert.deepEqual(buildChapterLinks(ID, 90), {
    watch: `https://www.youtube.com/watch?v=${ID}&t=90s`,
    short: `https://youtu.be/${ID}?t=90`,
    embed: `https://www.youtube.com/embed/${ID}?start=90`,
  });
});

test('buildChapterLinks round-trips through parseStartParam', () => {
  // The tool reads links it wrote, so a disagreement between these two is a live bug.
  for (const seconds of [0, 7, 90, 3723]) {
    const links = buildChapterLinks(ID, seconds);
    assert.equal(parseStartParam(links.watch), seconds);
    assert.equal(parseStartParam(links.short), seconds);
    assert.equal(parseStartParam(links.embed), seconds);
  }
});

test('buildChapterLinks refuses an invalid ID instead of interpolating it', () => {
  assert.equal(buildChapterLinks('../../etc/passwd', 10), null);
  assert.equal(buildChapterLinks('', 10), null);
  assert.equal(buildChapterLinks(null, 10), null);
});

test('buildChapterLinks floors and clamps the second', () => {
  assert.equal(buildChapterLinks(ID, -5).short, `https://youtu.be/${ID}?t=0`);
  assert.equal(buildChapterLinks(ID, 12.9).short, `https://youtu.be/${ID}?t=12`);
  assert.equal(buildChapterLinks(ID, NaN).short, `https://youtu.be/${ID}?t=0`);
});
