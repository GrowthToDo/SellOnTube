# SellonTube — Mistakes & Lessons (compound log)

Append a dated entry whenever a mistake is caught or a non-obvious lesson is learned.
Read this file at the start of work so past mistakes don't repeat.

> NOTE 2026-07-19: this file was found missing from the repo even though the session-start
> hook quoted earlier entries from it (last visible entry was 2026-07-17). Recreated fresh;
> if the older log resurfaces (other branch/stash), merge it above this line.

## Entry template
```
### YYYY-MM-DD — Title
- **What happened:**
- **Root cause:**
- **Lesson:**
```

### 2026-07-19 — Robots-meta detection must be attribute-order agnostic
- **What happened:** Two independent subagents (live URL checker and corpus auditor) both reported "no noindex anywhere, including tag pages." Direct inspection showed tag pages DO carry `<meta content="noindex,follow" name="robots">` — with `content` BEFORE `name`. Both agents' regexes assumed `name="robots"` comes first and false-negatived. Nearly caused a pointless "add noindex to tags" fix for a problem that didn't exist.
- **Root cause:** HTML attribute order is arbitrary; regexes encoding one order silently miss the other. Two agents agreeing is not verification when they share the same blind spot.
- **Lesson:** For any meta/attribute check, match the attribute pair in either order (or parse, don't regex). And when N agents agree on a negative finding, spot-check one instance directly before acting on it — agreement built on the same method is one data point, not N.

### 2026-07-19 — Link-insertion tasks must check host-post draft/redirect status first
- **What happened:** A cross-linking subagent placed a link into `is-youtube-worth-it-for-business.md` — a post that is `draft: true` AND 301'd to `/blog/youtube-marketing-roi` in netlify.toml. The edit was grammatically perfect and passed all style greps, but the page never builds, so the link would never render. Caught only because the verification step checked `dist/`, not source.
- **Root cause:** the agent validated the sentence, not the host. Same family as the cannibalization-check rule: a file existing in `src/data/post/` says nothing about whether it ships.
- **Lesson:** Before inserting a link INTO any post, verify the host is live: `draft` flag, publishDate, and netlify.toml 301/410 for its slug. Add this to any future link-building subagent prompt. Dist-based verification remains the backstop that catches it.

### 2026-07-19 — PowerShell 5.1 default encoding creates phantom em-dashes (and Set-Content adds BOM)
- **What happened:** (1) `Get-Content -Raw` without `-Encoding` misdecoded a clean UTF-8 file and a `[—–]` regex "found" em-dashes that don't exist (UTF-8 multibyte sequences read as ANSI map into the 0x96/0x97 dash range). (2) `Set-Content -Encoding utf8` on PS 5.1 wrote a UTF-8 BOM onto an MDX file.
- **Root cause:** PS 5.1 defaults: ANSI reads, BOM'd UTF-8 writes.
- **Lesson:** For any content-level check or write on this repo, use explicit UTF-8: `[System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)` and `WriteAllText` with `New-Object System.Text.UTF8Encoding($false)`. Verify first bytes after writes (`EF BB BF` = BOM = fix it). A dash-grep that wasn't encoding-explicit produced a false FAIL on a file with zero dashes.

### 2026-07-19 — GSC "crawled not indexed" is five different problems, not one
- **What happened:** 56-URL coverage report initially read as one indexing problem. Bucketing + live verification split it into: (a) deindexed formerly-ranking blog posts (authority reassessment — the only bucket that really mattered, 2 pages had 3.6k/1.5k impressions), (b) zero-demand pSEO (correctly excluded by Google, accept), (c) one real technical bug (hub 301 → canonical loop: netlify.toml redirected non-slash→slash while sitemap+canonicals said non-slash), (d) working legacy 301s (report lag, ignore), (e) noindexed tag pages (GSC classification quirk, ignore). Also: my own early "broken redirect syntax" suspicion from a Grep render artifact was disproven by live curls — the corpus auditor + live checker prevented a wrong fix.
- **Lesson:** Never treat a GSC coverage bucket as homogeneous. Join three sources before diagnosing: live HTTP behavior, built output (dist/), and live GSC demand data. Weight fixes by demand (GSC-FIRST): the fix effort went to the 2 deindexed posts feeding the /tools/ demand cluster, not the 30 pSEO pages with ~1k combined impressions. Full analysis: `research/search console/crawled-not-indexed-analysis-2026-07-19.md`.

### 2026-07-19 — Diagnosing the report instead of the goal (scope trap)
- **What happened:** A full session went into the GSC "crawled - currently not indexed" report (56 URLs). The fixes were correct but the demand data pulled during the same session showed the real traffic lever elsewhere: /tools/youtube-ranking-checker with 54.9k impressions at position ~24-51 on a winnable SERP, plus 520 queries where 2+ own pages cannibalize. The coverage report got cleaner; the biggest impressions opportunity got zero work. Post-hoc critique also surfaced: bogus uniform sitemap lastmod, skipped CTR layer (41 clicks on 54.9k impr), and refresh deltas (+2-4% words) likely below Google's significant-change threshold.
- **Root cause:** the exercise inherited its scope from the report that triggered it, not from the goal (impressions/traffic). GSC reports enumerate symptoms; demand concentration identifies levers.
- **Lesson:** Before executing any SEO work package, rank it against the site's top demand clusters ("which pages already have impressions blocked by position/CTR/cannibalization?"). A coverage-report cleanup must justify itself against the alternative use of the same effort on the top cluster. Also: always run a query-level [query,page] cannibalization pull BEFORE refreshing/consolidating any page in a cluster — refresh polishes a page whose real problem may be targeting overlap.
