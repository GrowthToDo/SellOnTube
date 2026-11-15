# shopify-app-CLAUDE.md — Router + Boundary Lock (READ THIS FIRST)

## BOUNDARY (read before writing anything)

The SellOnTube codebase contains **more than one business**:

1. **SellOnTube core** — a YouTube acquisition service for B2B founders and SaaS. Its own ICP, free tools, positioning. Already exists in the repo.
2. **Shopify App Marketing service** — THIS project. A non-engineering "business team" for Shopify *app owners* (NOT merchants/store owners). Lives under `/shopify-app`.

**This project touches ONLY the Shopify App Marketing service.** Do not apply core-service positioning, ICP, voice, tools, or claims here. The two must never bleed into each other. Do NOT place core-service CTAs (YouTube ROI calculator, YouTube diagnostic call) anywhere under `/shopify-app/*`. If unsure which business something belongs to, **STOP and ask.**

**Video nuance.** This project DOES include a "YouTube for Shopify apps" video pillar (demo/tutorial/onboarding/feature videos for app founders), scoped to this niche and living entirely inside this project. The general YouTube-acquisition core service does NOT belong here.

## The files (what each is, when to read it)

- `shopify-app-CLAUDE.md` — this router + boundary. Read first, always.
- `shopify-app-mission.md` — the mission / decision filter. Read second.
- `shopify-app-facts.md` — locked source of truth: metrics, case studies, approved + forbidden claims. Read before writing any claim.
- `shopify-app-positioning.md` — ICP, four-pillar service spine, offer tiers.
- `shopify-app-voice.md` — vocab / anti-vocab / kill-AI-patterns.
- `shopify-app-architecture.md` — page map / sitemap, URL convention, nav, indexing + launch order. Read before building or linking any page.
- `shopify-app-page-content.md` — versioned baseline of the live `/shopify-app` copy.
- `shopify-app-tools.md` — microtool candidates + lead-magnet logic (deferred build).
- `shopify-app-resources.md` — curated links + original reference content (deferred build).
- `shopify-app-process.md` — workflow, build order, decided-vs-deferred log.

## Read order for ANY content task

`mission → facts → positioning → voice → architecture → then the task file.`

## Standing instruction

Every page, tool, resource, or line of copy must serve the mission in `shopify-app-mission.md`. **If it doesn't drive installs, conversion, or retention for the client, cut it.**

## The five writing rules (apply to every file)

1. Keep each file tight — ≤10 core instructions/sections.
2. Most important instruction at the very top.
3. Never fabricate. Any metric, client name, result, or benchmark must trace to `shopify-app-facts.md`. Not in facts → not on the page.
4. Missing facts → write `[NEEDS INPUT: …]`, never guess.
5. Flag, don't finalize, the two high-risk files (`shopify-app-facts.md`, `shopify-app-voice.md`): end each with `## NEEDS HUMAN REVIEW`.

## When unsure

If you cannot tell which business something belongs to, or whether a claim is substantiated — **STOP and ask the founder.** Do not resolve it yourself.
