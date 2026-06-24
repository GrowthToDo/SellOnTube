# Tool Pages Master Plan v3 — Positioning-Led SEO + AEO for Income

**Integrates four lenses:** original brief (lean AEO retrofit) · growth/marketer · technical SEO · positioning & differentiation (Dunford / FletchPMM).

**Owner goal (stated):** 10x impressions + clicks in 2–3 months.
**Reframed goal:** 10x **qualified pipeline** from /tools/* — leads → diagnostic calls → product. Impressions/clicks are means.
**Strategic spine (NEW, governs everything):** SellonTube tools are the only YouTube toolset built for **B2B customer acquisition — finding buyers, not views.** Every query target, headline, KT, FAQ, and citation claim ladders up to this.

**Branch:** `aeo/tool-pages-retrofit` (off main). No push without explicit OK.
**Data:** `research/aeo/tool-pages-gsc-baseline-2026-06-24.md`.

---

## 0. Why this plan looks different from "add a Key Takeaways block to 14 pages"

The original brief was a *mechanics* plan (extraction blocks + schema). Three review passes found the mechanics sit on top of unanswered upstream questions:

- **Growth:** impressions already 10x'd; the goal is income, and income ≠ the 20k-impression monster (non-ICP). Prove before you scale.
- **Technical SEO:** you already rank for these queries with the *wrong* URLs (blog↔tool cannibalization); pos 33 is more likely a consolidation/internal-link/CWV problem than a missing block.
- **Positioning:** none of it matters if there's no differentiated *reason to choose* you over vidIQ / generic free tools. Positioning is upstream of rank, conversion, AND citation.

**Order of operations therefore inverts:** position → consolidate (technical) → prove on one page → measure → scale. On-page blocks (the original brief) are the *last* layer, not the first.

---

## 1. Positioning foundation (do FIRST — drives all copy)

For every tool, fill the Dunford 5 before writing a word of page copy:

| Component | Default for the toolset (tailor per tool) |
|---|---|
| Competitive alternative | vidIQ / TubeBuddy (creator tools) · generic free tools (RapidTags etc.) · guessing / doing nothing |
| Unique attribute | Buyer-intent scoring; B2B-acquisition framing; exact rewrite output |
| Value it enables | Qualified leads & pipeline, not vanity views |
| Best-fit customer | B2B founders, SaaS operators, service businesses (deal value high enough that one inbound lead pays for the channel) |
| Category we frame into | "YouTube for B2B customer acquisition" (NOT "YouTube SEO tool") |

**Per-page messaging hierarchy (FletchPMM):**
1. Category-defining value — "find buyers, not views"
2. Differentiator vs the *named* alternative — "vidIQ optimises for reach; this optimises for pipeline"
3. Proof — the visible mechanism (e.g. the 5-dimension buyer-intent scorecard)
4. Table-stakes — free · no login · instant (entry ticket, not the lead)
5. CTA — use → email → diagnostic call

**Anti-positioning (every page):** an explicit "Not for creators chasing views — use vidIQ/TubeBuddy for that" line. Repel to attract; sharpen the choice.

---

## 2. Category reframe → new query strategy

**Stop chasing** commodity, non-ICP, unwinnable head terms: "youtube rank checker", "rank tracker", "keyword rank checker". Everyone offers a free one; the SERP is owned by established tools; the searchers aren't buyers.

**Start owning** category terms where we're the only credible answer (ICP-aligned):
- "youtube for [B2B / saas / agencies / consultants / lead generation]"
- "youtube buyer intent", "youtube for customer acquisition"
- "youtube seo **for business**", "youtube videos that generate leads"
- the `/youtube-for/*` and `/youtube-vs/*` clusters (already live, ICP-fit)

This single move resolves three problems at once: escapes the cannibalized red ocean (technical), targets ICP traffic (income), and is ownable because it's differentiated (positioning).

The commodity tools (ranking-checker, tag-gen, title-gen) **stay live** and get the positioning + repel-and-route treatment — but their commodity queries are *not* strategic priorities.

---

## 3. Step 0 — read-only pre-flight (NOTHING edited until this is done)

Four audits, all read-only, run in parallel. Output decides the lever *per query* (consolidate vs internal-link vs CWV vs on-page vs reposition).

**0a. Cannibalization / query-ownership map.** For each target cluster, list every URL ranking (GSC API, dimensions=query+page). Flag blog↔tool overlap (known: "rank checker" → ranking-checker + `/blog/best-youtube-rank-checker-tools-for-business` + `/blog/how-to-check-youtube-rankings`; "youtube seo tool" → seo-tool + `/blog/best-youtube-seo-tools-for-business`). Assign ONE canonical owner per intent: blog listicle = informational "best X"; tool page = transactional "free X / X tool".

**0b. Indexation + canonical/legacy audit.** Confirm each tool page is *indexed* (not "crawled – not indexed"). Find legacy/duplicate URLs (seen: `/youtube-for-shopify` vs `/youtube-for/shopify`, `/youtube-video-ideas` vs `/youtube-topics/*`). Check canonicals + redirects in netlify.toml.

**0c. Live-SERP-feature snapshot** for each head term. Record AI Overview / featured snippet / video pack / ads above the fold. Determines whether a "CTR win" at pos 8 is real or below-the-fold fiction, and whether the page-1 result type is tool / listicle / video (you must match it to rank).

**0d. Funnel + money-page baseline.** Pull tool→email (capture-email fn) and email→call (cal.com / GA4 path) numbers. Audit product-pricing + booking page conversion. Without the "before," income KPIs are unmeasurable, and routing traffic to a leaky money page wastes it.

**Deliverable:** `research/aeo/tool-pages-preflight-2026-06-24.md` — per-query verdict: {canonical owner, lever, SERP result-type to match, indexation status}.

---

## 4. Optimisation stack (per page, re-ordered by leverage)

Effort goes top-down; stop where the pre-flight says the problem is solved.

1. **Position** — headline/H1/KT lead with the differentiated category claim + named-alternative contrast + proof. (Positioning before mechanics.)
2. **De-cannibalise** — align title + internal anchors so blog and tool stop competing; consolidate per 0a.
3. **Intent + table-stakes** — free · no login · instant up top; audit email-gate friction (early gating → pogo-stick → rank decay).
4. **Tool UX + CWV** — fast LCP/INP, mobile-correct, instant result. Fix per 0c CWV baseline.
5. **Internal-link equity (NOT external first)** — pass equity from high-impression blogs (7k/3.6k/2.8k impr) down to tool pages with exact-match anchors. Route harvest traffic to money pages.
6. **Answer-first KeyTakeaways** — the static, server-rendered, AEO-extraction + snippet unit. The `answer` = the distinct claim worth citing. `KeyTakeaways.astro` (built), below interactive hero (LCP/CLS-safe).
7. **Focused FAQ** — real long-tail ("free? no signup? accurate? vs vidIQ?"). **Note:** FAQ schema no longer earns Google rich results for commercial sites (restricted 2023) — keep it for **AEO extraction only**, not SERP CTR.
8. **Schema** — WebApplication + BreadcrumbList (+ aggregateRating only if legit). Matched to visible content.
9. **Server-render check** — confirm all citation-critical content is in static HTML (tool *output* is JS → not citable; KT/FAQ/definition static → good).

---

## 5. Reference page — `youtube-seo-tool` (lean + positioned)

**Done (additive, on branch, reversible):** KeyTakeaways block (answer-first + definition); hero badges → Free · No YouTube login · 5 SEO dimensions · Exact fixes in 30s.

**Planned (pending approval — content removal on indexed page):**
- **Reposition top:** H1/subhead lead with "find buyers, not views" + named contrast to vidIQ; surface the scorecard as proof early.
- **Add anti-positioning** line ("not for creators chasing views").
- **Lean restructure** (only after 0a confirms it's not a cannibalization fight): ~9 content sections → ~5. Keep scorecard (proof), business-vs-creator table (differentiation/citation gold), lead-gen bridge (conversion), FAQ, related-tools+CTA. Cut "logic behind scoring" (redundant), "common mistakes", "by business type" (blog filler). Merge "who for / who not for".
- Internal links to `/youtube-for/*` preserved.

→ build → **show before any fan-out.**

---

## 6. Execution sequence (prove → measure → scale)

1. **Approve plan.**
2. **Step 0 pre-flight** (read-only) → preflight doc.
3. **Wave 0 — fast wins** (days, low risk): title/meta CTR rewrites on page-1 tools where 0c says the slot is above-the-fold (roi-calculator pos 8.8, video-ideas-evaluator pos 7.8, autocomplete pos 10). Positioning-led titles.
4. **Reference page** (seo-tool) per §5 → build → show.
5. **Pilot — 1 harvester** (transcript-generator OR repositioned ranking-checker) → measure both pages 2–4 weeks (rank, CTR, captures, citations).
6. **Decide per query from pre-flight + pilot data:** optimize tool page / consolidate into existing listicle / fix internal links / reposition. NOT a blanket 14-page sweep.
7. **Scale** what proved out, in waves. Subagents, one page each. Commit per wave.

---

## 7. QA gate (every wave, before commit)

- `npm run build` + `validate-build.js` pass.
- Em-dash / banned-AI-phrase grep clean on touched files.
- Schema valid, matches visible content (no FAQ schema without visible FAQ).
- KT below interactive hero; no CLS (space reserved); LCP unaffected.
- Internal links resolve; no legacy/404 URLs introduced; canonicals intact.
- Positioning check: page names the alternative + leads with the differentiator (not table-stakes).
- Tool listing + footer unchanged (no new tools here).

---

## 8. Measurement (income + positioning, not vanity)

| Metric | Source | Baseline | 90d target |
|---|---|---|---|
| **Email captures from tools** | capture-email fn | pull in 0d | **primary** |
| **Diagnostic calls from tool traffic** | cal.com / GA4 path | pull in 0d | **primary** |
| First **tool** AI-citations (Bing AI Perf + manual ChatGPT/Perplexity/Claude on fixed prompts) | Bing + manual | 6 (blog only, 0 tools) | first tool citations |
| Page-1-tool CTR (Wave 0) | GSC | roi 0.6%, autocomplete 1.4% | 2–3x on rewritten |
| ranking-checker position | rank tracker (dogfood) | 33 | only if 0a says it's winnable |
| Tool-page clicks | GSC | ~83/28d | directional, NOT the KPI |

**Honest timeline:** 2–3mo realistically buys AEO citations + CTR wins + conversion-rate lift on existing traffic. Rank-driven click-10x is a ~6-month arc (re-crawl + re-rank + authority). Judge success on the right curve.

---

## 9. Risks & mitigations

- **Position dilution** (serving creators + B2B on one page) → anti-positioning + repel-and-route; never soften the wedge for volume.
- **Content removal on indexed pages** → trim only ~0-click pages first (seo-tool), measure, then roll. Reversible on branch.
- **Cannibalization deepened by new listicles** → optimize/consolidate existing listicles; do NOT build new ones.
- **CTR work on below-fold positions** → gate on 0c SERP snapshot.
- **Email-gate friction** suppressing rank/usage → audit before adding gating.
- **Scaling an unproven model** → pilot + measure before fan-out.
- **Routing to a leaky money page** → audit conversion in 0d before routing equity.

---

**Provenance:** GSC live API 28d (2026-05-25→06-21) + 3-mo export (Mar 23→Jun 22). Lenses: growth, technical SEO, positioning (Dunford/FletchPMM). Drafted 2026-06-24. Supersedes the missing `tool-pages-retrofit-spec.md`. Read-only pre-flight (§3) is the only sanctioned next action pending approval.
