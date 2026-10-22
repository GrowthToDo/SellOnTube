# Refresh plan - https://sellontube.com/blog/youtube-business-plan - 2026-10-22

Citability refresh plan (mode 07 phases 1-4 + mode 09 step 7). READ-ONLY run: no repo file was edited.
Source file: `src/data/post/youtube-business-plan.mdx` (514 lines), read from `SellonTube-wt-top5` at
`605c8d8`. Rendered checks ran on the live page (`curl`, 2026-10-22, HTTP 200), not on `dist/`.
No ranking, traffic or click gain is promised anywhere in this plan.

---

## Trigger

- Head query "youtube business plan": 326 impr / 1 click / pos 11.5 (90d, 2026-07-22..10-19, live
  GSC API pull 2026-10-22, `sc-domain:sellontube.com`, page = exact URL). Daily position for that
  query sat at 6.8-8 on 10-06..10-08, then 9-17.5 every day 10-09..10-19 (same pull, `date`
  dimension). Caller's figures: pos 7.8 prior 28d → 12.6 last 28d, out of the top 10 for 11 days.
  My pull agrees on direction; I did not re-run the 28d vs 28d split.
- Page total: 3 clicks / 984 impr / pos 10.7 (exact URL). Fragment URLs add 272 impr, 0 clicks:
  `#what-a-youtube-business-plan-covers` 88, `#revenue-model-leads-and-sales-not-ad-revenue` 85,
  `#90-day-content-calendar-template` 51, `#costs-equipment-editing-and-time-investment` 48.
- Bot check: USA 470 impr / 1 click / pos 13.2; GBR 24, AUS 10, BRA 8, CAN 6. The caller reports
  ~80% human. I did not re-run the clicks-at-position-by-country test. Treat the impressions as a
  weak signal and judge the refresh on clicks and GA4 sessions only (SEO_CONTEXT bot rule).
- Refresh before new: the page already ranks on page 1-2 for 5 query rows with no cannibalization.
  Blog writing is paused (`growth-strategy.md`), and existing posts may still be refreshed.

## Phase 1: Current state

| Query (exact URL, 90d) | Impr | Clicks | Pos |
|---|---|---|---|
| youtube business plan | 326 | 1 | 11.5 |
| youtube channel business plan | 143 | 0 | 13.1 |
| youtube business plan template | 34 | 0 | 16.9 |
| business plan for youtube channel | 15 | 0 | 11.0 |
| channel business plan | 14 | 0 | 16.8 |

(With `page contains youtube-business-plan`, which includes the fragments, "youtube channel
business plan" rises to 259 impr. The table above uses the exact URL.)

- Live page check: title `YouTube Business Plan: Build a Channel That Pays for Itself | SellOnTube`
  = **72 chars (cap 60)**. Meta = 128 chars (OK). Canonical correct. og:image =
  `youtube-business-plan-featured...svg` (**SVG, fails the raster rule**). JSON-LD = BlogPosting +
  BreadcrumbList, no FAQPage (correct). `datePublished` = `dateModified` = 2026-06-08T18:30Z. No
  visible "Last updated". No video embed. 3 visible `?` question headings render (FAQ OK).
- Inbound internal links: 1 body link (`youtube-break-even-math.mdx` L378, anchor "a full YouTube
  business plan template") + 1 pSEO card (`src/data/niches.ts` L1837). None of the pages with real
  clicks link to this post.
- Strengths to keep: the four H2s that earn fragment impressions, the 3-tier cost table, the
  buyer-stage 90-day calendar, the break-even section, and the copyable template (no SERP rival
  shows a B2B lead-based plan; most rivals gate their template behind a signup).
- Weaknesses: no early answer block; internal cost contradictions (see Stale facts); unsourced
  algorithm claim repeated 3 times; no first-party data; a markdown link printed as literal text
  inside the template; the heading says "(Download)" but no download exists; canonical entity
  terms absent; SVG feature image; no video.

## AIC-01..10 + ai-seo-guide §16 audit (source line refs; rendered checks on the live page)

| ID / rule | Verdict | Evidence (line) | Fix |
|---|---|---|---|
| AIC-01 / §16 R1 answer block (134-167 words, first 30%, standalone) | **FAIL** | L39-45 is a narrative hook; the definition at L70 is about 50 words; Key Takeaways (L47-56) is a list | Add one 134-167-word standalone paragraph right after the L70 definition. It answers "what goes in a YouTube business plan", names the 4 pillars, gives the cost range and the break-even rule, and names the ROI calculator as the way to run the numbers |
| AIC-02 / §17 first sentence mirrors heading | **FAIL** (4 of 6 H2s) | L90 "This is the section that stops most business owners."; L178 "This is where a business plan ... diverges"; L204 "A content calendar without a strategy..."; L280 "Every business YouTube plan needs a timeline section." Pass: L70, L352 | Rewrite only the first sentence of each section to answer its heading, e.g. L90 → "A B2B YouTube channel costs $200-500 a month DIY, $800-1,500 hybrid and $1,500-3,000 outsourced, at 4 videos a month." Keep the H2 text unchanged (anchor ids) |
| AIC-03 / §16 R4 definition blocks | PASS (partial) | L70 `<dfn>` holds a bold term + 2 sentences | Add 2 more: **True monthly cost** (cash + founder hours x rate) under the Costs H2, and **Break-even point** under L308 H3. Format `**Term** is ...` |
| AIC-04 / §16 R2 entity terms | **FAIL** | "B2B YouTube" 0, "YouTube acquisition channel" 0, "buyer-intent video" 0, "customer acquisition" 0 in the body; the banned variant "business YouTube" appears 10 times (L22-24, 92, 184, 198, 280, 498-502) | Introduce "B2B YouTube" and "YouTube acquisition channel" in the new answer block before any variant. Swap about half of the "business YouTube channel" uses. Keep the query phrase "business plan for a YouTube channel" (it matches GSC rows) |
| AIC-05 / §16 R3 first-party data | **FAIL** | L196 "In our experience, B2B channels earn $2-8 per 1,000 views" (no data in repo); L173 "the most common waste we see" (anecdote) | Add the fold study (see First-party data) to Revenue Model step 3 (L190). Retract the "$2-8 in our experience" figure or replace it with a sourced third-party RPM |
| AIC-06 / §17 lift-able language | **FAIL** | L45 "spoiler"; L192 "revenue machine" / "expensive hobby"; L152 "80% of the production quality" (unverifiable); L54/L80/L386 "minimum for YouTube to treat your channel as active" (unverifiable algorithm claim); L78 "underestimate this by 50%" (unsourced) | Restate as checkable claims or as SellonTube's labelled recommendation ("We recommend 4 videos a month because 12 videos in 90 days gives three full buyer-stage cycles to compare") |
| AIC-07 takeaways / TOC / diagrams name + link the app, pass the claim audit | **FAIL** | Key Takeaways L50-54: no tool link; L54 repeats the algorithm claim; the L52 "500 subscribers / 5 clients" figure is an unsourced illustration. SVG L315-347 names no tool | Takeaway 4 → link the ROI calculator. Cut or relabel L54. Label L52 as an illustration. TOC: add the new H2 |
| AIC-08 reads the same without AI search | PASS | Practical structure, real tables | Keep. The answer block must read as the intro to the section, not as a pasted box |
| AIC-09 tables stand alone | PASS with defect | The cost table (L94-150) and calendar (L208-259) stand alone, but the cost table contradicts the FAQ (see Stale facts) | Reconcile the numbers so any table or FAQ quoted alone is still correct |
| AIC-10 / §16 R5 conversational FAQ, visible | PASS (thin) | 3 visible H3 questions (L492-502), "I" used once; rendered `?` headings = 3 | Add 3 questions from evidence (Phase 4). Rephrase the existing 3 only if the ids are not linked anywhere (they earn no fragment impressions) |
| §16 media (§18): image + relevant video, perf-safe | **FAIL** (video) | 1 inline SVG chart + tables; no video | Add 1 `YouTubeFacade` embed of the Mike and Matty AdSense video (verified live via oEmbed 2026-10-22, id `agoxvqoBQBI`) in Revenue Model, with a caption and alt text |
| §12 freshness: visible "Last updated" | **FAIL** | No `updateDate`; dateModified = publish | Set `updateDate` on the material refresh. Show the date if the template supports it. Never bump `publishDate` |
| SEO_CONTEXT raster feature image (edited posts) | **FAIL** | L6 `image: ...featured.svg`; og:image renders the SVG | Export a 1200x630 PNG (`youtube-business-plan-featured.png`), point `image:` at it, and keep width/height 1200x630 |
| SEO_CONTEXT ≥4 internal links incl. one `/tools/` | PASS | Body links: content-strategy-guide, autocomplete-b2b-research, create-channel, script-examples, case-studies, marketing-roi, break-even-math, `/tools/youtube-roi-calculator` x2 | Add 2-3 tool links (Phase 4). Fix the L455 dead link |
| Title ≤60 rendered | **FAIL** | 72 chars rendered | Phase 4 options |

**Build defect (not an AIC item):** L455 sits inside a ``` code fence, so
`[channel optimization checklist](/blog/youtube-channel-optimization-checklist)` renders as
literal markdown text inside the copyable template (live page confirms: no href to that post).
Readers who copy the template paste raw markdown. Fix: inside the fence write
`(see the channel optimization checklist)`, and add the real link in prose under the template.

## Phase 2: SERP read (dated 2026-10-22, method WebSearch US + WebFetch of 4 results)

WebSearch returns a list of links, not a ranked SERP with positions, so "Pos" means the order
returned for "youtube business plan". The three queries returned almost the same set.

| # | URL | Publisher type | Format | Covers that we skip | Last updated |
|---|---|---|---|---|---|
| 1 | planbuildr.com/?p=2197 | Business-plan software vendor | Filled-in sample plan (cooking channel) | Executive summary, industry analysis, competitive analysis, management team, a **5-year income statement, balance sheet and cash flow**; FAQ "What are the Main Types of YouTube Businesses?", "How Do You Get Funding for Your YouTube Business Plan?" | none shown |
| 2 | upmetrics.co/template/youtube-business-plan (+ PDF) | Business-plan software vendor | 9-section guide + **PDF/Word download** | Exec summary, market analysis, sales and marketing, appendix, financial-plan components (P&L, cash flow, break-even, financing); FAQ "Why do you need a YouTube business plan?" | dateModified 2024-02-19 |
| 3 | clickup.com/templates/business-plan/youtube-channel | PM-software vendor | App template (signup) | Goals, target market, financial projections; aimed at investor/sponsor pitch (snippet only, not fetched) | not checked |
| 4 | theleap.co/?p=5769 | Creator-monetization platform | 5-step guide + gated template bundle | Niche selection, content pillars, **5 creator monetization streams** (ads, digital products, brand deals, affiliate, memberships), revenue projection over time | Published 2024-07-17 |
| 5 | taskade.com/templates/business-plan/youtube-creator-business-plan | AI-workspace vendor | App template | Monetization mix, growth targets, team hiring, sponsorship pipeline (snippet only) | not checked |
| 6 | ogscapital.com/?p=15914 | Business-plan consultancy | Sample plan | Not fetched | not checked |
| 7 | subscribr.ai/.../youtube-channel-money-plan-business-strategy | Creator tool | Guide | Creator revenue paths beyond AdSense, named creator income anecdotes (no external sources, no template) | none shown |
| 8 | creatorhandbook.net/how-to-create-a-business-plan-as-a-youtuber | Creator blog | Guide | Not fetched | not checked |
| also | template.net (editable Word/Docs/Pages, magician example), a .edu.py PDF mirror, tech.mozilla.com.tw template page | Template sites / spam mirrors | Download | Exec summary, start-up costs, products and services | - |

**SERP features:** AIO, featured snippet, PAA and video packs were **not observed**, because
WebSearch does not expose them. No PAA question is quoted as PAA in this plan. The competitor FAQ
questions above are quoted verbatim from their pages, not from PAA. To confirm, run a manual
`google.com/search?q=youtube+business+plan&nfpr=1` incognito check from a US IP.

**Intent mix:** about 9 of 9 results are **creator / channel-as-a-business** or
generic-business-plan-format (exec summary + financials, investor framing). **Zero** results take
the "YouTube as a B2B acquisition channel" angle. That gap is our wedge, and it is also why the
head term has a ceiling: most searchers want a traditional business-plan document for a creator
channel.

**Winnability:** no 3+ big brands (ClickUp is the only large brand). The top results are vendor
templates, so a well-structured free, ungated template can compete. Aim at the 5 query rows we
already earn, not a new head term.

## Phase 3: Gap analysis

C1 PlanBuildr · C2 Upmetrics · C3 The Leap · C4 ClickUp (snippet) · C5 Taskade (snippet)

| Topic / element | Us | C1 | C2 | C3 | C4 | C5 | Priority |
|---|---|---|---|---|---|---|---|
| Real downloadable / duplicable file (Doc, PDF, Sheet) | no (code block only, heading says "Download") | no | yes | yes (gated) | yes | yes | **High** |
| Financial projection over time (12-mo or multi-year) | partial (budget + break-even, no month-by-month projection) | yes | yes | yes | yes | yes | **High** |
| Monetization / revenue streams list | partial (AdSense dismissed; template L445-447 lists 2) | yes | yes | yes | ? | yes | **High** (serve via the creator-vs-B2B box, do not become a creator guide) |
| Operations / team roles | yes (template S6) | yes | yes | yes | - | yes | covered |
| Executive summary section in template | no | yes | yes | no | ? | no | **Medium** |
| Market + competitive analysis | partial (template "Top 3 Competitors") | yes | yes | no | yes | no | **Medium** |
| Filled-in worked example | no | yes | yes | yes (examples) | no | no | **Medium** |
| Funding / investors FAQ | no | yes | yes | no | yes | no | Medium, **skip** (off-ICP) |
| True cost incl. founder time x hourly rate | yes | no | no | no | no | no | **Emerging** (keep, sharpen) |
| Buyer-stage content calendar | yes | no | no | no | no | no | **Emerging** (keep) |
| Lead-based revenue model + break-even per client value | yes | no | partial | partial | no | no | **Emerging** (keep, add the ROI calculator) |
| First-party data on B2B YouTube descriptions (link placement) | no | no | no | no | no | no | **Emerging**: add the fold study |

**Information gain we can add (backed by repo data only):** the fold study (below), the ROI
calculator's LTV/margin logic, and the creator-vs-B2B decision table using SellonTube's ICP lens.

### Intent decision: serve both without leaving the B2B angle

Add one short H2 high on the page: **"Creator Plan or B2B Plan: Which Do You Need?"** It holds a
2-column decision table (creator plan: revenue = AdSense, sponsors, memberships, merch; success =
audience size; plan centres on a multi-year P&L. B2B plan: revenue = clients; success = leads and
cost per lead; plan centres on break-even per client value). Under the table, add 2 sourced creator
facts: the YPP thresholds and the Mike and Matty AdSense figures. Then add one routing sentence: "If
you are a creator, the template's Sections 2, 3 and 6 still apply; swap Section 4 for your
monetization mix." The template gains an optional "Revenue streams" row block, so creators can use
it, but every example stays B2B. This passes the ICP Lens Rule (`docs/icp.md`), because the section
answers "why does a business need a different plan". The ICP fit test still fails for pure creator
searchers, so accept that part of the "youtube channel business plan" demand will bounce. Do not
chase it.

### Stale / unsourced / contradictory facts (every location)

| Claim on page | Where it lives | Problem | Fix / source |
|---|---|---|---|
| Monthly cost "$200-2,000" | excerpt L5, FAQ frontmatter L22, FAQ body L498 | Contradicts the table top tier "$1,500-3,000" (L101, L145) | Use "$200 to $3,000" everywhere, or define the FAQ as "solo, DIY-to-hybrid" |
| Outsourced editing "$500-1,500" | L22, L498 | Table: $400-700 **per video** x 4 = $1,600-2,800/mo (L121) | Align to the table math |
| Thumbnails "$50-200/month" | L22, L498 | Table says $50-100/mo hybrid (L126) | Align |
| Software "$30-80/month" | L22, L498 | Table: SEO tools $30-50 + editing software $0-30 = $30-80 (consistent) | Keep, state the split |
| Founder time "12-20 hours" | L22, L51, L498 | Table: DIY 15-20, hybrid 8-12, outsourced 3-5 (L136-139) | "3-20 hours depending on tier; 15-20 DIY" |
| Equipment amortized "$50-100/mo" from a "$1,200-2,400 setup" | L22, L107-108, table note L149 | Contradicts the one-time list "$430-1,300 → $18-54/mo" (L164-169) | Pick one figure (the itemized $430-1,300 → $18-54/mo is the checkable one) and fix the table row + note + FAQ |
| "One $5,000 client pays for 6-25 months, depending on your tier" | L198 | True only for DIY/hybrid ($200-800); outsourced $1,500-3,000 = 1.7-3.3 months | "2-25 months" or name the tiers |
| "One client per month and your channel returns 3x your investment" | L310 | Revenue/cost = 3x; net return = 2x. Uses revenue, while the ROI calculator uses LTV and margin (`youtube-roi-calculator.astro` L349) | "...brings in 3x what it costs (2x net, before margin)", then point to the calculator for the margin view |
| "4 videos per month is the minimum threshold for YouTube to treat your channel as active" | L54, L80, template L386 | Unsourced algorithm claim; YouTube publishes no such threshold | Relabel as SellonTube's recommendation, with the reason |
| "B2B channels earn $2-8 per 1,000 views from AdSense" ("in our experience") | L196, template L446 | First-party claim with no data in the repo | Replace with a sourced figure: Mike and Matty ~$248K AdSense on 100M+ views over 6 years, about $2.50 per 1,000 views (their video, `agoxvqoBQBI`; figures from the transcript note in project memory, so re-check the numbers against the video before publishing). Then do the B2B math explicitly |
| YPP "1,000 subscribers and 4,000 watch hours" | L196 | Incomplete: it omits the 10M Shorts views in 90 days route and the 12-month window. No source | Verify against YouTube Help (support.google.com/youtube/answer/72851) at write time; cite it |
| "Sponsorships (only pursue after 5,000+ subscribers)" | template L447 | Unsourced | Relabel as a rule of thumb, or cut |
| "Click-through rate to website (target: 2-5%)" | template L436 | Unsourced benchmark | Change to "target: ____ (set after month 3)", or source it |
| Lead ranges 0-2 / 2-8 / 5-20 per month; first lead month 3-5; compounding 12-18 | L24, L53, L290, L298, L304, L502, SVG L322/329/336 | Unsourced projections stated as expectations; the body (first lead in "Month 4-6") and the FAQ ("month 3 and month 5") differ slightly | Label once as "SellonTube planning assumption, not a benchmark". Align month 3-5 vs 4-6. Cross-check case-studies (Scalelist "after a few months") as supporting third-party evidence |
| Gear: "Logitech Brio or Sony ZV-1", "Blue Yeti or Rode NT-USB Mini", "$300 webcam" | L152, L164-165 | Prices not verified 2026-10-22; Blue Yeti is now sold under Logitech G branding (unverified, check) | Re-price at write time from the retailer pages, or drop model names and keep the price bands |
| "Most businesses underestimate this by 50%" | L78 | Unsourced | Cut, or reword as "most founders leave their own hours out" |
| "80% of the production quality you need" | L152 | Unverifiable | Cut the number |
| Case-study link "50% of the company's paid users" | L198 | Sourced in `youtube-marketing-case-studies.mdx` (Scalelist founder quote, L62/L141). OK. Side note: that post gives Scalelist's subscriber count as 1,260 at L62 and 2,660 at L84 (out of scope; flag to the owner) | Keep |
| dateModified 2026-06-08 | JSON-LD | Stale after the refresh | `updateDate` on the material change |

### First-party data available (repo, real, sourced)

1. **Fold study** (`research/fold-study-2026-09-18.md`, script `research/fold-study-2026-09-18.mjs`,
   run 2026-09-18): "In a sample of 50 B2B videos, 55% of the descriptions that contained a link put
   their first link below the fold" (median first-link position 202 chars; the fold is about 150).
   Placement: Revenue Model step 3 "Conversion" (L190, "They click the link in your description").
   Plan line: "Put the booking link in the first 150 characters of the description". Attribute it to
   SellonTube's study and link the description extractor tool.
2. **Chapter study** (`research/chapter-study-2026-09-19.md`, run 2026-09-18): of 120 top B2B
   videos, 66% had no timestamps and 15% of the timestamped ones failed YouTube's chapter rules.
   Optional, low relevance (production checklist); skip unless the Section 5 checklist grows.
3. **ROI calculator logic** (`src/pages/tools/youtube-roi-calculator.astro` L349): it uses LTV and
   COGS, not views. Cite it as the method behind break-even, not as a data claim.
4. **Do NOT use:** `youtube-growth-strategy.mdx` L285 "$23 vs $187 cost per lead" (client claim,
   no source file found); `traffic-reality-check.md` agency pricing (off-topic and sells the agency,
   which is not the SEO target).

## Phase 4: Refresh plan

- **Scope: moderate.** Several sections modified, 1 new H2, a template expansion, title/meta, raster
  image, 1 video. Structure, URL, voice and all ranking H2 texts stay.
- **URL:** keep `/blog/youtube-business-plan`. **Keep these H2 strings byte-identical** (fragment
  impressions + TOC): "What a YouTube Business Plan Covers", "Costs: Equipment, Editing, and Time
  Investment", "Revenue Model: Leads and Sales, Not Ad Revenue", "90-Day Content Calendar
  Template", "Expected Timeline to Positive ROI", "YouTube Business Plan Template (Download)",
  "FAQ".

### Section plan

| Section | Action | What changes |
|---|---|---|
| Intro L39-45 | Modify | Cut "spoiler". Keep the hook short |
| Key Takeaways L47-56 | Modify | Reconcile the cost numbers. Relabel the cadence takeaway as a recommendation. Link the ROI calculator in the timeline takeaway. Label the 500-subscriber line as an illustration |
| Contents L58-66 | Modify | Add the new H2 entry |
| H2 What a YouTube Business Plan Covers | Modify | Keep the `<dfn>`. **Add the 134-167-word answer block** after it, introducing "B2B YouTube" / "YouTube acquisition channel". L76: add an autocomplete tool link. L80: relabel the cadence claim. L78: cut "50%" |
| **NEW H2 Creator Plan or B2B Plan: Which Do You Need?** | New | Decision table + YPP (sourced) + Mike and Matty AdSense math + routing line. About 150-250 words. Place it right after the section above (inside the first 30%) |
| H2 Costs | Modify | First sentence answers the heading with the 3 tier ranges. Fix the amortization contradiction (table row, note, startup list). Add a **True monthly cost** definition. Cut "80%". Re-price or de-brand gear |
| H3 One-time startup costs | Keep (numbers aligned) | - |
| H2 Revenue Model | Modify | First sentence answers ("A B2B YouTube channel earns money through clients, not ads"). Add the **fold-study** first-party claim to step 3. Replace "$2-8 in our experience" with the sourced RPM math. Add the **YouTubeFacade video** (Mike and Matty) with caption. Soften metaphors at L192. Fix "6-25 months" |
| H2 90-Day Content Calendar Template | Modify (light) | First sentence answers the heading. Add a video-ideas-evaluator link in "How to choose your first 12 topics" |
| H2 Expected Timeline to Positive ROI | Modify | First sentence answers ("Plan for first leads in months 3-5 and break-even..."). Label the lead ranges as planning assumptions once. Align month 3-5 vs 4-6. Fix "3x" wording. Add a **Break-even point** definition. Re-anchor the L312 ROI link (anchor cap) |
| SVG L315-347 | Modify (light) | Keep. Add "SellonTube planning assumption" to the subtitle text so the diagram passes the claim audit |
| H2 YouTube Business Plan Template (Download) | Modify (heaviest) | (a) Make "Download" true: ship the same template as a real file. Simplest robust option: `public/downloads/youtube-business-plan-template.md` + `.docx` (or a "Make a copy" Google Doc link the owner creates). Ungated, which matches the house rule in `youtube-script-examples-business.mdx` L630. (b) Add "SECTION 0: EXECUTIVE SUMMARY" (5 lines). (c) Add a 12-month projection grid (month / videos live / cash cost / leads / clients / revenue / cumulative net) to Section 4. (d) Add an optional creator "Revenue streams" block. (e) Add a market/competitor line to Section 1 with a competitor-analysis tool pointer. (f) Fix L455 (literal markdown inside the fence). (g) Below the fence add a short **filled-in example** for a hypothetical $5,000-LTV B2B service firm, labelled illustrative |
| H2 FAQ | Modify | Keep the 3 (fix numbers). Add 3 from evidence, below |
| What to Do This Week | Modify (light) | Step 1 → "download or copy the template". Keep the rest |

### FAQ additions (evidence only; FAQPage JSON-LD stays OFF; visible `### Question?` H3s)

1. "Is there a free YouTube business plan template I can copy?" (GSC "youtube business plan
   template", 34 impr, pos 16.9).
2. "What should a business plan for my YouTube channel include?" (GSC "business plan for youtube
   channel" / "youtube channel business plan"; also C2's section list).
3. "Should I plan my YouTube channel around ad revenue or clients?" (GSC "youtube channel business
   plan" creator intent; the C2 FAQ "Why do you need a YouTube business plan?" is the closest
   observed competitor question). Answer with the sourced AdSense math.
Skip "How do I get funding for my YouTube channel?" (C1, C2): off-ICP.

### Internal links

**Inbound (from pages with real GSC clicks, 90d live pull 2026-10-22):**

| Source (clicks / impr) | Location | Proposed anchor + sentence |
|---|---|---|
| `src/data/post/youtube-marketing-case-studies.mdx` (17 / 7,918) | Body FAQ answer at **L485** ("Plan for months, not days. ..."). Append 1 sentence; leave the frontmatter L23 copy alone or mirror it | "Write those months, the budget and your break-even client count into a [YouTube channel business plan](/blog/youtube-business-plan) before the first upload." |
| `src/data/post/youtube-script-examples-business.mdx` (5 / 405) | After the lead-magnet callout (ends **L631**), before "## Script 5" (L633). Not inside the L566-626 code fence | "> **Read more:** [Plan your first 90 days with a YouTube business plan template](/blog/youtube-business-plan)" |
| `src/data/post/youtube-sales-funnel.md` (2 / 258) | Body FAQ answer **L336** ("Plan for 3 to 6 months ...") | "...Budget those months with a [business plan for your YouTube channel](/blog/youtube-business-plan)." |

Anchor-cap check (grep of `src/data/post/*.md*`, 2026-10-22): the only existing anchor to this
URL is "a full YouTube business plan template" (1 page). The 3 proposed anchors are all distinct.
No cap risk.

**Outbound `/tools/` (requirement already met by the ROI calculator; add these):**

| Target | Where | Anchor | Cap check |
|---|---|---|---|
| `/tools/youtube-roi-calculator` (existing L312, L511) | L312 re-anchor | "work out your break-even month in the ROI calculator" | **"YouTube ROI Calculator" exact anchor is used by 20 posts (far over the ~3 cap).** Re-anchoring L312 cuts it to 19. Leave L511 (HTML `<a>` in the callout) or vary it too |
| `/tools/youtube-autocomplete-keywords` (28 clicks, the strongest tool after audit) | L76, the keyword step | "pull the exact phrases buyers type with the free YouTube autocomplete tool" | existing variants max 4 uses; the new string is unique |
| `/tools/youtube-video-ideas-evaluator` | H3 "How to choose your first 12 topics" (L267-276) | "score each topic for buyer intent before you film it" | unique (existing max 5 for "Video Ideas Evaluator") |
| `/tools/youtube-description-extractor` | Revenue Model step 3, next to the fold-study claim | "check where competitors put their first link" | unique |
| `/blog/youtube-channel-optimization-checklist` | Prose under the template (replaces the dead L455 link) | "channel optimization checklist" | 1 use |

Run `scripts/audit_internal_links.py` on `dist/` after the build to confirm the links render.

### CTA

`toolCta: youtube-roi-calculator` stays. No CTA in the first ~20-25% beyond the tool mention in the
answer block. The cal.com booking link stays in the closing callout only.

### Title / meta (changed)

Rendered `<title>` = `metadata.title` (or `title`) + " | SellOnTube" (13 chars). Topic cap = 47.
Set `metadata.title` to keep the current H1, or change `title` to change both.

| Option | Topic chars | Rendered | Note |
|---|---|---|---|
| Current: YouTube Business Plan: Build a Channel That Pays for Itself | 59 | **72 (FAIL)** | - |
| A. YouTube Business Plan Template for B2B Channels | 47 | 60 | Head query + "template" query + the wedge. **Recommended** |
| B. YouTube Business Plan: Free Template + Costs | 44 | 57 | Matches the vendor-template SERP. "Free" is true (ungated) |
| C. YouTube Channel Business Plan (Free Template) | 45 | 58 | Leads with the 2nd query row (143 impr) |
| D. YouTube Business Plan: Template, Costs and ROI | 46 | 59 | Mirrors the 3 page pillars |

| Meta option | Chars |
|---|---|
| Current: "Build a YouTube business plan with real cost breakdowns, a 90-day content calendar, and an ROI timeline. Free template included." | 128 |
| 1. "Fill in a free YouTube business plan template: costs from $200/mo, a 90-day content calendar, and the break-even math for a channel that brings clients." | 152 |
| 2. "A YouTube channel business plan template with real costs, a 90-day calendar and a lead-based ROI timeline. Copy it free or download the doc." | 140 |
| 3. "Plan a YouTube channel like a business: budget tiers, a 12-video calendar, the break-even formula and a free template to copy or download." | 138 |

"Download" in metas 2-3 is true only after the file ships. Pick meta 1 if the download slips.

### Feature image + media

- Export a raster 1200x630 PNG `src/assets/images/blog/youtube-business-plan-featured.png` from the
  house SVG design (`seo/site-kit/brand-visuals.md`). Update `image:` and keep `image_alt`.
- Add 1 `YouTubeFacade` (Mike and Matty, `agoxvqoBQBI`, "We Hit 1M Subs. YouTube Paid Us This
  Much"). It is relevant because it carries the sourced AdSense figure. Click-to-load only, with
  caption + alt.

### Dates

`updateDate` = ship date (material change). **Do not touch `publishDate`.** The main thread sets
dates; never a subagent.

### Deliberately skipped, and why

- A full creator monetization guide or 5-year P&L/balance sheet: off-ICP (`docs/icp.md`), and it
  would turn the page into a vendor-template clone.
- A funding/investors FAQ: off-ICP.
- A slug change or a year in the title: not rewarded by this SERP (no rival dates its title);
  L-TE-07.
- Chapter-study data: weak fit for this page.
- The AIO / PAA analysis: not observable through WebSearch; needs a manual check.
- The case-studies subscriber-count inconsistency (1,260 vs 2,660): a separate post, flagged only.

## Buyer prompts for the owner to run by hand (ChatGPT, Perplexity, Gemini, Copilot)

No `seo/ai-prompts.md` exists in this repo yet, so these IDs are provisional. Copy them there
unchanged so monthly runs compare. Log for each: SellonTube cited Y/N, URL cited, which rival.

| ID | Prompt (verbatim) | Stage | Source |
|---|---|---|---|
| BP-P01 | "Write me a business plan for my company's YouTube channel." | Solution-aware | GSC "youtube channel business plan" (143 impr) + "youtube business plan" (326) |
| BP-P02 | "Is there a free YouTube business plan template I can copy?" | Solution-aware | GSC "youtube business plan template" (34 impr, pos 16.9) |
| BP-P03 | "How much does it cost per month to run a YouTube channel for a B2B company?" | Problem-aware | GSC "enterprise youtube channel cost" + "youtube for business pricing" (1-2 impr each); post FAQ L496 |
| BP-P04 | "How long does it take a B2B YouTube channel to bring in leads and break even?" | Problem-aware | Existing FAQ L500; the same question in `youtube-sales-funnel.md` L336 and case-studies L485 |
| BP-P05 | "Do I need a business plan before starting a YouTube channel for my business?" | Problem-aware | GSC "creating a business youtube channel" (3 impr); Upmetrics FAQ "Why do you need a YouTube business plan?" (verbatim, fetched 2026-10-22) |

## Scope verdict

Moderate refresh, worth doing: the page sits at pos 10-17 on 5 earned query rows, holds the only
B2B-acquisition angle on a vendor-template SERP, and fails 7 checks that can each be fixed (answer
block, first sentences, entity terms, first-party data, takeaways claim audit, video, raster image)
plus the 72-char title and internal number contradictions. Most of the work goes into accuracy and
making "Download" true. The creator box serves the mixed intent without changing the ICP. This plan
predicts no ranking or click outcome; judge it on clicks and GA4 sessions for the 5 query rows at 28
and 90 days, after confirming `lastCrawlTime` is later than the deploy.

## Phase 5: Approval
- [ ] Owner approved on ____. Notes:

## Verification status
- Checked: post source (whole), live rendered HTML (title, meta, og:image, JSON-LD types, ids,
  hrefs), live GSC (pages, queries, fragments, country, daily position), repo first-party studies,
  anchor counts via grep of `src/data/post/`, video live via oEmbed.
- Assumed / not verified: the human share (~80%, caller's figure), gear prices and Logitech G
  rebrand, the exact current YPP wording, the Mike and Matty figures (memory note, not re-watched),
  ClickUp/Taskade/OGS/CreatorHandbook contents (snippets only), SERP features (AIO/PAA unobservable).
