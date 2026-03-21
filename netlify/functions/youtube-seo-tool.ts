// youtube-seo-tool.ts
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

function stripHtml(html: string): string {
  // Remove script and style blocks entirely
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // Remove all remaining tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

async function fetchWebsiteText(url: string): Promise<string | null> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    return null;
  }
  try {
    const siteRes = await fetch(parsedUrl.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SellonTube-SEO-Checker/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!siteRes.ok) return null;
    const html = await siteRes.text();
    const stripped = stripHtml(html);
    return stripped.slice(0, 3000);
  } catch {
    return null;
  }
}

const SYSTEM_INSTRUCTION = `You are a YouTube SEO analyst for B2B businesses. Your job is to evaluate a YouTube video's metadata — title, description, and chapter labels — and score how well it attracts buyers in the consideration or decision stage.

You receive:
- A video title
- A video description
- A business website summary (may be null if the site was unavailable)

Your output must be a single valid JSON object. No preamble, no explanation, no markdown fences.

## Scoring Framework

Score each of five dimensions from 0–20. Total = sum of all five (0–100).

### 1. Title Relevance (0–20)
Measure bottom-of-funnel (BoFu) alignment, not keyword presence.
- ToFu titles ("What is X", "Introduction to Y", "How I...", "My experience with...") → 0–5
- Mid-funnel how-to titles → 6–14
- Buyer-intent signals present ("best," "vs," "review," "cost," "alternatives," "fix," "setup," "how to choose," "pricing") → 15–20
- Problem-solving or comparison framing → 15–20
fix: If score < 15, provide an ACTUAL rewritten title in BoFu frame. If score >= 15, set fix to null.

### 2. Description Opening (0–20)
Two layers combined:
- Part A (0–10): Do the first 150 characters include a keyword and a clear value proposition?
- Part B (0–10): Do buyer-intent keywords appear naturally throughout the description body?
fix: If score < 15, provide ACTUAL first 150 characters rewritten. If score >= 15, set fix to null.

### 3. Keyword Coverage (0–20)
Identify 3 buyer-intent keywords the video should rank for based on the title, description, and business context. Score how many appear naturally in the description (0, 1, 2, or all 3).
- 0 keywords present → 0–4
- 1 keyword present → 5–10
- 2 keywords present → 11–16
- All 3 present → 17–20
fix: If score < 15, list the exact 3 keywords to weave into the description. If score >= 15, set fix to null.

### 4. CTA Quality (0–20)
- No CTA anywhere → 0–3
- CTA present but only below the fold (after 150 chars) → 4–10
- Bare URL only, no action text → 4 maximum
- Action-oriented CTA toward a business outcome ("book a call," "download," "start free trial," "get the template") → adds 8–10 pts
- Strong above-fold CTA with action text → 18–20
fix: If score < 15, provide ACTUAL CTA copy with placement instruction (e.g., "Place in the first 150 chars: 'Book a free strategy call: [URL]'"). If score >= 15, set fix to null.

### 5. Chapter Labels (0–20)
- No timestamps at all → 0
- Timestamps present but labels are bland ("Intro," "Part 1," "Overview") → 6–10
- Descriptive labels that tell the viewer what they will learn → 11–15
- Searchable buyer-intent labels that a prospect would type as a search query → 16–20
fix: If score < 15, generate 4–5 ACTUAL chapter labels in the format "00:00 Label text here". If score >= 15, set fix to null.

## recommended_keywords
List exactly 3 buyer-intent keywords the video should rank for. Base these on the title, description, and business context. Choose keywords that real buyers would search when evaluating a product or service, not general education searches.

## business_summary
One sentence: what this business sells and who they serve. If websiteText is null, infer from the video content. Be specific. Example: "Helps SaaS founders add YouTube as a B2B acquisition channel."

## headline_diagnosis
One sentence naming the single biggest reason this video is not found by buyers. Be direct and specific. Example: "The title targets curiosity, not purchase intent — a buyer searching for a solution will never see this."

## Anti-AI self-audit (run before returning)
Check every string in your output. Remove or rewrite anything that contains:
- AI vocabulary: emphasizing, fostering, landscape, testament, delve, utilize, leverage, robust, comprehensive, seamless, elevate, empower, unlock, game-changer, dive into, cutting-edge
- Negative parallelisms ("not just X, it's Y")
- Em dashes
- Rule-of-three lists (X, Y, and Z sentence endings)
- Filler phrases ("in order to," "due to the fact that," "it is worth noting that")
- Vague claims — replace with concrete specifics

After the self-audit, return the final JSON only.

## Output schema
{
  "business_summary": "string",
  "recommended_keywords": ["string", "string", "string"],
  "scores": {
    "title":       { "score": 0-20, "label": "Title Relevance",     "fix": "string or null" },
    "description": { "score": 0-20, "label": "Description Opening",  "fix": "string or null" },
    "keywords":    { "score": 0-20, "label": "Keyword Coverage",     "fix": "string or null" },
    "cta":         { "score": 0-20, "label": "CTA Quality",          "fix": "string or null" },
    "chapters":    { "score": 0-20, "label": "Chapter Labels",       "fix": "string or null" }
  },
  "total_score": 0-100,
  "headline_diagnosis": "string"
}`;

function buildUserPrompt(
  title: string,
  description: string,
  websiteText: string | null
): string {
  const websiteSection = websiteText
    ? `Website text (first 3,000 chars):\n${websiteText}`
    : `Website text: Not available — infer business context from the video content.`;

  return `Evaluate this YouTube video's SEO metadata for buyer intent.

Video title: ${title}

Video description:
${description}

${websiteSection}

Score each dimension as specified. Return only the JSON object.`;
}

interface DataFetchVideoResponse {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

interface SeoToolResponse {
  business_summary: string;
  recommended_keywords: string[];
  scores: {
    title: { score: number; label: string; fix: string | null };
    description: { score: number; label: string; fix: string | null };
    keywords: { score: number; label: string; fix: string | null };
    cta: { score: number; label: string; fix: string | null };
    chapters: { score: number; label: string; fix: string | null };
  };
  total_score: number;
  headline_diagnosis: string;
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

  const youtubeApiKey = process.env.LF_YOUTUBE_KEY;
  if (!youtubeApiKey) {
    console.error('LF_YOUTUBE_KEY environment variable is not set');
    return new Response(
      JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
      { status: 500, headers }
    );
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { videoUrl, websiteUrl } = body;

    if (!videoUrl?.trim()) {
      return new Response(
        JSON.stringify({ error: 'That doesn\'t look like a valid YouTube URL. Try pasting the full link from your browser.' }),
        { status: 400, headers }
      );
    }

    // Fix 3: Input length limits
    const MAX_URL = 2000;
    if (videoUrl.length > MAX_URL || (websiteUrl && websiteUrl.length > MAX_URL)) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the maximum allowed length.' }),
        { status: 400, headers }
      );
    }

    // Step 1: Extract video ID
    const videoId = extractVideoId(videoUrl.trim());
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'That doesn\'t look like a valid YouTube URL. Try pasting the full link from your browser.' }),
        { status: 400, headers }
      );
    }

    // Step 2: Fetch video metadata from DataFetch API
    const dataFetchRes = await fetch(`https://api.datafetchapi.com/v1/youtube/video/${videoId}`, {
      method: 'GET',
      headers: { 'X-API-KEY': youtubeApiKey },
    });

    if (!dataFetchRes.ok) {
      const errText = await dataFetchRes.text();
      console.error('DataFetch API error:', dataFetchRes.status, errText.slice(0, 200));
      if (dataFetchRes.status === 404) {
        return new Response(
          JSON.stringify({ error: 'We couldn\'t access that video. Make sure it\'s public and the URL is correct.' }),
          { status: 400, headers }
        );
      }
      if (dataFetchRes.status === 403) {
        return new Response(
          JSON.stringify({ error: 'That video is private or age-restricted. Only public videos can be analysed.' }),
          { status: 400, headers }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
        { status: 500, headers }
      );
    }

    // Fix 4: Type the DataFetch response
    const videoData = await dataFetchRes.json() as DataFetchVideoResponse;
    const title: string = videoData?.title ?? '';
    const description: string = videoData?.description ?? '';

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'We couldn\'t access that video. Make sure it\'s public and the URL is correct.' }),
        { status: 400, headers }
      );
    }

    // Step 3: Fetch website text (Fix 1: SSRF-safe via fetchWebsiteText)
    let websiteText: string | null = null;
    if (websiteUrl?.trim()) {
      websiteText = await fetchWebsiteText(websiteUrl);
    }

    // Step 4: Gemini call
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{
            text: buildUserPrompt(title, description, websiteText),
          }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
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
    const raw: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Fix 2: Guard JSON.parse
    let result: SeoToolResponse;
    try {
      result = JSON.parse(raw) as SeoToolResponse;
    } catch {
      console.error('Gemini JSON parse failure. raw:', raw?.slice(0, 300));
      return new Response(
        JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
        { status: 500, headers }
      );
    }

    // Validate response shape
    if (!result?.scores || typeof result?.total_score !== 'number') {
      throw new Error('Invalid response structure from Gemini');
    }

    // Fix 6: Clamp score ranges
    if (typeof result.total_score !== 'number' || result.total_score < 0 || result.total_score > 100) {
      result.total_score = Math.min(100, Math.max(0, Number(result.total_score) || 0));
    }
    const dimensionKeys = ['title', 'description', 'keywords', 'cta', 'chapters'] as const;
    for (const key of dimensionKeys) {
      const dim = result.scores[key];
      if (dim && typeof dim.score === 'number') {
        dim.score = Math.min(20, Math.max(0, dim.score));
      }
    }

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error('youtube-seo-tool error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/youtube-seo-tool',
};
