# SellonTube Growth Strategy

**Last updated:** 2026-04-22
**Status:** ACTIVE
**Data basis:** DataForSEO (validated Apr 2026), GSC 90d, GA4 90d, sot_master.csv

---

## Mission

Increase high-quality organic traffic to sellontube.com. Google-safe. No shortcuts.

High-quality = B2B founders, SaaS operators, and service businesses actively exploring YouTube as a customer acquisition and lead generation channel.

**No services/agency content.** SellonTube is a product company. All content builds traffic for the product, not for selling YouTube SEO services or agency work.

---

## Core Principle

**Tools are the primary traffic driver. Blogs support tools.**

The Video Ideas Generator (140 vol keyword) already pulls 142 sessions as the #2 page on the site. Tool keywords have 5-40x more volume than blog keywords, all at LOW competition. Build tools fast, rank for utility queries.

---

## The Tool Opportunity Map (DataForSEO validated)

| # | Tool | Primary Keyword | Vol | Competition | Build Effort | Status |
|---|------|----------------|-----|-------------|-------------|--------|
| 1 | YouTube Tag Generator | youtube tag generator | 5,400 | LOW | Low (Gemini) | **APPROVED** |
| 2 | YouTube Title Generator | youtube title generator | 2,400 | LOW | Low (Gemini) | Pending review |
| 3 | YouTube Description Generator | youtube description generator | 1,600 | LOW | Low (Gemini) | Pending review |
| 4 | YouTube Script Generator | youtube script | 1,600 + 2,500 variants | LOW (KD 18) | Low (Gemini, Coming Soon page exists) | Pending review |
| 5 | YouTube Hashtag Generator | youtube hashtag generator | 880 | LOW | Very Low (client-side) | Pending review |
| 6 | YouTube Keyword Research Tool | youtube keyword research tool | 880 | LOW | Medium (needs API) | Pending review |

**Already live:**
- YouTube SEO Tool (youtube seo tools, 4,400 vol)
- YouTube Video Ideas Generator (youtube video ideas generator, 140 vol) — 142 sessions
- YouTube Video Ideas Evaluator
- YouTube ROI Calculator
- YouTube Transcript Generator (pos 5 for "youtube to transcript")

**Total untapped tool volume: ~12,760/mo**

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

## Tool Specs

### Tool #1: YouTube Tag Generator

**Status: APPROVED**
**Slug:** `/tools/youtube-tag-generator`
**Primary keyword:** youtube tag generator (5,400 vol/mo, LOW competition)

**What it does:** User enters a video topic or title. Tool generates 15-20 relevant YouTube tags sorted by relevance. One-click copy all.

**Build approach:** Gemini Flash integration (existing pattern from Video Ideas Generator). Input: topic/title. Output: 15-20 tags with buyer-intent variants for B2B.

**B2B angle:** Tag suggestions include buyer-intent variants, not just engagement tags. For "CRM comparison" -> suggest "crm for small business", "best crm software", "crm demo" -- not "tech review" or "software haul."

**Title:** `Free YouTube Tag Generator | SellOnTube` (40 chars)
**Meta:** "Generate optimized YouTube tags for any video topic. Free, instant, no signup. Get 15-20 relevant tags ranked by search potential." (131 chars)

**Internal links:**
- /tools/youtube-seo-tool ("Check your full video SEO score")
- /tools/youtube-title-generator (once built -- "Need a title first?")
- /blog/best-youtube-seo-tools-for-business

### Tool #2: YouTube Title Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-title-generator`
**Primary keyword:** youtube title generator (2,400 vol/mo, LOW competition)
**Variants:** yt title generator (2,400), title generator for youtube (2,400), ai youtube title generator (260), youtube video title generator (260)

**What it does:** User enters video topic + optional audience selector. Gemini generates 10 click-worthy title options. Each title shows estimated search-friendliness rating.

**Build approach:** Gemini Flash. Same integration pattern.

### Tool #3: YouTube Description Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-description-generator`
**Primary keyword:** youtube description generator (1,600 vol/mo, LOW competition)

**What it does:** User enters video title + topic + optional CTA. Gemini generates a 150-200 word SEO-optimized YouTube description with timestamps placeholder, links section, and keyword integration.

**Build approach:** Gemini Flash. Same integration pattern.

### Tool #4: YouTube Script Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-script-generator` (existing Coming Soon page)
**Primary keyword cluster:** youtube script (1,600), youtube video script (480), script for a youtube video (480), youtube video script generator (260), youtube script writer (210), + AI variants totaling ~4,100 vol

**What it does:** User enters topic, selects audience (SaaS founders / agencies / consultants / e-commerce), selects video length (short/medium/long), selects CTA type. Gemini generates a structured script outline: Hook -> Problem -> Solution -> Proof -> CTA. Each section has fill-in prompts.

**Build approach:** Gemini Flash. Replace existing Coming Soon page.

### Tool #5: YouTube Hashtag Generator

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-hashtag-generator`
**Primary keyword:** youtube hashtag generator (880 vol/mo, LOW competition)

**What it does:** User enters video topic/title. Tool generates 10-15 relevant hashtags. Explains YouTube's 3-hashtag-above-title rule and 15-hashtag-in-description best practice.

**Build approach:** Can be client-side (simpler) or Gemini-enhanced.

### Tool #6: YouTube Keyword Research Tool

**Status: PENDING USER REVIEW**
**Slug:** `/tools/youtube-keyword-research-tool`
**Primary keyword:** youtube keyword research tool (880 vol/mo, LOW competition)
**Variants:** free youtube keyword tool (590), keyword planner for youtube (390), free youtube keyword research tool (320). Total cluster: ~2,000+ vol.

**What it does:** User enters a seed keyword. Tool returns related YouTube search suggestions with estimated volume indicators. Uses YouTube Autocomplete API (free, no key needed) + optional DataForSEO enrichment.

**Build approach:** Medium complexity. YouTube Autocomplete is free/client-side. Volume estimates would need server-side DataForSEO calls (cost per lookup).

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

**Cadence:** Up to 5 posts/week. pSEO is paused, so all publishing velocity goes to blog. Quality bar unchanged -- every post must meet content-playbook.md standards.

### Current Blog Schedule (Apr 20 - Apr 28, 2026)

All posts drafted. 5/week cadence.

| Day | Post | Primary Keyword | Vol | KD |
|-----|------|----------------|-----|-----|
| Apr 20 (Mon) | youtube-script-writing-guide | youtube script | 1,600+ variants | 10-24 |
| Apr 21 (Tue) | youtube-channel-optimization-checklist | optimizing youtube channel | 640 | 27-29 |
| Apr 22 (Wed) | youtube-keyword-research | keyword research for youtube | 260 | 41 |
| Apr 23 (Thu) | youtube-lead-generation | youtube lead gen | 100 | 6-12 |
| Apr 24 (Fri) | youtube-views-but-no-leads | painpoint (zero-vol JTBD) | 0 | -- |
| Apr 25 (Sat) | youtube-shorts-for-business | youtube shorts for business | 30 | 0 |
| Apr 27 (Sun) | best-youtube-rank-checker-tools-for-business | youtube rank checker | -- | -- |
| Apr 28 (Mon) | youtube-marketing-cost | youtube marketing cost | 10 | 29 |

**Dropped from previous plans:**
- the-youtube-acquisition-engine -- killed 2026-04-22 (severe cannibalization with 5 other posts, no viable keyword, 301 to youtube-marketing-strategy)
- youtube-seo-services -- killed (conflicts with no-agency rule)
- youtube-marketing-plan -- killed (cannibalizes marketing-strategy)
- youtube-marketing-not-working -- merged into youtube-views-but-no-leads
- ai-tools-for-youtube -- deferred (KD 36, stretch tier)
- youtube-best-practices-for-business -- deferred (no winnable keyword)
- youtube-for-small-business -- dropped (pSEO page overlap)
- youtube-sales-funnel -- dropped (overlaps lead-generation)
- b2b-video-content-ideas -- dropped (overlaps video ideas tool)
- is-youtube-worth-it-for-business -- dropped (covered by existing posts)

**Service/agency keywords permanently excluded:**
youtube seo services (1,600), youtube seo agency (210), youtube agency (260), youtube marketing agency (260), youtube seo company (70), youtube seo expert (90), and 19 others totaling 10,170 vol.

### Blog Cluster Architecture

6 clusters, all under the theme "YouTube for B2B customer acquisition."

| Priority | Cluster | Sub-topic | Existing posts | Winnable keywords | Action |
|---|---|---|---|---|---|
| **1** | 3 | YouTube SEO for business | **None** | 8 (top vol: 4,400) | Write now when blogs resume |
| **2** | 2 | Topic research and strategy | 1 post | 2 | Continue building out |
| **3** | 1 | Economics of YouTube acquisition | 1 post | 3 | Continue building out |
| **4** | 4 | Niche application (industry posts) | None | low | After Clusters 3+2+1 are covered |
| **5** | 5 | Comparison and alternatives | None | low | After authority builds |
| **6** | 6 | Case studies and data | 1 post | 1 | 1 per 6-8 weeks, backlink play |

### Cluster Post Ideas

**Cluster 1 -- Economics:**
- "YouTube ROI for SaaS: What a $12k/Year Channel Realistically Returns"
- "YouTube vs. Paid Ads for B2B: A Cost-Per-Lead Comparison With Real Numbers"
- "How Much Does a YouTube Customer Acquisition Channel Actually Cost to Run?"
- "When YouTube Does Not Work for Customer Acquisition (And What to Do Instead)"
- "The Break-Even Math: How Many Clients Do You Need to Justify YouTube?"

**Cluster 2 -- Topic Research:**
- "How to Find YouTube Topics Your Competitors Are Not Covering"
- "The Difference Between Trending YouTube Topics and High-Intent Topics"
- "How to Use YouTube Search Autocomplete for B2B Topic Research"
- "What Makes a YouTube Topic 'High Intent' vs. 'High Volume'?"
- "5 Topic Research Mistakes B2B Companies Make on YouTube"
- "How to Map Your Product Features to YouTube Search Queries"

**Cluster 3 -- YouTube SEO (priority when blogs resume):**
- **Pillar:** "YouTube SEO for Business: A Non-Creator's Guide to Ranking for Buyer Queries"
- "How to Write YouTube Titles That Rank for Buyer-Intent Queries"
- "YouTube Video Descriptions That Work: Templates for B2B and SaaS"
- "YouTube Chapters and Timestamps: The Hidden SEO Signal Most Business Channels Ignore"
- "YouTube Thumbnail Strategy for Business Channels: Not Clickbait, But Not Boring"

**Cluster 4 -- Niche Application:**
- "YouTube for SaaS: The 3 Video Types That Drive Demo Requests"
- "YouTube for Agencies: How to Use Video to Win Clients Who Are Already Evaluating You"
- "YouTube for Consultants: Why 'Personal Brand' Is the Wrong Frame"
- "YouTube for E-Commerce: The Bottom-of-Funnel Content Mix That Drives Purchase Decisions"
- "YouTube for Coaches: How to Attract High-Ticket Clients Through Search, Not Audience"

**Cluster 5 -- Comparisons:**
- "YouTube vs. LinkedIn for B2B Lead Generation: Which One Compounds Faster?"
- "YouTube vs. Podcast for Customer Acquisition: A Practical Comparison for Service Businesses"
- "YouTube vs. Webinars: Which Format Produces Better Qualified Leads?"
- "YouTube vs. Cold Outreach: Why One Scales and One Doesn't"

**Cluster 6 -- Case Studies (highest backlink potential, 1 per 6-8 weeks):**
- "How a $8k/Month YouTube Channel Replaced a Full SDR Team for One SaaS Startup"
- "3 SaaS Companies That Use YouTube for Customer Acquisition (And What Their Topics Have in Common)"
- "We Analysed 50 B2B YouTube Channels. Here Is What the Successful Ones Do Differently."
- "6 Months, 24 Videos, 14 Enterprise Leads: A B2B YouTube Channel Performance Breakdown"

### Post Type Risk Table

| Post type | Spam risk | Link potential | Conversion potential |
|---|---|---|---|
| Economics / ROI posts | Low | Medium | High |
| Framework / how-to posts | Low | Medium | Medium |
| Niche application posts | Low | Low | Very high |
| Comparison posts | Low | Medium | High |
| Case studies with data | Very low | Very high | High |
| Tool roundups without unique angle | Medium | Low | Low |
| Listicles without original data | High | Very low | Low |

Avoid listicles and tool roundups without a genuinely B2B-specific angle that doesn't exist elsewhere.

---

## pSEO Strategy (PAUSED)

pSEO drip publishing is paused. Blog content is the priority. Existing live pSEO pages remain indexed but no new pages are being published.

Focus expansion only on pages with GSC signal:
- /youtube-for/coaches (pos 16.6, 5 imp)
- /youtube-for/saas (pos 14, 1 imp)

---

## Keyword Tier System

`sot_master.csv` has a `tier` column based on real DataForSEO keyword difficulty (KD):

| Tier | KD range | What to do |
|---|---|---|
| `winnable` | <= 30 | Write now. 106 keywords. These are the only blog targets for the current site. |
| `stretch` | 31-45 | Revisit at 6-12 months when site has more authority. 66 keywords. |
| `avoid` | > 45 | Do not target. 123 keywords. Many had inflated GKP volumes. |
| `pseo` | n/a | pSEO pages -- zero GKP volume is intentional. Topical authority play, not volume play. |

**Key insight:** 79% of keywords in the CSV had GKP volumes that overstated reality by 30%+. Trust `search_volume_live` and `kd_real` -- not `search_volume` or `keyword_difficulty`.

**Refresh schedule:** Re-run `scripts/update_keyword_tiers.py` and `scripts/refresh_keyword_volumes.py` quarterly, or whenever new keywords are added.

---

## Backlink Strategy

This is the #1 constraint on organic growth. Without backlinks, Google has little reason to trust a new site even with excellent content.

**Tactics within Google's guidelines:**

1. **Digital PR / data-driven content** -- Publish one piece of original research (e.g., "We analysed 100 B2B YouTube channels -- here's what actually drives leads"). Pitch to marketing newsletters (Demand Curve, Marketing Examined, The Hustle). One placement = multiple backlinks.

2. **Guest posts on B2B marketing publications** -- Write one guest post per month on a site with DR > 40 in the B2B/SaaS marketing space. Pitch the brand angle: "YouTube customer acquisition for B2B companies that don't want to record themselves."

3. **Tool / calculator embed** -- The YouTube ROI calculator is a linkable asset. Pitch it to marketing newsletters and blogs as a free tool to reference.

4. **Podcast appearances** -- Founder goes on B2B marketing podcasts. Hosts link to guest sites from show notes.

5. **Community mentions** -- Answer questions in relevant communities (Reddit r/entrepreneur, r/SaaS, Indie Hackers, LinkedIn) with genuine depth. Not spam -- become the trusted voice.

6. **Partnership / integration mentions** -- Reach out to tools used in the service workflow for mutual mention or case study spots.

**Never:** buy links, do link exchanges, use PBNs.

---

## Distribution (Non-SEO Traffic)

Google's Helpful Content system rewards real brand signals -- direct searches, links from real sites, social mentions. Distribution feeds into Google's trust model.

See `content-playbook.md` Section 7 for recommended channels, repurposing strategy, and the underutilized channel mapping framework. Pick 2 channels and commit.

---

## Technical Fixes Still Needed

1. **Double "| SellOnTube | SellOnTube" title suffix** -- still live in current build. Affects ~60 pages.
2. **7 blog post titles over 70 chars** -- frontmatter changes needed.
3. **~15 video-ideas pages 404ing** -- pages with past publishDates not appearing in build. Needs investigation.
4. **Orphan /slides page** -- noindex or remove from sitemap.

---

## What NOT to Do

- No bulk pSEO publishing -- the drip schedule is intentional
- No link buying, exchanges, or PBNs
- No AI-mass-generated content posted directly without editing
- No keyword stuffing in titles, headings, or body copy
- No chasing trending topics unrelated to the ICP
- No social media volume without quality -- 3 great LinkedIn posts beats 20 mediocre ones

---

## How We Measure Progress

Check weekly/monthly:
- GSC: impressions trending up
- GSC: CTR on targeted pages
- GA4: organic search sessions
- GSC: new pages appearing in impressions as pSEO drips live
- Backlink count (Ahrefs, SEMrush, or free Moz alternative)

**6-month target (conservative):** 500+ organic sessions/month, 20+ GSC pages with impressions, 3+ backlinks from DR40+ domains.

**6-month target (optimistic):** 2,000+ organic sessions/month if pSEO + blog velocity + 1-2 backlink wins land.

---

## Blog Content Audit (2026-04-22)

Comprehensive impressions audit of 6 underperforming blog posts. Data source: live GSC API (90-day window). Full diagnosis in `audit-findings-2026-04-22.md`.

### Actions Taken

| Post | Slug | Action | Old title | New title | Target keyword | Est. vol |
|------|------|--------|-----------|-----------|---------------|----------|
| 1 | the-youtube-acquisition-engine | **Killed (301)** | YouTube for Customer Acquisition: Full System | n/a | n/a | n/a |
| 2 | why-most-youtube-strategies-fail | **Retargeted** | Why Most YouTube Strategies Fail | 7 YouTube Marketing Mistakes That Kill Business Channels | youtube marketing mistakes | 300-800 |
| 3 | youtube-keyword-research | **Skipped** | (just published, needs time to index) | -- | -- | -- |
| 4 | high-intent-topic-research-framework | **Retargeted** | High-Intent Topic Research Framework | YouTube Content Strategy: How to Plan Videos That Bring Customers | youtube content strategy | 220 |
| 5 | youtube-channel-optimization-checklist | **Expanded** | YouTube Channel Optimization: 12-Point Checklist | YouTube Channel Optimization: 13-Point Checklist for Lead Gen | youtube channel optimization | 200-400 |
| 6 | search-intent-youtube-seo-power | **Retargeted** | YouTube Search Intent: Why It Beats Blog SEO | YouTube vs Blogging for Business: Why Video Wins for B2B Lead Gen | youtube vs blogging for business | ~2,350 |

### Kill details

- `the-youtube-acquisition-engine` 301-redirected to `youtube-marketing-strategy` (highest-impression post, same topic area)
- `draft: true` added to frontmatter so Astro skips it; Netlify 301 catches both `/blog/` and bare paths
- 8 internal links across 4 files updated to point to new target

### Expansion details

- All retargeted posts expanded to 2,000-2,500 words (from 1,050-1,550)
- Added: key takeaways, table of contents, comparison tables, data tables, callout boxes
- All posts verified: zero em dashes, zero banned words, zero build errors
- Post 6 differentiated from `/youtube-vs/blogging` pSEO page (deep guide vs quick comparison, cross-linked)

### Projected impact

- Aggregate 90-day impressions before: 80 (1 click)
- Aggregate 90-day impressions projected: 1,900-5,200
- Measurement window: re-check GSC data on 2026-05-22 (30 days) and 2026-07-22 (90 days)

---

## Tools Impressions Audit (2026-04-22)

Comprehensive on-page SEO audit of all 6 tool pages. Data source: live GSC API (90-day window ending 2026-04-22), SERP analysis, competitor DR profiling. Full diagnosis in `tools-audit-findings-2026-04-22.md`. Run log in `tools-audit-run-log-2026-04-22.md`.

**Baseline:** 122 total impressions, 1 click across 6 pages in 90 days.

### Actions Taken (On-Page Edits)

| Page | Edits | Key Changes | Primary Keyword | Projected 90d Impressions |
|------|-------|-------------|-----------------|---------------------------|
| Tag Generator | 6 | Title/meta: added "AI". 2 new FAQs (tag extractor, what are tags) | youtube tag generator (5,400 vol) | 300-900 (40-130x) |
| Script Generator | 6 | Title/meta: added "AI". Blog cross-link to script writing guide. Badge: "AI-powered scripts" | youtube script generator (1,600 vol) | 345-675 (55-110x) |
| Description Generator | 7 | **H1 fix** ("Descriptions That Get Found" -> "AI YouTube Description Generator"). Added "AI" throughout. New FAQ | youtube description generator (1,600 vol) | 500-900 (60-110x) |
| Transcript Generator | 8 | Removed "BoFu"/"GTM" jargon. Added "YouTube-to-text" semantic variants. Fixed stale "(coming soon)". SEO guide cross-link | youtube transcript generator (1,600 vol) | 400-740 (5-10x) |
| Competitor Analysis | 7 | **Repositioned** from "competitor analysis" (unwinnable, DR 70+) to "competition checker" (pos 7, winnable). Title, H1, meta, schema, breadcrumb all updated | youtube competition checker (100-300 vol) | 150-350 (8-19x) |
| Channel Audit | 4 | Hygiene only: title, H1, intro, schema. **Ceiling-capped** (10 vol/mo) | youtube channel audit tool (10 vol) | 30-60 (3-7x) |

### Cross-Page Patterns Fixed

1. **"AI" keyword gap** (5 of 6 pages): Every competitor leads with "AI" in titles. Added to Tag, Script, Description, Transcript generators. Competitor Analysis excluded (does not use AI).
2. **H1 keyword misalignment** (4 of 6 pages): Description ("Descriptions That Get Found"), Channel Audit ("Is Your Channel Reaching Buyers"), Competitor Analysis ("Can You Beat What's Already Ranking"), Script (already had keyword). All replaced with keyword-aligned headings matching "Tool Name for Business Channels" pattern.
3. **Schema descriptions**: All 6 updated to lead with primary keyword for rich result eligibility.

### Not Yet Done

- **~30 internal links from ~12 blog posts**: The highest-impact remaining fix. Every tool page is missing links from 3-8 high-authority blog posts. This is Phase 2.5 work.
- **GSC URL Inspection**: Tag Generator, Script Generator, and Description Generator need manual "Request Indexing" via GSC UI (possible indexation issues detected).
- **Subdomain decision**: `transcript.sellontube.com` dilutes authority for `/tools/youtube-transcript-generator`. Recommended: 301 redirect subdomain to tool page. Pending user decision.

### Projected Impact

- **Aggregate 90-day impressions before:** 122 (1 click)
- **Aggregate projected after on-page edits:** 1,725-3,625
- **Aggregate projected after internal links added:** 2,500-5,000+
- **Measurement window:** Re-check GSC data on 2026-05-22 (30 days) and 2026-07-22 (90 days)

---

## Open Decisions

1. **Include "create a company youtube channel" (6,600 vol, KD 27) in product bucket?** This keyword was excluded because it contains "company." User should decide: product-relevant (people creating channels = potential SellonTube users) or service-relevant (implies hiring someone)?
2. **Review + approve/revise tools #2-6 specs** -- present each for approval before building.
3. **YouTube Channel Name Generator (2,900 vol)** -- off-ICP but massive traffic. Build as traffic play or skip?

---

## Reference Files

- **Keyword data:** `research/keywords/sot_master.csv` (single source of truth for all content decisions)
- **Writing quality:** `content-playbook.md` (quality benchmark for blog posts)
- **Style rules:** `style-guide.md` (sentence-level writing rules)
- **SEO rules:** `seo-rules.md` (technical SEO constraints)
- **Content depth:** `content-depth-framework.md` (word count targets by page type)
- **Content audit:** `content-audit-playbook.md` (how to diagnose and fix underperforming blog posts)
- **Tools audit:** `tools-audit-findings-2026-04-22.md` (per-page diagnosis, keyword ownership map, priority ranking)
- **AI visibility:** `ai-seo-guide.md` (AEO/GEO rules)
- **ICP definition:** `docs/icp.md`
- **Tool build pattern:** `agents/08-microtool-builder.md` (Gemini Flash integration standard)
- **Reference implementation:** `src/pages/tools/youtube-video-ideas-generator.astro` + `netlify/functions/generate-alternatives.ts`
