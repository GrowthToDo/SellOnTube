"""
SellonTube SEO MCP Server
==========================
Gives Claude direct access to GA4, GSC, PageSpeed Insights, and DataForSEO data as native tools.

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

# Load .env if present (belt-and-suspenders — also works via .mcp.json env)
_env_path = Path(__file__).parent.parent / ".env"
if _env_path.exists():
    for line in _env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

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
    "https://www.googleapis.com/auth/indexing",
]

DFS_LOGIN = os.environ.get("DATAFORSEO_LOGIN", "")
DFS_PASSWORD = os.environ.get("DATAFORSEO_PASSWORD", "")
DFS_BASE = "https://api.dataforseo.com/v3"

BING_API_KEY = os.environ.get("BING_WEBMASTER_API_KEY", "")
BING_BASE = "https://ssl.bing.com/webmaster/api.svc/json"
BING_SITE_URL = "https://sellontube.com/"

INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "")
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
            name="bing_top_queries",
            description=(
                "Get top search queries from Bing Webmaster Tools — "
                "what people search on Bing, Yahoo, DuckDuckGo, and Copilot to find sellontube.com. "
                "Returns queries with clicks, impressions, CTR, and average position."
            ),
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="bing_top_pages",
            description=(
                "Get top pages from Bing Webmaster Tools — "
                "which sellontube.com URLs get the most traffic from Bing/Yahoo/DuckDuckGo/Copilot. "
                "Returns pages with clicks, impressions, and crawl stats."
            ),
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="bing_crawl_stats",
            description=(
                "Get crawl statistics from Bing Webmaster Tools — "
                "how Bingbot is crawling sellontube.com. Shows crawl errors, "
                "blocked URLs, and crawl volume. Use to diagnose indexing issues on Bing."
            ),
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="google_indexing_submit",
            description=(
                "Submit URLs to Google's Indexing API for fast crawling and indexing. "
                "Use after publishing new pages or updating existing ones. "
                "Supports URL_UPDATED (request crawl) and URL_DELETED (remove from index). "
                "Faster than GSC Request Indexing - no daily quota limit like the manual method."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "urls": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of full URLs or paths to submit, e.g. ['/blog/new-post', '/tools/tag-generator'] (max 10)",
                    },
                    "action": {
                        "type": "string",
                        "description": "URL_UPDATED (request crawl, default) or URL_DELETED (remove from index)",
                        "default": "URL_UPDATED",
                        "enum": ["URL_UPDATED", "URL_DELETED"],
                    },
                },
                "required": ["urls"],
            },
        ),
        Tool(
            name="indexnow_submit",
            description=(
                "Submit URLs to IndexNow for instant indexing on Bing, Yahoo, DuckDuckGo, and Yandex. "
                "Use after publishing a new blog post, pSEO page, or tool page. "
                "Accepts up to 10 URLs per call. Much faster than waiting for natural crawl."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "paths": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of page paths to submit, e.g. ['/blog/new-post', '/tools/tag-generator'] (max 10)",
                    },
                },
                "required": ["paths"],
            },
        ),
        Tool(
            name="schema_validate",
            description=(
                "Validate structured data (JSON-LD/schema.org) on any sellontube.com page "
                "using Google's Rich Results Test API. Returns detected schemas, "
                "errors, and warnings. Use to catch schema issues that suppress rich snippets in Google."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Page path to validate, e.g. '/' or '/blog/youtube-marketing-roi'",
                    },
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="pagespeed_check",
            description=(
                "Run Google PageSpeed Insights on any sellontube.com page. "
                "Returns Core Web Vitals (LCP, CLS, FID/INP), performance score, "
                "and top optimization opportunities. Use this before deploying changes "
                "or to audit page speed across the site."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Page path to check, e.g. '/' or '/tools/youtube-seo-tool' or '/blog/youtube-marketing-roi'",
                    },
                    "strategy": {
                        "type": "string",
                        "description": "Device type: 'mobile' (default) or 'desktop'",
                        "default": "mobile",
                        "enum": ["mobile", "desktop"],
                    },
                },
                "required": ["path"],
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
        Tool(
            name="broken_link_check",
            description=(
                "Crawl sellontube.com and find broken links (404s, 5xx errors, redirect chains). "
                "Broken links leak link equity and hurt rankings. "
                "Checks internal links and external links on the page. Use regularly to catch dead links."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Page path to check links on, e.g. '/' or '/blog/youtube-marketing-roi'. Use '/sitemap.xml' to check all pages.",
                    },
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="meta_tag_audit",
            description=(
                "Audit meta tags (title, description, OG tags) across sellontube.com pages. "
                "Finds truncated titles (>60 chars), missing/short descriptions (<70 chars), "
                "duplicate titles, and missing OG images. Truncated titles = lower CTR in search results."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "paths": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of page paths to audit. Use ['/sitemap.xml'] to auto-discover all pages.",
                    },
                },
                "required": ["paths"],
            },
        ),
        Tool(
            name="internal_link_map",
            description=(
                "Map internal links across sellontube.com. Finds orphan pages (no internal links "
                "pointing to them), pages with too few internal links, and the most/least linked pages. "
                "Orphan pages don't get crawled or ranked. Critical for pSEO pages."
            ),
            inputSchema={
                "type": "object",
                "properties": {},
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

    elif name == "bing_top_queries":
        resp = requests.get(
            f"{BING_BASE}/GetQueryStats",
            params={"siteUrl": BING_SITE_URL, "apikey": BING_API_KEY},
            timeout=30,
        )
        resp.raise_for_status()
        raw = resp.json()
        stats = raw.get("d", [])
        queries = [
            {
                "query": s.get("Query"),
                "impressions": s.get("Impressions", 0),
                "clicks": s.get("Clicks", 0),
                "avg_position": s.get("AvgImpressionPosition"),
                "avg_click_position": s.get("AvgClickPosition"),
            }
            for s in stats
        ]
        queries.sort(key=lambda x: x["impressions"], reverse=True)
        return [TextContent(type="text", text=format_json({
            "source": "Bing Webmaster Tools (covers Bing, Yahoo, DuckDuckGo, Copilot)",
            "total_queries": len(queries),
            "queries": queries[:50],
        }))]

    elif name == "bing_top_pages":
        resp = requests.get(
            f"{BING_BASE}/GetPageStats",
            params={"siteUrl": BING_SITE_URL, "apikey": BING_API_KEY},
            timeout=30,
        )
        resp.raise_for_status()
        raw = resp.json()
        stats = raw.get("d", [])
        pages = [
            {
                "url": s.get("Query"),
                "impressions": s.get("Impressions", 0),
                "clicks": s.get("Clicks", 0),
                "avg_position": s.get("AvgImpressionPosition"),
                "avg_click_position": s.get("AvgClickPosition"),
            }
            for s in stats
        ]
        pages.sort(key=lambda x: x["impressions"], reverse=True)
        return [TextContent(type="text", text=format_json({
            "source": "Bing Webmaster Tools",
            "total_pages": len(pages),
            "pages": pages[:50],
        }))]

    elif name == "bing_crawl_stats":
        resp = requests.get(
            f"{BING_BASE}/GetCrawlStats",
            params={"siteUrl": BING_SITE_URL, "apikey": BING_API_KEY},
            timeout=30,
        )
        resp.raise_for_status()
        raw = resp.json()
        stats = raw.get("d", [])
        crawl_data = [
            {
                "date": s.get("Date"),
                "crawled_pages": s.get("CrawledPages", 0),
                "in_index": s.get("InIndex", 0),
                "in_links": s.get("InLinks", 0),
                "crawl_errors": s.get("CrawlErrors", 0),
            }
            for s in stats
        ]
        return [TextContent(type="text", text=format_json({
            "source": "Bing Webmaster Tools",
            "crawl_stats": crawl_data,
        }))]

    elif name == "google_indexing_submit":
        urls = arguments.get("urls", [])[:10]
        action = arguments.get("action", "URL_UPDATED")
        indexing_service = build("indexing", "v3", credentials=credentials)
        results = []
        for u in urls:
            full_url = u if u.startswith("http") else f"https://sellontube.com{u}"
            try:
                resp = indexing_service.urlNotifications().publish(
                    body={"url": full_url, "type": action}
                ).execute()
                results.append({
                    "url": full_url,
                    "status": "submitted",
                    "notifyTime": resp.get("urlNotificationMetadata", {}).get("latestUpdate", {}).get("notifyTime"),
                })
            except Exception as e:
                results.append({
                    "url": full_url,
                    "status": "error",
                    "error": str(e)[:300],
                })
        return [TextContent(type="text", text=format_json({
            "action": action,
            "results": results,
        }))]

    elif name == "indexnow_submit":
        paths = arguments.get("paths", [])[:10]
        urls = [f"https://sellontube.com{p}" for p in paths]
        payload = {
            "host": "sellontube.com",
            "key": INDEXNOW_KEY,
            "keyLocation": f"https://sellontube.com/{INDEXNOW_KEY}.txt",
            "urlList": urls,
        }
        resp = requests.post(
            "https://api.indexnow.org/IndexNow",
            json=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            timeout=30,
        )
        status = resp.status_code
        result_msg = {
            200: "OK - URLs submitted successfully",
            202: "Accepted - URLs queued for processing",
            400: "Bad request - check URL format",
            403: "Forbidden - key mismatch",
            422: "Unprocessable - invalid URLs",
            429: "Too many requests - try again later",
        }.get(status, f"HTTP {status}")
        return [TextContent(type="text", text=format_json({
            "submitted_urls": urls,
            "status_code": status,
            "result": result_msg,
        }))]

    elif name == "schema_validate":
        path = arguments.get("path", "/")
        url = f"https://sellontube.com{path}"
        # Use Schema.org validator API
        resp = requests.get(
            "https://validator.schema.org/validate",
            params={"url": url},
            timeout=30,
        )
        # Fallback: parse the page ourselves and extract JSON-LD
        if resp.status_code != 200:
            # Fetch the page and extract JSON-LD blocks
            page_resp = requests.get(url, timeout=30)
            page_resp.raise_for_status()
            import re
            json_ld_blocks = re.findall(
                r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                page_resp.text,
                re.DOTALL,
            )
            schemas = []
            errors = []
            for i, block in enumerate(json_ld_blocks):
                try:
                    parsed = json.loads(block)
                    schema_type = parsed.get("@type", "Unknown")
                    if isinstance(schema_type, list):
                        schema_type = ", ".join(schema_type)
                    schemas.append({
                        "index": i + 1,
                        "type": schema_type,
                        "context": parsed.get("@context", ""),
                        "fields": list(parsed.keys()),
                        "valid_json": True,
                    })
                    # Basic validation checks
                    issues = []
                    if "@context" not in parsed:
                        issues.append("Missing @context")
                    if "@type" not in parsed:
                        issues.append("Missing @type")
                    if parsed.get("@type") == "Article":
                        for field in ["headline", "author", "datePublished", "image"]:
                            if field not in parsed:
                                issues.append(f"Recommended field missing: {field}")
                    if parsed.get("@type") == "FAQPage":
                        if "mainEntity" not in parsed:
                            issues.append("FAQPage missing mainEntity")
                    if issues:
                        schemas[-1]["issues"] = issues
                except json.JSONDecodeError as e:
                    errors.append({"index": i + 1, "error": f"Invalid JSON: {str(e)}", "raw_preview": block[:200]})

            return [TextContent(type="text", text=format_json({
                "url": url,
                "total_json_ld_blocks": len(json_ld_blocks),
                "schemas": schemas,
                "parse_errors": errors,
                "note": "Basic validation - check Google Rich Results Test for full eligibility",
            }))]
        else:
            return [TextContent(type="text", text=format_json({
                "url": url,
                "raw_response": resp.text[:2000],
            }))]

    elif name == "pagespeed_check":
        path = arguments.get("path", "/")
        strategy = arguments.get("strategy", "mobile")
        url = f"https://sellontube.com{path}"
        psi_url = (
            "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
            f"?url={url}&strategy={strategy}"
            "&category=performance&category=accessibility&category=seo"
        )
        resp = requests.get(psi_url, timeout=60)
        resp.raise_for_status()
        raw = resp.json()

        # Extract scores
        categories = raw.get("lighthouseResult", {}).get("categories", {})
        scores = {
            cat_id: round((cat_data.get("score") or 0) * 100)
            for cat_id, cat_data in categories.items()
        }

        # Extract Core Web Vitals from field data (CrUX)
        field_data = raw.get("loadingExperience", {}).get("metrics", {})
        cwv = {}
        cwv_map = {
            "LARGEST_CONTENTFUL_PAINT_MS": "LCP_ms",
            "CUMULATIVE_LAYOUT_SHIFT_SCORE": "CLS",
            "INTERACTION_TO_NEXT_PAINT": "INP_ms",
            "FIRST_CONTENTFUL_PAINT_MS": "FCP_ms",
        }
        for key, label in cwv_map.items():
            if key in field_data:
                cwv[label] = {
                    "value": field_data[key].get("percentile"),
                    "category": field_data[key].get("category"),
                }

        # Extract lab metrics
        audits = raw.get("lighthouseResult", {}).get("audits", {})
        lab = {}
        for metric_id in ["largest-contentful-paint", "cumulative-layout-shift",
                          "total-blocking-time", "speed-index", "first-contentful-paint",
                          "interactive"]:
            if metric_id in audits:
                lab[metric_id] = {
                    "value": audits[metric_id].get("displayValue"),
                    "score": round((audits[metric_id].get("score") or 0) * 100),
                }

        # Extract top opportunities
        opportunities = []
        for audit_id, audit in audits.items():
            if audit.get("details", {}).get("type") == "opportunity" and (audit.get("score") or 1) < 0.9:
                opportunities.append({
                    "title": audit.get("title"),
                    "savings_ms": audit.get("details", {}).get("overallSavingsMs"),
                    "description": audit.get("description", "")[:200],
                })
        opportunities.sort(key=lambda x: x.get("savings_ms") or 0, reverse=True)

        return [TextContent(type="text", text=format_json({
            "url": url,
            "strategy": strategy,
            "scores": scores,
            "core_web_vitals_field": cwv if cwv else "No field data yet (needs enough real-user traffic)",
            "lab_metrics": lab,
            "top_opportunities": opportunities[:5],
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

    elif name == "broken_link_check":
        import re as _re
        from urllib.parse import urljoin, urlparse
        path = arguments.get("path", "/")
        base = "https://sellontube.com"

        # If sitemap, extract all URLs
        if "sitemap" in path:
            sitemap_resp = requests.get(f"{base}/sitemap-index.xml", timeout=30)
            urls_to_check = _re.findall(r'<loc>(.*?)</loc>', sitemap_resp.text)
            # If it's a sitemap index, fetch child sitemaps
            child_urls = []
            for u in urls_to_check:
                if "sitemap" in u.lower() and u.endswith(".xml"):
                    child_resp = requests.get(u, timeout=30)
                    child_urls.extend(_re.findall(r'<loc>(.*?)</loc>', child_resp.text))
            if child_urls:
                urls_to_check = child_urls
        else:
            urls_to_check = [f"{base}{path}"]

        broken = []
        checked = 0
        for page_url in urls_to_check[:50]:  # cap at 50 pages
            try:
                page_resp = requests.get(page_url, timeout=15)
                if page_resp.status_code >= 400:
                    broken.append({"url": page_url, "status": page_resp.status_code, "type": "page_itself"})
                    continue
                links = _re.findall(r'href=["\']([^"\']+)["\']', page_resp.text)
                seen = set()
                for link in links:
                    full = urljoin(page_url, link)
                    if full in seen or full.startswith(("mailto:", "tel:", "javascript:", "#")):
                        continue
                    seen.add(full)
                    parsed = urlparse(full)
                    if parsed.scheme not in ("http", "https"):
                        continue
                    try:
                        lr = requests.head(full, timeout=10, allow_redirects=True)
                        checked += 1
                        if lr.status_code >= 400:
                            broken.append({
                                "source_page": page_url,
                                "broken_url": full,
                                "status": lr.status_code,
                                "type": "internal" if "sellontube.com" in full else "external",
                            })
                    except requests.RequestException:
                        broken.append({
                            "source_page": page_url,
                            "broken_url": full,
                            "status": "timeout/error",
                            "type": "internal" if "sellontube.com" in full else "external",
                        })
            except requests.RequestException:
                broken.append({"url": page_url, "status": "unreachable", "type": "page_itself"})

        return [TextContent(type="text", text=format_json({
            "pages_checked": len(urls_to_check[:50]),
            "links_checked": checked,
            "broken_links": broken,
            "total_broken": len(broken),
        }))]

    elif name == "meta_tag_audit":
        import re as _re
        paths = arguments.get("paths", ["/"])
        base = "https://sellontube.com"

        # If sitemap, discover all pages
        if any("sitemap" in p for p in paths):
            sitemap_resp = requests.get(f"{base}/sitemap-index.xml", timeout=30)
            all_locs = _re.findall(r'<loc>(.*?)</loc>', sitemap_resp.text)
            child_urls = []
            for u in all_locs:
                if "sitemap" in u.lower() and u.endswith(".xml"):
                    child_resp = requests.get(u, timeout=30)
                    child_urls.extend(_re.findall(r'<loc>(.*?)</loc>', child_resp.text))
            urls = child_urls if child_urls else all_locs
        else:
            urls = [f"{base}{p}" for p in paths]

        issues = []
        titles_seen = {}
        for url in urls[:100]:
            try:
                resp = requests.get(url, timeout=15)
                html = resp.text
                title_match = _re.search(r'<title>(.*?)</title>', html, _re.DOTALL)
                title = title_match.group(1).strip() if title_match else ""
                desc_match = _re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, _re.IGNORECASE)
                desc = desc_match.group(1).strip() if desc_match else ""
                og_title = _re.search(r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', html, _re.IGNORECASE)
                og_desc = _re.search(r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\']', html, _re.IGNORECASE)
                og_image = _re.search(r'<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']*)["\']', html, _re.IGNORECASE)

                page_issues = []
                if not title:
                    page_issues.append("Missing title")
                elif len(title) > 60:
                    page_issues.append(f"Title too long ({len(title)} chars, max 60)")
                elif len(title) < 20:
                    page_issues.append(f"Title too short ({len(title)} chars)")

                if not desc:
                    page_issues.append("Missing meta description")
                elif len(desc) < 70:
                    page_issues.append(f"Description too short ({len(desc)} chars, min 70)")
                elif len(desc) > 160:
                    page_issues.append(f"Description too long ({len(desc)} chars, max 160)")

                if not og_image:
                    page_issues.append("Missing og:image")
                if not og_title:
                    page_issues.append("Missing og:title")

                # Track duplicates
                if title:
                    if title in titles_seen:
                        page_issues.append(f"Duplicate title (same as {titles_seen[title]})")
                    titles_seen[title] = url

                if page_issues:
                    issues.append({"url": url, "title": title[:80], "description": desc[:80], "issues": page_issues})
            except requests.RequestException:
                issues.append({"url": url, "issues": ["Page unreachable"]})

        return [TextContent(type="text", text=format_json({
            "pages_audited": len(urls[:100]),
            "pages_with_issues": len(issues),
            "issues": issues,
        }))]

    elif name == "internal_link_map":
        import re as _re
        from urllib.parse import urljoin, urlparse
        base = "https://sellontube.com"

        # Get all pages from sitemap
        sitemap_resp = requests.get(f"{base}/sitemap-index.xml", timeout=30)
        all_locs = _re.findall(r'<loc>(.*?)</loc>', sitemap_resp.text)
        child_urls = []
        for u in all_locs:
            if "sitemap" in u.lower() and u.endswith(".xml"):
                child_resp = requests.get(u, timeout=30)
                child_urls.extend(_re.findall(r'<loc>(.*?)</loc>', child_resp.text))
        site_urls = set(child_urls if child_urls else all_locs)

        # Build link map: who links to whom
        inbound_count = {u: 0 for u in site_urls}
        outbound_count = {u: 0 for u in site_urls}
        inbound_from = {u: [] for u in site_urls}

        for page_url in list(site_urls)[:100]:
            try:
                resp = requests.get(page_url, timeout=15)
                links = _re.findall(r'href=["\']([^"\'#]+)["\']', resp.text)
                internal_targets = set()
                for link in links:
                    full = urljoin(page_url, link).split("?")[0].split("#")[0]
                    if "sellontube.com" in full and full != page_url and full in site_urls:
                        internal_targets.add(full)
                outbound_count[page_url] = len(internal_targets)
                for target in internal_targets:
                    inbound_count[target] = inbound_count.get(target, 0) + 1
                    if target in inbound_from:
                        inbound_from[target].append(page_url)
            except requests.RequestException:
                pass

        orphans = [u for u, c in inbound_count.items() if c == 0]
        low_links = [{"url": u, "inbound": c} for u, c in inbound_count.items() if 0 < c <= 2]
        most_linked = sorted(inbound_count.items(), key=lambda x: x[1], reverse=True)[:10]

        return [TextContent(type="text", text=format_json({
            "total_pages": len(site_urls),
            "orphan_pages (0 internal links pointing to them)": orphans,
            "low_link_pages (1-2 internal links)": low_links,
            "most_linked_pages": [{"url": u, "inbound_links": c} for u, c in most_linked],
            "recommendation": "Add internal links to orphan pages from related content to improve crawlability and rankings.",
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
