# roi-calculator — Before/After Spec (Tool #1) — FOR APPROVAL

**Scope (approved):** tool page + blog cannibalization fix + AI-citation baseline test. Checkpoint: approve this spec → I build → you see built page → commit → PR/deploy.
**Research:** 4 parallel lenses (positioning / technical SEO / growth / AEO), 2026-06-24.

---

## Headline finding
**We're already winning the AI layer.** Live tests: SellonTube is **#1 organic for "youtube roi formula b2b"** (AI answer quoted verbatim from this page), **#2 for "best youtube roi calculator"**, #1–2 for "is youtube worth it for b2b". Competitors split into ad-ROAS calculators (Zebracat, Plerdy) and formula blogs (Strike Social). **We own an uncontested third lane: business/B2B acquisition ROI with breakeven framing.** The one gap: AI pulls the *formula* from Strike Social because our page never presents it as an extractable block.

---

## BEFORE (current state, quoted)
- **Title:** `YouTube ROI Calculator`
- **Meta:** `Free YouTube ROI calculator for businesses. Enter your numbers and see if YouTube customer acquisition makes financial sense.`
- **H1:** `YouTube ROI Calculator` · sub: `Does YouTube make sense for your business? Enter your numbers and find out.`
- **GSC 28d:** pos 8.8 / 318 impr / 2 clicks / **0.6% CTR**. #2 in US.
- **Schema:** BreadcrumbList + WebApplication + FAQPage (6 Q, all visible) — all correct.
- **Missing for AEO:** answer-first definition, formula block, Key Takeaways, explicit "vs ad ROAS" line.
- **Conversion path:** result (breakeven customers/mo) → **pivots to an unrelated keyword-analysis email gate** (offer whiplash); booking CTA orphaned in footer; "⚠️ only 4 spots left (normally $199)" scarcity; cal.com link has no UTM.

---

## AFTER — changes by lens

### A. Positioning / copy
- **H1** → `Free YouTube ROI Calculator for B2B`
- **Title** → `YouTube ROI Calculator: B2B Breakeven in Seconds` (differentiates from blog's "Marketing ROI: Formula + Benchmarks" title → kills SERP mirroring)
- **Meta** → `Free YouTube ROI calculator for B2B. Enter your LTV and costs to see your breakeven point and whether YouTube customer acquisition pays off.`
- **Hero subhead** → `Ad-ROI calculators tell you if a campaign profited. This tells you whether building an organic YouTube channel is worth it — in two numbers you already know: customer LTV and COGS.`
- **Anti-positioning line** (server-rendered): `Not a ROAS calculator. If you're measuring return on YouTube ad spend, or chasing views and AdSense, this isn't built for you.`

### B. AEO (the citation wins — all static HTML)
1. **Answer-first definition block** (lead the SEO content area):
   > A YouTube ROI calculator for business measures whether YouTube customer acquisition is profitable by comparing customer lifetime value (LTV) against the cost of producing the channel — not ad revenue, views, or subscribers.
2. **Formula block** (#1 win — steals the formula query from Strike Social), rendered as a styled list/table:
   - `Margin per customer = LTV − COGS`
   - `Breakeven customers/month = Monthly YouTube cost ÷ (LTV − COGS)`
   - `YouTube ROI % = (Revenue − Cost) ÷ Cost × 100`
3. **KeyTakeaways block** (5 bullets: formula, ~2-customer breakeven, 3–6mo timeline, LTV-not-views, 40–60% attribution undercount).
4. **"vs ad ROAS" differentiator** — one explicit sentence/row in the existing comparison table.
5. **FAQ → final 8-set** (see Attribution section below; sync JSON-LD to visible).
6. **WebApplication** → add `featureList`. (Optional `HowTo` for formula steps.)

### B2. Attribution gap (NEW — from mining + live ChatGPT/AIO evidence)
**Confirmed live:** Google AI Overview already cites the tool as source [4]; ChatGPT does NOT cite us (generic answer). Both AI answers center on **attribution** — a theme our page ignores, so competitors (a88lab, Ruler, Workshop Digital) win those citations. Closing it captures more of the query AND is on-brand ("can't claim buyers-not-views without solving attribution").

**Add 2 tight, citable FAQs ON THE TOOL PAGE:**
- **"How do you attribute revenue to YouTube for B2B?"** → two layers: open-text "how did you first hear about us?" (not a drop-down) + UTM→CRM first-touch; neither alone is complete because B2B buyers convert weeks later via another channel.
- **"Why does YouTube show low ROI in my CRM?"** → last-click erases the YouTube first-touch; YouTube view-through is 14–30 days, so a 7-day last-click looks broken; measure 30–60-day view-through + assisted pipeline. "The math tells you *if* it pays back; attribution tells you whether you're crediting it correctly."

**Final tool-page FAQ set (8, ordered — math → attribution → benchmark/timeline):**
1. What is the YouTube ROI formula for B2B? *(core)*
2. How many customers do I need to break even on YouTube? *(core)*
3. How do you calculate CAC for a YouTube channel?
4. How do you attribute revenue to YouTube for B2B? *(NEW)*
5. Why does YouTube show low ROI in my CRM? *(NEW)*
6. How do you measure ROI of organic (non-ad) YouTube content? *(NEW, on-spine)*
7. What is a good YouTube ROI for B2B? *(benchmark)*
8. How long does YouTube take to show ROI for B2B? *(timeline)*

**Blog scope (deeper attribution — the how-to that's too heavy for the tool):** fold into `/blog/youtube-marketing-roi` (or new post "B2B YouTube Attribution"): UTM→CRM field mapping, first-touch config (HubSpot/Salesforce), open-text vs drop-down, view-through windows, the dark funnel. Link back to the calculator.

### B3. Long-tail impression wins (the realistic incremental-impression lever for this page)
Tool-page FAQ targets, low-competition/on-intent: attribution-revenue (#4), low-ROI-in-CRM (#5), formula-b2b (#1), time-to-ROI (#8), good-ROI-benchmark (#7). These are the only realistic way to grow this page's impressions — by ranking for more long-tail, not the head term.

### C. Technical SEO / cannibalization
- **Intent assignment:** tool owns transactional "youtube roi calculator / youtube roi" (calculator intent); blogs own "formula/benchmarks" (`/youtube-marketing-roi`) and "for saas" (`/youtube-roi-for-saas`).
- **Cannibalization fix is LOW-RISK:** internal links already exist and are correctly anchored (verified). Blog titles already differentiated. **The only fix is the tool title change above** (stops SERP-title mirroring). No blog rewrites needed — just confirm anchor discipline.
- **Add missing money-page link:** "done-for-you YouTube acquisition" text (line ~134) → link to `/product-pricing`.
- **Cleanup:** remove leftover `console.log` debug (lines ~611-619, 727-735). Verify absolute self-canonical in build.

### D. Growth / conversion
- **Kill offer whiplash** → result-congruent capture: "Email me this full projection + benchmarks" (email only; product-URL moved to step 2).
- **Result-congruent CTA** under the breakeven number → "See if buyers are searching for you →" / "Book a 15-min diagnostic →" (clear hierarchy).
- **Rewrite footer CTA** to connect to their number ("Your breakeven is low. Let's pressure-test whether you can hit it.").
- **Add UTM** to cal.com link (`?utm_source=roi-calc`) → makes bookings measurable.
- **Fire analytics event** on `calculate()` (currently console.log only).

---

## ⚠️ TWO JUDGMENT CALLS (need your decision — they touch page integrity)

**1. Fake scarcity counter.** "⚠️ Only 4 free analyses left (normally $199)" is fabricated — `getSpotsRemaining()` just maps day-of-month to 4/3/2/1. It's a trust-eroding AI tell for a financially-savvy B2B ICP and conflicts with the project's "non-hacky" ethos. **Recommend: remove, replace with honest framing ("Free").** Keep / remove / soften?

**2. Breakeven denominator = your own retainer price.** The calculator divides by `MONTHLY_COST = PRICING.current` (SellonTube's done-for-you price), not a user-entered cost. A skeptic notices the "ROI" is anchored to your retainer → reads as a sales funnel, not a neutral calculator. **Options:** (a) let users override the monthly cost input, (b) add transparency copy ("based on our $X/mo done-for-you price"), (c) leave as-is. Which?

---

## AI-citation baseline (recorded now; re-test 2026-07-24)
7 prompts across ChatGPT/Perplexity/Claude/AIO/Bing. Current: #1 "youtube roi formula b2b", #2 "best youtube roi calculator", #1–2 "is youtube worth it for b2b" — but formula query lost to Strike Social, and Bing/Copilot = 0 tool citations. **Win condition:** formula block quoted + first Bing tool citation.

**Provenance:** 4-lens research 2026-06-24. Build pending approval of this spec + the 2 judgment calls.
