const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_INSTRUCTION = `You are a YouTube content strategist. You receive a list of YouTube autocomplete keywords for a seed topic. Your job is to turn this raw list into actionable video topics.

RULES:
1. Merge near-duplicates (create/make/do/use variations: keep the best phrasing)
2. Remove low-value generics (seed + random noun with no intent signal, e.g. "ai presentations maker")
3. Flag reversed-intent keywords (e.g. "presentations about ai" = giving a talk about AI, not using AI for presentations): put these in a separate group
4. Group remaining keywords into 8-12 video topic clusters
5. Each cluster needs:
   - A primary keyword (the best phrasing for a video title)
   - 1-5 variation keywords (what else this video would rank for)
   - Intent category: comparison, mistakes, results, howto, research
   - Business value: high, medium, low
   - A one-sentence video angle (what the video should actually cover)
6. Sort clusters by business value (high first)
7. Every keyword from the input must appear in exactly one place: a cluster's primary, a cluster's variations, the removed list, or the reversedIntent list

Return valid JSON matching this exact structure:
{
  "clusters": [
    {
      "primary": "best ai presentation tools 2025",
      "variations": ["best ai presentations", "ai presentation tools compared"],
      "intent": "comparison",
      "value": "high",
      "angle": "Compare the top 5 AI presentation tools with live demos"
    }
  ],
  "removed": ["ai presentations maker"],
  "reversedIntent": ["presentations about ai"]
}`;

export default async (request: Request) => {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = ['https://sellontube.com', 'http://localhost:4321'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://sellontube.com';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
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
    const { keywords, seed, geography } = body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return new Response(
        JSON.stringify({ error: 'keywords must be a non-empty array' }),
        { status: 400, headers }
      );
    }

    if (!seed?.trim()) {
      return new Response(
        JSON.stringify({ error: 'seed is required' }),
        { status: 400, headers }
      );
    }

    if (keywords.length > 300) {
      return new Response(
        JSON.stringify({ error: 'Too many keywords (max 300)' }),
        { status: 400, headers }
      );
    }

    const keywordList = keywords.map((k: string) => String(k).trim()).filter(Boolean);
    const userPrompt = `SEED KEYWORD: ${seed.trim()}
GEOGRAPHY: ${geography || 'Global'}

KEYWORDS (${keywordList.length} total):
${keywordList.join('\n')}

Organize these into 8-12 video topic clusters. Merge duplicates, remove generics, flag reversed intent.`;

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.5,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: 'quota_exceeded', debug: errText }),
          { status: 429, headers }
        );
      }
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.clusters) || result.clusters.length === 0) {
      throw new Error('Invalid response: missing clusters array');
    }

    for (const cluster of result.clusters) {
      if (!cluster.primary || !Array.isArray(cluster.variations) || !cluster.intent || !cluster.value || !cluster.angle) {
        throw new Error('Invalid cluster structure');
      }
    }

    if (!Array.isArray(result.removed)) result.removed = [];
    if (!Array.isArray(result.reversedIntent)) result.reversedIntent = [];

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error('cluster-keywords error:', error);
    return new Response(
      JSON.stringify({ error: 'Clustering failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/cluster-keywords',
};
