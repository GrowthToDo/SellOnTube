"""
Add curated, ICP-filtered keyword clusters to sot_keywords_final.csv.
Clusters included (per user direction):
  - AI Tools for YouTube (tools angle only, no faceless/automation)
  - Script & Hook Writing (content writing only, no code/bot scripts)
  - Studio & Analytics
  - Channel Setup for Business
  - YouTube for B2B Niches (no ads/advertising/influencer)
  - Channel Audit & Optimization
"""
import pandas as pd, re, sys
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

final  = pd.read_csv('research/keywords/sot_keywords_final.csv', encoding='utf-8-sig')
master = pd.read_csv('research/keywords/master_keywords_cleaned.csv', encoding='utf-8-sig')

existing = set(final['keyword'].str.lower().str.strip())
gap = master[~master['keyword'].isin(existing)].copy()

# ── Cluster definitions ───────────────────────────────────────────────────────

CLUSTERS = []

# ── 1. AI Tools for YouTube (tool-focused only) ───────────────────────────────
ai_tools_keep = re.compile(
    r'\b(youtube ai tool|ai tool.*youtube|ai tools.*youtube|'
    r'best ai.*tool.*youtube|free ai.*tool.*youtube|'
    r'ai tool for youtube|ai tools for youtube|'
    r'best ai tools for youtube|free ai tools for youtube)\b'
)
ai_tools = gap[gap['keyword'].apply(lambda k: bool(ai_tools_keep.search(k)))].copy()
ai_tools['_cluster'] = 'YouTube AI Tools'
ai_tools['_category'] = 'YouTube Tools & Software'
ai_tools['_intent'] = 'transactional'
CLUSTERS.append(ai_tools)

# ── 2. Script & Hook Writing (content writing only) ───────────────────────────
script_keep = re.compile(
    r'\b(youtube script|youtube video script|script.*youtube video|'
    r'video script.*youtube|write.*youtube script|youtube script writer|'
    r'youtube script writing|youtube script outline|youtube script format|'
    r'youtube script example|youtube script ai|ai.*youtube script|'
    r'youtube video structure|scripting.*youtube video|'
    r'youtube content script|youtube script writing software|'
    r'youtube script writing tip|youtube video script ai|'
    r'youtube video script example|youtube video script format|'
    r'youtube ad script|youtube ads script|youtube channel script|'
    r'youtube intro script|youtube outro script|'
    r'youtube channel trailer script|youtube channel introduction script|'
    r'first youtube video script|script for.*youtube video|'
    r'best script for youtube video|example.*youtube script|'
    r'free.*youtube.*script|youtube script online|'
    r'youtube short script|youtube vlog script|'
    r'youtube vlog intro script|youtube video intro script|'
    r'youtube video script writer|ai youtube script writer|'
    r'youtube script writer ai|youtube script writing ai|'
    r'writing.*youtube.*script|youtube.*script.*writing)\b'
)
# Hard exclude: code/bot/dev scripts
script_drop = re.compile(
    r'\b(php|python|bot script|clone script|download.*script|'
    r'script.*download|view bot|auto like|auto subscribe|'
    r'embed script|fivem|blox fruit|moko viral|'
    r'api script|google apps script|subscribe.*bot|sub bot|'
    r'upload script|website script|player script|live script|'
    r'autopilot|videopilot|primal video|view.*python|'
    r'chat gpt youtube script|copyright script|'
    r'youtube tv script|youtube dl|youtube search script|'
    r'youtube view script|youtube views python|view bot php)\b'
)
scripts = gap[
    gap['keyword'].apply(lambda k: bool(script_keep.search(k)) and not bool(script_drop.search(k)))
].copy()
scripts['_cluster'] = 'YouTube Script Writing'
scripts['_category'] = 'YouTube Content Strategy'
scripts['_intent'] = 'informational'
CLUSTERS.append(scripts)

# ── 3. Studio & Analytics ─────────────────────────────────────────────────────
studio_keep = re.compile(
    r'\b(youtube analytics dashboard|youtube studio.*analytic|'
    r'youtube studio channel analytic|youtube.*traffic source analytic|'
    r'youtube.*kpi|youtube.*metric.*business)\b'
)
studio = gap[gap['keyword'].apply(lambda k: bool(studio_keep.search(k)))].copy()
studio['_cluster'] = 'Studio & Analytics'
studio['_category'] = 'Analytics & ROI'
studio['_intent'] = 'technical'
CLUSTERS.append(studio)

# ── 4. Channel Setup for Business ────────────────────────────────────────────
setup_keep = re.compile(
    r'\b(create a company youtube channel|set up company youtube channel|'
    r'company youtube channel|brand youtube channel|'
    r'create a youtube channel.*business|create a youtube channel for.*business|'
    r'youtube channel.*for.*company|youtube.*professional channel|'
    r'brand.*youtube channel|youtube channel.*brand)\b'
)
setup_drop = re.compile(
    r'\b(name generator|name gen|name maker|free|students|english|studies class)\b'
)
setup = gap[
    gap['keyword'].apply(lambda k: bool(setup_keep.search(k)) and not bool(setup_drop.search(k)))
].copy()
setup['_cluster'] = 'Channel Setup (Business)'
setup['_category'] = 'YouTube for Business'
setup['_intent'] = 'informational'
CLUSTERS.append(setup)

# ── 5. YouTube for B2B Niches (no ads/advertising/influencer) ────────────────
b2b_keep = re.compile(
    r'\b(youtube coach|youtube agency|'
    r'real estate.*youtube|youtube.*real estate|'
    r'youtube.*ecommerce|ecommerce.*youtube|'
    r'youtube channel growth agency|youtube content agency|'
    r'youtube channel marketing agency|seo youtube agency|'
    r'youtube shorts agency|youtube promotion agency|'
    r'youtube channel promotion agency|'
    r'youtube.*saas(?! bahu)|saas.*youtube(?! bahu))\b'
)
b2b_drop = re.compile(
    r'\b(ads agency|advertising agency|influencer agency|'
    r'influencer marketing|video ad agency|ads marketing agency|'
    r'social media marketing agency|saas bahu|servicenow|'
    r'automotive dealer|auto dealer)\b'
)
b2b = gap[
    gap['keyword'].apply(lambda k: bool(b2b_keep.search(k)) and not bool(b2b_drop.search(k)))
].copy()
b2b['_cluster'] = 'YouTube for B2B Niches'
b2b['_category'] = 'Agency / Services'
b2b['_intent'] = 'transactional'
CLUSTERS.append(b2b)

# ── 6. Channel Audit & Optimization ──────────────────────────────────────────
audit_keep = re.compile(
    r'\b(check youtube channel|optimiz.*youtube channel|optimize youtube channel|'
    r'youtube channel.*optim|improve youtube channel|ways to improve.*youtube channel|'
    r'youtube channel improve|check.*youtube channel.*analytic|'
    r'check.*youtube channel.*stat|check.*youtube channel.*perform|'
    r'check seo.*youtube channel|youtube channel audit|'
    r'youtube seo audit|check.*youtube channel.*traffic|'
    r'optimize.*youtube channel|improve.*youtube channel|'
    r'search engine optimization.*youtube channel)\b'
)
audit_drop = re.compile(r'\b(free.*check(?! youtube)|checker.*free|my youtube channel\b)\b')
audit = gap[
    gap['keyword'].apply(lambda k: bool(audit_keep.search(k)) and not bool(audit_drop.search(k)))
].copy()
audit['_cluster'] = 'Channel Audit & Optimization'
audit['_category'] = 'Analytics & ROI'
audit['_intent'] = 'technical'
CLUSTERS.append(audit)

# ── Combine, dedup, report ────────────────────────────────────────────────────
combined = pd.concat(CLUSTERS, ignore_index=True).drop_duplicates(subset='keyword')
combined = combined[combined['search_volume'] >= 50]
combined = combined[combined['keyword_difficulty'].fillna(0) <= 40]
combined = combined.sort_values(['search_volume', 'keyword_difficulty'], ascending=[False, True])

print('CLUSTERS SUMMARY:')
print('-' * 60)
for c in combined['_cluster'].unique():
    sub = combined[combined['_cluster'] == c]
    print(f'  {c}: {len(sub)} keywords')
print(f'\nTotal: {len(combined)} keywords\n')

for c in combined['_cluster'].unique():
    sub = combined[combined['_cluster'] == c]
    print(f'\n{"="*65}')
    print(f'  {c.upper()}')
    print(f'{"="*65}')
    print(sub[['keyword', 'search_volume', 'keyword_difficulty']].to_string(index=False))

# ── Append to sot_keywords_final.csv ─────────────────────────────────────────
max_rank = int(final['rank'].max())
rows = []
for i, (_, row) in enumerate(combined.iterrows()):
    rows.append({
        'rank':               max_rank + 1 + i,
        'keyword':            row['keyword'],
        'search_volume':      int(row['search_volume']) if pd.notna(row['search_volume']) else 0,
        'cpc_usd':            round(row['cpc'], 2) if pd.notna(row['cpc']) else 0.0,
        'keyword_difficulty': int(row['keyword_difficulty']) if pd.notna(row['keyword_difficulty']) else 0,
        'intent':             row['_intent'],
        'category':           row['_category'],
        'cluster':            row['topic_cluster'],
    })

new_df = pd.DataFrame(rows)
updated = pd.concat([final, new_df], ignore_index=True)
updated.to_csv('research/keywords/sot_keywords_final.csv', index=False, encoding='utf-8-sig')

print(f'\n{"="*65}')
print(f'  sot_keywords_final.csv: {len(final)} -> {len(updated)} (+{len(new_df)})')
print(f'{"="*65}')
