# /content-plan — Prioritized Topic List

Build a prioritized content plan for the requested time horizon.

## Input
- Time horizon provided by user (e.g., "next 4 weeks"). Default: 4 weeks.
- Optional: cluster focus, content type filter (blog/tool)

## Steps

### 1. Gather performance signals (MCP first, Ahrefs fallback)
- Call `get_top_queries` for the last 28 days — note keywords with rising impressions but low CTR (quick-win candidates)
- Call `get_ranking_opportunities` — note keywords in positions 5-20 (refresh candidates)
- If user provides an Ahrefs export, read it for keyword gap opportunities not in `sot_master.csv`

### 2. Run Agent 03 (Content Planner) logic
- Read all `publishDate` values from `src/data/post/*.{md,mdx}` — build the cadence map
- Read `research/keywords/sot_master.csv` — filter: `status = not-started`, `tier = winnable`, sort by `priority_score` desc
- Cross-reference: exclude keywords already covered by live posts or pSEO pages

### 3. Merge signals into a ranked list
Priority order:
1. **Refresh candidates** — existing posts with GSC signal (position 5-20) that could rank higher with updates
2. **High-priority new keywords** — top `priority_score` from sot_master.csv, ICP-validated
3. **Content gaps** — queries appearing in GSC impressions with no matching page

### 4. Output

```
CONTENT PLAN — [date range]

REFRESH PRIORITIES (existing posts to update):
| Post slug | Current position | Impressions | Recommended action |
|---|---|---|---|

NEW CONTENT PRIORITIES:
| # | Keyword | Vol | KD | Cluster | Type | Recommended date | ICP angle |
|---|---|---|---|---|---|---|---|

CALENDAR (next N weeks):
| Week | Date | Slot | Keyword/action | Status |
|---|---|---|---|---|

CADENCE CHECK: [pass/fail — any 7-day window violations?]
```

### 5. Human Review Checklist
- [ ] Do the refresh candidates still match business priorities?
- [ ] Are new keywords ICP-validated? (Would a B2B founder search this?)
- [ ] Does the calendar respect 1/week blog cadence?
- [ ] Any keyword cannibalization risks?

## Data source rules
- Prefer live MCP data (GSC/GA4) when available
- Accept uploaded Ahrefs CSV as supplemental context
- Never invent traffic numbers — if data is missing, state what's needed
- All keyword decisions reference `sot_master.csv` as SSOT
