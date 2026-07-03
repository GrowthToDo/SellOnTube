# Blog Strategy Lessons

Internal reference. 10 rules from the May 27, 2026 blog strategy session.

---

## 1. Always verify blog post status before recommending topics.

We recommended "YouTube Shorts for Business" and "YouTube for Small Business" as new post topics, only to discover both already existed. Worse, "YouTube for Small Business" existed as a draft (`draft: true`) that was deliberately dropped from the publishing calendar.

Before recommending any topic, check:
- (a) Does a file already exist in `src/data/post/`?
- (b) Is it published, scheduled, or draft?
- (c) Is it in the Killed/Dropped list in `research/publishing_calendar.md`?

## 2. Check the SERP for defeatable competitors before committing to a topic.

We almost committed to "youtube video upload settings checklist" until we checked the SERP and found TubeBuddy dominating with 2 positions.

Always search the target query and assess: are the top 10 results from big-authority sites or small defeatable ones? If 3+ positions are held by major players (HubSpot, Semrush, Zapier, TubeBuddy, vidIQ), the keyword is not truly winnable regardless of what the KD score says.

## 3. "AI tools for YouTube" is a creator topic, not B2B.

The query "ai tools for youtube" is 95%+ creator intent. Reddit and forums show zero discussion from business owners about AI tools for their YouTube channels. The SERP is entirely creator-focused listicles.

Do not force a B2B angle onto creator-intent queries. The existing draft had 4 of 9 tools as SellonTube's own products (44%), making it read as self-promotion, and it would have cannibalized two published posts (`best-youtube-seo-tools-for-business` and `youtube-marketing-tools`).

## 4. AI Overviews make CTR optimization on informational queries pointless.

5 blog posts ranking on Google page 1 (positions 6.6 to 10.1) had ZERO clicks across 1,988 combined impressions. The likely cause: AI Overviews answering informational queries directly.

CTR optimization (title/meta rewrites) only works on commercial-intent queries where users need to click through to evaluate options. For informational queries, the strategy is: add citation-bait (specific data points, named frameworks, numbered steps) so Google's AI Overview cites your brand.

## 5. Tool-intent queries are AIO-resistant.

Tool pages get clicks because users need to interact with the tool. Blog posts about informational topics get eaten by AI Overviews.

The YouTube autocomplete tool (4 clicks, 0.92% CTR at position 9.6) and channel audit tool (3 clicks, 1.82% CTR at position 38.7) outperform blog posts ranking higher. Prioritize tool page improvement over blog content for click-dependent strategies.

## 6. Cross-reference GSC data with sot_master AND existing content before ANY recommendation.

The workflow must be:
1. Pull GSC queries in striking distance.
2. Cross-reference against `sot_master.csv` for volume and KD.
3. Check if a dedicated post already exists (including drafts).
4. Check the publishing calendar Killed/Dropped list.
5. SERP-check for defeatable competitors.
6. Check for AIO impact on the query.

Skipping any step leads to wasted recommendations.

## 7. US market visibility is the priority.

US generates 69% of all impressions but only 0.02% CTR with average position 44. Almost all clicks come from South Asia (India 40.6%, Pakistan 18.8%). The ICP is US/UK B2B founders. All SEO efforts should prioritize improving US rankings.

## 8. Content refresh > new post when existing assets have untapped potential.

`create-youtube-channel-for-business` targets a 6,600 volume keyword at position 25.9. Refreshing it (adding depth, fixing production standards) has more upside than any new post. A refreshed post keeps its existing link equity and indexing history. A new post starts from zero.

## 9. 56% of blog posts have zero Google impressions.

31 of 55 published posts are invisible to Google. Some are new (under 14 days), but 4 have been live 29 to 153 days with zero impressions. These need GSC URL Inspection submission. Publishing more content while half the existing library is invisible is wasteful.

## 10. Never commit to a topic without answering: "Does this serve our ICP?"

SellonTube's ICP is B2B founders, SaaS operators, and service businesses evaluating YouTube for customer acquisition. Every topic must pass this filter.

"YouTube video upload settings checklist" failed (creator content). "AI tools for YouTube" failed (creator audience). Topics must attract people who might become SellonTube customers, not YouTube creators who never will.
