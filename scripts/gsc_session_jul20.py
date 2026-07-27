# -*- coding: utf-8 -*-
"""GSC pull for 2026-07-20 session.
PART 1: comparison-retrofit lift (3 URLs, Jun1-28 vs Jul1-19).
PART 2: ranking-checker query cluster + cannibalization.
"""
import sys
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

creds = Credentials.from_service_account_file(
    'scripts/credentials.json',
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)
service = build('searchconsole', 'v1', credentials=creds)
SITE = 'sc-domain:sellontube.com'

BEFORE = ('2026-06-01', '2026-06-28')
AFTER = ('2026-07-01', '2026-07-19')

def q(body):
    return service.searchanalytics().query(siteUrl=SITE, body=body).execute().get('rows', [])

def page_totals(url, start, end):
    rows = q({
        'startDate': start, 'endDate': end,
        'dimensions': ['page'],
        'dimensionFilterGroups': [{'filters': [
            {'dimension': 'page', 'operator': 'equals',
             'expression': 'https://sellontube.com' + url}]}],
        'rowLimit': 1
    })
    if not rows:
        return (0, 0, 0.0, 0.0)
    r = rows[0]
    return (r['clicks'], r['impressions'], r['position'], r['ctr'])

def page_queries(url, start, end, n=15):
    rows = q({
        'startDate': start, 'endDate': end,
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [
            {'dimension': 'page', 'operator': 'equals',
             'expression': 'https://sellontube.com' + url}]}],
        'rowLimit': 500
    })
    rows.sort(key=lambda x: x['impressions'], reverse=True)
    return rows[:n]

COMPARE_URLS = [
    '/blog/best-youtube-rank-checker-tools-for-business',
    '/blog/is-vidiq-worth-it-for-business',
    '/blog/ai-tools-for-youtube',
]

print("=" * 70)
print("PART 1 - COMPARISON RETROFIT LIFT")
print("BEFORE:", BEFORE, " AFTER:", AFTER)
print("=" * 70)
for u in COMPARE_URLS:
    b = page_totals(u, *BEFORE)
    a = page_totals(u, *AFTER)
    print(f"\n## {u}")
    print(f"  BEFORE clk/imp/pos/ctr: {b[0]}/{b[1]}/{b[2]:.1f}/{b[3]*100:.2f}%")
    print(f"  AFTER  clk/imp/pos/ctr: {a[0]}/{a[1]}/{a[2]:.1f}/{a[3]*100:.2f}%")
    print("  TOP QUERIES (AFTER, by impr): query|clk|imp|pos")
    for r in page_queries(u, *AFTER, n=12):
        print(f"    {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

print("\n\n" + "=" * 70)
print("PART 2 - RANKING-CHECKER TOOL + CLUSTER (AFTER window, 90d also)")
print("=" * 70)

TOOL = '/tools/youtube-ranking-checker'
for label, (s, e) in [('Jun1-28', BEFORE), ('Jul1-19', AFTER)]:
    t = page_totals(TOOL, s, e)
    print(f"\n{TOOL} [{label}] clk/imp/pos/ctr: {t[0]}/{t[1]}/{t[2]:.1f}/{t[3]*100:.2f}%")

# 90d window for cluster stability
D90 = ('2026-04-21', '2026-07-19')
print(f"\n{TOOL} top queries [90d {D90}]:")
for r in page_queries(TOOL, *D90, n=25):
    print(f"    {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# Cannibalization: for the top cluster queries, which PAGES rank? [query,page]
print("\n\nCANNIBALIZATION - pages ranking for rank-checker cluster queries [90d]")
CLUSTER = ['rank checker', 'ranking checker', 'rank tracker', 'position checker',
           'keyword ranking', 'tag rank', 'rank check']
rows = q({
    'startDate': D90[0], 'endDate': D90[1],
    'dimensions': ['query', 'page'],
    'rowLimit': 5000
})
# filter to cluster terms
def hit(qs):
    ql = qs.lower()
    return any(c in ql for c in CLUSTER)
cl = [r for r in rows if hit(r['keys'][0])]
# group by query, list pages
from collections import defaultdict
byq = defaultdict(list)
for r in cl:
    byq[r['keys'][0]].append((r['keys'][1].replace('https://sellontube.com', ''),
                              r['impressions'], r['position']))
# sort queries by total impressions
order = sorted(byq.items(), key=lambda kv: sum(p[1] for p in kv[1]), reverse=True)
for query, pages in order[:30]:
    tot = sum(p[1] for p in pages)
    print(f"\n  Q: {query}  (total impr {tot}, {len(pages)} page(s))")
    for pg, imp, pos in sorted(pages, key=lambda x: x[1], reverse=True):
        print(f"     {pg}|imp{imp}|pos{pos:.1f}")
