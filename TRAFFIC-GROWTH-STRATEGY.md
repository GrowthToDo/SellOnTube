# SellonTube — Traffic Growth Strategy
**Mission: Increase high-quality, Google-safe organic traffic to sellontube.com.**
*High-quality = B2B founders, SaaS operators, and service businesses actively exploring YouTube as a customer acquisition channel.*

Last updated: 2026-03-02

---

## Current Baseline (90-day snapshot, as of 2026-03-02)

| Metric | Value |
|---|---|
| Total sessions (90d) | 74 |
| Organic search sessions | 6 (8.1%) |
| Direct sessions | 63 (85.1%) |
| Organic search clicks (GSC) | 8 |
| Total GSC impressions | ~280 |
| pSEO pages live | 0 (drip starts Mar 2) |
| Blog posts indexed | ~6 |

**Diagnosis:** The site is essentially invisible. Traffic is almost entirely direct (team/founder). The SEO foundation is solid, but there is almost no content volume and near-zero backlinks — the two things Google needs before it trusts a site.

---

## What the Data Shows

### Pages ranking but getting zero clicks

These pages have Google attention but are losing the click. The title or snippet is not compelling enough.

| Page | Impressions | Avg Position | Clicks |
|---|---|---|---|
| `/blog/youtube-vs-blog-shopify-app-case-study` | 33 | 7.1 | 0 |
| `/pricing` | 27 | 2.9 | 0 |
| `/blog/youtube-marketing-roi` | 16 | 3.8 | 0 |
| `/blog/search-intent-youtube-seo-power` | 6 | 4.7 | 0 |
| `/blog/why-most-youtube-strategies-fail` | 3 | 3.7 | 0 |

**Root cause:** Position 3–7 with 0 clicks = the SERP snippet (title + meta description) is not earning the click even when the ranking is there. This is the fastest-payoff fix in the whole plan — no new content needed.

### Legacy URLs wasting crawl equity

These are WordPress artifact URLs still indexed in Google. They generate impressions for junk or misdirected queries. They dilute the site's topical authority signal.

| URL | Impressions | Avg Position | Action |
|---|---|---|---|
| `/search-intent-youtube-seo-power` | 23 | 35.2 | 301 → `/blog/search-intent-youtube-seo-power` |
| `/landing/product` | 9 | 4.6 | GSC Removals (WordPress junk) |
| `/category/youtube-strategy` | 8 | 4.0 | Check if redirect needed or GSC removal |
| `/homes/mobile-app` | 7 | 3.3 | GSC Removals (WordPress junk) |
| `/the-youtube-acquisition-engine` | 3 | 7.0 | 301 → `/blog/the-youtube-acquisition-engine` |

### What is not showing in GSC yet

- pSEO pages (29 YouTube For + 20 YouTube Vs) — none visible yet (drip just starting)
- ROI calculator — showing only on `/calculator` redirect, not the canonical
- Most blog posts — indexed but no impressions = targeting keywords with too little search volume or too high competition

---

## Growth Levers, Prioritised

### Lever 1 — Fix CTR on pages already ranking *(highest ROI, zero new content needed)*

For every page with >5 impressions and 0 clicks: rewrite the title tag and meta description.
Goals:
- Title: primary keyword in first 3 words, specific benefit or number, under 60 chars
- Meta: 120–155 chars, one specific claim, one implicit question the reader is asking
- No filler openers ("The Hidden Power of...", "Why Most...", "A guide to...")

**Immediate targets:**
1. `/blog/youtube-vs-blog-shopify-app-case-study` (33 impressions, pos 7)
2. `/pricing` (27 impressions, pos 2.9) — title currently "Pricing | SellOnTube"
3. `/blog/youtube-marketing-roi` (16 impressions, pos 3.8)
4. `/blog/search-intent-youtube-seo-power` (6 impressions, pos 4.7)

---

### Lever 2 — Clean up legacy index pollution *(1-2 hours, frees crawl budget)*

1. Add 301 redirects in `netlify.toml` for old blog post URLs that moved:
   - `/search-intent-youtube-seo-power` → `/blog/search-intent-youtube-seo-power`
   - `/the-youtube-acquisition-engine` → `/blog/the-youtube-acquisition-engine`
2. Use GSC Removals tool to kill pure WordPress junk pages:
   - `/homes/mobile-app`
   - `/landing/product`
3. Investigate `/category/youtube-strategy` — if it has no relevant equity, remove; if it does, redirect to `/blog`

---

### Lever 3 — pSEO drip execution *(mid-term, volume play)*

49 pages (29 YouTube For + 20 YouTube Vs) are built and scheduled on a drip. These are the site's primary volume bet.

Rules:
- Never publish ahead of schedule — the drip spacing exists specifically to avoid a templated-content flood flag
- As each page goes live, submit for indexing via GSC "Request Indexing"
- Monitor each page's first 30 days in GSC — if impressions = 0 after 3 weeks, the page likely needs a content depth improvement
- Each page needs 400–600+ words of unique, niche-specific copy (not just templated vars)

**Action:** Set a recurring weekly task to submit that week's newly-live pSEO pages for indexing in GSC.

---

### Lever 4 — Blog: publish toward keyword clusters with real search demand *(mid-term)*

Current blog posts are ranking but for low-volume or vague queries. Before writing any new post, validate the keyword:
- Is there actual search demand? (Use GSC impressions data over time as proxy; use Google Autocomplete and related searches for intent signals)
- Is the intent commercial or informational? (Prefer informational that leads to commercial intent — readers who are educating themselves before buying)
- Does it fit the ICP? (B2B SaaS founders, operators at SMBs with $1M+ revenue, businesses that sell high-ticket services)

**Keyword clusters to target (based on site positioning):**
- `youtube for [niche]` long-tail — covered by pSEO
- `youtube vs [channel]` comparisons — covered by pSEO
- YouTube B2B marketing strategy (informational, high-intent)
- YouTube ROI / payback period (calculator page, supporting posts)
- Faceless YouTube / YouTube without recording (brand differentiator)
- Case studies: real numbers from YouTube customer acquisition

**Cadence:** 2 posts/month minimum. Quality over quantity — each post must target a specific, validated keyword and meet the Content Quality Playbook standard.

---

### Lever 5 — Backlinks *(highest impact, slowest to build)*

This is the #1 constraint on organic growth. Without backlinks, Google has little reason to trust a new site even with excellent content. No backlink strategy = growth ceiling.

**Tactics that work within Google's guidelines:**

1. **Digital PR / data-driven content** — Publish one piece of original research (e.g., "We analysed 100 B2B YouTube channels — here's what actually drives leads"). Pitch to marketing newsletters (Demand Curve, Marketing Examined, The Hustle, etc.). One placement = multiple backlinks.

2. **Guest posts on B2B marketing publications** — Write one guest post per month on a site with DR > 40 in the B2B/SaaS marketing space. Pitch the brand angle: "YouTube customer acquisition for B2B companies that don't want to record themselves." This is genuinely differentiated.

3. **Tool / calculator embed** — The YouTube ROI calculator is a linkable asset. Pitch it to marketing newsletters and blogs as a free tool to embed or reference.

4. **Podcast appearances** — Founder goes on B2B marketing podcasts. Hosts typically link to guest sites from show notes. Low effort for the site, high trust signal for Google.

5. **Community mentions** — Answer questions in relevant communities (Reddit r/entrepreneur, r/SaaS, Indie Hackers, LinkedIn posts) with genuine depth. Not spam — become the trusted voice on this specific topic. Some of these turn into backlinks.

6. **Partnership / integration mentions** — If any tools are used in the service workflow, reach out to those tools for mutual mention or a case study spot on their site.

**Note:** Never buy links. Never do link exchanges. Never use PBNs. These are high-risk and will destroy the site's standing with Google's latest link spam updates.

---

### Lever 6 — Distribution (non-SEO traffic that builds brand authority) *(ongoing)*

Google's Helpful Content system rewards sites with real brand signals — people searching for you directly, links from real sites, social mentions. Distribution is not just about traffic, it feeds into Google's trust model.

**Recommended channels (pick 2, commit to them):**

1. **LinkedIn** — The ICP (B2B founders, operators) is heavily on LinkedIn. Short-form posts with specific insights from the blog or case studies. Link back to site in comments or first reply (not in post body — LinkedIn suppresses outbound links in posts).

2. **Newsletter** — A short weekly/biweekly email. Even 200 subscribers is a meaningful brand signal if they open and click. It also becomes a launch amplifier for new blog posts and calculator improvements.

3. **YouTube** (ironic, but appropriate) — Short-form clips or video essays about B2B YouTube strategy. The brand itself should be demonstrating what it sells. Even 3–5 videos builds authority and earns backlinks.

---

### Lever 7 — Technical fixes still outstanding *(small but real impact)*

From the audit, several P1/P2 items remain unresolved. These are not traffic drivers themselves but they affect crawl efficiency and E-E-A-T signals.

| Item | Impact | Status |
|---|---|---|
| Pricing page title: "Pricing | SellOnTube" → "YouTube Acquisition Pricing \| SellOnTube" | CTR on brand searches | Pending |
| Author schema missing `url`/`sameAs` in BlogPosting | E-E-A-T signal | Pending |
| `sameAs` in Org schema missing YouTube + LinkedIn | E-E-A-T signal | Pending |
| Blog hero image alt = `post.excerpt` (wrong) | Crawl quality | Pending |
| `lastmod` dates missing from sitemap | Crawl efficiency | Pending |

---

## Execution Order

**Week 1 (now):**
- [ ] Fix CTR: rewrite titles + meta descriptions for the 4 zero-click ranked pages
- [ ] Fix legacy redirects: add 301s for moved blog posts in `netlify.toml`
- [ ] Fix pricing page title tag
- [ ] Submit `/blog/youtube-vs-blog-shopify-app-case-study` for GSC indexing (highest impressions)

**Week 2:**
- [ ] GSC Removals: request removal of `/homes/mobile-app` and `/landing/product`
- [ ] Fix author schema (`url` + `sameAs` for Gautham)
- [ ] Fix `sameAs` in Org schema (add YouTube + LinkedIn)
- [ ] Start pSEO GSC submission routine as pages drip live

**Month 1:**
- [ ] Publish 2 new blog posts targeting validated keywords
- [ ] Identify 3 B2B marketing publications for guest post outreach
- [ ] Publish one original data piece (linkable asset)
- [ ] Set up newsletter (even just a Beehiiv or ConvertKit free tier)

**Month 2–3:**
- [ ] 2+ guest posts published and live
- [ ] First pSEO pages accumulating impressions — assess which need content depth improvements
- [ ] ROI calculator: add embed code, pitch to 5 newsletters as a free tool
- [ ] LinkedIn posting cadence established (3x/week)

---

## What NOT to Do

- No bulk pSEO publishing — the drip schedule is intentional
- No link buying, exchanges, or PBNs
- No AI-mass-generated content posted directly without editing — Google's SpamBrain flags thin AI content
- No keyword stuffing in titles, headings, or body copy
- No chasing trending topics unrelated to the ICP
- No social media volume without quality — 3 great LinkedIn posts beats 20 mediocre ones

---

## How We Measure Progress

Check these weekly/monthly:
- GSC: impressions trending up (signal Google is finding more content)
- GSC: CTR on targeted pages (did the snippet rewrites work?)
- GA4: organic search sessions (actual traffic arriving)
- GSC: new pages appearing in impressions as pSEO drips live
- Backlink count in any backlink tool (Ahrefs, SEMrush, or free Moz alternative)

**6-month target (conservative):** 500+ organic sessions/month, 20+ GSC pages with impressions, 3+ backlinks from DR40+ domains.

**6-month target (optimistic):** 2,000+ organic sessions/month if pSEO + blog velocity + 1–2 backlink wins land.
