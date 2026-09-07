from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import json

creds = Credentials.from_service_account_file(
    'scripts/credentials.json',
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)
service = build('searchconsole', 'v1', credentials=creds)

# 1. Top pages
resp = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['page'],
        'rowLimit': 50
    }
).execute()

print("PAGES")
for r in resp.get('rows', []):
    p = r['keys'][0].replace('https://sellontube.com', '')
    print(f"{p}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}|{r['ctr']:.4f}")

# 2. Top queries
resp2 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'rowLimit': 500
    }
).execute()

print("\nQUERIES_TOP")
rows = resp2.get('rows', [])
rows.sort(key=lambda x: x['impressions'], reverse=True)
for r in rows[:40]:
    print(f"{r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}|{r['ctr']:.4f}")

# 3. Zero-click page-1 opportunities
print("\nZERO_CLICK_PAGE1")
zero = [r for r in rows if r['clicks'] == 0 and r['position'] < 15 and r['impressions'] >= 5]
zero.sort(key=lambda x: x['impressions'], reverse=True)
for r in zero[:50]:
    print(f"{r['keys'][0]}|{r['impressions']}|{r['position']:.1f}")

# 4. Queries that DO get clicks (what's working)
print("\nCLICKED_QUERIES")
clicked = [r for r in rows if r['clicks'] > 0]
clicked.sort(key=lambda x: x['clicks'], reverse=True)
for r in clicked[:30]:
    print(f"{r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}|{r['ctr']:.4f}")

# 5. Queries at positions 5-20 (striking distance)
print("\nSTRIKING_DISTANCE")
striking = [r for r in rows if 5 <= r['position'] <= 20 and r['impressions'] >= 10]
striking.sort(key=lambda x: x['impressions'], reverse=True)
for r in striking[:40]:
    print(f"{r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# 6. Daily trend last 14 days
resp3 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-20',
        'endDate': '2026-06-03',
        'dimensions': ['date'],
        'rowLimit': 30
    }
).execute()

print("\nDAILY_TREND")
for r in resp3.get('rows', []):
    print(f"{r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")
