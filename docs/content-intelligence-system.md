# Content Intelligence System

> Architecture and workflow for SellOnTube's research-to-publish content pipeline.

> **Superseded in part (2026-10-15).** The command layer (`/content-plan`, `/brief`, `/draft`,
> `/refresh`) is archived in `archive/commands/`. Blog and SEO work runs through the global
> seo-content-system skill; config in `SEO_CONTEXT.md`, site detail in `seo/site-kit/`
> (`pipeline-notes.md` maps every old command step). The data layer and agent notes stay valid.

---

## Architecture

```
DATA LAYER (Sources of Truth)
+---------------------------+----------------------------+---------------------------+
| DataForSEO API            | MCP (Live)                 | Ahrefs Exports (Upload)   |
| - Keyword metrics         | - GSC: queries, pages,     | - Backlink profile         |
| - SERP analysis           |   ranking opportunities    | - Top pages by traffic     |
| - Keyword suggestions     | - GA4: sessions, sources   | - Keyword gaps             |
|                           | - Bing: webmaster data     |                           |
+---------------------------+----------------------------+---------------------------+
            |                          |                          |
            v                          v                          v
+--------------------------------------------------------------------------+
| INTELLIGENCE LAYER (Claude + seo-content-system skill)                   |
|                                                                          |
| mode 02  (was /content-plan) - topic research, ranked list               |
| mode 03  (was /brief)        - SERP read + brief, outline included       |
| mode 04  (was /draft)        - draft, humanizer, draft check             |
| mode 07  (was /refresh)      - gap analysis + refresh of live posts      |
|                                                                          |
| Decision rules:                                                          |
|   1. Use MCP data first (live, authoritative)                            |
|   2. Supplement with Ahrefs exports when MCP is partial                  |
|   3. Use DataForSEO for keyword/SERP research                           |
|   4. Never invent missing data — state what's needed and pause           |
+--------------------------------------------------------------------------+
            |
            v
+--------------------------------------------------------------------------+
| EXECUTION LAYER (Existing Agents)                                         |
|                                                                          |
| Agent 02 — Keyword selection from sot_master.csv                         |
| Agent 03 — Calendar + cadence enforcement                                |
| Agent 04 — Outline-first blog writing + anti-AI pass                     |
| Agent 05 — QA (CRITICAL/IMPORTANT/ADVISORY tiers)                        |
| Agent 07 — Technical SEO, redirects, schema                              |
|                                                                          |
| The commands invoke agent logic — agents are not replaced.               |
+--------------------------------------------------------------------------+
            |
            v
+--------------------------------------------------------------------------+
| HUMAN REVIEW (Founder)                                                    |
|                                                                          |
| Every command ends with a Human Review Checklist.                         |
| Founder adds: proof, screenshots, client stories, offer framing.         |
| No content publishes without explicit approval.                          |
+--------------------------------------------------------------------------+
```

---

## Data Source Decision Rules

| Question | First choice | Fallback | Never |
|---|---|---|---|
| What keywords are we ranking for? | GSC via MCP | Ahrefs export | Guess |
| What's the search volume for X? | DataForSEO `dfs_keyword_metrics` | sot_master.csv | Estimate |
| What do top SERP results look like? | DataForSEO `dfs_serp_results` | Manual check | Assume |
| What's our traffic trend? | GA4 via MCP | Ahrefs export | Infer |
| What keywords should we target? | sot_master.csv (SSOT) | DataForSEO suggestions | Invent |
| What backlinks do we have? | Ahrefs export | GSC links report | N/A |

---

## Commands Reference (superseded 2026-10-15)

The four commands below are archived in `archive/commands/`. Use the global seo-content-system
skill modes instead: `/content-plan` → mode 02, `/brief` → mode 03, `/draft` → mode 04 (then
mode 05 for QA and ship), `/refresh` → mode 07. Step map and SellonTube-only detail:
`seo/site-kit/pipeline-notes.md`. The table is kept as history.

| Command | Input | Output | When to use |
|---|---|---|---|
| `/content-plan` | Time horizon | Prioritized topic list + calendar | Start of week |
| `/brief` | Keyword or topic | Complete content brief | Before writing anything |
| `/draft` | Approved brief | Full MDX draft with SVG + QA | After brief approval |
| `/refresh` | Post slug or URL | Gap analysis + updated content | Monthly on top posts |

The commands lived in `.claude/commands/` (now `archive/commands/`). They invoked agent logic (02-05); the skill modes now cite the agent files for SellonTube detail only.

---

## Weekly Workflow (commands superseded 2026-10-15; mode names below)

**Monday: Plan**
1. Run seo-content-system mode 02 (topic research; was `/content-plan next 4 weeks`)
2. Review priorities — pick the week's keyword or refresh target
3. Approve or adjust

**Tuesday-Wednesday: Create**
4. Run mode 03 for the keyword (was `/brief`): review and approve the brief, outline included
5. Run mode 04 (was `/draft`): review and approve the draft, then mode 05 runs final QA
6. Add proof, screenshots, client stories (founder work)

**Thursday: Publish**
7. Final review + commit + push (mode 05 route 3; `docs/sops/blog-publishing-sop.md`)
8. Submit to GSC Request Indexing
9. Update `sot_master.csv` status to `live`

**Month-end: Refresh**
10. Run mode 07 on posts that hit a decay trigger (was `/refresh` on the top 3 by impressions, which the bot rule forbids; follow `docs/sops/content-refresh-sop.md`)

---

## What This System Does NOT Replace

| Existing asset | Status | Why it stays |
|---|---|---|
| `sot_master.csv` | SSOT for keywords | Commands read from it, never replace it |
| Agent 02-05 | Core writing pipeline | Commands invoke agents, not duplicate them |
| `style-guide.md` + `content-playbook.md` | Writing standards | Commands enforce them, not restate them |
| `seo-rules.md` + `ai-seo-guide.md` | SEO standards | Commands reference them |
| Blog publishing SOP | Gate sequence | Commands feed into it |
| Content refresh SOP | Refresh sequence | mode 07 uses it (was `/refresh`) |

---

## Integration Points with SEO Machine Concepts

Ideas adopted from SEO Machine (cherry-picked, not installed):

| SEO Machine concept | How we integrated it | Where it lives |
|---|---|---|
| SERP analysis before writing | mode 03 SERP table (BRF-03); DataForSEO optional and labelled (R-11). Was `/brief` | `_shared/seo-content-framework/workflows/03-brief.md` |
| Content scoring/QA | Agent 05 already does this with CRITICAL/IMPORTANT/ADVISORY tiers | `agents/05-content-qa.md` |
| Brand voice context file | Pointer doc referencing existing style-guide + content-playbook | `docs/brand-voice.md` |
| Internal linking strategy | Already exists in Agent 04 Phase 3.6 + linking map | `docs/templates/internal-linking-map.md` |
| Performance review workflow | mode 07 (refresh) + mode 02 (topic research) + mode 10 (measure). Was `/refresh` + `/content-plan` | `_shared/seo-content-framework/workflows/07-refresh.md` |
| Meta element generation | Agent 04 already generates full frontmatter + meta | `agents/04-blog-writer.md` |
