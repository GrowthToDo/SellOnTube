// Pure text parsers for YouTube description metadata. No I/O, no imports, no side effects.
//
// Plain ESM JavaScript so `node --test` runs it on every Node in the CI matrix (see video-id.js for
// the full reasoning). Everything here is deterministic and cheap to test, which is the point: these
// are the functions that silently returned wrong answers before they had a test.

// ---------------------------------------------------------------------------------------------
// YouTube's own limits, recorded 2026-09-18. Observed/published values, NOT read from a Google API,
// so they can drift. Anything derived from them is labelled "about" in the UI.
//
// ABOVE_FOLD_CHARS is the single source of truth for the fold, shared by both functions and the
// page. It is 150 to match what generate-description.ts and /tools/youtube-description-generator
// already publish. Two pages answering the same question with different numbers, both inside
// FAQPage schema, is exactly what AI grounding penalises.
// ---------------------------------------------------------------------------------------------
export const ABOVE_FOLD_CHARS = 150;
export const DESCRIPTION_LIMIT = 5000;
export const TAG_BUDGET = 500;
export const TITLE_LIMIT = 100;

/** YouTube's three rules for turning timestamps into clickable chapters. */
export const CHAPTER_RULES = { FIRST_START: 0, MIN_COUNT: 3, MIN_SECONDS: 10 };
const MAX_CHAPTER_REASONS = 5;

/**
 * Strip C0/C1 controls, bidi overrides AND bidi marks, keeping \n and \t.
 *
 * A description is attacker-controlled text. U+202E reverses rendering direction and U+200E/U+200F
 * reorder adjacent runs, either of which can make a link read as a different domain in our own UI.
 * U+200B is a zero-width space, which hides text from a reader but not from a copy button.
 * @param {string} s
 * @returns {string}
 */
export function stripUnsafeChars(s) {
  // eslint-disable-next-line no-control-regex
  return String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
}

/**
 * Normalise line endings before ANY line-based parsing.
 *
 * Not cosmetic. `.` and `$` do not cross `\r` in JS, so a CRLF description made every chapter line
 * fail to match and the tool reported "no timestamps found" for a video with valid chapters.
 * Silent, and indistinguishable from a genuinely chapter-less video.
 * @param {string} s
 * @returns {string}
 */
export function normaliseNewlines(s) {
  return String(s ?? '').replace(/\r\n?/g, '\n');
}

/**
 * Seconds to "m:ss" or "h:mm:ss".
 * @param {number} total
 * @returns {string}
 */
export function formatSeconds(total) {
  const s = Math.max(0, Math.floor(Number(total) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return h > 0 ? `${h}:${mm}:${String(sec).padStart(2, '0')}` : `${mm}:${String(sec).padStart(2, '0')}`;
}

/**
 * "m:ss" or "h:mm:ss" to seconds.
 * @param {string} raw
 * @returns {number | null}
 */
export function parseTimestamp(raw) {
  const parts = String(raw ?? '').split(':').map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

/**
 * @typedef {{ raw: string, seconds: number, label: string }} Chapter
 */

/**
 * Chapter lines are lines that BEGIN with a timestamp. A mid-sentence "3:15" is not a chapter.
 * @param {string} description
 * @returns {Chapter[]}
 */
export function extractTimestamps(description) {
  /** @type {Chapter[]} */
  const out = [];
  for (const line of normaliseNewlines(description).split('\n')) {
    // The separator after the timestamp is optional. "0:00 Intro", "0:00 - Intro", "0:00 \u2013 Intro",
    // "0:00 \u2014 Intro" and "0:00) Intro" all occur in the wild. Dashes are escapes so this file
    // stays ASCII.
    const m = line.match(/^\s*((?:\d{1,2}:)?\d{1,2}:\d{2})\s*[-)\]\u2013\u2014]?\s*(.*)$/);
    if (!m) continue;
    const seconds = parseTimestamp(m[1]);
    if (seconds === null) continue;
    out.push({ raw: m[1], seconds, label: m[2].trim().slice(0, 120) });
  }
  return out;
}

/**
 * Every rule that fails, not just the first. Reporting one problem per run makes the user fix,
 * re-run, discover a second problem, and re-run again.
 * @param {Chapter[]} chapters
 * @param {number | null} [videoSeconds]
 * @returns {{ valid: boolean, reasons: string[] }}
 */
export function checkChapters(chapters, videoSeconds) {
  /** @type {string[]} */
  const reasons = [];
  if (!Array.isArray(chapters) || chapters.length === 0)
    return { valid: false, reasons: ['No timestamps found in the description.'] };

  if (chapters.length < CHAPTER_RULES.MIN_COUNT)
    reasons.push(`YouTube needs at least ${CHAPTER_RULES.MIN_COUNT} chapters. This description has ${chapters.length}.`);
  if (chapters[0].seconds !== CHAPTER_RULES.FIRST_START)
    reasons.push(`The first chapter must start at 0:00. This one starts at ${chapters[0].raw}.`);

  for (let i = 1; i < chapters.length; i++) {
    if (chapters[i].seconds <= chapters[i - 1].seconds) {
      reasons.push(`Timestamps must increase. ${chapters[i].raw} does not come after ${chapters[i - 1].raw}.`);
    } else if (chapters[i].seconds - chapters[i - 1].seconds < CHAPTER_RULES.MIN_SECONDS) {
      reasons.push(`Every chapter must run at least ${CHAPTER_RULES.MIN_SECONDS} seconds. ${chapters[i - 1].raw} to ${chapters[i].raw} is shorter.`);
    }
  }

  const last = chapters[chapters.length - 1];
  if (typeof videoSeconds === 'number' && videoSeconds > 0) {
    if (last.seconds >= videoSeconds) {
      reasons.push(`The last chapter starts at ${last.raw}, which is at or past the end of the video.`);
    } else if (videoSeconds - last.seconds < CHAPTER_RULES.MIN_SECONDS) {
      reasons.push(`The last chapter runs less than ${CHAPTER_RULES.MIN_SECONDS} seconds to the end of the video.`);
    }
  }

  const unlabelled = chapters.filter((c) => !c.label).length;
  if (unlabelled > 0) reasons.push(`${unlabelled} timestamp${unlabelled === 1 ? ' has' : 's have'} no label.`);

  return { valid: reasons.length === 0, reasons: reasons.slice(0, MAX_CHAPTER_REASONS) };
}

/**
 * @typedef {{ url: string, domain: string, charIndex: number, aboveFold: boolean, hasUtm: boolean }} DescLink
 */

/**
 * Trailing punctuation is stripped, but a closing paren is only stripped when the URL contains no
 * opening paren. Otherwise `https://en.wikipedia.org/wiki/Foo_(bar)` came back truncated next to a
 * Copy button, which is worse than not reporting it at all.
 * @param {string} description
 * @returns {DescLink[]}
 */
export function extractLinks(description) {
  /** @type {DescLink[]} */
  const out = [];
  const text = String(description ?? '');
  const re = /https?:\/\/[^\s<>"'`\]]+/g;
  let m;
  let scanned = 0;
  while ((m = re.exec(text)) !== null) {
    if (++scanned > 500) break; // bound the scan itself, not just the kept results
    let url = m[0].replace(/[.,;:!?]+$/, '');
    if (url.endsWith(')') && !url.includes('(')) url = url.slice(0, -1);
    let domain = '';
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      continue; // not a parseable URL, do not report it
    }
    out.push({
      url: url.slice(0, 500),
      domain,
      charIndex: m.index,
      aboveFold: m.index < ABOVE_FOLD_CHARS,
      hasUtm: /[?&]utm_/i.test(url),
    });
    if (out.length >= 100) break;
  }
  return out;
}

/**
 * Deduplicate BEFORE applying the cap. Capping raw matches first meant a description repeating one
 * hashtag 50 times returned exactly one hashtag and dropped every distinct one after it.
 * @param {string} description
 * @param {RegExp} re a /g regex whose first capture group is the value
 * @param {number} [cap]
 * @returns {string[]}
 */
export function matchAll(description, re, cap = 50) {
  re.lastIndex = 0; // a /g regex carries state; never trust an incoming one to be clean
  const text = String(description ?? '');
  const seen = new Set();
  let m;
  let scanned = 0;
  while ((m = re.exec(text)) !== null) {
    seen.add(m[1]);
    if (seen.size >= cap) break;
    if (++scanned > 1000) break;
  }
  return [...seen];
}

/**
 * Seconds from an ISO 8601 duration, or null when the string cannot be parsed.
 *
 * null and 0 are deliberately different answers. "P0D" is a real zero: YouTube returns it for live
 * and upcoming broadcasts. Anything unparseable returns null so a caller can tell "this video has no
 * duration" apart from "we could not read the duration", instead of rendering both as 0:00.
 *
 * Only the shapes the Data API actually emits are accepted. The `T` is required before a time
 * component, so "P1M" (one month) is rejected rather than silently read as one minute.
 * @param {string} iso
 * @returns {number | null}
 */
export function parseIsoDuration(iso) {
  if (!iso || typeof iso !== 'string') return null;
  const m = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return null;
  const [, d, h, min, sec] = m;
  if (d === undefined && h === undefined && min === undefined && sec === undefined) return null;
  const total = Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(min ?? 0) * 60 + Number(sec ?? 0);
  return Number.isSafeInteger(total) ? total : null;
}

/**
 * Enforce "quote it verbatim" in code rather than trusting a model instruction.
 *
 * A model that complies with an injected instruction will happily return a quote that is not in the
 * description at all. Whitespace is normalised on both sides because models re-wrap lines. A quote
 * that is not actually present is dropped.
 *
 * Note the limit: this stops a FABRICATED quote. It cannot stop an attacker who writes the text
 * they want quoted into their own description, because then it genuinely is a substring.
 * @param {string | null} quote
 * @param {string} description
 * @returns {string | null}
 */
export function verifiedQuote(quote, description) {
  if (!quote) return null;
  const norm = (v) => String(v ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  const q = norm(quote);
  if (!q) return null;
  return norm(description).includes(q) ? quote : null;
}
