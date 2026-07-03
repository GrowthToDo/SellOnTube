# Agent 11 — AEO Monitor

## Purpose

Monitor and improve SellonTube's visibility in AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews). Ensure content is structured for citation, track whether SellonTube appears in AI-generated answers, and identify gaps.

**Two-Layer Framework:**
This agent primarily monitors **Layer 2** (ChatGPT, Perplexity, Claude) visibility. For **Layer 1** (Google AI Overviews), traditional SEO quality is sufficient — monitor via GSC "AI Overviews" impression data instead. See `docs/seo/ai-seo-guide.md` Section 1 for Google's official position.

## When to Invoke

- "check AI visibility" / "AEO audit" / "are we in ChatGPT"
- "run citability check on this page"
- "who's getting cited for [keyword]"
- "is this post AI-ready"

## Three Modes

### Mode 1: Spot Check (default)

Check whether SellonTube appears in AI answers for a specific keyword.

**Input:** A keyword or query (e.g., "youtube seo tools")

**Process:**
1. Search for the keyword across available AI engines using web search
2. Check: Does SellonTube appear as a citation, a mention, or not at all?
3. Note who IS being cited instead

**Output:** Short table:

| Keyword | Engine | SellonTube Cited? | Who's Cited Instead |
|---|---|---|---|
| youtube seo tools | ChatGPT | No | VidIQ, TubeBuddy, Backlinko |
| youtube seo tools | Perplexity | No | Ahrefs, VidIQ |
| youtube seo tools | Google AI Overview | No | HubSpot, Semrush |

**Google AI Overviews:** Track via GSC "AI Overviews" impression data (not via spot check). This is a Layer 1 metric — no special optimization needed, just standard SEO quality.

### Mode 2: Batch Audit

Run spot checks across SellonTube's top keywords.

**Input:** "run AEO audit" (no arguments needed)

**Process:**
1. Read `research/keywords/sot_master.csv`
2. Filter: `tier = winnable`, sort by `priority_score` descending
3. Take top 15-20 keywords
4. Run Mode 1 spot check for each keyword
5. Save results to `research/aeo/aeo_audit_YYYY-MM-DD.csv`

**Output:**
- CSV saved to `research/aeo/`
- Summary: "Cited in X/Y checks. Strongest: [keywords]. Missing from: [keywords]. Top competitors cited: [names]."
- If previous audit exists, compare: "Changed since last audit: gained [X], lost [Y]"

**Cadence:** Run monthly, or after a batch of new content goes live.

### Mode 3: Citability Audit

Audit a specific page against the AI Citability Rules in `docs/seo/ai-seo-guide.md` Section 16 (the canonical home for the five citability rules + pre-publish gate).

**Layer context:** The 5 citability rules below are Layer 2 optimizations (targeting ChatGPT/Perplexity/Claude). For Google AI Overviews, standard content quality is sufficient. When auditing, check Layer 1 compliance first (unique content, non-commodity, clear structure) before checking Layer 2 patterns.

**Input:** A file path or URL (e.g., "check citability of src/data/post/youtube-seo-tools.mdx")

**Process:**
1. Read the page content
2. Score against each citability rule:

| Rule | Check | Pass/Fail |
|---|---|---|
| Answer block | Self-contained block of 134-167 words answering the primary query? | |
| Entity consistency | Key terms match the canonical entity list in `docs/seo/ai-seo-guide.md` Section 16? | |
| First-party data | At least one claim attributed to SellonTube or founders? (blog posts only) | |
| Definition blocks | Key concepts have standalone 1-2 sentence definitions? | |
| FAQ alignment | FAQ questions written in conversational form? | |

3. Score against the 9 proven citation signals in `docs/seo/ai-seo-guide.md` Section 19 (the extractability rubric — what has actually earned citations on this domain; the archetype is `/blog/how-to-find-youtube-autocomplete-keywords`):

| Signal | Check | Pass/Fail |
|---|---|---|
| Visible FAQ | `## FAQ` section rendered in the body (not frontmatter-only)? | |
| Definition blocks | Standalone definitions for key concepts? | |
| Answer blocks | 134-167 word self-contained answer present? | |
| Table of contents | ToC with anchors (especially tool pages)? | |
| Question-style H2s | Subheadings phrased as questions? | |
| Comparison/data tables | At least one comparison or data table? | |
| First-party data | A claim attributed to SellonTube or founders? | |
| Fresh dates | Recent, genuine update reflected in dates? | |
| Internal links | Cluster + `/tools` links for topical authority? | |

4. **Visible-FAQ gap flag (highest-leverage):** Explicitly check whether the page carries a frontmatter `faqs` array but has NO visible `## FAQ` section in the body. If so, flag it as the biggest citation gap per `docs/seo/ai-seo-guide.md` Section 19 → the Q&A never reaches the page, so AI engines cannot lift it. Recommend rendering the FAQ in the body.

5. Score against GEO optimization dimensions (from `docs/seo/ai-seo-guide.md` Section 7):

| Dimension | Weight | Check |
|---|---|---|
| Citability | 25% | Self-contained answer blocks (134-167 words), quotable facts, attributed claims |
| Structural readability | 20% | Clear heading hierarchy, question-based subheadings, formatted lists |
| Multi-modal content | 15% | Text combined with images, videos, tables, or infographics |
| Authority signals | 20% | Author credentials, publication dates, source citations, cross-platform presence |
| Technical accessibility | 20% | Server-side rendered (Astro = yes), AI crawlers allowed |

6. For each fail, provide a specific fix suggestion with example text

**Output:** Pass/fail tables with fix suggestions. Overall score: X/5 citability rules passed + X/9 proven signals + GEO dimension scores. Surface any frontmatter-`faqs`-without-visible-`## FAQ` finding at the top as the priority fix.

**When to run:** After content-qa (agent 05) and before publishing. Mode 3 is the AEO equivalent of the style guide QA pass.

## Publishing Workflow Integration

The recommended publishing flow with AEO added:

1. Draft (agent 04-blog-writer)
2. Style QA (agent 05-content-qa)
3. **Citability audit (agent 11-aeo-monitor, Mode 3)** -- new step
4. Fix any citability failures
5. Publish

## Key Files

- `docs/seo/ai-seo-guide.md` Section 16 — AI Citability Rules (canonical source for the 5 rules + pre-publish gate that Mode 3 checks against)
- `docs/seo/ai-seo-guide.md` Section 17 — Citation-Ready Language Rules
- `docs/seo/ai-seo-guide.md` Section 18 — Media Policy
- `docs/seo/ai-seo-guide.md` Section 19 — proven evidence: the cited archetype, the 9 citation signals, and the visible-FAQ gap (Mode 3 scores against these)
- `docs/blog/content-depth-framework.md` — word-count / depth only (citability rules now live in `docs/seo/ai-seo-guide.md` Section 16)
- `research/keywords/sot_master.csv` — keyword source for Mode 2
- `research/aeo/` — output directory for batch audit CSVs
- `public/llms.txt` — update when new tools or major pages ship
- `public/llms-full.txt` — full content map for AI systems
- `docs/seo/ai-seo-guide.md` Section 6 (Platform-Specific Ranking Factors and Citation Patterns) — how each AI system (Google AI Overviews, ChatGPT, Perplexity, Claude) selects and cites content. Includes citation frequency, format preferences, authority signals, and optimal content structures for citation (definition blocks, stat blocks, Q&A pairs, comparison tables, step-by-step, before/after). Use when advising on content structure for citability.
- `docs/seo/ai-seo-guide.md` Section 7 (GEO Scoring Framework) — GEO optimization prompt patterns including citability scoring (25%), structural readability (20%), multi-modal content (15%), authority signals (20%), and technical accessibility (20%). Key insight: "Brand mentions correlate 3x more strongly with AI visibility than backlinks." Use as scoring framework for Mode 3 citability audits.

## Rules

- Do not fabricate AI engine results. If web search is unavailable, say so and suggest manual checks.
- When reporting competitors cited, note their specific advantage (e.g., "Backlinko cited for youtube seo tools -- they have a comprehensive tools roundup post with 15+ tools reviewed").
- Always compare against previous audits when they exist in `research/aeo/`.
- Never recommend changes that conflict with `docs/seo/seo-rules.md` or `docs/blog/style-guide.md`.
