// v2
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function buildPrompt(
  topic: string,
  targetCustomer: string,
  product: string,
  scores: { buyerIntent: string; audienceRelevance: string; problemProximity: string; conversionOpportunity: string }
): string {
  const weakDimensions = [
    scores.buyerIntent !== 'High' ? `Buyer Intent is ${scores.buyerIntent} (viewer is not in decision mode)` : null,
    scores.audienceRelevance !== 'High' ? `Audience Relevance is ${scores.audienceRelevance} (topic may attract the wrong audience, not "${targetCustomer}")` : null,
    scores.problemProximity !== 'High' ? `Problem Proximity is ${scores.problemProximity} (viewer has no urgent active problem)` : null,
    scores.conversionOpportunity !== 'Strong' ? `Conversion Opportunity is ${scores.conversionOpportunity} (product introduction feels forced)` : null,
  ].filter(Boolean);

  const weakSummary = weakDimensions.length > 0
    ? 'The topic is weak on: ' + weakDimensions.join('; ') + '.'
    : 'The topic scores well overall — generate titles that maintain these strengths while improving specificity.';

  return `You are a YouTube content strategist for B2B businesses. A user evaluated this YouTube topic:

Topic: "${topic}"
Target Customer: "${targetCustomer}"
Product/Service: "${product}"

Dimension scores:
- Buyer Intent: ${scores.buyerIntent} (High = viewer is evaluating or deciding; Low = viewer is curious or learning)
- Audience Relevance: ${scores.audienceRelevance} (High = exactly "${targetCustomer}"; Low = wrong audience)
- Problem Proximity: ${scores.problemProximity} (High = viewer has an urgent, active problem; Low = passive interest)
- Conversion Opportunity: ${scores.conversionOpportunity} (Strong = natural product fit; Weak = forced or unrelated)

${weakSummary}

Generate exactly 3 alternative YouTube video titles. Each must:
- Be a specific, realistic title someone would actually search on YouTube
- Directly attract "${targetCustomer}" as the primary viewer
- Create a natural moment to mention or demonstrate "${product}"
- Score higher than the original on the weakest dimensions listed above
- Feel like a real video a credible B2B channel would publish — not generic or vague

Respond with this exact JSON and nothing else:
{
  "alternatives": [
    {
      "topic": "The exact video title",
      "fixes": "Which dimension(s) this improves, e.g. Buyer Intent",
      "explanation": "1-2 sentences: what kind of viewer this attracts and why it converts better for ${targetCustomer}."
    }
  ]
}`;
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

  // Accept either GEMINI_API_KEY or GOOGLE_API_KEY
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { topic, targetCustomer, product, scores } = body;

    if (!topic?.trim() || !targetCustomer?.trim() || !product?.trim() || !scores) {
      return new Response(
        JSON.stringify({ error: 'topic, targetCustomer, product, and scores are required' }),
        { status: 400, headers }
      );
    }

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(topic.trim(), targetCustomer.trim(), product.trim(), scores) }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded', debug: errText }), { status: 429, headers });
      }
      // Use 503 instead of 502 — Cloudflare intercepts 502 and hides the real error body
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.alternatives) || result.alternatives.length === 0) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error('generate-alternatives error:', error);
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-alternatives',
};
