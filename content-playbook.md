# SellonTube Content Quality Playbook
## The Operating Manual for Blog Content That Drives Traffic, Leads, and Sales

This playbook is the quality benchmark for every blog post published on selontube.com. It answers three questions: What should we write? How should we write it? How do we make sure it's good enough to publish?

---

## 1. CONTENT STRATEGY: FROM TRAFFIC TO REVENUE

Every blog post must serve a business purpose. The goal isn't page views — it's attracting the right readers, earning their trust, and positioning SellonTube as the obvious choice when they're ready to hire.

### The Priority Score

Every keyword in `research/keywords/sot_master.csv` has a `priority_score` (0–100), auto-calculated by `scripts/build_sot_master.py`. Agent 03 uses this score to recommend the next post. Higher score = write this first.

**Formula (four dimensions):**

**1. Business potential (0–40pts)** — derived from `cluster`:

| Tier | Clusters | Points |
|---|---|---|
| Core | `youtube_seo`, `youtube_lead_gen`, `b2b`, `youtube_keyword_research` | 40 |
| Adjacent | `youtube_marketing`, `youtube_analytics`, `youtube_growth_strategy`, `youtube_automation`, `youtube_title_generator`, `youtube_video_ideas`, `youtube_tools_software` | 28 |
| Broad | `youtube_general`, `youtube_shorts_strategy`, `youtube_transcription_captions`, `video_marketing_general` | 14 |
| Excluded | `video_production`, `youtube_ads` | 0 |
| pSEO | `pseo_for`, `pseo_vs` | scored separately — not subject to blog priority score |

**2. Content-market fit (0–30pts)** — derived from `intent`:
- `commercial` / `transactional` → 30pts
- `informational` → 21pts
- `technical` → 15pts

**3. Search potential (0–20pts)** — derived from `search_volume` + `keyword_difficulty`:
- Volume score: `min(search_volume / 50000, 1) × 10` (capped at 50k)
- Difficulty score: `((100 − keyword_difficulty) / 100) × 10`
- Total: volume score + difficulty score

**4. Resource cost (0–10pts)** — derived from `content_type`:
- `pseo` → 10pts (templated, low effort)
- `blog` → 7pts (medium effort)
- `tool` → 4pts (high build effort)

**Tiebreaker:** When two keywords have equal `priority_score`, prefer the higher `cpc_inr` — higher CPC signals stronger commercial intent.

**Note:** `build_sot_master.py` must be updated to calculate and write `priority_score` as a column. This is a separate technical task. Until implemented, Agent 03 applies the formula manually when recommending the next post.

### The Funnel Mix

**Cadence: 1 post per week. Hard maximum: 2 posts in any 7-day window.** SellonTube is a new, low-authority site — a burst of posts risks Google flagging thin content. Before scheduling any post, count how many fall in the same 7-day window across `src/data/post/`. If adding the new post would push any window above 2, stop and flag it.

Posts should cover different funnel stages across the month:

**Top of funnel (most weeks):** Broad, keyword-driven educational content. Attracts new visitors through search. *Examples: "What Is YouTube SEO?", "5 Content Marketing Mistakes New Shopify Stores Make"*

**Middle of funnel (every few weeks):** Connects the reader's problem to SellonTube's expertise. Shows how to think, not just what to do. *Examples: "Why Your YouTube Shorts Get Views But Don't Drive Sales", "The Content Strategy Most Shopify Apps Get Wrong"*

**Bottom of funnel (once or twice a month):** Showcases your work, results, and methodology. Case studies, process breakdowns, client stories. *Examples: "How We Grew a Shopify App's Organic Traffic by 3x", "Our YouTube SEO Process: Step by Step"*

### Finding High-Intent Topics

The best topics don't come from keyword tools alone. They come from three sources:

**Client conversations.** If a question or challenge comes up unprompted in three client calls, it deserves a blog post. These topics drive revenue because they address problems people will pay to solve.

**First-order pain points.** Problems your services directly solve: "How do I optimize my YouTube titles?" or "How do I improve my Shopify email open rates?"

**Second-order pain points.** Related problems that occur at the same time for the same people. A business owner struggling with YouTube SEO is probably also dealing with content planning overwhelm, hiring their first marketer, or figuring out how to repurpose video across channels. Writing about these adjacent problems reaches a wider audience at the exact moment they might need you.

Ask clients: "What other problems were you dealing with around the time you hired us?" The answers become your next 20 blog post ideas.

### Match Search Intent Before Writing

Before writing for any keyword, Google it and check the three Cs:

1. **Content type** — Are the top results blog posts, videos, product pages, or tools?
2. **Content format** — Are they how-to guides, listicles, comparisons, or opinion pieces?
3. **Content angle** — What perspective are they using? (Beginners? Current year? Specific niche?)

Match what's ranking, then make yours better. If the top results are all beginner listicles, don't write an advanced deep-dive — Google won't rank it.

---

## 2. SITE ARCHITECTURE: BUILD A LIBRARY, NOT A BLOG FEED

Most blogs are organized by date. SellonTube's blog should be organized by topic — like a library, not a magazine.

### Why This Matters

Most readers will only ever see 1-2 posts on your site. They arrive through search, read one article, and leave. They don't browse your archive. This means:

- You can write about the same core topics repeatedly from different angles. A post on "YouTube SEO for Shopify stores" and another on "How to rank YouTube Shorts for ecommerce" overlap — and that's fine, because different readers find each through different searches.
- Site structure matters more than publishing schedule. Organize content into clear topic hubs so Google understands your topical authority.

### The Hub and Spoke Model

For each content pillar, build:

- **Hub page:** A comprehensive guide on the broad topic *(e.g., "The Complete Guide to YouTube SEO for Small Businesses")*
- **Spoke posts:** Focused articles on specific subtopics that link back to the hub *(e.g., "YouTube Tags: Do They Still Matter?", "YouTube Shorts vs Long-Form: Which Drives More Traffic?")*

Every spoke links to the hub. The hub links to every spoke. This web of internal links signals topical authority to Google and keeps readers moving through your site.

When generating a new post idea, always ask: **which hub does this belong to?** If it doesn't fit any existing hub, either create a new one or reangle the post.

### The 80/20 Content Mix

Aim for 80% evergreen, SEO-optimized library content that compounds in value over time. The other 20% can be timely and opinionated — Sathya's takes on industry shifts, responses to trends, quick insight pieces. Evergreen posts do the traffic heavy-lifting. Opinion pieces keep the blog human.

### Prune Regularly

Not every post earns its keep. Periodically review for posts getting almost no traffic and no conversions. Refresh them, merge them into stronger posts, or remove them. Weak pages dilute your site's authority. Pruning the weak branches makes the strong ones grow faster.

---

## 3. HOW TO WRITE POSTS THAT PERSUADE AND HOLD ATTENTION

Two problems kill blog posts: the reader isn't convinced, or the reader stops reading. These techniques solve both.

### Opening: The TAS Pattern

Every blog post introduction should follow Thesis-Antithesis-Synthesis:

- **Thesis:** Start with something the reader already believes. This builds trust.
- **Antithesis:** Complicate it. Why does the accepted wisdom fall short? Readers already have objections — voice them first.
- **Synthesis:** Resolve the tension with your stronger perspective. This is where your real point lives.

*Example flow: "Most Shopify stores focus on driving more traffic (thesis). But traffic without conversion is just vanity metrics — and most stores have a conversion problem, not a traffic problem (antithesis). Here's how to diagnose which one you actually have (synthesis)."*

Even in how-to posts, use mini-TAS loops within sections: "Most people do X. Here's why that breaks down. Here's what works instead."

### Opening Alternative: The APP Method

For simpler posts where TAS feels heavy:

- **Agree:** Open with something the reader feels or believes.
- **Promise:** Give them a glimpse of a better outcome.
- **Preview:** Tell them exactly what's coming.

### Keeping Attention: Bucket Brigades

Short transitional phrases that pull the reader into the next paragraph. Place them wherever attention might drop — usually between sections or after dense explanations:

- "Here's the thing:"
- "But there's a catch."
- "So what does this actually mean for your business?"
- "Here's where it gets interesting."
- "Now, you might be thinking..."

Use 4-5 per post. Don't force them.

### Psychology Principle: The Peak-End Rule

People judge content by two moments: the peak (the most interesting or surprising point) and the end. Not the average quality throughout. This is why the Style Guide places such emphasis on the first sentence and the closing line — they are the two moments the reader carries away.

In practice: every post needs a clear peak — one section, stat, or insight that is genuinely surprising or unusually specific. If no section stands out, the post is forgettable even if it's technically correct. The closing sentence is the last thing the reader remembers. Make it sharp.

### Psychology Principle: Loss Aversion Framing

Readers are more motivated by what they stand to lose than by what they might gain. Benefit-led writing ("here's what you'll achieve") is weaker than loss-led writing ("here's what's happening to businesses that aren't doing this").

Use loss framing deliberately — particularly in intros and in the "What to do this week" closing. Not every section needs it, but at least one moment per post should make inaction feel costly. Example: instead of "YouTube helps you generate leads," write "Every week you're not on YouTube, a competitor with worse expertise is ranking for the exact queries your prospects are typing."

### Psychology Principle: Status-Quo Bias

Readers default to doing nothing. The path of least resistance is to close the tab and carry on as before. Content that only makes action feel attractive is not enough — it must also make inaction feel uncomfortable.

Concretely: after presenting a solution or framework, name the cost of not acting. Not in a manipulative way — in an honest, specific way. "The businesses that skip this step typically see X." If you don't have a real example, describe the pattern honestly. Status-quo bias is broken by making the current situation feel unstable, not just by making the alternative look appealing.

For paragraph rhythm, formatting, sentence-level style, and structural patterns: follow the Style Guide.

---

## 4. WRITING PRINCIPLES: WHAT MAKES SELLONTUBE CONTENT DIFFERENT

These four principles separate content that builds a business from content that fills a blog.

### Share What Only You Can Share

SellonTube works across YouTube SEO, Shopify optimization, Klaviyo, and content strategy for multiple clients. That cross-pollination is your edge. Write about patterns you see across clients (anonymized), frameworks you've developed, and counterintuitive lessons from real projects.

The test: if any other consultancy could publish the same post, it's not distinctive enough.

### Skip the Basics

Don't waste posts on surface-level advice that exists in a hundred other places. Focus on hard problems, interesting edge cases, and the specific insight that makes a reader think differently.

The goal is hyper-specificity. Not "how to do YouTube SEO" but "why your YouTube Shorts get views but don't drive website signups." Specific beats comprehensive every time.

### Teach Principles, Not Just Tactics

Behind every useful tactic, there's a more useful principle. Don't just tell readers what to do — help them understand why it works, so they can adapt.

The difference: "Post YouTube Shorts 3x per week" (tactic) vs. "Short-form content works as a discovery mechanism because the algorithm surfaces it to non-subscribers — here's how to design Shorts that convert viewers into website visitors" (principle).

Posts that teach principles make readers smarter. Smart readers trust and return.

### Show Your Thinking, Not Just Your Advice

This is how content sells without selling. When a post about YouTube thumbnail optimization reveals the analytical process SellonTube uses with clients — how you look at click-through rate data, how you A/B test, what patterns you've seen — the reader gets genuinely useful advice. They also realize this team clearly knows what they're doing.

Every post should demonstrate competence through the content itself, not through a CTA at the bottom.

### The Quality Bar

Would SellonTube be proud to share this post on LinkedIn with their name attached? If not, it needs more work or should be shelved. One excellent post per week outperforms three mediocre ones. Mediocre posts dilute your brand. Excellent ones get shared, earn links, and build the reputation that makes everything else easier.

---

## 5. SEO CRAFT: ON-PAGE RULES

These are the mechanical SEO requirements for every post:

**Keyword placement:** Target keyword must appear in the headline, first 100 words, at least one H2, and the meta description. Use it 3-5 times naturally throughout.

**URL slugs:** Short and keyword-rich. No dates. *Example: /youtube-seo-shopify*

**Meta descriptions:** Under 155 characters. Directly address what the reader will learn or solve. Include the keyword.

**Featured snippet target:** Write one section as a direct, concise answer (40-60 words) that Google could pull as a snippet.

**FAQ section:** End with 3 questions pulled from "People Also Ask" related to the keyword.

**Related keywords:** Include 2-3 naturally throughout to signal topical depth.

**Internal links:** Every post should link to 2-3 other relevant SellonTube posts and suggest which existing posts should link back to this one.

---

## 6. CONTENT FORMATS: SUSTAINING A 1 POST PER WEEK CADENCE

Not every post needs to be a 3,000-word thought leadership piece. These formats produce strong results with less effort:

**Meta content:** Use your own experiences as the primary source. A campaign you ran, a lesson learned, a process you developed. No external research needed — you're the expert.

**Cross-cutting:** Look through existing posts for themes that keep appearing. If "content repurposing" shows up across 5 posts, it deserves its own dedicated article.

**Content refreshes:** Revisit older posts that have lost traffic. Update data, add new sections, fix outdated advice. Faster than writing from scratch, and can recover lost rankings. **AI citation freshness rule:** ChatGPT cites content updated within 30 days 3.2x more than older content. Any post targeting a competitive keyword must be reviewed and updated at least every 90 days. Posts in core clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`) must be reviewed monthly. Adding a new section, updating a stat, or adding a FAQ question counts as an update. Changing the `publishDate` without adding content does not.

**Roundups with an angle:** Instead of generic "top 10" lists, curate with a point of view. "5 YouTube SEO mistakes we keep seeing in Shopify store channels" beats "5 YouTube SEO tips."

**Spin-offs:** Take one section from a long guide and expand it into its own 1,000-word post.

**Case studies:** When publishing client success stories — make lessons generalizable (explain what type of business and why the approach transfers), show your thinking process (not just results), editorialize ruthlessly (focus on the 2-3 most interesting decisions), and use data to support narrative, not replace it.

**Branded concepts:** Name your frameworks. Sathya's "insight marketing" should be defined in a dedicated post. Any repeatable process you use with clients deserves a memorable name and its own reference article. Branded concepts become searchable over time, creating traffic you own completely.

---

## 7. DISTRIBUTION: BEYOND PUBLISH AND PRAY

Writing great posts is necessary but not sufficient. Before investing time in a post, plan how it reaches your audience.

**Before writing, ask:**

- **Where will this be shared?** If the answer is "nowhere beyond the blog," reconsider the topic or angle.
- **Can this be repurposed?** A blog post can become a LinkedIn carousel, a YouTube script, a newsletter edition, or a Twitter thread. Plan this at the writing stage.
- **Who will amplify it?** Will Sathya post it on LinkedIn? Can Gautam email it to subscribers? Will a client share it?

**Find your underutilized channels:**

Map your channels by potential (how much reach they have with your ideal reader) and utilization (how well you're currently using them). You'll likely find underutilized channels — Sathya's LinkedIn, a dormant email list, a YouTube channel with existing subscribers — that could deliver more ROI than chasing new SEO keywords.

SEO drives long-term compounding traffic. But newsletters, LinkedIn, and social build direct audience relationships that protect you when algorithms shift.

---

## 8. AI WORKFLOW

Blog posts follow the Agent 04 workflow: keyword brief → outline (user approval) → full draft → Agent 05 QA → publish. Never skip the outline approval step. Never outsource original opinions, real client stories, or topical judgment to AI.

---

## 9. QUALITY CHECKLIST — USE BEFORE EVERY PUBLISH

Run every post through these checks before handing it to Gautam.

**STRATEGY:**
- [ ] Business Potential score is 2 or 3
- [ ] Search intent matches (checked the 3 Cs: type, format, angle)
- [ ] Funnel position is clear (top, middle, or bottom)
- [ ] Post belongs to a content hub
- [ ] Distribution plan exists (LinkedIn, newsletter, repurposing)

**PERSUASION:**
- [ ] Introduction follows TAS or APP pattern
- [ ] Counterarguments are acknowledged
- [ ] Post changes how the reader thinks, not just what they know

**READABILITY & STYLE:**
- [ ] Passes all Style Guide checks (Fixes #1-17)
- [ ] 4-5 bucket brigades at natural attention dips
- [ ] Most important information is front-loaded

**VALUE:**
- [ ] Every section has at least one specific example, number, or real scenario
- [ ] Post teaches a principle, not just a tactic
- [ ] Only SellonTube could have written this (not generic)
- [ ] Reader is genuinely better off after reading

**SEO:**
- [ ] Target keyword in headline, first 100 words, one H2, meta description
- [ ] URL slug is short and keyword-rich
- [ ] Featured snippet section included (40-60 words)
- [ ] 2-3 related keywords used naturally
- [ ] FAQ section with 3 "People Also Ask" questions
- [ ] 2-3 internal links to other SellonTube posts

**AI QUALITY GATE:**
- [ ] No fabricated statistics or case studies (see Style Guide Fix #7)
- [ ] Every section answers "so what does this mean for the reader's business?"
- [ ] Sathya would be proud to share this on LinkedIn

---

## SOURCES

This playbook synthesizes principles from:
- Animalz: Thesis-Antithesis-Synthesis, bottom-of-funnel thought leadership, second-order pain points, content strategy, library vs. publication, topic clusters, distribution-first strategy, low-effort/high-impact formats, case study writing, and the Animalz editorial strategy
- Backlinko: APP Method, Bucket Brigades, SEO copywriting, UX signals, branded keywords, and on-page optimization
- Ahrefs: AI content workflows, product-led content, business potential scoring, search intent matching, and SaaS content marketing strategy
