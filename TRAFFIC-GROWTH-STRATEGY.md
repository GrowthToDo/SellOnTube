# SellonTube — Traffic Growth Strategy

## Mission
**Increase high-quality organic traffic to sellontube.com. Google-safe. No shortcuts.**

High-quality = B2B founders, SaaS operators, and service businesses actively exploring YouTube as a customer acquisition and lead generation channel.

## The Three Pillars

### A. pSEO — 50 pages (in progress)
- 29 "YouTube For [niche]" pages + 20 "YouTube Vs [channel]" pages + hub pages
- Publishing cadence: ~4 pages/week on drip schedule (publishDate-gated)
- Each page goes live on its scheduled date — no bulk publishing
- Angle: YouTube as a customer acquisition channel for that specific niche/comparison
- Action on publish: submit each new page for GSC indexing same day

### B. Microtools — 7 tools planned
- Free tools targeting YouTube-for-business searches
- **Positioning angle: YouTube for business, acquisition, and lead generation — NOT for creators**
- This gap is unoccupied by all existing tools (VidIQ, TubeBuddy, Kapwing all target creators)
- Build order and full specs: `MICROTOOLS-BLOG-STRATEGY.md`
- Tools 1–4: pure client-side JS (fast to ship, no backend cost)
- Tools 5–7: Netlify Functions + Claude API

### C. Blog — regular cadence (TBD)
- Target: mix of high-volume keywords (reach) and high-intent keywords (conversion)
- 6 topical clusters aligned to the site's theme — see `MICROTOOLS-BLOG-STRATEGY.md`
- Publishing cadence: to be decided
- Each post must target a specific validated keyword and follow the Content Quality Playbook

---

Last updated: 2026-03-02

---

## Growth Levers, Prioritised

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

Before writing any new post, validate the keyword:
- Is there actual search demand? (Use GSC impressions data over time as proxy; use Google Autocomplete and related searches for intent signals)
- Is the intent commercial or informational? (Prefer informational that leads to commercial intent)
- Does it fit the ICP? (B2B SaaS founders, operators at SMBs with $1M+ revenue, businesses that sell high-ticket services)

**Keyword clusters and post list:** See `MICROTOOLS-BLOG-STRATEGY.md` Part 2 — 6 clusters fully mapped with post titles.

**Cadence:** 1 post/week, hard ceiling 2/week. Quality over quantity — each post must target a specific, validated keyword and meet the Content Quality Playbook standard.

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

Google's Helpful Content system rewards real brand signals — direct searches, links from real sites, social mentions. Distribution feeds into Google's trust model, not just traffic volume.

See `SellonTube-Content-Quality-Playbook.md` Section 7 for recommended channels, repurposing strategy, and the underutilized channel mapping framework. Pick 2 channels and commit — don't spread thin.

---

### Lever 7 — Technical fixes still outstanding *(small but real impact)*

From the audit, several P1/P2 items remain unresolved. These are not traffic drivers themselves but they affect crawl efficiency and E-E-A-T signals.

| Item | Impact | Status |
|---|---|---|
| Author schema missing `url`/`sameAs` in BlogPosting | E-E-A-T signal | **Fixed** — LinkedIn URL added to BlogPosting schema |
| `lastmod` dates missing from sitemap | Crawl efficiency | **Fixed** — `lastmod: new Date()` added to sitemap config |

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
