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
