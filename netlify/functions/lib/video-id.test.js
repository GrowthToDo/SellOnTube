// Run: npm run test:functions
//
// Plain ESM JS so this runs on every Node in the CI matrix without type stripping.

import test from 'node:test';
import assert from 'node:assert/strict';
import { extractVideoId, getNonVideoYouTubeError, isValidVideoId } from './video-id.js';

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
