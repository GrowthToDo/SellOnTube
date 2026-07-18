# Agent 09 — LinkedIn Weekly Writer

Thin runner. The writing craft is NOT in this file. Follow
`docs/social-media/linkedin/linkedin-writing-guideline.md` verbatim; this file
only covers the operational loop (what to read, how many, what to write where,
how to schedule).

## Trigger
User says: "generate next batch of LinkedIn posts" / "refill" / "write this month's LinkedIn posts".

## Positioning (do not drift)
SellonTube company-page brand-presence engine for B2B buyers evaluating YouTube for customer acquisition. Blend voice (product-or-service, never pins the model). NOT the AEO engine. Full context: `docs/superpowers/specs/2026-07-17-linkedin-brand-presence-engine-design.md`.

---

## Step 0 — Read (every run)
1. `docs/social-media/linkedin/linkedin-writing-guideline.md` — **canonical craft. Follow it verbatim.**
2. `docs/social-media/linkedin/examples/` + `anti-examples/` — match the gold, never the anti.
3. `scripts/linkedin-agent/linkedin-history.json` — the last 30 posts. No repeated angle, hook, or source page.
4. `scripts/linkedin-agent/authority-evidence-bank.json` + `curated-video-bank.json` — the ONLY allowed external facts/videos. **Cite only `verified: true` entries.**

## Step 0.5 — Refill the banks first (if below floor or stale)
Before generating, if the authority bank has fewer than ~30 `verified: true` entries, browse each seed source (`/browse`), confirm the exact figure + deep URL, flip to `verified: true`, and add fresh entries to reach the floor. Curated-video bank only matters at Step 1.5 (authority-lesson posts). Never cite an unverified entry; if nothing verified fits, name no source rather than fabricate one.

## Step 1 — Batch size + dates (MAIN THREAD sets dates, never a subagent)
- First batch: 2 weeks (up to 10 posts). Steady-state: 4 weeks (up to 20).
- Compute the coming Mon-Fri dates. `scheduledDate` = those dates; Zernio publishes at 9 AM IST.
- **Ceiling, not quota:** a post that fails its self-critique is dropped, never padded. A weak week ships 4, not 5 filler posts.

## Step 2 — Weekly mix (spread across Mon-Fri, soft variety guard)
Per week: **2 SellonTube-link + 2 source-named no-link + 1 flex.**
- Link posts (`linkLocation: "comment"`): derived from a real SellonTube page; UTM link in `firstComment`; body has NO URL.
- No-link posts (`linkLocation: null`): self-contained; name a `verified: true` authority source; no `firstComment`.
- Flex: contrarian/myth-bust (no link). Authority-lesson video posts (`linkLocation: "body"`) are **Step 1.5 — do not produce yet.**
- The thesis picks the structure (guideline §3); weekday is only a variety guard, not a rigid template.

## Step 3 — Write each post (the pipeline, per the guideline)
For every post: **thesis → validate 4 gates → choose structure → draft (voice) → hook-carries-thesis check → self-critique → humanizer.** Do not restate the rules here; they live in the guideline. Drop any post that can't pass.

## Step 4 — Output `scripts/linkedin-agent/queue.json`
Array of post objects, this exact shape:

```json
{
  "scheduledDate": "YYYY-MM-DD",
  "dayOfWeek": "Monday",
  "archetype": "framework | tactical-how-to | mistake | proof | contrarian",
  "thesis": "After this post, [reader] can [execute X] to get more customers.",
  "linkLocation": "comment | null",
  "sourceTitle": "Exact page title or null",
  "sourceUrl": "https://sellontube.com/... or null",
  "imageUrl": "og-image URL for link posts, else null (takeaway cards = Step 1.5)",
  "firstComment": "UTM link for comment posts, else null",
  "postAngle": "one-line angle",
  "linkedinPost": "full post text, no URL in body for comment/null posts",
  "hashtags": ["#Optional", "#0to3"]
}
```

## Step 5 — Schedule
Tell the user to run:
```bash
node scripts/linkedin-agent/linkedin-schedule.js
```
The script runs `validatePost` on each post (skips + reports failures), uploads any image, POSTs to Zernio with `firstComment`, and appends to history at 9 AM IST per `scheduledDate`.

## Step 6 — First-batch validation (one time)
On the very first live batch, confirm on the real post that Zernio renders `firstComment` as an actual first comment on the company page before trusting it at scale. This is why batch 1 is 2 weeks.

---

## Guardrails (hard)
- Cite only `verified: true` bank entries. No fabricated stats, sources, or videos.
- Founder first-hand experience allowed only if anonymized and not reframed as SellonTube's own work (guideline §7).
- No em dashes. 900-1,700 chars. 0-3 hashtags. Link only where `linkLocation` says.
- Main thread sets `scheduledDate`; never delegate dates to a subagent.
