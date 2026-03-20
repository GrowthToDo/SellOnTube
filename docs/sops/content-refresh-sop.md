# Content Refresh SOP

> Keeps existing posts fresh for AI citation and search ranking. Stale content loses citations.

## Frequency

| Post cluster | Frequency |
|---|---|
| Top 3 priority clusters (`youtube_seo`, `youtube_lead_gen`, `b2b`) | Monthly |
| All other posts | Quarterly (every 90 days) |

## Refresh Steps

- [ ] **1. Read the current post in full**

- [ ] **2. Check for outdated statistics**
  - Find any stat with a year or date reference
  - If more recent data exists from a reputable source, update it
  - If the stat is current and still accurate, leave it

- [ ] **3. Add one new FAQ question**
  - Check current GSC data for "People Also Ask" queries related to this post's keyword
  - Add the most relevant unanswered question + a direct 50-100 word answer
  - Pair with FAQPage JSON-LD if schema is implemented

- [ ] **4. Update "What to do this week" box**
  - Replace the action items with fresh, timely advice relevant to the current date
  - Must be specific — not generic. Think: what would a consultant say on a call today?

- [ ] **5. Add internal links to new content**
  - Check `docs/templates/internal-linking-map.md` for posts/tools published since last refresh
  - Insert at least 1 new internal link where genuinely relevant

- [ ] **6. Run Agent 05 QA on the updated file**
  - All CRITICAL violations must pass before proceeding

- [ ] **7. Push**

```bash
git add src/data/post/[slug].mdx
git commit -m "content: refresh [post-slug] — [what changed in one line]"
git push
```
(Follow deploy-checklist.md gates)

- [ ] **8. Submit to GSC Request Indexing**

- [ ] **9. Update publishDate only if meaningful content was added**
  - Cosmetic fixes (typos, formatting) do NOT warrant a publishDate change
  - New sections, new stats, new FAQ = update publishDate

- [ ] **10. Note in seo-audit-log.md**
  - Add one line: `[date] — Refreshed [slug]: [what changed]`
