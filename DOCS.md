# SellonTube Documentation Index

All project documentation in one place. Start here.

## Folder map (where things live)

| Folder | Holds |
|---|---|
| [`docs/blog/`](docs/blog/) | Blog + writing standards: production standard, playbook, style guide, depth framework, strategy lessons |
| [`docs/seo/`](docs/seo/) | SEO + AEO: AI-citation guide, SEO rules, audit log, Clarity strategy, URL rules, redirects log |
| [`docs/strategy/`](docs/strategy/) | Growth + channel strategy: growth SSOT, rank-checker amplification, analytics toolkit, reddit playbook |
| [`docs/audits/`](docs/audits/) | Audit **playbooks** (reusable) + dated audit **reports** under `reports/<date>/` |
| [`docs/pseo/`](docs/pseo/) | pSEO pointer README (content itself is wired in `src/`) + loose notes |
| [`docs/specs/`](docs/specs/) | Tool/feature specs |
| [`docs/sops/`](docs/sops/) | Standard operating procedures |
| [`docs/templates/`](docs/templates/) | Fill-in templates |
| [`docs/superpowers/`](docs/superpowers/) | Historical build plans + design specs (frozen) |
| [`agents/`](agents/) | The 11-agent content/SEO system + routing |
| [`research/analytics/`](research/analytics/) | Ahrefs + GSC data exports (`ahrefs/`, `gsc/`) |
| [`research/keywords/`](research/keywords/) | Keyword SSOT CSVs (scripts hardcode this path — do not move) |
| `shopify-app-marketing/` | The `/shopify-app` subsite doc bundle (own structure, untouched) |

> Filing rule: new strategy/playbook/SOP docs go in the right `docs/<bucket>/`, never repo root.
> Analytics exports go in `research/analytics/<source>/`. See `CLAUDE.md` → "Where docs live".

---

## Content standards (read before writing anything)

| Doc | Purpose |
|---|---|
| [`docs/blog/style-guide.md`](docs/blog/style-guide.md) | Writing rules: em-dash ban, AI pattern detection, sentence structure, tone. **Mandatory for ALL copy.** |
| [`docs/blog/content-playbook.md`](docs/blog/content-playbook.md) | Quality standards: priority score formula, blog cadence, excerpt rules, quality checklist. |
| [`docs/blog/blog-production-standard.md`](docs/blog/blog-production-standard.md) | Blog production standard: structure, visual, formatting. Overrides style-guide for production rules. |
| [`docs/blog/content-depth-framework.md`](docs/blog/content-depth-framework.md) | Word-count + depth tiers, extractability, editorial checklist. |
| [`docs/blog/blog-strategy-lessons.md`](docs/blog/blog-strategy-lessons.md) | Accumulated blog strategy lessons (topic validation, SERP checks, B2B vs creator). |

---

## SEO / AEO

| Doc | Purpose |
|---|---|
| [`docs/seo/seo-rules.md`](docs/seo/seo-rules.md) | SEO cheat sheet: URL structure, canonicals, redirects, pSEO IST timezone. **Read before any SEO decision.** |
| [`docs/seo/ai-seo-guide.md`](docs/seo/ai-seo-guide.md) | **Canonical AEO SSOT.** §16 citability gate, §17 citation language, §18 media policy, §19 proven evidence. |
| [`docs/seo/seo-audit-log.md`](docs/seo/seo-audit-log.md) | Audit history, P0/P1/P2 fixes resolved, GSC indexation strategy. |
| [`docs/seo/ms-clarity-strategy.md`](docs/seo/ms-clarity-strategy.md) | Microsoft Clarity behavioural-analytics strategy. |
| [`docs/seo/_memory-url-rules.md`](docs/seo/_memory-url-rules.md) | Canonical URL / path rules. |
| [`docs/seo/redirects-log.txt`](docs/seo/redirects-log.txt) | Redirect history log. |

---

## Strategy

| Doc | Purpose |
|---|---|
| [`docs/strategy/growth-strategy.md`](docs/strategy/growth-strategy.md) | **SINGLE SOURCE OF TRUTH** for growth: tools-first plan, tool specs, blog clusters, keyword tiers, backlink tactics, metrics. |
| [`docs/strategy/ranking-checker-amplification-strategy.md`](docs/strategy/ranking-checker-amplification-strategy.md) | Amplification plan for the rank-checker cluster (money page). |
| [`docs/strategy/analytics-toolkit.md`](docs/strategy/analytics-toolkit.md) | Analytics tooling + measurement toolkit. |
| [`docs/strategy/reddit-marketing-playbook.md`](docs/strategy/reddit-marketing-playbook.md) | Reddit launches, seeding, community playbook (Agent 10). |

---

## Audits

| Doc | Purpose |
|---|---|
| [`docs/audits/content-audit-playbook.md`](docs/audits/content-audit-playbook.md) | Reusable content-audit process. |
| [`docs/audits/sellontube-tools-audit-playbook.md`](docs/audits/sellontube-tools-audit-playbook.md) | Reusable tools-audit process. |
| [`docs/audits/reports/2026-04-22/`](docs/audits/reports/2026-04-22/) | Dated audit artifacts: content + tools findings and run logs. |

---

## pSEO / specs

| Doc | Purpose |
|---|---|
| [`docs/pseo/README.md`](docs/pseo/README.md) | Where wired pSEO content lives (`src/data/*`, templates) + agent/playbook pointers. |
| [`docs/specs/youtube-video-keyword-finder-spec.md`](docs/specs/youtube-video-keyword-finder-spec.md) | Spec for the YouTube video keyword finder tool. |

---

## Content plan (SSOT is the CSV)

| Doc | Purpose |
|---|---|
| [`research/keywords/sot_master.csv`](research/keywords/sot_master.csv) | **SINGLE SOURCE OF TRUTH** — curated keywords with status, cluster, priority_score, content_type. |

---

## Analytics data

| Folder | Purpose |
|---|---|
| [`research/analytics/ahrefs/`](research/analytics/ahrefs/) | Ahrefs site-audit exports (dated report folders). |
| [`research/analytics/gsc/`](research/analytics/gsc/) | Google Search Console exports (dated folders) + query/opportunity CSVs. |

---

## SOPs (Standard Operating Procedures)

| Doc | When to use |
|---|---|
| [`docs/sops/blog-publishing-sop.md`](docs/sops/blog-publishing-sop.md) | Before publishing any blog post — full gate sequence |
| [`docs/sops/pseo-publishing-sop.md`](docs/sops/pseo-publishing-sop.md) | Before any pSEO page goes live |
| [`docs/sops/deploy-checklist.md`](docs/sops/deploy-checklist.md) | Before every `git push` |
| [`docs/sops/content-refresh-sop.md`](docs/sops/content-refresh-sop.md) | Monthly/quarterly post update workflow |
| [`docs/sops/ctr-optimization-sop.md`](docs/sops/ctr-optimization-sop.md) | When Agent 01 flags a quick-win (position 5–20, low CTR) |
| [`docs/sops/monthly-ai-seo-checklist.md`](docs/sops/monthly-ai-seo-checklist.md) | Monthly — owned by Agent 07 |

---

## Templates / ICP / brand

| Doc | Purpose |
|---|---|
| [`docs/templates/content-brief-template.md`](docs/templates/content-brief-template.md) | Fill in before every blog outline |
| [`docs/templates/internal-linking-map.md`](docs/templates/internal-linking-map.md) | Living doc — update on every publish |
| [`docs/icp.md`](docs/icp.md) | Canonical Ideal Customer Profile. All agents reference this. |
| [`docs/brand-voice.md`](docs/brand-voice.md) | Brand voice reference. |
| [`docs/content-intelligence-system.md`](docs/content-intelligence-system.md) | Content intelligence system overview. |
| [`docs/repo-audit-summary.md`](docs/repo-audit-summary.md) | Repo audit summary. |

---

## Agent system

| Doc | Purpose |
|---|---|
| [`agents/README.md`](agents/README.md) | Routing table — which natural-language trigger runs which agent |
| [`agents/master.md`](agents/master.md) | Orchestrator — multi-agent sequences |
| [`agents/01-gsc-intelligence.md`](agents/01-gsc-intelligence.md) | GSC/GA4 analysis and quick wins |
| [`agents/02-keyword-researcher.md`](agents/02-keyword-researcher.md) | Keyword selection from `sot_master.csv` |
| [`agents/03-content-planner.md`](agents/03-content-planner.md) | Calendar, cadence enforcement |
| [`agents/04-blog-writer.md`](agents/04-blog-writer.md) | Blog writing (outline-first) |
| [`agents/05-content-qa.md`](agents/05-content-qa.md) | Style-guide QA — CRITICAL/IMPORTANT/ADVISORY tiers |
| [`agents/06-pseo-manager.md`](agents/06-pseo-manager.md) | pSEO drip schedule and publishDate checks |
| [`agents/07-technical-seo.md`](agents/07-technical-seo.md) | Redirects, schema, technical health, monthly AI SEO checklist |
| [`agents/08-microtool-builder.md`](agents/08-microtool-builder.md) | Microtool creation (Gemini Flash standard) |
| [`agents/09-linkedin-writer.md`](agents/09-linkedin-writer.md) | LinkedIn post drafting |
| [`agents/10-reddit-marketer.md`](agents/10-reddit-marketer.md) | Reddit launches and seeding |
| [`agents/11-aeo-monitor.md`](agents/11-aeo-monitor.md) | AI-search visibility, citability scoring |
