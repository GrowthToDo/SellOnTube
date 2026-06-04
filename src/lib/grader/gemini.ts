// Single Gemini API entry point for the Listing Grader.
// All AI calls go through this file — nowhere else.
// No Astro imports — portable across any runtime.

import { GEMINI_API_URL, GEMINI_TIMEOUT_MS, GEMINI_MAX_RETRIES } from './config.js';

function getApiKey(): string | null {
  return (
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GOOGLE_API_KEY) ||
    null
  );
}

async function callGemini(prompt: string, wantJson: boolean): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('[gemini] No API key found (GEMINI_API_KEY or GOOGLE_API_KEY)');
    return null;
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: wantJson ? 0.2 : 0.4,
      maxOutputTokens: 2048,
      ...(wantJson ? { responseMimeType: 'application/json' } : {}),
    },
  };

  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      });

      if (res.status === 429 || res.status >= 500) {
        if (attempt < GEMINI_MAX_RETRIES) {
          const delay = Math.pow(2, attempt + 1) * 1000;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        console.error(`[gemini] HTTP ${res.status} after ${attempt + 1} attempts`);
        return null;
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => 'unknown');
        console.error(`[gemini] HTTP ${res.status}: ${errText.substring(0, 200)}`);
        return null;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error('[gemini] Empty response from model');
        return null;
      }
      return text;
    } catch (err) {
      if (attempt < GEMINI_MAX_RETRIES) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      console.error('[gemini] Request failed:', err instanceof Error ? err.message : err);
      return null;
    }
  }
  return null;
}

function stripJsonFences(raw: string): string {
  let s = raw.trim();
  if (s.startsWith('```json')) s = s.slice(7);
  else if (s.startsWith('```')) s = s.slice(3);
  if (s.endsWith('```')) s = s.slice(0, -3);
  s = s.trim();
  // Trim to outer braces
  const firstBrace = s.indexOf('{');
  const lastBrace = s.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    s = s.substring(firstBrace, lastBrace + 1);
  }
  return s;
}

/**
 * Call Gemini and parse the response as JSON.
 * Returns the parsed object or null on any failure.
 * On malformed JSON, retries once with a stricter "JSON only" instruction.
 */
export async function callJson<T = Record<string, unknown>>(prompt: string): Promise<T | null> {
  const raw = await callGemini(prompt, true);
  if (!raw) return null;

  try {
    return JSON.parse(stripJsonFences(raw)) as T;
  } catch {
    // One stricter retry
    const retryRaw = await callGemini(
      prompt + '\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY a valid JSON object. No markdown, no code fences, no explanation.',
      true
    );
    if (!retryRaw) return null;
    try {
      return JSON.parse(stripJsonFences(retryRaw)) as T;
    } catch {
      console.error('[gemini] Failed to parse JSON after retry');
      return null;
    }
  }
}

/**
 * Call Gemini and return the response as plain text.
 * Returns the text string or null on failure.
 */
export async function callText(prompt: string): Promise<string | null> {
  return callGemini(prompt, false);
}
