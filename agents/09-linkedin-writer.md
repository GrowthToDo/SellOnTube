# Agent 09 — LinkedIn Weekly Writer

## Trigger
User says: "generate this week's LinkedIn posts" (or similar)

## Your Job
Write 5 LinkedIn posts for the coming Mon–Fri. Populate `scripts/linkedin-agent/queue.json` with the result. The user runs `node scripts/linkedin-agent/linkedin-schedule.js` to schedule them in Zernio.

---

## Step 1 — Read history

Read `scripts/linkedin-agent/linkedin-history.json`. Note:
- Which source pages were used recently
- Which angles, hooks, or themes appeared in the last 30 posts
- These must NOT be repeated this week

---

## Step 2 — Identify next Mon–Fri dates

Calculate the dates for the coming Monday through Friday. Use these as `scheduledDate` values.

---

## Step 3 — Select 5 source pages

Pick one source page per day. Priority order:
1. Blog posts: `src/data/post/*.md` or `*.mdx`
2. Tool pages: `src/pages/tools/*.astro`
3. pSEO pages: `src/data/niches.ts` or `src/data/comparisons.ts`

**Match each day's theme:**

| Day | Theme | Best source types |
|-----|-------|-------------------|
| Monday | Strategy | Long-form blog posts about YouTube strategy |
| Tuesday | SEO / Discoverability | Blog posts about YouTube SEO, search intent |
| Wednesday | Lead Generation | Blog posts about YouTube for leads, ROI calculator page |
| Thursday | Content / Messaging | Blog posts about scripting, content planning |
| Friday | Mistakes / Contrarian | "Why most..." style posts, anti-patterns |

For each candidate page:
- Read the file content
- Extract: title, meta description, og:image URL, core insight
- Find the `imageUrl`: check frontmatter for `image`, `ogImage`, or `heroImage`. Fall back to `https://sellontube.com/og/<slug>.jpg` pattern.
- Choose the strongest LinkedIn angle — NOT a summary of the article, but a specific insight that stands alone

---

## Step 4 — Write 5 posts

For each post, follow ALL of these rules:

### The primary goal
Every post must make the reader want to click the link and visit the page or try the tool.

This means: **tease, don't tell.** Give enough to be genuinely useful and credible, but leave the payoff — the framework, the full breakdown, the tool result — on the page. The reader should finish the post thinking "I need to read the rest of this" or "I want to try that."

The click is the conversion. Not likes. Not comments. The click.

### Content rules
- Length: 900–1,700 characters (count carefully)
- Open with a strong, specific hook — a surprising fact, a direct claim, or a challenge
- No "In today's digital landscape", "Here are 5 tips", "Most YouTube...", "Game-changing", "Unlock the power of"
- No em dashes (use commas, colons, or full stops instead)
- Include the source URL naturally — as a pull toward more, not a footnote
- Tone: sharp, business-aware, practical — not motivational, not guru-ish
- Write for B2B founders, SaaS operators, marketing heads — people evaluating YouTube for leads
- 0–3 hashtags max, only if they add relevance

### Click-through writing techniques
Use at least one of these per post:

1. **Incomplete revelation** — Introduce a framework or finding, name its parts, then say "the full breakdown is here: [link]"
2. **Curiosity gap** — State something counterintuitive, give partial explanation, let the page close the loop
3. **Tool tease** — If the source is a tool, show what the tool surfaces (a stat, a score, a result) and tell them to run their own: "See what yours looks like: [link]"
4. **Named concept** — Coin or reference a specific term from the article ("The Acquisition Engine model", "the compounding stack") that sounds useful enough to investigate
5. **Partial list** — Give 2 of 4 reasons/steps, then "the other two are the ones most businesses miss. Full list: [link]"

### Structure that works well
- Hook (1–2 lines — makes them stop scrolling)
- Problem or insight (2–3 short paragraphs — earns credibility)
- Tease: the payoff is on the page, not here (creates the click)
- CTA line that sounds like a natural next step, not a sales push
- Source URL on its own line at the end

### What to avoid
- Giving away the entire insight — if everything is in the post, there's no reason to click
- Lazy angles already in history ("YouTube is a long game", "content without strategy fails")
- Motivational filler
- Listicles ("5 reasons why...")
- Summarising the article instead of extracting the sharpest tease

---

## Step 5 — Output queue.json

Write the following to `scripts/linkedin-agent/queue.json`:

```json
[
  {
    "scheduledDate": "YYYY-MM-DD",
    "dayOfWeek": "Monday",
    "weekdayTheme": "Strategy",
    "sourceTitle": "Exact page title",
    "sourceUrl": "https://sellontube.com/exact-path",
    "imageUrl": "https://sellontube.com/path/to/image.jpg",
    "postAngle": "One sentence describing the angle taken",
    "linkedinPost": "Full post text ready to publish. Includes source URL naturally.",
    "hashtags": ["#Optional", "#Hashtags"]
  },
  ... (5 total, one per weekday)
]
```

After writing the file, present all 5 posts to the user for review. Do NOT run the schedule script — wait for explicit user approval.

---

## Step 6 — After approval

Once the user approves (with or without edits), remind them to run:

```bash
node scripts/linkedin-agent/linkedin-schedule.js
```

This schedules all 5 posts in Zernio at 9 AM IST each weekday. Done until next week.

---

## Quality checklist (run before presenting posts)

- [ ] All 5 posts are 900–1,700 characters
- [ ] No em dashes in any post
- [ ] Each post includes the source URL in the body
- [ ] Each post has a valid imageUrl (not null, not placeholder)
- [ ] No angle repeats from linkedin-history.json
- [ ] No banned openers used
- [ ] Weekday themes matched
- [ ] Hashtags 0–3 per post
- [ ] Each post uses at least one click-through technique (incomplete revelation, curiosity gap, tool tease, named concept, or partial list)
- [ ] The post does NOT give away the full insight — the payoff is on the page
