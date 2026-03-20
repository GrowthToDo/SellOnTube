# SellonTube

**B2B YouTube acquisition for founders, SaaS operators, and service businesses.**

Live site: [sellontube.com](https://sellontube.com)

---

## Stack

- **Framework:** Astro 5 (static site generation)
- **Styling:** Tailwind CSS
- **Content:** MDX blog posts + TypeScript data files for pSEO pages
- **Hosting:** Netlify (with serverless functions)
- **AI tools:** Gemini Flash API (via Netlify Functions)

---

## Content System

Three content pillars — all documented in `DOCS.md`:

| Pillar | Volume | Cadence | Key files |
|---|---|---|---|
| **Blog** | 13 posts | 1/week (max 2) | `src/data/post/` |
| **pSEO pages** | 31 niches + 23 comparisons | ~4/week drip | `src/data/niches.ts`, `src/data/comparisons.ts` |
| **Microtools** | 4 live, 3 planned | Build by priority | `src/pages/tools/`, `netlify/functions/` |

---

## Agent System

Content marketing and SEO work is handled by a 9-file agent system.

**To use:** speak naturally. Agents auto-route.
- "write a post about X" → Agent 04 (blog writer)
- "what should I write about" → Agent 02 (keyword researcher)
- "weekly SEO check" → Agent 01 (GSC intelligence)
- Full routing table: `agents/README.md`

---

## Key Rules

1. **Never push to live without explicit user approval** — every push requires separate approval
2. **Blog cadence: max 1/week, hard ceiling 2/week** — always count before scheduling
3. **pSEO publishDates are IST (UTC+5:30)** — Netlify builds UTC — check before deploying
4. **Keyword SSOT:** `research/keywords/sot_master.csv` — use this, not raw CSVs
5. **Gemini Flash is the API standard** for all Netlify functions — see `agents/08-microtool-builder.md`

---

## Documentation

All docs indexed at `DOCS.md`.
