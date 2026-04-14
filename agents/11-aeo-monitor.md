# Agent 11 — AEO Monitor

## Purpose

Monitor and improve SellonTube's visibility in AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews). Ensure content is structured for citation, track whether SellonTube appears in AI-generated answers, and identify gaps.

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

Audit a specific page against the AI Citability Rules in `content-depth-framework.md`.

**Input:** A file path or URL (e.g., "check citability of src/data/post/youtube-seo-tools.mdx")

**Process:**
1. Read the page content
2. Score against each citability rule:

| Rule | Check | Pass/Fail |
|---|---|---|
| Answer block | Self-contained block of 134-167 words answering the primary query? | |
| Entity consistency | Key terms match canonical list in content-depth-framework.md? | |
| First-party data | At least one claim attributed to SellonTube or founders? (blog posts only) | |
| Definition blocks | Key concepts have standalone 1-2 sentence definitions? | |
| FAQ alignment | FAQ questions written in conversational form? | |

3. Score against GEO optimization dimensions (from `agents/references/geo-skill-patterns.md`):

| Dimension | Weight | Check |
|---|---|---|
| Citability | 25% | Self-contained answer blocks (134-167 words), quotable facts, attributed claims |
| Structural readability | 20% | Clear heading hierarchy, question-based subheadings, formatted lists |
| Multi-modal content | 15% | Text combined with images, videos, tables, or infographics |
| Authority signals | 20% | Author credentials, publication dates, source citations, cross-platform presence |
| Technical accessibility | 20% | Server-side rendered (Astro = yes), AI crawlers allowed |

4. For each fail, provide a specific fix suggestion with example text

**Output:** Pass/fail table with fix suggestions. Overall score: X/5 citability rules passed + GEO dimension scores.

**When to run:** After content-qa (agent 05) and before publishing. Mode 3 is the AEO equivalent of the style guide QA pass.

## Publishing Workflow Integration

The recommended publishing flow with AEO added:

1. Draft (agent 04-blog-writer)
2. Style QA (agent 05-content-qa)
3. **Citability audit (agent 11-aeo-monitor, Mode 3)** -- new step
4. Fix any citability failures
5. Publish

## Key Files

- `content-depth-framework.md` — AI Citability Rules section (the rules Mode 3 checks against)
- `research/keywords/sot_master.csv` — keyword source for Mode 2
- `research/aeo/` — output directory for batch audit CSVs
- `public/llms.txt` — update when new tools or major pages ship
- `public/llms-full.txt` — full content map for AI systems
- `agents/references/ai-citation-patterns.md` — how each AI system (Google AI Overviews, ChatGPT, Perplexity, Claude) selects and cites content. Includes citation frequency, format preferences, authority signals, and optimal content structures for citation (definition blocks, stat blocks, Q&A pairs, comparison tables, step-by-step, before/after). Use when advising on content structure for citability. (Source: seo-geo-claude-skills)
- `agents/references/geo-skill-patterns.md` — GEO optimization prompt patterns including citability scoring (25%), structural readability (20%), multi-modal content (15%), authority signals (20%), and technical accessibility (20%). Key insight: "Brand mentions correlate 3x more strongly with AI visibility than backlinks." Use as scoring framework for Mode 3 citability audits. (Source: claude-seo)

## Rules

- Do not fabricate AI engine results. If web search is unavailable, say so and suggest manual checks.
- When reporting competitors cited, note their specific advantage (e.g., "Backlinko cited for youtube seo tools -- they have a comprehensive tools roundup post with 15+ tools reviewed").
- Always compare against previous audits when they exist in `research/aeo/`.
- Never recommend changes that conflict with `seo-rules.md` or `style-guide.md`.
