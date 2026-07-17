# Internal Linking Phase 2 Report

Generated from the ACTUAL final file state (post anchor-diversity fix), not the pre-fix propose/apply snapshots.

## Summary

- 296 links proposed across 8 batches (blog x4, youtube-for, youtube-vs, hub, tools).
- 293/296 passed deterministic verification; 3 dropped for unverifiable insertion-point quotes.
- Anchor-diversity: a cross-batch aggregation pass (checked only against the sparse internal-linking-map.md) fixed 18 violations before apply. A post-commit review found this missed cross-referencing the live site corpus; a follow-up full-corpus scan found 47 occurrences (29 groups) still causing >3-source duplication, all rewritten to distinct anchors. A second review round found 1 further missed occurrence (niches.ts:financial-advisors) plus 13 prose rewrites that read as grammatically broken ("the the...", "our our...") from not checking the word preceding the inserted link -- both classes of defect are now fixed.
- Final: 0 in-scope orphans, 0 dead-ends, 0 pages missing a tool link, click-depth->3 pages reduced 129 to 92.

## Links added by batch (current, post-fix state)

### Blog posts

| Source | Target | Anchor |
|---|---|---|
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/youtube-marketing-tools` | YouTube marketing tools |
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/youtube-seo-guide` | YouTube SEO: Rank Business Videos on Page 1 (2026) |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-video-keyword-finder` | Video Keyword Finder |
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/best-youtube-seo-tools-for-business` | Best YouTube SEO Tools for Business (2026) |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-script-generator` | SellonTube Script Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-title-generator` | SellonTube Title Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-description-generator` | SellonTube Description Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/best-youtube-seo-tools-for-business` | best YouTube SEO tools for business |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-script-generator` | SellonTube Script Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-title-generator` | SellonTube Title Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-description-generator` | SellonTube Description Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/best-youtube-transcript-generators` | best YouTube transcript generators |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-transcript-generator` | try our free YouTube transcript generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/is-vidiq-worth-it-for-business` | vidIQ |
| `src/data/post/ai-tools-for-youtube.mdx` | `/blog/is-vidiq-worth-it-for-business` | is vidIQ worth it for business |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-script-generator` | SellonTube Script Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-title-generator` | SellonTube Title Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-description-generator` | SellonTube Description Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-transcript-generator` | SellonTube Transcript Generator |
| `src/data/post/ai-tools-for-youtube.mdx` | `/tools/youtube-script-generator` | YouTube Script Generator |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/tools/youtube-transcript-generator` | Generate a transcript from any YouTube video |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/blog/youtube-b2b-buyer-journey-data` | 82% purchased from vendors already on their shortlist |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/blog/youtube-marketing-b2b` | YouTube Marketing for B2B: Generate Leads |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/tools/youtube-roi-calculator` | ROI Calculator |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/tools/youtube-script-generator` | script-drafting tool |
| `src/data/post/b2b-video-marketing-strategy.mdx` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI for Your Business |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-tag-generator` | tag generator tool |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-video-ideas-evaluator` | YouTube Video Ideas Evaluator |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-autocomplete-keywords` | autocomplete keyword tool |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/how-to-find-youtube-autocomplete-keywords` | how to find YouTube autocomplete keywords |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-video-keyword-finder` | keyword finder tool |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/youtube-keyword-research` | YouTube keyword research guide |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI guide |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/best-youtube-seo-tools-for-business` | Best YouTube SEO Tools for Business Owners |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-autocomplete-keywords` | SellonTube YouTube Autocomplete Keyword Tool |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/how-to-find-youtube-video-ranking-keywords` | checking what keywords your videos already rank for |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-autocomplete-keywords` | SellonTube YouTube Autocomplete Keyword Tool |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/how-to-find-youtube-autocomplete-keywords` | how to find YouTube autocomplete keywords |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy for B2B |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/best-youtube-rank-checker-tools-for-business` | best YouTube rank checker tools for business |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/blog/best-youtube-video-ideas-generators-for-businesses` | best YouTube video ideas generators for businesses |
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` | `/tools/youtube-autocomplete-keywords` | SellonTube YouTube Autocomplete Keyword Tool |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/blog/youtube-keyword-research` | YouTube keyword research process |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/tools/youtube-ranking-checker` | sellontube.com/tools/youtube-ranking-checker |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/blog/best-youtube-seo-tools-for-business` | 7 Best YouTube SEO Tools for Business Channels |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/blog/how-to-check-youtube-rankings` | How to check your YouTube rankings |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/blog/how-to-find-youtube-video-ranking-keywords` | Find the keywords your videos already rank for |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/tools/youtube-ranking-checker` | SellonTube Ranking Checker |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/tools/youtube-video-keyword-finder` | Our video keyword finder tool |
| `src/data/post/best-youtube-rank-checker-tools-for-business.md` | `/tools/youtube-ranking-checker` | SellonTube |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/youtube-lead-generation` | how to turn SEO wins into booked calls |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/youtube-seo-guide` | The complete guide to YouTube SEO for business channels |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-tag-generator` | tag generator |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-description-generator` | description generator |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B: how to turn your channel into a lead source |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/is-vidiq-worth-it-for-business` | Is vidIQ Worth It? Only If You Want Views, Not Leads |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/search-intent-youtube-seo-power` | How search intent shapes your YouTube SEO strategy |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-competitor-analysis` | YouTube competition checker |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/how-to-find-youtube-video-ranking-keywords` | how to see which keywords your videos are already winning |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/youtube-keyword-research` | YouTube keyword research process |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-description-generator` | YouTube description generator |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/tools/youtube-video-ideas-generator` | YouTube video ideas generator |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/create-youtube-channel-for-business` | how to create a YouTube channel for your business |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/best-youtube-rank-checker-tools-for-business` | YouTube rank checker |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/best-youtube-video-ideas-generators-for-businesses` | best YouTube video ideas generators for businesses |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/best-youtube-transcript-generators` | best YouTube transcript generators |
| `src/data/post/best-youtube-seo-tools-for-business.md` | `/blog/best-youtube-rank-checker-tools-for-business` | best YouTube rank checker tools for business |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/blog/ai-tools-for-youtube` | AI tools for YouTube |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/tools/youtube-seo-tool` | YouTube SEO analysis |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/tools/youtube-script-generator` | video scripts |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/tools/youtube-video-keyword-finder` | keyword finder tool |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/blog/youtube-seo-guide` | YouTube SEO guide for business channels |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/blog/best-youtube-seo-tools-for-business` | the best YouTube SEO tools for business |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/blog/best-youtube-video-ideas-generators-for-businesses` | the best YouTube video ideas generators for businesses |
| `src/data/post/best-youtube-transcript-generators.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | the best YouTube autocomplete keyword tools |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/create-youtube-channel-for-business` | how to create a YouTube channel for your business |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/tools/youtube-video-ideas-evaluator` | idea validation tool |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/youtube-lead-generation` | convert those ideas into booked calls, not just views |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI analysis |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/youtube-marketing-strategy` | Build a YouTube marketing strategy that drives leads, not just views |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/create-youtube-channel-for-business` | Step-by-step: create a YouTube channel for your business |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/best-youtube-seo-tools-for-business` | best YouTube SEO tools for business |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/blog/best-youtube-transcript-generators` | best YouTube transcript generators |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/tools/youtube-script-generator` | script generator |
| `src/data/post/best-youtube-video-ideas-generators-for-businesses.md` | `/youtube-video-ideas/business-youtube-video-ideas` | YouTube video ideas for business owners |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/blog/how-to-find-youtube-autocomplete-keywords` | find the keywords behind those 48 assets |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/blog/youtube-lead-generation` | turn that library into booked calls |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/blog/youtube-vs-blog-shopify-app-case-study` | 12-month experiment with a Shopify app |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI breakdown |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/youtube-for` | SaaS companies, agencies, consultants, coaches, and 25+ other business types |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/blog/create-youtube-channel-for-business` | Create a YouTube channel for your business |
| `src/data/post/compounding-effect-four-videos-a-month.md` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-marketing-b2b` | B2B YouTube lead generation strategy |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy for business |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-keyword-research` | YouTube keyword research process |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-script-writing-guide` | how to write YouTube scripts that convert |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-shorts-for-business` | YouTube Shorts for business |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/tools/youtube-title-generator` | SellonTube's Title Generator |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/tools/youtube-description-generator` | description generator |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/tools/youtube-tag-generator` | tag generator |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/tools/youtube-channel-audit` | YouTube channel audit tool |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube channel optimization checklist |
| `src/data/post/create-youtube-channel-for-business.mdx` | `/blog/youtube-marketing-roi` | YouTube marketing ROI benchmarks by business type |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/blog/youtube-keyword-research` | full keyword research guide |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/tools/youtube-autocomplete-keywords` | use our free YouTube autocomplete tool |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/tools/youtube-competitor-analysis` | competitor gap analysis tool |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/blog/youtube-marketing-roi` | YouTube marketing ROI analysis |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/blog/youtube-script-writing-guide` | YouTube scriptwriting framework |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy guide |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/blog/create-youtube-channel-for-business` | how to create a YouTube channel for your business |
| `src/data/post/high-intent-topic-research-framework.mdx` | `/tools/youtube-video-ideas-generator` | SellonTube YouTube video ideas generator |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/blog/youtube-seo-for-business` | YouTube SEO for Business: The Complete Guide |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/blog/search-intent-youtube-seo-power` | YouTube search intent |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/blog/youtube-keyword-research` | YouTube keyword research |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/tools/youtube-ranking-checker` | SellonTube's YouTube Ranking Checker |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/blog/is-vidiq-worth-it-for-business` | is vidIQ worth it for a business channel |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/blog/best-youtube-rank-checker-tools-for-business` | 10 Best YouTube Rank Checker Tools for Business Channels |
| `src/data/post/how-to-check-youtube-rankings.mdx` | `/tools/youtube-ranking-checker` | SellonTube's YouTube Ranking Checker |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/best-youtube-autocomplete-keyword-tools` | 10+ Best YouTube Autocomplete Keyword Tools (Free & Paid) |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/youtube-keyword-research` | our full keyword research framework |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/youtube-seo-guide` | YouTube SEO Guide: The Complete Framework |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/how-to-find-youtube-video-ranking-keywords` | how to find what keywords your videos already rank for |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/youtube-seo-guide` | YouTube SEO Guide |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/how-to-find-youtube-autocomplete-keywords.md` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/blog/best-youtube-seo-tools-for-business` | 7 Best Tools for YouTube SEO on Business Channels |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/blog/best-youtube-rank-checker-tools-for-business` | 10 best YouTube rank checker tools |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/blog/how-to-check-youtube-rankings` | How to check your YouTube rankings |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/tools/youtube-video-keyword-finder` | the free video keyword finder |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/blog/how-to-find-youtube-autocomplete-keywords` | our autocomplete keyword guide |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/blog/youtube-keyword-research` | how to research those keywords in the first place |
| `src/data/post/how-to-find-youtube-video-ranking-keywords.md` | `/tools/youtube-ranking-checker` | SellonTube YouTube Ranking Checker |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/blog/youtube-marketing-tools` | YouTube Marketing Tools: The Complete B2B Stack (2026) |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-script-generator` | buyer-intent script generator |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-title-generator` | title-scoring tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-autocomplete-keywords` | Autocomplete Keywords tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-competitor-analysis` | Competitor Analysis tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-video-keyword-finder` | Video Keyword Finder |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-tag-generator` | Tag Generator |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-channel-audit` | Channel Audit |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-autocomplete-keywords` | Autocomplete Keywords tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-competitor-analysis` | Competitor Analysis tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/blog/best-youtube-seo-tools-for-business` | Best YouTube SEO Tools for Businesses (2026) |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/` | 15 free tools |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/blog/youtube-marketing-tools` | YouTube marketing tools comparison |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-seo-tool` | buyer-intent SEO scorer |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-video-keyword-finder` | keyword finder |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-competitor-analysis` | competitor analysis |
| `src/data/post/is-vidiq-worth-it-for-business.mdx` | `/tools/youtube-tag-generator` | tag generator |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/youtube-vs-blog-shopify-app-case-study` | real 12-month controlled experiment |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/youtube-vs-blog-shopify-app-case-study` | full case study with monthly breakdowns |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/youtube-b2b-buyer-journey-data` | B2B buyer journey data |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/tools/youtube-seo-tool` | YouTube SEO analysis |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI calculator |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/tools/youtube-video-ideas-generator` | Generate video ideas |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/youtube-vs/blogging` | YouTube vs Blogging comparison |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/youtube-competitor-analysis` | analyzing your YouTube competitors |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/how-to-check-youtube-rankings` | our ranking-check guide |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/tools/youtube-ranking-checker` | Check where your videos rank today |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/blog/youtube-shorts-for-business` | when YouTube Shorts make sense for B2B |
| `src/data/post/search-intent-youtube-seo-power.mdx` | `/youtube-for` | industry-specific YouTube guides |
| `src/data/post/when-youtube-doesnt-work.mdx` | `/tools/youtube-autocomplete-keywords` | free autocomplete tool |
| `src/data/post/when-youtube-doesnt-work.mdx` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI for Your Business |
| `src/data/post/when-youtube-doesnt-work.mdx` | `/blog/youtube-marketing-cost` | YouTube marketing costs |
| `src/data/post/when-youtube-doesnt-work.mdx` | `/blog/youtube-vs-paid-ads-b2b` | YouTube vs Paid Ads for B2B: Cost-Per-Lead Comparison |
| `src/data/post/when-youtube-doesnt-work.mdx` | `/blog/why-most-youtube-strategies-fail` | 7 YouTube Marketing Mistakes That Kill Business Channels |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/search-intent-youtube-seo-power` | YouTube vs Blogging for Business: Why Video Wins for B2B Lead Gen |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: A 6-Step System for B2B |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/tools/youtube-competitor-analysis` | competitor research tool |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/high-intent-topic-research-framework` | High-Intent Topic Research Framework for YouTube |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/compounding-effect-four-videos-a-month` | four high-intent videos per month |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-marketing-roi` | YouTube marketing ROI benchmarks |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-marketing-cost` | YouTube marketing costs |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator: Is YouTube Worth It for Your Business? |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-views-but-no-leads` | 6 reasons YouTube channels get views but no leads |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/youtube-for/saas` | SaaS businesses |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/youtube-for/consultants` | consultants |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/youtube-for` | other B2B verticals |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/tools/youtube-video-ideas-generator` | topic generator tool |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-script-writing-guide` | YouTube script writing guide |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/tools/youtube-title-generator` | buyer-intent title |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube channel optimization checklist |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/youtube-for` | industry-specific YouTube guides |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/youtube-vs` | YouTube vs every other marketing channel |
| `src/data/post/why-most-youtube-strategies-fail.mdx` | `/blog/youtube-marketing-strategy` | how to build a YouTube marketing strategy that drives leads |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/blog/youtube-b2b-buyer-journey-data` | how B2B buyers actually behave before they convert |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/tools/youtube-roi-calculator` | SellonTube ROI Calculator |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/youtube-vs/google-ads` | how YouTube stacks up against Google Search Ads for B2B |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/blog/youtube-vs-paid-ads-b2b` | YouTube vs Paid Ads for B2B: Cost-Per-Lead Comparison |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/youtube-vs/paid-ads` | YouTube vs Paid Ads: Real ROI Data After 12 Months |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/tools/youtube-competitor-analysis` | SellonTube Competitor Analysis tool |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/tools/youtube-competitor-analysis` | competitor analysis tool |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/tools/youtube-roi-calculator` | SellonTube ROI Calculator |
| `src/data/post/youtube-ads-for-b2b-lead-generation.mdx` | `/blog/youtube-lead-generation` | YouTube lead generation guide |
| `src/data/post/youtube-analytics-other-channels.mdx` | `/blog/youtube-competitor-analysis` | our 5-point competitor audit framework |
| `src/data/post/youtube-analytics-other-channels.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-analytics-other-channels.mdx` | `/blog/youtube-autocomplete-b2b-research` | the alphabet soup technique for topic research |
| `src/data/post/youtube-analytics-other-channels.mdx` | `/tools/youtube-competitor-analysis` | run this side by side with our competitor analysis tool |
| `src/data/post/youtube-analytics-other-channels.mdx` | `/blog/youtube-titles-for-business` | writing YouTube titles that drive clicks and conversions |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/blog/how-to-find-youtube-autocomplete-keywords` | How to Find YouTube Autocomplete Keywords (The Right Way) |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/tools/youtube-video-keyword-finder` | our video keyword finder tool |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research for Business Channels |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/youtube-for/saas` | how SaaS companies use YouTube for customer acquisition |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/youtube-for/consultants` | YouTube for consulting and professional services |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/tools/youtube-autocomplete-keywords` | use our YouTube autocomplete keyword tool |
| `src/data/post/youtube-autocomplete-b2b-research.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-b2b-buyer-journey-data.mdx` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B |
| `src/data/post/youtube-b2b-buyer-journey-data.mdx` | `/blog/youtube-marketing-roi` | YouTube marketing ROI |
| `src/data/post/youtube-b2b-buyer-journey-data.mdx` | `/blog/youtube-lead-generation` | YouTube lead generation |
| `src/data/post/youtube-b2b-buyer-journey-data.mdx` | `/blog/youtube-content-strategy-guide` | a 3-layer content strategy built around this exact journey |
| `src/data/post/youtube-b2b-buyer-journey-data.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-b2b-buyer-journey-data.mdx` | `/blog/youtube-ads-for-b2b-lead-generation` | how YouTube Ads fit into that Day 1 List strategy |
| `src/data/post/youtube-break-even-math.mdx` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI: Formula + 6 Benchmarks |
| `src/data/post/youtube-break-even-math.mdx` | `/blog/youtube-roi-for-saas` | YouTube ROI for SaaS: What a $12k/Year Channel Returns |
| `src/data/post/youtube-break-even-math.mdx` | `/blog/youtube-marketing-cost` | What YouTube Marketing Actually Costs in 2026 |
| `src/data/post/youtube-break-even-math.mdx` | `/blog/youtube-content-strategy-guide` | a documented content strategy |
| `src/data/post/youtube-break-even-math.mdx` | `/tools/youtube-video-ideas-generator` | our YouTube Video Ideas Generator |
| `src/data/post/youtube-break-even-math.mdx` | `/blog/youtube-business-plan` | a full YouTube business plan template |
| `src/data/post/youtube-business-plan.mdx` | `/blog/youtube-content-strategy-guide` | the 3-layer discovery, nurture, conversion framework |
| `src/data/post/youtube-business-plan.mdx` | `/blog/youtube-autocomplete-b2b-research` | running an autocomplete keyword research session |
| `src/data/post/youtube-business-plan.mdx` | `/blog/create-youtube-channel-for-business` | How to Create a YouTube Channel for Business |
| `src/data/post/youtube-business-plan.mdx` | `/blog/youtube-script-examples-business` | script templates for business videos |
| `src/data/post/youtube-business-plan.mdx` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI: Formula + 6 Benchmarks |
| `src/data/post/youtube-business-plan.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-business-plan.mdx` | `/blog/youtube-channel-optimization-checklist` | channel optimization checklist |
| `src/data/post/youtube-business-plan.mdx` | `/blog/youtube-break-even-math` | the break-even formula in detail |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-channel-audit` | YouTube channel audit |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/blog/create-youtube-channel-for-business` | How to Create a YouTube Channel for Business |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-description-generator` | YouTube description generator |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/blog/youtube-description-templates` | four description templates you can copy directly |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/blog/youtube-seo-guide` | YouTube SEO: Rank Business Videos on Page 1 |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/blog/youtube-chapters-timestamps` | the complete guide to YouTube chapters and timestamps |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-tag-generator` | YouTube tag generator |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-channel-audit` | channel audit |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-ranking-checker` | check your YouTube rank |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-channel-audit` | channel audit tool |
| `src/data/post/youtube-channel-optimization-checklist.mdx` | `/tools/youtube-transcript-generator` | transcript generator |
| `src/data/post/youtube-chapters-timestamps.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research: How to Find Terms Your Buyers Actually Search |
| `src/data/post/youtube-chapters-timestamps.mdx` | `/blog/youtube-description-templates` | our YouTube description templates |
| `src/data/post/youtube-chapters-timestamps.mdx` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-chapters-timestamps.mdx` | `/blog/search-intent-youtube-seo-power` | Search Intent and YouTube SEO Power: Match What Buyers Actually Want |
| `src/data/post/youtube-chapters-timestamps.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube Channel Optimization Checklist: The Complete Setup for Business Channels |
| `src/data/post/youtube-competitor-analysis.mdx` | `/tools/youtube-channel-audit` | running a free YouTube channel audit |
| `src/data/post/youtube-competitor-analysis.mdx` | `/blog/youtube-analytics-other-channels` | YouTube Analytics for Other Channels: Competitive Research Guide |
| `src/data/post/youtube-competitor-analysis.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-competitor-analysis.mdx` | `/tools/youtube-video-keyword-finder` | a dedicated video keyword finder |
| `src/data/post/youtube-competitor-analysis.mdx` | `/blog/youtube-autocomplete-b2b-research` | YouTube autocomplete for keyword gap research |
| `src/data/post/youtube-competitor-analysis.mdx` | `/blog/best-youtube-seo-tools-for-business` | Best YouTube SEO Tools for Business Channels |
| `src/data/post/youtube-competitor-analysis.mdx` | `/blog/youtube-content-strategy-guide` | YouTube Content Strategy Guide for Business |
| `src/data/post/youtube-competitor-analysis.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/why-most-youtube-strategies-fail` | 7 YouTube Marketing Mistakes That Kill Business Channels |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-lead-generation` | generates leads from YouTube |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/tools/youtube-seo-tool` | keyword research tool |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-script-examples-business` | B2B script examples |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-b2b-buyer-journey-data` | Google's B2B buyer journey research |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research for Business Channels (2026) |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube Channel Optimization Checklist |
| `src/data/post/youtube-content-strategy-guide.mdx` | `/blog/youtube-competitor-analysis` | how to reverse-engineer a competitor's keyword strategy |
| `src/data/post/youtube-description-templates.mdx` | `/blog/youtube-seo-guide` | YouTube SEO Guide: The Complete Framework |
| `src/data/post/youtube-description-templates.mdx` | `/tools/youtube-description-generator` | our YouTube description generator |
| `src/data/post/youtube-description-templates.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research: Find Terms Your Buyers Actually Search |
| `src/data/post/youtube-description-templates.mdx` | `/blog/youtube-chapters-timestamps` | how to name chapters that actually rank in Google |
| `src/data/post/youtube-description-templates.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube Channel Optimization Checklist |
| `src/data/post/youtube-for-saas-demos.mdx` | `/blog/youtube-autocomplete-b2b-research` | seed keywords for SaaS buyer research |
| `src/data/post/youtube-for-saas-demos.mdx` | `/youtube-for/saas` | the YouTube for SaaS hub |
| `src/data/post/youtube-for-saas-demos.mdx` | `/blog/youtube-roi-for-saas` | YouTube ROI for SaaS: What a $12k/Year Channel Returns |
| `src/data/post/youtube-for-saas-demos.mdx` | `/blog/youtube-marketing-b2b` | YouTube Marketing for B2B: Generate Leads |
| `src/data/post/youtube-for-saas-demos.mdx` | `/blog/youtube-content-strategy-guide` | our full content strategy playbook |
| `src/data/post/youtube-for-saas-demos.mdx` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-content-strategy-guide` | YouTube Content Strategy: Plan Videos That Bring Customers |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-keyword-research` | 5-step keyword research process |
| `src/data/post/youtube-growth-strategy.mdx` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-marketing-tools` | free YouTube marketing tool stack |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube channel optimization checklist |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-titles-for-business` | YouTube titles |
| `src/data/post/youtube-growth-strategy.mdx` | `/tools/youtube-channel-audit` | Start with a free channel audit |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-script-writing-guide` | scriptwriting |
| `src/data/post/youtube-growth-strategy.mdx` | `/blog/youtube-seo-for-business` | YouTube SEO for Business: The Non-Creator's Guide to Ranking |
| `src/data/post/youtube-growth-strategy.mdx` | `/tools/youtube-transcript-generator` | free transcript generator |
| `src/data/post/youtube-growth-strategy.mdx` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/search-intent-youtube-seo-power` | search intent on YouTube |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/youtube-seo-guide` | YouTube SEO: Rank Business Videos on Page 1 (2026) |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-autocomplete-keywords` | YouTube autocomplete keyword tool |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/how-to-find-youtube-autocomplete-keywords` | how to find YouTube autocomplete keywords |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-ranking-checker` | YouTube rank checker |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/compounding-effect-four-videos-a-month` | how 4 videos a month compound into a pipeline |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI: 3.25x More Conversions Than Blogging |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-autocomplete-keywords` | autocomplete keyword tool |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-tag-generator` | tag generator |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-description-generator` | description generator |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-video-keyword-finder` | our video keyword finder |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/best-youtube-seo-tools-for-business` | roundup of YouTube SEO tools for business channels |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-autocomplete-keywords` | autocomplete keyword tool |
| `src/data/post/youtube-keyword-research.mdx` | `/tools/youtube-script-generator` | YouTube script generator |
| `src/data/post/youtube-keyword-research.mdx` | `/blog/youtube-script-writing-guide` | script it using the 5-part framework |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-views-but-no-leads` | why YouTube channels get views but no leads |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: A 6-Step System for B2B |
| `src/data/post/youtube-lead-generation.md` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-lead-generation.md` | `/blog/high-intent-topic-research-framework` | High-Intent Topic Research Framework |
| `src/data/post/youtube-lead-generation.md` | `/tools/youtube-description-generator` | YouTube description generator |
| `src/data/post/youtube-lead-generation.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-lead-generation.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI: 3.25x More Conversions |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B guide |
| `src/data/post/youtube-lead-generation.md` | `/blog/compounding-effect-four-videos-a-month` | why video libraries compound faster than LinkedIn posts |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy for B2B: The Complete Playbook |
| `src/data/post/youtube-lead-generation.md` | `/youtube-for/consultants` | YouTube for consultants |
| `src/data/post/youtube-lead-generation.md` | `/youtube-for/coaches` | YouTube for coaches |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-script-writing-guide` | script a video |
| `src/data/post/youtube-lead-generation.md` | `/blog/youtube-script-examples-business` | B2B script templates |
| `src/data/post/youtube-lead-generation.md` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-lead-generation.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI formula and benchmarks |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-vs-paid-ads-b2b` | cost-per-lead across paid channels |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-views-but-no-leads` | no leads are coming through |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-lead-generation` | YouTube Lead Generation: Views to Booked Calls |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube channel optimization checklist |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-marketing-attribution.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI calculator |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-marketing-cost` | YouTube marketing costs in 2026 |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-roi-for-saas` | SaaS-specific ROI benchmarks |
| `src/data/post/youtube-marketing-attribution.mdx` | `/blog/youtube-growth-strategy` | 4-phase growth model |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/youtube-marketing-roi` | YouTube ROI for B2B businesses |
| `src/data/post/youtube-marketing-b2b.md` | `/tools/youtube-roi-calculator` | the ROI calculator tool |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/youtube-marketing-strategy` | building a YouTube marketing strategy for business |
| `src/data/post/youtube-marketing-b2b.md` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-marketing-b2b.md` | `/tools/youtube-description-generator` | YouTube description generator |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/best-youtube-seo-tools-for-business` | the YouTube SEO tools we recommend for business channels |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/youtube-lead-generation` | YouTube lead generation system |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy framework |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI benchmarks by business type |
| `src/data/post/youtube-marketing-b2b.md` | `/blog/youtube-marketing-cost` | YouTube marketing costs |
| `src/data/post/youtube-marketing-b2b.md` | `/tools/youtube-competitor-analysis` | YouTube competition checker |
| `src/data/post/youtube-marketing-cost.md` | `/blog/best-youtube-seo-tools-for-business` | which YouTube SEO tools are worth paying for |
| `src/data/post/youtube-marketing-cost.md` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B businesses |
| `src/data/post/youtube-marketing-cost.md` | `/blog/youtube-lead-generation` | the lead generation system that captures those leads |
| `src/data/post/youtube-marketing-cost.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-marketing-cost.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI |
| `src/data/post/youtube-marketing-cost.md` | `/blog/compounding-effect-four-videos-a-month` | how consistent publishing compounds into pipeline |
| `src/data/post/youtube-marketing-cost.md` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/youtube-keyword-research` | YouTube keyword research |
| `src/data/post/youtube-marketing-not-working.md` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/data/post/youtube-marketing-not-working.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/best-youtube-rank-checker-tools-for-business` | YouTube rank checker tools |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/youtube-lead-generation` | the CTA and funnel playbook for turning views into leads |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/youtube-script-writing-guide` | YouTube scriptwriting guide |
| `src/data/post/youtube-marketing-not-working.md` | `/tools/youtube-channel-audit` | Run a free channel audit |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy |
| `src/data/post/youtube-marketing-not-working.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI framework |
| `src/data/post/youtube-marketing-roi.md` | `/tools/youtube-script-generator` | YouTube script generator |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-ads-for-b2b-lead-generation` | whether YouTube Ads actually generate qualified B2B leads |
| `src/data/post/youtube-marketing-roi.md` | `/blog/why-most-youtube-strategies-fail` | why most YouTube strategies fail and what to do instead |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/data/post/youtube-marketing-roi.md` | `/blog/best-youtube-seo-tools-for-business` | our tested YouTube SEO tools list |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-lead-generation` | YouTube lead generation system |
| `src/data/post/youtube-marketing-roi.md` | `/blog/compounding-effect-four-videos-a-month` | how four videos a month creates a compounding content engine |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs. blog Shopify app case study |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy |
| `src/data/post/youtube-marketing-roi.md` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-marketing-cost` | YouTube marketing costs in 2026 |
| `src/data/post/youtube-marketing-roi.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-marketing-roi.md` | `/tools/youtube-roi-calculator` | Try the free YouTube ROI Calculator → |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-channel-optimization-checklist` | YouTube channel optimization checklist |
| `src/data/post/youtube-marketing-roi.md` | `/youtube-for` | industry guides |
| `src/data/post/youtube-marketing-roi.md` | `/youtube-vs/email-marketing` | YouTube vs Email Marketing |
| `src/data/post/youtube-marketing-roi.md` | `/youtube-vs/webinars` | YouTube vs Webinars |
| `src/data/post/youtube-marketing-roi.md` | `/youtube-vs` | honest comparisons |
| `src/data/post/youtube-marketing-roi.md` | `/tools/youtube-roi-calculator` | YouTube ROI calculator |
| `src/data/post/youtube-marketing-roi.md` | `/blog/search-intent-youtube-seo-power` | bottom-of-funnel search intent |
| `src/data/post/youtube-marketing-roi.md` | `/blog/youtube-marketing-b2b` | the broader YouTube marketing for B2B playbook |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-keyword-research` | YouTube keyword research guide |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/create-youtube-channel-for-business` | How to Create a YouTube Channel for Your Business |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube Channel Optimization Checklist |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs Blog for Shopify Apps: 12-Month Experiment |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-lead-generation` | YouTube Lead Generation: How B2B Companies Turn Viewers Into Customers |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-description-generator` | YouTube description generator |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-titles-for-business` | keyword-first title formula |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/high-intent-topic-research-framework` | High-Intent Topic Research Framework for B2B YouTube Channels |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-shorts-for-business` | YouTube Shorts for Business: When They Work and When They Waste Your Time |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-competitor-analysis` | YouTube competition checker |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-transcript-generator` | transcript generator |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-marketing-tools` | complete B2B tool stack |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-ranking-checker` | YouTube rank check |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI for Your Business |
| `src/data/post/youtube-marketing-strategy.mdx` | `/youtube-for/b2b-companies` | YouTube Marketing Strategy for B2B Companies |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-script-writing-guide` | 5-part YouTube scriptwriting framework |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI for Your Business |
| `src/data/post/youtube-marketing-strategy.mdx` | `/youtube-for/saas` | YouTube Marketing Strategy for SaaS Companies |
| `src/data/post/youtube-marketing-strategy.mdx` | `/youtube-vs/podcasting` | YouTube vs Podcasting |
| `src/data/post/youtube-marketing-strategy.mdx` | `/youtube-vs/referral-marketing` | YouTube vs Referral Marketing |
| `src/data/post/youtube-marketing-strategy.mdx` | `/youtube-vs/seo-content` | YouTube vs SEO Blog Content |
| `src/data/post/youtube-marketing-strategy.mdx` | `/youtube-vs` | All comparisons |
| `src/data/post/youtube-marketing-strategy.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/youtube-marketing-cost` | YouTube marketing costs |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/search-intent-youtube-seo-power` | matching content to search intent |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/compounding-effect-four-videos-a-month` | how the compounding effect works |
| `src/data/post/youtube-marketing-strategy.mdx` | `/blog/create-youtube-channel-for-business` | create YouTube channels for businesses |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/youtube-content-strategy-guide` | plan videos that bring customers |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/youtube-seo-guide` | the complete YouTube SEO ranking guide |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research for Business Channels |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-video-ideas-generator` | SellonTube Video Ideas Generator |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/is-vidiq-worth-it-for-business` | Is vidIQ Worth It? Only If You Want Views, Not Leads |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-title-generator` | SellonTube Title Generator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-video-ideas-evaluator` | SellonTube Topic Evaluator |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/best-youtube-seo-tools-for-business` | YouTube SEO tools for business |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/youtube-seo-for-business` | YouTube SEO for Business: The Non-Creator's Guide to Ranking |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-roi-calculator` | SellonTube ROI Calculator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-video-keyword-finder` | our video keyword finder |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-transcript-generator` | SellonTube Transcript Generator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-seo-tool` | SellonTube SEO Tool |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-video-ideas-generator` | SellonTube Video Ideas Generator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-title-generator` | SellonTube Title Generator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-video-ideas-evaluator` | SellonTube Topic Evaluator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-roi-calculator` | SellonTube ROI Calculator |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-transcript-generator` | SellonTube Transcript Generator |
| `src/data/post/youtube-marketing-tools.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-marketing-tools.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-marketing-cost` | What YouTube Marketing Actually Costs in 2026 |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-keyword-research` | keyword research process built for buyer intent |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-growth-strategy` | phased growth model for business channels |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI: Formula + 6 Benchmarks |
| `src/data/post/youtube-roi-for-saas.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-lead-generation` | YouTube lead generation playbook |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-vs-paid-ads-b2b` | YouTube vs Paid Ads for B2B: Cost-Per-Lead Comparison |
| `src/data/post/youtube-roi-for-saas.mdx` | `/blog/youtube-ads-for-b2b-lead-generation` | YouTube Ads for B2B: Cost, ROI & Does It Actually Work |
| `src/data/post/youtube-roi-for-saas.mdx` | `/tools/youtube-video-ideas-generator` | find your next video idea |
| `src/data/post/youtube-sales-funnel.md` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: A 6-Step System for B2B |
| `src/data/post/youtube-sales-funnel.md` | `/blog/high-intent-topic-research-framework` | our topic research framework |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-tag-generator` | Tag Generator |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/data/post/youtube-sales-funnel.md` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-sales-funnel.md` | `/blog/youtube-marketing-roi` | YouTube Marketing ROI: 3.25x More Conversions |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-description-generator` | description writing tool |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-sales-funnel.md` | `/blog/youtube-lead-generation` | YouTube Lead Generation: The Complete System |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-sales-funnel.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-script-examples-business.mdx` | `/tools/youtube-script-generator` | script generator tool |
| `src/data/post/youtube-script-examples-business.mdx` | `/blog/youtube-script-writing-guide` | YouTube Script Writing Guide: The 5-Part Framework |
| `src/data/post/youtube-script-examples-business.mdx` | `/blog/youtube-titles-for-business` | titles that rank for buyer queries |
| `src/data/post/youtube-script-examples-business.mdx` | `/blog/youtube-seo-for-business` | YouTube SEO for Business: The Complete Guide |
| `src/data/post/youtube-script-examples-business.mdx` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator: Find Topics Your Buyers Search For |
| `src/data/post/youtube-script-examples-business.mdx` | `/blog/youtube-content-strategy-guide` | YouTube Content Strategy Guide |
| `src/data/post/youtube-script-examples-business.mdx` | `/blog/youtube-video-ideas-generator-for-b2b` | buyer-intent video ideas for B2B |
| `src/data/post/youtube-script-writing-guide.mdx` | `/blog/youtube-marketing-strategy` | 6-step marketing strategy framework |
| `src/data/post/youtube-script-writing-guide.mdx` | `/tools/youtube-script-generator` | YouTube script generator |
| `src/data/post/youtube-script-writing-guide.mdx` | `/tools/youtube-script-generator` | YouTube script generator |
| `src/data/post/youtube-seo-for-business.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research for Business Channels (2026) |
| `src/data/post/youtube-seo-for-business.mdx` | `/tools/youtube-autocomplete-keywords` | YouTube autocomplete keyword tool |
| `src/data/post/youtube-seo-for-business.mdx` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/youtube-seo-for-business.mdx` | `/blog/search-intent-youtube-seo-power` | Search Intent on YouTube: Rank for Buyer Queries |
| `src/data/post/youtube-seo-for-business.mdx` | `/tools/youtube-seo-tool` | SellonTube YouTube SEO Tool |
| `src/data/post/youtube-seo-for-business.mdx` | `/tools/youtube-video-keyword-finder` | see which keywords your video already ranks for |
| `src/data/post/youtube-seo-for-business.mdx` | `/blog/youtube-lead-generation` | YouTube lead generation guide |
| `src/data/post/youtube-seo-for-business.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: 6-Step Framework |
| `src/data/post/youtube-seo-for-business.mdx` | `/tools/youtube-ranking-checker` | Check your YouTube rankings with our free tool |
| `src/data/post/youtube-seo-for-business.mdx` | `/blog/why-most-youtube-strategies-fail` | 7 YouTube Marketing Mistakes That Kill Business Channels |
| `src/data/post/youtube-seo-for-business.mdx` | `/blog/compounding-effect-four-videos-a-month` | the compounding effect of consistent publishing |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-ranking-checker` | YouTube rank checker |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/youtube-keyword-research` | YouTube keyword research guide |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/high-intent-topic-research-framework` | How to Find High-Intent YouTube Topics Your Buyers Are Already Searching |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/youtube-titles-for-business` | 10 before-and-after title rewrites |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/search-intent-youtube-seo-power` | Why YouTube Search Intent Beats Blog SEO for SaaS and B2B |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-description-generator` | YouTube description generator |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/youtube-script-writing-guide` | YouTube scriptwriting guide |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-tag-generator` | YouTube tag generator |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-autocomplete-keywords` | YouTube autocomplete keyword tool |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/best-youtube-autocomplete-keyword-tools` | best YouTube autocomplete keyword tools |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-competitor-analysis` | competition checker |
| `src/data/post/youtube-seo-guide.mdx` | `/tools/youtube-video-keyword-finder` | keyword validation tool |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/best-youtube-seo-tools-for-business` | YouTube SEO tools guide |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/best-youtube-seo-tools-for-business` | YouTube SEO tools for business channels |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/best-youtube-rank-checker-tools-for-business` | YouTube rank checker |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/create-youtube-channel-for-business` | creating a YouTube channel for your business |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/youtube-channel-optimization-checklist` | YouTube channel optimization checklist |
| `src/data/post/youtube-seo-guide.mdx` | `/blog/compounding-effect-four-videos-a-month` | How 4 Videos a Month Build a Predictable Pipeline in 6 to 12 Months |
| `src/data/post/youtube-seo-services.md` | `/blog/youtube-keyword-research` | YouTube keyword research |
| `src/data/post/youtube-seo-services.md` | `/blog/youtube-keyword-research` | YouTube keyword research guide |
| `src/data/post/youtube-seo-services.md` | `/tools/youtube-title-generator` | title-generator tool |
| `src/data/post/youtube-seo-services.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI |
| `src/data/post/youtube-seo-services.md` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-seo-services.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-shorts-for-business.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-shorts-for-business.md` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/data/post/youtube-shorts-for-business.md` | `/tools/youtube-script-generator` | Script Generator |
| `src/data/post/youtube-shorts-for-business.md` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/data/post/youtube-shorts-for-business.md` | `/blog/create-youtube-channel-for-business` | setting up a YouTube channel built for business, not creators |
| `src/data/post/youtube-shorts-for-business.md` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B |
| `src/data/post/youtube-shorts-for-business.md` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy guide |
| `src/data/post/youtube-shorts-for-business.md` | `/youtube-for/` | YouTube strategies by industry |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-seo-guide` | YouTube SEO: The Complete Ranking Guide |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-keyword-research` | YouTube Keyword Research: Find What Your Buyers Search |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy: Plan Videos That Bring Customers |
| `src/data/post/youtube-titles-for-business.mdx` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-marketing-tools` | our full YouTube tool roundup |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-keyword-research` | keyword research |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-channel-optimization-checklist` | channel optimization |
| `src/data/post/youtube-titles-for-business.mdx` | `/tools/youtube-ranking-checker` | YouTube ranking checker |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-script-examples-business` | YouTube script examples for business |
| `src/data/post/youtube-titles-for-business.mdx` | `/blog/youtube-script-writing-guide` | the script framework that carries the keyword through |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/blog/youtube-marketing-b2b` | YouTube for B2B: How to Build a Channel That Generates Leads |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/blog/best-youtube-video-ideas-generators-for-businesses` | The 14 Best YouTube Video Ideas Generators for Businesses in 2026 |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs Blog for Shopify Apps: 12-Month Experiment (3.25x More Conversions) |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/tools/youtube-ranking-checker` | YouTube rank checker |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/tools/youtube-autocomplete-keywords` | YouTube autocomplete keyword tool |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/blog/youtube-keyword-research` | validate demand with a full keyword research process |
| `src/data/post/youtube-video-ideas-generator-for-b2b.mdx` | `/blog/high-intent-topic-research-framework` | High-Intent Topic Research: How to Find YouTube Topics Your Buyers Actually Search |
| `src/data/post/youtube-views-but-no-leads.md` | `/blog/high-intent-topic-research-framework` | the high-intent research process |
| `src/data/post/youtube-views-but-no-leads.md` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/data/post/youtube-views-but-no-leads.md` | `/blog/youtube-keyword-research` | YouTube keyword research |
| `src/data/post/youtube-views-but-no-leads.md` | `/blog/youtube-lead-generation` | YouTube lead generation |
| `src/data/post/youtube-views-but-no-leads.md` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/data/post/youtube-views-but-no-leads.md` | `/tools/youtube-roi-calculator` | estimate your return |
| `src/data/post/youtube-views-but-no-leads.md` | `/blog/youtube-marketing-roi` | YouTube marketing ROI |
| `src/data/post/youtube-views-but-no-leads.md` | `/tools/youtube-competitor-analysis` | YouTube competition checker |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/blog/compounding-effect-four-videos-a-month` | compounding effect we documented in our publishing cadence analysis |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/blog/youtube-video-ideas-generator-for-b2b` | buyer-intent video patterns |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/youtube-vs/blogging` | YouTube vs Blogging |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/blog/youtube-script-writing-guide` | structure scripts for conversion |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/tools/youtube-script-generator` | our free script generator |
| `src/data/post/youtube-vs-blog-shopify-app-case-study.mdx` | `/youtube-for/shopify` | book a diagnostic call |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/blog/youtube-growth-strategy` | the four growth phases that build a compounding library |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI for Your Business |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/blog/youtube-ads-for-b2b-lead-generation` | YouTube Ads for B2B: Cost, ROI & Does It Actually Work |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/blog/youtube-lead-generation` | YouTube lead generation guide |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/blog/youtube-marketing-attribution` | attribution signals that prove pipeline |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `src/data/post/youtube-vs-paid-ads-b2b.mdx` | `/blog/youtube-marketing-cost` | What YouTube Marketing Actually Costs |

### Tool pages

| Source | Target | Anchor |
|---|---|---|
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-seo-tool` | 
            Check your video SEO score &rarr;
           |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-title-generator` | 
            Generate titles from keywords
           |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/blog/youtube-autocomplete-b2b-research` | how B2B teams use YouTube autocomplete for buyer keyword research |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-video-keyword-finder` | validate topics with the keyword finder |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-title-generator` | YouTube Title Generator |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | `/tools/youtube-seo-tool` | YouTube SEO Tool |
| `src/pages/tools/youtube-channel-audit.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-channel-audit.astro` | `/blog/youtube-channel-optimization-checklist` | channel optimization checklist |
| `src/pages/tools/youtube-channel-audit.astro` | `/tools/youtube-title-generator` | title generator |
| `src/pages/tools/youtube-channel-audit.astro` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/pages/tools/youtube-competitor-analysis.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-competitor-analysis.astro` | `/blog/youtube-competitor-analysis` | our full guide to YouTube competitor analysis |
| `src/pages/tools/youtube-competitor-analysis.astro` | `/tools/youtube-autocomplete-keywords` | autocomplete keyword tool |
| `src/pages/tools/youtube-competitor-analysis.astro` | `/tools/youtube-seo-tool` | YouTube SEO tool |
| `src/pages/tools/youtube-competitor-analysis.astro` | `/tools/youtube-tag-generator` | tag generator |
| `src/pages/tools/youtube-description-generator.astro` | `/tools/youtube-seo-tool` | 
              Run full SEO audit
             |
| `src/pages/tools/youtube-description-generator.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-description-generator.astro` | `/blog/youtube-description-templates` | YouTube description templates |
| `src/pages/tools/youtube-ranking-checker.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-ranking-checker.astro` | `/tools/youtube-title-generator` | title generator |
| `src/pages/tools/youtube-ranking-checker.astro` | `/tools/youtube-tag-generator` | tag generator |
| `src/pages/tools/youtube-ranking-checker.astro` | `/blog/how-to-check-youtube-rankings` | how to check your YouTube rankings |
| `src/pages/tools/youtube-ranking-checker.astro` | `/tools/youtube-tag-generator` | YouTube tag generator |
| `src/pages/tools/youtube-ranking-checker.astro` | `/tools/youtube-tag-generator` | tag generator |
| `src/pages/tools/youtube-ranking-checker.astro` | `/blog/how-to-find-youtube-video-ranking-keywords` | guide on finding your YouTube ranking keywords |
| `src/pages/tools/youtube-roi-calculator.astro` | `/product-pricing` | done-for-you price |
| `src/pages/tools/youtube-roi-calculator.astro` | `/blog/youtube-marketing-roi` | YouTube marketing ROI benchmarks and formulas |
| `src/pages/tools/youtube-roi-calculator.astro` | `/blog/youtube-break-even-math` | the full YouTube break-even math |
| `src/pages/tools/youtube-roi-calculator.astro` | `/blog/compounding-effect-four-videos-a-month` | how four videos a month creates a compounding content engine |
| `src/pages/tools/youtube-script-generator.astro` | `/blog/youtube-script-writing-guide` | YouTube script writing guide |
| `src/pages/tools/youtube-script-generator.astro` | `/blog/youtube-script-examples-business` | real YouTube script examples for business |
| `src/pages/tools/youtube-script-generator.astro` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/pages/tools/youtube-script-generator.astro` | `/tools/youtube-video-ideas-evaluator` | Ideas Evaluator |
| `src/pages/tools/youtube-script-generator.astro` | `/tools/youtube-title-generator` | Title Generator |
| `src/pages/tools/youtube-seo-tool.astro` | `/tools/youtube-video-ideas-evaluator` | YouTube Video Idea Evaluator |
| `src/pages/tools/youtube-seo-tool.astro` | `/tools/youtube-video-ideas-generator` | YouTube Video Ideas Generator |
| `src/pages/tools/youtube-seo-tool.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-seo-tool.astro` | `/blog/search-intent-youtube-seo-power` | search intent and YouTube SEO |
| `src/pages/tools/youtube-seo-tool.astro` | `/blog/youtube-views-but-no-leads` | views without leads |
| `src/pages/tools/youtube-tag-generator.astro` | `/tools/youtube-description-generator` | 
            Generate description &rarr;
           |
| `src/pages/tools/youtube-tag-generator.astro` | `/blog/youtube-seo-for-business` | how to optimize for YouTube SEO |
| `src/pages/tools/youtube-tag-generator.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-tag-generator.astro` | `/tools/youtube-autocomplete-keywords` | autocomplete keyword tool |
| `src/pages/tools/youtube-title-generator.astro` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy guide |
| `src/pages/tools/youtube-title-generator.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-title-generator.astro` | `/blog/youtube-titles-for-business` | our full guide to YouTube titles for business |
| `src/pages/tools/youtube-transcript-generator.astro` | `/blog/youtube-marketing-strategy` | YouTube marketing strategy guide |
| `src/pages/tools/youtube-transcript-generator.astro` | `/blog/youtube-seo-guide` | YouTube SEO guide |
| `src/pages/tools/youtube-transcript-generator.astro` | `/blog/youtube-content-strategy-guide` | our full YouTube content strategy guide |
| `src/pages/tools/youtube-transcript-generator.astro` | `/blog/best-youtube-transcript-generators` | comparison of YouTube transcript generators |
| `src/pages/tools/youtube-transcript-generator.astro` | `/tools/youtube-script-generator` | YouTube Script Generator |
| `src/pages/tools/youtube-transcript-generator.astro` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/tools/youtube-video-ideas-generator` | Video Ideas Generator |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/blog/why-most-youtube-strategies-fail` | why most YouTube strategies fail to generate leads |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/youtube-for/saas` | SaaS companies |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/youtube-for/consultants` | consultants |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/youtube-for/agencies` | agencies |
| `src/pages/tools/youtube-video-ideas-evaluator.astro` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B companies |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/blog/high-intent-topic-research-framework` | high-intent topic research framework |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/blog/youtube-content-strategy-guide` | our full YouTube content strategy guide |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/blog/youtube-video-ideas-generator-for-b2b` | guide to generating YouTube video ideas for B2B |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/tools/youtube-video-ideas-evaluator` | Video Ideas Evaluator |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/tools/youtube-title-generator` | Title Generator |
| `src/pages/tools/youtube-video-ideas-generator.astro` | `/tools/youtube-script-generator` | ' +
                  'Generate Script \u2192' +
                ' |
| `src/pages/tools/youtube-video-keyword-finder.astro` | `/blog/how-to-find-youtube-video-ranking-keywords` | how to find what keywords your YouTube videos rank for |
| `src/pages/tools/youtube-video-keyword-finder.astro` | `/blog/is-vidiq-worth-it-for-business` | is VidIQ worth it for business channels |

### Hub pages

| Source | Target | Anchor |
|---|---|---|
| `src/pages/youtube-for/index.astro` | `/blog/when-youtube-doesnt-work` | when YouTube doesn't work |
| `src/pages/youtube-for/index.astro` | `/blog/youtube-marketing-b2b` | YouTube for B2B acquisition |
| `src/pages/youtube-for/index.astro` | `/blog/create-youtube-channel-for-business` | how to set up a YouTube channel for your business |
| `src/pages/youtube-for/index.astro` | `/tools/youtube-channel-audit` | free YouTube Channel Audit tool |
| `src/pages/youtube-vs/index.astro` | `/blog/youtube-vs-paid-ads-b2b` | our YouTube vs paid ads comparison |
| `src/pages/youtube-vs/index.astro` | `/blog/youtube-analytics-other-channels` | comparing YouTube analytics against other channels |
| `src/pages/youtube-vs/index.astro` | `/blog/youtube-vs-blog-shopify-app-case-study` | a real case study of YouTube outperforming blog content |
| `src/pages/youtube-vs/index.astro` | `/tools/youtube-roi-calculator` | free YouTube ROI Calculator |

### youtube-for/shopify.astro (standalone)

| Target | Anchor |
|---|---|
| `/blog/youtube-views-but-no-leads` | Getting views without installs |
| `/blog/youtube-sales-funnel` | search-driven YouTube funnels |
| `/tools/youtube-roi-calculator` | Try our free YouTube ROI calculator |

### youtube-for (src/data/niches.ts, new `relatedLinks` field)

| Niche slug | Target | Anchor |
|---|---|---|
| `saas` | `/blog/youtube-for-saas-demos` | YouTube for SaaS Demos |
| `saas` | `/blog/youtube-roi-for-saas` | YouTube ROI for SaaS Companies |
| `saas` | `/tools/youtube-competitor-analysis` | YouTube Competitor Analysis Tool |
| `coaches` | `/blog/youtube-script-writing-guide` | YouTube Script Writing Guide |
| `coaches` | `/tools/youtube-video-ideas-generator` | our video ideas generator |
| `coaches` | `/tools/youtube-title-generator` | our title generator tool |
| `agencies` | `/blog/youtube-marketing-b2b` | YouTube Marketing for B2B Companies |
| `agencies` | `/blog/youtube-vs-paid-ads-b2b` | YouTube vs Paid Ads for B2B |
| `agencies` | `/tools/youtube-competitor-analysis` | YouTube Competitor Analysis Tool |
| `consultants` | `/blog/youtube-marketing-b2b` | YouTube Marketing for B2B Companies |
| `consultants` | `/blog/high-intent-topic-research-framework` | our topic research framework |
| `consultants` | `/tools/youtube-video-ideas-evaluator` | YouTube Video Ideas Evaluator |
| `b2b-companies` | `/blog/youtube-marketing-b2b` | our B2B YouTube marketing playbook |
| `b2b-companies` | `/blog/b2b-video-marketing-strategy` | B2B Video Marketing Strategy |
| `b2b-companies` | `/tools/youtube-roi-calculator` | run the numbers with our ROI calculator |
| `course-creators` | `/blog/youtube-script-writing-guide` | our script writing guide |
| `course-creators` | `/tools/youtube-title-generator` | the title generator |
| `course-creators` | `/tools/youtube-video-ideas-generator` | the free ideas generator |
| `financial-advisors` | `/blog/youtube-seo-for-business` | YouTube SEO for Business |
| `financial-advisors` | `/blog/create-youtube-channel-for-business` | our guide to setting up a business channel |
| `financial-advisors` | `/tools/youtube-video-ideas-generator` | spark new video topics |
| `law-firms` | `/blog/youtube-content-strategy-guide` | YouTube Content Strategy Guide |
| `law-firms` | `/blog/youtube-lead-generation` | our lead-generation playbook |
| `law-firms` | `/tools/youtube-description-generator` | our description generator tool |
| `real-estate` | `/blog/how-to-check-youtube-rankings` | How to Check YouTube Rankings |
| `real-estate` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker Tool |
| `real-estate` | `/tools/youtube-video-keyword-finder` | YouTube Video Keyword Finder |
| `marketing-agencies` | `/blog/youtube-marketing-tools` | Best YouTube Marketing Tools |
| `marketing-agencies` | `/blog/youtube-vs-paid-ads-b2b` | YouTube vs Paid Ads for B2B |
| `marketing-agencies` | `/tools/youtube-competitor-analysis` | YouTube Competitor Analysis Tool |
| `software-companies` | `/blog/youtube-for-saas-demos` | YouTube for SaaS Demos |
| `software-companies` | `/blog/youtube-marketing-b2b` | our B2B YouTube marketing playbook |
| `software-companies` | `/tools/youtube-competitor-analysis` | our competitor analysis tool |
| `fintech-companies` | `/blog/youtube-marketing-b2b` | how B2B companies use YouTube |
| `fintech-companies` | `/blog/youtube-lead-generation` | how YouTube generates leads for B2B |
| `fintech-companies` | `/tools/youtube-video-ideas-generator` | our video ideas generator |
| `hr-software` | `/blog/youtube-for-saas-demos` | YouTube for SaaS Demos |
| `hr-software` | `/blog/youtube-marketing-b2b` | YouTube marketing for B2B teams |
| `hr-software` | `/tools/youtube-competitor-analysis` | see what competitors are ranking for |
| `edtech-companies` | `/blog/youtube-script-writing-guide` | how to write YouTube scripts that convert |
| `edtech-companies` | `/blog/youtube-content-strategy-guide` | YouTube Content Strategy Guide |
| `edtech-companies` | `/tools/youtube-video-ideas-generator` | generate video topics instantly |
| `cybersecurity-companies` | `/blog/youtube-marketing-b2b` | the B2B YouTube marketing guide |
| `cybersecurity-companies` | `/blog/high-intent-topic-research-framework` | the high-intent research process |
| `cybersecurity-companies` | `/tools/youtube-competitor-analysis` | the competitor research tool |
| `accountants` | `/blog/youtube-seo-for-business` | YouTube SEO for Business |
| `accountants` | `/blog/create-youtube-channel-for-business` | our guide to launching a business YouTube channel |
| `accountants` | `/tools/youtube-video-ideas-generator` | the free ideas generator |
| `insurance-agents` | `/blog/youtube-lead-generation` | turning views into qualified leads |
| `insurance-agents` | `/blog/youtube-content-strategy-guide` | our content strategy guide |
| `insurance-agents` | `/tools/youtube-title-generator` | generate titles instantly |
| `mortgage-brokers` | `/blog/how-to-check-youtube-rankings` | How to Check YouTube Rankings |
| `mortgage-brokers` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker Tool |
| `mortgage-brokers` | `/tools/youtube-video-keyword-finder` | YouTube Video Keyword Finder |
| `recruiting-firms` | `/blog/youtube-marketing-b2b` | B2B-focused YouTube strategy |
| `recruiting-firms` | `/blog/youtube-lead-generation` | full guide to YouTube lead generation |
| `recruiting-firms` | `/tools/youtube-video-ideas-generator` | spark new video topics |
| `management-consultants` | `/blog/youtube-marketing-b2b` | how B2B brands win with YouTube |
| `management-consultants` | `/blog/high-intent-topic-research-framework` | our research-driven topic framework |
| `management-consultants` | `/tools/youtube-video-ideas-evaluator` | YouTube Video Ideas Evaluator |
| `business-coaches` | `/blog/youtube-lead-generation` | how YouTube generates leads for B2B |
| `business-coaches` | `/blog/youtube-content-strategy-guide` | our content strategy guide |
| `business-coaches` | `/tools/youtube-video-ideas-generator` | our topic generator tool |
| `life-coaches` | `/blog/youtube-content-strategy-guide` | how to plan a YouTube content strategy |
| `life-coaches` | `/blog/youtube-script-writing-guide` | our script writing guide |
| `life-coaches` | `/tools/youtube-title-generator` | our title generator tool |
| `professional-services` | `/blog/youtube-marketing-b2b` | our B2B marketing framework |
| `professional-services` | `/blog/b2b-video-marketing-strategy` | B2B Video Marketing Strategy |
| `professional-services` | `/tools/youtube-competitor-analysis` | analyze competitor channels |
| `startup-founders` | `/blog/youtube-business-plan` | YouTube Business Plan Guide |
| `startup-founders` | `/blog/youtube-break-even-math` | YouTube Break-Even Math |
| `startup-founders` | `/tools/youtube-roi-calculator` | our free ROI calculator |
| `ecommerce` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs Blog: Shopify App Case Study |
| `ecommerce` | `/blog/youtube-seo-for-business` | YouTube SEO for Business |
| `ecommerce` | `/tools/youtube-competitor-analysis` | our free competitor analysis |
| `healthcare-practices` | `/blog/youtube-seo-for-business` | our business YouTube SEO guide |
| `healthcare-practices` | `/blog/create-youtube-channel-for-business` | how to set up a business YouTube channel |
| `healthcare-practices` | `/tools/youtube-video-ideas-generator` | get video ideas in seconds |
| `dental-practices` | `/blog/how-to-check-youtube-rankings` | How to Check YouTube Rankings |
| `dental-practices` | `/tools/youtube-ranking-checker` | YouTube Ranking Checker Tool |
| `dental-practices` | `/tools/youtube-video-keyword-finder` | YouTube Video Keyword Finder |
| `subscription-businesses` | `/blog/youtube-marketing-roi` | our marketing ROI breakdown |
| `subscription-businesses` | `/blog/youtube-vs-paid-ads-b2b` | YouTube vs Paid Ads for B2B |
| `subscription-businesses` | `/tools/youtube-roi-calculator` | calculate your potential ROI |
| `marketplaces` | `/blog/b2b-video-marketing-strategy` | B2B Video Marketing Strategy |
| `marketplaces` | `/blog/youtube-competitor-analysis` | YouTube Competitor Analysis Guide |
| `marketplaces` | `/tools/youtube-competitor-analysis` | spot gaps in competitor content |
| `small-business` | `/blog/create-youtube-channel-for-business` | our guide to launching a business YouTube channel |
| `small-business` | `/blog/youtube-marketing-strategy` | our 6-step marketing framework |
| `small-business` | `/tools/youtube-video-ideas-generator` | the ideas generator tool |

### youtube-vs (src/data/comparisons.ts, populated `relatedLinks` field)

| Comparison slug | Target | Anchor |
|---|---|---|
| `facebook` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `facebook` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI |
| `facebook` | `/youtube-vs/instagram` | YouTube vs Instagram for Business |
| `facebook` | `/youtube-for` | YouTube Marketing for Your Industry |
| `instagram` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `instagram` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI |
| `instagram` | `/youtube-vs/facebook` | YouTube vs Facebook for Business |
| `instagram` | `/youtube-for/coaches` | YouTube for Coaches |
| `linkedin-for-b2b` | `/blog/youtube-marketing-b2b` | YouTube for B2B Marketing Guide |
| `linkedin-for-b2b` | `/blog/youtube-b2b-buyer-journey-data` | YouTube B2B Buyer Journey Data |
| `linkedin-for-b2b` | `/tools/youtube-roi-calculator` | run the numbers with our ROI calculator |
| `instagram-for-coaches` | `/blog/youtube-lead-generation` | our lead-generation playbook |
| `instagram-for-coaches` | `/blog/youtube-marketing-strategy` | the full marketing strategy guide |
| `instagram-for-coaches` | `/tools/youtube-video-ideas-generator` | brainstorm videos with this tool |
| `tiktok-for-saas` | `/blog/youtube-for-saas-demos` | YouTube for SaaS Product Demos |
| `tiktok-for-saas` | `/blog/youtube-roi-for-saas` | YouTube ROI for SaaS Companies |
| `tiktok-for-saas` | `/tools/youtube-roi-calculator` | check if the math works for your business |
| `paid-ads` | `/tools/youtube-roi-calculator` | YouTube ROI Calculator |
| `paid-ads` | `/blog/youtube-marketing-roi` | How to Calculate YouTube Marketing ROI |
| `paid-ads` | `/youtube-vs/facebook` | YouTube vs Facebook for Business |
| `paid-ads` | `/blog/youtube-marketing-strategy` | YouTube Marketing Strategy Guide |
| `google-ads` | `/blog/youtube-vs-paid-ads-b2b` | our YouTube vs paid ads breakdown |
| `google-ads` | `/blog/youtube-break-even-math` | YouTube Break-Even Math |
| `google-ads` | `/tools/youtube-roi-calculator` | calculate your potential ROI |
| `facebook-ads` | `/blog/youtube-vs-paid-ads-b2b` | the cost-per-lead comparison |
| `facebook-ads` | `/blog/compounding-effect-four-videos-a-month` | The Compounding Effect of Four Videos a Month |
| `facebook-ads` | `/tools/youtube-roi-calculator` | our free ROI calculator |
| `content-marketing` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs Blog: Shopify App Case Study (3.25x More Conversions) |
| `content-marketing` | `/blog/youtube-content-strategy-guide` | the content strategy framework |
| `content-marketing` | `/tools/youtube-script-generator` | our free script generator |
| `podcasting` | `/blog/youtube-marketing-strategy` | our strategic framework for YouTube marketing |
| `podcasting` | `/blog/youtube-chapters-timestamps` | YouTube Chapters and Timestamps Guide |
| `podcasting` | `/tools/youtube-transcript-generator` | YouTube Transcript Generator |
| `blogging` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs Blog: Shopify App Case Study (3.25x More Conversions) |
| `blogging` | `/blog/search-intent-youtube-seo-power` | Search Intent and YouTube SEO Power |
| `blogging` | `/tools/youtube-video-ideas-generator` | our free topic brainstorming tool |
| `email-marketing` | `/blog/youtube-lead-generation` | turning views into qualified leads |
| `email-marketing` | `/blog/youtube-marketing-strategy` | our 6-step marketing framework |
| `email-marketing` | `/tools/youtube-description-generator` | generate descriptions automatically |
| `linkedin-for-agencies` | `/blog/youtube-lead-generation` | the complete lead-gen breakdown |
| `linkedin-for-agencies` | `/blog/youtube-content-strategy-guide` | our strategic content guide |
| `linkedin-for-agencies` | `/tools/youtube-competitor-analysis` | the competitive research tool |
| `instagram-for-saas` | `/blog/youtube-for-saas-demos` | YouTube for SaaS Product Demos |
| `instagram-for-saas` | `/blog/youtube-roi-for-saas` | YouTube ROI for SaaS Companies |
| `instagram-for-saas` | `/tools/youtube-video-ideas-generator` | generate content ideas |
| `webinars` | `/blog/youtube-lead-generation` | how to turn YouTube into a lead channel |
| `webinars` | `/blog/youtube-chapters-timestamps` | YouTube Chapters and Timestamps Guide |
| `webinars` | `/tools/youtube-transcript-generator` | YouTube Transcript Generator |
| `cold-outreach` | `/blog/youtube-marketing-b2b` | YouTube for B2B Marketing Guide |
| `cold-outreach` | `/blog/youtube-lead-generation` | YouTube as a lead source |
| `cold-outreach` | `/tools/youtube-roi-calculator` | see your profit potential |
| `seo-content` | `/blog/youtube-vs-blog-shopify-app-case-study` | YouTube vs Blog: Shopify App Case Study (3.25x More Conversions) |
| `seo-content` | `/blog/youtube-seo-guide` | our complete YouTube SEO guide |
| `seo-content` | `/tools/youtube-seo-tool` | our free SEO tool |
| `referral-marketing` | `/blog/youtube-growth-strategy` | YouTube Growth Strategy |
| `referral-marketing` | `/blog/youtube-marketing-strategy` | the full marketing strategy guide |
| `referral-marketing` | `/tools/youtube-roi-calculator` | model your own numbers |
| `community-building` | `/blog/youtube-lead-generation` | our guide to capturing leads on YouTube |
| `community-building` | `/blog/youtube-content-strategy-guide` | planning content that compounds |
| `community-building` | `/tools/youtube-video-ideas-generator` | the video topic generator |
| `twitter-for-saas` | `/blog/youtube-for-saas-demos` | YouTube for SaaS Product Demos |
| `twitter-for-saas` | `/blog/youtube-roi-for-saas` | our SaaS-specific ROI breakdown |
| `twitter-for-saas` | `/tools/youtube-script-generator` | the script generator tool |
| `reddit-for-saas` | `/blog/youtube-for-saas-demos` | our guide to SaaS demo videos |
| `reddit-for-saas` | `/blog/youtube-lead-generation` | generating leads through YouTube search |
| `reddit-for-saas` | `/tools/youtube-competitor-analysis` | audit competitor strategies |

## Notes for follow-up (not fixed in this task, flagged for the user)

- `src/data/post/youtube-marketing-not-working.md` has a pre-existing 301 redirect rule in `netlify.toml` pointing away from its own canonical URL (-> `/blog/youtube-views-but-no-leads`, no `force = true`). Per Netlify's default redirect precedence, a live static file at that path likely still gets served ahead of the redirect -- a pre-existing site config anomaly unrelated to this project. Needs a decision: force the redirect, or remove it if the post is meant to stay live.
- A large number of (target, anchor) pairs across the FULL site (including files never touched by this project, e.g. `/tools/youtube-seo-tool` anchor "YouTube SEO Tool" used by 30+ pre-existing sources) already exceed the 3-source diversity cap and predate this project entirely. This task only fixed overage it caused or contributed to; retroactively rewriting already-indexed, already-ranking anchor text site-wide is a separate, higher-risk initiative outside this task's scope.