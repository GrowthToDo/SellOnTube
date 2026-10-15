Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `blog-production-standard.md` L41-43, L45-106, L113-119, L240-246, L270-284, L324-342, L424-453; `agents/04-blog-writer.md` L165-179.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# Brand visuals (palette, fonts, SVG specs)

Notes added for this kit (not in the sources):

- `blog-production-standard.md` contradicts itself on inline SVG diagrams: L242 says light theme (`#f8fafc` / `#e2e8f0`, "Do NOT use dark palette"), while L279-280 and the L440-449 spec table say dark palette (`#0f172a`) and "Never use washed-out light backgrounds". Not resolved here.
- `blog-production-standard.md` names no font family. The only font rule found is the featured-image spec in `agents/04-blog-writer.md` L178 (Inter).
- `agents/04-blog-writer.md` L167 cites `style-guide.md` "Fix #17" as the featured-image source. No "Fix #17" exists in `style-guide.md` (grep, 2026-10-15).
- Featured image size disagrees: SVG spec 1200x675 (`agents/04-blog-writer.md` L169); `scripts/get-feature-image.mjs` L234 resizes to 1200x630; schema defaults `featuredImageWidth/Height` to 1200/630 (`src/content/config.ts` L63-64). Still to confirm against `get-feature-image.mjs` before the next export; until then export at 1200x630.
- **Feature image format (decided 2026-10-15 by Sathya): PNG or JPG, never SVG.** Design the image with the SVG spec below, then export it to a PNG at 1200x630 (or the size confirmed above) and set `image:` to that raster file. New and edited posts use the raster file; old SVG posts convert one by one when edited (the post gate enforces raster formats). The Phase 3.5 spec below now describes the design source, not the shipped file.

### `blog-production-standard.md` L41-43: section separation

### Section Separation

**Do not use `---` between H2 sections.** One `---` is allowed after the Table of Contents, before the first H2. H2 headings provide sufficient visual separation. This overrides any earlier guidance in the Style Guide.

### `blog-production-standard.md` L45-106: callout box patterns

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

### `blog-production-standard.md` L113-119: table design


### Table Design Rules

- Use `overflow-x: auto` wrapper for mobile responsiveness
- Header row: bold, gray background (`#f8fafc`), bottom border
- Row highlighting: use green background (`#f0fdf4`) for the recommended option
- Font size: `0.95rem` for readability

### `blog-production-standard.md` L240-246: visual design checks

### Visual Design Checks

- [ ] **Inline SVGs match the blog's light theme** - use `#f8fafc` backgrounds, `#e2e8f0` borders, dark text. Do NOT use dark palette (#0f172a) for inline diagrams. Dark palette is for featured images only.
- [ ] **Pull quotes are subtle** - thin gray left border (`#e2e8f0`), no background, dark text. No dark backgrounds with white text.
- [ ] **Tables described before built** - state column count, headers, and cell style to user before coding. Avoids rebuild cycles.
- [ ] **Case study boxes used sparingly** - max 2-3 per post. More dilutes visual impact.
- [ ] **Callout boxes min 3** - Key Takeaways + at least 2 others (warning, tip, decision guide)

### `blog-production-standard.md` L270-284: SVG diagrams

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

### `blog-production-standard.md` L324-342: styled tables and callouts

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

### `blog-production-standard.md` L424-453: font sizes and SVG diagram specs

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

### `agents/04-blog-writer.md` L165-179: featured image SVG spec

### Phase 3.5 - Featured Image Creation (before Agent 05 handoff)

Create the featured image SVG before running QA. Requirements (from `style-guide.md` Fix #17):

- Canvas: `viewBox="0 0 1200 675" width="1200" height="675"` (true 16:9)
- Background gradient: `#030620` → `#0a1540`
- All text centred: `text-anchor="middle" x="600"`
- Title: exactly 2 lines at 90px, font-weight 800. Line 1 white (`y=283`), line 2 uses gradient text
- Title lines contain NO numbers (arabic or spelled-out)
- Gradient text: `fill="url(#gradText)"` with `gradientUnits="userSpaceOnUse"` x1=300 x2=900
- Category pill: centred x=600, label UPPERCASE, `#60a5fa` fill
- Divider bar at y=408, subtitle at y=450, footer wordmark at y=645
- Footer: "SellOnTube" bold + " - YouTube Acquisition for B2B" muted - no URL
- Font: `'Inter', ui-sans-serif, system-ui, sans-serif`
- No duplicate SVG attributes. No external CDN links. No remote fonts.
