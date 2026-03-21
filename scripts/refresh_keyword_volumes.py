"""
Refresh sot_master.csv with live keyword metrics from DataForSEO.

What it does:
- Reads all keywords from sot_master.csv
- Fetches live search_volume and CPC (USD) from DataForSEO in one batched call
- Adds two new columns: `search_volume_live` and `cpc_usd_live`
- Adds a `volume_refreshed_at` column with today's date
- Writes an updated CSV (keeps all existing columns intact)
- Prints a summary of keywords where live volume differs significantly from CSV

Usage:
    DATAFORSEO_LOGIN=... DATAFORSEO_PASSWORD=... python3 scripts/refresh_keyword_volumes.py

Or just run it — it reads .env automatically if python-dotenv is installed,
otherwise falls back to environment variables.
"""

import csv
import json
import os
import sys
from datetime import date
from pathlib import Path

import requests

# ── Config ──────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).parent.parent
CSV_PATH = REPO_ROOT / "research/keywords/sot_master.csv"
ENV_PATH = REPO_ROOT / ".env"

DFS_BASE = "https://api.dataforseo.com/v3"
BATCH_SIZE = 1000  # DataForSEO max per task


# ── Load .env manually (no dependency on python-dotenv) ─────────────────────

def load_env(path: Path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip())


# ── DataForSEO call ──────────────────────────────────────────────────────────

def fetch_volumes(keywords: list[str], login: str, password: str) -> dict[str, dict]:
    """
    Returns a dict keyed by keyword (lowercase) with keys:
        search_volume, cpc
    """
    results = {}
    batches = [keywords[i:i + BATCH_SIZE] for i in range(0, len(keywords), BATCH_SIZE)]

    for batch in batches:
        payload = [{
            "keywords": batch,
            "language_name": "English",
            "location_name": "United States",
        }]
        resp = requests.post(
            f"{DFS_BASE}/keywords_data/google_ads/search_volume/live",
            auth=(login, password),
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()

        task = data.get("tasks", [{}])[0]
        if task.get("status_code") != 20000:
            print(f"  WARNING: Task error — {task.get('status_message')}", file=sys.stderr)
            continue

        for item in task.get("result", []):
            kw = item["keyword"].lower()
            results[kw] = {
                "search_volume": item.get("search_volume"),
                "cpc": item.get("cpc"),
            }

        cost = data.get("cost", 0)
        print(f"  Batch of {len(batch)} keywords fetched. Cost: ${cost:.4f}")

    return results


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    load_env(ENV_PATH)

    login = os.environ.get("DATAFORSEO_LOGIN", "")
    password = os.environ.get("DATAFORSEO_PASSWORD", "")

    if not login or not password:
        print("ERROR: DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set.", file=sys.stderr)
        sys.exit(1)

    # Read CSV
    print(f"Reading {CSV_PATH} ...")
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
        fieldnames = list(rows[0].keys())

    keywords = [row["keyword"].strip() for row in rows]
    print(f"  {len(keywords)} keywords to refresh.")

    # Fetch live data
    print("Fetching live metrics from DataForSEO ...")
    live = fetch_volumes(keywords, login, password)
    print(f"  Received data for {len(live)} keywords.")

    # Add new columns if not present
    today = date.today().isoformat()
    new_cols = ["search_volume_live", "cpc_usd_live", "volume_refreshed_at"]
    for col in new_cols:
        if col not in fieldnames:
            fieldnames.append(col)

    # Merge and track diffs
    significant_diffs = []
    no_data = []

    for row in rows:
        kw = row["keyword"].strip().lower()
        live_data = live.get(kw)

        if not live_data or live_data["search_volume"] is None:
            row["search_volume_live"] = ""
            row["cpc_usd_live"] = ""
            row["volume_refreshed_at"] = today
            no_data.append(row["keyword"])
            continue

        live_vol = live_data["search_volume"]
        live_cpc = live_data["cpc"] or ""

        row["search_volume_live"] = live_vol
        row["cpc_usd_live"] = live_cpc
        row["volume_refreshed_at"] = today

        # Flag if live volume differs > 30% from CSV
        try:
            csv_vol = float(row.get("search_volume") or 0)
            if csv_vol > 0:
                diff_pct = abs(live_vol - csv_vol) / csv_vol * 100
                if diff_pct >= 30:
                    significant_diffs.append({
                        "keyword": row["keyword"],
                        "csv_volume": int(csv_vol),
                        "live_volume": live_vol,
                        "diff_pct": round(diff_pct, 1),
                    })
        except (ValueError, ZeroDivisionError):
            pass

    # Write updated CSV
    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nDone. {CSV_PATH.name} updated with live volumes.")

    # Summary
    if significant_diffs:
        significant_diffs.sort(key=lambda x: x["diff_pct"], reverse=True)
        print(f"\n{len(significant_diffs)} keywords with >30% volume change (top 20):")
        print(f"  {'Keyword':<45} {'CSV vol':>8} {'Live vol':>9} {'Diff':>6}")
        print(f"  {'-'*45} {'-'*8} {'-'*9} {'-'*6}")
        for d in significant_diffs[:20]:
            print(f"  {d['keyword']:<45} {d['csv_volume']:>8,} {d['live_volume']:>9,} {d['diff_pct']:>5.0f}%")

    if no_data:
        print(f"\n{len(no_data)} keywords with no Google data (too niche or zero volume):")
        for kw in no_data[:10]:
            print(f"  - {kw}")
        if len(no_data) > 10:
            print(f"  ... and {len(no_data) - 10} more")


if __name__ == "__main__":
    main()
