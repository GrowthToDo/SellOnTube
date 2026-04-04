# SellonTube Content Strategy v2 — Tools-First Growth Plan

**Created:** 2026-04-04
**Status:** IN PROGRESS — presenting pieces one by one for user review
**Branch:** content-strategy
**Data basis:** DataForSEO (validated Apr 2026), GSC 90d, GA4 90d, sot_master.csv

---

## Core Principle

**Tools are the primary traffic driver. Blogs support tools.**

The Video Ideas Generator (140 vol keyword) already pulls 142 sessions as the #2 page on the site. Tool keywords have 5-40x more volume than blog keywords, all at LOW competition. Build tools fast, rank for utility queries.

**No services/agency content.** SellonTube is a product company. All content builds traffic for the product, not for selling YouTube SEO services or agency work.

---

## Constraint: "create a company youtube channel" (6,600 vol, KD 27)

This keyword was excluded from the product bucket during analysis because it contains "company." User should decide: is this product-relevant (people creating channels = potential SellonTube users) or service-relevant (implies hiring someone)? If product-relevant, it's the single highest-volume winnable keyword.

**Decision needed:** Include or exclude?

---

## The Tool Opportunity Map (DataForSEO validated)

| # | Tool | Primary Keyword | Vol | Competition | Build Effort | Status |
|---|------|----------------|-----|-------------|-------------|--------|
| 1 | YouTube Tag Generator | youtube tag generator | 5,400 | LOW | Low (Gemini) | **APPROVED — ready to build** |
| 2 | YouTube Title Generator | youtube title generator | 2,400 | LOW | Low (Gemini) | Pending review |
| 3 | YouTube Description Generator | youtube description generator | 1,600 | LOW | Low (Gemini) | Pending review |
| 4 | YouTube Script Generator | youtube script | 1,600 + 2,500 variants | LOW (KD 18) | Low (Gemini, Coming Soon page exists) | Pending review |
| 5 | YouTube Hashtag Generator | youtube hashtag generator | 880 | LOW | Very Low (client-side) | Pending review |
| 6 | YouTube Keyword Research Tool | youtube keyword research tool | 880 | LOW | Medium (needs API) | Pending review |

**Already live:**
- YouTube SEO Tool (youtube seo tools, 4,400 vol) — LIVE
- YouTube Video Ideas Generator (youtube video ideas generator, 140 vol) — LIVE (142 sessions)
- YouTube Video Ideas Evaluator — LIVE
- YouTube ROI Calculator — LIVE
- YouTube Transcript Generator — LIVE (pos 5 for "youtube to transcript")

**Total untapped tool volume: ~12,760/mo**

---

## Killed from Old Plan (Unvalidated)

| Old Tool | Old "Estimated Vol" | DataForSEO Reality | Decision |
|----------|--------------------|--------------------|----------|
| YouTube Channel Audit for B2B | "3,000-6,000 est" | No matching keyword found | **KILLED** |
| YouTube vs Blog Calculator | "2,000-4,000 est" | No matching keyword found | **KILLED** |
| YouTube Topic Fit Checker | "3,000-7,000 est" | youtube video ideas generator = 140 vol | Already live as Video Ideas Evaluator |
| YouTube Title Analyzer | "4,000-8,000 est" | youtube title generator = 2,400 vol | **Replaced** by Title Generator (tool #2) |

---

## Blog Strategy (Paused Until Top 4 Tools Ship)

New blog posts resume after tools 1-4 are live. Existing blogs continue to accrue rankings.

When blogs resume, priority order:

| # | Blog Post | Target Keyword | Vol | KD |
|---|-----------|---------------|-----|-----|
| 1 | YouTube Marketing Strategy (rewrite existing) | youtube marketing strategy | 320 | 17 |
| 2 | YouTube Content Strategy (new) | youtube content strategy | 110 | 5 |
| 3 | Optimizing YouTube Channel (new) | optimizing youtube channel | 320 | 27 |
| 4 | YouTube Analytics for Other Channels (new) | youtube analytics for other channels | 390 | 25 |

**Service/agency keywords permanently excluded:**
youtube seo services (1,600), youtube seo agency (210), youtube agency (260), youtube marketing agency (260), youtube seo company (70), youtube seo expert (90), and 19 others totaling 10,170 vol.

---

## pSEO Strategy (Continues as-is)

Drip schedule unchanged. 13 youtube-for/ pages going live Apr 6 through May 18. No content expansion investment on zero-volume pages. Focus expansion only on pages with GSC signal:
- /youtube-for/coaches (pos 16.6, 5 imp)
- /youtube-for/saas (pos 14, 1 imp)

---

## Technical Fixes Still Needed

1. **Double "| SellOnTube | SellOnTube" title suffix** — still live in current build. Affects ~60 pages.
2. **7 blog post titles over 70 chars** — frontmatter changes needed.
3. **~15 video-ideas pages 404ing** — pages with past publishDates not appearing in build. Needs investigation.
4. **Orphan /slides page** — noindex or remove from sitemap.

---

## Tool #1 Spec: YouTube Tag Generator

**Status: APPROVED by user**
**Slug:** `/tools/youtube-tag-generator`
**Primary keyword:** youtube tag generator (5,400 vol/mo, LOW competition)

**What it does:** User enters a video topic or title. Tool generates 15-20 relevant YouTube tags sorted by relevance. One-click copy all.

**Build approach:** Gemini Flash integration (existing pattern from Video Ideas Generator). Input: topic/title. Output: 15-20 tags with buyer-intent variants for B2B.

**B2B angle:** Tag suggestions include buyer-intent variants, not just engagement tags. For "CRM comparison" → suggest "crm for small business", "best crm software", "crm demo" — not "tech review" or "software haul."

**Title:** `Free YouTube Tag Generator | SellOnTube` (40 chars)
**Meta:** "Generate optimized YouTube tags for any video topic. Free, instant, no signup. Get 15-20 relevant tags ranked by search potential." (131 chars)

**Internal links:**
- /tools/youtube-seo-tool ("Check your full video SEO score")
- /tools/youtube-title-generator (once built — "Need a title first?")
- /blog/best-youtube-seo-tools-for-business

---

## Tool #2 Spec: YouTube Title Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-title-generator`
**Primary keyword:** youtube title generator (2,400 vol/mo, LOW competition)
**Variants:** yt title generator (2,400), title generator for youtube (2,400), ai youtube title generator (260), youtube video title generator (260)

**What it does:** User enters video topic + optional audience selector. Gemini generates 10 click-worthy title options. Each title shows estimated search-friendliness rating.

**Build approach:** Gemini Flash. Same integration pattern.

---

## Tool #3 Spec: YouTube Description Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-description-generator`
**Primary keyword:** youtube description generator (1,600 vol/mo, LOW competition)

**What it does:** User enters video title + topic + optional CTA. Gemini generates a 150-200 word SEO-optimized YouTube description with timestamps placeholder, links section, and keyword integration.

**Build approach:** Gemini Flash. Same integration pattern.

---

## Tool #4 Spec: YouTube Script Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-script-generator` (existing Coming Soon page)
**Primary keyword cluster:** youtube script (1,600), youtube video script (480), script for a youtube video (480), youtube video script generator (260), youtube script writer (210), + AI variants totaling ~4,100 vol

**What it does:** User enters topic, selects audience (SaaS founders / agencies / consultants / e-commerce), selects video length (short/medium/long), selects CTA type. Gemini generates a structured script outline: Hook → Problem → Solution → Proof → CTA. Each section has fill-in prompts.

**Build approach:** Gemini Flash. Replace existing Coming Soon page.

---

## Tool #5 Spec: YouTube Hashtag Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-hashtag-generator`
**Primary keyword:** youtube hashtag generator (880 vol/mo, LOW competition)

**What it does:** User enters video topic/title. Tool generates 10-15 relevant hashtags. Explains YouTube's 3-hashtag-above-title rule and 15-hashtag-in-description best practice.

**Build approach:** Can be client-side (simpler) or Gemini-enhanced.

---

## Tool #6 Spec: YouTube Keyword Research Tool

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-keyword-research-tool`
**Primary keyword:** youtube keyword research tool (880 vol/mo, LOW competition)
**Variants:** free youtube keyword tool (590), keyword planner for youtube (390), free youtube keyword research tool (320). Total cluster: ~2,000+ vol.

**What it does:** User enters a seed keyword. Tool returns related YouTube search suggestions with estimated volume indicators. Uses YouTube Autocomplete API (free, no key needed) + optional DataForSEO enrichment.

**Build approach:** Medium complexity. YouTube Autocomplete is free/client-side. Volume estimates would need server-side DataForSEO calls (cost per lookup).

---

## Execution Sequence

| Week | Ship | Volume Captured |
|------|------|----------------|
| Week 1 | YouTube Tag Generator (5,400 vol) | 5,400 |
| Week 2 | YouTube Title Generator (2,400 vol) | 7,800 |
| Week 3 | YouTube Description Generator (1,600 vol) + YouTube Script Generator (4,100 vol) | 13,500 |
| Week 4 | YouTube Hashtag Generator (880 vol) + resume blog cadence | 14,380 |
| Week 5+ | YouTube Keyword Research Tool (2,000+ vol) + blog posts | 16,380+ |

**After 4 weeks:** 6 new tools live, targeting 14,380 vol/mo of LOW competition keywords. Combined with existing tools (youtube seo tools 4,400 + others), total tool keyword coverage: ~19,000 vol/mo.

---

## How to Continue This Plan

**Next session:** Pick up from Tool #2 (YouTube Title Generator) review. Present each remaining tool for approval, then begin building Tool #1 (Tag Generator) which is already approved.

**Files to reference:**
- This file: `growth-audit/content-strategy-v2.md`
- Keyword data: `research/keywords/sot_master.csv`
- Existing tool pattern: `src/pages/tools/youtube-video-ideas-generator.astro` (reference implementation)
- Gemini integration pattern: `netlify/functions/generate-alternatives.ts`
- Growth audit outputs: `growth-audit/read_this_first.md`, `growth-audit/growth_execution_plan.md`
- DataForSEO access: MCP tools `dfs_keyword_metrics`, `dfs_keyword_suggestions`

**Key decisions still needed from user:**
1. Include "create a company youtube channel" (6,600 vol) in product bucket? Yes/No
2. Review + approve/revise tools #2-6 specs
3. YouTube Channel Name Generator (2,900 vol) — off-ICP but massive traffic. Build as traffic play or skip?
