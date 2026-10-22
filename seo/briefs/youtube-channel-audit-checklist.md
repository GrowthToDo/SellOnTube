# Article Brief - YouTube channel audit checklist for business channels

Mode 03, drafted 2026-10-22. Status: awaiting approval. Branch `blog/youtube-channel-audit-checklist`
(worktree off `origin/main` 605c8d8). Slug: `/blog/youtube-channel-audit-checklist`.

- **Searcher:** a founder, marketer or agency operator whose company already posts on YouTube, who
  suspects the channel is not producing customers and wants a structured way to find out why.
  Problem-aware, not yet solution-aware.
- **Search query and evidence class:**
  - Lead: `youtube channel audit checklist`. KP-band (DataForSEO Google Ads, paid export on hand):
    US 10, IN 10. SERP-observed 2026-10-22: weak top 10.
  - Secondary: `how to audit a youtube channel`. KP-band: no volume returned (null). SERP-observed
    2026-10-22.
  - Head (owned by the tool page, not this post): `youtube channel audit`. KP-band US 70, IN 260.
    GSC-measured 90d to 2026-10-20: 113 impressions, 0 clicks, page attribution mostly the tool page
    at position ~41 (2026-10-03 pull).
  - Cluster, GSC-measured 90d (queries matching "audit"): West 2 clicks / 203 impressions, non-West
    7 clicks / 149 impressions. Most of the tool page's clicks sit in the anonymised long tail.
- **Intent / buying proximity / product relevance / business value:** informational-to-transactional
  (the job needs an action). Proximity: high to the tool, low to the agency. Relevance: direct, since
  the tool scores half the checklist. Value: feeds the site's best-converting tool page.
- **Job:** "Tell me whether my company's YouTube channel can produce customers, and what to fix
  first."
- **Pain:** the channel gets views or nothing, and no leads trace back to it. Customer words not
  captured (CUSTOMER_VOICE is PARTIAL for this topic); SERP signal: Reddit "Are YT Channel
  Audits/Strategists Scams?" (r/PartneredYoutube, seen in the 2026-10-03 SERP), so paid audits are a
  live doubt.
- **Desired outcome:** a scored list of what is broken, ordered by impact on leads, done in under an
  hour without paying for an audit.
- **SERP and gap:** every ranking page audits for audience growth (views, subscribers, CTR, AVD,
  thumbnails). **No ranking page checks whether a channel turns viewers into leads: tracked links,
  description CTAs, buyer-intent titles, attribution.**
- **Differentiation:** a two-part audit (public metadata you can score in seconds, then the Studio
  and attribution checks only you can see), pass/fail thresholds per check, a fix-first order, and
  real scores from channels that publicly credit YouTube for customers.
- **Product connection:** `/tools/youtube-channel-audit` reads the public metadata of the last 10
  videos and scores 4 dimensions at 0-25 each: Title Quality, Description Quality, Publishing
  Consistency, SEO Optimization. It also rates each video's title and description good, fair or poor
  and returns 3 recommendations. Source: `netlify/functions/channel-audit.ts` on `main`. It does
  not read Studio analytics, traffic sources, retention, link clicks or leads, and it sees only the
  first 200 characters of each description. The post says all of this plainly.
- **Install Test (here: tool run, the site's conversion):** **Moderate.** The tool does half the
  job in about 20 seconds, so the click is earned. Two limits: demand is small and mostly Indian,
  against the north star of western visitors; and the head term belongs to the tool page.
- **Conversion path:** see CTA plan.
- **Evidence sources:** live GSC pulls (2026-10-03, 2026-10-22), DataForSEO SERP and volume
  (2026-10-03, 2026-10-22), `netlify/functions/channel-audit.ts`, live audit of @scalelist run on
  sellontube.com 2026-10-03, `src/data/post/youtube-marketing-case-studies.mdx` (6 channel scores,
  July 2026).

## Gate check (FRAMEWORK §3)
1. Somebody searches this: **Y**. KP-band plus GSC-measured impressions in the cluster; small.
2. Searcher is the ICP: **Y, with a filter.** The SERP is creator-heavy; the title and intro must
   say "business channel" so creators self-select out.
3. Product is a shipped answer: **Y.** Tool live; health check PASS on 2026-09-30 and 2026-10-02.
   Re-check at draft time.
4. First page does not already say it: **Y.** Gap above.
5. Every claim verifiable: **Y.** All numbers trace to the sources listed.

**Priority: P2.** Clean gap and a direct tool bridge, but low volume and non-western demand.

## SERP table (US, 2026-10-22, DataForSEO)

| # | `how to audit a youtube channel` | `youtube channel audit checklist` |
|---|---|---|
| 1 | navigatevideo.com (agency, free-audit lead magnet) | lenostube.com (tool) |
| 2 | facebook.com post | vidiq.com/audit (tool) |
| 3 | fundmates.com (guide) | socialinsider.io (guide + tool) |
| 4 | reddit.com (tool launch thread) | overseeros.com (checklist) |
| 5 | victorialevitan.com (coach) | genelify.com (tool) |
| 6 | searchengineland.com (brand audit guide) | channelfuel.co (agency) |
| 7 | neilpatel.com (why audit) | reddit r/SmallYoutubers |
| 8 | (none) | flow-agency.com (gated checklist) |

Features: AI Overview on both (no references returned), video pack, PAA. PAA captured: "How do I
audit my YouTube channel?" (2026-10-22), "What should be included in an audit checklist?"
(2026-10-22), "How can I check the health of my YouTube channel?" (2026-10-03), "Can ChatGPT
analyze my YouTube channel?" (2026-10-03).

## Information gain (each with proof source)
1. A live audit of a channel whose founder credits YouTube with half of paid users: Scalelist 85/100
   (Title 21, Description 21, Consistency 25, SEO 18), with the weak dimension explained.
   Proof: live run 2026-10-03, screenshot captured.
2. Six B2B channels that publicly credit YouTube for customers score 55 to 90; none below 40.
   Proof: case-studies post table.
3. Lead-path checks absent from every ranking page: tracked link in the first 150 characters of the
   description, pinned comment with a link, UTM to GA4, a "how did you hear about us" field.
4. The tool's limits stated exactly (public metadata only, last 10 videos, 200-character
   description window), so readers know which half they must do in Studio.

## Gap-felt plan
Teach the full manual audit: score titles, descriptions and cadence by hand, then the Studio checks
(traffic sources, search terms report, CTR, retention) and the attribution checks. The manual method
stops at the metadata half: scoring 10 videos against the same rubric is slow and inconsistent. The
tool does that half. The Studio and attribution checks stay manual, and the post says so.

## Competitor claims
| Claim | Source | As of | Second source |
|---|---|---|---|
| vidIQ offers a free channel audit tool | vidiq.com/audit (SERP title) | 2026-10-22 | vidiq.com/features/channel-audit (SERP 2026-10-03) |
| TubeBuddy has a channel audit tool page | tubebuddy.com/tools/youtube-channel-audit (SERP) | 2026-10-03 | unverified |
Plan: name them only as alternatives for creator metrics. No feature or price claims unless
browsed and dated at draft time.

## CTA plan
| Touch | Position | Earned by | Ask | Destination |
|---|---|---|---|---|
| 1 | End of the metadata section | Reader has just seen 10 videos x 4 checks done by hand | "Score your last 10 videos in about 20 seconds" | `/tools/youtube-channel-audit` |
| 2 | "What to do this week" box, item 1 | Action list | Run the audit, fix the lowest dimension | same |
| 3 | Bottom | House rule (agent 04: bottom CTA is always book a call) | Book a 30-minute call | Cal.com booking link via the existing CTA component |
Omissions: no UTMs on internal links (site convention); no "no sign up" bait (the tool gates after
3 audits, so the post says "3 free audits, then a business email"); no `toolCta` frontmatter (the
body already links the tool, CTA stacking rule).

## FAQ (signals)
1. How do I audit my YouTube channel? (PAA 2026-10-22)
2. What should a YouTube channel audit checklist include? (PAA "What should be included in an audit checklist?" 2026-10-22; GSC `youtube channel audit checklist`)
3. How can I check the health of my YouTube channel? (PAA 2026-10-03)
4. Can ChatGPT analyze my YouTube channel? (PAA 2026-10-03)
5. Is a paid YouTube channel audit worth it? (Reddit thread in SERP 2026-10-03; GSC `free youtube channel audit`, `youtube channel audit free`)
Visible `## FAQ` in body; frontmatter `faqs` too, though FAQPage schema is off by policy (layout still emits it until the code change lands).

## Internal links
Out (at least 4, one tool):
- `/tools/youtube-channel-audit` (CTA touches 1-2; anchors must differ from the 3 already used corpus-wide: "YouTube channel audit", "channel audit tool", "run a free channel audit").
- `/blog/youtube-marketing-case-studies` (source of the six scores).
- `/blog/youtube-channel-optimization-checklist` (the fix list after the audit finds problems).
- `/tools/youtube-seo-tool` (single-video fixes) or `/blog/youtube-titles-for-business` (title fixes).
- `/blog/youtube-marketing-attribution` (attribution section).
In (from pages with real clicks, live):
- `/blog/youtube-marketing-case-studies` (11 clicks/90d, pos 15.6): sentence near the score table.
- `/blog/youtube-channel-optimization-checklist` (pos 8.0): intro sentence pointing to "audit first, then fix".
Overlap check: the optimization checklist targets setup fixes ("youtube channel optimization
checklist"); this post targets diagnosis. Different head terms, cross-linked both ways.

## Title and meta (cap 60 incl. " | SellOnTube", so 47 for the topic)
1. `YouTube Channel Audit Checklist for Business` (44)
2. `YouTube Channel Audit: A Checklist for Leads` (44)
3. `How to Audit a YouTube Channel for Leads` (40)
Recommended: 1. Meta draft (<155): "Audit your business YouTube channel in under an hour: score 10
videos, check Studio, trace leads. Includes real scores from 6 B2B channels."

## Takeaways claims (audited in mode 05)
- An audit for a business channel asks whether videos produce leads, not whether views grow.
- Public metadata (titles, descriptions, cadence, SEO) can be scored in seconds; analytics and
  attribution need Studio access.
- Six channels that credit YouTube for customers scored 55-90 on the SellonTube audit; none below 40.
- Even Scalelist (85/100) has a weakest dimension: SEO at 18/25.
- Fix the lowest-scoring dimension first.
Early direct answer: a 134-167 word answer block in the first 30%.

## Screenshot list
| Visual | Job | Proves | Caption | Source |
|---|---|---|---|---|
| Scalelist audit result (score + 4 dimensions + recommendations; video list collapsed) | Show the tool output | Claim 1 | Score, dimensions, recommendations; video-by-video list omitted | Live tool, gstack browse. Recapture at 2x (L-CL-05); current capture is 1x |
| Inline SVG: two-part audit (public metadata vs Studio/attribution) | Orient the framework | Gap-felt split | none needed | Hand-built, light palette |
| Video: Alexa Saarenoja, "This Simple Channel Audit Shows You Exactly How to Grow Faster" (86AgqppQsDk, embeddable) | Packaging-side walkthrough | Supports the channel-page checks | Says it covers packaging; this post adds lead checks | YouTubeFacade |
| Featured image | Required | n/a | n/a | Raster 1200x630 per `seo/site-kit/brand-visuals.md` |

## Scenario sources
Scalelist and the six channels: case-studies post plus the live audit. Any title-rewrite example
for a SaaS or services firm is marked illustrative.

## Verdict plan
Baseline at publish: tool page 28d = 15 clicks / 189 impressions (to 2026-10-20). Target queries:
`youtube channel audit checklist`, `how to audit a youtube channel`, `youtube seo audit`.
At 90 days, after URL Inspection confirms a crawl later than publish:
- Working: indexed, top 20 for the lead query, and GA4 shows sessions moving from the post to the
  tool page.
- Refresh: indexed with impressions but no post-to-tool sessions. Fix the CTA placement.
- Rewrite: indexed and below position 40 on all target queries.
- Prune: not indexed after two Request Indexing attempts.

---

# Research update 2026-10-22 (keywords, SERP, PAA)

Raw files: session scratchpad `research/` (keywords.md, serp-competitors.md, paa-questions.md).
DataForSEO spend this round about $0.69 (paid export on hand; labeled KP-band / SERP-observed).

- Keywords: primary `youtube channel audit checklist` (KP 10 US / 10 IN). Secondary: `how to audit a
  youtube channel` (KP 10 US/IN/UK), `youtube channel audit report` (10/10/10), `youtube channel audit
  template` (autocomplete), `channel audit definition` (GSC 18 impr). Every business variant
  ("for business", "b2b", "brand", "marketing audit") returned null volume, so the B2B angle lives in
  the title and framing, not the keyword. Tool page keeps `tool`, `free`, `audit my youtube channel`.
  Drop `youtube seo audit` (half its SERP is website audits). `youtube audit`, `channel checker`,
  `channel review`, `channel analysis` are creator or First Amendment noise.
- SERP: tools own the head term; checklist hybrids win article slots (OverseerOS ~4,300 words with a
  50-point scorecard; OutlierKit 65 items + xlsx; MilX; Navigate Video, the only article an AI
  Overview cites). 4 of 9 ranking articles are stale (Creator Studio era). No featured snippet. Video
  pack on all 8 SERPs.
- Gap confirmed: 0 of 9 articles measure leads (UTM, GA4 referral, "how did you hear", leads per
  video). Also uncovered: description as a conversion surface, buyer-intent topic audit, public-data
  audit, audience-to-ICP match, current Studio features.
- PAA (ICP fit): How do I audit my YouTube channel? / What should be included in an audit checklist? /
  How can I analyze a YouTube channel? / Can ChatGPT analyze my YouTube channel? / How do I know if my
  YouTube channel is doing well? / What does a marketing audit include? Forum: "Are YT Channel
  Audits/Strategists Scams?" ranks #2 for the "for business" query. The US AI Overview is a creator
  Studio audit; it misses lead tracing, pipeline numbers, buyer-intent coverage and next-step surfaces.
  Google already cites `/blog/youtube-views-but-no-leads` for the "not getting leads" query.

# Detailed outline (BRF-06), awaiting approval

Archetype: how-to checklist hybrid. Author: Gautham. Length guidance from SERP: ~2,800-3,300 words
plus tables (STR-07, not a target). Slug `/blog/youtube-channel-audit-checklist`.
Title tag: `YouTube Channel Audit Checklist for Business` (44 + 13 suffix = 57).
H1: `YouTube Channel Audit Checklist for Business Channels`.
Meta (<155): "A YouTube channel audit checklist for business channels: score 10 videos, check Studio,
and trace leads to videos. With a copyable scorecard and real scores."

| # | Section | Block | Point it makes | Evidence | CTA |
|---|---|---|---|---|---|
| 0 | Intro (~100 words, how-to pattern) | prose | Scene: 40 videos, steady views, no demo traced to YouTube. Promise: in about an hour you know whether the channel can produce customers and what to fix first. For company channels, not creators | scene framed as typical, no stat | none |
| 1 | Key Takeaways | blue callout, 5 bullets | Direct answer and tool link; public vs private halves; six channels scored 55-90; Scalelist 85 with SEO 18/25; fix the lowest dimension first | case-studies table, live audit | link only |
| 2 | Contents | markdown list | H2s | - | - |
| 3 | H2 What is a YouTube channel audit for a business channel? | definition block, 134-167 word answer block, styled table "Creator audit asks / Business audit asks" (6 rows) | The audit tests whether videos reach buyers and give them a next step, not whether views grow | coverage matrix | none |
| 4 | H2 The four parts of a business channel audit | inline light SVG: public metadata (anyone, incl. competitors), next-step surfaces, Studio signals (owner only), lead tracing (owner + CRM), time per part | Frames the checklist and shows which half needs Studio access | tool code | none |
| 5 | H2 Part 1: score your last 10 videos | numbered H3 steps: titles (buyer-intent test), descriptions (first 150 chars: reason + tracked link), publishing consistency (gap rule), search packaging (chapters, playlists, tags) | Each step: check, pass/fail, one fix. Two title rewrites (SaaS, services firm) labelled illustrative | tool rubric | Gap felt at the end (10 videos x 4 checks by hand is slow and drifts), then CTA 1 to the tool with honest limits: public metadata of last 10 videos, first 200 description characters, no analytics, 3 free audits then a business email |
| 6 | H3 What a real audit looks like: Scalelist | 2x screenshot + caption | Scores per dimension; the Shorts-heavy library explains the SEO score. Six case-study channels range 55-90, none under 40 | live re-run at draft (report that run's numbers and date), case-studies post | none |
| 7 | H2 Part 2: check every place a viewer can take the next step | H3 checks: channel page says who it is for; banner and About links; pinned comment with link; end screen to the bottom-funnel video; landing page matches the video | Conversion surfaces nobody else audits | brief | link optimization-checklist post; video facade (Alexa Saarenoja) with a context sentence |
| 8 | H2 Part 3: read YouTube Studio like a buyer, not a creator | numbered H3s: traffic-source search share, search terms report (buyer queries present?), CTR read only with enough impressions, retention on bottom-funnel videos, audience geography vs your market | The half the tool cannot see; business thresholds | Studio features verified at draft, no unverified feature names | none |
| 9 | H2 Part 4: trace leads back to videos | UTM code block, GA4 path, "how did you hear about us" field, leads-per-video table (illustrative rows labelled), yellow warning callout (a channel you cannot trace gets cut at budget review) | The core gap | link attribution post | none (tool CTA only mid-body, house rule) |
| 10 | H2 The business channel audit scorecard | styled HTML table (~16 rows: Check / Pass / Fail / Where to check / Fix priority) + plain copyable code block | The template competitors gate behind email; ours is open | assembled from Parts 1-4 | none |
| 11 | H2 What to fix first: symptoms and likely causes | styled table: Symptom / Likely cause / First fix / Read next | Prioritisation; "views but no leads" row links the existing post | existing posts | none |
| 12 | H2 Should you pay for a YouTube channel audit? | Decision guide callout (DIY when / pay when) + red flags | Answers the "scam" objection honestly, incl. that free audits are often lead bait and our own call CTA is disclosed | forum thread titles only | none |
| 13 | H2 FAQ | 6 x H3 + answer | How do I audit my YouTube channel? / What should a YouTube channel audit checklist include? / How do I know if my business YouTube channel is working? / Can ChatGPT or an AI tool audit my YouTube channel? / How often should I audit my YouTube channel? / Why is my channel getting views but no leads? | PAA rows, forums | tool mention in the AI question, disclosed |
| 14 | What to Do This Week | green callout, 6 items | Item 1 = run the audit, fix the lowest dimension | - | CTA 2 (tool) |
| 15 | Closing line + book-a-call | house CTA component | Concrete call outcome: a walk-through of your audit results | agent 04 bottom-CTA rule | CTA 3 (call) |

AEO: definition blocks ("YouTube channel audit" for a business, "next-step surface"); answer block in
section 3; question H2s (3, 12); first-party data (six scores, live Scalelist run); canonical entity
terms ("B2B YouTube", "customer acquisition", "buyer-intent video"); each section opens by answering
its heading; visible FAQ; frontmatter `faqs` kept, FAQPage schema off by policy.

Links out (>=4): `/tools/youtube-channel-audit` (anchors new to the corpus), `/blog/youtube-marketing-case-studies`,
`/blog/youtube-channel-optimization-checklist`, `/blog/youtube-marketing-attribution`,
`/blog/youtube-views-but-no-leads`, `/blog/youtube-titles-for-business`.
Inbound (live, ranking): `youtube-marketing-case-studies`, `youtube-channel-optimization-checklist`,
`youtube-views-but-no-leads`.
Media: Scalelist screenshot (2x, header hidden, video list collapsed, caption says so); inline light
SVG; YouTubeFacade 86AgqppQsDk; raster 1200x630 featured image.
