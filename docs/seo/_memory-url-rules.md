---
name: SellonTube URL rules — no 404s
description: SellonTube internal link conventions, zero-404 policy, and mandatory link audit after any URL structure change
type: feedback
---

## Zero 404 Policy — sellontube.com

**There must be ZERO 404 pages on the website.** Every internal link must resolve to a live page.

### Root Cause (March 2026 incident)
pSEO pages were migrated from flat URLs (`/youtube-for-coaches`) to nested URLs (`/youtube-for/coaches`),
but internal links in 3 files were not updated. A Netlify redirect masked the issue locally, but Google
indexed the old URLs and surfaced them as 404s in search results.

### URL Convention
- pSEO hub pages use **nested slug format**: `/youtube-for/coaches`, `/youtube-vs/facebook`
- NEVER use hyphenated flat format: ~~`/youtube-for-coaches`~~, ~~`/youtube-vs-facebook`~~
- Exception: `/youtube-for-shopify` is a standalone page (not pSEO), lives at `src/pages/youtube-for-shopify.astro`

### Mandatory Checks
1. **After any URL structure change:** grep the ENTIRE `src/` directory for old URL patterns before considering the task done
2. **After adding new pSEO pages:** verify all internal links point to the correct nested path
3. **After any deployment:** no page on the sitemap should return 404
4. **Link format in code:** always use `/youtube-for/${slug}` (template literal with slash), never `/youtube-for-${slug}` (hyphen)

### Where Links Live (common sources of stale URLs)
- `src/data/comparisons.ts` — relatedLinks arrays
- `src/pages/youtube-video-ideas/[slug].astro` — industry guide CTAs
- `src/pages/youtube-video-ideas/index.astro` — industry hub links
- `src/data/post/*.md` / `*.mdx` — blog post internal links
- `src/navigation.ts` — nav menu
- `netlify.toml` — redirects (keep these as safety net, but fix source links)
