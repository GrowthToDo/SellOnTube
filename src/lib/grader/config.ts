// Central constants, types, and scoring rubric for the Shopify App Store Listing Grader.
// No Astro imports — portable across Netlify Functions and any runtime.

export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const MAX_HTML_CHARS = 280_000;
export const GEMINI_TIMEOUT_MS = 60_000;
export const GEMINI_MAX_RETRIES = 2;
export const CACHE_TTL_SECONDS = 21_600;
export const RATE_LIMIT_PER_DAY = 5;
export const EMAIL_RATE_PER_DAY = 5;

export const USER_AGENT =
  'Mozilla/5.0 (compatible; SellOnTube-ListingGrader/1.0; +https://sellontube.com)';

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (compatible; SellOnTube-ListingGrader/1.0; +https://sellontube.com)',
];

export const N_A = 'N/A';

// Shopify field character limits (from Shopify's official best practices docs).
export const CHAR_LIMITS = {
  app_name: 30,
  introduction: 100,
  app_details: 500,
  feature: 80,
} as const;

export const MAX_FEATURES = 8;
export const MIN_FEATURES = 3;
export const MIN_RECOMMENDED_SCREENSHOTS = 3;
export const THIN_DESCRIPTION_THRESHOLD = 150;

// ── Two-Tier Scoring ──
// Structural (30pts): table stakes — did you fill out the listing correctly?
// Quality (70pts): the real diagnostic — is your listing effective?
export const STRUCTURAL_WEIGHT = 30;
export const QUALITY_WEIGHT = 70;

// Legacy section weights (still used for section-level display)
export const SCORE_WEIGHTS = {
  search_visibility: 25,
  screenshots_and_video: 25,
  listing_copy: 20,
  shopify_rules: 10,
  install_triggers: 10,
  standout_score: 10,
} as const;

export type ScoreSection = keyof typeof SCORE_WEIGHTS;

export const SECTION_LABELS: Record<ScoreSection, string> = {
  search_visibility: 'Search Visibility',
  screenshots_and_video: 'Screenshots & Video',
  listing_copy: 'Listing Copy',
  shopify_rules: 'Shopify Rules',
  install_triggers: 'Install Triggers',
  standout_score: 'Standout Score',
};

// ── Tier Assignments ──
// Checks assigned to 'structural' get normalized to STRUCTURAL_WEIGHT.
// Everything else is 'quality' and gets normalized to QUALITY_WEIGHT with reweights.
export const STRUCTURAL_CHECKS = new Set([
  'Keyword in app name',
  'URL handle keyword-rich',
  'Category present', 'Category assigned',
  'SEO title present and keyword-bearing', 'SEO title with keywords',
  'SEO meta description present', 'SEO meta description',
  'Minimum screenshot count', 'Screenshot count',
  'First screenshot present',
  'Demo video present',
  'Demo store link',
  'App name within character limit', 'App name within char limit',
  'Introduction within character limit', 'Introduction within char limit',
  'App details present and substantial', 'Description present and substantial',
  'App details within character limit', 'Description within character limit',
  'Features within character limit', 'Feature character limits',
  'No superlative claims', 'No unverifiable superlatives',
  'No numeric stats in introduction',
  'Description has prose, not just bullets',
  'Free plan or trial available',
  'Pricing visible',
  'Built for Shopify badge',
  'Readability',
  'Introduction length sufficient', 'Introduction character usage',
  'Feature count in range', 'Feature count', 'Too many features listed',
]);

export const QUALITY_CHECKS = new Set([
  'Keyword consistency across listing', 'Keyword consistency',
  'Screenshot alt text descriptive',
  'Description depth',
  'Introduction readability',
  'Buzzword density low', 'Low buzzword density', 'Generic language found',
  'Intro benefit-led',
  'Description not feature-list-only',
  'Five-second clarity',
  'Distinctiveness score',
  'App name readability',
]);

// Quality checks get reweighted — these are the points that differentiate good from bad.
export const QUALITY_REWEIGHTS: Record<string, number> = {
  'Intro benefit-led': 12,
  'Description not feature-list-only': 10,
  'Five-second clarity': 8,
  'Distinctiveness score': 14,
  'Keyword consistency across listing': 6,
  'Keyword consistency': 6,
  'Buzzword density low': 8,
  'Low buzzword density': 8,
  'Generic language found': 8,
  'Screenshot alt text descriptive': 4,
  'Description depth': 6,
  'Introduction readability': 6,
  'App name readability': 6,
};

// ── Cross-Validation Override Thresholds ──
export const COHERENCE_MULTIPLIER_4_FAILS = 0.85;
export const COHERENCE_MULTIPLIER_6_FAILS = 0.70;

// ── AI-Slop / Buzzword Detection ──
// Catches generic marketing filler and high-confidence AI vocabulary.
export const BUZZWORDS = [
  'unlock', 'elevate', 'seamless', 'seamlessly', 'supercharge',
  'revolutionize', 'game-changer', 'game changer', 'take your store to the next level',
  'effortless', 'effortlessly', 'powerful solution', "in today's fast-paced",
  'cutting-edge', 'robust', 'leverage', 'empower', 'streamline your', 'boost your sales',
  'next-level', 'all-in-one solution', 'one-stop', 'sky-rocket', 'skyrocket',
  'transform your', 'ultimate solution', 'hassle-free',
  // High-confidence AI vocabulary (never used naturally in Shopify listings)
  'delve', 'tapestry', 'garner', 'spearhead', 'foster', 'harness',
];

export const SUPERLATIVES = [
  'best', '#1', 'number one', 'the first', 'the only',
  'world-class', 'leading', 'top-rated', 'most popular',
  'industry-leading', 'best-in-class', 'unmatched',
];

export const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'ymail.com', 'live.com',
];

// ── Directional Insights (Shopify's documented best practices, no fabricated numbers) ──
export function ratingInsight(rating: number): string {
  if (rating >= 4.5) return 'Strong. Higher-rated apps rank better in Shopify search.';
  if (rating >= 4.0) return 'Good. Aim for 4.5+ to stand out in search results.';
  if (rating >= 3.0) return 'Below average. Low ratings reduce search visibility and merchant trust.';
  return 'Needs attention. Ratings under 3.0 significantly hurt discoverability.';
}

export function reviewInsight(count: number): string {
  if (count >= 100) return 'Strong social proof. Review count is a Shopify search ranking signal.';
  if (count >= 20) return 'Decent. More reviews strengthen search ranking and merchant confidence.';
  if (count >= 5) return 'Low. Shopify search weights review count. Active review outreach helps.';
  return 'Very few reviews. New merchants hesitate to install apps without social proof.';
}

export function screenshotInsight(count: number): string {
  if (count >= 5) return 'Good coverage. More screenshots help merchants evaluate before installing.';
  if (count >= 3) return 'Minimum met. Listings with more screenshots tend to convert better.';
  return 'Below minimum. Screenshots are the primary visual conversion driver.';
}

// ── Types ──

export interface Listing {
  app_name: string;
  url_handle: string;
  introduction: string;
  app_details: string;
  features: string[];
  screenshot_count: number;
  screenshot_alt_texts: string[];
  has_demo_video: boolean;
  has_demo_store: boolean;
  first_screenshot_present: boolean;
  category: string;
  category_slug: string;
  seo_title: string;
  seo_meta_description: string;
  pricing_plans: PricingPlan[];
  has_free_plan: boolean;
  has_free_trial: boolean;
  built_for_shopify: boolean;
  rating: number;
  review_count: number;
  latest_review_date: string;
  developer_name: string;
  launched_date: string;
  languages: string;
  integrations: string;
  icon_url: string;
  url: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export type FindingImpact = 'risk' | 'growth';
export type FindingSeverity = 'pass' | 'info' | 'warning' | 'fail';
export type FindingTier = 'structural' | 'quality';

export interface Finding {
  section: ScoreSection;
  check: string;
  passed: boolean;
  severity: FindingSeverity;
  impact: FindingImpact;
  detail: string;
  points_earned: number;
  points_possible: number;
}

export interface SectionScore {
  section: ScoreSection;
  label: string;
  earned: number;
  possible: number;
  percentage: number;
  grade: string;
}

export interface PrioritizedFix {
  rank: number;
  impact_label: string;
  check: string;
  detail: string;
  points_possible: number;
  score_range_estimate?: string;
}

export interface GradeResult {
  health_score: number;
  grade: string;
  structural_score: number;
  quality_score: number;
  quality_before_multiplier: number;
  coherence_multiplier: number;
  overrides_applied: string[];
  section_scores: SectionScore[];
  findings: Finding[];
  risk_issues: Finding[];
  growth_issues: Finding[];
  prioritized_fixes: PrioritizedFix[];
  context: ListingContext;
  listing_meta: ListingMeta;
  content_hash: string;
  graded_at: string;
}

export interface ListingContext {
  rating: number;
  review_count: number;
  latest_review_date: string;
  developer_name: string;
  launched_date: string;
  languages: string;
  integrations: string;
  built_for_shopify: boolean;
  category: string;
  screenshot_count: number;
}

export interface ListingMeta {
  app_name: string;
  url_handle: string;
  icon_url: string;
  introduction: string;
  url: string;
}
