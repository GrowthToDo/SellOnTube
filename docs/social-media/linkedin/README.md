# SellonTube — LinkedIn (self-contained)

Everything for writing and shipping SellonTube's LinkedIn company-page posts. **Kept separate from blog work on purpose** — LinkedIn and the blog are different formats, audiences, and distribution. Do not mix the two.

## What's here

| File / folder | What it is |
|---|---|
| `linkedin-writing-guideline.md` | **The canonical playbook.** How to write a post: thesis-first pipeline, structure menu, hook rules, voice, evidence discipline, humanizer, pre-publish checklist. Agent 09 follows this verbatim. |
| `examples/` | Gold-standard posts — match these. Each carries its thesis + why it's gold. |
| `anti-examples/` | "Never write this" posts, annotated with what fails. |

## Related (not in this folder, by design)

- **Runtime code + data:** `scripts/linkedin-agent/` — `linkedin-schedule.js` (posts via Zernio API), `queue.json`, `linkedin-history.json`, and the evidence banks. Code stays with code.
- **The writer agent:** `agents/09-linkedin-writer.md` — thin runner that follows the guideline here.
- **System design / rationale:** `docs/superpowers/specs/2026-07-17-linkedin-brand-presence-engine-design.md`.

## The flow, end to end

```
1. Claude reads this guideline + history + evidence banks
2. Writes a batch of posts (thesis → structure → draft → checks), following linkedin-writing-guideline.md
3. Writes them into scripts/linkedin-agent/queue.json (with per-post thesis)
4. node scripts/linkedin-agent/linkedin-schedule.js  → schedules them to the SellonTube page via Zernio
5. Zernio publishes on schedule (9 AM IST); firstComment carries the link
```

## The one rule above all

Speak to **one** B2B buyer like a friend over coffee. Leave them able to **do one thing that gets them customers via YouTube.** Clarity first, always. Full detail: `linkedin-writing-guideline.md`.
