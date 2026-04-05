// YouTube Data API v3 wrapper
// Docs: https://developers.google.com/youtube/v3/docs

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
}

export interface SearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
}

/**
 * Fetch full video details including tags, stats, and snippet.
 * Quota cost: 1 unit per call (parts: snippet + statistics).
 */
export async function getVideoDetails(
  videoId: string,
  apiKey: string
): Promise<VideoDetails | null> {
  const url = `${YT_API_BASE}/videos?part=snippet,statistics&id=${encodeURIComponent(videoId)}&key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    const err = await res.text();
    console.error('YouTube Data API videos.list error:', res.status, err.slice(0, 300));
    return null;
  }

  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) return null;

  const snippet = item.snippet ?? {};
  const stats = item.statistics ?? {};

  return {
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
  };
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
