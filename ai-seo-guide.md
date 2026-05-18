# SellonTube AI SEO Guide
## Ranking in Traditional Search AND Getting Cited by AI

This guide uses a **two-layer approach** to AI search optimization:

**Layer 1 — Google AI Overviews (primary).** Google's official position (May 2026): traditional SEO best practices ARE AI optimization. There is no separate "AI SEO" for Google. Good content, clear structure, and technical excellence get you into AI Overviews the same way they get you ranked in traditional search. This is our foundation.

**Layer 2 — ChatGPT, Perplexity, Claude, Copilot (secondary).** These platforms have their own citation mechanics that go beyond traditional SEO. Platform-specific tactics (answer blocks, content freshness, entity consistency, definition blocks) still provide measurable citation advantages on these platforms. These are our edge.

**The principle:** Build for Google first (Layer 1). Then add Layer 2 optimizations that also make content better for human readers. Never sacrifice Layer 1 quality for Layer 2 tricks.

Read this alongside `seo-rules.md` (traditional SEO rules) before any content or technical SEO decision.

---

## 1. Google's Official AI Optimization Guidance (Layer 1)

**Source:** https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Google's generative AI features on Search are rooted in core Search ranking and quality systems. Their guidance:

### What Works for Google AI Overviews
1. **Create valuable, non-commodity content.** Develop unique perspectives. Prioritize helpful, reliable, people-first content. Organize clearly with headings and sections. Include high-quality images and videos.
2. **Build clear technical structure.** Pages must meet Search technical requirements and be indexable. Use semantic HTML. Provide good page experience across devices. Reduce duplicate content.
3. **Follow existing SEO fundamentals.** Crawling best practices, JavaScript SEO, structured data where it matches visible content.

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

---

## 2. The Three Pillars

**Structure** — Content must be extractable. AI systems pull passages, not pages. Clear answer blocks, self-contained paragraphs, and proper heading hierarchy win.

**Authority** — Content must be trustworthy. Named citations, expert quotes, specific statistics with sources, and author credentials signal trustworthiness to every AI platform.

**Presence** — Content must be indexed by the right bots. If an AI platform's crawler is blocked or hasn't indexed your content, you cannot be cited regardless of content quality.

---

## 3. Platform Priority for SellonTube's ICP

SellonTube's audience (B2B founders, SaaS operators) skews toward Google, ChatGPT, and Perplexity. Optimise in this order:

| Priority | Platform | Why |
|---|---|---|
| 1 | **Google AI Overviews** | Largest reach (45%+ of Google searches). Existing Google SEO foundations apply directly. |
| 2 | **ChatGPT** | Most-used standalone AI search for tech and business audiences. |
| 3 | **Perplexity** | Preferred by researchers and early adopters — SellonTube's ICP. Always cites sources with clickable links. |
| 4 | **Claude** | Used by developer and analyst audiences. Uses Brave Search backend (not Google/Bing). |
| 5 | **Microsoft Copilot** | Enterprise/Microsoft ecosystem audience. Bing-based index. Lower priority unless audience skews enterprise. |

---

## 4. Platform-Specific Ranking Factors

### Google AI Overviews (Layer 1 — follow Section 1 above)
- **Google's official position: traditional SEO best practices ARE AI Overviews optimization.** No special tactics needed.
- Schema helps Google understand content but is NOT "the single biggest lever." Use it where it matches visible content.
- E-E-A-T signals matter — author credentials, cited sources, topical authority. This is standard SEO.
- "How to" and "what is" queries trigger AI Overviews most often.
- ~15% of AI Overview sources overlap with traditional top 10 — pages outside page 1 can still be cited with strong content quality.
- Named, sourced citations in content correlate with higher visibility (third-party studies suggest 132% boost, though Google does not confirm this metric).
- **Do not create content specifically for AI Overviews.** Create the best content for the query. Google's AI features will find it.

### ChatGPT (Layer 2)
- Domain authority is the strongest baseline signal (accounts for ~40% of citation likelihood)
- **Content freshness is critical** — content updated within 30 days gets cited 3.2x more than older content. Update competitive posts monthly.
- Content-answer fit accounts for ~55% of citation likelihood — write the way ChatGPT formats its answers (conversational, direct, well-organised)
- Clean heading hierarchy (H1 > H2 > H3) with descriptive headings
- Include verifiable statistics with named sources

### Perplexity (Layer 2)
- Always cites sources with clickable links — the most transparent AI search platform
- FAQPage schema (JSON-LD) gets cited noticeably more often
- Publicly accessible PDFs (whitepapers, guides) are prioritised — consider ungating key PDF resources
- Self-contained paragraphs — Perplexity extracts atomically complete passages
- Publishing velocity matters — how frequently you publish affects citation likelihood
- Allow PerplexityBot in `robots.txt`

### Claude (Layer 2)
- Uses **Brave Search** backend — not Google or Bing. Verify SellonTube appears at search.brave.com for key queries.
- Extremely selective citation rate — favours the most factually accurate, well-sourced content on a topic
- Data-rich content with specific numbers and clear attribution performs significantly better than general content
- Allow ClaudeBot and anthropic-ai user agents in `robots.txt`
- Maximise factual density: specific numbers, named sources, dated statistics

### Microsoft Copilot (Layer 2)
- Relies entirely on Bing's index — submit to Bing Webmaster Tools if not already done
- Use IndexNow protocol for faster indexing of new and updated content
- Page speed under 2 seconds is a clear threshold
- LinkedIn presence (articles, company page) provides ranking boost specific to Copilot
- Allow Bingbot in `robots.txt`

---

## 5. robots.txt — Allow All AI Bots

**Critical: if an AI bot is blocked, that platform cannot cite your content.** Add these to `robots.txt` (or verify they are not blocked in `netlify.toml`):

```
User-agent: GPTBot           # OpenAI — powers ChatGPT search
User-agent: ChatGPT-User     # ChatGPT browsing mode
User-agent: PerplexityBot    # Perplexity AI search
User-agent: ClaudeBot        # Anthropic Claude
User-agent: anthropic-ai     # Anthropic Claude (alternate)
User-agent: Google-Extended  # Google Gemini and AI Overviews
User-agent: Bingbot          # Microsoft Copilot (via Bing)
Allow: /
```

**Note on training vs. search:** GPTBot handles both OpenAI training and search citation. Blocking it stops citation, not just training. You can safely block **CCBot** (Common Crawl) without affecting any AI search citations — it is only used for training dataset collection.

**Note on llms.txt:** Google explicitly states that creating llms.txt files is not a ranking signal for Google AI features. We maintain `public/llms.txt` and `public/llms-full.txt` as a low-cost Layer 2 optimization — Perplexity and other non-Google AI systems may use them for site understanding. Keep them updated when new tools/pages ship, but do not treat them as a priority.

---

## 6. AEO Content Block Patterns (Layer 2)

These content block patterns optimize for citation by non-Google AI platforms (ChatGPT, Perplexity, Claude). Google does not require these specific structures — good content is enough for AI Overviews (see Section 1).

That said, these patterns also produce better content for human readers: clearer definitions, more structured how-tos, better comparison tables. Use them because they make content better, not solely for AI extraction.

Agent 04 must use the appropriate pattern for each content type. Agent 05 must verify the correct pattern is in place.

### Definition Block
Use for "What is [X]?" queries.

```
## What is [Term]?

[Term] is [concise 1-sentence definition]. [Expanded 1-2 sentence explanation with key characteristics]. [Brief context on why it matters or how it's used].
```

### Step-by-Step Block
Use for "How to [X]" queries.

```
## How to [Action/Goal]

[1-sentence overview of the process]

1. **[Step Name]**: [Clear action in 1-2 sentences]
2. **[Step Name]**: [Clear action in 1-2 sentences]
3. **[Step Name]**: [Clear action in 1-2 sentences]

[Optional: expected outcome or timeframe]
```

### Comparison Table Block
Use for "[X] vs [Y]" queries.

```
## [Option A] vs [Option B]

| Feature | [Option A] | [Option B] |
|---|---|---|
| [Criteria] | [Value] | [Value] |
| Best for | [Use case] | [Use case] |

**Bottom line:** [1-2 sentence recommendation]
```

### Pros and Cons Block
Use for "Is [X] worth it?" or "Should I [X]?" queries.

```
## Advantages and Disadvantages of [Topic]

### Pros
- **[Benefit]**: [Specific explanation]

### Cons
- **[Drawback]**: [Specific explanation]

**Verdict**: [1-2 sentence balanced conclusion]
```

### FAQ Block
Use for topic pages with multiple common questions. Required for FAQPage schema.

```
## Frequently Asked Questions

### [Question phrased exactly as users search]?
[Direct answer in first sentence]. [Supporting context in 2-3 sentences].
```

**FAQ rules:**
- Use natural question phrasing ("How do I..." not "How does one...")
- Match "People Also Ask" queries from Google
- Keep answers 50-100 words
- Always pair with FAQPage schema in JSON-LD

---

## 7. GEO Content Block Patterns (Layer 2)

These patterns optimize for citation by non-Google AI assistants (ChatGPT, Claude, Perplexity). For Google AI Overviews, standard SEO quality is sufficient (see Section 1). These patterns are Layer 2 optimizations that also improve content quality for human readers.

### Statistic Citation Block
Statistics increase AI citation rates by 15-30%. Always include named sources.

```
[Claim statement]. According to [Source/Organisation], [specific statistic with number and timeframe]. [Context for why this matters to the reader's business].
```

**Example:**
> YouTube videos targeting "how-to" queries outperform blog posts for AI citation. According to Backlinko's analysis of 1.3 million YouTube videos, videos with keyword-rich titles earn 2x more views from search — and higher view counts correlate directly with AI Overview inclusion.

### Expert Quote Block
Named expert attribution adds credibility and increases citation likelihood across all AI platforms.

```
"[Direct quote]," says [Expert Name], [Title] at [Organisation]. [1 sentence of context].
```

**Rules:**
- Never fabricate quotes. Only use real, verifiable quotes with a link to the original source.
- The quote must be directly relevant to the section — not decorative.
- Prefer quotes from recognised names in YouTube marketing, B2B content, or SaaS growth.

### Self-Contained Answer Block
Standalone, quotable paragraphs that AI can extract without surrounding context.

```
**[Topic/Question]**: [Complete, self-contained answer that makes sense without additional context. Include specific details, numbers, or examples. 2-3 sentences.]
```

Use 1-2 per post maximum. Place at the end of a section as a summary the AI can lift cleanly.

### Evidence Sandwich Block
Structure claims with evidence for maximum credibility.

```
[Opening claim statement].

Evidence supporting this includes:
- [Data point with source]
- [Data point with source]
- [Data point with source]

[Concluding statement connecting evidence to an actionable insight for the reader].
```

---

## 8. Author Bio and E-E-A-T Requirements

The blog template auto-renders an author bio component from the frontmatter `author` field. **Do not add a manual "About the author" markdown section in the post body** — this creates a duplicate.

The auto-rendered component satisfies E-E-A-T requirements (name, role, expertise, LinkedIn link). Keep author profile data up to date in the site's author configuration, not in individual post files.

---

## 9. Content Freshness Rule

ChatGPT cites content updated within the last 30 days 3.2x more than older content. This applies to all platforms to varying degrees.

**Rule:** Any blog post targeting a competitive keyword must be reviewed and updated at least once every 90 days. Posts in the top 3 priority score clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`) must be reviewed monthly.

**What counts as an update:**
- Adding a new section or example
- Updating a statistic to a more recent source
- Adding a new FAQ question
- Refreshing the "What to do this week" section

Simply changing the `publishDate` without adding content does not count.

---

## 10. Schema Priority for AI Citation

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

---

## 11. Monthly AI SEO Checklist

Run this once a month:

- [ ] Review content against Google's AI optimization guidance (Section 1) — are we creating unique, non-commodity content?
- [ ] Verify all AI bots are allowed in `robots.txt` / `netlify.toml`
- [ ] Check SellonTube appears in Brave Search for 3-5 core keywords (search.brave.com)
- [ ] Update at least 2 high-priority blog posts (add section, refresh stat, new FAQ)
- [ ] Submit updated URLs to GSC + IndexNow
- [ ] Check GSC for any new "AI Overviews" impressions — identify which pages are being cited
- [ ] Review schema implementation status in Agent 07 — flag next schema type to implement

---

## Sources

- Princeton GEO study (KDD 2024) — AI citation ranking factors
- SE Ranking domain authority study — ChatGPT citation patterns (129,000 domains)
- ZipTie content-answer fit analysis — 400,000 pages analysed for ChatGPT citation likelihood
- Google Search Quality Rater Guidelines — E-E-A-T definition and trust signals
- Backlinko YouTube SEO study — video ranking and search visibility data
