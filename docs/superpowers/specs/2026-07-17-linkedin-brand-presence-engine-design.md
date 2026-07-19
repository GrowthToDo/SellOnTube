# LinkedIn Brand-Presence Engine — Design Spec

**Date:** 2026-07-17
**Branch:** social-media
**Status:** Draft (awaiting user review)
**Supersedes:** parts of `2026-03-26-linkedin-autopublish-agent-design.md` (link-in-body model, old weekday themes, human review gate)

---

## Overview

An upgrade to the existing LinkedIn autopublish system. Claude writes a batch of posts for the SellonTube **company page**. Generation includes a self-critique/revise loop; a light mechanical validation is the last-line assert. The Node script schedules the batch to Zernio, future-dated at 9 AM IST, and Zernio drips them out automatically. Between refills the system is hands-off.

The prior system (March 2026) is built and working: it posts to Zernio, uploads images, dedups against a 30-post history. This spec **reuses that plumbing** and changes: link placement (body → first comment), post mix (all-linked → 2 SellonTube-link + 2 source-named no-link + 1 flex per week), and review model (human gate → generation-time self-critique + light mechanical assert + hands-off batch-and-drip).

**X/Twitter is out of scope** — X charges per API call and requires a card; it cannot run on Zernio's free tier.

---

## Positioning (decided, do not drift)

This is a **brand-presence engine for human B2B buyers on LinkedIn.** It is NOT the AEO/LLM engine.

LinkedIn is login-walled and blocks crawlers, so its posts are poorly ingested by LLMs and barely indexed by Google. AEO stays where it is winnable — the SellonTube website (`ai-seo-guide.md` + agents system) and, later, crawlable channels (X, Reddit). This engine's job is consistent, high-quality presence in front of B2B founders / SaaS operators / service businesses evaluating YouTube for customer acquisition.

Do not measure this system by AEO citations or Google impressions. Measure it by LinkedIn reach/engagement and referral clicks from the weekly link post (UTM-tagged).

**Brand voice = blend.** Posts speak in an educational, POV-driven voice that fits either a product/tools company or a service — never pinning the business model. This resolves the mismatch between the live LinkedIn About ("marketing agency") and the site strategy (product/tools-first). Posts teach and take positions; they do not say "hire us" or "buy our tool" as the core message. Brand mention stays natural (the company-page byline already carries it).

---

## Goals

- Publish up to 5 high-quality company-page posts per week (Mon–Fri), fully hands-off between refills.
- Every post is **self-contained** and carries **one hard, implementable takeaway** the reader can act on Monday morning.
- Blend: 2 SellonTube-link posts (link in first comment) + 2 self-contained source-named posts (no link) + 1 flex (contrarian, or occasional authority-lesson) per week.
- **Cadence is a ceiling, not a quota:** a post that cannot pass the self-critique rubric is dropped, never padded to hit 5. A weak week publishes 4 rather than 5 filler-grade posts. This is how 5/week runs without compromising quality.
- No off-brand, low-quality, or fabricated post reaches the page — enforced by generation-time self-critique plus a mechanical assert, since there is no human review.
- Zero recurring Zernio cost. No AI API keys, no cron infra, no paid features.

---

## Cadence & weekly structure

**Up to 5 posts/week: Monday–Friday.** Zernio imposes no cost or cap on cadence (LinkedIn is billed per account-day, not per post), so 5/week is free. The quality risk of 5/week — thin, repetitive takeaways in a narrow niche — is controlled not by lowering cadence but by the **ceiling-not-quota rule**: any post that fails the self-critique rubric is dropped, so the week publishes only posts that clear the bar (4 good beats 5 with one filler).

Weekly mix: **2 SellonTube-link posts + 2 self-contained source-named posts + 1 flex.** Fixed weekday rotation:

| Day | Archetype | Link | Notes |
|-----|-----------|------|-------|
| Monday | Framework / mental model | No link | Names a real authority source (evidence bank) |
| Tuesday | Tactical how-to | **SellonTube link** (first comment) | Full method on the page |
| Wednesday | Mistake / anti-pattern | No link | Names a real authority source (evidence bank) |
| Thursday | Proof / case study | **SellonTube link** (first comment) | Full data/breakdown on the page |
| Friday | **Flex:** contrarian/myth-bust, OR (occasionally, ~1-2x/month) an **authority-lesson** post | No link, or authority's video link **in the post body** | See authority-lesson rules below |

**SellonTube-link posts (Tue, Thu):** source-anchored. Derived from a real SellonTube page (blog/tool/pSEO). Useful and self-contained, but the *full* payoff (complete framework, full data, the tool itself) lives on the linked page. The UTM link goes in the **first comment**. Tease-don't-tell applies here.

**No-link posts (Mon, Wed):** idea-first. The complete value is in the post — give the takeaway, do NOT withhold the payoff. Each names a real authority source (from the evidence bank) for credibility. No link, no `firstComment`.

**Flex post (Fri):** usually a self-contained contrarian/myth-bust (no link). Occasionally (~1-2x/month, not weekly) an **authority-lesson** post: extract one real lesson from a named complementary authority's video (Ahrefs, StarterStory, Ayman Arab, and similar voices who teach YouTube-for-business growth), teach it self-contained and applied to B2B, name the authority for credibility, and put their video URL **in the post body** so LinkedIn renders the native video preview card. This is still "teach the lesson + name the source," NOT straight resharing — the lesson delivers value in-feed above the preview; the video is the visual and the deeper dive. Draws only from the vetted curated-video bank (no fabricated videos). Competitor-adjacent authorities (e.g. Ahrefs) are allowed because the taught lesson keeps SellonTube's value in-feed while borrowing their authority.

**Trade-off accepted, to be measured in phase 1:** a body link (esp. YouTube) incurs LinkedIn's reach penalty and replaces the branded takeaway card with the native video preview. This is deliberate for video posts (the preview is compelling and these are occasional). Phase-1 metrics compare authority-lesson reach against no-link posts; if reach suffers badly, phase 2 moves the video link to the first comment. SellonTube blog/tool links stay in the first comment (a blog preview is not worth the penalty).

---

## Content rules (every post)

- **Hook:** first 1–2 lines must stop the scroll (only ~2 lines show before "see more"). No "In today's digital landscape", "Here are 5 tips", "Most YouTube...", "Game-changing", "Unlock the power of".
- **One hard takeaway:** one specific, testable, implementable thing. Test: *can a reader screenshot one paragraph and go do it?* Generic ("post consistently") fails; specific ("script the first 15 seconds to answer the search query verbatim, or you lose ~40% of viewers") passes.
- **Self-contained:** real value on its own. No-link posts contain the full takeaway; the link post gives enough to be credible plus a tease toward the page.
- **No fabricated data (hard rule):** no statistic, metric, case-study number, or named result may appear in a post unless it exists on a real, published SellonTube page (for link posts, the linked page) OR in the authority-evidence bank. No invented "a SaaS got X leads" figures.
- **Name a real authority source where it fits (credibility, no fakes):** citing a credible named source ("Ahrefs' research shows...", "per Wyzowl's video report...") borrows authority and aids AEO. But every such citation MUST come from the authority-evidence bank (real stat + real source). Never invent a source, stat, or attribution. If nothing in the bank fits, name no source rather than fabricate one. Mon/Wed posts are required to name a source; other posts may where relevant. A cited stat's wording stays faithful to the source (don't reword "shoppers" to "buyers" if the source said "shoppers").
- **Founder first-hand experience (anonymized) is an allowed source:** real things Sathya saw/did at a previous company may be used even though they're not on a SellonTube page, on three conditions — (1) Sathya can personally vouch it's true, (2) no confidential party is named or made identifiable ("a company I worked inside", never the name), (3) it is NOT reframed as SellonTube's own work/client/test. Stored as a "founder-experience" source type alongside the evidence bank.
- **Proof/case-study posts pair first-hand data with one corroborating authority stat** (the founder anecdote is the proof; a bank stat backs it, since a skeptical reader discounts a company's own numbers).
- **Length:** 900–1,700 characters.
- **Format:** short lines, whitespace between ideas, skimmable. One idea per post.
- **Brand:** "SellonTube" may appear when natural, but is NOT forced into every post. The company-page byline already carries the brand; jammed-in mentions read as formulaic and the entity benefit is not this channel's job.
- **Tone:** sharp, business-aware, practical. Not motivational, not guru-ish. Aligned to `docs/blog/style-guide.md`.
- **No em dashes** (site style rule). Use commas, colons, full stops.
- **Hashtags:** 0–3 max, only if relevant.
- **Audience:** B2B founders, SaaS operators, service businesses evaluating YouTube for acquisition. Not creators (no thumbnail/retention tips).
- **Dedup:** no repeated angle, hook, or source page within the last 30 posts (`linkedin-history.json`).
- **UTM on every link:** SellonTube links use `utm_source=linkedin&utm_medium=social&utm_campaign=brand-presence` (feeds our GA4). External links (e.g. authority videos) use `utm_source=sellontube&utm_medium=referral&utm_campaign=linkedin` — a self-identifying relationship signal that lands in the *external* site's analytics, not ours. Standing rule, applied to any link regardless of destination. (Weak signal on YouTube, which ignores it; real credit there is naming/@mentioning the authority.)

---

## Templates, hooks & closes (generation craft)

> **Canonical writing craft now lives in `docs/social-media/linkedin/linkedin-writing-guideline.md`** — the consolidated, reverse-engineered playbook (thesis-first pipeline, structure menu, hook rules, voice, evidence discipline, humanizer, gold/anti examples, pre-publish checklist). Agent 09 follows that guideline verbatim. The rules below are retained as the design rationale; where they and the guideline ever differ, **the guideline wins** (single source of truth, to avoid duplication drift). Key additions the guideline formalizes beyond the rules below: **thesis-first** (write + gate the thesis before drafting; structure is chosen to deliver it, weekday demoted to a soft variety guard) and the **hook-carries-the-thesis-payoff** check.

The archetypes are *format* labels. Craft is what makes each one land. These are the concrete tools the writer uses; the rubric grades against them.

### The acquisition axis (non-negotiable topic constraint)

Every post — regardless of archetype — must answer: **"How does this help the business get a lead, client, or customer?"** The ICP does not care about views, subscribers, watch time, or channel growth as ends. A takeaway that stops at traffic/views/subs is off-axis and must be rejected or reframed to connect to pipeline. This is the single most important content constraint: format is the archetype, but the topic is always *acquisition via organic YouTube*, never *creator growth*.

Examples of on-axis vs off-axis takeaways:
- Off-axis: "Use autocomplete to find high-volume keywords." (traffic)
- On-axis: "Target bottom-funnel comparison queries ('X vs Y', 'best tool for Z') — low volume, but every viewer is a buyer evaluating options." (customers)
- Off-axis: "Post consistently to grow your channel." (subs)
- On-axis: "Put the soft CTA to book a call around the 60% mark, not the end — most B2B viewers who convert leave before the outro." (leads)

### Voice (locked from sample-1 review — applies to every post)

1. **Hook = contrarian/misconception, always.** Open by stating a myth or common belief, then demolish it (e.g. quote the bad advice, then knock it down). Never open flat or descriptive.
2. **Direct 2nd-person.** Talk to the reader's actual situation (skeptical their YouTube effort will ever produce customers). Make them feel seen. Lead with "you" at the emotional beats (hook, callout, close). Never name a job title in-copy (audience is a blend; naming one persona excludes the rest). Balance "you" with the occasional "we/I" so it reads as a conversation, not an interrogation — over-"you" turns preachy/accusatory.
3. **Dry wit + edge + self-aware.** Humor comes from saying the true-but-unspoken thing, not forced jokes. Company page, so credible-with-a-pulse, never clownish or guru-ish.
4. **Narrative frame + bulleted core.** Story/observation around a scannable middle. Use → bullets ONLY where items are genuinely parallel (e.g. a real 3-tier list). Never a wall of bullets (that is the banned listicle).
5. **Plain source attribution.** "Google's research found...", "per Ahrefs' data..." Never cutesy/colloquial verbs (reckons, figures, says).
6. **Humanizer pass (mandatory, in the generation loop).** Every post is scanned for AI tells before it clears the self-critique gate: anaphora tricolons ("Big X. Big Y. Big Z."), AI vocab (leverage/delve/crucial/robust), copula avoidance (serves as/functions as), forced rule-of-three, negation-pairs ("not X, not Y" / "You don't have an X problem, you have a Y problem"), generic positive closers, inline-header lists ("Here's the thing:"), em/en dashes. Any hit is rewritten. See the `humanizer` skill for the checklist.
7. **Precision on the action, quirk on the color.** Any instruction or step uses literal, unambiguous verbs ("fills in", "create", "open") so it can't be misread. Wit lives only in the framing and asides, never on the thing you're telling the reader to do. A clever verb that muddies a step (e.g. "coughs up the phrases") is always the wrong trade.
8. **Contractions + numerals, always.** "you're/that's/I'm/you've", and "15 mins / 50 / 200 views" not "fifteen minutes / fifty". Casual abbreviations where natural.
9. **Quirk techniques (seasoning, not the dish):** one-word reactions ("Cute."), concrete/slightly-absurd specifics ("a comment section that's just your co-founder and a bot selling crypto"), hard rhythm breaks (long line, then a 2-word punch), a named villain to push against, a cheeky aside. Substance stays dominant.
10. **Humor calibration (hands-off insurance).** The reviewed samples are the *taste ceiling*, not the target. The automated engine aims a notch BELOW max funniness on purpose: humor fails louder than substance, and an unsupervised system writing 20 posts will misfire more than a hand-written one. Past the ceiling there's also a credibility tax — the reader enjoys the post but stops trusting you with their pipeline. Wit is seasoning; the operator-who's-sharp voice is the dish.
12. **Bullet the scannable, never the rhythmic.** → bullets are for genuine parallel steps/options the reader scans or acts on. Never bulletize a rhetorical/rhythmic prose beat ("Fewer people, the right people, at the moment they're deciding.") — that flattens the cadence and reads more mechanical, not less.
13. **Personal founder voice ("I/me"), consistent.** Posts publish from the company page but speak in the singular first person (the founder talking), never corporate "we/us" for the narrator. Keep the implied person consistent across posts.
14. **Engagement question on link posts is contextual.** No-link posts always close on a discussion question. Link posts may add a soft engagement question before the page-pull WHEN it fits the post (engine decides by type), but the click stays the priority.

15. **Veritasium mechanics (contrarian / mistake / proof archetypes ONLY; NOT how-to or framework).** For belief-revision posts, layer three moves on top of the contrarian hook: (a) **delay the explanation one beat** — after the misconception, open a loop ("...they fail because of something founders never measure") before paying it off, don't answer in the next sentence; (b) **make the reader predict** — pose a concrete either/or ("Two channels, same product: 50k subs vs 400 subs. Which books more demos?") so they commit before the reveal, then surprise them; (c) **end so it reframes the opening** — close by making the first line read differently. Scope + guardrails: do NOT apply to tactical how-to (Tue) or framework (Mon) posts — those must teach directly; delaying/withholding wrecks them. Use ONE core misconception per post (not Veritasium's stacked loops — no room in 1,400 chars). Deliver the actionable payoff by the last third, never withheld to the final line (LinkedIn attention + our screenshot-able-takeaway promise). Substance leads; the open loop is a device, never clickbait — B2B buyers distrust withheld-answer teasing. These posts run longer (~1,500-1,700), an accepted trade for the archetype. Any predicted/observed scenario must be real (founder-experience) or clearly framed as hypothetical — never a fabricated case presented as real.

11. **Write to ONE person, coffee-chat register (top-level rule).** Every post talks to a single reader like a friend over coffee: direct, conversational, a peer leaning in, never a speech from a stage. Tactics: (a) singular "you," never crowd words (everyone/folks/teams/those-of-you); convert "most channels do X" to "you do X"; (b) picture one real founder/marketer and write to them, not a segment; (c) spoken cadence — short sentences, fragments allowed; (d) mid-post check-ins ("Sound familiar?"); (e) kill stage/throat-clearing ("In this post", "Let's dive in", "There are three things"); (f) 2nd-person imperatives for steps ("Open YouTube."); (g) concrete shared references ("that Monday standup"); (h) peer complicity, an occasional "I've done this too" / "we all did this"; (i) read-aloud test — if it sounds like a keynote, rewrite. This also resolves the you-density ceiling in rule 2: heavy "you" is fine as long as it stays *warm and peer-level* (coffee-chat you), not lecturing-down (preachy you); the balancing "I/we" complicity is what keeps it warm.

### Hook pattern library (pick one; question-hooks are the weakest, use sparingly)

1. **Specific-number claim:** lead with the surprising metric. "YouTube drove 3.25x more conversions than blogging. Same business, same offer."
2. **Contrarian statement:** "Subscriber count is a vanity metric for B2B. Here's what actually predicts revenue."
3. **Named-mistake callout:** "The reason most B2B YouTube channels get zero customers isn't the content. It's the funnel."
4. **Cost/loss framing:** "Every video that ends with 'like and subscribe' instead of a next step is leaving pipeline on the table."
5. **Direct reader challenge:** "If you can't name the exact query your last video was built to win, it wasn't built to get you customers."
6. **Short story open:** "We watched a 2,000-view video out-convert a 90,000-view one. Here's why."
7. **Sharp question (use rarely):** only if the question itself stings and implies the answer.

### Evidence banks (make "name sources, don't fake it" safe in automation)

Hands-off generation has no live web access, so it will fabricate plausible-but-fake citations unless given real material to draw from. Two curated data files, both populated by Claude from real researched content and refreshed on the monthly refill (never a user task):

- **`authority-evidence-bank.json`** — real stat + real source pairs (e.g. `{ "stat": "...", "source": "Ahrefs", "url": "...", "context": "..." }`). The ONLY source of any named stat/citation in a post. Verified real at population time.
- **`curated-video-bank.json`** — vetted real videos for authority-lesson posts (e.g. `{ "channel": "Ahrefs", "title": "...", "url": "...", "lesson": "...", "b2b_application": "...", "linkedin_profile": "https://linkedin.com/in/...", "is_person": true }`). Complementary + authoritative voices who teach YouTube-for-business (Ahrefs, StarterStory/Pat Walls, Ayman Arab, similar). The ONLY source of any curated video. Capturing each authority's exact LinkedIn profile (person-first) is the first step when populating this bank, so Phase 1.5 can @mention them.

**@mention (Phase 1.5):** authority-lesson posts should @mention the authority's LinkedIn profile (via Zernio's `mentions` field) — a far louder "we recommended you" signal than a UTM, since it notifies them directly. Prefer the person over the brand where a person exists (Pat Walls over StarterStory, Ayman Arab directly). Deferred to 1.5 because it needs: the LinkedIn URN captured in the bank, verification of Zernio's mention format, and confirmation that a company page can @mention an individual via API (LinkedIn has historically restricted org-to-person mentions). If org-to-person mentions are not supported, fall back to mentioning the brand's LinkedIn page.

Hard rule: the generator may cite a stat/source only if it appears in the evidence bank, and reference a video only if it appears in the video bank. No bank match → no citation / no video. This converts "don't fake it" from a hope into an enforced constraint.

**Sizing:** Mon/Wed posts each require a real named source (~8-10 citations/month), so the authority-evidence bank starts with **≥30 verified stat+source pairs** to avoid repeating a source within the 30-post dedup window. The curated-video bank starts with **≥6 vetted videos** (covers ~1-2 authority-lesson posts/month for a quarter). 

**Refresh is a hard refill-step checklist item (Claude's job, never the user's):** on every monthly refill, top up both banks with fresh researched entries and drop any that have gone stale/dead, so the pool never drains below the dedup window. If a bank falls below its floor, refill research runs before generation.

### Per-archetype skeletons

- **Framework (Mon, no link):** hook (named concept) → the 1-line definition → the 2-4 parts, each one line → the one part most people skip → discussion-question close.
- **Tactical how-to (Tue, link):** hook (specific promise) → the problem it solves → 2-3 concrete steps given in-feed → tease that the full method/checklist is on the page → link in first comment.
- **Mistake / anti-pattern (Wed, no link):** hook (named mistake) → why it feels right but fails → the fix as one hard takeaway → discussion-question close.
- **Proof / case study (Thu, link):** hook (the result number, grounded in a real page) → the mechanism behind it → what it means for the reader's business → tease the full breakdown/data on the page → link in first comment.
- **Contrarian / myth-bust (Fri, no link):** hook (the myth stated flatly) → why it's wrong → what to do instead as one hard takeaway → discussion-question close.

### Closes

- **Link posts (Tue/Thu):** close is a natural pull toward the page; the UTM link lives in the first comment, never the body.
- **No-link + flex posts (Mon/Wed/Fri):** close with a **genuine discussion question** that invites the reader to self-assess or share ("Which of these three is your channel guilty of?"). This drives comments (= reach) and partially offsets the absence of human reply-engagement. Never engagement-bait ("comment YES below") — that is penalized and off-brand.

---

## Generation with self-critique loop (the real quality lever)

Because publishing is hands-off, quality lives or dies at generation. Mechanical checks only reject obvious junk; they cannot create quality. So generation is the product, and it runs a **draft → critique → revise** loop before anything reaches the mechanical assert:

```
For each post in the batch:
  1. DRAFT   — write the post per the archetype + content rules
  2. CRITIQUE — grade it against the rubric (below). Be adversarial.
  3. REVISE  — if any rubric item is weak, rewrite and re-grade
  4. Only a post that passes the rubric goes into queue.json
```

**Rubric (self-scored during generation):**
- **Acquisition axis:** does the takeaway ladder to a lead/client/customer? If it stops at views/subs/traffic, reject or reframe. (the most important check)
- Does the hook stop the scroll in the first 2 lines, and does it use a library pattern (not a weak question)?
- Is there exactly one hard, testable takeaway a reader could act on today?
- Does it follow the archetype skeleton, and does the close fit (page-pull for link posts, genuine discussion question for no-link posts)?
- Is the post self-contained (no-link) or credibly-teasing (link)?
- Is every number/claim grounded in a real SellonTube page OR the authority-evidence bank? (no fabrication)
- If a source is named, does it come from the evidence bank (real)? If a video is referenced, is it from the video bank? No bank match → remove it.
- Is it non-obvious — would a knowledgeable B2B founder still learn something?
- Is the tone on-brand (sharp, not guru-ish), no banned patterns, no em dashes?
- For contrarian/case-study (highest reputational risk): is it defensible and non-embarrassing if it travels?

This loop is Claude's job at generation time (agent 09). It replaces the human eye.

---

## Mechanical validation (last-line assert, not a subsystem)

A small validation function in the schedule script catches Claude's own mistakes before any Zernio call. Deliberately minimal (project ethos: fewer moving parts) — the heavy quality work is the generation rubric, not code.

Hard checks (fail = skip that post, keep the rest, report):
1. Character count 900–1,700.
2. No em dash (`—`) or en dash (`–`) in the post body.
3. No banned opener/phrase (list from `style-guide.md` + agent 09).
4. Link rule, keyed on `linkLocation`: `"comment"` → `firstComment` set AND body has no URL (Tue/Thu SellonTube posts); `"body"` → body contains the video URL AND `firstComment` null (authority-lesson posts); `null` → no URL in body and no `firstComment` (no-link posts). A body URL is allowed ONLY when `linkLocation === "body"`.
5. Hashtag count 0–3.
6. Angle/hook not duplicated against `linkedin-history.json`.

A failing post is **skipped and reported**, not fatal to the batch — one weak post never blocks the others.

---

## Hands-off mechanism (batch-and-drip)

Claude is not a background process; something must trigger generation. Batch-and-drip removes the weekly trigger with no new infrastructure:

```
1. User (once per batch): "write next batch of LinkedIn posts" / "refill"
2. Claude: reads history, generates the batch via the self-critique loop (drops posts that fail the rubric)
3. Claude: writes queue.json (all posts, future-dated Mon–Fri at 9 AM IST)
4. Run: node scripts/linkedin-agent/linkedin-schedule.js  (mechanical assert runs here)
5. Zernio: publishes one post per scheduled day automatically
6. When the queue nears empty, Claude reminds the user to refill
```

**Why the monthly refill is a feature, not a leak of involvement:** phase 2 = "course-correct on traction." The refill moment IS that checkpoint — one sentence a month that doubles as the traction-review gate. Fully automating the trigger away (cloud cron) would delete the exact phase-gate the user asked for; deferred to phase 2.

**First batch = 2 weeks (up to 10 posts)** to validate the pipeline end-to-end (generation → assert → schedule → live publish, incl. that `firstComment` renders as a real comment) before committing more unseen. Claude performs this one-time technical validation against the live post via the Zernio API — it is NOT user involvement. **Steady-state = 4 weeks (up to 20 posts).**

No GitHub Actions, no cron, no LLM API key in phase 1.

---

## Success metrics (define now, review at the phase gate)

So month-1 course-correction runs on data, not vibes:
- **GA4 referral clicks (automated):** pulled via the analytics MCP using the UTM on SellonTube-link posts (`utm_source=linkedin&utm_medium=social&utm_campaign=brand-presence`). Answers "did social drive site visits."
- **LinkedIn reach/engagement per post + archetype (manual, occasional):** which archetype travels. **Caveat:** Zernio's analytics API is paid-tier only and this system runs on the free tier, so these numbers are read by the user directly in LinkedIn's built-in page analytics at the traction gate — a small one-time glance, not recurring work, and accepted as such. The system cannot pull them automatically.

Phase 2 decisions (cadence up/down, archetype mix, add X, add carousels, automate the trigger) are made against these numbers.

---

## Data model

`queue.json` — array of post objects (new fields **bold**):

```json
[
  {
    "scheduledDate": "2026-07-22",
    "dayOfWeek": "Wednesday",
    "archetype": "tactical-how-to",
    "linkLocation": "comment",
    "sourceTitle": "How to find YouTube autocomplete keywords",
    "sourceUrl": "https://sellontube.com/blog/how-to-find-youtube-autocomplete-keywords",
    "imageUrl": "https://sellontube.com/_astro/....jpg",
    "firstComment": "Full method here: https://sellontube.com/blog/how-to-find-youtube-autocomplete-keywords?utm_source=linkedin&utm_medium=social&utm_campaign=brand-presence",
    "postAngle": "One-sentence angle",
    "linkedinPost": "Full self-contained post text. No URL in body.",
    "hashtags": ["#YouTubeSEO", "#B2BMarketing"]
  },
  {
    "scheduledDate": "2026-07-20",
    "dayOfWeek": "Monday",
    "archetype": "framework",
    "linkLocation": null,
    "sourceTitle": null,
    "sourceUrl": null,
    "imageUrl": null,
    "firstComment": null,
    "postAngle": "One-sentence angle",
    "linkedinPost": "Full self-contained post with the complete takeaway.",
    "hashtags": ["#YouTubeMarketing"]
  }
]
```

- `weekdayTheme` (old) → `archetype`.
- `linkLocation`: `"comment"` (Tue/Thu SellonTube), `"body"` (authority-lesson), or `null` (no-link). Single field driving assert check 4 and whether `firstComment` is sent. (Replaces the earlier `hasLink` boolean.)
- No-link posts: null sourceUrl/firstComment; `imageUrl` = generated takeaway card.
- SellonTube-link posts: `linkLocation: "comment"`, `firstComment` = UTM link, `imageUrl` = source og-image, no URL in body.
- Authority-lesson posts: `linkLocation: "body"`, video URL embedded in `linkedinPost` text, `firstComment` null, `imageUrl` null (LinkedIn renders the native video preview instead of an uploaded card).

`linkedin-history.json` — unchanged shape; add `archetype` and `linkLocation` per record for better dedup.

---

## Images

Every post ships with a visual — LinkedIn's own data shows images roughly double the comment rate versus text-only, so no post goes out bare.

- **SellonTube-link posts (Tue/Thu):** attach the source page's featured/og image (existing pipeline). It previews the destination and reinforces the click.
- **No-link posts (Mon/Wed) + contrarian flex (Fri):** an **auto-generated branded "takeaway card"** — the one hard takeaway rendered as text on an on-brand SellonTube background. Fully automated, no manual step, no random-graphic problem (the card content is the post's own takeaway).
- **Authority-lesson posts:** no uploaded image — LinkedIn renders the native YouTube preview from the body link (the whole point of putting the link in the body). The branded takeaway card is skipped for these.
- **Phase 2 (deferred):** LinkedIn **document carousels** (PDF/PPT) — confirmed supported by Zernio (1 doc/post) and the highest-reach LinkedIn format — as a proper visual lever. Not in this build.

### Takeaway-card generator

A small module (`takeaway-card.js`) renders an SVG from a fixed on-brand template (SellonTube colours, logo, the takeaway text, optional archetype label) and rasterizes it to PNG via a single dependency (`sharp` or `@resvg/resvg-js`). The PNG is uploaded through the existing `uploadImageToZernio` path. Template is one file, easy to restyle. Constraints: LinkedIn recommends 1200x627 (1.91:1) for feed images; text must wrap and never overflow; font sizes fixed for legibility on mobile. If rasterization fails, the post falls back to text-only (never blocks publishing).

---

## Code changes (all additive to the existing script)

Existing `linkedin-schedule.js` keeps: `.env` loading, `buildScheduledFor`, `uploadImageToZernio`, `postToZernio` (with retry), `saveToHistory`, the per-post loop, the "run only when invoked directly" guard.

1. **`buildPayload`** — add `firstComment` to the Zernio payload when `post.firstComment` is set (Zernio accepts `firstComment` as a top-level string on post create).
2. **`validatePost(post)`** — small pure function implementing the 6 mechanical hard checks; returns pass/fail + reason. Unit-tested alongside the existing tests.
2b. **`takeaway-card.js`** — new module: renders the branded SVG takeaway card and rasterizes to PNG (one new dependency: `sharp` or `@resvg/resvg-js`). For no-link + flex posts, the schedule flow generates the card and feeds its PNG into `uploadImageToZernio`. Falls back to no-image on failure (never blocks publishing).
3. **Schedule flow** — run `validatePost` on each queued post; skip + report failures, publish the rest.
4. **Partial-success handling** — if the post publishes but `firstComment` fails, log clearly (post is live but linkless) rather than silent success.
5. **`saveToHistory`** — record `archetype` and `linkLocation`.
6. **Two data files** — `authority-evidence-bank.json` + `curated-video-bank.json` (schemas above). Populated by Claude from real research before go-live; read by the generator; refreshed on refill.
7. **Authority-lesson handling** — the flex slot, when it is an authority-lesson post, pulls a video from the video bank, teaches the lesson self-contained, embeds the video URL in the post body (`linkLocation: "body"`), sets `firstComment` and `imageUrl` null, and lets LinkedIn render the native preview. No UTM (external, not our analytics).
8. **Agent 09 rewrite** (`agents/09-linkedin-writer.md`) — becomes a thin runner that **follows `docs/social-media/linkedin/linkedin-writing-guideline.md` verbatim** (the canonical craft playbook), plus the operational bits: new 5/week Mon–Fri mix (2 SellonTube-link + 2 source-named no-link + 1 flex), ceiling-not-quota rule (drop rubric failures, never pad to 5), blend voice, self-contained + one-takeaway rules, the draft→critique→revise loop + rubric, no-fabrication + evidence-bank-only-citation rules, authority-lesson framing (teach the lesson, name the source, video in first comment), `firstComment`/UTM handling, batch sizing (2 then 4 weeks), and the fact that no-link posts must give the takeaway (the old "tease everything / the click is the conversion" philosophy now applies to the SellonTube-link posts only).

---

## Error handling

| Failure | Behaviour |
|---------|-----------|
| `validatePost` fails on a post | Skip that post, print which post + which check, publish the rest |
| Zernio API non-2xx | Log status + body, skip that post, continue |
| Image fetch/upload fails | Publish text + firstComment only (no image) |
| `firstComment` fails but post succeeds | Log clearly (post live but linkless); continue |
| `queue.json` missing/empty | Exit with clear error |
| Network timeout | One retry after 3s, then log and skip |
| LinkedIn 422 duplicate | Log clearly; dedup should prevent this upstream |

---

## Testing

- `validatePost` — unit tests for each hard check (pass + fail), following `linkedin-schedule.test.js`.
- `buildPayload` — `firstComment` included when set, omitted when null; body never contains a URL.
- First live batch (up to 10 posts, 2 weeks) is the end-to-end validation before steady-state.

---

## Out of scope

- X/Twitter (paid, not free-tier).
- Document carousels / PDF posts (phase 2 — confirmed available).
- Comment-reply engagement (human job; the real reach multiplier automation cannot do).
- Analytics dashboards (LinkedIn native + GA4 UTM are enough).
- Cloud cron / GitHub Actions / LLM API auto-generation (phase 2 candidate; rejected for phase 1 — cost + deletes the traction checkpoint).
- Founder personal-profile posting (the real reach multiplier, but out of this company-page system's scope).

---

## Phasing

**Phase 1 is built in two steps to concentrate the least risk in the first unseen batch:**

- **Step 1 — the spine (first batch, 2 weeks):** the 2+2+1 mix, `firstComment` links for SellonTube posts, self-critique generation loop, the two evidence banks, mechanical assert, batch-and-drip. Images = source og-image on link posts; no-link posts run text-only for this step. The first batch validates the pipeline end-to-end, especially that `firstComment` renders as a real comment on the company page.
- **Step 1.5 — add the two riskiest pieces once the spine proves out:** the branded **takeaway-cards** (native `sharp`/`resvg` dependency) and the **authority-lesson** post type (body link, reach penalty, external video, no card — the most moving parts). Neither ships until Step 1 is confirmed working on real posts.

Goal: ship a genuinely good automated presence at zero Zernio cost and gather per-archetype traction data.

**Phase 2 (after ~1 month, data-driven):** course-correct on the metrics. Candidates: adjust cadence/archetype mix, add document carousels, add X (accepting cost), automate the trigger via cloud cron. Nothing in phase 2 is committed now.

---

## Open assumptions to verify during implementation

1. Zernio accepts `firstComment` as a top-level field on `/api/v1/posts` create for LinkedIn (docs say yes; confirm payload shape on the first batch).
2. LinkedIn company-page posts via Zernio render `firstComment` as an actual first comment (verify on the first live post).
