# Refresh plan - https://sellontube.com/blog/youtube-marketing-case-studies - 2026-10-22

Mode 07 + mode 09 step 7. Read-only plan; no repo file was edited. Source read from
`SellonTube-wt-top5` at `605c8d8`. Line refs (L) point at
`src/data/post/youtube-marketing-case-studies.mdx` in that tree. No ranking, traffic or install
gain is promised.

## Trigger
- Caller facts (90d 2026-07-22..10-19): 17 clicks / 7,918 impr / pos 15.4; 28d 8 clicks / 1,411
  impr. Impressions fell while position held = demand drop, so this is a citability + CTR pass,
  not a rewrite. Owner: keep the post, aim edits at B2B/western buyer intent.
- I re-pulled GSC live (service account, `sc-domain:sellontube.com`, same window) and the page
  total matches: **17 / 7,918 / 15.4**.
- Refresh before new: the post already ranks on page 2 for its head query, and 11 site pages
  link to it. A new post would split the cluster.

## Phase 1: Current state

**Query rows (GSC live, page filter, 2026-07-22..10-19):**

| Query | Clicks | Impr | Pos | Note |
|---|---|---|---|---|
| youtube marketing case study | 1 | 2,101 | 15.9 | primary |
| youtube for brands case study | 0 | 1,775 | 19.9 | **not in the caller brief**; brand intent |
| youtube ads case study | 0 | 696 | 27.5 | **not in the caller brief**; paid intent, which L471 excludes |
| youtube case study | 0 | 276 | 27.0 | split with `/youtube-video-ideas/agency-case-study-videos` (pos 24) |
| b2b youtube case studies | 0 | 59 | 4.0 | the ICP row; already top 5 |
| youtube channel success case studies / youtube seo success stories / b2b case study videos | 0 | 5-7 each | 22-33 | long tail |

**Country (impressions only).** I did not use page x country for clicks, per SEO_CONTEXT. Top
rows: BRA 868, IND 507, IDN 220, USA 212, VNM 205, KOR 171, PHL 150, ARG 149, GBR 130. Primary
query: BRA 380, IND 223, IDN 96. Western share stays small, which matches the caller's 80-88%
non-ICP figure. Bot rule: nothing below is scoped from impressions. The brand and ads rows are
treated as **intent signals** (what the SERP thinks the page is about), not as volume to chase.

**Live page check (curl 2026-10-22):** HTTP 200. Canonical is self. FAQPage JSON-LD count 0. 8
rendered question headings (2 H2 + 6 FAQ H3). `datePublished` = `dateModified` =
2026-07-17T18:30Z, so the page has never been updated. og:image is a raster JPG, but the live
`og:image:height` is **675** while frontmatter L9 says 630. The live build predates `605c8d8`.
That fix ships with the next deploy and needs no action here.

**Rendered `<title>`:** `6 YouTube Marketing Case Studies With Real Revenue (2026) | SellOnTube`
= **70 chars. FAILS the 60 cap** (topic budget 47; current topic = 57).
**Meta (`metadata.description`, L32):** 140 chars, passes <155. `excerpt` (L5) is 164 chars, but
it is only a fallback and does not render as the meta.

**Strengths to keep:** the at-a-glance table (L90-167); six teardowns with sourced founder
quotes; the first-party audit scores; the 5 YouTube facades; the 2 SVGs; the visible FAQ; WTDTW.
Keep every anchor id; 11 pages link in (Phase 4, internal links).

**Weaknesses:** title over the cap; one internal number contradiction (Scalelist subs); undated
founder figures; no visible "Last updated"; a mis-targeted ads link (L471); 3 unique internal
targets only.

## Citability audit (AIC-01..10 + ai-seo-guide §16/§19), on source plus live HTML

| Check | Result | Where / evidence | Fix |
|---|---|---|---|
| AIC-01 / §16 R1 answer block 134-167 words, early | **Pass** | L53 = 138 words, bold, first ~5% of page. L84 = 131 words (3 short) | L53 first sentence: name the primary query ("These six YouTube marketing case studies show..."). Bring L84 to 134+ through the definition add below |
| AIC-02 / §17 first sentence mirrors heading | **Partial** | L82 passes ("Yes. YouTube works..."). Company H2s (L199-334) open with an italic question, then a data card; the answer arrives in "Snapshot". L361 H2 opens with stat cards, then the signpost "Here is the claim, then..." (L382) | L382: replace with a direct answer, "All six channels share three traits: ...". Leave the company sections as they are; the data card serves as the answer |
| AIC-03 / §16 R4 definition blocks | **Partial** | `**A buyer-intent video is...**` exists at L384, deep in the page and not under the heading that introduces the term (first use L53). No definition of "YouTube acquisition channel" | Add `**A YouTube acquisition channel is** ...` (1-2 sentences) right under the L82 H2. Keep L384 |
| AIC-04 / §16 R2 entity terms | **Pass (nit)** | buyer-intent video, B2B YouTube and customer acquisition all appear; "YouTube acquisition channel" once (L53). The variant "acquisition engine" appears first (L49), before the canonical term | L49: swap "acquisition engine" for "YouTube acquisition channel" or move the variant after L53 |
| AIC-05 / §16 R3 first-party data | **Pass** | Audit scores from SellonTube's own tool (L55, L88, L169, per-section). Source: `research/teardowns/dossier.md` L247-258, run 2026-07-18 | Strengthen with 2 computed, real claims (Phase 3, Information gain) |
| AIC-06 / §17 plain, checkable language | **Partial** | L51 "can pay your rent" and L49 "receipts" are metaphors. L212 "Both figures land at about $1M a year": $70K x 12 = $840K and $79K x 12 = $948K, so the claim rests on the founder's own words, not the math | L212: "which the founder rounds to 'basically a million dollars a year'". The L51 idiom is voice; soften it only if the owner agrees |
| AIC-07 takeaways / TOC / diagrams claim audit | **Fail (claim)** | Key Takeaways L62 says "roughly **1,260**-subscriber channel"; L84, L140, L289 and L370 say **2,660**; L143, L297 and L386 say 1,260. A model summary of this page (WebSearch, 2026-10-22) already lifted "2,660" | Use one framing everywhere (Stale facts table) |
| AIC-08 reads fine without AI | Pass | - | - |
| AIC-09 tables stand alone | Pass | L90-167 at-a-glance; L425-467 move/company/number | Add an as-of year to each claim cell (Stale facts) |
| AIC-10 conversational FAQ | **Partial** | 1 of 6 questions uses "I" (L487) | Rephrase 3; add 2 from GSC (Phase 4) |
| §19 visible FAQ | Pass | 6 FAQ H3s render in live HTML (grep counted 8 question headings) | - |
| §19 question-style H2s | Partial | 2 of 9 content H2s are questions | Keep the company H2s (anchors, scannability). The new FAQ items carry the question form |
| §19 tables | Pass | 2 tables | - |
| §19 TOC with anchors | Pass | L69-80 | Update only if an H2 is added (none planned) |
| Key Takeaways | Pass | L57-67 | Fix L62 number |
| What to Do This Week | Pass | L504-515 | Add 2 internal links (Phase 4) |
| §18 media | Pass | Raster feature image (L6), 2 inline SVGs with aria-labels, 5 click-to-load facades with captions | - |
| §12 freshness | **Fail** | No visible "Last updated"; dateModified = publish date; `b2b` cluster review is monthly per §12 | Add `updateDate` + a visible "Last updated October 2026" line **only after** the material fixes below land |
| SEO_CONTEXT title ≤60 rendered | **Fail** | 70 chars | Phase 4, Title |
| SEO_CONTEXT ≥4 internal links incl. /tools/ | **Borderline** | 7 links, but only 3 unique targets: `/tools/youtube-channel-audit` (x6), `/blog/youtube-marketing-b2b`, `/blog/youtube-roi-for-saas` | Add 2 unique targets (Phase 4) |

## Phase 2: SERP read (dated 2026-10-22, method: WebSearch, US-only API)

**Method caveat.** WebSearch returns a ranked link list plus a model summary, not a Google SERP.
It **cannot show AI Overview presence, AIO citations, or PAA boxes**. **No PAA question was
observed, so none is quoted.** The owner should capture the Google SERP by hand (`nfpr=1`,
US/UK) before the FAQ ships, to confirm or replace the GSC-derived questions.

**"youtube marketing case study"**

| # | URL | Publisher type | Format | Covers what we skip | Dated |
|---|---|---|---|---|---|
| 1 | proschoolonline.com/blog/youtube-case-studies | Education/training blog | Brand roundup (Red Bull etc.) | Big consumer brands, influencer/UGC tactics | undated |
| 2 | socialsamosa.com/2018/02/youtube-case-studies | Indian marketing media | 8-brand listicle (Tuft & Needle) | Paid targeting cases, consumer brands | 2018 |
| 3 | prdaily.com (Five standouts in YouTube marketing) | PR trade media | Brand roundup (Home Depot, Ford agency), paywalled | Enterprise brand channels | old |
| 4 | searchenginewatch.com Dynomighty case study | SEO trade media | Single case: featured video, 2.7M views, $130K sales | Viral/featured-video outcome | 2010 |
| 5 | theseus.fi thesis | Academic | KPI roadmap | Measurement KPIs (views, subs, shares) | 2025 |
| 6 | clickminded.com (Buffer via Backlinko) | SEO training | Channel-growth case | Subscriber growth tactics | old |
| 7 | demandgenreport.com tag page | B2B trade media | News tag | - | - |

**"b2b youtube case studies"**: b2brocket.ai (vendor blog, generic B2B video), izea.com (B2B
content-marketing case studies), advids.co + equinetmedia.com (how to make a *video* case study,
which is a different intent), digitrendz.blog (secondhand SaaS CPL claim), Adobe Marketo
community thread, an O'Reilly book. **Nobody in these results publishes founder-sourced B2B
YouTube acquisition numbers.** That gap is our information gain.

**"youtube case study"**: newamerica.org (recommendation-algorithm policy case), slideshare
media studies, MIDiA Research (paywalled), Social Samosa, ProSchool, freelancer showcases. Mixed
intent (platform-as-company vs marketing). We should not target this term.

**Extended check "YouTube marketing case studies brands results 2025 2026":** iqfluence.io
(influencer ROI), dashsocial.com (stats), indirap.com (10 video case studies 2026),
themarketingagency.ca, Think with Google (Nissan, McDonald's Shorts), sponsorship.so, **and
sellontube.com/blog/youtube-marketing-case-studies (this page)**. The search model's summary
quoted our page's "50% of paid users from a channel of about 2,660 subscribers" and the
"370-view video produced three paying customers". This is one anecdotal sign that the page is
extractable. It is not a measured citation.

**Winnability.** The head SERP mixes big-brand and paid campaign roundups (Think with Google,
trade media). The 1,775-impression "youtube for brands case study" row says Google reads the
page partly as a brand-campaign roundup. Per L-TOP-02 / L-AI-06, aim the refresh at the B2B rows
we already earn ("b2b youtube case studies" pos 4.0). Do not chase the brand/ads head terms with
new content.

## Phase 3: Gap analysis

Competitors: C1 ProSchool, C2 Social Samosa, C3 PRDaily, C4 SEW Dynomighty, C5 Think with Google
/ indirap (2026 roundups).

| Topic / element | Us | C1 | C2 | C3 | C4 | C5 | Priority | Action |
|---|---|---|---|---|---|---|---|---|
| Big consumer-brand examples (Red Bull, Nike, Tuft & Needle) | no | yes | yes | yes | yes | yes | High (by count) | **Skip as content.** Off-ICP and owner wants B2B. Add one scoping sentence + FAQ that sends brand/ads searchers to the right page (below) |
| Paid YouTube ad campaign results | no (L471 excludes) | no | yes | no | no | yes | Medium | Link to `/blog/youtube-ads-for-b2b-lead-generation` (the existing ads post); fix the L471 mis-target |
| KPIs / how to measure a YouTube case study | partial (WTDTW item 6) | no | no | no | no | yes | Low | Add Arvow's real tracking stack (UTM + per-video coupon + "which creator sent you" quiz; source: companion video, `dossier.md` L86-88) to Arvow "Steal this"; link the attribution post |
| Methodology / how examples were chosen | **yes** (L55) | no | no | no | no | no | (ours) | Strengthen with the screening count (Information gain) |
| Founder-sourced revenue + channel size + dated figures | yes, partly undated | no | no | no | partial | no | **Emerging** | Add an as-of year to every figure (Stale facts) |
| Why so few B2B companies credit YouTube | no | no | no | no | no | no | **Emerging** | New short paragraph + FAQ from dossier rejects (Information gain) |

**Stale or unsourced facts** (every location listed):

| Claim on page | Where it lives | Problem | Proposed fix | Source |
|---|---|---|---|---|
| Scalelist channel "~1,260 subs" vs "2,660 subs" | KT L62; L84; table L140 (2,660) + L143 (1,260); card L289 (both, correctly explained); L297; stat card L370; L386 | Same post states both as the channel size. The 50% claim is tied to 1,260 in L62/L143/L386 and to 2,660 in L84/L370 | One framing everywhere: "a channel of about 1,260 subscribers when the founder gave the interview (2,660 as of July 2026)". **Owner: confirm the Pulse Hero interview date**; the dossier dates 1,260 to "after 8 videos (early 2024)", not to the interview | `dossier.md` L180; Pulse Hero link L301 |
| Tiiny Host "~$15k MRR (~$180k ARR), ~1,000 paying subs" | table L121; card L232; L239 | Starter Story figure is **undated** on page. Founder's own ladder: $10k MRR in Mar 2023, so the $15k figure is 2023 or later | Add the year once verified on the Starter Story page; else write "(Starter Story, undated)". Keep the $1M (Apr 2026, Profitable Founder) as an attributed claim, as now | `dossier.md` L31-36 |
| Arvow "~$1M/yr" and "Both figures land at about $1M a year" | table L111; card L205; L212; L386 | $70K x 12 = $840K, not $1M. The founder says "basically a million dollars a year" | Attribute the $1M to the founder's words at L212; keep "~$1M/yr" in the cells as the founder's figure | `dossier.md` L79-82 |
| Arvow "grown purely with YouTube" + L471 "This post is about the organic, compounding version" | L207, L212, FAQ L477, L471 | The founder's own playbook step 3 scales winners with **YouTube in-feed paid ads**. The page frames Arvow as purely organic | Add one clause in Arvow "channel strategy": "He later put YouTube in-feed ads behind videos that stalled organically." Objectivity per §17 | `dossier.md` L87 |
| Arvow "a two-year-old tutorial" | L218 | Relative age; the companion video uploaded 2025-10-04 (JSON-LD L538) | "about two years old when he recorded it in October 2025" | JSON-LD L538 |
| LocalRank launch timing | L151, L315, L328 | Undated. The X post ID decodes to **2025-03-16** | "launched in March 2025 at..." | tweet ID 1901370127054176629 (Snowflake timestamp) |
| Arvow tweet | L212 | Undated | Optional "(June 2025)" | tweet ID 1932762748472983923 = 2025-06-11 |
| Chatwith "~5,000 signups/month, 17,000 premium users" | L340, L353 | Interview undated on page | Add the Pulse Hero interview year (owner to read off the page) | Pulse Hero link L353 |
| Subscriber counts "as of July 2026" | table header L98, cards, SVG text L174 | Dated and fine. They will be 3+ months old at ship | Optional: re-pull subs and re-run the 6 audits in the same session, and change "July 2026" everywhere (table header, 6 cards, 6 audit lines, L169 note, SVG L174 + aria-label L172, figcaption L196) | channel-audit tool |
| meta + excerpt "Verified 2026" | L5, L32 (og:description mirrors L32) | True only if the re-verification above runs | Keep only if the date fixes land | - |

No price, statistic or claim in the alt text (L7), the JSON-LD (L517-573) or the feature image
text conflicts with the body. The SVG at L172-195 matches the dossier audit table exactly.

**Information gain we can add** (real data only; nothing invented):
1. **Screening count (first-party research).** `research/teardowns/dossier.md` L210-216 and
   L224-226 record that the team screened 17 companies. 6 qualified. Borumi was cut (no
   acquisition source). 10 were rejected because no linkable founder source credits organic
   YouTube: Ahrefs, tl;dv, Apollo.io, Wistia, eWebinar, FeedHive, Salesflare, Sam
   Dunning/Breaking B2B, Tykr, Boot.dev. Proposed line in the L55 methodology note: "We screened
   17 companies that are often cited as B2B YouTube successes. Only six had a linkable founder
   source that credits organic YouTube for customer acquisition." This also answers western B2B
   buyers who expect Ahrefs or Apollo to appear. Phrase it as "we found no founder source", never
   as a claim about how those companies grow.
2. **Computed audit-score finding (first-party, from L88 table data).** The six channels average
   72 of 100 (433 / 6 = 72.2). The highest score, 90, belongs to the smallest channel (Scalelist,
   2,660 subs). The two lowest, 60 and 55, belong to channels with 28,100 and 16,800 subs. Proposed
   sentence for the "What Do All Six" section: "In this set of six, audit score did not rise with
   channel size: the smallest channel scored highest." Six is a tiny sample. State it as an
   observation about these six, never as a general rule.
3. **Optional, needs a tool run:** re-audit the six channels in October 2026 and add a dated
   "July vs October" column. This is real, fresh first-party data and the strongest §12 freshness
   signal available. Skip it if the owner does not want to spend the API quota.

**First-party data search, other locations (task 4).** I searched `research/`, `docs/`,
`traffic-reality-check.md` and `src/data/`. Only `research/teardowns/` (dossier, keyword map,
outline) and `docs/email/nurture/03-proof.md` (a reuse of the same six) hold data on this topic.
`traffic-reality-check.md` has nothing on this post. `youtube-marketing-b2b.md` L104 quotes "A
Shopify app we worked with generated 1,257 conversions from YouTube in 12 months". I did **not**
verify that claim's source, so do not reuse it here until the owner confirms it.

**CTA path.** The first CTA arrives at L55, inside the trust note and not as a CTA box. The
inline CTA at L280 sits at about 50%. The boxes at L499-515 come at the end. Fine for a roundup.
There are 6 links to the channel audit; it would be cleaner to retarget one to the autocomplete
tool (below).

## Phase 4: Refresh plan

- **Scope: light-to-moderate.** Facts, links, one paragraph added, FAQ edits. No new H2, no
  restructure.
- **URL:** keep `/blog/youtube-marketing-case-studies`. Keep every anchor id (the TOC at L71-80
  and the 11 inbound links depend on the slugged H2s).

**Sections (Keep / Modify / New / Cut):**

| Section | Verdict | Exact change |
|---|---|---|
| Intro L49-55 | Modify | L49: canonical term before the variant (AIC-04). L53: open with "These six YouTube marketing case studies show..." and stay inside 134-167 words (recount). L55: add the 17-screened / 6-qualified line. Add a visible "Last updated October 2026" line under the H1/intro **only when** the fixes ship |
| Key Takeaways L57-67 | Modify | L62: Scalelist subs framing (Stale facts). Optional: link "channel audit" in one bullet (AIC-07) |
| Contents L69-80 | Keep | No H2 change |
| Does YouTube Actually Work for B2B SaaS? L82-84 | Modify | Add the `**A YouTube acquisition channel is** ...` definition block (1-2 sentences) under the H2. Fix the "2,660" sentence to the agreed framing. Recount the answer block to 134-167 |
| The Six Case Studies at a Glance L86-197 | Modify | Add the source year to each "Sourced acquisition claim" cell (e.g. "(founder, 2025)"). L143: fix the Scalelist sub framing. SVG unchanged unless audits re-run |
| Arvow L199-224 | Modify | L212: attribute the $1M to the founder. L214: add the paid in-feed ads clause. L218: date "two-year-old". L224 "Steal this": add the real tracking stack (per-video UTM, per-video coupon, "which creator sent you" quiz) |
| Tiiny Host L226-251 | Modify | Date the $15k figure (L121, L232, L239) |
| Bulk Mockup L253-280 | Keep | The Starter Story episode is dated by the JSON-LD (2026-02-11); optionally add "(Feb 2026)" at L266 |
| Scalelist L282-307 | Modify | L289/L297: date the interview; same sub framing as the KT |
| LocalRank L309-332 | Modify | Add "March 2025" to the launch claim (L328) |
| Chatwith L334-359 | Keep | Optionally add the interview year at L353 |
| What Do All Six Channels Have in Common? L361-471 | Modify | Replace the L382 signpost with a direct answer sentence (AIC-02). Add the computed audit-score observation after L386. **L471: retarget** the ads sentence to `[whether YouTube Ads work for B2B lead gen](/blog/youtube-ads-for-b2b-lead-generation)`; it currently sends the ads question to `/blog/youtube-marketing-b2b` ("YouTube Marketing for B2B: Generate Leads"), which is not the ads post. Add one sentence: "If you came for big-brand YouTube ad campaigns (Nike, Red Bull), Google's Think with Google library covers those; this page covers B2B companies using organic YouTube for customer acquisition." Outbound link optional |
| FAQ L473-497 | Modify | See FAQ below |
| CTA boxes L499-515 | Modify | WTDTW item 1 (L507): link `[find the exact phrases buyers type into YouTube](/tools/youtube-autocomplete-keywords)`. Item 6 (L512): link `[self-reported attribution and per-video codes](/blog/youtube-marketing-attribution)` |
| JSON-LD L517-573 | Keep | ItemList + VideoObjects. No FAQPage (house rule) |
| Frontmatter | Modify | Add `updateDate` (material change). Add `metadata.title` (Title below). Leave the `faqs:` array alone; it emits nothing now that schema is off. If FAQ text changes, keep the frontmatter in sync or delete it, owner's call |

**FAQ (evidence only; source shown):**
- Rephrase for AIC-10 (same answers):
  - L475 "Does YouTube actually work for B2B?" → "Will YouTube actually work for my B2B company?"
  - L483 "How long until YouTube drives leads for a B2B company?" → "How long until YouTube brings my B2B company customers?"
  - L495 "What kind of videos should a B2B company make on YouTube?" → "What kind of YouTube videos should my B2B company make?"
- New 1 (GSC "youtube for brands case study" 1,775 impr + "youtube ads case study" 696 impr):
  "Are there YouTube case studies for big brands or YouTube ads?" The answer scopes the page (organic
  B2B) and links the ads post with a different anchor from L471, e.g. `[our YouTube Ads for B2B
  breakdown](/blog/youtube-ads-for-b2b-lead-generation)`. No brand numbers unless sourced.
- New 2 (GSC "b2b youtube case studies" pos 4.0, plus the dossier screen): "Why don't companies like
  Ahrefs or Apollo appear in these case studies?" Answer: 17 screened, 6 with a founder source
  that credits organic YouTube, the rest credit other channels or had no linkable source. Neutral
  wording only.
- PAA: none observed (method limit). Replace or confirm these after the manual Google capture.

**Internal links.** Inbound counts below come from a source grep. Before shipping, re-check on
`dist/` with `scripts/audit_internal_links.py`, since components add links that source does not
show.

*Existing inbound (11 source pages, all with distinct anchors):* b2b-video-marketing-strategy,
best-youtube-rank-checker-tools-for-business, youtube-business-plan, youtube-marketing-b2b,
youtube-roi-for-saas, youtube-script-examples-business, youtube-seo-services,
youtube-views-but-no-leads, youtube-vs-paid-ads-b2b, tools/youtube-channel-audit (44 clicks / 90d),
tools/youtube-ranking-checker (97 clicks / 90d). The exact anchor "YouTube marketing case studies"
is used by 2 sources (youtube-marketing-b2b.md L104 + youtube-channel-audit.astro), which is under
the ~3 cap. **Do not add a third exact-match anchor.**

*New inbound (pages with real GSC clicks, 90d live pull):*

| Source file | Clicks / impr / pos (90d) | Location | Proposed anchor (0 existing uses) |
|---|---|---|---|
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | 11 / 2,211 / 13.7 | After L503 ("...the prioritization step that matters most for a YouTube acquisition channel."), add one sentence: "Tiiny Host built a hosting SaaS on tutorials titled with the literal task a buyer types, see [how Tiiny Host ranks for the literal question](/blog/youtube-marketing-case-studies#tiiny-host-ranking-for-the-literal-question)." | how Tiiny Host ranks for the literal question |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | 2 / 360 / 9.7 | FAQ L338 ("...The strongest setup uses ads to accelerate an organic channel, not replace one."): append "Arvow's founder did exactly that, scaling stalled organic winners with in-feed ads ([B2B YouTube case studies with founder revenue](/blog/youtube-marketing-case-studies#arvow-founder-led-youtube-at-scale))." Mirror the change in its frontmatter `faqs` answer (L37) if kept | B2B YouTube case studies with founder revenue |
| `src/data/post/youtube-marketing-attribution.mdx` | 1 / 186 / 6.2 (weak, but topical) | L259, "Vasco, founder of Arvow (...)": link "founder of Arvow" → `/blog/youtube-marketing-case-studies#arvow-founder-led-youtube-at-scale`. **Also fix that line's claim** "scaled to $70K MRR entirely through YouTube": the founder used paid in-feed ads as well (same dossier source) | Arvow's YouTube teardown |

The homepage (24 clicks) and the 13 tool pages are higher authority. Tool pages are frozen until
the tool-fix branch lands (SEO_CONTEXT Gaps). The homepage needs a design decision, so it is
listed as a follow-up only.

*Outbound from this post (new unique targets; the post already has /tools/youtube-channel-audit):*
- `/tools/youtube-autocomplete-keywords`, anchor "find the exact phrases buyers type into YouTube"
  (0 existing uses; the top existing anchor "YouTube autocomplete keyword tool" sits on 4 source
  pages, so it is **over the cap and must not be reused**).
- `/blog/youtube-ads-for-b2b-lead-generation`, anchor "whether YouTube Ads work for B2B lead gen"
  (0 uses; existing anchors to that target are all distinct).
- `/blog/youtube-marketing-attribution`, anchor "self-reported attribution and per-video codes"
  (0 uses).
- Result: 5 unique internal targets, 2 of them /tools/. Meets the ≥4 rule either way it is read.
- "YouTube channel audit tool" exact anchor: 2 source pages (this post + create-youtube-channel-
  for-business). Under the cap; no change needed.

**Title / meta** (rendered count includes " | SellOnTube" = 13 chars; counted with python):

| Option | Topic | Rendered | Note |
|---|---|---|---|
| *Current:* 6 YouTube Marketing Case Studies With Real Revenue (2026) | 57 | **70** | over the cap |
| **A (recommended):** YouTube Marketing Case Studies: 6 B2B SaaS | 42 | 55 | exact query first; "B2B SaaS" filters non-ICP clicks |
| B: 6 YouTube Marketing Case Studies for B2B | 40 | 53 | closest to the current form |
| C: B2B YouTube Marketing Case Studies (6 SaaS) | 43 | 56 | leads with the pos-4 ICP row |
| D: YouTube Marketing Case Studies: 6 B2B Proofs | 44 | 57 | at the headroom limit |
| E: B2B YouTube Case Studies: 6 Real Revenue Wins | 45 | 58 | keeps "real revenue", drops "marketing"; 2 under the cap |

The change is **justified by the cap violation**, not by a CTR theory. Implement it as
`metadata.title` (overrides `<title>` per `src/pages/[...blog]/index.astro` L45) so the H1 can
stay. Verify in `dist/` what `og:title` uses after the change. The year is dropped: the cap cannot
hold it, and the page is undated for the reader until "Last updated" ships.

| Meta option | Chars |
|---|---|
| *Current (L32):* YouTube marketing case studies: 6 B2B companies with founder-sourced revenue. See how tiny channels win customers, not views. Verified 2026. | 140 |
| M1: YouTube marketing case studies from 6 B2B SaaS companies, with founder-sourced revenue, channel size and audit scores. Steal the buyer-intent playbook. | 151 |
| M2: 6 B2B YouTube case studies: Scalelist gets 50% of paid users from a small channel; a 370-view video won 3 customers. Founder-sourced, linked. | 141 |
| M3: Real B2B YouTube marketing case studies: how 6 SaaS companies win customers from small channels, with founder revenue quotes and audit scores. | 142 |

The meta is **optional**: the current one passes. If changed, M2 is the most concrete; check
that its numbers match the fixed body.

- **Dates:** bump `updateDate` + add a visible "Last updated" line: **yes, material** (facts
  fixed, paragraph and FAQ added, links). Do not bump for a title-only change.
- **Skipped on purpose:** big-brand and ads case-study content (off-ICP; the owner wants B2B);
  new teardowns (dossier: "top up in quarterly refresh"); new H2s; any `youtube case study`
  targeting (policy and platform intent); a slug change; a new SVG; JSON-LD changes; the
  `/youtube-video-ideas/agency-case-study-videos` overlap (different intent, pos 24, leave).

## Buyer prompts for the owner to run by hand (ChatGPT, Perplexity, Google AIO)

Log for each one: our citation (Y/N), cited URLs, and whether a 2,660 or 1,260 figure appears.

| ID | Prompt | Source |
|---|---|---|
| P1 | "Give me YouTube marketing case studies from B2B SaaS companies with real revenue numbers." | GSC "youtube marketing case study" (2,101 impr) |
| P2 | "Which B2B companies actually get customers from YouTube?" | GSC "b2b youtube case studies" (pos 4.0) |
| P3 | "Is there a YouTube for brands case study a small SaaS company can learn from?" | GSC "youtube for brands case study" (1,775 impr) |
| P4 | "Do YouTube ads work for B2B? Show me case studies." | GSC "youtube ads case study" (696 impr) |
| P5 | "Do I need a lot of subscribers to get customers from my YouTube channel?" | Existing FAQ L487 + GSC "youtube channel success case studies" |

No PAA was observed, so no prompt comes from PAA.

## Scope verdict

**Light-to-moderate.** About 15 line-level edits, 1 paragraph, 2 FAQ items, 3 FAQ rephrasings, 3
outbound links, 3 inbound links on other posts, 1 metadata.title, and `updateDate`. Must-fix:
the title cap and the Scalelist number contradiction. Should-fix: the L471 link target, the
undated founder figures, the Arvow paid-ads clause, and the definition block. Nice-to-have: the
October re-audit, the meta change, and the homepage link. These edits make the page more accurate
and more extractable. They do not promise ranking, click or citation gains; the demand drop is
outside the page's control.

## Phase 5: Approval
- [ ] Owner approved on ____. Notes:
- [ ] Owner confirms the Pulse Hero (Scalelist, Chatwith) and Starter Story (Tiiny Host) dates.

## Judging (filled later)
- Deploy date · live check · URL Inspection lastCrawlTime after deploy.
- 28 / 90-day read on the same query rows ("b2b youtube case studies", "youtube marketing case
  study"), plus western GA4 sessions to this page. Re-run P1-P5 one month after deploy.
