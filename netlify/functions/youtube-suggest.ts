// Netlify Function: proxies YouTube Autocomplete for frontend tools (CORS-safe)
// No API key needed. No quota.

import { getSuggestions, getExpandedSuggestions } from './lib/youtube-suggest.js';

export default async (request: Request) => {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = ['https://sellontube.com', 'http://localhost:4321'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://sellontube.com';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim();
  const expand = url.searchParams.get('expand') === 'true';
  const exhaustive = url.searchParams.get('exhaustive') === 'true';
  const gl = url.searchParams.get('gl') || undefined;
  const hl = url.searchParams.get('hl') || 'en';

  if (!query) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameter: q' }),
      { status: 400, headers }
    );
  }

  if (query.length > 200) {
    return new Response(
      JSON.stringify({ error: 'Query too long (max 200 characters)' }),
      { status: 400, headers }
    );
  }

  try {
    const opts = { gl, hl };

    const suggestions = expand
      ? await getExpandedSuggestions(query, { ...opts, exhaustive })
      : await getSuggestions(query, opts);

    return new Response(
      JSON.stringify({ query, expand, exhaustive, gl: gl || 'global', hl, count: suggestions.length, suggestions }),
      { status: 200, headers }
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('youtube-suggest error:', detail);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch suggestions', detail }),
      { status: 503, headers }
    );
  }
};

export const config = {
  path: '/api/youtube-suggest',
};
