"""
SellonTube SEO MCP Server
==========================
Gives Claude direct access to GA4 and GSC data as native tools.

Setup:
    pip install -r scripts/requirements.txt
    Place credentials.json at scripts/credentials.json

Claude Code config (~/.claude/settings.json):
    {
      "mcpServers": {
        "sellontube-seo": {
          "command": "python",
          "args": ["C:/Users/D E L L/Downloads/Claude Coded/SellonTube/scripts/mcp_seo_server.py"]
        }
      }
    }
"""

import asyncio
import json
import os
import requests
from datetime import datetime, timedelta
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange, Dimension, Metric, RunReportRequest, OrderBy,
)
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
CREDENTIALS_PATH = Path(__file__).parent / "credentials.json"
GSC_SITE_URL = "sc-domain:sellontube.com"
GA4_PROPERTY_ID = "522074510"
SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
]

DFS_LOGIN = os.environ.get("DATAFORSEO_LOGIN", "")
DFS_PASSWORD = os.environ.get("DATAFORSEO_PASSWORD", "")
DFS_BASE = "https://api.dataforseo.com/v3"
# ─────────────────────────────────────────────

server = Server("sellontube-seo")


def get_credentials():
    return service_account.Credentials.from_service_account_file(
        str(CREDENTIALS_PATH), scopes=SCOPES
    )


def date_range(days: int = 90):
    end = datetime.today()
    start = end - timedelta(days=days)
    return start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")


def format_json(data) -> str:
    return json.dumps(data, indent=2, ensure_ascii=False)


# ─────────────────────────────────────────────
# TOOLS DEFINITION
# ─────────────────────────────────────────────

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="get_top_queries",
            description=(
                "Get top Google Search queries driving traffic to sellontube.com. "
                "Returns queries with clicks, impressions, CTR, and average position. "
                "Use this to understand what keywords are working and what people search for."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Number of days to look back (default 90)", "default": 90},
                    "limit": {"type": "integer", "description": "Number of queries to return (default 50)", "default": 50},
                },
            },
        ),
        Tool(
            name="get_ranking_opportunities",
            description=(
                "Get search queries where sellontube.com ranks in position 4-20 — "
                "these are the highest-priority pages to improve for quick traffic gains. "
                "Sorted by impressions so you see the biggest opportunities first."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Number of days to look back (default 90)", "default": 90},
                },
            },
        ),
        Tool(
            name="get_top_pages",
            description=(
                "Get top pages on sellontube.com by sessions from Google Analytics. "
                "Returns sessions, engagement rate, bounce rate, and pageviews per page. "
                "Use this to see which content drives the most engaged traffic."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Number of days to look back (default 90)", "default": 90},
                },
            },
        ),
        Tool(
            name="get_traffic_sources",
            description=(
                "Get traffic sources breakdown from Google Analytics — "
                "organic search, direct, referral, social, etc. "
                "Use this to understand the channel mix and how much comes from SEO."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Number of days to look back (default 90)", "default": 90},
                },
            },
        ),
        Tool(
            name="get_gsc_pages",
            description=(
                "Get page-level performance from Google Search Console — "
                "which URLs get the most impressions and clicks from Google Search. "
                "Use this to evaluate pSEO page performance and blog post rankings."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Number of days to look back (default 90)", "default": 90},
                },
            },
        ),
        Tool(
            name="dfs_keyword_metrics",
            description=(
                "Get live keyword metrics from DataForSEO — search volume, CPC, competition, "
                "and monthly trend data. Accepts up to 10 keywords per call. "
                "Use this before selecting keywords for blog posts or pSEO pages to verify "
                "current search volume and difficulty. More accurate than GKP estimates."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "keywords": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of keywords to look up (max 10)",
                    },
                    "location": {
                        "type": "string",
                        "description": "Location name (default: United States)",
                        "default": "United States",
                    },
                },
                "required": ["keywords"],
            },
        ),
        Tool(
            name="dfs_serp_results",
            description=(
                "Get the top 10 organic Google search results for a keyword via DataForSEO. "
                "Returns titles, URLs, meta descriptions, and ranking positions. "
                "Use this before writing a blog post to understand what content format ranks, "
                "who the competitors are, and whether a featured snippet is available."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": "The keyword to get SERP results for",
                    },
                    "location": {
                        "type": "string",
                        "description": "Location name (default: United States)",
                        "default": "United States",
                    },
                },
                "required": ["keyword"],
            },
        ),
        Tool(
            name="dfs_keyword_suggestions",
            description=(
                "Get keyword suggestions and related keywords for a seed term via DataForSEO. "
                "Returns up to 20 related keywords with volume, CPC, and competition. "
                "Use this to expand a content cluster, find long-tail variants, or discover "
                "subtopics to cover within a blog post or pSEO page."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": "Seed keyword to expand",
                    },
                    "location": {
                        "type": "string",
                        "description": "Location name (default: United States)",
                        "default": "United States",
                    },
                },
                "required": ["keyword"],
            },
        ),
    ]


# ─────────────────────────────────────────────
# TOOL HANDLERS
# ─────────────────────────────────────────────

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    credentials = get_credentials()
    days = arguments.get("days", 90)
    start_date, end_date = date_range(days)

    if name == "get_top_queries":
        limit = arguments.get("limit", 50)
        service = build("searchconsole", "v1", credentials=credentials)
        response = service.searchanalytics().query(
            siteUrl=GSC_SITE_URL,
            body={
                "startDate": start_date,
                "endDate": end_date,
                "dimensions": ["query"],
                "rowLimit": limit,
                "orderBy": [{"fieldName": "clicks", "sortOrder": "DESCENDING"}],
            },
        ).execute()
        queries = [
            {
                "query": row["keys"][0],
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr_pct": round(row.get("ctr", 0) * 100, 2),
                "avg_position": round(row.get("position", 0), 1),
            }
            for row in response.get("rows", [])
        ]
        return [TextContent(type="text", text=format_json({
            "period_days": days,
            "total_queries": len(queries),
            "queries": queries,
        }))]

    elif name == "get_ranking_opportunities":
        service = build("searchconsole", "v1", credentials=credentials)
        response = service.searchanalytics().query(
            siteUrl=GSC_SITE_URL,
            body={
                "startDate": start_date,
                "endDate": end_date,
                "dimensions": ["query", "page"],
                "rowLimit": 500,
            },
        ).execute()
        opportunities = [
            {
                "query": row["keys"][0],
                "page": row["keys"][1],
                "avg_position": round(row.get("position", 0), 1),
                "impressions": row.get("impressions", 0),
                "clicks": row.get("clicks", 0),
                "ctr_pct": round(row.get("ctr", 0) * 100, 2),
            }
            for row in response.get("rows", [])
            if 4 <= row.get("position", 0) <= 20
        ]
        opportunities.sort(key=lambda x: x["impressions"], reverse=True)
        return [TextContent(type="text", text=format_json({
            "period_days": days,
            "note": "Queries ranking position 4-20 — highest priority for content improvement",
            "total_opportunities": len(opportunities),
            "opportunities": opportunities[:100],
        }))]

    elif name == "get_top_pages":
        client = BetaAnalyticsDataClient(credentials=credentials)
        response = client.run_report(RunReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
            dimensions=[Dimension(name="pagePath"), Dimension(name="pageTitle")],
            metrics=[
                Metric(name="sessions"),
                Metric(name="engagementRate"),
                Metric(name="bounceRate"),
                Metric(name="screenPageViews"),
            ],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
            limit=50,
        ))
        pages = [
            {
                "path": row.dimension_values[0].value,
                "title": row.dimension_values[1].value,
                "sessions": int(row.metric_values[0].value),
                "engagement_rate_pct": round(float(row.metric_values[1].value) * 100, 1),
                "bounce_rate_pct": round(float(row.metric_values[2].value) * 100, 1),
                "pageviews": int(row.metric_values[3].value),
            }
            for row in response.rows
        ]
        return [TextContent(type="text", text=format_json({
            "period_days": days,
            "total_pages": len(pages),
            "pages": pages,
        }))]

    elif name == "get_traffic_sources":
        client = BetaAnalyticsDataClient(credentials=credentials)
        response = client.run_report(RunReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
            dimensions=[Dimension(name="sessionDefaultChannelGroup")],
            metrics=[
                Metric(name="sessions"),
                Metric(name="newUsers"),
                Metric(name="engagementRate"),
            ],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        ))
        sources = [
            {
                "channel": row.dimension_values[0].value,
                "sessions": int(row.metric_values[0].value),
                "new_users": int(row.metric_values[1].value),
                "engagement_rate_pct": round(float(row.metric_values[2].value) * 100, 1),
            }
            for row in response.rows
        ]
        total_sessions = sum(s["sessions"] for s in sources)
        for s in sources:
            s["share_pct"] = round(s["sessions"] / total_sessions * 100, 1) if total_sessions else 0
        return [TextContent(type="text", text=format_json({
            "period_days": days,
            "total_sessions": total_sessions,
            "sources": sources,
        }))]

    elif name == "get_gsc_pages":
        service = build("searchconsole", "v1", credentials=credentials)
        response = service.searchanalytics().query(
            siteUrl=GSC_SITE_URL,
            body={
                "startDate": start_date,
                "endDate": end_date,
                "dimensions": ["page"],
                "rowLimit": 50,
                "orderBy": [{"fieldName": "impressions", "sortOrder": "DESCENDING"}],
            },
        ).execute()
        pages = [
            {
                "page": row["keys"][0],
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr_pct": round(row.get("ctr", 0) * 100, 2),
                "avg_position": round(row.get("position", 0), 1),
            }
            for row in response.get("rows", [])
        ]
        return [TextContent(type="text", text=format_json({
            "period_days": days,
            "total_pages": len(pages),
            "pages": pages,
        }))]

    elif name == "dfs_keyword_metrics":
        keywords = arguments.get("keywords", [])[:10]
        location = arguments.get("location", "United States")
        resp = requests.post(
            f"{DFS_BASE}/keywords_data/google_ads/search_volume/live",
            auth=(DFS_LOGIN, DFS_PASSWORD),
            json=[{"keywords": keywords, "language_name": "English", "location_name": location}],
        )
        resp.raise_for_status()
        raw = resp.json()
        results = raw["tasks"][0].get("result", []) if raw.get("tasks") else []
        metrics = [
            {
                "keyword": r["keyword"],
                "search_volume": r.get("search_volume"),
                "cpc": r.get("cpc"),
                "competition": r.get("competition"),
                "competition_index": r.get("competition_index"),
                "monthly_trend": [
                    {"year": m["year"], "month": m["month"], "volume": m["search_volume"]}
                    for m in (r.get("monthly_searches") or [])[-6:]
                ],
            }
            for r in results
        ]
        return [TextContent(type="text", text=format_json({
            "location": location,
            "cost_usd": raw.get("cost"),
            "keywords": metrics,
        }))]

    elif name == "dfs_serp_results":
        keyword = arguments.get("keyword", "")
        location = arguments.get("location", "United States")
        resp = requests.post(
            f"{DFS_BASE}/serp/google/organic/live/regular",
            auth=(DFS_LOGIN, DFS_PASSWORD),
            json=[{
                "keyword": keyword,
                "language_name": "English",
                "location_name": location,
                "depth": 10,
            }],
        )
        resp.raise_for_status()
        raw = resp.json()
        task_result = raw["tasks"][0].get("result", [{}])[0] if raw.get("tasks") else {}
        items = task_result.get("items", [])
        organic = [
            {
                "rank": item.get("rank_absolute"),
                "title": item.get("title"),
                "url": item.get("url"),
                "description": item.get("description"),
                "domain": item.get("domain"),
            }
            for item in items
            if item.get("type") == "organic"
        ]
        return [TextContent(type="text", text=format_json({
            "keyword": keyword,
            "location": location,
            "cost_usd": raw.get("cost"),
            "total_results": task_result.get("se_results_count"),
            "organic_results": organic,
        }))]

    elif name == "dfs_keyword_suggestions":
        keyword = arguments.get("keyword", "")
        location = arguments.get("location", "United States")
        resp = requests.post(
            f"{DFS_BASE}/keywords_data/google_ads/keywords_for_keywords/live",
            auth=(DFS_LOGIN, DFS_PASSWORD),
            json=[{
                "keywords": [keyword],
                "language_name": "English",
                "location_name": location,
            }],
        )
        resp.raise_for_status()
        raw = resp.json()
        results = raw["tasks"][0].get("result", []) if raw.get("tasks") else []
        suggestions = [
            {
                "keyword": r["keyword"],
                "search_volume": r.get("search_volume"),
                "cpc": r.get("cpc"),
                "competition": r.get("competition"),
                "competition_index": r.get("competition_index"),
            }
            for r in results
            if r.get("keyword") != keyword
        ]
        suggestions.sort(key=lambda x: x["search_volume"] or 0, reverse=True)
        return [TextContent(type="text", text=format_json({
            "seed_keyword": keyword,
            "location": location,
            "cost_usd": raw.get("cost"),
            "suggestions": suggestions[:20],
        }))]

    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


# ─────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options(),
        )


if __name__ == "__main__":
    asyncio.run(main())
