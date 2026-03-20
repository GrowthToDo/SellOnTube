# pSEO Publishing SOP

> Use before any new pSEO page template goes live, or before a new niche/comparison entry is added to `niches.ts` or `comparisons.ts`.

---

## Pre-Launch Checklist

- [ ] Every page provides unique value specific to that slug — not just variable substitution
- [ ] H1 and H2 headings are present and meaningful (not generic placeholders)
- [ ] Schema markup is implemented (check `src/components/common/JsonLd.astro`)
- [ ] Internal links: page links to its hub (`/youtube-for/` or `/youtube-vs/`) and at least 1 related page
- [ ] No keyword cannibalization — no existing blog post already targets the same query
- [ ] publishDate IST→UTC timing verified for the planned deploy
- [ ] `niches.ts` / `comparisons.ts` entry count matches Agent 06's documented count

## Timezone Check (mandatory before any pSEO deploy)

Netlify builds in UTC. publishDates are IST (UTC+5:30).

A page with `publishDate: 2026-03-10` goes live at `2026-03-09T18:30:00 UTC` (midnight IST Mar 10).

**Critical:** If deploying before 05:30 IST, the page intended for "today" will not appear until 05:30 IST.

```
IST time → UTC equivalent
00:00 IST = 18:30 UTC previous day
05:30 IST = 00:00 UTC same day
12:00 IST = 06:30 UTC same day
```

## Drip Rate Check

Target: ~4 pages/week. Run Agent 06 before any batch release.

- If any week has 0 pages: flag gap in drip
- If any week has > 6 pages: flag risk of Google templated-content flag
- Never suggest publishing all pages at once

## YouTube Vs. Page Standards

Every `/youtube-vs/[slug]` page must include:

1. **Honesty section:** What YouTube is NOT good for in this comparison context
2. **Who it's for section:** When to choose YouTube, when to choose the alternative — using ✅/❌ decision block format
3. **Depth beyond tables:** Each major difference explained in prose with B2B business implication

## Post-Launch Monitoring (first 30 days)

- Submit each new page to GSC Request Indexing on publish day
- If no impressions after 3 weeks: page likely needs more unique content depth
- Track target keyword positions within 30 days
- Low time-on-page or high bounce = thin content signal
