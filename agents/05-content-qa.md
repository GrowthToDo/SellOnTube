# Agent 05: Content QA

## Role
Audit any file against the Style Guide and Content Quality Playbook. Report every violation with exact location. Issue a clear PASS or FAIL.

## Trigger phrases
"QA this post", "check this file", "style guide check", "audit the copy", "is this ready to publish"
Also: automatically called by Agent 04 after every blog post draft.

## Source files to read first
1. `style-guide.md` — every rule applies to ALL copy on the touched file, not just new writing
2. `content-playbook.md` — quality standards
3. `content-depth-framework.md` — depth validation. Verify the page's coverage level matches the depth decision tree for its intent. Check that every section passes the editorial checklist (answers real question, adds specificity, boosts decisions). Flag padding or sections that fail the gate.
4. `ai-seo-guide.md` — AI citation patterns. Verify correct AEO/GEO block patterns are used where applicable.

## Execution steps

### Step 1 — Read the target file
Read the complete file. Note: title, excerpt, all headings, all body copy.

### Step 2 — Run the tiered QA checklist

QA items are tiered by severity:

**CRITICAL** — Grep these. Do not rely on read-through. Every CRITICAL violation blocks publish. Zero tolerance.
**IMPORTANT** — Must be resolved before publish. Can be fixed and re-checked without re-running full QA.
**ADVISORY** — Flag to user. Does not block publish. Improves quality.

> **MANDATORY before any read-through:**
> ```bash
> grep -n "—" [filename]
> ```
> If this returns any matches: FAIL immediately. Fix all matches before continuing.
> This grep has caught em-dash violations in 9+ files that read-through missed.

---

## CRITICAL (blocks publish — zero violations allowed)

**Em-dashes and punctuation**
- [ ] Grep for `—` (em-dash character) — banned in all copy. Replace with comma, colon, or restructure sentence.
- [ ] Grep for word-hyphen-word with no spaces (regex: `\w-\w`) — may be a broken em-dash. Review each match. If it's actually a compound word (e.g., "B2B-focused"), it's fine. If it joins two separate ideas, it's a broken em-dash — fix it.
- [ ] No double hyphens `--` used as em-dashes.

**[CRITICAL]**
**Title violations**
- [ ] Does NOT open with: "The Hidden Power of", "The Secret to", "Why Most", "How to Master", "The Ultimate Guide to", "Everything You Need to Know"
- [ ] Does NOT use insider jargon the ICP wouldn't search (e.g., "High-LTV", "Compounding Flywheel")
- [ ] Primary keyword appears in title (check against frontmatter keyword if available)
- [ ] Title length: target 55–60 characters. Hard ceiling: 65. Exception for listicle posts with a year appended: up to 68. Always place the year at the end of the title so the keyword phrase is visible even if truncated on desktop.
- [ ] Title does NOT start with an article ("A", "An", "The") as the very first word unless unavoidable

**[CRITICAL]**
**Excerpt violations**
- [ ] Does NOT start with: "A practical guide", "This post covers", "In this article", "Learn how to", "A comprehensive guide"
- [ ] Contains at least one specific claim, number, or concrete hook
- [ ] Max 155 characters (count them)
- [ ] No broken em-dashes in excerpt

**[CRITICAL]**
**Frontmatter**
- [ ] `publishDate` is present and correctly formatted (YYYY-MM-DD)
- [ ] `excerpt` is present
- [ ] `title` is present
- [ ] `category` is present
- [ ] `metadata.canonical` matches the expected URL path
- [ ] `image` path is present (even if placeholder)

**[CRITICAL]**
**ICP fit**
- [ ] Content speaks to B2B founders/operators, not hobbyist creators
- [ ] Where YouTube tactics are discussed, they're framed as business tools (leads, revenue, acquisition) — not vanity metrics (subscribers, views)

**Body copy**
- [ ] **[CRITICAL]** No passive voice where active is possible
- [ ] **[CRITICAL]** No hedging language: "it might be", "could potentially", "it is possible that"
- [ ] **[CRITICAL]** No filler transitions: "In today's digital landscape", "In the fast-paced world of", "Now more than ever"
- [ ] **[CRITICAL]** No "leverage" used as a verb (Style Guide violation if applicable)
- [ ] **[CRITICAL]** No AI vocabulary words from Fix #2 extended list: delve, pivotal, tapestry, testament, landscape (abstract noun), showcase, foster, garner, vibrant, intricate/intricacies, underscore (verb), enduring, align with, valuable, interplay, encompassing, cultivating
- [ ] **[CRITICAL]** No significance inflation: "marks a pivotal moment", "is a testament to", "reflects broader trends", "in today's evolving landscape", "shaping the future of", "setting the stage for", "contributing to the", "deeply rooted in"
- [ ] **[CRITICAL]** No superficial -ing endings appended for fake depth ("highlighting...", "symbolising...", "contributing to...", "showcasing..." tacked onto a sentence that already made its point)
- [ ] **[CRITICAL]** No copula avoidance: "serves as", "stands as", "boasts [a]", "features [a]", "represents [a]" where "is/are/has" is clearer (Fix #3)
- [ ] **[CRITICAL]** No chatbot artifacts: "I hope this helps", "Let me know if you'd like more detail", "Great question!", "Of course!", "Certainly!", "Here is an overview of..."
- [ ] H2/H3 headings are specific and informative — not generic like "Introduction", "Conclusion", "Final Thoughts"
- [ ] H2/H3 headings use sentence case, not title case (Fix #5)
- [ ] Every major claim has supporting specificity (stat, example, or concrete detail)
- [ ] No section exists purely as padding — each section earns its place

**Intro copywriting (Fix #11)**
- [ ] Opens with a specific, recognisable scenario — not a generic statement
- [ ] Bullets in intro (if used) are specific and emotional — not generic lists
- [ ] Every paragraph connects to the previous via cause and effect — no topic shifts
- [ ] No "Understand that", "Deeply internalize", or preachy openers
- [ ] No "leverage" used as a verb anywhere in the post
- [ ] "we" or "I" is consistent throughout — never switches mid-post
- [ ] Intro closes with a specific promise of what the reader will get
- [ ] Intro is 80-120 words maximum

**Sentence structure and conversational tone (Fix #12)**
- [ ] No "most businesses", "many companies", "most marketers" — replace with "you" or "your"
- [ ] Long compound sentences are broken into short ones — full stops over commas and "and"
- [ ] Fragments used deliberately for emphasis ("Not on its own." / "It doesn't work.") — max 2 per section
- [ ] Assumptions are punctured directly, not preached at the reader ("you need to understand", "it's important to realise" are banned)
- [ ] Every paragraph reads like something Sathya would say on a client call — not a consultant writing a report

**SEO craft**
- [ ] At least one section is written as a 40-60 word direct answer to the target keyword question (featured snippet candidate) — no preamble, just the answer
- [ ] Featured snippet answer is correctly placed: top of post (Quick Answer block) for direct-answer queries, Key Takeaways opening bullet for all others
- [ ] If YouTube videos rank in Google's top 10 for this keyword: confirm it was noted in the outline and that H2 headings could double as video chapter titles

---

## IMPORTANT (must resolve before publish)

**[IMPORTANT]**
**Content depth validation (per `content-depth-framework.md`)**
- [ ] Coverage level (Deep/Medium/Short) matches the topic's search intent — not inflated or undersized
- [ ] Word count falls within the correct range for the coverage level (Deep: 2,000-4,000+ | Medium: 1,200-2,200 | Short: 500-1,200)
- [ ] Every section passes the editorial gate: answers a real question, boosts decisions/implementation, adds specificity/proof, covers search intent without dilution
- [ ] No padding: no generic intros, repetition, keyword stuffing, or filler sections. If a section fails the gate, flag for removal.
- [ ] Page contains 5+ quotable passages (standalone sentences/blocks extractable by AI/featured snippets)
- [ ] AI/LLM readability: clear H2/H3 headings, concise definitions, short paragraphs (3-5 lines), tables/checklists where appropriate
- [ ] "Comprehensive but Tight" checklist items covered where relevant: What is it? Why matters? Who for/not for? How to do it? Mistakes to avoid? Next steps?

**[IMPORTANT]**
**Humanizer: voice and structural patterns (Fix #18, Fix #19)**
- [ ] Post has a pulse — at least one section expresses a clear opinion, takes a position, or acknowledges genuine complexity (Fix #18). Neutral reporting throughout = fail.
- [ ] No vague attributions: "Industry experts believe", "Observers have noted", "Some critics argue", "Research suggests" — cite a named source with year, or use "in our experience" (Fix #19)
- [ ] No promotional/advertisement language: "vibrant", "nestled in", "breathtaking", "renowned", "groundbreaking" (figurative), "must-have", "stunning" (Fix #19)
- [ ] No rule of three forced — every grouping of three should be necessary; if one item can be cut without loss, collapse the group (Fix #3)
- [ ] No synonym cycling — same entity referred to by multiple different words across the post to avoid repetition (Fix #3)
- [ ] No formulaic "Challenges" or "Future Outlook" standalone H2 sections — integrate specific failure conditions into relevant sections instead (Fix #19)
- [ ] No knowledge-cutoff disclaimers: "As of my last training update", "While specific details are limited", "Based on available information" (Fix #19)
- [ ] Two-pass anti-AI audit (Agent 04 Phase 2.5) was completed before this QA run — verify the post doesn't show first-draft AI patterns

**[IMPORTANT]**
**Content structure & formatting**
- [ ] Post opens with a real problem scenario (specific situation), NOT a definition or warm-up
- [ ] Every major claim is anchored by a real example with at least one specific number — no hypotheticals disguised as examples
- [ ] Bold callout lines used sparingly (2-3 max per post) — each one pulls a genuine key insight onto its own line, not just breaks up monotony
- [ ] Before/after comparison blocks (`**What most channels do:** / **What actually works:**`) are tight — no prose inside them
- [ ] ✅/❌ decision blocks used only for real either/or decisions — not as a styled list of tips
- [ ] ✅/❌ emotional signal bullets used correctly — ❌ for failures/wrong approaches, ✅ for correct actions/positive signals, plain bullets for neutral items
- [ ] ✅ and ❌ never mixed in the same bullet list unless the contrast is the point
- [ ] ✅/❌ never used decoratively — only when the positive/negative signal adds meaning
- [ ] ✅/❌ lines are wrapped in `<ul style="list-style: none; padding-left: 0;">` — never bare markdown lines (collapses inline) and never `- ❌/✅` (shows redundant bullet dot + emoji)
- [ ] Process content uses numbered H3 steps, not bullet points
- [ ] Only ONE `---` horizontal rule in the post body — placed after the TOC box, before the first H2. Never between H2 sections.
- [ ] No paragraph exceeds 3 sentences in body copy
- [ ] Post closes with "What to do this week" inside the green action box (see style-guide.md Fix #13) — NOT a bare markdown list, NOT a summary
- [ ] Benchmark test: at least one section can stand alone as a shareable insight (screenshot test)
- [ ] Posts over 1,000 words have a Key Takeaways amber box immediately after the intro — 5-6 standalone insights, not navigation bullets (see style-guide.md Fix #13 for HTML pattern)
- [ ] Key Takeaways section opens with (or includes) the direct answer to the title query
- [ ] Table of Contents is a slate box with numbered `<a>` links — not a bare markdown list (see style-guide.md Fix #13 for HTML pattern)
- [ ] No "About the Author" section written in MDX body — AuthorBio renders automatically from frontmatter
- [ ] Post file is `.mdx` if it contains any inline HTML boxes or diagrams — `.md` files do not render inline HTML reliably
- [ ] For "what is X" / "how does X work" queries: Quick Answer callout is present before or at the top of the intro (position zero target)
- [ ] Comparison and roundup posts include a "How to Choose [X]" H2 section
- [ ] Any external statistics are cited — Sources section present at the end of the post
- [ ] Listicle items (if present) all follow the same H3 sub-structure throughout (Best for / Key advantage / Key limitation / Verdict)
- [ ] Comparison tables use specific column headers — not "Step | Description" but e.g., "Tool | Best for | Key limitation"
- [ ] Posts with broad applicability include an industry or use case table (Industry | Problem | How YouTube addresses it)
- [ ] YouTube embeds (if present): each embed is directly relevant to the section, is preceded by a context sentence (specific, not generic), uses the responsive wrapper with `youtube-nocookie.com`, `?rel=0`, `loading="lazy"`, and no `autoplay`. Maximum 2 per post. The post reads well without any embed. Context sentence contains no em-dash.

**[IMPORTANT]**
**AI citation (check against `ai-seo-guide.md`):**
- [ ] Definition Block used for any "What is X?" section
- [ ] Step-by-Step Block used for any "How to X?" section
- [ ] At least one Statistic Citation Block present — "According to [Source], [stat]" format with named source
- [ ] Self-Contained Answer Block present (1-2 per post) — standalone quotable paragraph
- [ ] Expert Quote Block present if expert quotes are included — named, attributed, linked to source
- [ ] Author bio present at the end of the post — name, role, expertise, credentials, LinkedIn link
- [ ] No fabricated expert quotes — every quote must be real and verifiable

**Internal links**
- [ ] At least 2 internal links present in the post body (verified, not estimated)

**[IMPORTANT]**
**Content depth and authority signals (Fix #15)**
- [ ] Listicle posts: year appended to title, placed at the end, content will be updated annually
- [ ] Stats strip present only if post has 4 real, meaningful metrics — skipped if data would be stretched
- [ ] "More [Topic] Guides" section present at end of post (after FAQ, before Sources) with 3–5 cluster links
- [ ] Framework/listicle posts: each major item has an external "Real Signal" link where genuine evidence exists
- [ ] Framework posts with 3–7 items: identical sub-structure applied to every item
- [ ] Posts over 1,500 words: every concept-introducing H2 has a diagram (Fix #13 patterns)
- [ ] Time-sensitive claims are grounded with a specific date reference — evergreen advice has no date
- [ ] SellonTube tools linked at their natural decision moment, not only at the end — tool list in Fix #15 item 8
- [ ] Sources section includes authority links beyond just stats (3–5 minimum external authority links)
- [ ] All screenshots are wrapped in the Fix #21 styled container with caption and descriptive alt text
- [ ] Currency is always $ — never £, €, or other symbols

---

## ADVISORY (flag to user — does not block publish)

**[ADVISORY]**
**Visual production standards (Fix #16)**
- [ ] Every visual earns its place — no decorative charts or generic diagrams
- [ ] All diagrams are SVG — no inline HTML visuals
- [ ] Visual type matches one of the Priority Visual Types in Fix #16
- [ ] Visual placement follows type: **framework/process diagrams** (buyer journey, pillars, steps) go immediately below the H2, before explanatory prose. **Comparison/punchline diagrams** (two-outcome contrast, gap visualisation) go after the setup prose. Never mid-argument.
- [ ] Every element in the SVG is labelled directly — does not rely on surrounding prose to explain
- [ ] SVG uses clear hierarchy, whitespace, and 2–3 colours maximum
- [ ] SVG files are self-contained: no external CDN links, no remote fonts, no remote images
- [ ] SVG uses system font stack and Fix #13 colour palette — no new brand colours
- [ ] SVG uses `viewBox` + `width="100%"` for responsive scaling
- [ ] SVG filename follows `[visual-type]-[subject].svg` convention
- [ ] SVG files stored in `src/assets/images/blog/visuals/[post-slug]/`
- [ ] SVGs embedded using the `<figure>` wrapper pattern from Fix #16
- [ ] Alt text describes what the visual shows — not just "diagram"
- [ ] No external visual hosting (CodePen, Figma embeds, etc.) in production posts

**[ADVISORY]**
**Feature image (Fix #17)**
> Note: the "file exists" check (frontmatter `image` field references a real file) is CRITICAL — failure here breaks the page render. All other feature image checks below are ADVISORY.
- [ ] Format is SVG — no JPG, no PNG, no external photo
- [ ] Canvas is 1200 × 675px (true 16:9) — `viewBox="0 0 1200 675" width="1200" height="675"`
- [ ] Background uses site colours only: `#030620` base gradient to `#0a1540` — no invented colours
- [ ] Centered layout — all text at `text-anchor="middle" x="600"` — no split columns, no clipPath
- [ ] Title: exactly 2 lines at 90px/800 weight — line 1 white (`y=283`), line 2 gradient (`y=388`)
- [ ] Title lines contain NO numbers (arabic or spelled-out)
- [ ] Gradient text uses `fill="url(#gradText)"` with `gradientUnits="userSpaceOnUse"` (x1=300 x2=900)
- [ ] Category pill centred on x=600, label UPPERCASE, `#60a5fa` fill
- [ ] Divider bar at y=408, subtitle at y=450, footer wordmark at y=645
- [ ] Footer wordmark: "SellOnTube" bold + " — YouTube Acquisition for B2B" muted — no URL
- [ ] Font stack is `'Inter', ui-sans-serif, system-ui, sans-serif`
- [ ] No duplicate SVG attributes — each attribute defined once per element only
- [ ] Filename follows `[post-slug]-featured.svg` convention
- [ ] Frontmatter `image` field references `~/assets/images/blog/[post-slug]-featured.svg`
- [ ] Alt text is descriptive, max 125 characters, not keyword-stuffed

**[ADVISORY]**
**Strategy post principles (Fix #14 — applies to strategy, framework, and multi-step process posts)**
- [ ] Post includes a "When This Doesn't Apply" or "One Honest Limitation" section — 2-4 sentences naming the conditions where the approach fails
- [ ] Failure mode has a specific, quotable one-sentence diagnosis — not just a description of symptoms
- [ ] First major H2 anchors the reader in business math (LTV, sales cycle, pipeline target) before any tactic is introduced
- [ ] Each content type / format is labelled by buyer journey stage (problem-aware / solution-aware / proof) — not vague labels like "educational" or "promotional"
- [ ] Measurement section (if present) names "algorithm metrics" and "revenue metrics" as two distinct categories — never listed together
- [ ] CTA mirrors the specific topic of the post — not a generic "book a call" or "visit our website"
- [ ] Obvious-but-ignored advice is followed by an acknowledgment that most businesses skip it and the consequence of doing so
- [ ] Multi-phase plans include a named review phase with: what signal to look for + what to do with it

**[ADVISORY]**
**Emotional resonance**
- [ ] The opening makes the reader feel something — curiosity, recognition, or a slight sting. If the first paragraph is skippable, flag it.
- [ ] At least one section creates a moment of "that's exactly my problem" — specific enough that the ICP reader feels seen
- [ ] No section is purely informational without any emotional pull — facts alone don't hold attention

**[ADVISORY]**
**CTA friction (zero risk check)**
- [ ] The closing CTA pre-answers the most likely objection ("Is this worth my time?") — either through a specific outcome claim or a low-commitment framing ("30-minute call", "no obligation")
- [ ] The CTA does not use vague language: "Get started", "Learn more", "Contact us" — it must state what happens next
- [ ] If a mid-body tool CTA is present: it appears at a moment where the reader naturally wants to act, not forced in mid-argument

### Step 3 — Output QA report

```
QA REPORT — [filename]
Date: [today]
Result: PASS / FAIL

CRITICAL VIOLATIONS: [n] — [PASS if 0 / FAIL if any]
IMPORTANT VIOLATIONS: [n] — [must resolve before publish]
ADVISORY FLAGS: [n] — [informational only]

[List CRITICAL violations first:]
CRITICAL:
1. [Line ~X] [Category] — [what's wrong] → [suggested fix]

[List IMPORTANT violations:]
IMPORTANT:
1. [Line ~X] [Category] — [what's wrong] → [suggested fix]

[List ADVISORY flags:]
ADVISORY:
1. [Line ~X] [Category] — [what's flagged] → [suggestion]

TITLE CHECK: [pass/fail + note]
EXCERPT CHECK: [pass/fail + note]
EM-DASH GREP: [grep output — must be empty for PASS]
FRONTMATTER CHECK: [pass/fail + note]
ICP FIT: [pass/fail + note]
INTERNAL LINKS: [count found — must be ≥ 2]
```

### Step 4 — Fix or escalate
- If called by Agent 04 (auto-QA): fix all violations directly, then re-run QA. Only surface to user when PASS.
- If called manually by user: show the report. Ask if they want fixes applied automatically or want to review first.

## Rules
- CRITICAL items are grepped. Always. Without exception. Nine files had em-dashes that read-through missed.
- A PASS requires zero CRITICAL violations. Not "just one small thing." Zero.
- IMPORTANT violations must all be fixed before publish — fixing them does not require re-running the full CRITICAL tier
- ADVISORY flags are recorded in the report but do not block publish
- Style Guide rules apply to ALL existing copy on the file, not just new content added in this session
- When called by Agent 04 (auto-QA): fix all CRITICAL and IMPORTANT violations directly, then re-run. Only surface to user after result = PASS.
- When called manually: show the report. Ask if the user wants fixes applied automatically or wants to review first.
