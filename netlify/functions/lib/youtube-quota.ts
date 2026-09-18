// Cache + daily spend ceiling for the YouTube Data API.
//
// Why this exists: YOUTUBE_API_KEY is ONE key with 10,000 units/day, shared by channel-audit
// ("best CTR on site"), youtube-rank-check ("most clicks on site"), youtube-seo-tool, generate-tags,
// generate-description and both description-extractor endpoints. Nothing enforced a ceiling, and the
// two newest endpoints are unauthenticated, so roughly 10,000 POSTs - about 8 minutes at 20 req/s -
// took the two biggest earners on the site down for the rest of the day.
//
// Same shape as the vendor budget in ./transcript.ts, and the same posture:
//   - cache first, so a repeat video costs nothing and can never be refused
//   - fail OPEN on any Blobs error, so a storage outage degrades to today's behaviour, not an outage
//   - exhaustion is a deliberate, visible, daily event rather than something a stranger can trigger
//
// The ceiling deliberately sits well under 10,000 so the tools NOT guarded here keep headroom.

import { getVideoDetailsResult, type VideoDetails, type VideoDetailsResult } from './youtube-data.js';

const CACHE_STORE = 'youtube-video-details-v1';
// 6 hours, not 30 days. View and comment counts move, and a stale stat shown as current is a worse
// answer than a slow one. Long enough to absorb a burst, short enough to stay honest.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const BUDGET_STORE = 'youtube-api-budget';
// videos.list costs 1 unit. 3,000/day leaves 7,000 for the unguarded callers, including
// youtube-rank-check, whose search.list calls cost 100 units each.
const DAILY_BUDGET = Number(process.env.YOUTUBE_DAILY_BUDGET) || 3000;

export type GuardedVideoResult = (VideoDetailsResult | { status: 'budget-exhausted' }) & {
  cached?: boolean;
};

interface CacheEntry {
  fetchedAt: number;
  details: VideoDetails;
}

function currentDayKey(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD", UTC
}

/** Best-effort. Blobs is unavailable under `astro dev`, and a cache miss must never fail a request. */
async function cacheRead(videoId: string): Promise<VideoDetails | null> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const raw = await getStore(CACHE_STORE).get(videoId);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    // Validate rather than trust. A malformed entry gives fetchedAt === undefined, and
    // `Date.now() - undefined` is NaN, which fails every `>` comparison and would be read as fresh.
    if (typeof entry?.fetchedAt !== 'number' || !Number.isFinite(entry.fetchedAt)) return null;
    if (typeof entry?.details?.videoId !== 'string') return null;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
    return entry.details;
  } catch (e) {
    console.warn('video details cache read skipped:', String(e).slice(0, 200));
    return null;
  }
}

async function cacheWrite(details: VideoDetails): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    await getStore(CACHE_STORE).set(details.videoId, JSON.stringify({ fetchedAt: Date.now(), details }));
  } catch (e) {
    console.warn('video details cache write skipped:', String(e).slice(0, 200));
  }
}

/** Returns units left today, or null when unknown. null means fail open, never "exhausted". */
async function budgetRemaining(): Promise<number | null> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const raw = await getStore(BUDGET_STORE).get(currentDayKey());
    const used = raw ? Number(raw) || 0 : 0;
    return DAILY_BUDGET - used;
  } catch (e) {
    console.warn('youtube budget read skipped:', String(e).slice(0, 200));
    return null;
  }
}

async function budgetIncrement(units = 1): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore(BUDGET_STORE);
    const key = currentDayKey();
    const raw = await store.get(key);
    const used = raw ? Number(raw) || 0 : 0;
    await store.set(key, String(used + units));
  } catch (e) {
    console.warn('youtube budget increment skipped:', String(e).slice(0, 200));
  }
}

/**
 * getVideoDetailsResult, with a shared 6-hour cache in front and a daily unit ceiling behind.
 *
 * Cache is checked BEFORE the budget on purpose: a video someone already looked up costs no quota,
 * so refusing it would be pure loss. Only a real API call is counted.
 */
export async function getVideoDetailsGuarded(
  videoId: string,
  apiKey: string
): Promise<GuardedVideoResult> {
  const cached = await cacheRead(videoId);
  if (cached) return { status: 'ok', details: cached, cached: true };

  const remaining = await budgetRemaining();
  if (remaining !== null && remaining <= 0) {
    console.warn(`YouTube Data API daily budget exhausted (${DAILY_BUDGET}/day). Refusing before spending a unit.`);
    return { status: 'budget-exhausted' };
  }

  await budgetIncrement(1);
  const result = await getVideoDetailsResult(videoId, apiKey);
  if (result.status === 'ok') await cacheWrite(result.details);
  return { ...result, cached: false };
}
