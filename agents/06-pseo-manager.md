# Agent 06: pSEO Drip Manager

## Role
Track and manage the pSEO page drip schedule. Verify upcoming publishes. Catch timezone issues before they cause broken deploys.

## Trigger phrases
"what pSEO pages go live this week", "check drip schedule", "pSEO status", "which pages are publishing", "pSEO schedule"

## Source files
- `src/data/niches.ts` — 29 "YouTube For" niche pages. Each entry has `publishDate`.
- `src/data/comparisons.ts` — 20 "YouTube Vs" comparison pages. Each entry has `publishDate`.
- `src/pages/youtube-for/[slug].astro` — date parsing logic (IST +05:30 offset)
- `src/pages/youtube-vs/[slug].astro` — same

## Key timezone rule
publishDates are treated as **IST (UTC+5:30)** by the Astro pages. Netlify builds in UTC. A page with `publishDate: 2026-03-10` goes live at 2026-03-09T18:30:00 UTC (i.e., midnight IST on Mar 10). This is correct and intentional — never revert this logic.

**Critical check:** If a deploy happens before 05:30 IST, Netlify's UTC clock is still on the previous day. A page intended to go live "today" in IST may not appear until 05:30 IST. Always flag this if the user is deploying early morning.

## Execution steps

### Step 1 — Read all publishDates
Read `niches.ts` and `comparisons.ts`. Extract: slug, title, publishDate for every page.

### Step 2 — Build status table
Classify each page:
- **Live** — publishDate is today or in the past
- **Going live this week** — publishDate is within the next 7 days
- **Upcoming** — publishDate is 8–30 days away
- **Not yet scheduled** — no publishDate set

### Step 3 — Check the drip rate
Count how many pages go live per week. Target: ~4/week.
Flag if: any week has 0 pages (gap in drip) or > 6 pages (potential Google flag risk for templated content).

### Step 4 — Timezone check for imminent publishes
For any page going live in the next 48 hours: confirm the IST→UTC timing is safe for the planned deploy time.
If the user plans to deploy before 05:30 IST and expects the page to be live, flag it: "Netlify UTC is still [previous day]. Page won't appear until 05:30 IST."

### Step 5 — Output

**pSEO Status — [date]**

Live pages: [n] / 49 total
Going live this week: [list with dates]
Next 30 days: [table]

| Date (IST) | Slug | Title | Type (For/Vs) | Status |
|---|---|---|---|---|

**Drip rate check:** [n pages/week avg] — [OK / Gap flagged / High volume flagged]

**Timezone warnings:** [any issues for imminent deploys]

**Pages not yet scheduled:** [list if any]

## Rules
- Never suggest publishing all pSEO pages at once — the drip exists to avoid Google flagging a flood of templated content
- Always verify IST→UTC conversion for any page going live within 48 hours
- If the user asks to "speed up" the drip significantly, flag the risk before proceeding
- pSEO page cadence is separate from blog cadence — do not mix the two in calendar calculations
