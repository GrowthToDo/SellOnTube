# Design Spec: Content Ecosystem Restructure
**Date:** 2026-03-20
**Branch:** content-guidelines-restructuring
**Goal:** Audit and restructure the entire content ecosystem — blogs, pSEO pages, agents, SOPs, templates — to maximise impressions, high-quality traffic, and CTR. Prevent repeated mistakes through enforcement gates embedded in agent workflows, not advisory text.

---

## Approved Decisions

| Decision | Choice |
|---|---|
| Folder structure | **Approach C (Hybrid)** — fix bugs in-place, add new SOPs/templates to `docs/`, no file moves |
| Superseded CSVs | **Archive** to `research/keywords/archive/` |
| `content-plan.md` | **Deprecate** — add redirect note at top pointing to `sot_master.csv` |
| ICP definition | **Extract** to `docs/icp.md` — all agents reference it |
| Agent 05 checklist | **Tier** into Critical / Important / Advisory |

---

## Architecture

### New Files to Create

```
DOCS.md                                          ← master navigation index
docs/
  icp.md                                         ← canonical ICP definition
  sops/
    blog-publishing-sop.md                       ← full blog publish gate sequence
    pseo-publishing-sop.md                       ← pSEO publish gate sequence
    deploy-checklist.md                          ← pre-push checklist
    content-refresh-sop.md                       ← 90-day/monthly update workflow
    ctr-optimization-sop.md                      ← CTR improvement workflow
    monthly-ai-seo-checklist.md                  ← extracted from ai-seo-guide.md §10
  templates/
    content-brief-template.md                    ← keyword → writing handoff artifact
    internal-linking-map.md                      ← tracks which posts link where
research/keywords/
  archive/                                       ← superseded intermediate CSVs
    sot_keywords_final.csv                       ← moved here
    sot_keywords.csv                             ← moved here
```

### Files Modified In-Place (no moves)

| File | Change type |
|---|---|
| `agents/02-keyword-researcher.md` | Bug fix: CSV reference + status filter |
| `agents/03-content-planner.md` | Gate: add blog SOP reference |
| `agents/04-blog-writer.md` | Gap fill: featured image step, internal linking step, brief template reference |
| `agents/05-content-qa.md` | Restructure: tier checklist Critical/Important/Advisory |
| `agents/06-pseo-manager.md` | Fix stale counts, add pSEO SOP reference |
| `agents/07-technical-seo.md` | Add monthly AI SEO checklist ownership |
| `agents/08-microtool-builder.md` | Bug fix: CSV reference + Gemini API standard |
| `agents/README.md` | Add DOCS.md reference |
| `agents/master.md` | Add hard pre-flight keyword status gate |
| `growth-strategy.md` | Fix: Claude API → Gemini Flash reference |
| `research/keywords/content-plan.md` | Deprecation notice at top |
| `README.md` | Populate with project overview |

---

## Component Designs

### 1. `docs/icp.md` — Canonical ICP Definition

Single source. Agents reference `docs/icp.md` instead of duplicating inline.

**Content:**
- Primary audience: B2B founders, SaaS operators, service businesses ($1M+ revenue, high-ticket offers) evaluating YouTube for customer acquisition and lead generation
- NOT: hobbyist creators, influencers, entertainers, subscriber-growth seekers
- ICP lens rule: every section of every piece of content must answer "why does this matter for a business trying to acquire customers?" — not "how do I grow my channel?"
- ICP fit test: if the content could appear on VidIQ or TubeBuddy without modification, it fails the ICP test

### 2. `docs/sops/blog-publishing-sop.md`

13-step gate sequence. Each step is a checkbox. Cannot skip. Steps in order:

1. Keyword confirmed in `sot_master.csv` with `status = not-started`
2. Keyword not covered by any existing post (cannibalization check)
3. `content-brief-template.md` filled in and shown to user
4. Agent 03 confirmed open calendar slot (7-day window count run)
5. Agent 04 outline produced and user-approved
6. Agent 04 full draft written
7. Featured SVG image created and saved at correct path
8. Agent 05 QA: all CRITICAL items pass; IMPORTANT items resolved
9. `publishDate` confirmed as IST (`T00:00:00+05:30` aware)
10. `metadata.canonical` matches the file's URL path
11. `image` path resolves to an existing file
12. Present final file + QA report to user — wait for explicit "yes"
13. On approval: commit → user says "push" → push → submit GSC Request Indexing → update `sot_master.csv` status to `live`

**Hard rules embedded:**
- Steps 12-13 are sequential and require separate explicit approvals
- Never combine commit + push into one action
- Never push before user says "push" — even if they said "yes" to commit

### 3. `docs/sops/deploy-checklist.md`

Checklist version of the final 4 steps of every deploy (blog or pSEO):

- [ ] Agent 05 QA result: PASS
- [ ] 7-day blog window: posts counted, no violation
- [ ] `publishDate` IST timezone verified
- [ ] `metadata.canonical` correct
- [ ] Featured image file exists at frontmatter path
- [ ] UTC check: if deploying before 05:30 IST, page is not live until 05:30 IST
- [ ] Commit message shown to user — explicit "yes" received
- [ ] Push approved by user separately
- [ ] Post-push: GSC Request Indexing submitted
- [ ] `sot_master.csv` status updated to `live`

### 4. `docs/templates/content-brief-template.md`

Handoff artifact between Agent 02 → 03 → 04. Filled in before outline starts.

Fields:
- PRIMARY KEYWORD + source row from sot_master.csv
- SECONDARY KEYWORDS (2-3)
- SEARCH INTENT + CLUSTER + PRIORITY SCORE
- TARGET WORD COUNT (from Agent 04 word count guidance)
- PUBLISH DATE (IST) — from Agent 03
- TARGET URL
- ICP ANGLE (one sentence)
- INTERNAL LINKS TO INCLUDE (tool, blog, pSEO — with insertion moment)
- FEATURED IMAGE FILE path
- COMPETING PAGES (top 3 Google results)
- OUTLINE STATUS / DRAFT STATUS

### 5. `docs/templates/internal-linking-map.md`

Living document. Updated each time a post is published. Tracks:

**Blog → Tool links:**
| Blog post slug | Tool linked | Anchor text | Section |
|---|---|---|---|

**Blog → pSEO links:**
| Blog post slug | pSEO page linked | Anchor text | Section |
|---|---|---|---|

**Blog → Blog links:**
| Source slug | Target slug | Anchor text | Topic relationship |
|---|---|---|---|

**Unlinked opportunities:**
| Tool | Blog posts that should link to it | Status |
|---|---|---|

### 6. `docs/sops/content-refresh-sop.md`

Triggers: monthly (priority clusters: youtube_seo, youtube_lead_gen, b2b), quarterly (all others).

Steps:
1. Read current post
2. Check for outdated stats — update with recent source
3. Add 1 new FAQ from current GSC "People Also Ask"
4. Update "What to do this week" box with fresh advice
5. Add internal link to any new post/tool published since last refresh
6. Run Agent 05 QA on updated file
7. Push with commit `content: refresh [post-slug] — [what changed]`
8. Submit to GSC Request Indexing
9. Update `publishDate` only if meaningful content was added (not cosmetic)
10. Note refresh in `seo-audit-log.md`

### 7. `docs/sops/ctr-optimization-sop.md`

Triggered by Agent 01 quick-win identification (position 5-20, CTR below average).

Steps:
1. Read current title + meta description
2. Title check: keyword in first 3 words? ≤ 60 chars? No filler opener?
3. Meta check: specific claim? Sells the click? No "comprehensive"?
4. Write 2 alternative title options (run through Agent 05 title rules)
5. Write 1 alternative meta description
6. Present to user with rationale for each option
7. On approval: update frontmatter, push
8. Note change date in `seo-audit-log.md`
9. Re-check CTR in GSC after 4 weeks — note outcome

### 8. `docs/sops/monthly-ai-seo-checklist.md`

Extracted from `ai-seo-guide.md` §10. Owner: Agent 07.

Monthly steps:
- [ ] Verify all AI bots allowed in `robots.txt` / `netlify.toml` (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot)
- [ ] Check SellonTube appears in Brave Search for 3-5 core keywords
- [ ] Update at least 2 high-priority blog posts (add section, refresh stat, new FAQ)
- [ ] Submit updated URLs to GSC + IndexNow
- [ ] Check GSC for "AI Overviews" impressions — which pages are cited?
- [ ] Review schema implementation status in Agent 07 — flag next schema type to implement
- [ ] Note completions in `seo-audit-log.md`

---

## Agent Patches

### Agent 02 — Keyword Researcher
**Bug fix:** Replace `master_keywords_cleaned.csv` → `sot_master.csv`
**Filter addition:** Step 2 must filter `status = not-started` before returning candidates
**Cluster count:** Update 15 → 16

### Agent 03 — Content Calendar Planner
**Gate addition:** At Step 4, after confirming keyword, reference `docs/sops/blog-publishing-sop.md` — "This SOP governs the full publish sequence from here"

### Agent 04 — Blog Writer
**Brief reference:** Phase 1 now starts by filling in `docs/templates/content-brief-template.md`
**New Phase 3.5 — Featured Image Creation:** After full draft, before Agent 05 handoff: create SVG matching Fix #17 spec. Filename: `[post-slug]-featured.svg`. Save to `src/assets/images/blog/`. Update frontmatter `image` field.
**New Phase 3.6 — Internal Linking:** Before handing to Agent 05, check `docs/templates/internal-linking-map.md`. Insert at minimum: (a) one link to a relevant SellonTube tool at a natural decision moment, (b) one link to a related blog post. Update the internal linking map.
**ICP reference:** Replace inline ICP paragraph with "See `docs/icp.md` for the canonical ICP definition."

### Agent 05 — Content QA
**Tiered checklist:** Restructure into three tiers:

**CRITICAL (must pass — blocks publish):**
- Em-dash grep (mandatory grep, not read-through)
- Excerpt formula check (not "A practical guide...", specific claim present)
- Title rules (no filler opener, keyword near start, ≤ 65 chars)
- Frontmatter completeness (publishDate, title, excerpt, category, canonical, image)
- ICP fit (B2B framing, no creator metrics)
- Body copy: no passive hedging, no filler transitions

**IMPORTANT (must fix before publish):**
- Content structure and formatting (Fix #13 patterns)
- AEO/GEO citation blocks present
- Author bio present
- CTA rules (bottom CTA always book-a-call; mid-body CTA rules)
- Internal links present (at least 2)

**ADVISORY (flag but does not block publish):**
- Emotional resonance checks
- Visual production standards (Fix #16)
- Strategy post principles (Fix #14)
- Benchmark test (shareable section)

**Hard rule added:** "CRITICAL items must be grepped. Do not rely on read-through. Grep for `—` before completing any QA."

### Agent 06 — pSEO Drip Manager
**Count fix:** 29 niches → 31, 20 comparisons → 23
**SOP reference:** Pre-launch quality checklist now references `docs/sops/pseo-publishing-sop.md`

### Agent 07 — Technical SEO
**Monthly checklist ownership:** Add to role: "Owner of `docs/sops/monthly-ai-seo-checklist.md` — run this once per month as part of the weekly SEO review"

### Agent 08 — Microtool Builder
**Bug fix:** Replace `master_keywords_cleaned.csv` → `sot_master.csv`
**API fix:** Replace Claude Haiku reference with full Gemini Flash standard:
- Model: `gemini-flash-latest`
- API URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`
- API key: `GEMINI_API_KEY` env var
- maxOutputTokens: 2048 minimum
- HTTP 503 for upstream failures (never 502 — Cloudflare eats it)
- 429 handling: return `{ error: 'quota_exceeded' }` with HTTP 429
- Reference implementation: `netlify/functions/generate-alternatives.ts`

### `agents/README.md`
Add under Key Rules: "Full SOPs and templates: see `DOCS.md`"

### `agents/master.md`
Add hard pre-flight rule: "Before any writing task, confirm the target keyword exists in `sot_master.csv` with `status = not-started`. If status is `live` or `planned`, stop and flag to user."

---

## `DOCS.md` — Master Navigation Index

Top-level file at repo root. Tells any agent or human where everything lives.

Sections:
- **Content Standards** — style-guide.md, content-playbook.md, seo-rules.md, ai-seo-guide.md
- **Strategy** — growth-strategy.md, microtool-strategy.md, seo-audit-log.md
- **Content Plan** — sot_master.csv (SSOT), content-plan.md (deprecated — see sot_master.csv)
- **SOPs** — blog-publishing-sop.md, pseo-publishing-sop.md, deploy-checklist.md, content-refresh-sop.md, ctr-optimization-sop.md, monthly-ai-seo-checklist.md
- **Templates** — content-brief-template.md, internal-linking-map.md
- **Agent System** — agents/README.md (routing), agents/master.md (orchestration)
- **ICP** — docs/icp.md

---

## `README.md` — Project Overview

Replace empty file with:
- What SellonTube is (one paragraph)
- Stack (Astro 5, Tailwind, MDX, Netlify)
- Live site URL
- How to use the agent system (point to agents/README.md)
- How to find docs (point to DOCS.md)
- Publishing rules summary (never push without approval, blog cadence)

---

## Data Flow After Restructure

```
sot_master.csv (SSOT)
    ↓
Agent 02 (keyword pick, status=not-started filter)
    ↓
content-brief-template.md (filled in)
    ↓
Agent 03 (calendar slot confirmed)
    ↓
Agent 04 (outline → approval → draft → image → links)
    ↓
Agent 05 (CRITICAL gate → IMPORTANT gate → advisory flags)
    ↓
deploy-checklist.md (pre-push gates)
    ↓
User approval (commit) → User approval (push)
    ↓
GSC Request Indexing + sot_master.csv status → live
    ↓
internal-linking-map.md (updated)
```

---

## Error Handling

**If an agent references a file that doesn't exist:** Stop and flag to user. Do not proceed.
**If `sot_master.csv` has no `not-started` keywords:** Flag to user — content plan needs expansion before next post.
**If Agent 05 CRITICAL items fail:** Return list of violations. Agent 04 fixes them. Re-run Agent 05. Only surface to user after PASS.
**If deploy checklist has any unchecked item:** Do not push. Resolve the item first.

---

## Success Criteria

- [ ] Zero agent references to `master_keywords_cleaned.csv` for content decisions
- [ ] Zero agent references to Claude API for Netlify functions
- [ ] Every blog post publish follows the blog-publishing-sop.md sequence
- [ ] Agent 05 CRITICAL checklist blocks publishing when violations exist
- [ ] `internal-linking-map.md` populated for all 13 existing posts
- [ ] `content-plan.md` has deprecation notice at top
- [ ] `README.md` is no longer empty
- [ ] `DOCS.md` exists and indexes all documentation
- [ ] Superseded CSVs archived to `research/keywords/archive/`
- [ ] Monthly AI SEO checklist has an owner (Agent 07)
