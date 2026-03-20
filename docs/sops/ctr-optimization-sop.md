# CTR Optimization SOP

> Triggered when Agent 01 identifies a quick-win page: position 5–20, impressions > 0, CTR below average.

## When to Run This

Agent 01 flags pages in position 5–20 with low CTR. These are the highest-ROI improvement opportunities — the page already ranks, it just isn't being clicked.

## Steps

- [ ] **1. Read current title and meta description**
  - Check the page's frontmatter `title` and `metadata.description` (or the component pulling them)

- [ ] **2. Title audit**
  - Is the primary keyword in the first 3 words?
  - Is it ≤ 60 characters?
  - Does it open with a filler word ("The Hidden Power of", "Why Most", "The Ultimate Guide")?
  - Does it describe the article instead of selling the click?
  - Does it use insider jargon the ICP wouldn't search?

- [ ] **3. Meta description audit**
  - Does it start with a specific claim or question? (Not "A comprehensive guide...")
  - Does it state what the reader gets in ≤ 10 words?
  - Does it contain at least one specific number or outcome?
  - Is it ≤ 155 characters?
  - Does it end with a soft CTA or clear value signal?

- [ ] **4. Write 2 alternative title options**
  - Run each through Agent 05 title rules before presenting
  - Each option must: start with primary keyword, be ≤ 60 chars, sell the click

- [ ] **5. Write 1 alternative meta description**
  - Must: contain specific claim, ≤ 155 chars, no filler openers, no em-dashes

- [ ] **6. Present to user**
  - Show: current title + meta, 2 new title options, 1 new meta description
  - Include rationale for each option (what CTR problem it solves)
  - Wait for explicit approval

- [ ] **7. On approval: update frontmatter**

- [ ] **8. Follow deploy-checklist.md gates and push**

- [ ] **9. Log in seo-audit-log.md**
  - `[date] — CTR rewrite: [slug] — old title: "[old]" → new: "[new]"`

- [ ] **10. Re-check in GSC after 4 weeks**
  - Did CTR improve? Note outcome in `seo-audit-log.md`
  - If no improvement after 4 weeks: try the second title option
