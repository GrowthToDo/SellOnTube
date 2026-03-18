"""
Build sot_master.csv — single source of truth for all content strategy.
Combines sot_keywords_final.csv (blog/tool keywords) with best-match
pSEO keywords pulled from master_keywords_cleaned.csv.

Output columns:
  rank, keyword, search_volume, cpc_inr, keyword_difficulty, intent,
  cluster, content_type, target_slug, status, source, priority_score

Note: cpc values are in INR (not USD) — column renamed from cpc_usd to cpc_inr.

Priority score formula (0-100):
  Business potential (0-40): from cluster tier mapping
  Content-market fit (0-30): from intent
  Search potential (0-20): from search_volume + keyword_difficulty
  Resource cost (0-10): from content_type
"""
import csv, sys

# ── Priority Score ───────────────────────────────────────────────────────────

BUSINESS_POTENTIAL = {
    # Tier 1 — Core (40pts)
    "youtube_seo": 40, "youtube_lead_gen": 40, "b2b": 40, "youtube_keyword_research": 40,
    # Tier 2 — Adjacent (28pts)
    "youtube_marketing": 28, "youtube_analytics": 28, "youtube_growth_strategy": 28,
    "youtube_automation": 28, "youtube_title_generator": 28, "youtube_video_ideas": 28,
    "youtube_tools_software": 28,
    # Tier 3 — Broad (14pts)
    "youtube_general": 14, "youtube_shorts_strategy": 14,
    "youtube_transcription_captions": 14, "video_marketing_general": 14,
    # Excluded (0pts)
    "video_production": 0, "youtube_ads": 0,
    # pSEO — adjacent tier
    "pseo_for": 28, "pseo_vs": 28,
}

CONTENT_MARKET_FIT = {
    "commercial": 30, "transactional": 30,
    "informational": 21,
    "technical": 15,
}

RESOURCE_COST = {
    "pseo_for": 10, "pseo_vs": 10,
    "blog": 7,
    "tool": 4,
}

def calc_priority_score(cluster, intent, search_volume, keyword_difficulty, content_type):
    bp  = BUSINESS_POTENTIAL.get(cluster, 14)
    cmf = CONTENT_MARKET_FIT.get(str(intent).lower(), 10)
    sv  = int(float(search_volume)) if search_volume else 0
    kd  = int(float(keyword_difficulty)) if keyword_difficulty else 50
    sp  = round(min(sv / 50000, 1.0) * 10 + ((100 - kd) / 100) * 10, 1)
    rc  = RESOURCE_COST.get(content_type, 7)
    return round(bp + cmf + sp + rc, 1)

# ── Constants ────────────────────────────────────────────────────────────────

BASE     = "c:/Users/D E L L/Downloads/Claude Coded/SellonTube/research/keywords"
SOT_FINAL = f"{BASE}/sot_keywords_final.csv"
MASTER    = f"{BASE}/master_keywords_cleaned.csv"
OUT       = f"{BASE}/sot_master.csv"

TODAY = "2026-03-10"

# ── Live / Planned status maps ───────────────────────────────────────────────

LIVE_BLOGS = {
    "the-youtube-acquisition-engine",
    "why-most-youtube-strategies-fail",
    "search-intent-youtube-seo-power",
    "compounding-effect-four-videos-a-month",
    "high-intent-topic-research-framework",
    "youtube-vs-blog-shopify-app-case-study",
    "best-youtube-transcript-generators",
    "youtube-marketing-roi",
    "youtube-marketing-b2b",
    "create-youtube-channel-for-business",
}
PLANNED_BLOGS = {"youtube-marketing-strategy"}  # Mar 11

LIVE_FOR = {
    "saas", "coaches", "agencies", "consultants",           # Mar 2
    "b2b-companies", "financial-advisors", "law-firms", "real-estate",  # Mar 9
}
LIVE_VS = {"facebook", "instagram"}                         # Mar 9

# ── Cluster → (content_type, target_slug) ────────────────────────────────────

CLUSTER_MAP = {
    "youtube_seo":               ("blog",  "youtube-seo-guide"),
    "youtube_analytics":         ("tool",  "youtube-analytics-tool"),
    "youtube_automation":        ("tool",  "youtube-ai-tools"),
    "video_production":          ("tool",  "youtube-script-generator"),
    "youtube_growth_strategy":   ("blog",  "create-youtube-channel-for-business"),
    "b2b":                       ("blog",  "youtube-marketing-b2b"),
    "youtube_general":           ("blog",  "youtube-marketing-strategy"),
    "youtube_shorts_strategy":   ("blog",  "youtube-shorts-for-business"),
    "youtube_tools_software":    ("tool",  "youtube-channel-audit-tool"),
    "youtube_transcription_captions": ("blog", "best-youtube-transcript-generators"),
    "video_marketing_general":   ("blog",  "the-youtube-acquisition-engine"),
    "youtube_ads":               ("blog",  "youtube-ads-guide"),
}

# Empty-cluster keyword overrides: keyword fragment → target_slug
EMPTY_CLUSTER_OVERRIDES = {
    "real estate":       ("blog", "pseo_for",  "real-estate"),
    "ecommerce":         ("blog", "pseo_for",  "ecommerce"),
    "law firm":          ("blog", "pseo_for",  "law-firms"),
    "small business":    ("blog", "pseo_for",  "small-business"),
    "b2b":               ("blog", "youtube-marketing-b2b"),
    "agency":            ("blog", "youtube-marketing-agency-guide"),
    "consultant":        ("blog", "youtube-marketing-agency-guide"),
    "specialist":        ("blog", "youtube-marketing-agency-guide"),
    "cost":              ("blog", "youtube-marketing-strategy"),
    "price":             ("blog", "youtube-marketing-strategy"),
    "packages":          ("blog", "youtube-marketing-strategy"),
    "beginner":          ("blog", "youtube-marketing-strategy"),
    "learn":             ("blog", "youtube-marketing-strategy"),
}

# ── pSEO slug definitions ────────────────────────────────────────────────────

PSEO_FOR_SLUGS = [
    "saas", "coaches", "agencies", "consultants", "b2b-companies",
    "course-creators", "financial-advisors", "law-firms", "real-estate",
    "marketing-agencies", "software-companies", "fintech-companies",
    "hr-software", "edtech-companies", "cybersecurity-companies",
    "accountants", "insurance-agents", "mortgage-brokers",
    "recruiting-firms", "management-consultants", "business-coaches",
    "life-coaches", "professional-services", "startup-founders",
    "ecommerce", "healthcare-practices", "dental-practices",
    "subscription-businesses", "marketplaces", "small-business",
]

PSEO_VS_SLUGS = [
    "facebook", "instagram", "linkedin-for-b2b", "instagram-for-coaches",
    "tiktok-for-saas", "paid-ads", "facebook-ads", "content-marketing",
    "podcasting", "blogging", "email-marketing", "linkedin-for-agencies",
    "instagram-for-saas", "webinars", "cold-outreach", "seo-content",
    "influencer-marketing", "referral-marketing", "community-building",
    "twitter-for-saas", "reddit-for-saas",
]

# pSEO slug → list of search terms to try in master_keywords_cleaned
PSEO_SEARCH_TERMS = {
    # YouTube For
    "saas":                  ["youtube for saas", "saas youtube", "youtube saas"],
    "coaches":               ["youtube for coaches", "youtube coaching", "coach youtube"],
    "agencies":              ["youtube for agencies", "agency youtube", "youtube agency"],
    "consultants":           ["youtube for consultants", "youtube consulting", "consultant youtube"],
    "b2b-companies":         ["youtube for b2b", "b2b youtube", "youtube b2b"],
    "course-creators":       ["youtube course creator", "course creator youtube", "online course youtube"],
    "financial-advisors":    ["youtube financial advisor", "financial advisor youtube"],
    "law-firms":             ["youtube law firm", "law firm youtube", "lawyer youtube", "youtube for lawyers"],
    "real-estate":           ["youtube real estate", "real estate youtube", "youtube for real estate"],
    "marketing-agencies":    ["youtube marketing agency", "marketing agency youtube"],
    "software-companies":    ["youtube software company", "saas youtube channel", "youtube for software"],
    "fintech-companies":     ["youtube fintech", "fintech youtube"],
    "hr-software":           ["youtube hr", "hr youtube", "youtube human resources"],
    "edtech-companies":      ["youtube edtech", "edtech youtube", "youtube education company"],
    "cybersecurity-companies":["youtube cybersecurity", "cybersecurity youtube", "youtube cyber"],
    "accountants":           ["youtube accountant", "accountant youtube", "cpa youtube", "youtube accounting"],
    "insurance-agents":      ["youtube insurance", "insurance youtube", "youtube for insurance agents"],
    "mortgage-brokers":      ["youtube mortgage", "mortgage youtube", "youtube for mortgage brokers"],
    "recruiting-firms":      ["youtube recruiting", "recruiting youtube", "youtube for recruiters"],
    "management-consultants":["youtube management consulting", "management consultant youtube"],
    "business-coaches":      ["youtube business coach", "business coach youtube", "youtube for business coaches"],
    "life-coaches":          ["youtube life coach", "life coach youtube"],
    "professional-services": ["youtube professional services", "professional services youtube"],
    "startup-founders":      ["youtube startup", "startup youtube", "youtube for founders"],
    "ecommerce":             ["youtube ecommerce", "ecommerce youtube", "youtube for ecommerce"],
    "healthcare-practices":  ["youtube healthcare", "healthcare youtube", "youtube for doctors"],
    "dental-practices":      ["youtube dental", "dental youtube", "youtube for dentists"],
    "subscription-businesses":["youtube subscription business", "subscription youtube"],
    "marketplaces":          ["youtube marketplace", "marketplace youtube"],
    "small-business":        ["youtube small business", "small business youtube", "youtube for small business"],
    # YouTube Vs
    "facebook":              ["youtube vs facebook", "youtube facebook", "facebook vs youtube"],
    "instagram":             ["youtube vs instagram", "youtube instagram", "instagram vs youtube"],
    "linkedin-for-b2b":      ["youtube vs linkedin", "youtube linkedin b2b", "linkedin vs youtube"],
    "instagram-for-coaches": ["youtube vs instagram coaches", "instagram youtube coaches"],
    "tiktok-for-saas":       ["youtube vs tiktok", "tiktok vs youtube", "youtube tiktok saas"],
    "paid-ads":              ["youtube vs paid ads", "organic youtube vs paid", "youtube vs google ads"],
    "facebook-ads":          ["youtube vs facebook ads", "facebook ads vs youtube"],
    "content-marketing":     ["youtube vs content marketing", "youtube content marketing strategy"],
    "podcasting":            ["youtube vs podcast", "podcast vs youtube", "youtube podcast"],
    "blogging":              ["youtube vs blog", "blog vs youtube", "youtube blogging"],
    "email-marketing":       ["youtube vs email marketing", "email marketing vs youtube"],
    "linkedin-for-agencies": ["youtube vs linkedin agency", "linkedin youtube agencies"],
    "instagram-for-saas":    ["youtube vs instagram saas", "instagram vs youtube saas"],
    "webinars":              ["youtube vs webinar", "webinar vs youtube"],
    "cold-outreach":         ["youtube vs cold outreach", "cold email vs youtube", "youtube cold outreach"],
    "seo-content":           ["youtube vs seo", "seo vs youtube", "youtube vs blogging seo"],
    "influencer-marketing":  ["youtube vs influencer marketing", "youtube influencer marketing"],
    "referral-marketing":    ["youtube vs referral", "youtube referral marketing"],
    "community-building":    ["youtube vs community", "youtube community building"],
    "twitter-for-saas":      ["youtube vs twitter", "twitter vs youtube", "youtube twitter saas"],
    "reddit-for-saas":       ["youtube vs reddit", "reddit vs youtube", "youtube reddit"],
}

# ── Helpers ──────────────────────────────────────────────────────────────────

def slug_status(slug, content_type):
    if content_type == "blog":
        if slug in LIVE_BLOGS:    return "live"
        if slug in PLANNED_BLOGS: return "planned"
        return "not-started"
    if content_type == "pseo_for":
        return "live" if slug in LIVE_FOR else "planned"
    if content_type == "pseo_vs":
        return "live" if slug in LIVE_VS else "planned"
    return "not-started"

def resolve_empty_cluster(keyword):
    kw = keyword.lower()
    for fragment, mapping in EMPTY_CLUSTER_OVERRIDES.items():
        if fragment in kw:
            if len(mapping) == 3:  # (content_type, pseo_type, slug)
                return mapping[0], mapping[2]
            return mapping[0], mapping[1]
    return "blog", "youtube-marketing-strategy"  # default

def find_pseo_keyword(slug, search_terms, master_rows):
    """Return best (sv, kw, cpc, kd, intent) match from master for this slug."""
    best = (0, f"youtube for {slug.replace('-', ' ')}", "0", "0", "informational")
    for row in master_rows:
        kw = row["keyword"].lower()
        for term in search_terms:
            if term in kw:
                sv = int(float(row["search_volume"])) if row["search_volume"] else 0
                if sv > best[0]:
                    best = (sv, row["keyword"], row.get("cpc","0"), row.get("keyword_difficulty","0"), row.get("search_intent","informational"))
    return best

# ── Load data ────────────────────────────────────────────────────────────────

print("Loading sot_keywords_final...", end=" ", flush=True)
with open(SOT_FINAL, encoding="utf-8-sig") as f:
    sot_rows = list(csv.DictReader(f))
print(f"{len(sot_rows)} rows")

print("Loading master_keywords_cleaned...", end=" ", flush=True)
with open(MASTER, encoding="utf-8-sig") as f:
    master_rows = list(csv.DictReader(f))
print(f"{len(master_rows)} rows")

# ── Build output rows ────────────────────────────────────────────────────────

out_rows = []

# 1. Process sot_keywords_final rows
print("Mapping sot_keywords_final rows...")
for row in sot_rows:
    cluster = row["cluster"].strip()
    keyword = row["keyword"]

    if cluster in CLUSTER_MAP:
        ctype, target_slug = CLUSTER_MAP[cluster]
    elif not cluster:
        ctype, target_slug = resolve_empty_cluster(keyword)
        cluster = "youtube_marketing"
    else:
        ctype, target_slug = "blog", cluster

    status = slug_status(target_slug, ctype)

    out_rows.append({
        "keyword":            keyword,
        "search_volume":      row["search_volume"],
        "cpc_inr":            row["cpc_usd"],
        "keyword_difficulty": row["keyword_difficulty"],
        "intent":             row["intent"],
        "cluster":            cluster,
        "content_type":       ctype,
        "target_slug":        target_slug,
        "status":             status,
        "source":             "sot_final",
        "priority_score":     calc_priority_score(cluster, row["intent"], row["search_volume"], row["keyword_difficulty"], ctype),
    })

# 2. Add pSEO for rows (one primary keyword per slug)
already_in = {r["keyword"].lower() for r in out_rows}
print("Finding pSEO keywords (youtube-for)...")

for slug in PSEO_FOR_SLUGS:
    terms = PSEO_SEARCH_TERMS.get(slug, [f"youtube for {slug.replace('-', ' ')}"])
    sv, kw, cpc, kd, intent = find_pseo_keyword(slug, terms, master_rows)

    if kw.lower() in already_in:
        # Use the slug-based fallback keyword to avoid duplicate
        kw = f"youtube for {slug.replace('-', ' ')}"
        sv, cpc, kd, intent = 0, "0", "0", "informational"

    status = "live" if slug in LIVE_FOR else "planned"
    out_rows.append({
        "keyword":            kw,
        "search_volume":      str(sv),
        "cpc_inr":            cpc,
        "keyword_difficulty": kd,
        "intent":             intent,
        "cluster":            "pseo_for",
        "content_type":       "pseo_for",
        "target_slug":        slug,
        "status":             status,
        "source":             "master_keywords" if sv > 0 else "manual",
        "priority_score":     calc_priority_score("pseo_for", intent, str(sv), kd, "pseo_for"),
    })
    already_in.add(kw.lower())

# 3. Add pSEO vs rows
print("Finding pSEO keywords (youtube-vs)...")
for slug in PSEO_VS_SLUGS:
    terms = PSEO_SEARCH_TERMS.get(slug, [f"youtube vs {slug.replace('-', ' ')}"])
    sv, kw, cpc, kd, intent = find_pseo_keyword(slug, terms, master_rows)

    if kw.lower() in already_in:
        kw = f"youtube vs {slug.replace('-', ' ')}"
        sv, cpc, kd, intent = 0, "0", "0", "informational"

    status = "live" if slug in LIVE_VS else "planned"
    out_rows.append({
        "keyword":            kw,
        "search_volume":      str(sv),
        "cpc_inr":            cpc,
        "keyword_difficulty": kd,
        "intent":             intent,
        "cluster":            "pseo_vs",
        "content_type":       "pseo_vs",
        "target_slug":        slug,
        "status":             status,
        "source":             "master_keywords" if sv > 0 else "manual",
        "priority_score":     calc_priority_score("pseo_vs", intent, str(sv), kd, "pseo_vs"),
    })
    already_in.add(kw.lower())

# ── Sort: by content_type group, then SV desc ────────────────────────────────
TYPE_ORDER = {"blog": 0, "tool": 1, "pseo_for": 2, "pseo_vs": 3}
out_rows.sort(key=lambda r: (
    TYPE_ORDER.get(r["content_type"], 9),
    -int(float(r["search_volume"])) if r["search_volume"] else 0
))

# ── Add rank ─────────────────────────────────────────────────────────────────
for i, row in enumerate(out_rows, 1):
    row["rank"] = i

# ── Write output ─────────────────────────────────────────────────────────────
FIELDNAMES = ["rank","keyword","search_volume","cpc_inr","keyword_difficulty",
              "intent","cluster","content_type","target_slug","status","source","priority_score"]

with open(OUT, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
    writer.writeheader()
    writer.writerows(out_rows)

# ── Summary ──────────────────────────────────────────────────────────────────
print(f"\nWrote {len(out_rows)} rows → {OUT}\n")
from collections import Counter
ct = Counter(r["content_type"] for r in out_rows)
st = Counter(r["status"] for r in out_rows)
print("By content_type:")
for k,v in sorted(ct.items()): print(f"  {k:<15} {v}")
print("\nBy status:")
for k,v in sorted(st.items()): print(f"  {k:<15} {v}")
