// Deterministic grading engine — pure logic, no AI calls.
// Takes a Listing, returns Finding[] with points and severity.

import type { Listing, Finding, ScoreSection, FindingSeverity, FindingImpact } from './config.js';
import {
  CHAR_LIMITS,
  MAX_FEATURES,
  MIN_FEATURES,
  MIN_RECOMMENDED_SCREENSHOTS,
  BUZZWORDS,
  SUPERLATIVES,
  N_A,
} from './config.js';

// ── helpers ──

function lower(s: string): string {
  return s.toLowerCase();
}

function countMatches(haystack: string, needles: readonly string[]): string[] {
  const h = lower(haystack);
  return needles.filter((n) => h.includes(lower(n)));
}

/** Extract meaningful words (3+ chars, not stop-words) from a string. */
function extractKeywords(text: string): string[] {
  const stops = new Set([
    'the', 'and', 'for', 'app', 'your', 'with', 'from', 'this', 'that',
    'shopify', 'store', 'all', 'our', 'you', 'are', 'not', 'has', 'have',
    'will', 'can', 'its', 'into', 'more', 'most', 'also', 'than', 'been',
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stops.has(w));
}

/** Average words per sentence in a block of text. */
function avgSentenceLength(text: string): number {
  const sentences = text
    .replace(/\n/g, ' ')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce(
    (sum, s) => sum + s.split(/\s+/).filter((w) => w.length > 0).length,
    0,
  );
  return totalWords / sentences.length;
}

function finding(
  section: ScoreSection,
  check: string,
  passed: boolean,
  severity: FindingSeverity,
  impact: FindingImpact,
  detail: string,
  pointsEarned: number,
  pointsPossible: number,
): Finding {
  return {
    section,
    check,
    passed,
    severity,
    impact,
    detail,
    points_earned: pointsEarned,
    points_possible: pointsPossible,
  };
}

// ── main ──

export function runRules(listing: Listing): Finding[] {
  const findings: Finding[] = [];
  const intro = listing.introduction ?? '';
  const details = listing.app_details ?? '';
  const introAndDetails = `${intro} ${details}`;

  // ═══════════════════════════════════════════════
  // SEARCH VISIBILITY (~25 pts)
  // ═══════════════════════════════════════════════
  const sec1: ScoreSection = 'search_visibility';

  // 1. Keyword in app name (5pts)
  {
    const nameWords = extractKeywords(listing.app_name);
    const pass = nameWords.length > 0;
    findings.push(
      finding(
        sec1,
        'Keyword in app name',
        pass,
        pass ? 'pass' : 'fail',
        'growth',
        pass
          ? `App name contains descriptive keywords: ${nameWords.slice(0, 5).join(', ')}`
          : 'App name has no specific product/niche keywords. Add terms buyers search for.',
        pass ? 5 : 0,
        5,
      ),
    );
  }

  // 2. URL handle keyword-rich (3pts, info only)
  {
    const handleWords = extractKeywords(listing.url_handle.replace(/-/g, ' '));
    const pass = handleWords.length > 0;
    findings.push(
      finding(
        sec1,
        'URL handle keyword-rich',
        pass,
        'info',
        'growth',
        pass
          ? `URL handle contains keywords: ${handleWords.slice(0, 5).join(', ')}`
          : 'URL handle lacks descriptive keywords. Hard to change after launch, but worth noting.',
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 3. Category present (3pts)
  {
    const pass = listing.category !== N_A && listing.category.trim().length > 0;
    findings.push(
      finding(
        sec1,
        'Category present',
        pass,
        pass ? 'pass' : 'fail',
        'growth',
        pass
          ? `Category set to "${listing.category}"`
          : 'No category detected. Apps without a category miss category browse traffic.',
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 4. SEO title present and keyword-bearing (5pts)
  {
    const title = listing.seo_title ?? '';
    const stripped = title.replace(/\|\s*Shopify App Store/gi, '').trim();
    const pass = stripped.length > 0;
    findings.push(
      finding(
        sec1,
        'SEO title present and keyword-bearing',
        pass,
        pass ? 'pass' : 'fail',
        'growth',
        pass
          ? `SEO title: "${title}" (${title.length} chars)`
          : 'SEO title is missing or only contains "Shopify App Store". Add your primary keyword.',
        pass ? 5 : 0,
        5,
      ),
    );
  }

  // 5. SEO meta description present (4pts)
  {
    const desc = listing.seo_meta_description ?? '';
    const pass = desc !== N_A && desc.length > 50;
    findings.push(
      finding(
        sec1,
        'SEO meta description present',
        pass,
        pass ? 'pass' : 'fail',
        'growth',
        pass
          ? `Meta description is ${desc.length} characters`
          : desc === N_A || desc.length === 0
            ? 'No SEO meta description detected. Shopify may auto-generate one poorly.'
            : `Meta description is only ${desc.length} characters. Aim for 120-160 for better click-through.`,
        pass ? 4 : 0,
        4,
      ),
    );
  }

  // 6. Keyword consistency (5pts)
  {
    const nameKws = extractKeywords(listing.app_name);
    const introLower = lower(intro);
    const detailsLower = lower(details);
    const matchedInBoth = nameKws.filter(
      (kw) => introLower.includes(kw) && detailsLower.includes(kw),
    );
    const pass = nameKws.length === 0 || matchedInBoth.length > 0;
    findings.push(
      finding(
        sec1,
        'Keyword consistency across listing',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? nameKws.length === 0
            ? 'No keywords extracted from app name to check consistency.'
            : `Keywords appear in both intro and details: ${matchedInBoth.join(', ')}`
          : `App name keywords (${nameKws.join(', ')}) missing from introduction or app details. Repeat core terms for search relevance.`,
        pass ? 5 : 0,
        5,
      ),
    );
  }

  // ═══════════════════════════════════════════════
  // SCREENSHOTS & VIDEO (~25 pts)
  // ═══════════════════════════════════════════════
  const sec2: ScoreSection = 'screenshots_and_video';

  // 7. Screenshots >= MIN_RECOMMENDED_SCREENSHOTS (6pts)
  {
    const pass = listing.screenshot_count >= MIN_RECOMMENDED_SCREENSHOTS;
    findings.push(
      finding(
        sec2,
        'Minimum screenshot count',
        pass,
        pass ? 'pass' : 'fail',
        'growth',
        pass
          ? `${listing.screenshot_count} screenshots found (minimum: ${MIN_RECOMMENDED_SCREENSHOTS})`
          : `Only ${listing.screenshot_count} screenshot(s). Upload at least ${MIN_RECOMMENDED_SCREENSHOTS} to showcase key features.`,
        pass ? 6 : 0,
        6,
      ),
    );
  }

  // 8. Screenshot alt text descriptive (4pts)
  {
    const alts = listing.screenshot_alt_texts ?? [];
    const nameLower = lower(listing.app_name);
    const meaningful = alts.filter(
      (a) => a.trim().length > 0 && lower(a.trim()) !== nameLower,
    );
    const pass = alts.length > 0 && meaningful.length === alts.length;
    findings.push(
      finding(
        sec2,
        'Screenshot alt text descriptive',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? `All ${alts.length} screenshot(s) have descriptive alt text`
          : alts.length === 0
            ? 'No screenshot alt texts found. Add descriptive alt text for accessibility and SEO.'
            : `${alts.length - meaningful.length} of ${alts.length} screenshot alt texts are empty or generic. Describe what each screenshot shows.`,
        pass ? 4 : 0,
        4,
      ),
    );
  }

  // 9. First screenshot present (3pts)
  {
    const pass = listing.first_screenshot_present;
    findings.push(
      finding(
        sec2,
        'First screenshot present',
        pass,
        pass ? 'pass' : 'fail',
        'growth',
        pass
          ? 'Hero screenshot detected'
          : 'No first screenshot found. The hero screenshot is the first thing merchants see.',
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 10. Demo video present (8pts, FAIL severity)
  {
    const pass = listing.has_demo_video;
    findings.push(
      finding(
        sec2,
        'Demo video present',
        pass,
        pass ? 'pass' : 'fail',
        'risk',
        pass
          ? 'Demo video detected on listing. Shopify requires a demo screencast.'
          : 'No demo video. Shopify REQUIRES a demo screencast showing onboarding and core features.',
        pass ? 8 : 0,
        8,
      ),
    );
  }

  // 11. Demo store link (4pts)
  {
    const pass = listing.has_demo_store;
    findings.push(
      finding(
        sec2,
        'Demo store link',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? 'Demo store link found'
          : 'No demo store link. A live demo lets merchants try before installing.',
        pass ? 4 : 0,
        4,
      ),
    );
  }

  // ═══════════════════════════════════════════════
  // LISTING COPY (~20 pts)
  // ═══════════════════════════════════════════════
  const sec3: ScoreSection = 'listing_copy';

  // 12. App name within char limit (3pts)
  {
    const len = listing.app_name.length;
    const pass = len <= CHAR_LIMITS.app_name;
    findings.push(
      finding(
        sec3,
        'App name within character limit',
        pass,
        pass ? 'pass' : 'fail',
        'risk',
        pass
          ? `App name is ${len}/${CHAR_LIMITS.app_name} characters`
          : `App name is ${len}/${CHAR_LIMITS.app_name} characters. Shopify may truncate it.`,
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 13. Introduction within char limit (3pts)
  {
    const len = intro.length;
    const pass = len <= CHAR_LIMITS.introduction;
    findings.push(
      finding(
        sec3,
        'Introduction within character limit',
        pass,
        pass ? 'pass' : 'fail',
        'risk',
        pass
          ? `Introduction is ${len}/${CHAR_LIMITS.introduction} characters`
          : `Introduction is ${len}/${CHAR_LIMITS.introduction} characters. Excess will be cut off.`,
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 14. Introduction not under-used (3pts, warning)
  {
    const len = intro.length;
    const threshold = Math.floor(CHAR_LIMITS.introduction * 0.6);
    const pass = len >= threshold;
    findings.push(
      finding(
        sec3,
        'Introduction length sufficient',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? `Introduction uses ${len}/${CHAR_LIMITS.introduction} characters`
          : `Introduction is only ${len}/${CHAR_LIMITS.introduction} characters. You have wasted real estate. Use at least ${threshold} characters.`,
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 15. App details present and substantial (4pts)
  {
    const present = details !== N_A && details.length > 100;
    findings.push(
      finding(
        sec3,
        'App details present and substantial',
        present,
        present ? 'pass' : 'fail',
        'growth',
        present
          ? `App details section is ${details.length} characters`
          : details === N_A || details.length === 0
            ? 'No app details found. This is your main pitch area.'
            : `App details is only ${details.length} characters. Aim for at least 100 to explain your value proposition.`,
        present ? 4 : 0,
        4,
      ),
    );
  }

  // 16. App details within char limit (2pts)
  {
    const len = details.length;
    const pass = len <= CHAR_LIMITS.app_details;
    findings.push(
      finding(
        sec3,
        'App details within character limit',
        pass,
        pass ? 'pass' : 'fail',
        'risk',
        pass
          ? `App details is ${len}/${CHAR_LIMITS.app_details} characters`
          : `App details is ${len}/${CHAR_LIMITS.app_details} characters. Trim to avoid truncation.`,
        pass ? 2 : 0,
        2,
      ),
    );
  }

  // 16b. Description under-used (2pts) — less than 30% of char limit is wasted space
  {
    const len = details.length;
    const usagePct = CHAR_LIMITS.app_details > 0 ? len / CHAR_LIMITS.app_details : 1;
    const pass = details === N_A || usagePct >= 0.3;
    findings.push(
      finding(
        sec3,
        'Description depth',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? `Using ${Math.round(usagePct * 100)}% of available description space`
          : `Only using ${Math.round(usagePct * 100)}% of available space (${len}/${CHAR_LIMITS.app_details} chars). Add use cases, merchant outcomes, or integration details.`,
        pass ? 2 : 0,
        2,
      ),
    );
  }

  // 16c. Intro not keyword-stuffed (2pts) — separators (commas + &) indicating feature dump
  {
    const separators = (intro.match(/[,&]/g) || []).length;
    const wordCount = intro.split(/\s+/).length;
    const isStuffed = separators >= 5 && separators / wordCount > 0.25;
    const pass = !isStuffed;
    findings.push(
      finding(
        sec3,
        'Introduction readability',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? 'Introduction reads as a clear sentence, not a keyword list'
          : `Introduction contains ${separators} separators in ${wordCount} words. Reads like a keyword-stuffed feature list rather than a clear value proposition.`,
        pass ? 2 : 0,
        2,
      ),
    );
  }

  // 17. Features count 3-8 (3pts)
  {
    const count = listing.features.length;
    const pass = count >= MIN_FEATURES && count <= MAX_FEATURES;
    findings.push(
      finding(
        sec3,
        'Too many features listed',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? `${count} features listed (recommended: ${MIN_FEATURES}-${MAX_FEATURES})`
          : count < MIN_FEATURES
            ? `Only ${count} feature(s). List at least ${MIN_FEATURES} to highlight your value.`
            : `${count} features listed. More than ${MAX_FEATURES} dilutes focus. Prioritize your strongest.`,
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 18. Individual feature within char limit (2pts)
  {
    const overLimit = listing.features.filter((f) => f.length > CHAR_LIMITS.feature);
    const pass = overLimit.length === 0;
    findings.push(
      finding(
        sec3,
        'Features within character limit',
        pass,
        pass ? 'pass' : 'warning',
        'risk',
        pass
          ? `All features are within the ${CHAR_LIMITS.feature}-character limit`
          : `${overLimit.length} feature(s) exceed ${CHAR_LIMITS.feature} characters. Longest: ${Math.max(...overLimit.map((f) => f.length))} chars.`,
        pass ? 2 : 0,
        2,
      ),
    );
  }

  // ═══════════════════════════════════════════════
  // SHOPIFY RULES (~10 pts)
  // ═══════════════════════════════════════════════
  const sec4: ScoreSection = 'shopify_rules';

  // 19. No superlatives (4pts)
  {
    const matched = countMatches(introAndDetails, SUPERLATIVES);
    const pass = matched.length === 0;
    findings.push(
      finding(
        sec4,
        'No superlative claims',
        pass,
        pass ? 'pass' : 'fail',
        'risk',
        pass
          ? 'No unverifiable superlative claims found'
          : `Found superlatives: "${matched.join('", "')}". Shopify may reject listings with unverifiable claims.`,
        pass ? 4 : 0,
        4,
      ),
    );
  }

  // 20. No numeric stats in intro (3pts)
  {
    const numericPattern = /\d+%|#\d+|\d+x\b|\d+\+\s*(customers?|merchants?|stores?|installs?|users?)/i;
    const pass = !numericPattern.test(intro);
    findings.push(
      finding(
        sec4,
        'No numeric stats in introduction',
        pass,
        pass ? 'pass' : 'warning',
        'risk',
        pass
          ? 'Introduction is free of numeric/stat claims'
          : 'Introduction contains numeric claims (e.g., percentages, "#1"). Shopify discourages unverifiable stats in the intro.',
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // 21. Description not just a bullet list (3pts)
  {
    const lines = details.split('\n').filter((l) => l.trim().length > 0);
    const bulletLines = lines.filter((l) => /^\s*[-•*]\s/.test(l));
    const bulletRatio = lines.length > 0 ? bulletLines.length / lines.length : 0;
    const pass = lines.length === 0 || bulletRatio <= 0.8;
    findings.push(
      finding(
        sec4,
        'Description has prose, not just bullets',
        pass,
        pass ? 'pass' : 'warning',
        'risk',
        pass
          ? 'App details contains prose paragraphs'
          : `${Math.round(bulletRatio * 100)}% of description lines are bullet points. Add introductory prose to give context.`,
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // ═══════════════════════════════════════════════
  // INSTALL TRIGGERS (~10 pts)
  // ═══════════════════════════════════════════════
  const sec5: ScoreSection = 'install_triggers';

  // 22. Has free plan or trial (4pts)
  {
    const pass = listing.has_free_plan || listing.has_free_trial;
    findings.push(
      finding(
        sec5,
        'Free plan or trial available',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? listing.has_free_plan
            ? 'Free plan detected'
            : 'Free trial detected'
          : 'No free plan or trial found. Free plans earn better App Store impressions.',
        pass ? 4 : 0,
        4,
      ),
    );
  }

  // 23. Pricing visible (3pts)
  {
    const pass = listing.pricing_plans.length > 0;
    findings.push(
      finding(
        sec5,
        'Pricing visible',
        pass,
        pass ? 'pass' : 'warning',
        'growth',
        pass
          ? `${listing.pricing_plans.length} pricing plan(s) displayed`
          : 'No pricing plans detected. Transparent pricing builds merchant trust.',
        pass ? 3 : 0,
        3,
      ),
    );
  }

  // Built for Shopify badge — shown in context panel only, NOT scored.
  // Developers can't toggle this by editing copy; it requires meeting Shopify's technical standards.

  // ═══════════════════════════════════════════════
  // STANDOUT SCORE (~10 pts)
  // ═══════════════════════════════════════════════
  const sec6: ScoreSection = 'standout_score';

  // 25. Buzzword density low (5pts)
  {
    const matched = countMatches(introAndDetails, BUZZWORDS);
    const count = matched.length;
    let pts: number;
    let sev: FindingSeverity;
    let pass: boolean;
    if (count === 0) {
      pts = 5;
      sev = 'pass';
      pass = true;
    } else if (count <= 2) {
      pts = 3;
      sev = 'warning';
      pass = false;
    } else {
      pts = 0;
      sev = 'fail';
      pass = false;
    }
    findings.push(
      finding(
        sec6,
        'Generic language found',
        pass,
        sev,
        'growth',
        count === 0
          ? 'No generic buzzwords detected. Copy sounds specific.'
          : `Found ${count} buzzword(s): "${matched.join('", "')}". Generic copy blends in rather than standing out.`,
        pts,
        5,
      ),
    );
  }

  // 26. Readability (5pts)
  {
    const avg = avgSentenceLength(details);
    let pts: number;
    let sev: FindingSeverity;
    let pass: boolean;
    if (avg === 0 || avg < 20) {
      pts = 5;
      sev = 'pass';
      pass = true;
    } else if (avg <= 30) {
      pts = 3;
      sev = 'warning';
      pass = false;
    } else {
      pts = 0;
      sev = 'fail';
      pass = false;
    }
    findings.push(
      finding(
        sec6,
        'Readability',
        pass,
        sev,
        'growth',
        avg === 0
          ? 'No app details to check readability'
          : `Average sentence length: ${avg.toFixed(1)} words. ${avg < 20 ? 'Good' : avg <= 30 ? 'Slightly long' : 'Too long'}. Under 20 words per sentence is ideal.`,
        pts,
        5,
      ),
    );
  }

  // ─── App Name Readability (search_visibility) ───

  // 27. App name not keyword-stuffed (3pts)
  {
    const nameWords = listing.app_name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 1);
    const uniqueNameWords = new Set(nameWords);
    const repeats = nameWords.length - uniqueNameWords.size;
    const significantWords = nameWords.filter((w) => !['the', 'and', 'for', 'app', 'by', 'with', 'your'].includes(w));
    const isNameStuffed = repeats >= 2 || (significantWords.length >= 6 && listing.app_name.length >= 28);
    findings.push(
      finding(
        'search_visibility' as ScoreSection,
        'App name readability',
        !isNameStuffed,
        isNameStuffed ? 'warning' : 'pass',
        isNameStuffed ? 'risk' : 'growth',
        isNameStuffed
          ? `"${listing.app_name}" appears keyword-stuffed. ${repeats >= 2 ? 'Contains repeated words.' : 'Too many keyword phrases crammed into the character limit.'} This can look spammy to merchants.`
          : 'App name is readable and not keyword-stuffed',
        isNameStuffed ? 0 : 3,
        3,
      ),
    );
  }

  return findings;
}
