Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `archive/commands/brief.md`, `draft.md`, `refresh.md`, `content-plan.md` (moved from
`.claude/commands/` on 2026-10-15, ranges below are their line numbers); `agents/02-keyword-researcher.md`
L8-32; `agents/04-blog-writer.md` L187-196, L279, L288-292 (numbering after the 2026-10-15 header); `research/keywords/sot_master.csv` L1.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ". Exception:
where a line greps for the em dash character itself (`refresh.md` L20, `agents/04-blog-writer.md`
L289), that character is written as `<U+2014>`.

# Blog pipeline notes (the retired /brief, /draft, /refresh, /content-plan commands)

The four slash commands are archived. Blog work now runs through the global `seo-content-system`
skill: mode 02 (topic research), 03 (brief), 04 (write), 05 (QA and ship), 07 (refresh), with the
rules in `_shared/seo-content-framework/reference/post-rules.md` (cited by ID below, FW = that
framework folder). This file keeps the SellonTube-only parts of the commands, and the map below
shows where every command step now lives. Project overrides and resolved flow changes:
`SEO_CONTEXT.md`.

Notes added for this kit (not in the sources):

- `sot_master.csv` header as of 2026-10-15 (L1): `rank, keyword, search_volume, cpc_inr,
  keyword_difficulty, intent, cluster, content_type, target_slug, status, source, priority_score,
  search_volume_live, cpc_usd_live, volume_refreshed_at, kd_real, tier`. The column list in
  `agents/02-keyword-researcher.md` L10 omits `cpc_inr`, `keyword_difficulty`, `source`,
  `cpc_usd_live` and `volume_refreshed_at`, and Step 2 filter 4 names `search_intent` where the
  file has `intent`.
- DataForSEO volumes, KD and `tier` are paid data, allowed as labelled and optional (TOP-13, R-11,
  `SEO_CONTEXT.md` Overrides). `tier` and `priority_score` predate the bot correction
  (`SEO_CONTEXT.md` Gaps found).
- Cadence lines below ("up to 5/week", "1/week") are not rulings: see `SEO_CONTEXT.md` OPEN 3.
  Impression-led triggers below ("rising impressions but low CTR") are forbidden by the bot rule:
  OPEN 4.

## Where every command step went

Destination key: "mode NN step N" = `FW/workflows/NN-*.md`; IDs = `post-rules.md`; "SK" = an
excerpt in this file; "SEO_CONTEXT" = a recorded override, resolved conflict or open decision.

### `/brief` (brief.md)

| Step (quoted) | Global home | Site part |
|---|---|---|
| Input: "Keyword or topic from user"; "Optional: uploaded Ahrefs data" | mode 03 Inputs (picked topic from mode 02); TOP-13 (paid export labelled, optional) | none |
| 1 "Validate keyword in sot_master.csv" | mode 02 step 11 (five gates), mode 03 step 1 ("Re-check the gates, now") | SK: CSV path, `status`/`tier` filter |
| 2 "Gather SERP intelligence" | mode 03 step 1 (SERP top 10) and step 4 (BRF-03 SERP table, ONP-10 snippet/PAA/AIO); GSC variants: mode 03 Inputs (latest `gsc-*.md`), mode 01 | SK: `dfs_serp_results`, `dfs_keyword_suggestions`, `get_top_queries` (paid/MCP, optional, R-11) |
| 3 "Cannibalization check" | mode 03 step 2 (TOP-07, TOP-08) | SK: `src/data/post/`, `niches.ts`, `comparisons.ts` |
| 4 "Fill the content brief" | mode 03 step 3 (BRF-01, BRF-02; ICP angle = TOP-03/TOP-04), step 10 (LNK-01 to LNK-06), step 11 (title); target word count dropped (STR-07, R-04) | SK: `docs/templates/content-brief-template.md`, linking map, `src/pages/tools/`; publish date and cadence: SEO_CONTEXT OPEN 3 |
| 5 "Determine coverage level" | STR-07 (R-04): depth follows the SERP; CDF tiers are guidance only | `content-depth-framework.md` stays an ST doc |
| 6 "Output the completed brief" | mode 03 Checkpoint | none |
| 7 "Human Review Checklist" | ICP angle: TOP-03, TOP-04; secondaries fit: ONP-11, TOP-05; differentiation: TOP-09 and mode 03 step 3 gap sentence; live link targets: LNK-02, mode 03 step 10; cadence: SEO_CONTEXT OPEN 3 | SK: checklist text |
| "STOP. Wait for user approval before proceeding to outline or draft." | mode 03 Checkpoint; the outline is now part of the brief (BRF-06). SEO_CONTEXT resolved conflict | none |
| "Data source rules" | TOP-05, TOP-13 ("Never invent a position, volume or rival figure"), R-11 | SK: `sot_master.csv` as keyword SSOT |

### `/draft` (draft.md)

| Step (quoted) | Global home | Site part |
|---|---|---|
| Input: "An approved content brief ... If no brief exists, run `/brief` first" | BRF-01; mode 04 "Don't use when" (no approved brief: run mode 03) | none |
| 1 "Load writing standards" | mode 04 Inputs ("One live post on the same site as the formatting reference") | SK: the ST reading list (`style-guide.md` ... `docs/icp.md`) |
| 2 "Produce outline (Agent 04 Phase 1)" + "STOP - show outline" | BRF-06 inside mode 03; approval at the mode 03 Checkpoint. SEO_CONTEXT resolved conflict (outline folds into the brief) | `agents/04-blog-writer.md` Phase 1 stays as ST detail |
| 3 "Write full draft (Agent 04 Phase 2)" | mode 04 steps 8-30: takeaways STR-04, TOC step 13, Quick Answer STR-01/AIC-01, FAQ ONP-07/ONP-08, sources LNK-07 (R-20); links LNK-04 | SK: frontmatter, "action box" (`brand-visuals.md` "What to Do This Week"), author (SEO_CONTEXT OPEN 8); link minimum: SEO_CONTEXT override (>=4 incl. one `/tools/`) |
| 4 "Create featured image SVG (Agent 04 Phase 3.5)" | VIS-18 (R-03): raster og:image | SK: `brand-visuals.md` L179+ spec, exported to PNG/JPG (SEO_CONTEXT OPEN 7, decided 2026-10-15) |
| 5 "Anti-AI pass (Agent 04 Phase 2.5)" | COPY-10, mode 04 step 32 (`humanizer`) | none |
| 6 "Internal linking (Agent 04 Phase 3.6)" | mode 04 step 27 (LNK-01 to LNK-04), LNK-05 | SK: update `docs/templates/internal-linking-map.md` |
| 7 "Auto-QA (Agent 04 Phase 3 → Agent 05)" ... "Only surface to user after QA passes." | draft run at mode 04 step 31-33 (check_post hook, run record); final QA in mode 05. Flow change: the draft is shown at the mode 04 Checkpoint before final QA. SEO_CONTEXT resolved conflict | `agents/05-content-qa.md` keeps ST-only checks |
| 8 "Human Review Checklist" | intro: STR-03; placeholders: BLD-05; ICP test: STR-06, TOP-04; CTA specific: CTA-04; "Ready to commit?": mode 05 step 18, route 3 | SK: checklist text; commit approvals: `deploy.md` |
| "Data source rules" incl. "[NEEDS DATA]" | CLM-01, TOP-13, BLD-05 (placeholder must not ship) | none |

### `/refresh` (refresh.md)

| Step (quoted) | Global home | Site part |
|---|---|---|
| Input: "Blog post slug or URL" | mode 07 Inputs | none |
| 1 "Read the current post in full" | mode 07 step 4 ("Read the post whole") | `src/data/post/` path (SK) |
| 2 "Run the pre-update audit" | EDT-08 (frontmatter, feature image path, FAQ, dash count, link count); COPY-01 [auto]; LNK-04 | SK: `.mdx` rename (site style, R-29), ">= 4" links: SEO_CONTEXT override |
| 3 "Gather current performance signals" | mode 07 steps 1 and 3 (GSC per-URL query rows, bot check), steps 6-7 (SERP read); positions 5-20: mode 07 triggers, mode 06 | SK: `get_top_queries`, `get_ranking_opportunities`, `dfs_serp_results` |
| 4 "Gap analysis" | mode 07 steps 9-12 (gap tiers, stale facts, CTA path); QA tiers: post-rules run record; depth: STR-07; new link targets: step 16 | SK: linking map |
| 5 "Output refresh plan" + "STOP" | mode 07 steps 13-18 (`FW/templates/REFRESH_PLAN_template.md`) and Checkpoint | SK: ST plan block (verbatim below) |
| 6 "Execute approved changes" | mode 07 steps 19-25; anti-AI on all copy: COPY-10, EDT-07; dates: ONP-12 (R-24: bump `updateDate`, keep `publishDate`) | SK: linking map update |
| 7 "Run Agent 05 QA" | mode 07 step 26 → mode 05 | none |
| 8 "Human Review Checklist" | voice: mode 07 step 19; placeholders: BLD-05; publishDate: ONP-12 (R-24); commit: mode 05 route 3 | SK: checklist text |
| "Data source rules" incl. "Follow `docs/sops/content-refresh-sop.md`" | mode 07 Inputs (GSC, GA4), TOP-13 | `content-refresh-sop.md` stays an ST doc (`SEO_CONTEXT.md` mode 07 row) |

### `/content-plan` (content-plan.md)

| Step (quoted) | Global home | Site part |
|---|---|---|
| Input: "Time horizon ... Default: 4 weeks." | mode 02 (no fixed horizon) | SK |
| 1 "Gather performance signals (MCP first, Ahrefs fallback)" | mode 01 (GSC read), mode 02 step 1 (pre-gate, L-TOP-11) and step 3 (`GSC-measured` candidates); Ahrefs: TOP-13 | SK: MCP names; impression trigger: SEO_CONTEXT OPEN 4 |
| 2 "Run Agent 03 (Content Planner) logic" | mode 02 step 2 (list what exists), step 10 (TOP-07) | SK: `sot_master.csv` filters; cadence map: `agents/03` + SEO_CONTEXT OPEN 3 |
| 3 "Merge signals into a ranked list" | mode 02 step 9 ("Refresh before new") and step 12 (ranking, P-tiers) | none |
| 4 "Output" | mode 02 "Ranked list format", `FW/templates/CONTENT_PLAN_template.md` | SK: ST calendar block (verbatim below) |
| 5 "Human Review Checklist" | business priorities: TOP-01 and mode 02 Checkpoint; ICP: TOP-04, L-TOP-03; cannibalization: TOP-07 | cadence: SEO_CONTEXT OPEN 3 |
| "Data source rules" | TOP-05, TOP-13 | SK: `sot_master.csv` as SSOT |

Steps whose global home sits outside modes 02/03/04/07 and post-rules: `/content-plan` 1 (mode 01),
`/draft` 7, `/refresh` 7 and the commit lines (mode 05). No step was left without a home.

## Verbatim excerpts

### `archive/commands/brief.md` L11-34: steps 1-4: keyword SSOT, SERP and GSC tools, cannibalisation, brief fields

### 1. Validate keyword in sot_master.csv
- Read `research/keywords/sot_master.csv`
- Find the keyword row. Confirm `status = not-started` and `tier = winnable`
- If keyword not found or wrong tier, flag to user and suggest alternatives

### 2. Gather SERP intelligence
- Call `dfs_serp_results` for the primary keyword - note top 3 results, content format, featured snippet presence
- Call `dfs_keyword_suggestions` - pick 2-3 high-volume related terms as secondary keywords
- Call `get_top_queries` filtered to related terms - check if we already rank for variants
- Skip any MCP call that's unavailable; note what's missing

### 3. Cannibalization check
- Search `src/data/post/` titles and frontmatter for the target keyword
- Search `src/data/niches.ts` and `src/data/comparisons.ts` for overlap
- If overlap found: STOP and flag

### 4. Fill the content brief
Use the template from `docs/templates/content-brief-template.md`. Fill in all fields:
- Primary keyword, secondary keywords, intent, cluster, priority score
- Publish date (up to 5/week Mon-Fri, check for same-day collisions)
- ICP angle (one sentence: why does this matter for a B2B founder acquiring customers via YouTube?)
- Competing pages (from SERP data) + what they're missing
- Internal links to include (check `docs/templates/internal-linking-map.md` + `src/pages/tools/`)
- Target word count (per `content-depth-framework.md` decision tree)

### `archive/commands/brief.md` L45-58: human review checklist and data source rules

### 7. Human Review Checklist
- [ ] Is the ICP angle specific enough? (Not just "YouTube for business" - what specific business problem?)
- [ ] Do the secondary keywords fit naturally or feel forced?
- [ ] Is the differentiation from top 3 results clear?
- [ ] Are the planned internal links to real, live pages?
- [ ] Does the publish date respect cadence rules?

**STOP. Wait for user approval before proceeding to outline or draft.**

## Data source rules
- MCP tools (DataForSEO, GSC) are primary - use when available
- Ahrefs exports accepted as supplemental context when provided by user
- `sot_master.csv` is SSOT for keyword data
- Never fabricate SERP positions, volumes, or competitor data

### `archive/commands/draft.md` L11-46: steps 1-7: reading list and Agent 04 phase references

### 1. Load writing standards
Read these files before writing (do not skip):
1. `style-guide.md`
2. `content-playbook.md`
3. `content-depth-framework.md`
4. `seo-rules.md`
5. `ai-seo-guide.md`
6. `docs/icp.md`
7. One existing post from `src/data/post/` for format/tone calibration

### 2. Produce outline (Agent 04 Phase 1)
Follow `agents/04-blog-writer.md` Phase 1 exactly:
- Run DataForSEO lookups (`dfs_serp_results` + `dfs_keyword_suggestions`) if available
- Produce the full outline with title options, meta description, H2/H3 structure, FAQ questions
- **STOP - show outline to user - wait for approval**

### 3. Write full draft (Agent 04 Phase 2)
After outline approval:
- Write complete MDX with all required frontmatter fields
- Follow the OutlierKit-inspired structure from Agent 04
- Include: Key Takeaways box, TOC, Quick Answer (if applicable), all H2/H3 sections, FAQ, author bio, sources, action box
- Insert internal links (min 1 tool + 1 blog/pSEO page)

### 4. Create featured image SVG (Agent 04 Phase 3.5)
Follow the Fix #17 spec exactly (1200x675, gradient background, centered text, no numbers in title lines)

### 5. Anti-AI pass (Agent 04 Phase 2.5)
Run Pass 1 (identify AI tells) + Pass 2 (fix + add personality)

### 6. Internal linking (Agent 04 Phase 3.6)
- Check `docs/templates/internal-linking-map.md`
- Insert links at natural decision moments
- Update the linking map

### 7. Auto-QA (Agent 04 Phase 3 → Agent 05)
Hand off to Agent 05. Fix all CRITICAL and IMPORTANT violations. Only surface to user after QA passes.

### `archive/commands/draft.md` L48-58: human review checklist and data source rules

### 8. Human Review Checklist
- [ ] Does the intro make you feel something? (Curiosity, recognition, a sting)
- [ ] Are there placeholders marked [ADD PROOF] or [ADD SCREENSHOT] that need your input?
- [ ] Does every section pass the ICP test? ("Why does this matter for acquiring customers?")
- [ ] Is the CTA specific to this post's topic?
- [ ] Ready to commit? Say "commit" to proceed.

## Data source rules
- MCP data (GSC/GA4/DataForSEO) used for SERP research and keyword validation
- Ahrefs exports accepted as supplemental competitor intelligence
- Never fabricate stats, quotes, or data points - mark gaps with [NEEDS DATA] for human review

### `archive/commands/refresh.md` L11-35: steps 1-4: read, pre-update audit, performance signals, gap analysis

### 1. Read the current post in full
- Find the file in `src/data/post/`
- Read every line - note frontmatter, structure, word count, internal links, missing elements

### 2. Run the pre-update audit (Agent 04 Blog Post Update Protocol)
Check every item in the protocol:
- File is `.mdx`? If `.md`, rename.
- All required frontmatter fields present?
- Key Takeaways box, TOC, action box present?
- Em-dash grep (`grep -n "<U+2014>" [filename]`)
- Internal links count (need >= 4)
- Featured image file exists at referenced path?

### 3. Gather current performance signals
- Call `get_top_queries` filtered to this page URL - what queries is it ranking for?
- Call `get_ranking_opportunities` - is this page in positions 5-20 for any keywords?
- Call `dfs_serp_results` for the post's primary keyword - what do top 3 results have that this post doesn't?
- If MCP unavailable, note what data is missing and proceed with structural fixes

### 4. Gap analysis
Compare the post against:
- Current SERP top 3 (from step 3): missing sections, missing angles, missing depth
- Agent 05 QA checklist: run the full CRITICAL + IMPORTANT tier audit
- `content-depth-framework.md`: is the coverage level right for this topic?
- `docs/templates/internal-linking-map.md`: are there new posts/tools to link to since last update?

### `archive/commands/refresh.md` L37-88: steps 5-8: refresh plan format, execution, QA, checklist

### 5. Output refresh plan (show to user before editing)

```
REFRESH PLAN - /blog/[slug]

CURRENT STATE:
- Published: [date]
- Word count: ~[n]
- Internal links: [n]
- GSC performance: [impressions, clicks, avg position if available]

STRUCTURAL FIXES NEEDED:
1. [fix] - [severity]

CONTENT GAPS vs SERP:
1. [what's missing] - [recommendation]

NEW SECTIONS TO ADD:
1. [section] - [why]

INTERNAL LINKS TO ADD:
1. [target] - [anchor text] - [placement]

NEW FAQ TO ADD:
- [question from GSC/PAA data]

ESTIMATED EFFORT: [light refresh / moderate rewrite / heavy rewrite]
```

**STOP - show plan to user - wait for approval before editing.**

### 6. Execute approved changes
- Apply all structural fixes
- Write new/updated sections
- Run Anti-AI pass (Agent 04 Phase 2.5) on ALL copy, not just new additions
- Update frontmatter (FAQs, metadata, publishDate if meaningful content added)
- Update `docs/templates/internal-linking-map.md`

### 7. Run Agent 05 QA
Full QA pass. Fix all CRITICAL and IMPORTANT violations before surfacing.

### 8. Human Review Checklist
- [ ] Are the new sections consistent in voice with the original?
- [ ] Any [ADD PROOF] or [ADD SCREENSHOT] placeholders that need your input?
- [ ] Should publishDate be updated? (Yes if new sections added, no if cosmetic only)
- [ ] Ready to commit?

## Data source rules
- Prefer live GSC/GA4 data for performance signals
- DataForSEO for current SERP comparison
- Ahrefs exports for backlink/keyword gap context when provided
- Follow `docs/sops/content-refresh-sop.md` for the post-refresh publish sequence

### `archive/commands/content-plan.md` L5-57: input, steps 1-5 and data source rules

## Input
- Time horizon provided by user (e.g., "next 4 weeks"). Default: 4 weeks.
- Optional: cluster focus, content type filter (blog/tool)

## Steps

### 1. Gather performance signals (MCP first, Ahrefs fallback)
- Call `get_top_queries` for the last 28 days - note keywords with rising impressions but low CTR (quick-win candidates)
- Call `get_ranking_opportunities` - note keywords in positions 5-20 (refresh candidates)
- If user provides an Ahrefs export, read it for keyword gap opportunities not in `sot_master.csv`

### 2. Run Agent 03 (Content Planner) logic
- Read all `publishDate` values from `src/data/post/*.{md,mdx}` - build the cadence map
- Read `research/keywords/sot_master.csv` - filter: `status = not-started`, `tier = winnable`, sort by `priority_score` desc
- Cross-reference: exclude keywords already covered by live posts or pSEO pages

### 3. Merge signals into a ranked list
Priority order:
1. **Refresh candidates** - existing posts with GSC signal (position 5-20) that could rank higher with updates
2. **High-priority new keywords** - top `priority_score` from sot_master.csv, ICP-validated
3. **Content gaps** - queries appearing in GSC impressions with no matching page

### 4. Output

```
CONTENT PLAN - [date range]

REFRESH PRIORITIES (existing posts to update):
| Post slug | Current position | Impressions | Recommended action |
|---|---|---|---|

NEW CONTENT PRIORITIES:
| # | Keyword | Vol | KD | Cluster | Type | Recommended date | ICP angle |
|---|---|---|---|---|---|---|---|

CALENDAR (next N weeks):
| Week | Date | Slot | Keyword/action | Status |
|---|---|---|---|---|

CADENCE CHECK: [pass/fail - any 7-day window violations?]
```

### 5. Human Review Checklist
- [ ] Do the refresh candidates still match business priorities?
- [ ] Are new keywords ICP-validated? (Would a B2B founder search this?)
- [ ] Does the calendar respect 1/week blog cadence?
- [ ] Any keyword cannibalization risks?

## Data source rules
- Prefer live MCP data (GSC/GA4) when available
- Accept uploaded Ahrefs CSV as supplemental context
- Never invent traffic numbers - if data is missing, state what's needed
- All keyword decisions reference `sot_master.csv` as SSOT

### `agents/02-keyword-researcher.md` L8-32: sot_master.csv columns, filters and DataForSEO live check


## Source files
- `research/keywords/sot_master.csv` - curated keywords. **SINGLE SOURCE OF TRUTH.** Columns: rank, keyword, search_volume, search_volume_live, kd_real, tier, intent, cluster, content_type (blog|tool|pseo_for|pseo_vs), target_slug, status (live|planned|not-started), priority_score. Use ONLY this file for content decisions. Never use `master_keywords_cleaned.csv` directly.
  - `kd_real` - real keyword difficulty from DataForSEO (backlink-based). More accurate than `keyword_difficulty` (GKP-based). Use `kd_real` for all difficulty decisions.
  - `tier` - pre-calculated: `winnable` (KD≤30), `stretch` (KD 31 - 45), `avoid` (KD>45), `pseo` (pSEO pages). Always filter to `winnable` first.
  - `search_volume_live` - live US search volume from DataForSEO. Use this over `search_volume` when available.
- `research/keywords/cluster_summary.csv` - 16 clusters ranked by avg priority.
- `src/data/post/` - all existing blog posts (check publishDate frontmatter for title + slug to avoid cannibalization)
- `src/data/niches.ts` + `src/data/comparisons.ts` - pSEO pages (avoid cannibalization here too)

## Execution steps

### Step 1 - Understand the request
Identify: target cluster (or infer from topic), search intent (informational / commercial / transactional), ICP angle (B2B founders, SaaS operators, service businesses - NOT general creators).

### Step 2 - Filter the CSV
Read `sot_master.csv`. Filter in this exact order:
1. `status = not-started` - MANDATORY. Never recommend keywords with status `live` or `planned`.
2. `tier = winnable` - MANDATORY for blog/tool keywords. Never recommend `avoid` tier keywords. Only escalate to `stretch` if the user explicitly asks for higher-competition targets and the site has grown.
3. Matching cluster or topic
4. `search_intent` matches the content goal
5. Sort by `priority_score` descending - this is now calculated using live volume + real KD

### Step 2.5 - Verify live metrics (DataForSEO)
For the top 5 candidates from Step 2, call `dfs_keyword_metrics` with those keywords. Compare the live search_volume and cpc against the CSV values. If a keyword's live volume differs by more than 30% from the CSV, use the live value and flag it in the output table with "(live data)". Skip this step only if the DataForSEO MCP tool is unavailable.

### `agents/04-blog-writer.md` L187-196: Phase 3.6 internal linking

### Phase 3.6 - Internal Linking (before Agent 05 handoff)

Before handing to Agent 05:

1. Check `docs/templates/internal-linking-map.md` for existing posts and tools
2. Insert at minimum:
   - **One link to a SellonTube tool** - placed at the natural moment a reader would want to use it, not forced at the end
   - **One link to a related blog post or pSEO page** - placed where the topic is directly relevant
3. Update `docs/templates/internal-linking-map.md` with the new links added
4. Confirm both links exist in the draft before proceeding to QA

### `agents/04-blog-writer.md` L279: pre-update audit link minimum

- [ ] At least 4 internal links total (mix of blog posts, tools at /tools/*, and pSEO pages). Every post should link to at least one SellonTube tool.

### `agents/04-blog-writer.md` L288-292: post-update checklist

1. Run humanizer Phase 2.5 (Pass 1 + Pass 2) on ALL existing copy, not just new additions. Old copy inherits AI tells from the original draft.
2. Grep for `<U+2014>` again. New copy adds new risks.
3. Verify featured image file exists at the exact path in the `image` frontmatter field.
4. Count internal links - must be ≥ 4.
5. Hand to Agent 05. Do not surface to user before QA passes.
