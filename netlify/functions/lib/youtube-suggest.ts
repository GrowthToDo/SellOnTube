// YouTube Autocomplete / Suggest wrapper
// Uses the undocumented but widely-used YouTube suggest endpoint.
// No API key required. No quota.

const SUGGEST_URL = 'https://clients1.google.com/complete/search';

/**
 * Get YouTube search suggestions for a query.
 * Returns an array of suggestion strings.
 */
export async function getSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];

  const url = `${SUGGEST_URL}?client=youtube&ds=yt&q=${encodeURIComponent(query.trim())}&hl=en&gl=us`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SellonTube/1.0)' },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    console.error('YouTube suggest error:', res.status);
    return [];
  }

  const text = await res.text();
  return parseSuggestResponse(text);
}

/**
 * Expand a seed query by appending each letter a-z and collecting suggestions.
 * Returns deduplicated suggestions sorted alphabetically.
 * Makes 27 requests (base + 26 letters). Be mindful of rate limits.
 */
export async function getExpandedSuggestions(query: string): Promise<string[]> {
  const seed = query.trim().toLowerCase();
  if (!seed) return [];

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const queries = [seed, ...alphabet.map((letter) => `${seed} ${letter}`)];

  // Run in batches of 5 to avoid hammering the endpoint
  const allSuggestions: string[] = [];

  for (let i = 0; i < queries.length; i += 5) {
    const batch = queries.slice(i, i + 5);
    const results = await Promise.all(batch.map((q) => getSuggestions(q)));
    for (const suggestions of results) {
      allSuggestions.push(...suggestions);
    }
  }

  // Deduplicate and sort
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const s of allSuggestions) {
    const normalized = s.toLowerCase().trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }
  unique.sort();
  return unique;
}

/**
 * Parse the JSONP-like response from YouTube suggest.
 * Response format: window.google.ac.h(["query",[["suggestion1"],["suggestion2"],...]])
 */
function parseSuggestResponse(text: string): string[] {
  try {
    // Extract the JSON array from the JSONP wrapper
    const match = text.match(/\((\[[\s\S]+\])\)$/);
    if (!match) return [];

    const parsed = JSON.parse(match[1]);
    // parsed[1] is the array of suggestion arrays
    const suggestions: any[] = parsed?.[1] ?? [];

    return suggestions
      .map((item: any) => (Array.isArray(item) ? String(item[0] ?? '') : ''))
      .filter(Boolean);
  } catch (e) {
    console.error('Failed to parse YouTube suggest response:', e);
    return [];
  }
}
