"""
Update sot_master.csv with:
  - kd_real      : real keyword difficulty from DataForSEO Labs (backlink-based, not GKP)
  - tier         : winnable (KD<=30) | stretch (KD 31-45) | avoid (KD>45) | pseo (pSEO pages)
  - priority_score: recalculated using live volume + real KD

Priority score formula (from content-playbook.md, adapted to use live data):
  1. Business potential (0-40pts) — from cluster
  2. Content-market fit (0-30pts) — from intent
  3. Search potential (0-20pts)   — from search_volume_live + kd_real
  4. Resource cost (0-10pts)      — from content_type

Usage:
    python3 scripts/update_keyword_tiers.py
"""

import csv
import os
import sys
from pathlib import Path

import requests

# ── Config ───────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).parent.parent
CSV_PATH = REPO_ROOT / "research/keywords/sot_master.csv"
ENV_PATH = REPO_ROOT / ".env"
DFS_BASE = "https://api.dataforseo.com/v3"


def load_env(path: Path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip())


# ── Priority score formula ────────────────────────────────────────────────────

CLUSTER_BUSINESS_PTS = {
    "youtube_seo": 40, "youtube_lead_gen": 40, "b2b": 40, "youtube_keyword_research": 40,
    "youtube_marketing": 28, "youtube_analytics": 28, "youtube_growth_strategy": 28,
    "youtube_automation": 28, "youtube_title_generator": 28, "youtube_video_ideas": 28,
    "youtube_tools_software": 28,
    "youtube_general": 14, "youtube_shorts_strategy": 14,
    "youtube_transcription_captions": 14, "video_marketing_general": 14,
    "video_production": 0, "youtube_ads": 0,
}

INTENT_PTS = {
    "commercial": 30, "transactional": 30,
    "informational": 21, "strategic": 21,
    "technical": 15,
    "navigational": 5, "": 10,
}

CONTENT_TYPE_PTS = {
    "pseo_for": 10, "pseo_vs": 10,
    "blog": 6,
    "tool": 8,
}


def calc_priority(row: dict, kd_real) -> float:
    cluster = row.get("cluster", "")
    intent = row.get("intent", "")
    content_type = row.get("content_type", "")

    # pSEO pages: scored on business potential + content type only (volume/KD not applicable)
    if content_type in ("pseo_for", "pseo_vs"):
        biz = CLUSTER_BUSINESS_PTS.get(cluster, 14)
        ctype = CONTENT_TYPE_PTS.get(content_type, 6)
        return round(biz + ctype, 1)

    # 1. Business potential
    biz = CLUSTER_BUSINESS_PTS.get(cluster, 14)

    # 2. Content-market fit
    fit = INTENT_PTS.get(intent, 10)

    # 3. Search potential — use live volume, fall back to original
    vol = int(row.get("search_volume_live") or row.get("search_volume") or 0)
    vol_score = min(vol / 50000, 1) * 10

    kd = kd_real if kd_real is not None else int(row.get("keyword_difficulty") or 50)
    diff_score = ((100 - kd) / 100) * 10
    search_pts = vol_score + diff_score

    # 4. Resource cost
    ctype = CONTENT_TYPE_PTS.get(content_type, 6)

    return round(biz + fit + search_pts + ctype, 1)


def assign_tier(content_type: str, kd_real) -> str:
    if content_type in ("pseo_for", "pseo_vs"):
        return "pseo"
    if kd_real is None:
        return "avoid"
    if kd_real <= 30:
        return "winnable"
    if kd_real <= 45:
        return "stretch"
    return "avoid"


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    load_env(ENV_PATH)
    login = os.environ.get("DATAFORSEO_LOGIN", "")
    password = os.environ.get("DATAFORSEO_PASSWORD", "")
    if not login or not password:
        print("ERROR: DATAFORSEO credentials not set.", file=sys.stderr)
        sys.exit(1)

    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
        fieldnames = list(rows[0].keys())

    # Only score blog/tool keywords with DataForSEO (pSEO pages stay as-is)
    blog_rows = [r for r in rows if r["content_type"] in ("blog", "tool")]
    keywords = [r["keyword"].strip() for r in blog_rows]

    print(f"Fetching real KD for {len(keywords)} blog/tool keywords...")
    resp = requests.post(
        f"{DFS_BASE}/dataforseo_labs/google/bulk_keyword_difficulty/live",
        auth=(login, password),
        json=[{"keywords": keywords, "language_name": "English", "location_name": "United States"}],
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()
    items = data["tasks"][0]["result"][0].get("items", []) if data["tasks"][0].get("result") else []
    kd_map = {item["keyword"].lower(): item["keyword_difficulty"] for item in items}
    print(f"  Got KD for {len(kd_map)} keywords. Cost: ${data.get('cost', 0):.4f}")

    # Add new columns if missing
    for col in ["kd_real", "tier"]:
        if col not in fieldnames:
            fieldnames.append(col)

    # Update all rows
    tier_counts = {"winnable": 0, "stretch": 0, "avoid": 0, "pseo": 0}
    for row in rows:
        kw_lower = row["keyword"].strip().lower()
        content_type = row.get("content_type", "")

        if content_type in ("pseo_for", "pseo_vs"):
            kd_real = None
            row["kd_real"] = ""
        else:
            kd_real = kd_map.get(kw_lower)
            row["kd_real"] = kd_real if kd_real is not None else ""

        tier = assign_tier(content_type, kd_real)
        row["tier"] = tier
        row["priority_score"] = calc_priority(row, kd_real)
        tier_counts[tier] += 1

    # Write back
    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nCSV updated: {CSV_PATH.name}")
    print(f"  Winnable (KD<=30):  {tier_counts['winnable']} keywords")
    print(f"  Stretch  (KD 31-45): {tier_counts['stretch']} keywords")
    print(f"  Avoid    (KD>45):   {tier_counts['avoid']} keywords")
    print(f"  pSEO     (no KD):   {tier_counts['pseo']} keywords")

    # Show top 15 winnable by priority score
    winnable = sorted(
        [r for r in rows if r["tier"] == "winnable" and r["status"] != "live"],
        key=lambda x: float(x["priority_score"] or 0),
        reverse=True,
    )
    print(f"\nTop 15 winnable keywords by new priority score (not yet live):")
    print(f"  {'Keyword':<50} {'KD':>4} {'Vol':>7} {'Score':>6} {'Status'}")
    print(f"  {'-'*50} {'-'*4} {'-'*7} {'-'*6} {'-'*12}")
    for r in winnable[:15]:
        vol = int(r.get("search_volume_live") or r.get("search_volume") or 0)
        print(f"  {r['keyword']:<50} {str(r['kd_real']):>4} {vol:>7} {float(r['priority_score']):>6.1f} {r['status']}")


if __name__ == "__main__":
    main()
