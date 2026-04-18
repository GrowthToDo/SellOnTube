// generate-description.ts

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function appendUtm(ctaLink: string, videoTitle: string): string {
  const slug = slugify(videoTitle);
  const separator = ctaLink.includes('?') ? '&' : '?';
  return `${ctaLink}${separator}utm_source=youtube&utm_medium=video&utm_campaign=${slug}`;
}

const SYSTEM_INSTRUCTION = `You are a YouTube description writer for business channels. You analyze existing video metadata and transcripts to write descriptions that rank in YouTube search and convert viewers into website visitors.

You receive: the video title, existing description, transcript (if available), and a CTA link with UTM parameters.

Generate:
1. Above-the-fold section (first 150 chars): keyword-rich hook based on the video's actual content. Include the CTA link (provided to you) on a new line right after the hook text. This is what shows before "Show more".
2. Full description body: 3-4 short paragraphs expanding on the video topic based on what the transcript actually covers. Naturally include relevant keywords 2-3 times.
3. Timestamps/chapters: If a transcript is provided, generate accurate timestamps based on topic transitions in the transcript. Format: "0:00 Introduction\\n1:15 Topic name\\n...". Generate 5-10 chapters. If no transcript is available, generate 5-6 plausible chapter markers based on the topic.
4. Tags: 8-12 relevant YouTube tags based on the video content.

Return JSON: {"aboveFold": "...", "fullDescription": "...", "timestamps": ["0:00 Introduction", ...], "tags": ["tag1", ...]}

Rules:
- Never start with "In this video"
- Use relevant keywords from the video content in the first sentence
- Include the CTA link in the above-the-fold section (on its own line after the hook)
- Write in conversational tone
- No em-dashes (use periods or commas instead)
- Do not use phrases like "Moreover", "Furthermore", "Additionally", "delve", "leverage", "utilize"
- The above-the-fold hook text must be under 150 characters (the CTA link line is separate and does not count)
- Write for buyers, not viewers. The audience is business owners evaluating solutions.
- Respond ONLY with valid JSON. No preamble, no explanation, no markdown.`;

function buildUserPrompt(
  videoTitle: string,
  existingDescription: string,
  transcript: string | null,
  ctaLinkWithUtm: string
): string {
  let prompt = `Write an optimized YouTube description for this existing video:

Video Title: ${videoTitle}
Existing Description: ${existingDescription || '(none)'}
CTA Link (include this in above-the-fold): ${ctaLinkWithUtm}
`;

  if (transcript) {
    prompt += `\nTranscript (use this to generate accurate timestamps and understand the video content):\n${transcript.slice(0, 8000)}\n`;
  } else {
    prompt += `\nNo transcript available. Generate plausible timestamps based on the video title and description.\n`;
  }

  prompt += `
Rules:
1. Above-the-fold: Write a keyword-rich hook under 150 characters, then on a new line add the CTA link: ${ctaLinkWithUtm}
2. Full description body: 3-4 short paragraphs based on the actual video content. Include relevant keywords naturally 2-3 times. No fluff.
3. Timestamps: ${transcript ? 'Generate accurate chapter markers based on the transcript topic transitions.' : 'Generate 5-6 plausible chapter markers.'} Start with "0:00 Introduction". Format each as "M:SS Topic name" or "MM:SS Topic name".
4. Tags: 8-12 relevant YouTube tags for discoverability.

Return exactly this JSON format: {"aboveFold": "...", "fullDescription": "...", "timestamps": ["0:00 Introduction", ...], "tags": ["tag1", ...]}`;

  return prompt;
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

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
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
    const { videoUrl, ctaLink, addUtm } = body;

    if (!videoUrl?.trim()) {
      return new Response(
        JSON.stringify({ error: 'videoUrl is required' }),
        { status: 400, headers }
      );
    }

    if (!ctaLink?.trim()) {
      return new Response(
        JSON.stringify({ error: 'ctaLink is required' }),
        { status: 400, headers }
      );
    }

    // Validate CTA link format
    if (!ctaLink.trim().match(/^https?:\/\/.+/)) {
      return new Response(
        JSON.stringify({ error: 'CTA link must start with http:// or https://' }),
        { status: 400, headers }
      );
    }

    // Step 1: Extract video ID
    const videoId = extractVideoId(videoUrl.trim());
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Could not extract a valid YouTube video ID from the URL provided.' }),
        { status: 400, headers }
      );
    }

    // Step 2: Fetch video metadata via YouTube Data API
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
    );

    if (!ytRes.ok) {
      const ytErr = await ytRes.text();
      console.error('YouTube Data API error:', ytRes.status, ytErr);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch video metadata from YouTube.', detail: ytErr.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const ytData = await ytRes.json();
    const videoSnippet = ytData?.items?.[0]?.snippet;

    if (!videoSnippet) {
      return new Response(
        JSON.stringify({ error: 'Video not found. Please check the URL and make sure the video is public.' }),
        { status: 404, headers }
      );
    }

    const videoTitle = videoSnippet.title || '';
    const existingDescription = videoSnippet.description || '';
    const existingTags: string[] = videoSnippet.tags || [];

    // Step 3: Fetch transcript via DataFetchAPI (non-blocking, continue if it fails)
    let transcript: string | null = null;
    const lfKey = process.env.LF_YOUTUBE_KEY;

    if (lfKey) {
      try {
        const txRes = await fetch(
          `https://api.datafetchapi.com/v1/youtube/video/${videoId}/transcript/fast`,
          { headers: { 'X-API-KEY': lfKey } }
        );

        if (txRes.ok) {
          const txData = await txRes.json();
          // Build transcript text from segments
          if (Array.isArray(txData?.data)) {
            transcript = txData.data
              .map((seg: { text?: string; start?: number }) => {
                const mins = Math.floor((seg.start || 0) / 60);
                const secs = Math.floor((seg.start || 0) % 60);
                const ts = `${mins}:${secs.toString().padStart(2, '0')}`;
                return `[${ts}] ${seg.text || ''}`;
              })
              .join('\n');
          }
        } else {
          console.warn('Transcript fetch failed (continuing without it):', txRes.status);
        }
      } catch (txErr) {
        console.warn('Transcript fetch error (continuing without it):', txErr);
      }
    }

    // Step 4: Build CTA link with UTMs
    const shouldAddUtm = addUtm !== false; // default true
    const ctaWithUtm = shouldAddUtm ? appendUtm(ctaLink.trim(), videoTitle) : ctaLink.trim();

    // Step 5: Send to Gemini Flash
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{
            text: buildUserPrompt(videoTitle, existingDescription, transcript, ctaWithUtm),
          }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
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

    if (!result?.aboveFold || !result?.fullDescription || !Array.isArray(result?.timestamps) || !Array.isArray(result?.tags)) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify({
      videoTitle,
      aboveFold: result.aboveFold,
      fullDescription: result.fullDescription,
      timestamps: result.timestamps,
      tags: result.tags,
      ctaWithUtm,
      hasTranscript: !!transcript,
    }), { status: 200, headers });
  } catch (error) {
    console.error('generate-description error:', error);
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-description',
};
