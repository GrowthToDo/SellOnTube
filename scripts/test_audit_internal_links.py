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

        # Footer and nav chrome links must also be excluded from inbound counts.
        footer = '<footer><a href="/blog/b">Footer</a></footer>'
        nav = '<nav><a href="/blog/a">Nav link</a></nav>'

        write("index.html", header + nav + '<a href="/blog/a">Read the guide</a>')
        write("blog/a/index.html", header + '<a href="/blog/b">Next post</a><a href="/blog/f">Learn more</a>' + '<footer><a href="/blog/g">See also</a></footer>')
        write("blog/b/index.html", header + '<a href="/">Home</a>')
        write("blog/c/index.html", header + '<a href="/">Home</a>')
        # Dead-end fixture: only chrome links, no content outbound link
        write("blog/d/index.html", header + footer + nav)
        # Fixture with query string and fragment in links (should match normalized pages)
        write("blog/e/index.html", header + '<a href="/blog/a?utm_source=blog">Link with query</a><a href="/blog/b#section">Link with fragment</a>')
        # Near-orphan fixture: content link from /blog/a only (exactly 1 inbound)
        write("blog/f/index.html", header + '<a href="/">Home</a>')
        # Orphan fixture: linked only via footer (footer/nav exclusion must work)
        write("blog/g/index.html", header + '<a href="/">Home</a>')

    def tearDown(self):
        self.tmp.cleanup()

    def test_header_links_excluded_from_inbound_count(self):
        result = audit(self.dist)
        # /blog/c is linked from every page's <header>, but header links
        # don't count -- it has zero real inbound links.
        self.assertIn("/blog/c", result["orphans"])

    def test_content_links_produce_correct_inbound_counts(self):
        result = audit(self.dist)
        # /blog/a has 2 real inbound: from / (content) and /blog/e (content with query)
        # /blog/b has 2 real inbound: from /blog/a (content) and /blog/e (content with fragment)
        # These are correctly counted despite chrome links (nav/footer) pointing to them
        self.assertNotIn("/blog/a", result["orphans"])  # Has real inbound links
        self.assertNotIn("/blog/b", result["orphans"])  # Has real inbound links
        self.assertIn("/blog/c", result["orphans"])  # Only has chrome link (header)
        self.assertIn("/blog/d", result["orphans"])  # Only has chrome links (header/footer/nav)

    def test_no_dead_ends_when_every_page_has_content_outbound_link(self):
        result = audit(self.dist)
        # Pages with content links should not be dead-ends, but /blog/d is
        self.assertNotIn("/blog/a", result["dead_ends"])
        self.assertNotIn("/blog/b", result["dead_ends"])
        self.assertNotIn("/blog/e", result["dead_ends"])

    def test_dead_end_detection_with_chrome_only_page(self):
        result = audit(self.dist)
        # /blog/d has only chrome links (header/footer/nav), no content outbound link
        self.assertIn("/blog/d", result["dead_ends"])

    def test_footer_nav_links_excluded_from_inbound_count(self):
        result = audit(self.dist)
        # /blog/g is linked ONLY from /blog/a's <footer> element.
        # If footer exclusion works, /blog/g should be an orphan (0 real inbound).
        # If footer exclusion is broken, /blog/g would have 1 inbound and not be an orphan.
        self.assertIn("/blog/g", result["orphans"],
                     msg="/blog/g should be an orphan (linked only via footer)")
        # Also verify /blog/g is not in near_orphans (no real inbound, not 1 inbound)
        self.assertNotIn("/blog/g", result["near_orphans"])

    def test_click_depth_excludes_chrome_only_reachable_pages(self):
        result = audit(self.dist)
        # /blog/c is only reachable via <header> (excluded), so it must be
        # reported unreachable from home despite appearing in every page's HTML.
        self.assertIn("/blog/c", result["pages_unreachable_from_home"])

    def test_query_strings_and_fragments_normalized_in_links(self):
        result = audit(self.dist)
        # /blog/e has links with ?utm_source=blog and #section that point to
        # /blog/a and /blog/b. These should be normalized to /blog/a and /blog/b
        # and counted as real inbound links.
        # /blog/a should have inbound from /index.html (1) + /blog/e (1) = 2
        # /blog/b should have inbound from /blog/a (1) + /blog/e (1) = 2
        self.assertNotIn("/blog/a", result["near_orphans"],
                        msg="/blog/a has 2 inbound links (not 1), so not a near-orphan")
        self.assertNotIn("/blog/b", result["near_orphans"],
                        msg="/blog/b has 2 inbound links (not 1), so not a near-orphan")
        # Verify /blog/e itself has outbound to /blog/a and /blog/b
        # by checking it's not in dead_ends (has 2 outbound content links)
        self.assertNotIn("/blog/e", result["dead_ends"],
                        msg="/blog/e should have outbound links (even with query/fragment)")

    def test_near_orphans_detection(self):
        result = audit(self.dist)
        # /blog/f is linked from /blog/a content link only, so it has exactly 1 inbound.
        # This makes it a genuine near-orphan that must appear in result["near_orphans"].
        self.assertIn("/blog/f", result["near_orphans"],
                     msg="/blog/f should be in near_orphans (exactly 1 inbound link)")
        # Verify /blog/f is NOT in orphans (it has an inbound link)
        self.assertNotIn("/blog/f", result["orphans"])

    def test_total_page_count(self):
        result = audit(self.dist)
        # Now we have 8 pages: /, /blog/a, /blog/b, /blog/c, /blog/d, /blog/e, /blog/f, /blog/g
        self.assertEqual(result["total_pages"], 8)


if __name__ == "__main__":
    unittest.main()
