import { isValidListingUrl, extractHandle, reviewsUrl, fetchWithRetry } from '../../src/lib/reviews/scraper.js';
import { parseReviewsPage } from '../../src/lib/reviews/parser.js';
import { summarizeReviews } from '../../src/lib/reviews/summarizer.js';
import { MAX_PAGES } from '../../src/lib/reviews/config.js';

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

  try {
    const body = await request.json();
    const { url, page = 1 } = body;

    if (!url || !isValidListingUrl(url)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid Shopify app URL (e.g. https://apps.shopify.com/loox)' }),
        { status: 400, headers }
      );
    }

    const handle = extractHandle(url);
    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Could not extract app handle from URL.' }),
        { status: 400, headers }
      );
    }

    const clampedPage = Math.max(1, Math.min(page, MAX_PAGES));
    const targetUrl = reviewsUrl(handle, clampedPage);

    let html: string;
    try {
      html = await fetchWithRetry(targetUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return new Response(
        JSON.stringify({
          error: "We couldn't extract reviews for this app. Please check the URL and try again.",
          detail: msg,
        }),
        { status: 503, headers }
      );
    }

    const parsed = parseReviewsPage(html, clampedPage);

    if (parsed.reviews.length === 0 && clampedPage === 1) {
      return new Response(
        JSON.stringify({ error: 'No reviews found for this app.' }),
        { status: 200, headers }
      );
    }

    // AI summary on page 1 only
    let sentiment = null;
    if (clampedPage === 1 && parsed.reviews.length >= 3) {
      const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (geminiKey) {
        sentiment = await summarizeReviews(
          parsed.reviews.map((r) => ({ body: r.body, rating: r.rating })),
          geminiKey
        );
      }
    }

    return new Response(
      JSON.stringify({
        app_info: parsed.app_info,
        reviews: parsed.reviews,
        has_more: parsed.has_more,
        page: clampedPage,
        total_pages: Math.min(parsed.total_pages, MAX_PAGES),
        sentiment,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.', detail: msg }),
      { status: 503, headers }
    );
  }
};
