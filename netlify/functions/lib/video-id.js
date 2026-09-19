// YouTube URL -> video ID, and the "you pasted the wrong kind of YouTube link" messages.
//
// Plain ESM JavaScript, not TypeScript, on purpose. package.json sets "type": "module", so this file
// is ESM as-is and `node --test` can import it on every Node version in the CI matrix. A .ts module
// here would need type stripping, which Node 18 and 20 do not have, and the test would run nowhere.
// The importing .ts files use the same './lib/video-id.js' specifier either way.
//
// Provenance: `extractVideoId` is the body that already ships in get-transcript.ts,
// youtube-seo-tool.ts, generate-tags.ts and generate-description.ts, which are byte-identical to each
// other. Those four are NOT migrated yet: a regression in a shared parser would hit four live tools
// at once, so consolidation is a separate PR gated on `npm run test:functions` plus a green
// `node scripts/health-check-tools.mjs`. New code should import from here.

/**
 * Extract an 11-character YouTube video ID from any common URL shape, or from a bare ID.
 * @param {string} input
 * @returns {string | null} null when the input is not a single-video reference.
 */
export function extractVideoId(input) {
  const trimmed = String(input ?? '').trim();

  // Direct video ID (11 chars, alphanumeric + hyphens/underscores)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  // youtube.com/watch?v=ID
  const longMatch = trimmed.match(/[?&]v=([\w-]{11})/);
  if (longMatch) return longMatch[1];

  // youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/ID or youtube.com/v/ID
  const embedMatch = trimmed.match(/youtube\.com\/(?:embed|v)\/([\w-]{11})/);
  if (embedMatch) return embedMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // youtube.com/live/ID - the canonical URL for a premiere or an ended livestream, which is most of
  // what a B2B channel publishes. Added 2026-09-18; it used to fall through to null.
  const liveMatch = trimmed.match(/youtube\.com\/live\/([\w-]{11})/);
  if (liveMatch) return liveMatch[1];

  // A clip URL carries its own clip ID, never the source video's, so there is nothing to extract.
  // getNonVideoYouTubeError explains that to the user instead.
  return null;
}

/**
 * When extractVideoId returns null, this explains WHY in the user's own terms.
 * "Could not extract a video ID" is true but useless; "that is a channel URL" is something to act on.
 * @param {string} url
 * @returns {string | null} null when the input is not a recognisable non-video YouTube URL either.
 */
export function getNonVideoYouTubeError(url) {
  // Trim first. The homepage test below is anchored, so a pasted URL with surrounding whitespace
  // would otherwise skip its specific message and fall back to the generic one.
  const trimmed = String(url ?? '').trim();

  if (/youtube\.com\/clip\//i.test(trimmed))
    return 'That is a clip URL, which does not contain the original video ID. Open the clip, click the video title, and paste that URL instead.';
  if (/youtube\.com\/([@]|channel\/|c\/|user\/)/i.test(trimmed))
    return 'That looks like a YouTube channel URL. Paste a link to a specific video instead.';
  if (/youtube\.com\/playlist\?|[?&]list=/i.test(trimmed))
    return 'That looks like a playlist URL. Paste a link to a specific video from the playlist instead.';
  if (/^https?:\/\/(www\.)?youtube\.com\/?(\?.*)?$/i.test(trimmed))
    return 'That looks like the YouTube homepage. Paste a link to a specific video instead.';
  return null;
}

/**
 * Strict gate before building any URL from a video ID. Never interpolate an unvalidated ID.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidVideoId(id) {
  return /^[\w-]{11}$/.test(String(id ?? ''));
}

/**
 * Read an existing start time out of a pasted YouTube URL, in seconds.
 *
 * YouTube writes this parameter four ways and accepts all of them: `t=90`, `t=90s`, `t=1m30s`
 * (its own "copy link at current time" output on long videos) and `start=90` on an embed. The
 * hash form `#t=90` is the old share format and still appears in documents written years ago.
 *
 * Bare digits mean seconds. A unit string may carry any of h/m/s in that order, so "1h2m3s" is
 * 3723. Anything else returns null rather than a wrong number: a silent 0 would send the viewer
 * to the start of the video and look like the tool working.
 * @param {string} url
 * @returns {number | null} whole seconds, or null when the URL carries no readable start time.
 */
export function parseStartParam(url) {
  const raw = String(url ?? '').trim();
  const m = raw.match(/[?&#](?:t|start)=([^&#\s]+)/i);
  if (!m) return null;

  const value = decodeURIComponent(m[1]).toLowerCase();
  if (/^\d+$/.test(value)) return Number(value);

  // Units, h then m then s, each optional but at least one present and in that order.
  const units = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!units || (units[1] === undefined && units[2] === undefined && units[3] === undefined)) return null;
  const total = Number(units[1] ?? 0) * 3600 + Number(units[2] ?? 0) * 60 + Number(units[3] ?? 0);
  return Number.isSafeInteger(total) ? total : null;
}

/**
 * The three shareable deep links for one moment in a video.
 *
 * `watch` is what YouTube's own "copy link at current time" produces, so it is the one a person
 * recognises. `short` is the youtu.be share form. `embed` is the one a B2B team actually needs:
 * it starts an embedded webinar at the section being discussed on the page hosting it.
 *
 * The ID is validated before interpolation, never after.
 * @param {string} videoId
 * @param {number} seconds
 * @returns {{ watch: string, short: string, embed: string } | null} null for an invalid ID.
 */
export function buildChapterLinks(videoId, seconds) {
  if (!isValidVideoId(videoId)) return null;
  const t = Math.max(0, Math.floor(Number(seconds) || 0));
  return {
    watch: `https://www.youtube.com/watch?v=${videoId}&t=${t}s`,
    short: `https://youtu.be/${videoId}?t=${t}`,
    embed: `https://www.youtube.com/embed/${videoId}?start=${t}`,
  };
}
