# SellonTube Agent System

A set of self-contained agent specs for content marketing and SEO work.
I (Claude) load the relevant spec before executing any task — no commands to memorize.

## How to Invoke

Just speak naturally. Examples that trigger each agent:

| What you say | Agent loaded |
|---|---|
| "weekly SEO check" / "what's ranking" / "traffic report" | 01-gsc-intelligence |
| "find keywords for X" / "what should I write about" | 02-keyword-researcher |
| "plan next month's content" / "when can I publish next" | 03-content-planner |
| "write a post about X" / "draft a blog on Y" | 04-blog-writer → 05-content-qa |
| "QA this post" / "check this file" | 05-content-qa |
| "what pSEO pages go live this week" / "check drip schedule" | 06-pseo-manager |
| "technical SEO audit" / "check redirects" / "schema check" | 07-technical-seo |
| "build a tool" / "create a microtool" / "here's the spec for a tool" | 08-microtool-builder |
| "full audit" / "weekly review" | master → routes to 01 + 07, then 03 |

## Agent Index

| File | Agent | Primary Tools |
|---|---|---|
| master.md | Orchestrator — sequences multi-step work | Routes to sub-agents |
| 01-gsc-intelligence.md | GSC/GA4 analysis, quick wins | MCP: gsc_pages, top_queries, ranking_opportunities |
| 02-keyword-researcher.md | Keyword selection from master CSV | Read CSV, cross-check posts |
| 03-content-planner.md | 4-week calendar, cadence enforcement | Read post dates, keyword picks |
| 04-blog-writer.md | Blog post (outline-first, then full draft) | Style guide + OutlierKit patterns |
| 05-content-qa.md | Style guide QA on any file | Grep banned patterns |
| 06-pseo-manager.md | pSEO drip schedule, publishDate checks | Read niches.ts + comparisons.ts |
| 07-technical-seo.md | Redirects, schema, technical health | Read netlify.toml, JsonLd.astro |
| 08-microtool-builder.md | Build interactive tools — SEO + ICP-optimized | ROI calc pattern, keyword CSV, style guide |

## Key Rules (apply to all agents)
- Never push to live without explicit user approval
- Blog cadence: max 1/week, hard ceiling 2/week — always count before scheduling
- pSEO publishDates are IST (UTC+5:30) — Netlify builds UTC — check before releasing
- Read seo-rules.md before any SEO recommendation
- Style Guide + Content Quality Playbook apply to ALL copy touched, not just new writing
- Full SOPs, templates, and documentation index: `DOCS.md`
- ICP definition (canonical): `docs/icp.md`
