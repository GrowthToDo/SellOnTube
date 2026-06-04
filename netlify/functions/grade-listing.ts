import { isValidListingUrl, extractHandle, scrapeListing } from '../../src/lib/grader/scraper.js';
import { runRules } from '../../src/lib/grader/rules.js';
import { qualitativeFindings } from '../../src/lib/grader/analyzer.js';
import { scoreListing } from '../../src/lib/grader/scoring.js';
import {
  RATE_LIMIT_PER_DAY,
  CACHE_TTL_SECONDS,
  type GradeResult,
  type ListingContext,
  type ListingMeta,
} from '../../src/lib/grader/config.js';

// In-memory rate limit + cache (acceptable for v1 per spec; upgrade to KV for production traffic)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const cache = new Map<string, { result: GradeResult; contentHash: string; expiresAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < Math.min(text.length, 5000); i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 86_400_000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_PER_DAY) return false;
  entry.count++;
  return true;
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

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !isValidListingUrl(url)) {
      return new Response(
        JSON.stringify({
          error: 'Please enter a valid Shopify app URL (e.g. https://apps.shopify.com/loox)',
        }),
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

    // Rate limit per IP
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: 'Daily limit reached. You can grade up to 5 listings per day. Check back tomorrow.',
        }),
        { status: 429, headers }
      );
    }

    // Scrape the listing
    let listing;
    try {
      listing = await scrapeListing(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return new Response(
        JSON.stringify({
          error: "We couldn't fetch this app listing. Please check the URL and try again.",
          detail: msg,
        }),
        { status: 503, headers }
      );
    }

    // Check cache by handle + content hash
    const contentHash = simpleHash(
      `${listing.app_name}|${listing.introduction}|${listing.app_details}|${listing.screenshot_count}|${listing.has_demo_video}`
    );
    const cached = cache.get(handle);
    if (cached && cached.contentHash === contentHash && Date.now() < cached.expiresAt) {
      return new Response(JSON.stringify(cached.result), { status: 200, headers });
    }

    // Run deterministic rules
    const deterministicFindings = runRules(listing);

    // Run AI qualitative checks (non-blocking — if AI fails, we still have deterministic scores)
    const aiFindings = await qualitativeFindings(listing);

    // Combine all findings
    const allFindings = [...deterministicFindings, ...aiFindings];

    // Score (two-tier with cross-validation overrides)
    const scoreResult = scoreListing(allFindings, listing.introduction, listing.app_details.length);

    // Build context
    const context: ListingContext = {
      rating: listing.rating,
      review_count: listing.review_count,
      latest_review_date: listing.latest_review_date,
      developer_name: listing.developer_name,
      launched_date: listing.launched_date,
      languages: listing.languages,
      integrations: listing.integrations,
      built_for_shopify: listing.built_for_shopify,
      category: listing.category,
      screenshot_count: listing.screenshot_count,
    };

    const listingMeta: ListingMeta = {
      app_name: listing.app_name,
      url_handle: listing.url_handle,
      icon_url: listing.icon_url,
      introduction: listing.introduction,
      url: listing.url,
    };

    const result: GradeResult = {
      health_score: scoreResult.health_score,
      grade: scoreResult.grade,
      structural_score: scoreResult.structural_score,
      quality_score: scoreResult.quality_score,
      quality_before_multiplier: scoreResult.quality_before_multiplier,
      coherence_multiplier: scoreResult.coherence_multiplier,
      overrides_applied: scoreResult.overrides_applied,
      section_scores: scoreResult.section_scores,
      findings: scoreResult.issues.length > 0 ? allFindings : allFindings,
      risk_issues: scoreResult.risk_issues,
      growth_issues: scoreResult.growth_issues,
      prioritized_fixes: scoreResult.prioritized_fixes,
      context,
      listing_meta: listingMeta,
      content_hash: contentHash,
      graded_at: new Date().toISOString(),
    };

    // Cache the result
    cache.set(handle, {
      result,
      contentHash,
      expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
    });

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.', detail: msg }),
      { status: 503, headers }
    );
  }
};
