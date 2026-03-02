# SellonTube: Microtool + Blog Velocity Strategy
*Drafted 2026-03-02. Goal: high-quality organic traffic from B2B ICP without Google flags.*

---

## Part 1: Microtool Strategy

### The Core Positioning Gap

Every existing YouTube tool (VidIQ, TubeBuddy, Kapwing, Headliner) is built for the **creator mindset** — optimising for views, subscribers, and engagement. None frame their output in terms of customer acquisition, LTV, buyer intent, or B2B conversion.

That gap is the entire opening. Every SellonTube tool should use **acquisition-first framing** — the output teaches the SellonTube methodology by demonstration.

---

### Build Sequence (Priority Order)

| # | Tool | Slug | Type | Est. Monthly Queries | ICP Fit | Feasibility |
|---|---|---|---|---|---|---|
| 1 | YouTube Channel Audit for B2B | `/youtube-channel-audit` | Client-side JS | 3,000–6,000 | 5/5 | 5/5 |
| 2 | YouTube vs. Blog Calculator | `/youtube-vs-blog-calculator` | Client-side JS | 2,000–4,000 | 5/5 | 5/5 |
| 3 | YouTube Script Outline Generator | `/youtube-script-outline` | Client-side JS | 8,000–15,000 | 4/5 | 5/5 |
| 4 | YouTube Topic Fit Checker | `/youtube-topic-fit` | Client-side JS | 1,000–2,500 | 5/5 | 5/5 |
| 5 | YouTube Title Analyzer | `/youtube-title-analyzer` | Netlify Function + Claude API | 4,000–8,000 | 5/5 | 4/5 |
| 6 | YouTube Topic Idea Generator | `/youtube-topic-generator` | Netlify Function + Claude API | 3,000–7,000 | 5/5 | 4/5 |
| 7 | YouTube Channel Description Generator | `/youtube-channel-description` | Netlify Function + Claude API | 2,000–5,000 | 4/5 | 4/5 |

**Note:** The existing ROI Calculator (`/youtube-roi-calculator`) is already Tool 0. All new tools follow its architecture.

---

### Tool Specs

#### Tool 1: YouTube Channel Audit for B2B
**Target query:** "YouTube channel audit tool" / "YouTube channel audit for business"

**What it does:** User answers 8 scored questions (posting frequency, topic focus, view duration, subscriber count, conversion goal, whether they target search-intent or trending topics, whether every video has a CTA, whether they have email capture). Pure client-side scoring matrix outputs an **"Acquisition Readiness Score"** 0–100 with 4 category breakdowns: Topic Strategy, Conversion Setup, Content Consistency, Search Optimisation. Each category gets a rating + 1-sentence action note.

**Email gate:** Show total score immediately. Gate the per-category breakdown behind email submit.

**Why it wins:** "Acquisition Readiness" is a framing that no other tool uses. SaaS founders understand it instantly. VidIQ scores "channel health" — a meaningless metric for someone trying to acquire customers.

**Backlink mechanism:** "Best YouTube tools for business" roundups will pick this up specifically because the framing is categorically different.

---

#### Tool 2: YouTube vs. Blog Calculator
**Target query:** "YouTube vs blog for marketing" / "should I start a YouTube channel or blog" / "YouTube or blog for SaaS"

**What it does:** Answers "given my content effort budget, should I allocate to YouTube or blog?" User inputs blog output per month, time per post, current organic blog traffic, lead rate from blog. Tool outputs comparison table: expected compounding performance of equivalent YouTube investment vs. blog at current trajectory — at 6, 12, 18 months. Same client-side architecture as ROI Calculator.

**Cross-links:** ROI Calculator, Shopify case study post (`/blog/youtube-vs-blog-shopify-app-case-study`), pricing page.

**Backlink mechanism:** Very high. "YouTube vs blog" is a recurring link-magnet topic in SaaS marketing blogs.

---

#### Tool 3: YouTube Script Outline Generator
**Target query:** "YouTube script template" / "YouTube video script generator" / "how to write a YouTube script for business"

**What it does:** User enters topic, selects audience (SaaS founders / agencies / consultants / e-commerce), selects CTA type (book a call / free trial / download / watch next). Tool outputs a 5-section script outline: Hook, Problem framing, Solution walkthrough, Proof/Evidence, CTA. Each section has 2–3 fill-in-the-blank prompts tuned to the audience. 100% client-side template logic.

**Why it's differentiated:** Every other script template is structured around watch time and entertainment. This one is structured around a conversion goal. The difference is immediately obvious.

**Highest raw traffic** of all tools — worth building for volume even with mixed ICP fit.

---

#### Tool 4: YouTube Topic Fit Checker
**Target query:** "YouTube video ideas for business" / "is this a good YouTube topic"

**What it does:** User enters a potential topic. Client-side heuristic scores it on 5 criteria: Is it search-queryable? Is it specific enough to attract a qualified viewer? Does it imply a buyer decision? Is there a natural product fit for a business that solves this? Is it too broad/too narrow? Outputs a "Topic Strength Score" 1–10 with per-criterion feedback.

**Why it converts:** Someone who types "HubSpot vs Salesforce for B2B startups" as their test topic is already thinking at the right level. Very high conversion rate from tool user to warm prospect.

---

#### Tool 5: YouTube Title Analyzer (Buyer-Intent Score)
**Target query:** "YouTube title analyzer" / "YouTube title checker"

**What it does:** User pastes a YouTube title. Netlify Function sends to Claude API. Claude scores it on 4 dimensions: Search Queryability, Specificity, Buyer Intent Signal, Click-Worthiness for a professional. Returns score 1–10 per dimension with one-sentence feedback per dimension.

**Rate limiting:** 5 free analyses via localStorage session token, then email gate.

**Netlify Function:** ~30 lines of Node.js. Claude prompt is simple and response is fast (2–4 seconds).

---

#### Tool 6: YouTube Topic Idea Generator
**Target query:** "YouTube video ideas for business" / "YouTube content ideas for SaaS" / "B2B YouTube video topics"

**What it does:** User inputs industry/niche, ICP description, one sentence about their business. Claude generates 10 buyer-intent video topics, each structured as: the search query a buyer would type, the video title to use, the funnel stage it attracts. Output as formatted table.

**Rate limiting:** 10 free topic sets before email gate.

**Why it's unique:** Every other idea generator gives trending topics or entertainment content. This gives buyer-stage-mapped topics with query-matched titles. Will be shared within Indie Hackers, SaaS subreddits, founder communities.

---

#### Tool 7: YouTube Channel Description Generator
**Target query:** "YouTube channel description generator" / "YouTube about section for business"

**What it does:** User fills in business type, ICP, primary problem solved, conversion goal. Claude generates a 150-word channel description optimised for YouTube search + conversion, plus a one-sentence About tagline. Includes copy button.

---

### How These Tools Earn Backlinks

1. **Roundup inclusion** — "Best free YouTube tools for marketers" articles run regularly on HubSpot, CMI, SaaS blogs. Unique B2B framing = separate mention from creator-tool roundups.
2. **Social sharing within niche communities** — When a SaaS founder posts their "Acquisition Readiness Score: 34/100", others click. Social links convert to editorial links over time.
3. **Companion blog posts** — Each tool needs a methodology post ("How we score YouTube channel acquisition readiness"). These companion posts become natural link targets for anyone writing about YouTube strategy.

---

## Part 2: Blog Velocity Strategy

### Safe Cadence for This Site

Google's Helpful Content system flags the **ratio of low-quality to high-quality content**, not the cadence itself. The risks are:
- Thin content dilution — generic posts lower site-wide quality signal
- Topical incoherence — unrelated subtopics signal content farm
- AI fingerprint — no first-person experience, no original data, no named expertise

**Safe cadence:** 3–4 posts/month now. After month 6 (September 2026), can push to 8–10/month with established topical authority.

---

### Topical Cluster Architecture

6 clusters, all under the theme "YouTube for B2B customer acquisition":

| Cluster | Sub-topic | Existing posts | Gap |
|---|---|---|---|
| 1 | Economics of YouTube acquisition | ROI post | 5 more posts needed |
| 2 | Topic research and strategy | High-intent framework post | 5 more posts needed |
| 3 | YouTube SEO for business | **None** | Full pillar + 4 supporting posts needed |
| 4 | Niche application (industry posts) | **None** | 5+ posts needed |
| 5 | Comparison and alternatives | **None** | 4 posts needed |
| 6 | Case studies and data | Shopify case study | 3 more posts needed |

**Cluster 3 is the biggest gap** — zero posts on YouTube SEO mechanics despite being directly tied to every tool you're building.

---

### Cluster Post Lists

**Cluster 1 — Economics:**
- "YouTube ROI for SaaS: What a $12k/Year Channel Realistically Returns"
- "YouTube vs. Paid Ads for B2B: A Cost-Per-Lead Comparison With Real Numbers"
- "How Much Does a YouTube Customer Acquisition Channel Actually Cost to Run?"
- "When YouTube Does Not Work for Customer Acquisition (And What to Do Instead)"
- "The Break-Even Math: How Many Clients Do You Need to Justify YouTube?"

**Cluster 2 — Topic Research:**
- "How to Find YouTube Topics Your Competitors Are Not Covering"
- "The Difference Between Trending YouTube Topics and High-Intent Topics"
- "How to Use YouTube Search Autocomplete for B2B Topic Research"
- "What Makes a YouTube Topic 'High Intent' vs. 'High Volume'?"
- "5 Topic Research Mistakes B2B Companies Make on YouTube"
- "How to Map Your Product Features to YouTube Search Queries"

**Cluster 3 — YouTube SEO (NEW PILLAR NEEDED):**
- **Pillar:** "YouTube SEO for Business: A Non-Creator's Guide to Ranking for Buyer Queries"
- "How to Write YouTube Titles That Rank for Buyer-Intent Queries"
- "YouTube Video Descriptions That Work: Templates for B2B and SaaS"
- "YouTube Chapters and Timestamps: The Hidden SEO Signal Most Business Channels Ignore"
- "YouTube Thumbnail Strategy for Business Channels: Not Clickbait, But Not Boring"

**Cluster 4 — Niche Application:**
- "YouTube for SaaS: The 3 Video Types That Drive Demo Requests"
- "YouTube for Agencies: How to Use Video to Win Clients Who Are Already Evaluating You"
- "YouTube for Consultants: Why 'Personal Brand' Is the Wrong Frame"
- "YouTube for E-Commerce: The Bottom-of-Funnel Content Mix That Drives Purchase Decisions"
- "YouTube for Coaches: How to Attract High-Ticket Clients Through Search, Not Audience"

**Cluster 5 — Comparisons:**
- "YouTube vs. LinkedIn for B2B Lead Generation: Which One Compounds Faster?"
- "YouTube vs. Podcast for Customer Acquisition: A Practical Comparison for Service Businesses"
- "YouTube vs. Webinars: Which Format Produces Better Qualified Leads?"
- "YouTube vs. Cold Outreach: Why One Scales and One Doesn't"

**Cluster 6 — Case Studies (highest backlink potential, 1 per 6–8 weeks):**
- "How a $8k/Month YouTube Channel Replaced a Full SDR Team for One SaaS Startup"
- "3 SaaS Companies That Use YouTube for Customer Acquisition (And What Their Topics Have in Common)"
- "We Analysed 50 B2B YouTube Channels. Here Is What the Successful Ones Do Differently."
- "6 Months, 24 Videos, 14 Enterprise Leads: A B2B YouTube Channel Performance Breakdown"

---

### 6-Month Post Calendar (March–August 2026)

**March 2026**
1. "YouTube ROI for SaaS: What a $12k/Year Channel Realistically Returns" (Cluster 1)
2. "YouTube SEO for Business: A Non-Creator's Guide to Ranking for Buyer Queries" (Cluster 3 pillar)
3. "YouTube for Agencies: How to Use Video to Win Clients Who Are Already Evaluating You" (Cluster 4)
4. Launch: YouTube Channel Audit tool (`/youtube-channel-audit`)

**April 2026**
1. "How to Find YouTube Topics Your Competitors Are Not Covering" (Cluster 2)
2. "How to Write YouTube Titles That Rank for Buyer-Intent Queries" (Cluster 3)
3. "YouTube vs. LinkedIn for B2B Lead Generation: Which One Compounds Faster?" (Cluster 5)
4. "YouTube for SaaS: The 3 Video Types That Drive Demo Requests" (Cluster 4)

**May 2026**
1. "YouTube vs. Paid Ads for B2B: A Cost-Per-Lead Comparison With Real Numbers" (Cluster 1)
2. "The Difference Between Trending YouTube Topics and High-Intent Topics" (Cluster 2)
3. "YouTube Video Descriptions That Work: Templates for B2B and SaaS" (Cluster 3)
4. "We Analysed 50 B2B YouTube Channels. Here Is What the Successful Ones Do Differently." (Cluster 6)

**June 2026**
1. "How Much Does a YouTube Customer Acquisition Channel Actually Cost to Run?" (Cluster 1)
2. "How to Map Your Product Features to YouTube Search Queries" (Cluster 2)
3. "YouTube for Consultants: Why 'Personal Brand' Is the Wrong Frame" (Cluster 4)
4. "YouTube vs. Podcast for Customer Acquisition" (Cluster 5)

**July 2026**
1. "When YouTube Does Not Work for Customer Acquisition (And What to Do Instead)" (Cluster 1)
2. "YouTube Chapters and Timestamps: The Hidden SEO Signal Most Business Channels Ignore" (Cluster 3)
3. "YouTube for E-Commerce: The Bottom-of-Funnel Content Mix That Drives Purchase Decisions" (Cluster 4)
4. "6 Months, 24 Videos, 14 Enterprise Leads: A B2B YouTube Channel Performance Breakdown" (Cluster 6)

**August 2026**
1. "The Break-Even Math: How Many Clients Do You Need to Justify YouTube?" (Cluster 1)
2. "5 Topic Research Mistakes B2B Companies Make on YouTube" (Cluster 2)
3. "YouTube Thumbnail Strategy for Business Channels: Not Clickbait, But Not Boring" (Cluster 3)
4. "YouTube vs. Cold Outreach: Why One Scales and One Doesn't" (Cluster 5)

**By August 2026:** 40 total posts across 6 tightly clustered sub-topics + 7 tools live + 49 pSEO pages on drip = a site with genuine topical depth.

---

### AI Writing Without AI Fingerprints — 5 Rules

1. **Start every post with a first-person or observational hook.** Something structurally impossible for AI to generate without human input. "Last month, one of our clients closed a $40k contract from a YouTube lead. The video had 340 views."

2. **Every post must contain at least one number that doesn't appear in any other article on the same topic.** From your own client data, a specific calculation you ran, or an original analysis. This is the single highest E-E-A-T signal.

3. **Run the Style Guide grep check before publishing.** No em-dashes, no "Moreover/Furthermore/Additionally", no "Let's dive in", no triple adjective stacks, no summary paragraphs that restate. These are fingerprint-removal rules, not just style rules.

4. **Edit for voice, not just accuracy.** Read every paragraph aloud. Rewrite anything that sounds like "some best practices for YouTube content marketing." Target voice: direct, specific, slightly skeptical of conventional wisdom.

5. **Compress aggressively.** AI output is 20–30% longer than necessary. Cut every paragraph to its minimum. Short, high-density paragraphs do not read as AI-generated.

---

### Post Type Risk Table

| Post type | Spam risk | Link potential | Conversion potential |
|---|---|---|---|
| Economics / ROI posts | Low | Medium | High |
| Framework / how-to posts | Low | Medium | Medium |
| Niche application posts | Low | Low | Very high |
| Comparison posts | Low | Medium | High |
| Case studies with data | Very low | Very high | High |
| Tool roundups without unique angle | Medium | Low | Low |
| Listicles without original data | High | Very low | Low |

Avoid listicles and tool roundups without a genuinely B2B-specific angle that doesn't exist elsewhere.
