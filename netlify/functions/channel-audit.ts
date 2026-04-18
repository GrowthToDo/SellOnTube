// channel-audit.ts
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_INSTRUCTION = `You are a YouTube channel auditor for business channels. Analyze the provided video metadata and score the channel across 4 dimensions. Each dimension is scored 0-25 for a total of 0-100.

Scoring dimensions:

1. Title Quality (0-25): Does each title use buyer-intent language? Are keywords present and front-loaded? Are titles under 60 characters? Are they specific to a target customer rather than generic?

2. Description Quality (0-25): Does the first 150 characters contain a compelling summary with keywords? Are there CTAs or links? Is keyword usage natural and relevant?

3. Publishing Consistency (0-25): Is there a regular upload schedule? Are there long gaps between uploads? Is the frequency reasonable (at least 1-2 per month)?

4. SEO Optimization (0-25): Do descriptions contain chapters/timestamps? Is there evidence of tag variety? Are titles searchable queries that real people would type into YouTube?

For each video, also rate its title and description quality as "good", "fair", or "poor".

Provide exactly 3 actionable recommendations specific to this channel's weaknesses.

Respond ONLY with a valid JSON object. No preamble, no explanation, no markdown.
Format:
{
  "overallScore": N,
  "dimensions": [
    { "name": "Title Quality", "score": N, "maxScore": 25, "summary": "..." },
    { "name": "Description Quality", "score": N, "maxScore": 25, "summary": "..." },
    { "name": "Publishing Consistency", "score": N, "maxScore": 25, "summary": "..." },
    { "name": "SEO Optimization", "score": N, "maxScore": 25, "summary": "..." }
  ],
  "videos": [
    { "title": "...", "publishedAt": "...", "titleScore": "good|fair|poor", "descriptionScore": "good|fair|poor" }
  ],
  "recommendations": ["...", "...", "..."]
}`;

function parseChannelInput(input: string): { type: 'handle' | 'id'; value: string } | null {
  const trimmed = input.trim();

  // Direct channel ID
  if (/^UC[\w-]{22}$/.test(trimmed)) {
    return { type: 'id', value: trimmed };
  }

  // Handle with @ prefix
  if (trimmed.startsWith('@')) {
    return { type: 'handle', value: trimmed.slice(1) };
  }

  // URL patterns
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : 'https://' + trimmed);
    const path = url.pathname;

    // youtube.com/channel/UC...
    const channelMatch = path.match(/\/channel\/(UC[\w-]{22})/);
    if (channelMatch) {
      return { type: 'id', value: channelMatch[1] };
    }

    // youtube.com/@handle
    const handleMatch = path.match(/\/@([\w.-]+)/);
    if (handleMatch) {
      return { type: 'handle', value: handleMatch[1] };
    }

    // youtube.com/c/CustomName or youtube.com/user/Username
    const customMatch = path.match(/\/(?:c|user)\/([\w.-]+)/);
    if (customMatch) {
      return { type: 'handle', value: customMatch[1] };
    }
  } catch {
    // Not a valid URL, treat as handle
    if (/^[\w.-]+$/.test(trimmed)) {
      return { type: 'handle', value: trimmed };
    }
  }

  return null;
}

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

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { channelInput } = body;

    if (!channelInput?.trim()) {
      return new Response(
        JSON.stringify({ error: 'channelInput is required' }),
        { status: 400, headers }
      );
    }

    if (channelInput.trim().length > 500) {
      return new Response(
        JSON.stringify({ error: 'Input exceeds the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const parsed = parseChannelInput(channelInput);
    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Could not parse channel URL or handle. Try pasting the full channel URL or using the @handle format.' }),
        { status: 400, headers }
      );
    }

    // Step 1: Resolve channel
    let channelUrl: string;
    if (parsed.type === 'id') {
      channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${encodeURIComponent(parsed.value)}&key=${youtubeApiKey}`;
    } else {
      channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(parsed.value)}&key=${youtubeApiKey}`;
    }

    const channelRes = await fetch(channelUrl);
    if (!channelRes.ok) {
      const errText = await channelRes.text();
      console.error('YouTube Channels API error:', channelRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'YouTube API error', detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Channel not found. Check the URL or handle and try again.' }),
        { status: 404, headers }
      );
    }

    const channel = channelData.items[0];
    const channelName = channel.snippet.title;
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

    // Step 2: Get last 10 videos from uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${youtubeApiKey}`;
    const playlistRes = await fetch(playlistUrl);
    if (!playlistRes.ok) {
      const errText = await playlistRes.text();
      console.error('YouTube PlaylistItems API error:', playlistRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch channel videos', detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const playlistData = await playlistRes.json();
    if (!playlistData.items || playlistData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'This channel has no public videos to audit.' }),
        { status: 404, headers }
      );
    }

    // Step 3: Get full video details
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(',');

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${youtubeApiKey}`;
    const videosRes = await fetch(videosUrl);
    if (!videosRes.ok) {
      const errText = await videosRes.text();
      console.error('YouTube Videos API error:', videosRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch video details', detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const videosData = await videosRes.json();
    const videos = videosData.items || [];

    // Build metadata summary for Gemini
    const videoSummaries = videos.map((v: any) => ({
      title: v.snippet.title,
      description: (v.snippet.description || '').slice(0, 200),
      publishedAt: v.snippet.publishedAt,
      duration: v.contentDetails.duration,
    }));

    const userPrompt = `Analyze this YouTube channel: "${channelName}"

Here are the last ${videoSummaries.length} videos:

${videoSummaries.map((v: any, i: number) => `Video ${i + 1}:
- Title: ${v.title}
- Published: ${v.publishedAt}
- Duration: ${v.duration}
- Description (first 200 chars): ${v.description}`).join('\n\n')}

Score this channel across all 4 dimensions and rate each video's title and description quality. Return the JSON response.`;

    // Step 4: Send to Gemini for analysis
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{ text: userPrompt }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }
      // Use 503 not 502 - Cloudflare intercepts 502 and replaces the response body
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.dimensions) || result.dimensions.length !== 4) {
      throw new Error('Invalid response structure from Gemini');
    }

    // Attach channel name to the result
    result.channelName = channelName;

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error('channel-audit error:', error);
    return new Response(
      JSON.stringify({ error: 'Audit failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/channel-audit',
};
