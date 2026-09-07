# CTR fix baseline — youtube-seo-services.md — 2026-09-06

## Current frontmatter (before edits)

- **title:** "YouTube SEO Services: What They Include, What They Cost, and When to DIY"
- **excerpt:** "80% of what YouTube SEO agencies charge for can be done with free tools. Here is exactly what services include, what each tier costs, and how to decide if you need one."
- **metadata.description:** "YouTube SEO services cost $500 to $5,000/month. See what each tier includes, what you can DIY with free tools, and how to evaluate providers."
- **tags:** youtube-seo, youtube-seo-services, youtube-optimization, youtube-marketing
- **publishDate:** 2026-06-25T00:00:00Z (unchanged by this task)
- **faqs (frontmatter, 4 pairs):**
  1. Q: "How much do YouTube SEO services cost?" — A: "YouTube SEO services range from $500 to $5,000 per month. Freelancers charge $500 to $1,500 for per-video optimization. Full-service agencies charge $2,000 to $5,000 for channel-level strategy, keyword research, and ongoing optimization. DIY with free tools costs $0 to $100 per month."
  2. Q: "Can I do YouTube SEO myself without hiring an agency?" — A: "Yes. Keyword research, title optimization, description writing, and tag selection can all be done with free tools. The parts that are genuinely hard to DIY are competitive gap analysis at scale, thumbnail A/B testing with statistical significance, and building topical authority across a large channel."
  3. Q: "How long does it take to see results from YouTube SEO?" — A: "Search-optimized YouTube videos typically start ranking within 2 to 6 weeks for low-competition keywords. Channel-level improvements like topical authority and consistent publishing take 3 to 6 months to show compounding results in search traffic and leads."
  4. Q: "What is the difference between YouTube SEO and regular SEO?" — A: "YouTube SEO optimizes for YouTube's search algorithm using video titles, descriptions, tags, thumbnails, watch time, and engagement signals. Regular SEO optimizes web pages for Google using backlinks, page speed, and text content. Both involve keyword research, but YouTube weighs engagement metrics more heavily than backlinks."

## Live GSC data (pulled 2026-09-06, cross-checked via gsc_query_export.py, gsc_analysis.py, and an ad-hoc page-filtered pull — all against scripts/credentials.json, no auth/timeout errors)

**Page-level, `/blog/youtube-seo-services`:**

| Window | Clicks | Impressions | CTR | Avg. Position |
|---|---|---|---|---|
| 28d | 4 | 5,890 | 0.07% | 13.95 |
| 90d | 7 | 12,310 | 0.06% | **14.87** |
| 180d | 7 | 12,310 | 0.06% | 14.87 (identical to 90d — no data before ~June, consistent with the June 25 publish date) |

**Query-level, filtered to this page, 90 days (72 total distinct queries, top rows):**

| Query | Clicks | Impressions | Position | CTR |
|---|---|---|---|---|
| youtube seo services | 1 | 4,422 | 15.39 | 0.02% |
| youtube seo service | 0 | 2,381 | 16.62 | 0% |
| youtube seo agency | 1 | 1,683 | **10.29** | 0.06% |
| youtube seo meaning | 0 | 595 | 16.59 | 0% |
| what is youtube seo | 0 | 573 | 21.97 | 0% |
| youtube video seo services | 0 | 394 | 18.12 | 0% |
| youtube seo packages | 0 | 220 | 12.45 | 0% |
| how much is it to get a company to seo my youtube | 0 | 126 | 6.97 | 0% |

**Site-wide 28d cross-check (all pages, `gsc_query_export.py`):** "youtube seo services" 0 clicks / 1,870 impr / pos 12.8; "youtube seo service" 0 / 1,020 / 14.8; "youtube seo agency" 0 / 951 / 10.0. Directionally consistent with the page-filtered pull (different window, small numeric drift expected).

## Is 14.85-ish a head-query position or a page-level average?

**Confirmed: page-level average across 72 distinct queries, NOT the position of any single query.** The head term "youtube seo services" itself sits at 15.39 individually, close to but not identical to the page average. The sibling query "youtube seo agency" — which this same page already ranks for and which the CTR fix specifically targets — sits meaningfully better at 10.29 with 1,683 impressions. This matters for scoping the CTR upside: fixing the title/meta for the "agency" angle is reinforcing an already-decent position (10.29), not just chasing the weaker 14-16 range terms. The 14.87 headline number is a blended average dragged down by long-tail queries (e.g. "what is youtube seo" at 21.97), so realistic CTR upside should be modeled per-query, not off the blended average.

## Governance note (context only, not acted on)

`research/publishing_calendar.md` (~lines 773, 782) marks this exact post "KILLED (product-only rule) / do not revisit." The file is nonetheless live, has a valid past publishDate, no draft flag, and is earning the impressions logged above. This tension is not resolved here; flagged for the user in the task summary.
