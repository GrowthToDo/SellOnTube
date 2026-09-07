"""
Filter master keyword gaps down to SellonTube ICP-relevant clusters only.
ICP: B2B founders, SaaS operators, service businesses using YouTube for growth/acquisition.
"""
import pandas as pd, re, sys
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

final  = pd.read_csv('research/keywords/sot_keywords_final.csv', encoding='utf-8-sig')
master = pd.read_csv('research/keywords/master_keywords_cleaned.csv', encoding='utf-8-sig')

existing = set(final['keyword'].str.lower().str.strip())
gap = master[~master['keyword'].isin(existing)].copy()

# ── Patterns ─────────────────────────────────────────────────────────────────

# Global noise: tool UI queries, consumer-only, navigational
JUNK = re.compile(
    r'\b(free.*download|download.*free|mp4|mp3|converter|save youtube|'
    r'youtube kids|youtube music app|tv app|youtube app\b|mobile app|'
    r'sub for sub|subscriber for subscriber|buy.*view|buy.*sub|auto.*view|'
    r'tag generator|tag gen|tag creator|generator tag|tag maker|'
    r'name generator|name gen|name maker|channel name gen|channel name maker|'
    r'thumbnail grabber|thumbnail downloader|thumbnail.*download|'
    r'youtube search search|and search|search on youtube|'
    r'earn.*watching|watch.*earn|earn money watching|'
    r'grow with jo|grown ups|stream income|learn more|'
    r'reddit|youtube.*reddit)\b'
)

# Tool-only queries (users looking for a free web tool, not strategy content)
TOOL_ONLY = re.compile(
    r'\b(generator\b(?!.*strateg|.*tip|.*idea)|maker\b(?!.*strateg|.*tip)|'
    r'transcript generator|description generator|title generator|'
    r'thumbnail maker|banner maker|banner generator|'
    r'youtube to transcript|get youtube transcript|generate.*transcript)\b'
)

def keep(kw, extra_junk=None):
    if JUNK.search(kw): return False
    if TOOL_ONLY.search(kw): return False
    if extra_junk and extra_junk.search(kw): return False
    return True


# ── Cluster definitions: (name, category, must_match, extra_drop) ─────────────

CLUSTERS = [

    # 1. Algorithm
    ('Algorithm', 'YouTube Algorithm',
     re.compile(
         r'\b(youtube algorithm|how.*youtube algorithm|youtube algorithm.*works|'
         r'beat.*youtube algorithm|understand.*youtube algorithm|'
         r'youtube algorithm.*view|youtube algorithm.*channel|'
         r'youtube algorithm.*new|youtube algorithm.*tip|'
         r'youtube algorithm.*ai|how.*youtube.*recommend|'
         r'youtube.*browse feature|youtube.*suggested video)\b'
     ), None),

    # 2. Monetization — business angle (requirements, strategy, understanding)
    ('Monetization', 'YouTube Monetization',
     re.compile(
         r'\b(youtube monetiz|monetize.*youtube channel|'
         r'youtube.*cpm|youtube.*rpm|youtube.*ad revenue|'
         r'youtube partner program|ypp|'
         r'youtube.*sponsorship|youtube.*brand deal|'
         r'channel monetiz|monetization.*requirement|'
         r'youtube monetization.*strateg|monetize.*requirement|'
         r'how to monetize|youtube.*membership.*monetiz|'
         r'youtube.*income.*channel|youtube creators income|'
         r'youtube monetization income|youtube income checker)\b'
     ),
     re.compile(r'\b(free monetized|watch.*earn|earn.*watching|make money online|'
                r'make money watching|earn money watching|stream income)\b')),

    # 3. Automation & AI (strategic, not tool-specific generators)
    ('Automation & AI', 'YouTube Automation',
     re.compile(
         r'\b(faceless youtube|faceless.*channel|youtube.*faceless|'
         r'ai.*youtube.*channel|youtube.*ai.*channel|'
         r'youtube automation channel|automat.*youtube channel|'
         r'youtube.*without.*face|repurpos.*youtube|youtube.*repurpos|'
         r'youtube.*ai.*tool|ai.*tool.*youtube|'
         r'ai.*video.*youtube(?! generator)|youtube.*ai.*video(?! generator)|'
         r'best ai.*youtube|ai tools.*youtube)\b'
     ),
     re.compile(r'\b(description.*generator|title.*generator|script.*generator|'
                r'thumbnail.*generator|ai.*description|description.*ai)\b')),

    # 4. Channel growth strategy (business-minded)
    ('Channel Growth Strategy', 'YouTube for Business',
     re.compile(
         r'\b(youtube channel growth strategy|grow.*youtube channel|'
         r'tips.*grow.*youtube|how to grow.*youtube|'
         r'youtube.*channel.*grow|grow.*channel.*youtube|'
         r'youtube.*watch time(?! count for)|watch time.*youtube analytic|'
         r'youtube.*retention.*strateg|youtube.*ctr.*strateg|'
         r'youtube.*impression.*strateg|increase.*youtube.*view|'
         r'youtube.*click through rate|youtube.*engagement.*strateg)\b'
     ),
     re.compile(r'\b(shorts watch time count for monetization|website to grow|'
                r'channel grow free|channel grow fast|grow.*free)\b')),

    # 5. Content strategy & niche
    ('Content Strategy & Niche', 'YouTube Content Strategy',
     re.compile(
         r'\b(youtube niche(?! generator)|youtube.*niche.*idea|'
         r'best.*youtube niche|profitable.*youtube niche|'
         r'youtube niche.*channel|youtube niche.*finder|'
         r'find.*youtube niche|youtube niche research|'
         r'faceless youtube niche|youtube.*content plan|'
         r'youtube.*video idea(?! generator))\b'
     ), None),

    # 6. Shorts strategy (business angle only)
    ('Shorts Strategy', 'YouTube Shorts Strategy',
     re.compile(
         r'\b(youtube shorts.*seo|youtube shorts.*grow|grow.*youtube shorts|'
         r'youtube shorts.*strateg|shorts.*algorithm|'
         r'youtube shorts.*tip|youtube shorts.*analytic|'
         r'youtube shorts.*retain|shorts.*hook)\b'
     ), None),

    # 7. Script & Hook (writing, structure — not transcript tools)
    ('Script & Hook Writing', 'YouTube Content Strategy',
     re.compile(
         r'\b(youtube.*script(?! generator| to video)|script.*youtube video|'
         r'video.*script.*youtube|how to write.*youtube|write.*youtube script|'
         r'youtube video.*hook|hook.*youtube video|youtube.*hook.*tip|'
         r'youtube.*intro.*tip|youtube.*outro.*tip|'
         r'youtube video.*structure|youtube.*storytell)\b'
     ),
     re.compile(r'\b(generator|transcript)\b')),

    # 8. Studio & deep analytics (business dashboards)
    ('Studio & Analytics', 'Analytics & ROI',
     re.compile(
         r'\b(youtube studio.*analytic|youtube analytics.*dashboard|'
         r'youtube.*traffic source|youtube.*audience.*insight|'
         r'youtube.*average view duration|youtube.*unique viewer|'
         r'youtube studio channel analytic|youtube.*kpi|'
         r'youtube.*metric.*business|youtube channel analytic.*business)\b'
     ), None),

    # 9. Channel setup for business
    ('Channel Setup (Business)', 'YouTube for Business',
     re.compile(
         r'\b(create.*youtube channel.*business|start.*youtube channel.*business|'
         r'youtube channel.*for business|youtube.*for.*business.*channel|'
         r'how to create.*youtube channel.*company|'
         r'company.*youtube channel|brand.*youtube channel|'
         r'youtube.*brand.*channel|youtube.*business.*setup|'
         r'youtube channel.*brand|youtube.*professional channel)\b'
     ), None),

    # 10. Thumbnail strategy (not makers)
    ('Thumbnail Strategy', 'YouTube Thumbnails',
     re.compile(
         r'\b(thumbnail.*strateg|thumbnail.*best practice|thumbnail.*tip|'
         r'thumbnail.*design.*guide|thumbnail.*optim|'
         r'thumbnail.*ctr|thumbnail.*click.*rate|'
         r'good.*thumbnail|youtube.*thumbnail.*guide|'
         r'thumbnail.*a.?b test|thumbnail.*split test|'
         r'thumbnail.*psychology|thumbnail.*improve)\b'
     ),
     re.compile(r'\b(maker|generator|template|download|grab|canva|size|free)\b')),

    # 11. YouTube for specific B2B niches (real estate, law, saas, agencies)
    ('YouTube for B2B Niches', 'YouTube for Business',
     re.compile(
         r'\b(youtube.*real estate(?! agents karin)|real estate.*youtube|'
         r'youtube.*law firm|law firm.*youtube|'
         r'youtube.*saas|saas.*youtube|'
         r'youtube.*agency(?! near me)|agency.*youtube channel|'
         r'youtube.*consultant(?! near me)|consultant.*youtube|'
         r'youtube.*coach|youtube.*coaching|'
         r'youtube.*ecommerce|ecommerce.*youtube|'
         r'youtube.*restaurant|youtube.*healthcare(?! transcription)|'
         r'youtube.*financial.*advisor|youtube.*accountant)\b'
     ), None),

    # 12. Channel audit & optimization
    ('Channel Audit & Optimization', 'Analytics & ROI',
     re.compile(
         r'\b(youtube channel audit|audit.*youtube channel|'
         r'youtube.*channel.*optim|optim.*youtube channel|'
         r'youtube channel.*review|youtube seo.*audit|'
         r'youtube.*channel.*improve|improve.*youtube channel|'
         r'youtube channel.*tip|youtube.*channel.*best practice|'
         r'youtube.*channel.*check|check.*youtube channel)\b'
     ),
     re.compile(r'\b(free.*check|checker.*free)\b')),
]


# ── Run + report ──────────────────────────────────────────────────────────────
all_selected = []

for name, category, must, drop in CLUSTERS:
    hits = gap[gap['keyword'].apply(lambda k: bool(must.search(k)) and keep(k, drop))].copy()
    hits = hits[hits['search_volume'] >= 50]
    hits = hits[hits['keyword_difficulty'].fillna(0) <= 40]
    hits = hits.sort_values(['search_volume', 'keyword_difficulty'], ascending=[False, True])
    hits['_cluster'] = name
    hits['_category'] = category
    all_selected.append(hits)

    print(f'\n{"="*70}')
    print(f'  {name.upper()}  |  {len(hits)} keywords  |  category: {category}')
    print(f'{"="*70}')
    if len(hits):
        print(hits[['keyword', 'search_volume', 'keyword_difficulty']].to_string(index=False))

combined = pd.concat(all_selected, ignore_index=True).drop_duplicates(subset='keyword')
print(f'\n{"="*70}')
print(f'  TOTAL UNIQUE KEYWORDS TO ADD: {len(combined)}')
print(f'{"="*70}')
