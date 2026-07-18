# B2B YouTube Teardowns — Phase 2 Keyword Map (proposal, founder gate)

**Cluster:** `blog/b2b-youtube-teardowns` · **Date:** 2026-07-18 · **Source:** `research/keywords/sot_master.csv` (SSOT)
**Status:** PROPOSAL — live SERP validation (browse) deferred (see §4); pending founder keyword lock.

## 1. Hub keywords (winnable pivot — SSOT-grounded)

| Role | Keyword | Vol | KD | Tier | Note |
|---|---|---|---|---|---|
| **Primary** | youtube marketing case study | 500 | **0** | winnable | Exact intent match; wide open. Drives H1/title/slug. |
| Secondary | youtube for b2b | 500 | 11 | winnable | Supporting H2s / body. |
| Secondary | b2b youtube | 500 | 11 | winnable | Supporting. |
| Tail (body only) | best b2b youtube channels · b2b youtube channels · youtube business case study | 50 | 0 | avoid | Use as natural body phrasing / listy H2s; NOT the title (vol 50). |

- **Hub slug (proposal):** `/blog/youtube-marketing-case-studies` (short, keyword-bearing, no date).
- **Title formula (PRD §7), candidates generated in Phase 3** — anchor on "case studies / examples with
  receipts", numbered, year. Primary keyword carried in H1 naturally.

## 2. Cannibalization guard (binding)
Live post `src/data/post/youtube-marketing-b2b.md` ("YouTube Marketing for B2B: Generate Leads") already
owns the **`youtube for b2b` / `b2b youtube`** lead-gen intent. → Hub **leads with the distinct
case-study intent** (`youtube marketing case study`), uses `youtube for b2b` only as a secondary, and
**cross-links to** that post rather than competing for its head term. Also cross-link (not compete):
`youtube-marketing-roi.md`, `youtube-roi-for-saas.mdx`, `youtube-vs-paid-ads-b2b.mdx`,
`youtube-ads-for-b2b-lead-generation.mdx`.

## 3. Spoke keyword clusters (company-name long-tails — near-zero competition by design)
These are sub-threshold in the SSOT/GKP (expected — the PRD bet is low-comp long-tails that rank fast).
Each spoke owns its brand cluster; SERP gap validation in §4.

| Spoke | Anchor channel | Slug | Primary cluster | Secondary queries |
|---|---|---|---|---|
| Arvow | @VascoSEOtips | `/blog/arvow-youtube-strategy` | arvow · arvow review · arvow seo | how vasco grew arvow · arvow youtube |
| Tiiny Host | @tiinytips | `/blog/tiiny-host-youtube-strategy` | tiiny host · tiiny host review | tiiny host youtube · how tiiny host grew |
| Bulk Mockup | @BulkMockup | `/blog/bulk-mockup-youtube-strategy` | bulk mockup · bulk mockup plugin | bulk mockup review · photoshop mockup automation |
| Scalelist | @scalelist | `/blog/scalelist-youtube-strategy` | scalelist · scalelist review | scalelist linkedin · lead scraper youtube |
| LocalRank | @indexsy | `/blog/localrank-youtube-strategy` | localrank · localrank.so | jacky chou localrank · indexsy youtube |
| Tochat/Chatwith | @LinktoWhatsApp | `/blog/chatwith-youtube-strategy` | chatwith · tochat.be | click to chat whatsapp · whatsapp crm youtube |

- Slug collision check (redirects + existing posts): **clean** — `-youtube-strategy` suffix free (verified 2026-07-18).
- **Chatwith/Tochat naming:** product appears under both "Tochat.be" and "Chatwith" — confirm canonical
  brand before finalizing that slug (proposal uses `chatwith`).

## 4. Live SERP validation (founder-supplied screenshots, 2026-07-18)

### Q1 `youtube marketing case study` — GAP CONFIRMED, strong go-signal
- **Ranking field (all weak for our angle):** IMS Proschool, Slideshare/Scribd (PDF junk), YouTube playlists,
  Think with Google, Virao + Oneupweb (agency success-story pages), Harvard Business School, TubeSift (ads),
  Rival IQ ("7 YouTube Marketing Case Studies", **2016**), growthmodels.co, Medium (MrBeast). **None is a
  sourced B2B/SaaS customer-acquisition teardown** → our differentiation is uncontested on page 1.
- **AI Overview present and already states our thesis (verbatim):** *"a successful YouTube marketing strategy
  focuses on solving viewer problems and leveraging long-tail search rather than chasing viral views… high-intent
  videos can significantly outperform traditional social media channels in driving high-quality leads and
  sustainable long-term ROI."* Cites weak sources (IMS Proschool, Visme, Oneupweb) → **beatable citation target.**
  AIO also surfaced a real-estate *"$2.6M… treating the platform as a search engine"* figure → **AIO rewards
  specific sourced $ numbers** (our $70K/$12K/"50% of paid users" are exactly this).
- **Related/PAA:** mostly "case study pdf / ppt / free download" (low-value tail) + Reddit r/strategy, r/juststart.
- **Outline actions:** (a) lead hub with explicit **B2B/SaaS acquisition** qualifier to claim the sub-intent and
  avoid colliding with generic brand case studies; (b) FAQ answers the conceptual questions the AIO covers, not
  the pdf tail; (c) front-load sourced $ figures + "YouTube as a search engine" framing for AIO citation.

### Q2 `best b2b youtube channels` — TWO-INTENT COLLISION; our angle is the open lane
- **Dominant intent (occupied, avoid head-on):** "channels to FOLLOW to learn B2B." AI Overview + top
  organic (FeedSpot "100 B2B Marketing YouTubers", Leadfeeder, Lean Labs, B2B Marketing) all list
  educators/influencers: SaaStr, Dan Martell, HubSpot, Chris Walker/Refine Labs, Cognism. NOT us.
- **Our intent (open):** "companies that ACQUIRE CUSTOMERS via their own YouTube." Only near-competitor =
  Medium "8 Best B2B YouTube Channels for SaaS Founders" (Harry Ronchetti, ~3 yrs old, 10+ likes, and it's
  a follow-list of educators, not sourced teardowns). Beatable. White space confirmed.
- **Reddit #1 Discussions result = our exact thesis:** r/b2bmarketing "How a B2B company makes millions
  with their tiny YouTube channel" (50+ comments), top reply "subscriber count means nothing in b2b." →
  Phase-5 seeding target (hub = the canonical version). Add a "subscriber count is a vanity metric"
  takeaway (backed by Scalelist ~1,260 subs → 50% paid users).
- **PAA (add to FAQ, high-demand + on-thesis):** "How many views do you need on YouTube to make $5,000 a
  month?" / "$10,000 a month?" / "Is YouTube good for B2B?" / "What is the best channel for B2B sales?" →
  answer the view→revenue ones with our low-view/high-conversion proof (Bulk Mockup 370 views → 3 customers).
- **Positioning line unlocked:** contrast "channels to follow to learn B2B (SaaStr, Dan Martell)" vs
  "companies quietly using YouTube to acquire customers (our 6)." Use in hub intro to claim the lane.
- **Keyword confirm:** `best b2b youtube channels` = body/tail only (educator-list intent + vol 50 avoid). ✅

### Q3 `b2b saas youtube examples` — agency creative-example listicles; our lane still open
- **Field = video-production-agency "best SaaS video examples" lists** (Superside "16 Best", Zelios, Vidico,
  ContentBeta, Blue Carrot) = creative/production examples (explainers, promos, demos), NOT acquisition
  case studies. AI Overview buckets into 4 video TYPES citing Slack/Salesforce/HubSpot/SaaStr/Ahrefs.
- **Cross-query conclusion (Q1+Q2+Q3):** three different competitor intents (generic brand case studies /
  educator follow-lists / agency creative examples). "Companies acquiring customers via their OWN YouTube
  with sourced proof + first-party audit data" is unoccupied across the whole neighborhood. ✅ white space.
- **Reddit thread appears a 3rd time (r/SaaS, 39 answers)** — top comment = our thesis verbatim: *"Perfect
  example of intent > reach. In B2B, 300 views from buyers beats 30k views from spectators."* + "decision-
  stage videos" + "subscriber count means nothing." → Hub concept **"intent > reach"**, backed by our own
  sourced Bulk Mockup 370-views→3-customers data (express the sentiment in our voice; do NOT quote Redditors).
- **Competitor with original data:** grizzle.io "We analyzed 3,623 SaaS YouTube videos… paid promotion =
  91.4% of all long-form views" (grizzle.io/blog/saas-youtube-study, ~May 2026). CONTRAST gift: most SaaS
  YouTube views are paid, our 6 did it ORGANIC. Use as a framing stat IF linkable (verify before use).
  Their angle = aggregate video stats; ours = per-company sourced acquisition + audit scores. Distinct.
- **Distribution targets confirmed:** r/b2bmarketing + r/SaaS "tiny YouTube channel makes millions" threads.

### Q4 `youtube for b2b` — strategy-guide intent; AIO states our thesis, lacks our proof
- **Field = how-to strategy guides** (ZoomInfo, RevBoss "Complete Strategy Guide", Lean Labs, The B2B
  Playbook, Whitehat SEO, NNC) + B2B Hero channel. Big domains own the head term → correct that our hub
  uses `youtube for b2b` as SECONDARY only. Our own `youtube-marketing-b2b` post NOT on page 1 here.
- **AIO articulates our full thesis unprompted:** "rather than chasing viral engagement… high-intent
  targeted leads through searchable how-to content, product deep-dives, and video case studies";
  "second largest search engine"; **"self-reported attribution — add a 'How did you hear about us?' field"**
  (= Arvow's "which creator sent you?" quiz + coupon codes, in our dossier). Google's AI BELIEVES the
  thesis and cites strategy guides that assert it without proof → **our cluster = the sourced evidence
  layer those citations lack. Maximal AEO citation opportunity.**
- **Closest competitor:** The B2B Playbook "B2B YouTube Strategy: Turn a Small Audience Into Revenue"
  (theb2bplaybook.com/b2b-youtube-strategy) — same "views are wrong, pipeline is right" thesis, but a
  how-to guide with NO sourced companies. Differentiate: we are the proof, not the theory.
- **Reddit thread = #1 Discussions result on all 4 queries** (r/SaaS + r/b2bmarketing + r/content_marketing).
- **PAA contrarian gold:** "How much do 1000 views pay on YouTube?" / "How many views to make $10,000 a
  month?" → the AdSense misconception our thesis kills (acquisition, not ad revenue). Reframe as a
  contrarian FAQ; ties to the AdSense-reality reference (views ≠ business value).
- **Authority stats seen in AIO** ("66% more qualified leads", "videos 50x more likely on page 1"):
  classic un-sourced marketing stats → verify-before-use, likely OMIT unless a primary source is found.

## 6. Cross-SERP synthesis (Q1-Q4) — final positioning
1. **White space confirmed 4x:** no sourced acquisition teardown with first-party audit data ranks anywhere
   in the neighborhood (competitors = generic brand case studies / educator follow-lists / agency creative
   examples / how-to strategy guides).
2. **AEO wedge:** every AIO recites our thesis but lacks sourced company proof. Front-load our sourced $
   figures + the specific tactics AIO names (self-reported attribution, second-search-engine, BOFU proof) so
   we become the citation.
3. **Core hub concept:** "intent > reach" ("300 views from buyers beats 30k from spectators") + "subscriber
   count is a vanity metric" — community's own language, backed by our Scalelist + Bulk Mockup data.
4. **Contrarian FAQ:** reframe the "how many views = $X" monetization questions to acquisition (AdSense-reality).
5. **Differentiate from:** The B2B Playbook (theory without proof) + grizzle.io (aggregate video stats; ours
   is per-company acquisition + audit). Both citable as contrast if linkable.
6. **Distribution (Phase 5):** seed the r/SaaS + r/b2bmarketing + r/content_marketing "tiny channel" threads
   as the canonical answer.

### Q5 — brand queries (optional; near-certain open lanes for company-name long-tails)

## 5. Pivot-rule status (PRD §6)
Triggered and applied: original seeds <100 combined winnable volume → re-angled hub to the winnable
`youtube marketing case study` cluster. Teardowns/spokes unchanged; only hub packaging moved. ✅
