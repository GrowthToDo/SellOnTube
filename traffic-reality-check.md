# Traffic Reality Check

**Established:** 2026-07-21 from live GSC + GA4 pulls.
**Status:** Active reference. Re-verify before any traffic, keyword, or tool decision.

## Why this document exists

SellonTube's headline SEO numbers are misleading by roughly 30x. Impressions grew 60x since
March, and almost none of that growth is reachable human demand. Three separate projects have
now been scoped off impression counts and delivered nothing (2026-06-30 titles, 2026-07-17
internal linking, 2026-07-21 rank-checker consolidation).

This document records what is actually true, so the next decision starts from reality.

**Use it to answer:** which direction to go, which keywords to optimise, which tools to build.

---

## Finding 1: The West does not click. The rest of the world does.

90 days (2026-04-22 to 2026-07-19), all pages:

| Segment | Impressions | Clicks | CTR |
|---|---|---|---|
| West (US, UK, CA, AU, DE, FR, NL, IE, NZ, Nordics, CH, AT, BE, ES, IT) | 89,595 | **22** | 0.025% |
| Non-West (mostly IN, PK, BD, ID, PH) | 9,367 | **98** | 1.046% |

Excluding `/tools/youtube-ranking-checker` barely changes it: West 37,196 impressions to 19
clicks (0.051%). So this is not one bad page. It is the entire western footprint.

13 western pages carry more than 300 impressions each and have **zero clicks**, totalling
30,918 impressions.

---

## Finding 2: It is not AI Overview. It is bot traffic.

CTR at matched position removes ranking as an explanation:

| Position band | West CTR | Non-West CTR |
|---|---|---|
| 1-3 | 1.10% | 3.10% |
| 4-10 | 0.28% | 1.47% |
| 11-20 | **0.03%** | 1.54% |
| 21-30 | 0.01% | 0.34% |
| 31+ | 0.01% | 0.32% |

**The test that rules out AI Overview:** if AIO were suppressing western SERPs site-wide,
`/tools/youtube-transcript-generator` would also earn zero in the West. It earns **1.19%**
(1,010 impressions, 12 clicks), and **8.51% on US mobile**. Western SERPs work fine.

**What the zero-click pages actually have.** Every western query ranking in the top 10 with
meaningful impressions is machine-shaped, not human-shaped:

| Country | Query | Impr | Clicks | Pos |
|---|---|---|---|---|
| usa | youtube scriptwriting for b2b lead generation | 1,758 | 0 | 8.4 |
| nld | youtube ranking tool | 164 | 0 | 7.8 |
| nld | perfect youtube script structure for business videos | 142 | 0 | 6.3 |
| deu | perfect youtube script structure for business videos | 102 | 0 | 5.7 |
| nzl | ryrob youtube tag generator | 98 | 0 | 6.7 |
| dnk | youtube rank tool | 59 | 0 | 8.9 |
| che | keyword intent.io youtube | 43 | 0 | 7.4 |

Humans do not search "youtube scriptwriting for b2b lead generation" 1,758 times per quarter.
The same hyper-specific phrases recur across NL, DE, IT, DK, CH, NZ, which is **datacenter
geography, not market geography**. The tail contains obvious machine output
("ask rank tracker youtube app", "accurate rank tracker free youtube", "27643: rankings by
keyword"). These are rank-tracker queries, ours or competitors'.

### The worked example: `/tools/youtube-ranking-checker`

90 days: **55,790 impressions, 41 clicks (0.073%)**. It holds 48% of all site impressions.

| Country | Impr | Clicks | Pos |
|---|---|---|---|
| usa | 38,722 | **0** | 34.4 |
| gbr | 7,836 | **0** | 31.1 |
| dnk | 2,738 | **0** | 18.6 |
| can | 1,849 | **0** | 37.0 |
| ind | 2,010 | 13 | 41.2 |
| pak | 124 | 3 | 10.1 |

**51,145 impressions across US/UK/DK/CA produced 0 clicks in 90 days.**

The decisive test: this cluster genuinely held US position 5-7 for nine consecutive days
(2026-06-27 to 07-05), verified at daily granularity, stable and not bimodal.

| Query (USA only, Jun 27 to Jul 5) | Impr | Clicks | Pos |
|---|---|---|---|
| youtube keyword rank checker | 317 | **0** | 6.4 |
| youtube keyword ranking checker | 311 | **0** | 7.5 |
| youtube tag rank checker | 48 | **0** | 5.1 |
| youtube tags rank checker | 41 | **0** | 5.5 |

**717 US impressions at position 5-7, zero clicks.** Ranking better in this cluster has already
been tested and produces nothing. Do not spend on it again.

---

## Finding 3: The real audience, and the real baseline

GA4 organic sessions, 90 days:

| Country | Sessions |
|---|---|
| India | 226 (59%) |
| **United States** | **46** |
| Pakistan | 22 |
| Bangladesh | 16 |
| Indonesia | 12 |
| Germany | 11 |
| Canada / UAE | 7 each |
| France / Philippines / UK | 6 each |
| **Entire West combined** | **~76** |
| Total (top 15) | 384 |

**Western traffic is a 0-to-1 build from ~76 sessions per quarter, not a pivot of 89,595
impressions.** Any plan written against the impression number is wrong by ~30x.

---

## What actually earns clicks

28 days to 2026-07-19, by page type:

| Type | Pages | Impressions | Clicks |
|---|---|---|---|
| Tools | 14 | 36,880 | 139 |
| Blog | 53 live | 20,661 | 22 |
| pSEO (`/youtube-for`, `/youtube-vs`) | 53 | **162** | **1** |

Tools out-earn posts roughly 15x per page. pSEO is a null result after months: 53 pages,
162 impressions, 1 click. **Do not expand pSEO.**

Proven western performers:

| Page | West impr | West clicks | West CTR |
|---|---|---|---|
| `/tools/youtube-transcript-generator` | 1,010 | 12 | 1.19% (8.51% US mobile) |
| `/tools/youtube-autocomplete-keywords` | 115 | 2 | 1.74% |

The pattern that works: **free, instant, no-signup utility, mobile-friendly.** The transcript
generator wins specifically on "free / no sign up" query phrasing.

---

## Finding 4: The business needs ~10 buyers, not 10,000 visitors

What the site actually sells today (verified in `dist/` 2026-07-21):

| Offer | Price | Page |
|---|---|---|
| Agency retainer (Foundation / Growth / Scale) | $2,500 / $5,000 / $7,500 per month, 4-month minimum | `/pricing` |
| Self-serve product (Explorer / Research / Strategy) | Free / $49 / $199 per month | `/product-pricing` |

**One Foundation client is worth $10,000 minimum.** The revenue model needs roughly 5 to 10
qualified conversations per year. It does not need volume.

This reframes the whole traffic question. Utility-tool traffic (creators and students grabbing
a free transcript) converts to neither offer. Not "not yet." Structurally never.

Money-page performance, 90 days:

| Page | Impr | Clicks | Pos |
|---|---|---|---|
| `/` (homepage) | 262 | **27** | 6.7 |
| `/pricing` | 290 | 2 | 14.5 |
| `/how-it-works` | 67 | 2 | 4.4 |
| `/product-pricing` | **2** | 0 | 5.5 |

The homepage converts at 10.3%, the best on the site, almost certainly on brand and
navigational queries. The pages that sell the $10k offer draw ~360 impressions per quarter.

### Contradiction to resolve

`growth-strategy.md` line 15 states: *"No services/agency content. SellonTube is a product
company. All content builds traffic for the product, not for selling YouTube SEO services or
agency work."*

The live `/pricing` page is titled **"YouTube Marketing Agency for B2B"** and sells retainers
from $2,500/month. The documented strategy and the actual business disagree. Every content
decision inherits this ambiguity until it is settled.

Related: `docs/icp.md` explicitly excludes "hobbyist creators and YouTubers" from the audience,
which is precisely who the best-performing tool attracts.

---

## Finding 5: The operating hypothesis, and what the tool data says about it

**Stated by the founder, 2026-07-21. This is the project's north star.**

> SEO exists to grow traffic to the site and then to the tools. Traffic volume, quality and
> geography then decide which tool earns a paid v2 at $19-29/month, gated behind pricing.
> The agency is networking-driven and is NOT the SEO target. Western traffic (US, UK, EU, AU)
> is the qualifying signal; South Asian traffic is assumed unlikely to convert to a paid tool.

Note: `growth-strategy.md` line 15 ("no services/agency content, all content builds traffic for
the product") is **consistent** with this and is correct. The conflict is that `/pricing` is
titled "YouTube Marketing Agency for B2B" and occupies the main nav, burying `/product-pricing`
(2 impressions in 90 days).

### GA4 tool sessions by geography, 90 days (all channels)

| Tool | West | Rest | West % | Avg duration |
|---|---|---|---|---|
| youtube-transcript-generator | 23 | 41 | 36% | **31s** |
| **youtube-description-generator** | **17** | 3 | **85%** | 87s |
| youtube-ranking-checker | 10 | 70 | 12% | 93s |
| youtube-video-ideas-generator | 6 | 40 | 13% | 50s |
| youtube-autocomplete-keywords | 5 | 30 | 14% | 154s |
| youtube-roi-calculator | 4 | 5 | 44% | **238s** |
| youtube-channel-audit | 2 | 20 | 9% | 24s |
| youtube-seo-tool | 2 | 3 | 40% | **268s** |
| youtube-script-generator | 1 | 6 | 14% | 159s |
| **ALL TOOLS** | **77** | **237** | **25%** | |

### Conflicts with the hypothesis

1. **Both named v2 candidates score worst on the founder's own criteria.** The transcript
   generator is 36% western with the shortest engagement on the site (31s): grab and leave.
   The script generator has **1 western session in 90 days**, and its apparent US demand
   ("youtube scriptwriting for b2b lead generation", 1,758 impressions at pos 8.4, 0 clicks)
   is bot traffic per Finding 2.
2. **The best geographic match is unlisted.** `youtube-description-generator` is **85% western**
   (Germany 11, UK 3, US 3) at 87s engagement.
3. **Deepest engagement sits on starved pages.** `youtube-seo-tool` (268s) and
   `youtube-roi-calculator` (238s) hold attention but get almost no traffic.
4. **"Free / no sign up" is the transcript generator's winning intent.** Its ranking queries are
   literally `free youtube transcript generator no sign up`. That intent self-selects against
   paying or even registering. Monetising it fights its own traffic.
5. **The experiment cannot run yet.** 77 western sessions across 14 tools, and zero GA4
   conversion events. There is no way to distinguish a three-time tool user from a bounce.
6. **`docs/icp.md` conflicts.** It excludes hobbyist creators and defines clients at $5k-50k
   LTV. A $19-29/mo tool serves a different person. Needs a product ICP separate from the
   agency ICP.

### CORRECTION (founder, 2026-07-21): the tools are lead magnets, not the product

The free tools are **not** what gets sold at $19-29. They exist so western visitors discover the
site, explore other tools, and eventually convert to a paid product yet to be defined.

This changes the success metric. Not "would this tool's users pay for this tool" but
**"does this tool bring western visitors who then explore the rest of the site."**

### Finding 6: lead-magnet quality (GA4, 90 days) — extractive vs diagnostic

| Tool | Sessions | Engaged | Pages/session | West sess | West pg/sess |
|---|---|---|---|---|---|
| youtube-ranking-checker | 80 | **41%** | **1.82** | 10 | **2.50** |
| youtube-autocomplete-keywords | 35 | 29% | 1.97 | 5 | 2.00 |
| youtube-video-keyword-finder | 12 | 25% | 2.08 | 3 | 1.67 |
| youtube-channel-audit | 22 | 27% | 1.36 | 2 | 1.50 |
| youtube-description-generator | 20 | 20% | 1.20 | 17 | 1.18 |
| youtube-video-ideas-generator | 46 | 13% | 1.30 | 6 | 1.00 |
| **youtube-transcript-generator** | 64 | **8%** | **1.09** | 23 | 1.13 |

Benchmark: `/` 56% engaged, 2.62 pages. `/tools` 67%, 3.04 pages.

**THE DESIGN PRINCIPLE — extractive tools kill discovery, diagnostic tools create it:**

- **Extractive** (transcript, description, tags): user wants an artifact, receives it, job done,
  leaves. 8-20% engagement, ~1.1-1.2 pages/session.
- **Diagnostic** (where do I rank, what should I target, how is my channel doing): the answer
  raises a new question, so exploration continues. 25-41% engagement, 1.8-2.1 pages/session.

**Consequences:**
- The transcript generator is the site's **worst** lead magnet despite the most traffic. ~92%
  grab and leave. It fails because it succeeds too fast.
- The ranking checker is the **best** lead magnet on the site. Note the split verdict: its search
  *impressions* are bot-inflated and worthless (Finding 2), while its actual human *visitors* are
  the most engaged on the site. Stop chasing its impressions; keep and extend the tool.
- The description generator has the best geography (85% western) but is extractive, so it does
  not convert that geography into exploration.

**Build diagnostic tools for western audiences.** That is the intersection that serves the
lead-magnet model.

Confidence: all-geography figures (n=64 to 80) are reliable. Western splits (n=10 to 23) are
directional only.

### The unlock: test willingness-to-pay without waiting for volume

A price-anchored waitlist on each tool ("Pro, $19/mo, join waitlist") measures intent-to-pay
**segmented by geography** at current traffic levels. It tests the core hypothesis in weeks
rather than quarters and works fine at 77 sessions.

**Correct sequence:** instrument events → add price-anchored demand test → then grow traffic on
tools that already skew western. Growing first and instrumenting later discards the signal from
every session in between.

---

## The unresolved strategic fork

Traffic and buyers are not the same audience here, and the data cannot decide this for you.

- **Utility tools** (transcript generator pattern) demonstrably earn western clicks. But
  "free youtube transcript generator no sign up" searchers are creators and students. They
  click and will not buy either offer.
- **ICP-matched B2B queries** reach people who might pay, but the demand barely exists.
  "youtube business plan" draws 148 US impressions per quarter.

## Decisions made (2026-07-21)

1. **Business model.** Agency is the main revenue today but is **networking-driven and not the
   SEO target**. The website is optimised for the product. `growth-strategy.md` line 15 stands
   and is correct.
2. **Tools are lead magnets, not the product.** Nothing in the current tool set is intended to
   sell at $19-29. They exist to pull western visitors into the site.
3. **Success metric for a tool = western visitors who then explore**, not tool traffic and not
   tool-specific willingness to pay.
4. **Next move: add a diagnostic layer to the transcript generator.** It already delivers the
   most western sessions (23 in 90d) but leaks ~92% of them at 1.13 pages/session. Converting
   the site's best western acquisition magnet from extractive to diagnostic is higher leverage
   than starting a new tool at zero traffic. Per Finding 6, the diagnostic layer is the
   mechanism that turns arrival into exploration.

### Superseded

- "Volume now, buyers later" (Q1/Q2, 2026-07-21) was collected before Findings 4 and 6 and
  before the lead-magnet correction. Superseded by the decisions above.
- Transcript generator and script generator as **paid v2 candidates** — withdrawn by the
  founder; the tools were never meant to be sold individually.

## Still open

- [ ] What the eventual paid product actually is. Deliberately deferred until traffic quality
      and geography data can inform it. This is the correct call, but it stays open.
- [ ] Whether the ICP splits into a product ICP and an agency ICP (`docs/icp.md` currently
      excludes the creator audience the tools attract).
- [ ] Whether `/pricing` should stop being the agency page in main nav, given that agency is
      networking-driven and `/product-pricing` draws 2 impressions per quarter.
- [ ] GA4 conversion events. Still zero. Every metric above is session-level only; there is no
      behavioural data (tool runs, repeat use, onward clicks).

---

## Rules this establishes

1. **Never scope work from impressions on this site.** Measure clicks, or GA4 sessions.
   Impressions here are ~90% non-human in western markets.
2. **Before optimising any page, check clicks-at-position split by country.** A page can hold
   position 5 in the US and be worth exactly nothing.
3. **State the mechanism before building.** If the proposed work cannot move the specific
   constraint on the specific page, re-scope. Ranking work cannot fix a page whose impressions
   are bots.
4. **The West is a new build, not an optimisation.** Baseline ~76 sessions per quarter.

---

## How to reproduce

Credentials `scripts/credentials.json`; GSC property `sc-domain:sellontube.com`;
GA4 property `522074510`.

The three queries that produced this document:
1. GSC `dimensions=['country','page']`, 90 days, aggregate West vs non-West on clicks.
2. GSC `dimensions=['country','query']`, bucket by position band, compare CTR at matched
   position. This is the test that isolates bot traffic from ranking problems.
3. GSC `dimensions=['date']` filtered to a single query, to check whether an average position
   is stable or bimodal before trusting it.

Existing helpers: `scripts/gsc_analysis.py`, `scripts/gsc_deep.py`, `scripts/gsc_session_jul20.py`.

---

## Documents this invalidates or corrects

- **`ranking-checker-amplification-strategy.md`** — premise dead. It was written off a
  176-impression sample and recommended two supporting blog posts. Those posts
  (`best-youtube-rank-checker-tools-for-business`, `how-to-check-youtube-rankings`) now
  cannibalise the tool across ~60 queries, and the whole cluster earns 0 western clicks.
  Do not execute anything further from it.
- **Broken doc paths.** `CLAUDE.md` and the auto-memory point to `docs/seo/ai-seo-guide.md`,
  `docs/blog/blog-production-standard.md`, `docs/strategy/growth-strategy.md`. None exist.
  The real files are at repo root (`ai-seo-guide.md`, `blog-production-standard.md`,
  `growth-strategy.md`, `seo-rules.md`, `seo-audit-log.md`, `content-depth-framework.md`).

## Related

`mistakes-lessons.md` (2026-06-30, 2026-07-17, 2026-07-21 entries), `growth-strategy.md`,
`research/keywords/sot_master.csv`.
