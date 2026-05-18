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

- Up to 5 posts/week. pSEO is paused, so all publishing velocity goes to blog.
- Quality bar unchanged -- every post must meet content-playbook.md standards.
- See `growth-strategy.md` "Current Blog Schedule" for the active publishing plan.

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

## Technical

- Stack: Astro 5 (static), Tailwind, MDX, Netlify
- Partytown runs GA4 — use `window.dataLayer.push()`, NOT `transport_type: 'beacon'`
- Astro config: `astro.config.ts` — Partytown must have `forward: ['dataLayer.push']`
- Site config: `src/config.yaml`
- Netlify config: `netlify.toml`

---

