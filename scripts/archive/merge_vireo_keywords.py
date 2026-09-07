import csv
from collections import Counter

# Load existing final keywords
existing_rows = []
with open('c:/Users/D E L L/Downloads/Claude Coded/SellonTube/research/keywords/sot_keywords_final.csv', encoding='utf-8') as f:
    existing_rows = list(csv.DictReader(f))
existing_kws = set(r['keyword'].lower().strip() for r in existing_rows)

# Curated new keywords from Vireo — filtered for SoT B2B positioning
new_add = [
    # ── B2B Agency cluster ────────────────────────────────────────────────────
    {'keyword': 'b2b ad agency',                'sv': 5000, 'cpc': 53, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'advertising agency b2b',       'sv': 5000, 'cpc': 53, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b marketing agency',         'sv': 5000, 'cpc': 42, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b marketing company',        'sv': 5000, 'cpc': 42, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b advertising agency',       'sv': 5000, 'cpc': 42, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'agency for b2b marketing',     'sv': 5000, 'cpc': 42, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b agency',                   'sv': 5000, 'cpc': 13, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b brand strategy agency',    'sv': 500,  'cpc': 39, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'top b2b marketing agency',     'sv': 50,   'cpc': 53, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b video agency',             'sv': 50,   'cpc': 20, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'b2b video marketing agency',   'sv': 50,   'cpc': 14, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    {'keyword': 'youtube digital marketing agency', 'sv': 50, 'cpc': 2,'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'b2b'},
    # ── Video marketing agencies ──────────────────────────────────────────────
    {'keyword': 'marketing video company',      'sv': 5000, 'cpc': 19, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'video marketing firm',         'sv': 5000, 'cpc': 19, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'video ads agency',             'sv': 5000, 'cpc': 12, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'video marketing agencies',     'sv': 5000, 'cpc': 10, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'marketing video agency',       'sv': 5000, 'cpc': 10, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'best video marketing agencies','sv': 50,   'cpc': 12, 'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'top video marketing agencies', 'sv': 50,   'cpc': 9,  'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'video_marketing_general'},
    {'keyword': 'youtube agencies',             'sv': 500,  'cpc': 9,  'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'youtube_general'},
    {'keyword': 'youtube management agency',    'sv': 500,  'cpc': 6,  'kd': 0, 'intent': 'transactional', 'category': 'Agency / Services',       'cluster': 'youtube_general'},
    # ── B2B advertising / audience ────────────────────────────────────────────
    {'keyword': 'b2b advertising',             'sv': 5000, 'cpc': 33, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b ads',                     'sv': 5000, 'cpc': 33, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b audience targeting',      'sv': 500,  'cpc': 41, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b audience',                'sv': 500,  'cpc': 32, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'best b2b ads',                'sv': 500,  'cpc': 26, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b ads on facebook',         'sv': 500,  'cpc': 22, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b advertising examples',    'sv': 500,  'cpc': 11, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b ad examples',             'sv': 500,  'cpc': 11, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b youtube',                 'sv': 500,  'cpc': 11, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'youtube for b2b',             'sv': 500,  'cpc': 11, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b advertising companies',   'sv': 500,  'cpc': 7,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video marketing',         'sv': 500,  'cpc': 17, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video',                   'sv': 500,  'cpc': 11, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video ads',               'sv': 50,   'cpc': 30, 'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video marketing strategy','sv': 50,   'cpc': 24, 'kd': 0, 'intent': 'strategic',     'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video content',           'sv': 50,   'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video strategy',          'sv': 50,   'cpc': 0,  'kd': 0, 'intent': 'strategic',     'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b video marketing examples','sv': 50,   'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'youtube for b2b marketing',   'sv': 50,   'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'b2b youtube channels',        'sv': 50,   'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    {'keyword': 'best b2b youtube channels',   'sv': 50,   'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'b2b'},
    # ── YouTube strategy (business-focused) ───────────────────────────────────
    {'keyword': 'youtube ad strategy',         'sv': 500,  'cpc': 17, 'kd': 0, 'intent': 'strategic',     'category': 'YouTube for Business',    'cluster': 'youtube_general'},
    {'keyword': 'youtube ads strategy',        'sv': 500,  'cpc': 17, 'kd': 0, 'intent': 'strategic',     'category': 'YouTube for Business',    'cluster': 'youtube_general'},
    {'keyword': 'youtube digital marketing',   'sv': 500,  'cpc': 6,  'kd': 0, 'intent': 'informational', 'category': 'YouTube for Business',    'cluster': 'youtube_general'},
    # ── Video marketing strategy ──────────────────────────────────────────────
    {'keyword': 'effective video ads',          'sv': 500,  'cpc': 52, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'video marketing best practices','sv': 500, 'cpc': 32, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'video marketing stats',        'sv': 500,  'cpc': 31, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'video marketing campaigns',    'sv': 500,  'cpc': 19, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'linkedin marketing videos',    'sv': 500,  'cpc': 19, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'marketing videos for business','sv': 500,  'cpc': 14, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'video ad campaign',            'sv': 500,  'cpc': 16, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'short video marketing',        'sv': 500,  'cpc': 13, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'product video marketing',      'sv': 500,  'cpc': 12, 'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'video content marketing strategy','sv':500,'cpc': 0,  'kd': 0, 'intent': 'strategic',     'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'b2b video marketing strategy', 'sv': 50,   'cpc': 24, 'kd': 0, 'intent': 'strategic',     'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'video marketing strategy examples','sv':50,'cpc':10,  'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    # ── Case study / proof content ────────────────────────────────────────────
    {'keyword': 'case study digital marketing', 'sv': 5000, 'cpc': 8,  'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'marketing campaign case study','sv': 500,  'cpc': 6,  'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
    {'keyword': 'youtube ads case study',       'sv': 500,  'cpc': 4,  'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'youtube_general'},
    {'keyword': 'youtube marketing case study', 'sv': 500,  'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'youtube_general'},
    {'keyword': 'video marketing case study',   'sv': 500,  'cpc': 0,  'kd': 0, 'intent': 'informational', 'category': 'Video Marketing Strategy','cluster': 'video_marketing_general'},
]

# Deduplicate against existing
new_add = [r for r in new_add if r['keyword'].lower() not in existing_kws]
# Deduplicate within new_add itself
seen = set()
deduped = []
for r in new_add:
    if r['keyword'].lower() not in seen:
        seen.add(r['keyword'].lower())
        deduped.append(r)
new_add = deduped

print(f"Adding {len(new_add)} new keywords from Vireo")

# Merge
all_rows = []
for r in existing_rows:
    all_rows.append({'keyword': r['keyword'], 'sv': int(r['search_volume']),
                     'cpc': float(r['cpc_usd']), 'kd': int(r['keyword_difficulty']),
                     'intent': r['intent'], 'category': r['category'], 'cluster': r['cluster']})
for r in new_add:
    all_rows.append(r)

all_rows.sort(key=lambda x: (-x['sv'], -x['cpc']))
for i, r in enumerate(all_rows, 1):
    r['rank'] = i

out = 'c:/Users/D E L L/Downloads/Claude Coded/SellonTube/research/keywords/sot_keywords_final.csv'
with open(out, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['rank','keyword','search_volume','cpc_usd','keyword_difficulty','intent','category','cluster'])
    writer.writeheader()
    for r in all_rows:
        writer.writerow({'rank': r['rank'], 'keyword': r['keyword'], 'search_volume': r['sv'],
                         'cpc_usd': r['cpc'], 'keyword_difficulty': r['kd'],
                         'intent': r['intent'], 'category': r['category'], 'cluster': r['cluster']})

cats = Counter(r['category'] for r in all_rows)
print(f"Final total: {len(all_rows)} keywords\n")
print("Category breakdown:")
for cat, cnt in cats.most_common():
    print(f"  {cat:<28} {cnt}")
print(f"\nSV breakdown:")
sv_groups = {'50k+': 0, '5k': 0, '500': 0, '50': 0}
for r in all_rows:
    if r['sv'] >= 50000: sv_groups['50k+'] += 1
    elif r['sv'] >= 5000: sv_groups['5k'] += 1
    elif r['sv'] >= 500: sv_groups['500'] += 1
    else: sv_groups['50'] += 1
for g, cnt in sv_groups.items():
    print(f"  SV {g}: {cnt}")
print(f"\nSaved: {out}")
