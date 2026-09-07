# Archived Scripts (2026-09-07)

19 one-off scripts, each a single-session investigation or a one-time hardcoded-path data merge.
None were referenced by `package.json`, none referenced by any other script or doc. Kept for
reference if a similar one-off investigation comes up again — not meant to be re-run as-is (most
hardcode absolute local paths or a specific date range/URL list).

**GSC one-off investigations (8):** `gsc_analysis.py`, `gsc_corpus.py`, `gsc_deep.py`,
`gsc_extras.py`, `gsc_inspect.py`, `gsc_measure.py`, `gsc_query_export.py`, `gsc_session_jul20.py`
— each answers one historical question about a specific date range or page set. For a new GSC
question, use `scripts/mcp_seo_server.py` or `scripts/fetch_seo_data.py`, both still live in
`scripts/`.

**Keyword one-off merges/experiments (10):** `merge_new_keywords.py`, `merge_vireo_keywords.py`,
`filter_sot_keywords.py`, `keyword_gap_analysis.py`, `zero_vol_process.py`, `zero_vol_research.py`,
`icp_filter_clusters.py`, `add_clean_clusters.py`, `show_clusters.py`,
`competitor_keyword_volumes.py` — one-time batch processing of externally-sourced keyword CSVs. The
live, maintained keyword pipeline is `build_sot_keywords.py` → `build_sot_master.py` →
`refresh_keyword_volumes.py` → `update_keyword_tiers.py`, all still in `scripts/` (see
`growth-strategy.md`'s Keyword Tier System section).

**Other (1):** `insert_niche_content.py` — one-time bulk insert into `src/data/niches.ts` for the
original 29 pSEO niches.

**Security note:** `zero_vol_research.py` had a hardcoded DataForSEO password before this archive
pass; it now reads `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD` from the environment. The old password
is still in git history and needs rotation with the vendor — see `mistakes-lessons.md` or
`docs/repo-audit-summary.md` (2026-09-07).
