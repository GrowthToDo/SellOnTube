# B2B YouTube Teardowns — Phase 1 Source Dossier

**Cluster:** `blog/b2b-youtube-teardowns` · **Spec:** `docs/superpowers/specs/2026-07-18-b2b-youtube-teardowns-cluster-design.md`
**Compiled:** 2026-07-18 · **Status:** IN PROGRESS (Phase 1, founder gate pending)

## Data policy (binding)
Every revenue/lead/customer claim needs a linkable public source, quoted + URL. No estimates, no
reconstructed numbers. Observed channel stats dated "as of 2026-07-18". Anything not linkable is
marked **UNVERIFIED — exclude** and does NOT ship. Ship only channels that clear this bar; never pad.

## Live-audit status
- Endpoint `POST /api/channel-audit` (prod) → **verified working** (returns scored JSON; env keys OK).
- **2026-07-18: YouTube API quota exhausted (HTTP 429 `quota_exceeded`).** Batch audit of all
  channels deferred until quota reset (midnight Pacific) or a local run with a fresh `YOUTUBE_API_KEY`.
  Audit scores below are marked PENDING until then.
- WebFetch cannot render YouTube's JS, so live subs / video counts / publish dates are unverifiable
  by the research agents. These come from the audit API (preferred) or a real-browser pass.

---

## Tiiny Host — VERIFIED (with one correction to the PRD)

- **Product / ICP:** web + PDF hosting SaaS ("share a PDF / site as a link"); ICP = anyone needing
  to publish/share a file or micro-site fast (freelancers, SMBs, professionals).
- **YouTube:** channel "Tiiny Tips" · **@tiinytips** · https://www.youtube.com/@tiinytips ·
  UC id UCmcesQ2I9hvEQqhI4CU6wBA (medium confidence; confirmed via oEmbed author on 3 videos).
- **Founder (outreach):** **Elston Baretto** (ex-JP Morgan, solo bootstrapper; launched Jan 2020).
  Confirmed: Indie Bites #80, TechRound interview. (Guard: NOT "Philip Baretto" — extraction error.)

**Acquisition claims:**
- ⚠️ **"$1M ARR" — WEAK/MEDIUM. Do not state as fact.** Rests on one secondary 2026 source
  (Profitable Founder, Apr 2026: https://www.profitablefounder.xyz/blog/how-elston-built-tiny-host-to-1m-a-year).
  Primary founder figures are lower: Starter Story = **$15k MRR (~$180k ARR)**, ~100k monthly
  visitors, ~1,000 paying subs (https://www.starterstory.com/stories/tiiny-host). Indie Bites #80
  ladder: $600 MRR (Mar 2021) → $10k MRR (Mar 2023) (https://indiebites.com/80/transcript).
  → **Hub language:** use the founder-stated $15k MRR, or attribute "$1M ARR" explicitly to the
  Apr 2026 interview. Never present $1M as an established number.
- ✅ **Faceless JTBD tutorial strategy — STRONG.** Founder describes short tutorial videos targeting
  low-KD buyer-intent queries (Indie Bites #80; Profitable Founder). "Nobody searches 'web hosting,'
  they search 'how do I upload a CV.'"
- ✅ **"How to share a PDF as a link" video ranks as top video result in Google — STRONG** (founder's
  own words, Indie Bites #80). Starter Story: that video "30k+ views"; PDF hosting ≈ 40% of revenue.
  (Exact per-video traffic beyond "thousands / 30k+ views" = UNVERIFIED — exclude precise numbers.)

**Growth-era titles (verbatim; JTBD = literal "how to [task]" search queries, no personal brand):**
1. "How to Share a PDF as a Link" — https://www.youtube.com/watch?v=Mo8kKZIMNhg
2. "How to Upload Content to Your Own Web Address" — https://www.youtube.com/watch?v=kWVDCl_2mTY
3. "The Easiest Way to Embed PDFs on a Website" — https://www.youtube.com/watch?v=H5Xg80zHImY
- Publish dates UNVERIFIED (JS-rendered) — exclude.

**Channel snapshot (2026-07-18):** subs / video count / cadence UNVERIFIED via fetch — exclude
until audit API run. (Stale linkable point: 256 subs, Jul 2023 LinkedIn post.)

**Evidence strength:** strategy STRONG · channel identity STRONG · $1M figure WEAK/MEDIUM · live
stats WEAK. **Verdict: QUALIFIES** (strong teardown; correct the revenue framing).

**All sources:** indiebites.com/80/transcript · starterstory.com/stories/tiiny-host ·
profitablefounder.xyz/blog/how-elston-built-tiny-host-to-1m-a-year ·
techround.co.uk/interviews/elston-baretto-founder-ceo-tiiny-host · youtube.com/@tiinytips

---

## Arvow — VERIFIED (STRONG) · framing correction on "the channel"

- **Product / ICP:** Arvow (arvow.com) = AI SEO article writer (SaaS). ICP = founders/marketers doing SEO/content.
- **YouTube brand channel:** **@ArvowAI** · https://www.youtube.com/@ArvowAI · UC6znb1-zW4rfzGfNqDOxq-A
  (confirmed via official RSS author = "Arvow").
- **Growth-engine channel (founder-confirmed 2026-07-18):** **@VascoSEOtips** ·
  https://www.youtube.com/@VascoSEOtips — the personal SEO channel that actually drove Arvow's growth
  (+ siblings Tim / SEO Guru / SEO News). **Anchor the Arvow spoke on @VascoSEOtips**; @ArvowAI is the
  owned brand channel. Resolves the framing correction below.
- **Founders (outreach):** **Vasco Monteiro** (CEO) — LinkedIn /in/vascoamonteiro · X @vascoabm ·
  personal YT channel UCmXOXTLx9vC3KpDg-1XGnqw. Co-founder **Afonso** (last name UNVERIFIED — exclude).

**Acquisition claims:**
- ✅ **"grown purely with YouTube" — STRONG (verbatim).** Companion video VZ1XspToV1E, Vasco:
  *"Most of our users come from YouTube"* / *"This business was grown purely with YouTube."* Founder tweet
  corroborates (https://x.com/vascoabm/status/1932762748472983923).
- ⚠️ **Revenue figure — reconcile $70K vs $79K.** In the *spoken* interview Vasco says **"~$70K in MRR"**,
  **~600 paying clients**, pricing **$99–$700/mo**, "basically a million dollars a year." The Starter Story
  *article* (https://www.starterstory.com/vasco) summarizes it as "$79K/month". Both ≈ $1M ARR. → **Ship
  "~$70K/mo MRR (~$1M/yr), ~600 clients"** (founder's own words); may note "$79K per the article." Never $5M.
- **Playbook (verbatim, for the spoke):** 3 steps — (1) **money-making assets** in 3 buckets: evergreen
  (e.g. "best AI SEO writer"), news-jacking (Google-update videos: spike + subs), viral-for-software;
  (2) **"multiply myself"** — spun up multiple channels (Vasco's SEO Tips, Tim, SEO Guru, SEO News), hired
  camera-comfortable creators off Upwork paid per-performance, expanded to Portuguese/Spanish; (3) **scale
  with YouTube in-feed paid ads** on winners that stagnated organically. **Tracking:** per-video UTM +
  per-video coupon ("tell support Vasco sent me") + signup "which creator sent you?" quiz. **CTA lesson:**
  move CTA to start/middle (not end) → big signup lift; use specific interactive CTAs. **Proof video:**
  "how to make a Wikipedia page" (~2 yrs old) = 1.2M impressions, ~300 views/day, 65% from YouTube search +
  20% from Google search, now surfaced in LLMs. Kit: Loom (HD) + Miro whiteboard + Camtasia + Shure SM7B,
  "just me in my basement."
- ⚠️ **FRAMING CORRECTION — the growth engine was founder-led PERSONAL SEO channels, not @ArvowAI.**
  Vasco: "I did 20-30 minute videos every single day for almost a year" across personal channels
  ("Vasco's SEO Tips", "Tim", "SEO Guru", "SEO News"). So "via YouTube as primary channel" = accurate;
  "via the Arvow brand channel" = overstatement. Teardown angle for Arvow = **founder-led YouTube**.
- ❌ **"$5M ARR" (LinkedIn headline) — UNVERIFIED, exclude.** Self-reported, undated; conflicts with
  the $79K/mo figure. Ship $79K/mo only.
- ❌ **CAUTION:** video "The Best AI Writer for SEO (Arvow)" is a 3rd-party review (author "Nex Gen AI"),
  NOT Arvow's — do not attribute.

**Representative titles (@ArvowAI RSS, verbatim + date + views):**
1. "I Used Claude Code SEO to Grow a SaaS to 34K Visitors/mo ($19K/mo in free traffic)" — watch?v=BjndHJgMsj4 — 2026-06-16 — 1,720 views
2. "How to Rank in AI Search (get cited, mentioned, recommended by LLMs)" — watch?v=gennglPVE-A — 2026-06-02 — 1,222 views
3. "How I Use Claude Code for AI SEO to Rank #1 (in 10 minutes)" — watch?v=seR_VVbrI3k — 2026-07-11 — 862 views
- **Pattern:** outcome + specific number + compressed timeframe in parens ("Rank #1 (in 24 hours)",
  "$19K/mo in free traffic"); tool-hook keywords (Claude Code, AI SEO). Watch-first, product-second.
- Growth-ERA titles from personal channels NOT retrievable from a linkable source this session — UNVERIFIED, exclude.

**Channel snapshot (@ArvowAI, 2026-07-18):** subs UNVERIFIED (exclude); video count ≥15 (RSS floor);
cadence near-daily early-mid July 2026 (10 uploads 07-02→07-17). Confirm exact via audit API.

**Evidence:** revenue STRONG · identity STRONG · live stats MEDIUM. **Verdict: QUALIFIES** (frame as
founder-led YouTube; the "personal SEO channels drove it" nuance is itself a teardown insight).

---

## Bulk Mockup — revenue VERIFIED (STRONG); YouTube-attribution PARTIAL; two-channel structure

- **Product / ICP:** BulkMockup (bulkmockup.com) = Photoshop plugin that batch-replaces smart objects
  to mass-produce mockups. ICP = POD sellers, designers, agencies.
- **Founder (outreach):** **Vikash Kumar Prajapati** — bulkmockup.com/author/vikash · LinkedIn
  /in/vikash-kumar-prajapati-00aa8417 · X @vkpajeet.
- **Two channels (same product/founder):**
  - **@BulkMockup** — https://www.youtube.com/@BulkMockup (brand channel; oEmbed-confirmed).
  - **@YouShouldAutomateThat** — https://www.youtube.com/@YouShouldAutomateThat ·
    UCxataERAz13om-Z2c2dqRaA (higher-cadence tutorial funnel, wired to you-should-automate-that.com
    which sells the same plugin). **This is where the active JTBD content lives.**
  - ⚠️ **DECISION NEEDED: which channel anchors the Arvow-style teardown?** (Recommend
    @YouShouldAutomateThat = the real funnel, but confirm.)

**Acquisition claims:**
- ✅ **"$12K/month" — STRONG.** Starter Story episode "How I Grew My Plugin to $12K/Month" (Spotify
  https://open.spotify.com/episode/3OKeKCazbAFPOycLLgjMJ9 ; YT https://www.youtube.com/watch?v=W48emwbUlUE).
- ✅ **"driven specifically by YouTube" — NOW STRONG (upgraded 2026-07-18 from primary transcript).**
  Starter Story video W48emwbUlUE, Vikash verbatim: *"Customer find us through YouTube. They purchase
  the Photoshop plug-in… and they pay us monthly."* / *"I create YouTube videos that solve longtail
  customer problem… A customer watches that video, he finds that solution, he trusts me and then he
  purchases the product."* The earlier "inferred" flag is RESOLVED — YouTube-as-acquisition is founder-stated.
- **Video-ROI examples (verbatim):** "split the design manually/automatically in Photoshop" video =
  370 views in 4 months → **3 customers × $15/mo = $45 MRR** (⚠️ transcript says "$345 MR" — misspeak;
  ship $45). Second video = 12,000 views in 6 months → $213 total. Insight: **low views, high conversion.**
- **Google-search overlap (verbatim):** *"22% views on our YouTube channel comes from Google search"* —
  YouTube videos optimized with on-page SEO (keyword in title + description + first 30s of transcript)
  rank inside Google SERPs. Same thesis as Arvow.

**Growth-era titles (verified via RSS, verbatim + date):**
1. "Bulk Logo Mockup Creation In Photoshop (Automation Tutorial)" — watch?v=DY6KBg5wsm0 — 2026-05-08
2. "This Photoshop Plugin Automates Bulk Mockup Image Creation" — watch?v=BAik2goDp5s — 2026-05-15
3. "How To Bulk-Create Package Design Mockup Images (Photoshop)" — watch?v=XSd53N2QNY0 — 2026-05-25
- **Pattern:** verb-first "How To [automate/bulk-create] mockups in Photoshop", segmented by POD niche
  (t-shirt, wall art, logo, packaging). Solution-aware search capture, not entertainment.

**Channel snapshot (2026-07-18):** @YouShouldAutomateThat actively uploading (several/week late-Jun→early-Jul);
subs/video counts UNVERIFIED via fetch (exclude; ignore the "~6.9K/140+" AI snippet — not linkable).

**Evidence:** revenue STRONG · YouTube-attribution **STRONG (verbatim)** · identity STRONG (2-channel) · stats WEAK.
**Verdict: QUALIFIES (upgraded)** — now a clean YouTube-acquisition case on primary founder testimony.
Remaining decision: which channel anchors the spoke (@BulkMockup vs @YouShouldAutomateThat).

**Content-flywheel playbook (verbatim, for the spoke):** fuel = customer pain. 3 steps — (1) **collect
pain** via 4 touchpoints: communities (read silently, never sell), onboarding emails (offer custom
tutorials), support tickets (record a custom Loom per ticket → 1,500+ recorded videos over 3 yrs, 100+
5-star reviews), YouTube comments (high-comment/low-view = unresolved pain); (2) **create content** from
those real conversations; (3) **distribute** with an SEO angle (rank on Google via video). Background:
Upwork Photoshop freelancer → hacked a JS script (learned JS in a day) → 1,800 mockups in 30 min → $300 →
productized. **Borumi cross-fact:** Vikash names Borumi as the *screen recorder he uses to make the YouTube
tutorials* — a tool mention, NOT a YouTube-acquisition source for Borumi itself.

---

## Scalelist — NEW, STRONG (<50k subs)
- **Product / ICP:** AI sales-lead database — Chrome extension that extracts + enriches LinkedIn Sales
  Navigator leads (emails, phones). ICP = SDRs / B2B lead-gen teams.
- **YouTube:** "Scalelist" · UCNfnhQMvYOxDI-_4IgL-T-Q · https://www.youtube.com/channel/UCNfnhQMvYOxDI-_4IgL-T-Q
  (probable handle @scalelist). Screenshare lead-gen tutorials, heavy Claude/AI angle.
- **Acquisition claim (verbatim):** founder **Youssef El Kaddioui**: *"YouTube started picking up after a
  few months… It now brings 50% of our paid users."* (breakdown: YouTube ~50%, SEO ~15%, rest Chrome Web
  Store / referrals / LinkedIn). Source: https://pulsehero.substack.com/p/saas-founder-interview-how-youssef
- **Evidence:** STRONG (explicit first-party % attribution). Subs: ~1,260 after 8 videos (early 2024),
  well under 50k. Motion: self-serve/prosumer B2B sales tooling. **Verdict: QUALIFIES** (adds sales-tooling
  niche + a genuinely tiny channel).

## LocalRank (Jacky Chou / Indexsy) — NEW, STRONG
- **Product / ICP:** AI local-SEO software (Google Business Profile rank-grid tracking + automation),
  LocalRank.so. ICP = local-SEO agencies + local businesses ("500+ agencies").
- **YouTube:** "Jacky Chou from Indexsy" · UCS1LT_WoYAIHW5KcUNxXYEw (brand @indexsy). Daily build-in-public.
- **Acquisition claim (verbatim):** *"Videos with relatively low view counts drive significantly more
  product signups than posts that get tens of thousands of impressions on other platforms."* LocalRank
  launched at *"nearly $20k MRR right out of the gate"* off the pre-built YouTube audience; his X post:
  *"Posted a YouTube video every day… launched Localrank.so 2 days ago… already at $2k MRR."* Sources:
  indiehackers.com/post/tech/…-G2t49DpfChnjJsTqwRsB · https://x.com/indexsy/status/1901370127054176629
- **Evidence:** STRONG (first-party, IH interview + own tweets). Subs unconfirmed → cannot certify <50k.
  Motion: prosumer/indie build-in-public; portfolio/personal-brand channel (also promotes courses) but the
  SaaS→YouTube link is explicit. **Verdict: QUALIFIES** (local-SEO vertical + build-in-public archetype).

## Tochat.be / Chatwith — NEW, MEDIUM
- **Product / ICP:** WhatsApp CRM / click-to-chat widget + forms + multi-agent inbox for websites. ICP =
  micro/small **service businesses** on WhatsApp (real estate, auto, education, restaurants, beauty).
- **YouTube:** "Click to Chat – Link to WhatsApp – Chatwith" · https://www.youtube.com/@LinktoWhatsApp
  (weekly tutorial/feature/case-study videos; oEmbed-confirmed).
- **Acquisition claim (verbatim):** CEO **César Martín**: *"we found a great channel in YouTube, where we
  have more than 500,000 views per month"* (alongside ~5,000 signups/mo, 17,000 premium users). Source:
  https://pulsehero.substack.com/p/saas-leader-interview-inside-the
- **Evidence:** MEDIUM — names YouTube as "a great channel" in the growth narrative but doesn't isolate a
  YouTube signup % (co-mingled with AppSumo + SEO). Subs unconfirmed. Motion: self-serve SMB, non-US.
  **Verdict: QUALIFIES (medium)** — diversity: WhatsApp/SMB-comms vertical, AppSumo-driven, non-US.

## Borumi — CUT
- **Reason:** no linkable public source crediting the YouTube channel for customer acquisition/growth.
  Founder **Federico Terzi**; product borumi.com; channel **@BorumiHQ** · UCiSrhDjAkXZ2j64euR0aqng (exists).
  Only recurring YouTube story = an **AEO / AI-Overview** anecdote (Google pulled YouTube subtitles into an
  AI Overview; he fixed via correct SRTs) — that's *getting cited by AI*, NOT acquisition. Stretching it
  would violate §9. **Option:** repurpose Borumi as an AEO/AI-Overview example in a DIFFERENT cluster, not here.

## Considered but rejected (source credits a non-YouTube channel or link not first-party)
Ahrefs (YouTube = secondary distribution) · tl;dv (Product Hunt/TikTok/IG/SEO) · Apollo.io (branded search/WOM) ·
Wistia (brand affinity, anti-YouTube framing) · eWebinar (SEO/LinkedIn/podcast) · FeedHive (generic advice only) ·
Salesflare (organic content/WOM/events) · **Sam Dunning/Breaking B2B** (genuine sales-assisted B2B but only
second-hand source + it's a service not SaaS — revisit if a first-party YouTube quote surfaces) · Tykr (B2C) ·
Boot.dev (paid creator sponsorships, not organic).

---

## Phase 1 status (2026-07-18) — DOSSIER COMPLETE, FOUNDER GATE
- ✅ **6 channels qualify** (5 STRONG + 1 MEDIUM): Arvow, Tiiny Host, Bulk Mockup, Scalelist, LocalRank,
  Tochat.be. Target was 8-10 → short by 2-4, per "ship only what passes / never pad."
- ❌ **Borumi CUT** (no acquisition source).
- ⏳ **Live audit scores: ALL PENDING** — YouTube API quota still exhausted (re-probed @VascoSEOtips
  2026-07-18 → HTTP 429). Resets midnight Pacific, or run `netlify dev` with a fresh `YOUTUBE_API_KEY`.
  Handles ready: @VascoSEOtips (Arvow), @tiinytips, @BulkMockup / @YouShouldAutomateThat, @scalelist,
  @indexsy, @LinktoWhatsApp.
- 🔎 **Gap note:** "2-3 classic sales-assisted B2B" target unmet — such firms publicly credit SEO/outbound/
  WOM, not organic YouTube. Highest-odds top-up: first-party Sam Dunning quote + more Pulse Hero / Starter
  Story interviews (the format that surfaced Scalelist + Tochat.be).
- **Decisions LOCKED (2026-07-18):** (1) **Ship the 6** — no more discovery this round (top up in
  quarterly refresh). (2) **Borumi CUT.** (3) **Arvow spoke anchor = @VascoSEOtips.** (4) **Bulk Mockup
  spoke anchor = @BulkMockup** (brand channel, cleaner slug/name-match). (5) **Audit blocked on Gemini
  key** — prod AND local `.env` GEMINI_API_KEY both return HTTP 429 (same exhausted key; YouTube API is
  fine). Fix = wire a billing-enabled Gemini key into the key slot, or wait for daily free-tier reset
  (~midnight PT), then batch-audit the 6. NOT on the Phase 2/3 critical path — fold scores in before Phase 4 draft.
- **Final 6-channel roster + spoke anchors:** Arvow → @VascoSEOtips · Tiiny Host → @tiinytips · Bulk Mockup
  → @BulkMockup · Scalelist → @scalelist · LocalRank → @indexsy · Tochat.be → @LinktoWhatsApp.

---

## Live audit scores (SellOnTube channel-audit tool, run 2026-07-18)
Real scores from `/tools/youtube-channel-audit` logic (YouTube last-10-uploads → Gemini 4-dim score),
run locally with the founder's billing-enabled Gemini key. Grades CURRENT channel execution, not the
growth era. Dated "as of July 2026".

| Channel | Handle audited | Overall | Title | Description | Consistency | SEO |
|---|---|---|---|---|---|---|
| Scalelist | UCNfnhQMvYOxDI-_4IgL-T-Q | **90** | 22 | 24 | 25 | 19 |
| Tiiny Host | @tiinytips | **81** | 21 | 18 | 20 | 22 |
| LocalRank | @indexsy (UCS1LT_WoYAIHW5KcUNxXYEw) | **74** | 18 | 15 | 22 | 19 |
| Bulk Mockup | @BulkMockup | **73** | 20 | 18 | 16 | 19 |
| Arvow | @VascoSEOtips (Vasco's SEO Tips) | **60** | 20 | 10 | 18 | 12 |
| Chatwith | @LinktoWhatsApp | **55** | 14 | 8 | 23 | 10 |

Note: Arvow scores lower today because the growth-era personal channels differ from current uploads
(the score is a present-day snapshot, stated as such in the hub + spoke). Chatwith lowest, consistent
with its MEDIUM evidence rating. Filled into hub table + all 6 per-channel lines + Arvow spoke breakdown.
