# Where the first link sits in a B2B YouTube description

Run: 2026-09-18
Script: `research/fold-study-2026-09-18.mjs` (re-runnable)

## Method

Searched YouTube for 5 buyer-intent B2B queries, took the top 10 videos of
each, then read every description through the same parser the extractor tool uses
(`netlify/functions/lib/parsers.js`). "Above the fold" means a character index under
150, which is roughly what YouTube shows before "...more".

Queries: "b2b saas demo", "project management software review", "crm software comparison", "marketing automation tutorial", "how to choose accounting software"

## Result

| | count |
|---|---|
| Videos sampled | 50 |
| With at least one link in the description | 47 |
| With no link at all | 3 |
| **First link below the fold** | **26** |
| **Share of linked descriptions whose first link is below the fold** | **55%** |
| Median character position of the first link | 202 |

## Published claim

"In a sample of 50 B2B videos, 55% of the descriptions that contained a link put
their first link below the fold."
