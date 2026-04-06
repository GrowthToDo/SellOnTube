# Blog Publishing SOP

> Run this every time. No exceptions. Every step is a gate — if a step fails, fix it before proceeding.

---

## Pre-Write Gates

- [ ] **1. Keyword confirmed in `sot_master.csv`**
  - Read `research/keywords/sot_master.csv`
  - Find the target keyword row
  - Confirm `status = not-started`
  - If `status = live` or `planned`: STOP — do not proceed, flag to user

- [ ] **2. Cannibalization check**
  - Search all files in `src/data/post/` for the target keyword in titles and frontmatter
  - Search `src/data/niches.ts` and `src/data/comparisons.ts` for overlap
  - If overlap found: STOP — flag to user before proceeding

- [ ] **3. Fill in content brief**
  - Copy `docs/templates/content-brief-template.md`
  - Fill in: primary keyword, secondary keywords, intent, cluster, priority score, target word count, publish date, target URL, ICP angle, internal links to include, featured image path, competing pages
  - Show brief to user before starting outline

- [ ] **4. Confirm open calendar slot (Agent 03)**
  - Read all `publishDate` values in `src/data/post/*.{md,mdx}`
  - Count posts per rolling 7-day window
  - Confirm the proposed publish date does not put any 7-day window above 2 posts
  - If violation: propose next open slot

---

## Write Gates

- [ ] **5. Outline produced and user-approved (Agent 04 Phase 1)**
  - Produce outline using `agents/04-blog-writer.md` Phase 1 format
  - STOP — show outline to user — wait for explicit approval before writing

- [ ] **6. Full draft written (Agent 04 Phase 2)**
  - Write complete MDX with all required frontmatter fields

- [ ] **7. Featured image created**
  - Create SVG matching Fix #17 spec from `style-guide.md`:
    - Canvas: `viewBox="0 0 1200 675" width="1200" height="675"` (true 16:9)
    - Background: `#030620` → `#0a1540` gradient
    - Centered layout: all text at `text-anchor="middle" x="600"`
    - Title: exactly 2 lines at 90px/800 weight
    - Title lines contain NO numbers
    - Gradient text: `fill="url(#gradText)"` with `gradientUnits="userSpaceOnUse"` x1=300 x2=900
    - Category pill centred x=600, label UPPERCASE, `#60a5fa` fill
    - Divider bar at y=408, subtitle at y=450, footer wordmark at y=645
    - Footer: "SellOnTube" bold + " — YouTube Acquisition for B2B" muted — no URL
    - Font: `'Inter', ui-sans-serif, system-ui, sans-serif`
    - No duplicate SVG attributes. No external CDN links. No remote fonts.
    - `width="100%"` for responsive scaling
  - Filename: `[post-slug]-featured.svg`
  - Save to: `src/assets/images/blog/[post-slug]-featured.svg`
  - Update frontmatter `image` field to match

- [ ] **8. Internal links added**
  - Add at least 1 link to a relevant SellonTube tool at a natural decision moment
  - Add at least 1 link to a related blog post or pSEO page
  - Update `docs/templates/internal-linking-map.md` with new links

---

## QA Gate

- [ ] **9. Agent 05 QA: CRITICAL tier — all must PASS**
  - Grep file for `—` (em-dash) — must return zero matches
  - Check excerpt: does NOT start with "A practical guide", "This post covers", "In this article", "Learn how to"
  - Check excerpt: contains at least one specific claim, number, or hook
  - Check title: no filler opener, primary keyword near start, ≤ 65 chars
  - Check frontmatter: publishDate, title, excerpt, category, metadata.canonical, image all present
  - Check ICP: B2B framing, no creator metrics
  - Check body: no passive hedging, no filler transitions
  - **ZERO CRITICAL violations = PASS. Any critical violation = FAIL. Fix and re-run.**

- [ ] **10. Agent 05 QA: IMPORTANT tier — all must be resolved**
  - Content structure (Fix #13 patterns): Key Takeaways box, TOC, section structure
  - AEO/GEO citation blocks present where applicable
  - CTA rules: bottom CTA = book a call; any mid-body CTA follows tool-only rule
  - Internal links: at least 2 confirmed present

---

## Pre-Push Gates

- [ ] **11. publishDate confirmed IST-correct**
  - Format: `YYYY-MM-DD` (treated as `T00:00:00+05:30` by Astro)
  - If deploying before 05:30 IST: page won't appear until 05:30 IST — flag this to user

- [ ] **12. metadata.canonical matches URL path**
  - Canonical URL: `https://sellontube.com/[slug]`
  - Must match the file's actual route

- [ ] **13. Featured image file exists**
  - Grep the `image:` field from frontmatter
  - Confirm the referenced SVG file exists at that path

---

## Deploy and Post-Publish

- [ ] **14. Present final file + QA report to user — wait for explicit "yes"**

- [ ] **15. Commit (only after explicit user approval of commit message)**

```bash
git add src/data/post/[slug].mdx src/assets/images/blog/[slug]-featured.svg
git commit -m "content: add [title] ([primary keyword])"
```

- [ ] **16. Push (only after separate explicit "push" approval)**

```bash
git push
```

- [ ] **17. Submit to GSC Request Indexing**
  - Go to GSC → URL Inspection → enter the live URL → Request Indexing

- [ ] **18. Update sot_master.csv**
  - Change the target keyword row: `status` → `live`

- [ ] **19. Update internal-linking-map.md**
  - Add all links from this post to the map
  - Check if any existing posts should now link to this new post — add if so
