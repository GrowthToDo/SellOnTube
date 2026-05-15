// YouTube Autocomplete / Suggest wrapper
// Uses the undocumented but widely-used YouTube suggest endpoint.
// No API key required. No quota.

const SUGGEST_URL = 'https://clients1.google.com/complete/search';

export interface SuggestOptions {
  gl?: string; // country code (e.g. 'us', 'in', 'gb')
  hl?: string; // language code (e.g. 'en', 'de', 'ja')
}

export interface ExpandOptions extends SuggestOptions {
  exhaustive?: boolean;
}

// Modifiers aligned with SellonTube's buyer-intent framework
// (title generator video types + video ideas generator BoFu patterns)
//
// direction: 'prepend' = modifier before seed, 'append' = seed before modifier, 'both' = both
const MODIFIERS: { text: string; direction: 'prepend' | 'append' | 'both' }[] = [
  { text: 'best',            direction: 'prepend' },
  { text: 'top',             direction: 'prepend' },
  { text: 'vs',              direction: 'append' },
  { text: 'alternatives to', direction: 'prepend' },
  { text: 'how to',          direction: 'prepend' },
  { text: 'how to use',      direction: 'prepend' },
  { text: 'how to set up',   direction: 'prepend' },
  { text: 'mistakes',        direction: 'both' },
  { text: 'results',         direction: 'append' },
  { text: 'review',          direction: 'both' },
  { text: 'pricing',         direction: 'append' },
  { text: 'cost',            direction: 'append' },
  { text: 'worth it',        direction: 'append' },
  { text: 'for beginners',   direction: 'append' },
  { text: 'for small business', direction: 'append' },
  { text: 'for startups',    direction: 'append' },
  { text: 'for enterprise',  direction: 'append' },
  { text: 'tutorial',        direction: 'both' },
  { text: 'why',             direction: 'prepend' },
  { text: 'switch to',       direction: 'prepend' },
  { text: 'migrate to',      direction: 'prepend' },
  { text: 'should i',        direction: 'prepend' },
  { text: 'is',              direction: 'prepend' },
  { text: 'pros and cons',   direction: 'append' },
  { text: 'features',        direction: 'append' },
  { text: 'comparison',      direction: 'append' },
  { text: 'demo',            direction: 'append' },
  { text: 'setup',           direction: 'append' },
  { text: 'integration',     direction: 'append' },
  { text: 'example',         direction: 'append' },
  { text: 'case study',      direction: 'append' },
  { text: 'free',            direction: 'append' },
  { text: '2024',            direction: 'append' },
  { text: '2025',            direction: 'append' },
];

/**
 * Get YouTube search suggestions for a query.
 * Returns an array of suggestion strings.
 */
export async function getSuggestions(query: string, opts: SuggestOptions = {}): Promise<string[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    client: 'youtube',
    ds: 'yt',
    q: query.trim(),
    hl: opts.hl || 'en',
  });
  if (opts.gl) params.set('gl', opts.gl);

  const url = `${SUGGEST_URL}?${params.toString()}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SellonTube/1.0)' },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    console.error('YouTube suggest error:', res.status);
    return [];
  }

  const text = await res.text();
  return parseSuggestResponse(text);
}

/**
 * Expand a seed query by appending each letter a-z and collecting suggestions.
 * In exhaustive mode, also uses directional modifiers (no digit queries - they produce noise).
 * Returns deduplicated, filtered suggestions sorted alphabetically.
 */
export async function getExpandedSuggestions(query: string, opts: ExpandOptions = {}): Promise<string[]> {
  const seed = query.trim().toLowerCase();
  if (!seed) return [];

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Base: seed + A-Z appended
  let queries = [seed, ...alphabet.map((letter) => `${seed} ${letter}`)];

  if (opts.exhaustive) {
    // Directional modifiers - each modifier only queries in the direction that makes sense
    for (const mod of MODIFIERS) {
      if (mod.direction === 'prepend' || mod.direction === 'both') {
        queries.push(`${mod.text} ${seed}`);
      }
      if (mod.direction === 'append' || mod.direction === 'both') {
        queries.push(`${seed} ${mod.text}`);
      }
    }
  }

  const allSuggestions: string[] = [];
  const batchSize = 5;

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((q) => getSuggestions(q, opts)));
    for (const suggestions of results) {
      allSuggestions.push(...suggestions);
    }
    // 300ms throttle between batches to avoid rate limiting
    if (i + batchSize < queries.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const s of allSuggestions) {
    const normalized = s.toLowerCase().trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }

  // Filter out noise
  const seedWords = seed.split(/\s+/);

  // Build consecutive 2-word phrases from the seed for phrase matching
  // e.g. "video interview tool" → ["video interview", "interview tool"]
  const seedPhrases: string[] = [];
  for (let i = 0; i < seedWords.length - 1; i++) {
    seedPhrases.push(`${seedWords[i]} ${seedWords[i + 1]}`);
  }

  const filtered = unique.filter((kw) => {
    // Drop keywords that are just the seed itself
    if (kw === seed) return false;

    // Drop very short keywords (less than seed + 2 chars meaningful content)
    if (kw.length < seed.length + 3) return false;

    // Drop keywords with hashtags, @ mentions, or non-Latin scripts mixed in
    if (/#|@/.test(kw)) return false;

    // Drop keywords with non-ASCII characters (mixed-language noise like شرح)
    if (/[^\x00-\x7F]/.test(kw)) return false;

    // Drop romanized non-English noise (Hindi, Arabic, etc. typed in Latin script)
    // and "in [language]" patterns that indicate non-English tutorial content
    const romanizedNoise = /\bkaise\b|\bbanaen\b|\bbanaye\b|\bkya\b|\bhota\b|\bhai\b|\bkaro\b|\bkya hai\b|\bkaise kare\b|\bशرح\b|\bmaroc\b|\bin hindi\b|\bin telugu\b|\bin tamil\b|\bin urdu\b|\bin bangla\b|\bin marathi\b|\ben arabe\b|\ben francais\b|\ben espanol\b|\bkarmayogi\b|\bigot\b/i;
    if (romanizedNoise.test(kw)) return false;

    // Drop non-English European language keywords (French, Spanish, German, Italian, Portuguese)
    const europeanNoise = /\bpanier\b|\bgratis\b|\bdeutsch\b|\btutoriel\b|\bmeilleur\b|\bcomment faire\b|\bcomo\b|\bmejor\b|\bpara que\b|\bque es\b|\bcosa\b|\bmigliore\b|\bcome\b|\bperche\b|\bwarum\b|\bwie\b|\bbeste\b|\bkostenlos\b|\banleitung\b|\btuto\b|\bavis\b|\bguia\b|\bcours\b|\bformation\b|\bfunziona\b|\bgratuito\b|\bgratu?ite?\b|\btutorial em\b/i;
    if (europeanNoise.test(kw)) return false;

    // Drop circular keywords (seed word repeated beyond its natural occurrence)
    const kwWordList0 = kw.split(/\s+/);
    for (const sw of seedWords) {
      const countInKw = kwWordList0.filter(w => w === sw).length;
      const countInSeed = seedWords.filter(w => w === sw).length;
      if (countInKw > countInSeed + 1) return false;
    }

    // Drop "yourself" meaning shift (upsell yourself ≠ product upselling)
    if (/\byourself\b/.test(kw)) return false;

    // Drop gaming/sports/entertainment noise
    const junkPatterns = /\befootball\b|\bfifa\b|\bvolleyball\b|\bfootball\b|\bsoccer\b|\bpes\b|\bgameplay\b|\bgaming\b|\bfortnite\b|\bminecraft\b|\broblox\b|\bleague of legends\b|\bgmod\b|\bsims \d\b|\bsims\b|\bcall of duty\b|\bgta\b|\bvalorant\b|\boverwatch\b|\bapex legends\b|\bdota\b|\bcounter strike\b/i;
    if (junkPatterns.test(kw)) return false;

    // ── Phrase coherence check ──
    // For 2-word seeds: require both words to appear anywhere in the keyword
    // (any order). This catches "how to upsell in shopify" for seed "shopify upsell".
    // For 3+ word seeds: require at least one consecutive 2-word phrase from
    // the seed. This eliminates tangentially related results that share only
    // 1 common word (e.g. "voice engineer interview questions" for seed
    // "video interview tool").
    if (seedWords.length === 2) {
      const hasBothWords = seedWords.every((w) => {
        const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`).test(kw);
      });
      if (!hasBothWords) return false;
    } else if (seedPhrases.length > 0) {
      const hasPhraseMatch = seedPhrases.some((phrase) => kw.includes(phrase));
      if (!hasPhraseMatch) return false;
    } else {
      // Single-word seed: require the seed word to appear
      if (!kw.includes(seed)) return false;
    }

    // ── Seed word extension check ──
    // YouTube often extends seed words: "tool" → "toolbox", "toolkit",
    // "shop" → "shopping". Combined with modifiers this creates nonsense
    // like "mistakes video interview toolbox". For each seed word (length >= 3),
    // if ANY keyword word starts with it but isn't an exact match or common
    // inflection (plural, -ing, -ed, -er), drop the keyword.
    for (const seedWord of seedWords) {
      if (seedWord.length >= 2) {
        const kwWordList = kw.split(/\s+/);
        const allowedForms = new Set([
          seedWord,
          seedWord + 's',      // plural: tool → tools
          seedWord + 'ing',    // gerund: upsell → upselling
          seedWord + 'ed',     // past: upsell → upselled
          seedWord + 'er',     // agent: review → reviewer
        ]);
        const hasExtendedWord = kwWordList.some(
          (w) => w.startsWith(seedWord)
            && w.length > seedWord.length
            && !allowedForms.has(w)
        );
        if (hasExtendedWord) return false;
      }
    }

    // ── A-Z single-word noise check ──
    const kwWordList = kw.split(/\s+/);
    const seedWordCount = seedWords.length;

    if (kw.startsWith(seed + ' ') && kwWordList.length === seedWordCount + 1) {
      const extraWord = kwWordList[kwWordList.length - 1];
      if (extraWord.length < 3) return false;

      // For 3+ word seeds: allowlist approach (A-Z expansion is mostly noise)
      if (seedWords.length >= 3) {
        const usefulSuffix = /^(review|reviews|pricing|price|prices|cost|costs|free|tutorial|tutorials|guide|comparison|demo|features|feature|integration|integrations|setup|alternative|alternatives|example|examples|beginners?|tips|benefits|pros|cons|explained|overview|introduction|walkthrough|checklist|requirements|requirement|certification|implementation|onboarding|training|audit|assessment|report|reports|templates?|workflow|workflows|api|saas|startups?|enterprise|agencies|agency|freelancers?|ecommerce|b2b|b2c|smb|roi|kpi|dashboard|analytics|automation|security|compliance|regulations?|standard|standards|vendors?|providers?|platforms?|solutions?|options|recommendations?|best|top|worst|cheap|affordable|expensive|premium|basic|advanced|professional|popular|rated|ranked|tested|verified|certified|accredited|approved|legit|legitimate|trusted|reliable|secure|safe|fast|slow|easy|hard|simple|complex|small|large|medium|new|old|latest|updated?|modern|current|2024|2025|2026)$/i;
        if (!usefulSuffix.test(extraWord)) return false;
      } else {
        // For 1-2 word seeds: blocklist approach
        const noiseWords = /^(java|javascript|python|react|vscode|blender|gmod|mod|jar|jet|john|join|zone|xd|xt|league|pack|plan|os|qc|li|link|machine|missing|oxford|costa|green|black|box|record|talk|video|windows|wordpress|premiere|project|operator|making|game|giveaway|banned|tools|tamil|telugu|hindi|zone|zerodha|kit|operating|linkedin|template|questions|shorts|memes?|compilations?|podcast|lyrics|asmr|prank|drama|reactions?|costumes?|yesterday|today|tomorrow|xqc|zhc|xdefiant|xenoblade|joe|you|must|zappa|exposed|cancell?ed|mukbang|tiktok|xbox|xml|costco|zendaya|zepeto|youtube|walmart|amazon|netflix|spotify|reddit|twitch|discord|instagram|kanye|zebra|zion|kevlar|jam|html|css|php|ruby|kotlin|cache|bypass|xray|zybooks|zip|vault|quiz|pdf|logo|login|llc|logic|manual|manga|anime|nasa|nba|nfl|mlb|ufc|wwe|nascar|fifa|fortnite|roblox|minecraft|valorant|overwatch|apex|dota|pubg|gta|sims|batman|superman|marvel|disney|pokemon|zelda|sonic|mario|halo|skyrim|fallout|witcher|cyberpunk|fnaf|skibidi|sigma|ohio|unboxing|haul|vlog|storytime|grwm|pov|troll|clickbait|scam|dropship|glassdoor|indeed|salary|resume|leetcode|hackerrank|kaggle|coursera|udemy|skillshare|edx|khan|codecademy|infosys|tcs|wipro|cognizant|accenture|deloitte|kpmg|mckinsey|group|house|international|inc|ltd|corp|channel|song|movie|series|trailer|season|episode|remix|cover|karaoke|lofi|beats|instrumental|ringtone|wallpaper|aesthetic|vibes|trending|viral|famous|celebrity|actor|actress|singer|rapper|band|concert|festival|tour|album|playlist|soundcloud|bandcamp|deezer|tidal|pandora|shazam|kaiser|liquor|xcode|zaplet|queue|synonym|uphold|nation|respls|slayer|hotel|junk|zap|upscale)$/i;
        if (noiseWords.test(extraWord)) return false;
      }
    }

    // ── Multi-word noise after seed ──
    if (kw.startsWith(seed + ' ') && kwWordList.length > seedWordCount + 1) {
      const extraPhrase = kwWordList.slice(seedWordCount).join(' ');

      if (seedWords.length >= 3) {
        // For 3+ word seeds: only keep multi-word additions starting with useful prefixes
        const usefulPrefix = /^(for |vs |how |not |best |free |pricing |review |with |without |in |on |about |using |and |or |to |the |a |an |pro |top |new |no |open |full |step |real |\d)/i;
        if (!usefulPrefix.test(extraPhrase)) return false;
      }

      const multiWordNoise = /^(costa rica|green screen|box talk|zone \d|windows \d|premiere pro|operating system|tools and equipment|tools and techniques|joe biden|joe rogan|jordan peterson|zach bryan|zach king|jimmy fallon|jimmy kimmel|youtube shorts|youtube ideas|youtube video|igot karmayogi|you must|you should|you need to|kanye west|wb games|logic pro|house ccure|house international|demon slayer|hotel rooms?|junk removal|nation login|x shopify|x wordpress|in an interview|in an email)$/i;
      if (multiWordNoise.test(extraPhrase)) return false;
    }

    return true;
  });

  filtered.sort();
  return filtered;
}

/**
 * Parse the JSONP-like response from YouTube suggest.
 * Response format: window.google.ac.h(["query",[["suggestion1"],["suggestion2"],...]])
 */
function parseSuggestResponse(text: string): string[] {
  try {
    // Extract the JSON array from the JSONP wrapper
    const match = text.match(/\((\[[\s\S]+\])\)$/);
    if (!match) return [];

    const parsed = JSON.parse(match[1]);
    // parsed[1] is the array of suggestion arrays
    const suggestions: any[] = parsed?.[1] ?? [];

    return suggestions
      .map((item: any) => (Array.isArray(item) ? String(item[0] ?? '') : ''))
      .filter(Boolean);
  } catch (e) {
    console.error('Failed to parse YouTube suggest response:', e);
    return [];
  }
}
