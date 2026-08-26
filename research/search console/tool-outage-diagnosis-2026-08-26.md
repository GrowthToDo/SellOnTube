# Tool Outage — Diagnosis of the Click Decline (2026-08-26)

**Source:** `sc-domain:sellontube.com`, live GSC Search Analytics API (data through 2026-08-23) plus live HTTP probes of production endpoints.
**Method:** weekly click series Apr-Aug to find the shape; page/query/country decomposition peak vs now; live POST to every tool API; TLS-level probe of the vendor host; git history of the affected pages.
**Scripts:** `scripts/gsc_corpus.py`, `scripts/health-check-tools.mjs`.
**Branch:** `fix/tool-outage-and-health-checks`.

---

## Headline

**Two tools have been returning HTTP 500 to every visitor since roughly 2026-07-08.** The cause is a
dead third-party vendor. The cost is the single largest movement in the site's search data.

`/tools/youtube-transcript-generator` alone accounts for **-39 of the site's -62 click decline**.
Add `/tools/youtube-description-generator` and two pages explain **79%** of it.

## Correction to the earlier framing

An earlier note called this a "-35% sitewide decline" and flagged it as the largest unexplained
movement. That framing was wrong in two ways, and both are corrected here.

1. **It compared a peak window against a trough.** The weekly series shows growth all spring, a peak
   of **64 clicks** in the week of 2026-07-01, then decay.
2. **The recent trend is recovery, not decline.** The last four weekly buckets read 23, 25, 28, 33.
   The final bucket covers only five days (08-19 to 08-23), so the true current rate is higher again.

The site is not in a general decline. Two specific pages broke.

### Weekly clicks (7-day buckets)

```
2026-05-27    19   ###########
2026-06-03    14   ########
2026-06-10    37   #####################
2026-06-17    44   #########################
2026-06-24    43   ########################
2026-07-01    64   ####################################   <- peak
2026-07-08    44   #########################              <- outage begins
2026-07-15    30   #################
2026-07-22    27   ###############
2026-07-29    23   #############                          <- trough
2026-08-05    25   ##############
2026-08-12    28   ################
2026-08-19    33   ###################                    <- 5 days only
```

## Decomposition: peak (06-24..07-14) vs now (08-03..08-23), 21 days each

| Page | Clicks | Impressions | Position |
|---|---|---|---|
| **/tools/youtube-transcript-generator** | 41 → 2 (**-39**) | 2,720 → 298 | **13.4 → 41.3** |
| /tools/youtube-description-generator | 11 → 1 (-10) | 1,297 → 145 | 19.8 → 34.4 |
| /tools/youtube-seo-tool | 4 → 0 (-4) | 255 → 1,056 | 23.0 → 30.9 |
| /tools/youtube-roi-calculator | 3 → 0 | 276 → 96 | 10.8 → 16.2 |
| (all pages) | 152 → 90 (**-62**) | | |

The transcript tool's entire query cluster fell from page 1 to page 6-8:

| Query | Position |
|---|---|
| free youtube transcript generator | 12.9 → **67.4** |
| youtube transcript generator ai | 14.0 → **61.0** |
| youtube transcript generator free online no sign up | 7.5 → **34.5** |
| free youtube transcript generator no sign up | 7.4 → 14.0 |
| youtube transcript no sign up | 6.5 → 9.0 |

Transcript queries overall: **160 queries / 975 impressions** at peak, **63 queries / 164
impressions** now.

## Root cause, traced end to end

**1. The vendor is dead.** `api.datafetchapi.com` resolves to 49.12.39.61 (Hetzner) and accepts a
TCP connection, but the **TLS handshake is rejected with a fatal alert**
(`SEC_E_ILLEGAL_MESSAGE`). That happens before any API key is presented, so this is not auth, not
quota, and not billing at the request level.

**2. `fetch()` therefore throws** rather than returning a non-ok response.

**3. The throw hit a catch-all that returned 500.** Each affected function already returned a
correct **503** for `!apiRes.ok`, but a thrown fetch bypassed that branch entirely.

Live probes, 2026-08-26:

```
POST /api/get-transcript    -> 500  (4 of 4 test videos)
POST /api/youtube-seo-tool  -> 500  {"detail":"fetch failed"}
POST /api/generate-tags     -> 200
POST /api/channel-audit     -> 200
POST /api/youtube-rank-check-> 200
POST /api/cluster-keywords  -> 200
```

### What was ruled out

| Hypothesis | Verdict |
|---|---|
| Page deindexed | No. URL Inspection: indexed, last crawled 2026-08-14. |
| Page down or slow | No. HTTP 200 in ~1s. |
| Missing `LF_YOUTUBE_KEY` | No. Invalid input returns a clean 400, which only executes *past* the key check. |
| Cannibalisation from `transcript.sellontube.com` | No. The subdomain is dead (no response). |
| A content change we shipped | No. Nothing touched the tool between the peak and the drop. The email gate has existed since 2026-04-18 and the page ranked fine with it. |
| Google algorithm update | Not needed to explain it. A tool returning 500 to every visitor is sufficient. |

**Four functions consume this vendor:** `get-transcript`, `youtube-seo-tool`, `generate-tags`,
`generate-description`. The latter two survive because their DataFetch call is wrapped in its own
try and treated as non-fatal. The two that hard-fail are exactly the two that went to 500.

## Why nobody noticed for seven weeks

Nothing in the repo checked whether the tools ran.

- `.github/workflows/actions.yaml` — builds the site. Never invokes a function.
- `.github/workflows/daily-deploy.yaml` — fires a Netlify build hook, does not inspect the result.
- `scripts/validate-build.js` — static checks on `dist/`: links, sitemap, draft leaks, images.

All of it verifies that the site *builds*, none of it that the site *works*. There was no uptime
check, no synthetic test, no health endpoint, and no alerting of any kind.

The failure was also invisible in the UI. The tool page special-cased only HTTP 429; 400, 500 and
503 all rendered the same small red message under the URL field, with `aria-invalid="true"` set on
the input. A total backend outage looked exactly like the user mistyping a link.

## Fixes shipped on this branch

1. **`netlify/functions/lib/upstream-error.ts`** — classifies a thrown error as upstream
   (DNS/TLS/refused/timeout, including undici's `TypeError: fetch failed`) versus our own fault, and
   returns 503 or 500 accordingly. Deliberately narrow: a genuine `TypeError` in our own code still
   reports 500, so real bugs are not masked.
2. **Swept 12 functions plus the `astro.config.ts` dev proxy.** Every catch-all that could report an
   upstream failure as 500 now returns 503. Also fixed `generate-script`, whose `DOMException` check
   never matched undici's `TimeoutError`, so Gemini timeouts were reported as 500.
3. **Honest failure state** on the transcript tool: a 503 now renders a distinct notice that says
   the service is unavailable and that nothing is wrong with the user's link, instead of a field
   error blaming their input.
4. **`scripts/health-check-tools.mjs` + `.github/workflows/tool-health.yaml`** — daily check of
   seven endpoints with real payloads.

## What is NOT fixed

**The transcript tool still does not produce transcripts.** It now fails honestly with a 503 instead
of a misleading 500, but it needs a working data source. Sathya is checking the datafetchapi
account to determine whether the subscription lapsed or the service shut down. Vendor replacement
was explicitly out of scope for this pass.

`/tools/youtube-description-generator` lost 10 clicks and 15 ranking positions while its function
still returns 200. Its decline is not explained by this outage and needs separate diagnosis.

## Recovery expectation

Rankings do not return until the tool works. Nothing else moves them: this is not a citability,
internal-link, or snippet problem. Once a working data source is in place, re-run
`scripts/health-check-tools.mjs` to confirm, then re-measure the query cluster against the positions
recorded above.
