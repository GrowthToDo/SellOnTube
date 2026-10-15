Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `growth-strategy.md` L264-271; `agents/06-pseo-manager.md` L9-18, L78-121; `docs/sops/pseo-publishing-sop.md` L1-53; `src/pages/youtube-for/[slug].astro` L10-12.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# Programmatic SEO pages on this site

Notes added for this kit (counted 2026-10-15, `grep -c "slug:"`):

- `src/data/niches.ts`: 31 entries (`/youtube-for/[slug]`). `src/data/comparisons.ts`: 22 entries (`/youtube-vs/[slug]`). Total 53. `agents/06-pseo-manager.md` L11 says 23 comparisons and L44 says 54 total; `SEO_CONTEXT.md` says 53.
- Status: PAUSED (`growth-strategy.md` L264-266). Live pages stay indexed.

### `growth-strategy.md` L264-271: pSEO Strategy (PAUSED)

## pSEO Strategy (PAUSED)

pSEO drip publishing is paused. Blog content is the priority. Existing live pSEO pages remain indexed but no new pages are being published.

Focus expansion only on pages with GSC signal:
- /youtube-for/coaches (pos 16.6, 5 imp)
- /youtube-for/saas (pos 14, 1 imp)


### `agents/06-pseo-manager.md` L9-18: source files and timezone rule

## Source files
- `src/data/niches.ts` - 31 "YouTube For" niche pages. Each entry has `publishDate`.
- `src/data/comparisons.ts` - 23 "YouTube Vs" comparison pages. Each entry has `publishDate`.
- `src/pages/youtube-for/[slug].astro` - date parsing logic (IST +05:30 offset)
- `src/pages/youtube-vs/[slug].astro` - same

## Key timezone rule
publishDates are treated as **IST (UTC+5:30)** by the Astro pages. Netlify builds in UTC. A page with `publishDate: 2026-03-10` goes live at 2026-03-09T18:30:00 UTC (i.e., midnight IST on Mar 10). This is correct and intentional - never revert this logic.

**Critical check:** If a deploy happens before 05:30 IST, Netlify's UTC clock is still on the previous day. A page intended to go live "today" in IST may not appear until 05:30 IST. Always flag this if the user is deploying early morning.

### `agents/06-pseo-manager.md` L78-121: vs-page standards, expansion types, rules

## YouTube vs. page content standards

These rules apply to all `/youtube-vs/[slug]` pages. They are content quality rules, not schedule rules.

**Honesty principle - mandatory:**
Every vs. page must acknowledge what YouTube is NOT good for in the context of the comparison platform. Pages that only promote YouTube lose credibility - readers verify claims independently. A line like "YouTube is not the right choice if [specific condition]" builds more trust than a page that only lists YouTube's advantages.

**"Who it's for" section - mandatory:**
Every vs. page must include an explicit recommendation block stating:
- When to choose YouTube over [platform]
- When to choose [platform] over YouTube
- Who each option serves best (by business type, goal, or stage)

Use the ✅/❌ decision block format from the Style Guide. This is the highest-converting section on any comparison page.

**Depth over tables:**
Comparison tables are useful but not sufficient. Each major difference should be explained in prose - *why* it matters for a B2B founder, not just *that* it's different. A table row saying "YouTube: free / [Platform]: $X/month" without explaining the business implication is surface-level.

**No fabricated claims:**
Never state that YouTube outperforms a competitor on a specific metric without a cited source or honest attribution ("in our experience with clients"). Unverified superiority claims damage credibility.

## Future pSEO expansion types
SellonTube currently uses 2 of 12 possible pSEO page types. Future expansion options to consider when data is available:

| Type | Example for SellonTube |
|---|---|
| **Templates** (current) | `/youtube-for/[niche]` |
| **Comparisons** (current) | `/youtube-vs/[platform]` |
| **Integrations** | `/youtube-and/[tool]` (e.g. YouTube + HubSpot) |
| **Glossaries** | `/glossary/[youtube-seo-term]` |
| **Directories** | `/youtube-channels/[industry]` |
| **Location-based** | `/youtube-marketing/[city]` |
| **Curations** | `/best-youtube-channels/[niche]` |
| **Plural alternatives** | `/youtube-vs/[platform]-alternatives` - reaches earlier-stage researchers not yet committed to switching |
| **Best alternatives** | `/best-[platform]-alternatives` - captures "I want to switch from X" traffic |
| **Competitor vs Competitor** | `/[platform-a]-vs-[platform-b]` - captures competitor-to-competitor queries while positioning YouTube as context |

Only build a new type when there is real data to populate it. Never launch a new type with placeholder content.

## Rules
- Never suggest publishing all pSEO pages at once - the drip exists to avoid Google flagging a flood of templated content
- Always verify IST→UTC conversion for any page going live within 48 hours
- If the user asks to "speed up" the drip significantly, flag the risk before proceeding
- pSEO page cadence is separate from blog cadence - do not mix the two in calendar calculations

### `docs/sops/pseo-publishing-sop.md` L1-53: full SOP

# pSEO Publishing SOP

> Use before any new pSEO page template goes live, or before a new niche/comparison entry is added to `niches.ts` or `comparisons.ts`.

---

## Pre-Launch Checklist

- [ ] Every page provides unique value specific to that slug - not just variable substitution
- [ ] H1 and H2 headings are present and meaningful (not generic placeholders)
- [ ] Schema markup is implemented (check `src/components/common/JsonLd.astro`)
- [ ] Internal links: page links to its hub (`/youtube-for/` or `/youtube-vs/`) and at least 1 related page
- [ ] No keyword cannibalization - no existing blog post already targets the same query
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
2. **Who it's for section:** When to choose YouTube, when to choose the alternative - using ✅/❌ decision block format
3. **Depth beyond tables:** Each major difference explained in prose with B2B business implication

## Post-Launch Monitoring (first 30 days)

- Submit each new page to GSC Request Indexing on publish day
- If no impressions after 3 weeks: page likely needs more unique content depth
- Track target keyword positions within 30 days
- Low time-on-page or high bounce = thin content signal

### `src/pages/youtube-for/[slug].astro` L10-12: IST go-live filter

```ts
  cutoff.setHours(23, 59, 59, 999);
  return niches
    .filter((niche) => new Date(niche.publishDate + 'T00:00:00+05:30') <= cutoff)
```
