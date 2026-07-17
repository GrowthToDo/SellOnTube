# Internal Linking Map

> Living document. Update every time a post publishes or an existing post is edited.
> Agent 04 must check this before finalising any draft. Agent 05 verifies at least 2 internal links are present.

## 2026-07-14 overhaul

A full internal-linking pass fixed a template bug (`youtube-vs/[slug].astro` was hardcoding the same 4 "related comparisons" on every page instead of computing per-page siblings) and added ~280 contextual links across 84 files (blog posts, pSEO pages, tool pages). Full link-by-link record, before/after audit numbers, and follow-up notes: `research/aeo/internal-linking-phase2-report.md`. Final audit snapshot: `research/aeo/internal-linking-final-audit-2026-07-14.json`.

**New mechanism (structural change, know this before adding future links):** `src/data/niches.ts`'s `Niche` interface gained an optional `relatedLinks?: { text: string; href: string }[]` field, mirroring the pre-existing `Comparison.relatedLinks` field in `comparisons.ts`. Both are now populated for every entry (30 niches, 21 comparisons) and rendered via a "Related Resources" block in `youtube-for/[slug].astro` / `youtube-vs/[slug].astro`. When adding a new niche or comparison entry, populate this field: 2-4 genuinely relevant links, at least one to a `/tools/*` page, distinct anchor phrasing from what's already used for that target elsewhere on the site (check `research/aeo/internal-linking-phase2-report.md` before reusing a phrase: several money pages already have anchors near or at the diversity cap).

**Rule reinforced by this pass, apply going forward:** no single target URL should accumulate the same exact-match anchor phrase from more than ~3 source pages. This was the single most time-consuming class of defect in the 2026-07-14 pass (caught across 4 rounds of review). Always check existing anchor usage for a target before reusing a phrase, especially for popular money pages (`/tools/youtube-roi-calculator`, `/tools/youtube-seo-tool`, `/blog/youtube-marketing-strategy`, etc., which already carry significant pre-existing anchor concentration this pass did not retroactively clean up).

---

## Blog → Tool Links

| Blog post slug | Tool linked | Anchor text | Section |
|---|---|---|---|
| youtube-marketing-roi | youtube-roi-calculator | YouTube ROI calculator | ROI formula section |
| best-youtube-video-ideas-generators-for-businesses | youtube-video-ideas-evaluator | YouTube topic evaluator | Product section |
| youtube-video-ideas-generator-for-b2b | youtube-video-ideas-generator | YouTube Video Ideas Generator | Patterns section (mid-post) |
| youtube-video-ideas-generator-for-b2b | youtube-topic-evaluator | YouTube Topic Evaluator | Validation section |
| youtube-keyword-research | youtube-autocomplete-keywords | YouTube autocomplete keyword tool | Step 2 + FAQ |
| youtube-keyword-research | youtube-seo-tool | YouTube SEO Tool | Tools section |
| youtube-ads-for-b2b-lead-generation | youtube-roi-calculator | YouTube ROI Calculator | ROI comparison step (Step 4) |
| youtube-ads-for-b2b-lead-generation | youtube-competitor-analysis | SellonTube Competitor Analysis tool | Competitor ads audit section |

---

## Blog → pSEO Links

| Blog post slug | pSEO page | Anchor text | Section |
|---|---|---|---|
| youtube-marketing-b2b | /youtube-for/b2b-companies | YouTube for B2B companies | (add when confirmed) |
| youtube-ads-for-b2b-lead-generation | /youtube-vs/paid-ads | YouTube vs Paid Ads: Real ROI Data After 12 Months | vs LinkedIn/Search section |

---

## Blog → Blog Links

| Source slug | Target slug | Anchor text | Topic relationship |
|---|---|---|---|
| youtube-marketing-strategy | youtube-marketing-roi | YouTube marketing ROI | ROI measurement |
| youtube-ads-for-b2b-lead-generation | youtube-vs-paid-ads-b2b | YouTube vs Paid Ads for B2B: Cost-Per-Lead Comparison | vs LinkedIn/Search section |
| youtube-ads-for-b2b-lead-generation | youtube-lead-generation | YouTube lead generation guide | FAQ: ads alone vs organic |
| youtube-marketing-roi | youtube-ads-for-b2b-lead-generation | whether YouTube Ads actually generate qualified B2B leads | paid-ads cost paragraph |
| youtube-roi-for-saas | youtube-ads-for-b2b-lead-generation | YouTube Ads for B2B: Cost, ROI & Does It Work | Read more callout |
| youtube-vs-paid-ads-b2b | youtube-ads-for-b2b-lead-generation | YouTube Ads for B2B: Cost, ROI & Does It Work | LinkedIn Ads paragraph |
| youtube-marketing-b2b | youtube-marketing-strategy | YouTube marketing strategy | Strategy reference |
| youtube-video-ideas-generator-for-b2b | youtube-vs-blog-shopify-app-case-study | 3.25x More Conversions | Case studies section |
| youtube-video-ideas-generator-for-b2b | best-youtube-video-ideas-generators-for-businesses | The 14 Best YouTube Video Ideas Generators | After patterns table |
| youtube-keyword-research | youtube-seo-guide | YouTube SEO: Rank Business Videos on Page 1 (2026) | After competition analysis section |
| youtube-keyword-research | youtube-marketing-strategy | YouTube Marketing Strategy: 6-Step Framework | After 5-step process |
| youtube-keyword-research | youtube-marketing-roi | YouTube Marketing ROI: 3.25x More Conversions Than Blogging | After measurement section |
| youtube-keyword-research | compounding-effect-four-videos-a-month | how 4 videos a month compound into a pipeline | Search impression share section |
| youtube-keyword-research | best-youtube-seo-tools-for-business | roundup of YouTube SEO tools for business channels | Tools section |

---

## Unlinked Opportunities

All 3 tools previously listed here (YouTube Transcript Generator, YouTube Video Ideas Evaluator, YouTube ROI Calculator) were confirmed linked as of the 2026-07-14 pass. Resolved, removed from this table. As of that pass: 0 in-scope orphan pages, 0 dead-ends, 0 pages missing a `/tools/*` link, across blog, pSEO (`youtube-for`, `youtube-vs`), tools, hub pages, and core static pages. Re-run `python scripts/audit_internal_links.py --dist dist` after `npm run build` to check current state. It crawls the real built HTML rather than guessing from source, so it catches what manual review misses (e.g. dynamically-rendered links).

---

## Notes

- Each new post must add at least 2 rows to this table on publish
- Review this map monthly — look for posts that should cross-link but don't
- When a new tool goes live, scan all blog posts for natural insertion points and add links
- Before adding a link to a popular money page, check `research/aeo/internal-linking-phase2-report.md` for existing anchor phrasing to that target. Don't reuse an exact phrase already at or near 3 sources
