# Growth Execution Plan — 4 Weeks

**Start date:** 2026-04-07 (Monday)
**Data basis:** GSC 90d, GA4 90d, DataForSEO (sot_master.csv), Ahrefs audit Apr 2 2026

---

## Week 1 (Apr 7-11): Fix What's Broken

**Goal:** Eliminate all 404s, fix title tags, clean up technical debt. Zero new content this week.

### Monday-Tuesday: Diagnose & fix 13 pSEO 404s

1. Check publishDates in `src/data/niches.ts` for: fintech-companies, insurance-agents, edtech-companies, mortgage-brokers, recruiting-firms, hr-software, healthcare-practices, cybersecurity-companies, management-consultants, subscription-businesses, dental-practices, accountants, marketplaces.
2. If publishDate is in the future — update to a past date.
3. If publishDate is past — the `[slug].astro` template is failing to match these slugs. Debug the dynamic route.
4. Run `npm run build` locally and verify all 13 URLs return 200.
5. Deploy to Netlify staging. Verify all 13 pages render.

### Tuesday: Fix double "| SellOnTube" title suffix

1. Identify the source of the duplication. Check: `src/config.yaml` (title template `%s | SellOnTube`), layout components, and individual page `<title>` tags. The issue is that pages are setting their own title with "| SellOnTube" AND the template is appending it again.
2. Fix the template or the page-level titles — one or the other, not both.
3. Verify with `npm run build` + grep for "SellOnTube | SellOnTube" in `dist/`.
4. **Expected pages fixed:** All pSEO pages, all tool pages, all hub pages (~60+ pages).

### Wednesday: Fix broken youtube-video-ideas/ URLs

1. Add redirects to `netlify.toml` for all 15 broken video-ideas URLs. Map each to the closest living page (see content_pipeline_audit.csv for specific mappings).
2. Or: restore the pages in `src/data/topics.ts` if they were accidentally removed.
3. Decision: redirects are faster and cleaner since these are zero-volume pages.

### Thursday: Fix blog post title lengths

Rewrite these titles to under 60 characters, keyword-first:

| Current (truncated) | Proposed |
|---------------------|----------|
| The Compounding Effect: How 4 Videos a Month Can Build... (108 chars) | 4 YouTube Videos a Month: How Compounding Builds Pipeline |
| How to Create a YouTube Business Channel That Attracts... (98 chars) | How to Create a YouTube Business Channel (2026) |
| How We Engineer High-Intent YouTube Topics... (98 chars) | High-Intent YouTube Topic Research: Our Framework |
| YouTube Marketing Strategy: 6-Step Framework... (94 chars) | YouTube Marketing Strategy for Business (2026) |
| YouTube vs Blog for Shopify Apps: 12-Month... (91 chars) | YouTube vs Blog for Shopify Apps: 12-Month Results |
| YouTube Marketing ROI: Formula, Real Case Study... (83 chars) | YouTube Marketing ROI: Formula + Real Data |
| YouTube Marketing for B2B: How to Generate... (79 chars) | YouTube Marketing for B2B: Lead Generation Guide |

### Friday: Noindex /slides, clean up sitemap

1. Add `/slides` to sitemap exclusion filter in `astro.config.ts`: `filter: (page) => !page.includes('/tag/') && !page.includes('/category/') && !page.includes('/slides')`
2. Or add `<meta name="robots" content="noindex">` to slides.astro.
3. Verify `/blog/best-youtube-seo-tools-for-business` status — it appears in GA4 and sitemap but not in `src/data/post/`. If it exists in `dist/` from a previous build, find the source. If it's a real post, ensure it's in source control.

### Friday: Deploy all Week 1 fixes

1. Build, verify, deploy to Netlify.
2. Submit all 13 fixed pSEO pages to GSC URL Inspection (max 10/day — finish remaining 3 on Monday).

**Week 1 deliverables:** 13 pSEO 404s fixed, ~60 title tags fixed, 15 video-ideas redirects added, 7 blog titles shortened, /slides cleaned up, best-youtube-seo-tools status resolved.

---

## Week 2 (Apr 14-18): Optimize Striking-Distance Pages

**Goal:** Push the 5 pages closest to page 1 into clicking range. One new blog post.

### Monday-Tuesday: Expand /blog/youtube-marketing-roi

1. Add H2: "YouTube Advertising ROI: What Businesses Actually See" — targets "youtube advertising roi" (pos 14.5).
2. Add H2: "YouTube ROI Benchmarks by Industry" — table with B2B SaaS, agencies, professional services.
3. Embed the ROI calculator inline (iframe or component reference).
4. Add 40-word direct-answer paragraph at the top for AI Overview targeting: "YouTube marketing ROI averages 3-5x for B2B companies publishing 4+ videos per month. Formula: (Revenue Attributed to YouTube - Total YouTube Investment) / Total YouTube Investment x 100."
5. Add FAQ schema with 4-5 questions pulled from GSC query variants.
6. Shorten title to under 60 chars (already planned in Week 1 but content changes happen now).

### Wednesday: Expand /youtube-for/coaches

1. Add 3 real coach YouTube channel examples (research manually — Mel Robbins, Alex Hormozi coaching content, niche coaches with <50K subs who rank well).
2. Add section: "10 YouTube Video Ideas for Coaches" — interlink each to the matching `/youtube-video-ideas/coach-*` page.
3. Add FAQ schema (5 questions: "Is YouTube worth it for coaches?", "How many videos should a coach post per month?", "What type of YouTube videos work best for coaching businesses?", etc.)
4. Submit to GSC.

### Thursday: Optimize /tools/youtube-transcript-generator

1. Title rewrite: "Free YouTube Transcript Generator | SellOnTube" (43 chars — clean).
2. Add section below tool UI: "How This Compares to Other Transcript Tools" (vs Tactiq, Notta, YouTube's built-in).
3. Add FAQ: "Is this transcript generator free?", "Can I get transcripts for any YouTube video?", "How accurate are the transcripts?"
4. Submit to GSC.

### Thursday-Friday: Write + publish "YouTube SEO Services" blog

1. Target: youtube seo services (1,600 vol, KD 10), youtube seo agency (210 vol, KD 6), youtube seo expert (90 vol, KD 0).
2. Angle: "What YouTube SEO Services Actually Include (And What's Worth Paying For)" — not a sales page. Comparison/guide format.
3. Include: what agencies do vs DIY, pricing ranges, red flags, when to hire, when to use tools instead.
4. Internal links to: /tools/youtube-seo-tool, /blog/youtube-seo-guide, /blog/best-youtube-seo-tools-for-business (if live), /pricing.
5. Respect 1/week blog cadence — this is the only new post this week.
6. Submit to GSC on publish day.

**Week 2 deliverables:** 3 pages expanded (youtube-marketing-roi, youtube-for/coaches, transcript-generator), 1 new blog published (youtube-seo-services).

---

## Week 3 (Apr 21-25): New High-Value Content

**Goal:** Ship the highest-volume winnable content. Continue optimization.

### Monday-Tuesday: Build YouTube Script Generator tool

1. Target keywords: youtube script (1,600 vol, KD 18), youtube video script (480), script for a youtube video (480), youtube script writer (210).
2. Total addressable volume: 4,100/mo from winnable tier.
3. Implementation: Gemini Flash integration (follow standard microtool pattern from CLAUDE.md). Input: topic, audience, tone. Output: structured script outline with hook, sections, CTA.
4. Title: "Free YouTube Script Generator for Business | SellOnTube" (52 chars).
5. Replace the current "Coming Soon" page at `/tools/youtube-script-generator`.

### Wednesday: Expand /blog/create-youtube-channel-for-business

1. This page is mapped to the most live winnable keywords (9 keywords, 510 vol).
2. Already pos 5 for "how to create a youtube business account".
3. Add: step-by-step screenshots of the channel creation flow, YouTube Studio setup, brand account vs personal account, channel art specs for B2B.
4. Expand FAQ with "how to create a youtube business account" as a question (exact match).
5. Submit to GSC.

### Thursday-Friday: Rewrite /blog/youtube-marketing-strategy

1. Currently pos 55 for "youtube marketing strategy" (191 imp) — the page is seen but too weak to rank.
2. The page is mapped to 15+ winnable keywords (12,320 total vol) — this is the single biggest opportunity in the pipeline but the current page tries to be everything.
3. Rewrite strategy:
   - Primary target: "youtube marketing strategy" (320 vol, KD 17) + "youtube strategy" (1,600 vol, KD 16).
   - Cut everything about agencies/companies/tools — those become separate posts later.
   - Structure: 6-8 concrete steps. Each step = H2 with keyword variant. Actionable, not conceptual.
   - Add FAQ schema.
   - Title: "YouTube Marketing Strategy: Step-by-Step for Business" (52 chars).
4. Do NOT publish yet — park as draft, review in Week 4.

**Week 3 deliverables:** Script generator tool live, create-youtube-channel expanded, youtube-marketing-strategy rewrite drafted.

---

## Week 4 (Apr 28 - May 2): Publish + Validate + Plan Next Month

**Goal:** Ship remaining content, validate all changes, set up next month.

### Monday: Publish youtube-marketing-strategy rewrite

1. Final review against style guide (em-dash check, AI phrase check, title checklist).
2. Publish. Submit to GSC.
3. This does NOT count as the weekly blog post — it's a rewrite of an existing page.

### Monday-Tuesday: Write + publish "Best YouTube SEO Tools" blog

1. If `/blog/best-youtube-seo-tools-for-business` is already live (found in GA4 with 13 sessions), skip writing and instead:
   - Verify it's indexed in GSC. If not, submit.
   - Check content quality against style guide.
   - Ensure it links to /tools/youtube-seo-tool.
2. If it's NOT live (stale build artifact), write it now:
   - Target: youtube seo tools (4,400 vol, KD 23), best tools for youtube seo (90 vol, KD 12), youtube seo software (140 vol, KD 27).
   - Angle: "Best YouTube SEO Tools for Business Channels (2026)" — review 8-12 tools, include SellOnTube's own tool, honest pros/cons.
   - Internal links: /tools/youtube-seo-tool, /blog/youtube-seo-guide, /pricing.
3. Respect 1/week cadence — this is the only new post this week.
4. Submit to GSC on publish day.

### Wednesday: Validate all changes

1. Run full site build. Check for any new 404s.
2. Spot-check all title tags in `dist/` — grep for "SellOnTube | SellOnTube" (should be zero).
3. Verify all 13 previously-404ing pSEO pages return 200.
4. Check GSC for any new crawl errors.
5. Count indexed pages in GSC vs sitemap URLs — note any gap.

### Thursday: GSC + GA4 performance snapshot

1. Pull GSC data for the past 7 days via MCP. Compare impressions and clicks against the 90-day baseline.
2. Check if any rewritten pages have picked up new query impressions.
3. Log findings in `seo-audit-log.md`.

### Friday: Plan May execution

1. Review which winnable keywords remain unaddressed (97 of 106 were not-started at audit time).
2. Next priority content based on remaining pipeline:
   - "YouTube Agency" cluster — youtube agency (260 vol, KD 21), youtube marketing agency (260 vol, KD 7), youtube agencies (260 vol, KD 0). Total 780 vol, very low KD. Good candidate for a dedicated page.
   - "Create a Company YouTube Channel" — 6,600 vol, KD 27. Stretch-borderline. Needs authority building first.
   - "YouTube Analytics for Other Channels" — 390 vol, KD 25. Could pair with a competitive analysis tool.
3. Update `growth-strategy.md` with audit findings and revised priorities.

**Week 4 deliverables:** youtube-marketing-strategy rewrite live, best-youtube-seo-tools published or verified, full validation pass, performance snapshot, May plan drafted.

---

## Key Metrics to Track

| Metric | Baseline (Apr 4) | Week 2 Target | Week 4 Target |
|--------|-------------------|---------------|---------------|
| GSC total impressions (7d) | ~60 | 80+ | 120+ |
| GSC non-branded clicks (7d) | 0 | 1-3 | 5+ |
| Pages returning 404 (Ahrefs) | 28+ | 0 | 0 |
| Titles over 60 chars | 30+ | <5 | 0 |
| Winnable keywords with live content | 9/106 | 9/106 | 15/106 |
| Organic sessions (weekly) | ~9 | 12+ | 20+ |

---

## What This Plan Does NOT Cover (Intentionally)

- **Backlink building** — No backlink data available. Cannot make specific recommendations without knowing current DA, referring domains, or competitor link profiles. Revisit when Ahrefs backlink data is available.
- **Paid promotion** — Out of scope for organic growth audit.
- **New pSEO verticals** — The 8 missing niches from youtube-for-audit.txt (agency, realtors, health, doctors, personal-injury-lawyers, non-profits, hair-salon, medical-devices) all have unvalidated search volume. Do not build until DataForSEO confirms demand.
- **YouTube Vs expansion** — The 20 comparison pages have zero GSC impressions. Monitor for 60 more days before investing in expansion.
- **Tool infrastructure changes** — Gemini model updates, API changes, etc. are operational tasks, not growth tasks.
