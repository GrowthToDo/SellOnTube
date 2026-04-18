const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const VIDEO_TYPE_GUIDANCE: Record<string, string> = {
  'comparison': 'Structure the script around 3-4 comparison criteria that matter to buyers. Present each option fairly, then reveal which performs better for the specific use case. The product bridge should position the creator\'s product as one of the options or as the recommended choice based on the criteria discussed.',
  'how-to': 'Structure the script as a step-by-step process the viewer can follow. Each step should be specific and actionable. The product bridge should show how the creator\'s product fits naturally into one of the steps as the recommended tool or approach.',
  'mistakes': 'Structure the script around 3-5 specific mistakes with real consequences. For each mistake, explain what goes wrong and the correct approach. The product bridge should position the creator\'s product as the solution to one of the key mistakes.',
  'results': 'Structure the script around specific metrics and outcomes. Lead with the headline result, then break down how it was achieved. The product bridge should naturally credit the creator\'s product as part of the process that delivered the results.',
};

const SYSTEM_INSTRUCTION = `You are a YouTube script writer for business channels. You write scripts that convert viewers into leads and customers. Every script you produce is designed for a business that uses YouTube to acquire customers.

Your scripts follow this structure:
1. HOOK (first 15 seconds): A pattern interrupt that names the viewer's specific problem. No generic intros. No "hey guys". Start with the problem or a surprising claim.
2. SETUP (30-45 seconds): Why this problem matters. What it costs the viewer to ignore it. Build urgency without hype.
3. BODY (3-4 main points): Each point is specific, includes an example or data point, and teaches something actionable. Vary the depth. Not every point needs equal time.
4. PRODUCT BRIDGE (30-60 seconds): A natural transition from the teaching content to the creator's product. This should feel like a recommendation, not a pitch. "This is exactly why we built..." or "In our work with [customers], we..." patterns work well.
5. CTA (15-20 seconds): One clear next step. Usually a link in the description, a free resource, or booking a call.

Rules:
- Write in spoken English. Short sentences. Contractions. How a real person talks on camera.
- Include delivery notes in brackets: [pause], [show on screen], [cut to example].
- Never use corporate language: leverage, utilize, optimize, comprehensive, robust.
- Never write filler: "so without further ado", "let's dive in", "before we get started".
- The product mention must feel earned by the content, not shoehorned in.
- Target script length: 800-1200 words (roughly 5-8 minutes of video).

Respond ONLY with valid JSON. No preamble, no markdown.
Format: {"hook": "...", "setup": "...", "body": [{"heading": "...", "content": "..."}], "productBridge": "...", "cta": "...", "estimatedMinutes": N, "wordCount": N}`;

function buildUserPrompt(
  topic: string,
  videoType: string,
  targetCustomer: string,
  product: string
): string {
  const guidance = VIDEO_TYPE_GUIDANCE[videoType] || VIDEO_TYPE_GUIDANCE['how-to'];

  return `Write a complete YouTube video script for:

Video Topic: ${topic}
Video Type: ${videoType}
Target Customer: ${targetCustomer}
Creator's Product/Service: ${product}

Script structure guidance for this video type:
${guidance}

Rules:
1. The hook must name the target customer's specific problem in the first sentence.
2. The body should have 3-4 main points, each with a specific example or data point.
3. The product bridge must transition naturally from teaching to mentioning "${product}". It should feel like a recommendation from someone who just taught the viewer something valuable.
4. The CTA should direct viewers to a single action (link in description, free resource, or booking page).
5. Write in spoken English. Short sentences. Contractions. Real speech patterns.
6. Include [delivery notes] for on-screen elements, pauses, and cuts.
7. Target 800-1200 words total.

Return as JSON: {"hook": "...", "setup": "...", "body": [{"heading": "...", "content": "..."}], "productBridge": "...", "cta": "...", "estimatedMinutes": N, "wordCount": N}`;
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
    const { topic, videoType, targetCustomer, product } = body;

    if (!topic?.trim() || !videoType?.trim() || !targetCustomer?.trim() || !product?.trim()) {
      return new Response(
        JSON.stringify({ error: 'topic, videoType, targetCustomer, and product are required' }),
        { status: 400, headers }
      );
    }

    const MAX_LEN = 500;
    if (topic.trim().length > MAX_LEN || targetCustomer.trim().length > MAX_LEN || product.trim().length > MAX_LEN) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const validTypes = ['comparison', 'how-to', 'mistakes', 'results'];
    if (!validTypes.includes(videoType.trim())) {
      return new Response(
        JSON.stringify({ error: 'Invalid videoType. Must be one of: comparison, how-to, mistakes, results' }),
        { status: 400, headers }
      );
    }

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{
            text: buildUserPrompt(topic.trim(), videoType.trim(), targetCustomer.trim(), product.trim()),
          }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.8,
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
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!result?.hook || !result?.body || !Array.isArray(result.body)) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error('generate-script error:', error);
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-script',
};
