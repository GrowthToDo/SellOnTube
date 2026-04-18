// youtube-rank-check.ts
// Handles YouTube Ranking Checker and YouTube Competitor Analysis tools.
// Accepts a keyword, optional channel input, and returns top YouTube search results with rank info.

export default async (request: Request) => {
  const headers = {
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

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeApiKey) {
    return new Response(
      JSON.stringify({ error: 'YouTube API key not configured. Set YOUTUBE_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { keyword, channelInput, maxResults = 20 } = body;

    if (!keyword?.trim()) {
      return new Response(
        JSON.stringify({ error: 'keyword is required' }),
        { status: 400, headers }
      );
    }

    if (keyword.trim().length > 300) {
      return new Response(
        JSON.stringify({ error: 'Keyword exceeds the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const clampedMax = Math.min(Math.max(1, Number(maxResults) || 20), 50);

    // --- Resolve channel ID if provided ---
    let channelId: string | null = null;

    if (channelInput?.trim()) {
      channelId = await resolveChannelId(channelInput.trim(), youtubeApiKey);
      if (channelId === null) {
        return new Response(
          JSON.stringify({ error: 'Could not resolve channel. Try pasting the full channel URL or using the @handle format.' }),
          { status: 400, headers }
        );
      }
    }

    // --- YouTube search ---
    const searchUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword.trim())}&type=video&maxResults=${clampedMax}&key=${youtubeApiKey}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error('YouTube Search API error:', searchRes.status, errText);
      // Use 503, never 502 (Cloudflare eats 502 bodies)
      return new Response(
        JSON.stringify({ error: 'YouTube search failed', youtubeStatus: searchRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const searchData = await searchRes.json();
    const items = searchData.items || [];

    if (items.length === 0) {
      return new Response(
        JSON.stringify({ keyword: keyword.trim(), channelId, rank: null, results: [] }),
        { status: 200, headers }
      );
    }

    // --- Fetch view counts via videos.list ---
    const videoIds = items.map((item: any) => item.id.videoId).filter(Boolean);
    let viewCountMap: Record<string, number> = {};

    if (videoIds.length > 0) {
      try {
        const videosUrl =
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${youtubeApiKey}`;
        const videosRes = await fetch(videosUrl);

        if (videosRes.ok) {
          const videosData = await videosRes.json();
          for (const v of videosData.items || []) {
            viewCountMap[v.id] = Number(v.statistics?.viewCount) || 0;
          }
        } else {
          // Gracefully degrade: return results without view counts
          console.error('YouTube Videos API error (non-fatal):', videosRes.status, await videosRes.text().catch(() => ''));
        }
      } catch (err) {
        // Gracefully degrade
        console.error('Videos.list fetch failed (non-fatal):', err);
      }
    }

    // --- Build results ---
    let rank: number | null = null;
    const results = items.map((item: any, index: number) => {
      const videoId = item.id.videoId;
      const itemChannelId = item.snippet.channelId;
      const isOwnVideo = channelId ? itemChannelId === channelId : false;
      const position = index + 1;

      if (isOwnVideo && rank === null) {
        rank = position;
      }

      return {
        position,
        videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        channelId: itemChannelId,
        viewCount: viewCountMap[videoId] ?? 0,
        publishedAt: item.snippet.publishedAt,
        isOwnVideo,
      };
    });

    return new Response(
      JSON.stringify({ keyword: keyword.trim(), channelId, rank, results }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('youtube-rank-check error:', error);
    return new Response(
      JSON.stringify({ error: 'Rank check failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

// --- Channel resolution helper ---

async function resolveChannelId(input: string, apiKey: string): Promise<string | null> {
  // Direct channel ID (starts with UC, 24 chars)
  if (/^UC[\w-]{22}$/.test(input)) {
    return input;
  }

  // Handle with @ prefix
  if (input.startsWith('@')) {
    return await fetchChannelByHandle(input.slice(1), apiKey);
  }

  // Try to parse as URL
  try {
    const url = new URL(input.startsWith('http') ? input : 'https://' + input);
    const path = url.pathname;

    // youtube.com/channel/UC...
    const channelMatch = path.match(/\/channel\/(UC[\w-]{22})/);
    if (channelMatch) {
      return channelMatch[1];
    }

    // youtube.com/@handle
    const handleMatch = path.match(/\/@([\w.-]+)/);
    if (handleMatch) {
      return await fetchChannelByHandle(handleMatch[1], apiKey);
    }

    // youtube.com/c/CustomName or youtube.com/user/Username
    const customMatch = path.match(/\/(?:c|user)\/([\w.-]+)/);
    if (customMatch) {
      return await fetchChannelByHandle(customMatch[1], apiKey);
    }
  } catch {
    // Not a valid URL
  }

  // Plain string: try as handle
  if (/^[\w.-]+$/.test(input)) {
    return await fetchChannelByHandle(input, apiKey);
  }

  return null;
}

async function fetchChannelByHandle(handle: string, apiKey: string): Promise<string | null> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export const config = {
  path: '/api/youtube-rank-check',
};
