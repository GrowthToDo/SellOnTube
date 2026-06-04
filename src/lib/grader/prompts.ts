// All Gemini prompts for the Listing Grader.
// Plain template strings — no logic, no SDK imports.
// Each prompt documents its inputs and required output shape.

/**
 * QUALITATIVE_PROMPT
 * Input: { introduction, app_details, features (joined) }
 * Output JSON: {
 *   intro_benefit_led: { value: boolean, reason: string },
 *   details_just_a_feature_list: { value: boolean, reason: string },
 *   five_second_clarity: { value: boolean, reason: string }
 * }
 */
export function qualitativePrompt(introduction: string, appDetails: string, features: string): string {
  return `You are a Shopify App Store optimization expert. Analyze this app listing copy and return ONLY valid JSON (no markdown, no code fences).

LISTING DATA:
- Introduction/tagline: "${introduction}"
- App details/description: "${appDetails}"
- Features: "${features}"

Evaluate these three qualities:

1. intro_benefit_led: Does the introduction lead with a merchant BENEFIT (what they get) rather than a feature (what the app does)? A benefit answers "why should I care?" A feature answers "what does it do?"

2. details_just_a_feature_list: Is the description ONLY a list of features with no explanation of benefits, use cases, or outcomes? A good description weaves features into merchant outcomes.

3. five_second_clarity: Can a merchant understand what this app does and who it's for within 5 seconds of reading the introduction and first sentence of the description?

Return this exact JSON structure:
{
  "intro_benefit_led": { "value": true, "reason": "one sentence explanation" },
  "details_just_a_feature_list": { "value": false, "reason": "one sentence explanation" },
  "five_second_clarity": { "value": true, "reason": "one sentence explanation" }
}`;
}

/**
 * DISTINCTIVENESS_PROMPT
 * Input: { introduction, app_details }
 * Output JSON: {
 *   score: number (0-10),
 *   worst_line: string,
 *   rewrite_pattern: string
 * }
 * NOTE: This scores generic-copy traits. It must NOT claim to detect AI authorship.
 */
export function distinctivenessPrompt(introduction: string, appDetails: string): string {
  return `You are a Shopify App Store copy analyst. Score how DISTINCTIVE vs GENERIC this listing copy is. Return ONLY valid JSON (no markdown, no code fences).

LISTING COPY:
- Introduction: "${introduction}"
- Description: "${appDetails}"

Score 0-10 where:
- 0-3: Extremely generic. Could describe any app. Full of buzzwords and vague promises.
- 4-6: Somewhat specific but relies on common patterns. Some unique details mixed with filler.
- 7-10: Highly specific to this product. Uses concrete details, specific numbers, named integrations, or unique value props.

Find the WORST (most generic) line in the copy. Then suggest a STRUCTURAL PATTERN (not a rewrite) showing how to make that line specific. Example pattern: "[Specific outcome] for [specific merchant type] — [concrete detail]"

Return this exact JSON structure:
{
  "score": 7,
  "worst_line": "the most generic line from the copy",
  "rewrite_pattern": "a structural pattern like: [Outcome for merchant] in [timeframe] — [specific detail about how]"
}`;
}

/**
 * FIX_PLAN_PROMPT
 * Input: { findings_summary — stringified findings with section, check, detail, severity, impact }
 * Output: markdown string (not JSON) — prioritized fix plan
 */
export function fixPlanPrompt(findingsSummary: string, appName: string): string {
  return `You are a Shopify App Store optimization consultant writing a prioritized fix plan for "${appName}".

Below are the issues found in the listing audit. Write a concise, actionable fix plan with a MAXIMUM of 7 items, ordered by impact on installs.

ISSUES FOUND:
${findingsSummary}

RULES:
- Group by priority: RISK issues first (compliance, could get listing flagged), then GROWTH issues (directly increase installs).
- Each fix must be concrete and actionable. Tell them exactly what to change and where.
- Include character limits where relevant (e.g., "Introduction must be under 100 characters").
- Use structural patterns, NOT specific copy rewrites (you don't know their product deeply enough).
- Format each item as:

### [N]. [Title] . Impact: High|Med|Low
**Issue:** What's wrong, in one sentence.
**Fix:** Concrete instruction with a structural pattern or example format they can follow.

- Do NOT use generic advice like "improve your copy" or "add more keywords."
- Do NOT claim to detect AI-written copy.
- Keep the total plan under 800 words.

WRITING STYLE (strict):
- Short declaratives. No filler. Talk like a peer, not a consultant.
- NEVER use em-dashes. Use periods or commas instead.
- NEVER use these words: leverage, delve, crucial, vital, synergy, utilize, optimal, robust, comprehensive, innovative, streamline, facilitate, harness.
- NEVER start sentences with "It's worth noting", "It's important to", "In today's", "Consider optimizing", "By implementing".
- Say "use" not "leverage". Say "important" not "crucial". Say "fix" not "optimize".
- Be direct: "Fix your intro" not "You may want to consider revising your introduction."
- No hedge-stacking: "can help to potentially improve" is banned. Say what it does.`;
}
