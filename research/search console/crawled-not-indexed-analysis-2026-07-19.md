# GSC "Crawled - currently not indexed" — Analysis & Fixes (2026-07-19)

**Source:** `sellontube.com-Coverage-Drilldown-2026-07-19/` (56 URLs, grew 8 → 56 between Apr 20 and Jul 10).
**Method:** three parallel verifications — live HTTP check of all 56 URLs (status/canonical/noindex, mutation-tested), fresh-build corpus audit (dist/ + sitemap + inlinks + publishDates + netlify.toml sweep), and live GSC API pull (90d, property `sc-domain:sellontube.com`).
**Branch:** `google-search-console`. All fixes below implemented there; not yet committed/deployed.

---

## Headline findings

1. **This is not one problem; it is five buckets with different causes.** Blanket "fix indexing" advice would have been wrong for most of the list.
2. **31 of the 56 URLs had impressions in the window — several were indexed and then dropped.** Notably `/blog/how-to-find-youtube-video-ranking-keywords` (3,639 impr) and `/blog/youtube-script-writing-guide` (1,504 impr at position 8.4 = page 1). Google deindexed pages it had already ranked: an authority/quality reassessment signal, not a technical fault (all serve 200, self-canonical, no noindex).
3. **One genuine technical defect found and fixed:** hub redirect/canonical contradiction. netlify.toml 301'd `/youtube-vs` → `/youtube-vs/` while sitemap + canonicals declare non-slash. Google followed the sitemap into a 301 whose destination canonicalized back through the same 301. `/youtube-vs/` sat in the report with 88 impressions of blocked demand.
4. **Demand concentration check (GSC-FIRST):** `/tools/` = 73k of 120k site impressions; all three pSEO families combined = ~1,000. Effort was weighted accordingly — heavy on the deindexed blog posts feeding the tools cluster, light on pSEO.

## Bucket verdicts

| Bucket | URLs | Live state | Root cause | Action |
|---|---|---|---|---|
| Deindexed/never-indexed blog posts | 12 | 200, clean canonical, no noindex | Quality/authority reassessment on low-authority domain | Refresh + tool-page inlinks + Request Indexing (below) |
| pSEO children | ~30 | 200, clean | Near-zero demand; `/youtube-vs/*` additionally link-starved (1-2 inlinks vs 30-46 for `/youtube-for/*`) | Cross-links added; thin outlier expanded; rest accepted as excluded |
| Hub pages | 2 (`/youtube-vs/`, hub pair) | Redirect/canonical loop | Contradictory signals | **Fixed:** both 301 rules deleted |
| Legacy redirects | 13 | All 301 → 200 correctly | GSC report lag, zero equity (0 impressions each) | None (documented) |
| Junk/params/feeds | 5 | Expected exclusions; tag pages already `noindex,follow` | Correct behavior | None |

## Changes implemented (this branch)

1. **netlify.toml**
   - Added `410` for `/slides` (retired experiment; page + links already absent from codebase).
   - Deleted `/youtube-for` → `/youtube-for/` and `/youtube-vs` → `/youtube-vs/` 301 rules (canonical-loop fix). Non-slash hubs now serve 200, matching sitemap + canonicals.
   - `/youtube-for/artists` redirect target normalized to non-slash.
2. **Internal links (equity from pages Google values):**
   - `/tools/youtube-title-generator` → `/blog/youtube-titles-for-business` (had zero tool links).
   - `/tools/youtube-autocomplete-keywords` → `/blog/youtube-keyword-research` (had zero tool links).
   - Blog → starved `/youtube-vs/*` children: paid-ads (from `youtube-marketing-roi`), content-marketing (from `youtube-marketing-cost`), webinars (from `b2b-video-marketing-strategy`), seo-content (from `youtube-break-even-math`). Email-marketing and referral-marketing skipped: no natural host sentence exists (documented candidate: `when-youtube-doesnt-work.mdx` L245 for referral).
   - NOT added: more links to `youtube-seo-guide` (already linked from 8 tool pages) or the two already-linked posts — diminishing returns + anchor-diversity cap.
3. **Content refreshes (substantive, frontmatter-frozen except updateDate):**
   - `how-to-find-youtube-video-ranking-keywords.md`: current YouTube Studio UI paths, Jul 2026 Studio-redesign note, corrected 28-day claim, web-verified vidIQ pricing update, tool-description accuracy pass, dedup of repeated paragraphs. +176 words. `updateDate: 2026-07-19` added.
   - `youtube-script-writing-guide.mdx`: consistency fixes (5-vs-4 criteria, retention stat), 2026 AI-scripting paragraph, banned-word cleanup, specificity pass. +72 words. `updateDate: 2026-07-19` added. Title/meta untouched (live CTR experiment).
4. **`/youtube-for/shopify` expanded ~760 → ~2,105 rendered words** (video types, mistakes, effort reality, objections, measurement; FAQs 6→9 in both visible widget and JSON-LD). ⚠️ Note: page targets Shopify **app companies**, not merchants — expansion follows the page's existing positioning. Flag if merchant angle was intended.
5. **Hygiene on touched pages:** pre-existing "actionable" removed from title-generator page; en/em dashes swept from `youtube-marketing-roi.md`.

## Verification

- `npm run build` (316 pages) + `scripts/validate-build.js`: all 3 checks PASS (links, sitemap, draft-leak).
- All new links confirmed present in built HTML; hub redirect rules confirmed gone; `dateModified` flowing into Article schema (IST-correct).
- Em/en-dash + banned-phrase sweeps clean across all touched files (UTF-8-explicit decoding — PS default encoding gives false positives).
- One subagent error caught and corrected: a cross-link was initially placed in `is-youtube-worth-it-for-business.md`, which is `draft: true` + 301'd; reverted and relocated to the live canonical `youtube-marketing-roi.md`.

## Manual steps for Sathya (publish day)

**GSC Request Indexing (URL Inspection), priority order — quota ~10/day:**
1. `https://sellontube.com/blog/how-to-find-youtube-video-ranking-keywords`
2. `https://sellontube.com/blog/youtube-script-writing-guide`
3. `https://sellontube.com/youtube-vs`
4. `https://sellontube.com/youtube-for`
5. `https://sellontube.com/blog/youtube-seo-guide`
6. `https://sellontube.com/blog/youtube-keyword-research`
7. `https://sellontube.com/blog/youtube-titles-for-business`
8. `https://sellontube.com/blog/youtube-marketing-roi`
9. `https://sellontube.com/youtube-for/shopify`
10. `https://sellontube.com/youtube-vs/webinars`
(Day 2 if desired: `/youtube-vs/email-marketing`, `/youtube-vs/paid-ads`, `/blog/youtube-marketing-strategy`, `/blog/youtube-marketing-b2b`.)

**GSC Removals:** `https://sellontube.com/slides` (after the 410 deploys).

**Bing:** run `node scripts/bing-submit.mjs` with the refreshed/changed URLs after deploy.

## Measurement (check ~mid-August 2026)

Re-pull the Coverage drilldown + per-URL GSC data. Success criteria:
- The 2 refreshed posts re-indexed and re-serving (ranking-keywords back above 0 impressions/week; script guide back near position 8-10).
- `/youtube-vs` hub indexed (was 88 impr @ pos 10 while excluded).
- "Crawled - currently not indexed" count trending down from 56 (legacy entries aging out).
- Do NOT expect the ~25 zero-demand pSEO pages to index; that is accepted.

## Backlog (approved, deferred)

- Expand `/blog/compounding-effect-four-videos-a-month` (897 words, thin outlier) — separate writing session.
- Optional referral-marketing cross-link host identified above.

---

## Critical self-review (2026-07-19, pre-commit) — top 10 gaps vs the actual goal (impressions/traffic)

Evidence added after the fixes: GSC [query,page] pull (2,871 rows; cannibalization file `gsc_cannibalization.py` in session scratchpad) + live SERP survey of the rank-checker cluster.

1. **The exercise optimized the report, not the traffic.** The #1 lever sat outside the 56-URL scope: `/tools/youtube-ranking-checker` — 54.9k impr, 41 clicks, pos 24-51 on core queries, on a SERP held by small niche sites (tubelab.net, tubepilot.ai, seomator.com) with several weak results (SocialBlade off-intent, Semrush KB doc). Winnable. Nothing shipped for it.
2. **Cannibalization is the cluster's real disease; refresh treated a symptom.** 520 queries have 2+ SellonTube pages competing. Four pages split the rank cluster; the deindexed how-to-check (pos ~19-27!) and ranking-keywords (pos 56-80 on tracking queries) are the demoted duplicates. Needed: intent differentiation or consolidation (301 weakest into strongest), not polish.
3. **CTR layer skipped.** 41 clicks / 54.9k impr on the tool; 4 / 14.7k on best-tools; 0 / 3.2k on how-to-check. Winning title patterns visible on page 1: "Free", "No-Signup", year. Title/meta rewrites on already-serving pages = fastest traffic, no indexing dependency. CTR experiment review (due 2026-05-23) still not done.
4. **Authority root cause untreated.** Deindexation of ranking pages = domain trust deficit; zero external signals shipped (case-study distribution pending, directories paused, no tool-embed outreach — free tools are the linkable assets, and that is visibly how tubelab/tubepilot win).
5. **Script-cluster demand may be phantom.** script-writing-guide's 1,466 impr = essentially ONE ultra-long-tail query ("youtube scriptwriting for b2b lead generation"), 3 own pages at pos 7-8.5, 0 clicks across all — pattern consistent with AI/LLM-synthetic query volume. Validate before investing further.
6. **Refresh deltas (+2-4% words) likely below Google's significant-change threshold** while still bumping dateModified — trains Google to distrust our dates. Deepen or don't date-bump.
7. **Sitemap lastmod uniformly = build timestamp on all 197 URLs** → Google ignores it; refreshed posts get no recrawl priority. Fix via sitemap serialize hook using publishDate/updateDate.
8. **Internal linking done retail (6 links), not template-level** (related-content modules, hub-page substance). Hubs remain thin link lists.
9. **pSEO "accept exclusion" is passive:** ~25 zero-demand thin pages still live/crawlable feed the sitewide quality assessment that caused bucket-1 deindexations. Prune/consolidate (esp. youtube-video-ideas: 43 pages / 377 impr).
10. **No attribution design:** all fixes deploy at once; mid-Aug lift check cannot isolate causes. Stagger Request Indexing, keep weekly per-URL pulls.
