# Engineering conventions

Rationale and expanded detail behind the rules in `CLAUDE.md`. **Not always-loaded** — read when you
need the reasoning, are onboarding, or are deciding whether a shortcut is acceptable.

Split out of `CLAUDE.md` on 2026-08-17 (12,692 → ~5,000 chars) to stop paying ~1,950 tokens per
session for material needed occasionally. `CLAUDE.md` keeps the imperatives.

---

## Ethos: Simple, Robust, Pragmatic, Non-hacky

Every decision — new feature, dependency, abstraction, refactor — passes through four filters:

- **Simple** — fewer moving parts. Flat over nested. Obvious over clever.
- **Robust** — handles edge cases without duct tape. Fails predictably.
- **Pragmatic** — solves real problems today, not theoretical ones tomorrow.
- **Non-hacky** — no workarounds disguised as solutions. If a shortcut is unavoidable, flag it as
  tech debt with a TODO and explain why.

Prefer standard patterns over custom abstractions. When in doubt, ask before adding complexity.

## LSP-first navigation

> **Status note, 2026-08-17: no LSP tool is currently configured for this project.** No
> LSP/language-server entry exists in `SellonTube\.claude\settings.json`,
> `.claude\settings.local.json`, or `~\.claude\settings.json`, and no LSP tool is exposed to
> subagents in this workspace. This section moved out of `CLAUDE.md` because it was costing ~660
> chars per session to recommend a capability with nothing behind it. Grep/Glob is the actual path
> today. **If an LSP server is wired up later, move this back into `CLAUDE.md`.**

Use Language Server Protocol as the primary method for understanding and navigating the codebase. LSP
provides accurate, real-time symbol lookup, definitions, references and type information.

Workflow: locate symbols via LSP → inspect definitions and references → check types and dependencies
→ implement with full context.

Fall back to Grep/Glob when LSP is unavailable, the target is a string literal or comment, or the
query is pattern-based. LSP queries are cheaper, faster and more precise than reading entire files or
running broad searches: use them first, read files second, search broadly last.

## Why tool-page indexing works the way it does

Step 3 of the tool-integration rule runs `node scripts/bing-submit.mjs <file-of-urls>` rather than
IndexNow. Reasons:

- **IndexNow is broken here** — Cloudflare intercepts the request.
- The script uses the Bing Webmaster API `SubmitUrlbatch` endpoint with `BING_WEBMASTER_API_KEY` read
  from `.env` (see `scripts/bing-submit.mjs` lines ~23-43).
- **Not from `.mcp.json`** — no `.mcp.json` file exists in this repo, deliberately.

Google Search Console has no public submission API, which is why step 4 stays manual (URL Inspection
→ Request Indexing).

## Build standards — expanded

**Performance.** Optimize LCP on tool pages, which carry Gemini loading states. Lazy-load below-fold
images. Reserve space for media to prevent CLS. Defer non-critical JS. No render-blocking resources
above the fold.

**Canonical / crawl hygiene.** Absolute canonical URLs in head. Sitemap aligned with canonicals.
Internal links point to canonical URLs only. Watch for WordPress legacy URLs leaking into the index.

**Structured data.** Only schema matching visible content: `WebApplication` on tools,
`BreadcrumbList` on all pages, `FAQPage` only where an FAQ is visible on-page.

**Implementation.** Semantic HTML. Pages fully crawlable without JS.

## Internal linking — the authority-weighting reasoning

Route equity from blog posts and pSEO pages toward `/tools/*`, with descriptive anchors and
contextual cross-links from informational to commercial pages.

**Link count is not the goal.** A link from a high-impression page is worth many from zero-demand
pages, so weight by real GSC authority rather than chasing "0 orphans". The 2026-07-17 internal-linking
project shipped ~280 links into clusters carrying 0.56% of impressions while one page holding 46% of
site impressions sat untouched at position 32.

**Anchor diversity cap:** no single target URL may accumulate the same exact-match anchor phrase from
more than ~3 source pages. Money pages already carry large pre-existing counts —
`/tools/youtube-seo-tool` and `/tools/youtube-roi-calculator` sit at 28-32 exact-match anchors each,
so do not add more without varying the phrasing. Check the existing corpus before reusing a phrase.

New `src/data/niches.ts` and `src/data/comparisons.ts` entries populate `relatedLinks` with 2-4 links,
at least one tool, distinct anchors.

Full record: `research/aeo/internal-linking-phase2-report.md`.

## Mechanism limits worth knowing

- Internal links move pages *within* the top ~20 and do nothing for CTR on pages that already rank.
- A position-30+ page needs authority or content, not links.
- A page-1 zero-click page needs title/meta work.

## Doc reference note

`internal-linking-map.md` resolves only to `docs/templates/internal-linking-map.md` — i.e. it sits in
a *templates* folder. The "living doc that drifts" warning in `CLAUDE.md` may be pointing at a
template rather than a live map. Confirm which is intended before relying on either.
