// generate-video-ideas.ts
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_INSTRUCTION = `You are a YouTube content strategist specialising in buyer-intent video ideas for B2B businesses. Your job is to generate YouTube video ideas that attract viewers who are actively evaluating, comparing, or purchasing products or services — not viewers who are learning or exploring.

Every idea you generate must score HIGH on all four BuyerFit dimensions:
- Buyer Intent: the topic signals evaluation, comparison, or a purchase decision (not curiosity or learning)
- Audience Fit: the topic primarily attracts the specified target customer, not a broader or different audience
- Problem Urgency: the viewer is actively experiencing a problem they need solved now, not passively interested
- Conversion Path: the video has a natural, non-forced moment to introduce or demonstrate the product/service

You must NEVER generate:
- "What is X" or definition topics
- "Why X is important" awareness topics
- "How X works" overview or explainer topics
- Beginner guides or broad tutorials
- Topics where the viewer could solve their problem without any product or service
- Topics starting with "How to" unless paired with strong buyer signals (best, vs, alternatives, pricing, comparison)

Use these proven BoFu topic patterns: best-of comparisons, product vs product, alternatives to X, pricing evaluations, use-case specific recommendations, mistakes to avoid before buying, decision criteria, migration topics, case study / results topics.

Respond ONLY with a valid JSON object. No preamble, no explanation, no markdown. Format:
{"ideas": ["Video idea 1", "Video idea 2", "Video idea 3", "Video idea 4", "Video idea 5"]}`;

function buildUserPrompt(
  product: string,
  url: string | undefined,
  targetCustomer: string,
  problemSolved: string,
  currentYear: number
): string {
  const urlLine = url?.trim() ? `\nProduct URL: ${url.trim()}` : '';
  return `Generate 5 buyer-intent YouTube video ideas for the following business:

Product/Service: ${product}${urlLine}
Target Customer: ${targetCustomer}
Problem it solves: ${problemSolved}
Current year: ${currentYear}

Each idea must:
- Score High on Buyer Intent — use signals like: best, vs, alternatives, comparison, review, pricing, cost, mistakes, migration, results
- Attract ${targetCustomer} as the primary viewer — not developers, hobbyists, or general audiences
- Create a natural moment to demonstrate or recommend ${product} without it feeling forced
- Be specific enough to rank on YouTube as a distinct search query
- When including a year in the title, use ${currentYear} — never use a past year

Return exactly 5 ideas as a JSON object: {"ideas": ["...", "...", "...", "...", "..."]}`;
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
    const { product, url, targetCustomer, problemSolved } = body;

    if (!product?.trim() || !targetCustomer?.trim() || !problemSolved?.trim()) {
      return new Response(
        JSON.stringify({ error: 'product, targetCustomer, and problemSolved are required' }),
        { status: 400, headers }
      );
    }

    const MAX_SHORT = 500;
    const MAX_URL = 2000;
    if (
      product.trim().length > MAX_SHORT ||
      targetCustomer.trim().length > MAX_SHORT ||
      problemSolved.trim().length > MAX_SHORT ||
      (url?.trim() && url.trim().length > MAX_URL)
    ) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const currentYear = new Date().getFullYear();

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{
            text: buildUserPrompt(product.trim(), url, targetCustomer.trim(), problemSolved.trim(), currentYear),
          }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.8,
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
      // Use 503 not 502 — Cloudflare intercepts 502 and replaces the response body
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.ideas) || result.ideas.length === 0) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify({ ideas: result.ideas }), { status: 200, headers });
  } catch (error) {
    console.error('generate-video-ideas error:', error);
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-video-ideas',
};
