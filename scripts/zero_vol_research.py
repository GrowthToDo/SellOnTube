import requests, base64, json, time, csv

login = 'sathya@sellontube.com'
password = 'ed896411330f0dec'
creds = base64.b64encode(f'{login}:{password}'.encode()).decode()
headers = {'Authorization': f'Basic {creds}', 'Content-Type': 'application/json'}
BASE = 'https://api.dataforseo.com/v3'

api_calls = 0
total_cost = 0.0
all_keywords = {}

def track_cost(response_data):
    global total_cost
    cost = response_data.get('cost', 0) or 0
    total_cost += cost
    return cost

def add_keyword(kw, volume, cpc, competition, kd, source, seed_group):
    kw_lower = kw.lower().strip()
    if not kw_lower:
        return
    if kw_lower in all_keywords:
        existing = all_keywords[kw_lower]
        existing['sources'].add(source)
        if volume and (not existing['search_volume'] or volume > existing['search_volume']):
            existing['search_volume'] = volume
        if cpc and (not existing['cpc'] or cpc > existing['cpc']):
            existing['cpc'] = cpc
    else:
        all_keywords[kw_lower] = {
            'keyword': kw_lower,
            'search_volume': volume,
            'cpc': cpc,
            'competition': competition,
            'keyword_difficulty': kd,
            'sources': {source},
            'seed_group': seed_group
        }

seed_groups = {
    'core_youtube_seo': [
        'youtube seo', 'youtube seo strategy', 'youtube keyword research',
        'youtube video seo', 'youtube channel optimization', 'youtube ranking',
        'youtube search optimization'
    ],
    'youtube_for_business': [
        'youtube for business', 'youtube marketing strategy', 'youtube lead generation',
        'youtube for saas', 'youtube for b2b', 'youtube content strategy for business',
        'youtube sales funnel'
    ],
    'video_marketing': [
        'video marketing strategy', 'video content marketing', 'video seo',
        'video lead generation', 'video marketing roi'
    ],
    'youtube_verticals': [
        'youtube for shopify', 'youtube for ecommerce', 'youtube for startups',
        'youtube for consultants', 'youtube for agencies', 'youtube for founders'
    ],
    'problem_pain': [
        'youtube channel not growing', 'youtube videos not getting views',
        'how to get clients from youtube', 'youtube lead magnet',
        'youtube to website traffic'
    ]
}

priority_seeds = []
for group, seeds in seed_groups.items():
    for s in seeds[:3]:
        priority_seeds.append((s, group))

# 1. Related Keywords
print("=== RELATED KEYWORDS ===")
for seed, group in priority_seeds:
    try:
        r = requests.post(f'{BASE}/dataforseo_labs/google/related_keywords/live',
            headers=headers,
            json=[{
                "keyword": seed,
                "language_code": "en",
                "location_code": 2840,
                "include_seed_keyword": True,
                "limit": 100,
                "filters": ["keyword_info.search_volume", "<=", 100]
            }])
        api_calls += 1
        data = r.json()
        cost = track_cost(data)

        if data.get('tasks'):
            for task in data['tasks']:
                if task.get('result'):
                    for item in task['result']:
                        if item.get('items'):
                            for kw_item in item['items']:
                                kw_data = kw_item.get('keyword_data', {})
                                ki = kw_data.get('keyword_info', {})
                                add_keyword(
                                    kw_data.get('keyword', ''),
                                    ki.get('search_volume', 0),
                                    ki.get('cpc', 0),
                                    ki.get('competition', 0),
                                    kw_data.get('keyword_properties', {}).get('keyword_difficulty', 0),
                                    'related_keywords',
                                    group
                                )
        print(f"  {seed}: {len(all_keywords)} total kws (cost: ${cost:.4f})")
        time.sleep(0.5)
    except Exception as e:
        print(f"  ERROR {seed}: {e}")

print(f"\nAfter related keywords: {len(all_keywords)} keywords, ${total_cost:.4f} spent")

# 2. Keyword Suggestions
print("\n=== KEYWORD SUGGESTIONS ===")
for seed, group in priority_seeds[:10]:
    try:
        r = requests.post(f'{BASE}/dataforseo_labs/google/keyword_suggestions/live',
            headers=headers,
            json=[{
                "keyword": seed,
                "language_code": "en",
                "location_code": 2840,
                "include_seed_keyword": False,
                "limit": 100,
                "filters": ["keyword_info.search_volume", "<=", 100]
            }])
        api_calls += 1
        data = r.json()
        cost = track_cost(data)

        if data.get('tasks'):
            for task in data['tasks']:
                if task.get('result'):
                    for result in task['result']:
                        if result.get('items'):
                            for kw_item in result['items']:
                                ki = kw_item.get('keyword_info', {})
                                add_keyword(
                                    kw_item.get('keyword', ''),
                                    ki.get('search_volume', 0),
                                    ki.get('cpc', 0),
                                    ki.get('competition', 0),
                                    kw_item.get('keyword_properties', {}).get('keyword_difficulty', 0),
                                    'keyword_suggestions',
                                    group
                                )
        print(f"  {seed}: {len(all_keywords)} total kws (cost: ${cost:.4f})")
        time.sleep(0.5)
    except Exception as e:
        print(f"  ERROR {seed}: {e}")

print(f"\nAfter suggestions: {len(all_keywords)} keywords, ${total_cost:.4f} spent")

# 3. Autocomplete
print("\n=== AUTOCOMPLETE ===")
for seed, group in priority_seeds[:15]:
    try:
        r = requests.post(f'{BASE}/serp/google/autocomplete/live',
            headers=headers,
            json=[{"keyword": seed}])
        api_calls += 1
        data = r.json()
        cost = track_cost(data)

        if data.get('tasks'):
            for task in data['tasks']:
                if task.get('result'):
                    for result in task['result']:
                        if result.get('items'):
                            for item in result['items']:
                                suggestion = item.get('title', '') or item.get('suggestion', '')
                                if suggestion:
                                    add_keyword(suggestion, 0, 0, 0, 0, 'autocomplete', group)
        print(f"  {seed}: {len(all_keywords)} total kws (cost: ${cost:.4f})")
        time.sleep(0.3)
    except Exception as e:
        print(f"  ERROR {seed}: {e}")

print(f"\nAfter autocomplete: {len(all_keywords)} keywords, ${total_cost:.4f} spent")

# Save raw keywords
rows = []
for kw, data in all_keywords.items():
    rows.append({
        'keyword': data['keyword'],
        'search_volume': data['search_volume'] or 0,
        'cpc': data['cpc'] or 0,
        'competition': data['competition'] or 0,
        'keyword_difficulty': data['keyword_difficulty'] or 0,
        'source_api_call': '|'.join(data['sources']),
        'seed_group': data['seed_group']
    })

rows.sort(key=lambda x: (x['search_volume'] or 0), reverse=True)

with open('research/dataforseo_raw_keywords.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=['keyword','search_volume','cpc','competition','keyword_difficulty','source_api_call','seed_group'])
    w.writeheader()
    w.writerows(rows)

print(f"\n=== SUMMARY ===")
print(f"Total unique keywords: {len(all_keywords)}")
print(f"Zero volume (0 or null): {sum(1 for k,v in all_keywords.items() if not v['search_volume'])}")
print(f"Low volume (1-100): {sum(1 for k,v in all_keywords.items() if v['search_volume'] and v['search_volume'] <= 100)}")
print(f"Total API calls: {api_calls}")
print(f"Total cost: ${total_cost:.4f}")
print(f"Remaining balance est: ${2.4462 - total_cost:.4f}")
print(f"Saved to research/dataforseo_raw_keywords.csv")

print(f"\nTop zero/low-volume keywords with CPC > 0 (buyer intent):")
buyer_kws = [v for v in all_keywords.values() if (v['search_volume'] or 0) <= 100 and (v['cpc'] or 0) > 0]
buyer_kws.sort(key=lambda x: x['cpc'] or 0, reverse=True)
for kw in buyer_kws[:40]:
    print(f"  vol={kw['search_volume']:3d} | cpc=${kw['cpc']:.2f} | kd={kw['keyword_difficulty']:2d} | {kw['keyword']}")

# Save summary
with open('research/dataforseo_summary.json', 'w') as f:
    json.dump({
        'total_unique_keywords': len(all_keywords),
        'zero_volume': sum(1 for k,v in all_keywords.items() if not v['search_volume']),
        'low_volume_1_100': sum(1 for k,v in all_keywords.items() if v['search_volume'] and v['search_volume'] <= 100),
        'api_calls': api_calls,
        'total_cost': round(total_cost, 4)
    }, f, indent=2)
