# Internal Linking Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken internal linking (template bug + orphaned/dead-end pages) and add a systematic, SEO-strategy-driven contextual-linking pass across all 127 in-scope pages, to build topical authority and improve impressions/traffic.

**Architecture:** Build a reusable link-graph audit script that crawls the real built site (`dist/`, not source grep) to get ground truth. Phase 1 does small, independently-reviewable mechanical fixes (template bug, homepage, remaining stragglers). Phase 2 fans out agents per content-type batch to propose contextual links, verifies every proposal against real constraints, then applies only what passes.

**Tech Stack:** Astro 5 (static output → `dist/`), Python 3 (stdlib only, no new deps) for the audit script, Claude Code Agent tool for the Phase 2 propose/verify fan-out.

## Global Constraints

- Branch: all work lands on `internal-linking` (already created off `main`). No commit or push without explicit user go-ahead.
- Out of scope, never touch as source or target: `src/pages/shopify-app.astro`, `src/pages/shopify-store.astro`, `src/pages/shopify-services.html`, everything under `src/pages/shopify-app/`, and `src/pages/case-studies/luxury-jewellery-client.astro` + `src/pages/case-studies/us-supplements-brand.astro` (both are Shopify-vertical content despite their path — footer links to `/shopify-store`).
- `src/pages/youtube-for/shopify.astro` IS in scope (exception to the Shopify exclusion).
- Never touch `publishDate` or any frontmatter date field on any post (known 404 landmine per project `mistakes-lessons.md`).
- No em-dash, no banned phrases in any anchor text or inserted copy — grep-verify before considering any task done (project `style-guide.md`).
- Links must be inserted into existing prose/sections, never appended as a bare tacked-on list.
- Every blog and pSEO page must end Phase 2 with >=1 link to a tool page (money-page-first rule).
- No single target URL may accumulate the same exact-match anchor phrase from more than 3 source pages (anchor diversity / anti-over-optimization rule).
- Never link to a URL that is a 301/410 redirect source in `netlify.toml` — always resolve to the canonical target.
- Phase 1 and Phase 2 land as separate commits, not squashed.

---

### Task 1: Build the internal-link audit script

**Files:**
- Create: `scripts/audit_internal_links.py`
- Create: `scripts/test_audit_internal_links.py`

**Interfaces:**
- Produces: `audit(dist_root: Path) -> dict` with keys `total_pages`, `by_type_count`, `orphans`, `near_orphans`, `dead_ends`, `pages_missing_tool_link`, `pages_deeper_than_3_clicks`, `pages_unreachable_from_home` — every later task that needs ground truth calls this function (via the CLI) and reads this exact JSON shape.
- Consumes: nothing (first task).

This script crawls the site's **built HTML** (`dist/`), not source files. This matters: a prior manual audit of this codebase found that source-level grepping misses links rendered by shared components at build time (e.g. a homepage component that lists the 6 latest blog posts) and can't reliably replicate dynamic algorithms (e.g. "related posts" scoring). Crawling the actual build output sidesteps both problems — it's ground truth.

- [ ] **Step 1: Write the failing test**

Create `scripts/test_audit_internal_links.py`:

```python
import json
import tempfile
import unittest
from pathlib import Path

from audit_internal_links import audit


class TestAuditInternalLinks(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dist = Path(self.tmp.name)

        def write(rel_path, body):
            f = self.dist / rel_path
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text(f"<html><body>{body}</body></html>", encoding="utf-8")

        # Every page's <header> links to /blog/c -- this must NOT count as a
        # real inbound link (header/footer/nav are chrome, not content).
        header = '<header><a href="/blog/c">Nav</a></header>'

        write("index.html", header + '<a href="/blog/a">Read the guide</a>')
        write("blog/a/index.html", header + '<a href="/blog/b">Next post</a>')
        write("blog/b/index.html", header + '<a href="/">Home</a>')
        write("blog/c/index.html", header + '<a href="/">Home</a>')

    def tearDown(self):
        self.tmp.cleanup()

    def test_header_links_excluded_from_inbound_count(self):
        result = audit(self.dist)
        # /blog/c is linked from every page's <header>, but header links
        # don't count -- it has zero real inbound links.
        self.assertIn("/blog/c", result["orphans"])

    def test_content_links_produce_correct_inbound_counts(self):
        result = audit(self.dist)
        self.assertIn("/blog/a", result["near_orphans"])  # 1 inbound: from /
        self.assertIn("/blog/b", result["near_orphans"])  # 1 inbound: from /blog/a

    def test_no_dead_ends_when_every_page_has_content_outbound_link(self):
        result = audit(self.dist)
        self.assertEqual(result["dead_ends"], [])

    def test_click_depth_excludes_chrome_only_reachable_pages(self):
        result = audit(self.dist)
        # /blog/c is only reachable via <header> (excluded), so it must be
        # reported unreachable from home despite appearing in every page's HTML.
        self.assertIn("/blog/c", result["pages_unreachable_from_home"])

    def test_total_page_count(self):
        result = audit(self.dist)
        self.assertEqual(result["total_pages"], 4)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd scripts && python -m pytest test_audit_internal_links.py -v` (or `python -m unittest test_audit_internal_links -v` if pytest isn't installed)
Expected: FAIL / ImportError — `audit_internal_links` module does not exist yet.

- [ ] **Step 3: Write the implementation**

Create `scripts/audit_internal_links.py`:

```python
#!/usr/bin/env python3
"""Crawl the built Astro site (dist/) and report internal-link health.

Ground truth comes from the built HTML, not source files, because shared
components (e.g. a "latest posts" list, a "related posts" algorithm) render
real links at build time that a source-level grep cannot reliably see.

Usage:
    python scripts/audit_internal_links.py --dist dist --out research/aeo/internal-linking-audit.json
"""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

SKIP_TAGS = {"header", "footer", "nav", "script", "style"}

CORE_PATHS = {"/", "/about", "/pricing", "/product-pricing", "/how-it-works", "/next-steps", "/changelog"}
HUB_PATHS = {"/youtube-for", "/youtube-vs"}
EXCLUDE_PREFIXES = (
    "/shopify-app",
    "/shopify-store",
    "/shopify-services",
    "/case-studies/luxury-jewellery-client",
    "/case-studies/us-supplements-brand",
)
ASSET_EXT_RE = re.compile(r"\.(png|jpe?g|svg|webp|ico|css|js|xml|txt|pdf|json)$")


class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._skip_stack = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self._skip_stack.append(tag)
            return
        if tag == "a" and not self._skip_stack:
            href = dict(attrs).get("href")
            if href:
                self.links.append(href)

    def handle_startendtag(self, tag, attrs):
        if tag == "a" and not self._skip_stack:
            href = dict(attrs).get("href")
            if href:
                self.links.append(href)

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS and self._skip_stack and self._skip_stack[-1] == tag:
            self._skip_stack.pop()


def normalize(href):
    if href.startswith("http"):
        parts = urlsplit(href)
        if parts.netloc not in ("sellontube.com", "www.sellontube.com"):
            return None
        path = parts.path
    elif href.startswith("/"):
        path = href
    else:
        return None  # mailto:, tel:, #anchor, relative asset path, etc.
    path = path.rstrip("/") or "/"
    if any(path.startswith(p) for p in EXCLUDE_PREFIXES):
        return None
    if ASSET_EXT_RE.search(path):
        return None
    return path


def url_to_dist_file(url, dist_root: Path):
    if url == "/":
        return dist_root / "index.html"
    return dist_root / url.lstrip("/") / "index.html"


def discover_pages(dist_root: Path):
    pages = []
    for html_file in dist_root.rglob("index.html"):
        rel = html_file.relative_to(dist_root).parent
        url = "/" if str(rel) == "." else "/" + rel.as_posix()
        if any(url.startswith(p) for p in EXCLUDE_PREFIXES):
            continue
        pages.append(url)
    return sorted(set(pages))


def classify(url):
    if url in CORE_PATHS:
        return "core"
    if url in HUB_PATHS:
        return "hub"
    if url.startswith("/blog/"):
        return "blog"
    if url.startswith("/youtube-for/"):
        return "youtube-for"
    if url.startswith("/youtube-vs/"):
        return "youtube-vs"
    if url.startswith("/tools/"):
        return "tools"
    return "other"


def build_graph(dist_root: Path):
    pages = discover_pages(dist_root)
    page_set = set(pages)
    outbound = {url: set() for url in pages}
    for url in pages:
        html_path = url_to_dist_file(url, dist_root)
        if not html_path.exists():
            continue
        parser = LinkExtractor()
        parser.feed(html_path.read_text(encoding="utf-8", errors="ignore"))
        for href in parser.links:
            target = normalize(href)
            if target and target in page_set and target != url:
                outbound[url].add(target)
    inbound = {url: set() for url in pages}
    for src, targets in outbound.items():
        for t in targets:
            inbound[t].add(src)
    return pages, outbound, inbound


def click_depth(pages, outbound, root="/"):
    depth = {root: 0}
    frontier = [root]
    while frontier:
        nxt = []
        for u in frontier:
            for t in outbound.get(u, ()):
                if t not in depth:
                    depth[t] = depth[u] + 1
                    nxt.append(t)
        frontier = nxt
    for p in pages:
        depth.setdefault(p, None)
    return depth


def audit(dist_root: Path):
    pages, outbound, inbound = build_graph(dist_root)
    depth = click_depth(pages, outbound)
    tools = {p for p in pages if classify(p) == "tools"}

    orphans = sorted(p for p in pages if len(inbound[p]) == 0)
    near_orphans = sorted(p for p in pages if len(inbound[p]) == 1)
    dead_ends = sorted(p for p in pages if len(outbound[p]) == 0)
    no_tool_link = sorted(
        p for p in pages
        if classify(p) in {"blog", "youtube-for", "youtube-vs"} and not (outbound[p] & tools)
    )
    deep_pages = sorted(p for p in pages if depth.get(p) is not None and depth[p] > 3)
    unreachable = sorted(p for p in pages if depth.get(p) is None)

    by_type = {}
    for p in pages:
        by_type.setdefault(classify(p), []).append(p)

    return {
        "total_pages": len(pages),
        "by_type_count": {k: len(v) for k, v in by_type.items()},
        "orphans": orphans,
        "near_orphans": near_orphans,
        "dead_ends": dead_ends,
        "pages_missing_tool_link": no_tool_link,
        "pages_deeper_than_3_clicks": deep_pages,
        "pages_unreachable_from_home": unreachable,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", default="dist")
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    result = audit(Path(args.dist))
    text = json.dumps(result, indent=2)
    if args.out:
        Path(args.out).write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd scripts && python -m pytest test_audit_internal_links.py -v`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/audit_internal_links.py scripts/test_audit_internal_links.py
git commit -m "feat(internal-linking): add link-graph audit script"
```

---

### Task 2: Run the baseline audit against the real built site

**Files:**
- Create: `research/aeo/internal-linking-baseline-2026-07-14.json` (script output, committed as the dated baseline record for the measurement plan)

**Interfaces:**
- Consumes: `audit()` from Task 1 (`scripts/audit_internal_links.py`)
- Produces: the ground-truth JSON that Tasks 4 and 5 read to decide what still needs fixing (do not trust the illustrative numbers in the design spec — those came from an earlier source-level pass and may not match built-HTML reality, e.g. homepage components that render links dynamically).

- [ ] **Step 1: Build the site**

Run: `npm run build`
Expected: build completes, `dist/` directory populated with one `index.html` per route.

- [ ] **Step 2: Run the audit and save the baseline**

Run: `python scripts/audit_internal_links.py --dist dist --out research/aeo/internal-linking-baseline-2026-07-14.json`
Expected: JSON printed to stdout and written to the file. Confirm `total_pages` is approximately 127 (excluded Shopify-vertical pages and the two Shopify-branded case-study pages are filtered by `EXCLUDE_PREFIXES` in the script, so they should not appear).

- [ ] **Step 3: Read and record the real findings**

Open `research/aeo/internal-linking-baseline-2026-07-14.json` and note the actual `orphans`, `near_orphans`, `dead_ends`, and `pages_missing_tool_link` lists. These — not the illustrative numbers in the design spec — are what Tasks 4 and 5 act on. In particular check whether `/` (home) truly appears in `dead_ends`: the homepage renders a "latest blog posts" component at build time, which a prior source-grep pass could not see, so the real dead-end status may differ from what was estimated during design.

- [ ] **Step 4: Commit the baseline**

```bash
git add research/aeo/internal-linking-baseline-2026-07-14.json
git commit -m "docs(internal-linking): capture baseline link-graph audit"
```

---

### Task 3: Fix the youtube-vs sibling-selection template bug

**Files:**
- Modify: `src/pages/youtube-vs/[slug].astro:26-28`

**Interfaces:**
- Consumes: `Comparison` type from `src/data/comparisons.ts` (fields used: `slug`, `audience`, `publishDate`)
- Produces: a `siblings` array available to the existing "More Comparisons" render block at line ~755-770 (unchanged — only the computation of `siblings` changes, not how it's rendered)

The current code (lines 26-28) always takes `.slice(0, 4)` of the filtered comparisons array — this resolves to the same first 4 entries regardless of which page is rendering, so entries at array positions 5-21 never appear in anyone's sibling block.

- [ ] **Step 1: Replace the sibling computation**

In `src/pages/youtube-vs/[slug].astro`, replace lines 26-28:

```astro
// Sibling comparisons for cross-linking (exclude current, limit to 4)
const cutoff = import.meta.env.DEV ? new Date('2099-12-31') : new Date();
cutoff.setHours(23, 59, 59, 999);
const siblings = comparisons
  .filter((c) => c.slug !== comparison.slug && new Date(c.publishDate + 'T00:00:00+05:30') <= cutoff)
  .slice(0, 4);
```

with:

```astro
// Sibling comparisons for cross-linking (exclude current, limit to 4).
// Personalized per-page: same-audience comparisons rank first, then fill
// remaining slots by circular index-distance from the current page. This
// guarantees every published comparison appears in a different, relevant
// set of sibling blocks instead of a single hardcoded top-4 (the prior bug).
const cutoff = import.meta.env.DEV ? new Date('2099-12-31') : new Date();
cutoff.setHours(23, 59, 59, 999);
const publishedComparisons = comparisons.filter(
  (c) => new Date(c.publishDate + 'T00:00:00+05:30') <= cutoff
);
const selfIndex = publishedComparisons.findIndex((c) => c.slug === comparison.slug);
const circularDistance = (otherIndex) => {
  const raw = Math.abs(otherIndex - selfIndex);
  return Math.min(raw, publishedComparisons.length - raw);
};
const siblings = publishedComparisons
  .map((c, index) => ({ c, index }))
  .filter(({ c }) => c.slug !== comparison.slug)
  .sort((a, b) => {
    const aSameAudience = a.c.audience === comparison.audience ? 0 : 1;
    const bSameAudience = b.c.audience === comparison.audience ? 0 : 1;
    if (aSameAudience !== bSameAudience) return aSameAudience - bSameAudience;
    return circularDistance(a.index) - circularDistance(b.index);
  })
  .map(({ c }) => c)
  .slice(0, 4);
```

- [ ] **Step 2: Rebuild and re-run the audit**

Run: `npm run build && python scripts/audit_internal_links.py --dist dist --out /tmp/audit-after-task3.json`

- [ ] **Step 3: Verify the fix**

Compare `/tmp/audit-after-task3.json` against the Task 2 baseline: every `/youtube-vs/*` entry from the baseline's `orphans` and `near_orphans` lists should now have >=2 inbound links (i.e. no longer appear in either list), since the ring-style distance sort mathematically spreads sibling selection across all 21 entries rather than 4. If any `/youtube-vs/*` page still appears in `orphans` or `near_orphans`, note its slug — Task 5 handles any stragglers explicitly.

- [ ] **Step 4: Commit**

```bash
git add "src/pages/youtube-vs/[slug].astro"
git commit -m "fix(youtube-vs): compute real per-page sibling links instead of a hardcoded top-4"
```

---

### Task 4: Fix the homepage dead-end (if still real after re-verification)

**Files:**
- Modify: `src/pages/index.astro` (conditionally — see Step 1)

**Interfaces:**
- Consumes: Task 2's baseline JSON (`research/aeo/internal-linking-baseline-2026-07-14.json`) and Task 3's post-fix audit (`/tmp/audit-after-task3.json`)
- Produces: no new interfaces — this task only adds `<a href>` links inside an existing prose section.

- [ ] **Step 1: Check whether the homepage genuinely needs a fix**

Open `/tmp/audit-after-task3.json` (or re-run the audit if it wasn't saved) and check whether `/` appears in `dead_ends` or `pages_missing_tool_link`.

- **If `/` does NOT appear in `dead_ends`:** the homepage's existing dynamic "latest blog posts" component already provides real outbound content links — skip the homepage edit entirely and note in the phase-1 summary that this was already resolved once the audit correctly counted dynamic components (a prior static-grep pass had missed this).
- **If `/` DOES still appear in `dead_ends` or is missing a tool link:** apply the fix below.

Fix (only if needed): in `src/pages/index.astro`, inside the existing `<Content isReversed ...>` block (the "How We Think" section, lines 343-379), add a sentence to the `slot="content"` Fragment linking to the youtube-for hub and one tool. Change:

```astro
    <Fragment slot="content">
      <h3 class="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl mb-2">
        Built for businesses who want customers, not a YouTube 'presence'
      </h3>
      We treat your channel like an acquisition asset that should pay for itself.
    </Fragment>
```

to:

```astro
    <Fragment slot="content">
      <h3 class="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl mb-2">
        Built for businesses who want customers, not a YouTube 'presence'
      </h3>
      We treat your channel like an acquisition asset that should pay for itself. See how this plays out for <a href="/youtube-for" class="underline">specific business types</a>, or run the numbers yourself with our <a href="/tools/youtube-roi-calculator" class="underline">YouTube ROI calculator</a>.
    </Fragment>
```

- [ ] **Step 2: Rebuild and verify**

Run: `npm run build && python scripts/audit_internal_links.py --dist dist --out /tmp/audit-after-task4.json`

Confirm: if the fix was applied, `/` no longer appears in `dead_ends`. If Step 1 determined no fix was needed, confirm `/tmp/audit-after-task4.json` is identical to `/tmp/audit-after-task3.json` for this page.

- [ ] **Step 3: Commit (skip entirely if Step 1 determined no fix was needed)**

```bash
git add src/pages/index.astro
git commit -m "fix(internal-linking): resolve homepage dead-end"
```

---

### Task 5: Fix remaining Phase-1 flagged pages

**Files:**
- Modify: one section of `src/data/post/youtube-seo-guide.mdx` (around line 230, "The YouTube SEO tools worth using")
- Modify: `src/pages/about.astro` (add one contextual link to `/changelog`)
- Modify: `src/pages/pricing.astro` (add one contextual link to `/next-steps`)
- Modify: any additional page(s) identified by Step 1's fresh audit read (see below)

**Interfaces:**
- Consumes: `/tmp/audit-after-task4.json` from Task 4.

- [ ] **Step 1: Read the current flagged list**

Run: `python scripts/audit_internal_links.py --dist dist --out /tmp/audit-after-task4.json` (if not already current from Task 4)

Cross-reference against the Task 2 baseline. By this point, `/youtube-for/shopify` should no longer be a near-orphan (the youtube-for hub page, now correctly counted as an in-scope source per the design spec's scope correction, already links to it directly at `src/pages/youtube-for/index.astro:68`, in addition to the existing blog-post link). Confirm this in the fresh JSON rather than assuming it.

The known real gaps that do NOT self-heal from Tasks 3-4:

- [ ] **Step 2: Fix `/blog/youtube-seo-services` (orphan)**

In `src/data/post/youtube-seo-guide.mdx`, under the `## The YouTube SEO tools worth using` heading (around line 230), add one sentence at the end of that section's existing prose: "If you'd rather hand this off entirely, see [what YouTube SEO services typically include and cost](/blog/youtube-seo-services)." — inserted as a new sentence in the existing paragraph flow, not a new heading or bare link.

- [ ] **Step 3: Fix `/changelog` (orphan, not in main nav or footer per `src/navigation.ts`)**

In `src/pages/about.astro`, find the closing section (team/company narrative) and add one sentence linking to `/changelog`, e.g. "You can follow what we ship and improve on the [changelog](/changelog)." Read the file first to find the exact closing paragraph to extend naturally.

- [ ] **Step 4: Fix `/next-steps` (orphan, not in main nav or footer per `src/navigation.ts`)**

In `src/pages/pricing.astro`, find the FAQ or closing CTA section and add one sentence linking to `/next-steps`, e.g. "Curious what happens after you sign up? See [what the first 30 days look like](/next-steps)." Read the file first to find the exact section to extend.

- [ ] **Step 5: Handle any remaining stragglers from Step 1**

For any URL still in `orphans` or `dead_ends` after Steps 2-4 that isn't already covered, read that page's content, identify one genuinely relevant source page (grep for shared keywords the way Step 1 of Task 4 did), and add a single contextual inbound (for orphans) or outbound (for dead-ends) link in that page's existing prose. Do not add a link without reading both the source and target page content first — no link should be added purely to clear the audit.

- [ ] **Step 6: Rebuild and verify**

Run: `npm run build && python scripts/audit_internal_links.py --dist dist --out /tmp/audit-after-task5.json`

Confirm: `orphans` and `dead_ends` lists are now empty (or contain only entries with a documented reason they're intentionally excluded, e.g. a genuinely brand-new page not yet ready to link).

- [ ] **Step 7: Style-guide check**

Run: `grep -rn "—" src/pages/about.astro src/pages/pricing.astro src/data/post/youtube-seo-guide.mdx`
Expected: no matches (no em-dashes introduced).

- [ ] **Step 8: Commit**

```bash
git add src/data/post/youtube-seo-guide.mdx src/pages/about.astro src/pages/pricing.astro
git commit -m "fix(internal-linking): resolve remaining phase-1 orphans and dead ends"
```
(Add any additional files touched in Step 5.)

---

### Task 6: Phase 2 — broad contextual pass across all 127 pages

**Files:**
- Modify: up to all 127 in-scope pages (`src/data/post/*.md(x)`, `src/data/niches.ts` prose fields are NOT content-linkable per the design spec's finding — links go in the `.astro` templates or in blog MDX bodies only)
- Create: `research/aeo/internal-linking-phase2-report.md` (summary of what was added, for the living map update in Task 7)

**Interfaces:**
- Consumes: `docs/templates/internal-linking-map.md`, `docs/strategy/growth-strategy.md`, `src/data/topics.ts`, `src/data/niches.ts`, `src/data/comparisons.ts`, `research/keywords/sot_master.csv` (columns: `tier`, `priority_score`, `target_slug`), `netlify.toml` (redirect sources to avoid).
- Produces: edited content files with new `<a href>` / markdown links; `research/aeo/internal-linking-phase2-report.md` listing every link added (source, target, anchor) for Task 7 to fold into the living map.

This task is executed as 5 independent batches. Each batch follows the same two-stage pattern: propose, then verify. Only verified links get applied.

- [ ] **Step 1: Propose links for the Blog batch (52 posts)**

Dispatch an agent (general-purpose) with this exact prompt:

```
Read every published post in src/data/post/ (skip any with `draft: true` in frontmatter) at
c:\Users\D E L L\Downloads\Claude Coded\SellonTube. For each post, propose 2-4 contextual
internal links to add to its body, following these rules:

1. Every post must end up linking to at least 1 page under /tools/ (read src/pages/tools/*.astro
   filenames for the full list of 14 tool slugs).
2. Prefer linking to targets whose keyword is tier=winnable in research/keywords/sot_master.csv
   (columns: target_slug, tier, priority_score) over tier=stretch or tier=avoid. Never link to
   an avoid-tier target.
3. Check docs/templates/internal-linking-map.md first -- don't propose a link that's already there.
4. Check netlify.toml -- never propose a link to a path that appears as a redirect `from` value;
   resolve to its `to` target instead.
5. Read docs/strategy/growth-strategy.md and src/data/topics.ts for topical clusters to judge relevance.
6. For each proposed link, specify: source file, exact target URL, anchor text (natural language,
   no em-dash, not identical to an anchor already used for that target elsewhere -- vary phrasing),
   and the exact existing sentence/section it should be inserted into (quote a few words of
   surrounding existing text so the insertion point is unambiguous).

Do not edit any files. Return a JSON array, one object per post:
{ "source": "<file path>", "links": [ { "target": "<url>", "anchor": "<text>", "insert_after": "<quoted existing text>" } ] }
```

Use the `schema` option so the agent returns structured JSON matching that shape.

- [ ] **Step 2: Propose links for the youtube-for batch (31 pages)**

Same pattern as Step 1, scoped to `src/data/niches.ts` entries + `src/pages/youtube-for/shopify.astro` + `src/pages/youtube-for/index.astro`. Since `niches.ts` prose fields cannot hold real links (per the design spec's finding that pSEO links are template-driven), this batch's agent must propose edits to `src/pages/youtube-for/[slug].astro` template logic (e.g. an additional "related blog posts" or "related tools" block driven by a new optional field on the `Niche` interface) OR propose per-entry `relatedLinks`-style additions if such a field is added. State explicitly in the prompt: read `src/pages/youtube-vs/[slug].astro`'s existing `relatedLinks` field usage (lines ~703-712) as the pattern to replicate for `niches.ts`.

- [ ] **Step 3: Propose links for the youtube-vs batch (21 pages)**

Same pattern, scoped to `src/data/comparisons.ts` entries. These already support a `relatedLinks?: { text: string; href: string }[]` field (only 3 of 21 populated) — the propose agent should populate this field for the other 18 entries rather than editing the template.

- [ ] **Step 4: Propose links for the Tools batch (14 pages)**

Same pattern, scoped to `src/pages/tools/*.astro`. Tools should preferentially link to blog posts and youtube-for/youtube-vs pages that would plausibly send them relevant traffic (inbound equity flows both ways — a tool linking out to a relevant guide is itself a legitimate UX pattern, e.g. "read the full guide" links).

- [ ] **Step 5: Propose links for the Hub pages batch (2 pages)**

Same pattern, scoped to `src/pages/youtube-for/index.astro` and `src/pages/youtube-vs/index.astro`.

- [ ] **Step 6: Verify every batch's proposals**

For each batch's JSON output from Steps 1-5, dispatch a separate verify agent with this exact prompt template (substitute `<PROPOSALS_JSON>` with that batch's actual output):

```
You are verifying proposed internal links for c:\Users\D E L L\Downloads\Claude Coded\SellonTube.
Here are the proposals: <PROPOSALS_JSON>

For each proposed link, check and report valid=true/false with a reason:
1. Does the target URL actually exist as a real page in this repo? (check src/pages/ and
   src/data/post/ for the corresponding route)
2. Is the target NOT a 301/410 redirect source in netlify.toml?
3. Does the anchor text contain no em-dash and no phrase from docs/blog/style-guide.md's
   banned-phrases list?
4. Is this exact anchor text already used for this same target on 3 or more other source pages
   (check docs/templates/internal-linking-map.md)? If so, valid=false, reason="anchor overused".
5. Does the quoted "insert_after" text actually appear verbatim in the source file?

Return a JSON array of { "source": ..., "target": ..., "valid": bool, "reason": "..." } --
one entry per proposed link, not per file.
```

- [ ] **Step 7: Apply only verified links**

For every proposal with `valid: true`, use the Edit tool to insert the link at the specified location in the specified source file. Do not apply anything with `valid: false`. Keep a running list of every applied link (source, target, anchor) — this becomes `research/aeo/internal-linking-phase2-report.md`.

- [ ] **Step 8: Style-guide sweep**

Run: `grep -rn "—" src/data/post/*.md src/data/post/*.mdx src/pages/tools/*.astro src/pages/youtube-for/*.astro src/pages/youtube-vs/*.astro`
Expected: no matches among files touched in this task. Fix any that appear before proceeding.

- [ ] **Step 9: Rebuild and audit**

Run: `npm run build && python scripts/audit_internal_links.py --dist dist --out /tmp/audit-after-phase2.json`

Confirm: `orphans` and `dead_ends` are empty; `pages_missing_tool_link` is empty; `pages_deeper_than_3_clicks` is materially smaller than the Task 2 baseline.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(internal-linking): add phase-2 contextual links across blog, pSEO, tools, and case studies"
```
(Review `git status` first to confirm only intended content files are staged — no unrelated untracked files from elsewhere in the repo.)

---

### Task 7: Final audit, living-map update, and baseline capture for measurement

**Files:**
- Modify: `docs/templates/internal-linking-map.md`
- Create: `research/aeo/internal-linking-final-audit-2026-07-14.json`

**Interfaces:**
- Consumes: `/tmp/audit-after-phase2.json` and `research/aeo/internal-linking-phase2-report.md` from Task 6.

- [ ] **Step 1: Save the final audit as a permanent record**

Run: `python scripts/audit_internal_links.py --dist dist --out research/aeo/internal-linking-final-audit-2026-07-14.json`

- [ ] **Step 2: Update the living internal-linking map**

Open `docs/templates/internal-linking-map.md` and add every link recorded in `research/aeo/internal-linking-phase2-report.md` (plus everything added in Tasks 3-5) to the appropriate table (`Blog → Tool`, `Blog → pSEO`, `Blog → Blog`, or a new `pSEO → pSEO` / `pSEO → Tool` table if the existing tables don't cover the pattern). Remove or update the "Unlinked Opportunities" section entries that are now resolved.

- [ ] **Step 3: Write the before/after summary**

At the top of `research/aeo/internal-linking-phase2-report.md`, add a short summary table comparing `research/aeo/internal-linking-baseline-2026-07-14.json` to `research/aeo/internal-linking-final-audit-2026-07-14.json`: total orphans, near-orphans, dead-ends, pages missing a tool link, pages deeper than 3 clicks — before vs. after.

- [ ] **Step 4: Commit**

```bash
git add docs/templates/internal-linking-map.md research/aeo/internal-linking-final-audit-2026-07-14.json research/aeo/internal-linking-phase2-report.md
git commit -m "docs(internal-linking): update living map and record final audit"
```

- [ ] **Step 5: Set the measurement reminder**

Per the design spec's measurement plan: this project needs a GSC re-pull ~4-6 weeks after merge (around 2026-08-18 to 2026-08-25), comparing impressions/clicks/position for the pages that were orphans/near-orphans/dead-ends in the Task 2 baseline. Note this explicitly to the user at handoff so it doesn't join the list of "OPEN: measure lift" items that never get closed.
