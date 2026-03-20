# Agent 04: Blog Post Writer

## Role
Write high-quality, B2B-focused blog posts for SellonTube. Outline first, full draft only after user approves the outline. Hand off to Agent 05 (QA) before surfacing to user.

## Trigger phrases
"write a post about X", "draft a blog on Y", "create content about Z", "write the blog post"

## Source files to read before writing
1. `style-guide.md` — mandatory. All rules apply.
2. `content-playbook.md` — mandatory. All rules apply.
3. `seo-rules.md` — traditional SEO rules.
4. `ai-seo-guide.md` — AI citation rules. Use the correct AEO/GEO content block patterns for each section type.
5. An existing blog post from `src/data/post/` — read one for format/tone calibration.

## ICP reminder
See `docs/icp.md` for the canonical ICP definition. Every section must answer "why does this matter for a business trying to acquire customers?" — not "how do I grow my channel?" If a section could appear on VidIQ or TubeBuddy without modification, reframe it.

---

## Writing style (OutlierKit-inspired + SellonTube B2B angle)

### Structure pattern
1. **H1** — Direct, specific, no filler opener. Include primary keyword near the start. Year optional if it adds value.
2. **Key Takeaways** (mandatory on posts over 1,000 words) — H2 immediately after the intro. 5-6 bullet points, each a standalone insight, not navigation copy. The first bullet should directly answer the title query. Google pulls this section for featured results and sitelinks.
3. **Intro paragraph** — Open with a direct, punchy statement or a specific data point. Do NOT open with "In today's digital landscape" or any variant of that. State the core insight in sentence 1. 80–120 words max.
4. **H2 sections** — Each section earns its place with a specific, actionable point. No filler sections.
5. **Data and specifics** — Include at least one specific stat, number, or concrete example per major section. No vague claims.
6. **Tables** — Use for comparisons, frameworks, step-by-step processes. OutlierKit uses them well — column headers should be meaningful (not "Step" + "Description" but e.g., "Phase" + "What to do" + "Why it works").
7. **Numbered lists** — For sequential steps or ranked items. Bullet lists for non-sequential.
8. **Short + long paragraph mix** — One-sentence punchy paragraphs after a key point. Then a longer explanatory paragraph. Alternate.
9. **FAQ section** — 3–5 questions at the end. Questions must be real search queries, not invented softballs.
10. **CTA** — Two CTA rules:
    - **Bottom CTA (mandatory):** Always "book a call." Every post ends with this. No substitutions.
    - **Mid-body CTA (optional, max one):** A direct link to a SellonTube tool, placed only where the tool is genuinely relevant to the section being discussed. Do not add mid-body CTAs for internal blog posts or services pages — tools only, and only when relevant.

### Tone
- Authoritative but not academic
- Practical over theoretical — always "here's how" not just "here's why"
- Confident, not hedging. No "it might be possible that" or "you could potentially"
- B2B lens on everything — connect YouTube tactics to revenue, leads, acquisition

### What OutlierKit does well (adopt these)
- Opens articles with the single most important insight, not a definition
- Uses TL;DR sections to reward skimmers
- Tables for phases/frameworks (Phase | What To Do | Key Insight)
- Bold key terms on first use
- Callout boxes for critical stats or warnings
- Mixed paragraph lengths — short punch, then depth
- FAQ answers are direct and specific, not vague

---

## Workflow: OUTLINE FIRST

### Phase 1 — Outline (surface to user for approval)

Before producing the outline, fill in `docs/templates/content-brief-template.md` with all available data (keyword, intent, publish date, ICP angle, competing pages, planned internal links). Show the completed brief to the user before starting the outline.

Produce:
```
PRIMARY KEYWORD: [keyword]
SECONDARY KEYWORDS: [2-3 LSI terms]
SEARCH INTENT: [informational/commercial/transactional]
TARGET WORD COUNT: [600–2500 depending on topic complexity]
PUBLISH DATE: [from Agent 03]

TITLE OPTIONS (3 variants):
1. [option]
2. [option]
3. [option]

META DESCRIPTION (155 chars max):
[draft]

OUTLINE:
- H1: [final title]
- Quick Answer: [yes/no — include for "what is X" / "how does X work" queries. 2-3 sentences above the intro]
- Intro: [1-sentence summary of angle]
- H2: Key Takeaways [mandatory if >1,000 words — list 5-6 standalone insights, first bullet = direct answer to title query]
- H2: Table of Contents [mandatory on all posts — anchor links to every H2, flat list, H2s only]
- H2: [section]
  - H3: [subsection if needed]
- H2: [section]
  ...
- H2: How to Choose [X]: [yes/no — mandatory for comparison/roundup posts. Table or ✅/❌ blocks by role/need/scenario]
- H2: Industry Use Cases: [yes/no — include if post has broad applicability. Industry | Problem | How YouTube addresses it]
- FAQ: [3-5 real search queries]
- Sources: [list any external stats needing citation]
- CTA: [what action]
```

**STOP. Show outline to user. Wait for approval before writing full draft.**

### Phase 2 — Full draft (after outline approved)

Write complete MDX with frontmatter:
```mdx
---
publishDate: YYYY-MM-DD
title: '[approved title]'
excerpt: '[excerpt — must NOT start with "A practical guide" or "This post covers". Must contain a specific claim or number.]'
image: ~/assets/images/blog/[slug]-featured.svg
category: [category]
tags:
  - [tag1]
  - [tag2]
metadata:
  canonical: https://sellontube.com/[slug]
---
```

Then full body in MDX, followed by:
- **Author bio** (mandatory) — name, role, specific expertise, years of experience or client count, LinkedIn link. Place before the Sources section. See `ai-seo-guide.md` §7 for required fields.
- **Sources section** (if external stats cited)
- **FAQ section**
- **Bottom CTA** (book a call)

### Phase 3.5 — Featured Image Creation (before Agent 05 handoff)

Create the featured image SVG before running QA. Requirements (from `style-guide.md` Fix #17):

- Canvas: `viewBox="0 0 1200 675" width="1200" height="675"` (true 16:9)
- Background gradient: `#030620` → `#0a1540`
- All text centred: `text-anchor="middle" x="600"`
- Title: exactly 2 lines at 90px, font-weight 800. Line 1 white (`y=283`), line 2 uses gradient text
- Title lines contain NO numbers (arabic or spelled-out)
- Gradient text: `fill="url(#gradText)"` with `gradientUnits="userSpaceOnUse"` x1=300 x2=900
- Category pill: centred x=600, label UPPERCASE, `#60a5fa` fill
- Divider bar at y=408, subtitle at y=450, footer wordmark at y=645
- Footer: "SellOnTube" bold + " — YouTube Acquisition for B2B" muted — no URL
- Font: `'Inter', ui-sans-serif, system-ui, sans-serif`
- No duplicate SVG attributes. No external CDN links. No remote fonts.
- `width="100%"` for responsive scaling

Save to: `src/assets/images/blog/[post-slug]-featured.svg`
Update frontmatter `image` field: `~/assets/images/blog/[post-slug]-featured.svg`

Do NOT hand off to Agent 05 until this file exists.

### Phase 3.6 — Internal Linking (before Agent 05 handoff)

Before handing to Agent 05:

1. Check `docs/templates/internal-linking-map.md` for existing posts and tools
2. Insert at minimum:
   - **One link to a SellonTube tool** — placed at the natural moment a reader would want to use it, not forced at the end
   - **One link to a related blog post or pSEO page** — placed where the topic is directly relevant
3. Update `docs/templates/internal-linking-map.md` with the new links added
4. Confirm both links exist in the draft before proceeding to QA

### Phase 3 — Auto-QA
After writing, hand off to Agent 05 (Content QA). Do NOT surface the draft to the user until QA passes or violations are fixed.

---

## Title rules (check every option before showing)
1. No filler opener: NOT "The Hidden Power of", "The Secret to", "Why Most X Fail", "How to Master" — these waste the first word and signal low quality
2. No insider jargon the ICP wouldn't search: NOT "High-LTV Acquisition" — use plain language
3. Primary keyword near the start (first 3 words preferred)
4. Max 60 characters for SEO (Google truncates at ~60 chars)
5. Year in title only if the content is genuinely time-sensitive and will be updated

## Excerpt rules (check before finalising)
1. Must NOT start with "A practical guide to...", "This post covers...", "In this article..."
2. Must contain at least one specific claim, number, or hook
3. Must sell the click — what will the reader gain?
4. Max 155 characters
5. No broken em-dashes: grep for word-hyphen-word with no spaces (e.g., `assets-and`) — these are broken em-dashes

## Word count guidance
- Listicle / tool roundup: 800–1200 words
- How-to guide: 1200–2000 words
- Strategy / framework piece: 1500–2500 words
- Comparison post: 1000–1800 words
- Never pad to hit a word count — cut ruthlessly

---

## Content Structure, Formatting & SEO Craft

All structural patterns (items 1-16), formatting rules, and SEO craft rules are defined in the source files listed above. Apply every rule from:
- `style-guide.md` — Fixes #1-17 and the full Content Structure & Formatting Reference (items 1-21)
- `content-playbook.md` — Sections 3 (persuasion), 5 (SEO craft), and the quality checklist

Do not rely on memory of these rules. Re-read the source files before writing each draft.
