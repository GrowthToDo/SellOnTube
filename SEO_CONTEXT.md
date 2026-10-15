# SEO Context - SellonTube

Router and diff between SellonTube's own SEO docs and the global framework at
`../_shared/seo-content-framework/FRAMEWORK.md`. It does not replace any SellonTube doc; those stay
authoritative for their own content. Drafted 2026-10-15. Paths are relative to the SellonTube root.

**Site:** this repo. Astro 5 + Tailwind + MDX on Netlify (`package.json`: `astro ^5.12.9`,
`@astrojs/mdx ^4.3.3`). Posts in `src/data/post/`. The only workspace repo with a remote: `main` deploys.

**North star (founder, 2026-07-21, `traffic-reality-check.md` Finding 5 + "Decisions made"):** tools
first. Free tools are lead magnets; success = **western visitors who then explore the site**, not
tool traffic and not impressions. Build diagnostic tools, not extractive ones (Finding 6). The paid
product is still undefined. The agency is networking-driven and is not the SEO target.

**Bot-traffic rule (`traffic-reality-check.md` "Rules this establishes"; ledger L-GSC-02):** never
scope work from impressions. Check clicks-at-position split by country first. ~90% of western
impressions are non-human. Success metric = clicks or GA4 sessions. Reconcile any multi-dimension GSC
pull against a single-dimension total; never use `page` x `country` for clicks (`mistakes-lessons.md`
2026-09-18).

## Step → doc mapping

| Framework step | This project's doc | Status |
|---|---|---|
| PRODUCT_CONTEXT | `docs/icp.md` (canonical ICP), `traffic-reality-check.md` Findings 4-6, `docs/brand-voice.md`, `style-guide.md` | PARTIAL: agency ICP only; no product ICP (open item in reality check) |
| SEO_SITE_AUDIT | `seo-audit-log.md`, `seo-rules.md`, `research/search console/crawled-not-indexed-analysis-2026-07-19.md`, `scripts/audit_internal_links.py` (on `dist/`) | EXISTS, as logs, no single dated audit |
| GSC_ANALYSIS | `traffic-reality-check.md` (method under "How to reproduce"); `agents/01-gsc-intelligence.md` | EXISTS |
| CUSTOMER_VOICE | `research/painpoint-briefs/`, `research/painpoint_seo_keyword_miner_v3.md` | PARTIAL |
| COMPETITOR_SEO_ANALYSIS | `research/competitor-comparison-strategy.md`, `research/ahrefs report/`, `agents/references/backlink-analysis-skill.md` | PARTIAL |
| SEARCH_OPPORTUNITY_MAP | `research/keywords/sot_master.csv` (DataForSEO volumes + KD tiers), `agents/02-keyword-researcher.md`, `growth-audit/page_opportunity_master.csv` | EXISTS, but scored before the bot correction |
| CONTENT_PLAN | `research/publishing_calendar.md` (last updated 2026-05-27), `growth-strategy.md` "Blog Strategy", `agents/03-content-planner.md` | STALE: see owner decisions 3-4 |
| ARTICLE_BRIEF | seo-content-system mode 03 (`FW/workflows/03-brief.md`); ST template `docs/templates/content-brief-template.md`; site detail `seo/site-kit/pipeline-notes.md` | EXISTS |
| PUBLISH_CHECKLIST | `blog-production-standard.md` §9 (draft QA) + §9 pre-publish verification; `content-playbook.md` §9; `agents/05-content-qa.md`; `docs/sops/blog-publishing-sop.md`, `deploy-checklist.md` | EXISTS |
| Measurement / verdict loop | `traffic-reality-check.md` rules; `mistakes-lessons.md` 2026-08-26 (URL Inspection `lastCrawlTime` after deploy before any verdict) | PARTIAL: no written verdict thresholds; GA4 conversion events still zero |

## Mode → doc / skill

| Mode | Use here |
|---|---|
| 00 Setup | This file |
| 01 GSC read | `agents/01-gsc-intelligence.md`; reproduce queries in `traffic-reality-check.md`; GSC `sc-domain:sellontube.com`, GA4 `522074510` |
| 02 Topic research | seo-content-system mode 02; site detail (`sot_master.csv` filters, MCP tool names) `seo/site-kit/pipeline-notes.md`; `agents/02-keyword-researcher.md`, `agents/03-content-planner.md`; checklist `mistakes-lessons.md` 2026-09-07 |
| 03 Brief | seo-content-system mode 03 (outline included, BRF-06); site detail `seo/site-kit/pipeline-notes.md` |
| 04 Write | seo-content-system mode 04; site detail `seo/site-kit/pipeline-notes.md`, `agents/04-blog-writer.md`, `seo/site-kit/brand-visuals.md`; comparison posts `agents/references/comparison-content-playbook.md`; depth `content-depth-framework.md` |
| 05 QA + ship | `agents/05-content-qa.md` (hard-fails the `ai-seo-guide.md` §16 citability gate), `blog-production-standard.md` §9, `docs/sops/blog-publishing-sop.md`, `deploy-checklist.md`; after merge AND live: IndexNow submit + verify (see "IndexNow" below, automatic); Bing Webmaster submit `node scripts/bing-submit.mjs` |
| 06 CTR + titles | `docs/sops/ctr-optimization-sop.md`; GA4 post-click check first (`mistakes-lessons.md` 2026-09-13) |
| 07 Refresh | seo-content-system mode 07; site detail `seo/site-kit/pipeline-notes.md`, `docs/sops/content-refresh-sop.md` |
| 08 Site audit | `agents/07-technical-seo.md`, `scripts/audit_internal_links.py`, `seo-audit-log.md` |
| 09 AI search | `ai-seo-guide.md` (canonical; never restate AEO rules elsewhere), `agents/11-aeo-monitor.md`, `docs/sops/monthly-ai-seo-checklist.md`, `research/bing-webmaster-ai-performance.md` |
| 10 Measure | `traffic-reality-check.md` "How to reproduce"; URL Inspection before any lift verdict (`scripts/archive/gsc_inspect.py`) |

## Overrides (this project deliberately differs from FRAMEWORK.md)

| Framework default | SellonTube rule | Why | Evidence |
|---|---|---|---|
| Goal = installs/signups | Goal = western visitors who explore past the tool; agency is not an SEO target | Founder decision 2026-07-21 | `traffic-reality-check.md` Decisions 1-3 |
| Free tools only (non-negotiable 12) | Uses paid data on hand: DataForSEO volumes/KD in `sot_master.csv`, Ahrefs uploads. Label as such; never treat as required | Already licensed/exported | `docs/content-intelligence-system.md` data layer; `agents/03` L16 |
| Schema: no FAQPage (L-TE-01) | NO LONGER AN OVERRIDE. Decided 2026-10-15 by Sathya: FAQPage off for all projects; keep the visible `## FAQ` in the MDX body. History: ST had opted in "for AI extraction". Code changed 2026-10-15: FAQPage JSON-LD removed from the blog template and 11 pages (12 files, see Gaps found); the 13 busy tool pages still emit it until the tool-fix branch lands. `ai-seo-guide.md` §9 L479, §13 L613 and `blog-production-standard.md` L457 still describe it | Owner decision | post-rules ONP-09, OD-1 |
| AEO rules in the framework (§16) | `ai-seo-guide.md` is the single source; §16 citability gate is a hard fail | House rule | `CLAUDE.md` "AEO / AI citation" |
| Stop at the PR (non-negotiable 13) | No PR flow: show the commit message, wait for an explicit "yes", then commit and push to `main` (which deploys). The skill never pushes on its own | Single-owner repo | `CLAUDE.md` "Never push to live without asking" |
| Title / meta | Title ≤60 for every project, counted on the full rendered `<title>` incl. " \| SellOnTube" (13 chars), so 47 chars for the topic (decided 2026-10-15 by Sathya; same as default). Meta <155 (`blog-production-standard.md` §7, `content-playbook.md` §5.2); `seo-rules.md` L68 says 150-160 (owner decision 5, meta only) | Owner decision (title); house rule (meta) | as cited; post-rules ONP-02 |
| Audit source | Analyse `dist/` after `npm run build`, never source, for links, canonicals, schema | Source greps gave wrong answers | `CLAUDE.md` "Mistakes to avoid" |
| Go-live | `publishDate` decides go-live, IST conversion; future date = 404 | Repeated deploy 404s | `CLAUDE.md` |
| Internal links (LNK-04: at least 2 out-links) | At least 4 internal links per post, at least one to a `/tools/` page. Applies to new posts and refreshes. `seo/site-kit/deploy.md` (from `deploy-checklist.md`) and `agents/05-content-qa.md` L196 still say 2: the stricter 4 wins | Tools-first north star: every post feeds a tool | `agents/04-blog-writer.md` L279 (was L276 before the 2026-10-15 header), L291; retired `/refresh` step 2 |

## Resolved conflicts (retired commands → seo-content-system, 2026-10-15)

The `/brief`, `/draft`, `/refresh` and `/content-plan` commands moved to `archive/commands/`. Every
step has a global home; the map and the SellonTube-only excerpts are in
`seo/site-kit/pipeline-notes.md`. These flow changes are settled:

1. **Outline checkpoint folds into the brief.** `/brief` stopped "before proceeding to outline or
   draft" and `/draft` step 2 (Agent 04 Phase 1) had its own outline STOP. Now the outline rows sit
   in the brief (BRF-06) and one approval at the mode 03 checkpoint covers both.
2. **The draft is shown before final QA.** `/draft` step 7 said "Only surface to user after QA
   passes." Now mode 04 runs a draft-level check (save hook `check_post.py`, 0 FAIL, draft run
   record), shows the draft at its checkpoint, and the final QA runs in mode 05 on the approved
   draft. `agents/05-content-qa.md` checks still run as ST detail.
3. **SVG feature image vs raster.** `/draft` step 4 (Agent 04 Phase 3.5) made an SVG; post-rules
   VIS-18 (R-03) requires a raster og:image. Migration decided 2026-10-15 by Sathya (OPEN 7,
   resolved): new and edited posts use PNG/JPG; old SVG posts convert one by one when edited.
4. **Internal-link minimum.** `/refresh` step 2 said at least 4, `seo/site-kit/deploy.md` says at
   least 2, global LNK-04 says at least 2. Kept SellonTube's at least 4 incl. one `/tools/` link as
   a project override (Overrides table, `agents/04-blog-writer.md` L279).

## Paused surfaces

- **New blog posts:** `growth-strategy.md` "Blog Strategy (Paused Until Top 4 Tools Ship)". Existing
  posts keep accruing. Last post-content commit 2026-09-07 (a fix, not a new post).
- **pSEO drip:** PAUSED (`growth-strategy.md` "pSEO Strategy (PAUSED)", `agents/06`, `agents/03`).
  Live pSEO pages stay indexed. 53 pSEO pages earned 162 impressions and 1 click (ledger L-TOP-07).
- **`ranking-checker-amplification-strategy.md`:** premise dead; do not execute
  (`traffic-reality-check.md` "Documents this invalidates").

## OPEN: owner decisions (logged 2026-10-15)

Items 6, 7 and 9 were decided 2026-10-15 by Sathya and stay listed with a one-line history so the
numbers other docs cite still resolve. Item 5 narrowed to the meta cap. Also decided the same day
for all projects: FAQPage off (Overrides) and the common review-count rule (post-rules CLM-30).

1. **`/pricing` vs "no agency content".** `growth-strategy.md` "Mission" says "No services/agency
   content". `src/pages/pricing.astro` L7 is still titled "YouTube Marketing Agency for B2B" and sells
   retainers. `TASKS.md` backlog also holds "Write blog post: video content marketing agency buyer's
   guide". The reality check lists "should `/pricing` stop being the agency page in main nav" as open.
2. **Creator audience vs ICP.** The best-trafficked tools attract creators; `docs/icp.md` "NOT the
   Audience" excludes hobbyist creators. Split into a product ICP and an agency ICP, or not?
   (`traffic-reality-check.md` "Still open".)
3. **Cadence contradicts itself.** "Up to 5 posts/week" (`content-playbook.md` L49, `seo-rules.md`
   L49, `agents/03` L20); "5 posts/week (Mon-Fri)" (`research/publishing_calendar.md` L5); flag any
   7-day window with more than 2 posts (`agents/03` Step 2); blog paused until tools ship
   (`growth-strategy.md` L156); and ledger L-TOP-11 (no new posts while recent ones lack impressions).
   All cadence lines point at an "Apr 20 - Apr 28, 2026" schedule.
4. **`growth-strategy.md` predates the correction.** Last updated 2026-04-22; its own banner says the
   tool roadmap and blog schedule were not re-evaluated against the bot finding. `DOCS.md` L22 still
   calls it the "SINGLE SOURCE OF TRUTH", and `publishing_calendar.md` claims the same for blog
   decisions. `ctr-optimization-sop.md` still triggers on impressions ("impressions > 0"), and so
   did the retired `/content-plan` ("rising impressions but low CTR", now
   `archive/commands/content-plan.md` step 1, quoted in `seo/site-kit/pipeline-notes.md`). The bot
   rule forbids both. Mode 02 step 1 replaces the command. Re-base or demote the SOP.
5. **Meta caps disagree:** `seo-rules.md` L68 says 150-160, the two blog standards say <155 (see
   Overrides). The title half of this item closed with item 6.
6. **RESOLVED: title cap.** Decided 2026-10-15 by Sathya: 60 for every project, counted on the full
   rendered `<title>` incl. " | SellOnTube". History: ST docs said 60, 65 and 68 (listicles);
   `seo-rules.md` L60, `agents/05-content-qa.md` L69 and `docs/sops/blog-publishing-sop.md` L72 still
   say 65/68 and are superseded.
7. **RESOLVED: SVG feature images.** Decided 2026-10-15 by Sathya: switch to PNG/JPG. New and edited
   posts use a raster feature image; old posts convert one by one when edited (the gate's raster-only
   `feature_image.formats` check enforces it). Size settled 2026-10-15 at 1200x630:
   `scripts/get-feature-image.mjs` L233-234 and L395-396 and the `src/content/config.ts` L63-64
   defaults agree; the 1200x675 SVG canvas in the docs was wrong and is fixed in
   `agents/04-blog-writer.md` Phase 3.5 and `seo/site-kit/brand-visuals.md`. History: 59 of 60 posts set an `.svg` `image:` that
   the build passes through as og:image.
8. **Author lock.** 58 posts use `author: Sathyanand`; `ai-tools-for-youtube.mdx` uses `Gautham` and
   `youtube-b2b-buyer-journey-data.mdx` uses `Pradeep`; `src/data/authors.ts` L23/L30/L37 registers
   all three. The machine config leaves `author` unset. Lock it to one name, or keep three?
9. **RESOLVED: Bing submission.** Decided 2026-10-15 by Sathya: automatic, no asking. After a post
   or page is merged AND live, Claude submits its URL(s) to IndexNow and verifies acceptance (HTTP
   200 or 202; otherwise retry once, then report). History: `docs/sops/blog-publishing-sop.md` step
   17 submitted automatically while router non-negotiable 13 required a yes (post-rules OD-2).

## IndexNow

- **Key file hosted: yes, two.** `public/96a261587bfb9306b6dfd7dc03eb05e3.txt` (the key used with
  `api.indexnow.org` by `netlify/functions/deploy-succeeded-background.ts` L4, L33-41, after every
  Netlify deploy) and `public/xJ3ww4bLDP1dxv07fiqkeYmO9Lc5SaH1.txt` (the `INDEXNOW_KEY` in local
  `.env`, read by `scripts/indexnow-ping.js`). Both return HTTP 200 live with the key as body
  (`curl`, 2026-10-15). Use the first one.
- **Submit command** (run after merge AND live; 200 or 202 = accepted):
  `curl -s -o /dev/null -w "%{http_code}" -X POST https://api.indexnow.org/indexnow -H "Content-Type: application/json; charset=utf-8" -d '{"host":"sellontube.com","key":"96a261587bfb9306b6dfd7dc03eb05e3","keyLocation":"https://sellontube.com/96a261587bfb9306b6dfd7dc03eb05e3.txt","urlList":["https://sellontube.com/blog/<slug>"]}'`
- Not verified: whether `api.indexnow.org` accepts this host today. `scripts/indexnow-ping.js` L7-8
  and `research/aeo/bing-api-indexing-plan.md` record earlier 403s on key verification; the first
  real submit settles it. A 403 counts as a failure to report, not a pass.
- **Tested 2026-10-15 (owner-approved, homepage only): BOTH keys return HTTP 403**
  `UserForbiddedToAccessSite` ("verify the site using the key"), at `api.indexnow.org` (key 1) and
  `www.bing.com/indexnow` (key 2). Both key files serve 200 with the key as body, and the host has no
  redirect (www 301s to apex). So Bing refuses the site, not the key. **Blocked on the owner:** check
  Bing Webmaster Tools for sellontube.com (verified? blocked or penalty notice?). Until fixed, every
  automatic IndexNow submit for SellonTube reports this failure.

## Gaps found

- [ ] No product ICP; no definition of the paid product.
- [ ] GA4 conversion events still zero, so "visitors who explore" has session-level proxies only.
- [ ] No written verdict thresholds (too early / working / refresh / prune) for posts or tools.
- [ ] `sot_master.csv` tiers and `priority_score` were built before the bot correction.
- [x] FAQPage JSON-LD removed (2026-10-15, one commit, visible FAQs kept; built text, titles, metas,
      canonicals and og tags unchanged on all 337 built pages) from 12 files: the blog template
      `src/pages/[...blog]/index.astro` and 11 pages: `src/pages/index.astro`, `pricing.astro`,
      `product-pricing.astro`, `shopify-app/tools/shopify-app-review-scraper-analyzer.astro`,
      `shopify-app/tools/shopify-app-store-listing-grader/index.astro`,
      `tools/youtube-ranking-checker.astro`, `tools/youtube-roi-calculator.astro`,
      `tools/youtube-transcript-generator.astro`, `youtube-for/[slug].astro`, `youtube-for/shopify.astro`,
      `youtube-vs/[slug].astro`. Built pages carrying FAQPage: 124 before, 13 after.
- [ ] FAQPage still emitted by 13 tool pages in `src/pages/tools/`, pending until the tool-fix branch
      lands (do not edit them before it does): youtube-autocomplete-keywords, youtube-channel-audit,
      youtube-competitor-analysis, youtube-description-extractor, youtube-description-generator,
      youtube-script-generator, youtube-seo-tool, youtube-tag-generator, youtube-timestamp-generator,
      youtube-title-generator, youtube-video-ideas-evaluator, youtube-video-ideas-generator,
      youtube-video-keyword-finder. `src/types.d.ts` L56 keeps the `faqs` type comment.

## Corrections sent back to the global framework

None new. L-GSC-01, L-GSC-02, L-TOP-07 and L-CTA-07 in the ledger already cite SellonTube sources.

## Machine config (read by seo-content-system tools and the post gate hook)

Only keys that differ from `seo_config.py` DEFAULTS are set, plus `title_cap` and `faq.schema`
pinned on purpose (decided 2026-10-15 by Sathya: 60 for all projects; FAQPage off for all projects).
`feature_image` is left at the default raster formats on purpose (OPEN 7, resolved). Dotted field names (`metadata.title`) mean a nested frontmatter key. Added
2026-10-15.

```seo-config
site_url: "https://sellontube.com"            # source: src/config.yaml:3
post_globs: ["src/data/post/*.md", "src/data/post/*.mdx"]   # source: src/content/config.ts:50 (all 60 files there are posts)
built_dir: "dist"
build_cmd: "npm run build"                    # source: package.json:13 (astro build)
fields:
  seo_title: "metadata.title"                 # source: src/pages/[...blog]/index.astro:45 (metadata overrides title; set in 2 posts)
  description: "metadata.description"         # source: index.astro:33+45 (excerpt is the fallback; dist meta = metadata.description); agents/04-blog-writer.md:141
  updated_date: "updateDate"                  # source: src/content/config.ts:53
  feature_image: "image"                      # source: src/content/config.ts:58
  feature_image_alt: "image_alt"              # source: src/content/config.ts:59
frontmatter:
  required: ["title"]                         # source: src/content/config.ts:56 (only non-optional field; drafts omit publishDate)
  known_extra: ["featuredImageCaption", "featuredImageCredit", "featuredImageCreditUrl",
                "featuredImageWidth", "featuredImageHeight", "featuredImagePlaceholder",
                "category", "tags", "toolCta", "howToSteps", "metadata", "excerpt"]   # source: src/content/config.ts:60-91 (excerpt: listing teaser + schema fallback)
title_cap: 60                                 # same as default; pinned, OPEN 6 resolved 2026-10-15 (60 for all projects, full rendered title)
faq:
  min: 3                                      # source: agents/04-blog-writer.md:38 ("3-5 questions")
  schema: false                               # decided 2026-10-15 by Sathya: FAQPage off for all projects; FAQs stay visible (post-rules ONP-09)
allow_inline_style: true                      # source: blog-production-standard.md:274,319 (inline styles required)
allow_hr: true                                # source: blog-production-standard.md:43 (one --- after the ToC only; a boolean cannot cap it at one)
require_trailing_slash: false                 # source: src/config.yaml:5; vendor/integration/index.ts:35; dist canonical has no slash
extra_checks: ["node scripts/validate-build.js"]   # BUILD-TIME: needs dist/ (validate-build.js:386 exits 1 without it); same call as netlify.toml:3
```
