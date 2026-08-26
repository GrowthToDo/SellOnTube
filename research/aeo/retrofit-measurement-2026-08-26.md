# Comparison-Post Retrofit + Crawled-Not-Indexed Fix — Measurement (2026-08-26)

**Source:** `sc-domain:sellontube.com`, live GSC Search Analytics API + URL Inspection API. Latest available data 2026-08-23.
**Method:** three independent passes — (1) URL Inspection on all 14 project URLs for crawl/index truth, (2) two lift comparisons per project (literal-baseline and matched-window-with-control), (3) whole-corpus 90d pull split by country, ranked by clicks.
**Closes:** the "Next capture" instruction in `retrofit-baseline-2026-06-29.md` and the "Measurement (check ~mid-August 2026)" section of `../search console/crawled-not-indexed-analysis-2026-07-19.md`.
**Raw data:** `../search console/url-inspection-2026-08-26.csv`. Scripts: `scripts/gsc_inspect.py`, `scripts/gsc_measure.py`, `scripts/gsc_corpus.py`.
**Branch:** `research/gsc-measurement-aug25`.

---

## Headline

**Neither project can be credited or blamed, because Google never re-evaluated the pages they targeted.** All six still-unindexed URLs were last crawled *before* the fix that was meant to help them shipped. The one apparent success was also last crawled before the fix. The measurement window contains no test.

**Separately, and more important:** the retrofit was scoped from impressions, and `traffic-reality-check.md` (2026-07-21) had already established that impressions on this domain are roughly 90% non-human. This measurement reproduces that finding independently. The page the baseline called "the biggest opportunity by far" now carries 25,558 impressions and produces 5 to 7 clicks.

---

## 1. Crawl and index truth (URL Inspection API)

New capability: the URL Inspection API works with the existing service account. It requires scope
`https://www.googleapis.com/auth/webmasters` (not `webmasters.readonly`). Roughly 8 seconds per call,
so it must be batched.

| URL | Verdict | Coverage state | Last crawled | Fix shipped | Seen? |
|---|---|---|---|---|---|
| /blog/best-youtube-rank-checker-tools-for-business | PASS | Submitted and indexed | 2026-08-03 | 06-29 | yes |
| /blog/is-vidiq-worth-it-for-business | PASS | Submitted and indexed | 2026-07-16 | 06-29 | yes |
| /blog/best-youtube-autocomplete-keyword-tools | PASS | Submitted and indexed | 2026-08-22 | 06-29 | yes |
| **/blog/ai-tools-for-youtube** | NEUTRAL | **Not found (404)** | **2026-05-19** | 06-29 | **no** |
| /blog/how-to-find-youtube-video-ranking-keywords | NEUTRAL | Crawled - currently not indexed | 2026-06-20 | 07-19 | **no** |
| /blog/youtube-seo-guide | NEUTRAL | Crawled - currently not indexed | 2026-05-14 | 07-19 | **no** |
| /blog/youtube-titles-for-business | NEUTRAL | Crawled - currently not indexed | 2026-05-23 | 07-19 | **no** |
| /youtube-for/shopify | NEUTRAL | Crawled - currently not indexed | 2026-07-10 | 07-19 | **no** |
| /youtube-vs/webinars | NEUTRAL | Crawled - currently not indexed | 2026-07-10 | 07-19 | **no** |
| /blog/youtube-script-writing-guide | PASS | Submitted and indexed | 2026-07-16 | 07-19 | **no** |
| /blog/youtube-keyword-research | PASS | Submitted and indexed | 2026-07-16 | 07-19 | **no** |
| /youtube-vs | PASS | Submitted and indexed | 2026-08-23 | 07-19 | yes |
| /youtube-for | PASS | Submitted and indexed | 2026-07-31 | 07-19 | yes |
| /blog/youtube-marketing-roi | PASS | Submitted and indexed | 2026-08-21 | 07-19 | yes |

Two findings that change the verdicts:

**`/blog/ai-tools-for-youtube` is a 404 in Google's index.** Its `publishDate` is 2026-06-27. Google
last crawled it 2026-05-19, five weeks *before* it existed, received a 404, and has not returned in
three months. It has never recorded a single impression. The AEO retrofit was applied to a page
Google believes does not exist. This is a real defect, not a ranking judgement.

**`/blog/youtube-script-writing-guide` was last crawled 2026-07-16, three days before the indexing
fix shipped.** Its impressions rose 55 → 1,244 in the post-fix window. That rise therefore cannot be
attributed to the fix. It also produced **zero clicks**, which is the more useful fact.

---

## 2. Retrofit lift — both methods

### Method A: literal, against the recorded baseline

Current 90d (2026-05-26 to 2026-08-23) vs the baseline doc's 90d (2026-03-29 to 2026-06-27).

| Post | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| /blog/best-youtube-rank-checker-tools-for-business | 1 → 7 | 8,539 → 25,558 | 0.012% → 0.027% | 31.4 → 30.5 |
| /blog/is-vidiq-worth-it-for-business | 0 → 0 | 68 → 135 | 0% → 0% | 16.4 → 12.4 |
| /blog/ai-tools-for-youtube | 0 → 0 | 1 → 0 | 0% → 0% | 18.0 → n/a |
| /blog/best-youtube-autocomplete-keyword-tools | 8 → 18 | 4,487 → 7,210 | 0.178% → 0.250% | 9.9 → 10.2 |

Site 90d for context: 435 clicks, 158,913 impressions, CTR 0.274%, avg position 21.8.

### Method B: matched windows with site-wide control

Retrofit shipped 2026-06-29. Pre 2026-05-05..06-28 vs post 2026-06-30..08-23, 55 days each.

**Control: sitewide clicks 173 → 279 (+61%), impressions 65,908 → 103,174 (+57%).**

| Post | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| /blog/best-youtube-rank-checker-tools-for-business | 1 → 6 | 8,754 → 16,441 (+88%) | 0.011% → 0.036% | 31.4 → 30.0 |
| /blog/is-vidiq-worth-it-for-business | 0 → 0 | 70 → 63 | 0% → 0% | 16.2 → 8.3 |
| /blog/ai-tools-for-youtube | 0 → 0 | 0 → 0 | 0% → 0% | n/a |
| /blog/best-youtube-autocomplete-keyword-tools | 6 → 12 | 4,249 → 3,385 (-20%) | **0.141% → 0.355%** | 9.1 → 12.4 |

### Where the two methods disagree, and which to believe

Method A shows the rank-checker post tripling impressions and multiplying clicks 7x. Method B shows
the same page growing +88% against a site growing +57%, for a net of roughly +20% — and its position
moving 1.4 places in eight weeks. **Believe Method B.** Method A's windows straddle a period when the
whole site grew 57%, so it charges site-level growth to the retrofit.

### The one genuine win

`/blog/best-youtube-autocomplete-keyword-tools` **doubled CTR from 0.141% to 0.355% while its
position got worse (9.1 → 12.4)**. More clicks from a worse rank is the signature of a real
snippet-level improvement, and it is the only effect in this dataset that survives the control. It
is also exactly what `serp-diagnosis-2026-06-30.md` predicted would be the best near-term click win.

Verdict on the retrofit: **one page improved, one page was a 404 the whole time, two produced
nothing.** The AEO/citability work did not move the page it was aimed at, because that page's
constraint was never citability.

---

## 3. Crawled-not-indexed fix — verdict

Pre 2026-06-14..07-18 vs post 2026-07-20..08-23, 35 days each.
**Control: sitewide clicks 234 → 151 (-35%), impressions 69,354 → 63,235 (-9%), CTR 0.337% → 0.239%.**

Against the success criteria written on 2026-07-19:

| Criterion | Result |
|---|---|
| ranking-keywords back above 0 impressions/week | **Not met.** 120 → 0. Not recrawled since 2026-06-20. |
| script guide back near position 8-10 | Position 3.3, impressions 1,244. **But zero clicks, and not recrawled since 2026-07-16.** Not attributable. |
| /youtube-vs hub indexed | **Met.** Indexed, crawled 2026-08-23. Impressions fell 28 → 10. |
| crawled-not-indexed count trending down from 56 | Not re-pulled. Coverage drilldown export needed. |
| pSEO pages not expected to index | Held. /youtube-for/shopify and /youtube-vs/webinars both went to 0. |

The hub fix (the one genuine technical defect found in July) worked. Everything else is untested,
because Google has not recrawled the pages.

---

## 4. Where clicks actually are — whole corpus, 90d

Ranked by clicks, split West vs rest-of-world, per the reproduction recipe in
`traffic-reality-check.md`.

| Page | Clicks | West c/i | RoW c/i | CTR |
|---|---|---|---|---|
| /tools/youtube-ranking-checker | 70 | 7 / 74,616 | 63 / 4,247 | 0.09% |
| /tools/youtube-transcript-generator | 30 | 12 / 1,294 | 18 / 659 | **1.54%** |
| /tools/youtube-channel-audit | 19 | 1 / 347 | 18 / 370 | **2.65%** |
| /tools/youtube-autocomplete-keywords | 12 | 2 / 124 | 10 / 344 | **2.56%** |
| /blog/best-youtube-autocomplete-keyword-tools | 10 | 3 / 1,358 | 7 / 2,809 | 0.24% |
| /blog/best-youtube-rank-checker-tools-for-business | 5 | **0 / 24,441** | 5 / 673 | 0.02% |
| /blog/best-youtube-transcript-generators | 3 | 0 / 323 | 3 / 142 | 0.65% |
| /tools/youtube-competitor-analysis | 3 | 1 / 2,672 | 2 / 286 | 0.10% |
| /blog/youtube-seo-services | 2 | 1 / 8,168 | 1 / 787 | 0.02% |

**West CTR 0.024%. RoW CTR 0.987%. A 41x gap**, reproducing `traffic-reality-check.md`'s 0.025% /
1.046% almost exactly, one month later and on a different window.

**14 of 82 pages earn any click at all.**

*Caveat on totals:* the page×country breakdown accounts for 160 clicks against an unfiltered site
total of 435. GSC suppresses rows below its anonymisation threshold when two dimensions are combined,
so the absolute numbers here understate. The ratios are the reliable part, and they match the July
pull.

### Queries that actually convert

| Query | Clicks | Impressions | Position |
|---|---|---|---|
| youtube rank checker | 17 | 4,994 | 15.2 |
| youtube autocomplete | 16 | 479 | 8.5 |
| youtube video ranking checker | 6 | 636 | 17.8 |
| tag ranking checker | 5 | 321 | 4.8 |
| tags rank checker | 5 | 180 | 4.6 |
| youtube transcript no sign up | 5 | 48 | 7.5 |
| youtube channel ranking check | 5 | 61 | 9.2 |
| youtube channel audit free | 4 | 20 | 21.6 |

Every converting query is tool-intent, and the modifiers that recur are *free*, *no sign up*,
*checker*, *audit*. No informational blog query appears in the click-ranked list at all.

---

## Read

**The premise "where do impressions unlock" does not survive contact with the data. On this domain,
they largely do not.** 129,647 western impressions produced 31 attributed clicks. The unlock is not
a volume problem to be captured; it is a quality-of-demand problem, and the demand that converts is
already visible in small numbers.

Three places where movement converts to clicks, with the mechanism named:

1. **`/tools/youtube-channel-audit` — the best converter on the site at 2.65% CTR, and almost nobody
   sees it.** Its queries sit at positions 21.6 to 36.6 on 20 to 166 impressions. Mechanism: this
   page has *already proven* it converts attention into clicks; it simply has no attention. Rank
   improvement here translates to clicks at a known rate. This is the inverse of the rank-checker
   post, which has attention and has proven it does not convert.

2. **The tag-rank-checker query cluster already converts at positions 3.5 to 10.6.** `tag ranking
   checker`, `tags rank checker`, `tag rank checker`, `youtube tag rank checker`, `youtube tags rank
   checker` together produce 19 clicks. `growth-strategy.md` already has Tag Generator approved as
   the next tool build at 5,400 volume. Mechanism: demand is proven by clicks, not inferred from a
   volume tool, and the positions are already good.

3. **`/blog/best-youtube-autocomplete-keyword-tools` is the only content page with a working CTR
   lever**, demonstrated by this measurement (0.141% → 0.355% at a worse position). Mechanism:
   snippet-level change on a page that already ranks around 10 and already earns clicks.

**Stop:** further on-page or AEO work on `/blog/best-youtube-rank-checker-tools-for-business`. Over
90 days it drew 24,441 western impressions and **zero** western clicks. Three prior projects have now
been scoped from this page's impression count and returned nothing. Its constraint is not
citability, not internal links, and not snippet copy.

**Also unresolved:** sitewide clicks fell 234 → 151 (-35%) in the last 35 days while CTR fell 0.337%
→ 0.239%. Not investigated here. It is the largest single movement in the data.

## Next capture

Re-pull after the recrawl list below is submitted and Google has actually revisited the pages.
**Do not measure again until URL Inspection shows a `lastCrawlTime` later than the fix date** — that
was the flaw in this cycle. Success metric is clicks by country, never impressions.

---

## Recrawl priority list (manual — GSC URL Inspection → Request Indexing, quota ~10/day)

Ranked by defect severity and proven value, **not** by impressions. No public API exists for GSC
submission, so this step is manual by necessity. Run `node scripts/bing-submit.mjs` with the same
URLs afterwards; that part is automatable.

| # | URL | Why | Last crawl |
|---|---|---|---|
| 1 | /blog/ai-tools-for-youtube | **True defect.** Google holds a 404 from a crawl five weeks before the page was published. Never indexed, never had an impression. | 2026-05-19 |
| 2 | /blog/youtube-seo-guide | Pillar page, linked from 8 tool pages. Stalest crawl in the set. Link equity is flowing into a page Google is not indexing. | 2026-05-14 |
| 3 | /blog/how-to-find-youtube-video-ranking-keywords | Was ranking (3,639 impr), deindexed, refreshed 2026-07-19, never recrawled since. The fix is untested. | 2026-06-20 |
| 4 | /blog/youtube-titles-for-business | Crawled-not-indexed since before the fix; received a new tool-page inlink in July. | 2026-05-23 |
| 5 | /youtube-for/shopify | Expanded 760 → 2,105 words on 2026-07-19; never recrawled, so the expansion is unevaluated. | 2026-07-10 |
| 6 | /youtube-vs/webinars | pSEO child. Lowest priority — `traffic-reality-check.md` records pSEO at 162 impressions and 1 click across 53 pages, and says do not expand it. Submit only if quota is spare. | 2026-07-10 |

After submission, verify with `py scripts/gsc_inspect.py <out.csv> <urls...>` and require
`lastCrawlTime` later than the fix date before running any further measurement.

---

## Post-submission recrawl check (2026-08-26, same day)

All six URLs were submitted through GSC URL Inspection → Request Indexing, and to Bing via
`node scripts/bing-submit.mjs` (6 accepted; daily quota moved 100 → 94, confirming the payload
landed rather than just the request succeeding).

Re-inspected within hours. **Three of six were recrawled the same day.**

| URL | Last crawl | Coverage state | Change |
|---|---|---|---|
| /blog/ai-tools-for-youtube | 2026-05-19 → **2026-08-26** | Not found (404) → **Crawled, not indexed** | **404 cleared** |
| /youtube-vs/webinars | 2026-07-10 → **2026-08-26** | Crawled, not indexed → **Submitted and indexed** | **now indexed** |
| /blog/youtube-titles-for-business | 2026-05-23 → **2026-08-26** | Crawled, not indexed | recrawled |
| /blog/youtube-seo-guide | 2026-05-14 | Crawled, not indexed | not yet |
| /blog/how-to-find-youtube-video-ranking-keywords | 2026-06-20 | Crawled, not indexed | not yet |
| /youtube-for/shopify | 2026-07-10 | Crawled, not indexed | not yet |

**The headline defect is resolved.** Google no longer holds `/blog/ai-tools-for-youtube` as a 404.
The page is now a normal not-yet-indexed page rather than one Google believes does not exist.
Indexing is still pending, but the blocking condition is gone.

`/youtube-vs/webinars` went straight to indexed, which is worth noting because it was ranked last
in the queue as a low-value pSEO child. Submission cost is low and outcomes are not predictable from
prior demand.

**Do not re-measure the July indexing fix until the remaining three show a `lastCrawlTime` later
than 2026-07-19.** Two of them have now been stale since May.
