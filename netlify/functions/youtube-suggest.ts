// Netlify Function: proxies YouTube Autocomplete for frontend tools (CORS-safe)
// No API key needed. No quota.

import { getSuggestions, getExpandedSuggestions } from './lib/youtube-suggest.js';

export default async (request: Request) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
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
    const suggestions = expand
      ? await getExpandedSuggestions(query)
      : await getSuggestions(query);

    return new Response(
      JSON.stringify({ query, expand, count: suggestions.length, suggestions }),
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
