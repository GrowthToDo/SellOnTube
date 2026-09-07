import os, csv, re
from collections import defaultdict

base_path = 'C:/Users/D E L L/Downloads/Keywords for SoT/'
master_path = 'C:/Users/D E L L/Downloads/Claude Coded/SellonTube/research/keywords/sot_master.csv'

files = sorted(os.listdir(base_path))
new_keywords = []

for fname in files:
    fpath = base_path + fname
    with open(fpath, 'r', encoding='utf-16') as f:
        lines = f.readlines()
    if len(lines) < 3:
        continue
    header_line = lines[2].strip()
    headers = header_line.split('\t')
    kw_idx = 0
    vol_idx = headers.index('Avg. monthly searches') if 'Avg. monthly searches' in headers else 2
    comp_idx = headers.index('Competition') if 'Competition' in headers else 5

    for line in lines[3:]:
        line = line.strip()
        if not line:
            continue
        parts = line.split('\t')
        kw = parts[kw_idx].strip().strip('"').lower()
        vol = parts[vol_idx].strip() if len(parts) > vol_idx else ''
        comp = parts[comp_idx].strip() if len(parts) > comp_idx else ''
        if kw:
            new_keywords.append({'keyword': kw, 'volume': vol, 'competition': comp, 'file': fname})

master_keywords = set()
with open(master_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        master_keywords.add(row['keyword'].strip().lower())

ADS_PAT = re.compile(r'\bads?\b|\badvertis|\badvert\b|\bppc\b|\bsponsored\b|\bpaid\b')
JUNK_PAT = re.compile(
    r'\byoutube tv\b|\byoutube music\b|\byoutube premium\b|\byoutube kids\b|'
    r'\bgrow (my|your|a) youtube\b|\byoutube subscribers\b|\byoutube views\b|'
    r'\byoutube likes\b|\byoutube comments\b|\byoutube watch\b|\byoutube download\b|'
    r'\byoutube vanced\b|\bhow to make a youtube video\b|\bvlogger\b|\binfluencer\b|'
    r'\bgaming channel\b|\byoutube shorts how to\b'
)

def should_exclude(kw):
    if ADS_PAT.search(kw):
        return 'ads'
    if JUNK_PAT.search(kw):
        return 'junk'
    return None

def normalize(kw):
    kw = re.sub(r'\b(a|an|the|how to|how|to|for|with|using|your|my|best|top|free|online)\b', '', kw)
    return re.sub(r'\s+', ' ', kw).strip()

master_normalized = {normalize(kw) for kw in master_keywords}

def is_in_master(kw):
    if kw in master_keywords:
        return True
    n = normalize(kw)
    if n in master_normalized:
        return True
    for mk in master_keywords:
        if len(kw) >= 6 and len(mk) >= 6:
            if kw in mk or mk in kw:
                return True
    return False

already = []
excl_ads = []
excl_junk = []
missing = []

for item in new_keywords:
    kw = item['keyword']
    excl = should_exclude(kw)
    if excl == 'ads':
        excl_ads.append(item)
    elif excl == 'junk':
        excl_junk.append(item)
    elif is_in_master(kw):
        already.append(item)
    else:
        missing.append(item)

def vol_sort(v):
    try:
        return int(str(v).replace(',', ''))
    except:
        return 0

THEMES = [
    ('YouTube Keyword Research Tools', re.compile(r'keyword (research|tool|finder|explorer|planner|search|generator)|keyword tool|tubebuddy|vidiq keyword|ahrefs youtube|semrush youtube')),
    ('YouTube Title & Thumbnail Optimization', re.compile(r'title (generator|ideas|maker|tool|optimizer|for youtube)|youtube title|thumbnail (ideas|maker|tool|generator|design|click|ctr)|youtube thumbnail')),
    ('YouTube SEO & Ranking', re.compile(r'youtube seo|seo (for youtube|youtube)|optimize youtube|youtube (optimization|ranking|rank|search rank|search engine|algorithm)')),
    ('YouTube for Business / Lead Gen / B2B', re.compile(r'youtube (for business|business channel|lead gen|leads|get clients|client|b2b|sales|revenue|grow business)|business (youtube|channel)|generate leads|get clients')),
    ('YouTube Topic & Content Ideas', re.compile(r'topic (generator|ideas|finder|tool|for youtube)|content (ideas|strategy|planner|calendar)|video ideas|youtube ideas|what to (post|make|create)')),
    ('YouTube Description & Tags', re.compile(r'description (generator|template|maker|tool|for youtube)|tags? (generator|tool|for youtube|maker)|youtube description|youtube tags?')),
    ('YouTube Script & AI Writing', re.compile(r'script (generator|writer|tool|maker|writing|for youtube|template)|youtube script|ai (video|youtube|script)|write (a |youtube )?script')),
    ('YouTube Analytics & Performance', re.compile(r'analytics|youtube (metrics|kpi|performance|data|stats|statistics|insights|report|dashboard)|channel (metrics|analytics|performance|stats)|impressions|watch time|retention')),
    ('YouTube Growth & Channel Strategy', re.compile(r'youtube (growth|grow|strategy|success|tips|hacks|tricks|how to grow|channel growth|channel strategy)|grow (youtube|channel)')),
    ('YouTube vs / Comparisons', re.compile(r'youtube vs |vs youtube|youtube (competition|competitor)')),
    ('Omnichannel / Video Marketing', re.compile(r'omni.?channel|video marketing|content marketing|video strategy|social media marketing|social video')),
    ('YouTube Promotion & Distribution', re.compile(r'youtube (promotion|promote|distribution|reach|exposure|share|traffic|get views|get watch)|promote (youtube|video|channel)')),
    ('YouTube Channel Setup & Branding', re.compile(r'youtube channel (setup|create|start|name|logo|brand|art|banner|icon|niche)|channel art|channel name')),
    ('YouTube Monetization', re.compile(r'monetiz|youtube (money|earn|income|revenue model|adsense|partner program|memberships)|make money')),
    ('YouTube Competitor / Tool Brand Keywords', re.compile(r'tubebuddy|vidiq|morningfame|socialblade|tubics|keyword.io|keywordtool|hyperlabs|invideo|descript|opus clip')),
    ('Other / Uncategorized', re.compile(r'.*')),
]

def assign_theme(kw):
    for theme_name, pattern in THEMES:
        if pattern.search(kw):
            return theme_name
    return 'Other / Uncategorized'

themed = defaultdict(list)
for item in missing:
    t = assign_theme(item['keyword'])
    themed[t].append(item)

for t in themed:
    themed[t].sort(key=lambda x: vol_sort(x['volume']), reverse=True)

print("=" * 70)
print("KEYWORD GAP ANALYSIS - SELLONTUBE")
print("=" * 70)
print(f"\nTotal new keywords from 5 files: {len(new_keywords)}")
print(f"Already in sot_master.csv (exact/fuzzy match): {len(already)}")
print(f"Excluded - ads/advertising keywords: {len(excl_ads)}")
print(f"Excluded - junk/creator/irrelevant: {len(excl_junk)}")
print(f"NET MISSING (gap candidates): {len(missing)}")

print("\n--- ALREADY IN MASTER (top examples by volume) ---")
for item in sorted(already, key=lambda x: vol_sort(x['volume']), reverse=True)[:15]:
    print(f"  {item['keyword']} | vol={item['volume']}")

print("\n--- EXCLUDED: ADS/ADVERTISING (sample) ---")
for item in sorted(excl_ads, key=lambda x: vol_sort(x['volume']), reverse=True)[:10]:
    print(f"  {item['keyword']} | vol={item['volume']}")

print("\n--- EXCLUDED: JUNK/CREATOR (sample) ---")
for item in sorted(excl_junk, key=lambda x: vol_sort(x['volume']), reverse=True)[:10]:
    print(f"  {item['keyword']} | vol={item['volume']}")

print("\n\n=== MISSING KEYWORDS BY THEME ===\n")
theme_order = [t for t, _ in THEMES]
for t in theme_order:
    items = themed.get(t, [])
    if not items:
        continue
    print(f"\n--- {t} ({len(items)} keywords) ---")
    for item in items[:30]:
        print(f"  [{item['volume']:>6} | {item['competition']:<6}] {item['keyword']}")
    if len(items) > 30:
        print(f"  ... and {len(items)-30} more")
