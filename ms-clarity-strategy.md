# Microsoft Clarity - Analytics Strategy for SellonTube

**Status:** Installed and linked to GA4
**Project ID:** w3uumrqmgd
**Dashboard:** https://clarity.microsoft.com/projects/view/w3uumrqmgd/
**GA4 Integration:** Connected (Property ID: 522074510)

---

## What is Microsoft Clarity?

A free behavioral analytics tool from Microsoft. No traffic limits, no sampling, no cost. It provides:

- **Session recordings** - replay exactly what a visitor did on your site
- **Heatmaps** - click, scroll, and area heatmaps per page
- **Smart signals** - auto-detected frustration (rage clicks, dead clicks, excessive scrolling, quick-backs)

## Why Clarity Matters for SellonTube

SellonTube has three content pillars: microtools, pSEO pages, and blog posts. GA4 tells us *what* happens (traffic, bounce rate, conversions). Clarity tells us *why* - the behavioral layer that GA4 cannot provide.

### 1. Microtools (ROI Calculator, SEO Tool, Transcript Generator, Topic Evaluator, Ideas Generator, Title Generator, Tag Generator)

**Problem we're solving:** We don't know if users complete the tool workflow or abandon midway.

**What Clarity reveals:**
- Exact drop-off points in multi-step tools (e.g., does the user fill in the ROI calculator fields but never click "Calculate"?)
- Whether AI-generated results (Gemini-powered tools) are being read or ignored
- Rage clicks on non-interactive elements - signals confusing UI
- Scroll depth on results pages - are users seeing the full output?

**Action framework:**
- If session recordings show users hesitating at a specific input field, simplify or add placeholder text
- If heatmaps show clicks concentrated on the top result only, consider reordering or trimming output
- If dead clicks appear on result text, users may expect it to be interactive - add copy buttons or expand/collapse

### 2. pSEO Pages (29 YouTube-For + 20 YouTube-Vs)

**Problem we're solving:** These are templated pages. We need to know if the template design actually engages visitors or if they bounce before reaching the CTA.

**What Clarity reveals:**
- Scroll depth - do visitors reach the compounding traffic chart? The buyer journey diagram? The CTA?
- Click patterns on the buyer journey fork diagram - are people engaging with it?
- Whether the "YouTube For [Niche]" pages perform differently from "YouTube Vs [Platform]" pages in terms of engagement
- Quick-back rate - did the visitor land and immediately hit back? (signals content/intent mismatch)

**Action framework:**
- If scroll depth drops sharply before the CTA, move the CTA higher or add an inline CTA earlier
- If a specific pSEO page has unusually high rage clicks, investigate for broken elements or confusing layout
- Compare engagement across niches to identify which templates resonate and which need rework

### 3. Blog Posts

**Problem we're solving:** We publish 1 post/week targeting winnable keywords. We need to know if readers engage deeply or skim and leave.

**What Clarity reveals:**
- Scroll depth per post - are readers finishing the article?
- Click heatmaps on inline CTAs and tool links embedded in posts
- Whether the `toolCta` banner (linking blog readers to related tools) gets clicks
- Dead clicks on images or diagrams (signals users expect interactivity)

**Action framework:**
- If scroll depth is consistently below 50%, hooks and intros need rework
- If toolCta banners get zero clicks, test different copy or placement
- If inline links to tools get more clicks than the banner CTA, double down on contextual linking

### 4. Conversion Path Optimization

**Problem we're solving:** SellonTube's goal is B2B leads booking a call via cal.com. We need to understand the path from landing to booking.

**What Clarity reveals:**
- Session recordings of users who reach the pricing page - do they scroll to the CTA or leave?
- Click patterns on pricing tiers - which plan attracts the most interest?
- Rage clicks or dead clicks on the pricing page (confusion signals)
- The journey: which pages do users visit before booking?

**Action framework:**
- If users click pricing but don't scroll to the booking CTA, the page is too long or the CTA isn't prominent enough
- Session recordings of "almost-booked" users (visited pricing, left without booking) reveal the friction point

---

## How We Access Clarity Data

### Automatic (via GA4 integration)
Clarity sends these custom dimensions into GA4:
- `clarityPlaybackURL` - direct link to session recording
- `clarityHeatmapURL` - link to page heatmap
- `claritySessionId` - unique session ID

These are queryable through our existing MCP server (`mcp_seo_server.py`), meaning we can correlate behavioral data with traffic sources, landing pages, and engagement metrics directly in Claude Code.

### Manual (dashboard exports)
For deeper analysis:
- Export CSV reports from Clarity dashboard
- Save to `research/clarity/` folder
- Analyze alongside keyword and GSC data

### In Clarity Dashboard
- **Recordings tab** - filter by page, frustration signal, or traffic source
- **Heatmaps tab** - toggle between click, scroll, and area maps per URL
- **Insights tab** - auto-generated highlights (top frustration pages, dead click hotspots)

---

## Key Metrics to Track Weekly

| Metric | Where to Find | Why It Matters |
|--------|--------------|----------------|
| Scroll depth on blog posts | Clarity heatmaps | Validates content quality and hook effectiveness |
| Dead clicks on tool pages | Clarity smart signals | Reveals UX confusion |
| Rage clicks site-wide | Clarity dashboard | Catches broken or frustrating interactions |
| Quick-back rate on pSEO pages | Clarity smart signals | Signals content/intent mismatch from search |
| Session recordings on pricing page | Clarity recordings | Understand pre-booking behavior |
| Tool completion rate | Clarity recordings + GA4 events | Are tools delivering value or being abandoned? |

---

## Implementation Details

- **Script location:** `src/components/common/Analytics.astro`
- **Loading:** Async, main thread (not Partytown - Clarity needs main-thread access for recordings)
- **Performance impact:** Minimal (~2KB initial script, async loaded)
- **Privacy:** Clarity auto-masks sensitive inputs by default. No PII is collected.
- **Data retention:** 30 days (free tier)

---

## Next Steps

1. Allow 24-48 hours for initial data collection
2. Review first session recordings and heatmaps
3. Set up Clarity filters for key page groups (tools, pSEO, blog)
4. Establish weekly review cadence - pull Clarity insights alongside GSC/GA4 data
5. Create Clarity-informed A/B test hypotheses for underperforming pages
