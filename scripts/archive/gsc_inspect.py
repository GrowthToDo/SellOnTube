import sys, csv, os, time
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

OUT = sys.argv[1]
URLS = sys.argv[2:]
creds = Credentials.from_service_account_file('scripts/credentials.json',
    scopes=['https://www.googleapis.com/auth/webmasters'])
svc = build('searchconsole', 'v1', credentials=creds)

FIELDS = ['url','verdict','coverageState','lastCrawlTime','robotsTxtState',
          'indexingState','pageFetchState','googleCanonical','userCanonical','sitemapListed']
new = not os.path.exists(OUT)
f = open(OUT, 'a', newline='', encoding='utf-8')
w = csv.DictWriter(f, fieldnames=FIELDS)
if new: w.writeheader()

for u in URLS:
    full = 'https://sellontube.com/' + u.lstrip('/')
    row = {'url': u}
    try:
        r = svc.urlInspection().index().inspect(body={
            'inspectionUrl': full, 'siteUrl': 'sc-domain:sellontube.com'}).execute()
        d = r['inspectionResult']['indexStatusResult']
        for k in FIELDS[1:9]:
            row[k] = d.get(k, '')
        row['sitemapListed'] = ';'.join(d.get('sitemap', [])) or 'NOT-IN-SITEMAP'
    except Exception as e:
        row['verdict'] = 'ERROR'; row['coverageState'] = str(e)[:120]
    w.writerow(row); f.flush()
    lc = (row.get('lastCrawlTime') or 'NEVER')[:10]
    print(f"{u:<50}{row.get('verdict',''):<9}{str(row.get('coverageState',''))[:32]:<34}{lc}")
    time.sleep(0.3)
f.close()
