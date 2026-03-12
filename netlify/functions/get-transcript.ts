// get-transcript.ts

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

  const apiKey = process.env.LF_YOUTUBE_KEY;
  if (!apiKey) {
    console.error('LF_YOUTUBE_KEY environment variable is not set');
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url?.trim()) {
      return new Response(
        JSON.stringify({ error: 'url is required' }),
        { status: 400, headers }
      );
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Could not extract a valid YouTube video ID from the provided URL' }),
        { status: 400, headers }
      );
    }

    const apiUrl = `https://api.datafetchapi.com/v1/youtube/video/${videoId}/transcript/fast`;

    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'X-API-KEY': apiKey },
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('DataFetch API error:', apiRes.status, errText);

      if (apiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch transcript. The video may not have captions available.' }),
        { status: 503, headers }
      );
    }

    const data = await apiRes.json();

    return new Response(JSON.stringify({ videoId, ...data }), { status: 200, headers });
  } catch (error) {
    console.error('get-transcript error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/get-transcript',
};
