# /draft — First Draft Generator

Produce a full first draft from an approved brief or topic.

## Input
- An approved content brief (from `/brief`) or a keyword/topic with explicit user go-ahead
- If no brief exists, run `/brief` first

## Steps

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
- **STOP — show outline to user — wait for approval**

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

### 8. Human Review Checklist
- [ ] Does the intro make you feel something? (Curiosity, recognition, a sting)
- [ ] Are there placeholders marked [ADD PROOF] or [ADD SCREENSHOT] that need your input?
- [ ] Does every section pass the ICP test? ("Why does this matter for acquiring customers?")
- [ ] Is the CTA specific to this post's topic?
- [ ] Ready to commit? Say "commit" to proceed.

## Data source rules
- MCP data (GSC/GA4/DataForSEO) used for SERP research and keyword validation
- Ahrefs exports accepted as supplemental competitor intelligence
- Never fabricate stats, quotes, or data points — mark gaps with [NEEDS DATA] for human review
