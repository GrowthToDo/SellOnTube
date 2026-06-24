# AEO Extractability Audit — 71 Pages (2026-06-24)

> Scored every blog post (57) + tool page (14) against the **proven citable archetype**: the only SellonTube page that earned AI citations to date — `/blog/how-to-find-youtube-autocomplete-keywords` (6 Copilot/Bing-AI citations, 17 May 2026). Goal: replicate its structure to grow citations 10x+.
> Companion: `research/bing-webmaster-ai-performance.md`, `project_bing_ai_performance` memory.

## The 9 citable signals (rubric)
KT = answer-first Key Takeaways block · DEF = standalone definition block · FAQ = **visible** body FAQ Q&A (frontmatter `faqs:` alone does NOT count) · TOC = anchored Table of Contents · QH = question-style H2s · TBL = comparison/data table · DATA = first-party numbers · FRESH = publishDate · LINK = internal cluster + /tools links · SCHEMA (tools) = WebApplication + FAQPage JSON-LD.

---

## Headline findings

**1. The single highest-leverage gap: frontmatter FAQs that never render on-page.**
~18 posts carry a `faqs:` array in frontmatter (generates invisible JSON-LD) but have **no visible `## FAQ` section in the body**. The visible FAQ Q&A is *exactly* the block Copilot lifted from the cited page. The answers are already written — they just aren't on the page. Lowest-effort, highest-impact fix in the whole audit.

**2. ~10 pages are DRAFT / have no publishDate → invisible to AI entirely.** A draft page cannot be cited. Several have NO publishDate at all (never going live). See list below — needs your decision.

**3. Standalone definition blocks missing on ~half of all pages.** AI lifts clean 1-3 sentence entity definitions. Most posts define terms mid-prose instead of in an isolated block.

**4. All 14 tool pages share the same two gaps:** zero have a KT answer-first block, zero have an anchored ToC. But they already ship FAQPage + WebApplication schema, visible FAQ, descriptive headings, and real numbers — so they're 60-70% there. Adding KT + ToC to all 14 is one clean sweep.

**5. FAQ format weakness:** several posts use bold `**Question**` instead of `### Question` headings — weaker for both FAQ schema and AI extraction.

---

## DRAFT / not-live pages (decision needed — do NOT touch publishDate without confirmation)
ai-tools-for-youtube · b2b-video-content-ideas · how-to-check-youtube-ranking · is-youtube-worth-it-for-business · the-youtube-acquisition-engine · youtube-best-practices-for-business · youtube-for-small-business · youtube-marketing-plan · youtube-sales-funnel · youtube-seo-services

## Template models (10/10 — clone these patterns)
how-to-find-youtube-autocomplete-keywords (proven cited) · when-youtube-doesnt-work · youtube-b2b-buyer-journey-data · youtube-for-saas-demos · youtube-keyword-research · youtube-marketing-attribution · youtube-marketing-strategy · youtube-roi-for-saas · youtube-growth-strategy

## Weakest high-intent pages (full retrofit, highest upside)
youtube-marketing-b2b (4) · youtube-marketing-not-working (4) · youtube-seo-services (4, draft) · youtube-vs-blog-shopify-app-case-study (5, best dataset, worst structure) · the-youtube-acquisition-engine (2, draft) · compounding-effect-four-videos-a-month (2)

---

## Full scores — Blog posts

| slug | KT | DEF | FAQ | TOC | QH | TBL | DATA | publishDate | LINK | /10 | intent |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ai-tools-for-youtube | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | DRAFT | ✓ | 5 | M |
| b2b-video-content-ideas | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | DRAFT | ✓ | 5 | M |
| b2b-video-marketing-strategy | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-06 | ✓ | 8 | M |
| best-youtube-autocomplete-keyword-tools | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-16 | ✓ | 10 | H |
| best-youtube-rank-checker-tools-for-business | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-27 | ✓ | 9 | H |
| best-youtube-seo-tools-for-business | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-03-25 | ✓ | 9 | H |
| best-youtube-transcript-generators | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | 2025-12-28 | ✓ | 6 | H |
| best-youtube-video-ideas-generators-for-businesses | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-03-13 | ✓ | 7 | H |
| compounding-effect-four-videos-a-month | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 2025-12-25 | ✓ | 2 | M |
| create-youtube-channel-for-business | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ | 2026-03-10 | ✓ | 8 | M |
| high-intent-topic-research-framework | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | 2025-12-26 | ✓ | 6 | M |
| how-to-check-youtube-ranking | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | DRAFT | ✓ | 7 | M |
| how-to-check-youtube-rankings | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | 2026-05-29 | ✓ | 8 | M |
| how-to-find-youtube-autocomplete-keywords | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-16 | ✓ | 10 | M |
| how-to-find-youtube-video-ranking-keywords | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-23 | ✓ | 9 | M |
| is-vidiq-worth-it-for-business | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-05-29 | ✓ | 9 | M-H |
| is-youtube-worth-it-for-business | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | DRAFT | ✓ | 5 | H |
| search-intent-youtube-seo-power | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | 2026-04-06 | ✓ | 9 | M |
| the-youtube-acquisition-engine | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | DRAFT | ✓ | 2 | M |
| when-youtube-doesnt-work | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-11 | ✓ | 10 | M-H |
| why-most-youtube-strategies-fail | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 2025-12-23 | ✓ | 7 | M |
| youtube-analytics-other-channels | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-05-28 | ✓ | 8 | M |
| youtube-autocomplete-b2b-research | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ | 2026-06-02 | ✓ | 8 | H |
| youtube-b2b-buyer-journey-data | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-05-26 | ✓ | 10 | H |
| youtube-best-practices-for-business | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | DRAFT | ✓ | 5 | M |
| youtube-break-even-math | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-10 | ✓ | 9 | H |
| youtube-business-plan | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-09 | ✓ | 9 | H |
| youtube-channel-optimization-checklist | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | 2026-04-21 | ✓ | 7 | H |
| youtube-chapters-timestamps | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | 2026-05-22 | ✓ | 8 | H |
| youtube-competitor-analysis | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-03 | ✓ | 9 | H |
| youtube-content-strategy-guide | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | 2026-05-20 | ✓ | 8 | M |
| youtube-description-templates | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | 2026-05-21 | ✓ | 8 | M |
| youtube-for-saas-demos | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-12 | ✓ | 10 | H |
| youtube-for-small-business | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | DRAFT | ✓ | 5 | M |
| youtube-growth-strategy | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-04 | ✓ | 10 | M |
| youtube-keyword-research | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-22 | ✓ | 10 | H |
| youtube-lead-generation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-23 | ✓ | 9 | H |
| youtube-marketing-attribution | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-01 | ✓ | 10 | M |
| youtube-marketing-b2b | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ | 2026-03-04 | ✓ | 4 | H |
| youtube-marketing-cost | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 2026-04-28 | ✓ | 7 | H |
| youtube-marketing-not-working | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | 2026-06-06 | ✓ | 4 | H |
| youtube-marketing-plan | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | DRAFT | ✓ | 7 | M |
| youtube-marketing-roi | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | 2026-02-27 | ✓ | 6 | H |
| youtube-marketing-strategy | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-03-11 | ✓ | 10 | H |
| youtube-marketing-tools | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-05-27 | ✓ | 9 | M |
| youtube-roi-for-saas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-06-05 | ✓ | 10 | H |
| youtube-sales-funnel | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | DRAFT | ✓ | 7 | H |
| youtube-script-examples-business | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-05-26 | ✓ | 9 | M |
| youtube-script-writing-guide | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-04-20 | ✓ | 9 | M |
| youtube-seo-for-business | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | 2026-05-19 | ✓ | 8 | H |
| youtube-seo-guide | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-03-18 | ✓ | 9 | H |
| youtube-seo-services | ✓ | ✗ | ✗ | ✗ | ~ | ✓ | ✓ | DRAFT | ✓ | 4 | M |
| youtube-shorts-for-business | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | 2026-04-25 | ✓ | 6 | M |
| youtube-titles-for-business | ✓ | ✓ | ✗ | ✓ | ✓ | ~ | ✓ | 2026-05-23 | ✓ | 8 | H |
| youtube-video-ideas-generator-for-b2b | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 2026-03-30 | ✓ | 9 | H |
| youtube-views-but-no-leads | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | 2026-04-24 | ✓ | 6 | H |
| youtube-vs-blog-shopify-app-case-study | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | 2025-12-27 | ✓ | 5 | H |
| youtube-vs-paid-ads-b2b | ✓ | ✓ | ✓ | ✓ | ~ | ✓ | ✓ | 2026-05-30 | ✓ | 9 | H |

## Full scores — Tool pages

| tool | KT | DEF | FAQ | TOC | QH | TBL | DATA | SCHEMA | LINK | /10 | intent |
|---|---|---|---|---|---|---|---|---|---|---|---|
| youtube-autocomplete-keywords | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | tools only | 8 | H |
| youtube-channel-audit | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 7 | H |
| youtube-competitor-analysis | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 7 | H |
| youtube-description-generator | ✗ | ~ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | M |
| youtube-ranking-checker | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 7 | M |
| youtube-roi-calculator | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 8 | M |
| youtube-script-generator | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 8 | M |
| youtube-seo-tool | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 8 | H |
| youtube-tag-generator | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 6 | H |
| youtube-title-generator | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 | H |
| youtube-transcript-generator | ✗ | ~ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | M |
| youtube-video-ideas-evaluator | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | M |
| youtube-video-ideas-generator | ✗ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | 6 | M |
| youtube-video-keyword-finder | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | M |

---

## Prioritized retrofit plan (the 10x roadmap)

**Sprint 1 — Render hidden FAQs (highest ROI, content already written).** Add visible `## FAQ` (### Q + answer) from existing frontmatter on live high-intent pages: youtube-seo-for-business, youtube-chapters-timestamps, youtube-content-strategy-guide, youtube-description-templates, youtube-marketing-not-working, youtube-views-but-no-leads, youtube-titles-for-business, youtube-shorts-for-business, high-intent-topic-research-framework, b2b-video-marketing-strategy(expand).

**Sprint 2 — KT + anchored ToC sweep on all 14 tools.** They're 60-70% citable already; this closes the two universal gaps. Clone the pattern from the cited autocomplete page.

**Sprint 3 — Standalone DEF blocks** on high-intent pages missing them (youtube-marketing-cost, youtube-channel-optimization-checklist, youtube-seo-guide, youtube-autocomplete-b2b-research, the "best-X-tools" listicles, etc.).

**Sprint 4 — Full retrofit of weakest high-intent posts:** youtube-marketing-b2b, youtube-marketing-not-working, youtube-vs-blog-shopify-app-case-study, youtube-marketing-roi (add KT+ToC+table/FAQ).

**Sprint 5 — Polish:** convert bold `**Q**` FAQ to `### Q` (youtube-growth-strategy, youtube-lead-generation, how-to-check-youtube-rankings, search-intent-youtube-seo-power, youtube-break-even-math, youtube-video-ideas-generator-for-b2b); convert styled-div ToCs to real anchored `## Contents`.

**Parallel — discovery:** Bing SubmitUrlbatch on every edited page; fix IndexNow; add `OAI-SearchBot` + `Bingbot` to robots.txt. Re-check AI Performance + Compare in ~30 days.

**Blocked on user decision:** the ~10 DRAFT pages (publishDate landmine — never auto-publish). Confirm which are meant to go live.
