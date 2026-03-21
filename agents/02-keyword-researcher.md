# Agent 02: Keyword Researcher

## Role
Select the best keywords for a given topic or cluster from the master keyword CSV. Prevent cannibalization. Rank picks by opportunity.

## Trigger phrases
"find keywords for X", "what should I write about", "keyword ideas", "which keywords", "best keyword for"

## Source files
- `research/keywords/sot_master.csv` — curated keywords. **SINGLE SOURCE OF TRUTH.** Columns: rank, keyword, search_volume, search_volume_live, kd_real, tier, intent, cluster, content_type (blog|tool|pseo_for|pseo_vs), target_slug, status (live|planned|not-started), priority_score. Use ONLY this file for content decisions. Never use `master_keywords_cleaned.csv` directly.
  - `kd_real` — real keyword difficulty from DataForSEO (backlink-based). More accurate than `keyword_difficulty` (GKP-based). Use `kd_real` for all difficulty decisions.
  - `tier` — pre-calculated: `winnable` (KD≤30), `stretch` (KD 31–45), `avoid` (KD>45), `pseo` (pSEO pages). Always filter to `winnable` first.
  - `search_volume_live` — live US search volume from DataForSEO. Use this over `search_volume` when available.
- `research/keywords/cluster_summary.csv` — 16 clusters ranked by avg priority.
- `src/data/post/` — all existing blog posts (check publishDate frontmatter for title + slug to avoid cannibalization)
- `src/data/niches.ts` + `src/data/comparisons.ts` — pSEO pages (avoid cannibalization here too)

## Execution steps

### Step 1 — Understand the request
Identify: target cluster (or infer from topic), search intent (informational / commercial / transactional), ICP angle (B2B founders, SaaS operators, service businesses — NOT general creators).

### Step 2 — Filter the CSV
Read `sot_master.csv`. Filter in this exact order:
1. `status = not-started` — MANDATORY. Never recommend keywords with status `live` or `planned`.
2. `tier = winnable` — MANDATORY for blog/tool keywords. Never recommend `avoid` tier keywords. Only escalate to `stretch` if the user explicitly asks for higher-competition targets and the site has grown.
3. Matching cluster or topic
4. `search_intent` matches the content goal
5. Sort by `priority_score` descending — this is now calculated using live volume + real KD

### Step 2.5 — Verify live metrics (DataForSEO)
For the top 5 candidates from Step 2, call `dfs_keyword_metrics` with those keywords. Compare the live search_volume and cpc against the CSV values. If a keyword's live volume differs by more than 30% from the CSV, use the live value and flag it in the output table with "(live data)". Skip this step only if the DataForSEO MCP tool is unavailable.

### Step 3 — Cannibalization check
For each candidate keyword, check: does any existing blog post, pSEO page, or scheduled post already target this keyword or a near-synonym? If yes, exclude or flag as "already covered."

### Step 4 — ICP filter
Remove keywords that signal creator/consumer intent (e.g., "how to get more subscribers", "best gaming channels") unless the angle is explicitly B2B (e.g., "YouTube for SaaS lead generation"). SellonTube's ICP is B2B — founders evaluating YouTube for acquisition, not hobbyist creators.

### Step 5 — Output
Return top 5–10 keywords ranked by opportunity:

| # | Keyword | Search Volume | KD | CPC | Intent | Priority Score | Notes |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |

Then: **Recommended primary keyword** (with reasoning) and **2–3 supporting/LSI keywords** to include in the post.

## Rules
- Never recommend a keyword already targeted by an existing post or pSEO page
- Always check ICP fit — creator-focused keywords are low-value for SellonTube
- If the cluster_summary shows a cluster with high avg priority but low blog post coverage, flag it as a content gap
- If no good keywords exist in the CSV for the requested topic, say so and suggest the closest alternative cluster
