# SellonTube SEO Intelligence

Detailed audit findings, fix history, and strategic reference.
Quick rules → see `seo-rules.md`. This file has the detail.

---

## Google SEO Starter Guide — Principles Applied to SellonTube

Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

### 1. Help Google Find and Index Your Content

**Google's rule:** New pages are discovered primarily through links from already-crawled pages.

**SellonTube application:**
- Every new pSEO page must be submitted via GSC URL Inspection → Request Indexing on publish day. Do not wait for Google to discover it organically — this delays indexing by 1–4 weeks.
- Internal links from the homepage, hub pages (`/youtube-for/`, `/youtube-vs/`), and high-authority blog posts help Googlebot discover new pages faster.
- Sitemap must be kept current and verified in GSC.
- Use `site:sellontube.com` in Google search to audit what's indexed vs what should be.

**Check indexation:** Use GSC URL Inspection for any page before assuming it's indexed.

---

### 2. Organize Site Structure

**Google's rule:** Group related content in directories. URLs with meaningful words help users evaluate relevance in SERPs.

**SellonTube application:**
- Hub → child URL structure is correct: `/youtube-for/coaches`, `/youtube-vs/facebook`
- URLs use descriptive slugs (coaches, saas, law-firms) — correct
- The `/blog/` prefix on all blog posts is correct
- Avoid changing URL structure once pages are indexed — Google equity lives in the URL

**Duplicate content:** Not a penalty on its own. But explicitly set canonicals on every page to prevent Google auto-canonicalizing the wrong version.

---

### 3. Create Quality Content

**Google's rules:**
- Well-organized, grammatically correct, easy to read
- Original — do not copy content in part or entirety
- Regularly updated or removed if outdated
- Match user search behavior — anticipate keyword variations
- Write naturally; Google's systems understand related queries even without exact terminology
- Minimize intrusive ads and interstitials

**SellonTube application:**
- Blog posts must be original and go deep on the topic — no surface-level summaries
- pSEO pages use templated structure but with niche-specific data, copy, and examples. This is acceptable as long as each page has substantive unique content per niche.
- FAQ sections at the bottom of blog posts address keyword variations and help rank for question-based queries
- Do not keyword-stuff. Use the primary keyword naturally 2–4 times; Google handles variations
- Remove or update blog posts that become outdated — don't leave stale content live

**Content length:** Google says there is no magic word count. Write until the topic is fully covered. Do not pad.

---

### 4. Influence Search Results Appearance

**Google's rule:** Title tag + headings → title link in SERP. Meta description → snippet. You control the wording; Google decides whether to use it.

**SellonTube application:**

**Title tags:**
- Unique per page — no two pages should have the same title
- Include the primary keyword near the front
- Include a specific hook or outcome (not generic "YouTube Marketing for X")
- Under 65 characters to avoid truncation
- Do not pad with "| SellOnTube" if it pushes over 65 chars

**Meta descriptions:**
- 150–160 characters
- Open with the most compelling specific claim (number, contrast, outcome)
- Must be unique per page — Google may ignore it and auto-generate if it's too generic
- A good meta description = higher CTR = more traffic without ranking higher
- Google will sometimes rewrite meta descriptions — write them as if Google will use them as-is

**Key insight:** At position 8–10, CTR is 1–3%. A compelling meta description vs a generic one can double CTR without any ranking improvement. This is the fastest traffic lever.

---

### 5. Link Strategy

**Google's rules:**
- Internal links help Googlebot discover new pages
- Anchor text should clearly describe the linked page
- External links to untrustworthy sources should use `nofollow`
- User-generated content (comments, forums) should auto-apply `nofollow`

**SellonTube application:**
- Hub pages (`/youtube-for/`, `/youtube-vs/`) link to all child pages — good
- High-traffic blog posts should link to relevant pSEO pages (e.g., youtube-marketing-roi post links to `/youtube-for/saas`, `/youtube-for/coaches`)
- Cross-link between related blog posts (already doing this — maintain it)
- Anchor text: use descriptive text like "YouTube for coaches" not "click here" or "learn more"
- No user-generated content currently — no action needed

---

### 6. Optimize Images

**Google's rules:**
- Sharp, clear images with sufficient detail
- Place images near relevant text
- Descriptive alt text on every image (explains image for search engines and accessibility)

**SellonTube application:**
- All blog post images must have descriptive alt text — not "image1.jpg" or empty
- Check: `src/assets/images/` — ensure alt text is set in every MDX file using `![alt text](path)`
- Hero images on pSEO pages should have alt text describing the niche context

---

### 7. Promote the Site

**Google's rule:** Promotion through social, community, word of mouth, offline. Do not over-promote (appears manipulative).

**SellonTube application:**
- Each published blog post should be shared on LinkedIn (ICP is there)
- pSEO pages can be shared in niche communities (coach forums, SaaS founder groups) without being spammy — only where genuinely relevant
- Booking link (`cal.com/gautham-8bdvdx/30min`) should be referenced consistently everywhere

---

### 8. What NOT to Worry About (confirmed by Google)

| Myth | Reality |
|------|---------|
| Keywords meta tag | Google ignores it entirely |
| Keyword stuffing | Violates spam policy — never do it |
| Domain keywords | Minimal impact |
| Exact word count | No target exists |
| Heading order (H1 → H2 → H3) | Affects accessibility, not ranking |
| E-E-A-T as ranking factor | It's a quality framework, not a signal |
| Duplicate content penalty | Not penalized; explicit canonicals help Google choose |
| Subdomains vs subdirectories | Business decision, both work |

---

## Baseline Traffic (as of 2026-03-02)

- 90-day sessions: 74
- Organic clicks: 8
- Impressions: ~280
- Traffic mix: 85% direct

---

## Completed SEO Fixes

### P0 — Critical (completed 2026-03-01)
- All redirects for legacy WordPress URLs added to `netlify.toml`
- Canonical tags on all pages
- GSC property URL confirmed: `sc-domain:sellontube.com` (domain property)
- pSEO publishDate timezone fix: `'T00:00:00+05:30'` in 4 template files

### P1 — High Priority (completed 2026-03-01/02)
- CTR fixes on 4 zero-click ranked blog posts (titles + meta descriptions)
- Pricing page title/meta rewrite
- 301 redirect for `/calculator` → `/youtube-roi-calculator`

### P2 — Medium Priority (completed 2026-03-01)
- GSC Removals submitted for `/homes/mobile-app` and `/landing/product` (junk WordPress pages)
- Internal linking audit — cross-links between related blog posts added

### CTR Optimization Round 2 (completed 2026-03-10)
- `/blog/youtube-marketing-roi`: title leads with 3.25x data point, added "Free Calculator" hook
- `/blog/the-youtube-acquisition-engine`: removed "A Complete Blueprint" filler, reframed around customer acquisition angle
- `niches.ts` — fixed 7 pSEO page meta titles from generic "YouTube Marketing for X" pattern to niche-specific hooks with outcomes

---

## Ranking Opportunities (as of 2026-03-10)

| Query | Page | Position | Impressions | Action |
|-------|------|----------|-------------|--------|
| youtube roi | /blog/youtube-marketing-roi | 22 | 9/week | Internal links from homepage + other posts |
| youtube marketing roi | /blog/youtube-marketing-roi | 15–18 | 2–4/week | Content depth (more examples, benchmarks) |
| sell tube | / (homepage) | 11 | 1/week | Brand query — improve homepage title clarity |
| youtube for coaches | /youtube-for/coaches | 3.7 | 9/week | Fixed meta title — monitor CTR |

---

## GSC Legacy URL Log

| URL | Status | Action Taken |
|-----|--------|-------------|
| `/category/youtube-strategy` | 301 → `/blog` | Redirect live in netlify.toml |
| `/homes/mobile-app` | Junk WP page | GSC Removals submitted |
| `/landing/product` | Junk WP page | GSC Removals submitted |
| `/calculator` | 301 → `/youtube-roi-calculator` | Redirect live |

---

## Indexing Queue (submit in GSC after 2026-03-10 deploy)

Pages live but not yet indexed:
- `https://sellontube.com/youtube-for/consultants`
- `https://sellontube.com/youtube-for/b2b-companies`
- `https://sellontube.com/youtube-for/financial-advisors`
- `https://sellontube.com/youtube-for/law-firms`
- `https://sellontube.com/youtube-for/real-estate`
- `https://sellontube.com/youtube-vs/facebook`
- `https://sellontube.com/youtube-vs/instagram`

---

## Technical Health

- Partytown + GA4: using `window.dataLayer.push()` — correct. `transport_type: 'beacon'` must never be used with Partytown.
- Astro config: `forward: ['dataLayer.push']` set in `astro.config.ts` — do not remove
- Static site (Astro) — all pages pre-rendered, fast TTFB, good Core Web Vitals baseline
- Netlify CDN — global edge, no server-side issues
