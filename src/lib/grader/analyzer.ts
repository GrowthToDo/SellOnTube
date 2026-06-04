// AI qualitative layer for the Shopify App Store Listing Grader.
// Calls Gemini for subjective copy analysis and fix plan generation.
// No Astro imports — portable across any runtime.

import type { Listing, Finding, FindingSeverity, ScoreSection } from './config.js';
import { qualitativePrompt, distinctivenessPrompt, fixPlanPrompt } from './prompts.js';
import { callJson, callText } from './gemini.js';

interface QualitativeResult {
  intro_benefit_led: { value: boolean; reason: string };
  details_just_a_feature_list: { value: boolean; reason: string };
  five_second_clarity: { value: boolean; reason: string };
}

interface DistinctivenessResult {
  score: number;
  worst_line: string;
  rewrite_pattern: string;
}

function distinctivenessPoints(score: number): { points: number; severity: FindingSeverity } {
  if (score >= 8) return { points: 5, severity: 'pass' };
  if (score >= 5) return { points: 3, severity: 'warning' };
  return { points: 0, severity: 'fail' };
}

/**
 * Run two qualitative AI prompts and convert results to Finding objects.
 * Returns empty array on AI failure — never throws.
 */
export async function qualitativeFindings(listing: Listing): Promise<Finding[]> {
  const [qualResult, distResult] = await Promise.all([
    callJson<QualitativeResult>(
      qualitativePrompt(listing.introduction, listing.app_details, listing.features.join(', '))
    ),
    callJson<DistinctivenessResult>(
      distinctivenessPrompt(listing.introduction, listing.app_details)
    ),
  ]);

  if (!qualResult && !distResult) {
    console.error('[analyzer] Both AI calls returned null — skipping qualitative findings');
    return [];
  }

  const findings: Finding[] = [];

  if (qualResult) {
    // a) Intro benefit-led
    const introPass = qualResult.intro_benefit_led.value === true;
    findings.push({
      section: 'listing_copy' as ScoreSection,
      check: 'Intro benefit-led',
      passed: introPass,
      severity: introPass ? 'pass' : 'fail',
      impact: 'growth',
      detail: qualResult.intro_benefit_led.reason,
      points_earned: introPass ? 3 : 0,
      points_possible: 3,
    });

    // b) Description not feature-list-only
    const descPass = qualResult.details_just_a_feature_list.value === false;
    findings.push({
      section: 'listing_copy' as ScoreSection,
      check: 'Description not feature-list-only',
      passed: descPass,
      severity: descPass ? 'pass' : 'fail',
      impact: 'growth',
      detail: qualResult.details_just_a_feature_list.reason,
      points_earned: descPass ? 3 : 0,
      points_possible: 3,
    });

    // c) Five-second clarity
    const clarityPass = qualResult.five_second_clarity.value === true;
    findings.push({
      section: 'search_visibility' as ScoreSection,
      check: 'Five-second clarity',
      passed: clarityPass,
      severity: clarityPass ? 'pass' : 'fail',
      impact: 'growth',
      detail: qualResult.five_second_clarity.reason,
      points_earned: clarityPass ? 3 : 0,
      points_possible: 3,
    });
  } else {
    console.error('[analyzer] Qualitative prompt returned null — skipping 3 checks');
  }

  if (distResult) {
    // d) Distinctiveness score
    const score = Math.max(0, Math.min(10, distResult.score));
    const { points, severity } = distinctivenessPoints(score);
    const passed = severity === 'pass';

    const detailParts = [`Score: ${score}/10`];
    if (distResult.worst_line) detailParts.push(`Worst line: "${distResult.worst_line}"`);
    if (distResult.rewrite_pattern) detailParts.push(`Pattern: ${distResult.rewrite_pattern}`);

    findings.push({
      section: 'standout_score' as ScoreSection,
      check: 'Distinctiveness score',
      passed,
      severity,
      impact: 'growth',
      detail: detailParts.join('. '),
      points_earned: points,
      points_possible: 5,
    });
  } else {
    console.error('[analyzer] Distinctiveness prompt returned null — skipping check');
  }

  return findings;
}

/**
 * Post-process AI text to strip remaining AI patterns the prompt didn't catch.
 * Deterministic, no API call.
 */
function humanizeText(text: string): string {
  let s = text;
  // Em-dashes → period or comma
  s = s.replace(/\s*—\s*/g, '. ');
  s = s.replace(/\s*–\s*/g, ', ');
  // AI vocabulary replacements
  const swaps: [RegExp, string][] = [
    [/\bleverage\b/gi, 'use'],
    [/\butilize\b/gi, 'use'],
    [/\bcrucial\b/gi, 'important'],
    [/\bvital\b/gi, 'important'],
    [/\boptimal\b/gi, 'best'],
    [/\brobust\b/gi, 'strong'],
    [/\bcomprehensive\b/gi, 'complete'],
    [/\bfacilitate\b/gi, 'help'],
    [/\bharness\b/gi, 'use'],
    [/\bdelve\b/gi, 'look into'],
    [/\binnovative\b/gi, 'new'],
    [/\bstreamline\b/gi, 'simplify'],
  ];
  for (const [re, rep] of swaps) s = s.replace(re, rep);
  // Strip throat-clearing openers
  s = s.replace(/It's worth noting that /gi, '');
  s = s.replace(/It's important to remember that /gi, '');
  s = s.replace(/It's important to note that /gi, '');
  s = s.replace(/In today's competitive landscape,? /gi, '');
  s = s.replace(/In today's fast-paced,? /gi, '');
  s = s.replace(/By implementing (these|this|the) /gi, '');
  // Double-period cleanup
  s = s.replace(/\.\./g, '.');
  s = s.replace(/\. \./g, '.');
  return s.trim();
}

/**
 * Generate a prioritized fix plan from all non-passed findings.
 * Returns markdown string or null on failure. Never throws.
 */
export async function generateFixPlan(findings: Finding[], appName: string): Promise<string | null> {
  const failed = findings.filter((f) => !f.passed);
  if (failed.length === 0) return null;

  const summary = failed
    .map(
      (f) =>
        `- [${f.section}] ${f.check} (${f.severity}, impact: ${f.impact}): ${f.detail}`
    )
    .join('\n');

  try {
    const raw = await callText(fixPlanPrompt(summary, appName));
    return raw ? humanizeText(raw) : null;
  } catch (err) {
    console.error('[analyzer] Fix plan generation failed:', err instanceof Error ? err.message : err);
    return null;
  }
}
