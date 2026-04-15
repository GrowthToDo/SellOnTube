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
  { text: 'best',            direction: 'prepend' },  // "best [seed]" not "[seed] best"
  { text: 'vs',              direction: 'append' },   // "[seed] vs" not "vs [seed]"
  { text: 'alternatives to', direction: 'prepend' },  // "alternatives to [seed]"
  { text: 'how to',          direction: 'prepend' },  // "how to [seed]"
  { text: 'how to use',      direction: 'prepend' },  // "how to use [seed]"
  { text: 'how to set up',   direction: 'prepend' },  // "how to set up [seed]"
  { text: 'mistakes',        direction: 'both' },     // "[seed] mistakes" + "mistakes [seed]"
  { text: 'results',         direction: 'append' },   // "[seed] results"
  { text: 'review',          direction: 'both' },     // "[seed] review" + "review [seed]"
  { text: 'pricing',         direction: 'append' },   // "[seed] pricing"
  { text: 'cost',            direction: 'append' },   // "[seed] cost"
  { text: 'worth it',        direction: 'append' },   // "[seed] worth it"
  { text: 'for beginners',   direction: 'append' },   // "[seed] for beginners"
  { text: 'tutorial',        direction: 'both' },     // "[seed] tutorial" + "tutorial [seed]"
  { text: 'why',             direction: 'prepend' },  // "why [seed]"
  { text: 'switch to',       direction: 'prepend' },  // "switch to [seed]"
  { text: 'migrate to',      direction: 'prepend' },  // "migrate to [seed]"
  { text: 'should i',        direction: 'prepend' },  // "should i [seed]"
  { text: 'is',              direction: 'prepend' },  // "is [seed] worth it" etc.
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

  // For multi-word seeds, also create a reversed version to catch natural word orders
  // e.g. "shopify upsell" → "upsell shopify" catches "how to upsell in shopify"
  const seedWordsArr = seed.split(/\s+/);
  const reversedSeed = seedWordsArr.length >= 2 ? seedWordsArr.slice().reverse().join(' ') : '';

  // Base: seed + A-Z appended
  let queries = [seed, ...alphabet.map((letter) => `${seed} ${letter}`)];

  if (opts.exhaustive) {
    // Directional modifiers - each modifier only queries in the direction that makes sense
    for (const mod of MODIFIERS) {
      if (mod.direction === 'prepend' || mod.direction === 'both') {
        queries.push(`${mod.text} ${seed}`);
        // Also query with reversed seed for natural word order
        if (reversedSeed) queries.push(`${mod.text} ${reversedSeed}`);
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
    const romanizedNoise = /\bkaise\b|\bbanaen\b|\bbanaye\b|\bkya\b|\bhota\b|\bhai\b|\bkaro\b|\bkya hai\b|\bkaise kare\b|\bशرح\b|\bmaroc\b|\bin hindi\b|\bin telugu\b|\bin tamil\b|\bin urdu\b|\bin bangla\b|\bin marathi\b|\ben arabe\b|\ben francais\b|\ben espanol\b/i;
    if (romanizedNoise.test(kw)) return false;

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
      const hasBothWords = seedWords.every((w) => kw.includes(w));
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
      if (seedWord.length >= 3) {
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
    // When A-Z expansion produces "seed + one random word", it's usually noise
    // for niche topics. Drop if the extra word is very short (< 3 chars),
    // or is a known noise term (programming languages, random nouns, etc.)
    const kwWordList = kw.split(/\s+/);
    const seedWordCount = seedWords.length;

    // Check if kw starts with the exact seed and adds exactly 1 word
    if (kw.startsWith(seed + ' ') && kwWordList.length === seedWordCount + 1) {
      const extraWord = kwWordList[kwWordList.length - 1];
      // Drop very short additions (single chars or 2-char fragments)
      if (extraWord.length < 3) return false;
      // Drop known noise additions (programming, gaming, random nouns)
      const noiseWords = /^(java|python|react|vscode|blender|gmod|mod|jar|jet|john|join|zone|xd|xt|league|pack|plan|os|qc|li|link|machine|missing|oxford|costa|green|black|box|record|talk|video|windows|wordpress|premiere|project|operator|making|game|giveaway|banned|tools|tamil|telugu|hindi|zone|zerodha|kit|operating|linkedin|template|questions)$/i;
      if (noiseWords.test(extraWord)) return false;
    }

    // ── Multi-word noise after seed ──
    // Catch "seed + 2-3 random words" noise like "video interview tool costa rica",
    // "video interview tool green screen", "video interview tool box talk"
    if (kw.startsWith(seed + ' ') && kwWordList.length > seedWordCount + 1) {
      const extraPhrase = kwWordList.slice(seedWordCount).join(' ');
      const multiWordNoise = /^(costa rica|green screen|box talk|zone \d|windows \d|premiere pro|operating system|tools and equipment|tools and techniques)$/i;
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
