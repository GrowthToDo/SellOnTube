# Monthly AI SEO Checklist

> **Owner: Agent 07.** Run once per month as part of the weekly SEO review.
> Extracted from `ai-seo-guide.md` §10 — that section is the canonical source; this is the executable SOP.

## Run This Monthly

- [ ] **1. Verify all AI bots are allowed**
  - Check `public/robots.txt` and `netlify.toml`
  - Confirm none of these are blocked: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`
  - If any are blocked: flag as critical — fix immediately

- [ ] **2. Check SellonTube appears in Brave Search**
  - Go to `search.brave.com`
  - Search for 3–5 core keywords (e.g. "YouTube marketing for B2B", "YouTube ROI calculator", "YouTube lead generation")
  - Confirm SellonTube appears in results for at least 3 of them
  - If not appearing: check if ClaudeBot / anthropic-ai are blocked (Brave powers Claude citations)

- [ ] **3. Update at least 2 high-priority blog posts**
  - Select 2 posts from top priority clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`)
  - Follow `docs/sops/content-refresh-sop.md` for each
  - What counts as an update: new section, refreshed stat, new FAQ, updated "What to do this week"
  - Simply changing publishDate without content changes does NOT count

- [ ] **4. Submit updated URLs to GSC + IndexNow**
  - GSC: URL Inspection → Request Indexing for each refreshed URL
  - IndexNow: run `scripts/indexnow-ping.js` for the updated URLs

- [ ] **5. Check for AI Overviews impressions in GSC**
  - In GSC, filter by "Search type: Web" — look for pages with "AI Overview" impressions
  - Note which pages are being cited
  - If a page is getting AI Overview impressions but low CTR: prioritise its CTR optimization

- [ ] **6. Review schema implementation status**
  - Check `agents/07-technical-seo.md` Step 2 pending schemas table
  - Flag the next schema type to implement to the user
  - Priority order: FAQPage → Article → HowTo → BreadcrumbList

- [ ] **7. Log completions in seo-audit-log.md**
  - `[date] — Monthly AI SEO checklist complete. Posts refreshed: [slugs]. Schema next: [type].`
