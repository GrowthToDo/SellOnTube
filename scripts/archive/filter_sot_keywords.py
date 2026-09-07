import csv

with open('c:/Users/D E L L/Downloads/Claude Coded/SellonTube/research/keywords/sot_keywords - filtered.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f"Input: {len(rows)} keywords")

# ── Rules ─────────────────────────────────────────────────────────────────────

# 1. Remove tool-focused YouTube SEO variants (creator utilities, not B2B strategy)
seo_tool_remove = [
    'youtube seo score', 'youtube seo title generator', 'youtube seo extension',
    'youtube seo description generator', 'youtube seo checker', 'youtube seo generator',
    'youtube seo meaning', 'youtube video seo checker', 'youtube seo description',
    'free youtube seo', 'free youtube seo tool', 'free youtube seo tools',
    'best youtube seo tool', 'best youtube seo tools', 'best youtube seo',
    'youtube seo tool free', 'youtube seo tools free', 'youtube seo ai',
    'optimize youtube seo', 'youtube seo search', 'youtube seo ranking',
    'youtube seo for beginners', 'best youtube seo tools free', 'free youtube seo tool',
    'youtube seo tool',  # too generic tool-search
]

# 2. Fiverr / competitor tool lookups
misc_remove = [
    'fiverr youtube seo', 'ahrefs youtube seo', 'youtube seo ahrefs',
    'youtube business analyst',   # job title
    'youtube business accounts',  # navigational/setup
    'buy youtube marketing',      # unclear/bad intent
]

# 3. SV=50 junk: brand names, languages, years, platforms
sv50_junk_fragments = [
    # Brand / person specific
    'lenos youtube', 'viking youtube', 'agm marketing', 'alex king youtube',
    'auto dealer youtube', 'automotive dealer youtube', 'neil patel youtube',
    'youtube marketing by golzer', 'youtube marketing itechaxis',
    # Non-English
    'youtube marketing bangla', 'youtube marketing in hindi', 'youtube marketing ki',
    # Year-specific
    'youtube marketing 2020', 'youtube marketing 2021', 'youtube marketing 2022',
    'youtube marketing 2023', 'youtube marketing strategy 2020',
    'youtube marketing strategy 2021', 'youtube marketing strategy 2022',
    # Platform/tool-specific
    'fiverr youtube marketing', 'youtube marketing fiverr',
    'reddit youtube marketing', 'hubspot youtube marketing',
    'udemy youtube marketing', 'youtube marketing udemy',
    'youtube marketing for dummies',
    # Vague / zero intent
    'youtube marketing google', 'youtube marketing hub', 'youtube marketing bangla',
    'nft youtube marketing', 'cpa youtube marketing',
    'youtube marketing analysis',  # too vague
    'youtube and video marketing',  # too generic
    'youtube marketing google',
]

all_remove = set(seo_tool_remove + misc_remove + sv50_junk_fragments)

def should_keep(kw):
    kl = kw.lower().strip()
    # Exact match against full keyword strings
    if kl in all_remove:
        return False
    # Substring match for junk fragments (brand names, languages, etc.)
    junk_fragments = [
        'lenos ', 'viking ', 'alex king', 'agm marketing', 'auto dealer',
        'automotive dealer', 'neil patel', 'golzer', 'itechaxis',
        'bangla', ' hindi', ' ki ', ' nft ', ' cpa ',
        'fiverr', 'udemy', 'reddit', 'hubspot',
        '2020', '2021', '2022', '2023',
        'for dummies', 'for musicians',
    ]
    return not any(frag in kl for frag in junk_fragments)

kept = [r for r in rows if should_keep(r['keyword'])]

# ── Re-rank by original score order (search_volume desc, then cpc desc) ───────
kept.sort(key=lambda r: (-int(r['search_volume']), -float(r['cpc_usd'])))

for i, r in enumerate(kept, 1):
    r['rank'] = i

# ── Print ──────────────────────────────────────────────────────────────────────
from collections import Counter
print(f"Output: {len(kept)} keywords")
print(f"Removed: {len(rows) - len(kept)}\n")

print(f"{'#':<4} {'Keyword':<56} {'SV':>8}  {'CPC':>8}  {'KD':>4}  Category")
print("-"*115)
for r in kept:
    print(f"{r['rank']:<4} {r['keyword']:<56} {int(r['search_volume']):>8,}  ${float(r['cpc_usd']):>7,.0f}  {r['keyword_difficulty']:>4}  {r['category']}")

print("\nCategory breakdown:")
cats = Counter(r['category'] for r in kept)
for cat, cnt in cats.most_common():
    print(f"  {cat}: {cnt}")

# ── Save ───────────────────────────────────────────────────────────────────────
out = 'c:/Users/D E L L/Downloads/Claude Coded/SellonTube/research/keywords/sot_keywords_final.csv'
with open(out, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['rank','keyword','search_volume','cpc_usd','keyword_difficulty','intent','category','cluster'])
    writer.writeheader()
    for r in kept:
        writer.writerow({k: r.get(k,'') for k in ['rank','keyword','search_volume','cpc_usd','keyword_difficulty','intent','category','cluster']})

print(f"\nSaved: {out}")
