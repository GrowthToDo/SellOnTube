# Refresh plan - /blog/best-youtube-autocomplete-keyword-tools - 2026-10-22

Mode 07 (phases 1-4) + mode 09 step 7 citability audit. READ-ONLY plan: no repo file was edited.
Source read: `SellonTube-wt-top5` at `605c8d8` (current main), `src/data/post/best-youtube-autocomplete-keyword-tools.md` (651 lines).
Live page fetched with curl 2026-10-22 (HTTP 200). Vendor facts checked with WebFetch/WebSearch 2026-10-22.
No ranking, traffic or citation gain is promised by anything below.

---

## Trigger

- **Trigger 3 (facts stale) fired, confirmed.** 9 of 11 tool entries carry at least one claim that is stale, at risk, or unverifiable as of 2026-10-22 (table below). Our own tool is described wrongly in 4 places (email gate, modifier count, CSV columns, missing AI clustering).
- Trigger 2 (position slipped) is ambiguous after the bot check: page avg pos 10.1 → 13.7 (prev 90d vs 07-22..10-19, caller-supplied GSC), but the prior peak was competitor-brand navigational demand ("keywordintent.io youtube", India) that vanished. Human rows that matter are small: "youtube autocomplete" 100 impr pos 9.2 / 3 clicks; "find great keywords using youtube autocomplete" 50 impr pos 7.7 / 2 clicks; "autocomplete keyword generator" 15 impr pos 12. Do not scope from the impression drop.
- Refresh before new: the post already owns "best ... tools" intent; no other post targets it. `/tools/youtube-autocomplete-keywords` owns the head term "youtube autocomplete" (pos 7.4, 13 clicks, caller GSC). **Do not retarget the post at that head term.**
- Owner context: last 6 months to 2026-09-18 this page had 22 clicks / 8,431 impr / pos 10.9, the #6 page on the site by clicks (`SellonTube/research/search console/gsc data_18 sep_2026/Pages.csv`, "Last 6 months"). It is one of the few posts with real clicks, so the refresh protects an asset rather than chases one.

## Phase 1: Current state

- **Live check (curl 2026-10-22):** 200; canonical `https://sellontube.com/blog/best-youtube-autocomplete-keyword-tools`; `<title>` = "10 Best YouTube Autocomplete Keyword Tools (2026)" (49 chars; `ignoreTitleTemplate: true` L38 means no " | SellOnTube" suffix renders; this is the only post in `src/data/post/` that sets it); meta = L39 (149 chars); `dateModified` 2026-06-28T18:30Z; og:image = `.svg` at 1200x675; 0 FAQPage blocks; 9 rendered `<h3>…?</h3>` question headings.
- **Last material update:** 2026-06-29 (`2316ff2` comparison-standard retrofit), CTR tweak 2026-06-30 (`aed3ba5`), link passes 2026-07-17. Tool screenshots date from 2026-04-16 (`0cb1e98`), 6 months old.
- **Anchors to keep (GSC rows + inbound links):** `#1-sellontube-youtube-autocomplete-keyword-tool`, `#4-keyword-tool-dominator`, and all `#N-<tool>` ids, `#what-to-do-this-week`, `#how-to-find-great-keywords-using-youtube-autocomplete` (matches the "find great keywords using youtube autocomplete" query row, pos 7.7). Keep H3 tool headings byte-identical so ids do not change.
- **Strengths to keep:** 11-tool ranked list in identical order; visible "Last updated" + methodology note (L60); 12-row cheat sheet (L510-586); pre-calculated cost section (L497-508); 5-step "How to Find Great Keywords" section (L445-469) that earns a query row; categorized FAQ groups (L603-647); own-tool disclosure (L231); honest Ahrefs-maintenance handling; voice.
- **Weaknesses:** stale facts (below); dead TOC anchor; own-tool claims that the tool no longer matches; unsourced first-party claim; FAQ heading not `## FAQ`; SVG feature image; raw iframe instead of facade; contradictory "four free tools" lists.

### Citability + comparison gate audit (source lines; built-HTML checks from the live page)

| ID / gate item | Result | Evidence (line refs) |
|---|---|---|
| AIC-01 / §16 R1 answer block early, names the app | **Partial** | L106+L108 together are 138 words (inside 134-167) and sit early, but they are 2 paragraphs, not one standalone block, and the verdict (SellonTube is the pick for buyer intent) lives in L108's unsourced claim. Opening L54-58 is a narrative hook, no verdict. |
| Playbook §1 one-sentence verdict in first sentence | **Fail** | L54 opens with "You type 'crm for small business'…". No verdict until Key Takeaways L75. |
| AIC-02 / §17 first sentence mirrors heading | **Partial** | Pass: L106, L447, L473 (weak: "Now, you might be thinking"), L499. Fail: L173 H2 has no lead sentence; L510 cheat sheet starts "Skip the full comparison…"; L473 opener is filler. |
| AIC-03 / §16 R4 definition block | **Pass** | L106 `**A YouTube autocomplete keyword tool** is …`. Add one for "buyer-intent tagging" (concept we want to own). |
| AIC-04 / §16 R2 canonical entity terms | **Partial** | "YouTube acquisition channel" x3, "customer acquisition" x3; "buyer-intent video" x0; "B2B YouTube" x0 (grep). |
| AIC-05 / §16 R3 first-party claim, sourced | **Fail** | L108 "Based on SellonTube's analysis of 500+ autocomplete queries across B2B verticals" has no source anywhere in the repo (grep: only this file); it entered in the first draft `95ea1ae` 2026-04-16. Treat as unverified; cut or replace with real data (see Information gain). |
| AIC-06 / §17 named subjects, no metaphor, checkable | **Partial** | L149 bold aphorism, L493 fear line ("a competitor with less expertise is ranking…") is an unverifiable claim; L185 "Here's the thing:", L473 "Now, you might be thinking" are filler. |
| AIC-07 takeaways/TOC/diagrams name + link app, claims pass audit | **Fail** | TOC L85 links `#the-11-best-youtube-autocomplete-keyword-tools`; live id is `the-10-best-youtube-autocomplete-keyword-tools` → **dead anchor**. TOC omits 2 H2s (L497, L510). Takeaway L75 "Free, no signup" and the L112 SVG ("CSV with metadata") overstate: full list + CSV sit behind an email gate (tool L186-216). Takeaway L75 "only one that tags…" is at risk (see stale facts). Takeaways do link the app? No: L75 names SellonTube but has no link. |
| AIC-08 reads fine without AI search | **Pass** | Structure serves humans. |
| AIC-09 criteria / comparison table / decision table / use-case map stand alone | **Partial** | Comparison table L159-171 and cheat sheet stand alone. Criteria (L141-147) are bold paragraphs, not a standalone H2 with H3 criteria (playbook §4); decision list L477-491 is a ✅/❌ list, not 3-5 branching questions (playbook §7). |
| AIC-10 FAQ phrased like assistant prompts | **Partial** | 9 questions, none use "I/my". e.g. L605 could be "What is the best free YouTube autocomplete tool for my business channel?" |
| ONP-08 / §19 signal 1 visible FAQ | **Partial** | Visible (9 rendered H3 questions), but heading is `## Common Questions` (L601); house rule requires `## FAQ` with `### Question?` H3s. |
| §19 signal 4 TOC with anchors | **Fail** | dead anchor + 2 missing H2s (above). |
| §19 signal 5 question-style H2s | **Fail** | 0 of 8 H2s are questions. Add 1-2 where natural (do not rename H2s whose ids are linked). |
| §19 signal 8 fresh dates | **Fail** | "Last updated: June 2026" (L60), "as of June 2026" x5 (L253, L295, L375, L377, L381, L489). |
| §18 media: screenshot per tool + video, perf-safe | **Partial** | 11 screenshots (L177-427) present, but 6 months old and some now show stale UI (Ahrefs page still maintenance, KTD pricing changed). Video L62-67 is a raw lazy iframe, not the click-to-load facade (`YouTubeFacade.astro` needs MDX; this is `.md`). |
| Playbook §2 Key Takeaways **table** (3-5 rows: tool / best for / strength / price) | **Fail** | Only a bullet box (L69-79). |
| Playbook §3 problem-solution arc (numbered pains + bridge) | **Partial** | L151-155 manual-vs-tool contrast; no numbered pains. |
| Playbook §6 per-tool template (intro / features / pros / cons / pricing / reviews / best for) | **Partial** | Every tool has Best for / Key advantage / Key limitation / Pricing / Reviews / Verdict in identical order, and a con for every tool. No "Key features" bullets. Acceptable as-is; do not force a rewrite of 11 sections (ethos: no filler). |
| Playbook §10 categorized FAQ | **Pass** | 5 bold group labels (L603, L617, L623, L629, L639). |
| Third-party ratings real, linked, none fabricated; own-tool disclosure | **Pass with drift** | KeywordTool.io 4.3/5 from 36 (Capterra, still 4.3/36, listing updated 2026-07-21, via search snippet; capterra.com 403s WebFetch). Ahrefs "584 reviews" now reads ~581-583 in snapshots: change to "580+ reviews". Disclosure L231 present. |
| Pre-calculated savings | **Pass, numbers stale** | L501-502 math built on $88/$68 and KTD $29-69; both inputs changed (below). |
| Internal links ≥4 incl. one `/tools/` | **Pass** | 7 tool links (autocomplete, seo-tool, tag, title, ideas evaluator, keyword finder) + 9 blog links. |
| Em dashes / en dashes | **Pass** | 0 / 0 (grep). |
| Feature image raster 1200x630 (edited posts) | **Fail** | L7 `.svg`; live og:image 1200x675 svg. Gate fails an SVG `image:` once edited. |
| Frontmatter `faqs` vs body | Note | 9 frontmatter Qs mirror the body; FAQPage JSON-LD is off site-wide (2026-10-15), so frontmatter only feeds nothing visible. Keep in sync or trim; body is what counts. |

## Phase 2: SERP read (dated 2026-10-22, method WebSearch, US; no manual nfpr=1 capture)

Query 1: "best youtube autocomplete keyword tools". Query 2: "youtube autocomplete keyword tool".

| Pos (as returned) | URL | Publisher type | Format | Covers that we skip | Last updated |
|---|---|---|---|---|---|
| 1 | wyzowl.com/youtube-keyword-tools | Video agency blog | "11 Best YouTube Keyword Tools (2026)" | Not fetched (403). Title only. | 2026 per title |
| 2 | semrush.com/blog/youtube-keyword-tools | SEO vendor | 6-tool list + table + per-tool "How to use" | YouTube search bar as tool #0, vidIQ, TubeBuddy, 1of10, Keywords Everywhere, Semrush Keyword Analytics for YouTube; per-tool how-to steps | dated 2025-04-17, title says 2026 |
| 3 | limelightdigital.co.uk/youtube-keyword-research-tools | Agency blog | 9-tool list | not fetched | 2026 per title |
| 4 | wbcomdesigns.com/best-youtube-keyword-tools | WP vendor blog | 10-tool list | not fetched | 2025 per title |
| 5 | practicalecommerce.com/6-keyword-tools-for-video-seo | Trade pub | 6 tools (YouTube autocomplete, You Autocomplete Me, Pemavor, Google Videos, related searches, TubeRanker) | Google Videos "related searches" as a source; says You Autocomplete Me exports to Excel | 2022-08-04 |
| 6 | link-assistant.com/keyword-research/youtube-keyword-tool.html | Vendor (Rank Tracker) | Tool page | Rank Tracker's YouTube autocomplete module (paid desktop) | not checked |
| q2 | air.io …/where-to-find-keywords-for-youtube-10-free-and-paid-tools | Creator network | 10-tool list | not fetched | not checked |
| q2 | producthunt.com/products/free-youtube-keyword-generator-tool | Launch listing | New free no-signup generator (1,000+ suggestions, tag/CSV export) | A new free rival not on our list | "Launched this week" (date not verified) |
| q2 | apify.com/karamelo/youtube-keywords-shitter | Apify actor | Another autocomplete actor | not needed |

- **SERP shape:** the head SERP is "best YouTube keyword tools" listicles that mix autocomplete scrapers with vidIQ/TubeBuddy/Ahrefs/Semrush. Pure "autocomplete tool" roundups are rare; ours is one of few that is autocomplete-specific.
- **AIO:** not observed (WebSearch does not show the AI Overview). **PAA:** not observed. Do not invent either; owner checks by hand (P-prompts below).
- **Winnability:** big brands (Semrush, Ahrefs) are in the broad "youtube keyword tools" SERP, so the refresh stays aimed at the autocomplete-specific long tail we already earn (L-TOP-02).

## Phase 3: Gap analysis

Columns C1-C5 = Semrush, Practical Ecommerce, Wyzowl, Limelight, Wbcom. Only C1, C2 were read in full; C3-C5 are title/snippet-level, so their cells are "?" and no priority is built on them.

| Topic / element | Us | C1 | C2 | C3-C5 | Priority |
|---|---|---|---|---|---|
| YouTube search bar itself as the free baseline tool, with method | FAQ only (L631) | yes (tool #1) | yes (tool #1) | ? | Medium (2 confirmed) |
| vidIQ / TubeBuddy positioned vs autocomplete tools (why they are not autocomplete scrapers) | no (vidIQ named once L627, not in list) | yes | no | likely | Medium; add 1 short "Tools we left out and why" paragraph, not new entries |
| Per-tool "how to use" steps | no (only for SellonTube) | yes | no | ? | Low; skip (filler risk) |
| Google Trends / Google Videos related searches as validation | no | no | yes | snippet: yes | Low/Medium; one line in Step 5 |
| Key Takeaways table (tool / best for / strength / price) | no | yes (table) | no | ? | Required by our playbook gate regardless |
| Buyer-intent tagging + priority | yes | no | no | no | Our angle; keep |
| AI clustering of keywords into video topics (one title per cluster) | **no, though our tool ships it since 2026-05-16 (`5f71cba`)** | no | no | no | **Emerging: information gain from product** |
| Dated hands-on test of each tool (what returned, export worked y/n) | methodology claim only | no | no | ? | Emerging (only if the owner reruns tests) |

### Stale facts (product or vendor is right, page is wrong)

Status key: **verified** (vendor page 2026-10-22 matches), **stale** (vendor page contradicts), **at risk** (evidence suggests change, needs a hands-on check), **unverifiable** (no vendor source reachable).

| # | Claim on page | Where it lives | Current truth (2026-10-22) | Source | Status |
|---|---|---|---|---|---|
| 1 | SellonTube: "Free… no signup", "Signup? No", export "CSV", "Four tools 100% free with no signup: SellonTube…" | Table L161; L75 takeaway; L229; L237; L477; L499; L501; L527; L537; L567; FAQ L607, L615 + frontmatter L19, L25; meta L39 ("the only tool…"); excerpt L6; SVG L138 "CSV with metadata" | Quick scrape is free/no signup but shows a **teaser of 3 keywords per intent category, no copy buttons** (tool astro L762-770). Full list + CSV need an **email** (email gate L186-216; tool's own FAQ L617). No credit card. | `src/pages/tools/youtube-autocomplete-keywords.astro` | **stale** |
| 2 | Quick scrape "returns 30-80 keywords" | L181, table L161 "30-200+" | Scrape returns 30-80, but only a 3-per-category preview is shown before the gate | tool astro L40, L762 | **stale (wording)** |
| 3 | "19 buyer-intent modifiers" | L183 | **35 modifiers** in `MODIFIERS` | `netlify/functions/lib/youtube-suggest.ts` L20-~55 (35 `text:` entries) | **stale** (tool page L637 says 19 too; tool page is frozen, flag separately) |
| 4 | CSV columns "keyword, intent category, priority level, seed keyword, geography, timestamp" | L221 | Default path: AI-clustered CSV `keyword,cluster_id,is_primary,intent,value,angle,seed_keyword,geography,timestamp` (auto-downloads when clustering succeeds). Fallback only: `keyword,intent,priority,…` | tool astro L1014-1015, L1038-1039, L1286-1290, L1316-1321 | **stale** |
| 5 | Tool feature set omits AI clustering into 8-12 video-topic clusters with a one-line angle each | L181-235 | Shipped 2026-05-16 (`5f71cba`), Gemini `gemini-flash-latest` | `netlify/functions/cluster-keywords.ts` L3, L11-18 | **stale (omission)** |
| 6 | "Twenty geography options" / "20 geographies" | L221, L582, L643, frontmatter L33 | 20 options **including Global** (19 countries + Global) | tool astro L50+ `geoOptions` (20 labels) | verified; say "19 countries plus Global" |
| 7 | "Only… tool that tags every keyword by buyer intent" | L75, L225, L503, L532, L621, L39 meta, L6 excerpt, frontmatter L21 | Pemavor's page says it groups suggestions "by search attributes and intents"; Keyword Tool Dominator now sells "AI Intents" (a "Keyword Intents" component). Neither page confirms a High/Medium/Low **buyer-intent priority**. | pemavor.com autocomplete page; keywordtooldominator.com home | **at risk**: narrow to "the only free tool on this list that assigns a buyer-intent priority (High/Medium/Low)" after a hands-on check of both |
| 8 | KeywordTool.io Pro "$88/month (or $68/month billed annually)" | Table L162; L247, L251, L253; L483; L501 ($1,056 / $816); L502 | Pro Basic **$89/mo monthly, $69/mo annual** (TechRadar, Originality.ai and others, 2026). Vendor pricing page 404'd; keywordtool.io/youtube schema shows offer range "68 to 788 USD". | third-party reviews; vendor schema | **stale (likely)**; owner confirms on keywordtool.io before publish |
| 9 | KeywordTool.io free "750+" suggestions, volume paid-only | L162, L245, L552, L483 | "over 750+" verified; volume = Pro | keywordtool.io/youtube | verified |
| 10 | KeywordTool.io Capterra 4.3/5 from 36 | L255 | 4.3 / 36, listing updated 2026-07-21 | WebSearch snippet of capterra.com/p/179574 (direct fetch 403) | verified (indirect) |
| 11 | Keyword Tool Dominator free "2-3 searches per day" | L289, L295 | **2 per day** per keyword source, no signup | keywordtooldominator.com/youtube-keyword-tool | **stale** |
| 12 | KTD paid "one-time… one year: Plus $29 (1 tool), Pro $49 (5 tools, most popular), Max $69 (all tools)" | L289, L295, L299, L485, L502 ("1/15th"), L507, L562 | One-time, **access lengths 30 days / 90 days / 1 year / lifetime**. Card prices for 30 days: Plus $9, Pro $15 (Most Popular), Max $25 (all 8 tools). Plus "from": 90d $19, 1yr $39, lifetime $89; Max lifetime $149. Pro/Max 1-year prices not shown in the fetched text. | keywordtooldominator.com/pricing | **stale**; owner reads the 1-year column for each tier before rewriting the math |
| 13 | KTD "50+ countries and languages", Popularity Score 0-100, "hot" flags | L287, L582, L643 | 50+ countries, ~80 languages, Popularity Score 0-100 relative to the current results (not volume). "Hot" flag not confirmed. | KTD youtube tool page | verified (drop "hot" unless seen) |
| 14 | Pemavor: free, no account, unlimited, 4 sources, CSV, N-gram | L163, L267-273 | Matches page copy (FAQ "always FREE", no sign-up, no limits, CSV, Ngram Topics) but the captured page also showed a Google sign-in button and an error message | pemavor.com autocomplete page | **at risk**: hands-on check that no login is forced |
| 15 | Keyword.io: "persistent list builder… No signup. Completely free", exports | L165, L309-317, L556, L566, L615 | Search is free without account; **"Sign up to save and organize your keywords"** (My Lists needs an account). Export not mentioned on the page. | keyword.io youtube-longtail-finder | **stale** (list builder needs signup); export **unverifiable** |
| 16 | RyRob: free, no signup, YouTube volume + competition | L166, L331-337 | Free, no signup, estimated monthly YouTube searches (mainly US), low/medium/high difficulty, no stated limits | ryrob.com/youtube-keyword-tool | verified |
| 17 | YouAutoCompleteMe: "No export or copy", rate limit 15-20 searches then 30 min | L167, L355, L487, L499 | Rate limit text verified ("15-20 Little or 1-2 Big searches", 30-minute break). Page shows a "DOWNLOAD" label; Practical Ecommerce (2022) says it exports to Excel | youautocompleteme.io/youtube | rate limit verified; "no export" **at risk** |
| 18 | Ahrefs YouTube tool "under maintenance as of June 2026", 170+ countries | L371, L375, L377, L381, L489 | Still "This tool is under maintenance." on 2026-10-22; 170 countries | ahrefs.com/youtube-keyword-tool | verified; update date to Oct 2026 |
| 19 | Ahrefs Starter $29/mo, main tiers from $129/mo | L375, L377 | Starter $29, Lite $129, Standard $249, Advanced $449, Enterprise $1,499 (annual saves up to 17%; interval not stated) | ahrefs.com/pricing | verified |
| 20 | Ahrefs Capterra 4.7/5 from 584 | L379 | 4.7 from ~581-583 in 2026 snapshots | WebSearch snippets of capterra.com/p/176340 (direct 403) | drift: write "4.7/5 from 580+ reviews" |
| 21 | SemanticPen: account + credits, copy-all + CSV | L169, L391-397 | Free credits with signup, no card; copy-all and CSV confirmed | semanticpen.com tool page | verified |
| 22 | Botster "$3 per 3,000 credits" pay-as-you-go | L415, L417, L615 ("$3-5 per batch") | Page shows a **one-time new-user offer** "Get 3000 credits for $3"; standard rates on a separate pricing page (not read); 3 depth levels and login required verified | botster.io bot page | **at risk**: reword as "new users get 3,000 credits for $3; standard credit pricing on Botster's pricing page" or read pricing page |
| 23 | Apify PowerAI actor "from $4.99 per 1,000 results"; prefix/suffix modifiers; scheduled runs | L435, L437, L615 | **from $3.99 / 1,000 results** (pay-per-event); region + language inputs; modifiers not mentioned; 9 users; "No ratings yet". Scheduling is an Apify platform feature, not actor-specific. ScraperMind actor not checked | apify.com/powerai/youtube-keyword-suggestions-scraper | **stale** (price); modifiers **unverifiable** |
| 24 | "As of June 2026" / "Last updated: June 2026" / "checked… in June 2026" | L60, L253, L295, L375, L377, L381, L489 | Must become the real recheck month after the owner confirms rows 8, 12, 14, 15, 17, 22 | - | **stale** |
| 25 | Internal contradiction: "Four tools… 100% free with no signup: SellonTube, Pemavor, RyRob, YouAutoCompleteMe" vs "Four tools… SellonTube, Pemavor, Keyword.io, RyRob" | L499 vs L615 + frontmatter L25 | Pick one corrected list after rows 1, 14, 15 | - | **stale** |
| 26 | vidIQ named as a volume tool though not reviewed | L627 | Either cut or cover in the new "left out and why" paragraph | - | fix |
| 27 | Screenshots (11) | L177-427 | Taken 2026-04-16. Retake at least: SellonTube (gate + clusters now), KTD (pricing/UI), Keyword.io (My Lists signup), YouAutoCompleteMe (download label) | git `0cb1e98` | **stale** |
| 28 | Dead/renamed tools | all | None dead. Ahrefs tool unusable (maintenance). New rival found: Product Hunt "free YouTube keyword generator" (1,000+ suggestions, CSV/tag export, no signup) | WebSearch | note; do not add without a hands-on test |

### Information gain we can add (only from product, data or repo evidence)

1. **AI clustering (product fact, verified in code):** the tool groups the exhaustive list into 8-12 video-topic clusters, each with a primary keyword, variations and a one-line video angle, and exports them (`cluster-keywords.ts` L11-18; CSV L1014-1015). No SERP competitor describes this. Write it as a fact with a disclosure, no superiority claim.
2. **Replace the unsourced "500+ queries" claim** with one of these real first-party items:
   - Product facts that are checkable: 35 buyer-intent modifiers, 27 queries in the quick scrape (tool L350), 60-100+ in the exhaustive scrape, 19 countries plus Global.
   - GA4 (90 days to 2026-07-21, `traffic-reality-check.md` Finding 5/6): autocomplete tool sessions averaged **154 s** and **1.97 pages/session** (35 sessions). Small sample: state the n and window, or skip.
   - Best option, needs owner time: a dated hands-on run of all 11 tools on 2-3 B2B seeds ("crm for small business", etc.) recording keywords returned, export y/n, signup y/n. This also backs the methodology note (L60), which today claims hands-on testing that the repo cannot evidence.
3. **Honest limitation upgrade:** state that the full list and CSV need an email, and that the free tool has no volume data. Balanced tradeoffs get cited (§17 "objective over promotional").

## Phase 4: Refresh plan

- **Scope: moderate.** Facts across the whole page + 3 new short blocks + FAQ heading + TOC + image. No re-structure, no tool added or removed, no ranking order change.
- **URL:** keep `/blog/best-youtube-autocomplete-keyword-tools`. Keep `ignoreTitleTemplate: true` or drop it (see Title).

### Section plan (H2 by H2)

| H2 (line) | Action | What changes |
|---|---|---|
| Intro L54-58 | **Modify** | Add a first-sentence verdict before the hook (playbook §1): one sentence naming the pick per need (SellonTube (our tool) for buyer-intent priority, Pemavor for free bulk, RyRob for free volume, KeywordTool.io for raw count). Fix "10+" to "11". |
| Last updated / methodology L60 | **Modify** | Real recheck date (Oct 2026), and state what was actually checked (vendor pages on date X; hands-on only if the owner reruns tests). |
| Video L62-67 | **Keep** (flag) | Facade needs MDX conversion (`.md` → `.mdx`); out of scope for this refresh, log as follow-up. Iframe already `loading="lazy"`. |
| Key Takeaways L69-79 | **Modify** | Correct L75 (email gate for full list/CSV; narrowed "only" claim); add a link to the tool in L75 (AIC-07). |
| *(new)* Key Takeaways table, after the box | **New** | 4-5 rows: Tool / Best for / Key strength / Price (SellonTube, Pemavor, RyRob, KeywordTool.io, Keyword Tool Dominator). Playbook §2. |
| Contents L81-100 | **Modify** | Fix dead `#the-11-…` → `#the-10-…` (or match whatever the H2 becomes; if the H2 changes to "The 11 Best…", the id becomes `the-11-best-…` and the TOC then matches; check no inbound link uses `#the-10-…`: grep found none). Add the 2 missing H2s. Rename last entry to FAQ. |
| What to Look For L104-155 | **Modify** | Keep L106 definition. Rewrite L108 as one standalone 134-167-word answer block naming SellonTube as the intent-tagging pick, with no "500+" claim. Convert the 4 bold criteria (L141-147) to H3s under this H2 (playbook §4; anchors are new, nothing breaks). Add a definition block: `**Buyer-intent tagging** is …`. Introduce "buyer-intent video" once (AIC-04). Cut L149 aphorism or make it a checkable sentence. |
| Comparison Table L157-171 | **Modify** | Fix SellonTube row (Signup: "Email for full list + CSV"), KeywordTool.io price, KTD free/paid, Keyword.io signup for lists, YAM export (after check), Apify. Add one-line lead sentence that answers the heading. |
| The 10+ Best… L173 | **Modify** | Heading count to 11 (changes id; TOC follows). Add a lead sentence: ranking order and why. |
| #1 SellonTube L175-237 | **Modify** | Rows 1-6 facts; add AI clustering paragraph; update CSV column sentence; disclose email gate in Pricing L229; keep the "(our tool)" disclosure; replace screenshot. Keep H3 text exactly. |
| #2-#11 tools L239-443 | **Modify** | Apply stale-fact rows 8-23 only. Keep H3 text exactly (ids `2-keywordtoolio` … `11-apify-…`, `4-keyword-tool-dominator` has GSC rows). Retake 4 screenshots. |
| How to Find Great Keywords L445-469 | **Keep** | Earns the "find great keywords using youtube autocomplete" row (pos 7.7). Only add one Step 5 line on Google Trends' YouTube filter as a validation check. |
| How to Choose L471-495 | **Modify** | Replace opener L473 ("Now, you might be thinking") with a sentence that answers the heading. Restructure as 3-5 bold decision questions with "If… →" branches (playbook §7), reusing the current ✅/❌ content. Cut L493 fear line (unverifiable). Update KTD/KeywordTool.io prices. |
| *(new)* "Tools We Left Out, and Why" (short, ≤120 words) | **New** | vidIQ, TubeBuddy, Semrush, Rank Tracker: why they are keyword suites, not autocomplete scrapers. Covers the Medium gap without adding 4 entries. No ratings, no prices unless verified. |
| What the Free Tools Save You L497-508 | **Modify** | Recompute with confirmed prices. Draft math if $89/$69 confirms: $89 × 12 = **$1,068/yr**; $69 × 12 = **$828/yr**. KTD Plus 1-year $39 vs $1,068 = about **96% less** (roughly 1/27th). Replace "1/15th". Fix the four-free-tools list (row 25). |
| Cheat Sheet L510-586 | **Modify** | Lead sentence that answers the heading; fix L527, L537, L562, L566, L582 facts. Keep 12 rows. |
| What to Do This Week L588-599 | **Modify** | Step 2-3: quick scrape preview, then email for the full clustered CSV. Keep links. |
| Common Questions L601-647 | **Modify** | Rename to `## FAQ` (id changes from `common-questions`; grep found no inbound link to `#common-questions`). Keep group labels. Rephrase 3-4 questions with "I/my" (AIC-10). Fix L615 list and prices, L621 "only" wording, L627 vidIQ, L643 countries. Sync frontmatter `faqs` L17-35 with the body or trim it (it renders nothing now). |
| Related tool guides L651 | **Keep** | - |

### Facts to update and retract everywhere (L-CL-04)

Every location in the stale-facts table, including: frontmatter `excerpt` L6, `faqs` L19/L21/L23/L25/L33, meta L39, SVG text L138 ("CSV with metadata", fine) and L112 aria-label, takeaways L75, both tables, cheat sheet, FAQ body. Grep after editing for: `\$88`, `\$68`, `\$1,056`, `\$816`, `\$29 to \$69`, `\$49`, `2-3 searches`, `\$4.99`, `19 buyer-intent`, `June 2026`, `500+`, `no signup` near SellonTube, `only`.

### New FAQ from evidence only

- GSC row "autocomplete keyword generator" (15 impr, pos 12): add "Is there a free YouTube autocomplete keyword generator I can use without signing up?" answered honestly (SellonTube quick scrape preview, Pemavor, RyRob, YouAutoCompleteMe).
- GSC row "find great keywords using youtube autocomplete" is already served by the H2; no FAQ needed.
- "keyword 4you" / "keyword 4u" rows (~53 impr, pos 17-21): no tool by that name could be identified (WebSearch 2026-10-22 returned nothing). Do not write for it.
- No PAA was observed; add none from guesswork.

### Internal links

**Inbound, from pages with real GSC clicks (6 months to 2026-09-18, `gsc data_18 sep_2026/Pages.csv`) that do not already link here:**

| Source file | Clicks / impr | Location | Proposed anchor (new phrase; exact-match count today = 0) |
|---|---|---|---|
| `src/data/post/youtube-seo-services.md` | 9 / 14,400 | L121, sentence "YouTube's search suggest feature, Google Trends' YouTube filter, and free tools give you enough data to find good topics." Link the words "free tools" → reword to "free YouTube autocomplete tools compared here" | "free YouTube autocomplete tools compared here" |
| `src/data/post/youtube-business-plan.mdx` | 7 / 1,828 | After L271 ("…it ranks in YouTube search for the exact phrase your buyers are typing…"), add one sentence: "To check the exact phrasing, run each question through one of these [free and paid YouTube autocomplete tools](/blog/best-youtube-autocomplete-keyword-tools)." Read the full sentence after insertion (L-LI-04). | "free and paid YouTube autocomplete tools" |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | 37 / 2,522 (strongest) | Tool page "how it compares" area | **Deferred**: this file is in the 13-tool-page freeze until the tool-fix branch lands (SEO_CONTEXT "Gaps found"). Log as follow-up. |

Already linking here with clicks (no action): `best-youtube-transcript-generators` (10 clicks), `best-youtube-rank-checker-tools-for-business` (8), `high-intent-topic-research-framework` (3), `best-youtube-video-ideas-generators-for-businesses` (1).

**Anchor diversity cap (~3 source pages per exact anchor, `docs/engineering-conventions.md` L79):** the exact anchor "best YouTube autocomplete keyword tools" already points here from **9 source pages** (search-intent-youtube-seo-power, youtube-marketing-strategy, how-to-find-youtube-autocomplete-keywords, youtube-autocomplete-b2b-research, high-intent-topic-research-framework, youtube-keyword-research, best-youtube-seo-tools-for-business, youtube-seo-guide, best-youtube-video-ideas-generators-for-businesses). Pre-existing breach of the cap. Do not add that phrase again. Optional follow-up (separate task, not this refresh): vary it on 6 of the 9 sources.

**Outbound:** already ≥4 internal + 6 `/tools/` links. Anchors to `/tools/youtube-autocomplete-keywords` are spread (top: "youtube autocomplete keyword tool" from 5 sources); new mentions in this post should reuse its own existing anchors, not add a 6th source of that phrase. Optionally add 1 link to `/blog/youtube-autocomplete-b2b-research` from the clustering paragraph (that target has 4 distinct anchors, no reuse risk), anchor "B2B seed keywords to start with".

### CTA

- `toolCta: youtube-autocomplete-keywords` stays. Body CTAs (L235, L237, L592) must not say "no signup" for the CSV. No UTM convention on internal tool links in this repo; none added.

### Title and meta

Rendered title today: 49 chars, no suffix (`ignoreTitleTemplate: true`). Cap: 60 on the full rendered title. If the flag is kept, ≤60 raw; if dropped, ≤47 raw. All options below are ≤47 except where noted, so they pass either way.

| # | Title | Chars | Note |
|---|---|---|---|
| current | 10 Best YouTube Autocomplete Keyword Tools (2026) | 49 | count is wrong (page lists 11); passes only with flag kept |
| A | 11 Best YouTube Autocomplete Keyword Tools (2026) | 49 | minimal change, fixes count; keep flag |
| B | 11 YouTube Autocomplete Keyword Tools, Compared | 47 | works with or without flag |
| C | Best YouTube Autocomplete Keyword Tools (Free) | 46 | leans on "free" phrasing that works for tools (traffic-reality-check) |
| D | 11 Free and Paid YouTube Autocomplete Tools | 43 | matches existing inbound anchor "(Free & Paid)" |

Recommend A (lowest risk; year stays only because the content is genuinely refreshed). Do not change the slug.

| # | Meta description | Chars |
|---|---|---|
| current | 10+ YouTube autocomplete keyword tools tested and ranked for 2026. Free picks, CSV export, and the only tool that tags every keyword by buyer intent. | 149 (carries the at-risk "only" + no-gate implication) |
| 1 | 11 YouTube autocomplete keyword tools compared on price, export and free limits. Updated October 2026. One free tool tags every keyword by buyer intent. | 152 |
| 2 | Which YouTube autocomplete tool fits your channel? 11 free and paid tools compared on export, limits and pricing, checked against vendor pages Oct 2026. | 152 |
| 3 | Compare 11 YouTube autocomplete keyword tools: free limits, CSV export, pricing and intent tagging. Prices checked October 2026, with a pick per use case. | 154 |

### Dates and image

- `updateDate` → the real ship date (material change: yes). Visible "Last updated" → same month. Never bump `publishDate`.
- Feature image: ship a raster 1200x630 (`best-youtube-autocomplete-keyword-tools-featured.png` from the house SVG, or `node scripts/get-feature-image.mjs`), set `image:` to it (`seo/site-kit/brand-visuals.md` L14, L199-200).

### Buyer prompts for the owner to run by hand (mode 09 steps 4-5)

Run in ChatGPT, Perplexity, Gemini, Copilot and Google (AIO / AI Mode), fresh session, note mode + country. Log: date · ID · assistant · SellonTube named? · quote · accurate? · sources cited · rivals named. Record "AIO not shown" separately.

| ID | Prompt (verbatim) | Stage | Source |
|---|---|---|---|
| P01 | What is the best free YouTube autocomplete keyword tool? | Category | FAQ L605 + GSC "autocomplete keyword generator" row |
| P02 | Is there a YouTube keyword tool that tells me which keywords have buyer intent? | Solution-aware | FAQ L619 (our differentiator) |
| P03 | How do I find great keywords using YouTube autocomplete for my business channel? | Solution-aware | GSC row "find great keywords using youtube autocomplete" (50 impr, pos 7.7) |
| P04 | KeywordTool.io vs Keyword Tool Dominator for YouTube keyword research, which is cheaper? | Comparison | Post sections #2, #4 (#4 anchor has GSC rows); SERP rivals |
| P05 | Free alternative to vidIQ for finding YouTube autocomplete keywords | Comparison/alternative | SERP: vidIQ in every broad roundup (Semrush, search snippets) |

Note any cited third-party listicle for P01/P05 that omits SellonTube: that is the outreach list, not a page fix.

### Things deliberately skipped, and why

- **Retargeting the head term "youtube autocomplete":** the tool page owns it (pos 7.4, 13 clicks). Cannibalization.
- **Adding vidIQ/TubeBuddy/Semrush as ranked entries:** they are not autocomplete scrapers; a short "left out and why" paragraph covers the gap without diluting the list.
- **Adding the Product Hunt free generator:** not tested; add only after a hands-on run.
- **Rewriting all 11 tool sections into the full features/pros/cons template:** current identical-order template already has a con per tool; a forced rewrite is filler.
- **`.md` → `.mdx` for the YouTube facade:** separate perf task; changes the content processor (BLD-01 risk) across 650 lines.
- **Linking from the autocomplete tool page:** blocked by the tool-page freeze.
- **Fixing the 9-source anchor-cap breach on other posts:** separate internal-linking task.
- **Chasing "keyword 4u/4you":** unidentified navigational demand.
- **Answer-block word count as a hard gate:** 134-167 is a SellonTube rule labelled `unverified` in post-rules AIC-01; meet it, but do not pad to hit it.

### Verification status (what I checked vs assumed)

- Checked: post source (whole), live HTML head + ids, tool source code (gate, modifiers, CSV, clusters, geos), inbound link greps, anchor counts, 6-month GSC Pages export, vendor pages for 10 of 10 competitors (WebFetch; Capterra via search snippets).
- Assumed / not verified: KeywordTool.io exact price (vendor pricing page 404, third-party sources agree on $89/$69); KTD 1-year prices for Pro and Max; Botster standard credit rates; YouAutoCompleteMe export; Pemavor no-login; Keyword.io export; whether Pemavor/KTD "intents" equal buyer-intent priority. Wyzowl, Limelight, Wbcom pages not read (403 / not fetched). AIO and PAA not observed. The caller-supplied 90-day GSC figures were used as given, not re-pulled.

## Phase 5: Approval

- [ ] Owner approved on [date]. Owner confirms rows 8, 12, 14, 15, 17, 22 by hand before the rewrite.

## Judging (filled later)

- Deploy date · live check · URL Inspection `lastCrawlTime` after deploy before any verdict.
- 28 / 90-day read on the same rows: "youtube autocomplete", "find great keywords using youtube autocomplete", "autocomplete keyword generator", `#4-keyword-tool-dominator` rows; clicks to `/tools/youtube-autocomplete-keywords` from this page (GA4); P01-P05 citation log month over month.
