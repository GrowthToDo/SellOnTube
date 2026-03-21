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
- Build order and full specs: `microtool-strategy.md`
- Tools 1–4: pure client-side JS (fast to ship, no backend cost)
- Tools 5–7: Netlify Functions + Gemini Flash API (see `agents/08-microtool-builder.md` for the mandatory Gemini Flash integration pattern)

### C. Blog — 1 post/week (hard ceiling: 2/week)
- **Priority cluster: `youtube_seo`** — validated by DataForSEO (March 2026). 8 winnable keywords, top volume 4,400/month, KD range 0–27. Start every new post here before touching other clusters.
- All keyword selection must use `sot_master.csv` filtered to `tier = winnable` (KD ≤ 30). Never target `avoid` or `stretch` tier keywords until the site has measurable domain authority. See "Keyword Tier System" below.
- Next post target: "youtube seo tools" (4,400 vol, KD 23) — highest volume winnable keyword in the CSV
- 6 topical clusters mapped in `microtool-strategy.md` — Cluster 3 (YouTube SEO) is now Priority 1
- Each post must target a specific validated keyword and follow the Content Quality Playbook
- Blog + microtool tandem rule: whenever a blog post targets the `youtube_seo` or `youtube_automation` cluster, it must link to an existing or upcoming tool. The tool and post should ideally launch the same week.

---

Last updated: 2026-03-21

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

**Updated 2026-03-21 — DataForSEO intelligence applied.**

Before writing any new post, check the keyword in `sot_master.csv`:
1. `tier = winnable` — mandatory. KD ≤ 30 is the only realistic range for SellonTube until domain authority grows.
2. `status = not-started` — never duplicate a live or planned post.
3. Sort by `priority_score` — the score now uses live DataForSEO volume and real KD, not GKP estimates.

**Keywords now parked (previously assumed high-value, now avoid/stretch):**
- "youtube seo" (KD 40), "youtube marketing" (KD 35), "youtube video seo" (KD 41) — revisit at 6–12 months
- "check youtube channel" (KD 49), "set up company youtube channel" (KD 53) — avoid entirely
- "youtube marketing platform" (KD 62), "youtube marketing for beginners" (KD 63) — avoid entirely
- All of the above had inflated GKP volumes. Real volume + high KD = not winnable for a new site.

**Priority cluster right now: `youtube_seo`** — 8 winnable not-started keywords, top volume 4,400/month. Write this cluster out fully before moving to the next.

**Keyword clusters and post list:** See `microtool-strategy.md` Part 2 — Cluster 3 (YouTube SEO) is now Priority 1.

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

See `content-playbook.md` Section 7 for recommended channels, repurposing strategy, and the underutilized channel mapping framework. Pick 2 channels and commit — don't spread thin.

---

### Lever 7 — Technical fixes still outstanding *(small but real impact)*

From the audit, several P1/P2 items remain unresolved. These are not traffic drivers themselves but they affect crawl efficiency and E-E-A-T signals.

| Item | Impact | Status |
|---|---|---|
| Author schema missing `url`/`sameAs` in BlogPosting | E-E-A-T signal | **Fixed** — LinkedIn URL added to BlogPosting schema |
| `lastmod` dates missing from sitemap | Crawl efficiency | **Fixed** — `lastmod: new Date()` added to sitemap config |

---

---

## Keyword Tier System (added 2026-03-21)

`sot_master.csv` now has a `tier` column based on real DataForSEO keyword difficulty (KD), not GKP estimates:

| Tier | KD range | What to do |
|---|---|---|
| `winnable` | ≤ 30 | Write now. 106 keywords. These are the only blog targets for the current site. |
| `stretch` | 31–45 | Revisit at 6–12 months when site has more authority. 66 keywords. |
| `avoid` | > 45 | Do not target. 123 keywords. Many had inflated GKP volumes that made them look attractive. |
| `pseo` | n/a | pSEO pages — zero GKP volume is intentional. Topical authority play, not volume play. |

**Key insight:** 79% of keywords in the CSV had GKP volumes that overstated reality by 30%+. The volume scores were GKP bucketing artefacts. DataForSEO live data corrects this. Trust `search_volume_live` and `kd_real` — not `search_volume` or `keyword_difficulty`.

**Refresh schedule:** Re-run `scripts/update_keyword_tiers.py` and `scripts/refresh_keyword_volumes.py` quarterly, or whenever new keywords are added to the CSV.

---

## 10-Day Sprint Plan (Mar 21–30, 2026)

**Goal:** Build domain authority through a coordinated tool launch + backlink sprint.

### The Three Tasks (in order)

**1. Build YouTube SEO Checker** (`/tools/youtube-seo-checker`) — Mar 21–25
- Client-side JS only. User pastes a video title + description; tool scores it on 5 SEO dimensions and outputs a 0–100 score with per-dimension fixes.
- All feedback framed around ranking for buyer-intent queries, not views.
- Target keywords: "youtube seo tools" (4,400 vol, KD 23), "best tools for youtube seo" (90 vol, KD 12), "youtube seo software" (140 vol, KD 27).

**2. Publish blog post** — Mar 26
- Title: "Best YouTube SEO Tools for Business Channels (2026)"
- Target keyword: "youtube seo tools" (4,400 vol, KD 23)
- Links to the YouTube SEO Checker tool. Cross-links to the YouTube SEO Guide pillar (Mar 18).
- Must be live before the PH launch so anyone who clicks through lands on supporting content.

**3. Launch on Product Hunt + multi-platform backlink sprint** — Mar 30 (Monday)
- Submit to Product Hunt at 12:01am PST.
- Same day: submit to Hacker News ("Show HN"), BetaList, There's An AI For That, Peerlist.
- After launch: submit tool page URL to GSC for indexing.

### Why This Sequence Matters for Domain Authority

The goal of the PH launch is not upvotes — it is backlinks. Each platform gives a guaranteed high-DA backlink:

| Platform | DR | Notes |
|---|---|---|
| Product Hunt | ~93 | Guaranteed listing backlink |
| Hacker News | ~93 | "Show HN" post |
| BetaList | ~70 | Free listing |
| There's An AI For That | ~60 | Submit as AI tool (uses Gemini scoring) |
| Peerlist | ~60 | Growing indie/SaaS community |

Secondary benefit: PH launches get picked up by newsletters (TLDR, Ben's Bites, etc.) — each coverage = additional DR 50–80+ backlink with zero extra effort.

### Day-by-Day

| Date | Action |
|---|---|
| Mar 21–23 | Build YouTube SEO Checker (client-side JS, 5 scoring dimensions) |
| Mar 24–25 | Polish UI, write tool page copy with full on-page SEO |
| Mar 26 | Write + publish blog post — links to the tool |
| Mar 27–28 | Prepare PH listing: headline, tagline, description, thumbnail/GIF, first comment |
| Mar 29 | Schedule PH submission for 12:01am PST March 30 |
| Mar 30 | Launch: PH + HN Show HN + BetaList + TAAFT + Peerlist |
| Mar 30 | Submit tool page URL to GSC for indexing |

---

### Next 4 Weeks — Blog Cadence After the Sprint

| Week | Post | Target keyword | Vol | KD |
|---|---|---|---|---|
| Mar 28 | Best YouTube SEO Tools for Business Channels | youtube seo tools | 4,400 | 23 |
| Apr 4 | YouTube SEO Services: What to Look For (And What to Avoid) | youtube seo services | 1,600 | 10 |
| Apr 11 | YouTube SEO Software: Do You Actually Need It? | youtube seo software | 140 | 27 |
| Apr 18 | How to Write YouTube Titles That Rank for Buyer-Intent Queries | (Cluster 3 supporting) | — | — |

After Cluster 3 (YouTube SEO) is covered: move to Cluster 2 (topic research — 2 remaining keywords), then Cluster 1 (economics — 3 remaining keywords).

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
