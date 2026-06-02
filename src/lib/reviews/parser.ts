// Deterministic HTML parser for Shopify App Store reviews pages.
// Uses Cheerio selectors mapped from live apps.shopify.com markup (June 2026).
// No Astro imports — portable across any runtime.

import * as cheerio from 'cheerio';
import { N_A, MAX_PAGES } from './config.js';

export interface AppInfo {
  app_name: string;
  overall_rating: number;
  total_reviews: number;
  rating_distribution: Record<string, number>;
  shopify_summary: string;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  country: string;
  time_using_app: string | null;
  body: string;
  developer_reply: string;
  developer_reply_date: string | null;
  helpful_count: number;
}

export interface ParsedPage {
  app_info: AppInfo;
  reviews: Review[];
  total_pages: number;
  has_more: boolean;
}

function num(s: string | undefined): number {
  if (!s) return 0;
  // "7.5K" → 7500, "263" → 263, "1.2K" → 1200
  const cleaned = s.trim().replace(/,/g, '');
  const kMatch = cleaned.match(/^([\d.]+)\s*K$/i);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
  return parseInt(cleaned, 10) || 0;
}

function extractRatingFromAria(el: cheerio.Cheerio<cheerio.Element>): number {
  // aria-label="5 out of 5 stars" or "4.9 out of 5 stars"
  const label = el.attr('aria-label') || '';
  const m = label.match(/([\d.]+)\s+out\s+of\s+5/);
  return m ? parseFloat(m[1]) : 0;
}

export function parseReviewsPage(html: string, currentPage: number): ParsedPage {
  const $ = cheerio.load(html);

  // --- App info from JSON-LD ---
  let appName = N_A;
  let overallRating = 0;
  let totalReviews = 0;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '');
      if (data['@type'] === 'SoftwareApplication') {
        appName = (data.name || N_A).replace(/\s*[‑–-]\s*$/, '').trim();
        if (data.aggregateRating) {
          overallRating = parseFloat(data.aggregateRating.ratingValue) || 0;
          totalReviews = parseInt(data.aggregateRating.ratingCount, 10) || 0;
        }
      }
    } catch {}
  });

  // Fallback: parse rating from the metrics section
  if (!overallRating) {
    const metricsRating = $('.app-reviews-metrics div[aria-label$="out of 5 stars"]').first();
    overallRating = extractRatingFromAria(metricsRating);
  }

  // --- Rating distribution ---
  // Each <li> in the metrics <ul> has: star number, aria-label with count, display text
  const ratingDistribution: Record<string, number> = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
  $('.app-reviews-metrics ul li').each((_, li) => {
    const $li = $(li);
    // Star level: first div with single digit
    const starText = $li.find('div.tw-mr-2xs').first().text().trim();
    // Count: from aria-label on the link ("7524 total reviews")
    const countLink = $li.find('a[aria-label$="total reviews"]');
    const countLabel = countLink.attr('aria-label') || '';
    const countMatch = countLabel.match(/^(\d[\d,]*)\s+total/);
    const count = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : 0;

    if (starText && ['5', '4', '3', '2', '1'].includes(starText)) {
      ratingDistribution[starText] = count;
    }
  });

  // --- Shopify "What merchants think" summary ---
  const summaryEl = $('div[data-truncate-app-review-summary] p[data-truncate-content-copy]');
  const shopifySummary = summaryEl.text().trim() || N_A;

  // --- Individual reviews ---
  const reviews: Review[] = [];
  $('div[data-merchant-review]').each((_, el) => {
    const $review = $(el);

    // Rating from aria-label on the star container
    const starContainer = $review.find('div[aria-label$="out of 5 stars"][role="img"]').first();
    const rating = extractRatingFromAria(starContainer);

    // Date: first .tw-text-body-xs.tw-text-fg-tertiary inside the content area (order-2)
    const contentArea = $review.find('.tw-order-2').first();
    const date = contentArea.find('.tw-text-body-xs.tw-text-fg-tertiary').first().text().trim() || N_A;

    // Body: all <p> inside [data-truncate-content-copy], or full text if no <p> found
    const bodyContainer = contentArea.find('[data-truncate-content-copy]').first();
    const bodyParagraphs: string[] = [];
    const paragraphs = bodyContainer.find('p');
    if (paragraphs.length) {
      paragraphs.each((_, p) => {
        const text = $(p).text().trim();
        if (text) bodyParagraphs.push(text);
      });
    } else {
      const fallbackText = bodyContainer.text().trim();
      if (fallbackText) bodyParagraphs.push(fallbackText);
    }
    const body = bodyParagraphs.join('\n\n') || '';

    // Author: span with title attribute inside .tw-text-heading-xs
    const authorSection = $review.find('.tw-order-1').first();
    const authorSpan = authorSection.find('.tw-text-heading-xs span[title]').first();
    const author = authorSpan.attr('title') || authorSpan.text().trim() || N_A;

    // Country + time using app: plain divs in the author section (after the heading)
    const metaDivs = authorSection.children('div').not('.tw-text-heading-xs');
    const country = metaDivs.eq(0).text().trim() || N_A;
    const timeUsingApp = metaDivs.eq(1).text().trim() || null;

    // Developer reply
    let developerReply = '';
    let developerReplyDate: string | null = null;
    const replyContainer = $review.find('[data-merchant-review-reply]').first();
    const replyEl = replyContainer.find('[id^="review-reply-"]').first();
    if (replyEl.length) {
      // Reply date: "Loox replied May 6, 2026"
      const replyDateText = replyEl.find('.tw-text-body-xs.tw-text-fg-tertiary').first().text().trim();
      if (replyDateText) {
        const dateMatch = replyDateText.match(/replied\s+(.+)/i);
        developerReplyDate = dateMatch ? dateMatch[1].trim() : replyDateText;
      }
      // Reply body
      const replyParagraphs: string[] = [];
      replyEl.find('[data-truncate-content-copy] p').each((_, p) => {
        const text = $(p).text().trim();
        if (text) replyParagraphs.push(text);
      });
      developerReply = replyParagraphs.join('\n\n');
    }

    reviews.push({
      author,
      rating,
      date,
      country,
      time_using_app: timeUsingApp,
      body,
      developer_reply: developerReply,
      developer_reply_date: developerReplyDate,
      helpful_count: 0,
    });
  });

  // --- Pagination ---
  // Extract max page from pagination links: aria-label="Go to Page N"
  let maxPage = 1;
  $('a[aria-label^="Go to Page"]').each((_, el) => {
    const label = $(el).attr('aria-label') || '';
    const m = label.match(/Page\s+(\d+)/);
    if (m) {
      const pageNum = parseInt(m[1], 10);
      if (pageNum > maxPage) maxPage = pageNum;
    }
  });
  // Also check "Current Page" links
  $('a[aria-label^="Current Page"]').each((_, el) => {
    const label = $(el).attr('aria-label') || '';
    const m = label.match(/Page\s+(\d+)/);
    if (m) {
      const pageNum = parseInt(m[1], 10);
      if (pageNum > maxPage) maxPage = pageNum;
    }
  });

  const totalPages = maxPage;
  const hasMore = currentPage < Math.min(totalPages, MAX_PAGES);

  return {
    app_info: {
      app_name: appName,
      overall_rating: overallRating,
      total_reviews: totalReviews,
      rating_distribution: ratingDistribution,
      shopify_summary: shopifySummary,
    },
    reviews,
    total_pages: totalPages,
    has_more: hasMore,
  };
}
