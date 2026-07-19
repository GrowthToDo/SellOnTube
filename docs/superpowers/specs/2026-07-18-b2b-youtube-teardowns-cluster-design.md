# B2B YouTube Channel Teardowns — Cluster Design (reconciled spec)

**Date:** 2026-07-18
**Branch:** `blog/b2b-youtube-teardowns`
**Source of record:** Founder PRD v1.2 (2026-07-18). This doc does NOT restate the PRD; it
records the decisions, blocker resolutions, and execution plan layered on top of it. Where this
doc and the PRD disagree, the newer decision here wins (all changes were founder-approved in the
2026-07-18 brainstorming session or pre-authorized by a PRD rule).

---

## 1. Scope (confirmed)

Not a single post. A **hub-and-spoke cluster**: 1 flagship hub + 8-10 per-channel teardown
spokes. One git branch (`blog/b2b-youtube-teardowns`) = one purpose = this cluster. Publishing
order: hub first, then spokes 2-3/week.

## 2. PRD blockers resolved during brainstorming (2026-07-18)

| PRD open item | Status | Evidence |
|---|---|---|
| #3 Can the audit tool score **external** channels? | ✅ RESOLVED — yes | `netlify/functions/channel-audit.ts` accepts any `@handle` / channel URL / `UC…` ID, pulls last 10 uploads via YouTube Data API, scores 0-100 across 4 dimensions (Title, Description, Consistency, SEO) via Gemini. No manual-rubric fallback needed. |
| #1 Brand/content guidelines doc (Phase 0 dependency, blocks Phase 3) | ✅ effectively RESOLVED — pending founder one-line confirm | `docs/brand-voice.md` exists and points to the source rule docs (`docs/icp.md`, style-guide, `docs/blog/blog-production-standard.md`). Phase 3 is NOT blocked. |
| #4 Final keywords + pivot decision | ⏳ provisional decision made (see §3); final lock after Phase 2 SERP | See §3. |

## 3. Keyword decision (GSC-first / winnable-tier check)

Ran the PRD hub seed terms against the winnable SSOT (`research/keywords/sot_master.csv`):

- PRD seeds are weak: `best b2b youtube channels`, `b2b youtube channels`, `b2b youtube
  strategy`, `youtube business case study` → all **tier=avoid, vol 50**.
- Adjacent winnable terms carry ~10x volume: `youtube marketing case study` (vol 500, KD 0,
  **winnable**), `youtube for b2b` (vol 500, **winnable**), `b2b youtube` (vol 500, **winnable**).

**Decision (founder, 2026-07-18):** provisionally **pivot the hub to the winnable adjacent
cluster** (case-study / examples / "YouTube for B2B that actually acquires customers"), per the
PRD §6 pivot rule — teardowns and spokes unchanged, only hub H1/title/primary keyword move.
**Final keyword lock deferred to Phase 2** after DataForSEO + live SERP analysis. Do not write
titles until Phase 2 confirms.

**Cannibalization guard:** a live post already owns the b2b-marketing-lead-gen intent —
`src/data/post/youtube-marketing-b2b.md` ("YouTube Marketing for B2B: Generate Leads"). The hub
must target the **case-study / examples** intent and cross-link to that post, never re-compete
for the same query. Related existing posts to link (not compete): `youtube-marketing-roi.md`,
`youtube-roi-for-saas.mdx`, `youtube-vs-paid-ads-b2b.mdx`, `youtube-ads-for-b2b-lead-generation.mdx`
(on branch `blog/youtube-ads-b2b-pillar`).

## 4. Slug scheme (confirmed clean)

- Hub: slug TBD post-keyword-lock (Phase 2). No dates in slug.
- Spokes: `/blog/<company>-youtube-strategy` (e.g. `arvow-youtube-strategy`). Checked against
  `netlify.toml` redirects + existing posts: **no collisions**, `-youtube-strategy` suffix is free.

## 5. The moat pipeline (how audit scores get produced)

`POST https://sellontube.com/.netlify/functions/channel-audit` with body
`{ "channelInput": "@handle" }` → live prod endpoint (env keys already set in Netlify).
Server-side curl bypasses the browser CORS lock. Returns `overallScore`, 4 dimension scores +
summaries, per-video title/description ratings, 3 recommendations. This feeds the hub comparison
table + each spoke's score breakdown. Every audit run is dated ("as of July 2026") per §9 data
policy.

## 6. Seed channels (from PRD §8 — Phase 1 verifies/qualifies)

| Channel | Handle (Phase 1 to confirm) | Status | Anchor source |
|---|---|---|---|
| Arvow | TBD | ✅ Verified claim | Starter Story: 0 → $79K/mo "all through YouTube" |
| Tiiny Host | TBD | ✅ Verified claim | ~$1M ARR SEO+YouTube; faceless JTBD tutorials |
| Bulk Mockup | TBD | ✅ Verified claim | Starter Story: $12K/mo |
| Borumi | TBD | ⚠️ Evidence pending | No public acquisition claim yet → find source or CUT |
| +4-6 more | — | Phase 1 qualify | Must meet all 4 PRD §8 gates; prioritise classic B2B motion |

## 7. Execution plan (PRD phases, with gates)

- **Phase 1 — Research (now):** (a) confirm YouTube handles for the 3 verified anchors + run
  each through the live audit endpoint → capture scores; (b) verify every acquisition claim to a
  linkable public source (browse); (c) resolve Borumi (source or cut); (d) qualify 4-6 more
  channels against the PRD §8 gates. **Output:** shortlist + source dossier + audit scores.
  **Gate:** founder approves; unverified channels cut. Dossier lives at
  `research/teardowns/dossier.md` (to create).
- **Phase 2 — Keywords:** DataForSEO + SERP analysis on hub candidates + spoke company-name
  clusters; confirm the §3 pivot; assign primary/secondary. **Gate:** founder approves keyword lock.
- **Phase 3 — Outline:** hub outline + spoke template + 5 title candidates + graphics list,
  checked against `docs/brand-voice.md`. **Gate:** founder approves.
- **Phase 4 — Draft:** hub first, then spokes 2-3/week; graphics, schema, on-page checklist
  (PRD §20) complete. Rule: no research during drafting — every claim traces to the Phase 1
  dossier. **Gate:** founder reviews claims vs dossier.
- **Phase 5 — Publish + distribute.** **Phase 6 — Quarterly refresh.**

## 8. Standing project rules that bind every phase

- publishDate = `YYYY-MM-DDT00:00:00Z`, IST-gated; never set by a subagent; never future unless
  intentionally scheduled (404 landmine).
- Every new page → add to internal-linking plan; featured SVG must exist before publish
  (`validate-build.js` Check 4). Hub + spokes each need `<slug>-featured.svg`.
- No em-dashes in copy; run banned-pattern greps pre-publish; FAQ written manually in MDX body
  (frontmatter `faqs` only emits schema).
- Analyse `dist/` (built HTML), not source, for any rendered-output claim.
- Commit only when founder says "commit". Never push without asking.

## 9. Founder decisions locked (2026-07-18 brainstorming)

- ✅ **Phase 0 doc** = `docs/brand-voice.md` + its linked source docs. Phase 3 unblocked.
- ✅ **BOFU video** in production, not paused behind this cluster. Phase 4 companion video clear.
- ✅ **Channel discovery** fully delegated to Claude Code (browse + qualify vs §8 gates).
- ✅ **Quality floor:** ship only channels that clear the strict §9 source gate, even if that
  yields <8. Never pad. Borumi cut unless a linkable acquisition source surfaces in Phase 1.
- ✅ **Audit framing:** run the live tool on current uploads for the comparison table (dated "as
  of July 2026"), AND manually pull 3-5 growth-era representative titles per channel for the
  spoke title-pattern teardown (satisfies PRD §11). Note any score-vs-era divergence as insight.
- ✅ **Sub-agents:** parallel read-only research (source verify + handle-find + era-title pull +
  discovery). Main thread runs all live audit curls centrally for consistent quota control.

## 10. Phase 1 output target

`research/teardowns/dossier.md` — per channel: name, product, ICP, YouTube @handle + channel URL,
linkable acquisition-claim source(s), evidence-strength rating, observed sub/video counts (dated),
3-5 growth-era titles, live audit score (4 dims + overall), qualify/cut verdict. Founder approves
before Phase 2.
