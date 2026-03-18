# SellonTube SEO Rules Cheat Sheet

Read this before any SEO decision. These rules override general SEO defaults.

---

## URL Structure

- Hub page at `/section/` → children MUST be `/section/[slug]` (not `/section-[slug]`)
- YouTube For: `/youtube-for/[slug]` — e.g. `/youtube-for/coaches`
- YouTube Vs: `/youtube-vs/[slug]` — e.g. `/youtube-vs/facebook`
- Wildcard redirects in `netlify.toml` handle old flat URLs (`/youtube-for-:slug` → `/youtube-for/:slug`)
- Calculator page is `/youtube-roi-calculator` (NOT `/calculator` — 301 in place)
- No `/contact` page — booking link is `https://cal.com/gautham-8bdvdx/30min`

---

## Canonicals

- Every page must have an explicit `canonical` tag
- Blog posts: set in MDX frontmatter under `metadata.canonical`
- pSEO pages: rendered from `niches.ts` / `comparisons.ts` metaTitle/metaDescription fields
- Never let two URLs serve the same content without a canonical or 301

---

## Redirects (netlify.toml)

- All legacy WordPress URLs must have 301s: `/category/`, `/tag/`, `/author/`, `/homes/`, `/landing/`
- Check GSC Pages report for non-Astro URLs still getting impressions — add 301 for each
- `/calculator` → `/youtube-roi-calculator` (301, live)
- `/youtube-for-:slug` → `/youtube-for/:slug` (wildcard, live)
- `/youtube-vs-:slug` → `/youtube-vs/:slug` (wildcard, live)

---

## pSEO Rules

- 29 "YouTube For" niche pages + 20 "YouTube Vs" comparison pages
- publishDate is IST (UTC+5:30) — parsed with `'T00:00:00+05:30'` in 4 template files. Never revert.
- Drip rate: ~4 pSEO pages/week. Never suggest bulk publishing.
- Submit each new page to GSC (URL Inspection → Request Indexing) on publish day
- pSEO pages are NOT subject to the blog cadence rule

---

## Blog Cadence

- Hard max: 1 post/week. Ceiling: 2/week.
- Before scheduling any post: grep `publishDate` across `src/data/post/` and count posts in the same 7-day window
- If adding the post pushes any window above 2 — stop and flag to user

---

## Meta Titles

- Must NOT use the pattern "YouTube Marketing for [X] | SellOnTube" — too generic
- Must NOT open with filler: "The Hidden Power of...", "The Secret to...", "Why Most..."
- Must include a specific hook, outcome, or differentiator
- Keep under 65 characters where possible
- Include the primary keyword near the front

## Meta Descriptions

- Must NOT open with "Turn YouTube into a..." (generic across all pages)
- Must NOT open with "A breakdown of..." / "A practical guide..." / "This post covers..."
- Must include at least one specific claim, number, or contrast
- Target 150–160 characters
- No em-dashes (—)

---

## GSC Legacy URL Triage

Two distinct cases — never give blanket advice:
1. **URLs with ranking equity** (impressions for relevant queries, position < 20): use GSC "Request Indexing" so Google crawls the 301 and passes equity to destination
2. **Junk pages** (WordPress artifacts, irrelevant queries, no SEO value): use GSC Removals tool to delete from index immediately

---

## Indexing

- New pSEO pages: submit to GSC on publish day (URL Inspection → Request Indexing)
- After any structural redirect change: request re-crawl of affected URLs
- Check sitemap is up to date and submitted in GSC

---

## Schema

- JSON-LD is in `src/components/common/JsonLd.astro`
- Blog posts should have Article schema
- FAQ sections should have FAQPage schema where present
- pSEO pages should have WebPage schema

---

## Technical

- Stack: Astro 5 (static), Tailwind, MDX, Netlify
- Partytown runs GA4 — use `window.dataLayer.push()`, NOT `transport_type: 'beacon'`
- Astro config: `astro.config.ts` — Partytown must have `forward: ['dataLayer.push']`
- Site config: `src/config.yaml`
- Netlify config: `netlify.toml`

---

