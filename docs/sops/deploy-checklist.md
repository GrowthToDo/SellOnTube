# Deploy Checklist

> Run before every `git push`. This is the final gate before content goes live.

---

## Before Every Push

- [ ] **QA result:** Agent 05 CRITICAL tier = PASS (zero violations)
- [ ] **Blog cadence:** Posts in the proposed publish week counted — no 7-day window exceeds 2 posts
- [ ] **publishDate:** IST timezone verified (format `YYYY-MM-DD`, treated as `T00:00:00+05:30`)
- [ ] **UTC check:** If current IST time is before 05:30, the page will not appear until 05:30 IST — flag this to user if they expect it live immediately
- [ ] **metadata.canonical:** Correct URL path (`https://sellontube.com/[slug]`)
- [ ] **Featured image:** File exists at the path referenced in frontmatter `image:` field
- [ ] **Internal links:** At least 2 internal links confirmed in the post body

## Approval Gates (sequential — do not combine)

- [ ] **Commit approval:** Show user the commit message. Wait for explicit "yes". THEN commit.
- [ ] **Push approval:** After commit completes, show user the push command. Wait for separate explicit "push" instruction. THEN push.

> **Never combine commit + push into one action. These are two separate approvals.**

## Post-Push Actions

- [ ] **GSC Request Indexing:** Submit the live URL via GSC URL Inspection tool
- [ ] **sot_master.csv:** Update the target keyword row `status` → `live`
- [ ] **internal-linking-map.md:** Updated with new post's links
