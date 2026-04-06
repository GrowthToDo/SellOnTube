# /refresh — Content Refresh

Analyze an existing blog post against current SERP landscape and produce refresh recommendations + updated content.

## Input
- Blog post slug or URL (e.g., "youtube-marketing-strategy" or full URL)
- Optional: uploaded Ahrefs data, specific sections to focus on

## Steps

### 1. Read the current post in full
- Find the file in `src/data/post/`
- Read every line — note frontmatter, structure, word count, internal links, missing elements

### 2. Run the pre-update audit (Agent 04 Blog Post Update Protocol)
Check every item in the protocol:
- File is `.mdx`? If `.md`, rename.
- All required frontmatter fields present?
- Key Takeaways box, TOC, action box present?
- Em-dash grep (`grep -n "—" [filename]`)
- Internal links count (need >= 4)
- Featured image file exists at referenced path?

### 3. Gather current performance signals
- Call `get_top_queries` filtered to this page URL — what queries is it ranking for?
- Call `get_ranking_opportunities` — is this page in positions 5-20 for any keywords?
- Call `dfs_serp_results` for the post's primary keyword — what do top 3 results have that this post doesn't?
- If MCP unavailable, note what data is missing and proceed with structural fixes

### 4. Gap analysis
Compare the post against:
- Current SERP top 3 (from step 3): missing sections, missing angles, missing depth
- Agent 05 QA checklist: run the full CRITICAL + IMPORTANT tier audit
- `content-depth-framework.md`: is the coverage level right for this topic?
- `docs/templates/internal-linking-map.md`: are there new posts/tools to link to since last update?

### 5. Output refresh plan (show to user before editing)

```
REFRESH PLAN — /blog/[slug]

CURRENT STATE:
- Published: [date]
- Word count: ~[n]
- Internal links: [n]
- GSC performance: [impressions, clicks, avg position if available]

STRUCTURAL FIXES NEEDED:
1. [fix] — [severity]

CONTENT GAPS vs SERP:
1. [what's missing] — [recommendation]

NEW SECTIONS TO ADD:
1. [section] — [why]

INTERNAL LINKS TO ADD:
1. [target] — [anchor text] — [placement]

NEW FAQ TO ADD:
- [question from GSC/PAA data]

ESTIMATED EFFORT: [light refresh / moderate rewrite / heavy rewrite]
```

**STOP — show plan to user — wait for approval before editing.**

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
