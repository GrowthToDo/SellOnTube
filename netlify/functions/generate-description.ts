// generate-description.ts
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_INSTRUCTION = `You are a YouTube description writer for business channels. You write descriptions that rank in YouTube search and convert viewers into website visitors. Every description has:
1. Above-the-fold section (first 150 chars): keyword-rich hook + CTA link. This is what shows before "Show more".
2. Full description body: 3-4 short paragraphs expanding on the video topic, naturally including the target keyword 2-3 times.
3. Timestamps template: 5-6 suggested chapter markers based on the topic (format: 0:00 Introduction, etc.)
4. Tags: 5-8 relevant YouTube tags

Return JSON: {"aboveFold": "...", "fullDescription": "...", "timestamps": ["0:00 Introduction", ...], "tags": ["tag1", ...]}

Rules for descriptions:
- Never start with "In this video"
- Use the target keyword in the first sentence
- Include the CTA link in above-the-fold
- Write in conversational tone
- No em-dashes (use periods or commas instead)
- Do not use phrases like "Moreover", "Furthermore", "Additionally", "delve", "leverage", "utilize"
- The above-the-fold section must be under 150 characters (excluding the CTA link line)
- Respond ONLY with valid JSON. No preamble, no explanation, no markdown.`;

function buildUserPrompt(
  title: string,
  summary: string,
  keyword: string,
  websiteUrl: string,
  ctaLink: string
): string {
  return `Write a YouTube description for this video:

Video Title: ${title}
Video Summary: ${summary}
Target Keyword: ${keyword}
Website URL: ${websiteUrl}
CTA Link: ${ctaLink}

Rules:
1. Above-the-fold must hook with the target keyword and include the CTA link. Keep the hook text under 150 characters, then add the CTA link on a new line.
2. Full description body: 3-4 short paragraphs. Include the target keyword "${keyword}" naturally 2-3 times. No fluff. Write like a real person, not a marketer.
3. Timestamps: 5-6 chapter markers that make sense for this topic. Start with "0:00 Introduction".
4. Tags: 5-8 relevant YouTube tags for discoverability.

Return exactly this JSON format: {"aboveFold": "...", "fullDescription": "...", "timestamps": ["0:00 Introduction", ...], "tags": ["tag1", ...]}`;
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

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { title, summary, keyword, websiteUrl, ctaLink } = body;

    if (!title?.trim() || !summary?.trim() || !keyword?.trim() || !websiteUrl?.trim()) {
      return new Response(
        JSON.stringify({ error: 'title, summary, keyword, and websiteUrl are required' }),
        { status: 400, headers }
      );
    }

    const MAX_LEN = 500;
    if (title.trim().length > MAX_LEN || summary.trim().length > MAX_LEN || keyword.trim().length > MAX_LEN || websiteUrl.trim().length > MAX_LEN) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const resolvedCtaLink = (ctaLink?.trim() || websiteUrl.trim());

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{
            text: buildUserPrompt(title.trim(), summary.trim(), keyword.trim(), websiteUrl.trim(), resolvedCtaLink),
          }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 2048,
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
      aboveFold: result.aboveFold,
      fullDescription: result.fullDescription,
      timestamps: result.timestamps,
      tags: result.tags,
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
