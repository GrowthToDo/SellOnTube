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
    "/changelog",
    "/decapcms",
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
        # Parse with urlsplit to strip query strings and fragments consistently
        parts = urlsplit(href)
        path = parts.path
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
