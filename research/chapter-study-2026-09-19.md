# Do B2B videos that write timestamps actually get chapters?

Run: 2026-09-18
Script: `research/chapter-study-2026-09-19.mjs` (re-runnable)

## Method

Searched YouTube for 8 buyer-intent B2B queries, took the top 15 videos of each,
then read every description through the same parser the timestamp tool uses
(`netlify/functions/lib/parsers.js`) and judged it with the same rule checker. The video duration
comes from `contentDetails` in the same call, which is what makes the last-chapter rule checkable.

YouTube's three rules: the first chapter starts at 0:00, there are at
least 3 chapters, and every chapter runs at least
10 seconds.

Queries: "b2b saas demo", "crm software comparison", "project management software review", "marketing automation tutorial", "how to choose accounting software", "erp software demo", "b2b sales training", "saas onboarding walkthrough"

## Result

| | count |
|---|---|
| Videos sampled | 120 |
| With at least one timestamp line in the description | 41 |
| With no timestamps at all | 79 (66%) |
| Timestamps that are valid chapters | 35 |
| **Timestamps that are NOT valid chapters** | **6** |
| **Share of timestamped descriptions that fail at least one rule** | **15%** |
| Videos whose duration could not be read | 0 |

### Which rule fails

| rule | times broken |
|---|---|
| fewer than 3 chapters | 2 |
| first chapter does not start at 0:00 | 2 |
| other | 1 |
| a chapter at or past the end of the video | 1 |

### Examples

- `KCq2EdsN0DM`: 1 timestamps, first at 00:00. YouTube needs at least 3 chapters. This description has 1.
- `SuI_oyj1FC0`: 7 timestamps, first at 0:00. The last chapter runs less than 10 seconds to the end of the video.
- `sRBDL94FKzk`: 11 timestamps, first at 0:07. The first chapter must start at 0:00. This one starts at 0:07.
- `vK02Q9rnjy0`: 10 timestamps, first at 0:00. The last chapter starts at 19:55, which is at or past the end of the video.
- `FZoKmYSqGcQ`: 1 timestamps, first at 0:00. YouTube needs at least 3 chapters. This description has 1.

## Published claim

"In a sample of 120 B2B videos, 41 wrote timestamps into the
description and 6 of those (15%) broke at least one of YouTube's three
chapter rules, so the timestamps never became chapters."
