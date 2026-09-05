// get-transcript.ts
import { failureResponse } from './lib/upstream-error.js';
import { getTranscript } from './lib/transcript.js';

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

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

  return null;
}

// Status contract (the page and the health check both depend on it):
//   200  { videoId, title, channel, thumbnail, lang, segments: [{ text, start, duration }], cached }
//   400  bad input
//   422  vendor reached, this video has no captions   (a property of the video, not an outage)
//   429  vendor quota exhausted
//   503  vendor down, unreachable, or not configured  (an outage; the page shows a notice)
export default async (request: Request) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url?.trim()) {
      return new Response(JSON.stringify({ error: 'url is required' }), { status: 400, headers });
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Could not extract a valid YouTube video ID from the provided URL' }),
        { status: 400, headers }
      );
    }

    const result = await getTranscript(videoId);

    switch (result.status) {
      case 'ok':
        return new Response(
          JSON.stringify({
            videoId,
            title: result.transcript.title,
            channel: result.transcript.channel,
            thumbnail: result.transcript.thumbnail,
            lang: result.transcript.lang,
            segments: result.transcript.segments,
            cached: result.cached,
          }),
          { status: 200, headers }
        );
      case 'unavailable':
        return new Response(
          JSON.stringify({
            error: 'No transcript found. The video may not exist, may be private, or may have no captions. Try a public video that shows a CC button on YouTube.',
            code: 'no_captions',
          }),
          { status: 422, headers }
        );
      case 'quota':
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      case 'not-configured':
      case 'upstream-error':
        return new Response(
          JSON.stringify({ error: 'The transcript service is temporarily unavailable. Please try again later.' }),
          { status: 503, headers }
        );
    }
  } catch (error) {
    console.error('get-transcript error:', error);
    return failureResponse(error, 'Something went wrong. Please try again later.', headers);
  }
};

export const config = {
  path: '/api/get-transcript',
};
