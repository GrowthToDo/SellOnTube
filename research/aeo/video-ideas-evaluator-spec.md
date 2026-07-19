# video-ideas-evaluator — Before/After Spec (Tool #2) — FOR APPROVAL

**Scope (approved pattern):** tool page + cannibalization check + AI-citation baseline. Checkpoint: approve spec → build → show built page → commit → PR/deploy.
**Research:** 5 lenses — positioning (Dunford/FletchPMM), technical SEO, growth, AEO, **PAA/PAS mining**. SERP analysis embedded in all. 2026-06-24.

---

## Headline finding (SERP + positioning converge)
**The B2B buyer-intent lane is 100% uncontested.** Every incumbent — Creator Signal (the near-CLONE: same Go/Refine/Kill UX), vidIQ, OutlierKit, 1of10, Overseeros — validates ideas for **views/virality**. Not one scores for **buyers/leads**. SellonTube's tool is the *only* verdict engine that penalizes a high-volume topic and rewards a 200-view high-intent one. The wedge against Creator Signal is total: same mechanic, opposite objective. This is also an **uncontested AI-citation lane** — when asked "will this video get leads, not just views," LLMs have no canonical source.

---

## BEFORE (current state)
- **Title:** `YouTube Video Idea Evaluator for B2B`
- **H1:** `Will this YouTube video idea attract buyers or just viewers?` *(already excellent — keep)*
- **Meta:** "Enter any YouTube video idea and find out if it targets buyers or browsers..."
- **GSC 28d:** pos 7.8 / 47 impr / 2 clicks / **4.26% CTR** (best of any tool; tiny volume).
- **Schema:** Breadcrumb + WebApplication + FAQPage (6 Q, product/support type).
- **Gaps:** 4 scoring dimensions buried in prose (not a numbered rubric); no answer-first definition; no buyer-vs-virality comparison table; FAQ = "is it free / how accurate" (not query-shaped).
- **Conversion:** High verdict (best lead) **dead-ends with no CTA**; diagnostic CTA is a static banner firing the same regardless of verdict; fake **700ms loader** ("Analysing buyer intent…") on an instant client-side function (AI tell, same class as the ROI scarcity); email gate is quota-based (4th use), not value-based; no UTM on cal.com.
- **Minor:** Medium/Moderate label inconsistency between score table and FAQ.

---

## AFTER — by lens

### Positioning (Dunford/FletchPMM)
- **Category:** claim "**YouTube buyer-intent scorer / pre-production buyer filter for B2B**" — not generic "video idea validator" (Creator Signal's lane).
- **Anti-positioning line** (server-rendered, surfaced high): "This scores whether your video attracts buyers, not whether it goes viral. Want a verdict on views and trends? Use a creator tool like Creator Signal. This one kills topics that get views but zero pipeline."
- **Hero subhead:** "Creator tools tell you if a video will go viral. This tells you if it will fill your pipeline."
- **Guardrail:** keep "directional gate, not a predictor" hedge (engine is keyword pattern-matching) — don't overclaim prediction.

### SEO / keywords (SERP + PAA/PAS)
- **Title** → `YouTube Video Idea Evaluator: Check Buyer Intent (Free)` — KEEP "Evaluator" (ranking equity for "video evaluator" pos 7.8 + URL + entity), ADD "check buyer intent" + "free". Do NOT drop "evaluator" for "validator" (risks the rank we hold); weave "validator/check" into meta + FAQ instead.
- **Meta** → "Free YouTube video idea evaluator. Paste any idea and check whether it will attract buyers or just viewers, scored across 4 buyer-intent dimensions. Instant verdict, no signup."
- **Category (ONE phrase, Dunford):** "buyer-intent check for YouTube video ideas." Position against the *category* (creator/virality tools), name Creator Signal once at most.
- **INBOUND LINKS = first-class deliverable (the real traffic lever for a 47-impr page):** add contextual links INTO this tool from `/blog/youtube-views-but-no-leads` and `/blog/youtube-marketing-not-working` (those readers have exactly this problem), anchor "validate whether a video idea will generate leads". This routes equity better than any on-page tweak.
- **H1** → keep (nails "is my idea good" intent verbatim).
- **Long-tail wins (tool):** "video evaluator" (climb pos 7.8→top 5), "youtube idea validation tool", "validate youtube video idea", "is this video worth making". **Blog territory:** "topics that drive leads not views", "is search volume a good way to pick topics" (contrarian, citable) — route equity to the tool.
- **Cannibalization:** LOW — evaluator vs generator cleanly split; keep them differentiated (evaluator owns validate/check verbs, generator owns generate). Add inbound links from `/blog/youtube-views-but-no-leads` + `/blog/youtube-marketing-not-working` with anchor "validate whether a video idea will generate leads". Add outbound to Script Generator on High verdict ("Idea scored high? Generate the script →").

### AEO (citation wins, all static HTML)
1. **Answer-first definition** block: "A YouTube video idea evaluator for B2B scores a video topic on buyer intent — whether the people who'd watch it are evaluating a purchase — rather than on predicted views or virality."
2. **Numbered 4-dimension rubric** (the #1 add — LLMs cite numbered criteria; converts the prose dimensions into an extractable list) + **HowTo schema** (4 steps). Ends with the quotable heuristic: "Produce it only if it scores High on Buyer Intent and at least Medium on Audience Fit."
3. **Buyer-intent vs virality comparison table** (the differentiator; no incumbent owns it).
4. **KeyTakeaways** block (answer + 5 bullets).
5. **FAQ → 8 query-shaped** (below), JSON-LD synced.

### AEO FAQ final set (8)
1. How do I validate a YouTube video idea before making it?
2. How do I know if my video idea is worth making?
3. What is buyer intent in a YouTube video idea?
4. What's the difference between a video made for views and one made for leads?
5. How do I know if a video idea fits my target customer?
6. Is search volume enough to decide what video to make?
7. What makes this different from Creator Signal or vidIQ?
8. Is the evaluator free, and how does it score ideas?

### Growth / conversion
- **Verdict-reactive diagnostic CTA** (biggest leak fix): on **High** verdict, inject "This idea attracts buyers. The video still has to convert them. → Map my conversion path" (cal.com). Moderate/Low get reframe-oriented CTAs. Demote the Generator link to secondary.
- **Remove/shorten the fake 700ms loader** (AI tell on an instant function).
- **UTM on cal.com** (`utm_content` varies by verdict tier) + `tool_cta_click destination:diagnostic` event.
- **Congruent capture on High** ("email me this evaluation + how to title it") instead of pure quota gate.

---

## Judgment calls (need your nod — touch JS/behaviour)
1. **Fake 700ms loader** → remove (recommend), or keep? It fabricates "analysis" latency on an instant function. Same AI-tell class as the ROI scarcity counter.
2. **High-verdict CTA rework** → re-point the primary post-verdict action from the Generator to the **diagnostic call** on High verdicts (Generator demoted to text link). This changes the tool→funnel routing. OK?
3. **Reconcile Medium vs Moderate** wording across score table + FAQ + schema (cosmetic consistency).

## Measurement (honest — this is a citation + conversion play, NOT traffic)
47 impr / 2 clicks = traffic metrics are statistical noise for months. Judge this page on: (1) **AI citations** (prompt tests below — the uncontested lane), (2) the **structural conversion fix** (High-verdict no longer dead-ends), (3) email captures (`source: youtube-video-ideas-evaluator`). NOT CTR/impressions.

**Deferred separate bet (not this PR):** contrarian blog "Why search volume is the wrong way to pick YouTube topics" — owns a citable query no incumbent holds + funnels equity to this tool. Likely a bigger win than the tool page; scope as its own follow-up.

## AI-citation baseline (re-test 2026-07-24)
Today: **0/9** prompts cite the evaluator. Tier-1 (uncontested) targets: "how do I know if a YouTube idea will get leads not just views", "difference between viral vs buyer-intent video idea", "tool to evaluate a YouTube idea for B2B buyer intent". Target: ≥2 Tier-1 citations + the new rubric/comparison lifted.

**Provenance:** 5-lens research 2026-06-24. Build pending spec approval + the 3 judgment calls.
