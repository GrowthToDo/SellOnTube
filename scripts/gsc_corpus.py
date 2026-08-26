from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import csv
SITE='sc-domain:sellontube.com'; A,B='2026-05-26','2026-08-23'
c=Credentials.from_service_account_file('scripts/credentials.json',scopes=['https://www.googleapis.com/auth/webmasters.readonly'])
s=build('searchconsole','v1',credentials=c)
def q(b): return s.searchanalytics().query(siteUrl=SITE,body=b).execute().get('rows',[])
WEST={'usa','gbr','can','aus','deu','fra','nld','irl','nzl','swe','nor','dnk','fin','che','aut','bel','esp','ita'}

rows=q({'startDate':A,'endDate':B,'dimensions':['page','country'],'rowLimit':25000})
agg={}
for r in rows:
    p=r['keys'][0].replace('https://sellontube.com','').rstrip('/') or '/'
    ctry=r['keys'][1]; seg='West' if ctry in WEST else 'RoW'
    e=agg.setdefault(p,{'West':[0,0],'RoW':[0,0]})
    e[seg][0]+=r['clicks']; e[seg][1]+=r['impressions']

tot=lambda e: e['West'][0]+e['RoW'][0]
ranked=sorted(agg.items(), key=lambda kv:-tot(kv[1]))
print(f"90d {A}..{B}  |  PAGES RANKED BY CLICKS (not impressions)")
print(f"{'PAGE':<52}{'CLICKS':>8}{'West c/i':>16}{'RoW c/i':>16}{'CTR':>9}")
print('-'*103)
tw=tr=twi=tri=0
for p,e in ranked[:22]:
    t=tot(e); ti=e['West'][1]+e['RoW'][1]
    if t==0: break
    print(f"{p[:51]:<52}{t:>8}{e['West'][0]:>7}/{e['West'][1]:<8}{e['RoW'][0]:>7}/{e['RoW'][1]:<8}{(t/ti*100 if ti else 0):>8.2f}%")
for p,e in ranked:
    tw+=e['West'][0]; twi+=e['West'][1]; tr+=e['RoW'][0]; tri+=e['RoW'][1]
print('-'*103)
print(f"{'SITE TOTAL':<52}{tw+tr:>8}{tw:>7}/{twi:<8}{tr:>7}/{tri:<8}")
print(f"West CTR {tw/twi*100 if twi else 0:.3f}%   RoW CTR {tr/tri*100 if tri else 0:.3f}%   pages with >=1 click: {sum(1 for _,e in ranked if tot(e)>0)} of {len(ranked)}")

qr=q({'startDate':A,'endDate':B,'dimensions':['query','country'],'rowLimit':25000})
qa={}
for r in qr:
    k=r['keys'][0]; seg='West' if r['keys'][1] in WEST else 'RoW'
    e=qa.setdefault(k,{'West':[0,0],'RoW':[0,0],'pw':0,'i':0})
    e[seg][0]+=r['clicks']; e[seg][1]+=r['impressions']; e['pw']+=r['position']*r['impressions']; e['i']+=r['impressions']
qrank=sorted(qa.items(), key=lambda kv:-(kv[1]['West'][0]+kv[1]['RoW'][0]))
print(f"\nQUERIES RANKED BY CLICKS")
print(f"{'QUERY':<46}{'CLICKS':>8}{'West':>10}{'RoW':>10}{'IMPR':>9}{'POS':>7}")
for k,e in qrank[:20]:
    t=e['West'][0]+e['RoW'][0]
    if t==0: break
    print(f"{k[:45]:<46}{t:>8}{e['West'][0]:>10}{e['RoW'][0]:>10}{e['i']:>9}{e['pw']/e['i'] if e['i'] else 0:>7.1f}")
