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

**Do not use horizontal dividers (`---`) between sections.** H2 headings provide sufficient visual separation. This overrides any earlier guidance in the Style Guide.

### Closing Section

The "What to Do This Week" section must be a styled green callout box with numbered action items. Never plain text. Use this exact pattern:

```html
<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #166534; margin: 0 0 0.75rem 0;">What to Do This Week</p>
<ol style="margin: 0; padding-left: 1.25rem;">
<li style="margin-bottom: 0.5rem; color: #14532d; font-size: 0.9rem;">Action item here.</li>
</ol>
</div>
```

---

## 2. Styled Callout Boxes

Use styled HTML callouts for key information. Never present important summaries, warnings, or action steps as plain text. Four standard callout types:

### Key Takeaways (blue left border)
Place immediately after the intro. Use for 4-6 standalone insights.

```html
<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin: 0 0 0.75rem 0;">Key Takeaways</p>
<ul style="margin: 0; padding-left: 1.25rem;">
<li style="margin-bottom: 0.5rem; color: #334155; font-size: 0.9rem;">Insight here.</li>
</ul>
</div>
```

### Warning/Caution (yellow left border)
Use for common mistakes, caveats, or "watch out for this" moments.

```html
<div style="background: #fefce8; border: 1px solid #fde68a; border-left: 4px solid #eab308; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.85rem; font-weight: 600; color: #854d0e; margin: 0 0 0.5rem 0;">Warning title</p>
<p style="color: #713f12; font-size: 0.85rem; margin: 0;">Warning content.</p>
</div>
```

### Quick Decision/Tip (green background)
Use for decision rules, quick summaries, or "try this now" moments.

```html
<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.85rem; font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">Quick decision rule</p>
<p style="color: #14532d; font-size: 0.85rem; margin: 0;">Rule content here.</p>
</div>
```

### Decision Guide (gray background)
Use for "how to choose" sections with multiple conditional recommendations.

```html
<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem 1.75rem; margin: 2rem 0;">
<p style="font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin: 0 0 1rem 0;">Decision Guide</p>
<p style="color: #334155; font-size: 0.9rem; margin: 0 0 0.75rem 0;">Recommendation here.</p>
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
- Font size: `0.85rem` for readability
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

---

## 6. Common Production Mistakes

These mistakes have been caught in real drafts. Do not repeat them.

| Mistake | Correct Approach |
|---|---|
| Using `---` horizontal dividers between sections | H2 headings provide separation. No dividers. |
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

- [ ] All H2s and H3s at the correct depth for the word count
- [ ] ToC with proper nesting (flat or nested based on post type)
- [ ] Key Takeaways callout box
- [ ] At least 2 additional styled callouts
- [ ] Comparison table (if comparing anything)
- [ ] Screenshots for every tool (if it is a tool post)
- [ ] Direct links for every tool/resource mentioned
- [ ] Styled "What to Do This Week" closing
- [ ] All visuals placed and captioned
- [ ] No horizontal dividers
- [ ] All style guide checks passed (em-dash ban, AI phrase ban, etc.)
- [ ] Internal links verified (exact slugs confirmed against `src/pages/tools/` and `src/data/post/`)

**The user should review for strategic direction and tone, not for missing formatting, visuals, or structural elements.** Those must be right before the draft is shown.

---

## Integration

This document is referenced by:
- **Agent 04 (blog writer):** Must apply all standards during draft generation
- **Agent 05 (content QA):** Must verify all standards during quality review
- **CLAUDE.md:** Listed as a core reference document
- **Memory:** Stored as a feedback memory for cross-session persistence

When this document conflicts with the Style Guide or Content Playbook, **this document takes precedence** for production and formatting rules. The Style Guide takes precedence for writing style. The Content Playbook takes precedence for strategy.
