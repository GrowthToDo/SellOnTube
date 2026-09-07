import pandas as pd, re, sys
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

final  = pd.read_csv('research/keywords/sot_keywords_final.csv', encoding='utf-8-sig')
master = pd.read_csv('research/keywords/master_keywords_cleaned.csv', encoding='utf-8-sig')

existing = set(final['keyword'].str.lower().str.strip())
gap = master[~master['keyword'].isin(existing)].copy()

GLOBAL_NOISE = re.compile(
    r'\b(grow with jo|grown ups|kids|tv app|youtube app|'
    r'subscriber for subscriber|sub for sub|live subscriber count|'
    r'download|mp4|mp3|converter|save youtube|'
    r'watch.*earn|earn.*watching|earn money watching|'
    r'tag generator|tag gen|tag creator|generator tag|tag maker|'
    r'name generator|name gen|name maker|channel name gen|'
    r'thumbnail grabber|thumbnail downloader|thumbnail.*download|'
    r'youtube kids|youtube music app|'
    r'auto.*view|automatic.*view|buy.*view|buy.*subscriber|'
    r'search on youtube|youtube search search|and search)\b'
)

def show_cluster(label, category, pattern, extra_noise=None, sv_min=50, kd_max=40):
    hits = gap[
        gap['keyword'].apply(
            lambda k: bool(pattern.search(k)) and not bool(GLOBAL_NOISE.search(k))
        )
    ].copy()
    if extra_noise:
        hits = hits[~hits['keyword'].apply(lambda k: bool(extra_noise.search(k)))]
    hits = hits[hits['search_volume'] >= sv_min]
    if kd_max is not None:
        hits = hits[hits['keyword_difficulty'].fillna(0) <= kd_max]
    hits = hits.sort_values(['search_volume', 'keyword_difficulty'], ascending=[False, True])
    print(f'\n[{label}] — {len(hits)} keywords  (category: {category})')
    print('-' * 75)
    if len(hits):
        print(hits[['keyword', 'search_volume', 'keyword_difficulty']].to_string(index=False))
    return hits


show_cluster('ALGORITHM', 'YouTube Algorithm',
    re.compile(
        r'\b(youtube algorithm|how.*youtube algorithm|youtube algorithm.*works|'
        r'beat.*youtube algorithm|understand.*youtube algorithm|'
        r'youtube algorithm.*view|youtube algorithm.*channel|'
        r'youtube algorithm.*new|how.*youtube.*recommend|'
        r'youtube.*browse feature|youtube.*discovery|youtube.*suggested video)\b'
    ))

show_cluster('MONETIZATION', 'YouTube Monetization',
    re.compile(
        r'\b(youtube monetiz|monetize.*youtube|youtube.*monetiz|'
        r'youtube.*cpm|youtube.*rpm|youtube.*ad revenue|'
        r'youtube.*adsense|youtube partner program|ypp|'
        r'youtube.*income|youtube.*make money|channel.*monetiz|'
        r'youtube.*sponsorship|youtube.*brand deal|youtube.*membership)\b'
    ),
    extra_noise=re.compile(r'\b(stream income|learn more)\b'))

show_cluster('AUTOMATION & AI', 'YouTube Automation',
    re.compile(
        r'\b(faceless youtube|faceless.*channel|youtube.*faceless|'
        r'ai.*youtube.*channel|youtube.*ai.*channel|'
        r'youtube automation channel|automat.*youtube channel|'
        r'youtube.*without face|repurpos.*youtube|youtube.*repurpos|'
        r'youtube.*script.*ai|ai.*script.*youtube|'
        r'youtube.*ai.*tool|ai.*tool.*youtube|'
        r'youtube.*ai.*video|ai.*video.*youtube)\b'
    ))

show_cluster('CHANNEL GROWTH STRATEGY', 'YouTube for Business',
    re.compile(
        r'\b(youtube.*growth strategy|grow.*youtube.*channel|'
        r'youtube channel.*grow|how to grow.*youtube|'
        r'youtube.*increase.*view|increase.*youtube.*view|'
        r'youtube.*increase.*subscriber|increase.*youtube.*subscriber|'
        r'youtube.*watch time|watch time.*youtube|'
        r'youtube.*impression|youtube.*click through rate|youtube.*ctr|'
        r'youtube.*retention|retention.*youtube)\b'
    ))

show_cluster('CONTENT STRATEGY', 'YouTube Content Strategy',
    re.compile(
        r'\b(youtube niche|youtube.*content plan|youtube.*video idea|'
        r'youtube.*niche idea|youtube.*niche finder|'
        r'best.*youtube niche|youtube niche.*channel|'
        r'profitable.*youtube niche|youtube.*pillar)\b'
    ))

show_cluster('THUMBNAIL STRATEGY', 'YouTube Thumbnails',
    re.compile(
        r'\b(thumbnail.*strateg|thumbnail.*best practice|thumbnail.*tip|'
        r'thumbnail.*design|thumbnail.*size|thumbnail.*template|'
        r'thumbnail.*ctr|thumbnail.*click|thumbnail.*optim|'
        r'youtube.*thumbnail.*guide|good thumbnail|'
        r'thumbnail.*a.?b test|thumbnail.*split test|'
        r'thumbnail.*psychology)\b'
    ),
    extra_noise=re.compile(
        r'\b(thumbnail maker|thumbnail generator|thumbnail.*download|thumbnail.*grab)\b'
    ))

show_cluster('SHORTS STRATEGY', 'YouTube Shorts Strategy',
    re.compile(
        r'\b(youtube shorts.*strateg|shorts.*monetiz|'
        r'youtube shorts.*grow|grow.*youtube shorts|'
        r'shorts.*algorithm|youtube shorts.*algorithm|'
        r'shorts.*retention|shorts.*hook|'
        r'youtube shorts.*for business|shorts.*seo|'
        r'youtube shorts.*analytic|shorts.*tip)\b'
    ))

show_cluster('SCRIPT & HOOK', 'YouTube Content Strategy',
    re.compile(
        r'\b(youtube.*script(?! to video)|script.*youtube video|'
        r'video.*script.*youtube|how to write.*youtube|'
        r'youtube video.*hook|hook.*youtube|youtube.*hook.*video|'
        r'youtube.*intro.*script|youtube.*outro|'
        r'youtube.*storytell|youtube video.*structure)\b'
    ),
    kd_max=30)

show_cluster('STUDIO & ANALYTICS', 'Analytics & ROI',
    re.compile(
        r'\b(youtube studio.*analytic|youtube analytics.*dashboard|'
        r'youtube.*traffic source|youtube.*audience.*insight|'
        r'youtube.*average view duration|youtube.*unique viewer|'
        r'youtube.*impression.*click|youtube studio.*channel|'
        r'youtube.*kpi|youtube.*metric.*business)\b'
    ))

show_cluster('CHANNEL SETUP (BUSINESS)', 'YouTube for Business',
    re.compile(
        r'\b(create.*youtube channel|start.*youtube channel|'
        r'how to start.*youtube channel|youtube.*channel.*setup|'
        r'setup.*youtube channel|how to make.*youtube channel|'
        r'youtube.*channel.*guide|youtube.*channel.*checklist|'
        r'youtube.*channel.*trailer|youtube.*channel.*about|'
        r'youtube.*channel art|youtube.*banner)\b'
    ),
    extra_noise=re.compile(
        r'\b(name generator|name gen|name maker|'
        r'create a youtube channel for free)\b'
    ))
