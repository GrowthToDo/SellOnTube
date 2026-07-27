from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

creds = Credentials.from_service_account_file(
    'scripts/credentials.json',
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)
service = build('searchconsole', 'v1', credentials=creds)

# 1. Queries for ranking checker cluster pages
for page_path in [
    'https://sellontube.com/tools/youtube-ranking-checker',
    'https://sellontube.com/blog/how-to-find-youtube-video-ranking-keywords',
    'https://sellontube.com/blog/best-youtube-rank-checker-tools-for-business',
    'https://sellontube.com/blog/how-to-check-youtube-rankings',
]:
    resp = service.searchanalytics().query(
        siteUrl='sc-domain:sellontube.com',
        body={
            'startDate': '2026-05-07',
            'endDate': '2026-06-03',
            'dimensions': ['query'],
            'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': page_path}]}],
            'rowLimit': 20
        }
    ).execute()
    short = page_path.replace('https://sellontube.com', '')
    print(f"PAGE: {short}")
    for r in resp.get('rows', []):
        print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")
    print()

# 2. Queries for channel optimization checklist (pos 7, 0 clicks)
resp2 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/blog/youtube-channel-optimization-checklist'}]}],
        'rowLimit': 20
    }
).execute()
print("PAGE: /blog/youtube-channel-optimization-checklist")
for r in resp2.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# 3. Queries for youtube-shorts-for-business (pos 14, striking distance)
resp3 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/blog/youtube-shorts-for-business'}]}],
        'rowLimit': 20
    }
).execute()
print("\nPAGE: /blog/youtube-shorts-for-business")
for r in resp3.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# 4. Queries for best-youtube-autocomplete-keyword-tools (941 impr!)
resp4 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/blog/best-youtube-autocomplete-keyword-tools'}]}],
        'rowLimit': 20
    }
).execute()
print("\nPAGE: /blog/best-youtube-autocomplete-keyword-tools")
for r in resp4.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# 5. Queries for high-intent-topic-research-framework
resp5 = service.searchanalytics().query(
    siteUrl='sc-domain:sellontube.com',
    body={
        'startDate': '2026-05-07',
        'endDate': '2026-06-03',
        'dimensions': ['query'],
        'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://sellontube.com/blog/high-intent-topic-research-framework'}]}],
        'rowLimit': 20
    }
).execute()
print("\nPAGE: /blog/high-intent-topic-research-framework")
for r in resp5.get('rows', []):
    print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")

# 6. Pages that actually get clicks - what queries drive them?
for page_path in [
    'https://sellontube.com/blog/youtube-vs-blog-shopify-app-case-study',
    'https://sellontube.com/tools/youtube-autocomplete-keywords',
]:
    resp = service.searchanalytics().query(
        siteUrl='sc-domain:sellontube.com',
        body={
            'startDate': '2026-05-07',
            'endDate': '2026-06-03',
            'dimensions': ['query'],
            'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': page_path}]}],
            'rowLimit': 15
        }
    ).execute()
    short = page_path.replace('https://sellontube.com', '')
    print(f"\nCLICKED PAGE: {short}")
    for r in resp.get('rows', []):
        print(f"  {r['keys'][0]}|{r['clicks']}|{r['impressions']}|{r['position']:.1f}")
