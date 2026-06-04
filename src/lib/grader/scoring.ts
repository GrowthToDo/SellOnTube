// Two-Tier scoring engine — Structural (30) + Quality (70) = 100.
// Includes cross-validation overrides and coherence multiplier.
// No AI, no Astro, no side effects.

import type { Finding, SectionScore, ScoreSection, PrioritizedFix } from './config.js';
import {
  SCORE_WEIGHTS,
  SECTION_LABELS,
  STRUCTURAL_WEIGHT,
  QUALITY_WEIGHT,
  STRUCTURAL_CHECKS,
  QUALITY_CHECKS,
  QUALITY_REWEIGHTS,
  BUZZWORDS,
  THIN_DESCRIPTION_THRESHOLD,
  COHERENCE_MULTIPLIER_4_FAILS,
  COHERENCE_MULTIPLIER_6_FAILS,
} from './config.js';

const SEVERITY_ORDER: Record<string, number> = { fail: 0, warning: 1, info: 2, pass: 3 };

function letterGrade(pct: number): string {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B+';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C+';
  if (pct >= 50) return 'C';
  if (pct >= 30) return 'D';
  return 'F';
}

function computeTier(
  findings: Finding[],
  tierChecks: Set<string>,
  reweights: Record<string, number> | null,
  maxPoints: number
): { earned: number; possible: number; rawPct: number; normalized: number } {
  const tierFindings = findings.filter((f) => tierChecks.has(f.check));
  let earned = 0;
  let possible = 0;

  for (const f of tierFindings) {
    const maxPts = reweights?.[f.check] ?? f.points_possible;
    possible += maxPts;

    if (f.passed) {
      earned += maxPts;
    } else if ((f.severity === 'warning' || f.severity === 'info') && f.points_earned > 0) {
      const origRatio = f.points_possible > 0 ? f.points_earned / f.points_possible : 0;
      earned += Math.round(origRatio * maxPts);
    }
  }

  const rawPct = possible > 0 ? earned / possible : 1;
  const normalized = Math.round(rawPct * maxPoints);
  return { earned, possible, rawPct: Math.round(rawPct * 100), normalized };
}

function impactLabel(rank: number, totalFixes: number): string {
  if (rank === 1) return 'Highest impact';
  if (rank <= Math.ceil(totalFixes * 0.33)) return 'High impact';
  if (rank <= Math.ceil(totalFixes * 0.66)) return 'Medium impact';
  return 'Low impact';
}

export function applyCrossValidation(
  findings: Finding[],
  introText: string,
  descriptionLength: number
): { findings: Finding[]; overrides: string[] } {
  const overrides: string[] = [];
  const modified = findings.map((f) => ({ ...f }));

  // Override A: Buzzword/AI-slop in intro → benefit-led FAIL
  const introLower = introText.toLowerCase();
  const introBuzz = BUZZWORDS.filter((b) => introLower.includes(b.toLowerCase()));
  if (introBuzz.length > 0) {
    const benefitCheck = modified.find((f) => f.check === 'Intro benefit-led' && f.passed);
    if (benefitCheck) {
      benefitCheck.passed = false;
      benefitCheck.severity = 'fail';
      benefitCheck.points_earned = 0;
      benefitCheck.detail = `[Override] Intro contains "${introBuzz[0]}" — a generic filler, not a merchant benefit. ${benefitCheck.detail}`;
      overrides.push(`Buzzword "${introBuzz[0]}" in intro — benefit-led overridden to FAIL`);
    }
  }

  // Override B: Description < threshold → five-second clarity FAIL
  if (descriptionLength > 0 && descriptionLength < THIN_DESCRIPTION_THRESHOLD) {
    const clarityCheck = modified.find((f) => f.check === 'Five-second clarity' && f.passed);
    if (clarityCheck) {
      clarityCheck.passed = false;
      clarityCheck.severity = 'fail';
      clarityCheck.points_earned = 0;
      clarityCheck.detail = `[Override] Description is only ${descriptionLength} chars — not enough text to convey value in 5 seconds. ${clarityCheck.detail}`;
      overrides.push(`Description ${descriptionLength} chars — five-second clarity overridden to FAIL`);
    }
  }

  return { findings: modified, overrides };
}

export function scoreListing(
  findings: Finding[],
  introText: string = '',
  descriptionLength: number = 500
): {
  health_score: number;
  grade: string;
  structural_score: number;
  quality_score: number;
  quality_before_multiplier: number;
  coherence_multiplier: number;
  overrides_applied: string[];
  section_scores: SectionScore[];
  issues: Finding[];
  risk_issues: Finding[];
  growth_issues: Finding[];
  prioritized_fixes: PrioritizedFix[];
} {
  // Apply cross-validation overrides
  const { findings: validated, overrides } = applyCrossValidation(findings, introText, descriptionLength);

  // Structural tier (30pts)
  const structural = computeTier(validated, STRUCTURAL_CHECKS, null, STRUCTURAL_WEIGHT);

  // Quality tier (70pts) with reweights
  const qualityRaw = computeTier(validated, QUALITY_CHECKS, QUALITY_REWEIGHTS, QUALITY_WEIGHT);

  // Coherence multiplier
  const qualityFails = validated.filter((f) => QUALITY_CHECKS.has(f.check) && !f.passed).length;
  let coherenceMultiplier = 1.0;
  if (qualityFails >= 6) {
    coherenceMultiplier = COHERENCE_MULTIPLIER_6_FAILS;
    overrides.push(`${qualityFails} quality failures — 0.70x coherence penalty`);
  } else if (qualityFails >= 4) {
    coherenceMultiplier = COHERENCE_MULTIPLIER_4_FAILS;
    overrides.push(`${qualityFails} quality failures — 0.85x coherence penalty`);
  }

  const qualityFinal = Math.round(qualityRaw.normalized * coherenceMultiplier);
  const healthScore = structural.normalized + qualityFinal;
  const grade = letterGrade(healthScore);

  // Section scores (for display — still uses the 6-section breakdown)
  const sections = Object.keys(SCORE_WEIGHTS) as ScoreSection[];
  const sectionScores: SectionScore[] = sections.map((section) => {
    const sf = validated.filter((f) => f.section === section);
    const earned = sf.reduce((sum, f) => sum + f.points_earned, 0);
    const possible = sf.reduce((sum, f) => sum + f.points_possible, 0);
    const percentage = possible > 0 ? Math.round((earned / possible) * 100) : 100;
    return { section, label: SECTION_LABELS[section], earned, possible, percentage, grade: letterGrade(percentage) };
  });

  // Issues
  const issues = validated
    .filter((f) => !f.passed)
    .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));

  const riskIssues = issues
    .filter((f) => f.impact === 'risk')
    .sort((a, b) => b.points_possible - a.points_possible);

  const growthIssues = issues
    .filter((f) => f.impact === 'growth')
    .sort((a, b) => b.points_possible - a.points_possible);

  // Prioritized fixes with impact labels + score estimate for #1
  const allIssuesSorted = [...issues].sort((a, b) => {
    const aWeight = QUALITY_REWEIGHTS[a.check] ?? a.points_possible;
    const bWeight = QUALITY_REWEIGHTS[b.check] ?? b.points_possible;
    return bWeight - aWeight;
  });

  const prioritizedFixes: PrioritizedFix[] = allIssuesSorted.map((f, i) => {
    const rank = i + 1;
    const weight = QUALITY_REWEIGHTS[f.check] ?? f.points_possible;
    const fix: PrioritizedFix = {
      rank,
      impact_label: impactLabel(rank, allIssuesSorted.length),
      check: f.check,
      detail: f.detail,
      points_possible: weight,
    };
    if (rank === 1 && weight > 3) {
      const isQuality = QUALITY_CHECKS.has(f.check);
      const estImpact = isQuality ? Math.round(weight * QUALITY_WEIGHT / qualityRaw.possible * coherenceMultiplier) : Math.round(weight * STRUCTURAL_WEIGHT / structural.possible);
      const low = Math.max(1, estImpact - 2);
      const high = estImpact + 2;
      fix.score_range_estimate = `Fixing this could improve your score by ~${low}-${high} points`;
    }
    return fix;
  });

  return {
    health_score: healthScore,
    grade,
    structural_score: structural.normalized,
    quality_score: qualityFinal,
    quality_before_multiplier: qualityRaw.normalized,
    coherence_multiplier: coherenceMultiplier,
    overrides_applied: overrides,
    section_scores: sectionScores,
    issues,
    risk_issues: riskIssues,
    growth_issues: growthIssues,
    prioritized_fixes: prioritizedFixes,
  };
}
