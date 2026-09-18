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
