# Refresh plan - https://sellontube.com/blog/best-youtube-transcript-generators - 2026-10-22

Mode 07 (refresh) + mode 09 step 7 (citability audit). Read-only analysis; no repo file edited.
Source file: `src/data/post/best-youtube-transcript-generators.mdx` (422 lines, ~4,100 words) on
worktree `SellonTube-wt-top5` at `605c8d8` (main). Built HTML: `dist/blog/best-youtube-transcript-generators/index.html`
(fresh `astro build` 2026-10-22, 336 pages, exit 0).

Verification key used below: **[V]** verified today against code, built HTML or the vendor's live
page; **[S]** stale, the page is wrong; **[U]** unverifiable today (fetch blocked or page silent),
owner checks by hand. No ranking, traffic or click promise is made anywhere in this plan.

---

## Trigger

- **Trigger 3, stale facts (primary).** The post says SellonTube's tool is "free, no signup" in 7
  places. The tool page (`src/pages/tools/youtube-transcript-generator.astro` L46, L524, L615-625,
  L1319) gives 3 free runs, then asks for an email. The vendor moved to Supadata on 2026-09-05
  (`40960b9`), with a shared server-side budget of 90 vendor calls a month (`netlify/functions/lib/transcript.ts`
  L281, added in `1b683ae`, 2026-09-13). Five of eight competitor rows also drifted (see Stale facts).
- **Trigger, slipping position (secondary, caller-supplied GSC, 90d 07-22..10-19):** 6 clicks /
  1,521 impr / pos 12.6, against the prior 90d 5 clicks / pos 10.2. Main query "best youtube
  transcript generator" 142 impr, pos 11.6, 5 clicks, 3.5% CTR, all clicks mobile. US desktop at pos ~20
  earns 0 clicks. Per the bot rule, the impressions are not the target. The click rows and position are.
- **Refresh before new:** no other post targets transcript tools (`ls src/data/post | grep transcript`
  returns only this file; `netlify.toml` has no transcript redirect). The tool page
  `/tools/youtube-transcript-generator` is a different intent (do-the-job, not compare) and ranks
  57-76 on its own head terms. That is a separate issue, noted only.
- **Last material update:** `updateDate: 2026-06-29` (L3). Built `dateModified` = `2026-06-28T18:30:00Z`
  (IST conversion). The post is past the 90-day freshness rule in `ai-seo-guide.md` §12.

## Phase 1: Current state (built page)

| Item | Value | Note |
|---|---|---|
| Rendered `<title>` | `Best YouTube Transcript Generators (2026) \| SellOnTube` = 54 chars | Under 60 cap [V] |
| Meta description | 128 chars, `metadata.description` L34 | Under 155 [V] |
| og:image | `.../best-youtube-transcript-generators-featured...svg`, `og:image:height` 675 | SVG fails raster rule (SEO_CONTEXT OPEN 7); frontmatter says 630 (L10), built says 675 |
| FAQPage JSON-LD | 0 in built HTML | Correct per 2026-10-15 decision [V] |
| Schema present | BlogPosting, BreadcrumbList, WebPage, Organization, Person | No ItemList (optional, playbook) |
| Visible FAQ | `## FAQ` with `### category` + `#### question` | Questions render as **H4**. `grep -oiE '<h[23][^>]*>[^<]*\?</h[23]>'` = **0** on this page; the same grep = 4 on the archetype `how-to-find-youtube-autocomplete-keywords` (grep proven to fire) |
| Inbound links (dist) | `ai-tools-for-youtube`, `best-youtube-seo-tools-for-business`, `best-youtube-video-ideas-generators-for-businesses`, `is-vidiq-worth-it-for-business` (related-posts card), `/tools/youtube-transcript-generator` + tag/category/pagination pages | No inbound from a page with real GSC clicks except the tool page |
| Outbound internal | `/blog/ai-tools-for-youtube`, `/tools/youtube-seo-tool`, `/tools/youtube-script-generator`, `/tools/youtube-transcript-generator` (x3, absolute URL), `/blog/youtube-marketing-strategy`, `/tools/youtube-video-keyword-finder`, `/blog/youtube-seo-guide`, 3 related roundups | Passes the >=4 incl. one `/tools/` rule [V] |
| Em / en dashes | 0 / 0 | [V] |
| Canonical entity terms | 0 of 4 (`buyer-intent video`, `YouTube acquisition channel`, `customer acquisition`, `B2B YouTube`) | Playbook gate item fails |

**Strengths to keep:** business-use framing (L50-58), the definition block (L58), the visible
"Last updated" + method note (L60), the at-a-glance table (L125-135), consistent per-tool order,
real rating links with scope caveats, honest ElevenLabs/Descript framing, the bonus YouTube section,
and all anchor ids (`#1-sellontube-youtube-transcript-generator`, `#2-sonix`, ..., `#faq`). The
tool page links to this post with the anchor "comparison of YouTube transcript generators".

**Weaknesses:** stale own-tool claims (the main one), five stale competitor rows, H4 FAQ questions,
no evaluation-criteria H3s, no decision tree, no use-case cheat sheet, no Key Takeaways *table*,
no first-party data claim, SVG og:image, and a SellonTube screenshot from 2026-03-21
(`transcript-sellontube.png`, last commit `Sat Mar 21 2026`), which shows the UI before the
2026-09-05 results-view rebuild.

---

## Audit: AIC-01..10, ai-seo-guide §16, comparison playbook gate

### post-rules §9 (AIC)

| ID | Pass/Fail | Evidence (line refs, source file) |
|---|---|---|
| AIC-01 direct answer early, names the app | **Partial** | L56 "SellonTube is listed first" + L58 definition sit in the first 10%. No single declarative verdict sentence answers "what is the best YouTube transcript generator" with the reason. The §16 134-167-word answer block (project rule, labelled `unverified` per OD-4) is absent: L50-56 is 4 short paragraphs, not one standalone block |
| AIC-02 first sentence mirrors heading | **Partial** | Pass: L95, L111, L362. Fail: L154 (SellonTube section opens with the pros list, then "SellonTube's YouTube Transcript Generator was designed..."), L377 bullets have no lead sentence |
| AIC-03 definition block | **Pass** | L58 `**A YouTube transcript generator is ...**` |
| AIC-04 canonical entity terms | **Fail** | 0 of 4 terms on the page |
| AIC-05 first-party data claim | **Fail** | No first-party number. L164 "Reviews" paragraph is disclosure only |
| AIC-06 named subject, no metaphor, checkable claims | **Partial** | L154 "calibrated for business readers" is not checkable; L164 "same public-URL transcription approach as the paid tools" is **false** (see Stale facts S-07); L373 "handles the same job in seconds" |
| AIC-07 takeaways/TOC/diagrams name app + pass claim audit | **Fail** | Takeaways L65 says "no signup" (false) and L68 "NoteGPT and Tactiq ... zero-friction" (Tactiq row is wrong about format) |
| AIC-08 reads well without AI search | **Pass** | Human-first structure |
| AIC-09 criteria / table / decision / use-case each stand alone | **Partial** | Table L125 stands alone (but stale). Criteria L111-117 is a bullet list, not H3 criteria. L377-384 is a one-line map, no decision questions. No use-case cheat sheet |
| AIC-10 FAQ phrased the way people ask assistants | **Partial** | Questions are third-person ("for business teams"). None uses "I/my". No "should I" question |

### ai-seo-guide.md §16 checklist (hard gate, Agent 05)

| Item | Pass/Fail | Note |
|---|---|---|
| Content quality first | Pass | Business angle is non-commodity |
| Answer block 134-167 words, early | **Fail** | None |
| Entity terms | **Fail** | 0/4 |
| First-party data claim | **Fail** | None |
| Definition blocks | Pass | L58 |
| FAQ in body, conversational | **Partial** | Visible, but H4 questions (SEO_CONTEXT override wants `### Question?` H3s) and not conversational |
| §17 language | **Partial** | False/unclear claims L164, L154 |
| §18 media, perf-safe | Pass | Screenshot per tool + `YouTubeFacade` L105 (click-to-load). Own screenshot is stale |
| `llms.txt` | N/A | No new tool or section |
| Comparison playbook gate | **Fail** | See next table |

### comparison-content-playbook.md pre-publish gate

| Gate item | Pass/Fail | Note |
|---|---|---|
| Answer-first opening + one-sentence verdict + Key Takeaways box | **Partial** | Box L62-71 present; first sentence L50 is framing, not a verdict |
| Key Takeaways **table** (3-5 rows) before body | **Fail** | Absent |
| Problem-solution arc | **Partial** | L50-54 + L93-103 give the "why"; no numbered pain points with evidence |
| Evaluation criteria as own H2 with 4-7 H3s | **Fail** | L109-117 is an H2 with bullets |
| Quick comparison table, every tool | Pass (stale data) | L125-135; no business-specific column |
| Per-tool sections, identical order | **Partial** | Order is image/pros/cons/body/price/reviews; no "Key features", no "Best for:" line |
| Decision tree 3-5 questions | **Fail** | L377-384 is a flat list |
| Use-case cheat sheet 8-12 | **Fail** | Absent |
| Categorized FAQ 3-5 themes | Pass (3 themes) | L390, L400, L410 |
| Ratings real + linked; own tool disclosed | **Partial** | Notta (L238) and Tactiq (L356) ratings have no link; all ratings [U] today (Capterra 403) |
| Pre-calculated savings | Pass | Every price block does the math |
| Internal cluster links | Pass | |
| Screenshot per tool + video | Pass | Own screenshot stale |
| Visible Last updated + method note | Pass (stale date) | L60 says June 2026 |
| Canonical entity terms | **Fail** | 0/4 |
| No em dashes | Pass | 0 |

---

## Phase 2: SERP read (dated 2026-10-22, method: WebSearch, US index)

WebSearch returns organic links only. **AI Overview, featured snippet and PAA were not observed**
with this method. The owner must run both queries by hand (logged-out, `&gl=us&hl=en`, desktop
and mobile) and record AIO presence, AIO cited sources and PAA verbatim. No PAA is quoted in this
plan because none was observed.

**"best youtube transcript generator"** (organic order as returned):

| Pos | URL | Publisher type | Format | Covers that we skip | Last updated |
|---|---|---|---|---|---|
| 1 | sonix.ai/ai/best-youtube-video-transcript-generators/ | Vendor (ranks itself) | Listicle | Multilingual accuracy claim "up to 99%" | not checked |
| 2 | web-highlights.com/blog/best-transcript-youtube-generators/ | Vendor (extension) | Listicle, "Compared (2026)" | not fetched | not checked |
| 3 | subeasy.ai/blog/best-youtube-transcript-generator | Vendor (ranks itself #1) | Top 5, "Tested & Compared" | Table columns: accuracy, export formats, free plan, processing time; Otter.ai, TurboScribe, HappyScribe | Byline 2025-04-14, no update date, title says 2026 |
| 4 | notegpt.io/best/free-youtube-transcript-generator | Vendor | Listicle | youtube-transcript.io, Kome AI (120+ languages), "can't be used commercially" note on ElevenLabs free | not checked |
| 5 | aiarty.com/knowledge-base/youtube-transcript-generator.htm | Vendor | Guide | not fetched | not checked |
| 6 | happyscribe.com/blog/best-free-youtube-transcript-generator-tools-2026-guide | Vendor | Listicle | fetch failed (ECONNRESET) | not checked |
| 7 | peerlist.io/yvette/... | UGC article | Listicle | not fetched | not checked |

**"best free youtube transcript generator":** same set reordered (notegpt.io first), plus
bibigpt.co "Top 5 AI Tools Ranked (2026)" (vendor).

**Read:** every observed result is a vendor ranking itself first, as this post does. SubEasy's
"Tested" page has no numbers behind the word. That is the opening: a page that publishes its free
limits, signup rule and export formats checked on a dated day, and says plainly where its own tool
loses, is the only non-commodity format here. Winnability: no big-brand editorial (Zapier, PCMag)
appeared in the top results for these two queries, so the head term is not ruled out by L-TOP-02.
The caller's numbers say the clicks come from mobile at pos ~11; the plan aims at the long-tail
"free / no signup / export" rows the post already earns, not at a head-term promise.

---

## Phase 3: Gap analysis

Competitors C1-C5 = sonix.ai, web-highlights, subeasy, notegpt, happyscribe (C2/C5 not fetched;
rated from the search snippets only, so their cells are "?").

| Topic / element | Us | C1 | C2 | C3 | C4 | C5 | Priority |
|---|---|---|---|---|---|---|---|
| Comparison table | yes | yes | ? | yes | yes | ? | Keep |
| Export formats per tool as a column | no | yes | ? | yes | yes | ? | **High** |
| Free-plan limit per tool, exact | partly, stale | yes | ? | yes | yes | ? | **High** |
| Signup required? per tool | no column | ? | ? | partly | yes | ? | **High** (it is the intent: "no sign up" queries, `traffic-reality-check.md` Finding 4) |
| Languages supported | no | yes | ? | ? | yes | ? | Medium |
| Captions-based vs audio-transcription distinction | no | no | ? | no | no | ? | **Emerging** (our code proves it; nobody explains it) |
| Commercial-use limit of free plans | no | ? | ? | ? | yes (ElevenLabs) | ? | Low |
| Otter.ai / TurboScribe / youtube-transcript.io | no | ? | ? | yes | yes | ? | Low; do not add tools (keeps count 9, anchor ids) |
| Competitor-research brief (hook, claims, product mentions, CTA) | no | no | no | no | no | no | **Emerging**, product-backed |
| Decision tree / use-case map | flat list | ? | ? | "Final verdict" | ? | ? | Medium + playbook gate |

### Stale facts (product is right, page is wrong)

Own-tool truth source: tool page + `netlify/functions/lib/transcript.ts` + `get-transcript.ts` + `summarize-transcript.ts` at `605c8d8`.

| # | Claim on page | Where it lives | Current truth | Status / source |
|---|---|---|---|---|
| S-01 | "free, requires no signup" / "no signup" / "no account" | frontmatter `faqs[0]` L21; Takeaways L65; pros L147; body L160 ("requires no account"); FAQ body L394; also implied L162 "Free" | 3 free transcripts per browser, then a free email unlock ("3 free, no signup. Email for unlimited."). No paid tier | **[S]** tool page L46, L524, `RATE_LIMIT = 3` L615, gate L1319 |
| S-02 | "AI summary" / "AI-powered summary" / "AI-generated summary" | Takeaways L65; pros L146; body L154; FAQ L394, L398; choose-list L379; L373; frontmatter `faqs[0..1]` L21, L23 | A **competitor-research brief** (Gemini `gemini-flash-latest`): one-liner, hook, 3-5 key claims, 5-8 timestamped sections, product mentions with timestamps, CTA, target buyer. Arrives ~10s after the transcript | **[S]** (feature changed, claim understates it) `summarize-transcript.ts` L20-49; tool page L52, L65 |
| S-03 | "works on any public YouTube URL" | pros L147; body L154 | Works only when the video has a caption track (auto or manual). Captionless video returns 422 "no captions". Private/deleted returns "not found" | **[S]** `get-transcript.ts` L90-104; tool page L505 |
| S-04 | "clean, timestamped transcript" output; export not stated | L154 | Clean view + timestamped view; **Copy text**, **Copy with timestamps**, **Download .txt**. No SRT/VTT/DOCX | **[V]** for timestamps; add formats. Tool page L265-266, L1441-1445 |
| S-05 | languages not stated | none | English captions first; if missing, falls back to the video's own caption language and labels it. No translation | **[V]** `transcript.ts` L95-99; tool page L874-879, L512 |
| S-06 | "Best used for single-video research ... not bulk" (con) | L152 | True, and stronger now: a shared site budget of 90 vendor calls a month (cached videos cost 0). When it runs out, the tool shows "Service is at capacity" | **[V]**, extend con. `transcript.ts` L281, L327-336; tool page L1227-1231. Owner decides how much of the capacity detail to publish (suggest: "free capacity is shared and can run out late in the month; cached videos still load") |
| S-07 | "It runs on the same public-URL transcription approach as the paid tools listed here" | L164 | **False.** SellonTube pulls the video's existing captions via Supadata. Sonix, Descript, ElevenLabs Scribe, Notta, Transkriptor run speech-to-text on the audio. Accuracy therefore equals YouTube's caption accuracy | **[S]** `transcript.ts` L73-84 |
| S-08 | "accurate transcripts" / "handles the same job in seconds" | L373 | Same caption text YouTube shows, formatted and downloadable, plus the brief. Not more accurate than YouTube's own transcript | **[S]** follows from S-07 |
| S-09 | "Last updated: June 2026"; "All pricing is current as of June 2026"; "(as of June 2026)" | L60, L123, L125 header, L162, L182-188, L212, L236, L260, L284, L306, L330, L354; frontmatter `faqs[2]` L25; FAQ L404 | Rechecked 2026-10-22 | **[S]** dates |
| S-10 | SellonTube screenshot | L141 `transcript-sellontube.png` (2026-03-21) | UI rebuilt 2026-09-05 (`40960b9` "rebuild results view") | **[S]**, owner takes a new capture showing transcript + brief |
| S-11 | og:image SVG, height 675 vs 630 | frontmatter L7, L10; built og tags | Raster PNG/JPG 1200x630 required for edited posts | **[S]** SEO_CONTEXT OPEN 7. A raster `best-youtube-transcript-generators-feature.webp` already exists (2026-03-13), check it is on-brand before reuse |
| S-12 | Tool page's own comparison table: Tactiq "10/mo", NoteGPT "5/day", Notta "Limited" | `src/pages/tools/youtube-transcript-generator.astro` L459-476 (not this post) | Tactiq web tool: no stated limit, no email; NoteGPT tool page: "Unlimited", no login | **[S]** note only; the tool page is in the pending tool-fix branch, do not edit it here |

Competitor rows (vendor pricing pages fetched 2026-10-22):

| # | Claim on page | Where | Current truth (vendor page) | Status |
|---|---|---|---|---|
| C-01 Sonix | No free tier; $10/hr PAYG; Core $25/mo (5 hrs); Advanced $50; Pro $80; formats TXT/DOCX/SRT/PDF | L66, L128, L179, L182, L188, FAQ L25/L404 | Same prices; annual Core $275/yr (not $300); 30-minute free trial, no card; exports DOCX, PDF, TXT, SRT, VTT | **[V]** prices; fix "$300 per year" (L188) to "$300 monthly-billed, $275 annual"; add the 30-min trial to the cons line |
| C-02 ElevenLabs | "There is no dedicated YouTube transcript product"; free ~10 min/mo; Starter $6; Creator $22 | L201, L205-210, L212, table L129 | `elevenlabs.io/youtube-transcript-generator` is a dedicated paste-a-URL page; exports TXT, DOCX, PDF, SRT, VTT, JSON, HTML; Free 10k credits at 330 credits/min = ~30 min/mo; no commercial licence on Free (licence listed from Starter); Starter $6, Creator $22, Pro $99 | **[S]** the whole "honest framing" paragraph is now wrong. Rewrite the section, keep the anchor id `#3-elevenlabs-youtube-transcript-generator` |
| C-03 Notta | Free 120 min/mo; Pro $13.99/mo ($8.17 annual); Business $27.99/seat | L130, L236, FAQ L25/L404 | Free 120 min/mo **but up to 3 minutes per conversation**, 50 uploads/mo; Pro $8.17/mo billed $97.99/yr (monthly price not shown); Business $16.67/seat/mo annual ($199.99/yr) | **[S]** Business price; **[U]** $13.99 monthly; add the 3-min cap (it makes the free tier near-useless for full YouTube videos) |
| C-04 Descript | Free; Hobbyist $24 ($16 annual); Creator $35 ($24); Business $65 | L131, L260 | Same; Business $50 annual; Free = 60 media min/mo | **[V]** |
| C-05 Kapwing | Free; Pro $16/mo annual ($24 monthly); Business $50 | L132, L284, FAQ L404 | Free = 10 credits, auto-subtitles up to 10 min; Pro $16, Business $50 shown with "Save 33%" annual toggle, period not labelled | **[U]** $24 monthly (33% saving from $24 = $16, consistent); add free 10-min cap |
| C-06 Transkriptor | "No" free plan; "From approx $8.33/mo (Capterra listing)" | L133, L306 | Free 90 minutes (stated on pricing page; duration unclear); Lite $9.99/mo (300 min); Pro $19.99/mo or $8.33/mo billed $99.99/yr; Team $30 / $20 per seat | **[S]** free-plan "No"; re-source price to the vendor page, not Capterra |
| C-07 NoteGPT | "Free (15 quotas/mo)"; "No export formats ... copy-paste only"; Pro $9/mo | L134, L324, L330, FAQ L404 | Tool page: no login, "Unlimited", copy or **download TXT**, with or without timestamps, multiple languages; Pro $9/mo billed annually ($108/yr, list $9.99); "15 quotas" not on the pricing page | **[S]** "no export"; **[U]** "15 quotas"; drop it unless the owner sees it in the app |
| C-08 Tactiq | Browser extension that captures while you watch; "Requires installing a browser extension"; "One video at a time, in real-time"; Free; Pro $8/user/mo annual | L340-352, L356, L383, Takeaways L68, table L135 | `tactiq.io/tools/youtube-transcript` is a **paste-a-URL web tool, no email**, TXT download. The extension is for live meetings. Pricing: Free 10 transcripts + 5 AI credits/mo (meetings); Pro $8/user/mo annual | **[S]** the section describes the wrong product. Rewrite pros/cons/body; keep anchor id `#9-tactiq`; the 4.8 Chrome Web Store rating covers the meeting extension, keep that caveat |
| C-09 YouTube built-in | Three-dot menu under the video, then "Show transcript" | L364-367 | Current desktop path per third-party guides: expand the description ("...more"), then "Show transcript" at the bottom | **[U]** likely stale; owner confirms on desktop + mobile and re-shoots if a screenshot is added |
| C-10 Ratings | Sonix 4.9/141 Capterra; Notta 4.4/234 G2; Descript 4.6/183 G2; Kapwing 4.4/207 Capterra; Transkriptor 4.7/551 Capterra; NoteGPT 4.9/~7,600 CWS; Tactiq 4.8/~3,800 CWS | L190, L238, L262, L286, L308, L332, L356 | Capterra returned 403; Chrome Web Store fetch returned nothing | **[U]** all seven. Owner re-reads each listing by hand on the refresh day and updates counts; add links to Notta (L238) and Tactiq (L356) |

**Retract everywhere (L-CL-04):** S-01, S-02, S-03, S-07, S-08 also live in frontmatter `faqs`
(L19-31). The blog template no longer emits FAQPage, but `excerpt`/`faqs` still feed other
surfaces. Update frontmatter and body together, or delete the frontmatter `faqs` array if nothing
else reads it (check `src/` for `faqs` consumers first).

### Information gain we can add (product- or repo-backed only)

1. **The competitor-research brief** (hook, claims, timestamped structure, product mentions, CTA,
   target buyer). No observed SERP result offers this. It is the honest reason SellonTube ranks first
   for *business* research, now that "no signup" is no longer fully true.
2. **Captions vs speech-to-text** explained in one definition block: "**Caption-based transcript
   tools** pull the caption track YouTube already has; **speech-to-text tools** run their own
   recognition on the audio." This sorts all 9 tools, explains accuracy and the captionless-video
   failure, and is backed by our own code (S-03, S-07).
3. **A dated, checkable free-tier table** (free limit, signup, export formats, languages, price),
   rechecked 2026-10-22, with the vendor page as source for each cell.

### First-party data available in the repo (for AIC-05)

| Candidate | Source | Usable? |
|---|---|---|
| The tool's own behaviour: 3 free runs then email; 30-day transcript cache; English first then fallback | tool page, `transcript.ts` | Yes, as disclosed product facts, not as a "study" |
| GA4 90d (to 2026-07-21): transcript tool 64 sessions, 8% engaged, 31s average, 36% western | `traffic-reality-check.md` L208, L257 | Factual but unflattering and old; do not publish |
| GSC: the tool page earned 75 clicks / 5,791 impr in 6 months to 2026-09-18 | main repo `research/search console/gsc data_18 sep_2026/Pages.csv` (untracked) | Do not publish (bot-inflated impressions, no user value) |
| Usage counts, test results, accuracy measurements | none found | **None exist. Do not invent one.** |

**Recommendation:** run a small, real, dated test before the rewrite and publish it as the
first-party claim, e.g. "We pasted the same 5 public B2B YouTube videos into each free tier on
2026-10-XX: N of 9 returned a transcript without an account, M offered a file download." The owner
runs it by hand; the result is whatever it is. If the owner skips the test, the post stays without
a first-party number, and AIC-05 stays a recorded Fail. Do not add "Tested" to the title without it.

---

## Phase 4: Refresh plan

- **Scope: moderate.** Facts across all 9 tool sections, 3 rewritten sections (SellonTube,
  ElevenLabs, Tactiq), 3 new blocks (criteria H3s, decision tree, use-case map), FAQ heading fix,
  new raster feature image. Ranking order, voice, URL and every anchor id stay.
- **URL:** keep `/blog/best-youtube-transcript-generators`. No slug change.

### Sections: Keep / Modify / New / Cut

| H2 (line) | Action | What changes |
|---|---|---|
| Intro L50-58 | **Modify** | Add one standalone answer block (project rule 134-167 words, labelled unverified) after L56: verdict sentence first ("For business teams researching competitor videos, SellonTube's free YouTube Transcript Generator is the best starting point because it adds a competitor-research brief to the transcript; Sonix is the best paid pick for accuracy and export formats."), then the caption-vs-audio split, then who should pick NoteGPT/Tactiq. Introduce one canonical term once, where it is true: "B2B YouTube" research ("... for B2B YouTube competitive research"). Do not force all four terms |
| Last updated + method L60 | **Modify** | "Last updated: October 2026". Method: "free limits, signup rules and prices rechecked on each vendor's pricing page on 2026-10-22"; keep the ratings disclaimer. Keep "hands-on use" only if the owner did use each tool |
| Key Takeaways L62-71 | **Modify** | L65: "3 free transcripts, then a free email unlock; transcript plus a competitor-research brief". L68: NoteGPT and Tactiq web tools, no account. Then **New**: Key Takeaways table (4-5 rows: Tool / Best for / Key strength / Free limit / Price) |
| Contents L73-89 | **Modify** | Add new H2s; keep every existing anchor |
| Why transcript tools matter L93-105 | **Keep** | Optional: number the 5 bullets as pain points (playbook arc) |
| How we evaluated L109-117 | **Modify** | Turn the 5 bullets into 5 H3 criteria, each opening with a one-sentence rule. Add criterion "Caption-based or speech-to-text" with the definition block. Keep the H2 text so `#how-we-evaluated-these-tools` survives |
| At a glance L121-135 | **Modify** | New columns: **Signup needed?**, **Free limit**, **Exports**, **Type (captions / speech-to-text)**. Update every stale cell (S-01, C-02, C-03, C-06, C-07, C-08). Header "Pricing (checked 2026-10-22)" |
| 1. SellonTube L139-164 | **Modify (heavy)** | Fix S-01..S-08; add "Key features" bullets (transcript clean/timestamped, research brief, copy, .txt download, language fallback); new con "Captionless videos cannot be transcribed"; extend L152 con with shared free capacity (owner wording); replace L164 sentence with the true mechanism; "(our tool)" disclosure stays; add "**Best for:**" line; new screenshot |
| 2. Sonix L168-190 | **Modify (light)** | Annual $275; 30-min trial; add VTT; "Best for:" line |
| 3. ElevenLabs L194-214 | **Modify (heavy)** | Remove "no dedicated YouTube product" (false); dedicated URL page, 7 export formats, ~30 free min/mo, no commercial licence on Free; "Best for:" line. Keep H2 text/anchor |
| 4. Notta L218-238 | **Modify** | 3-min-per-file free cap as the main con; Business $16.67/seat annual; drop or confirm $13.99; link the G2 listing |
| 5. Descript L242-262 | **Keep** | Add free 60 min; "Best for:" line |
| 6. Kapwing L266-286 | **Modify (light)** | Free = 10 min auto-subtitles; "Best for:" line |
| 7. Transkriptor L290-308 | **Modify** | Free 90 min exists; Lite $9.99; Pro $8.33 annual from the vendor page |
| 8. NoteGPT L312-332 | **Modify** | No login, TXT download, multiple languages; remove "No export formats"; remove "15 quotas" unless confirmed |
| 9. Tactiq L336-356 | **Modify (heavy)** | Describe the paste-a-URL web tool, no email, TXT; remove "Requires installing a browser extension" and "real-time" cons; new honest con: plain-text download only, the AI features sit in the meeting product; link the rating |
| Bonus: YouTube L360-373 | **Modify** | Confirm the current click path by hand; fix L373 "accurate transcripts ... in seconds" to the true value (formatted, downloadable, plus the brief) |
| How to choose L377-384 | **Modify** | Becomes a decision tree: 4 bold questions ("Do you need a file in SRT or DOCX?", "Will you transcribe more than 10 videos a month?", "Does the video have captions?", "Do you need the analysis or only the text?") with "If ... →" branches |
| **New H2** "Which transcript tool fits your use case?" | **New** | 8-10 scenarios: Scenario → Best choice → one-line reason (competitor demo teardown → Descript; captionless webinar recording → Sonix/ElevenLabs; quick quote check → YouTube built-in; 20 competitor videos for positioning → SellonTube brief; podcast-style panel → Sonix speaker labels; subtitles for own video → Kapwing; etc.). Place before FAQ |
| FAQ L388-418 | **Modify** | Promote questions to `### Question?` H3s (SEO_CONTEXT override); put the category labels as bold lines or drop them. Rewrite answers for S-01, S-02, prices. Rephrase 2-3 questions with "I/my" (AIC-10) |
| Related guides L422 | **Keep** | |

### New FAQ questions (evidence only)

- "Is there a YouTube transcript generator with no sign up?" (source: GSC tool-page queries
  `free youtube transcript generator no sign up`, `youtube transcript no sign up`,
  `research/search console/tool-outage-diagnosis-2026-08-26.md` L64-66). Answer must say which of
  the 9 need no account, and that SellonTube gives 3 runs before an email.
- "Why can't I get a transcript for some YouTube videos?" (source: our own 422 `no_captions` path,
  `get-transcript.ts` L95-104). Answers the caption-vs-audio split.
- "Which free YouTube transcript generator lets me download the file?" (source: caller GSC
  "best free youtube transcript generator" 16 impr; SERP gap: export column). Mark as GSC-backed;
  confirm a matching query row exists in the 90d export before adding.
- Add PAA questions only after the owner records them verbatim from a real SERP.

### Facts to update and retract everywhere

S-01..S-11 and C-01..C-10 above, in body, Takeaways, at-a-glance table, frontmatter `faqs`,
`excerpt` (L6, fine as is), `metadata.description` (L34), image alt (L8, fine), screenshot alt L141
("business-focused transcript and AI summary tool" → "transcript and competitor-research brief").

### Internal links

Anchor-cap check (grep of `src/data/post/*.md*`, 2026-10-22): exact anchor "best YouTube
transcript generators" → this post is used **3 times** (`ai-tools-for-youtube.mdx` L351,
`best-youtube-seo-tools-for-business.md` L434, `best-youtube-video-ideas-generators-for-businesses.md`
L543). **The cap is reached; do not reuse it.** The tool page uses "comparison of YouTube
transcript generators" (1).

**Inbound (add 2), from pages with real clicks** (GSC Pages export, 6 months to 2026-09-18,
main repo `research/search console/gsc data_18 sep_2026/Pages.csv`; the owner re-checks in the
90d live pull before editing):

| Host (clicks / 6 mo) | Location | Proposed sentence + anchor |
|---|---|---|
| `src/data/post/best-youtube-autocomplete-keyword-tools.md` (22 clicks, best blog click earner) | L651 "Related tool guides" paragraph, after the rank-checker link | "... and check which phrases competitors actually say on camera with our [comparison of free and paid YouTube transcript tools](/blog/best-youtube-transcript-generators)." |
| `src/data/post/youtube-marketing-case-studies.mdx` (8 clicks) | L278 "Steal this." paragraph, after "first 30 seconds of the transcript for that phrase" | "To see how a competitor words that same answer, pull their transcript with one of the [YouTube transcript generators we ranked for business research](/blog/best-youtube-transcript-generators)." (read the full sentence after insertion) |
| Optional: `src/data/post/best-youtube-rank-checker-tools-for-business.md` (8 clicks) | its Related guides line, if present | anchor "YouTube transcript tools for competitor research" |

Tool pages with clicks (`/tools/youtube-competitor-analysis` 13, `/tools/youtube-description-generator` 13)
are natural hosts, but they sit in the pending tool-fix branch (SEO_CONTEXT Gaps: "do not edit them
before it does"). List them as a follow-up.

**Outbound /tools/ (already >=4, keep):** `/tools/youtube-transcript-generator`,
`/tools/youtube-seo-tool`, `/tools/youtube-script-generator`, `/tools/youtube-video-keyword-finder`.
Add one where it fits the new use-case map: `/tools/youtube-competitor-analysis` ("pair the
transcript with a [YouTube competitor analysis](/tools/youtube-competitor-analysis)"), and
`/tools/youtube-timestamp-generator` for the "chapters for my own video" scenario. Convert the 3
absolute `https://sellontube.com/tools/youtube-transcript-generator` links (L139, L160, L373) to
relative paths for consistency (cosmetic).

### CTA

`toolCta: transcript-generator` (L12) stays. Do not add a CTA above the at-a-glance table. The
SellonTube section CTA line (L160) should state the real offer: "3 free transcripts, then unlock
more with an email."

### Title / meta

Current title `Best YouTube Transcript Generators (2026)` = 41 topic chars, 54 rendered. It is
within cap and matches the query. Change only if the owner wants a free/paid hook.

| Option | Topic chars | Rendered (+13) | Note |
|---|---|---|---|
| Keep: Best YouTube Transcript Generators (2026) | 41 | 54 | Safest; year is honest after a real refresh |
| 9 Best YouTube Transcript Generators (2026) | 43 | 56 | Count = 9 tools on page; re-count after refresh |
| Best Free YouTube Transcript Generators (2026) | 46 | 59 | Matches "best free" variant; risky because Sonix has no free plan |
| Best YouTube Transcript Generators: Free + Paid | 47 | 60 | At cap; drops the year |
| Best YouTube Transcript Generator: 9 Tested | 43 | 56 | **Only** if the owner runs the 5-video test |

Meta current (128): "9 YouTube transcript generators ranked for business teams. Rated on
competitive research, SEO, content repurposing, and pricing."

| Option | Chars |
|---|---|
| 9 YouTube transcript generators compared on free limits, signup, export formats and price, rechecked October 2026. Which one fits competitor research? | 150 |
| Free and paid YouTube transcript generators ranked for business teams: free limits, signup rules, export formats and October 2026 prices for each. | 146 |
| Need a YouTube transcript for competitor research? We compared 9 generators on free limits, signup, exports and price. Prices checked October 2026. | 147 |

### Dates

`updateDate` → the real ship date (IST rule, `YYYY-MM-DDT00:00:00Z`, never future). Material
refresh, so dateModified and sitemap lastmod bump: yes. `publishDate` unchanged. Main thread sets
the date, never a subagent.

### Feature image

Raster 1200x630 PNG/JPG per OPEN 7 (`scripts/get-feature-image.mjs`), and fix
`featuredImageHeight` so built og:image:height says 630.

---

## Buyer prompts for the owner to run by hand (mode 09 step 4-5)

Run monthly in ChatGPT, Perplexity, Gemini, Copilot and Google (AIO/AI Mode), fresh session, note
mode and country. Log: date · ID · assistant + mode · SellonTube named? · quote · accurate? ·
sources in order · rivals named. "AIO not shown" is its own value.

| ID | Prompt (verbatim) | Stage | Source |
|---|---|---|---|
| P-TR01 | What is the best YouTube transcript generator? | Category | Caller GSC: "best youtube transcript generator", 142 impr, pos 11.6, 5 clicks |
| P-TR02 | What's the best free YouTube transcript generator with no sign up? | Category | Caller GSC: "best free youtube transcript generator" 16 impr; tool-page query `free youtube transcript generator no sign up` (`tool-outage-diagnosis-2026-08-26.md` L65) |
| P-TR03 | How can I get the transcript of a competitor's YouTube video to study their messaging? | Solution-aware | Post's use case L97, tool page L52; no GSC row confirmed, label "product-sourced" |
| P-TR04 | Why does my YouTube transcript tool say the video has no captions? | Problem-aware | Our own `no_captions` 422 path (`get-transcript.ts` L95-104), GA4 reason `no_captions` |
| P-TR05 | Is there a free alternative to Sonix for YouTube transcripts? | Comparison | Existing FAQ L396; SERP: sonix.ai ranks #1 for P-TR01 |

---

## Scope verdict

**Moderate refresh, go.** The page ranks ~11-13 for its main query and is the site's only page
for the "compare transcript tools" intent. Its biggest problem is not SEO structure: the post
contradicts the product in 7 places and misdescribes 3 competitors (ElevenLabs, Tactiq, NoteGPT).
Per the house rule, the product is right. Fix facts first, then the citability gaps.

Priority order (proximity to a user who explores past the tool, per hour):
1. Own-tool facts S-01..S-08 everywhere, incl. frontmatter `faqs`.
2. Competitor facts C-02, C-03, C-06, C-07, C-08; dated recheck note; at-a-glance columns.
3. FAQ questions to H3 (one-line structural fix; mode 09 grep goes 0 → N).
4. Answer block + caption-vs-audio definition + criteria H3s + decision tree + use-case map.
5. Raster feature image + new SellonTube screenshot.
6. Two inbound links from clicked pages.
7. Optional 5-video first-party test (unlocks AIC-05 and a "Tested" title).

**Deliberately skipped, and why:**
- Adding tools (Otter, TurboScribe, youtube-transcript.io): changes the count of 9, the title
  number and the anchor list for a Low-priority gap.
- Changing the ranking order or moving SellonTube down: the caller said keep ranking sections.
  The honest con list does the trust work instead.
- ItemList/Review schema: optional in the playbook; ratings are unverified today.
- Editing the tool page's stale comparison table (S-12) and linking from tool pages: tool-fix
  branch pending.
- Forcing all 4 canonical entity terms: only "B2B YouTube" fits naturally. AIC-04 stays Partial
  by choice (AIC-08 beats it).
- The tool page's own ranking slump (pos 57-76 on head terms): a separate issue.

**Not verified in this plan:** all 7 third-party ratings (Capterra 403, Chrome Web Store empty);
Notta Pro monthly $13.99; Kapwing billing period; NoteGPT "15 quotas"; the YouTube built-in click
path; AIO and PAA for both queries; the 90d GSC rows for the proposed inbound hosts (taken from the
6-month export to 2026-09-18). No click or ranking outcome is promised.

## Phase 5: Approval
- [ ] Owner approved on [date]. Notes:

## Judging (filled later)
- Deploy date · live check · URL Inspection `lastCrawlTime` after deploy before any verdict
- 28 / 90-day read on the same query rows (clicks, position, mobile vs desktop US); GA4 sessions
  from the post into `/tools/youtube-transcript-generator`; P-TR01..05 citation log.
