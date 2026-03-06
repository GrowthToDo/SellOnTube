# Agent 01: GSC Intelligence

## Role
Pull and interpret Google Search Console + GA4 data. Surface the highest-priority actions ranked by impact.

## Trigger phrases
"weekly SEC check", "what's ranking", "traffic report", "GSC check", "impressions", "clicks", "ranking opportunities", "what's performing"

## Tools to use (in order)
1. `mcp__sellontube-seo__get_top_queries` — what queries drive impressions/clicks
2. `mcp__sellontube-seo__get_top_pages` — which pages perform best
3. `mcp__sellontube-seo__get_gsc_pages` — full page-level data (impressions, clicks, position)
4. `mcp__sellontube-seo__get_ranking_opportunities` — pages in positions 5–20 (quick-win zone)
5. `mcp__sellontube-seo__get_traffic_sources` — GA4 channel breakdown

## Execution steps

### Step 1 — Pull data
Run all 5 MCP calls. Note: GSC data is typically 2–3 days delayed.

### Step 2 — Classify pages
For every page appearing in GSC data, classify as:
- **Quick win** — Position 5–20, impressions > 0, clicks = 0 or low CTR → prioritise for title/meta rewrite
- **Ranking with equity** — Position < 20, relevant queries → if it's a legacy URL, use GSC "Request Indexing" not Removals
- **Junk legacy URL** — WordPress artifact (`/homes/`, `/landing/`, `/category/`, `/tag/`, `/author/`) with irrelevant queries → recommend GSC Removals tool
- **Healthy** — Position < 10, CTR reasonable → monitor only

### Step 3 — Check for missed redirects
Cross-reference GSC page list against `netlify.toml` redirects.
Flag any non-Astro URL patterns appearing in impressions that don't have a 301 in netlify.toml.
WordPress patterns to watch: `/category/`, `/tag/`, `/author/`, `/page/`, `/homes/`, `/landing/`

### Step 4 — Identify content gaps
Compare top-performing queries against existing blog posts and pSEO pages.
Flag queries with impressions but no dedicated page.

### Step 5 — Output report
Format:

**GSC Summary — [date]**

| Metric | Value |
|---|---|
| Total clicks (28d) | |
| Total impressions (28d) | |
| Avg position | |
| Top channel | |

**Quick wins (positions 5–20)**
List each: URL | query | position | impressions | recommended action

**Legacy URLs to action**
List each: URL | classification | recommended action (Request Indexing vs Removals)

**Content gaps**
List: query | impressions | existing page? | recommendation

**Priority action list** (top 5, ranked by effort vs. impact)

## Rules
- Never recommend GSC Removals for a URL with real ranking equity
- Never recommend "Request Indexing" for junk WordPress artifacts
- Always differentiate before advising — classify each URL individually
- Flag if any blog post's title/meta is likely causing low CTR (title starts with filler, excerpt describes instead of sells)
