// generate-titles.ts
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const VIDEO_TYPE_GUIDANCE: Record<string, string> = {
  'comparison': 'Generate titles using patterns like "X vs Y for [audience]", "Best X for [use case]", "Is X worth it for [audience]?", "Top X for [specific need]", "X alternatives for [audience]". These attract viewers actively comparing options before a purchase decision.',
  'how-to': 'Generate titles using patterns like "How to [solve specific problem] with X", "How to set up X for [use case]", "How to migrate from X to Y", "How to [achieve specific outcome] in [timeframe]". These attract viewers trying to accomplish a specific task related to buying or implementing a solution.',
  'mistakes': 'Generate titles using patterns like "X mistakes when choosing [product category]", "Why your [solution] is not working", "Red flags when buying X", "Stop doing X if you want [outcome]". These attract viewers in the evaluation stage who want to avoid bad decisions.',
  'results': 'Generate titles using patterns like "[Metric] results after [timeframe] with X", "How we achieved [outcome] using X", "X ROI breakdown for [industry]", "[Company type] case study: X results". These attract viewers looking for proof before committing to a purchase.',
};

const SYSTEM_INSTRUCTION = `You are a YouTube title strategist specialising in buyer-intent titles for business channels. Your job is to generate YouTube video titles that attract viewers who are actively evaluating, comparing, or purchasing products or services.

Every title you generate must:
- Be under 60 characters (STRICT LIMIT - count carefully)
- Attract viewers in the consideration or decision stage of buying
- Be specific enough to rank on YouTube search
- Allow the video creator to naturally position their product or service in the video

You must NEVER generate:
- Clickbait titles (ALL CAPS words, "You Won't Believe", false urgency, misleading hooks, excessive punctuation)
- Vague or generic titles ("The Ultimate Guide to X", "Everything You Need to Know")
- Awareness or educational titles ("What is X", "Why X matters", "X explained")
- Titles with emojis
- Titles that would attract general learners instead of buyers

For each title, provide:
- The title text (under 60 characters - this is critical)
- A buyer intent rating: High, Medium, or Low
- A one-sentence reason explaining who this title attracts and why they are likely to buy

Respond ONLY with a valid JSON object. No preamble, no explanation, no markdown.
Format: {"titles": [{"title": "...", "buyerIntent": "High", "reason": "..."}]}`;

function buildUserPrompt(
  topic: string,
  videoType: string,
  targetCustomer: string
): string {
  const guidance = VIDEO_TYPE_GUIDANCE[videoType] || VIDEO_TYPE_GUIDANCE['comparison'];

  return `Generate 3 buyer-intent YouTube video titles for:

Video Topic: ${topic}
Video Type: ${videoType}
Target Customer: ${targetCustomer}

Title format guidance:
${guidance}

Rules:
1. Every title MUST be under 60 characters. Count carefully.
2. Every title must attract "${targetCustomer}" specifically, not general audiences.
3. Every title must create a natural opportunity for the creator to demonstrate or recommend their product in the resulting video.
4. Titles must be realistic, searchable queries that a real person would type into YouTube.
5. Do not use generic filler words like "ultimate", "complete", "definitive", "comprehensive".

Return exactly 3 titles as JSON: {"titles": [{"title": "...", "buyerIntent": "High|Medium|Low", "reason": "..."}]}`;
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
    const { topic, videoType, targetCustomer } = body;

    if (!topic?.trim() || !videoType?.trim() || !targetCustomer?.trim()) {
      return new Response(
        JSON.stringify({ error: 'topic, videoType, and targetCustomer are required' }),
        { status: 400, headers }
      );
    }

    const MAX_LEN = 500;
    if (topic.trim().length > MAX_LEN || targetCustomer.trim().length > MAX_LEN) {
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
            text: buildUserPrompt(topic.trim(), videoType.trim(), targetCustomer.trim()),
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
      // Use 503 not 502 - Cloudflare intercepts 502 and replaces the response body
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.titles) || result.titles.length === 0) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify({ titles: result.titles }), { status: 200, headers });
  } catch (error) {
    console.error('generate-titles error:', error);
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-titles',
};
