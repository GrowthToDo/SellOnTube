// AI review analysis using Gemini — the ONLY AI call in the scraper tool.
// Input: real parsed reviews. Output: structured analysis or null on any error.
// No Astro imports.

import { GEMINI_API_URL } from './config.js';

export interface ReviewAnalysis {
  executive_summary: string;
  key_strengths: string[];
  key_weaknesses: string[];
  overall_perception: string;
  loves: Array<{ theme: string; detail: string }>;
  complaints: Array<{ theme: string; detail: string }>;
}

export async function summarizeReviews(
  reviews: Array<{ body: string; rating: number }>,
  geminiApiKey: string
): Promise<ReviewAnalysis | null> {
  if (!geminiApiKey || reviews.length === 0) return null;

  const reviewsText = reviews
    .map((r, i) => `Review ${i + 1} (${r.rating}/5): ${r.body}`)
    .join('\n\n');

  const prompt = `You are analyzing real customer reviews for a Shopify app. Based ONLY on the reviews provided below, return JSON with this exact structure:

{
  "executive_summary": "2-3 sentence overview of what merchants think about this app overall",
  "key_strengths": ["strength 1", "strength 2", "strength 3"],
  "key_weaknesses": ["weakness 1", "weakness 2"],
  "overall_perception": "One sentence: is this app generally recommended, mixed, or not recommended by merchants?",
  "loves": [
    {"theme": "Short theme name", "detail": "One sentence explaining what merchants say about this"},
    {"theme": "Short theme name", "detail": "One sentence explaining what merchants say about this"}
  ],
  "complaints": [
    {"theme": "Short theme name", "detail": "One sentence explaining what merchants say about this"}
  ]
}

Rules:
- 3-5 items in loves, 1-5 items in complaints
- If all reviews are positive, complaints can have 0-1 items
- key_strengths: 3-5 short phrases
- key_weaknesses: 0-3 short phrases (empty array if none found)
- Do not invent anything not supported by the reviews
- Theme names should be 2-4 words max
- Details should be specific, citing patterns from actual reviews

Reviews:
${reviewsText}`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (
      typeof parsed.executive_summary === 'string' &&
      Array.isArray(parsed.loves) &&
      Array.isArray(parsed.complaints)
    ) {
      return parsed as ReviewAnalysis;
    }
    return null;
  } catch {
    return null;
  }
}
