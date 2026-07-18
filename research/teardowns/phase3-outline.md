# B2B YouTube Teardowns — Phase 3 Outline Deliverable

**Cluster:** `blog/b2b-youtube-teardowns` · **Date:** 2026-07-18 · **Status:** OUTLINE (founder gate before drafting)
**Sources of record:** `research/teardowns/dossier.md` (only factual source), `research/teardowns/keyword-map.md` (locked keywords/slugs), spec `docs/superpowers/specs/2026-07-18-b2b-youtube-teardowns-cluster-design.md`
**Voice:** data-driven, direct, founder-to-founder, B2B-acquisition lens (`docs/brand-voice.md` + `docs/icp.md`). No em-dashes. No fabricated stats or ratings.

> Outline, not prose. Specifies structure, section intent, the exact sourced facts each block may use, internal/external links, schema, graphics, and the citability gate self-check. Every factual claim traces to the dossier; anything not in the dossier is flagged "verify before use" and must not be invented at draft time.

## SERP-informed adjustments (4 queries, founder-supplied, 2026-07-18)
Full analysis in `research/teardowns/keyword-map.md` §4-6. Net findings that shape this outline:

1. **White space confirmed across Q1-Q4.** No sourced acquisition teardown with first-party audit data
   ranks anywhere in the neighborhood. Competitors sort into 4 non-overlapping intents: generic brand case
   studies (`youtube marketing case study`), educator follow-lists (`best b2b youtube channels`), agency
   creative-example lists (`b2b saas youtube examples`), how-to strategy guides (`youtube for b2b`). Our
   angle is uncontested in all four.
2. **AEO wedge (biggest opportunity).** Every AI Overview recites our thesis unprompted ("high-intent over
   viral", "second largest search engine", "video case studies as BOFU proof", even "self-reported
   attribution: add a 'How did you hear about us?' field") but cites strategy guides that assert it WITHOUT
   proof. → Front-load our sourced $ figures ($70K, $12K, "50% of paid users") and mirror the exact tactics
   the AIO names, so the hub becomes the sourced citation. Note: Arvow's "which creator sent you?" quiz +
   coupon codes ARE the "self-reported attribution" the AIO recommends, sourced.
3. **Lead the intro with a positioning wedge:** "the guides all preach YouTube-for-B2B; here are 6 companies
   that actually did it, with the receipts." Explicitly contrast "channels to follow to learn (SaaStr, Dan
   Martell)" vs "companies quietly acquiring customers (our 6)".
4. **Core hub concept = "intent > reach"** (community's words: "300 views from buyers beats 30k views from
   spectators") + **"subscriber count is a vanity metric in B2B"** as a named takeaway. Back both with our
   own sourced data (Scalelist ~1,260 subs → 50% paid users; Bulk Mockup 370 views → 3 customers). Express
   the sentiment in our voice + sourced; do NOT quote Reddit users.
5. **Add a contrarian FAQ** from the monetization PAAs ("How much do 1000 views pay?", "How many views to
   make $10k/month?"): reframe to acquisition, not ad revenue (ties to the AdSense-reality reference).
6. **Differentiate from two real competitors** (name/contrast, do not copy): The B2B Playbook
   ("views are wrong" thesis but no sourced companies) and grizzle.io ("analyzed 3,623 SaaS videos, 91.4%
   of long-form views are paid" → contrast: our 6 did it ORGANIC). Use grizzle's stat only if linkable.
7. **Distribution (Phase 5):** the r/SaaS + r/b2bmarketing + r/content_marketing "tiny channel makes
   millions" thread ranks #1 in Discussions on all 4 queries → seed the hub there as the canonical answer.
8. **Authority stats** ("66% more leads", "50x page-1"): un-sourced marketing stats seen in AIO → keep as
   verify-before-use, likely OMIT unless a primary source is found. No placeholder ships.

---

## PART A — HUB OUTLINE

**Working H1:** carries primary keyword `youtube marketing case study` naturally (final H1 from Part C).
**Slug:** `/blog/youtube-marketing-case-studies`
**Primary keyword:** `youtube marketing case study` (vol 500, KD 0, winnable)
**Secondaries (body/H2 only):** `youtube for b2b`, `b2b youtube`
**Tail (natural body phrasing only, never title):** `best b2b youtube channels`, `b2b youtube channels`, `youtube business case study`
**Post type:** comparison/listicle hub → `comparison-content-playbook.md` structure applies in full.
**Canonical entity terms (use verbatim, introduce before any variant):** `buyer-intent video`, `YouTube acquisition channel`, `customer acquisition`, `B2B YouTube`.
**Cannibalization guard:** leads with case-study intent; uses `youtube for b2b` only as secondary; cross-links (does NOT compete with) `youtube-marketing-b2b.md`.

### Hub section flow (in order)

#### 1. Intro (first ~300 words) — answer-first opening
- Sentence 1 = direct verdict, mirrors the title: these 6 real companies acquire customers from YouTube by doing the same 3 things; name the takeaway before any setup. No throat-clearing.
- Extractable 3-part pattern as a lift-ready line: "Every channel here does 3 things: (1) makes `buyer-intent video` that answers a literal search query ('how do I upload a CV', 'how to share a PDF as a link'), (2) accepts low view counts in exchange for high-intent signups, (3) ranks the same video on YouTube search AND Google (and increasingly inside LLMs)." This is the thesis and the primary answer block.
- Strict source-policy statement: every revenue/lead/customer number is quoted from a linkable public source and linked inline; nothing estimated; where a founder figure and a secondary article disagree, use the founder's own words and note the discrepancy.
- ICP framing: `B2B YouTube` as a `YouTube acquisition channel`, not creator growth. One sentence on who it is for + one loss-aversion beat (treat YouTube as a "views" channel and you build an audience that never buys).
- Answer block (Rule 1, 134-167 words): the 3-part pattern paragraph doubles as the self-contained answer block, in the first 30% of the page.

#### 1a. Key Takeaways callout (blue left-border, mandatory)
5-6 standalone, citation-ready insights from dossier facts:
- The pattern is `buyer-intent video`, not viral: Tiiny Host targets "how do I upload a CV," not "web hosting."
- Low views convert: Bulk Mockup's 370-view video produced 3 paying customers (founder-stated).
- One video, two search engines: Bulk Mockup 22% of YouTube views from Google search; Arvow's top video 65% YouTube search + 20% Google.
- A tiny channel can carry a funnel: Scalelist (~1,260 subs) attributes ~50% of paid users to YouTube.
- Pre-built audience compresses launch: LocalRank launched at "nearly $20k MRR right out of the gate."
- CTA placement moves signups: Arvow moved its CTA to the start/middle for a signup lift.

#### 2. Table of Contents (jump links, after Key Takeaways)
Nested ToC: parent H2s with the 6 channels indented under the teardown H2. Plain markdown per MDX gotcha.

#### 3. Quick comparison table (high on page, all 6) — styled HTML, `overflow-x:auto`
Columns: Company · Product · ICP · Channel (@handle) · Sourced acquisition claim · Audit score · The one thing.
Audit column: leave in, every cell `PENDING (Gemini quota)`, one-line note: "Live audit scores (0-100, as of July 2026) pending a Gemini API quota reset, folded in before publish." No invented numbers.

| Company | Product | ICP | Channel | Sourced acquisition claim | Audit | The one thing |
|---|---|---|---|---|---|---|
| Arvow | AI SEO article writer | Founders/marketers doing SEO | @VascoSEOtips | "~$70K/mo MRR (~$1M/yr), ~600 clients," "grown purely with YouTube" (founder, Starter Story + video) | PENDING | Founder-led personal SEO channels, daily for a year |
| Tiiny Host | Web + PDF hosting SaaS | Anyone sharing a file/site fast | @tiinytips | ~$15k MRR (~$180k ARR), ~1,000 paying subs (founder, Starter Story) | PENDING | Faceless JTBD tutorials on literal search tasks |
| Bulk Mockup | Photoshop batch-mockup plugin | POD sellers, designers, agencies | @BulkMockup | "$12K/month," "customers find us through YouTube" (founder, Starter Story) | PENDING | Content flywheel fueled by logged customer pain |
| Scalelist | AI sales-lead Chrome extension | SDRs, B2B lead-gen teams | @scalelist | YouTube "brings 50% of our paid users" (founder, Pulse Hero) | PENDING | Tiny channel (~1,260 subs) drives half of paid users |
| LocalRank | AI local-SEO software | Local-SEO agencies + local businesses | @indexsy | Launched "nearly $20k MRR right out of the gate" off YouTube audience (founder, IndieHackers + tweet) | PENDING | Daily build-in-public, pre-built launch audience |
| Chatwith / Tochat.be | WhatsApp CRM / click-to-chat | Micro/SMB service businesses | @LinktoWhatsApp | "a great channel in YouTube… 500,000 views/month" (CEO, Pulse Hero) [MEDIUM] | PENDING | Weekly WhatsApp use-case tutorials, non-US SMB |

Note beside Chatwith row: evidence MEDIUM (YouTube named in the growth narrative but not isolated as a signup %). Do not upgrade.

#### 4. Per-channel teardown blocks (6 blocks, 300-500 words each in the hub)
Identical PRD framework each (order fixed): 1 business snapshot (sourced) → 2 channel strategy → 3 the one thing others don't → 4 evidence it works (sourced, linked) → 5 audit score line (PENDING) → 6 "steal this" (2-3 actions) → 7 link to full spoke.

Per-channel content locks (dossier-bound; drafting must not exceed these):

- **Arvow → @VascoSEOtips** · `/blog/arvow-youtube-strategy`
  - Snapshot: AI SEO writer; founder Vasco Monteiro; ship "~$70K/mo MRR (~$1M/yr), ~600 clients," may note "$79K per the Starter Story article." NEVER "$5M," never present $79K as the sole figure.
  - The one thing: "multiplied himself" across founder-led personal SEO channels, 20-30 min videos daily for almost a year; assets in 3 buckets (evergreen, news-jacking, viral-for-software); moved CTA to start/middle.
  - Evidence: proof video "how to make a Wikipedia page" (~2 yrs) = 1.2M impressions, ~300 views/day, 65% YouTube search + 20% Google, surfaced in LLMs. "grown purely with YouTube" (video VZ1XspToV1E; tweet corroborates).
  - Framing correction: growth engine = founder-led PERSONAL channels, not @ArvowAI. Frame as "founder-led YouTube."
  - Sources: starterstory.com/vasco · youtube.com/watch?v=VZ1XspToV1E · x.com/vascoabm/status/1932762748472983923

- **Tiiny Host → @tiinytips** · `/blog/tiiny-host-youtube-strategy`
  - Snapshot: web+PDF hosting; founder Elston Baretto (ex-JP Morgan, solo, Jan 2020). Ship founder-stated $15k MRR (~$180k ARR), ~100k monthly visitors, ~1,000 paying subs. "$1M ARR" ONLY if attributed to the Apr 2026 Profitable Founder interview; never as established fact.
  - The one thing: faceless JTBD tutorials on literal low-KD buyer-intent queries. "Nobody searches 'web hosting,' they search 'how do I upload a CV.'"
  - Evidence: "How to share a PDF as a link" ranks as the top video result in Google (founder); that video "30k+ views"; PDF hosting ≈ 40% of revenue. Exclude exact per-video traffic beyond "thousands/30k+."
  - Sources: indiebites.com/80/transcript · starterstory.com/stories/tiiny-host · profitablefounder.xyz/blog/how-elston-built-tiny-host-to-1m-a-year

- **Bulk Mockup → @BulkMockup** · `/blog/bulk-mockup-youtube-strategy`
  - Snapshot: Photoshop batch-mockup plugin; founder Vikash Kumar Prajapati; "$12K/month" (STRONG).
  - The one thing: content flywheel fueled by logged customer pain (communities read silently, onboarding emails, support tickets → 1,500+ Loom videos over 3 yrs, YouTube comments as pain signal), distributed with an SEO angle.
  - Evidence: "customers find us through YouTube… he trusts me and then he purchases" (verbatim). "Split the design" video = 370 views/4 months → 3 customers × $15/mo = $45 MRR (ship $45, not the "$345" misspeak). Second video 12,000 views/6 months → $213. "22% views… comes from Google search." Low views, high conversion.
  - Sources: youtube.com/watch?v=W48emwbUlUE · open.spotify.com/episode/3OKeKCazbAFPOycLLgjMJ9

- **Scalelist → @scalelist** · `/blog/scalelist-youtube-strategy`
  - Snapshot: AI sales-lead database (LinkedIn Sales Navigator scraper + enrichment); founder Youssef El Kaddioui; ICP = SDRs / B2B lead-gen.
  - The one thing: a genuinely tiny channel (~1,260 subs after 8 videos, early 2024) carrying half the paid-user funnel via screenshare lead-gen tutorials.
  - Evidence: "YouTube started picking up after a few months… It now brings 50% of our paid users" (YouTube ~50%, SEO ~15%, rest Chrome Web Store / referrals / LinkedIn).
  - Source: pulsehero.substack.com/p/saas-founder-interview-how-youssef

- **LocalRank → @indexsy** · `/blog/localrank-youtube-strategy`
  - Snapshot: AI local-SEO software (GBP rank-grid), LocalRank.so; founder Jacky Chou (Indexsy); ICP = local-SEO agencies + local businesses.
  - The one thing: daily build-in-public that assembled a launch audience so the product opened with revenue flowing.
  - Evidence: "Videos with relatively low view counts drive significantly more product signups than posts that get tens of thousands of impressions on other platforms." Launched "nearly $20k MRR right out of the gate"; tweet: "Posted a YouTube video every day… launched Localrank.so 2 days ago… already at $2k MRR." Disclose: personal/portfolio channel that also promotes courses; SaaS→YouTube link is explicit.
  - Sources: indiehackers.com/post/tech/…-G2t49DpfChnjJsTqwRsB · x.com/indexsy/status/1901370127054176629

- **Chatwith / Tochat.be → @LinktoWhatsApp** · `/blog/chatwith-youtube-strategy`
  - Snapshot: WhatsApp CRM / click-to-chat widget; CEO César Martín; ICP = micro/SMB service businesses (real estate, auto, education, beauty), non-US.
  - The one thing: weekly WhatsApp use-case tutorials for a non-US SMB audience, a vertical the other 5 do not cover.
  - Evidence (MEDIUM): "we found a great channel in YouTube, where we have more than 500,000 views per month" alongside ~5,000 signups/mo and 17,000 premium users. Do NOT claim a YouTube signup %: co-mingled with AppSumo + SEO. Flag medium confidence in-body.
  - Source: pulsehero.substack.com/p/saas-leader-interview-inside-the
  - Naming note: confirm canonical brand ("Chatwith" vs "Tochat.be") before finalizing slug; proposal = `chatwith`.

#### 5. Pattern synthesis (the payoff, carries the SellonTube worldview)
- Restate the 3-part pattern as an evidence-sandwich (claim → 6 sourced data points → actionable conclusion).
- Highlight independent confirmation: both Vasco (Arvow) and Vikash (Bulk Mockup) independently confirm low-view, high-intent `buyer-intent video` on JTBD queries ranks on Google AND is surfaced by LLMs. State as a declarative, citable line.
- Worldview line (ICP filter): the metric that matters is `customer acquisition`, not views. A 370-view video that produces paying customers beats a 100k-view video that produces subscribers. Loss aversion: chasing views builds the wrong asset.
- One inline SVG = the 3-part-pattern diagram (light-inline palette).

#### 6. FAQ (visible in body, MANUAL `## FAQ` + `### Question`) — 4-6 questions
Visible H3 + paragraph (biggest §19 gap; frontmatter `faqs` only emits schema). Conversational "I/my," 50-100 words each, self-contained, sourced where numeric. Candidates:
- Does YouTube actually work for B2B? (Yes; Scalelist ~50% of paid users, Arvow "grown purely with YouTube")
- How long until YouTube drives leads? (Scalelist "picking up after a few months," LocalRank audience-before-launch; "months, not days")
- Do I need a lot of views to get customers? (No; Bulk Mockup 370 views → 3 customers)
- Should I put my product pitch in the video? (Arvow CTA placement; Bulk Mockup solve-first flywheel)
- Can one YouTube video rank on Google too? (Yes; 22% Bulk Mockup, 65%+20% Arvow)
- What kind of videos should a B2B company make? (`buyer-intent video` on literal JTBD queries; Tiiny Host)

#### 7. CTA block (closing)
- Primary CTA: free YouTube channel audit tool, "audit your channel against these 6" → `/tools/youtube-channel-audit` (styled callout).
- Secondary CTA (one): the ROI pillar, contextual link to `/youtube-roi-for-saas` OR `/youtube-marketing-roi` (pick one; do not stack).
- Mandatory "What to Do This Week" green callout (5-7 numbered actions).

### Hub internal links (6-10 total, contextual mid-sentence, anchor-diverse)
Target 8-9: all 6 spokes + `/tools/youtube-channel-audit` + `/blog/youtube-marketing-b2b` (cross-link only, do NOT compete) + ONE of {`youtube-marketing-roi`, `youtube-roi-for-saas`, `youtube-vs-paid-ads-b2b`, `youtube-ads-for-b2b-lead-generation`} (rotate the rest across the spokes). Anchor diversity: vary text; do not reuse an exact-match phrase across >~3 sources corpus-wide; money pages already carry 28-32 exact anchors, add none.

### Hub external links (every claim's source, live outbound, inline)
Per channel as listed above. Authority-stat option (Google/Think with Google B2B-video stat): verify-before-use, include only if a live linkable primary source is found at draft; else omit. No placeholder number ships.

### Hub schema (match visible content only)
`Article` + `ItemList` (6 channels, matches comparison table + teardown list) + `FAQPage` (visible FAQ only) + BreadcrumbList default. No Review/rating schema while audit scores are PENDING.

### Hub graphics (PRD §11, perf-safe; note dossier data trace)
1. Comparison-table graphic (the 6-channel styled HTML table; audit column PENDING).
2. 3-part-pattern diagram (inline SVG, light palette per CLAUDE.md: `#f8fafc` bg, `#e2e8f0` borders, dark text; conceptual, no dossier numbers).
3. Per-channel stat/title visuals (cleanest sourced data only): Arvow proof-video card (1.2M impressions, ~300/day, 65%+20%); Bulk Mockup low-views card (370 → 3 → $45 MRR); title-pattern strips using verbatim dossier titles.
- Featured image `youtube-marketing-case-studies-featured.svg` (dark palette) must exist before publish (`validate-build.js` Check 4).
- Video (§18): one relevant founder-interview via `YouTubeFacade.astro` (evidence, not decoration).

---

## PART B — REUSABLE SPOKE TEMPLATE (all 6)

Deeper per-channel teardown, 800-1,200 words, one template filled per channel from dossier facts only. No new research at draft.
Slugs+anchors locked: Arvow→@VascoSEOtips→`/blog/arvow-youtube-strategy` · Tiiny Host→@tiinytips→`/blog/tiiny-host-youtube-strategy` · Bulk Mockup→@BulkMockup→`/blog/bulk-mockup-youtube-strategy` · Scalelist→@scalelist→`/blog/scalelist-youtube-strategy` · LocalRank→@indexsy→`/blog/localrank-youtube-strategy` · Chatwith→@LinktoWhatsApp→`/blog/chatwith-youtube-strategy`.

### Spoke section flow
1. H1 + answer-first opening (sentence 1 = sourced outcome + the one thing; then short source line).
2. TL;DR / Key Takeaways callout (blue): 4-5 standalone sourced bullets.
3. Answer block (134-167 words, Rule 1): self-contained "how [company] uses YouTube as a `YouTube acquisition channel`," sourced, first 30%.
4. ToC (jump links) if >~6 H2s.
5. Fuller history (sourced): founder background + supported timeline. UNVERIFIED publish dates stay out.
6. The strategy in depth: the company's playbook.
7. 3-5 example title analysis: verbatim growth-era titles from dossier + one-line buyer-intent read. Arvow/Tiiny Host/Bulk Mockup have verbatim titles; Scalelist/LocalRank/Chatwith → analyze described format, flag "titles not independently sourced, verify before adding."
8. Audit-score breakdown: 4 dimensions + overall, all `PENDING (Gemini quota; as of July 2026)`. Fill before Phase 4 finalizes.
9. The pattern applied: map back to the hub 3-part pattern with the channel's sourced metric.
10. "Steal this" (3-5 concrete B2B-acquisition steps).
11. FAQ (visible, manual): 3-4 conversational, company/vertical-specific, sourced where numeric.
12. What to Do This Week green callout (5-7).
13. CTA: contextual `/tools/youtube-channel-audit` ("audit your channel like we audited [company]").

### Spoke internal links (4-6 each)
Hub + audit tool + one sibling spoke (thematically closest, e.g. Arvow↔LocalRank build-in-public; Bulk Mockup↔Scalelist low-view/high-intent) + 1 rotating deep article (spread equity, no single target over-anchored). Anchor diversity across all 6 spokes.

### Spoke external links
Every sourced claim links inline to its dossier source (channel-scoped).

### Spoke schema
`Article` + `FAQPage` (visible FAQ only) + `VideoObject` ONLY if a real video embeds. No Review schema until real scores visible.

### Spoke graphics (perf-safe, per channel)
One title-pattern strip (verbatim titles where available), one sourced stat card, optional one process SVG (light palette). Featured `<slug>-featured.svg` (dark) required before publish.

---

## PART C — 5 HUB TITLE CANDIDATES

Formula (PRD §7): [Number] + [ICP] + [outcome] + [proof marker] + [year]. Primary keyword carried naturally. ≤60 visible chars. No em-dashes.
1. **6 B2B YouTube Case Studies With Real Revenue (2026)** — 51 chars
2. **6 YouTube Marketing Case Studies for B2B Founders 2026** — 55 chars
3. **6 B2B Channels That Turn YouTube Into Customers (2026)** — 55 chars
4. **YouTube for B2B: 6 Sourced Case Studies, 2026** — 46 chars
5. **6 SaaS YouTube Case Studies With Sourced Proof (2026)** — 54 chars

- Recommended H1: #1 or #2 (both carry the exact primary keyword; #2 verbatim + ICP + year). Founder picks.
- Meta description (≤150 chars): "6 B2B YouTube marketing case studies with founder-sourced revenue numbers. See how tiny channels drive real customer acquisition. Verified, 2026." (146 chars)

---

## PART D — CITABILITY GATE SELF-CHECK (§16 hard gate, hub)

| Gate rule | How the hub outline satisfies it | Status |
|---|---|---|
| Content quality first | 6 first-hand, source-linked teardowns competitors do not aggregate; hub+spoke structure | PASS |
| Rule 1 — Answer block (134-167 words, standalone, first 30%) | 3-part-pattern paragraph in the intro is the answer block, placed early | PASS |
| Rule 2 — Entity consistency | Canonical terms locked and introduced before variants | PASS |
| Rule 3 — First-party data claim | SellonTube's framing + the free channel-audit tool as first-party asset; disclosed as ours | PASS (add explicit first-party line at draft) |
| Rule 4 — Definition blocks | Define `buyer-intent video` at first use in synthesis; `B2B YouTube` framed early | PASS |
| Rule 5 — FAQ conversational + visible | Manual `## FAQ` + `### Question`, 4-6 questions, "I/my," self-contained | PASS |
| Citation-ready language (§17) | Title mirrored in sentence 1; declarative verdicts; sourced numbers; named subjects | PASS (enforce at draft) |
| Media present + perf-safe (§18) | Table graphic + 3-part SVG + sourced stat cards + one facade video (evidence); lazy-load, reserved dims | PASS |
| Comparison-playbook gate | Answer-first + Key Takeaways + problem/solution + 3-part frame + comparison table + fixed per-channel order + steal-this + categorized FAQ | PASS |
| `llms.txt` update | New major page → add to `public/llms.txt` on publish | TODO at publish |

### Flagged gaps (close before publish, not outline blockers)
1. Audit scores PENDING (Gemini quota) — placeholders; fill or finalize the column before Phase 4 ships. No fabricated scores.
2. Chatwith is MEDIUM evidence — represent as such; never state a YouTube signup % for it.
3. Google/Think-with-Google authority stat = verify-before-use; omit if not linkable.
4. Some spoke growth-era titles not independently sourced (Scalelist, LocalRank, Chatwith) — analyze described format or verify before title cards.
5. Chatwith vs Tochat.be brand name — confirm before finalizing that slug.
6. Featured SVGs (hub + 6 spokes) do not exist yet → Phase 4 build task.

*End of Phase 3 outline. All facts trace to `research/teardowns/dossier.md`; keywords/slugs to `research/teardowns/keyword-map.md`.*
