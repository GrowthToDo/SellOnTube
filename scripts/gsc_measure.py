import csv, sys
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
SITE='sc-domain:sellontube.com'
c=Credentials.from_service_account_file('scripts/credentials.json',scopes=['https://www.googleapis.com/auth/webmasters.readonly'])
s=build('searchconsole','v1',credentials=c)
def q(b): return s.searchanalytics().query(siteUrl=SITE,body=b).execute().get('rows',[])
def norm(u): return (u.replace('https://sellontube.com','').rstrip('/') or '/')
def pages(a,b):
    d={}
    for r in q({'startDate':a,'endDate':b,'dimensions':['page'],'rowLimit':25000}):
        k=norm(r['keys'][0]); e=d.setdefault(k,{'clicks':0,'impressions':0,'pw':0})
        e['clicks']+=r['clicks']; e['impressions']+=r['impressions']; e['pw']+=r['position']*r['impressions']
    for e in d.values():
        e['position']=e['pw']/e['impressions'] if e['impressions'] else 0
        e['ctr']=e['clicks']/e['impressions'] if e['impressions'] else 0
    return d
def tot(a,b):
    r=q({'startDate':a,'endDate':b,'dimensions':[],'rowLimit':1})
    if not r: return {'clicks':0,'impressions':0,'ctr':0,'position':0}
    return {'clicks':r[0]['clicks'],'impressions':r[0]['impressions'],'ctr':r[0]['ctr'],'position':r[0]['position']}
def d(a,b): return 'new' if a==0 and b>0 else ('0' if a==0 else f"{((b-a)/a)*100:+.0f}%")

URLS=['/blog/best-youtube-rank-checker-tools-for-business','/blog/is-vidiq-worth-it-for-business',
'/blog/ai-tools-for-youtube','/blog/best-youtube-autocomplete-keyword-tools',
'/blog/how-to-find-youtube-video-ranking-keywords','/blog/youtube-script-writing-guide','/youtube-vs',
'/youtube-for','/blog/youtube-seo-guide','/blog/youtube-keyword-research','/blog/youtube-titles-for-business',
'/blog/youtube-marketing-roi','/youtube-for/shopify','/youtube-vs/webinars']

# Method A: literal 90d matching baseline doc's window length, current vs baseline-doc recorded
BASE_DOC={'/blog/best-youtube-rank-checker-tools-for-business':(1,8539,31.4),
'/blog/is-vidiq-worth-it-for-business':(0,68,16.4),'/blog/ai-tools-for-youtube':(0,1,18.0),
'/blog/best-youtube-autocomplete-keyword-tools':(8,4487,9.9)}
A=('2026-05-26','2026-08-23')
cur=pages(*A); ta=tot(*A)
print("== METHOD A: literal 90d now (2026-05-26..08-23) vs BASELINE DOC 90d (2026-03-29..06-27) ==")
print(f"{'URL':<50}{'CLICKS':>16}{'IMPR':>20}{'CTR':>18}{'POS':>16}")
for u in BASE_DOC:
    bc,bi,bp=BASE_DOC[u]; n=cur.get(u,{'clicks':0,'impressions':0,'ctr':0,'position':0})
    bctr=bc/bi if bi else 0
    print(f"{u[:49]:<50}{bc:>6}->{n['clicks']:<9}{bi:>9}->{n['impressions']:<10}{bctr*100:>7.3f}%->{n['ctr']*100:<9.3f}%{bp:>6.1f}->{n['position']:<9.1f}")
print(f"\nSITE 90d now: clicks {ta['clicks']}  impr {ta['impressions']}  ctr {ta['ctr']*100:.3f}%  pos {ta['position']:.1f}")

# Method B: matched windows + control
for label,pre,post in [('RETROFIT (2026-06-29)',('2026-05-05','2026-06-28'),('2026-06-30','2026-08-23')),
                       ('INDEXING FIX (2026-07-19)',('2026-06-14','2026-07-18'),('2026-07-20','2026-08-23'))]:
    print(f"\n== METHOD B: {label}  PRE {pre[0]}..{pre[1]} vs POST {post[0]}..{post[1]} ==")
    tp,tq=tot(*pre),tot(*post); pp,qq=pages(*pre),pages(*post)
    print(f"CONTROL sitewide: clicks {tp['clicks']}->{tq['clicks']} ({d(tp['clicks'],tq['clicks'])})  "
          f"impr {tp['impressions']}->{tq['impressions']} ({d(tp['impressions'],tq['impressions'])})  "
          f"ctr {tp['ctr']*100:.3f}%->{tq['ctr']*100:.3f}%")
    print(f"{'URL':<50}{'CLICKS':>14}{'IMPR':>20}{'CTR':>20}{'POS':>14}")
    for u in URLS:
        a=pp.get(u,{'clicks':0,'impressions':0,'ctr':0,'position':0}); b=qq.get(u,{'clicks':0,'impressions':0,'ctr':0,'position':0})
        print(f"{u[:49]:<50}{a['clicks']:>5}->{b['clicks']:<8}{a['impressions']:>8}->{b['impressions']:<10}"
              f"{a['ctr']*100:>8.3f}%->{b['ctr']*100:<9.3f}%{a['position']:>5.1f}->{b['position']:<8.1f}")
