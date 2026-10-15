Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `docs/sops/deploy-checklist.md` L1-28; `CLAUDE.md` L20-23, L68-70; `netlify.toml` L1-3, L183-185.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# Deploy: approvals and checks

Notes added for this kit (not in the sources):

- `main` deploys on push (`SEO_CONTEXT.md` header). No PR flow.
- The two sources differ: `deploy-checklist.md` L19-22 requires two separate approvals (commit, then push); `CLAUDE.md` L68-70 says show the message, wait for "yes", then commit and push. The stricter reading (two approvals) is the safe default.
- `deploy-checklist.md` L13 shows canonical `https://sellontube.com/[slug]`; posts actually use `https://sellontube.com/blog/[slug]` (`scripts/new-post.mjs` L117, every post's `metadata.canonical`).

### `docs/sops/deploy-checklist.md` L1-28: full checklist

# Deploy Checklist

> Run before every `git push`. This is the final gate before content goes live.

---

## Before Every Push

- [ ] **QA result:** Agent 05 CRITICAL tier = PASS (zero violations)
- [ ] **Blog cadence:** Posts in the proposed publish week counted - no 7-day window exceeds 2 posts
- [ ] **publishDate:** IST timezone verified (format `YYYY-MM-DD`, treated as `T00:00:00+05:30`)
- [ ] **UTC check:** If current IST time is before 05:30, the page will not appear until 05:30 IST - flag this to user if they expect it live immediately
- [ ] **metadata.canonical:** Correct URL path (`https://sellontube.com/[slug]`)
- [ ] **Featured image:** File exists at the path referenced in frontmatter `image:` field
- [ ] **Internal links:** At least 2 internal links confirmed in the post body

## Approval Gates (sequential - do not combine)

- [ ] **Commit approval:** Show user the commit message. Wait for explicit "yes". THEN commit.
- [ ] **Push approval:** After commit completes, show user the push command. Wait for separate explicit "push" instruction. THEN push.

> **Never combine commit + push into one action. These are two separate approvals.**

## Post-Push Actions

- [ ] **GSC Request Indexing:** Submit the live URL via GSC URL Inspection tool
- [ ] **sot_master.csv:** Update the target keyword row `status` → `live`
- [ ] **internal-linking-map.md:** Updated with new post's links

### `CLAUDE.md` L68-70: push rule

- **Never push to live without asking. This is the one repo here with a remote.** Show the commit
  message, wait for an explicit "yes", then commit and push. Do not combine showing, committing and
  pushing into one action.

### `CLAUDE.md` L20-23: Bing and GSC submission

3. Submit both URLs to Bing: `node scripts/bing-submit.mjs <file-of-urls>`. Run it as a standard step
   whenever a new tool or blog post publishes - no need to ask first.
4. Remind the user to submit both URLs in Google Search Console (URL Inspection → Request Indexing).
   Manual by necessity; GSC has no public submission API.

### `netlify.toml` L1-3: build command

```toml
[build]
  publish = "dist"
  command = "npm run build && node scripts/validate-build.js"
```

### `netlify.toml` L183-185: production command

```toml
# IndexNow: ping search engines after production deploy to trigger fast indexing
[context.production]
  command = "npm run build && node scripts/validate-build.js && (node scripts/indexnow-ping.js || true) && (node scripts/gsc-sitemap-submit.js || true)"
```
