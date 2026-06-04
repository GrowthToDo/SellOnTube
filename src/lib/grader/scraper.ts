// Fetch + Cheerio parser for Shopify App Store listing pages.
// Extracts all Listing fields from server-rendered HTML.
// No Astro imports — portable across any runtime.

import * as cheerio from 'cheerio';
import {
  N_A,
  MAX_HTML_CHARS,
  USER_AGENTS,
  type Listing,
  type PricingPlan,
} from './config.js';

const SHOPIFY_APP_URL_RE = /^https?:\/\/(apps\.shopify\.com)\/([a-z0-9-]+)\/?/i;

export function isValidListingUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!SHOPIFY_APP_URL_RE.test(trimmed)) return false;
  // Reject review pages, category pages, partner pages
  const path = new URL(trimmed).pathname;
  if (path.includes('/reviews') || path.includes('/categories/') || path.includes('/partners/')) {
    return false;
  }
  return true;
}

export function extractHandle(url: string): string | null {
  const m = url.trim().match(SHOPIFY_APP_URL_RE);
  return m ? m[2] : null;
}

export function listingUrl(handle: string): string {
  return `https://apps.shopify.com/${handle}`;
}

export async function fetchWithRetry(url: string, maxRetries = 3): Promise<string> {
  if (!url.startsWith('https://apps.shopify.com/')) {
    throw new Error(`Refusing to fetch non-Shopify URL: ${url}`);
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const ua = USER_AGENTS[attempt % USER_AGENTS.length];
      const res = await fetch(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${url}`);
      }
      const html = await res.text();
      return html.length > MAX_HTML_CHARS ? html.substring(0, MAX_HTML_CHARS) : html;
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

export async function scrapeListing(url: string): Promise<Listing> {
  const handle = extractHandle(url);
  if (!handle) throw new Error(`Invalid listing URL: ${url}`);

  const html = await fetchWithRetry(listingUrl(handle));
  return parseListing(html, handle, url);
}

export function parseListing(html: string, handle: string, _url?: string): Listing {
  const $ = cheerio.load(html);

  // --- JSON-LD ---
  let jsonLd: Record<string, any> = {};
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const d = JSON.parse($(el).html() || '{}');
      if (d['@type'] === 'SoftwareApplication') jsonLd = d;
    } catch {}
  });

  // --- App name ---
  const appName = jsonLd.name
    ? String(jsonLd.name).replace(/\s*[–-]\s*$/, '').trim()
    : $('h1').first().text().trim() || N_A;

  // --- Icon URL ---
  const iconUrl = Array.isArray(jsonLd.image) ? jsonLd.image[0] : (jsonLd.image || '');

  // --- Introduction / tagline ---
  // The tagline is a descriptive h2 in the hero section (not nav/structural h2s)
  let introduction = N_A;
  $('h2').each((_, el) => {
    const t = $(el).text().trim();
    const isStructural = /^(Apps by|Featured images|Pricing|Reviews|Support|More apps|Want to add|Log in|Install|This app)/i.test(t);
    if (!isStructural && t.length > 20 && t.length <= 150 && introduction === N_A) {
      introduction = t;
    }
  });

  // --- App details / description ---
  let appDetails = N_A;
  const detailsSection = $('#adp-details-section');
  if (detailsSection.length) {
    const descBlock = detailsSection.find('[data-truncate-content-copy]').first();
    if (descBlock.length) {
      appDetails = descBlock.text().trim();
    }
  }
  if (appDetails === N_A) {
    // Fallback: first long truncate-content-copy not inside reviews
    $('[data-truncate-content-copy]').each((_, el) => {
      if (appDetails !== N_A) return;
      const parent = $(el).closest('#adp-reviews, [data-merchant-review]');
      if (parent.length) return;
      const t = $(el).text().trim();
      if (t.length > 100) appDetails = t;
    });
  }

  // --- Features / key benefits ---
  // Features are listed inside the pricing plan cards as li items
  const features: string[] = [];
  const pricingSection = $('#adp-pricing');
  if (pricingSection.length) {
    // Collect unique feature texts from plan feature lists
    const seen = new Set<string>();
    pricingSection.find('li').each((_, el) => {
      const t = $(el).text().trim().replace(/\s+/g, ' ');
      if (t.length > 5 && t.length < 200 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        features.push(t);
      }
    });
  }

  // --- Screenshots ---
  const screenshotAlts: string[] = [];
  let screenshotCount = 0;
  $('img[alt]').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('cdn.shopify.com/app-store/listing_images') && !src.includes('/icon/')) {
      screenshotCount++;
      const alt = $(el).attr('alt') || '';
      if (alt && !screenshotAlts.includes(alt)) {
        screenshotAlts.push(alt);
      }
    }
  });
  // Shopify renders responsive variants (desktop/mobile) — deduplicate by unique alts
  const uniqueScreenshotCount = screenshotAlts.length;

  // --- Video ---
  const videoIframes = $('iframe[src*="youtube"], iframe[src*="vimeo"], video');
  const hasDemoVideo = videoIframes.length > 0;

  // --- Demo store ---
  const hasDemoStore = $('a[href*="demo"]').length > 0 ||
    $('a:contains("demo store")').length > 0 ||
    $('a:contains("Demo store")').length > 0 ||
    $('a:contains("Try demo")').length > 0;

  // --- Category ---
  let category = N_A;
  let categorySlug = 'default';
  // The specific subcategory link (not nav categories)
  const catLinks = $(`#adp-details-section a[href*="/categories/"], #adp-hero a[href*="/categories/"]`);
  if (catLinks.length) {
    category = catLinks.first().text().trim().replace(/\s+/g, ' ');
    const href = catLinks.first().attr('href') || '';
    const slugMatch = href.match(/\/categories\/([a-z0-9-]+)/);
    if (slugMatch) categorySlug = slugMatch[1];
  }
  // Fallback: look for category links in the sidebar/details that aren't nav
  if (category === N_A) {
    $('a[href*="/categories/"]').each((_, el) => {
      if (category !== N_A) return;
      const href = $(el).attr('href') || '';
      if (href.includes('surface_detail=') && href.includes('surface_type=app_details')) {
        category = $(el).text().trim().replace(/\s+/g, ' ');
        const slugMatch = href.match(/\/categories\/([a-z0-9-]+)/);
        if (slugMatch) categorySlug = slugMatch[1];
      }
    });
  }

  // --- SEO title + meta description ---
  const seoTitle = $('title').text().trim();
  const seoMetaDescription = $('meta[name="description"]').attr('content') || N_A;

  // --- Pricing ---
  const pricingPlans: PricingPlan[] = [];
  let hasFree = false;
  let hasFreeTrial = false;

  // Parse pricing plans from the pricing section
  pricingSection.find('[class*="pricing"], [data-plan]').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text.length < 5) return;

    // Extract plan name and price
    const priceMatch = text.match(/^(\w[\w\s]*?)\s+(\$[\d,.]+\s*\/\s*month|Free)/i);
    if (priceMatch) {
      const planFeatures: string[] = [];
      $(el).find('li').each((_, li) => {
        const ft = $(li).text().trim();
        if (ft.length > 3) planFeatures.push(ft);
      });
      pricingPlans.push({
        name: priceMatch[1].trim(),
        price: priceMatch[2].trim(),
        features: planFeatures,
      });
    }
  });

  // Check free plan/trial from page text
  const bodyText = $('body').text().toLowerCase();
  hasFree = /free plan|free to install/i.test(bodyText) ||
    pricingPlans.some(p => /^free$/i.test(p.price));
  hasFreeTrial = /free trial/i.test(bodyText);

  // If no plans parsed from structured elements, try the dl metadata
  if (pricingPlans.length === 0) {
    $('dl dt').each((_, el) => {
      const label = $(el).text().trim().toLowerCase();
      if (label === 'pricing') {
        const dd = $(el).next('dd').text().trim();
        if (dd) {
          hasFree = hasFree || /free/i.test(dd);
        }
      }
    });
  }

  // --- Built for Shopify ---
  const builtForShopify = /Built for Shopify/i.test(html);

  // --- Rating + reviews (from JSON-LD) ---
  const rating = jsonLd.aggregateRating?.ratingValue
    ? parseFloat(jsonLd.aggregateRating.ratingValue)
    : 0;
  const reviewCount = jsonLd.aggregateRating?.ratingCount
    ? parseInt(jsonLd.aggregateRating.ratingCount, 10)
    : 0;

  // --- Developer name (from JSON-LD brand or dl) ---
  let developerName = jsonLd.brand ? String(jsonLd.brand) : N_A;
  if (developerName === N_A) {
    $('dl dt').each((_, el) => {
      if ($(el).text().trim().toLowerCase() === 'developer') {
        developerName = $(el).next('dd').text().trim() || N_A;
      }
    });
  }
  if (developerName === N_A) {
    const partnerLink = $('a[href*="/partners/"]').first();
    if (partnerLink.length) developerName = partnerLink.text().trim() || N_A;
  }

  // --- Launched date, languages, integrations ---
  // These may be in the details sidebar or not present for all apps
  let launchedDate = N_A;
  let languages = N_A;
  let integrations = N_A;

  // Try sidebar dt/dd pairs
  $('dl dt').each((_, el) => {
    const label = $(el).text().trim().toLowerCase();
    const value = $(el).next('dd').text().trim();
    if (label.includes('launch') && value) launchedDate = value;
    if (label.includes('language') && value) languages = value;
    if ((label.includes('integrat') || label.includes('works with')) && value) integrations = value;
  });

  // --- Latest review date (from reviews section) ---
  let latestReviewDate = N_A;
  const reviewDates = $('#adp-reviews .tw-text-body-xs.tw-text-fg-tertiary');
  if (reviewDates.length) {
    latestReviewDate = reviewDates.first().text().trim() || N_A;
  }

  return {
    app_name: appName,
    url_handle: handle,
    introduction,
    app_details: appDetails,
    features,
    screenshot_count: uniqueScreenshotCount,
    screenshot_alt_texts: screenshotAlts,
    has_demo_video: hasDemoVideo,
    has_demo_store: hasDemoStore,
    first_screenshot_present: uniqueScreenshotCount > 0,
    category,
    category_slug: categorySlug,
    seo_title: seoTitle,
    seo_meta_description: seoMetaDescription,
    pricing_plans: pricingPlans,
    has_free_plan: hasFree,
    has_free_trial: hasFreeTrial,
    built_for_shopify: builtForShopify,
    rating,
    review_count: reviewCount,
    latest_review_date: latestReviewDate,
    developer_name: developerName,
    launched_date: launchedDate,
    languages,
    integrations,
    icon_url: iconUrl,
    url: `https://apps.shopify.com/${handle}`,
  };
}
