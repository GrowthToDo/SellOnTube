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

## Tool Pipeline

> **Full tool pipeline, live inventory, future roadmap, build standards, and publishing workflow have been consolidated into [`agents/08-microtool-builder.md`](../agents/08-microtool-builder.md).** That is the single source of truth for all tool-related strategy. See the "Live Tool Inventory," "Future Tool Pipeline," and "Execution Sequence" sections there.

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

## How to Continue This Plan

**Files to reference:**
- Tool strategy (single source of truth): `agents/08-microtool-builder.md`
- This file: `growth-audit/content-strategy-v2.md` (blog + pSEO strategy)
- Keyword data: `research/keywords/sot_master.csv`
- Growth audit outputs: `growth-audit/read_this_first.md`, `growth-audit/growth_execution_plan.md`
- DataForSEO access: MCP tools `dfs_keyword_metrics`, `dfs_keyword_suggestions`

**Key decisions still needed from user:**
1. Include "create a company youtube channel" (6,600 vol) in product bucket? Yes/No
2. YouTube Channel Name Generator (2,900 vol) -- off-ICP but massive traffic. Build as traffic play or skip?
