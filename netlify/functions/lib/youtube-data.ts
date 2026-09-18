// YouTube Data API v3 wrapper
// Docs: https://developers.google.com/youtube/v3/docs

import { parseIsoDuration } from './parsers.js';

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface VideoDetails {
  videoId: string;
  title: string;
  description: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
  publishedAt: string;
  categoryId: string;
  thumbnailUrl: string;
  // Added 2026-09-18 with `contentDetails`. All optional so existing callers are unaffected:
  // getMultipleVideoDetails does not request that part and leaves these undefined.
  channelId?: string;
  duration?: string; // ISO 8601, e.g. "PT3M33S"
  durationSeconds?: number | null; // null = duration present but unparseable, 0 = genuine zero
  definition?: string; // "hd" | "sd"
  hasCaptions?: boolean; // contentDetails.caption is the STRING "true"/"false", not a boolean
  defaultAudioLanguage?: string;
  liveBroadcastContent?: string; // "none" | "live" | "upcoming"
}

/**
 * Outcome of a single-video lookup.
 *
 * Why this exists: getVideoDetails used to collapse every non-ok response into `null`, which made a
 * 403 quotaExceeded indistinguishable from a deleted video. Callers then told the user "video not
 * found" and blamed their URL for our outage. Shape mirrors TranscriptResult in ./transcript.ts.
 */
export type VideoDetailsResult =
  | { status: 'ok'; details: VideoDetails }
  | { status: 'not-found' }
  | { status: 'quota' }
  | { status: 'upstream-error'; httpStatus: number; detail: string };

/** YouTube signals quota exhaustion as a 403 whose error reasons name it. */
const QUOTA_REASONS = new Set(['quotaExceeded', 'dailyLimitExceeded', 'rateLimitExceeded', 'userRateLimitExceeded']);


export interface SearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
}

/**
 * Fetch full video details including tags, stats, snippet and contentDetails.
 * Quota cost: 1 unit per call. videos.list is billed per call, not per part, so adding
 * contentDetails in 2026-09 did not change the cost.
 *
 * Distinguishes a missing video from an upstream failure. Prefer this over getVideoDetails
 * anywhere the distinction reaches the user.
 */
export async function getVideoDetailsResult(
  videoId: string,
  apiKey: string
): Promise<VideoDetailsResult> {
  const url = `${YT_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(videoId)}&key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    const err = await res.text();
    console.error('YouTube Data API videos.list error:', res.status, err.slice(0, 300));

    if (res.status === 403) {
      let reasons: string[] = [];
      try {
        const parsed = JSON.parse(err);
        reasons = (parsed?.error?.errors ?? []).map((e: { reason?: string }) => e?.reason ?? '');
      } catch {
        // Body was not JSON. Fall through to upstream-error rather than guessing.
      }
      if (reasons.some((r) => QUOTA_REASONS.has(r))) return { status: 'quota' };
    }

    return { status: 'upstream-error', httpStatus: res.status, detail: err.slice(0, 300) };
  }

  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) return { status: 'not-found' };

  const snippet = item.snippet ?? {};
  const stats = item.statistics ?? {};
  const content = item.contentDetails ?? {};
  const iso = content.duration ?? '';

  return {
    status: 'ok',
    details: {
      videoId,
      title: snippet.title ?? '',
      description: snippet.description ?? '',
      tags: Array.isArray(snippet.tags) ? snippet.tags : [],
      viewCount: parseInt(stats.viewCount ?? '0', 10),
      likeCount: parseInt(stats.likeCount ?? '0', 10),
      commentCount: parseInt(stats.commentCount ?? '0', 10),
      channelTitle: snippet.channelTitle ?? '',
      publishedAt: snippet.publishedAt ?? '',
      categoryId: snippet.categoryId ?? '',
      thumbnailUrl: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? '',
      channelId: snippet.channelId ?? '',
      duration: iso,
      durationSeconds: parseIsoDuration(iso),
      definition: content.definition ?? '',
      hasCaptions: content.caption === 'true' || content.caption === true,
      defaultAudioLanguage: snippet.defaultAudioLanguage ?? '',
      liveBroadcastContent: snippet.liveBroadcastContent ?? 'none',
    },
  };
}

/**
 * Fetch full video details including tags, stats, and snippet.
 * Quota cost: 1 unit per call.
 *
 * Thin wrapper kept for the one existing caller (youtube-seo-tool.ts), which reads only .title,
 * .description and .tags. Its FAILURE behaviour is unchanged: null for every failure mode alike.
 * The success payload is not identical to the pre-2026-09-18 version - the request gained
 * `contentDetails` and the object gained seven optional fields - but no current caller reads them.
 */
export async function getVideoDetails(
  videoId: string,
  apiKey: string
): Promise<VideoDetails | null> {
  const result = await getVideoDetailsResult(videoId, apiKey);
  return result.status === 'ok' ? result.details : null;
}

/**
 * Search YouTube for videos matching a query. Returns top N results.
 * Quota cost: 100 units per call.
 */
export async function searchVideos(
  query: string,
  apiKey: string,
  maxResults = 5
): Promise<SearchResult[]> {
  const url =
    `${YT_API_BASE}/search?part=snippet&type=video&q=${encodeURIComponent(query)}` +
    `&maxResults=${maxResults}&relevanceLanguage=en&key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    const err = await res.text();
    console.error('YouTube Data API search.list error:', res.status, err.slice(0, 300));
    return [];
  }

  const data = await res.json();
  const items: any[] = data?.items ?? [];

  return items.map((item) => ({
    videoId: item.id?.videoId ?? '',
    title: item.snippet?.title ?? '',
    channelTitle: item.snippet?.channelTitle ?? '',
    description: item.snippet?.description ?? '',
    publishedAt: item.snippet?.publishedAt ?? '',
    thumbnailUrl:
      item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? '',
  }));
}

/**
 * Fetch details for multiple videos in a single call (up to 50).
 * Quota cost: 1 unit total (not per video).
 */
export async function getMultipleVideoDetails(
  videoIds: string[],
  apiKey: string
): Promise<VideoDetails[]> {
  if (videoIds.length === 0) return [];
  const ids = videoIds.slice(0, 50).join(',');
  const url = `${YT_API_BASE}/videos?part=snippet,statistics&id=${encodeURIComponent(ids)}&key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    const err = await res.text();
    console.error('YouTube Data API videos.list (batch) error:', res.status, err.slice(0, 300));
    return [];
  }

  const data = await res.json();
  const items: any[] = data?.items ?? [];

  return items.map((item) => {
    const snippet = item.snippet ?? {};
    const stats = item.statistics ?? {};
    return {
      videoId: item.id ?? '',
      title: snippet.title ?? '',
      description: snippet.description ?? '',
      tags: Array.isArray(snippet.tags) ? snippet.tags : [],
      viewCount: parseInt(stats.viewCount ?? '0', 10),
      likeCount: parseInt(stats.likeCount ?? '0', 10),
      commentCount: parseInt(stats.commentCount ?? '0', 10),
      channelTitle: snippet.channelTitle ?? '',
      publishedAt: snippet.publishedAt ?? '',
      categoryId: snippet.categoryId ?? '',
      thumbnailUrl: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? '',
    };
  });
}

/**
 * Search YouTube, then fetch full details (including tags) for the results.
 * Quota cost: 100 + 1 = 101 units.
 * Use this when you need tags from top-ranking videos for a topic.
 */
export async function searchWithDetails(
  query: string,
  apiKey: string,
  maxResults = 5
): Promise<VideoDetails[]> {
  const results = await searchVideos(query, apiKey, maxResults);
  if (results.length === 0) return [];

  const videoIds = results.map((r) => r.videoId).filter(Boolean);
  return getMultipleVideoDetails(videoIds, apiKey);
}
