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
| [`growth-strategy.md`](growth-strategy.md) | **SINGLE SOURCE OF TRUTH** for growth strategy. Tools-first plan, tool specs, blog clusters, keyword tiers, backlink tactics, success metrics. |
| [`seo-audit-log.md`](seo-audit-log.md) | Audit history, P0/P1/P2 fixes resolved, GSC indexation strategy. |

---

## Content Plan (SSOT is the CSV)

| Doc | Purpose |
|---|---|
| [`research/keywords/sot_master.csv`](research/keywords/sot_master.csv) | **SINGLE SOURCE OF TRUTH** — 347 curated keywords with status, cluster, priority_score, content_type. Use for all content decisions. |

---

## SOPs (Standard Operating Procedures)

| Doc | When to use |
|---|---|
| [`docs/sops/blog-publishing-sop.md`](docs/sops/blog-publishing-sop.md) | Before publishing any blog post — full 19-step gate sequence |
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
