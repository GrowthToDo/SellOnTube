"""
Fetch search volumes for competitor comparison keywords.
Single batch = $0.05 on DataForSEO.

Usage:
    DATAFORSEO_LOGIN=... DATAFORSEO_PASSWORD=... python3 scripts/competitor_keyword_volumes.py
"""

import csv
import os
import sys
from pathlib import Path
import requests

REPO_ROOT = Path(__file__).parent.parent
ENV_PATH = REPO_ROOT / ".env"
DFS_BASE = "https://api.dataforseo.com/v3"
OUTPUT = REPO_ROOT / "research/keywords/competitor_volumes.csv"


def load_env(path: Path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip())


COMPETITORS = [
    "vidiq", "tubebuddy", "morningfame", "tuberanker", "tubics", "rapidtags",
    "subscribr", "subscribr.ai", "outlierkit", "tubegen", "directai",
    "veed", "veed.io", "opus clip", "pictory", "invideo", "invideo ai",
    "descript", "vizard", "vizard.ai", "gling",
    "vidyard", "wistia", "vimeo business",
    "social blade", "socialblade", "noxinfluencer",
    "thumbly", "thumbnailtest", "1of10",
    "keywordtool.io", "tubesift",
]

PATTERNS = [
    "{name} alternatives",
    "{name} alternatives for business",
    "{name} vs",
    "best {name} alternatives",
    "{name} review",
    "{name} pricing",
]


def build_keywords():
    keywords = set()
    for comp in COMPETITORS:
        for pattern in PATTERNS:
            keywords.add(pattern.format(name=comp))
    # Add some cross-competitor "vs" queries
    vs_pairs = [
        ("vidiq", "tubebuddy"),
        ("vidiq", "subscribr"),
        ("tubebuddy", "subscribr"),
        ("veed", "descript"),
        ("opus clip", "vizard"),
        ("wistia", "vidyard"),
    ]
    for a, b in vs_pairs:
        keywords.add(f"{a} vs {b}")
        keywords.add(f"{b} vs {a}")
    return sorted(keywords)


def main():
    load_env(ENV_PATH)
    login = os.environ.get("DATAFORSEO_LOGIN", "")
    password = os.environ.get("DATAFORSEO_PASSWORD", "")
    if not login or not password:
        print("ERROR: DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set.", file=sys.stderr)
        sys.exit(1)

    keywords = build_keywords()
    print(f"Built {len(keywords)} keyword variations.")
    print(f"Estimated cost: $0.05 (1 batch of <= 700 keywords)")

    payload = [{
        "keywords": keywords,
        "language_name": "English",
        "location_name": "United States",
    }]

    print("Fetching from DataForSEO ...")
    resp = requests.post(
        f"{DFS_BASE}/keywords_data/google_ads/search_volume/live",
        auth=(login, password),
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()

    task = data.get("tasks", [{}])[0]
    cost = data.get("cost", 0)
    print(f"API cost: ${cost:.4f}")

    if task.get("status_code") != 20000:
        print(f"ERROR: {task.get('status_message')}", file=sys.stderr)
        sys.exit(1)

    results = []
    for item in task.get("result", []):
        results.append({
            "keyword": item["keyword"],
            "search_volume": item.get("search_volume", 0) or 0,
            "cpc": item.get("cpc", 0) or 0,
            "competition": item.get("competition", ""),
        })

    results.sort(key=lambda r: r["search_volume"], reverse=True)

    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["keyword", "search_volume", "cpc", "competition"])
        writer.writeheader()
        writer.writerows(results)

    print(f"\nSaved to {OUTPUT}")
    print(f"\nTop 30 by volume:")
    print(f"{'Keyword':<45} {'Volume':>8} {'CPC':>6}")
    print("-" * 62)
    for r in results[:30]:
        print(f"{r['keyword']:<45} {r['search_volume']:>8} ${r['cpc']:>5.2f}")

    non_zero = [r for r in results if r["search_volume"] > 0]
    print(f"\n{len(non_zero)} keywords with volume > 0 out of {len(results)} total.")


if __name__ == "__main__":
    main()
