// Central constants for the Shopify App Reviews Scraper tool.
// No Astro imports — portable across Netlify Functions and any other runtime.

export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const REVIEWS_PER_PAGE = 10;
export const MAX_PAGES = 5;
export const MAX_REVIEWS = 50;
export const CACHE_TTL_SECONDS = 86_400;
export const SCRAPE_RATE_PER_HOUR = 20;
export const EMAIL_RATE_PER_DAY = 5;

export const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'ymail.com',
  'live.com',
];

export const USER_AGENT =
  'Mozilla/5.0 (compatible; SellOnTube-ReviewScraper/1.0; +https://sellontube.com)';

export const N_A = 'N/A';
