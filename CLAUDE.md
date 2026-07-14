# Claude Code — Operational Instructions

## Project Overview

SellonTube is a static marketing site built with Astro 5, Tailwind CSS, and MDX, deployed on Netlify. Target audience: B2B founders and SaaS operators evaluating YouTube for customer acquisition.

## Project Ethos: Simple, Robust, Pragmatic, Non-hacky

Every decision — new feature, dependency, abstraction, refactor — must pass through these four filters:

- **Simple:** Fewer moving parts. Flat over nested. Obvious over clever.
- **Robust:** Handles edge cases without duct tape. Fails predictably.
- **Pragmatic:** Solves real problems today, not theoretical ones tomorrow.
- **Non-hacky:** No workarounds disguised as solutions. If a shortcut is unavoidable, flag it as tech debt with a TODO and explain why.

**Rules:**
- Before adding any new feature, dependency, or abstraction, check it against these four principles.
- If it breaks any of them, push back — explain what breaks and suggest an alternative that preserves the ethos.
- Prefer standard patterns over custom abstractions.
- When in doubt, ask before adding complexity.

## LSP-First Navigation

Use Language Server Protocol (LSP) as the primary method for understanding and navigating the codebase. LSP provides accurate, real-time symbol lookup, definitions, references, and type information.

**Workflow:** Locate symbols via LSP → Inspect definitions and references → Check types and dependencies → Implement with full context.

**Fallback to Grep/Glob only** when LSP is unavailable, the target is a string literal or comment, or the query is pattern-based.

> LSP queries are cheaper, faster, and more precise than reading entire files or running broad searches. Use them first, read files second, search broadly last.

## New Tool Integration Rule

**Every new tool page must be added to the /tools listing and footer before the task is considered done.** This is not a separate task — it is part of building the tool. After creating any new `src/pages/tools/*.astro` file:
1. Add the tool to the `tools` array in `src/pages/tools/index.astro` (correct workflow position)
2. Add the tool to the `Free Tools` linkGroup in `src/navigation.ts` (matching order)
3. Submit both URLs to Bing automatically via `node scripts/bing-submit.mjs <file-of-urls>` (IndexNow is broken due to Cloudflare; this script uses the Webmaster API `SubmitUrlbatch` endpoint with `BING_WEBMASTER_API_KEY` from `.env`, not `.mcp.json` — no `.mcp.json` file exists in this repo). No need to ask first — run it as a standard step whenever a new tool or blog post publishes.
4. Remind the user to submit both URLs in Google Search Console (URL Inspection → Request Indexing) — this step is manual (GSC has no public submission API), so it can't be automated.

See `agents/08-microtool-builder.md` Phase 7 for full details.

## AEO / AI Citation (canonical)

`ai-seo-guide.md` is the single source of truth for AI-search optimization. Do not restate AEO rules in other docs; point to the canonical sections:
- **Section 16** = the five citability rules + the hard pre-publish citability gate.
- **Section 17** = citation-ready language rules.
- **Section 18** = media policy (every post: relevant image + video, perf-safe, never padding).
- **Section 19** = what actually gets cited at SellonTube (proven archetype + 9 signals; visible-FAQ-in-body is the biggest gap).
- `agents/references/comparison-content-playbook.md` = page structure for comparison / alternatives / best-tools posts.
- `content-depth-framework.md` = word-count and depth tiers only.

Agent 05 hard-fails any post that misses the Section 16 gate. Third-party ratings only where a real listing exists (never fabricated); SellonTube's own tools use first-party proof plus disclosure.

## Build Standards

1. **Performance** -- Optimize LCP on tool pages (Gemini loading states). Lazy-load below-fold images. Reserve space for media to prevent CLS. Defer non-critical JS.
2. **Canonical/crawl hygiene** -- Absolute canonical URLs in head. Sitemap aligned with canonicals. Internal links point to canonical URLs only. Watch for WordPress legacy URLs leaking into the index.
3. **Internal linking** -- Route equity from blog posts and pSEO pages toward `/tools/*`. Use descriptive anchors. Add contextual cross-links from informational to commercial pages.
4. **Structured data** -- Only schema matching visible content. WebApplication on tools, BreadcrumbList on all pages, FAQPage only where FAQ is visible on-page.
5. **Implementation** -- Semantic HTML. Pages fully crawlable without JS. No render-blocking resources above the fold.

**Every page/feature deliverable includes:** SEO risks, canonical/indexation risks, recommended structured data, performance notes.

## Mistakes to Avoid

- **publishDate determines when a post goes live. Get it right the first time.** This is a static site — Netlify builds filter out any post where `publishDate > today`. A future date means a 404. Three rules: (1) If the post should go live NOW, use today's date from the `currentDate` context variable, never tomorrow. (2) If the post is scheduled for a future date, use that exact date. (3) Always double-check: "Is this date today or in the past?" before committing. Format: `YYYY-MM-DDT00:00:00Z`. This mistake has caused 404s on deploy multiple times.

- **Any code that compares publishDate must use IST conversion.** Astro's `blog.ts` converts all publishDates to IST via `toIST()` before filtering. Any other script that checks whether a post is draft/future/published (e.g. `scripts/validate-build.js`) MUST use the identical `toIST()` conversion and end-of-day cutoff (`setHours(23, 59, 59, 999)`). Raw UTC comparison will disagree with Astro and cause false build failures. If you add a new script or check that touches publishDate, copy the `toIST()` logic from `blog.ts`.

- **Never push to live without asking the user first.** Show the commit message, wait for explicit "yes", THEN commit and push. Do not combine showing, committing, and pushing into one action.

- **Plan before coding, get approval before implementing, commit only when asked.** Diagnose → present plan → get explicit "yes" → implement → user says "commit" → commit.

- **Never return HTTP 502 from Netlify functions.** Cloudflare intercepts 502 responses and replaces the body with `error code: 502`, hiding actual error details. Use HTTP 503 for upstream API failures instead.

- **Gemini model rule:** Always use `gemini-flash-latest` (auto-updating alias). Never pin to versioned models like `gemini-2.0-flash` — they get deprecated and return 404. Set `maxOutputTokens` to at least `2048` (gemini-2.5-flash thinking tokens count toward the output limit).

- **Netlify redirect syntax:** `:placeholder` only works between `/` separators. For within-segment patterns (e.g. `/youtube-for-*`), use splat syntax: `from = "/youtube-for-*"` + `to = "/youtube-for/:splat"`.

- **Read SEO docs before any SEO suggestion.** Check `seo-rules.md` and `seo-audit-log.md` first. Project-specific rules override general SEO knowledge.

- **Style guide applies to ALL copy, not just new writing.** When any copy task is performed, check ALL existing copy on touched pages against `style-guide.md` and `content-playbook.md`. Grep for every banned pattern before finishing.

- **Callout box and table font sizes:** labels `0.7-0.8rem`, callout body text `0.85-0.9rem`, table text `0.95rem`. These are the sizes used in the actual HTML templates in `blog-production-standard.md`. Copy sizes from the templates, do not guess.

- **FAQ content must be written manually in MDX body.** Frontmatter `faqs` array ONLY generates schema.org FAQPage JSON-LD (invisible to readers). The visible FAQ section requires an `## FAQ` heading followed by `### Question` + paragraph answer for each item. Every other blog post does this manually. The template does NOT auto-render frontmatter FAQs.

- **Inline SVG diagrams in blog posts must use the light palette:** background `#f8fafc`, borders `#e2e8f0`, dark text. Match the blog page's light theme. Featured images (the hero SVG at the top) keep the dark palette: background `#030620` to `#0a1540`. Do not use the dark palette for inline diagrams.

- **Run the pre-publish QA checklist before showing any blog draft.** After writing, run verification greps (em-dashes, banned patterns, font sizes) and visually check in browser (SVG rendering, callout readability, table responsiveness, FAQ visibility). The draft shown to the user must be production-ready. The user reviews strategy and tone, not missing formatting.
