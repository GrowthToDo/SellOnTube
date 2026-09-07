"""
Merge new GKP keyword exports into master_keywords_cleaned.csv
==============================================================
Input:  C:/Users/D E L L/Downloads/Keywords for SoT/*.csv  (UTF-16 LE GKP exports)
        research/keywords/master_keywords_cleaned.csv       (existing master)
Output: research/keywords/master_keywords_cleaned.csv       (updated in-place)
        research/keywords/cluster_summary.csv               (updated)
"""

import os
import re
import sys
import warnings
import pandas as pd

warnings.filterwarnings("ignore")

if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT    = os.path.dirname(SCRIPT_DIR)
MASTER_PATH  = os.path.join(REPO_ROOT, "research", "keywords", "master_keywords_cleaned.csv")
CLUSTER_PATH = os.path.join(REPO_ROOT, "research", "keywords", "cluster_summary.csv")
NEW_FILES_DIR = r"C:\Users\D E L L\Downloads\Keywords for SoT"

# ── Column map (same as process_keywords.py) ─────────────────────────────────
COLUMN_MAP = {
    "keyword":                          "keyword",
    "avg. monthly searches":            "search_volume",
    "competition (indexed value)":      "keyword_difficulty",
    "competition":                      "competition_level",
    "top of page bid (high range)":     "cpc",
    "top of page bid (low range)":      "cpc_low",
}

# ── STEP 1 — Load new files ──────────────────────────────────────────────────
print("\n" + "="*60)
print("STEP 1 — LOAD NEW FILES")
print("="*60)

dfs = []
files = [f for f in os.listdir(NEW_FILES_DIR) if f.endswith(".csv")]
print(f"New files found: {len(files)}")

for fname in files:
    fpath = os.path.join(NEW_FILES_DIR, fname)
    print(f"\n  Loading: {fname}")
    for enc in ["utf-16", "utf-16-le", "utf-8-sig", "latin-1"]:
        try:
            df = pd.read_csv(fpath, encoding=enc, sep="\t", skiprows=2)
            df.columns = [str(c).strip().lower() for c in df.columns]
            df = df.rename(columns={k: v for k, v in COLUMN_MAP.items() if k in df.columns})
            if "keyword" not in df.columns:
                continue
            df["source_file"] = fname
            df["source_sheet"] = ""
            dfs.append(df)
            print(f"    -> {len(df)} rows (encoding: {enc})")
            break
        except Exception as e:
            continue

if not dfs:
    print("ERROR: No new keyword files could be loaded.")
    sys.exit(1)

raw = pd.concat(dfs, ignore_index=True, sort=False)
print(f"\nTotal new raw rows: {len(raw):,}")

# ── STEP 2 — Extract essential columns ──────────────────────────────────────
KEEP_COLS = ["keyword", "search_volume", "keyword_difficulty", "cpc", "source_file", "source_sheet"]
for col in KEEP_COLS:
    if col not in raw.columns:
        raw[col] = None
raw = raw[KEEP_COLS].copy()

raw["search_volume"]    = pd.to_numeric(raw["search_volume"],    errors="coerce")
raw["keyword_difficulty"] = pd.to_numeric(raw["keyword_difficulty"], errors="coerce")
raw["cpc"]              = pd.to_numeric(raw["cpc"],              errors="coerce")

# ── STEP 3 — Clean ───────────────────────────────────────────────────────────
print("\n" + "="*60)
print("STEP 2 — CLEAN NEW KEYWORDS")
print("="*60)

raw["keyword"] = (
    raw["keyword"].astype(str).str.lower().str.strip().str.strip('.,;:!?"\'')
)
raw = raw[raw["keyword"].notna() & (raw["keyword"] != "") & (raw["keyword"] != "nan")]
print(f"After removing empty rows: {len(raw):,}")

raw = raw.sort_values(["keyword", "search_volume"], ascending=[True, False])
raw = raw.drop_duplicates(subset="keyword", keep="first")
print(f"After internal dedup: {len(raw):,}")

# ── STEP 4 — Strategic filter (same rules as process_keywords.py) ────────────
print("\n" + "="*60)
print("STEP 3 — STRATEGIC FILTER")
print("="*60)

NAVIGATIONAL = re.compile(
    r'\b(login|log in|sign in|signin|sign up|signup|homepage|download|install|app store)\b'
)
POSSESSIVE = re.compile(r'^(my |your )')
GENERIC_EXACT = {"youtube", "video", "channel", "videos", "channels", "content"}

OFF_TOPIC_PATTERNS = re.compile(
    r'\b(medical transcription|doctor|physician|hospital|emr|ehr'
    r'|podcast(?! .*youtube|.*video|.*transcript)'
    r'|spotify|apple podcast|anchor fm|buzzsprout'
    r'|celebrity|gossip|music video(?! market|.*strat|.*seo)|song|album|artist|singer|band'
    r'|movie|film|netflix|hulu|disney'
    r'|photoshop|lightroom|photography(?! youtube)|photo edit'
    r'|minecraft|fortnite|gaming(?! youtube|.*channel|.*content|.*monetiz))\b'
)

# Additional filters for ads/promotions (extra caution for new batch)
ADS_PROMO_PATTERNS = re.compile(
    r'\b(google ads|facebook ads|instagram ads|tiktok ads|paid ads|ppc|pay per click'
    r'|ad campaign|ad spend|ad budget|ad creative|ad copy|ad targeting'
    r'|influencer marketing|influencer outreach|influencer campaign'
    r'|social media marketing|social media ads|twitter ads|linkedin ads'
    r'|promotion|promotional|press release|pr agency|media buy'
    r'|email marketing|email campaign|newsletter|mailchimp|klaviyo'
    r'|sms marketing|push notification|retargeting|remarketing'
    r'|affiliate marketing(?! youtube)|dropshipping|ecommerce(?! youtube|.*video)'
    r'|amazon|etsy|shopify(?! youtube|.*video)|print on demand)\b'
)

BUSINESS_RELEVANT = re.compile(
    r'\b(youtube|video|channel|vlog|vlogger|creator|content|seo|search engine|thumbnail|'
    r'monetiz|revenue|income|earn|sponsor|brand deal|affiliate|ad revenue|cpm|rpm|'
    r'analytics|algorithm|growth|views|subscribers|watch time|retention|click.?through|'
    r'shorts|reel|faceless|automation|script|repurpos|transcri|caption|subtitle|'
    r'b2b|saas|founder|business|marketing|lead gen|acquisition|roi|funnel|'
    r'tool|software|platform|ai|audit|strategy|optimization|keyword|tag|description|'
    r'hook|editing|production|upload|schedule|batch)\b'
)

def filter_keyword(kw):
    if NAVIGATIONAL.search(kw):         return "navigational"
    if POSSESSIVE.match(kw):            return "possessive"
    if kw in GENERIC_EXACT or (len(kw.split()) == 1 and kw not in {"vidiq", "tubebuddy", "outlier"}):
        return "too_generic"
    if OFF_TOPIC_PATTERNS.search(kw):   return "off_topic"
    if ADS_PROMO_PATTERNS.search(kw):   return "ads_promotions"
    if not BUSINESS_RELEVANT.search(kw): return "low_business_relevance"
    return "keep"

raw["_filter"] = raw["keyword"].apply(filter_keyword)
removed = raw[raw["_filter"] != "keep"]
filtered = raw[raw["_filter"] == "keep"].copy()

print("Removed breakdown:")
print(removed["_filter"].value_counts().to_string())
print(f"\nKept after filter: {len(filtered):,}")
print(f"Total removed: {len(removed):,}")

# Show what was removed as ads/promotions
ads_removed = removed[removed["_filter"] == "ads_promotions"]["keyword"].tolist()
if ads_removed:
    print(f"\nAds/promotions keywords removed ({len(ads_removed)}):")
    for kw in sorted(ads_removed):
        print(f"  - {kw}")

# ── STEP 5 — Intent + Cluster + Score ────────────────────────────────────────
print("\n" + "="*60)
print("STEP 4 — CLASSIFY + SCORE")
print("="*60)

INTENT_RULES = [
    ("monetization",  re.compile(r'\b(monetiz|revenue|income|earn|money|sponsor|brand deal|affiliate|cpm|rpm|adsense|ad revenue|get paid|make money)\b')),
    ("transactional", re.compile(r'\b(best|top|buy|price|cost|free|cheap|affordable|tool|software|platform|app|service|agency|hire|alternative|vs|compare|review)\b')),
    ("technical",     re.compile(r'\b(api|integration|algorithm|seo|search engine|keyword|tag|description|metadata|schema|analytics|tracking|audit)\b')),
    ("optimization",  re.compile(r'\b(optimize|optimise|boost|increase|improve|grow|rank|ranking|ctr|click.?through|retention|watch time|impression|engagement|performance)\b')),
    ("strategic",     re.compile(r'\b(strategy|plan|guide|playbook|framework|system|workflow|process|batch|schedule|automat|repurpos|content calendar|pillar|cluster)\b')),
    ("commercial",    re.compile(r'\b(best|top|review|alternative|comparison|vs|versus|compare|recommend|recommended)\b')),
    ("informational", re.compile(r'\b(how|what|why|when|where|who|which|guide|tutorial|learn|explain|example|case study|beginner|introduction|overview|tips|ideas)\b')),
]

def classify_intent(kw):
    for intent, pattern in INTENT_RULES:
        if pattern.search(kw): return intent
    return "informational"

CLUSTER_RULES = [
    ("youtube_monetization",           re.compile(r'\b(monetiz|adsense|cpm|rpm|revenue|income|earn|make money|get paid|sponsor|brand deal|affiliate|membership|super chat|channel member)\b')),
    ("youtube_ads",                    re.compile(r'\b(youtube ad|video ad|in.?stream|pre.?roll|bumper ad|skippable|non.?skip|trueview|google ads.*video|video campaign|ads manager)\b')),
    ("youtube_seo",                    re.compile(r'\b(youtube seo|video seo|rank|ranking|search engine|keyword research|tags|title optim|description optim|metadata)\b')),
    ("youtube_analytics",              re.compile(r'\b(analytic|studio|dashboard|report|metric|kpi|ctr|watch time|impression|retention|audience|demographic|traffic source)\b')),
    ("youtube_algorithm",              re.compile(r'\b(algorithm|recommended|suggested|trending|viral|discovery|feed|home page algorithm|browse feature)\b')),
    ("youtube_automation",             re.compile(r'\b(automat|faceless|ai generat|batch.*video|bulk.*upload|repurpos|ai.*youtube|youtube.*ai|script.*generat|auto.*publish)\b')),
    ("youtube_thumbnails",             re.compile(r'\b(thumbnail|click.?through|ctr.*image|cover image|preview image|thumbnail maker|thumbnail design)\b')),
    ("youtube_shorts_strategy",        re.compile(r'\b(shorts|short.?form|vertical video|reel|tiktok.*youtube|youtube.*tiktok)\b')),
    ("youtube_content_strategy",       re.compile(r'\b(content strateg|content plan|content calendar|topic.*idea|video idea|content pillar|editorial|batch record|content cluster|niche)\b')),
    ("youtube_tools_software",         re.compile(r'\b(tool|software|platform|vidiq|tubebuddy|outlier|tubegrow|vidtao|extension|app.*youtube|youtube.*app|ai.*tool)\b')),
    ("youtube_growth_strategy",        re.compile(r'\b(grow|growth|subscriber|views|increase.*channel|channel growth|scale.*youtube|youtube.*business|b2b.*youtube|youtube.*b2b|lead.*youtube|youtube.*lead)\b')),
    ("youtube_transcription_captions", re.compile(r'\b(transcri|caption|subtitle|closed caption|auto.*caption|transcript|speech.?to.?text|youtube.*transcript)\b')),
    ("video_production",               re.compile(r'\b(edit.*video|video.*edit|production|record|filming|lighting|audio|microphone|camera|green screen|b.?roll|hook|script)\b')),
]

def classify_cluster(kw):
    for cluster, pattern in CLUSTER_RULES:
        if pattern.search(kw): return cluster
    if "youtube" in kw: return "youtube_general"
    return "video_marketing_general"

BIZ_ALIGNMENT = {
    "youtube_monetization":            1.0,
    "youtube_ads":                     1.0,
    "youtube_seo":                     1.0,
    "youtube_analytics":               1.0,
    "youtube_algorithm":               1.0,
    "youtube_growth_strategy":         1.0,
    "youtube_automation":              0.9,
    "youtube_content_strategy":        0.9,
    "youtube_tools_software":          0.9,
    "youtube_shorts_strategy":         0.8,
    "youtube_thumbnails":              0.8,
    "youtube_transcription_captions":  0.7,
    "video_production":                0.6,
    "youtube_general":                 0.5,
    "video_marketing_general":         0.5,
}

filtered["search_intent"]          = filtered["keyword"].apply(classify_intent)
filtered["topic_cluster"]          = filtered["keyword"].apply(classify_cluster)
filtered["business_alignment_score"] = filtered["topic_cluster"].map(BIZ_ALIGNMENT).fillna(0.5)

print("Intent distribution (new keywords):")
print(filtered["search_intent"].value_counts().to_string())
print("\nCluster distribution (new keywords):")
print(filtered["topic_cluster"].value_counts().to_string())

# ── STEP 6 — Load existing master + deduplicate ───────────────────────────────
print("\n" + "="*60)
print("STEP 5 — MERGE WITH MASTER")
print("="*60)

master = pd.read_csv(MASTER_PATH, encoding="utf-8-sig")
print(f"Existing master keywords: {len(master):,}")

existing_keywords = set(master["keyword"].str.lower().str.strip())
new_only = filtered[~filtered["keyword"].isin(existing_keywords)].copy()
print(f"New keywords (not in master): {len(new_only):,}")
print(f"Duplicates skipped (already in master): {len(filtered) - len(new_only):,}")

if len(new_only) == 0:
    print("\nNothing new to add. Master unchanged.")
    sys.exit(0)

# ── STEP 7 — Priority score new keywords in master context ────────────────────
# Compute norm_sv and norm_kd relative to the combined dataset for consistency
combined = pd.concat([master, new_only[KEEP_COLS + ["search_intent", "topic_cluster", "business_alignment_score"]]],
                     ignore_index=True)

sv_max = combined["search_volume"].max()
sv_min = combined["search_volume"].min()
kd_max = combined["keyword_difficulty"].max()
kd_min = combined["keyword_difficulty"].min()

def priority_score(row):
    sv = row["search_volume"] if pd.notna(row["search_volume"]) else 0
    kd = row["keyword_difficulty"] if pd.notna(row["keyword_difficulty"]) else 50
    biz = row["business_alignment_score"] if pd.notna(row["business_alignment_score"]) else 0.5
    norm_sv = (sv - sv_min) / (sv_max - sv_min) if sv_max > sv_min else 0.5
    norm_kd = (kd - kd_min) / (kd_max - kd_min) if kd_max > kd_min else 0.5
    return round(0.5 * norm_sv + 0.3 * (1 - norm_kd) + 0.2 * biz, 4)

new_only["priority_score"] = new_only.apply(priority_score, axis=1)

# ── STEP 8 — Append + sort + write ───────────────────────────────────────────
print("\n" + "="*60)
print("STEP 6 — WRITE OUTPUT")
print("="*60)

MASTER_COLS = ["keyword", "search_volume", "keyword_difficulty", "cpc",
               "search_intent", "topic_cluster", "priority_score",
               "business_alignment_score", "source_file", "source_sheet"]

new_rows = new_only[[c for c in MASTER_COLS if c in new_only.columns]].copy()
updated_master = pd.concat([master, new_rows], ignore_index=True)
updated_master = updated_master.sort_values("priority_score", ascending=False).reset_index(drop=True)

updated_master.to_csv(MASTER_PATH, index=False, encoding="utf-8-sig")
print(f"[OK] master_keywords_cleaned.csv -> {len(updated_master):,} keywords (was {len(master):,})")

# Cluster summary
cluster_summary = (
    updated_master.groupby("topic_cluster")
    .agg(
        total_keywords=("keyword", "count"),
        avg_search_volume=("search_volume", lambda x: round(x.mean(), 0)),
        avg_keyword_difficulty=("keyword_difficulty", lambda x: round(x.mean(), 1)),
        avg_priority_score=("priority_score", lambda x: round(x.mean(), 4)),
    )
    .sort_values("total_keywords", ascending=False)
    .reset_index()
)
cluster_summary.to_csv(CLUSTER_PATH, index=False, encoding="utf-8-sig")
print(f"[OK] cluster_summary.csv updated")

# ── STEP 9 — Report ───────────────────────────────────────────────────────────
print("\n" + "="*60)
print("FINAL REPORT")
print("="*60)
print(f"""
  Previous master count:  {len(master):>8,}
  New raw rows loaded:    {len(raw):>8,}
  After filter:           {len(filtered):>8,}
  Net new (unique):       {len(new_only):>8,}
  Updated master count:   {len(updated_master):>8,}
""")

print("CLUSTER SUMMARY (full)")
print(cluster_summary.to_string(index=False))

print("\nTOP 20 NEW KEYWORDS BY PRIORITY SCORE:")
top20 = new_only.sort_values("priority_score", ascending=False).head(20)
top20.index = range(1, len(top20)+1)
print(top20[["keyword", "search_volume", "keyword_difficulty", "search_intent", "topic_cluster", "priority_score"]].to_string())
print("\n✅ Done.")
