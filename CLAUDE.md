# Claude Code — Operational Instructions

SellonTube is a static marketing site: **Astro 5 + Tailwind + MDX, deployed on Netlify.** Audience:
B2B founders and SaaS operators evaluating YouTube for customer acquisition.

**Ethos: Simple, Robust, Pragmatic, Non-hacky.** Every new feature, dependency or abstraction must
pass all four. If it breaks one, push back with an alternative instead of building it. Prefer standard
patterns; ask before adding complexity.

Definitions, LSP-first navigation, indexing rationale and expanded build standards:
`docs/engineering-conventions.md`. Full doc index: `DOCS.md`.

## New tool integration — definition of done

Adding a `src/pages/tools/*.astro` file is not finished until all four are done. This is part of
building the tool, not a follow-up task.

1. Add the tool to the `tools` array in `src/pages/tools/index.astro`, in correct workflow position.
2. Add it to the `Free Tools` linkGroup in `src/navigation.ts`, matching order.
3. Submit both URLs to Bing: `node scripts/bing-submit.mjs <file-of-urls>`. Run it as a standard step
   whenever a new tool or blog post publishes — no need to ask first.
4. Remind the user to submit both URLs in Google Search Console (URL Inspection → Request Indexing).
   Manual by necessity; GSC has no public submission API.

Full detail: `agents/08-microtool-builder.md` Phase 7.

## AEO / AI citation

`ai-seo-guide.md` is the single source of truth for AI-search optimization. **Do not restate AEO rules
in other docs** — point at it. Section map (§16 citability gate, §17 language, §18 media, §19 what
actually gets cited): `seo-rules.md`.

**Agent 05 hard-fails any post that misses the §16 citability gate.** Third-party ratings only where a
real listing exists, never fabricated; SellonTube's own tools use first-party proof plus disclosure.

Page structure for comparison / alternatives / best-tools posts:
`agents/references/comparison-content-playbook.md`. Word-count and depth tiers only:
`content-depth-framework.md`.

## Build standards

Every page or feature deliverable includes: SEO risks, canonical/indexation risks, recommended
structured data, performance notes.

Constraints that bite: optimize LCP on tool pages, reserve space for media (CLS), absolute canonical
URLs with the sitemap aligned, schema only where the content is visible, pages crawlable without JS.
**Anchor diversity cap:** no target URL may take the same exact-match anchor from more than ~3 source
pages. Weight linking by real GSC authority, not orphan counts. Detail and reasoning:
`docs/engineering-conventions.md`.

## Mistakes to avoid

Each rule below is a compressed prevention rule. Full incident record: `mistakes-lessons.md` — a
SessionStart hook injects only its newest ~4,000 chars, so read the file directly for the 2026-07-17
verification lessons.

- **`publishDate` determines go-live. Get it right the first time.** Netlify builds filter out any
  post where `publishDate > today`, so a future date means a 404. If it ships now, use today's date
  from the `currentDate` context variable, never tomorrow. If scheduled, use that exact date. Format
  `YYYY-MM-DDT00:00:00Z`. This has caused deploy 404s multiple times.

- **Any code comparing `publishDate` must use IST conversion.** `src/utils/blog.ts` converts to IST
  via `toIST()` (line ~71) before filtering. Any other script that decides draft/future/published —
  e.g. `scripts/validate-build.js` — must use the identical `toIST()` conversion and end-of-day
  cutoff (`setHours(23, 59, 59, 999)`). Raw UTC comparison disagrees with Astro and causes false build
  failures. Copy the logic; do not reimplement it.

- **Never push to live without asking. This is the one repo here with a remote.** Show the commit
  message, wait for an explicit "yes", then commit and push. Do not combine showing, committing and
  pushing into one action.

- **Never return HTTP 502 from Netlify functions.** Cloudflare intercepts 502 and replaces the body
  with `error code: 502`, hiding the real error. Use 503 for upstream API failures.

- **Gemini model rule:** always `gemini-flash-latest` (auto-updating alias). Never pin a versioned
  model like `gemini-2.0-flash` — they get deprecated and 404. Set `maxOutputTokens` to at least
  `2048`, and `4096` whenever the prompt carries a transcript or other long input; thinking tokens
  count toward the output limit and 2048 was exhausted before any JSON was emitted (2026-09-05,
  `generate-tags`). Always guard for empty `text` and return 503 with `finishReason`, never let
  `JSON.parse('')` throw a 500.

- **Netlify redirect syntax:** `:placeholder` only works between `/` separators. For within-segment
  patterns use splat: `from = "/youtube-for-*"` + `to = "/youtube-for/:splat"`.

- **Read SEO docs before any SEO suggestion.** `seo-rules.md` and `seo-audit-log.md` first.
  Project-specific rules override general SEO knowledge.

- **GSC-FIRST: pull live Search Console data BEFORE scoping any SEO project** — not just titles and
  meta, but *any* SEO work: internal linking, technical fixes, content, AEO, refactors. Write down
  where impressions and clicks actually concentrate, then state explicitly which of those pages the
  proposed work moves and by what mechanism. If the answer is "pages with negligible impressions" or
  "this mechanism cannot move this page's constraint", re-scope before writing code. **Violated
  twice** (2026-06-30, 2026-07-17). Mechanism limits are in `docs/engineering-conventions.md`.

- **Analyse `dist/`, not source, for anything about rendered output** — links, canonicals, schema,
  headings, what actually ships. A large share of internal links are generated at build time by
  components and algorithms (`BlogLatestPosts`, the related-posts scorer, pSEO template loops) and
  exist as no literal `href` in source. A source grep gives confident wrong answers: it falsely
  reported the homepage as a dead end and invented orphans that were already linked. Run
  `npm run build`, then analyse `dist/`. `scripts/audit_internal_links.py` does this correctly and
  excludes `header`/`footer`/`nav` chrome so boilerplate cannot mask real orphans.

- **A verification script must fail loudly, and must be mutation-tested before you trust it.** A
  silent failure turns "unknown" into "verified clean" and is worse than no checker. Always check
  `returncode` on subprocess calls — never treat empty stdout as a valid empty result — and normalise
  `glob`/`pathlib` paths with `.replace('\\', '/')` before any `git` pathspec, since Windows
  backslashes silently break `git show ref:path`. Before believing an "all clean" verdict,
  deliberately break the thing being checked and confirm the checker fails.

- **Validate against the corpus, not against the doc that describes it.** Living docs are a lossy
  cache and always drift. Any site-wide constraint check (anchor diversity, canonical uniqueness,
  schema presence) must compute current state from the real files plus built HTML at check time.

- **After any fix pass, re-run the FULL verification suite, not just the check for what you fixed.**
  Narrow fixes introduce fresh defects: a scripted anchor swap produced "the **the** tag generator
  tool" in live prose, and the grammar fix for that collided with existing anchors and re-broke a cap
  an earlier round had closed. A fix is done when everything passes, not when your thing passes.
  Scripted edits into prose must validate the resulting full sentence, not the replaced token.

- **Style guide applies to ALL copy, not just new writing.** On any copy task, check all existing copy
  on touched pages against `style-guide.md` and `content-playbook.md`. Grep for every banned pattern
  before finishing.

- **Blog render rules are canonical in `blog-production-standard.md`** — callout and table font sizes
  (§ lines 432, 435), inline-SVG light palette (line 242), manual `## FAQ` heading with `### Question`
  H3s in the MDX body (frontmatter `faqs` only emits JSON-LD, it renders nothing visible), and the
  pre-publish QA checklist (§9). Copy from the templates; never guess a size. Run the QA checklist
  before showing any draft — the user reviews strategy and tone, not missing formatting.
