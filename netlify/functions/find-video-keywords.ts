import { getSuggestions } from './lib/youtube-suggest.js';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const KEYWORD_SELECTION_INSTRUCTION = `You are a YouTube keyword analyst specializing in buyer-intent search terms. You will receive a video's metadata and a list of real YouTube autocomplete suggestions. Your job is to select the 8 highest-intent keywords that this specific video is most likely to rank for.

SELECTION RULES:

1. ONLY select buyer-intent keywords. Every keyword must signal that the searcher is evaluating, comparing, or deciding. Look for these patterns:
   - "best [thing]" or "top [thing]"
   - "[thing] vs [thing]" or "[thing] alternatives"
   - "[thing] review" or "[thing] worth it"
   - "how to choose [thing]" or "how to [action verb]"
   - "[thing] for [specific use case]" (e.g. "for small business", "for beginners")
   - "[thing] pricing" or "[thing] cost"
   - Mistake-avoidance: "mistakes", "avoid", "before you"

2. DO NOT select:
   - Pure informational keywords ("what is [thing]", "[thing] explained", "[thing] definition")
   - The exact video title verbatim
   - The channel name
   - Single-word keywords
   - Keywords obviously unrelated to the video content
   - Near-duplicate keywords (pick the better phrasing)

3. PRIORITIZE keywords from the autocomplete list. These are real search terms. Only generate new keywords if the autocomplete list has fewer than 8 relevant buyer-intent options. Mark generated keywords by prefixing them with "~".

4. Select this mix:
   - 3 COMPARISON/EVALUATION: "best", "vs", "review", "alternatives", "worth it"
   - 3 ACTION-ORIENTED: "how to [do something]", "[thing] for [use case]", "setup", "get started"
   - 2 DECISION-STAGE: pricing, cost, mistakes, "before you", "should I"

Return valid JSON: { "keywords": ["keyword1", "keyword2", ..., "keyword8"] }`;

const RECOMMENDATION_INSTRUCTION = `You are a YouTube SEO consultant for business channels. Given a video's keyword ranking report, write 3 specific, actionable recommendations AND a suggested rewritten title.

RECOMMENDATION RULES:
- Reference specific keywords and positions from the data
- Suggest concrete metadata changes (title rewording, description additions, tag changes)
- Prioritize quick wins: keywords at position 6-10 that could reach top 5 with small changes
- If a keyword ranks but is NOT in the video's tags, recommend adding it as a tag
- If a keyword IS in the tags but doesn't rank, recommend strengthening it in the title or description
- Never use jargon. Write like you're advising a business owner, not an SEO professional.
- No filler. No "consider" or "you might want to". Direct instructions.
- No em-dashes. Use commas, periods, or colons instead.

SUGGESTED TITLE RULES:
- Rewrite the current title to naturally include the 1-2 highest-priority keywords that are missing from it.
- Use the video description to understand the full scope of what the video covers. Do not narrow the title to one subtopic if the video covers several.
- Keep it under 60 characters.
- Make it sound natural and clickable, not keyword-stuffed.
- If the current title already includes the top keywords, return null for suggestedTitle.`;

export default async (request: Request) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeApiKey) {
    return new Response(
      JSON.stringify({ error: 'YouTube API key not configured. Set YOUTUBE_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl?.trim()) {
      return new Response(
        JSON.stringify({ error: 'videoUrl is required' }),
        { status: 400, headers }
      );
    }

    // Step 1: Extract video ID
    const videoId = extractVideoId(videoUrl.trim());
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "That doesn't look like a YouTube video URL. Paste a link like https://www.youtube.com/watch?v=... or an 11-character video ID." }),
        { status: 400, headers }
      );
    }

    // Step 2: Fetch video metadata
    const metaUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;
    const metaRes = await fetch(metaUrl);

    if (!metaRes.ok) {
      const errText = await metaRes.text();
      console.error('YouTube Videos API error:', metaRes.status, errText);
      if (metaRes.status === 403) {
        return new Response(
          JSON.stringify({ error: 'quota_exceeded', detail: "YouTube API daily limit reached. Try again tomorrow." }),
          { status: 429, headers }
        );
      }
      return new Response(
        JSON.stringify({ error: 'YouTube API failed', youtubeStatus: metaRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const metaData = await metaRes.json();
    const videoItem = metaData.items?.[0];

    if (!videoItem) {
      return new Response(
        JSON.stringify({ error: 'Video not found. Check the URL and make sure it is a public video.' }),
        { status: 400, headers }
      );
    }

    const snippet = videoItem.snippet;
    const title = snippet.title || '';
    const description = (snippet.description || '').slice(0, 500);
    const tags: string[] = snippet.tags || [];
    const channelTitle = snippet.channelTitle || '';
    const channelId = snippet.channelId || '';
    const thumbnail = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '';

    // Step 3a: Generate keyword candidates via YouTube autocomplete
    const seeds = extractSeeds(title);
    let autocompleteSuggestions: string[] = [];

    try {
      const seedResults = await Promise.all(
        seeds.map((seed) => getSuggestions(seed).catch(() => [] as string[]))
      );
      const allSuggestions = seedResults.flat();
      const seen = new Set<string>();
      for (const s of allSuggestions) {
        const normalized = s.toLowerCase().trim();
        if (normalized && !seen.has(normalized)) {
          seen.add(normalized);
          autocompleteSuggestions.push(normalized);
        }
      }
    } catch (err) {
      console.error('Autocomplete failed (non-fatal):', err);
    }

    // Step 3b: Gemini keyword selection
    const keywordPrompt = `VIDEO METADATA:
Title: ${title}
Description (first 500 chars): ${description}
Tags: ${tags.length > 0 ? tags.join(', ') : 'none'}
Channel: ${channelTitle}

YOUTUBE AUTOCOMPLETE SUGGESTIONS:
${autocompleteSuggestions.slice(0, 40).join('\n') || 'No autocomplete data available. Generate all 12 keywords based on the video metadata.'}

Select the 8 highest buyer-intent keywords for this video. Prioritize autocomplete terms.`;

    const geminiKeywordRes = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: KEYWORD_SELECTION_INSTRUCTION }] },
        contents: [{ parts: [{ text: keywordPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.5,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!geminiKeywordRes.ok) {
      const errText = await geminiKeywordRes.text();
      console.error('Gemini keyword selection error:', geminiKeywordRes.status, errText);
      if (geminiKeywordRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiKeywordRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiKeywordData = await geminiKeywordRes.json();
    const rawKeywords = geminiKeywordData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    let parsedKeywords: string[];

    try {
      const parsed = JSON.parse(rawKeywords);
      parsedKeywords = parsed.keywords;
      if (!Array.isArray(parsedKeywords) || parsedKeywords.length < 6) {
        throw new Error('Invalid keywords array');
      }
      parsedKeywords = parsedKeywords.slice(0, 8).map((k: string) => k.replace(/^~/, '').trim());
    } catch (parseErr) {
      // Fallback: try to extract keywords from truncated JSON
      const kwMatches = rawKeywords.match(/"([^"]{3,80})"/g);
      if (kwMatches && kwMatches.length >= 6) {
        parsedKeywords = kwMatches
          .map((m: string) => m.replace(/"/g, '').replace(/^~/, '').trim())
          .filter((k: string) => k.length > 2 && !k.includes('keyword') && !k.includes('keywords'))
          .slice(0, 8);
        if (parsedKeywords.length < 6) {
          console.error('Fallback parse failed, not enough keywords:', rawKeywords.slice(0, 500));
          return new Response(
            JSON.stringify({ error: 'AI returned an invalid keyword list. Try again.', detail: String(parseErr) }),
            { status: 503, headers }
          );
        }
      } else {
        console.error('Failed to parse Gemini keyword response:', parseErr, rawKeywords.slice(0, 500));
        return new Response(
          JSON.stringify({ error: 'AI returned an invalid keyword list. Try again.', detail: String(parseErr) }),
          { status: 503, headers }
        );
      }
    }

    // Step 4: Check YouTube search position for each keyword
    const searchResults = await Promise.allSettled(
      parsedKeywords.map((keyword) => checkKeywordPosition(keyword, videoId, youtubeApiKey))
    );

    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();

    const keywords = parsedKeywords.map((keyword, i) => {
      const result = searchResults[i];
      const kwLower = keyword.toLowerCase();
      const base = {
        keyword,
        inTags: isKeywordInTags(keyword, tags),
        inTitle: titleLower.includes(kwLower),
        inDescription: descLower.includes(kwLower),
      };
      if (result.status === 'fulfilled') {
        return {
          ...base,
          position: result.value.position,
          status: result.value.status as 'ranking' | 'within_reach' | 'not_found',
        };
      }
      return { ...base, position: null, status: 'error' as const };
    });

    // Calculate summary
    const ranking = keywords.filter((k) => k.status === 'ranking').length;
    const withinReach = keywords.filter((k) => k.status === 'within_reach').length;
    const notFound = keywords.filter((k) => k.status === 'not_found').length;
    const grade = calculateGrade(ranking, withinReach);

    // Step 5: Generate recommendations + suggested title via Gemini (non-critical)
    let recommendations: string[] = [];
    let suggestedTitle: string | null = null;
    try {
      const result = await generateRecommendations(
        title, description, tags, keywords, geminiApiKey
      );
      recommendations = result.recommendations;
      suggestedTitle = result.suggestedTitle;
    } catch (err) {
      console.error('Recommendation generation failed (non-fatal):', err);
    }

    return new Response(
      JSON.stringify({
        video: { videoId, title, channel: channelTitle, thumbnail, tags },
        keywords,
        summary: { total: keywords.length, ranking, withinReach, notFound, grade },
        recommendations,
        suggestedTitle,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('find-video-keywords error:', error);
    return new Response(
      JSON.stringify({ error: 'Keyword analysis failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : 'https://' + trimmed);

    const vParam = url.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;

    const pathPatterns = [
      /\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/,
      /^\/([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of pathPatterns) {
      const match = url.pathname.match(pattern);
      if (match) return match[1];
    }

    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // Not a valid URL
  }

  return null;
}

function extractSeeds(title: string): string[] {
  const cleaned = title
    .replace(/[|:\-–—]/g, ' ')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .toLowerCase()
    .trim();

  const fillerWords = new Set([
    'how', 'to', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'dare', 'ought', 'used', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so',
    'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own',
    'same', 'than', 'too', 'very', 'just', 'because', 'as', 'until',
    'while', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself',
    'we', 'our', 'you', 'your', 'he', 'his', 'she', 'her', 'it', 'its',
    'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'why', 'where',
    'when', 'here', 'there', 'best', 'top', 'guide', 'ultimate', 'complete',
  ]);

  const words = cleaned.split(/\s+/).filter((w) => w.length > 1 && !fillerWords.has(w));

  const seeds: string[] = [];

  if (words.length >= 3) {
    seeds.push(words.slice(0, 3).join(' '));
    if (words.length >= 5) {
      seeds.push(words.slice(2, 5).join(' '));
    }
  } else if (words.length >= 2) {
    seeds.push(words.join(' '));
  } else if (words.length === 1) {
    seeds.push(words[0]);
  }

  const parts = title.split(/[|:\-–—]/).map((p) => p.trim().toLowerCase()).filter((p) => p.length > 3);
  if (parts.length >= 2) {
    const secondPart = parts[1].split(/\s+/).filter((w) => !fillerWords.has(w)).slice(0, 3).join(' ');
    if (secondPart && !seeds.includes(secondPart)) {
      seeds.push(secondPart);
    }
  }

  return seeds.slice(0, 3);
}

async function checkKeywordPosition(
  keyword: string,
  targetVideoId: string,
  apiKey: string
): Promise<{ position: number | null; status: string }> {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=20&key=${apiKey}`;

  const res = await fetch(searchUrl, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    throw new Error(`YouTube search failed for "${keyword}": ${res.status}`);
  }

  const data = await res.json();
  const items = data.items || [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].id?.videoId === targetVideoId) {
      const position = i + 1;
      return {
        position,
        status: position <= 5 ? 'ranking' : 'within_reach',
      };
    }
  }

  return { position: null, status: 'not_found' };
}

function isKeywordInTags(keyword: string, tags: string[]): boolean {
  const kwLower = keyword.toLowerCase();
  return tags.some((tag) => {
    const tagLower = tag.toLowerCase();
    return tagLower.includes(kwLower) || kwLower.includes(tagLower);
  });
}

function calculateGrade(ranking: number, withinReach: number): string {
  if (ranking >= 5) return 'A';
  if (ranking >= 3) return 'B';
  if (ranking >= 2 || (ranking >= 1 && withinReach >= 3)) return 'C';
  if (ranking >= 1 || withinReach >= 2) return 'D';
  return 'F';
}

async function generateRecommendations(
  title: string,
  description: string,
  tags: string[],
  keywords: Array<{ keyword: string; position: number | null; status: string; inTags: boolean; inTitle: boolean; inDescription: boolean }>,
  apiKey: string
): Promise<{ recommendations: string[]; suggestedTitle: string | null }> {
  const keywordReport = keywords
    .map((k) => `- ${k.keyword}: position ${k.position ?? 'not found'} (${k.status}) [title: ${k.inTitle ? 'yes' : 'no'}, description: ${k.inDescription ? 'yes' : 'no'}, tags: ${k.inTags ? 'yes' : 'no'}]`)
    .join('\n');

  const descSnippet = description.length > 500 ? description.slice(0, 500) + '...' : description;

  const prompt = `Video title: ${title}
Video description: ${descSnippet}
Current tags: ${tags.length > 0 ? tags.join(', ') : 'none'}

Keyword report:
${keywordReport}

Write 3 specific recommendations to improve this video's search visibility, and suggest a rewritten title that incorporates missing high-value keywords.

Return valid JSON: { "recommendations": ["rec1", "rec2", "rec3"], "suggestedTitle": "rewritten title here" }
If the current title is already well-optimized, set suggestedTitle to null.`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      system_instruction: { parts: [{ text: RECOMMENDATION_INSTRUCTION }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.5,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini recommendation error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed?.recommendations)) {
    throw new Error('Invalid recommendations structure');
  }

  return {
    recommendations: parsed.recommendations.slice(0, 3),
    suggestedTitle: parsed.suggestedTitle || null,
  };
}

export const config = {
  path: '/api/find-video-keywords',
};
