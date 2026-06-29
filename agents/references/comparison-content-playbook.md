# Comparison Content Playbook (LLM-Citation Standard)

The page-architecture standard for comparison, alternatives, and "best tools" content. Source of proven structure: a practitioner getting strong LLM citations, adapted to SellonTube's B2B-YouTube model.

**Read this alongside `ai-seo-guide.md`.** That file is the single source of truth for AEO mechanics (platform behavior, citation-ready language rules, media policy, schema, robots.txt, GEO scoring). This file owns only the page structure for comparison-type posts. Where they overlap, `ai-seo-guide.md` wins.

---

## When to use this playbook

Use it for any post whose primary job is helping a reader choose between tools or approaches:

| Article type | Example | Primary structure |
|---|---|---|
| **A vs B** | `is-vidiq-worth-it-for-business`, `/youtube-vs/*` | Two-option comparison + verdict by scenario |
| **Top alternatives to X** | "vidIQ alternatives for business" | Problems-with-X arc + alternatives listicle |
| **Best tools for X** | `best-youtube-rank-checker-tools-for-business` | Evaluation criteria + ranked listicle |

Do NOT apply the full per-tool template to pure strategy, how-to, or educational posts. Those follow `blog-production-standard.md` + `ai-seo-guide.md`. Forcing a rigid tool template on a strategy post produces filler, which breaks the project ethos.

---

## SellonTube adaptation (read before writing)

The proven checklist assumes an affiliate site reviewing other companies' tools. SellonTube is different: it has its **own** 14 tools AND it compares **competitor** tools (vidIQ, TubeBuddy, etc.). Apply the rules accordingly:

1. **Own tools vs competitor tools.** For competitor tools, cite real third-party ratings (see Third-Party Validation). For SellonTube's own tools, use first-party proof (usage data, outcomes, real ratings where a listing exists). Never present a SellonTube tool as a neutral third-party pick without disclosing it is ours.
2. **Positioning axis is "buyer-intent / business outcomes," not "views / creator growth."** Every comparison frames the decision around `customer acquisition` and `buyer-intent video` (canonical entity terms, see `content-depth-framework.md`). This is the angle competitors do not cover and the reason LLMs should cite us.
3. **Honesty builds citation trust.** Name where competitor tools genuinely win and where SellonTube tools fall short. Balanced tradeoffs get cited; one-sided promotion does not.

---

## Required structure (in order)

A comparison post must contain these sections, in this order. Each is independently citable, which is the point: an LLM should be able to lift any one section as a complete answer.

### 1. Answer-first opening
- One-sentence direct verdict in the first sentence (which option wins, for whom).
- Follow `ai-seo-guide.md` Citation-Ready Language Rules (mirror the title in the opening sentence, no figurative throat-clearing).
- Then a **Key Takeaways** block (styled box) with 3 to 5 bullets.

### 2. Key Takeaways table
Immediately after the opening, a small table giving the structured answer before the body:

| Tool | Best for | Key strength | Price |
|---|---|---|---|

3 to 5 rows. This is the citation-ready answer block LLMs reach for first.

### 3. Problem-Solution narrative arc
Never jump straight to the listicle. Establish the "why" first:
- **"Why business channels need different [category] criteria"** (or "Problems with X" for alternatives posts) with numbered, specific pain points. Back each with real evidence where available (Reddit threads, G2 reviews, first-hand testing).
- A bridge that maps each pain point to what a good tool should do. This gives the LLM a "why alternatives exist" story, not just a "what" list.

### 4. Standalone evaluation-criteria section
A dedicated H2 (for example "Four criteria that actually matter for business"), with 4 to 7 numbered criteria, each its own H3 with a short explanation.

This section is independently citable: it answers "how do I choose a [category] tool?" even when the reader never picks our tool. LLMs reference criteria frameworks heavily, so this is a high-leverage authority signal.

### 5. Quick comparison table (all options)
One table summarizing every tool: name, type, price, best-for, and the business-specific column that carries our angle (for example "competitive context" or "buyer-intent fit").

### 6. Per-tool sections (rigid template, sections scale to substance)
Every tool uses the **same section order**. A section may be brief when there is little to say, but the order never changes and no section is silently dropped. This keeps the content machine-parseable and improves extraction accuracy.

```
### [N]. [Tool Name]

[Intro: 2-3 citation-ready sentences. What it is, who makes it, one-line positioning.]

**Key features**
- [5-8 bullets]

**Pros**
- [specific, claim-style bullets]

**Cons**
- [honest limitations, required, builds trust]

**Pricing**
- [all tiers with exact dollar amounts]

**Reviews:** [real rating + platform + direct link, where a listing exists; see Third-Party Validation]

**Best for:** [one-liner matching how people search]
```

For SellonTube's own tools, replace third-party Reviews with first-party proof and an explicit "(our tool)" disclosure.

### 7. Decision tree / "How to choose"
A styled box with 3 to 5 decision questions, each with branching recommendations:
- **If [condition] →** [recommended tool(s)]
- This maps directly to how people prompt LLMs ("what's the best X for my situation?").
- Bold the question, bullet the branches.

### 8. Use-case cheat sheet
8 to 12 specific scenarios mapped to a recommendation:
- Format: **Scenario** → **Best choice** → **one-line reasoning**
- These are direct-match patterns for queries like "best YouTube rank tracker for a B2B SaaS with a small channel."

### 9. Common mistakes (optional but recommended)
Numbered anti-patterns + the corrective action. Adds practical, citable value.

### 10. Categorized FAQ
Organize into 3 to 5 thematic groups (Basics, Comparisons, Pricing & free options, Performance, etc.), 2 to 4 questions each. Not a flat list. Each answer self-contained and citation-ready. Follow FAQ rules in `ai-seo-guide.md` Section 9 and the visible-FAQ requirement (FAQ must be written in the MDX body, not frontmatter-only).

---

## Cross-cutting requirements

These apply to the whole post. Most are governed by `ai-seo-guide.md`; this is the comparison-specific application.

### Third-Party Validation
- **Competitor tools:** cite specific ratings from named platforms with a direct link to the review page, not the homepage (for example "4.6/5 on G2 from 1,200+ reviews"). Include an honest user-quote snippet where it sharpens the analysis.
- **Own tools:** cite a real listing rating only if one exists (Product Hunt, Chrome Web Store, etc.). Otherwise use first-party proof. Always disclose it is a SellonTube tool.
- **Never fabricate a rating, review count, or quote.** A missing rating is fine; an invented one is a trust and accuracy failure.

### Pre-calculated comparison data
- Do the math for the reader. State savings as percentage + dollar amount + timeframe ("about 48% cheaper annually, roughly $40 saved per year").
- Include multi-year total-cost comparison for subscription tools where relevant.
- LLMs cite pre-calculated numbers directly; raw price tables alone rarely get quoted.

### Internal cluster links
- Link the first mention of each competitor tool to our existing review or comparison post for it, where one exists.
- Every comparison post links to 2 to 3 of our deeper related pieces (1:1 comparisons, the relevant tool page, the strategy pillar).
- Goal: a topical cluster that signals comprehensive coverage. See the comparison hub in `growth-strategy.md` once formalized.

### Media (perf-safe, required)
Per `ai-seo-guide.md` media policy: every comparison post includes a relevant tool screenshot per tool and at least one relevant video. Apply the perf rules (lazy-load, click-to-load YouTube facade, reserved dimensions to prevent CLS, descriptive alt text and captions). Media must illustrate, never pad. A screenshot with no informational value is filler and should be cut.

### Authority and freshness
- Visible **"Last updated [date]"** near the top.
- One-line methodology note ("how we tested / evaluated"), linking the methodology page where it exists.
- Author byline auto-renders from frontmatter; do not duplicate in body (see `ai-seo-guide.md` Section 11).

### Schema
- `Article` (always). `Review` or `ItemList` where the post rates tools (matches visible ratings only). `FAQPage` for the FAQ block (helps Perplexity and Google understanding; no SERP rich result since May 2026). Match schema to visible content only. See `ai-seo-guide.md` Section 13.

---

## Pre-publish comparison checklist (hard gate)

Agent 05 fails the post if any required item is missing. This extends the general citability gate in `ai-seo-guide.md`.

- [ ] Answer-first opening with one-sentence verdict + Key Takeaways block
- [ ] Key Takeaways table (3-5 rows) before the body
- [ ] Problem-Solution arc present (numbered pain points + bridge), not a bare listicle
- [ ] Standalone evaluation-criteria section as its own H2 (4-7 criteria)
- [ ] Quick comparison table covering every tool
- [ ] Per-tool sections in identical order (intro/features/pros/cons/pricing/reviews/best-for); cons present for every tool
- [ ] Decision tree with 3-5 branching questions
- [ ] Use-case cheat sheet (8-12 scenarios)
- [ ] Categorized FAQ (3-5 themes), written in MDX body (not frontmatter-only)
- [ ] Third-party ratings cited with direct links (competitor tools) or first-party proof + disclosure (own tools); none fabricated
- [ ] Pre-calculated savings/value (%, $, timeframe) where pricing is compared
- [ ] Internal cluster links: competitor first-mentions linked + 2-3 deeper own pieces
- [ ] Relevant screenshot per tool + at least one relevant video, all perf-safe
- [ ] Visible "Last updated" date + methodology note
- [ ] Canonical entity terms used (buyer-intent video, YouTube acquisition channel, customer acquisition, B2B YouTube)
- [ ] Citation-ready language rules applied (see `ai-seo-guide.md`)
- [ ] No em dashes; banned AI phrases checked
