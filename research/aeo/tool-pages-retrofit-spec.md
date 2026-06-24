# Tool Pages — AEO Retrofit Spec (plan only, 2026-06-24)

> Plan for making the 14 `/tools/*` pages citable, per the proven archetype. NO edits yet — review before implementing. Companion: `extractability-audit-2026-06-24.md`.

## Why
All 14 tool pages already ship the hard parts: WebApplication + FAQPage + BreadcrumbList schema, a visible FAQ, descriptive headings, real numbers. They score 6-8/10. **Two universal gaps** keep them from being citable:
1. **No answer-first "Key Takeaways" block** under the H1 (heroes are marketing subheads, not extractable summaries).
2. **No anchored on-page ToC** (existing `id`s are JS hooks, not section jump-links).

Closing both across all 14 is the single highest-leverage tool-page move.

## Design constraint (important)
Tool pages are **product pages**, not dark blog heroes. The KT block + ToC must match each tool page's **existing content-section visual system** (light cards, the tool's own palette) — NOT the blog's light-blue callout verbatim. Must look intentional and premium, not bolted-on (see "no AI-generated look" standard). Implementation = an HTML block in the `.astro` content section + an anchored nav; do NOT touch the tool's JavaScript logic.

## Universal change (all 14)
1. **Key Takeaways block** under the H1 / above the tool: 3-5 answer-first bullets stating what the tool does, who it's for (business/acquisition angle), and the key fact a reader/AI would extract.
2. **Anchored section ToC**: give each major content `## `/`<h2>` a stable `id` and add a jump-link nav. AI uses this to map the page.

## Per-tool extras (from audit)

| tool | score | + add (beyond KT + ToC) |
|---|---|---|
| youtube-seo-tool | 8 | tighten one H2 to a verbatim "What is YouTube SEO?" definition heading |
| youtube-roi-calculator | 8 | standalone bolded ROI-formula definition line |
| youtube-script-generator | 8 | standalone "What is a YouTube script?" definition |
| youtube-autocomplete-keywords | 8 | 1-2 contextual /blog/ links (currently tools-only) |
| youtube-channel-audit | 7 | scoring/dimension comparison table |
| youtube-competitor-analysis | 7 | convert beatable-signal cards into a definition table |
| youtube-ranking-checker | 7 | convert card grid into a real data table |
| youtube-description-generator | 7 | standalone "What is a YouTube description?" definition |
| youtube-transcript-generator | 7 | explicit "What is a YouTube transcript?" definition block |
| youtube-video-ideas-evaluator | 7 | restyle DEF as standalone "What is BuyerFit scoring?" heading |
| youtube-video-keyword-finder | 7 | 1-2 more blog cross-links (only 1 now) |
| youtube-tag-generator | 6 | comparison table (tags vs hashtags / vs creator tools) |
| youtube-title-generator | 6 | standalone "What makes a good YouTube title?" definition |
| youtube-video-ideas-generator | 6 | convert 13-patterns div into a real comparison table |

## Suggested execution (when approved)
- Build ONE reference tool first (youtube-seo-tool, highest intent + score) → confirm the KT/ToC design fits the product-page aesthetic → then fan out subagents for the rest with the locked component.
- Verify with `npm run build` after each batch; tools have heavy JS, so confirm no markup breakage.
- Pre-check: confirm no `/tools/*` URL is redirected in netlify.toml before publishing changes (blog drafts were; tools were not, but re-verify).

## Out of scope here
- Earn-citations infra: fix broken IndexNow (Cloudflare), re-check Bing AI Performance in ~30 days with Compare.
- Retired draft decisions (separate, needs per-post review).
