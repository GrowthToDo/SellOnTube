# SellOnTube Blog Production Standard

This document defines the production-level formatting, visual, and structural requirements for every blog post. It complements the Style Guide (writing rules) and Content Playbook (strategy rules). All three documents apply simultaneously.

**Purpose:** Every blog post must meet this standard from the first draft. Not through revision cycles. Not through user requests. The goal is to produce high-quality, practical, well-structured, and visually rich content by default.

**How to use:** Read this document before writing any blog post. Run the checklist at the bottom before presenting a draft for review.

---

## 1. Structural Requirements

### H2/H3 Hierarchy

| Post Length | Minimum H2s | H3s |
|---|---|---|
| Under 1,500 words | 4 | Use where natural |
| 1,500-3,000 words | 6 | 2-4 per relevant H2 |
| Over 3,000 words | 8+ | As many as needed for scannability |

Every H2 must be substantive. If a section has fewer than 100 words under its heading, either expand it or merge it into another section.

### Table of Contents

**Standard posts:** List all H2s as anchor links after the Key Takeaways block. Flat structure.

**Tool/list/comparison posts:** Nest individual items (H3s) under their parent H2 as indented anchor links. The reader must be able to jump directly to any tool from the ToC.

Example for a list post:
```markdown
## Contents

- [Why This Matters](#why-this-matters)
- [10 Tools Compared](#10-tools-compared)
  - [1. Tool Name](#1-tool-name)
  - [2. Tool Name](#2-tool-name)
  - [3. Tool Name](#3-tool-name)
- [How to Choose](#how-to-choose)
```

### Section Separation

**Do not use `---` between H2 sections.** One `---` is allowed after the Table of Contents, before the first H2. H2 headings provide sufficient visual separation. This overrides any earlier guidance in the Style Guide.

### Closing Section

The "What to Do This Week" section must be a styled green callout box with 5-7 numbered action items. Never plain text. Use this exact pattern:

```html
<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #166534; margin: 0 0 0.75rem 0;">What to Do This Week</p>
<ol style="margin: 0; padding-left: 1.25rem;">
<li style="margin-bottom: 0.5rem; color: #14532d; font-size: 1rem;">Action item here.</li>
</ol>
</div>
```

---

## 2. Styled Callout Boxes

Use styled HTML callouts for key information. Never present important summaries, warnings, or action steps as plain text. Four standard callout types:

### Key Takeaways (blue left border)
Place immediately after the intro. Use for 5-6 standalone insights.

```html
<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin: 0 0 0.75rem 0;">Key Takeaways</p>
<ul style="margin: 0; padding-left: 1.25rem;">
<li style="margin-bottom: 0.5rem; color: #334155; font-size: 1rem;">Insight here.</li>
</ul>
</div>
```

### Warning/Caution (yellow left border)
Use for common mistakes, caveats, or "watch out for this" moments.

```html
<div style="background: #fefce8; border: 1px solid #fde68a; border-left: 4px solid #eab308; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 1rem; font-weight: 600; color: #854d0e; margin: 0 0 0.5rem 0;">Warning title</p>
<p style="color: #713f12; font-size: 1rem; margin: 0;">Warning content.</p>
</div>
```

### Quick Decision/Tip (green background)
Use for decision rules, quick summaries, or "try this now" moments.

```html
<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 1rem; font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">Quick decision rule</p>
<p style="color: #14532d; font-size: 1rem; margin: 0;">Rule content here.</p>
</div>
```

### Decision Guide (gray background)
Use for "how to choose" sections with multiple conditional recommendations.

```html
<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin: 0 0 1rem 0;">Decision Guide</p>
<p style="color: #334155; font-size: 1rem; margin: 0 0 0.75rem 0;">Recommendation here.</p>
</div>
```

**Minimum callouts per post:** 3 (Key Takeaways is mandatory; add at least 2 more from the types above).

---

## 3. Comparison Tables

Every post that compares two or more options must include a styled HTML comparison table. Never use markdown tables for primary comparisons (they lack visual weight).

### Table Design Rules

- Use `overflow-x: auto` wrapper for mobile responsiveness
- Header row: bold, gray background (`#f8fafc`), bottom border
- Row highlighting: use green background (`#f0fdf4`) for the recommended option
- Font size: `0.95rem` for readability
- Padding: `0.75rem 1rem` per cell
- Minimum columns: 4 (name, type/category, key differentiator, cost/verdict)
- Number column: include a `#` column for list/comparison posts

### Column Selection

Choose columns that help the reader make a decision. Avoid feature-dump columns. Good columns:

| Column Type | Purpose |
|---|---|
| Tool/Option name | Identification |
| Type/Category | Quick classification |
| Price | Immediate cost context |
| Best For | Reader self-selects |
| Key Differentiator | Why this one vs others |
| Verdict indicator | Quick scan (checkmark, Yes/No, rating) |

---

## 4. Tool/List Article Standards

Any post comparing or listing tools, products, or options must follow these rules:

### Coverage

- **Minimum 8 tools** for any "best [X] tools" article. 10 is the target.
- Every tool listed must offer genuine differentiation. Do not pad the list with redundant entries.
- Group tools by category (free, paid, enterprise, etc.) for clarity.

### Per-Tool Section Structure

Every tool section must use this consistent structure:

1. **Numbered H3 heading** (e.g., `### 1. Tool Name`)
2. **Screenshot immediately after the heading** (see Visual Standards below)
3. **Direct link** to the tool's specific page (not homepage unless the tool IS the homepage)
4. **Type** classification
5. **How it works** (1-2 paragraphs)
6. **Key advantage** (what makes it stand out)
7. **Key limitation** (honest tradeoff)
8. **Verdict** (1-2 sentences)

Never vary this structure between tools in the same post. Consistency is mandatory.

### Linking Rules

- Every tool must have a direct, clickable link to its tool page
- Never link only the first tool and skip the rest
- For SellonTube tools, use relative paths (`/tools/slug`)
- For external tools, link to the specific feature page where possible

### SellonTube Tool Coverage

When a SellonTube tool appears in a comparison post, give it expanded coverage (2-3x the word count of other tools). Include:

- Step-by-step "how it works"
- Multiple usage scenarios ("when to use it")
- Unique advantages vs alternatives (with specifics)
- A styled CTA callout linking to the tool

This is not bias. It is domain expertise. You know more about your own tool, so you can write more specifically about it.

---

## 5. Visual Standards

### Screenshots

- **Tool comparison posts:** Capture a screenshot of every tool's interface using Puppeteer or equivalent
- **Place immediately after the tool's H3 heading**, before the description text
- Wrap in a styled container with border-radius:

```markdown
<div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin: 1rem 0 1.5rem 0;">

![Tool Name interface](~/assets/images/blog/tools/tool-name.png)

</div>
```

- Store screenshots in `src/assets/images/blog/tools/`
- File naming: `tool-name-feature.png` (lowercase, hyphenated)
- Viewport: 1280x800 for consistency
- If a site blocks automated capture (Cloudflare, bot detection), keep the styled HTML mockup card as a fallback

---

## 8. MDX Gotchas

These rules apply to all `.mdx` blog post files. Violations cause build failures.

1. **Never nest `<ul>` inside `<li>` with newlines.** MDX treats newlines between HTML tags as paragraph boundaries. A nested list structure like `<li><a>Parent</a>\n<ul><li>Child</li></ul>\n</li>` will break. Use flat structures with `padding-left` for visual indentation, or use plain markdown lists instead.

2. **Escape markdown-significant characters inside HTML.** `*` becomes `&#42;`, `<` becomes `&lt;`, `{` becomes `&#123;`. MDX parses markdown inside HTML blocks. A bare `*` in a `<span>` triggers emphasis parsing and breaks the build.

3. **For Table of Contents, use plain markdown.** Write `## Contents` followed by a markdown list of anchor links. Custom HTML ToC with styled `<div>` tags is fragile in MDX. Every existing blog post uses plain markdown for ToC. Match them.

4. **Astro compiles ALL `.mdx` files on dev server start.** A broken MDX file anywhere in `src/data/post/` blocks viewing ANY page. When the dev server shows an MDX error, check the file path in the error message. It may be a pre-existing bug in a different file, not your new post.

5. **All blog posts with inline HTML or SVG must be `.mdx`, not `.md`.** But: the more HTML you put in MDX, the more parser edge cases you hit. Prefer markdown where possible. Use HTML only for callout boxes, tables, SVGs, and embeds.

---

## 9. Draft QA Checklist (Run Before Presenting Draft)

Run these checks AFTER writing the draft and BEFORE showing it to the user. The first-draft quality bar means all checks pass on the first presentation.

### Mandatory Passes

- [ ] **Full Agent 05 checklist** — run every item, not just em-dash + banned word grep
- [ ] **Anti-AI humanizer two-pass** — Agent 04 Phase 2.5. Identify AI tells (Pass 1), check for pulse (Pass 2). Do this during drafting, not as a separate review step.
- [ ] **Em-dash grep** returns zero matches
- [ ] **Banned AI vocabulary grep** returns zero matches
- [ ] **"Read more:" link count** — max 3-4 per post. Convert excess to inline contextual links.
- [ ] **At least one `/tools/*` link** — every post should link to a relevant SellonTube tool
- [ ] **Zero duplicate internal link URLs** — grep each `/blog/` URL, verify none appear twice
- [ ] **All Sources have clickable URLs** — find source URLs during research, not after drafting
- [ ] **Paragraph max 3 sentences** — spot-check all prose paragraphs
- [ ] **FAQ questions include "I" or "my"** — conversational tone for AEO

### Visual Design Checks

- [ ] **Inline SVGs match the blog's light theme** — use `#f8fafc` backgrounds, `#e2e8f0` borders, dark text. Do NOT use dark palette (#0f172a) for inline diagrams. Dark palette is for featured images only.
- [ ] **Pull quotes are subtle** — thin gray left border (`#e2e8f0`), no background, dark text. No dark backgrounds with white text.
- [ ] **Tables described before built** — state column count, headers, and cell style to user before coding. Avoids rebuild cycles.
- [ ] **Case study boxes used sparingly** — max 2-3 per post. More dilutes visual impact.
- [ ] **Callout boxes min 3** — Key Takeaways + at least 2 others (warning, tip, decision guide)

### Pre-Presentation Verify

- [ ] Page loads at `localhost:4321/blog/[slug]` with 200 status, no error overlay
- [ ] All HTML elements render (SVGs, tables, callouts, embeds, pull quotes)
- [ ] Internal links point to live posts (not draft:true or future-dated)

### Styled HTML Visual Elements

For process explanations, before/after comparisons, or data visualization where a screenshot is not appropriate, use inline styled HTML. Examples from approved posts:

- **Before/After title rewrite cards** (green/red border comparison)
- **Method overview grid** (3-column cards with icons)
- **Position-vs-views warning boxes**
- **Keyword-to-content mapping tables**

### Image Limits

- **Standard posts:** Max 4 in-body images per post
- **Tool/list posts:** One screenshot per tool (no cap). This overrides the 4-image limit for tool comparison articles.
- **All posts:** Hero/featured image excluded from count
- Every image needs descriptive `alt` text with target keyword where natural

### SVG Diagrams

Use inline SVG for workflows, decision trees, and process flows. Requirements:
- Include `viewBox`, `role="img"`, and `aria-label`
- Use inline styles (not Tailwind classes) for markdown compatibility
- Keep diagrams simple: one concept per diagram
- **Text sizing rule:** Inline SVG text must be legible alongside blog body text (~16-18px rendered). Use minimum font-size 14 for body text and 15-16 for headings within SVGs. Never use font-size below 14 in an inline SVG.
- **Visual design rules for inline SVGs:**
  - **No excess whitespace.** Size the viewBox tightly to content. Cards and containers should wrap text with consistent padding (12-20px), not leave large blank areas below the last line of text.
  - **Use the site's dark palette for diagrams.** Background: `#0f172a` (navy). Card fill: `#1e293b`. Card border: `#334155`. Heading text: `#f8fafc` (white). Body text: `#94a3b8` (light gray). Accent: `#f97316` (orange) for top-bar highlights or emphasis. This matches the featured image palette and looks premium.
  - **Never use washed-out light backgrounds** (`#f8fafc` fill with `#e2e8f0` border) for diagram containers. These look flat and cheap against blog body text.
  - **Card top-bar accent pattern.** For multi-card layouts, add a thin accent bar (`height="6"`, same `rx` as card) at the top of each card to add visual hierarchy without clutter.
  - **Contrast check.** Heading text must have >7:1 contrast ratio against card fill. Body text must have >4.5:1. White on dark navy passes. Blue on light blue does not.
  - **Center alignment.** Wrap SVG in `<figure style="margin: 2rem auto; text-align: center;">`. Add `display: block; margin: 0 auto;` to the SVG element itself. Both are needed for consistent centering across browsers and markdown renderers.
  - **Reference implementation:** See the 4-pillar diagram in `is-vidiq-worth-it-for-business.mdx`.

---

## 5b. Content Depth Requirements (CTR + Ranking Signals)

These requirements ensure every post has enough depth to rank AND enough differentiation to earn clicks at positions 5-10 where CTR is naturally low.

### Multiple Walkthroughs/Examples

Any post teaching a framework, process, or method must include at least 2 worked examples from different industries or contexts. A single example feels narrow and industry-specific. Two examples prove the framework is universal and earn broader topical relevance from Google.

- Example: A script writing post needs a SaaS walkthrough AND a consulting/services walkthrough
- Example: A keyword research post needs a B2B software example AND a professional services example

### Bucket Brigades (mandatory: 4-5 per post)

Place transitional sentences at natural attention-dip points to keep readers scrolling. These are standalone one-line paragraphs:

- "But there's a catch."
- "Here's where it gets interesting."
- "So what does this mean for your business?"
- "Now, you might be thinking..."
- "Here's the thing:"

Place them: after the first major section, before the product bridge/CTA section, at any point where 3+ dense paragraphs appear back-to-back, and before the final mistakes/FAQ section.

### Loss Aversion (mandatory: at least 1 per post)

At least one moment in every post must make inaction feel costly. Not just "here's what to do" but "here's what you lose by NOT doing this." Be specific and honest, not manipulative.

### Inline SVG Diagrams

For any post teaching a framework or process, include at least one inline SVG diagram showing the structure visually. Requirements:
- Include `viewBox`, `role="img"`, `aria-label`
- Use inline styles (not Tailwind)
- Show specific data: time allocations, percentages, metrics
- Wrap in a `<figure>` with header strip + data visualization + metrics footer
- One concept per diagram

### Styled HTML Comparison Tables (not markdown)

Any table comparing options, approaches, or types that helps readers make a DECISION must be styled HTML. Markdown tables are only acceptable for simple reference data (e.g., word count by video type).

Decision tables require:
- `overflow-x: auto` wrapper for mobile
- Bold gray header row (`#f8fafc`, bottom border)
- Green background (`#f0fdf4`) for the recommended column/option
- Font size: `0.95rem`, padding: `0.75rem 1rem`
- Minimum 6 rows of meaningful differentiation

### Styled Callouts (not blockquotes)

Never use plain markdown blockquotes (`>`) for tool recommendations, tips, or related content. All such content must be in styled callout boxes:
- Related tools/resources → gray background callout (`#f8fafc`)
- Tips/quick decisions → green background callout (`#f0fdf4`)
- Warnings/mistakes → yellow left-border callout (`#eab308`)

Plain blockquotes are invisible in the page flow. Styled callouts have visual weight and earn attention.

### Attribution Rule

Never invent or cite specific statistics without a verifiable source. For claims based on consulting experience, use "in our experience" attribution. For claims based on industry data, cite the source in a Sources section after FAQ.

- BAD: "Scripted videos generate 3-5x more leads"
- GOOD: "In our experience, scripted business videos convert at significantly higher rates"

---

## 6. Common Production Mistakes

These mistakes have been caught in real drafts. Do not repeat them.

| Mistake | Correct Approach |
|---|---|
| Using `---` between H2 sections | H2 headings provide separation. One `---` allowed after ToC only. |
| Only 4 H2s on a 3,000-word post | Minimum 8 H2s for posts over 3,000 words |
| "What to do this week" as plain text | Always use the styled green callout box |
| Only 6 tools in a "best tools" comparison | Minimum 8, target 10 |
| Screenshot only for the first tool | Screenshot for every tool, consistently |
| Link only for the first tool | Direct link for every tool |
| Linking to tool homepage instead of specific feature | Link to the exact tool/feature page |
| Flat ToC on a tool comparison post | Nest tool names as indented H3 links |
| Shallow tool sections (<100 words) | Every tool gets the full structure: how it works, advantage, limitation, verdict |
| HTML mockup cards when real screenshots are available | Use Puppeteer to capture real screenshots. Fallback to HTML only when blocked. |
| Inconsistent section structure across list items | Every item in a list post uses identical H3 sub-structure |
| Missing comparison table | Every comparison post needs a styled HTML comparison table |
| Missing callout boxes | Minimum 3 styled callouts per post |

---

## 7. First-Draft Quality Bar

**Every blog post must meet ALL standards in this document, the Style Guide, and the Content Playbook from the first draft.** This is not aspirational. It is the minimum acceptable output.

Specifically, the first draft must include:

**Structure:**
- [ ] All H2s and H3s at the correct depth for the word count
- [ ] ToC with proper nesting (flat or nested based on post type)
- [ ] No horizontal dividers (`---`) between sections

**Callouts (minimum 3):**
- [ ] Key Takeaways callout box (blue left border, immediately after intro)
- [ ] At least 2 additional styled callouts (warning, tip, decision guide, or related tools)
- [ ] No plain markdown blockquotes for tips/tools/related content

**Content Depth:**
- [ ] Featured snippet block (H2 matching target query + concise numbered list or paragraph answer)
- [ ] At least 2 worked examples/walkthroughs from different industries
- [ ] Styled HTML comparison table (if comparing anything)
- [ ] At least 1 inline SVG diagram for frameworks/processes
- [ ] 4-5 bucket brigades at attention-dip points
- [ ] At least 1 loss aversion moment (inaction made costly)

**CTR + SEO:**
- [ ] Title differentiates from SERP competitors (specificity signal: number, bracket, framework name)
- [ ] Title under 60 characters
- [ ] Meta description under 155 chars with specific claim (not vague "comprehensive guide")
- [ ] No invented statistics (use "in our experience" for unverifiable claims)

**Production:**
- [ ] publishDate is today or in the past (NOT tomorrow, NOT a future date — future dates cause 404 on the live site because the static build filters them out)
- [ ] FAQ content written manually in MDX body (frontmatter `faqs` only generates schema.org JSON-LD, NOT visible content. Every FAQ must be an H3 + paragraph in the body)
- [ ] Screenshots for every tool (if it is a tool post)
- [ ] Direct links for every tool/resource mentioned
- [ ] Styled "What to Do This Week" green callout closing
- [ ] All visuals placed and captioned
- [ ] All style guide checks passed (em-dash ban, AI phrase ban, etc.)
- [ ] Internal links verified (exact slugs confirmed against `src/pages/tools/` and `src/data/post/`)

**AI SEARCH OPTIMIZATION:**
- [ ] AI citability: the first draft must pass the citability gate (`docs/seo/ai-seo-guide.md` Section 16), apply the citation-ready language rules (Section 17), and include perf-safe media (Section 18). Comparison/listicle posts must also pass `agents/references/comparison-content-playbook.md`.

**The user should review for strategic direction and tone, not for missing formatting, visuals, or structural elements.** Those must be right before the draft is shown.

---

## 8. Content Quality Gates (Measurable Specs)

These are exact values, not guidelines. Copy them. Do not approximate.

### Font Sizes in HTML Components

| Component | Element | Font Size | Notes |
|---|---|---|---|
| Callout boxes | Uppercase label | `0.8rem` | All callout types |
| Callout boxes | Body text / list items | `1rem` | Matches blog body |
| Comparison tables | All cell text | `0.95rem` | Slightly smaller than body for density |
| Table of Contents | Link text | `1rem` | |
| ToC / Callout | Section label (uppercase) | `0.8rem` | |
| Figcaption | Caption text | `0.85rem` | Intentionally smaller |
| Green CTA box | Action items | `1rem` | |

**Rule:** If any HTML text inside a blog post renders noticeably smaller than surrounding paragraph text, the font-size is wrong. Fix it before showing the draft.

### SVG Diagram Specs

| Element | Min Font Size | Color |
|---|---|---|
| Heading text | 15 | `#f8fafc` (white) |
| Body text | 14 | `#94a3b8` (light gray) |
| Background | N/A | `#0f172a` (navy) |
| Card fill | N/A | `#1e293b` (dark slate) |
| Card border | N/A | `#334155` (slate) |
| Accent bar | N/A | `#f97316` (orange) |

**Centering:** `<figure style="margin: 2rem auto; text-align: center;">` + `display: block; margin: 0 auto;` on the SVG element.

**ViewBox:** Size tightly to content. No blank space below the last line of text in any container. If cards have 4 lines of body text ending at y=206, card bottom should be at ~225, not 320.

### FAQ Rendering

Frontmatter `faqs` array generates schema.org FAQPage JSON-LD only (invisible). Visible FAQ content MUST be written manually in the MDX body:

```markdown
## FAQ

### Question text here?

Answer paragraph here with [internal links](/tools/tool-name) where relevant.
```

Every question in the frontmatter `faqs` array must have a matching H3 + paragraph in the body. No exceptions.

---

## 9. Pre-Publish Verification (Mandatory)

Run these checks AFTER writing and BEFORE showing the draft to the user. Every check must pass.

### Automated Checks (grep commands)

```
# Em-dash ban
grep -r "—" [post-file]

# Banned AI transitions
grep -riE "Moreover|Furthermore|Additionally|Interestingly|Let's break this down|It's worth noting|delve|pivotal|tapestry|testament|showcase|vibrant|intricate|underscore|garner|foster|leverage|comprehensive|actionable" [post-file]

# Banned sentence structures
grep -riE "Not only .+, but also|Whether you're|Let's dive in|Without further ado|In the world of|When it comes to" [post-file]

# Wrong font sizes (should find zero matches)
grep -c "font-size: 0.85rem\|font-size: 0.7rem" [post-file]

# FAQ body check (must have H3s after ## FAQ)
grep -A2 "## FAQ" [post-file]

# Internal links exist
grep -oE "/tools/[a-z-]+" [post-file]
# then verify each slug exists in src/pages/tools/
```

All grep checks must return zero matches (for banned patterns) or confirm expected content exists (for FAQ, links).

### Visual Checks (browser inspection)

Start the dev server (`npm run dev`) and check the post at its URL:

- [ ] SVG diagrams render with readable text (not tiny compared to body)
- [ ] SVG diagrams are centered in the content column
- [ ] Callout box text is same size or near-same size as body paragraphs
- [ ] Table text is readable and not significantly smaller than body
- [ ] FAQ section has visible question/answer content (not just a heading)
- [ ] Comparison table highlights the recommended row in green
- [ ] "What to Do This Week" renders as a green callout, not plain text
- [ ] All internal links are clickable and resolve to real pages
- [ ] Featured image renders correctly (no broken SVG, no layout issues)
- [ ] No excessive whitespace in any visual element

**If any visual check fails, fix it before presenting the draft.**

---

## Integration

This document is referenced by:
- **Agent 04 (blog writer):** Must apply all standards during draft generation
- **Agent 05 (content QA):** Must verify all standards during quality review
- **CLAUDE.md:** Listed as a core reference document
- **Memory:** Stored as a feedback memory for cross-session persistence

When this document conflicts with the Style Guide or Content Playbook, **this document takes precedence** for production and formatting rules. The Style Guide takes precedence for writing style. The Content Playbook takes precedence for strategy.
