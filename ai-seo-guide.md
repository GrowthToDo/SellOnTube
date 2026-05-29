# SellonTube AI SEO Guide

## Single Source of Truth for AI Search Optimization

This is the only document agents and humans need to read before creating or updating any content for AI search visibility. It covers Google AI Overviews, ChatGPT, Perplexity, Claude, Microsoft Copilot, and all generative AI search optimization (GEO/AEO).

**Two-layer approach:**

**Layer 1 — Google AI Overviews (primary).** Google's official position (May 2026): traditional SEO best practices ARE AI optimization. There is no separate "AI SEO" for Google. Good content, clear structure, and technical excellence get you into AI Overviews the same way they get you ranked in traditional search. This is our foundation.

**Layer 2 — ChatGPT, Perplexity, Claude, Copilot (secondary).** These platforms have their own citation mechanics that go beyond traditional SEO. Platform-specific tactics (answer blocks, content freshness, entity consistency, definition blocks) still provide measurable citation advantages on these platforms. These are our edge.

**The principle:** Build for Google first (Layer 1). Then add Layer 2 optimizations that also make content better for human readers. Never sacrifice Layer 1 quality for Layer 2 tricks.

Read this alongside `seo-rules.md` (traditional SEO rules) before any content or technical SEO decision.

**Sources:**
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Princeton GEO study (KDD 2024) — AI citation ranking factors
- SE Ranking domain authority study — ChatGPT citation patterns (129,000 domains)
- ZipTie content-answer fit analysis — 400,000 pages analysed for ChatGPT citation likelihood
- Google Search Quality Rater Guidelines — E-E-A-T definition and trust signals
- Ahrefs December 2025 study of 75,000 brands — brand mentions vs backlinks

---

## 1. How Google AI Features Work (Layer 1)

**Source:** https://developers.google.com/search/docs/appearance/ai-features

### AI Overviews

AI Overviews help users get to the gist of a complicated topic or question more quickly. They display links to relevant sources. They appear only when Google determines they add value beyond traditional search results.

### AI Mode

AI Mode supports exploratory queries requiring reasoning or complex comparisons that might otherwise need multiple searches.

### How Content Gets Selected: RAG + Query Fan-Out

Both features use two key techniques:

**Retrieval-augmented generation (RAG):** Google's AI uses its core Search ranking systems to retrieve relevant web pages, then generates responses with clickable source links. This means the same signals that rank you in traditional search (content quality, authority, technical excellence) determine whether you appear in AI features.

**Query fan-out:** The AI generates multiple related sub-queries simultaneously across subtopics, surfacing a wider and more diverse set of helpful links than standard web search. This means more pages get exposure through AI features, not fewer. Pages that wouldn't appear in a traditional top-10 can still be cited if they answer a specific sub-query well.

### Requirements for Appearing in AI Features

There are no additional requirements to appear in AI Overviews or AI Mode beyond standard Google Search requirements:
- Pages must be indexed and eligible for standard Google Search snippets
- Must meet Search's technical baseline requirements
- Must follow Search policies
- Must create helpful, reliable, people-first content

### What Google Explicitly Says Works

1. **Create valuable, non-commodity content.** Develop unique perspectives. Prioritize helpful, reliable, people-first content. Organize clearly with headings and sections. Include high-quality images and videos.
2. **Build clear technical structure.** Pages must meet Search technical requirements and be indexable. Use semantic HTML. Provide good page experience across devices. Reduce duplicate content.
3. **Follow existing SEO fundamentals.** Allow crawling in robots.txt. Use internal linking for discoverability. Structured data where it matches visible content. JavaScript SEO best practices.

### What Google Explicitly Says Does NOT Help (Misconceptions)

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

### Content Controls for AI Features

Site owners can use existing meta tags to manage content visibility in AI features:

| Control | Effect |
|---|---|
| `nosnippet` | Exclude page from AI Overviews and AI Mode entirely |
| `data-nosnippet` | Exclude specific content blocks from being used in AI features |
| `max-snippet:[number]` | Limit the length of text that can be used in AI features |
| `noindex` | Exclude page from Google Search entirely (including AI features) |

These are the same controls used for regular search snippets. No AI-specific meta tags exist or are needed.

### Measurement

AI Overview and AI Mode clicks are counted in Search Console Performance report under the "Web" search type. No separate AI report exists. Track "AI Overviews" impression type in GSC monthly.

---

## 2. Google's Self-Assessment Framework (Layer 1)

**Source:** https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Use these questions before publishing any content. They come directly from Google.

### Content Quality Questions

Does this content:
- Offer original information, reporting, research, or analysis?
- Provide substantial, comprehensive topic coverage?
- Deliver insights beyond obvious information?
- Add substantial value rather than simply rewriting sources?
- Use descriptive, non-exaggerated headings?
- Demonstrate quality production without spelling/stylistic issues?
- Avoid mass-production across multiple sites?

### E-E-A-T Evaluation (Experience, Expertise, Authoritativeness, Trustworthiness)

**Trust is the most important factor.** The others contribute to trust, but content doesn't necessarily have to demonstrate all of them.

- Clear sourcing and evidence of author expertise?
- Recognized as an authoritative source on the topic?
- Expert or enthusiast-level knowledge demonstrated?
- Factually accurate?
- Accessible author background information?

### The "Who, How, Why" Framework

**Who created the content?**
- Include clear bylines and author information
- Provide author background and credibility

**How was the content created?**
- Explain methodology, testing processes, evidence
- Disclose automation/AI-generation use and rationale
- Describe why automation served a useful purpose

**Why was the content created?**
- Should primarily serve existing audience needs
- Avoid creating primarily for search ranking manipulation
- Using automation to manipulate rankings violates spam policies

### People-First Content Indicators (Green Flags)

- Existing audience who would find the content useful
- First-hand expertise and demonstrated knowledge depth
- Clear primary purpose or site focus
- Content that helps readers achieve their goals
- Satisfying reader experiences

### Search-Engine-First Content Indicators (Red Flags)

Google explicitly warns against content that exhibits these patterns:

- Content primarily designed to attract search engine traffic
- Mass content production across many topics without expertise
- Extensive automation for topic coverage
- Minimal original value beyond summarizing others
- Trending-topic coverage without genuine expertise
- Content requiring additional research after reading (incomplete)
- Arbitrary word count targets
- Entering niche areas without real expertise
- False claims about unconfirmed information
- Artificially updating publication dates without adding content
- Strategic content removal/addition for ranking manipulation

---

## 3. Scaled Content Abuse Guardrails

**Directly relevant to SellonTube's pSEO pages.**

Google warns against "scaled content abuse" where creators produce "separate content for every possible variation" to manipulate rankings. This applies to programmatic SEO (pSEO) pages.

### How This Applies to Us

SellonTube has 29 "YouTube For" niche pages and 20 "YouTube Vs" comparison pages. These are pSEO pages.

**What keeps our pSEO pages safe:**
- Each page has genuine, niche-specific content (not just template-swapped words)
- Unique data points, examples, and case studies per niche
- Real value for someone researching that specific niche
- Drip publishing schedule (not flooding Google with 50 pages at once)

**What would trigger a penalty:**
- Pages that differ only by swapping a keyword (e.g., "YouTube for coaches" = "YouTube for consultants" with s/coaches/consultants/)
- Thin pages with no unique insight per niche
- Bulk publishing without quality differentiation
- Content that exists solely for search engine visibility, not user value

**Rule:** Before creating any new pSEO page, ask: "Would this page exist if search engines didn't?" If the answer is no, the page shouldn't exist.

---

## 4. The Three Pillars

**Structure** — Content must be extractable. AI systems pull passages, not pages. Clear answer blocks, self-contained paragraphs, and proper heading hierarchy win.

**Authority** — Content must be trustworthy. Named citations, expert quotes, specific statistics with sources, and author credentials signal trustworthiness to every AI platform.

**Presence** — Content must be indexed by the right bots. If an AI platform's crawler is blocked or hasn't indexed your content, you cannot be cited regardless of content quality.

---

## 5. Platform Priority for SellonTube's ICP

SellonTube's audience (B2B founders, SaaS operators) skews toward Google, ChatGPT, and Perplexity. Optimize in this order:

| Priority | Platform | Why |
|---|---|---|
| 1 | **Google AI Overviews** | Largest reach (45%+ of Google searches). Existing Google SEO foundations apply directly. |
| 2 | **ChatGPT** | Most-used standalone AI search for tech and business audiences. |
| 3 | **Perplexity** | Preferred by researchers and early adopters — SellonTube's ICP. Always cites sources with clickable links. |
| 4 | **Claude** | Used by developer and analyst audiences. Uses Brave Search backend (not Google/Bing). |
| 5 | **Microsoft Copilot** | Enterprise/Microsoft ecosystem audience. Bing-based index. Lower priority unless audience skews enterprise. |

---

## 6. Platform-Specific Ranking Factors and Citation Patterns

### Google AI Overviews (Layer 1 — follow Sections 1-2 above)

- **Google's official position: traditional SEO best practices ARE AI Overviews optimization.** No special tactics needed.
- Schema helps Google understand content but is NOT "the single biggest lever." Use it where it matches visible content.
- E-E-A-T signals matter — author credentials, cited sources, topical authority. This is standard SEO.
- "How to" and "what is" queries trigger AI Overviews most often.
- ~15% of AI Overview sources overlap with traditional top 10 — pages outside page 1 can still be cited with strong content quality.
- Named, sourced citations in content correlate with higher visibility (third-party studies suggest 132% boost, though Google does not confirm this metric).
- **Do not create content specifically for AI Overviews.** Create the best content for the query. Google's AI features will find it.

**Citation behavior (from third-party studies):**
- Cites 3-8 sources per overview
- Prefers structured, factual content with clear headings matching query intent
- Short paragraphs (2-3 sentences), bullet points, numbered lists, tables
- Statistics with recent dates, step-by-step instructions, definition blocks

**Authority signals:**
- Domain authority, E-E-A-T signals, recent publication/update dates
- Author credentials visible, citations to other authoritative sources

### ChatGPT (Layer 2)

- Domain authority is the strongest baseline signal (accounts for ~40% of citation likelihood)
- **Content freshness is critical** — content updated within 30 days gets cited 3.2x more than older content. Update competitive posts monthly.
- Content-answer fit accounts for ~55% of citation likelihood — write the way ChatGPT formats its answers (conversational, direct, well-organized)
- Clean heading hierarchy (H1 > H2 > H3) with descriptive headings
- Include verifiable statistics with named sources

**Citation behavior:**
- Inline citations with numbers [1], [2] and "Sources" list at end
- Pulls exact quotes when information is distinctive, paraphrases general information
- Favors .edu, .gov, .org domains and recognized brands/publishers
- Values comprehensive content over thin pages
- 1-6 sources per response depending on complexity

### Perplexity (Layer 2)

- Always cites sources with clickable links — the most transparent AI search platform
- FAQPage schema (JSON-LD) gets cited noticeably more often
- Publicly accessible PDFs (whitepapers, guides) are prioritized — consider ungating key PDF resources
- Self-contained paragraphs — Perplexity extracts atomically complete passages
- Publishing velocity matters — how frequently you publish affects citation likelihood
- Allow PerplexityBot in `robots.txt`

**Citation behavior:**
- Superscript numbers inline, numbered source list with snippets
- Strong freshness bias — very recent content prioritized
- Extremely well-structured content preferred
- Factual density (stats, data, specifics) valued highly
- 5-10 sources per response (more than other platforms)
- Shows "Follow-up Questions" that can reveal additional citation opportunities

### Claude (Layer 2)

- Uses **Brave Search** backend — not Google or Bing. Verify SellonTube appears at search.brave.com for key queries.
- Extremely selective citation rate — favors the most factually accurate, well-sourced content on a topic
- Data-rich content with specific numbers and clear attribution performs significantly better than general content
- Allow ClaudeBot and anthropic-ai user agents in `robots.txt`
- Maximize factual density: specific numbers, named sources, dated statistics

**Citation behavior:**
- Clear attribution phrases ("According to [source]...", "Research from [source] shows...")
- Prioritizes factual accuracy and precision, logical structure, comprehensive explanations
- Favors well-established methodologies and consensus information

### Microsoft Copilot (Layer 2)

- Relies entirely on Bing's index — submit to Bing Webmaster Tools if not already done
- Use IndexNow protocol for faster indexing of new and updated content
- Page speed under 2 seconds is a clear threshold
- LinkedIn presence (articles, company page) provides ranking boost specific to Copilot
- Allow Bingbot in `robots.txt`

### AI System Comparison Summary

| Factor | Google AI Overviews | ChatGPT | Perplexity | Claude |
|--------|---------------------|---------|------------|--------|
| **Freshness bias** | High | Medium | Very high | N/A (training data) |
| **Authority weight** | Very high | High | High | High |
| **Structure importance** | High | Medium | Very high | Medium |
| **Citation count** | 3-8 | 1-6 | 5-10 | N/A |
| **Quotable focus** | High | Medium | Very high | High |
| **Domain trust** | Very high | High | Medium | High |
| **Factual density** | High | High | Very high | Very high |

### Critical Insight: Brand Mentions > Backlinks

**Brand mentions correlate 3x more strongly with AI visibility than backlinks.**
(Ahrefs December 2025 study of 75,000 brands)

| Signal | Correlation with AI Citations |
|--------|------------------------------|
| YouTube mentions | ~0.737 (strongest) |
| Reddit mentions | High |
| Wikipedia presence | High |
| LinkedIn presence | Moderate |
| Domain Rating (backlinks) | ~0.266 (weak) |

**Only 11% of domains** are cited by both ChatGPT and Google AI Overviews for the same query, so platform-specific optimization matters.

---

## 7. GEO Scoring Framework

Use this framework when scoring content for AI search readiness (Agent 11 Mode 3 citability audits).

### Scoring Dimensions

| Dimension | Weight | What to Check |
|---|---|---|
| **Citability** | 25% | Self-contained answer blocks (134-167 words), quotable facts, attributed claims, definitions following "X is..." patterns, unique data points |
| **Structural readability** | 20% | Clean H1>H2>H3 hierarchy, question-based subheadings, short paragraphs (2-4 sentences), formatted lists, tables for comparisons |
| **Multi-modal content** | 15% | Text + images, embedded video, infographics/charts, interactive elements (calculators, tools), structured data supporting media |
| **Authority signals** | 20% | Author byline + credentials, publication/update dates, citations to primary sources, expert quotes with attribution, entity presence on Reddit/YouTube/LinkedIn |
| **Technical accessibility** | 20% | Server-side rendered (Astro = yes), AI crawlers allowed in robots.txt, llms.txt present, good page experience |

**Key stats:**
- 92% of AI Overview citations come from top-10 ranking pages, but 47% come from pages ranking below position 5 (different selection logic than traditional SERP)
- Content with multi-modal elements sees 156% higher selection rates
- Optimal passage length for AI citation: 134-167 words

### Citation Likelihood Checklist

**High likelihood:**
- Content from recognized authority domain
- Published or updated within 12 months
- Clear, standalone statements
- Proper source attribution
- Specific statistics with dates
- Structured with headings/lists/tables
- Comprehensive topic coverage
- Author credentials visible

**Low likelihood:**
- Unknown/low-authority domain
- Published 3+ years ago without updates
- Vague or ambiguous statements
- No sources cited
- Poor structure (walls of text)
- Thin or superficial coverage
- Promotional or biased tone
- No expertise signals

---

## 8. robots.txt — Allow All AI Bots

**Critical: if an AI bot is blocked, that platform cannot cite your content.** These must be allowed in `robots.txt` (or verified not blocked in `netlify.toml`):

```
User-agent: GPTBot           # OpenAI — powers ChatGPT search
User-agent: OAI-SearchBot    # OpenAI search features
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

## 9. Content Block Patterns (Layer 2)

These content block patterns optimize for citation by non-Google AI platforms (ChatGPT, Perplexity, Claude). Google does not require these specific structures — good content is enough for AI Overviews (see Section 1).

That said, these patterns also produce better content for human readers: clearer definitions, more structured how-tos, better comparison tables. Use them because they make content better, not solely for AI extraction.

Agent 04 must use the appropriate pattern for each content type. Agent 05 must verify the correct pattern is in place.

### Definition Block

Use for "What is [X]?" queries.

```
## What is [Term]?

[Term] is [concise 1-sentence definition]. [Expanded 1-2 sentence explanation with key characteristics]. [Brief context on why it matters or how it's used].
```

**Why it works:** Standalone, complete, unambiguous, proper scope. AI systems love clear, quotable definitions.

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

### Statistic Citation Block

Statistics increase AI citation rates by 15-30%. Always include named sources.

```
[Claim statement]. According to [Source/Organization], [specific statistic with number and timeframe]. [Context for why this matters to the reader's business].
```

**Example:**
> YouTube videos targeting "how-to" queries outperform blog posts for AI citation. According to Backlinko's analysis of 1.3 million YouTube videos, videos with keyword-rich titles earn 2x more views from search — and higher view counts correlate directly with AI Overview inclusion.

### Expert Quote Block

Named expert attribution adds credibility and increases citation likelihood across all AI platforms.

```
"[Direct quote]," says [Expert Name], [Title] at [Organization]. [1 sentence of context].
```

**Rules:**
- Never fabricate quotes. Only use real, verifiable quotes with a link to the original source.
- The quote must be directly relevant to the section — not decorative.
- Prefer quotes from recognized names in YouTube marketing, B2B content, or SaaS growth.

### Self-Contained Answer Block

Standalone, quotable paragraphs that AI can extract without surrounding context.

```
**[Topic/Question]**: [Complete, self-contained answer that makes sense without additional context. Include specific details, numbers, or examples. 2-3 sentences.]
```

Use 1-2 per post maximum. Place at the end of a section as a summary the AI can lift cleanly. Optimal length: 134-167 words.

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

### Before/After Examples

Concrete examples showing transformation.

```
**Before**: [Weak example]
**After**: [Strong example]
**Why it's better**: [Explanation]
```

### Key Insight Callouts

Highlighted important points for AI extraction.

```
> **Key insight**: [Memorable, quotable statement with attribution]
```

---

## 10. Content Optimization by Query Type

### Informational Queries ("What is...", "How does...", "Why...")

**Priorities:** Clear definitions, comprehensive explanations, expert perspectives, supporting statistics, real-world examples.

**Structure:** Definition in first paragraph > "Why it matters" section > How it works > Common use cases > Expert quotes or citations.

### Comparison Queries ("[A] vs [B]", "Best [category]")

**Priorities:** Comparison tables, clear pros/cons lists, use case recommendations, specific differentiators, verdict.

**Structure:** Quick comparison table upfront > Individual descriptions > Feature-by-feature comparison > "Choose X if..." recommendations > Summary verdict.

### How-To Queries ("How to...", "Steps to...")

**Priorities:** Numbered steps, prerequisites, time estimates, success indicators, troubleshooting tips.

**Structure:** Prerequisites listed first > Clear numbered steps > Sub-steps where needed > Common problems and solutions.

### Statistical Queries ("How much...", "How many...", "Statistics about...")

**Priorities:** Specific numbers with sources, recent data (within 1-2 years), multiple data points, context, trends.

**Structure:** Lead with key statistic > Source attribution immediately after > Context and interpretation > Related statistics > Takeaways.

---

## 11. Author Bio and E-E-A-T Requirements

The blog template auto-renders an author bio component from the frontmatter `author` field. **Do not add a manual "About the author" markdown section in the post body** — this creates a duplicate.

The auto-rendered component satisfies E-E-A-T requirements (name, role, expertise, LinkedIn link). Keep author profile data up to date in the site's author configuration, not in individual post files.

---

## 12. Content Freshness Rule

ChatGPT cites content updated within the last 30 days 3.2x more than older content. This applies to all platforms to varying degrees.

**Rule:** Any blog post targeting a competitive keyword must be reviewed and updated at least once every 90 days. Posts in the top 3 priority score clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`) must be reviewed monthly.

**What counts as an update:**
- Adding a new section or example
- Updating a statistic to a more recent source
- Adding a new FAQ question
- Refreshing the "What to do this week" section

Simply changing the `publishDate` without adding content does not count. Google explicitly lists "artificially updating publication dates" as a red flag.

---

## 13. Schema Priority for AI Citation

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

## 14. Agentic Experiences (Emerging)

**Source:** Google's AI optimization guide flags this as an emerging area.

Agentic experiences are autonomous AI systems that access websites to complete tasks on behalf of users — booking reservations, comparing product specifications, completing purchases.

**What this means for SellonTube:**
- Our interactive tools (ROI calculator, SEO tool, transcript generator) are exactly the type of pages agents will interact with
- Clean, semantic HTML and clear form labels help agents understand and use tools
- Structured data (WebApplication schema on tool pages) helps agents discover tool capabilities

**Action items:**
- Review Google's "agent-friendly website best practices" when published
- Monitor Universal Commerce Protocol (UCP) development
- Ensure tool pages have clear, machine-readable inputs and outputs

This is a watch-and-prepare area, not an immediate optimization priority.

---

## 15. Monthly AI SEO Checklist

Run this once a month. Executable SOP version: `docs/sops/monthly-ai-seo-checklist.md`.

- [ ] Review content against Google's AI optimization guidance (Section 1) — are we creating unique, non-commodity content?
- [ ] Run Google's self-assessment questions (Section 2) against 2-3 recent posts
- [ ] Verify all AI bots are allowed in `robots.txt` / `netlify.toml`
- [ ] Check SellonTube appears in Brave Search for 3-5 core keywords (search.brave.com)
- [ ] Update at least 2 high-priority blog posts (add section, refresh stat, new FAQ)
- [ ] Submit updated URLs to GSC + IndexNow
- [ ] Check GSC for any new "AI Overviews" impressions — identify which pages are being cited
- [ ] Review schema implementation status in Agent 07 — flag next schema type to implement
- [ ] Check pSEO pages against scaled content abuse guardrails (Section 3) — does each page have genuine unique value?
