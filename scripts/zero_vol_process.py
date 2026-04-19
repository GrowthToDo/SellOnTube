import csv, json, re
from collections import defaultdict

# Load DataForSEO keywords
dfs_keywords = {}
with open('research/dataforseo_raw_keywords.csv', 'r', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        kw = row['keyword'].lower().strip()
        dfs_keywords[kw] = {
            'keyword': kw,
            'search_volume': int(float(row['search_volume'] or 0)),
            'cpc': float(row['cpc'] or 0),
            'competition': float(row['competition'] or 0),
            'keyword_difficulty': int(float(row['keyword_difficulty'] or 0)),
            'source': row['source_api_call'],
            'seed_group': row['seed_group']
        }

# Load GSC opportunities
gsc_queries = {}
with open('research/gsc_opportunities.csv', 'r', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        query = row['query'].lower().strip()
        if query not in gsc_queries or int(row['impressions']) > gsc_queries[query]['impressions']:
            gsc_queries[query] = {
                'query': query,
                'impressions': int(row['impressions']),
                'clicks': int(row['clicks']),
                'ctr': float(row['ctr']),
                'position': float(row['position']),
                'page': row['page']
            }

# Load existing content
with open('research/existing_content.json', 'r') as f:
    existing_content = json.load(f)

existing_urls = [c['url'] for c in existing_content]
existing_slugs = [c['slug'] for c in existing_content]
existing_titles = [c['title'].lower() for c in existing_content]

# Merge: combine DFS + GSC
all_merged = {}
for kw, data in dfs_keywords.items():
    all_merged[kw] = {
        'keyword': kw,
        'search_volume': data['search_volume'],
        'cpc': data['cpc'],
        'competition': data['competition'],
        'keyword_difficulty': data['keyword_difficulty'],
        'seed_group': data['seed_group'],
        'gsc_impressions': 0,
        'gsc_clicks': 0,
        'gsc_position': 0,
        'gsc_page': '',
        'validated': False,
        'existing_page': 'NONE'
    }

# Add GSC data
for query, gdata in gsc_queries.items():
    if query in all_merged:
        all_merged[query]['gsc_impressions'] = gdata['impressions']
        all_merged[query]['gsc_clicks'] = gdata['clicks']
        all_merged[query]['gsc_position'] = gdata['position']
        all_merged[query]['gsc_page'] = gdata['page']
        all_merged[query]['validated'] = True
    else:
        all_merged[query] = {
            'keyword': query,
            'search_volume': 0,
            'cpc': 0,
            'competition': 0,
            'keyword_difficulty': 0,
            'seed_group': 'gsc_only',
            'gsc_impressions': gdata['impressions'],
            'gsc_clicks': gdata['clicks'],
            'gsc_position': gdata['position'],
            'gsc_page': gdata['page'],
            'validated': False,
            'existing_page': 'NONE'
        }

# Check existing content coverage
def check_existing_page(keyword):
    kw = keyword.lower()
    for content in existing_content:
        slug = content['slug'].lower().replace('-', ' ')
        title = content['title'].lower()
        if kw in title or kw.replace(' ', '-') in content['slug'].lower():
            return content['url']
        words = set(kw.split())
        slug_words = set(slug.split())
        if len(words) >= 3 and len(words & slug_words) >= len(words) * 0.7:
            return content['url']
    return 'NONE'

for kw in all_merged:
    all_merged[kw]['existing_page'] = check_existing_page(kw)

# === INTENT SCORING ===
def score_intent(kw_data):
    kw = kw_data['keyword']
    score = 0

    # Buying intent signals
    if any(w in kw for w in ['best', 'top', 'vs', 'comparison', 'alternative']):
        score += 3
    if re.search(r'for (saas|coaches|b2b|business|shopify|ecommerce|startups|consultants|agencies|founders|real estate|small business)', kw):
        score += 3
    if any(phrase in kw for phrase in ['how to get clients', 'how to get leads', 'how to generate leads', 'get customers', 'lead generation']):
        score += 3
    if any(w in kw for w in ['agency', 'service', 'services', 'consultant', 'hire', 'company', 'companies']):
        score += 4
    if any(w in kw for w in ['strategy', 'plan', 'framework', 'system', 'funnel']):
        score += 2
    if any(w in kw for w in ['cost', 'pricing', 'worth it', 'roi', 'revenue']):
        score += 3
    if any(phrase in kw for phrase in ['not working', 'not growing', 'no views', 'mistakes', 'fail', 'why']):
        score += 2
    if kw_data['gsc_impressions'] >= 20:
        score += 2
    elif kw_data['gsc_impressions'] >= 5:
        score += 1
    if kw_data['cpc'] >= 2.0:
        score += 2
    if kw_data['validated']:
        score += 1

    # Low-intent signals
    if any(w in kw for w in ['free', 'download', 'reddit', 'quora']):
        score -= 2
    if any(brand in kw for brand in ['tiktok', 'instagram', 'facebook', 'twitter', 'twitch']) and 'vs' not in kw and 'or' not in kw:
        score -= 4
    if any(w in kw for w in ['for fun', 'as a hobby', 'beginner'] ) and 'business' not in kw:
        score -= 3
    if len(kw.split()) <= 1:
        score -= 2

    # Clamp
    return max(1, min(10, score))

for kw in all_merged:
    all_merged[kw]['intent_score'] = score_intent(all_merged[kw])

# === CLUSTERING ===
# Group by semantic similarity - manual cluster definitions based on themes
cluster_rules = [
    {
        'name': 'YouTube SEO Company/Services',
        'patterns': [r'youtube seo (company|companies|service|services|agency|agencies|firm|expert|consultant)',
                     r'youtube (optimization|seo) (service|company|agency)',
                     r'seo (company|agency|service).*(youtube|video)'],
        'title': 'YouTube SEO Services: What They Cost and Who Actually Delivers (2026)'
    },
    {
        'name': 'YouTube Lead Generation',
        'patterns': [r'youtube lead (gen|magnet|generation)',
                     r'lead generation.*(youtube|video)',
                     r'(get|generate) (leads|clients).*(youtube|video)',
                     r'youtube.*(leads|clients|customers)'],
        'title': 'How to Generate Leads From YouTube (Without Ads)'
    },
    {
        'name': 'Video Content Marketing Agency',
        'patterns': [r'video content marketing (agency|companies|company|service)',
                     r'video marketing (agency|firm|company|companies|service)',
                     r'content marketing.*video.*(agency|company)'],
        'title': 'Video Content Marketing Agencies: 2026 Buyer\'s Guide'
    },
    {
        'name': 'YouTube for Small Business',
        'patterns': [r'youtube.*(small business|local business)',
                     r'small business.*youtube',
                     r'youtube ads.*(small business)'],
        'title': 'YouTube for Small Business: The Channel That Sells While You Sleep'
    },
    {
        'name': 'YouTube Ads for Business',
        'patterns': [r'youtube ads.*(business|b2b|cost|roi|worth)',
                     r'youtube advertising.*(business|small|cost)',
                     r'youtube tv.*(business|cost)'],
        'title': 'YouTube Ads for Small Business: Cost, Setup, and ROI Breakdown'
    },
    {
        'name': 'YouTube Business Plan/Strategy',
        'patterns': [r'business plan.*youtube',
                     r'youtube.*business plan',
                     r'youtube channel.*plan',
                     r'youtube.*content plan',
                     r'youtube.*business model'],
        'title': 'How to Write a YouTube Business Plan (Template Inside)'
    },
    {
        'name': 'Video SEO Strategy',
        'patterns': [r'video seo (strategy|tips|optimization|technique|best practice)',
                     r'seo for (video|youtube video)',
                     r'video search.*(optimization|seo)',
                     r'^video seo$'],
        'title': 'Video SEO: How to Rank Your Videos on Google and YouTube'
    },
    {
        'name': 'YouTube Channel Not Growing',
        'patterns': [r'youtube.*(not growing|no views|no subscribers|dead channel)',
                     r'(not getting|no) views.*youtube',
                     r'youtube.*fail',
                     r'why.*youtube.*(not|fail|dead)',
                     r'youtube channel.*grow'],
        'title': 'YouTube Channel Not Growing? Here Are the 7 Real Reasons'
    },
    {
        'name': 'YouTube Keyword Research Tools',
        'patterns': [r'youtube keyword (research|tool|finder|planner)',
                     r'keyword research.*(youtube|video)',
                     r'youtube.*keyword.*(tool|free|best)',
                     r'keyword.*youtube.*channel'],
        'title': 'YouTube Keyword Research: Find Low-Competition Topics That Drive Sales'
    },
    {
        'name': 'YouTube for B2B Marketing',
        'patterns': [r'youtube.*(b2b|business to business)',
                     r'b2b.*(youtube|video marketing)',
                     r'youtube.*b2b.*(strategy|marketing|content|lead)'],
        'title': 'B2B YouTube Marketing: Turn Your Channel Into a Lead Engine'
    },
    {
        'name': 'YouTube SEO Free Tools',
        'patterns': [r'free.*(youtube|video) seo (tool|software|checker)',
                     r'youtube seo tool.*free',
                     r'best free.*youtube.*seo',
                     r'free seo tool.*youtube'],
        'title': 'Free YouTube SEO Tools That Actually Work (2026 Tested)'
    },
    {
        'name': 'YouTube for Ecommerce/Shopify',
        'patterns': [r'youtube.*(shopify|ecommerce|e-commerce|online store|dropshipping)',
                     r'(shopify|ecommerce).*(youtube|video)',
                     r'video marketing.*(ecommerce|shopify|store)'],
        'title': 'YouTube for Ecommerce: How Shopify Stores Get Sales From Video'
    },
    {
        'name': 'YouTube Automation/Growth Hacks',
        'patterns': [r'youtube.*(automat|growth hack|shortcut|fast|quick)',
                     r'youtube.*without.*showing.*face',
                     r'faceless.*youtube',
                     r'youtube.*passive'],
        'title': 'YouTube Growth Without the Grind: Systems That Scale'
    },
    {
        'name': 'Video Marketing ROI',
        'patterns': [r'video marketing (roi|return|worth|cost|investment)',
                     r'(roi|return).*video marketing',
                     r'is.*video marketing.*worth',
                     r'video.*marketing.*cost'],
        'title': 'Video Marketing ROI: Real Numbers From Real Businesses'
    },
    {
        'name': 'YouTube Sales Funnel',
        'patterns': [r'youtube.*(sales funnel|funnel|conversion|convert)',
                     r'(sales funnel|conversion).*youtube',
                     r'youtube.*website traffic',
                     r'youtube to.*website'],
        'title': 'The YouTube Sales Funnel: From Viewer to Paying Customer'
    },
]

# Assign keywords to clusters
clusters = defaultdict(list)
assigned = set()

for kw, data in sorted(all_merged.items(), key=lambda x: x[1]['intent_score'], reverse=True):
    if kw in assigned:
        continue
    for rule in cluster_rules:
        for pattern in rule['patterns']:
            if re.search(pattern, kw, re.IGNORECASE):
                clusters[rule['name']].append(data)
                assigned.add(kw)
                break
        if kw in assigned:
            break

# Catch unclustered keywords with decent intent
unclustered = []
for kw, data in all_merged.items():
    if kw not in assigned and data['intent_score'] >= 4:
        unclustered.append(data)

# Calculate cluster priorities
cluster_output = []
for rule in cluster_rules:
    name = rule['name']
    kws = clusters.get(name, [])
    if not kws:
        continue

    kws.sort(key=lambda x: x['intent_score'], reverse=True)
    anchor = kws[0]
    supporting = kws[1:8]

    has_validated = any(k['validated'] for k in kws)
    priority = (anchor['intent_score'] * 2) + len(supporting) + (3 if has_validated else 0)

    cluster_output.append({
        'cluster_name': name,
        'title': rule['title'],
        'cluster_priority': priority,
        'anchor_keyword': anchor['keyword'],
        'anchor_intent_score': anchor['intent_score'],
        'anchor_volume': anchor['search_volume'],
        'anchor_cpc': anchor['cpc'],
        'anchor_kd': anchor['keyword_difficulty'],
        'supporting_keywords': ', '.join(k['keyword'] for k in supporting),
        'supporting_count': len(supporting),
        'has_validated': has_validated,
        'total_volume': sum(k['search_volume'] for k in kws),
        'max_cpc': max(k['cpc'] for k in kws),
        'all_keywords': kws
    })

cluster_output.sort(key=lambda x: x['cluster_priority'], reverse=True)

# Assign publish weeks
for i, c in enumerate(cluster_output):
    if c['anchor_intent_score'] >= 8:
        c['publish_week'] = 1
    elif c['anchor_intent_score'] >= 5:
        c['publish_week'] = 2
    else:
        c['publish_week'] = 3

# Filter out clusters where existing page already covers the anchor
for c in cluster_output:
    existing = check_existing_page(c['anchor_keyword'])
    c['existing_page'] = existing

# === SAVE OUTPUTS ===

# Output 1: Prioritized CSV
with open('research/keyword_research_prioritized.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['cluster_name','cluster_priority','anchor_keyword','anchor_intent_score',
                'supporting_keywords','search_volume','cpc','gsc_impressions',
                'validated','existing_page','publish_week','suggested_url_slug','keyword_difficulty'])
    for c in cluster_output:
        slug = c['anchor_keyword'].replace(' ', '-').replace('/', '-')
        w.writerow([
            c['cluster_name'], c['cluster_priority'], c['anchor_keyword'],
            c['anchor_intent_score'], c['supporting_keywords'],
            c['total_volume'], c['max_cpc'],
            max((k['gsc_impressions'] for k in c['all_keywords']), default=0),
            c['has_validated'], c['existing_page'], c['publish_week'],
            f'/blog/{slug}', c['anchor_kd']
        ])

# Print summary
print("=" * 80)
print("ZERO-VOLUME KEYWORD RESEARCH SUMMARY")
print("=" * 80)
print(f"\nTotal keywords discovered (raw): {len(dfs_keywords)} (DataForSEO) + {len(gsc_queries)} (GSC)")
print(f"Total after merge/dedup: {len(all_merged)}")
print(f"Keywords with intent score >= 5: {sum(1 for k,v in all_merged.items() if v['intent_score'] >= 5)}")
print(f"Keywords with intent score >= 8 (RED HOT): {sum(1 for k,v in all_merged.items() if v['intent_score'] >= 8)}")
print(f"VALIDATED keywords (in both GSC + DFS): {sum(1 for k,v in all_merged.items() if v['validated'])}")
print(f"Total clusters formed: {len(cluster_output)}")
print(f"Week 1 (RED HOT) clusters: {sum(1 for c in cluster_output if c['publish_week'] == 1)}")
print(f"Week 2 (WARM) clusters: {sum(1 for c in cluster_output if c['publish_week'] == 2)}")
print(f"Unclustered keywords with score >= 4: {len(unclustered)}")

print(f"\n{'='*80}")
print("CLUSTER RANKING (by priority)")
print(f"{'='*80}")
for i, c in enumerate(cluster_output, 1):
    intent_label = "RED HOT" if c['anchor_intent_score'] >= 8 else "WARM" if c['anchor_intent_score'] >= 5 else "COOL"
    existing_flag = f" [EXISTING: {c['existing_page']}]" if c['existing_page'] != 'NONE' else ""
    validated_flag = " [VALIDATED]" if c['has_validated'] else ""
    print(f"\n{i:2d}. [{intent_label}] {c['title']}")
    print(f"    Priority: {c['cluster_priority']} | Anchor: \"{c['anchor_keyword']}\" (intent: {c['anchor_intent_score']}/10)")
    print(f"    Volume: {c['total_volume']} | Max CPC: ${c['max_cpc']:.2f} | KD: {c['anchor_kd']} | Week: {c['publish_week']}{validated_flag}{existing_flag}")
    print(f"    Supporting ({c['supporting_count']}): {c['supporting_keywords'][:120]}")

print(f"\n{'='*80}")
print("TOP UNCLUSTERED KEYWORDS (intent >= 5)")
print(f"{'='*80}")
unclustered.sort(key=lambda x: x['intent_score'], reverse=True)
for kw in unclustered[:20]:
    validated = " [VALIDATED]" if kw['validated'] else ""
    print(f"  score={kw['intent_score']:2d} | vol={kw['search_volume']:3d} | cpc=${kw['cpc']:.2f} | {kw['keyword']}{validated}")

print(f"\n{'='*80}")
print("TOP BUYER-INTENT KEYWORDS (by CPC)")
print(f"{'='*80}")
all_by_cpc = sorted(all_merged.values(), key=lambda x: x['cpc'], reverse=True)
for kw in all_by_cpc[:20]:
    validated = " [V]" if kw['validated'] else ""
    print(f"  cpc=${kw['cpc']:6.2f} | vol={kw['search_volume']:3d} | intent={kw['intent_score']:2d} | kd={kw['keyword_difficulty']:2d} | {kw['keyword']}{validated}")
