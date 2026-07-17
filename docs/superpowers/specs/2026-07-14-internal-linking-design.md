# Internal Linking Overhaul — Design

**Date:** 2026-07-14
**Branch:** `internal-linking`
**Status:** Approved by user, ready for implementation plan

## Goal

Build topical authority + improve impressions/traffic by fixing broken internal linking and adding a systematic contextual-linking pass across the whole site.

## Scope

**In scope (127 pages):**
- Blog: 52 published posts (`src/data/post/*.md(x)`, `draft: true` excluded)
- youtube-for pSEO: 31 pages (30 from `src/data/niches.ts` + standalone `src/pages/youtube-for/shopify.astro`)
- youtube-vs pSEO: 21 pages (`src/data/comparisons.ts`)
- **Hub/pillar pages: 2** — `src/pages/youtube-for/index.astro`, `src/pages/youtube-vs/index.astro`. Missed in the original audit; these are the pillar pages for their clusters and get their own treatment (see SEO strategy layer below), not lumped into "core."
- Tools: 14 pages (`src/pages/tools/*.astro`, excluding index)
- Core static: 7 (`/`, `/about`, `/pricing`, `/product-pricing`, `/how-it-works`, `/next-steps`, `/changelog`)

**Out of scope — Shopify-app vertical (excluded entirely, not a source or target):**
- `src/pages/shopify-app.astro`, `src/pages/shopify-store.astro`, `src/pages/shopify-services.html`
- Everything under `src/pages/shopify-app/` (case-studies, tools subfolders)
- `youtube-for/shopify.astro` is the one exception — kept IN scope (part of core youtube-for cluster)
- **`src/pages/case-studies/luxury-jewellery-client.astro` and `src/pages/case-studies/us-supplements-brand.astro`** — despite living at a `/case-studies/*` path (not `/shopify-*`), both are Shopify-vertical content: footer branding reads "SellOnTube for Shopify Merchants," lists Shopify-services line items, and links to `/shopify-store`. Excluded for the same reason as the rest of the Shopify vertical. (Caught by reading page content, not by path-prefix matching — the original 127-page count briefly included them as "2 case studies" before this was caught.)

## Current-state findings (audited 2026-07-14, see agent transcript for method)

**Orphans (0 inbound links) — 14:**
- Core (4): `/about`, `/changelog`, `/how-it-works`, `/next-steps`
- Blog (1): `/blog/youtube-seo-services`
- youtube-vs (9): cold-outreach, community-building, content-marketing, facebook-ads, google-ads, instagram-for-saas, linkedin-for-agencies, reddit-for-saas, twitter-for-saas

**Near-orphans (exactly 1 inbound) — 10 in scope** (2 case-study entries from the original 12 are now out of scope, see below):
- Blog (3): youtube-analytics-other-channels, youtube-chapters-timestamps, youtube-video-ideas-generator-for-b2b
- youtube-for (1): shopify
- youtube-vs (6): email-marketing, paid-ads, podcasting, referral-marketing, seo-content, webinars

**Dead ends (0 outbound) — 4:** `/`, `/about`, `/changelog`, `/how-it-works`

**Root cause of most youtube-vs orphans:** `src/pages/youtube-vs/[slug].astro`'s "More Comparisons" block computes siblings as `comparisons.filter(not self).slice(0, 4)` — this always resolves to the same first 4 array entries (facebook, instagram, linkedin-for-b2b, instagram-for-coaches) regardless of the current page. Entries at array positions 5-21 never appear in anyone's sibling block. This is a template bug, not a content gap.

**pSEO link mechanism:** 100% template-driven, not content-driven. Neither `niches.ts` nor `comparisons.ts` embed links in prose fields. youtube-for's cross-link block is genuinely symmetric (links to every other niche — 30 niches are well-interlinked already). youtube-vs's is broken per above. `comparisons.ts` has an optional `relatedLinks` field, populated on only 3 of 21 entries.

**Homepage is a dead end (per the static-source audit — needs re-confirming against real built HTML).** The static-grep pass found 0 outbound internal links from `/`. This is the single biggest miss if true: the homepage is normally the highest-authority page on the site (most external backlinks resolve to root), so every link it withholds is authority not being sculpted toward money pages. However, `/` renders a "latest blog posts" component and a case-study-style link dynamically at build time — links a static source-grep cannot see. The implementation plan re-verifies this against the real built HTML before treating it as confirmed, rather than assuming the static finding is accurate.

**Case-study pages excluded from scope.** The two pages originally flagged as a "case-study reciprocal loop" (`luxury-jewellery-client`, `us-supplements-brand`) turned out, on reading their actual content, to be Shopify-vertical pages (footer reads "SellOnTube for Shopify Merchants," links to `/shopify-store`) living at a `/case-studies/*` path rather than under `/shopify-*`. They're excluded per the Scope section above — no fix needed for this project.

## SEO strategy layer

This is what turns "fix the broken links" into "build topical authority," per the original goal — these rules govern *how* Phase 1 and Phase 2 choose and shape links, not just whether a link exists.

1. **Homepage equity distribution.** `/` gets deliberate, prioritized treatment, not the generic "core page" 1-2 links, IF the real built-HTML audit confirms it still needs it (see the caveat above — its dynamic components may already resolve this). If confirmed, it should link to: the pillar/hub pages (`/youtube-for`, `/youtube-vs`) and 1-2 top-tier tools (money pages). This is scoped inside Phase 1 (dead-end fix), not deferred to Phase 2.
2. **Click depth, not just inbound-link count.** A page with 1 inbound link via primary nav can still be "close" to home; a page with 1 inbound link buried in a random blog paragraph is functionally far. Phase 2's final audit reports click-depth-from-home alongside raw inbound count, and flags anything >3 clicks deep as a secondary finding (informational, not a blocking gate for this project).
3. **Link equity sculpting via keyword tier.** `research/keywords/sot_master.csv` has `tier` (winnable/stretch/avoid/pseo) and `priority_score` per target. When a page could plausibly link to more than one relevant target, Stage 1 (propose) prefers the target with `tier=winnable` and the higher `priority_score`. Never spend a contextual link on a page tiered `avoid`.
4. **Money-page-first ratio.** Every blog post and every pSEO page must link to at least 1 tool page (money page) by the end of Phase 2, not just "whatever's relevant." Stage 1 checks this as a hard minimum per page, separate from the general 2-4 contextual links.
5. **Anchor text diversity.** No single target URL should accumulate the same exact-match anchor phrase across more than ~3 source pages (over-optimization / anchor-spam risk). Stage 2 (verify) checks proposed anchors against the existing `internal-linking-map.md` table and rejects an exact repeat once the threshold is hit — propose agent must vary phrasing (natural-language variants, not synonyms-for-the-sake-of-it).
6. **Cannibalization / redirect safety.** Before accepting any new link, Stage 2 cross-checks `netlify.toml`: never link to a URL that's a 301/410 redirect source — always resolve to the canonical target. Also: if two in-scope pages target the same underlying query (e.g. a youtube-vs comparison and a youtube-for niche overlapping the same keyword), do not cross-link them with keyword-rich exact-match anchors — this sends a cannibalization signal. Link with natural, non-competing anchors instead, or skip the link.

## Architecture

### Phase 1 — Mechanical fixes (small, independently reviewable)
1. Fix the youtube-vs sibling-selection bug in `src/pages/youtube-vs/[slug].astro`. Replace the hardcoded slice with a real siblings computation (candidate heuristic: shared category/vertical first, then fill remaining slots by nearest array-distance from self, wrapping around — exact heuristic finalized in implementation plan).
2. Re-verify the homepage dead-end finding against real built HTML (not the static-grep pass). Fix only if still confirmed: add deliberate outbound links per SEO strategy layer rule 1 (hub pages, top-tier tools).
3. Add real, contextual links for the remaining flagged pages (orphans/near-orphans/dead-ends not covered above):
   - Each orphan gets >=1 real inbound link from a genuinely relevant page.
   - Each dead-end gets outbound links to relevant content.
4. Re-run the link-graph audit (same method as the discovery pass) to confirm 0 orphans remain among these pages.

### Phase 2 — Broad contextual pass (all 127 pages, workflow-orchestrated)
Batches: blog (52) / youtube-for (31) / youtube-vs (21) / hub pages (2, pillar treatment) / tools (14) / core (7, lighter touch — 1-2 links each, since these are utility pages not topical content).

- **Stage 1 (propose):** one agent per batch reads each page plus `docs/templates/internal-linking-map.md`, `docs/strategy/growth-strategy.md`, `src/data/topics.ts`, `src/data/niches.ts`, `src/data/comparisons.ts`, `research/keywords/sot_master.csv` to find 2-4 genuinely relevant contextual links per page (target URL, anchor text, insertion section), applying SEO strategy layer rules 3-4 (tier/priority weighting, money-page-first minimum). Output structured JSON per page, not prose.
- **Stage 2 (verify):** a separate agent checks every proposed link:
  - target URL exists in the confirmed 127-page inventory (not guessed), and is not a 301/410 redirect source in `netlify.toml` (rule 6)
  - anchor text has no em-dash, no banned phrases (per `style-guide.md`), and isn't an over-used exact-match repeat (rule 5)
  - not a duplicate of a link already on that page
  - not a cannibalization risk between two pages competing for the same query (rule 6)
  - insertion point makes contextual sense (not a bare tacked-on list)
- Only verified links get applied, via Edit (not blind agent-write) so the main thread reviews the diff.
- Final stage: re-run the link-graph audit across all 127 pages (including click-depth-from-home per rule 2), update `docs/templates/internal-linking-map.md` with every new edge, report before/after orphan counts.

## Data flow

```
propose (per page: {url, links: [{target, anchor, section}]})
  → verify (per link: {valid: bool, reason})
  → filtered accepted list
  → applied via Edit
  → audit script re-confirms
```

## Error handling / quality gate

- Any proposed link failing verify is dropped, never force-applied.
- Links inserted into existing prose/sections, matching `blog-production-standard.md` conventions — never appended as a bare list.
- Style-guide grep (em-dash, banned patterns) run across all touched files before this is called done.
- `publishDate`/frontmatter untouched by this task — avoids the known 404 landmine (see project `mistakes-lessons.md`).

## Testing / verification

- Astro build after edits — confirm no broken MDX/Astro syntax.
- Re-run link-graph audit — target: 0 orphans, 0 dead-ends, near-orphan count materially reduced.
- User reviews diff before any commit.

## Rollout

- All work lands on `internal-linking` branch (already created off `main`).
- Phase 1 and Phase 2 land as separate commits, not squashed — the template-bug fix is independently reviewable/revertable from the broad content pass.
- No commit or push until the user explicitly says so (per project CLAUDE.md).

## Success metrics / measurement plan

Mirrors the pattern already used for the comparison-post retrofit (`research/aeo/retrofit-baseline-2026-06-29.md`):

- **Baseline snapshot before ship:** pull live GSC (clicks/impressions/CTR/avg position) for all 30 flagged pages + the homepage, dated to the day before merge.
- **Structural before/after:** orphan count, near-orphan count, dead-end count, and click-depth-from-home distribution — captured pre- and post-change from the audit script.
- **Re-pull window:** re-check GSC ~4-6 weeks post-ship (matches existing project cadence for measuring on-page changes). Compare impressions/clicks/position for the 30 previously-flagged pages specifically, since those are where the clearest signal should show up first.
- Log the comparison as a new dated entry in this project's `mistakes-lessons.md` or a `research/` note, whichever the user prefers at ship time — either way, don't let this join the list of "OPEN: measure lift" items that never get closed.
