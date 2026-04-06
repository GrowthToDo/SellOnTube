# /brief — Content Brief Generator

Generate a complete content brief for a keyword or topic, ready for outline approval.

## Input
- Keyword or topic from user
- Optional: uploaded Ahrefs data, specific angle request

## Steps

### 1. Validate keyword in sot_master.csv
- Read `research/keywords/sot_master.csv`
- Find the keyword row. Confirm `status = not-started` and `tier = winnable`
- If keyword not found or wrong tier, flag to user and suggest alternatives

### 2. Gather SERP intelligence
- Call `dfs_serp_results` for the primary keyword — note top 3 results, content format, featured snippet presence
- Call `dfs_keyword_suggestions` — pick 2-3 high-volume related terms as secondary keywords
- Call `get_top_queries` filtered to related terms — check if we already rank for variants
- Skip any MCP call that's unavailable; note what's missing

### 3. Cannibalization check
- Search `src/data/post/` titles and frontmatter for the target keyword
- Search `src/data/niches.ts` and `src/data/comparisons.ts` for overlap
- If overlap found: STOP and flag

### 4. Fill the content brief
Use the template from `docs/templates/content-brief-template.md`. Fill in all fields:
- Primary keyword, secondary keywords, intent, cluster, priority score
- Publish date (check cadence per Agent 03 logic — max 1/week)
- ICP angle (one sentence: why does this matter for a B2B founder acquiring customers via YouTube?)
- Competing pages (from SERP data) + what they're missing
- Internal links to include (check `docs/templates/internal-linking-map.md` + `src/pages/tools/`)
- Target word count (per `content-depth-framework.md` decision tree)

### 5. Determine coverage level
Read `content-depth-framework.md`. Apply the depth decision tree:
- Deep (2,000-4,000+): strategy, framework, multi-step process topics
- Medium (1,200-2,200): how-to guides, single-concept explainers
- Short (500-1,200): listicles, comparisons, quick answers

### 6. Output the completed brief
Show the filled template to the user.

### 7. Human Review Checklist
- [ ] Is the ICP angle specific enough? (Not just "YouTube for business" — what specific business problem?)
- [ ] Do the secondary keywords fit naturally or feel forced?
- [ ] Is the differentiation from top 3 results clear?
- [ ] Are the planned internal links to real, live pages?
- [ ] Does the publish date respect cadence rules?

**STOP. Wait for user approval before proceeding to outline or draft.**

## Data source rules
- MCP tools (DataForSEO, GSC) are primary — use when available
- Ahrefs exports accepted as supplemental context when provided by user
- `sot_master.csv` is SSOT for keyword data
- Never fabricate SERP positions, volumes, or competitor data
