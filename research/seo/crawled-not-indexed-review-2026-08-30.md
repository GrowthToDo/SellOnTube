# Crawled-Not-Indexed Review — 2026-08-30

Source: GSC export `crawled not indexed pages_30 Aug/Table.csv`, 45 URLs (as of last crawl
dates 2026-02-24 to 2026-08-22). Re-inspected live via GSC URL Inspection API on 2026-08-30.

## Methodology
1. `npm run build` → analyzed `dist/` (sitemap, rendered HTML), never source alone.
2. `scripts/gsc_inspect.py` — live URL Inspection API call per candidate URL (coverage
   state, canonical, sitemap membership) as of **today**, not the stale list date.
3. 90-day Search Analytics pull (`page` dimension) for impressions/clicks/position per
   candidate — the ROI signal.
4. `scripts/audit_internal_links.py` — confirmed none of the 5 finalists are orphaned or
   near-orphaned (so linking isn't the blocker; content quality is).
5. Cross-referenced `research/keywords/sot_master.csv` for keyword tier/priority where it
   exists (mostly blog; the `/youtube-for/*` and `/youtube-vs/*` pSEO pages aren't in that
   pipeline, so GSC impressions are the primary signal for those).
6. Deep citability-gate audit (3 parallel agents) on the 5 finalists against
   `ai-seo-guide.md` §16, `content-depth-framework.md`, `blog-production-standard.md`,
   `style-guide.md`.

## Good news first: 7 of these 45 URLs are already indexed
Re-inspection shows Google flipped these to **PASS / Submitted and indexed** between
2026-08-21 and 2026-08-26, after the list was pulled — no action needed, don't spend time
here:

`/blog/youtube-marketing-roi`, `/youtube-for/shopify`, `/youtube-vs/webinars`,
`/youtube-for/marketing-agencies`, `/blog/youtube-titles-for-business`,
`/blog/youtube-seo-guide`, `/youtube-video-ideas/b2b-vendor-comparison-videos`.

## Junk bucket (excluded from top-5 candidacy)
| URL | Disposition |
|---|---|
| `rss.xml` | Feed, not a page. No action. |
| `?ref=peerlist` | Query-param variant of homepage. Confirm canonical tag points to bare `/` (it does, per prior audits). No action. |
| `calculator?revenue` | Query-param variant of `/youtube-roi-calculator`. No action. |
| `tag/data` | Thin taxonomy page, listed as near-orphan in the link audit. Low priority, not a content-fix candidate. |
| `homes/mobile-app` | Already GSC-removed 2026-03-02 per project memory. Resurfaced in this crawl list only because GSC keeps historical crawl records; not a live problem. |
| `/youtube-topics` + 6 `/youtube-topics/*` children | Confirmed in `netlify.toml`: 301-redirect to `/youtube-video-ideas` equivalents. Google is crawling the redirect source directly — expected behavior, self-resolves as Google re-crawls and follows the 301. Not a content problem. |
| `/youtube-for-coaches`, `/youtube-for-consultants`, `/youtube-for-saas` (no-slash legacy slugs) | **No source page exists** — confirmed via repo search. `pageFetchState: SUCCESSFUL` but `NOT-IN-SITEMAP`, `INDEXING_STATE_UNSPECIFIED`, empty canonical, 0 impressions in 90d. Orphaned crawl memory from an old URL structure (pre-dates the `/youtube-for/[slug]` pattern). Optional cheap fix: add explicit 301s to `/youtube-for/coaches` etc. in `netlify.toml` in case any external backlinks still point to the old slugs — but zero traffic means this is low priority, not top-5. |
| `/youtube-vs/` (trailing slash, from `2026-04-01` crawl) | The real hub page is `/youtube-vs` (no trailing slash) — confirmed **present** in the current `dist/sitemap-0.xml` and **not** in the orphan/near-orphan list. The trailing-slash duplicate GSC flagged is a stale crawl artifact (empty canonical = Google hadn't finished processing it, dated 5 months ago) that should self-resolve as Google re-crawls. Not a top-5 candidate, but worth a GSC "Validate Fix" click if it's still showing after another month. |

## Full real-candidate table (excluding above)
| URL | Coverage state (live) | 90d impressions | Avg position | Note |
|---|---|---|---|---|
| `/blog/how-to-find-youtube-video-ranking-keywords` | Crawled – not indexed | **289** | 47.0 | **TOP 5** |
| `/youtube-for/saas` | Crawled – not indexed | 20 | **7.9** | **TOP 5** |
| `/blog/search-intent-youtube-seo-power` | Crawled – not indexed | 25 | 8.0 | **TOP 5** |
| `/blog/youtube-marketing-b2b` | Crawled – not indexed | 6 | 14.3 | **TOP 5** (highest keyword priority_score in SoT) |
| `/blog/why-most-youtube-strategies-fail` | Crawled – not indexed | 9 | 8.3 | **TOP 5** |
| `/youtube-for/course-creators` | Crawled – not indexed | 11 | 8.3 | Near miss |
| `/blog/youtube-marketing-strategy` | Crawled – not indexed | 3 | 7.0 | Near miss |
| `/youtube-video-ideas/agency-case-study-videos` | Crawled – not indexed | 2 | 1.0 | Low impressions |
| `/youtube-for/marketing-agencies`* | see above, now indexed | — | — | — |
| `/youtube-for/law-firms` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-for/fintech-companies` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-for/coaches` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-for/consultants` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-for/small-business` | Crawled – not indexed | 1 | 1.0 | Low priority |
| `/youtube-vs/referral-marketing` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-vs/paid-ads` | Crawled – not indexed | 1 | 6.0 | Low priority |
| `/youtube-vs/instagram` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-video-ideas/agency-pricing-structure-videos` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-video-ideas/agency-process-transparency-videos` | Crawled – not indexed | 0 | — | Low priority |
| `/youtube-video-ideas/coach-results-videos` | Crawled – not indexed | 0 | — | Low priority |
| `/blog/b2b-video-content-ideas` | `draft: true` in frontmatter | 0 | — | **Not a bug** — this post was never published. It reads as finished (title, excerpt, 4 FAQs already written). Flagging for your call: publish it (set `publishDate`, flip `draft: false`) or leave it. Not a fix-the-indexing problem. |

## Top 5 — ranked by ROI (GSC demand × fixability), blog-weighted per your call

### 1. `/blog/how-to-find-youtube-video-ranking-keywords` — highest-impact fix on the site
- **Why top 5:** 289 impressions/90d — 10x every other page on this list. Position 47 (page
  5) means Google already half-trusts it; it's one push from breaking through.
- **Root cause (agent-diagnosed):** cannibalization. Four near-duplicate posts cover
  "check/find your YouTube ranking": this page, `how-to-check-youtube-ranking.mdx`,
  `how-to-check-youtube-rankings.mdx` (same "3 methods" structure, same tool CTA, near-
  identical FAQ), and `best-youtube-rank-checker-tools-for-business.md`. Google recognizes
  the overlap and won't index a 4th variant of the same intent.
- **Fix:** Reposition this page's angle to *discovery* ("find keywords you're already
  ranking for without knowing it") vs. the siblings' *lookup* angle ("check my rank for
  keyword X"). Rewrite the intro as a standalone 134-167 word answer block stating that
  distinct angle explicitly. Add a disambiguating cross-link between this page and the two
  `how-to-check-youtube-ranking*` posts so Google stops reading them as one topic.
- File: `src/data/post/how-to-find-youtube-video-ranking-keywords.md`

### 2. `/youtube-for/saas` — best position of any candidate, core ICP
- **Why top 5:** position 7.9 (top of page 1) despite "not indexed" — Google is actively
  ranking it in some queries. SaaS is core ICP.
- **Root cause:** ~35-40% of the page is byte-identical template scaffolding shared across
  all 31 `/youtube-for/*` niche pages (buyer-decision diagram, "compounding leads" chart,
  4-step process, tools grid). The chart renders **identical Month 3/6/9/12 numbers on every
  niche page**, labeled "illustrative" — reads as fabricated/templated at 31x scale to
  Google's helpful-content classifier. The FAQ section is genuinely niche-specific (the one
  part working correctly) but not enough to override the pattern.
- **Fix:** Replace the hypothetical "$99/month tool... $600 to produce" FAQ example and the
  shared illustrative chart with one real, named SaaS client stat (with dates) in a 134-167
  word answer block. This is the highest-leverage fix on the list because the same shared
  chart likely explains several of the other 0-impression `/youtube-for/*` non-indexed pages
  too — fixing the template pattern (making the chart real per-niche, not shared) compounds.
- File: `src/data/niches.ts` (saas niche object) + shared chart component in
  `src/pages/youtube-for/[slug].astro`

### 3. `/blog/search-intent-youtube-seo-power` — title/content mismatch
- **Why top 5:** 25 impressions, position 8.0 (page 1), meets word-count tier already.
- **Root cause:** the title promises 4 search-intent types (navigational, informational,
  commercial investigation, transactional) — they're named once in the intro and never
  revisited. ~95% of the remaining 2,700 words reuses the exact 1,257-vs-411 / 3.25x dataset
  from `youtube-vs-blog-shopify-app-case-study.mdx` almost verbatim. No unique
  search-intent analysis actually exists on the page — it's a mistitled ROI argument.
- **Fix:** Insert a dedicated `## The 4 YouTube Search Intent Types` H2 right after the
  intro, one H3 per intent type (definition, 2 example buyer queries, winning content
  format), before pivoting to the YouTube-vs-blogging argument. Also convert the FAQ block's
  bold-paragraph questions to real `### Question` H3s to match frontmatter.
- File: `src/data/post/search-intent-youtube-seo-power.mdx`

### 4. `/blog/youtube-marketing-b2b` — highest-priority keyword in the whole SoT, easiest fix
- **Why top 5:** targets "b2b youtube" / "youtube for b2b" — tier=winnable,
  priority_score ~77 (highest in `sot_master.csv`), kd_real 0-2 (near-zero competition).
  Only 96 words over the depth-tier floor and structurally clean otherwise — smallest lift
  of the five.
- **Root cause:** `lastCrawlTime` is 2026-05-14 — not recrawled in 3.5 months despite the
  content-standard's monthly-review mandate for priority clusters. No 134-167 word answer
  block exists (only a 46-word fragment). Reads to Google as a stale navigation hub linking
  to 7+ sibling posts rather than a standalone authority page.
- **Fix:** Expand the 46-word definition after "What YouTube Marketing for B2B Actually
  Produces" into a full 134-167 word standalone answer (specificity on the 3 content types +
  conversion path). Add `updateDate` + visible "Last updated" line. Resubmit via GSC Request
  Indexing after the edit.
- File: `src/data/post/youtube-marketing-b2b.md`

### 5. `/blog/why-most-youtube-strategies-fail` — mechanical FAQ fix
- **Why top 5:** 9 impressions, position 8.3 (page 1), already exceeds word-count tier
  (2,391 words) — content depth isn't the issue, structure is.
- **Root cause:** `## Frequently Asked Questions` heading exists, but all 3 questions are
  `**bold paragraphs**`, not `### Question` H3s — a direct violation of
  `blog-production-standard.md` §8 ("every frontmatter FAQ needs a matching H3, no
  exceptions"). This means the visible-FAQ signal Google's classifier looks for isn't
  actually present despite frontmatter claiming it.
- **Fix:** Convert the 3 bold FAQ questions to `### Question text?` H3 headings, exact
  format per §8. (Sitemap membership was double-checked — current `dist/sitemap-0.xml`
  already includes this URL; the "NOT-IN-SITEMAP" the live GSC inspection returned is a
  stale reading from the 2026-07-16 crawl, not a current gap.)
- File: `src/data/post/why-most-youtube-strategies-fail.mdx`

## Near misses (didn't make top 5)
- **`/youtube-for/course-creators`** (11 impr, pos 8.3) — same root cause as `/youtube-for/
  saas` (shared template pattern), but course-creators' most immediate issue is 3 banned em
  dashes (mechanical 5-min fix) plus a generic unattributed claim. Lower ROI than SaaS
  (not core ICP), included in next batch once the saas fix's template pattern is resolved
  site-wide.
- **`/blog/youtube-marketing-strategy`** (3 impr, pos 7.0) — decent position but its SoT
  keyword match is split between a winnable term (priority 49.6) and a stretch term
  (priority 47.6, avoid per tier rules) — needs a keyword-targeting decision before a
  content fix, not purely a content problem.
- **The other `/youtube-for/*` and `/youtube-vs/*` pages at 0-1 impressions** — likely share
  the same template-scaffolding root cause as `/youtube-for/saas`, but with zero search
  demand yet, fixing them individually isn't ROI-justified. Once the shared-chart /
  first-party-proof fix lands on `/youtube-for/saas`, re-run this same GSC-impressions pull
  in ~60 days — if the fix pattern works, apply it to the rest of the 31 as a batch, not
  page-by-page.
