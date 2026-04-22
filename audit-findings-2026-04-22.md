# Blog Impressions Audit Findings — 2026-04-22

**Scope:** 6 blog posts with underperforming impressions
**Data basis:** Live GSC API query (90-day: 2026-01-22 to 2026-04-22), live SERP analysis, sot_master.csv keyword data
**Site context:** SellonTube.com — ~6 months old, low domain authority (DR <10), B2B YouTube acquisition product company

---

## Executive Summary

| # | Post | Published | 90d Impressions | Verdict | Proposed Primary KW | Est. Volume | Projected 90d Lift |
|---|------|-----------|----------------|---------|--------------------|-----------:|-------------------|
| 1 | the-youtube-acquisition-engine | 2025-12-22 | 26 imp, 0 clk, pos 6.7 | **KILL (301)** | N/A — redirect to youtube-marketing-strategy | N/A | Consolidates equity |
| 2 | why-most-youtube-strategies-fail | 2025-12-23 | 10 imp, 0 clk, pos 8.3 | **RE-TARGET** | youtube marketing mistakes | 300-800/mo | 10 → 210-560/mo |
| 3 | youtube-keyword-research | 2026-04-22 | 3 imp, 0 clk, pos 8.7 | **OPTIMIZE** | youtube keyword research (keep) | 8,000-12,000/mo | 650-1,570 in 90d |
| 4 | high-intent-topic-research-framework | 2025-12-26 | 10 imp, 1 clk, pos 7.4 | **RE-TARGET** | youtube content strategy | 220/mo | 10 → 550/mo |
| 5 | youtube-channel-optimization-checklist | 2026-04-21 | 8 imp, 0 clk, pos 8.6 | **OPTIMIZE** | youtube channel optimization checklist (keep) | 200-400/mo | 500-900 in 90d |
| 6 | search-intent-youtube-seo-power | 2026-04-06 | 23 imp, 0 clk, pos 13.2 | **RE-TARGET** | youtube vs blogging for business | ~2,350/mo | 23 → 220-420/mo |

**Aggregate 90-day impressions (current):** 80 total (26+10+3+10+8+23), 1 click
**Aggregate projected 90-day impressions (after edits):** 1,900-5,200

---

## Post 1: the-youtube-acquisition-engine

### A. GSC Snapshot (Last 90 Days)

| Metric | Value |
|--------|-------|
| Impressions | **26** |
| Clicks | **0** |
| CTR | **0%** |
| Avg Position | **6.7** |
| Identified Queries | **None reported** (all below GSC's per-query reporting threshold) |

26 impressions at avg position 6.7 (page 1 range) with zero clicks after 4 months. Google IS indexing this page and ranking it on page 1 for something, but the individual queries are so low-volume that GSC doesn't report them. This confirms the post ranks for micro-volume long-tail queries with no commercial traction.

### B. Content Audit

| Field | Value | Length |
|-------|-------|--------|
| H1 / Title | "YouTube for Customer Acquisition: Full System" | 48 chars |
| Meta description | "YouTube works as a B2B acquisition channel when you treat it as search, not social. Search-led topics, voiceover videos, compounding leads." | 140 chars |

**H2 structure:** 9 flat H2s (no H3s): business math, search-intent mapping, voiceover videos, video structure, landing pages + CTAs, publishing cadence, measurement, when YouTube isn't right, how it compounds.

**Word count:** ~1,200 words (body). No original data, no screenshots, no tables, no FAQs, no diagrams. The post reads as a sales capability deck, not search-targeted content.

**Apparent primary keyword:** "youtube customer acquisition" or "youtube acquisition engine" — neither exists in sot_master.csv. The CSV maps this post to "best business channel" (10 live vol, KD 33, stretch tier) — wrong intent entirely.

### C. SERP & Opportunity Analysis

| Candidate Keyword | Est. Volume | Top-5 DR Profile | Winnable? |
|-------------------|-------------|-------------------|-----------|
| youtube customer acquisition | 200-500/mo | LinkedIn (99), Single Grain (80+) | No |
| youtube acquisition channel | 50-100/mo | Single Grain, YouTube videos | No |
| youtube for b2b | 70/mo | Mixed mid-high DR | Already assigned to youtube-marketing-b2b |
| youtube lead gen | 50/mo | Mixed | Already assigned to create-youtube-channel-for-business |
| how to get customers from youtube | ~200-500/mo | Nuoptima, Entrepreneur, Quora, small agencies | Moderate, but overlaps with existing pages |

No unserved, winnable keyword exists in this topic area that isn't already owned by a stronger, more focused SellonTube page.

### D. Cannibalization Check — SEVERE

| Competing SellonTube Page | Overlap Level |
|---------------------------|---------------|
| /blog/youtube-marketing-b2b | **Heavy** — covers B2B YouTube as acquisition channel |
| /youtube-for/b2b-companies | **Heavy** — same use case, already ranking |
| /blog/youtube-marketing-strategy | **Heavy** — overlaps sections 1, 2, 4, 7 |
| /blog/youtube-lead-generation | **Medium** — overlaps sections 5, 7 |
| /blog/youtube-sales-funnel | **Medium** — overlaps sections 4, 5, 7 |
| /blog/youtube-marketing-roi | **Light** — overlaps section 7 |

Every section of this post is covered more deeply somewhere else on the site.

### E. Diagnosis Verdict: KILL (301 Redirect)

**This post should not be optimized. It should be 301 redirected.**

The logic:

1. **No viable keyword.** Every keyword in this topic space is either too competitive (DR 80+ SERPs) or already owned by a stronger SellonTube page. There is nothing left to target.

2. **Total cannibalization.** The post competes with 5+ sibling pages, all newer, more targeted, and better structured. It dilutes topical authority.

3. **Fatally thin.** At ~1,200 body words with zero original data, zero visuals, zero FAQs, and zero structured data, it falls below the project's content depth framework minimums.

4. **Legacy positioning.** The content is a pitch deck in blog post form ("We do X, we believe Y") rather than a search-intent article. Rewriting it to serve search intent would require replacing nearly all the copy — at which point it's a new post, not an edit.

5. **4 months, 26 impressions, 0 clicks.** Google surfaces this page occasionally but nobody clicks. The content doesn't match any query well enough to earn a click.

6. **Opportunity cost.** Every hour spent rewriting this post is an hour not spent on a winnable keyword elsewhere.

**Recommended action:**
- 301 redirect `/blog/the-youtube-acquisition-engine` → `/blog/youtube-marketing-strategy`
- Update all internal links pointing to this URL
- Remove or draft-flag the source file
- Reassign "best business channel" keyword to another page or mark `avoid`

### F. Projected Impressions Lift

Redirect consolidates any minor internal link equity into the strategy post. Expected impact: +10-20% impression growth on the strategy post by removing cannibalization drag. Net positive with zero content investment.

---

## Post 2: why-most-youtube-strategies-fail

### A. GSC Snapshot (Last 90 Days)

| Metric | Value |
|--------|-------|
| Impressions | **10** |
| Clicks | **0** |
| CTR | **0%** |
| Avg Position | **8.3** |
| Identified Queries | **None reported** (all below GSC's per-query threshold) |

10 impressions at avg position 8.3 (page 1 range) with zero clicks. Like Post 1, Google is surfacing this page for micro-volume queries that don't generate clicks. No query data available.

### B. Content Audit

| Field | Value | Length |
|-------|-------|--------|
| H1 / Title | "Why YouTube Strategies Fail (And What Works)" | 46 chars |
| Meta description | "Creator advice builds audiences, not customers. The acquisition-first YouTube model targets high-intent topics and compounds over time." | 134 chars |

**H2/H3 structure:** 7 numbered mistake H2s + "Is Your Strategy Built for Viewers or Buyers?" + "The Acquisition-First Strategy That Actually Works" (4 H3 steps) + 3 FAQs.

**Word count:** ~1,800-2,000 words (body). 3 inline SVGs (decorative diagrams). No original data, no case studies, no real examples. Zero external citations.

**Apparent primary keyword:** "why youtube strategies fail" — negligible search volume (<50/mo).

### C. SERP & Opportunity Analysis

**"youtube marketing mistakes"** — the best re-target:
- Est. volume: 300-800/mo
- SERP dominated by mid-DR agency blogs (BenLabs, Agorapulse, DashClicks, tubics, Navigate Video)
- No DR 80+ monopoly
- B2B angle is completely unserved
- The existing 7-mistake structure maps perfectly to this keyword's listicle format

### D. Cannibalization Check — SEVERE (with current targeting)

`/blog/youtube-marketing-strategy` already has 293 impressions for "youtube marketing strategy" and includes an H2: "Your YouTube Marketing Strategy Is Failing. Here's Why." — directly overlapping this post's thesis.

**Re-targeting to "youtube marketing mistakes" resolves the cannibalization.** No other SellonTube page targets that phrase.

### E. Diagnosis Verdict: RE-TARGET to "youtube marketing mistakes"

**Why this works:**
1. Fragmented SERP with mid-DR competitors — winnable
2. Existing post structure (7 numbered mistakes) maps perfectly to the format Google rewards
3. B2B differentiation: every competitor targets creators/social managers, not business owners
4. No cannibalization with other SellonTube pages
5. Volume (300-800/mo) credibly delivers impressions at scale

**Required edits:**
- New title with "youtube marketing mistakes" front-loaded
- Rewrite meta description with target keyword in first 60 chars
- Rewrite H2s to frame as "Mistake #1: ..." format
- Add at least one concrete example or mini case study
- Add a comparison table (Mistake vs. Fix)
- Expand thin sections (4, 5 are ~80 words each) to 200+ words
- Strengthen with data points
- No slug change required (slug stays, keyword alignment comes from on-page)

### F. Projected Impressions Lift

| Period | Projected Impressions/mo |
|--------|------------------------:|
| Months 1-3 | 210-280 |
| Months 4-6 | 420-560 |

**Lift:** 0 → 210-560 impressions/month. Clicks at position 8-15: 6-17/month. These are business-intent clicks from people actively evaluating their YouTube approach.

---

## Post 3: youtube-keyword-research

### A. GSC Snapshot

| Impressions | **3** |
| Clicks | **0** |
| CTR | **0%** |
| Avg Position | **8.7** |
| Identified Queries | **None reported** |

Published today. Already showing 3 impressions at avg position 8.7 -- early indexation signal. Submit to GSC URL Inspection to accelerate.

### B. Content Audit

| Field | Value | Length |
|-------|-------|--------|
| H1 / Title | "YouTube Keyword Research for Business Channels (2026)" | 54 chars |
| Meta description | "5-step YouTube keyword research process for business channels. Buyer-intent filters, SaaS walkthrough, and the keywords that waste your time." | 141 chars |

**H2/H3 structure:** 8 H2s, 18 H3s. Deep, logical hierarchy. Covers: why business channel research differs, buyer-first approach, 5-step process, keywords to avoid, measurement, tools.

**Word count:** ~3,200 words. Original 3-filter buyer intent framework, SaaS walkthrough with dollar math ($200/mo product, $2,400 LTV, $7,200 from 3 conversions). 2 tables, 6 FAQs, definition blocks.

**On-page SEO:** Strong. Primary keyword front-loaded in title, meta, H2, first 100 words, and URL slug. All fundamentals hit.

### C. SERP & Opportunity Analysis

**"youtube keyword research" is a HARD SERP.** Top 10 dominated by Semrush (DR 92), Ahrefs (DR 93), vidIQ (DR 78), TubeBuddy (DR 73), Backlinko (DR 86). Most results are tool pages, not editorial content. The sot_master classifies the closest variant at KD 41 (stretch tier).

**But:** The B2B angle is genuinely differentiated. No competitor offers a buyer-intent filter framework. The SaaS walkthrough with LTV math is unique. The post can realistically rank for long-tail variants:
- "youtube keyword research for business" — low competition
- "buyer intent youtube keywords" — low competition
- "youtube keyword research for business channels" — very low competition

**Content gaps vs. competitors:**
1. Missing YouTube Studio Research tab walkthrough (every top competitor covers this)
2. Missing competitor video analysis as keyword source
3. No screenshots (competitors all have tool screenshots)

### D. Cannibalization Check — LOW

Moderate overlap with `/blog/how-to-find-youtube-autocomplete-keywords` (both cover autocomplete), but different scope (full process vs. one method). Cross-link recommended.

**Cadence flag:** 3 keyword-research posts in 8 days (Apr 16 autocomplete, Apr 22 this, Apr 23 ranking keywords). Monitor for impression cannibalization.

### E. Diagnosis Verdict: OPTIMIZE IN PLACE

Content quality is strong. The problem is keyword difficulty, not content or targeting.

**Recommended edits:**
1. Add YouTube Studio Research tab section (major competitor gap)
2. Add competitor video analysis as a keyword method
3. Add cross-link to the autocomplete keywords post in Step 2
4. Consider adding 1-2 SVG diagrams showing the process
5. Build internal links from every relevant page (youtube-seo-guide, tool pages)

### F. Projected Impressions Lift

| Period | Impressions |
|--------|------------:|
| Days 1-14 | 0-20 |
| Days 15-30 | 50-150 |
| Days 31-60 | 200-500 |
| Days 61-90 | 400-900 |

**90-day cumulative: 650-1,570 impressions.** If the B2B differentiation works and the post breaks into page 2 for the head term, could reach 2,000+.

---

## Post 4: high-intent-topic-research-framework

### A. GSC Snapshot (Last 90 Days)

| Metric | Value |
|--------|-------|
| Impressions | **10** |
| Clicks | **1** |
| CTR | **10%** |
| Avg Position | **7.4** |
| Identified Queries | **None reported** (the 1 click came from an unreported query) |

10 impressions and 1 click at avg position 7.4. This is the only post in the audit with a click. Despite targeting jargon, it's ranking on page 1 for something and converting at 10% CTR. The queries are too low-volume to be reported individually.

### B. Content Audit

| Field | Value | Length |
|-------|-------|--------|
| H1 / Title | "High-Intent YouTube Topics: Our Research Framework" | 52 chars |
| Meta description | "How we identify YouTube topics that attract ready-to-buy customers using search data, competitive gaps, and customer psychology." | 127 chars |

**H2 structure:** 8 flat H2s, no H3s. Every heading starts with "We" — reads as a company capability deck, not a guide.

**Word count:** ~1,050 words. No original data, no examples, no screenshots, no tables, no FAQs. The "LTV Alignment Grid" is mentioned but never shown.

**Apparent primary keyword:** "high-intent topic research framework" — proprietary jargon with zero search volume.

### C. SERP & Opportunity Analysis

**"youtube content strategy"** — the best re-target:
- Live volume: 110/mo (Google), KD 13 (winnable)
- "content strategy youtube" variant: 110/mo, KD 7
- Combined cluster: ~220/mo addressable
- SERP format: guide-style, matches what this post should be
- Currently mapped to `youtube-marketing-strategy` (planned), but that post already has 30+ keywords assigned

**SERP for "youtube content strategy for B2B":** Very sparse results. Low competition. The B2B qualifier narrows to a nearly empty SERP.

### D. Cannibalization Check — LOW (after re-target)

Medium overlap with `/blog/youtube-video-ideas-generator-for-b2b` (both discuss "how to pick topics that attract buyers"). But different intent: ideas post = patterns, this post = process framework. Differentiate by making this the "how to plan" guide vs. the ideas post being "what to make."

No overlap with "youtube content strategy" on any other page.

### E. Diagnosis Verdict: RE-TARGET to "youtube content strategy"

**Why this keyword:**
1. KD 7-13 — solidly winnable for current site authority
2. No other SellonTube page targets it explicitly
3. Guide format matches what Google rewards for this query
4. The existing content's core idea (pick topics based on buyer intent + business math) is genuinely valuable — it just needs to be rewritten as a "how to" guide instead of a "we do" deck

**Required edits (full rewrite):**
- New title: "YouTube Content Strategy: How to Plan Videos That Bring Customers" (or similar)
- New meta description with keyword in first 60 chars
- Replace all "We do X" framing with "Here is how to do X"
- Expand from 1,050 to 2,000-2,500 words
- Add concrete examples with real search volumes, view counts, conversion estimates
- Add at least one diagram (content strategy funnel or topic scoring matrix)
- Add FAQs targeting PAA variants
- Show the LTV Alignment Grid that's currently only mentioned

### F. Projected Impressions Lift

| Period | Projected Impressions/mo |
|--------|------------------------:|
| Months 3-6 (after rewrite) | ~550 |
| Clicks at position 10 | ~14/mo |
| Clicks at position 6 | ~28/mo |

**Lift:** 0 → 550 impressions/month. From complete invisibility to measurable signal on a winnable keyword.

---

## Post 5: youtube-channel-optimization-checklist

### A. GSC Snapshot

| Impressions | **8** |
| Clicks | **0** |
| CTR | **0%** |
| Avg Position | **8.6** |
| Identified Queries | "youtube channel optimization checklist" (1 imp, **pos 5**), "youtube optimization checklist" (1 imp, pos 31) |

Published yesterday, already 8 impressions. **Key signal: ranking position 5 for the exact target keyword** "youtube channel optimization checklist" on day 1. This validates the keyword targeting. The remaining 6 impressions come from unreported micro-volume queries.

### B. Content Audit

| Field | Value | Length |
|-------|-------|--------|
| H1 / Title | "YouTube Channel Optimization: 12-Point Checklist for Lead Gen" | 61 chars |
| Meta description | "12-point checklist to optimize your YouTube channel for lead generation. Channel page, metadata, conversion paths. Each fix takes under 10 minutes." | 148 chars |

**H2/H3/H4 structure:** Well-organized: 3 H3 category groups (Channel Page, Video Metadata, Conversion Paths), 12 H4 checklist items, measurement section, 5 FAQs, action section.

**Word count:** ~1,550 words (prose). On-page keyword placement is strong — primary keyword appears in title, meta, first H2, FAQ questions.

**Weaknesses:**
1. Thin for competition (competitors at 2,500-4,000+ words)
2. Zero visual assets in body (no screenshots, tables, or diagrams)
3. Missing thumbnail optimization section (major gap vs. every competitor)
4. Missing playlist optimization, Shorts cross-promotion
5. "optimize youtube channel" (320 vol, KD 29, winnable) exact phrase underused

### C. SERP & Opportunity Analysis

**"youtube channel optimization"** head term: Extremely competitive (Google Help, TubeBuddy DR 70+, Neil Patel DR 92, Sprout Social DR 89, GoDaddy DR 93). Not winnable for head term.

**"youtube channel optimization checklist"** long-tail: More opportunity. Positions 1, 3, 4, 7, 10 held by moderate/lower-DA sites (checklist.gg, oneupweb, clickminded, proglobal, wolfable). This is the realistic target.

### D. Cannibalization Check — MODERATE

Three SellonTube pages could compete for "youtube channel optimization" variants:
1. This checklist post (best content match)
2. `/blog/youtube-seo-guide` (broader scope, currently mapped in sot_master)
3. `/blog/youtube-marketing-strategy` (mapped for "optimize youtube channel")

**Fix:** Update sot_master.csv to point "youtube channel optimization" and "optimize youtube channel" keywords to this post.

### E. Diagnosis Verdict: OPTIMIZE IN PLACE

The post is structurally sound and targets the right long-tail. Needs depth expansion and visual assets.

**Recommended edits:**
1. Expand to ~2,200-2,500 words (add thumbnail optimization section, expand measurement section with metrics table, add playlist optimization subsection)
2. Add 2-3 visuals: summary checklist table, annotated channel page screenshot, YouTube Studio metrics screenshot
3. Add "optimize youtube channel" exact phrase in a subheading or intro
4. Update sot_master keyword mappings to this post

### F. Projected Impressions Lift

| Scenario | 90-day Impressions |
|----------|-----------------:|
| Without changes | 250-400 |
| With optimizations by week 2 | 500-900 |

---

## Post 6: search-intent-youtube-seo-power

### A. GSC Snapshot (Last 90 Days)

| Metric | Value |
|--------|-------|
| Impressions | **23** |
| Clicks | **0** |
| CTR | **0%** |
| Avg Position | **13.2** |
| Identified Queries | "android youtube search intent" (5 imp, pos 32.6) — irrelevant Android dev query |

23 impressions at avg position 13.2 (page 2). The one identified query is completely off-target (Android app development). The remaining 18 unreported impressions come from micro-volume queries. Despite being the highest-impression post in this audit, zero clicks = zero value.

### B. Content Audit

| Field | Value | Length |
|-------|-------|--------|
| H1 / Title | "YouTube Search Intent: Why It Beats Blog SEO for B2B" | 54 chars |
| Meta description | "Search-intent YouTube videos rank for months and drive qualified B2B leads without paid ads. Here is how to build a pipeline that compounds." | 140 chars |

**H2 structure:** 7 content H2s (flat, no H3s). 1 comparison table (creator vs. search-intent). 1 Think with Google citation. 4 FAQs. Key takeaways box. "What to Do This Week" action list.

**Word count:** ~1,550 words. Thin. No original data beyond one stat. No screenshots or in-body diagrams.

**Audience mismatch:** "Search intent" is SEO practitioner jargon. The ICP (B2B founders) doesn't search for this term.

### C. SERP & Opportunity Analysis

**"youtube vs blogging for business"** — the best re-target cluster:

| Keyword Variant | Est. Volume | Competition |
|----------------|-------------|-------------|
| blogging vs youtube | 1,000-2,000/mo | Medium (solopreneur-focused) |
| blog vs youtube channel | 500-800/mo | Medium |
| youtube vs blog for business | 200-400/mo | Low-Medium |
| youtube seo vs blog seo | 200-500/mo | Medium |
| **Total cluster** | **~2,350/mo** | |

**Critical finding:** No one in the current top 10 writes the "youtube vs blogging" comparison from a B2B acquisition angle. Every result targets solopreneurs and creators. This is a genuine content gap.

### D. Cannibalization Check — MODERATE

**Risk:** `/blog/youtube-vs-blog-shopify-app-case-study` also argues "YouTube beats blogging" — but with data (1,257 vs 411 conversions). The fix: differentiate this post as the **strategic framework** ("here is how to think about it") while the case study is the **proof** ("here is what happened"). Cross-link between them.

### E. Diagnosis Verdict: RE-TARGET to "youtube vs blogging for business"

**Why this works:**
1. High combined cluster volume (~2,350/mo) — the largest opportunity in this audit
2. B2B angle is completely unserved in the current SERP
3. The post's existing thesis ("YouTube beats blogging for B2B") already matches
4. The Shopify case study provides unique supporting data no competitor has
5. Differentiation: strategic framework post vs. case study post = complementary, not competitive

**Required edits:**
- New title: "YouTube vs Blogging for Business: Why Video Wins for B2B Lead Gen" (or similar)
- New meta description with target keyword
- Expand to ~2,500-3,000 words
- Add sections: "When blogging still wins" (fairness/E-E-A-T), "Real cost comparison: YouTube vs blog content," "How to decide: YouTube, blog, or both"
- Add a data table referencing the Shopify case study (cross-link, don't duplicate)
- Add at least one original chart (content shelf-life comparison)

### F. Projected Impressions Lift

| Keyword Variant | Est. Monthly Vol | Achievable Position (6-12 mo) | Projected Impressions/mo |
|----------------|-----------------|-------------------------------|------------------------:|
| blogging vs youtube | 1,500 | 15-20 (page 2) | 75-150 |
| youtube vs blog for business | 300 | 8-12 (bottom page 1) | 60-120 |
| is youtube better than blogging | 400 | 10-15 | 40-80 |
| youtube vs blogging for b2b | 50 | 3-5 | 30-40 |
| youtube or blog for marketing | 100 | 8-12 | 15-30 |
| **Total** | | | **220-420/mo** |

**Lift:** 5 irrelevant impressions → 220-420 relevant impressions/month (44x-84x).

---

## Cross-Post Cannibalization Matrix

| Keyword Cluster | Post 1 (Acq Engine) | Post 2 (Strategies Fail) | Post 3 (KW Research) | Post 4 (Topic Research) | Post 5 (Channel Opt) | Post 6 (Search Intent) |
|-----------------|:---:|:---:|:---:|:---:|:---:|:---:|
| youtube acquisition / customers | **CONFLICT** | - | - | - | - | - |
| youtube strategy / marketing strategy | CONFLICT | **CONFLICT** | - | - | - | - |
| youtube marketing mistakes | - | **PROPOSED** | - | - | - | - |
| youtube keyword research | - | - | **OWN** | - | - | - |
| youtube content strategy | - | - | - | **PROPOSED** | - | - |
| youtube channel optimization | - | - | - | - | **OWN** | - |
| youtube vs blogging / blog seo | - | - | - | - | - | **PROPOSED** |
| youtube seo (general cluster) | - | - | overlap | - | overlap | overlap |

**Key conflicts resolved by this audit:**
1. Post 1 vs. 5+ other pages on "youtube acquisition" → Kill Post 1
2. Post 2 vs. youtube-marketing-strategy on "why strategies fail" → Re-target Post 2 to "mistakes"
3. Post 4 vs. youtube-marketing-strategy on "content strategy" → Reassign keyword to Post 4

---

## Final Keyword Ownership Map (After Audit)

| Post | Primary Keyword | Cluster Vol | Status |
|------|----------------|-------------|--------|
| ~~the-youtube-acquisition-engine~~ | ~~none~~ | N/A | **301 → youtube-marketing-strategy** |
| why-most-youtube-strategies-fail | youtube marketing mistakes | 300-800/mo | **RE-TARGET** |
| youtube-keyword-research | youtube keyword research | 8,000-12,000/mo (head) | **KEEP + OPTIMIZE** |
| high-intent-topic-research-framework | youtube content strategy | 220/mo | **RE-TARGET** |
| youtube-channel-optimization-checklist | youtube channel optimization checklist | 200-400/mo | **KEEP + OPTIMIZE** |
| search-intent-youtube-seo-power | youtube vs blogging for business | ~2,350/mo | **RE-TARGET** |

---

## Cross-Post Patterns

1. **Jargon kills indexation.** Posts 1, 4, and 6 all target insider phrases nobody searches for ("acquisition engine," "high-intent topic research framework," "search intent youtube seo power"). The pattern: content written to impress peers, not to capture search demand.

2. **Capability decks disguised as blog posts.** Posts 1 and 4 read as "how we do it" content rather than "how you can do it." Google has no reason to rank a company's internal process documentation.

3. **Thin content across the Dec 2025 cohort.** Posts 1 (1,200 words), 2 (1,800 words), and 4 (1,050 words) were all published in the site's first week (Dec 22-26 2025) and are all below the depth threshold needed to compete. They were likely launch-day content that has never been revisited.

4. **The Apr 2026 posts are significantly stronger.** Posts 3 (3,200 words, original framework), 5 (well-structured checklist), and 6 (clear thesis) show meaningful improvement in content quality. The learning curve is visible.

5. **Cannibalization is systemic, not accidental.** The YouTube strategy/marketing/acquisition cluster has 6+ overlapping pages. This dilutes topical authority across the board. The kill (Post 1) and re-targets (Posts 2, 4, 6) should sharpen the cluster architecture.

6. **B2B differentiation is consistently under-exploited.** In every SERP analyzed, the B2B angle is either absent or underserved. SellonTube's most viable competitive advantage (B2B-specific YouTube content) is not being leveraged in titles, meta descriptions, or H1s aggressively enough.

---

## sot_master.csv Updates Required

| Keyword | Current Assignment | New Assignment |
|---------|-------------------|----------------|
| best business channel | the-youtube-acquisition-engine | Mark `avoid` or reassign |
| youtube content strategy | youtube-marketing-strategy | **high-intent-topic-research-framework** |
| content strategy youtube | youtube-marketing-strategy | **high-intent-topic-research-framework** |
| youtube channel optimization and video seo | youtube-seo-guide | **youtube-channel-optimization-checklist** |
| optimize youtube channel | youtube-marketing-strategy | **youtube-channel-optimization-checklist** |
| optimizing youtube channel | youtube-marketing-strategy | **youtube-channel-optimization-checklist** |

---

*Audit conducted 2026-04-22. Re-audit recommended: 2026-07-22 (90 days) to validate lift hypotheses.*
