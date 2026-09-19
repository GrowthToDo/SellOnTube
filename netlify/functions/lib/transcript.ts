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
//   - A caller may pass `{ caller }` to draw on its own sub-budget as well as the shared one.
//     Omitting it means 'default', which is what every pre-existing caller does and keeps the
//     full shared ceiling available to them. See CALLER_BUDGETS near the bottom of this file.

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

async function fetchFromVendor(videoId: string, apiKey: string, caller: TranscriptCaller): Promise<TranscriptResult> {
  // Supadata takes 9-18s to report a video that does not exist or is private (it goes and
  // asks YouTube), which is longer than Netlify's synchronous function limit. YouTube's own
  // oEmbed endpoint answers the same question in under a second, so ask it first. It also
  // saves a vendor credit on every typo.
  const video = await lookupVideo(videoId);
  if (video.exists === false) return { status: 'unavailable', reason: 'not-found' };

  // Count the spend here, once per getTranscript() call that actually reaches the vendor,
  // regardless of what it responds with. We do not know Supadata's own billing rule for a
  // 206/404/429 response, so this is the conservative assumption: any request sent to the
  // vendor counts against the monthly budget, even the (rare) two-request English-fallback
  // case below, which this deliberately undercounts by treating as one.
  // Counts against every budget this caller answers to: the shared monthly one, plus its own.
  await budgetIncrement(budgetsFor(caller).map((b) => b.key));

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

// ---------------------------------------------------------------------------------------------
// Monthly credit budget. Supadata's free tier is 100 requests/month shared across all four
// callers above, and until now nothing enforced that server-side: the only limiter was a
// client-side localStorage counter (RATE_LIMIT), which a script or a second browser profile
// bypasses in seconds. The 2026-07-08 outage that cost this page 7 weeks of ranking happened
// because a dead vendor went undetected for weeks; exhausting a real vendor's quota produces
// the exact same symptom (every visitor gets an error) and must not be possible to trigger
// from outside. This budget makes exhaustion a deliberate, visible, monthly event instead.
// ---------------------------------------------------------------------------------------------
const BUDGET_STORE = 'transcript-budget';
const MONTHLY_BUDGET = Number(process.env.TRANSCRIPT_MONTHLY_BUDGET) || 90; // 10 held back for the daily health check + manual testing

/**
 * Per-caller ceilings, carved out of the SAME monthly budget above.
 *
 * A caller listed here is limited twice: by its own ceiling and by the shared one. A caller that is
 * not listed ('default') is limited only by the shared one, which is why the five existing callers
 * are untouched by this. Capping 'default' below 90 would make get-transcript start returning 429
 * while vendor credits sat unused, which is the exact outage the shared budget exists to prevent.
 *
 * The point of a sub-budget: a new, secondary consumer cannot drain the month and take the
 * transcript tool down with it. Twenty AI chapter runs a month is a real ceiling for a secondary
 * feature and leaves seventy credits for everything else.
 */
const CALLER_BUDGETS: Record<string, number> = {
  'ai-chapters': Number(process.env.TRANSCRIPT_BUDGET_AI_CHAPTERS) || 20,
};

export type TranscriptCaller = 'default' | 'ai-chapters';

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

/**
 * Sub-budget key for a caller, in the same store as the shared counter.
 *
 * A dot, not a colon: under `netlify dev` the Blobs emulator writes one file per key, and a colon
 * is not a legal character in a Windows filename.
 */
function callerKey(caller: string): string {
  return `${currentMonthKey()}.${caller}`;
}

/**
 * Every budget one spend by this caller must satisfy, shared ceiling first.
 * Exported for the unit test; nothing else needs it.
 */
export function budgetsFor(caller: TranscriptCaller): Array<{ key: string; ceiling: number; label: string }> {
  const budgets = [{ key: currentMonthKey(), ceiling: MONTHLY_BUDGET, label: 'monthly' }];
  const own = CALLER_BUDGETS[caller];
  if (typeof own === 'number') budgets.push({ key: callerKey(caller), ceiling: own, label: caller });
  return budgets;
}

/**
 * Best-effort like the cache above: unavailable in dev, and a failure here must never block a real
 * request.
 *
 * Netlify Blobs reads are EVENTUALLY consistent. A read a few seconds after a write can legitimately
 * return the older value, so this counter may undercount briefly under a burst, and a cache read
 * straight after a write may legitimately miss. That is the storage contract, not a defect: never
 * "fix" it with a read-after-write assertion.
 */
async function budgetRemaining(key: string, ceiling: number): Promise<number | null> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const raw = await getStore(BUDGET_STORE).get(key);
    const used = raw ? Number(raw) || 0 : 0;
    return ceiling - used;
  } catch (e) {
    console.warn('transcript budget read skipped:', String(e).slice(0, 200));
    return null; // unknown, not exhausted, so dev and any Blobs outage fail open
  }
}

/** Increment every key this spend counts against: always the shared one, plus the caller's own. */
async function budgetIncrement(keys: string[]): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore(BUDGET_STORE);
    for (const key of keys) {
      const raw = await store.get(key);
      const used = raw ? Number(raw) || 0 : 0;
      await store.set(key, String(used + 1));
    }
  } catch (e) {
    console.warn('transcript budget increment skipped:', String(e).slice(0, 200));
  }
}

/**
 * Get a transcript for a public YouTube video, cache first, vendor second.
 * See the contract at the top of this file for what throws and what returns.
 */
export async function getTranscript(
  videoId: string,
  options: { caller?: TranscriptCaller } = {}
): Promise<TranscriptResult> {
  const caller = options.caller ?? 'default';

  // Cache first, before any budget check. A video someone already fetched costs no vendor credit,
  // so refusing it would be pure loss. Only a real vendor call is counted.
  const cached = await cacheRead(videoId);
  if (cached) return { status: 'ok', transcript: cached, cached: true };

  const apiKey = transcriptApiKey();
  if (!apiKey) {
    console.error('Transcript API key is not set (TRANSCRIPT_API_KEY)');
    return { status: 'not-configured' };
  }

  for (const budget of budgetsFor(caller)) {
    const remaining = await budgetRemaining(budget.key, budget.ceiling);
    if (remaining !== null && remaining <= 0) {
      console.warn(
        `Transcript budget "${budget.label}" exhausted (${budget.ceiling}/mo). Refusing before spending a vendor credit.`
      );
      return { status: 'quota' };
    }
  }

  const result = await fetchFromVendor(videoId, apiKey, caller);
  if (result.status === 'ok') await cacheWrite(result.transcript);
  return result;
}
