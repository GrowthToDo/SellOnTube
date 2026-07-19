# Bing Webmaster Tools — AI Performance: Research Synthesis + SellonTube 10x AI-Visibility Plan

> Created 2026-06-24. Scope: Bing Webmaster Tools + the AI Performance report (Grounding Queries, Intents, Topics, Citation Share, Compare). Goal: use this data to 10x SellonTube's AI-search impressions and traffic. Research + plan only — no site changes yet.
> Related: `project_aeo_strategy.md`, `project_google_ai_optimization.md`, `seo-rules.md`, `research/aeo/aeo_audit_2026-04-12.csv`.

---

## 1. What AI Performance is

A report inside **Bing Webmaster Tools (BWT)** that shows when and why your content is **cited as a source in AI-generated answers**. Public preview launched **9 Feb 2026**; expanded with Intents/Topics/Citation Share/Compare in **June 2026**.

It is Microsoft's first-party "Generative Engine Optimization (GEO)" measurement layer — the AI-search analogue of the classic Search Performance report.

### Coverage (read this carefully — corrects a common myth)
AI Performance tracks citations across:
- **Microsoft Copilot**
- **AI-generated summaries in Bing**
- **Select Microsoft partner integrations** ("Copilots & Partners")

**It does NOT directly report ChatGPT citations.** ChatGPT runs its own retrieval system. The popular claim ("see the exact words ChatGPT used to cite you") is loose marketing. The accurate version: **Bing's index is a major grounding/retrieval layer for several LLM surfaces**, so BWT grounding-query data is the closest first-party proxy for "what phrases pull my content into AI answers." Optimizing for it lifts visibility across LLMs that lean on Bing's index — but the dashboard counts Copilot/Bing-AI, not ChatGPT.

---

## 2. The metrics

| Metric | Definition | What it tells you |
|---|---|---|
| **Total Citations** | # times your content appears as a source in AI answers (selected period) | Raw AI-visibility volume. Not rank, not placement. |
| **Average Cited Pages** | Daily average of unique pages cited | Breadth — how much of the site AI reaches, not just one hero page. |
| **Grounding Queries** | The key phrases the AI used internally to retrieve your content | ⭐ The gold. Copilot rephrases a user question into micro-queries to fetch sources; these are those rephrasings. *Sampled, not exhaustive.* |
| **Page-level Citations** | Citation counts per URL | Which pages are AI's go-to sources. |
| **Intents** *(Jun 2026)* | Each grounding query classified: Informational, Commercial, Navigational, Learn & Solve, Research, Creation, Local… | Why AI surfaces you — buying vs learning context. |
| **Topics** *(Jun 2026)* | Grounding queries clustered into thematic groups | Where you hold topical authority + coverage gaps, in AI's own semantic structure. |
| **Citation Share** *(Jun 2026)* | % of citations for a grounding query that are yours vs all sites | Relative strength — share of voice per query. |
| **Compare** *(Jun 2026)* | Overlay prior periods | Correlate content changes with citation lift. |
| **Grounding Query ↔ Page mapping** | Click a query → cited pages; click a page → its queries | Closes the loop: which page wins which query. |

**Key limitation:** grounding queries are a **sample**, not full coverage. Treat counts as directional, not absolute.

---

## 3. How citations actually get earned (the mechanism)

1. User asks Copilot a conversational question.
2. Copilot **rephrases** it into one or more retrieval micro-queries → *grounding queries*.
3. Bing's index returns candidate pages (classic Bing ranking still applies — being in **positions 1–3 on Bing** for the grounding query massively raises citation odds).
4. The LLM does a **second evaluation**: does this page *directly answer* the conversational query (not just match keywords)? Clear, extractable, evidence-backed answers win.
5. Winning pages get cited.

So citation = **good Bing rank × answer-shaped, extractable content**. Both halves required.

---

## 4. Microsoft's own optimization guidance

- Strengthen subject-matter depth and expertise (E-E-A-T).
- Clear structure: descriptive headings, FAQ sections, scannable blocks.
- Support claims with evidence and data (first-party numbers, citations).
- Keep content fresh and accurate.
- Consistency across text, images, video.
- Use **IndexNow** for fast discovery of new/updated content.
- Register **Bing Places** (local; low relevance for SellonTube).

## 5. Practitioner tactics (synthesized across guides)

- **Mine grounding queries → fix the matching page.** When a query shows up: search it on Bing, check if you're top 3. If not, strengthen that page; if content is thin, add the exact query terms high on the page + a dedicated section. Prefer improving an existing page over spawning a new one.
- **Compact, high-intent answer pages** beat generic listicles. 400–600 words, narrow scenario, direct answer to "why X for Y", terminology of the query in title/URL/H1/first sentence/meta.
- **Authority routing:** internal-link from top pages (2–3 links, varied anchors) into pages that rank low for valuable grounding queries.
- **Use Citation Share** to pick battles — double down where share is climbing, find competitors winning queries you should own.
- **Use Topics** to spot authority clusters + gaps; build the missing answer pages inside a cluster you already partly own.
- **Use Compare** to prove which content edits moved citations (feedback loop).

---

## 6. SellonTube current state (audited 2026-06-24)

✅ Already in place (good AEO base):
- `public/robots.txt` explicitly allows GPTBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, CCBot, Bytespider, cohere-ai, Meta-ExternalAgent, Applebot, Amazonbot.
- `public/llms.txt` + `public/llms-full.txt` present.
- Sitemap index live; structured data + breadcrumbs standard (CLAUDE.md).
- Two site-verification `.txt` files in `public/` (one is the IndexNow key, one is likely a search-engine verification token).
- Bing URL submission via API documented in CLAUDE.md (IndexNow broken behind Cloudflare → use Bing `SubmitUrlbatch`). **API access implies the domain is already verified in Bing Webmaster Tools.**

⚠️ Gaps / to confirm:
- robots.txt is missing **`OAI-SearchBot`** (ChatGPT Search's distinct crawler) and **`Bingbot`/`Microsoft` AI crawler** lines — currently only covered by `User-agent: *`. Explicit allows are safer signaling.
- **AI Performance has likely never been opened** for SellonTube — zero grounding-query data harvested into strategy.
- IndexNow reported broken (Cloudflare) → AI surfaces may discover new content slowly. Bing API submission is the workaround.

---

## 7. The 10x AI-visibility plan for SellonTube

Sequenced. Each phase compounds. "10x" = grow AI-cited impressions/citations by an order of magnitude over ~2 quarters by (a) turning on measurement, (b) converting grounding-query demand into answer-shaped pages, (c) feeding AI surfaces fast.

### Phase 0 — Turn on the instrument (week 1, near-zero effort)
1. Confirm SellonTube is verified in BWT (it almost certainly is — Bing submission API works). If not, verify via the existing `public/*.txt` token or GSC import.
2. Open **AI Performance** → set 3M window → **export Grounding Queries, Pages, Intents, Topics, Citation Share** to CSV.
3. Hand CSVs to me → I baseline current AI citations and map every grounding query to a page or a gap. *(This is the real input data; everything below is hypothesis until we have it.)*

### Phase 1 — Harvest demand → answer-shape existing pages (weeks 2–4)
- For each grounding query with citations or impressions: Bing-search it, record position.
- **Top-3 already + cited:** lock it; add to "AI-won" list, keep fresh.
- **Ranks but not cited / thin:** add the exact query phrase high on page + a 40–60 word **standalone answer block** (definition/answer-first), an FAQ entry, supporting data. This is the highest-ROI work — demand already proven.
- **Doesn't rank:** authority routing (internal links from strong pages) + content depth.
- Apply to `/tools/*`, `/youtube-for/*`, `/youtube-vs/*`, and blog cluster pages.

### Phase 2 — Fill Topic/Intent gaps with new answer pages (weeks 4–8)
- Use **Topics** clusters where SellonTube has partial authority → build the missing answer pages inside that cluster (compact, high-intent, B2B/acquisition angle — not creator angle).
- Prioritize **Commercial + Learn-and-Solve** intents (closest to SellonTube's ICP and conversion).
- Cross-check every candidate against `research/keywords/sot_master.csv` `tier=winnable` before committing (existing rule).

### Phase 3 — Maximize extractability site-wide (parallel)
- Every target page: answer-first paragraph under H1, scannable H2/H3 phrased as questions, FAQ schema where FAQ is visible, tables for comparisons, first-party data/numbers, clear last-updated dates.
- Add explicit **`OAI-SearchBot`** + **`Bingbot`** allow lines to robots.txt.
- Keep llms.txt / llms-full.txt updated with new answer pages.

### Phase 4 — Feed AI surfaces fast (parallel)
- On every publish/update: Bing `SubmitUrlbatch` API submission (per CLAUDE.md workaround) + GSC request-indexing.
- Investigate why IndexNow is failing behind Cloudflare — if fixable, it's the fastest AI-discovery channel.

### Phase 5 — Measure + compound (monthly)
- Re-export AI Performance, use **Compare** to attribute citation lift to specific edits.
- Track **Citation Share** trend per priority topic as the real 10x KPI (not raw clicks — AI citations precede clicks).
- Feed wins back into Phase 1/2 selection. Loop quarterly with the keyword refresh.

### What "10x" realistically rests on
1. **Measurement on** (Phase 0) — currently zero, so first export alone is infinite % uplift in *known* data.
2. **Demand-led answer-shaping** (Phase 1) — converting already-cited/ranking queries is where fast multiples come from.
3. **Speed of discovery** (Phase 4) — fixing IndexNow / disciplined Bing submission shortens the cite-lag for every new page.

---

## 8. Honest caveats
- ChatGPT-specific citation data is **not** in this report — don't promise clients/stakeholders "exact ChatGPT words." Frame as Copilot + Bing-AI + Bing-grounded LLM proxy.
- Grounding queries are **sampled** — directional, not a complete keyword list.
- Citations ≠ clicks. AI answers may cite without sending traffic. KPI must be citation/share growth first, click growth second.
- All Phase 1+ specifics are hypotheses until the real Grounding Queries export exists.

---

## Sources
- [Introducing AI Performance in Bing Webmaster Tools (Public Preview) — Bing Blogs, Feb 2026](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [New AI Visibility Insights: Intents, Topics, Citation Share, Compare — Bing Blogs, Jun 2026](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare)
- [Bing AI Performance reports gain Grounding Queries & Pages views — Search Engine Roundtable](https://www.seroundtable.com/bing-webmaster-tools-ai-performance-more-41103.html)
- [How to use Bing's AI Performance report to get more LLM citations — Edward Sturm](https://edwardsturm.com/articles/bing-webmaster-tools-ai-performance-report-grounding-queries-get-more-llm-citations/)
- [Bing Webmaster Tools AI Performance Report — OtterlyAI](https://otterly.ai/blog/bing-webmaster-tools-ai-performance-report/)
- [Inside Bing's New AI Performance Report: 20,000 Copilot Citations — Search Influence](https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/)
- [AI Performance — Bing Webmaster Tools Help](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
