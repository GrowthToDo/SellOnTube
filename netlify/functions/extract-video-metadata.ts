// extract-video-metadata.ts
//
// The free half of /tools/youtube-description-extractor. Reads a public video's metadata and
// derives the facts a B2B operator actually wants: where the CTA sits, which links are above the
// fold, how much of the description and tag budget is spent, whether the chapters are valid.
//
// Deliberately has NO Gemini call and NO transcript call. Two consequences that are the whole point:
//   1. It can never 503 because the AI is down. The advertised job keeps working.
//   2. It never touches the Supadata monthly budget in ./lib/transcript.ts.
//
// Quota: 1 YouTube Data API unit per UNCACHED request, drawn from the shared daily ceiling in
// ./lib/youtube-quota.ts. A repeat video inside 6 hours costs nothing.
//
// All text parsing lives in ./lib/parsers.js so it can be unit tested on every Node version.

import { extractVideoId, getNonVideoYouTubeError } from './lib/video-id.js';
import {
  ABOVE_FOLD_CHARS,
  DESCRIPTION_LIMIT,
  TAG_BUDGET,
  TITLE_LIMIT,
  checkChapters,
  extractLinks,
  extractTimestamps,
  formatSeconds,
  matchAll,
  normaliseNewlines,
  stripUnsafeChars,
} from './lib/parsers.js';
import { getVideoDetailsGuarded } from './lib/youtube-quota.js';
import { failureResponse } from './lib/upstream-error.js';

const MAX_URL = 2000;

// US videoCategories. Hardcoded because videoCategories.list would cost a second quota unit for a
// label. Labelled "US category list" in the UI since category names are region-specific.
const US_CATEGORIES: Record<string, string> = {
  '1': 'Film & Animation', '2': 'Autos & Vehicles', '10': 'Music', '15': 'Pets & Animals',
  '17': 'Sports', '18': 'Short Movies', '19': 'Travel & Events', '20': 'Gaming',
  '21': 'Videoblogging', '22': 'People & Blogs', '23': 'Comedy', '24': 'Entertainment',
  '25': 'News & Politics', '26': 'Howto & Style', '27': 'Education',
  '28': 'Science & Technology', '29': 'Nonprofits & Activism', '30': 'Movies',
  '31': 'Anime/Animation', '32': 'Action/Adventure', '33': 'Classics', '34': 'Comedy',
  '35': 'Documentary', '36': 'Drama', '37': 'Family', '38': 'Foreign', '39': 'Horror',
  '40': 'Sci-Fi/Fantasy', '41': 'Thriller', '42': 'Shorts', '43': 'Shows', '44': 'Trailers',
};

const HASHTAG_RE = /(?:^|\s)(#[^\s#]{1,60})/g;
const MENTION_RE = /(?:^|\s)(@[\w.-]{1,60})/g;

export default async (request: Request) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const youtubeKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeKey) {
    console.error('YOUTUBE_API_KEY is not set; extract-video-metadata cannot run.');
    return new Response(
      JSON.stringify({ error: 'This tool is temporarily unavailable. Please try again later.', detail: 'youtube_key_missing' }),
      { status: 503, headers }
    );
  }

  try {
    // Parse defensively. `const { url } = await request.json()` throws on a body of `null` or on
    // malformed JSON, and neither is an upstream failure, so failureResponse turned an
    // attacker-controlled input into a 5xx. Pattern copied from summarize-transcript.ts.
    const body = await request.json().catch(() => null);
    const url = typeof (body as { url?: unknown })?.url === 'string' ? (body as { url: string }).url : '';

    if (!url.trim()) {
      return new Response(JSON.stringify({ error: 'A YouTube video URL is required.' }), { status: 400, headers });
    }
    if (url.length > MAX_URL) {
      return new Response(JSON.stringify({ error: 'That URL is too long to be a YouTube link.' }), { status: 400, headers });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      const specific = getNonVideoYouTubeError(url);
      return new Response(
        JSON.stringify({ error: specific || 'Could not read a video ID from that link. Paste a YouTube video URL.' }),
        { status: 400, headers }
      );
    }

    const result = await getVideoDetailsGuarded(videoId, youtubeKey);

    if (result.status === 'budget-exhausted') {
      return new Response(
        JSON.stringify({ error: 'This tool has reached its daily lookup limit. Please try again tomorrow.', code: 'budget_exhausted' }),
        { status: 429, headers: { ...headers, 'Retry-After': '3600' } }
      );
    }
    if (result.status === 'not-found') {
      return new Response(
        JSON.stringify({ error: 'That video does not exist, or it is private or deleted.', code: 'video_not_found' }),
        { status: 422, headers }
      );
    }
    if (result.status === 'quota') {
      // Our outage, not their URL. 429 so the daily health check catches it.
      return new Response(
        JSON.stringify({ error: 'This tool has hit its daily limit with YouTube. Please try again tomorrow.', code: 'quota_exceeded' }),
        { status: 429, headers: { ...headers, 'Retry-After': '3600' } }
      );
    }
    if (result.status === 'upstream-error') {
      return new Response(
        JSON.stringify({
          error: 'YouTube is not responding right now. Nothing is wrong with your link. Please try again in a moment.',
          detail: result.detail,
          youtubeStatus: result.httpStatus,
        }),
        { status: 503, headers }
      );
    }

    const d = result.details;
    const description = normaliseNewlines(stripUnsafeChars(d.description ?? '')).slice(0, DESCRIPTION_LIMIT);
    const title = stripUnsafeChars(d.title ?? '');
    const tags = (d.tags ?? []).map((t) => stripUnsafeChars(t));

    const durationSeconds = d.durationSeconds ?? null;
    const chapters = extractTimestamps(description);
    // Tag budget counts the tags plus the commas between them. Approximate, and labelled as such.
    const tagChars = tags.length > 0 ? tags.join(',').length : 0;
    const isLive = (d.liveBroadcastContent ?? 'none') !== 'none';

    return new Response(
      JSON.stringify({
        videoId: d.videoId,
        cached: result.cached === true,
        title,
        titleChars: title.length,
        titleLimit: TITLE_LIMIT,
        channel: stripUnsafeChars(d.channelTitle ?? ''),
        channelId: d.channelId ?? '',
        publishedAt: d.publishedAt ?? '',
        thumbnail: d.thumbnailUrl ?? '',
        duration: {
          iso: d.duration ?? '',
          seconds: durationSeconds,
          // A null duration renders blank rather than as a misleading 0:00.
          formatted: typeof durationSeconds === 'number' ? formatSeconds(durationSeconds) : '',
          live: isLive,
        },
        stats: { views: d.viewCount, likes: d.likeCount, comments: d.commentCount },
        description: {
          raw: description,
          chars: description.length,
          lines: description ? description.split('\n').length : 0,
          words: description ? description.trim().split(/\s+/).filter(Boolean).length : 0,
          aboveFold: description.slice(0, ABOVE_FOLD_CHARS),
          foldAt: ABOVE_FOLD_CHARS,
          limit: DESCRIPTION_LIMIT,
          remaining: Math.max(0, DESCRIPTION_LIMIT - description.length),
        },
        tags: {
          list: tags,
          count: tags.length,
          chars: tagChars,
          limit: TAG_BUDGET,
          remaining: Math.max(0, TAG_BUDGET - tagChars),
          longest: tags.reduce((a, b) => (b.length > a.length ? b : a), ''),
        },
        links: extractLinks(description),
        hashtags: matchAll(description, HASHTAG_RE),
        mentions: matchAll(description, MENTION_RE),
        timestamps: chapters,
        chapterCheck: checkChapters(chapters, durationSeconds),
        flags: {
          hasCaptions: d.hasCaptions === true,
          definition: d.definition ?? '',
          categoryId: d.categoryId ?? '',
          category: US_CATEGORIES[d.categoryId ?? ''] ?? '',
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('extract-video-metadata error:', error);
    return failureResponse(error, 'Something went wrong on our end. Please try again in a moment.', headers);
  }
};

export const config = {
  path: '/api/extract-video-metadata',
};
