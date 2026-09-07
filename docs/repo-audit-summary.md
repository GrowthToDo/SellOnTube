# Repo Audit Summary

> Last audit: 2026-09-07. Supersedes the April 2026 Phase-1 audit that used to live in this file
> (that content is preserved in git history, not repeated here — it's stale: agent count was 10,
> now 11, and its conclusions predate everything below).

---

## What this audit found and changed (2026-09-07)

**Healthy, left alone:** the canonical doc set — `CLAUDE.md`, `DOCS.md`, `ai-seo-guide.md`,
`content-playbook.md`, `style-guide.md`, `blog-production-standard.md`, `seo-rules.md`,
`content-depth-framework.md`, `mistakes-lessons.md`, the 11 `agents/*.md` specs, all `docs/sops/`
and `docs/templates/` — plus all live site code (`src/`), `research/keywords/sot_master.csv`, and
the `shopify-app-marketing/` product line. All still current and cross-referenced correctly.

**Security fix:** `scripts/zero_vol_research.py` had a live DataForSEO login/password hardcoded in
plaintext (git-tracked). Rewritten to read from environment variables. The old credential remains
visible in git history — it must be rotated with the vendor directly; the file edit alone does not
revoke it.

**Archived (moved, not deleted — content preserved for reference):**
- `archive/2026-04-22-audit-cycle/` — 7 files from a single April 2026 audit cycle
  (`audit-findings-2026-04-22.md`, `audit-run-log-2026-04-22.md`, `tools-audit-findings-2026-04-22.md`,
  `tools-audit-run-log-2026-04-22.md`, `content-audit-playbook.md`, `sellontube-tools-audit-playbook.md`,
  `ranking-checker-amplification-strategy.md`). All built on an impressions-first methodology that
  `traffic-reality-check.md` (2026-07-21) later found produced nothing across three separate
  projects — most western impressions on this site are bot traffic, not human demand.
- `archive/blog-strategy-lessons.md`, `archive/ms-clarity-strategy.md`, `archive/youtube-for-audit.txt`
  — orphaned one-off session docs. Durable, still-valid content was extracted first: the blog
  topic-selection checklist now lives in `mistakes-lessons.md` (2026-09-07 entry), and the Clarity
  behavioral-analytics detail was merged into `analytics-toolkit.md`.
- `scripts/archive/` — ~19 one-off/abandoned scripts (single-session GSC investigations, one-time
  hardcoded-path keyword merges). None were wired into `package.json` or referenced by any other
  script. The live keyword pipeline (`build_sot_keywords.py` → `build_sot_master.py` →
  `refresh_keyword_volumes.py` → `update_keyword_tiers.py`) and all CI-wired/maintained scripts
  were left in place.

**Deleted:** `docs/blog/` — confirmed empty directory, also the source of a stale-path confusion
already on record (`CLAUDE.md`/memory both warn "not `docs/blog/`").

**Doc-index fixes:**
- `agents/README.md` and `DOCS.md` were both missing `09-linkedin-writer.md` from their agent
  tables despite the file existing on disk — added to both.
- `traffic-reality-check.md` — the most load-bearing correction in the repo (live GSC/GA4 data
  showing the impressions-based growth model doesn't work) — was never linked from `DOCS.md`,
  `CLAUDE.md`, or any agent. Added to `DOCS.md`'s Strategy section.
- `analytics-toolkit.md` was orphaned from `DOCS.md`; added under a new Tooling section, refreshed,
  and flagged for a live spot-check (last verified 2026-04-05, at least one vendor swap since).
- `growth-strategy.md` (still "Last updated 2026-04-22", still the declared SSOT) got a banner
  pointing to `traffic-reality-check.md` and its links to the now-archived audit docs were updated
  to the new paths. Its tool roadmap and open decisions were **not** rewritten — those are the
  founder's calls, not a documentation-cleanup call.

## Follow-up pass (2026-09-07, same day)

- **`analytics-toolkit.md` spot-checked.** Every credential/env var confirmed present in `.env`
  or Netlify (Supadata's `TRANSCRIPT_API_KEY` was missing from the doc entirely — added, along
  with the vendor itself as tool #10). "Present" was verified, not "authenticates" — that needs a
  real API call, still unverified.
- **`take-screenshot.cjs` checked against `take-tool-screenshots.cjs` — not a duplicate.**
  `take-screenshot.cjs` is a generic single-URL screenshot utility (any URL, e.g. a competitor's
  page). `take-tool-screenshots.cjs` is specialized: pre-configured demo inputs and nav-cropping
  for SellonTube's own registered tools only. Different jobs. Both kept, no change needed.

## Remaining gaps (need a founder decision, not more file moves)

- `growth-strategy.md`'s 6-tool roadmap and blog schedule need re-evaluation against
  `traffic-reality-check.md`'s lead-magnet/diagnostic-tool framework — currently unresolved.
- The DataForSEO password rotation (flagged 2026-09-07) is still the user's action, not done here.

## Canonical documents (source of truth by domain)

| Domain | File |
|---|---|
| Claude Code operating rules | `CLAUDE.md` |
| Doc index / where to look | `DOCS.md` |
| AI citation (AEO/GEO) | `ai-seo-guide.md` |
| Content quality/strategy | `content-playbook.md` |
| Writing style | `style-guide.md` |
| Blog structure/formatting | `blog-production-standard.md` |
| Technical SEO | `seo-rules.md` |
| Word-count/depth targets | `content-depth-framework.md` |
| Growth roadmap (stale, see banner) | `growth-strategy.md` |
| **Traffic reality (overrides growth-strategy's numbers)** | `traffic-reality-check.md` |
| Keyword SSOT | `research/keywords/sot_master.csv` |
| Incident/lesson log | `mistakes-lessons.md` |
| Agent routing | `agents/README.md` |
