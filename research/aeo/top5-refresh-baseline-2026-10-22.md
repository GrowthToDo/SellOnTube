# Top-5 AI-citability refresh: baseline (2026-10-22)

Source: live GSC API, `sc-domain:sellontube.com`, dataState final, latest day 2026-10-19.
Windows: 90d = 2026-07-22..10-19; 28d = 2026-09-22..10-19; prior 28d = 2026-08-25..09-21.
Re-read at 28 days after recrawl (~2026-11-20) and 90 days (~2027-01-20), same query rows,
bot-filtered. Judge by clicks and GA4 sessions, never impressions (SEO_CONTEXT.md bot rule).

## Why these 5 (and why not a mode 07 refresh)

Picked by human clicks + position 4-20 upside. None passed the mode 07 decay gate on GSC alone
(demand drops, not ranking decay; youtube-business-plan borderline). Owner chose a mode 09
AI-citability pass on all 5, with a full rewrite only where stale facts or a better competitor
page are confirmed.

## Per-post baseline

| Post | 90d clicks / impr / pos | 28d clicks / impr / pos | Primary query rows (90d) | Likely human share |
|---|---|---|---|---|
| youtube-marketing-case-studies | 17 / 7,918 / 15.4 | 8 / 1,411 / 14.3 | "youtube marketing case study" 2,101 @15.9 (1c); "b2b youtube case studies" 59 @4.0 | ~75-85% human, 12-20% ICP geo |
| best-youtube-autocomplete-keyword-tools | 11 / 2,211 / 13.7 | 2 / 224 / 12.7 | "youtube autocomplete" 100 @9.2 (3c); "find great keywords using youtube autocomplete" 50 @7.7 (2c) | ~50-65% |
| best-youtube-transcript-generators | 6 / 1,521 / 12.6 | 2 / 198 / 15.3 | "best youtube transcript generator" 142 @11.6 (5c) | ~50-70% |
| youtube-business-plan | 3 / 984 / 10.7 | 0 / 253 / 10.1 | "youtube business plan" 326 @11.5 (1c), 28d pos 12.6 vs 7.8 prior | ~80% |
| youtube-script-examples-business | 5 / 405 / 9.1 | 4 / 226 / 8.6 | "youtube script writing examples" 6 @8.3 (1c) | ~40-60% |

## Excluded, with reason

- youtube-seo-services: lost rankings 2026-09-15/16 (pos ~11 to ~39), 0 clicks on ~4.4k impr
  before that, services intent conflicts with tools-first strategy.
- youtube-script-writing-guide: 8,667 of 8,705 impr from one query, 100% US desktop, 0 clicks,
  flat daily plateau. Rank tracker, not people. Needs a prune-or-merge decision.
- best-youtube-rank-checker-tools-for-business: 18k impr at pos 38.6. Rebuild, not refresh.

## Site context at baseline

- Site 28d: 85 clicks / 21,042 impr (prior 28d 101 / 47,388). 97% of the lost impressions came
  from queries with 0 clicks in the prior window. Breaks on 2026-09-16/17 (no announced update)
  and 2026-09-25 (September 2026 spam update start).
- FAQPage JSON-LD removed site-wide on 2026-10-15 (`605c8d8`), not yet recrawled on these posts.
  Any change after 10-15 is confounded with it.
- AI citations: the last Bing AI baseline (2026-06-24) shows 1 cited page,
  `/blog/how-to-find-youtube-autocomplete-keywords`, 6 citations. None of these 5 were cited.
