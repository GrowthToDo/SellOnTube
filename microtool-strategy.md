# SellonTube: Blog Velocity Strategy
*Drafted 2026-03-02. Updated 2026-04-06.*

> **For all microtool strategy, pipeline, build standards, and publishing workflow, see [`agents/08-microtool-builder.md`](agents/08-microtool-builder.md).** That is the single source of truth for tool-related strategy and operations. This file covers blog velocity only.

---

## Blog Velocity Strategy

### Safe Cadence for This Site

Google's Helpful Content system flags the **ratio of low-quality to high-quality content**, not the cadence itself. The risks are:
- Thin content dilution — generic posts lower site-wide quality signal
- Topical incoherence — unrelated subtopics signal content farm
- AI fingerprint — no first-person experience, no original data, no named expertise

**Safe cadence:** 3–4 posts/month now. After month 6 (September 2026), can push to 8–10/month with established topical authority.

---

### Topical Cluster Architecture

**Updated 2026-03-21 — cluster priority reordered based on DataForSEO keyword intelligence.**

6 clusters, all under the theme "YouTube for B2B customer acquisition":

| Priority | Cluster | Sub-topic | Existing posts | Winnable keywords | Action |
|---|---|---|---|---|---|
| **1** | 3 | YouTube SEO for business | **None** | 8 (top vol: 4,400) | Write now — highest volume + lowest KD |
| **2** | 2 | Topic research and strategy | 1 post | 2 | Continue building out |
| **3** | 1 | Economics of YouTube acquisition | 1 post | 3 | Continue building out |
| **4** | 4 | Niche application (industry posts) | None | low | After Clusters 3+2+1 are covered |
| **5** | 5 | Comparison and alternatives | None | low | After authority builds |
| **6** | 6 | Case studies and data | 1 post | 1 | 1 per 6–8 weeks, backlink play |

**Why Cluster 3 first:** DataForSEO confirms "youtube seo tools" (4,400 vol, KD 23) and "youtube seo services" (1,600 vol, KD 10) are the two highest-value winnable keywords on the entire site. Zero competition in the B2B angle. No existing blog post covers this. This cluster also powers Tool 1 (YouTube SEO Checker) — blog + tool launch together.

**Clusters 4 and 5** have low winnable keyword volume for now. Write them after Clusters 1–3 are covered and the site starts accumulating authority from the easier wins.

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
