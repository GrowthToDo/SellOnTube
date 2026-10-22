# Refresh plan - https://sellontube.com/blog/youtube-script-examples-business - 2026-10-22

Mode 07 phases 1-4 plus mode 09 step 7 (citability audit). READ-ONLY plan: nothing in the repo was
edited. Source read: `SellonTube-wt-top5` at `605c8d8` (main), file
`src/data/post/youtube-script-examples-business.mdx` (853 lines). Live page curled 2026-10-22.

## 0. Correction to the brief (read first)

The brief says the post has no real `## FAQ`. **It does.** Source L825-837 holds `## FAQ` with three
`### Question?` H3s that mirror the three frontmatter `faqs`. Live HTML (curl, 2026-10-22) renders
3 question H3s (`#how-long-should-a-b2b-youtube-video-script-be`,
`#what-is-the-best-youtube-script-format-for-business`,
`#can-i-use-the-same-youtube-script-template-for-different-industries`) and 0 `FAQPage`
strings. The June extractability audit (`research/aeo/extractability-audit-2026-06-24.md` L88) scored
this page 9/10. So the "add a visible FAQ" job is already done. The FAQ work left is AIC-10
phrasing plus one evidence-backed question (section 5).

## Trigger

- Not decay. GSC live pull (my own, 2026-10-22, `sc-domain:sellontube.com`, page filter,
  2026-07-22..2026-10-19): 5 clicks / 405 impr / pos 9.1. Brief's 28d figure: 4 clicks / 226 impr /
  pos 8.6. Growing.
- Triggers that fire: **#3 facts stale or false** (one product claim the code disproves, vendor
  prices, unsourced SellonTube client results); **cadence** (`ai-seo-guide.md` §12: YouTube SEO
  cluster, `dateModified` is 2026-05-25, about 150 days old); **rule debt** that the post gate will
  hit on any edit (rendered title 78 chars vs cap 60; SVG feature image vs raster rule).
- Refresh before new: the page already earns the long-tail rows. No new post (blog is paused,
  `SEO_CONTEXT.md` "Paused surfaces").

## Phase 1: Current state

**Query rows** (my pull, same 90d window, page filter):

| Query | Clicks | Impr | Pos | Read |
|---|---|---|---|---|
| perfect youtube script structure for business owners | 0 | 74 | 8.5 | Templated phrasing, likely agent fan-out. Usable as FAQ evidence, not as a title target |
| youtube scriptwriting for b2b lead generation | 0 | 39 | 9.1 | Known bot query. Ignored |
| youtube script writing examples | 1 | 6 | 8.3 | Real click |
| youtube video script example | 0 | 3 | 28.3 | Long tail |
| youtube script example / sample script for youtube video / youtube scripts | 0 | 1 each | 10-35 | Long tail |
| "combine it", "yes please" | 0 | 1 each | - | Agent junk, more evidence of fan-out traffic |

Query rows sum to 1 click; the page total is 5. The other 4 clicks sit in anonymised queries. The
country split also sums to 1 click (gbr), so page x country is unreliable for clicks here, as
`mistakes-lessons.md` 2026-09-18 warns.

- **First GSC impression:** my date pull returns rows from 2026-05-01 (172 days), but the post was
  added in commit `5d987c8` on 2026-05-18 with `publishDate` 2026-05-26. I did not resolve the
  mismatch. Either way the page is past 90 days.
- **Last material update:** `830f6d5` 2026-07-19 (links only). The title and meta were last changed
  in `de128d0` 2026-06-06 (old title: "5 YouTube Script Examples for Business Channels You Can Copy
  Today"). The current title has earned every click so far.
- **Cannibalization:** sibling `/blog/youtube-script-writing-guide` has 0 clicks / 8,705 impr / pos
  3.6, and 8,667 of those impressions are the bot query. Note only; no merge now.
- **Live check:** canonical is correct. Title tag = "5 YouTube Script Examples for B2B Channels
  [Copy-Paste Templates] | SellOnTube" (78 chars). H1 = frontmatter `title`. og:image is the SVG.
  `dateModified` 2026-05-25T18:30Z. Not checked: a rendered screenshot via `/browse` (phase 1
  step 4). Run it before the rewrite.
- **Strengths to keep:** the 5 template + full-example pairs (this is what "script examples"
  searchers want, and few SERP results give full scripts); the two tables; the TOC; the voice
  (short declaratives, bucket brigades); the URL; all heading ids. No other page links to an
  in-page anchor of this post (grep of `src/` and `public/`, 0 hits), so the FAQ H3 ids can change
  without breaking anything.
- **Weaknesses:** sections 2-3 below.

## Phase 1b: Citability audit (AIC-01..10 + `ai-seo-guide.md` §16, on live HTML + source)

| Check | Result | Evidence (source line) |
|---|---|---|
| AIC-01 early answer | PASS (global) | L80, 61 words, about 10% down the page, answers "how is a B2B YouTube script structured" |
| §16 Rule 1, answer block 134-167 words | FAIL (project rule, labelled `unverified` per AIC-01) | L80 is 61 words; no block of 134-167 words anywhere early |
| AIC-02 first sentence mirrors heading | PASS | L80, L139, L252, L387, L510, L635, L768 |
| AIC-03 definition block | FAIL | No `**Term** is ...` block. "Product bridge" is the concept the post owns, and it is never defined in one sentence |
| AIC-04 canonical entities | PARTIAL | "B2B YouTube" L139 is used. "buyer-intent video" is absent. "lead generation" used for the full funnel (L440 example title, L370) without "customer acquisition" established first |
| AIC-05 first-party data | FAIL, and a claim risk | No sourced first-party claim. Instead the scripts carry SellonTube-branded client results with no source anywhere in the repo: L215-217, L370-374, L491-497, L613-619, L717-719, L725. A repo grep for "14 demo", "8,200", "over 900" and "12 search impressions" finds only this post. L133 says the examples are "fictional", but an assistant that lifts L370-374 will quote "SellonTube ... One SaaS client went from zero YouTube-sourced demos to 14 per month within 90 days" as fact |
| AIC-06 citation-ready language | PARTIAL | Metaphor "workhorse" L139; "talking-head ramble" L131; "Here's the thing:" L129. Most other claims are specific |
| AIC-07 takeaways/TOC pass claim audit | FAIL | L48 "CTA placed at the 70% mark" contradicts L80 and the table (product bridge at 60-70%, CTA at the end). L51 "retain 30-40% more viewers past the first minute" has no source and no year. Takeaways link no tool |
| AIC-08 reads well without AI search | PASS | |
| AIC-09 tables stand alone | PASS | Structure table L84-127, adaptation table L772-815 |
| AIC-10 FAQ phrased like an assistant prompt ("I"/"my") | PARTIAL | All 3 questions are third-person ("a B2B YouTube video script") |
| §16 visible FAQ | PASS | L825-837, live H3s confirmed |
| §16 Rule 3 first-party claim | FAIL | as AIC-05 |
| §17 language rules | PARTIAL | as AIC-06; L821 vs L845 contradict each other (below) |
| §18 media | FAIL | Feature image only. No screenshot, no video. Feature image is SVG (`youtube-script-examples-business-featured.svg`, only asset found), so VIS-18 / OPEN 7 also fails on edit |
| §12 freshness | FAIL | `dateModified` 2026-05-25; no visible "Last updated" |
| Title cap ≤60 on rendered title | FAIL | 78 chars (counted by script) |
| Meta <155 | PASS | 151 chars (`metadata.description`) |
| ≥4 internal links incl. one `/tools/` | PASS | L43, L135, L184, L391, L506, L764, L823, L837, L846 |
| FAQPage JSON-LD off | PASS | 0 in live HTML |
| Em/en dashes | PASS | 0 in source |

**Internal contradiction (new finding):** L821 says "write the product bridge last". The "What to Do
This Week" step 4 at L845 says "Write the product bridge before the body". One of the two must go.
The body argues its case at L821, so keep L821 and fix L845.

## Phase 2: SERP read (dated 2026-10-22, method: WebSearch, US, standard mode)

Limit: WebSearch returns a result list, not a Google SERP. **AI Overview, featured snippet and PAA
were not observable, so none are recorded.** I did not open the result pages; the "covers" column
comes from result snippets only and is unverified. The owner should run one manual Google check
(`&nfpr=1`, logged out) to capture the AIO, its cited sources and the PAA verbatim.

| Query | Results returned (order as given) | Publisher type | What they cover that we skip |
|---|---|---|---|
| youtube script examples for business | bigvu.tv (dos/don'ts + examples), freelancer.de, a bart.gov mirror (spam), beverlyboy.com, nbcnews.com (book excerpt), mediashower.com (AI scripts + examples), superframeworks.com (script generator tool), stealthagents.com | Vendors, a tool, a news excerpt | Shooting script vs outline distinction (NBC); hook in first 5-10 s; short promo-ad script example (50-90 s) |
| youtube script structure for business | paperform.co (template library), beverlyboy.com, primalvideo.com (5-step template), stealthagents.com, nbcnews.com, velio.co, nas.com (paid script system), vistasocial.com, a Notion guide | Template vendors, creator educators | Downloadable/fill-in template; list-style body; business formats "head-talks, vlogs, concept videos" |
| youtube script writing examples | bart.gov mirror, vidiq.com (template + examples, 3 locales), studiobinder.com (hooks), scribd (x2), vidpros.com, quillbot.com (generator) | Creator-tool brands, docs dumps | 125-150 wpm pacing (we use 150); two-column audio/visual (A/V) script format with visual cues; hook line examples |

- Winnability: vidIQ and StudioBinder hold the generic "examples" query, and both are big creator
  brands. The page should keep aiming at the business/B2B long tail it already earns (L-TOP-02).
- Pattern: almost nobody in these results publishes full, word-for-word business scripts. The
  five full examples are this page's information gain. Keep them intact.

## Phase 3: Gap analysis

| Topic / element | Us | Seen in | Priority |
|---|---|---|---|
| Full word-for-word business scripts | yes | few (snippets suggest mostly fragments) | Keep (our gain) |
| Visual cues / B-roll / on-screen column (A/V format) | no | vidIQ, Scribd, bigvu (snippets) | Medium |
| Shooting script vs outline (when not to script word-for-word) | no | NBC excerpt; our own tool page L527 says demos should be outlined | Medium, and we already hold the claim first-party |
| Pacing range 125-150 wpm | 150 only | vidIQ | Low (one clause) |
| Downloadable / copyable template | code blocks only | Paperform, primalvideo | Low; code blocks already copy |
| Hook line library | partial (one hook per script) | StudioBinder, QuillBot | Low |
| Early soft CTA vs end CTA | end-loaded bridge at 60-70% | nobody in results | **Emerging**: our own case-studies post records Arvow's founder moving the CTA "to the start and middle of videos rather than the end, which lifted signups" (`youtube-marketing-case-studies.mdx` L218, founder-sourced, linked video) |

### Stale, false or unsourced claims (every location)

| # | Claim on page | Where it lives | Problem | Source / fix |
|---|---|---|---|---|
| 1 | Product bridge: the SellonTube video ideas generator "pulls real YouTube search data ... validated by search volume" | Body L230-235 (Script 1 example) | **False.** `netlify/functions/generate-video-ideas.ts` L3-4, L103 calls Gemini only. The tool page itself says "Search volume and trend data are irrelevant" (`src/pages/tools/youtube-video-ideas-generator.astro` L304) | Rewrite to what the tool does, or point that bridge at `/tools/youtube-autocomplete-keywords`, which does call `/api/youtube-suggest` (tool page L1186, L1258) |
| 2 | "find a search-validated topic" | What to Do This Week L846 | Same overclaim | Reword: "find a buyer-intent topic" |
| 3 | "Find Topics Your Buyers Search For" | Read-more anchor L764 | Same overclaim, softer | Reword anchor, e.g. "YouTube Video Ideas Generator: buyer-intent topics for your product" |
| 4 | CTA "placed at the 70% mark" | Key takeaway L48 | Contradicts L80 + table L113-123 | "product bridge at the 60-70% mark, CTA at the close" |
| 5 | "retain 30-40% more viewers past the first minute" | Key takeaway L51 | No source, no year | Cut, or replace with the Arvow observation (founder-sourced) |
| 6 | "where 50-65% of viewers are still watching" | L80; same claim in sibling guide L83 | No source | Cut the number, or label it as a SellonTube planning target |
| 7 | Retention Target column 85-95% ... 45-55% | Table L91-123 | No source | Rename column "Retention goal" and add one line saying these are planning targets, not YouTube benchmarks; or drop the column |
| 8 | "how to reduce customer churn" with "2,400 monthly searches" | Script 1 example L204-206 | Real query + specific volume, unverified | Replace with a bracketed placeholder, or verify in `sot_master.csv` / DataForSEO and date it |
| 9 | "A SaaS company we worked with went from 12 search impressions per day to 340" | L215-217 | SellonTube-voiced result, no source in repo | Keep as fiction but voice it from a fictional narrator, not "we" |
| 10 | HubSpot Starter $20/seat; "Salesforce Essentials is 25 per seat"; "Professional at 80 per seat"; 7,200 / 28,800 per year; "$28,000 tool"; consultant $150-200/h; "15 to 40 thousand dollars"; HubSpot limits "around 200 employees" | Script 2 example L314-316, L333-344, L355, L358-362 | Stale. Third-party price lists (WebSearch, 2026-10-22: crmswitch, costbench, meetergo) show Salesforce renamed Essentials to **Starter Suite** ($25) and list **Pro Suite at $100**/user/month; HubSpot Sales Hub Starter list $20/seat with lower promo/annual rates. Not verified on vendor pages | Either verify on hubspot.com / salesforce.com and add "(list prices as of <month> 2026)" in the line above the code block, or swap to bracketed placeholders. Placeholders are safer for a template post |
| 11 | "At SellonTube ... One SaaS client went from zero YouTube-sourced demos to 14 per month within 90 days" | Script 2 bridge L370-374 | Named first-party result, no source | Remove "SellonTube" from the fictional bridge, or cite a real source. Do not keep as is |
| 12 | Full case study: 34 videos, 89 avg views, 0 → 14 demos, 340 → 8,200 impressions, "the standard process we run at SellonTube" | Script 3 example L444-497 | Reads as a SellonTube case study, no source | Relabel as a fictional company ("Acme CRM, a fictional SaaS") and remove "at SellonTube"; or rebuild the example on a real, sourced case from `youtube-marketing-case-studies.mdx` (Tiiny Host or Bulk Mockup), with the source link |
| 13 | "same calendar structure we use at SellonTube ... One of our clients ... under 100 per day to over 900" + a "free content calendar template" | Script 4 example L613-619, L570-573 | No source; SellonTube offers no such template on the site (not found in repo) | De-brand the narrator |
| 14 | "Those lists convert into sales calls 6 to 12 months later" | L516 | No source | Soften to a conditional or cut |
| 15 | "15 to 25 search-optimized videos", "7 to 12 minutes performs best", "We've seen Shorts get 10,000 views and zero website clicks ... 400 views generated 6 demo requests", "in our portfolio" | Script 5 example L700-706, L712, L717-719, L725-726 | First-party "we" results, no source | De-brand, or replace the Shorts line with the case-studies post's sourced Bulk Mockup example (370 views, 3 customers, `youtube-marketing-case-studies.mdx` L25) |
| 16 | Word counts: how-to 750-1,000, comparison 1,000-1,500 | L143, L260, FAQ L829 | Disagrees with the script tool page FAQ (comparison 900-1,500, how-to 600-1,050, `src/pages/tools/youtube-script-generator.astro` L42) and sibling guide L20 (comparison 900-1,500, how-to 750-1,200) | Pick one set across the three pages (AIC-04). The tool page sits on the pending tool-fix branch; do not edit it here, log it for that branch |
| 17 | Agency CTAs ("book a free 30-minute diagnostic", "our team will build ...") | L239-242, L380-382, L500-503, L622-625, L752-761, L851-853 | Conflicts with the tools-first north star; this is open owner decision 1 in `SEO_CONTEXT.md` | Owner call. Plan default: keep the booking link, add a script-generator CTA ahead of it |

### Information gain we can add (sourced only)

- **Script generator facts (first-party, verified in code):** 3 free generations, then a
  business-email gate (`youtube-script-generator.astro` L644 `RATE_LIMIT = 3`, L647 gate domains);
  reads the product page URL and writes hook, setup, body, product bridge and CTA (tool page L41,
  L44, L333). Use this as the sourced first-party block (AIC-05 / §16 Rule 3).
- **Sourced third-party evidence already on our site:** Arvow's CTA move (case-studies L218); Bulk
  Mockup's 370 views → 3 customers (L25); Tiiny Host's title + "first 30 seconds of the transcript"
  rule (L278, L510).
- **"When not to script word-for-word"**, from the tool page's own claim (L527: outline demos,
  script the hook, transitions and close).

## Phase 4: Refresh plan

- **Scope: moderate.** Several sections change in content; the structure, H2 order, URL and voice
  stay.
- **URL:** keep `/blog/youtube-script-examples-business`.
- **Rewrite rule for every changed line:** keep the sentence length and voice; run `humanizer` on
  changed copy; no em dashes.

### Section plan

| H2 / block | Verdict | Change |
|---|---|---|
| Intro L39-43 | Keep | No change. It already carries the tool link |
| Key Takeaways L45-55 | Modify | Fix L48 (#4); cut or replace L51 (#5); link the script generator in one bullet |
| How These YouTube Scripts Are Structured L78-135 | Modify | Expand L80 into one standalone answer block of 134-167 words (§16 Rule 1); add a definition block right after it: `**A product bridge** is the 30-60 second segment at the 60-70% mark that connects the problem the video just solved to your product.`; fix #6 and #7; say once, plainly, that the companies and numbers in the examples are fictional; add one sentence on the 125-150 wpm range |
| Script 1: How-To Explainer | Modify (light) | Fix #1 (false tool claim), #8, #9. After the example, add one line linking the autocomplete tool with a fresh anchor (see links) |
| Script 2: Product Comparison | Modify | Fix #10 (verify and date, or use placeholders) and #11 |
| Script 3: Case Study Walkthrough | Modify | Fix #12. Keep the template and the existing link to the case-studies post |
| Script 4: Lead Magnet Pitch | Modify (light) | Fix #13 and #14 |
| Script 5: FAQ Roundup | Modify (light) | Fix #15; replace the "we've seen" Shorts line with the sourced Bulk Mockup line (link the case-studies post) |
| NEW H3 under "How These YouTube Scripts Are Structured", or a short H2 before "Adapting" | New | "When to script word for word, and when to outline": hook, bridge and CTA word for word; demos and walkthroughs as outlines (source: tool page L527); one line on adding a visual-cue column (the vidIQ-style A/V gap). About 120-180 words. Add the TOC entry |
| NEW first-party block | New | 2-3 sentences in the Script 1 bridge area or the new H3: what the SellonTube Script Generator outputs and its free limit (verified facts above), with a fresh anchor |
| Adapting These Scripts to Your Industry | Keep | No change |
| FAQ | Modify | See FAQ plan below |
| What to Do This Week | Modify | Fix the L845 contradiction ("Write the product bridge last, after the body"); fix #2 |
| Closing CTA L851-853 | Modify (owner call) | Add one line pointing to the script generator before the booking line. Leave the booking link unless the owner decides OPEN 1 |
| Media | New | One relevant, perf-safe item: a real screenshot of the Script Generator output for a B2B input (PNG, width/height set, lazy, alt + caption), or a `YouTubeFacade` of a real scripted B2B video with a caption (§18). Convert the feature image to a 1200x630 PNG and update `image:` (OPEN 7, VIS-18) |
| Dates | Bump | Material change, so set `updateDate` and the sitemap `lastmod` together; show a visible "Last updated" line (§12) |

### FAQ plan (evidence only, L-ON-06)

- Keep the three questions and answers. Rephrase for AIC-10 with minimal text change, e.g. "How
  long should my B2B YouTube video script be?" No external page links to these ids (grep, 0 hits),
  so the id change is safe. Mirror every change in frontmatter `faqs` (still read by the template
  even with FAQPage off).
- Add one question backed by the GSC row "perfect youtube script structure for business owners"
  (74 impr): "What is the right YouTube script structure for my business?" Answer in 2-4 sentences
  with the five-part order and the 60-70% product bridge. It overlaps Q2, so merge Q2 into it if
  the owner wants 3 questions, not 4.
- Not added: a "can I write my script with AI" question. No GSC row or observed PAA for it on this
  page. Add it only if the manual Google check shows it in PAA.
- `faq.schema: false` stays. No FAQPage markup.

### Internal links

Click figures are my GSC page pull, 90d 2026-07-22..10-19.

**Inbound (new), from pages with real clicks:**

| Source file (clicks/90d) | Location | Change | Anchor | Anchor count now (source posts) |
|---|---|---|---|---|
| `src/data/post/youtube-marketing-case-studies.mdx` (17 clicks) | "What to Do This Week" list, L509 ("Pick the three lowest-competition buyer-intent queries and script one video for each.") | Append: `, starting from these <a href="/blog/youtube-script-examples-business">B2B YouTube script templates</a>` (raw HTML inside the callout, so `<a>`, not markdown) | B2B YouTube script templates | 0 → 1 |
| `src/data/post/best-youtube-transcript-generators.mdx` (6 clicks) | L103, after "...inform your own [video scripts](/tools/youtube-script-generator)" | Append: `, modeled on these [YouTube script examples for business](/blog/youtube-script-examples-business)` | YouTube script examples for business | 1 → 2 (cap ~3) |

Existing inbound links stay: `youtube-business-plan.mdx` L156 (3 clicks), `youtube-content-strategy-guide.mdx`
L132, `youtube-lead-generation.md` L288, `youtube-titles-for-business.mdx` L372, and the tool page
`/tools/youtube-script-generator`. Read the full edited sentence after each insertion (L-LI-04).

**Outbound (new):**

- `/tools/youtube-autocomplete-keywords` (28 clicks/90d) after the Script 1 example, where step 1
  tells the reader to use YouTube autocomplete. Anchor: "pull real YouTube autocomplete suggestions"
  (0 uses). Avoid "YouTube autocomplete keyword tool" (already 4 uses, over the ~3 cap).
- Script generator CTA near the close. Anchor e.g. "draft a first script free" (0 uses). Avoid
  "YouTube script generator" (5 exact uses, 8 case-insensitive, over cap).
- Case-studies post from the Script 5 Bulk Mockup line: already linked once from L391, so a second
  link is optional and must use a different anchor.

Anchor counts come from a grep of `src/data/post/*.md*`. Per project rule, re-verify on `dist/`
after `npm run build`.

### Title and meta

**Title.** Current rendered title is 78 chars, cap 60 (topic ≤47). The post gate fails it on any
edit, so the refresh cannot ship with it as is. The page is growing at pos ~8.6 with this title.
Google already truncates near 60, so searchers mostly see "5 YouTube Script Examples for B2B
Channels [Copy-Paste ...". **Recommendation: keep the H1 (`title`) unchanged. Set only
`metadata.title`, which the template uses for `<title>` (`SEO_CONTEXT.md` fields), to option A.**
Option A is the current visible prefix minus the bracket, so the searcher sees almost no change.

| Option | Rendered `<title>` | Chars | Note |
|---|---|---|---|
| **A (recommended)** | 5 YouTube Script Examples for B2B Channels \| SellOnTube | 55 | Current title minus the bracket |
| B | 5 YouTube Script Examples for B2B Templates \| SellOnTube | 56 | Keeps the "templates" word, reads awkwardly |
| C | 5 B2B YouTube Script Examples + Templates \| SellOnTube | 54 | Keeps both words; reorders the front |
| D | 5 Business YouTube Script Examples to Copy \| SellOnTube | 55 | "business" matches the queries better; bigger change |
| E | 5 YouTube Script Examples for B2B (Templates) \| SellOnTube | 58 | Little headroom |

Not recommended: a "script structure" title for the 74-impression templated query. That row looks
like agent fan-out, and chasing it risks the queries that click.

**Meta.** Current: 151 chars, passes. Keep it unless the owner wants the tool in the snippet.

| Option | Text | Chars |
|---|---|---|
| Current (keep) | 5 annotated B2B YouTube script templates with exact timing, hook formulas, and CTA placement. Copy the structure, swap your product in, film this week. | 151 |
| 1 | 5 B2B YouTube script examples with timing, hook lines, and where the product mention goes. Copy a template, swap in your product, and film this week. | 149 |
| 2 | YouTube script examples for business: how-to, comparison, case study, lead magnet and FAQ scripts, each with timing and a copy-paste template. | 142 |
| 3 | See 5 full B2B YouTube scripts, from hook to CTA, with timing marks. Copy the structure for business owners, or draft one free with our script tool. | 148 |

Option 3 mentions "free" and the tool is free (3 generations, then a business-email gate, still no
charge per tool page L40). If chosen, keep "free" only because the tool's FAQ says "There is no
paid tier".

### Other

- `toolCta: video-ideas-generator` stays. `SinglePost.astro` supports only 4 values (L143, L166,
  L189, L212); none is the script generator. Adding one is a component change and out of scope.
- `excerpt` L5 says "copy-paste templates" and matches the body. Keep it.

## Buyer prompts for the owner to run by hand (mode 09 step 5)

Run in ChatGPT, Perplexity, Gemini, Copilot and Google (AIO + AI Mode), logged out. Log: date ·
ID · assistant + mode · SellonTube named? · quote · accurate? · sources cited in order · rivals
named. Record "AIO not shown" separately. IDs are new; check `seo/ai-prompts.md` does not exist yet
(it does not in this worktree) before numbering.

| ID | Prompt | Stage | Source |
|---|---|---|---|
| P-SE01 | What is the perfect YouTube script structure for a business owner? | Solution-aware | GSC row "perfect youtube script structure for business owners", 74 impr, pos 8.5 |
| P-SE02 | Show me YouTube script writing examples for a B2B SaaS company | Solution-aware | GSC row "youtube script writing examples", 1 click, pos 8.3 |
| P-SE03 | Where should I mention my product in a YouTube video so it doesn't sound like an ad? | Problem-aware | Post's core claim (L80) + script tool page FAQ L44; no GSC row (label: on-page claim) |
| P-SE04 | How many words should my script be for a 7 minute YouTube video for my business? | Problem-aware | Frontmatter FAQ Q1 (L19-20); GSC rows "youtube video script example", "sample script for youtube video" are the nearest |
| P-SE05 | Is there a free AI tool that writes YouTube scripts for B2B products? | Category | `/tools/youtube-script-generator`, 1 click / 335 impr / pos 21.3 (90d) |

## Scope verdict and skips

- **Verdict: moderate refresh, do it.** The drivers are one false product claim (#1), six
  unsourced SellonTube-branded results that an assistant could quote as fact (#9, #11-15), vendor
  prices that look stale (#10), two internal contradictions (L48, L845), and gate debt (title,
  raster image). The ranking structure stays.
- **Expected effect, stated without promises:** the page stops publishing claims nobody can source,
  passes the §16 gate and the post gate, and gives assistants one sourced answer block, one
  definition and one first-party block to lift. Judge at 28 days after recrawl and at 90 days on
  the same query rows (clicks and position, bot-filtered), plus GA4 sessions from this page to
  `/tools/`.
- **Skipped on purpose:**
  - Merging with `/blog/youtube-script-writing-guide`: its impressions are bot-only. Note only.
  - Changing H1 or slug.
  - Chasing the 74-impression templated query in the title.
  - Fixing word-count numbers on the script tool page: it sits on the pending tool-fix branch
    (`SEO_CONTEXT.md` Gaps). Logged for that branch.
  - A `script-generator` toolCta variant: a component change.
  - Removing the agency booking CTA: open owner decision 1.
  - Adding a "can I use AI" FAQ: no evidence row.
- **Owner decisions needed:** (1) fictional-but-de-branded examples vs rebuilding Script 3 on a
  real sourced case; (2) vendor prices verified-and-dated vs placeholders; (3) title option A or
  leave the title and log a gate override; (4) booking CTA stays or goes (OPEN 1); (5) 3 or 4 FAQ
  questions.

## Phase 5: Approval

- [ ] Owner approved on ____. Notes:

## Judging (filled later)

- Deploy date · live check · URL Inspection `lastCrawlTime` after deploy · IndexNow (currently
  returns 403 for this site, `SEO_CONTEXT.md` IndexNow; report it, do not count it as a pass).
- 28 / 90-day read on the query rows above.
