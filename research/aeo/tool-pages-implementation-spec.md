# Tool Pages — Implementation Spec (A + B preview, pre-approval)

**Purpose:** show, per A+B tool, the **Before → After**, the **logic**, and the **research** behind each change — for review BEFORE any page is edited.
**Scope:** A (5): seo-tool, roi-calculator, channel-audit, competitor-analysis, video-ideas-evaluator. B (3): autocomplete-keywords, script-generator, video-ideas-generator.
**Status:** GSC cannibalization research = DONE (below, real data). Live-SERP result-type/features = pending read-only pre-flight (§4). After-copy is drafted for seo-tool (worked example) and directional for the rest until SERP confirms.

---

## 0. Headline research finding — blog↔tool cannibalization (REAL, from GSC 3-mo export)

For most tools, a SellonTube **blog** post ranks **page 1** for the tool's cluster while the **tool** page is stuck **page 3**. They split equity and intent. Fixing this is the largest before→after lever.

| Cluster | Tool page (pos / impr) | Competing blog (pos / impr) | Who ranks better |
|---|---|---|---|
| youtube seo tool | seo-tool — **34.8** / 571 | best-youtube-seo-tools-for-business — **9.1** / 281 | **blog** (page 1) |
| autocomplete keywords | autocomplete-keywords — 9.9 / 1070 | best-youtube-autocomplete-keyword-tools — 9.9 / 3994 | **tie — both page 1, fighting** |
| youtube script | script-generator — **11.4** / 578 | youtube-script-writing-guide — **8.5** / 1477 | **blog** (page 1) |
| competitor analysis | competitor-analysis — **27** / 745 | youtube-competitor-analysis — **7.3** / 7 | **blog** (page 1) |
| youtube roi | roi-calculator — 8.8 / 318 | youtube-marketing-roi — 8.0 / 144 | **both page 1, fighting** |
| channel audit | channel-audit — 29 / 319 | youtube-channel-optimization-checklist — 13.3 / 741 | **blog** |

**Implication:** the fix is **intent assignment**, not more on-page blocks:
- **Blog owns** informational "best X tools / how to X" (listicle/guide intent).
- **Tool owns** transactional "free X / X checker / X generator" (doer intent).
- Then add **reciprocal internal links** with correct anchors, and differentiate titles so they stop competing.

This is the research that should drive the before→after — confirmed live by the SERP step (§4).

---

## 1. Per-tool spec format (what each entry contains)

```
BEFORE   — current title tag, H1, meta, position/impr, top real queries, structure, gate
RESEARCH — cannibalization (done) + live SERP: page-1 result type (tool/listicle/video),
           SERP features (AIO/video pack/ads), top 3 competitors, intent verdict, winnable?
POSITION — competitive alternative · differentiator · category · anti-positioning line
AFTER    — new title/H1/meta, KT answer+points, FAQ focus, structural change, internal links, CTA
LOGIC    — why each change, tied to research + positioning + an SEO principle
DEPTH    — A (full §4 stack) or B (title/meta + KT only) · risk note
```

---

## 2. Worked example — `youtube-seo-tool` (Tier A, reference)

**BEFORE**
- Title tag: `Free YouTube SEO Tool for Business Channels`
- H1: `Free YouTube SEO Tool: Why Your Videos Aren't Reaching Buyers`
- Meta: `Free YouTube SEO tool for business channels. Paste your video URL and get a plain-English diagnosis...`
- GSC: pos 27 (28d) / 371 impr / **0 clicks**. Top queries: "best tool for youtube seo" (32), "best seo tool for youtube" (34), "best youtube seo tools free" (30), "free seo tool for youtube" (36).
- Structure: hero → tool → how-it-works → **9 content sections** → FAQ → related.
- Gate: email after 3 uses.

**RESEARCH**
- Cannibalization (done): blog `best-youtube-seo-tools-for-business` ranks **pos 9** vs this tool **pos 35** for the same "best youtube seo tool" cluster. The blog already owns the listicle intent; the tool is competing for a query it can't win (the SERP wants a *list*, not one tool).
- Live SERP (pending §4): confirm "youtube seo tool" / "best youtube seo tool" page-1 = listicles? video? any AI Overview? → verdict: **tool page should NOT chase "best youtube seo tool"; it should own "youtube seo checker / free youtube seo tool / check youtube seo"** (transactional, single-tool intent).

**POSITION**
- Alternative: vidIQ / TubeBuddy (creator SEO) · generic free SEO checkers.
- Differentiator: scores **buyer-find-ability**, not view-reach. Visible proof = the 5-dimension buyer-intent scorecard.
- Category: YouTube SEO **for B2B customer acquisition**.
- Anti-positioning line: *"Not for creators chasing views — vidIQ and TubeBuddy do that better. This scores one thing: can a buyer find and act on your video."*

**AFTER**
- Title tag → `Free YouTube SEO Checker — Built for Buyers, Not Views`
- H1 → `Free YouTube SEO Checker: Are Buyers Finding Your Videos?`  (+ subhead names the vidIQ contrast)
- Meta → `Free YouTube SEO checker for B2B. Score any video's buyer-find-ability across 5 dimensions and get the exact rewrites. No login, results in 30s.`
- Hero badges → Free · No YouTube login · 5 SEO dimensions · Exact fixes in 30s *(done)*
- KeyTakeaways *(done)* — answer-first definition + 5 points; the `answer` is the citable claim.
- Anti-positioning line added below KT.
- FAQ refocused to real long-tail: "is it free?", "no sign up?", "is it accurate?", "**how is this different from vidIQ/TubeBuddy?**"
- Internal links: reciprocal with `best-youtube-seo-tools-for-business` (blog links down to tool with anchor "free YouTube SEO checker"; tool links up to blog with anchor "best YouTube SEO tools"). Plus links to `/youtube-for/saas|consultants|agencies`.
- Structure: 9 → ~5 sections (keep scorecard, business-vs-creator table, lead-gen bridge, FAQ, related; cut "logic"/"mistakes"/"by business type"; merge who-for).
- CTA: lead-gen bridge → diagnostic call.

**LOGIC**
- Retitle to "checker" + own transactional intent → stops the unwinnable fight with our own blog for "best tool" (cannibalization research). SEO principle: one URL per intent.
- Lead with differentiator, not "free" → "free" is table-stakes (every competitor is free); "buyers not views" is the reason to choose + the reason to be cited (positioning).
- KT static + answer-first → the only server-rendered, citable unit (tool output is JS, invisible to crawlers).
- Trim sections → tool-page rank = task-completion/engagement, not word count; cut filler that buries the tool. (Only after SERP confirms it's an intent fight, not a depth gap.)

**DEPTH:** A — full stack. Risk: content removal on indexed page (mitigated: 0 clicks today, reversible on branch).

---

## 3. Directional spec — other A + B tools (full After-copy finalised post-SERP)

Each carries the same format; below = BEFORE + research verdict + AFTER direction. Real GSC data; live-SERP fills the result-type.

**A · roi-calculator** — pos 8.8 / 318 / 2 clicks. Queries: "youtube roi", "youtube video roi". Cannibalizes with blog `youtube-marketing-roi` (pos 8). *After:* assign tool = calculator/transactional ("youtube roi calculator"), blog = "youtube marketing roi" guide; reciprocal links. Lead differentiator: "does YouTube pay back for *your* deal size?" KT + tighten. Depth A. **Highest-ICP, already page 1 → fastest income.**

**A · channel-audit** — pos 29 / 319 / 6 clicks. Queries: "youtube channel audit", "channel checker". *After:* own "free youtube channel audit"; reposition to business-channel audit (vs creator analytics); KT + proof (4-dimension score) + CTA. Depth A.

**A · competitor-analysis** — pos 27 / 745 / 3 clicks. Queries: "check competition", "youtube competition checker". Blog `youtube-competitor-analysis` ranks pos 7 (tiny impr). *After:* tool owns "youtube competitor analysis **tool**"; differentiate "can you *beat* what ranks" (go/no-go for B2B), not generic analytics. KT + table. Depth A.

**A · video-ideas-evaluator** — pos 7.8 / 47 / 2 clicks (4.3% CTR). Query: "video evaluator". *Purest buyer-intent tool, already page 1, thin volume.* *After:* lead "does this idea attract *buyers or just viewers*?" (the wedge, literally). KT + internal links from idea-stage blogs. Depth A. Low risk (already converts at 4%).

**B · autocomplete-keywords** — pos 9.9 / 573 / 8 clicks (1.4%). Query: "youtube autocomplete". **Both tool AND blog `best-youtube-autocomplete-keyword-tools` sit ~pos 9-10 → fighting on page 1.** *After (B, light):* title/meta rewrite to split intent (tool = "youtube autocomplete **tool**"; blog = "best autocomplete tools") + KT. No rebuild. Resolving the tie could push tool into top 5.

**B · script-generator** — pos 11.4 / 578 / 3 clicks. Queries: "ai youtube script generator". Blog `youtube-script-writing-guide` ranks pos 8 (better). *After (B):* title/meta → own "youtube script **generator**" (tool) vs blog "how to write" (guide); KT; reciprocal link. Light.

**B · video-ideas-generator** — pos 11 / 37 / 0 clicks. Query: "video idea generator for youtube". High ICP, thin. *After (B):* title/meta + KT lead "video ideas that attract buyers, not views"; internal link from evaluator. Light, low effort.

---

## 4. Live SERP findings — DONE (read-only pre-flight, 2026-06-24)

**The single biggest finding: every incumbent is creator/views-framed.** vidIQ, TubeBuddy, TubeRanker, Creator Signal, ryrob, keywordtool.io — all optimise for views / virality / subscribers. The **"YouTube for B2B buyers, not views"** position is genuine white space across all 8 SERPs. The positioning strategy is validated by the live competitive set.

| Tool | Page-1 result type | Top competitors (all creator-framed) | Winnable? | Verdict |
|---|---|---|---|---|
| seo-tool | tools + 2 listicles | TubeRanker, TubeBuddy, keywordtool.io | Yes via position | Tool format ranks; own "seo checker", cede "best tools" to our blog |
| **roi-calculator** | tools + blog + video | Strike Social, rows, madcapper (all **ad**-ROI) | **Already #2 US** | Competitors do *ad* ROI; we own *business* ROI. Fastest win. |
| channel-audit | **all tools** + 2 listicles | vidIQ, TubeBuddy, hypeauditor | Yes via position | All "grow subs"; B2B-channel audit = white space |
| competitor-analysis | tools + guides | vidIQ, OutlierKit, Socialinsider | Yes via position | All analytics/benchmark; we own "can you *beat* it" go/no-go |
| **video-ideas-evaluator** | tools + guides | **Creator Signal** (near-clone: Go/Refine/Kill) | Yes via position | Clone exists but **for virality**; we score *buyer intent* — sharpest contrast |
| autocomplete-keywords | scrapers + **our blog** | youautocompleteme, botster, keywordtool | Tie → split intent | Our blog listicle ranks; tool should own "autocomplete **tool/scraper**" |
| **script-generator** ⚠ | **transcript tools** | youtubetotranscript, tactiq, notegpt (+ vidIQ) | Muddy | **SERP hijacked by *transcript* tools** — Google conflates script/transcript. Retarget to "script writing for business", don't fight this SERP |
| video-ideas-generator | all tools | ryrob ("No Login"), vidIQ, Lenos | Crowded, low vol | All viral-framed; white space but only 37 impr → light touch |

**Other pre-flight results:**
- **Indexation:** all A+B tools show GSC impressions → all indexed. No action.
- **Canonical/legacy:** roi-calculator + video-ideas-evaluator have clean 301s in netlify.toml (`/youtube-roi-calculator`, `/calculator`, `/youtube-topic-evaluator`). No leak. No tool-page duplicate-canonical issue found.
- **Funnel infra (confirmed):** `capture-email.ts` writes to a Google Sheet (Apps Script) **and** Loops.so, tagged `toolName=source`. So per-tool capture IS tracked. **Baseline numbers need a user-side pull** from the Loops dashboard (contacts by source) — not API-accessible to me. cal.com bookings likewise user-side.

**SERP-driven changes to the AFTER direction:**
- **script-generator (B):** do NOT optimise for "youtube script generator" (transcript-tool SERP). Retarget to "youtube script writing for business" / link to existing script blogs. Lowest priority in B.
- **video-ideas-evaluator (A):** lead copy with the direct Creator-Signal contrast — "validates for *buyers*, not virality."
- **roi-calculator (A):** already #2 → pure CTR + conversion play (title/meta + KT + tighten), no rebuild needed. Promote to first income win.

---

**Provenance:** GSC 3-mo export + 28d live (2026-05-25→06-21). Cannibalization = measured. Live SERP/funnel = pending. Drafted 2026-06-24. Pairs with `tool-pages-retrofit-plan.md` (v3).
