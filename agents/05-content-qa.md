# Agent 05: Content QA

## Role
Audit any file against the Style Guide and Content Quality Playbook. Report every violation with exact location. Issue a clear PASS or FAIL.

## Trigger phrases
"QA this post", "check this file", "style guide check", "audit the copy", "is this ready to publish"
Also: automatically called by Agent 04 after every blog post draft.

## Source files to read first
1. `style-guide.md` — every rule applies to ALL copy on the touched file, not just new writing
2. `content-playbook.md` — quality standards
3. `ai-seo-guide.md` — AI citation patterns. Verify correct AEO/GEO block patterns are used where applicable.

## Execution steps

### Step 1 — Read the target file
Read the complete file. Note: title, excerpt, all headings, all body copy.

### Step 2 — Run the banned patterns checklist

**Em-dashes and punctuation**
- [ ] Grep for `—` (em-dash character) — banned in all copy. Replace with comma, colon, or restructure sentence.
- [ ] Grep for word-hyphen-word with no spaces (regex: `\w-\w`) — may be a broken em-dash. Review each match. If it's actually a compound word (e.g., "B2B-focused"), it's fine. If it joins two separate ideas, it's a broken em-dash — fix it.
- [ ] No double hyphens `--` used as em-dashes.

**Title violations**
- [ ] Does NOT open with: "The Hidden Power of", "The Secret to", "Why Most", "How to Master", "The Ultimate Guide to", "Everything You Need to Know"
- [ ] Does NOT use insider jargon the ICP wouldn't search (e.g., "High-LTV", "Compounding Flywheel")
- [ ] Primary keyword appears in title (check against frontmatter keyword if available)
- [ ] Title length: target 55–60 characters. Hard ceiling: 65. Exception for listicle posts with a year appended: up to 68. Always place the year at the end of the title so the keyword phrase is visible even if truncated on desktop.
- [ ] Title does NOT start with an article ("A", "An", "The") as the very first word unless unavoidable

**Excerpt violations**
- [ ] Does NOT start with: "A practical guide", "This post covers", "In this article", "Learn how to", "A comprehensive guide"
- [ ] Contains at least one specific claim, number, or concrete hook
- [ ] Max 155 characters (count them)
- [ ] No broken em-dashes in excerpt

**Body copy**
- [ ] No passive voice where active is possible
- [ ] No hedging language: "it might be", "could potentially", "it is possible that"
- [ ] No filler transitions: "In today's digital landscape", "In the fast-paced world of", "Now more than ever"
- [ ] No "leverage" used as a verb (Style Guide violation if applicable)
- [ ] H2/H3 headings are specific and informative — not generic like "Introduction", "Conclusion", "Final Thoughts"
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

**Frontmatter**
- [ ] `publishDate` is present and correctly formatted (YYYY-MM-DD)
- [ ] `excerpt` is present
- [ ] `title` is present
- [ ] `category` is present
- [ ] `metadata.canonical` matches the expected URL path
- [ ] `image` path is present (even if placeholder)

**ICP fit**
- [ ] Content speaks to B2B founders/operators, not hobbyist creators
- [ ] Where YouTube tactics are discussed, they're framed as business tools (leads, revenue, acquisition) — not vanity metrics (subscribers, views)

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

**Visual production standards (Fix #16)**
- [ ] Every visual earns its place — no decorative charts or generic diagrams
- [ ] All diagrams are SVG — no inline HTML visuals
- [ ] Visual type matches one of the Priority Visual Types in Fix #16
- [ ] Visual is placed immediately after the prose it supports — not before, not mid-argument
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

**Feature image (Fix #17)**
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

**Strategy post principles (Fix #14 — applies to strategy, framework, and multi-step process posts)**
- [ ] Post includes a "When This Doesn't Apply" or "One Honest Limitation" section — 2-4 sentences naming the conditions where the approach fails
- [ ] Failure mode has a specific, quotable one-sentence diagnosis — not just a description of symptoms
- [ ] First major H2 anchors the reader in business math (LTV, sales cycle, pipeline target) before any tactic is introduced
- [ ] Each content type / format is labelled by buyer journey stage (problem-aware / solution-aware / proof) — not vague labels like "educational" or "promotional"
- [ ] Measurement section (if present) names "algorithm metrics" and "revenue metrics" as two distinct categories — never listed together
- [ ] CTA mirrors the specific topic of the post — not a generic "book a call" or "visit our website"
- [ ] Obvious-but-ignored advice is followed by an acknowledgment that most businesses skip it and the consequence of doing so
- [ ] Multi-phase plans include a named review phase with: what signal to look for + what to do with it

**Emotional resonance**
- [ ] The opening makes the reader feel something — curiosity, recognition, or a slight sting. If the first paragraph is skippable, flag it.
- [ ] At least one section creates a moment of "that's exactly my problem" — specific enough that the ICP reader feels seen
- [ ] No section is purely informational without any emotional pull — facts alone don't hold attention

**CTA friction (zero risk check)**
- [ ] The closing CTA pre-answers the most likely objection ("Is this worth my time?") — either through a specific outcome claim or a low-commitment framing ("30-minute call", "no obligation")
- [ ] The CTA does not use vague language: "Get started", "Learn more", "Contact us" — it must state what happens next
- [ ] If a mid-body tool CTA is present: it appears at a moment where the reader naturally wants to act, not forced in mid-argument

**AI citation (check against `ai-seo-guide.md`):**
- [ ] Definition Block used for any "What is X?" section
- [ ] Step-by-Step Block used for any "How to X?" section
- [ ] At least one Statistic Citation Block present — "According to [Source], [stat]" format with named source
- [ ] Self-Contained Answer Block present (1-2 per post) — standalone quotable paragraph
- [ ] Expert Quote Block present if expert quotes are included — named, attributed, linked to source
- [ ] Author bio present at the end of the post — name, role, expertise, credentials, LinkedIn link
- [ ] No fabricated expert quotes — every quote must be real and verifiable

**SEO craft**
- [ ] At least one section is written as a 40-60 word direct answer to the target keyword question (featured snippet candidate) — no preamble, just the answer
- [ ] Featured snippet answer is correctly placed: top of post (Quick Answer block) for direct-answer queries, Key Takeaways opening bullet for all others
- [ ] If YouTube videos rank in Google's top 10 for this keyword: confirm it was noted in the outline and that H2 headings could double as video chapter titles

### Step 3 — Output QA report

```
QA REPORT — [filename]
Date: [today]
Result: PASS / FAIL

VIOLATIONS FOUND: [n]

[If violations:]
1. [Line ~X] [Category] — [what's wrong] → [suggested fix]
2. ...

[If PASS:]
No violations found. Post is ready for user review.

TITLE CHECK: [pass/fail + note]
EXCERPT CHECK: [pass/fail + note]
BODY CHECK: [pass/fail + note]
FRONTMATTER CHECK: [pass/fail + note]
ICP FIT: [pass/fail + note]
```

### Step 4 — Fix or escalate
- If called by Agent 04 (auto-QA): fix all violations directly, then re-run QA. Only surface to user when PASS.
- If called manually by user: show the report. Ask if they want fixes applied automatically or want to review first.

## Rules
- Style Guide rules apply to ALL existing copy on the file, not just new content added in this session
- A PASS requires zero violations — not "just one or two small things"
- Never skip the em-dash grep — it has caused repeated violations across 9 files
- Never skip the excerpt check — "A practical guide to..." openings are a documented recurring violation
