from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

creds = Credentials.from_service_account_file(
    'scripts/credentials.json',
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)
service = build('searchconsole', 'v1', credentials=creds)

# /how-it-works queries
resp = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/how-it-works'}]}],
        'rowLimit': 20
    }
).execute()
print("PAGE: /how-it-works (pos 2.8, 25 impr, 0 clicks)")
for r in resp.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# /pricing queries
resp2 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/pricing'}]}],
        'rowLimit': 20
    }
).execute()
print("\nPAGE: /pricing (pos 5.0, 38 impr, 0 clicks)")
for r in resp2.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# Homepage queries
resp3 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/'}]}],
        'rowLimit': 20
    }
).execute()
print("\nPAGE: / (14 clicks)")
for r in resp3.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# Weekly comparison: last 7 days vs previous 7 days
for label, start, end in [("WEEK_PREV", "2026-05-20", "2026-05-26"), ("WEEK_RECENT", "2026-05-27", "2026-06-02")]:
    resp = service.searchanalytics().query(
        siteUrl='sc-domain:sellontube.com',
        body={
            'startDate': start,
            'endDate': end,
            'dimensions': ['page'],
            'rowLimit': 30
        }
    ).execute()
    total_clicks = sum(r['clicks'] for r in resp.get('rows', []))
    total_impr = sum(r['impressions'] for r in resp.get('rows', []))
    print(f"\n{label} ({start} to {end}): {total_clicks} clicks, {total_impr} impressions")
    for r in resp.get('rows', [])[:15]:
        p = r['keys'][0].replace('https://sellontube.com', '')
        print(f"  {p}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")
