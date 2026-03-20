# Content Ecosystem Restructure Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical bugs in the agent system, add missing SOPs/templates, and enforce content quality gates — so every blog post, pSEO page, and microtool is produced through an unambiguous, mistake-resistant workflow that maximises impressions, CTR, and high-quality traffic.

**Architecture:** Hybrid approach — all existing files stay in place (no path breaks), bugs are fixed in-place, new infrastructure (SOPs, templates, navigation index, ICP doc) added to `docs/`. Agent files patched to reference new infrastructure and enforce hard gates at critical decision points.

**Spec:** `docs/superpowers/specs/2026-03-20-content-ecosystem-restructure-design.md`

**Tech Stack:** Markdown, MDX, Astro 5, Netlify, sot_master.csv (keyword SSOT)

---

## Chunk 1: Critical Bug Fixes

> Fix the three agent bugs that cause wrong CSV references and wrong API usage. These are highest priority — every keyword decision and microtool build is currently broken at the source.

### Task 1: Fix Agent 02 — Wrong CSV Reference

**Files:**
- Modify: `agents/02-keyword-researcher.md`

**What's wrong:** Step 2 tells Agent 02 to read `master_keywords_cleaned.csv` (16,052 raw keywords, no status/cluster curation). The SSOT is `sot_master.csv` (347 curated rows with `status`, `content_type`, `target_slug`, `priority_score`).

- [ ] **Step 1: Verify the bug**

```bash
grep -n "master_keywords_cleaned" agents/02-keyword-researcher.md
```
Expected output: line ~10 and ~22 referencing the wrong file.

- [ ] **Step 2: Fix the Source Files section**

In `agents/02-keyword-researcher.md`, replace:
```
- `research/keywords/master_keywords_cleaned.csv` — 16,052 keywords. Columns: keyword, search_volume, keyword_difficulty (GKP proxy: LOW/MEDIUM/HIGH), cpc, search_intent, topic_cluster, priority_score
- `research/keywords/cluster_summary.csv` — 15 clusters ranked by avg priority. Top: youtube_seo (0.481), youtube_analytics (0.478), youtube_algorithm (0.477), youtube_monetization (0.473)
```
With:
```
- `research/keywords/sot_master.csv` — 347 curated keywords. **SINGLE SOURCE OF TRUTH.** Columns: rank, keyword, search_volume, cpc_usd, keyword_difficulty, intent, cluster, content_type (blog|tool|pseo_for|pseo_vs), target_slug, status (live|planned|not-started), source, priority_score. Use ONLY this file for content decisions. Never use `master_keywords_cleaned.csv` directly.
- `research/keywords/cluster_summary.csv` — 16 clusters ranked by avg priority.
```

- [ ] **Step 3: Fix Step 2 — Filter the CSV**

Replace Step 2 filter instructions to add the `status` gate:
```
### Step 2 — Filter the CSV
Read `sot_master.csv`. Filter by:
1. `status = not-started` — MANDATORY first filter. Never recommend keywords with status `live` or `planned`.
2. Matching cluster or topic
3. KD = LOW first, then MEDIUM (avoid HIGH unless priority_score > 0.6)
4. search_intent matches the content goal
5. priority_score > 0.4 preferred
```

- [ ] **Step 4: Verify fix**

```bash
grep -n "master_keywords_cleaned" agents/02-keyword-researcher.md
```
Expected output: no matches (file no longer referenced).

```bash
grep -n "sot_master" agents/02-keyword-researcher.md
```
Expected output: 2+ matches confirming correct reference.

- [ ] **Step 5: Commit**

```bash
git add agents/02-keyword-researcher.md
git commit -m "fix: agent 02 — use sot_master.csv (SSOT) not raw keyword CSV"
```

---

### Task 2: Fix Agent 08 — Wrong CSV Reference

**Files:**
- Modify: `agents/08-microtool-builder.md`

**What's wrong:** Phase 2, Step 2a references `master_keywords_cleaned.csv`. Same bug as Agent 02.

- [ ] **Step 1: Verify the bug**

```bash
grep -n "master_keywords_cleaned" agents/08-microtool-builder.md
```
Expected: at least 2 matches.

- [ ] **Step 2: Fix Phase 2 Step 2a**

Replace:
```
Read `research/keywords/master_keywords_cleaned.csv`. Search for keywords that match the tool's core function. Filter for:
- High priority_score (>0.3)
- search_intent = `tool` or `informational` (people researching, not buying yet)
- Reasonable search_volume (>500/month)
```
With:
```
Read `research/keywords/sot_master.csv` (SSOT — 347 curated keywords). Search for keywords matching the tool's core function. Filter for:
- `status = not-started` — mandatory first filter
- `content_type = tool` preferred; `informational` acceptable
- priority_score > 0.3
- search_volume > 500/month
```

- [ ] **Step 3: Fix the Key File References section at the bottom**

Replace:
```
- Keyword data: `research/keywords/master_keywords_cleaned.csv`
```
With:
```
- Keyword data: `research/keywords/sot_master.csv` (SSOT — use this, not master_keywords_cleaned.csv)
```

- [ ] **Step 4: Verify fix**

```bash
grep -n "master_keywords_cleaned" agents/08-microtool-builder.md
```
Expected output: no matches.

- [ ] **Step 5: Commit**

```bash
git add agents/08-microtool-builder.md
git commit -m "fix: agent 08 — use sot_master.csv (SSOT) not raw keyword CSV"
```

---

### Task 3: Fix Agent 08 — Wrong API (Claude → Gemini Flash)

**Files:**
- Modify: `agents/08-microtool-builder.md`

**What's wrong:** Phase 4 AI-powered tools section says "Use `claude-haiku-4-5-20251001`". All 4 existing Netlify functions use Gemini Flash. The Claude reference will cause any new function to be built with the wrong API, wrong error codes (502 instead of 503), and wrong rate-limit handling.

- [ ] **Step 1: Locate the Claude reference**

```bash
grep -n "claude-haiku\|Claude API\|claude_api\|anthropic" agents/08-microtool-builder.md
```
Expected: "claude-haiku-4-5-20251001" on one or more lines.

- [ ] **Step 2: Replace the AI tool build instructions**

Find this block in Phase 4:
```
*For AI-powered tools (Netlify Function + Claude API):*
- Step 1: Input (textarea or form fields)
- Step 2: Loading state ("Analyzing...")
- Step 3: AI output in structured format
- Step 4: localStorage rate limit check — show email gate after N uses
- Use fetch to `/api/[function-name]`
```
And below it where it says `claude-haiku-4-5-20251001`, replace the full AI tools paragraph with:

```
*For AI-powered tools (Netlify Function + Gemini Flash API):*
- Step 1: Input (textarea or form fields)
- Step 2: Loading state ("Analyzing...")
- Step 3: AI output in structured format
- Step 4: localStorage rate limit check — show email gate after N uses
- Use fetch to `/api/[function-name]`

**Gemini Flash standard (mandatory for ALL Netlify function tools):**
- Model: `gemini-flash-latest` (auto-updating alias — never pin to a versioned model like `gemini-2.5-flash`)
- API URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`
- API key: `GEMINI_API_KEY` env var in Netlify (also accepts `GOOGLE_API_KEY` as fallback). Key must be from Google AI Studio (aistudio.google.com) — NOT Vertex AI.
- maxOutputTokens: 2048 minimum (Gemini 2.5 uses thinking tokens that count against this limit — 800 causes truncated JSON)
- **NEVER return HTTP 502** from Netlify functions — Cloudflare intercepts 502 and replaces the body with `error code: 502`. Use **HTTP 503** for upstream API failures.
- If Gemini returns 429: return `{ error: 'quota_exceeded' }` with HTTP 429. Do NOT pass through Gemini's raw error.
- Frontend 429 handling: check `res.status === 429` explicitly. Show user-facing notice: "AI alternatives are at capacity right now. Free daily limit reached. Check back tomorrow."
- Error responses must include `geminiStatus` and `detail` fields for debuggability without Netlify logs.
- Reference implementation: `netlify/functions/generate-alternatives.ts` + `src/pages/tools/youtube-topic-evaluator.astro`
```

- [ ] **Step 3: Verify fix**

```bash
grep -n "claude-haiku\|Claude API" agents/08-microtool-builder.md
```
Expected: no matches.

```bash
grep -n "gemini-flash-latest\|Gemini Flash" agents/08-microtool-builder.md
```
Expected: multiple matches confirming the correct standard is in place.

- [ ] **Step 4: Commit**

```bash
git add agents/08-microtool-builder.md
git commit -m "fix: agent 08 — replace Claude API reference with Gemini Flash standard"
```

---

### Task 4: Fix growth-strategy.md — Wrong API Reference

**Files:**
- Modify: `growth-strategy.md`

- [ ] **Step 1: Locate the reference**

```bash
grep -n "Claude API\|claude" growth-strategy.md
```
Expected: one line in Section B (Microtools).

- [ ] **Step 2: Fix the reference**

Replace:
```
- Tools 5–7: Netlify Functions + Claude API
```
With:
```
- Tools 5–7: Netlify Functions + Gemini Flash API (see `agents/08-microtool-builder.md` for the mandatory Gemini Flash integration pattern)
```

- [ ] **Step 3: Verify fix**

```bash
grep -n "Claude API" growth-strategy.md
```
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add growth-strategy.md
git commit -m "fix: growth-strategy — correct API reference from Claude to Gemini Flash"
```

---

## Chunk 2: New Infrastructure Files

> Create the navigation index, project README, canonical ICP doc, and archive superseded keyword CSVs.

### Task 5: Populate README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Confirm current state**

```bash
wc -l README.md
```
Expected: 1 (empty file confirmed).

- [ ] **Step 2: Write the README**

Replace the contents of `README.md` with:

```markdown
# SellonTube

**B2B YouTube acquisition for founders, SaaS operators, and service businesses.**

Live site: [sellontube.com](https://sellontube.com)

---

## Stack

- **Framework:** Astro 5 (static site generation)
- **Styling:** Tailwind CSS
- **Content:** MDX blog posts + TypeScript data files for pSEO pages
- **Hosting:** Netlify (with serverless functions)
- **AI tools:** Gemini Flash API (via Netlify Functions)

---

## Content System

Three content pillars — all documented in `DOCS.md`:

| Pillar | Volume | Cadence | Key files |
|---|---|---|---|
| **Blog** | 13 posts | 1/week (max 2) | `src/data/post/` |
| **pSEO pages** | 31 niches + 23 comparisons | ~4/week drip | `src/data/niches.ts`, `src/data/comparisons.ts` |
| **Microtools** | 4 live, 3 planned | Build by priority | `src/pages/tools/`, `netlify/functions/` |

---

## Agent System

Content marketing and SEO work is handled by a 9-file agent system.

**To use:** speak naturally. Agents auto-route.
- "write a post about X" → Agent 04 (blog writer)
- "what should I write about" → Agent 02 (keyword researcher)
- "weekly SEO check" → Agent 01 (GSC intelligence)
- Full routing table: `agents/README.md`

---

## Key Rules

1. **Never push to live without explicit user approval** — every push requires separate approval
2. **Blog cadence: max 1/week, hard ceiling 2/week** — always count before scheduling
3. **pSEO publishDates are IST (UTC+5:30)** — Netlify builds UTC — check before deploying
4. **Keyword SSOT:** `research/keywords/sot_master.csv` — use this, not raw CSVs
5. **Gemini Flash is the API standard** for all Netlify functions — see `agents/08-microtool-builder.md`

---

## Documentation

All docs indexed at `DOCS.md`.
```

- [ ] **Step 3: Verify**

```bash
wc -l README.md
```
Expected: 50+ lines.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: populate README with project overview and key rules"
```

---

### Task 6: Create DOCS.md — Master Navigation Index

**Files:**
- Create: `DOCS.md`

- [ ] **Step 1: Create the file**

```markdown
# SellonTube Documentation Index

All project documentation in one place. Start here.

---

## Content Standards (read before writing anything)

| Doc | Purpose |
|---|---|
| [`style-guide.md`](style-guide.md) | Writing rules: em-dash ban, AI pattern detection, sentence structure, tone. **Mandatory for ALL copy.** |
| [`content-playbook.md`](content-playbook.md) | Quality standards: priority score formula, blog cadence, excerpt rules, quality checklist. |
| [`seo-rules.md`](seo-rules.md) | SEO cheat sheet: URL structure, canonicals, redirects, pSEO IST timezone. **Read before any SEO decision.** |
| [`ai-seo-guide.md`](ai-seo-guide.md) | AI citation optimisation: AEO/GEO content blocks, robot access, schema priority, monthly checklist. |

---

## Strategy

| Doc | Purpose |
|---|---|
| [`growth-strategy.md`](growth-strategy.md) | Three pillars (pSEO, microtools, blog), cadence rules, backlink tactics, success metrics. |
| [`microtool-strategy.md`](microtool-strategy.md) | Full tool pipeline (7 tools), build order, keyword targets, Gemini Flash integration pattern. |
| [`seo-audit-log.md`](seo-audit-log.md) | Audit history, P0/P1/P2 fixes resolved, GSC indexation strategy. |

---

## Content Plan (SSOT is the CSV)

| Doc | Purpose |
|---|---|
| [`research/keywords/sot_master.csv`](research/keywords/sot_master.csv) | **SINGLE SOURCE OF TRUTH** — 347 curated keywords with status, cluster, priority_score, content_type. Use for all content decisions. |
| [`research/keywords/content-plan.md`](research/keywords/content-plan.md) | ⚠️ DEPRECATED — editorial notes only. Data is stale. Use `sot_master.csv` for all decisions. |

---

## SOPs (Standard Operating Procedures)

| Doc | When to use |
|---|---|
| [`docs/sops/blog-publishing-sop.md`](docs/sops/blog-publishing-sop.md) | Before publishing any blog post — full 13-step gate sequence |
| [`docs/sops/pseo-publishing-sop.md`](docs/sops/pseo-publishing-sop.md) | Before any pSEO page goes live |
| [`docs/sops/deploy-checklist.md`](docs/sops/deploy-checklist.md) | Before every `git push` |
| [`docs/sops/content-refresh-sop.md`](docs/sops/content-refresh-sop.md) | Monthly/quarterly post update workflow |
| [`docs/sops/ctr-optimization-sop.md`](docs/sops/ctr-optimization-sop.md) | When Agent 01 flags a quick-win (position 5–20, low CTR) |
| [`docs/sops/monthly-ai-seo-checklist.md`](docs/sops/monthly-ai-seo-checklist.md) | Monthly — owned by Agent 07 |

---

## Templates

| Doc | When to use |
|---|---|
| [`docs/templates/content-brief-template.md`](docs/templates/content-brief-template.md) | Fill in before every blog post outline starts |
| [`docs/templates/internal-linking-map.md`](docs/templates/internal-linking-map.md) | Living doc — update every time a post publishes |

---

## ICP

| Doc | Purpose |
|---|---|
| [`docs/icp.md`](docs/icp.md) | Canonical Ideal Customer Profile definition. All agents reference this. |

---

## Agent System

| Doc | Purpose |
|---|---|
| [`agents/README.md`](agents/README.md) | Routing table — which natural language triggers which agent |
| [`agents/master.md`](agents/master.md) | Orchestrator — multi-agent sequences |
| [`agents/01-gsc-intelligence.md`](agents/01-gsc-intelligence.md) | GSC/GA4 analysis and quick wins |
| [`agents/02-keyword-researcher.md`](agents/02-keyword-researcher.md) | Keyword selection from `sot_master.csv` |
| [`agents/03-content-planner.md`](agents/03-content-planner.md) | 4-week calendar, cadence enforcement |
| [`agents/04-blog-writer.md`](agents/04-blog-writer.md) | Blog writing (outline-first) |
| [`agents/05-content-qa.md`](agents/05-content-qa.md) | Style guide QA — CRITICAL/IMPORTANT/ADVISORY tiers |
| [`agents/06-pseo-manager.md`](agents/06-pseo-manager.md) | pSEO drip schedule and publishDate checks |
| [`agents/07-technical-seo.md`](agents/07-technical-seo.md) | Redirects, schema, technical health, monthly AI SEO checklist |
| [`agents/08-microtool-builder.md`](agents/08-microtool-builder.md) | Microtool creation (Gemini Flash standard) |
```

- [ ] **Step 2: Verify the file exists**

```bash
ls -la DOCS.md
```
Expected: file exists, non-zero size.

- [ ] **Step 3: Commit**

```bash
git add DOCS.md
git commit -m "docs: add DOCS.md master navigation index"
```

---

### Task 7: Create docs/icp.md — Canonical ICP Definition

**Files:**
- Create: `docs/icp.md`

- [ ] **Step 1: Create the file**

```markdown
# SellonTube — Ideal Customer Profile (ICP)

> **This is the canonical ICP definition.** All agents reference this file. Do not duplicate this content inline in agent files.

---

## Primary Audience

**B2B founders, SaaS operators, and service businesses** evaluating YouTube as a customer acquisition and lead generation channel.

**More specifically:**
- Founders and operators at companies with $1M+ revenue or high-ticket offers ($2,000+ per client)
- Businesses where a single new client is worth $5,000–$50,000+ in LTV
- Companies already doing some content marketing but not yet using YouTube strategically
- Business owners who are sceptical of YouTube because they associate it with creators, not business growth

---

## NOT the Audience

- Hobbyist creators and YouTubers growing channels for entertainment
- Influencers optimising for subscriber count or view count
- Businesses chasing viral content or trending topics
- Anyone whose primary goal is "audience building" as an end in itself

---

## ICP Lens Rule

Every section of every piece of content must answer:

> "Why does this matter for a business trying to acquire customers?"

NOT: "How do I grow my YouTube channel?"

If a piece of content could appear on VidIQ or TubeBuddy without modification, it fails the ICP test. SellonTube's angle is always **YouTube as a revenue channel**, not YouTube as a content platform.

---

## ICP Fit Test (apply to every keyword, topic, and tool)

Ask these three questions:

1. **Would a B2B founder search this?** (Not a creator, not a hobbyist)
2. **Does the topic connect to revenue, leads, acquisition, or pipeline?** (Not views, subs, engagement, virality)
3. **Is the angle differentiated from creator-focused tools like VidIQ or TubeBuddy?** (If not, reframe or skip)

If all three answers are yes: ICP fit confirmed.
If any answer is no: reframe the angle or exclude.

---

## Example ICP-Fit vs. ICP-Fail Topics

| Topic | ICP fit? | Why |
|---|---|---|
| "YouTube lead generation for SaaS" | Yes | Revenue-connected, B2B-specific |
| "How to get more YouTube subscribers" | No | Creator metric, no business angle |
| "YouTube marketing ROI calculator" | Yes | Business tool, acquisition framing |
| "Best YouTube title generator" | Borderline | Only ICP fit if framed for B2B buyer intent |
| "YouTube analytics for other channels" | Yes | Business intelligence angle |
| "How to go viral on YouTube" | No | Creator goal, not business goal |
| "YouTube for financial advisors" | Yes | Niche B2B acquisition use case |
```

- [ ] **Step 2: Verify**

```bash
ls -la docs/icp.md
```
Expected: file exists, non-zero size.

- [ ] **Step 3: Commit**

```bash
git add docs/icp.md
git commit -m "docs: add canonical ICP definition to docs/icp.md"
```

---

### Task 8: Archive Superseded Keyword CSVs

**Files:**
- Create: `research/keywords/archive/` directory
- Move: `research/keywords/sot_keywords_final.csv` → `research/keywords/archive/`
- Move: `research/keywords/sot_keywords.csv` → `research/keywords/archive/`

- [ ] **Step 1: Confirm the files exist and are superseded**

```bash
ls research/keywords/
```
Expected: `sot_master.csv`, `master_keywords_cleaned.csv`, `sot_keywords_final.csv`, `sot_keywords.csv`, `cluster_summary.csv`, `corrections_log.csv`, `content-plan.md`, `video_ideas_generator_keywords.csv`

- [ ] **Step 2: Create archive directory and move files**

```bash
mkdir -p research/keywords/archive
mv "research/keywords/sot_keywords_final.csv" "research/keywords/archive/"
mv "research/keywords/sot_keywords.csv" "research/keywords/archive/"
```

- [ ] **Step 3: Add README to archive folder**

Create `research/keywords/archive/README.md`:
```markdown
# Archived Keyword Files

These files are intermediate pipeline outputs, superseded by `sot_master.csv`.

Do NOT use for content decisions.

| File | Why archived |
|---|---|
| `sot_keywords_final.csv` | Input to `build_sot_master.py` — superseded by `sot_master.csv` |
| `sot_keywords.csv` | Earlier iteration — superseded by `sot_master.csv` |

To regenerate `sot_master.csv` from scratch: run `scripts/build_sot_master.py`.
```

- [ ] **Step 4: Verify**

```bash
ls research/keywords/archive/
```
Expected: `sot_keywords_final.csv`, `sot_keywords.csv`, `README.md`

```bash
ls research/keywords/
```
Expected: `sot_master.csv` and other active files — archived files no longer at top level.

- [ ] **Step 5: Commit**

```bash
git add research/keywords/archive/
git add research/keywords/
git commit -m "chore: archive superseded keyword CSVs — sot_master.csv is SSOT"
```

---

### Task 9: Deprecate content-plan.md

**Files:**
- Modify: `research/keywords/content-plan.md`

- [ ] **Step 1: Add deprecation notice at top**

Insert at the very top of `research/keywords/content-plan.md` (before any existing content):

```markdown
> ⚠️ **DEPRECATED — DO NOT USE FOR DECISIONS**
>
> This document is no longer maintained. The data here is stale (last updated 2026-03-10, current date 2026-03-20).
>
> **Use `research/keywords/sot_master.csv` instead.** It is the single source of truth for all content decisions: keyword status, publish dates, priority scores, and content types.
>
> The editorial notes and rationale sections below are preserved for historical reference only.

---

```

- [ ] **Step 2: Verify the notice is at the top**

```bash
head -10 research/keywords/content-plan.md
```
Expected: deprecation notice appears before any other content.

- [ ] **Step 3: Commit**

```bash
git add research/keywords/content-plan.md
git commit -m "docs: deprecate content-plan.md — redirect to sot_master.csv"
```

---

## Chunk 3: SOPs

> Create the 6 missing Standard Operating Procedures. These are the enforcement layer that prevents repeated mistakes.

### Task 10: Create Blog Publishing SOP

**Files:**
- Create: `docs/sops/blog-publishing-sop.md`

- [ ] **Step 1: Ensure directory exists**

```bash
mkdir -p docs/sops
```

- [ ] **Step 2: Create the SOP**

```markdown
# Blog Publishing SOP

> Run this every time. No exceptions. Every step is a gate — if a step fails, fix it before proceeding.

---

## Pre-Write Gates

- [ ] **1. Keyword confirmed in `sot_master.csv`**
  - Read `research/keywords/sot_master.csv`
  - Find the target keyword row
  - Confirm `status = not-started`
  - If `status = live` or `planned`: STOP — do not proceed, flag to user

- [ ] **2. Cannibalization check**
  - Search all files in `src/data/post/` for the target keyword in titles and frontmatter
  - Search `src/data/niches.ts` and `src/data/comparisons.ts` for overlap
  - If overlap found: STOP — flag to user before proceeding

- [ ] **3. Fill in content brief**
  - Copy `docs/templates/content-brief-template.md`
  - Fill in: primary keyword, secondary keywords, intent, cluster, priority score, target word count, publish date, target URL, ICP angle, internal links to include, featured image path, competing pages
  - Show brief to user before starting outline

- [ ] **4. Confirm open calendar slot (Agent 03)**
  - Read all `publishDate` values in `src/data/post/*.{md,mdx}`
  - Count posts per rolling 7-day window
  - Confirm the proposed publish date does not put any 7-day window above 2 posts
  - If violation: propose next open slot

---

## Write Gates

- [ ] **5. Outline produced and user-approved (Agent 04 Phase 1)**
  - Produce outline using `agents/04-blog-writer.md` Phase 1 format
  - STOP — show outline to user — wait for explicit approval before writing

- [ ] **6. Full draft written (Agent 04 Phase 2)**
  - Write complete MDX with all required frontmatter fields

- [ ] **7. Featured image created**
  - Create SVG matching Fix #17 spec from `style-guide.md`:
    - Canvas: `viewBox="0 0 1200 675" width="1200" height="675"` (true 16:9)
    - Background: `#030620` → `#0a1540` gradient
    - Centered layout: all text at `text-anchor="middle" x="600"`
    - Title: exactly 2 lines at 90px/800 weight
    - Title lines contain NO numbers
    - Gradient text: `fill="url(#gradText)"` with `gradientUnits="userSpaceOnUse"` x1=300 x2=900
    - Category pill centred x=600, label UPPERCASE, `#60a5fa` fill
    - Footer: "SellOnTube" bold + " — YouTube Acquisition for B2B" muted
    - Font: `'Inter', ui-sans-serif, system-ui, sans-serif`
  - Filename: `[post-slug]-featured.svg`
  - Save to: `src/assets/images/blog/[post-slug]-featured.svg`
  - Update frontmatter `image` field to match

- [ ] **8. Internal links added**
  - Add at least 1 link to a relevant SellonTube tool at a natural decision moment
  - Add at least 1 link to a related blog post or pSEO page
  - Update `docs/templates/internal-linking-map.md` with new links

---

## QA Gate

- [ ] **9. Agent 05 QA: CRITICAL tier — all must PASS**
  - Grep file for `—` (em-dash) — must return zero matches
  - Check excerpt: does NOT start with "A practical guide", "This post covers", "In this article", "Learn how to"
  - Check excerpt: contains at least one specific claim, number, or hook
  - Check title: no filler opener, primary keyword near start, ≤ 65 chars
  - Check frontmatter: publishDate, title, excerpt, category, metadata.canonical, image all present
  - Check ICP: B2B framing, no creator metrics
  - Check body: no passive hedging, no filler transitions
  - **ZERO CRITICAL violations = PASS. Any critical violation = FAIL. Fix and re-run.**

- [ ] **10. Agent 05 QA: IMPORTANT tier — all must be resolved**
  - Content structure (Fix #13 patterns): Key Takeaways box, TOC, section structure
  - AEO/GEO citation blocks present where applicable
  - Author bio present at end of post
  - CTA rules: bottom CTA = book a call; any mid-body CTA follows tool-only rule
  - Internal links: at least 2 confirmed present

---

## Pre-Push Gates

- [ ] **11. publishDate confirmed IST-correct**
  - Format: `YYYY-MM-DD` (treated as `T00:00:00+05:30` by Astro)
  - If deploying before 05:30 IST: page won't appear until 05:30 IST — flag this to user

- [ ] **12. metadata.canonical matches URL path**
  - Canonical URL: `https://sellontube.com/[slug]`
  - Must match the file's actual route

- [ ] **13. Featured image file exists**
  - Grep the `image:` field from frontmatter
  - Confirm the referenced SVG file exists at that path

---

## Deploy and Post-Publish

- [ ] **14. Present final file + QA report to user — wait for explicit "yes"**

- [ ] **15. Commit (only after explicit user approval of commit message)**

```bash
git add src/data/post/[slug].mdx src/assets/images/blog/[slug]-featured.svg
git commit -m "content: add [title] ([primary keyword])"
```

- [ ] **16. Push (only after separate explicit "push" approval)**

```bash
git push
```

- [ ] **17. Submit to GSC Request Indexing**
  - Go to GSC → URL Inspection → enter the live URL → Request Indexing

- [ ] **18. Update sot_master.csv**
  - Change the target keyword row: `status` → `live`

- [ ] **19. Update internal-linking-map.md**
  - Add all links from this post to the map
  - Check if any existing posts should now link to this new post — add if so
```

- [ ] **Step 3: Verify**

```bash
wc -l docs/sops/blog-publishing-sop.md
```
Expected: 100+ lines.

- [ ] **Step 4: Commit**

```bash
git add docs/sops/blog-publishing-sop.md
git commit -m "docs: add blog publishing SOP — 19-step enforcement gate"
```

---

### Task 11: Create pSEO Publishing SOP

**Files:**
- Create: `docs/sops/pseo-publishing-sop.md`

- [ ] **Step 1: Create the file**

```markdown
# pSEO Publishing SOP

> Use before any new pSEO page template goes live, or before a new niche/comparison entry is added to `niches.ts` or `comparisons.ts`.

---

## Pre-Launch Checklist

- [ ] Every page provides unique value specific to that slug — not just variable substitution
- [ ] H1 and H2 headings are present and meaningful (not generic placeholders)
- [ ] Schema markup is implemented (check `src/components/common/JsonLd.astro`)
- [ ] Internal links: page links to its hub (`/youtube-for/` or `/youtube-vs/`) and at least 1 related page
- [ ] No keyword cannibalization — no existing blog post already targets the same query
- [ ] publishDate IST→UTC timing verified for the planned deploy
- [ ] `niches.ts` / `comparisons.ts` entry count matches Agent 06's documented count

## Timezone Check (mandatory before any pSEO deploy)

Netlify builds in UTC. publishDates are IST (UTC+5:30).

A page with `publishDate: 2026-03-10` goes live at `2026-03-09T18:30:00 UTC` (midnight IST Mar 10).

**Critical:** If deploying before 05:30 IST, the page intended for "today" will not appear until 05:30 IST.

```
IST time → UTC equivalent
00:00 IST = 18:30 UTC previous day
05:30 IST = 00:00 UTC same day
12:00 IST = 06:30 UTC same day
```

## Drip Rate Check

Target: ~4 pages/week. Run Agent 06 before any batch release.

- If any week has 0 pages: flag gap in drip
- If any week has > 6 pages: flag risk of Google templated-content flag
- Never suggest publishing all pages at once

## YouTube Vs. Page Standards

Every `/youtube-vs/[slug]` page must include:

1. **Honesty section:** What YouTube is NOT good for in this comparison context
2. **Who it's for section:** When to choose YouTube, when to choose the alternative — using ✅/❌ decision block format
3. **Depth beyond tables:** Each major difference explained in prose with B2B business implication

## Post-Launch Monitoring (first 30 days)

- Submit each new page to GSC Request Indexing on publish day
- If no impressions after 3 weeks: page likely needs more unique content depth
- Track target keyword positions within 30 days
- Low time-on-page or high bounce = thin content signal
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/pseo-publishing-sop.md
git commit -m "docs: add pSEO publishing SOP"
```

---

### Task 12: Create Deploy Checklist

**Files:**
- Create: `docs/sops/deploy-checklist.md`

- [ ] **Step 1: Create the file**

```markdown
# Deploy Checklist

> Run before every `git push`. This is the final gate before content goes live.

---

## Before Every Push

- [ ] **QA result:** Agent 05 CRITICAL tier = PASS (zero violations)
- [ ] **Blog cadence:** Posts in the proposed publish week counted — no 7-day window exceeds 2 posts
- [ ] **publishDate:** IST timezone verified (format `YYYY-MM-DD`, treated as `T00:00:00+05:30`)
- [ ] **UTC check:** If current IST time is before 05:30, the page will not appear until 05:30 IST — flag this to user if they expect it live immediately
- [ ] **metadata.canonical:** Correct URL path (`https://sellontube.com/[slug]`)
- [ ] **Featured image:** File exists at the path referenced in frontmatter `image:` field
- [ ] **Internal links:** At least 2 internal links confirmed in the post body

## Approval Gates (sequential — do not combine)

- [ ] **Commit approval:** Show user the commit message. Wait for explicit "yes". THEN commit.
- [ ] **Push approval:** After commit completes, show user the push command. Wait for separate explicit "push" instruction. THEN push.

> **Never combine commit + push into one action. These are two separate approvals.**

## Post-Push Actions

- [ ] **GSC Request Indexing:** Submit the live URL via GSC URL Inspection tool
- [ ] **sot_master.csv:** Update the target keyword row `status` → `live`
- [ ] **internal-linking-map.md:** Updated with new post's links
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/deploy-checklist.md
git commit -m "docs: add deploy checklist — pre-push gate sequence"
```

---

### Task 13: Create Content Refresh SOP

**Files:**
- Create: `docs/sops/content-refresh-sop.md`

- [ ] **Step 1: Create the file**

```markdown
# Content Refresh SOP

> Keeps existing posts fresh for AI citation and search ranking. Stale content loses citations.

## Frequency

| Post cluster | Frequency |
|---|---|
| Top 3 priority clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`) | Monthly |
| All other posts | Quarterly (every 90 days) |

## Refresh Steps

- [ ] **1. Read the current post in full**

- [ ] **2. Check for outdated statistics**
  - Find any stat with a year or date reference
  - If more recent data exists from a reputable source, update it
  - If the stat is current and still accurate, leave it

- [ ] **3. Add one new FAQ question**
  - Check current GSC data for "People Also Ask" queries related to this post's keyword
  - Add the most relevant unanswered question + a direct 50-100 word answer
  - Pair with FAQPage JSON-LD if schema is implemented

- [ ] **4. Update "What to do this week" box**
  - Replace the action items with fresh, timely advice relevant to the current date
  - Must be specific — not generic. Think: what would a consultant say on a call today?

- [ ] **5. Add internal links to new content**
  - Check `docs/templates/internal-linking-map.md` for posts/tools published since last refresh
  - Insert at least 1 new internal link where genuinely relevant

- [ ] **6. Run Agent 05 QA on the updated file**
  - All CRITICAL violations must pass before proceeding

- [ ] **7. Push**

```bash
git add src/data/post/[slug].mdx
git commit -m "content: refresh [post-slug] — [what changed in one line]"
git push
```
(Follow deploy-checklist.md gates)

- [ ] **8. Submit to GSC Request Indexing**

- [ ] **9. Update publishDate only if meaningful content was added**
  - Cosmetic fixes (typos, formatting) do NOT warrant a publishDate change
  - New sections, new stats, new FAQ = update publishDate

- [ ] **10. Note in seo-audit-log.md**
  - Add one line: `[date] — Refreshed [slug]: [what changed]`
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/content-refresh-sop.md
git commit -m "docs: add content refresh SOP — monthly/quarterly update workflow"
```

---

### Task 14: Create CTR Optimization SOP

**Files:**
- Create: `docs/sops/ctr-optimization-sop.md`

- [ ] **Step 1: Create the file**

```markdown
# CTR Optimization SOP

> Triggered when Agent 01 identifies a quick-win page: position 5–20, impressions > 0, CTR below average.

## When to Run This

Agent 01 flags pages in position 5–20 with low CTR. These are the highest-ROI improvement opportunities — the page already ranks, it just isn't being clicked.

## Steps

- [ ] **1. Read current title and meta description**
  - Check the page's frontmatter `title` and `metadata.description` (or the component pulling them)

- [ ] **2. Title audit**
  - Is the primary keyword in the first 3 words?
  - Is it ≤ 60 characters?
  - Does it open with a filler word ("The Hidden Power of", "Why Most", "The Ultimate Guide")?
  - Does it describe the article instead of selling the click?
  - Does it use insider jargon the ICP wouldn't search?

- [ ] **3. Meta description audit**
  - Does it start with a specific claim or question? (Not "A comprehensive guide...")
  - Does it state what the reader gets in ≤ 10 words?
  - Does it contain at least one specific number or outcome?
  - Is it ≤ 155 characters?
  - Does it end with a soft CTA or clear value signal?

- [ ] **4. Write 2 alternative title options**
  - Run each through Agent 05 title rules before presenting
  - Each option must: start with primary keyword, be ≤ 60 chars, sell the click

- [ ] **5. Write 1 alternative meta description**
  - Must: contain specific claim, ≤ 155 chars, no filler openers, no em-dashes

- [ ] **6. Present to user**
  - Show: current title + meta, 2 new title options, 1 new meta description
  - Include rationale for each option (what CTR problem it solves)
  - Wait for explicit approval

- [ ] **7. On approval: update frontmatter**

- [ ] **8. Follow deploy-checklist.md gates and push**

- [ ] **9. Log in seo-audit-log.md**
  - `[date] — CTR rewrite: [slug] — old title: "[old]" → new: "[new]"`

- [ ] **10. Re-check in GSC after 4 weeks**
  - Did CTR improve? Note outcome in `seo-audit-log.md`
  - If no improvement after 4 weeks: try the second title option
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/ctr-optimization-sop.md
git commit -m "docs: add CTR optimization SOP"
```

---

### Task 15: Create Monthly AI SEO Checklist

**Files:**
- Create: `docs/sops/monthly-ai-seo-checklist.md`

- [ ] **Step 1: Create the file**

```markdown
# Monthly AI SEO Checklist

> **Owner: Agent 07.** Run once per month as part of the weekly SEO review.
> Extracted from `ai-seo-guide.md` §10 — that section is the canonical source; this is the executable SOP.

## Run This Monthly

- [ ] **1. Verify all AI bots are allowed**
  - Check `public/robots.txt` and `netlify.toml`
  - Confirm none of these are blocked: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`
  - If any are blocked: flag as critical — fix immediately

- [ ] **2. Check SellonTube appears in Brave Search**
  - Go to `search.brave.com`
  - Search for 3–5 core keywords (e.g. "YouTube marketing for B2B", "YouTube ROI calculator", "YouTube lead generation")
  - Confirm SellonTube appears in results for at least 3 of them
  - If not appearing: check if ClaudeBot / anthropic-ai are blocked (Brave powers Claude citations)

- [ ] **3. Update at least 2 high-priority blog posts**
  - Select 2 posts from top priority clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`)
  - Follow `docs/sops/content-refresh-sop.md` for each
  - What counts as an update: new section, refreshed stat, new FAQ, updated "What to do this week"
  - Simply changing publishDate without content changes does NOT count

- [ ] **4. Submit updated URLs to GSC + IndexNow**
  - GSC: URL Inspection → Request Indexing for each refreshed URL
  - IndexNow: run `scripts/indexnow-ping.js` for the updated URLs

- [ ] **5. Check for AI Overviews impressions in GSC**
  - In GSC, filter by "Search type: Web" — look for pages with "AI Overview" impressions
  - Note which pages are being cited
  - If a page is getting AI Overview impressions but low CTR: prioritise its CTR optimization

- [ ] **6. Review schema implementation status**
  - Check `agents/07-technical-seo.md` Step 2 pending schemas table
  - Flag the next schema type to implement to the user
  - Priority order: FAQPage → Article → HowTo → BreadcrumbList

- [ ] **7. Log completions in seo-audit-log.md**
  - `[date] — Monthly AI SEO checklist complete. Posts refreshed: [slugs]. Schema next: [type].`
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/monthly-ai-seo-checklist.md
git commit -m "docs: add monthly AI SEO checklist SOP — owned by Agent 07"
```

---

## Chunk 4: Templates

### Task 16: Create Content Brief Template

**Files:**
- Create: `docs/templates/content-brief-template.md`

- [ ] **Step 1: Ensure directory exists**

```bash
mkdir -p docs/templates
```

- [ ] **Step 2: Create the template**

```markdown
# Content Brief

> Fill this in before starting any blog post outline. Handoff artifact: Agent 02 → Agent 03 → Agent 04.
> Copy this template for each new post. Do not modify the template itself.

---

## Keyword Data (from sot_master.csv)

**PRIMARY KEYWORD:**
**SECONDARY KEYWORDS (2–3 LSI terms):**
**SEARCH INTENT:** informational / commercial / transactional
**CLUSTER:**
**PRIORITY SCORE:**
**CONTENT TYPE:** blog
**SOURCE ROW FROM SOT_MASTER.CSV:** (paste the full row)

---

## Planning Data (from Agent 03)

**PUBLISH DATE (IST, format YYYY-MM-DD):**
**TARGET URL:** /blog/[slug]
**TARGET WORD COUNT:** (use Agent 04 word count guidance — listicle: 800–1200, how-to: 1200–2000, strategy: 1500–2500)

---

## Content Angle

**ICP ANGLE** (one sentence — why does this matter for a B2B founder trying to acquire customers via YouTube?):

**DIFFERENTIATION FROM TOP 3 RESULTS** (what will this post do better or differently?):

---

## Internal Links to Include

| Link type | Target | Anchor text idea | Where in the post |
|---|---|---|---|
| Tool | e.g. /tools/youtube-roi-calculator | e.g. "YouTube ROI calculator" | When discussing ROI measurement |
| Blog | e.g. /blog/youtube-marketing-b2b | e.g. "YouTube marketing for B2B" | When mentioning B2B use cases |
| pSEO | e.g. /youtube-for/saas | e.g. "YouTube for SaaS companies" | When mentioning SaaS examples |

---

## Assets

**FEATURED IMAGE FILE:** ~/assets/images/blog/[post-slug]-featured.svg
(Create this SVG before handing to Agent 05 — see blog-publishing-sop.md Step 7)

---

## Competitive Research

**COMPETING PAGES (top 3 Google results for primary keyword):**
1.
2.
3.

**What they're missing (angle gap this post fills):**

---

## Status Tracking

- [ ] Brief filled in
- [ ] Outline produced
- [ ] Outline approved by user
- [ ] Draft written
- [ ] Featured image created
- [ ] Internal links added
- [ ] Agent 05 QA: PASS
- [ ] Published
- [ ] sot_master.csv updated to `live`
```

- [ ] **Step 3: Commit**

```bash
git add docs/templates/content-brief-template.md
git commit -m "docs: add content brief template — keyword-to-publish handoff artifact"
```

---

### Task 17: Create Internal Linking Map

**Files:**
- Create: `docs/templates/internal-linking-map.md`

- [ ] **Step 1: Create the file**

Seed it with the 13 existing blog posts. For each post, document known links.

```markdown
# Internal Linking Map

> Living document. Update every time a post publishes or an existing post is edited.
> Agent 04 must check this before finalising any draft. Agent 05 verifies at least 2 internal links are present.

---

## Blog → Tool Links

| Blog post slug | Tool linked | Anchor text | Section |
|---|---|---|---|
| youtube-marketing-roi | youtube-roi-calculator | YouTube ROI calculator | ROI formula section |
| best-youtube-video-ideas-generators-for-businesses | youtube-video-ideas-evaluator | YouTube topic evaluator | Product section |

---

## Blog → pSEO Links

| Blog post slug | pSEO page | Anchor text | Section |
|---|---|---|---|
| youtube-marketing-b2b | /youtube-for/b2b-companies | YouTube for B2B companies | (add when confirmed) |

---

## Blog → Blog Links

| Source slug | Target slug | Anchor text | Topic relationship |
|---|---|---|---|
| youtube-marketing-strategy | youtube-marketing-roi | YouTube marketing ROI | ROI measurement |
| youtube-marketing-b2b | youtube-marketing-strategy | YouTube marketing strategy | Strategy reference |

---

## Unlinked Opportunities (tools with no blog links yet)

| Tool | URL | Blog posts that should link to it | Status |
|---|---|---|---|
| YouTube Transcript Generator | /tools/youtube-transcript-generator | best-youtube-transcript-generators | Check if linked |
| YouTube Video Ideas Evaluator | /tools/youtube-video-ideas-evaluator | best-youtube-video-ideas-generators-for-businesses | Check if linked |
| YouTube ROI Calculator | /tools/youtube-roi-calculator | youtube-marketing-roi, compounding-effect-four-videos-a-month | Check if linked |

---

## Notes

- Each new post must add at least 2 rows to this table on publish
- Review this map monthly — look for posts that should cross-link but don't
- When a new tool goes live, scan all blog posts for natural insertion points and add links
```

- [ ] **Step 2: Commit**

```bash
git add docs/templates/internal-linking-map.md
git commit -m "docs: add internal linking map template — seeded with existing posts"
```

---

## Chunk 5: Agent Patches

> Update all agent files to reference new infrastructure and enforce hard gates.

### Task 18: Patch Agent 03 — Add SOP Reference

**Files:**
- Modify: `agents/03-content-planner.md`

- [ ] **Step 1: Add SOP reference after Step 4**

Find the line ending "Once approved, assign the keyword to the next open calendar slot using IST dates for publishDate values" and add immediately after it:

```
Once the keyword and date are confirmed, direct the user to follow `docs/sops/blog-publishing-sop.md` — this SOP governs the full publish sequence from keyword confirmation through post-publish GSC submission.
```

- [ ] **Step 2: Verify**

```bash
grep -n "blog-publishing-sop" agents/03-content-planner.md
```
Expected: 1 match.

- [ ] **Step 3: Commit**

```bash
git add agents/03-content-planner.md
git commit -m "fix: agent 03 — reference blog publishing SOP at calendar assignment step"
```

---

### Task 19: Patch Agent 04 — Add Brief, Image, and Linking Steps

**Files:**
- Modify: `agents/04-blog-writer.md`

- [ ] **Step 1: Add brief template reference at top of Phase 1**

Find "### Phase 1 — Outline (surface to user for approval)" and insert before "Produce:" :

```
Before producing the outline, fill in `docs/templates/content-brief-template.md` with all available data (keyword, intent, publish date, ICP angle, competing pages, planned internal links). Show the completed brief to the user before starting the outline.
```

- [ ] **Step 2: Replace ICP inline paragraph with reference to icp.md**

Find the "## ICP reminder" section and replace its content with:

```
## ICP reminder
See `docs/icp.md` for the canonical ICP definition. Every section must answer "why does this matter for a business trying to acquire customers?" — not "how do I grow my channel?" If a section could appear on VidIQ or TubeBuddy without modification, reframe it.
```

- [ ] **Step 3: Add Phase 3.5 — Featured Image Creation**

After "### Phase 3 — Auto-QA" header (but before the text "After writing, hand off to Agent 05"), insert a new phase:

```
### Phase 3.5 — Featured Image Creation (before Agent 05 handoff)

Create the featured image SVG before running QA. Requirements (from `style-guide.md` Fix #17):

- Canvas: `viewBox="0 0 1200 675" width="1200" height="675"` (true 16:9)
- Background gradient: `#030620` → `#0a1540`
- All text centred: `text-anchor="middle" x="600"`
- Title: exactly 2 lines at 90px, font-weight 800. Line 1 white (`y=283`), line 2 uses gradient text
- Title lines contain NO numbers (arabic or spelled-out)
- Gradient text: `fill="url(#gradText)"` with `gradientUnits="userSpaceOnUse"` x1=300 x2=900
- Category pill: centred x=600, label UPPERCASE, `#60a5fa` fill, y positioned above title
- Divider bar at y=408, subtitle at y=450, footer wordmark at y=645
- Footer: "SellOnTube" bold + " — YouTube Acquisition for B2B" muted — no URL
- Font: `'Inter', ui-sans-serif, system-ui, sans-serif`
- No duplicate SVG attributes. No external CDN links. No remote fonts.
- `width="100%"` for responsive scaling

Save to: `src/assets/images/blog/[post-slug]-featured.svg`
Update frontmatter `image` field: `~/assets/images/blog/[post-slug]-featured.svg`

Do NOT hand off to Agent 05 until this file exists.
```

- [ ] **Step 4: Add Phase 3.6 — Internal Linking**

After the Phase 3.5 block, insert:

```
### Phase 3.6 — Internal Linking (before Agent 05 handoff)

Before handing to Agent 05:

1. Check `docs/templates/internal-linking-map.md` for existing posts and tools
2. Insert at minimum:
   - **One link to a SellonTube tool** — placed at the natural moment a reader would want to use it, not forced at the end
   - **One link to a related blog post or pSEO page** — placed where the topic is directly relevant
3. Update `docs/templates/internal-linking-map.md` with the new links added
4. Confirm both links exist in the draft before proceeding to QA
```

- [ ] **Step 5: Verify all changes**

```bash
grep -n "content-brief-template\|icp.md\|Phase 3.5\|Phase 3.6\|internal-linking-map" agents/04-blog-writer.md
```
Expected: 5 distinct matches.

- [ ] **Step 6: Commit**

```bash
git add agents/04-blog-writer.md
git commit -m "fix: agent 04 — add brief template, ICP reference, featured image step, internal linking step"
```

---

### Task 20: Patch Agent 05 — Tier the QA Checklist

**Files:**
- Modify: `agents/05-content-qa.md`

This is the most significant agent patch. The 218-line flat checklist becomes a tiered structure with clear publish gates.

- [ ] **Step 1: Update Step 2 header to show tiering**

Replace the "### Step 2 — Run the banned patterns checklist" header and the initial em-dash section with:

```
### Step 2 — Run the tiered QA checklist

QA items are tiered by severity:

**CRITICAL** — Grep these. Do not rely on read-through. Every CRITICAL violation blocks publish. Zero tolerance.
**IMPORTANT** — Must be resolved before publish. Can be fixed and re-checked without re-running full QA.
**ADVISORY** — Flag to user. Does not block publish. Improves quality.

---

## CRITICAL (blocks publish — zero violations allowed)

**Em-dashes and punctuation** ← GREP THESE, do not rely on read-through
- [ ] `grep -r "—" [filename]` — must return zero matches. Em-dash (`—`) is banned in all copy.
- [ ] `grep -E "\w-\w" [filename]` — review each match. Compound words (e.g. "B2B-focused") are fine. Two ideas joined by hyphen with no spaces = broken em-dash — fix it.
- [ ] No double hyphens `--` used as em-dashes.
```

- [ ] **Step 2: Mark all existing critical items clearly**

In the existing checklist sections, add `**[CRITICAL]**` before each of these:
- Title violations (all items)
- Excerpt violations (all items)
- Frontmatter completeness (all items)
- ICP fit (all items)
- Body copy: passive voice, hedging language, filler transitions

- [ ] **Step 3: Mark IMPORTANT tier items**

Add `**[IMPORTANT]**` before:
- Content structure and formatting (all Fix #13 items)
- AI citation blocks (Definition Block, Step-by-Step Block, etc.)
- Author bio
- CTA rules
- Internal links (add new item: "At least 2 internal links present in the body")

- [ ] **Step 4: Mark ADVISORY tier items**

Add `**[ADVISORY]**` before:
- Emotional resonance section
- Visual production standards (Fix #16)
- Feature image (Fix #17) — except "file exists" check which is CRITICAL
- Strategy post principles (Fix #14)
- Benchmark test

- [ ] **Step 5: Add a hard grep instruction at the top of Step 2**

Insert before the first checklist item:

```
> **MANDATORY:** Before running any read-through, grep the file for `—` (em-dash).
> ```bash
> grep -n "—" [filename]
> ```
> If this returns any matches: FAIL immediately. Fix all matches. Re-grep before continuing.
> This grep has caught violations in 9+ files that read-through missed.
```

- [ ] **Step 6: Update Step 3 — QA report format to reflect tiers**

Replace the QA report template with:

```
### Step 3 — Output QA report

```
QA REPORT — [filename]
Date: [today]
Result: PASS / FAIL

CRITICAL VIOLATIONS: [n] — [PASS/FAIL — any count > 0 = FAIL]
IMPORTANT VIOLATIONS: [n] — [must resolve before publish]
ADVISORY FLAGS: [n] — [informational only]

[If CRITICAL violations:]
CRITICAL:
1. [Line ~X] [Category] — [what's wrong] → [suggested fix]

[If IMPORTANT violations:]
IMPORTANT:
1. [Line ~X] [Category] — [what's wrong] → [suggested fix]

[If ADVISORY flags:]
ADVISORY:
1. [Line ~X] [Category] — [what's flagged] → [suggestion]

[If all CRITICAL pass:]
CRITICAL: PASS — no violations found.

TITLE CHECK: [pass/fail + note]
EXCERPT CHECK: [pass/fail + note]
EM-DASH GREP: [grep output — must be empty]
FRONTMATTER CHECK: [pass/fail + note]
ICP FIT: [pass/fail + note]
INTERNAL LINKS: [count found — must be ≥ 2]
```
```

- [ ] **Step 7: Update Rules section**

Replace the Rules section with:

```
## Rules
- CRITICAL items are grepped. Always. Without exception. Nine files had em-dashes that read-through missed.
- A PASS requires zero CRITICAL violations. Not "just one small thing." Zero.
- IMPORTANT violations must all be fixed before publish — but fixing them does not require re-running the full CRITICAL tier
- ADVISORY flags are recorded in the report but do not block publish
- Style Guide rules apply to ALL existing copy on the file, not just new content added in this session
- When called by Agent 04 (auto-QA): fix all CRITICAL and IMPORTANT violations directly, then re-run. Only surface to user after result = PASS.
- When called manually: show the report. Ask if the user wants fixes applied automatically or wants to review first.
```

- [ ] **Step 8: Verify**

```bash
grep -n "CRITICAL\|IMPORTANT\|ADVISORY" agents/05-content-qa.md | head -20
```
Expected: multiple matches showing the tiering is in place.

- [ ] **Step 9: Commit**

```bash
git add agents/05-content-qa.md
git commit -m "fix: agent 05 — tier QA checklist (Critical/Important/Advisory), add mandatory grep instruction"
```

---

### Task 21: Patch Agent 06 — Fix Stale Counts and Add SOP Reference

**Files:**
- Modify: `agents/06-pseo-manager.md`

- [ ] **Step 1: Fix stale entry counts**

Replace "29 'YouTube For' niche pages" → "31 'YouTube For' niche pages"
Replace "20 'YouTube Vs' comparison pages" → "23 'YouTube Vs' comparison pages"

Also update the Step 5 output format:
Replace "Live pages: [n] / 49 total" → "Live pages: [n] / 54 total"

- [ ] **Step 2: Add SOP reference**

In the "## Pre-launch quality checklist" section, add at the top:

```
Full publishing gate sequence: `docs/sops/pseo-publishing-sop.md`
```

- [ ] **Step 3: Verify**

```bash
grep -n "31\|23\|54\|pseo-publishing-sop" agents/06-pseo-manager.md
```
Expected: matches for all four.

- [ ] **Step 4: Commit**

```bash
git add agents/06-pseo-manager.md
git commit -m "fix: agent 06 — correct niche/comparison counts (31/23), add pSEO SOP reference"
```

---

### Task 22: Patch Agent 07 — Add Monthly AI SEO Checklist Ownership

**Files:**
- Modify: `agents/07-technical-seo.md`

- [ ] **Step 1: Update Role section**

Find "## Role" and add to the description:

```
Also owns the monthly AI SEO checklist — run `docs/sops/monthly-ai-seo-checklist.md` once per month as part of the weekly SEO review.
```

- [ ] **Step 2: Add to trigger phrases**

Find "## Trigger phrases" and add:
```
"monthly AI SEO check", "AI SEO checklist", "check AI bot access"
```

- [ ] **Step 3: Add Step 6 to execution steps**

After Step 5 (Output), add:

```
### Step 6 — Monthly AI SEO Checklist (run once per month)
If this is the first weekly review of the month, run `docs/sops/monthly-ai-seo-checklist.md` in full. Log completions in `seo-audit-log.md`.
```

- [ ] **Step 4: Verify**

```bash
grep -n "monthly-ai-seo-checklist\|monthly AI" agents/07-technical-seo.md
```
Expected: 2+ matches.

- [ ] **Step 5: Commit**

```bash
git add agents/07-technical-seo.md
git commit -m "fix: agent 07 — add monthly AI SEO checklist ownership"
```

---

### Task 23: Patch agents/README.md — Add DOCS.md Reference

**Files:**
- Modify: `agents/README.md`

- [ ] **Step 1: Add DOCS.md reference to Key Rules**

At the end of the "## Key Rules" section, add:

```
- Full SOPs, templates, and documentation index: `DOCS.md`
- ICP definition (canonical): `docs/icp.md`
```

- [ ] **Step 2: Commit**

```bash
git add agents/README.md
git commit -m "fix: agents/README — add DOCS.md and icp.md references"
```

---

### Task 24: Patch agents/master.md — Add Keyword Status Hard Gate

**Files:**
- Modify: `agents/master.md`

- [ ] **Step 1: Update Pre-flight section**

Find "## Pre-flight (run before every task)" and add a 4th step:

```
4. If the task involves writing any content: confirm the target keyword exists in `research/keywords/sot_master.csv` with `status = not-started`. If status is `live` or `planned`, STOP and flag to user before proceeding. Do not begin any writing task without this confirmation.
```

- [ ] **Step 2: Update the "Write a post" multi-agent sequence**

Find the **"Write a post about [topic]"** sequence and update Step 1:

Replace:
```
→ Run 02 (pick best keyword variant)
```
With:
```
→ Run 02 (pick best keyword variant from sot_master.csv, status=not-started only)
→ Confirm keyword status in sot_master.csv before proceeding. If status ≠ not-started: stop and flag.
```

- [ ] **Step 3: Verify**

```bash
grep -n "not-started\|status.*sot_master\|keyword status" agents/master.md
```
Expected: 2+ matches.

- [ ] **Step 4: Commit**

```bash
git add agents/master.md
git commit -m "fix: master agent — add hard keyword status gate before any writing task"
```

---

## Chunk 6: Final Verification

### Task 25: Full System Verification

- [ ] **Step 1: Verify no agent references the wrong CSV**

```bash
grep -rn "master_keywords_cleaned" agents/
```
Expected: zero matches.

- [ ] **Step 2: Verify no agent references Claude API for functions**

```bash
grep -rn "claude-haiku\|Claude API" agents/
```
Expected: zero matches.

- [ ] **Step 3: Verify all new files exist**

```bash
ls DOCS.md README.md docs/icp.md \
  docs/sops/blog-publishing-sop.md \
  docs/sops/pseo-publishing-sop.md \
  docs/sops/deploy-checklist.md \
  docs/sops/content-refresh-sop.md \
  docs/sops/ctr-optimization-sop.md \
  docs/sops/monthly-ai-seo-checklist.md \
  docs/templates/content-brief-template.md \
  docs/templates/internal-linking-map.md \
  research/keywords/archive/sot_keywords_final.csv \
  research/keywords/archive/sot_keywords.csv
```
Expected: all files found, no errors.

- [ ] **Step 4: Verify content-plan.md has deprecation notice**

```bash
head -5 research/keywords/content-plan.md
```
Expected: deprecation notice is the first content visible.

- [ ] **Step 5: Verify DOCS.md links are correct**

```bash
grep -c "\[" DOCS.md
```
Expected: 20+ markdown links present.

- [ ] **Step 6: Verify agent 05 tiering is in place**

```bash
grep -c "CRITICAL\|IMPORTANT\|ADVISORY" agents/05-content-qa.md
```
Expected: 15+ matches.

- [ ] **Step 7: Final commit**

```bash
git add -A
git status
```
Review — confirm only expected files are staged (no credentials, no large binaries).

```bash
git commit -m "chore: content ecosystem restructure — verification pass complete"
```

---

## Summary of All Changes

| Category | Count | Files |
|---|---|---|
| Critical bug fixes | 4 | agents/02, agents/08 (x2), growth-strategy.md |
| New infrastructure files | 11 | DOCS.md, README.md, docs/icp.md, 6 SOPs, 2 templates |
| Agent patches | 7 | agents/02, 03, 04, 05, 06, 07, master.md, README.md |
| Data cleanup | 3 | 2 CSVs archived, content-plan.md deprecated |

**Total commits:** ~24 (one per logical unit)
**Total new files:** 11
**Total modified files:** 10
