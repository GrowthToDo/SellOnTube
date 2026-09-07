# Content Audit Playbook

**Created:** 2026-04-22
**Based on:** Blog Impressions Audit of 6 posts (audit-findings-2026-04-22.md)

Run this playbook when blog posts underperform on GSC impressions after 30+ days indexed.

---

## When to Run

- Any blog post with fewer than 50 impressions after 30 days indexed
- Any post with 100+ impressions but 0 clicks (title/meta problem)
- Quarterly review of bottom 20% of posts by impressions
- Before publishing a new post in a topic area that already has coverage

## Step 1: Pull Live Data

Query GSC API for 90-day impressions, clicks, CTR, and average position. Never use stale CSV exports.

```
py scripts/gsc_query.py --page=/blog/[slug] --days=90
```

Record: impressions, clicks, CTR, avg position, top queries.

## Step 2: Diagnose the Problem

Run through this decision tree for each post:

| Signal | Diagnosis | Action |
|--------|-----------|--------|
| 0 impressions, 30+ days old | Not indexed or no keyword match | Check indexing first, then keyword alignment |
| < 50 impressions, position > 20 | Wrong keyword or too competitive | Retarget to a winnable keyword |
| < 50 impressions, position < 20 | Right keyword, thin content | Expand content depth |
| 50+ impressions, 0 clicks | Indexed but title/meta not compelling | Rewrite title and meta description |
| 50+ impressions, CTR < 1% | Ranking but losing clicks to competitors | SERP analysis, title rewrite, add structured data |
| Cannibalized by another page | Multiple pages competing for same query | Kill weaker page (301), consolidate into stronger |

## Step 3: Cannibalization Check

Before any edit, search `site:sellontube.com [target keyword]` in Google. If multiple pages appear:

1. Identify which page has more impressions, better position, and more internal links
2. The weaker page gets one of: kill (301 redirect), retarget to different keyword, or merge into stronger page
3. Never have two pages targeting the same primary keyword

Cross-check with sot_master.csv `target_slug` column to ensure no keyword ownership conflicts.

## Step 4: Keyword Selection for Retargeting

When retargeting a post to a new keyword:

1. Check sot_master.csv for `tier = winnable` keywords not already assigned to another post
2. Verify the keyword has real search volume (DataForSEO `search_volume_live`, not GKP estimates)
3. SERP-check the keyword: are the top 5 results DR > 60? If yes, skip it
4. Confirm no other SellonTube page already targets this keyword
5. Pick the keyword with the best intersection of: volume, low KD, and natural fit for existing content

## Step 5: Content Rewrite Checklist

For every post being edited:

- [ ] Title contains primary keyword in first 40 characters
- [ ] Meta description contains primary keyword, is 120-155 characters, has a specific claim
- [ ] H1 matches title tag
- [ ] H2s use keyword variations naturally (not stuffed)
- [ ] Intro paragraph contains primary keyword in first 100 words
- [ ] Word count meets content-depth-framework.md target for the page type
- [ ] At least one table, one callout box, and one comparison or data point
- [ ] Key takeaways box near the top
- [ ] Table of contents with anchor links (for posts 1,500+ words)
- [ ] 3+ internal links to relevant pages (tools, other blog posts, pSEO pages)
- [ ] FAQ section with 3-5 questions (matching frontmatter faqs array)
- [ ] CTA linking to relevant tool or booking page
- [ ] No em dashes (grep after every edit)
- [ ] No banned words (leverage, utilize, delve, landscape, moreover, furthermore)
- [ ] No exclamation marks in prose
- [ ] No duplicate template sections (author bio, more guides, sources with < 3 citations)
- [ ] All sentences under 25 words
- [ ] Astro build: 0 errors, 0 warnings

## Step 6: Internal Link Cleanup

After killing or retargeting a post:

1. Grep the entire `src/data/post/` directory for the old slug
2. Update every internal link pointing to the old URL
3. If the post was killed, update links to point to the redirect target
4. If the post was retitled, update anchor text in linking posts to match new title
5. Check `src/pages/` for any hardcoded links

## Step 7: Verify and Ship

1. Run `npx astro check` to confirm 0 errors
2. Run em-dash grep: `grep -r "—" src/data/post/[files]`
3. Run banned word grep: `grep -riE "\b(leverage|utilize|delve|landscape|moreover|furthermore)\b" src/data/post/[files]`
4. If a post was killed, verify the 301 redirect is in netlify.toml (both `/blog/` and bare paths)
5. Confirm draft: true is set on killed posts

## Step 8: Post-Deploy

After changes are live:

1. Submit each modified URL to GSC URL Inspection for re-crawl
2. Log the audit in growth-strategy.md (Blog Content Audit section)
3. Set calendar reminder to re-check GSC data at 30 days and 90 days
4. Compare new impressions against projections in the audit findings doc

## Kill Decision Framework

A post should be killed (301 redirected) when ALL of these are true:

1. No viable winnable keyword exists that is not already owned by another page
2. Every section is covered more deeply by other posts on the site
3. The post cannibalizes 3+ other pages
4. Retargeting would create a fundamentally different post (better to write fresh)

Redirect target: the strongest page covering the same topic area (highest impressions, best position).

## Lessons from the 2026-04-22 Audit

1. Posts written before the keyword strategy existed tend to target non-existent or unwinnable keywords. These are the top candidates for retargeting.
2. Thin posts (under 1,200 words) with no tables, data, or diagrams rarely generate impressions regardless of keyword quality.
3. Cannibalization between blog posts and pSEO pages is manageable through differentiation (deep guide vs quick comparison) and cross-linking.
4. Retargeting works best when the new keyword is a natural fit for the existing content structure, requiring expansion rather than total rewrite.
5. Parallel sub-agent execution cuts audit time from hours to under 30 minutes for the rewrite phase.
