"""
SellonTube SEO Data Fetcher
============================
Pulls data from Google Analytics 4 and Google Search Console APIs.
Saves output to scripts/seo_data/ as JSON files for Claude to analyse.

Usage:
    python scripts/fetch_seo_data.py

Requirements:
    pip install -r scripts/requirements.txt

Setup:
    1. Place your service account credentials at scripts/credentials.json
    2. Set your GA4 Property ID in the CONFIG section below
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    OrderBy,
)

# ─────────────────────────────────────────────
# CONFIG — update GA4_PROPERTY_ID after setup
# ─────────────────────────────────────────────
CREDENTIALS_PATH = Path(__file__).parent / "credentials.json"
OUTPUT_DIR = Path(__file__).parent / "seo_data"
GSC_SITE_URL = "sc-domain:sellontube.com"
GA4_PROPERTY_ID = "522074510"
DAYS_BACK = 90
# ─────────────────────────────────────────────

SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
]

def get_credentials():
    if not CREDENTIALS_PATH.exists():
        raise FileNotFoundError(
            f"\n\nCredentials file not found at: {CREDENTIALS_PATH}\n"
            "Place your service account JSON key there and try again.\n"
        )
    return service_account.Credentials.from_service_account_file(
        str(CREDENTIALS_PATH), scopes=SCOPES
    )

def date_range():
    end = datetime.today()
    start = end - timedelta(days=DAYS_BACK)
    return start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")

def save(filename, data):
    OUTPUT_DIR.mkdir(exist_ok=True)
    path = OUTPUT_DIR / filename
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved → {path}")

# ─────────────────────────────────────────────
# GA4
# ─────────────────────────────────────────────

def fetch_ga4(credentials):
    print("\n[GA4] Fetching data...")

    if GA4_PROPERTY_ID == "REPLACE_WITH_YOUR_PROPERTY_ID":
        print("  ⚠ GA4_PROPERTY_ID not set. Skipping GA4. Update CONFIG in this script.")
        return

    client = BetaAnalyticsDataClient(credentials=credentials)
    property_id = f"properties/{GA4_PROPERTY_ID}"
    start_date, end_date = date_range()
    date_ranges = [DateRange(start_date=start_date, end_date=end_date)]

    # Top pages by sessions
    print("  Pulling top pages...")
    response = client.run_report(RunReportRequest(
        property=property_id,
        date_ranges=date_ranges,
        dimensions=[Dimension(name="pagePath"), Dimension(name="pageTitle")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="engagementRate"),
            Metric(name="bounceRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="screenPageViews"),
        ],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=50,
    ))
    pages = []
    for row in response.rows:
        pages.append({
            "path": row.dimension_values[0].value,
            "title": row.dimension_values[1].value,
            "sessions": int(row.metric_values[0].value),
            "engagement_rate": round(float(row.metric_values[1].value) * 100, 1),
            "bounce_rate": round(float(row.metric_values[2].value) * 100, 1),
            "avg_session_duration_sec": round(float(row.metric_values[3].value), 1),
            "pageviews": int(row.metric_values[4].value),
        })
    save("ga4_pages.json", {"period_days": DAYS_BACK, "pulled_at": datetime.now().isoformat(), "pages": pages})

    # Traffic sources
    print("  Pulling traffic sources...")
    response = client.run_report(RunReportRequest(
        property=property_id,
        date_ranges=date_ranges,
        dimensions=[Dimension(name="sessionDefaultChannelGroup")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="newUsers"),
            Metric(name="engagementRate"),
        ],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    ))
    sources = []
    for row in response.rows:
        sources.append({
            "channel": row.dimension_values[0].value,
            "sessions": int(row.metric_values[0].value),
            "new_users": int(row.metric_values[1].value),
            "engagement_rate": round(float(row.metric_values[2].value) * 100, 1),
        })
    save("ga4_traffic_sources.json", {"period_days": DAYS_BACK, "pulled_at": datetime.now().isoformat(), "sources": sources})

    print("  GA4 done.")

# ─────────────────────────────────────────────
# GSC
# ─────────────────────────────────────────────

def fetch_gsc(credentials):
    print("\n[GSC] Fetching data...")

    service = build("searchconsole", "v1", credentials=credentials)
    start_date, end_date = date_range()

    base_request = {
        "startDate": start_date,
        "endDate": end_date,
        "rowLimit": 100,
    }

    # Top queries
    print("  Pulling top queries...")
    response = service.searchanalytics().query(
        siteUrl=GSC_SITE_URL,
        body={**base_request, "dimensions": ["query"], "rowLimit": 100},
    ).execute()
    queries = []
    for row in response.get("rows", []):
        queries.append({
            "query": row["keys"][0],
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "ctr": round(row.get("ctr", 0) * 100, 2),
            "position": round(row.get("position", 0), 1),
        })
    save("gsc_queries.json", {"period_days": DAYS_BACK, "pulled_at": datetime.now().isoformat(), "queries": queries})

    # Top pages
    print("  Pulling top pages...")
    response = service.searchanalytics().query(
        siteUrl=GSC_SITE_URL,
        body={**base_request, "dimensions": ["page"], "rowLimit": 50},
    ).execute()
    pages = []
    for row in response.get("rows", []):
        pages.append({
            "page": row["keys"][0],
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "ctr": round(row.get("ctr", 0) * 100, 2),
            "position": round(row.get("position", 0), 1),
        })
    save("gsc_pages.json", {"period_days": DAYS_BACK, "pulled_at": datetime.now().isoformat(), "pages": pages})

    # Ranking opportunities — position 4 to 20
    print("  Pulling ranking opportunities (position 4–20)...")
    response = service.searchanalytics().query(
        siteUrl=GSC_SITE_URL,
        body={**base_request, "dimensions": ["query", "page"], "rowLimit": 500},
    ).execute()
    opportunities = []
    for row in response.get("rows", []):
        pos = row.get("position", 0)
        if 4 <= pos <= 20:
            opportunities.append({
                "query": row["keys"][0],
                "page": row["keys"][1],
                "position": round(pos, 1),
                "impressions": row.get("impressions", 0),
                "clicks": row.get("clicks", 0),
                "ctr": round(row.get("ctr", 0) * 100, 2),
            })
    # Sort by impressions descending — highest-visibility low-hanging fruit first
    opportunities.sort(key=lambda x: x["impressions"], reverse=True)
    save("gsc_opportunities.json", {"period_days": DAYS_BACK, "pulled_at": datetime.now().isoformat(), "note": "Queries ranking position 4-20 — highest priority for content improvement", "opportunities": opportunities[:100]})

    print("  GSC done.")

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

def main():
    print("=" * 50)
    print("SellonTube SEO Data Fetcher")
    print(f"Period: last {DAYS_BACK} days")
    print("=" * 50)

    credentials = get_credentials()
    fetch_ga4(credentials)
    fetch_gsc(credentials)

    print("\nDone. Files saved to scripts/seo_data/")
    print("Share this session with Claude to begin analysis.")

if __name__ == "__main__":
    main()
