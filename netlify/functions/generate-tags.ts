const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

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

function buildPrompt(
  title: string,
  description: string,
  existingTags: string[],
  transcript: string | null
): string {
  const transcriptSection = transcript
    ? `\nVideo transcript (first 3000 chars):\n${transcript.slice(0, 3000)}`
    : '\nNo transcript available.';

  const existingTagsSection = existingTags.length > 0
    ? `\nExisting tags: ${existingTags.join(', ')}`
    : '\nNo existing tags found.';

  return `You are a YouTube SEO specialist for B2B and business channels. Analyze this video and generate optimized tags that attract buyers and decision-makers, not casual viewers.

Video title: "${title}"

Video description (first 1000 chars):
${description.slice(0, 1000)}
${existingTagsSection}
${transcriptSection}

Your task:
1. Identify the primary keyword this video should rank for (what a business buyer would search)
2. Generate 15-20 optimized YouTube tags ordered by relevance
3. Explain your tag strategy in 1-2 sentences
4. Flag any problems with the existing tags

Tag generation rules:
- First tag must be the primary keyword
- Include long-tail variants (e.g. "best CRM for small teams", "CRM software comparison 2026")
- Include buyer-intent modifiers: "best", "vs", "review", "for [industry]", "how to choose", "pricing"
- Include industry-specific terms the target buyer would search
- Keep each tag under 30 characters when possible
- Do NOT include generic creator tags like "vlog", "subscribe", "like and share"
- Tags should reflect what a business decision-maker would type into YouTube search

For warnings, flag issues like:
- Tags that are too generic (e.g. just "marketing" or "business")
- Missing buyer-intent keywords
- Too few tags (under 5)
- Tags that do not match the video content
- No long-tail keyword variants

Respond with this exact JSON and nothing else:
{
  "primaryKeyword": "the main keyword",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "tagStrategy": "Brief explanation of the tag strategy",
  "warnings": ["warning 1", "warning 2"]
}`;
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

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  const youtubeKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeKey) {
    return new Response(
      JSON.stringify({ error: 'YouTube API key not configured.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl?.trim()) {
      return new Response(
        JSON.stringify({ error: 'videoUrl is required' }),
        { status: 400, headers }
      );
    }

    const videoId = extractVideoId(videoUrl.trim());
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Could not extract a valid YouTube video ID from the provided URL.' }),
        { status: 400, headers }
      );
    }

    // 1. Fetch video metadata from YouTube Data API
    const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeKey}`;
    const ytRes = await fetch(ytUrl, { signal: AbortSignal.timeout(10000) });

    if (!ytRes.ok) {
      const errText = await ytRes.text();
      console.error('YouTube Data API error:', ytRes.status, errText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch video data from YouTube.', geminiStatus: ytRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const ytData = await ytRes.json();
    if (!ytData.items || ytData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Video not found. Check the URL and try again.' }),
        { status: 404, headers }
      );
    }

    const snippet = ytData.items[0].snippet;
    const videoTitle = snippet.title || '';
    const videoDescription = snippet.description || '';
    const existingTags: string[] = snippet.tags || [];

    // 2. Fetch transcript (optional, continue without it)
    let transcript: string | null = null;
    const lfKey = process.env.LF_YOUTUBE_KEY;
    if (lfKey) {
      try {
        const txUrl = `https://api.datafetchapi.com/v1/youtube/video/${videoId}/transcript/fast`;
        const txRes = await fetch(txUrl, {
          method: 'GET',
          headers: { 'X-API-KEY': lfKey },
          signal: AbortSignal.timeout(12000),
        });

        if (txRes.ok) {
          const txData = await txRes.json();
          // Extract text from transcript segments
          if (Array.isArray(txData?.transcript)) {
            transcript = txData.transcript.map((s: { text?: string }) => s.text || '').join(' ');
          } else if (typeof txData?.transcript === 'string') {
            transcript = txData.transcript;
          } else if (typeof txData?.text === 'string') {
            transcript = txData.text;
          }
        }
      } catch (txErr) {
        console.warn('Transcript fetch failed (continuing without):', txErr);
      }
    }

    // 3. Send to Gemini for analysis
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(videoTitle, videoDescription, existingTags, transcript) }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.5, maxOutputTokens: 2048 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }
      // Use 503 not 502 - Cloudflare intercepts 502 and hides the real error body
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.suggestedTags) || result.suggestedTags.length === 0) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify({
      videoTitle,
      existingTags,
      suggestedTags: result.suggestedTags,
      primaryKeyword: result.primaryKeyword || result.suggestedTags[0],
      tagStrategy: result.tagStrategy || '',
      warnings: result.warnings || [],
    }), { status: 200, headers });

  } catch (error) {
    console.error('generate-tags error:', error);
    return new Response(
      JSON.stringify({ error: 'Tag generation failed. Please try again.', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-tags',
};
