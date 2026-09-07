# Rank Checker/Tracker CTR + Keyword-Intent Fix — 2026-09-06

## Trigger

GSC found a "rank tracker" phrasing cluster and a CTR gap on `/tools/youtube-ranking-checker`:

| Query | Impressions | Position | Clicks |
|---|---|---|---|
| youtube rank tracker | 6,059 | 27.3 | (part of ~2 total across cluster) |
| video rank tracker | 2,889 | 29.6 | (part of ~2 total across cluster) |
| full "tracker" cluster (~170 variants) | 47,239 | 22-47 | 2 |
| youtube rank checker (head term) | 5,342 | 14.6 | CTR 0.34% |

US traffic (65% of total impressions) drives most of the tracker-cluster volume, converting at 0.05% CTR.

## Caveat carried forward from `mistakes-lessons.md` (2026-07-21, same URL)

A prior GSC diagnosis on this exact page found "rank tracker" style query impressions are largely bot traffic: machine-shaped query permutations, country distribution matching datacenter geography, and zero real clicks in US/GBR/DNK despite tens of thousands of impressions. Real clicks on this page came from IND/PAK/AUS. **This means the 47,239-impression tracker opportunity above should not be read as 47,239 potential human clicks.** Any recheck of this fix must pull clicks-by-country, not raw impressions, before crediting the tracker-language change with a lift. Proceeding with the fix regardless because the cost is low (secondary keyword only) and the real prize is the pos-14.6 checker-term CTR fix, which is unaffected by the bot-traffic question.

## Verified baseline (before edit, re-counted against live file, not assumed)

- `metadata.title` (line 9): `YouTube Rank Checker: Free Video Keyword Ranking Tool` (53 chars; 66 rendered with ` | SellOnTube` suffix from `src/config.yaml` line 13)
- `metadata.description` (lines 10-11): `Free YouTube rank checker. Enter a keyword and channel to see your exact position in the top 20, plus competing videos, then track your rankings over time.` (155 chars, at style-guide ceiling)
- H1 (line 67): `YouTube Rank Checker`
- H2s (6, lines 300/314/352/390/401/431): Why checking your YouTube rank matters for businesses / What the YouTube rank checker shows you / How to improve your YouTube video rank / How to track your YouTube rankings over time / How YouTube tags affect your video ranking / Frequently asked questions
- JSON-LD: 3 inline blocks (BreadcrumbList, WebApplication, FAQPage). WebApplication `name`: `SellonTube YouTube Ranking Checker` (lowercase-o casing drift vs. brand `SellOnTube`, pre-existing, not fixed here). WebApplication `description` already diverged from `metadata.description` before this edit. FAQPage: 9 Q&A pairs, none used "tracker."
- Only real "tracker" content pre-edit: meta description tail, and 2 mentions in the "How to track..." body (manual rank tracker / paid YouTube rank trackers) — added per the 2026-06-30 lesson to describe the tool's manual-tracking use honestly.
- `src/pages/tools/index.astro` card (lines 52-59): name "YouTube Rank Checker", tagline "Check where your video ranks for any keyword", no "tracker" mention.
- Cannibalization: "tracker" appears in `src/data/post/` 53 times across 6 files (best-youtube-rank-checker-tools-for-business.md: 39; 4 more files: 1-6 each). None of those files' titles/metas target "rank tracker" as a primary keyword — checked before editing.

## Changes made (see git diff for exact wording)

1. `metadata.title` → `YouTube Rank Checker & Tracker: See Your Exact Rank` (51 chars field, 64 rendered)
2. `metadata.description` → full rewrite, front-loads "tracker," keeps top-20 + real 3-free-checks/no-signup claim (142 chars)
3. H1 unchanged
4. Hero subheading: added trailing clause "...so you can check it once or track it every week."
5. Hero badges: added third pill "Free rank tracker"
6. New H3 "Free rank tracker vs. paid options" inside the existing "How to track" H2 section, explicitly framed as manual, links to `/blog/best-youtube-rank-checker-tools-for-business`
7. New FAQ pair "Is this a YouTube rank tracker or a rank checker?" added to both `faqSchema.mainEntity` and the visible FAQ HTML block
8. WebApplication JSON-LD: added `alternateName: "YouTube Rank Tracker"`, updated `description` to mention manual re-run-weekly tracking, added `featureList` with "Manual rank tracking"
9. No aggregateRating/Review schema added
10. `src/pages/tools/index.astro` card updated to match: name, tagline, description

## Recheck plan (~3 weeks out, ~2026-09-27)

Pull GSC for this URL, split by country. Compare:
- "youtube rank checker" CTR at ~pos 14-15 (target: meaningfully above 0.34%, this is the real signal since head-term traffic is not bot-suspected)
- "tracker" cluster clicks specifically from non-bot-suspected countries (exclude US/GBR/DNK-heavy bot pattern from the 2026-07-21 lesson unless click behavior looks human this time)
- Any ranking movement for "youtube rank tracker" / "video rank tracker" queries specifically
