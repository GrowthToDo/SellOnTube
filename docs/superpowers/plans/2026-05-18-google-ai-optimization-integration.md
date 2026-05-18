# Google AI Optimization Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Google's official AI optimization guide into all SellonTube reference docs and agent specs using a layered approach — Google as primary layer, non-Google AI platforms (ChatGPT, Perplexity, Claude) as secondary layer.

**Architecture:** Every reference doc and agent spec gets updated to reflect Google's position that "good SEO = good AI SEO" as the foundation. Platform-specific AEO tactics (answer blocks, definition blocks, content freshness, entity consistency) are preserved but clearly scoped to non-Google platforms. FAQ schema is kept but demoted from #1 priority. No code changes — all files are markdown.

**Source:** https://developers.google.com/search/docs/fundamentals/ai-optimization-guide (May 2026)

**Key Google Positions to Integrate:**
1. Traditional SEO best practices remain foundational for generative AI features
2. Create valuable, non-commodity content with unique perspectives
3. Clear technical structure (semantic HTML, indexable, crawlable)
4. Misconceptions to avoid: llms.txt as ranking signal, content chunking for AI, rewriting specifically for AI, inauthentic brand mentions, overemphasizing structured data

**Layered Approach:**
- **Layer 1 (PRIMARY — Google AI Overviews):** Good SEO IS good AI SEO. No special AI tricks. Unique content, technical excellence, E-E-A-T.
- **Layer 2 (SECONDARY — ChatGPT, Perplexity, Claude, Copilot):** Platform-specific citation mechanics. Answer blocks, definition blocks, entity consistency, content freshness, llms.txt — all still valid for these platforms.

---

## Files to Modify

| # | File | Change Type |
|---|------|-------------|
| 1 | `ai-seo-guide.md` | Major restructure — add layered framework, Google's official position, demote FAQ schema, reframe content blocks |
| 2 | `content-depth-framework.md` | Moderate — add Google-first preamble to AI Citability Rules |
| 3 | `seo-rules.md` | Add new section — AI Search Optimization |
| 4 | `content-playbook.md` | Moderate — add to Section 5 SEO Craft + quality checklist |
| 5 | `blog-production-standard.md` | Minor — add AI optimization checkpoint to checklist |
| 6 | `growth-strategy.md` | Add new section — AI Visibility Targets |
| 7 | `agents/04-blog-writer.md` | Moderate — update Phase 2 with Google-first guidance |
| 8 | `agents/05-content-qa.md` | Moderate — add anti-over-optimization check, update AI citation tier |
| 9 | `agents/08-microtool-builder.md` | Minor — add citability note to Phase 5 |
| 10 | `agents/11-aeo-monitor.md` | Moderate — add Google layer to Mode 3, update priority |
| 11 | `agents/references/ai-citation-patterns.md` | Moderate — update Google AI Overviews section |
| 12 | `agents/references/geo-skill-patterns.md` | Minor — add Google's official position as context |

---

### Task 1: Restructure `ai-seo-guide.md` — Primary Reference Doc

**Files:**
- Modify: `ai-seo-guide.md` (entire file — major restructure)

This is the highest-impact change. Everything else references this file.

- [ ] **Step 1: Rewrite the introduction (lines 1-6) to establish the layered approach**

Replace the current intro:
```
# SellonTube AI SEO Guide
## Getting Cited by AI Search Engines, Not Just Ranked by Google

Traditional SEO gets you ranked. AI SEO gets you **cited**. A well-structured page can get cited by ChatGPT, Perplexity, or Google AI Overviews even if it ranks on page 2 or 3 in traditional search. As AI-powered search becomes the default for SellonTube's ICP (B2B founders, SaaS operators), being the source AI systems reference is as important as ranking on page 1.

This document governs all AI citation optimisation work. Read it alongside `seo-rules.md` (traditional SEO rules) before any content or technical SEO decision.
```

With:
```
# SellonTube AI SEO Guide
## Ranking in Traditional Search AND Getting Cited by AI

This guide uses a **two-layer approach** to AI search optimization:

**Layer 1 — Google AI Overviews (primary).** Google's official position (May 2026): traditional SEO best practices ARE AI optimization. There is no separate "AI SEO" for Google. Good content, clear structure, and technical excellence get you into AI Overviews the same way they get you ranked in traditional search. This is our foundation.

**Layer 2 — ChatGPT, Perplexity, Claude, Copilot (secondary).** These platforms have their own citation mechanics that go beyond traditional SEO. Platform-specific tactics (answer blocks, content freshness, entity consistency, definition blocks) still provide measurable citation advantages on these platforms. These are our edge.

**The principle:** Build for Google first (Layer 1). Then add Layer 2 optimizations that also make content better for human readers. Never sacrifice Layer 1 quality for Layer 2 tricks.

Read this alongside `seo-rules.md` (traditional SEO rules) before any content or technical SEO decision.
```

- [ ] **Step 2: Add new Section 1 — Google's Official AI Optimization Guidance**

Insert after the intro, BEFORE the current "1. The Three Pillars" section (which becomes Section 2). New section:

```
---

## 1. Google's Official AI Optimization Guidance (Layer 1)

**Source:** https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Google's generative AI features on Search are rooted in core Search ranking and quality systems. Their guidance:

### What Works for Google AI Overviews
1. **Create valuable, non-commodity content.** Develop unique perspectives. Prioritize helpful, reliable, people-first content. Organize clearly with headings and sections. Include high-quality images and videos.
2. **Build clear technical structure.** Pages must meet Search technical requirements and be indexable. Use semantic HTML. Provide good page experience across devices. Reduce duplicate content.
3. **Follow existing SEO fundamentals.** Crawling best practices, JavaScript SEO, structured data where it matches visible content — all standard SEO.

### What Google Says Does NOT Help (Misconceptions)
These are things Google explicitly calls out as misconceptions. **Do not optimize for these when targeting Google AI Overviews:**

| Misconception | Google's Position | Our Approach |
|---|---|---|
| Creating llms.txt files | Not a Google signal | Keep for Layer 2 (ChatGPT/Perplexity may use it). Low cost, no harm. |
| "Chunking" content into tiny pieces for AI extraction | Not how Google's AI works | Write naturally for humans. Layer 2 answer blocks are a bonus, not the goal. |
| Rewriting content specifically for AI systems | Unnecessary for Google | Write for humans. Layer 2 structural patterns (definition blocks, FAQ alignment) happen to help AI extraction too. |
| Pursuing inauthentic brand mentions | Penalized, not rewarded | Never do this on any platform. |
| Overemphasizing structured data | Schema helps understanding but is not "the single biggest lever" | Use schema where it matches visible content. Don't overstate its impact. |

### Key Insight
Google states: "Plenty of content thrives in Google Search (including generative AI experiences) without any overt SEO at all." The implication: content quality and uniqueness matter more than any optimization tactic.
```

- [ ] **Step 3: Renumber Section 1 → Section 2 ("The Three Pillars")**

Change `## 1. The Three Pillars` to `## 2. The Three Pillars`. No content changes needed — the three pillars (Structure, Authority, Presence) still apply across both layers.

- [ ] **Step 4: Renumber Section 2 → Section 3 ("Platform Priority") — no content changes**

Change `## 2. Platform Priority for SellonTube's ICP` to `## 3. Platform Priority for SellonTube's ICP`.

- [ ] **Step 5: Update Section 3 → Section 4 ("Platform-Specific Ranking Factors") — rewrite Google AI Overviews subsection**

Change `## 3. Platform-Specific Ranking Factors` to `## 4. Platform-Specific Ranking Factors`.

Replace the Google AI Overviews subsection (lines 37-42):
```
### Google AI Overviews
- Schema markup is the single biggest lever — Article, FAQPage, HowTo schemas give AI structured context (30-40% visibility boost)
- E-E-A-T signals weighted heavily — author credentials, cited sources, topical authority
- Target "how to" and "what is" query patterns — these trigger AI Overviews most often
- Only ~15% of AI Overview sources overlap with traditional top 10 — pages outside page 1 can still be cited with strong schema and extractable content
- Named, sourced citations in content correlate with 132% visibility boost
```

With:
```
### Google AI Overviews (Layer 1 — follow Section 1 above)
- **Google's official position: traditional SEO best practices ARE AI Overviews optimization.** No special tactics needed.
- Schema helps Google understand content but is NOT "the single biggest lever." Use it where it matches visible content — don't overstate its impact.
- E-E-A-T signals matter — author credentials, cited sources, topical authority. This is standard SEO.
- "How to" and "what is" queries trigger AI Overviews most often.
- ~15% of AI Overview sources overlap with traditional top 10 — pages outside page 1 can still be cited with strong content quality.
- Named, sourced citations in content correlate with higher visibility (third-party studies suggest 132% boost, though Google does not confirm this metric).
- **Do not create content specifically for AI Overviews.** Create the best content for the query. Google's AI features will find it.
```

- [ ] **Step 6: Add "(Layer 2)" labels to ChatGPT, Perplexity, Claude, Copilot subsections**

Change each subsection heading:
- `### ChatGPT` → `### ChatGPT (Layer 2)`
- `### Perplexity` → `### Perplexity (Layer 2)`
- `### Claude` → `### Claude (Layer 2)`
- `### Microsoft Copilot` → `### Microsoft Copilot (Layer 2)`

No content changes within these subsections — their platform-specific advice remains valid.

- [ ] **Step 7: Renumber Section 4 → Section 5 (robots.txt) — add llms.txt context**

Change `## 4. robots.txt — Allow All AI Bots` to `## 5. robots.txt — Allow All AI Bots`.

Add after the existing content (after line 89), before the `---`:
```

**Note on llms.txt:** Google explicitly states that creating llms.txt files is not a ranking signal for Google AI features. We maintain `public/llms.txt` and `public/llms-full.txt` as a low-cost Layer 2 optimization — Perplexity and other non-Google AI systems may use them for site understanding. Keep them updated when new tools/pages ship, but do not treat them as a priority.
```

- [ ] **Step 8: Renumber Sections 5-6 → 6-7 (AEO/GEO Content Block Patterns) — add Layer 2 framing**

Change `## 5. AEO Content Block Patterns` to `## 6. AEO Content Block Patterns (Layer 2)`.

Replace the intro paragraph (lines 93-95):
```
These are reusable content structures that maximise extractability by AI systems. Agent 04 must use the appropriate pattern for each content type. Agent 05 must verify the correct pattern is in place.
```

With:
```
These content block patterns optimize for citation by non-Google AI platforms (ChatGPT, Perplexity, Claude). Google does not require these specific structures — good content is enough for AI Overviews (see Section 1).

That said, these patterns also produce better content for human readers: clearer definitions, more structured how-tos, better comparison tables. Use them because they make content better, not solely for AI extraction.

Agent 04 must use the appropriate pattern for each content type. Agent 05 must verify the correct pattern is in place.
```

Change `## 6. GEO Content Block Patterns` to `## 7. GEO Content Block Patterns (Layer 2)`.

Replace the intro (line 170):
```
These patterns optimise content for citation by AI assistants (ChatGPT, Claude, Perplexity, Gemini).
```

With:
```
These patterns optimize for citation by non-Google AI assistants (ChatGPT, Claude, Perplexity). For Google AI Overviews, standard SEO quality is sufficient (see Section 1). These patterns are Layer 2 optimizations that also improve content quality for human readers.
```

- [ ] **Step 9: Renumber Sections 7-10 → 8-11 and update FAQ schema priority in Section 10 (was 9)**

Renumber:
- `## 7. Author Bio and E-E-A-T Requirements` → `## 8. Author Bio and E-E-A-T Requirements`
- `## 8. Content Freshness Rule` → `## 9. Content Freshness Rule`
- `## 9. Schema Priority for AI Citation` → `## 10. Schema Priority for AI Citation`
- `## 10. Monthly AI SEO Checklist` → `## 11. Monthly AI SEO Checklist`

In the Schema Priority section (was Section 9, now Section 10), replace the table and surrounding text:

Old (lines 245-258):
```
The existing schema gaps documented in Agent 07 are also the highest-impact schemas for AI citation. Priority order:

| Schema | AI platform impact | Status |
|---|---|---|
| `FAQPage` | Perplexity (high), Google AI Overviews (high) | Pending implementation |
| `Article` | Google AI Overviews (high), ChatGPT (medium) | Pending implementation |
| `HowTo` | Google AI Overviews (high) | Pending implementation |
| `BreadcrumbList` | Google AI Overviews (medium) | Pending implementation |
| `Organization` | All platforms (baseline trust signal) | Implemented |
| `WebSite` | All platforms (baseline trust signal) | Implemented |

Implement in the order listed above. FAQPage first — it impacts two high-priority platforms and is the fastest to add.
```

New:
```
Schema helps AI systems understand content, but Google explicitly warns against overemphasizing structured data. Use schema where it matches visible on-page content. Priority order (updated May 2026 after Google killed FAQ rich results):

| Schema | Impact | Status | Notes |
|---|---|---|---|
| `Article` | Google AI Overviews (high), ChatGPT (medium) | Pending implementation | Highest priority — directly supports Layer 1 |
| `HowTo` | Google AI Overviews (high) | Pending implementation | Use only on genuine how-to content |
| `BreadcrumbList` | Google AI Overviews (medium) | Pending implementation | Navigation signal |
| `FAQPage` | Perplexity (high), Google understanding (medium) | Pending implementation | **Demoted from #1.** FAQ rich results killed May 7, 2026. Markup still helps Google understanding and Perplexity citation, but no visual SERP benefit. |
| `Organization` | All platforms (baseline trust signal) | Implemented | |
| `WebSite` | All platforms (baseline trust signal) | Implemented | |

Implement Article schema first — it has the broadest impact across both layers.
```

- [ ] **Step 10: Update Monthly Checklist (now Section 11) — add Layer 1 check**

In the monthly checklist, add as the FIRST item:
```
- [ ] Review content against Google's AI optimization guidance (Section 1) — are we creating unique, non-commodity content?
```

- [ ] **Step 11: Verify all section numbers are sequential (1-11) and all cross-references within the file are updated**

Read the full file, confirm numbering is 1 through 11, and any internal references (e.g., "see Section X") point to correct sections.

- [ ] **Step 12: Commit**

```
git add ai-seo-guide.md
git commit -m "docs: restructure ai-seo-guide with Google AI optimization layered approach

Integrates Google's official AI optimization guide (May 2026) as Layer 1.
Reframes platform-specific AEO tactics as Layer 2 for non-Google platforms.
Demotes FAQ schema from #1 priority after rich results removal.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Update `content-depth-framework.md` — AI Citability Rules Preamble

**Files:**
- Modify: `content-depth-framework.md` (AI Citability Rules section, ~line 88+)

- [ ] **Step 1: Read the AI Citability Rules section to get exact content**

Run: `Read content-depth-framework.md` from line 85 to line 125.

- [ ] **Step 2: Add Google-first preamble before the AI Citability Rules**

Find the heading `## AI Citability Rules (AEO)` and add a preamble paragraph immediately after it, before the existing rules:

Add after the heading:
```

**Google's position (May 2026):** For Google AI Overviews, traditional SEO quality IS AI optimization. These citability rules are primarily Layer 2 optimizations targeting ChatGPT, Perplexity, and Claude. However, every rule below also makes content clearer and more useful for human readers — so apply them as good writing practice, not as AI-specific tricks. See `ai-seo-guide.md` Section 1 for the full Google guidance.

```

- [ ] **Step 3: Update the citability checklist to reference the layered approach**

Find the citability checklist section. Add one item at the top:
```
- [ ] Content quality first — does this page follow Google's core guidance (unique perspective, non-commodity content, clear structure)?
```

- [ ] **Step 4: Commit**

```
git add content-depth-framework.md
git commit -m "docs: add Google-first preamble to AI citability rules

Clarifies that citability rules are Layer 2 (non-Google) optimizations
that also improve content quality for human readers.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Update `seo-rules.md` — Add AI Search Section

**Files:**
- Modify: `seo-rules.md` (add new section before `## Technical`)

- [ ] **Step 1: Add new section before the Technical section (line 98)**

Insert before `## Technical`:

```
## AI Search Optimization

SellonTube uses a two-layer approach. See `ai-seo-guide.md` for full details.

**Layer 1 — Google AI Overviews (primary):**
- Google's official position: good SEO IS AI SEO. No special tactics needed.
- Do NOT create content specifically for AI. Create the best content for the query.
- Schema helps understanding but is not a magic lever. Use where it matches visible content.
- Misconceptions (per Google): llms.txt as ranking signal, content chunking for AI, rewriting for AI systems, overemphasizing structured data.

**Layer 2 — ChatGPT, Perplexity, Claude (secondary):**
- Platform-specific citation mechanics apply. See `ai-seo-guide.md` Sections 6-7.
- Content freshness critical for ChatGPT (30-day update = 3.2x citation boost).
- Answer blocks, definition blocks, entity consistency — valid for these platforms.
- Keep `public/llms.txt` and `public/llms-full.txt` updated (not a Google signal, but low-cost Layer 2).
- All AI crawlers allowed in `robots.txt` (GPTBot, PerplexityBot, ClaudeBot, etc.).

**FAQ Schema (updated May 2026):** FAQ rich results killed by Google on May 7, 2026. Keep FAQPage markup (still helps Google understanding + Perplexity citation) but no visual SERP benefit. Article schema is now highest priority.

---

```

- [ ] **Step 2: Commit**

```
git add seo-rules.md
git commit -m "docs: add AI search optimization section to SEO rules

Two-layer summary referencing ai-seo-guide.md.
Notes FAQ rich results removal and schema priority update.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Update `content-playbook.md` — SEO Craft + Quality Checklist

**Files:**
- Modify: `content-playbook.md` (Section 5 + Section 9)

- [ ] **Step 1: Add AI optimization subsection after 5.6 (Monthly CTR Audit, ~line 318)**

Insert after the `---` following Section 5.6, before Section 6:

```
### 5.7 AI Search Optimization (applies to every post)

Google's AI Overviews are powered by the same ranking systems as traditional search. **There is no separate "AI SEO" for Google.** The SEO craft rules above (5.1-5.6) already optimize for Google AI Overviews.

For non-Google AI platforms (ChatGPT, Perplexity, Claude), apply these additional checks:
- **Content freshness:** Posts targeting competitive keywords must be updated every 90 days. Core cluster posts monthly. (See Section 6, Content Refreshes.)
- **Answer blocks:** Include 1-2 self-contained, quotable paragraphs per post that AI can extract without surrounding context. See `ai-seo-guide.md` Section 7.
- **Definition blocks:** For any concept SellonTube wants to be cited for, include a bold term + one-sentence definition as a standalone paragraph.
- **Entity consistency:** Use exact canonical terms across all pages: "buyer-intent video", "YouTube acquisition channel", "customer acquisition", "B2B YouTube".

**Do not sacrifice human readability for AI optimization.** If an AI-specific pattern makes the content worse for human readers, skip it.

See `ai-seo-guide.md` for the full two-layer framework.

```

- [ ] **Step 2: Update Quality Checklist Section 9 — add AI optimization gate**

In the `**SEO:**` checklist block (~line 402-408), add after the last SEO item:

```
- [ ] AI optimization: post follows Layer 1 (Google) fundamentals — unique perspective, non-commodity content, clear structure
- [ ] AI optimization: Layer 2 patterns applied where natural — answer block, definition block, entity consistency (see ai-seo-guide.md)
```

- [ ] **Step 3: Commit**

```
git add content-playbook.md
git commit -m "docs: add AI search optimization to content playbook

New Section 5.7 with two-layer framework.
Updated quality checklist with AI optimization gates.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Update `blog-production-standard.md` — AI Optimization Checkpoint

**Files:**
- Modify: `blog-production-standard.md` (first-draft quality checklist, near end of file)

- [ ] **Step 1: Read the end of blog-production-standard.md to find the checklist**

Run: `Read blog-production-standard.md` from line 300 to end.

- [ ] **Step 2: Add AI optimization checkpoint to the production checklist**

Find the section closest to the end that contains the first-draft quality checklist. Add a new subsection:

```
**AI SEARCH OPTIMIZATION:**
- [ ] Content offers a unique perspective — not a rehash of existing top 10 results (Google Layer 1)
- [ ] No over-optimization for AI at expense of human readability (Google warns against this)
- [ ] At least 1 self-contained answer block that AI platforms can extract (Layer 2)
- [ ] Definition blocks for key concepts SellonTube wants cited for (Layer 2)
- [ ] Entity consistency — canonical terms used throughout (Layer 2)
```

- [ ] **Step 3: Commit**

```
git add blog-production-standard.md
git commit -m "docs: add AI search optimization to blog production checklist

Layer 1 (Google) and Layer 2 (non-Google) checkpoints.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Update `growth-strategy.md` — AI Visibility Targets

**Files:**
- Modify: `growth-strategy.md` (add new section after the existing pillars/strategy sections)

- [ ] **Step 1: Read growth-strategy.md to find the right insertion point**

Read the file to find where the strategy sections end and identify the best place for an AI visibility section. Look for the section that discusses content audit or tools impressions audit — insert after that.

- [ ] **Step 2: Add AI Visibility Targets section**

Insert as a new section:

```
---

## AI Search Visibility (Pillar E)

**Approach:** Two-layer framework. See `ai-seo-guide.md` for full details.

**Layer 1 — Google AI Overviews:** No special optimization. Every SEO improvement above automatically improves AI Overviews visibility. Google's official position (May 2026): traditional SEO best practices ARE AI optimization.

**Layer 2 — ChatGPT, Perplexity, Claude:**
- Maintain `public/llms.txt` and `public/llms-full.txt` (update when new tools/pages ship)
- All AI crawlers allowed in `robots.txt` (already configured)
- Content freshness: competitive posts updated every 90 days, core cluster posts monthly
- AEO agent (Agent 11) runs monthly batch audit against top 15-20 winnable keywords
- Citability audit (Agent 11 Mode 3) runs before every blog publish

**Targets:**
- Track GSC "AI Overviews" impressions monthly (baseline TBD — start tracking now)
- Quarterly AEO batch audit: compare against `research/aeo/` baseline
- 5+ quotable passages per blog post (content-depth-framework.md standard)

**What NOT to do:**
- Do not create content specifically for AI systems (Google misconception)
- Do not overemphasize structured data as an AI lever
- Do not pursue inauthentic brand mentions
- Do not sacrifice human readability for AI extraction patterns
```

- [ ] **Step 3: Commit**

```
git add growth-strategy.md
git commit -m "docs: add AI search visibility as Pillar E in growth strategy

Two-layer approach with targets and anti-patterns.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Update `agents/04-blog-writer.md` — Google-First Guidance

**Files:**
- Modify: `agents/04-blog-writer.md`

- [ ] **Step 1: Read the file to find Phase 2 (full draft) section**

Run: `Read agents/04-blog-writer.md` — find the Phase 2 section and the source files list.

- [ ] **Step 2: Add Google-first content note in Phase 2 (full draft instructions)**

Find the Phase 2 section where draft instructions begin. Add a prominent note:

```
**AI Search Optimization (two-layer approach):**
- **Layer 1 (Google AI Overviews):** No special optimization needed. Write the best possible content for the query. Google's AI features use the same ranking systems as traditional search.
- **Layer 2 (ChatGPT, Perplexity, Claude):** Apply content block patterns from `ai-seo-guide.md` Sections 6-7 where they improve the content naturally. Include 1-2 answer blocks, definition blocks for key concepts, and maintain entity consistency.
- **Never sacrifice human readability for AI extraction.** If a pattern makes the content worse, skip it.
```

- [ ] **Step 3: Commit**

```
git add agents/04-blog-writer.md
git commit -m "docs: add two-layer AI optimization guidance to blog writer agent

Google-first approach in Phase 2 draft instructions.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Update `agents/05-content-qa.md` — Anti-Over-Optimization Check

**Files:**
- Modify: `agents/05-content-qa.md`

- [ ] **Step 1: Read the file to find the IMPORTANT tier checklist**

Run: `Read agents/05-content-qa.md` — find the IMPORTANT tier section with AI citation checks.

- [ ] **Step 2: Add anti-over-optimization check to IMPORTANT tier**

Find the "AI citation checks" items in the IMPORTANT tier. Add before them:

```
- **AI over-optimization check (Google Layer 1):** Content must NOT appear to be written specifically for AI systems. Check: Does the content read naturally? Would it make sense if AI search didn't exist? Is it offering a unique perspective or just rehashing existing top results? If over-optimized for AI extraction at the expense of human readability, flag as IMPORTANT violation.
```

- [ ] **Step 3: Add Layer context to existing AI citation checks**

Find the existing AI citation check items. Prepend context:

```
- **AI citation patterns (Layer 2 — ChatGPT/Perplexity/Claude):** The following checks optimize for non-Google AI platforms. They should also improve content quality for humans. If any pattern makes the content worse for human readers, skip it.
```

- [ ] **Step 4: Commit**

```
git add agents/05-content-qa.md
git commit -m "docs: add anti-over-optimization check to content QA agent

Ensures content isn't sacrificing human readability for AI extraction.
Labels existing AI citation checks as Layer 2.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 9: Update `agents/08-microtool-builder.md` — Citability in Phase 5

**Files:**
- Modify: `agents/08-microtool-builder.md`

- [ ] **Step 1: Read Phase 5 section (on-page copy)**

Run: `Read agents/08-microtool-builder.md` — find Phase 5 instructions.

- [ ] **Step 2: Add AI optimization note to Phase 5**

At the end of Phase 5 instructions, add:

```
**AI Search Optimization:**
- Tool page copy follows the two-layer approach (`ai-seo-guide.md`).
- Layer 1 (Google): Write the best content for the query. No special AI tricks.
- Layer 2 (non-Google): Include 1 definition block for the tool's core concept and 1 self-contained answer block in the "Why [Key Metric] Matters" section. Maintain entity consistency with canonical SellonTube terms.
```

- [ ] **Step 3: Commit**

```
git add agents/08-microtool-builder.md
git commit -m "docs: add AI optimization guidance to microtool builder Phase 5

Two-layer approach for tool page on-page copy.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 10: Update `agents/11-aeo-monitor.md` — Layered Monitoring

**Files:**
- Modify: `agents/11-aeo-monitor.md`

- [ ] **Step 1: Read the full file**

Run: `Read agents/11-aeo-monitor.md` — full file (115 lines).

- [ ] **Step 2: Add two-layer context to the Purpose section**

Find the Purpose section. Add after it:

```
**Two-Layer Framework:**
This agent primarily monitors **Layer 2** (ChatGPT, Perplexity, Claude) visibility. For **Layer 1** (Google AI Overviews), traditional SEO quality is sufficient — monitor via GSC "AI Overviews" impression data instead. See `ai-seo-guide.md` Section 1 for Google's official position.
```

- [ ] **Step 3: Update Mode 3 (Citability Audit) to reference layers**

Find Mode 3 description. Add a note:

```
**Layer context:** The 5 citability rules below are Layer 2 optimizations (targeting ChatGPT/Perplexity/Claude). For Google AI Overviews, standard content quality is sufficient. When auditing, check Layer 1 compliance first (unique content, non-commodity, clear structure) before checking Layer 2 patterns.
```

- [ ] **Step 4: Add Google AI Overviews to the monitoring outputs**

Find the spot check output format. Add a row for tracking:

```
| Google AI Overviews | Check GSC for "AI Overviews" impression type | N/A (tracked via GSC, not spot check) |
```

- [ ] **Step 5: Commit**

```
git add agents/11-aeo-monitor.md
git commit -m "docs: add two-layer framework to AEO monitor agent

Clarifies Layer 1 (Google) vs Layer 2 (non-Google) monitoring.
Adds Google AI Overviews tracking via GSC.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 11: Update Agent Reference Files

**Files:**
- Modify: `agents/references/ai-citation-patterns.md`
- Modify: `agents/references/geo-skill-patterns.md`

- [ ] **Step 1: Read ai-citation-patterns.md to find Google AI Overviews section**

Run: `Read agents/references/ai-citation-patterns.md` — find the Google AI Overviews section.

- [ ] **Step 2: Add Google's official position to ai-citation-patterns.md**

Find the Google AI Overviews citation pattern section. Add a prominent note at the top:

```
**Google's Official Position (May 2026):** Traditional SEO best practices ARE AI Overviews optimization. Google explicitly warns against creating content specifically for AI, overemphasizing structured data, or treating AI optimization as separate from SEO. The patterns below are derived from third-party studies and may not reflect Google's actual ranking factors for AI Overviews. Use them as directional guidance, not gospel. Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
```

- [ ] **Step 3: Read geo-skill-patterns.md to find the right insertion point**

Run: `Read agents/references/geo-skill-patterns.md` — find where to add Google context.

- [ ] **Step 4: Add Google context to geo-skill-patterns.md**

Find the main guidance section. Add a note:

```
**Google Context (May 2026):** Google's official AI optimization guide states that traditional SEO fundamentals are sufficient for Google AI Overviews. The GEO optimizations below are primarily validated for non-Google AI platforms (ChatGPT, Perplexity, Claude). For Google AI Overviews, prioritize content quality over GEO-specific tactics. See `ai-seo-guide.md` Section 1.
```

- [ ] **Step 5: Commit**

```
git add agents/references/ai-citation-patterns.md agents/references/geo-skill-patterns.md
git commit -m "docs: add Google's official AI position to agent reference files

Clarifies that GEO/citation patterns are primarily Layer 2 (non-Google).
Cites Google's official AI optimization guide.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 12: Update Memory File

**Files:**
- Modify: `C:\Users\D E L L\.claude\projects\c--Users-D-E-L-L-Downloads-Claude-Coded-SellonTube\memory\MEMORY.md`
- Create: `C:\Users\D E L L\.claude\projects\c--Users-D-E-L-L-Downloads-Claude-Coded-SellonTube\memory\project_google_ai_optimization.md`

- [ ] **Step 1: Create project memory file**

Write `project_google_ai_optimization.md`:
```markdown
---
name: google-ai-optimization-integration
description: Two-layer AI SEO framework integrated across all docs (May 2026). Google Layer 1 (good SEO = AI SEO) + non-Google Layer 2 (platform-specific tactics).
metadata:
  type: project
---

Google published official AI optimization guide (May 2026). Key position: traditional SEO IS AI optimization for Google AI Overviews. No special AI tactics needed.

**Why:** Google explicitly calls out misconceptions (llms.txt, content chunking, rewriting for AI, overemphasizing structured data). Our existing AEO framework had some of these as recommendations.

**How to apply:** All SellonTube docs now use a two-layer approach:
- **Layer 1 (Google AI Overviews):** Standard SEO quality. No special AI tricks.
- **Layer 2 (ChatGPT, Perplexity, Claude):** Platform-specific citation mechanics still valid (answer blocks, freshness, entity consistency, definition blocks, llms.txt).

FAQ rich results killed May 7, 2026. FAQPage schema kept but demoted from #1 priority. Article schema now #1.

Files updated: ai-seo-guide.md, content-depth-framework.md, seo-rules.md, content-playbook.md, blog-production-standard.md, growth-strategy.md, agents/04, 05, 08, 11, agent references.

Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
```

- [ ] **Step 2: Add entry to MEMORY.md**

Add under an appropriate section:
```
- [Google AI optimization integration](project_google_ai_optimization.md) -- Two-layer framework (Google Layer 1 + non-Google Layer 2) integrated across all docs, May 2026
```

- [ ] **Step 3: No commit needed — memory files are not in repo**

---

## Execution Order

Tasks 1-6 (reference docs) should execute sequentially — Task 1 first since all others reference it.
Tasks 7-11 (agents) can execute in parallel after Task 1 completes.
Task 12 (memory) runs last.

**Recommended execution approach:** Subagent-driven. Task 1 in main thread (largest, most critical). Tasks 7-11 dispatched as parallel subagents after Task 1 commits. Tasks 2-6 can also be parallelized.

## Risk Notes

- **No code changes.** All edits are markdown documentation. Zero risk of breaking builds or functionality.
- **No deployment needed.** These are internal reference docs read by agents and humans.
- **Reversible.** Every change is a git commit on a feature branch.
- **Content block patterns preserved.** Layer 2 tactics (answer blocks, definition blocks, etc.) are NOT removed — only reframed with proper context. No content quality regression.
