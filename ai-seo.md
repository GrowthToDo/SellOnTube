# SellonTube AI SEO Guide
## Getting Cited by AI Search Engines, Not Just Ranked by Google

Traditional SEO gets you ranked. AI SEO gets you **cited**. A well-structured page can get cited by ChatGPT, Perplexity, or Google AI Overviews even if it ranks on page 2 or 3 in traditional search. As AI-powered search becomes the default for SellonTube's ICP (B2B founders, SaaS operators), being the source AI systems reference is as important as ranking on page 1.

This document governs all AI citation optimisation work. Read it alongside `seo.md` (traditional SEO rules) before any content or technical SEO decision.

---

## 1. The Three Pillars

**Structure** — Content must be extractable. AI systems pull passages, not pages. Clear answer blocks, self-contained paragraphs, and proper heading hierarchy win.

**Authority** — Content must be trustworthy. Named citations, expert quotes, specific statistics with sources, and author credentials signal trustworthiness to every AI platform.

**Presence** — Content must be indexed by the right bots. If an AI platform's crawler is blocked or hasn't indexed your content, you cannot be cited regardless of content quality.

---

## 2. Platform Priority for SellonTube's ICP

SellonTube's audience (B2B founders, SaaS operators) skews toward Google, ChatGPT, and Perplexity. Optimise in this order:

| Priority | Platform | Why |
|---|---|---|
| 1 | **Google AI Overviews** | Largest reach (45%+ of Google searches). Existing Google SEO foundations apply directly. |
| 2 | **ChatGPT** | Most-used standalone AI search for tech and business audiences. |
| 3 | **Perplexity** | Preferred by researchers and early adopters — SellonTube's ICP. Always cites sources with clickable links. |
| 4 | **Claude** | Used by developer and analyst audiences. Uses Brave Search backend (not Google/Bing). |
| 5 | **Microsoft Copilot** | Enterprise/Microsoft ecosystem audience. Bing-based index. Lower priority unless audience skews enterprise. |

---

## 3. Platform-Specific Ranking Factors

### Google AI Overviews
- Schema markup is the single biggest lever — Article, FAQPage, HowTo schemas give AI structured context (30-40% visibility boost)
- E-E-A-T signals weighted heavily — author credentials, cited sources, topical authority
- Target "how to" and "what is" query patterns — these trigger AI Overviews most often
- Only ~15% of AI Overview sources overlap with traditional top 10 — pages outside page 1 can still be cited with strong schema and extractable content
- Named, sourced citations in content correlate with 132% visibility boost

### ChatGPT
- Domain authority is the strongest baseline signal (accounts for ~40% of citation likelihood)
- **Content freshness is critical** — content updated within 30 days gets cited 3.2x more than older content. Update competitive posts monthly.
- Content-answer fit accounts for ~55% of citation likelihood — write the way ChatGPT formats its answers (conversational, direct, well-organised)
- Clean heading hierarchy (H1 > H2 > H3) with descriptive headings
- Include verifiable statistics with named sources

### Perplexity
- Always cites sources with clickable links — the most transparent AI search platform
- FAQPage schema (JSON-LD) gets cited noticeably more often
- Publicly accessible PDFs (whitepapers, guides) are prioritised — consider ungating key PDF resources
- Self-contained paragraphs — Perplexity extracts atomically complete passages
- Publishing velocity matters — how frequently you publish affects citation likelihood
- Allow PerplexityBot in `robots.txt`

### Claude
- Uses **Brave Search** backend — not Google or Bing. Verify SellonTube appears at search.brave.com for key queries.
- Extremely selective citation rate — favours the most factually accurate, well-sourced content on a topic
- Data-rich content with specific numbers and clear attribution performs significantly better than general content
- Allow ClaudeBot and anthropic-ai user agents in `robots.txt`
- Maximise factual density: specific numbers, named sources, dated statistics

### Microsoft Copilot
- Relies entirely on Bing's index — submit to Bing Webmaster Tools if not already done
- Use IndexNow protocol for faster indexing of new and updated content
- Page speed under 2 seconds is a clear threshold
- LinkedIn presence (articles, company page) provides ranking boost specific to Copilot
- Allow Bingbot in `robots.txt`

---

## 4. robots.txt — Allow All AI Bots

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

---

## 5. AEO Content Block Patterns

These are reusable content structures that maximise extractability by AI systems. Agent 04 must use the appropriate pattern for each content type. Agent 05 must verify the correct pattern is in place.

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

## 6. GEO Content Block Patterns

These patterns optimise content for citation by AI assistants (ChatGPT, Claude, Perplexity, Gemini).

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

## 7. Author Bio and E-E-A-T Requirements

Every blog post must include an author bio. Google AI Overviews and ChatGPT both weight author credentials as an E-E-A-T signal.

**Required fields in author bio:**
- Full name
- Role/title
- Specific area of expertise (e.g., "YouTube SEO for B2B businesses")
- Years of experience or number of clients worked with (specific, not vague)
- Link to LinkedIn or personal site

**Where it appears:** At the bottom of every blog post, before the Sources section.

---

## 8. Content Freshness Rule

ChatGPT cites content updated within the last 30 days 3.2x more than older content. This applies to all platforms to varying degrees.

**Rule:** Any blog post targeting a competitive keyword must be reviewed and updated at least once every 90 days. Posts in the top 3 priority score clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`) must be reviewed monthly.

**What counts as an update:**
- Adding a new section or example
- Updating a statistic to a more recent source
- Adding a new FAQ question
- Refreshing the "What to do this week" section

Simply changing the `publishDate` without adding content does not count.

---

## 9. Schema Priority for AI Citation

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

---

## 10. Monthly AI SEO Checklist

Run this once a month:

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
