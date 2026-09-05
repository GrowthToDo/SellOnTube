// Single transcript source for every function that needs captions.
//
// Why this exists: until 2026-09 four places (get-transcript, generate-tags,
// generate-description, the astro.config.ts dev proxy) each called the transcript vendor
// directly and each parsed its response a different way. When the vendor died on 2026-07-08
// the fix had to be found four times, and the shapes had already drifted. Now the vendor URL,
// auth, timeout, response parsing and caching live here and nowhere else. Swapping vendors is
// an edit to `fetchFromVendor` only.
//
// Contract for callers:
//   - Returns a TranscriptResult. It never throws for a vendor *response* (any status).
//   - It DOES let a thrown fetch (DNS/TLS/timeout) propagate, so the caller can classify it
//     with `failureResponse()` from ./upstream-error.js and return 503. Optional consumers
//     (tags/description) wrap the call in try/catch and continue without a transcript.

export interface TranscriptSegment {
  text: string;
  start: number; // seconds
  duration: number; // seconds
}

export interface Transcript {
  videoId: string;
  segments: TranscriptSegment[];
  lang?: string;
  // From YouTube oEmbed, so the page can show what was transcribed instead of a bare ID.
  title?: string;
  channel?: string;
  thumbnail?: string;
}

export type TranscriptResult =
  | { status: 'ok'; transcript: Transcript; cached: boolean }
  | { status: 'unavailable'; reason?: 'not-found' | 'no-captions' | 'no-english' } // no transcript to give
  | { status: 'not-configured' } // no API key in the environment
  | { status: 'quota' } // vendor 429
  | { status: 'upstream-error'; httpStatus: number; detail: string }; // any other non-ok

const VENDOR_TIMEOUT_MS = 12_000;
const CACHE_STORE = 'transcripts-v2'; // v2: entries carry title/channel/thumbnail; v1 entries are ignored
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // captions rarely change after upload

export function transcriptApiKey(): string | undefined {
  return process.env.TRANSCRIPT_API_KEY;
}

/** Plain prose, for prompts that need the content. */
export function toPlainText(segments: TranscriptSegment[]): string {
  return segments.map((s) => s.text).join(' ').replace(/\s+/g, ' ').trim();
}

/** "[m:ss] text" lines, for prompts that need to place chapters. */
export function toTimestampedText(segments: TranscriptSegment[]): string {
  return segments
    .map((s) => {
      const mins = Math.floor(s.start / 60);
      const secs = Math.floor(s.start % 60);
      return `[${mins}:${String(secs).padStart(2, '0')}] ${s.text}`;
    })
    .join('\n');
}

// ---------------------------------------------------------------------------------------------
// Vendor call. THIS is the only function to touch when the transcript source changes.
// Current vendor: Supadata (docs.supadata.ai), adopted 2026-09-05 after DataFetch died on
// 2026-07-08. Free tier 100 requests/month; the cache below keeps repeat videos at zero cost.
//
// Supadata contract:  GET /v1/youtube/transcript?videoId=&lang=   header x-api-key
//   200 { lang, availableLangs, content: [{ text, offset(ms), duration(ms), lang }] }
//   206 no transcript for this video     404 video does not exist     429 quota
// We ask for English first (the site's audience) and fall back to whatever language the
// video has, since a transcript in the creator's language beats none.
// ---------------------------------------------------------------------------------------------
const VENDOR_URL = 'https://api.supadata.ai/v1/youtube/transcript';

async function fetchFromVendor(videoId: string, apiKey: string): Promise<TranscriptResult> {
  // Supadata takes 9-18s to report a video that does not exist or is private (it goes and
  // asks YouTube), which is longer than Netlify's synchronous function limit. YouTube's own
  // oEmbed endpoint answers the same question in under a second, so ask it first. It also
  // saves a vendor credit on every typo.
  const video = await lookupVideo(videoId);
  if (video.exists === false) return { status: 'unavailable', reason: 'not-found' };

  let result = await callSupadata(videoId, apiKey, 'en');
  // Retry without a language only when English specifically was missing (206). A 404 from the
  // vendor means the video itself is gone; retrying would just spend another 10 seconds.
  if (result.status === 'unavailable' && result.reason === 'no-english') {
    result = await callSupadata(videoId, apiKey, undefined);
  }
  if (result.status === 'ok') {
    result.transcript.title = video.title;
    result.transcript.channel = video.channel;
    result.transcript.thumbnail = video.thumbnail;
  }
  return result;
}

interface VideoLookup {
  /** true = public video exists, false = missing/private, null = could not tell (proceed). */
  exists: boolean | null;
  title?: string;
  channel?: string;
  thumbnail?: string;
}

/** YouTube oEmbed: free, no key, sub-second. Existence check plus title/channel/thumbnail. */
async function lookupVideo(videoId: string): Promise<VideoLookup> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const o = (await res.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
      return { exists: true, title: o.title, channel: o.author_name, thumbnail: o.thumbnail_url };
    }
    await res.text().catch(() => '');
    // oEmbed answers 400 for an ID YouTube does not know and 404 for a removed video.
    if (res.status === 400 || res.status === 404) return { exists: false };
    // 401/403 also cover public videos with embedding disabled, which may well have captions.
    // Not conclusive, so let the vendor decide.
    return { exists: null };
  } catch {
    return { exists: null };
  }
}

async function callSupadata(videoId: string, apiKey: string, lang: string | undefined): Promise<TranscriptResult> {
  const params = new URLSearchParams({ videoId });
  if (lang) params.set('lang', lang);

  const res = await fetch(`${VENDOR_URL}?${params}`, {
    method: 'GET',
    headers: { 'x-api-key': apiKey },
    signal: AbortSignal.timeout(VENDOR_TIMEOUT_MS),
  });

  if (!res.ok || res.status === 206) {
    // Always read the body, even when we ignore it. An unconsumed body keeps the keep-alive
    // socket busy, and the follow-up request (the language fallback) then hangs until timeout.
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    if (res.status === 429) return { status: 'quota' };
    if (res.status === 206) return { status: 'unavailable', reason: lang ? 'no-english' : 'no-captions' };
    if (res.status === 404) return { status: 'unavailable', reason: 'not-found' };
    console.error('Transcript vendor error:', res.status, detail);
    return { status: 'upstream-error', httpStatus: res.status, detail };
  }

  const body = (await res.json()) as {
    lang?: string;
    content?: unknown;
  };
  const segments = normaliseSupadata(body.content);
  if (segments.length === 0) return { status: 'unavailable' };
  return { status: 'ok', transcript: { videoId, segments, lang: body.lang }, cached: false };
}

function normaliseSupadata(content: unknown): TranscriptSegment[] {
  if (!Array.isArray(content)) return [];
  return content
    .map((seg) => {
      const s = seg as { text?: unknown; offset?: unknown; duration?: unknown };
      const text = typeof s.text === 'string' ? s.text.trim() : '';
      const start = Number(s.offset ?? 0) / 1000;
      const duration = Number(s.duration ?? 0) / 1000;
      return { text, start: isFinite(start) ? start : 0, duration: isFinite(duration) ? duration : 0 };
    })
    .filter((s) => s.text.length > 0);
}

// ---------------------------------------------------------------------------------------------
// Cache. Netlify Blobs is only available inside a deployed function; in `astro dev` or a plain
// Node script `getStore` throws, so every cache operation is best-effort and never fatal.
// ---------------------------------------------------------------------------------------------
interface CacheEntry {
  fetchedAt: number;
  transcript: Transcript;
}

async function cacheRead(videoId: string): Promise<Transcript | null> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const raw = await getStore(CACHE_STORE).get(videoId);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
    return entry.transcript;
  } catch (e) {
    // Expected under `astro dev` (no Blobs there). In production it means the cache is broken
    // and every request costs a vendor credit, so say so in the log rather than hide it.
    console.warn('transcript cache read skipped:', String(e).slice(0, 200));
    return null;
  }
}

async function cacheWrite(transcript: Transcript): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const entry: CacheEntry = { fetchedAt: Date.now(), transcript };
    await getStore(CACHE_STORE).set(transcript.videoId, JSON.stringify(entry));
  } catch (e) {
    // Cache is an optimisation. A failed write must never fail the request, but must be visible.
    console.warn('transcript cache write skipped:', String(e).slice(0, 200));
  }
}

/**
 * Get a transcript for a public YouTube video, cache first, vendor second.
 * See the contract at the top of this file for what throws and what returns.
 */
export async function getTranscript(videoId: string): Promise<TranscriptResult> {
  const cached = await cacheRead(videoId);
  if (cached) return { status: 'ok', transcript: cached, cached: true };

  const apiKey = transcriptApiKey();
  if (!apiKey) {
    console.error('Transcript API key is not set (TRANSCRIPT_API_KEY)');
    return { status: 'not-configured' };
  }

  const result = await fetchFromVendor(videoId, apiKey);
  if (result.status === 'ok') await cacheWrite(result.transcript);
  return result;
}
