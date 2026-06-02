// Fetch layer for Shopify App Store reviews.
// No Astro imports — portable across any runtime.

import { USER_AGENT } from './config.js';

const SHOPIFY_APP_URL_RE = /^https?:\/\/(apps\.shopify\.com)\/([a-z0-9-]+)(\/reviews)?/i;

export function isValidListingUrl(url: string): boolean {
  return SHOPIFY_APP_URL_RE.test(url.trim());
}

export function extractHandle(url: string): string | null {
  const m = url.trim().match(SHOPIFY_APP_URL_RE);
  return m ? m[2] : null;
}

export function reviewsUrl(handle: string, page: number): string {
  return `https://apps.shopify.com/${handle}/reviews?page=${page}`;
}

export async function fetchWithRetry(
  url: string,
  maxRetries = 3
): Promise<string> {
  if (!url.startsWith('https://apps.shopify.com/')) {
    throw new Error(`Refusing to fetch non-Shopify URL: ${url}`);
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${url}`);
      }
      return await res.text();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError ?? new Error(`Failed to fetch ${url}`);
}
