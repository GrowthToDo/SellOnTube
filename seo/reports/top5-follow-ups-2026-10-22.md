# Follow-ups from the top-5 AI-citability refresh (2026-10-22)

Items found during the refresh and deliberately left out of it. Each line names where the fix goes
and why it waited. Source reports: `seo/reports/refresh-*-2026-10-22.md` and the consistency audit.

## Frozen tool pages (fix when the tool-fix branch `fix/tool-h1-mobile-space` lands)

- `src/pages/tools/youtube-autocomplete-keywords.astro`: FAQ and JSON-LD say "19 modifiers" and
  "60-100+ queries", loading text says "0-9". Code (`lib/youtube-suggest.ts`) has 35 modifiers,
  65 queries, no digit queries. Also the strongest page to add an inbound link to
  `/blog/best-youtube-autocomplete-keyword-tools` from.
- `src/pages/tools/youtube-transcript-generator.astro`: "No signup" in title, meta and schema;
  "AI summary" column; competitor table rows for Tactiq, NoteGPT, Notta and Sonix are stale (see
  the transcript post for verified figures); "original language" wording.
- `netlify/functions/get-transcript.ts` ~L92: user message still says English-only although the
  language fallback exists.
- `src/pages/tools/youtube-script-generator.astro`: FAQ word counts disagree with
  `/blog/youtube-script-examples-business` and `/blog/youtube-script-writing-guide`.

## Content

- `youtube-marketing-cost.md`: cost ranges conflict with `/blog/youtube-business-plan` and with
  itself (L87 vs L130). Needs its own mode 07 refresh, not a one-line patch.
- `youtube-script-writing-guide.mdx`: bot-only impressions (one rank-tracker query). Owner decides
  prune or merge into `/blog/youtube-script-examples-business` (FRAMEWORK §18). It also still
  carries the unsourced "50-65% still watching" retention claim (L83, L129, L259).
- Ahrefs prices are stale in `is-vidiq-worth-it-for-business.mdx` (~L293) and
  `youtube-seo-for-business.mdx` (~L316).
- `best-youtube-autocomplete-keyword-tools.md`: raw YouTube iframe, because a `.md` post cannot
  import `YouTubeFacade.astro`. Convert the post to `.mdx` in a later pass. Tool screenshots date
  from April 2026.
- `best-youtube-transcript-generators.mdx`: AIC-05 (first-party data) is a recorded Fail. An
  owner-run test of 5 videos across the listed tools would close it.

- Anchor cap, pre-existing: the exact anchor "best YouTube autocomplete keyword tools" points at
  `/blog/best-youtube-autocomplete-keyword-tools` from 9 source pages (cap ~3), measured on `dist/`
  2026-10-22. This refresh added no uses. Vary the anchor on 6 of those pages in a link pass.

## Research files

- `research/teardowns/dossier.md`: mark Scalelist "~1,260 subs" as unverified (no source); move
  the Tiiny Host "upload a CV" quote's source from Indie Bites #80 to Profitable Founder (2026).
  Teardown drafts in `research/teardowns/` still say 1,260; mark them superseded.

## Site and accounts (owner)

- Bing Webmaster: IndexNow returns 403 `UserForbiddedToAccessSite` for both keys (SEO_CONTEXT.md
  "IndexNow"). Check the site's status in Bing Webmaster Tools.
- No raster logo exists. Organization and BlogPosting `publisher.logo` still point at
  `favicon.svg`; Google wants a raster logo (at least 112x112 px).
- `youtube-seo-services` lost its ranking on 2026-09-15/16 (pos ~11 to ~39); the ranking-checker
  tool lost 27 clicks (pos 24 to 30), the site's one real click loss in the last 28 days.
  Candidates for a mode 08 / mode 07 follow-up.
- Open SEO_CONTEXT decision 8 (author lock) is unchanged; author schema now reads each post's real
  author from `src/data/authors.ts`.
