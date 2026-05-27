"""
Pull Google Search Console query data for the past 28 days.
Outputs CSV to research/gsc_queries_28d.csv and prints top 50 to stdout.
"""

import csv
import os
import sys
from datetime import date, timedelta

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
CREDENTIALS_FILE = os.path.join(SCRIPT_DIR, "credentials.json")
OUTPUT_CSV = os.path.join(REPO_ROOT, "research", "gsc_queries_28d.csv")

SITE_URL = "sc-domain:sellontube.com"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

ROW_LIMIT = 25000  # max rows per API request


def main():
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )
    service = build("searchconsole", "v1", credentials=credentials)

    # Date range: last 28 days (GSC data has ~3-day lag, so end 3 days ago)
    end_date = date.today() - timedelta(days=3)
    start_date = end_date - timedelta(days=27)  # 28 days inclusive

    print(f"Querying GSC for {SITE_URL}")
    print(f"Date range: {start_date} to {end_date} (28 days)")
    print()

    # Fetch all query data, paginating if needed
    all_rows = []
    start_row = 0

    while True:
        request_body = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "dimensions": ["query"],
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
        }

        response = (
            service.searchanalytics()
            .query(siteUrl=SITE_URL, body=request_body)
            .execute()
        )

        rows = response.get("rows", [])
        if not rows:
            break

        for row in rows:
            all_rows.append(
                {
                    "query": row["keys"][0],
                    "clicks": row["clicks"],
                    "impressions": row["impressions"],
                    "ctr": round(row["ctr"], 4),
                    "position": round(row["position"], 1),
                }
            )

        print(f"  Fetched {len(rows)} rows (total so far: {len(all_rows)})")

        if len(rows) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT

    if not all_rows:
        print("No data returned from GSC.")
        sys.exit(1)

    # Sort by impressions descending
    all_rows.sort(key=lambda r: r["impressions"], reverse=True)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

    # Write CSV
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["query", "clicks", "impressions", "ctr", "position"]
        )
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"\nTotal queries: {len(all_rows)}")
    print(f"CSV saved to: {OUTPUT_CSV}")

    # Print top 50
    total_clicks = sum(r["clicks"] for r in all_rows)
    total_impressions = sum(r["impressions"] for r in all_rows)
    print(f"\nSite totals (28d): {total_clicks} clicks, {total_impressions} impressions")
    print(f"\n{'='*90}")
    print(f"Top 50 queries by impressions:")
    print(f"{'='*90}")
    print(f"{'#':<4} {'Query':<50} {'Clicks':>7} {'Impr':>7} {'CTR':>7} {'Pos':>6}")
    print(f"{'-'*4} {'-'*50} {'-'*7} {'-'*7} {'-'*7} {'-'*6}")

    for i, row in enumerate(all_rows[:50], 1):
        query_display = row["query"][:48]
        ctr_pct = f"{row['ctr']*100:.1f}%"
        print(
            f"{i:<4} {query_display:<50} {row['clicks']:>7} {row['impressions']:>7} {ctr_pct:>7} {row['position']:>6}"
        )

    print(f"\n{'='*90}")


if __name__ == "__main__":
    main()
