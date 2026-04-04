# SellonTube Growth Audit — Read This First

**Date:** 2026-04-04
**Data sources:** GSC (90d), GA4 (90d), DataForSEO (sot_master.csv, refreshed 2026-03-21), Ahrefs site audit (2026-04-02)

---

## Baseline (90 days ending 2026-04-04)

| Metric | Value |
|--------|-------|
| Total sessions | 556 |
| Organic sessions | 119 (21.4%) |
| Direct sessions | 409 (73.6%) |
| Total GSC queries | 75 |
| Total GSC clicks | 3 (all branded "sell tube") |
| Non-branded clicks | 0 |
| Highest impression query | "youtube marketing strategy" (191 imp, pos 55) |
| Top page by sessions | Homepage (246), Video Ideas Generator (142) |
| Indexable pages in sitemap | ~95 |

---

## Top 10 Fastest Wins

### 1. Fix 13 pSEO pages returning 404
**Impact: Critical.** Ahrefs crawl (Apr 2) found these `/youtube-for/` pages 404ing despite existing in `niches.ts`: fintech-companies, insurance-agents, edtech-companies, mortgage-brokers, recruiting-firms, hr-software, healthcare-practices, cybersecurity-companies, management-consultants, subscription-businesses, dental-practices, accountants, marketplaces. Each has 17 internal links pointing to it. Build/deploy issue — these pages should be live.
**Effort:** Low. Likely a build or publishDate issue. Fix and redeploy.

### 2. Fix double "| SellOnTube | SellOnTube" title suffix
**Impact: High.** Almost every pSEO page, tool page, and hub page has a duplicate site name in the `<title>` tag. Example: "YouTube Transcript Generator -- Free, Instant, No Signup | SellonTube | SellOnTube" (82 chars). Google truncates at ~60 chars. This wastes 14+ characters of title space and looks broken in SERPs.
**Effort:** Low. Fix in the layout component or config.yaml title template.

### 3. Expand `/blog/youtube-marketing-roi` for "youtube marketing roi" (pos 17.2, 8 imp)
**Impact: Medium.** Closest non-branded query to page 1. DataForSEO shows "youtube marketing roi" is not in the winnable tier, but the page is already ranking. Add a dedicated section on "youtube advertising roi" (pos 14.5, 2 imp) — same page ranks for both. Expand with concrete ROI benchmarks, industry comparisons, and a calculator embed.
**Effort:** Medium. Content expansion + internal linking.

### 4. Strengthen `/youtube-for/coaches` for "youtube for coaches" (pos 16.6, 5 imp)
**Impact: Medium.** Best-performing pSEO page by GSC data. Also ranking for "youtube video ideas for coaches" (pos 10.5-13) and "youtube video marketing for coaches" (pos 18.5). Add more coach-specific video examples, link to `/youtube-video-ideas/coach-results-videos`, and add FAQ schema.
**Effort:** Low-Medium. Content enrichment.

### 5. Optimize `/tools/youtube-transcript-generator` for "youtube to transcript" (pos 5)
**Impact: Medium.** Position 5 — already on page 1. Fix the double title suffix (currently 82 chars). Add structured data. Ensure the page has unique copy beyond the tool UI (compare vs competitors, FAQ, use cases). Low volume but a page-1 lock-in.
**Effort:** Low. Title fix + copy additions.

### 6. Publish the "best youtube seo tools" blog post (4,400 vol, KD 23)
**Impact: High.** "youtube seo tools" is the #1 winnable keyword by volume (4,400/mo). The blog post `/blog/best-youtube-seo-tools-for-business` appears to exist in the sitemap and GA4 (13 sessions) but NOT in `src/data/post/`. Verify if this is live, drafts, or a stale build artifact. If live, it has zero GSC impressions — investigate indexing. If not live, publish immediately.
**Effort:** Medium. Write or verify + submit to GSC.

### 7. Remove `/slides` from sitemap (orphan page)
**Impact: Low but clean.** Ahrefs flagged `/slides` as an orphan page — zero internal links, in sitemap, title "SellOnTube - Pitch Deck". This is an internal sales deck, not a public SEO page. Either noindex it or add a sitemap exclusion filter in `astro.config.ts`.
**Effort:** Low. One-line config change.

### 8. Fix ~15 broken `/youtube-video-ideas/` URLs
**Impact: Low-Medium.** Ahrefs found 15+ 404s in the video ideas section: photographers-youtube-video-ideas, coach-pricing-videos, consultant-myth-busting-videos, saas-onboarding-preview-videos, etc. These are linked internally. Either restore the pages or add redirects to the closest living page.
**Effort:** Low. Redirect rules or data fixes.

### 9. Fix title lengths on blog posts (7 posts over 70 chars)
**Impact: Medium.** Ahrefs flagged titles truncated in SERPs: `compounding-effect` (108 chars), `create-youtube-channel-for-business` (98 chars), `high-intent-topic-research-framework` (98 chars), `youtube-marketing-strategy` (94 chars), `youtube-vs-blog-shopify-app-case-study` (91 chars), `youtube-marketing-roi` (83 chars), `youtube-marketing-b2b` (79 chars). Rewrite to under 60 chars with keyword-first structure.
**Effort:** Low. Frontmatter edits.

### 10. Submit all 13 fixed pSEO pages to GSC after rebuild
**Impact: Medium.** Once the 404s are fixed, each page needs a GSC URL Inspection > Request Indexing submission to get crawled. Don't batch more than 10/day (GSC daily quota).
**Effort:** Low. Manual GSC submissions over 2 days.

---

## Top 5 Pages to Improve Now

| Priority | Page | Opportunity | Action |
|----------|------|-------------|--------|
| 1 | `/blog/youtube-marketing-roi` | "youtube marketing roi" pos 17.2 (8 imp), "youtube advertising roi" pos 14.5 (2 imp) | Expand ROI benchmarks section, add "youtube advertising roi" H2, embed calculator, add FAQ schema |
| 2 | `/youtube-for/coaches` | "youtube for coaches" pos 16.6 (5 imp), "youtube video ideas for coaches" pos 10.5 (3 imp) | Add coach video examples, interlink to video-ideas/coach-*, add FAQ schema |
| 3 | `/tools/youtube-transcript-generator` | "youtube to transcript" pos 5 (2 imp), "transcript generator youtube" pos 19 (1 imp) | Fix double title, add comparison copy, add FAQ schema, submit to GSC |
| 4 | `/blog/youtube-marketing-strategy` | "youtube marketing strategy" 191 imp at pos 55, "marketing strategy for youtube" pos 20 | Page exists but ranks terribly. Needs complete rewrite with stronger structure targeting "youtube marketing strategy" as primary keyword. Current title is 94 chars. |
| 5 | `/blog/create-youtube-channel-for-business` | "how to create a youtube business account" pos 5 (1 imp), "using youtube for business" (210 vol, KD 24) | Already mapped to most live winnable keywords. Add step-by-step screenshots, expand FAQ, target long-tail variants. |

---

## Top 5 Content Pieces to Publish Next

All from the winnable tier in sot_master.csv. Ordered by total addressable volume.

| Priority | Content Piece | Target Keywords (DataForSEO vol) | KD | Type |
|----------|--------------|----------------------------------|-----|------|
| 1 | "Best YouTube SEO Tools for Business" blog | youtube seo tools (4,400), best tools for youtube seo (90), youtube seo software (140) | 12-27 | Blog |
| 2 | YouTube Script Generator tool | youtube script (1,600), youtube video script (480), script for a youtube video (480), youtube script writer (210) | 10-24 | Tool |
| 3 | "YouTube SEO Services" blog or service page | youtube seo services (1,600), youtube seo agency (210), youtube seo company (70), youtube seo expert (90) | 0-10 | Blog |
| 4 | "Create a YouTube Channel for Your Company" expansion | create a company youtube channel (6,600), but KD 27 — stretch | 27 | Blog update |
| 5 | "YouTube Content Strategy" blog | youtube content strategy (110), content strategy youtube (110), youtube strategy (1,600 at KD 16) | 5-16 | Blog |

---

## Top 3 Pieces to Kill or Pause

| # | Piece | Reason |
|---|-------|--------|
| 1 | **Most pSEO youtube-for/ pages targeting ultra-niche verticals** (hr-software, cybersecurity-companies, fintech-companies, dental-practices, mortgage-brokers, etc.) | DataForSEO shows 0 monthly search volume for almost all "youtube for [niche]" queries. 13 of these pages are currently 404ing anyway. Fix the 404s for link equity, but don't invest time expanding content on zero-volume pages. Focus pSEO energy on the 3-4 niches with real volume: real-estate (210), coaches (via GSC signal), saas, small-business. |
| 2 | **Planned youtube-video-ideas/ expansion pages** (animators, photographers, make-money, small-business video ideas) | Already 404ing. These are link targets from hub pages but target zero-volume queries with no GSC signal. Don't rebuild — redirect to the hub or nearest living page. |
| 3 | **YouTube Channel Audit Tool** (listed as Tool 2 in microtool-strategy.md, "3K-6K est vol") | The "3K-6K estimated volume" is not validated by DataForSEO. No matching keyword appears in sot_master.csv. Before building, run a DataForSEO validation on "youtube channel audit" exact phrase. Likely inflated. Pause until validated. |

---

## Top 3 AI/LLM Readiness Fixes

| # | Page/Cluster | Verdict | Fix |
|---|-------------|---------|-----|
| 1 | `/blog/youtube-marketing-roi` | **Needs restructuring** | Has original data (case study numbers, ROI formula) but buried in long prose. Add a 40-word direct answer paragraph at the top: "YouTube marketing ROI averages X-Y% for B2B companies that publish 4+ videos/month. Calculate it: (Revenue from YouTube - Total Investment) / Total Investment x 100." This is AI Overview bait. |
| 2 | `/blog/youtube-seo-guide` | **Needs restructuring** | Comprehensive guide but lacks extractable definitions. Add definition boxes: "What is YouTube SEO?", "How YouTube's algorithm ranks videos", numbered step-by-step sections. Currently too narrative for LLM extraction. |
| 3 | `/youtube-for/coaches` + `/youtube-for/saas` | **Too thin to cite** | pSEO template pages with generic content. LLMs won't cite these — they lack original data, specific examples, or unique frameworks. For the 2-3 high-value niches (coaches, saas), add real channel examples, specific video topic lists, and performance benchmarks to make them citation-worthy. |
