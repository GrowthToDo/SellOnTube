Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `ai-seo-guide.md` L675-682 (Rule 2 canonical entity terms) and L747-769 (Section 19); `agents/references/comparison-content-playbook.md` L159.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# Proven citation evidence and canonical entity terms

### `ai-seo-guide.md` L675-682: canonical entity terms

### Rule 2 - Entity consistency
Use identical phrasing for key concepts across every page. AI engines build entity graphs; inconsistent naming weakens the signal. Canonical terms (use these exact phrases):
- "buyer-intent video" (not "purchase-driven content" or "sales-focused video")
- "YouTube acquisition channel" (not "YouTube marketing channel" or "growth channel")
- "customer acquisition" (not "lead generation" when referring to the full funnel)
- "B2B YouTube" (not "business YouTube" or "enterprise YouTube")

Introduce the canonical term first, then any variation. Never use a variation without establishing the canonical term on the same page.

### `ai-seo-guide.md` L747-769: Section 19, what actually gets cited

## 19. What Actually Gets Cited at SellonTube (Proven Evidence)

Everything above is principle. This section is evidence - what has actually earned citations on this domain. Treat the archetype as the target to replicate. Sources: `research/aeo/extractability-audit-2026-06-24.md`, `research/bing-webmaster-ai-performance.md`.

### The proven archetype
`/blog/how-to-find-youtube-autocomplete-keywords` scored 10/10 on the extractability rubric and earned 6 Microsoft Copilot citations - the most-cited page on the site. Reverse-engineer new content to match it.

### The 9 signals that correlate with citation (extractability rubric)
1. **Visible FAQ** in the body (not frontmatter-only) - the single highest-leverage gap on the site. Copilot lifted Q&A directly from the cited page.
2. **Definition blocks** (Rule 4).
3. **Answer blocks** 134-167 words (Rule 1).
4. **Table of contents** with anchors (especially tool pages).
5. **Question-style H2s**.
6. **Comparison/data tables**.
7. **First-party data** (Rule 3).
8. **Fresh dates** - recent, genuine updates (Section 12).
9. **Internal links** - cluster + `/tools` links for topical authority.

### Biggest open gap
Multiple posts carry a frontmatter `faqs` array but render no visible `## FAQ` section, so the Q&A never reaches the page. Fixing this across the site is the highest-leverage citation work available. Caught in the monthly checklist (Section 15).

### How Copilot/Bing citations are earned (mechanism)
Copilot grounds answers in Bing's top-ranked results, then quotes the most answer-shaped, extractable passage. So citation = good Bing rank × answer-shaped content. The practitioner tactics (mine grounding queries, build compact high-intent pages, route authority, analyze citation share) live in `research/bing-webmaster-ai-performance.md`.

### `agents/references/comparison-content-playbook.md` L159: entity terms in the comparison gate

- [ ] Canonical entity terms used (buyer-intent video, YouTube acquisition channel, customer acquisition, B2B YouTube)
