// Run: npm run test:functions
//
// Plain ESM JS so this runs on every Node in the CI matrix without type stripping.
// Every case here is a bug that shipped once, or the boundary next to one.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ABOVE_FOLD_CHARS,
  CHAPTER_RULES,
  checkChapters,
  extractLinks,
  extractTimestamps,
  formatChapterBlock,
  formatSeconds,
  matchAll,
  MAX_CHAPTERS,
  normaliseChapters,
  normaliseNewlines,
  parseIsoDuration,
  parseTimestamp,
  stripUnsafeChars,
  verifiedQuote,
} from './parsers.js';

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);

test('the fold constant is 150, matching the rest of the site', () => {
  // A different number here than in generate-description.ts puts two conflicting answers to the
  // same question into FAQPage schema on one domain.
  assert.equal(ABOVE_FOLD_CHARS, 150);
});

// ---------------------------------------------------------------------------------------------
// CRLF. This is the bug: `.` and `$` do not cross `\r`, so every chapter line failed to match and
// the tool reported "no timestamps found" for a video with perfectly valid chapters.
// ---------------------------------------------------------------------------------------------

test('extractTimestamps survives CRLF line endings', () => {
  const crlf = `0:00 Intro${CR}${LF}1:23 Middle${CR}${LF}2:45 End${CR}${LF}`;
  const lf = `0:00 Intro${LF}1:23 Middle${LF}2:45 End${LF}`;
  assert.equal(extractTimestamps(crlf).length, 3, 'CRLF must yield the same chapters as LF');
  assert.deepEqual(extractTimestamps(crlf), extractTimestamps(lf));
  assert.equal(extractTimestamps(crlf)[0].label, 'Intro', 'label must not keep a trailing CR');
});

test('extractTimestamps survives lone CR line endings', () => {
  assert.equal(extractTimestamps(`0:00 A${CR}0:15 B${CR}0:30 C`).length, 3);
});

test('normaliseNewlines collapses both forms', () => {
  assert.equal(normaliseNewlines(`a${CR}${LF}b${CR}c${LF}d`), 'a\nb\nc\nd');
});

test('extractTimestamps reads every separator style and both clock formats', () => {
  const d = ['0:00 Intro', '0:15 - Dash', '0:30 \u2013 EnDash', '0:45 \u2014 EmDash', '1:02:03 Hours'].join('\n');
  const got = extractTimestamps(d);
  assert.deepEqual(got.map((c) => c.label), ['Intro', 'Dash', 'EnDash', 'EmDash', 'Hours']);
  assert.equal(got[4].seconds, 3723);
});

test('a timestamp mid-sentence is not a chapter', () => {
  assert.equal(extractTimestamps('go to 3:15 for the good bit').length, 0);
});

test('parseTimestamp rejects nonsense', () => {
  assert.equal(parseTimestamp('1:23'), 83);
  assert.equal(parseTimestamp('1:02:03'), 3723);
  assert.equal(parseTimestamp('nope'), null);
  assert.equal(parseTimestamp('1:2:3:4'), null);
});

// ---------------------------------------------------------------------------------------------
// checkChapters: report every failure, not just the first.
// ---------------------------------------------------------------------------------------------

test('checkChapters reports all violations, not only the first', () => {
  const chapters = [
    { raw: '0:00', seconds: 0, label: 'A' },
    { raw: '0:05', seconds: 5, label: 'B' }, // gap under 10s
    { raw: '0:03', seconds: 3, label: 'C' }, // out of order
  ];
  const { valid, reasons } = checkChapters(chapters);
  assert.equal(valid, false);
  assert.ok(reasons.some((r) => r.includes('at least 10 seconds')), 'short gap reported');
  assert.ok(reasons.some((r) => r.includes('must increase')), 'ordering reported too');
});

test('checkChapters accepts a valid list', () => {
  const chapters = [
    { raw: '0:00', seconds: 0, label: 'Intro' },
    { raw: '0:30', seconds: 30, label: 'Middle' },
    { raw: '1:00', seconds: 60, label: 'End' },
  ];
  assert.deepEqual(checkChapters(chapters, 600), { valid: true, reasons: [] });
});

test('checkChapters flags a first chapter that is not 0:00, and a list that is too short', () => {
  const { valid, reasons } = checkChapters([
    { raw: '0:05', seconds: 5, label: 'A' },
    { raw: '0:20', seconds: 20, label: 'B' },
  ]);
  assert.equal(valid, false);
  assert.ok(reasons.some((r) => r.includes('0:00')));
  assert.ok(reasons.some((r) => r.includes(`at least ${CHAPTER_RULES.MIN_COUNT}`)));
});

test('checkChapters uses the video duration for the final chapter', () => {
  const chapters = [
    { raw: '0:00', seconds: 0, label: 'A' },
    { raw: '0:30', seconds: 30, label: 'B' },
    { raw: '9:59', seconds: 599, label: 'C' },
  ];
  assert.ok(checkChapters(chapters, 180).reasons.some((r) => r.includes('past the end')));
  assert.ok(checkChapters(chapters, 605).reasons.some((r) => r.includes('to the end of the video')));
  assert.equal(checkChapters(chapters, 700).valid, true);
  assert.equal(checkChapters(chapters, null).valid, true, 'unknown duration must not fail the list');
});

test('checkChapters reports an empty list without throwing', () => {
  assert.equal(checkChapters([]).valid, false);
  assert.equal(checkChapters(undefined).valid, false);
});

// ---------------------------------------------------------------------------------------------
// matchAll: dedupe before the cap, and never trust an incoming /g regex's lastIndex.
// ---------------------------------------------------------------------------------------------

test('matchAll dedupes before applying the cap', () => {
  // Capping raw matches first returned ["#x"] and silently dropped every distinct tag after it.
  assert.deepEqual(matchAll('#x #x #x #x #y', /(?:^|\s)(#[^\s#]{1,60})/g, 4), ['#x', '#y']);
});

test('matchAll is safe when the same /g regex object is reused', () => {
  // The call sites are now module-level constants, which is exactly the refactor that used to
  // corrupt results: a dirty lastIndex made the second call start partway through the input.
  const RE = /(?:^|\s)(#[^\s#]{1,60})/g;
  const first = matchAll('#a #b #c #d', RE, 2);
  const second = matchAll('#a #b #c #d', RE, 2);
  assert.deepEqual(first, second, 'a reused regex must not carry state between calls');
});

test('matchAll respects the cap', () => {
  assert.equal(matchAll('#a #b #c #d #e', /(?:^|\s)(#[^\s#]{1,60})/g, 3).length, 3);
});

// ---------------------------------------------------------------------------------------------
// extractLinks
// ---------------------------------------------------------------------------------------------

test('extractLinks keeps a balanced paren but strips a dangling one', () => {
  assert.equal(
    extractLinks('see https://en.wikipedia.org/wiki/Foo_(bar) now')[0].url,
    'https://en.wikipedia.org/wiki/Foo_(bar)'
  );
  assert.equal(
    extractLinks('[docs](https://example.com/a)')[0].url,
    'https://example.com/a'
  );
});

test('extractLinks strips trailing sentence punctuation', () => {
  assert.equal(extractLinks('go to https://example.com/a.')[0].url, 'https://example.com/a');
});

test('extractLinks marks the fold correctly at the 150-character boundary', () => {
  const pad = 'x'.repeat(ABOVE_FOLD_CHARS - 1);
  assert.equal(extractLinks(`${pad} https://example.com/`)[0].aboveFold, false);
  assert.equal(extractLinks(`https://example.com/ ${pad}`)[0].aboveFold, true);
});

test('extractLinks detects utm parameters and normalises the domain', () => {
  const [link] = extractLinks('https://www.example.com/a?utm_source=youtube');
  assert.equal(link.domain, 'example.com');
  assert.equal(link.hasUtm, true);
});

test('extractLinks ignores unparseable tokens', () => {
  assert.deepEqual(extractLinks('http:// and https://'), []);
});

// ---------------------------------------------------------------------------------------------
// stripUnsafeChars
// ---------------------------------------------------------------------------------------------

test('stripUnsafeChars removes controls and bidi, keeps newline and tab', () => {
  const keep = `a${LF}b\tc`;
  assert.equal(stripUnsafeChars(keep), keep);
  for (const cp of [0x0000, 0x0008, 0x000b, 0x001b, 0x007f, 0x009f, 0x200b, 0x200e, 0x200f, 0x202e, 0x2066, 0x2069]) {
    assert.equal(
      stripUnsafeChars(`a${String.fromCharCode(cp)}b`),
      'ab',
      `U+${cp.toString(16).toUpperCase().padStart(4, '0')} must be stripped`
    );
  }
});

test('stripUnsafeChars leaves ordinary text and emoji alone', () => {
  assert.equal(stripUnsafeChars('Hello, world! \u{1F600}'), 'Hello, world! \u{1F600}');
});

// ---------------------------------------------------------------------------------------------
// parseIsoDuration and formatSeconds
// ---------------------------------------------------------------------------------------------

test('parseIsoDuration reads the shapes YouTube emits', () => {
  assert.equal(parseIsoDuration('PT3M33S'), 213);
  assert.equal(parseIsoDuration('PT1H'), 3600);
  assert.equal(parseIsoDuration('P1DT2H'), 93600);
  assert.equal(parseIsoDuration('P0D'), 0, 'a live broadcast is a genuine zero');
});

test('parseIsoDuration returns null for anything it cannot read', () => {
  // null and 0 must stay distinguishable: 0 renders as 0:00, null renders as blank.
  for (const bad of ['P1M', 'P1D2H', 'PT1.5S', 'P1Y', 'P1W', 'pt1h', '', 'nonsense', 'P', 'PT']) {
    assert.equal(parseIsoDuration(bad), null, `${bad} must be null, not 0`);
  }
  assert.equal(parseIsoDuration('P99999999999999999999D'), null, 'must not exceed a safe integer');
});

test('formatSeconds switches to h:mm:ss past an hour', () => {
  assert.equal(formatSeconds(0), '0:00');
  assert.equal(formatSeconds(213), '3:33');
  assert.equal(formatSeconds(3723), '1:02:03');
});

// ---------------------------------------------------------------------------------------------
// verifiedQuote: the defence that stops a prompt-injected model publishing an invented quote.
// ---------------------------------------------------------------------------------------------

test('verifiedQuote rejects a quote that is not in the description', () => {
  assert.equal(verifiedQuote('Subscribe to the acme newsletter', 'Buy my course! Link below.'), null);
});

test('verifiedQuote keeps a quote that is genuinely present', () => {
  assert.equal(verifiedQuote('Buy my course!', 'Buy my course! Link below.'), 'Buy my course!');
});

test('verifiedQuote tolerates re-wrapped whitespace and case', () => {
  assert.equal(verifiedQuote('buy   my' + LF + 'course!', 'Buy my course! Link below.'), 'buy   my' + LF + 'course!');
});

test('verifiedQuote handles empty and null input', () => {
  assert.equal(verifiedQuote(null, 'anything'), null);
  assert.equal(verifiedQuote('', 'anything'), null);
  assert.equal(verifiedQuote('   ', 'anything'), null);
});

// ---------------------------------------------------------------------------------------------
// normaliseChapters: shaping model output into something YouTube can accept.
// Every case here is a shape a language model actually returns.
// ---------------------------------------------------------------------------------------------

test('normaliseChapters sorts, forces the first start to 0 and keeps labels', () => {
  const out = normaliseChapters([
    { seconds: 120, label: 'Pricing' },
    { seconds: 30, label: 'Intro' },
    { seconds: 240, label: 'Close' },
  ]);
  assert.deepEqual(
    out.map((c) => [c.seconds, c.label]),
    [
      [0, 'Intro'],
      [120, 'Pricing'],
      [240, 'Close'],
    ]
  );
  assert.equal(out[0].raw, '0:00', 'raw is the display string the UI shows');
});

test('normaliseChapters drops a timestamp past the end of the video', () => {
  // A hallucinated 9:59:59 on a 3-minute video renders as a plausible chapter YouTube then refuses.
  const out = normaliseChapters(
    [
      { seconds: 0, label: 'Intro' },
      { seconds: 60, label: 'Middle' },
      { seconds: 35999, label: 'Invented' },
    ],
    { endSeconds: 180 }
  );
  assert.deepEqual(out.map((c) => c.seconds), [0, 60]);
});

test('normaliseChapters clamps against the end before forcing the first to 0', () => {
  // Order matters: force-then-clamp would collapse an all-past-the-end list into one bogus 0:00.
  const out = normaliseChapters([{ seconds: 900, label: 'Past the end' }], { endSeconds: 120 });
  assert.deepEqual(out, []);
});

test('normaliseChapters drops duplicates and anything inside the minimum gap', () => {
  const out = normaliseChapters([
    { seconds: 0, label: 'Intro' },
    { seconds: 0, label: 'Intro again' },
    { seconds: 5, label: 'Too close' },
    { seconds: 10, label: 'Exactly the minimum' },
  ]);
  assert.deepEqual(
    out.map((c) => [c.seconds, c.label]),
    [
      [0, 'Intro'],
      [10, 'Exactly the minimum'],
    ]
  );
});

test('normaliseChapters caps the list', () => {
  const many = Array.from({ length: 50 }, (_, i) => ({ seconds: i * 60, label: `Part ${i}` }));
  assert.equal(normaliseChapters(many).length, MAX_CHAPTERS);
});

test('normaliseChapters survives every wrong type a model returns', () => {
  const out = normaliseChapters([
    { seconds: '0', label: 'String seconds' },
    { seconds: -30, label: 'Negative' },
    { seconds: 'soon', label: 'Words' },
    { seconds: 90.7, label: 'Fractional' },
    { seconds: 200 },
    null,
  ]);
  assert.deepEqual(
    out.map((c) => [c.seconds, c.label]),
    [
      [0, 'String seconds'],
      [90, 'Fractional'],
      [200, ''],
    ]
  );
  assert.deepEqual(normaliseChapters(null), [], 'a non-array is an empty list, never a throw');
  assert.deepEqual(normaliseChapters(undefined), []);
});

test('normaliseChapters strips control characters out of a label', () => {
  const bidi = String.fromCharCode(0x202e);
  const out = normaliseChapters([{ seconds: 0, label: `Pricing${bidi} section` }]);
  assert.equal(out[0].label, 'Pricing section');
});

test('normaliseChapters output passes the checker that the browser runs', () => {
  // The server shapes, the client judges. If these two ever disagree, the page says "invalid"
  // about a list the server just produced.
  const out = normaliseChapters([
    { seconds: 3, label: 'Intro' },
    { seconds: 90, label: 'Problem' },
    { seconds: 200, label: 'Pricing' },
  ]);
  assert.equal(checkChapters(out).valid, true);
});

// ---------------------------------------------------------------------------------------------
// formatChapterBlock: the text a creator pastes into their description.
// ---------------------------------------------------------------------------------------------

test('formatChapterBlock writes one chapter per line, space separated', () => {
  const block = formatChapterBlock([
    { raw: '0:00', seconds: 0, label: 'Intro' },
    { raw: '1:30', seconds: 90, label: 'Pricing' },
    { raw: '1:00:00', seconds: 3600, label: 'Q and A' },
  ]);
  assert.equal(block, '0:00 Intro' + LF + '1:30 Pricing' + LF + '1:00:00 Q and A');
});

test('formatChapterBlock offers the dash style channels already use', () => {
  const block = formatChapterBlock([{ raw: '0:00', seconds: 0, label: 'Intro' }], { separator: '-' });
  assert.equal(block, '0:00 - Intro');
});

test('formatChapterBlock leaves no trailing separator on an unlabelled chapter', () => {
  assert.equal(formatChapterBlock([{ raw: '0:00', seconds: 0, label: '' }]), '0:00');
  assert.equal(formatChapterBlock([]), '');
});

test('formatChapterBlock round-trips through extractTimestamps', () => {
  // The block this writes is pasted into a description, which the extractor then reads back.
  const chapters = normaliseChapters([
    { seconds: 0, label: 'Intro' },
    { seconds: 95, label: 'The problem' },
    { seconds: 240, label: 'Pricing' },
  ]);
  const read = extractTimestamps(formatChapterBlock(chapters));
  assert.deepEqual(
    read.map((c) => [c.seconds, c.label]),
    chapters.map((c) => [c.seconds, c.label])
  );
  assert.equal(checkChapters(read).valid, true);
});
