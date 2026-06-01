const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

interface VideoTypeConfig {
  guidance: string;
  targetWords: [number, number];
  targetMinutes: string;
  tone: string;
  bridgeStyle: string;
}

const VIDEO_TYPE_CONFIG: Record<string, VideoTypeConfig> = {
  comparison: {
    guidance:
      'Structure around 3-4 comparison criteria buyers actually evaluate. Present each fairly with specific pros/cons. Reveal which option fits the target customer best. The product should appear as the recommended choice based on the criteria discussed.',
    targetWords: [900, 1500],
    targetMinutes: '6-10',
    tone: 'authoritative_advisor',
    bridgeStyle: 'woven_demonstration',
  },
  'how-to': {
    guidance:
      'Structure as a step-by-step process the viewer can follow immediately. Each step must be specific and actionable. Show the product in use during one of the steps as the natural tool for the task.',
    targetWords: [750, 1200],
    targetMinutes: '5-8',
    tone: 'knowledgeable_guide',
    bridgeStyle: 'woven_demonstration',
  },
  mistakes: {
    guidance:
      'Structure around 3-5 specific mistakes with real, quantified consequences. For each mistake, explain what goes wrong and the correct approach. The product enters as the solution to one key mistake after the pain is established.',
    targetWords: [600, 1050],
    targetMinutes: '4-7',
    tone: 'authoritative_advisor',
    bridgeStyle: 'earned_recommendation',
  },
  results: {
    guidance:
      'Structure around specific metrics and outcomes. Lead with the headline result, then break down the process that achieved it. Credit the product naturally as part of the process. Include before/after comparisons.',
    targetWords: [750, 1200],
    targetMinutes: '5-8',
    tone: 'authoritative_guide_mix',
    bridgeStyle: 'earned_recommendation',
  },
};

// --- URL Scraping ---

interface ScrapedContent {
  title: string;
  metaDescription: string;
  headings: string[];
  bodyText: string;
  pricingMentions: string[];
  ctaButtons: string[];
}

function stripTags(html: string, ...tags: string[]): string {
  for (const tag of tags) {
    html = html.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'gi'), '');
  }
  return html;
}

function extractMeta(html: string, name: string): string {
  const m =
    html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i')) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
  return m?.[1] || '';
}

function extractTagContent(html: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi');
  const out: string[] = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    const t = m[1].trim();
    if (t) out.push(t);
  }
  return out;
}

function extractCtaTexts(html: string): string[] {
  const regex = /<(?:button|a)[^>]*>([^<]{2,50})<\/(?:button|a)>/gi;
  const ctas: string[] = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    const text = m[1].trim();
    if (
      /(?:start|try|book|demo|sign.?up|get.?started|free.?trial|download|schedule|contact|request|subscribe|enroll|join|register|buy|order|add.?to.?cart|learn.?more|watch.?demo)/i.test(
        text
      )
    ) {
      ctas.push(text);
    }
  }
  return [...new Set(ctas)].slice(0, 5);
}

function extractPricingMentions(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split('\n')) {
    if (/\$\d|\/month|\/year|\/mo|free plan|free tier|free trial|pricing|per user|per seat/i.test(line)) {
      const t = line.trim();
      if (t.length > 5 && t.length < 200) out.push(t);
    }
  }
  return out.slice(0, 5);
}

async function scrapeUrl(url: string): Promise<ScrapedContent | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SellonTubeBot/1.0)', Accept: 'text/html' },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || '';

    const metaDescription = extractMeta(html, 'description') || extractMeta(html, 'og:description');

    const headings = [...extractTagContent(html, 'h1'), ...extractTagContent(html, 'h2')].slice(0, 10);

    let cleaned = stripTags(html, 'script', 'style', 'nav', 'footer', 'header', 'noscript', 'svg', 'iframe');
    cleaned = cleaned.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const bodyText = cleaned.slice(0, 2000);

    const ctaButtons = extractCtaTexts(html);
    const pricingMentions = extractPricingMentions(cleaned);

    return { title, metaDescription, headings, bodyText, pricingMentions, ctaButtons };
  } catch (err) {
    console.log('URL scrape failed:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

// --- Prompt construction ---

const TONE_INSTRUCTIONS: Record<string, string> = {
  authoritative_advisor: `TONE: Authoritative advisor. Confident, direct, opinion-driven. Like a consultant who has seen 100 businesses in this space. Use phrases like "here's what actually works" and "most people get this wrong." Share contrarian takes where warranted. You have opinions and you state them.`,
  knowledgeable_guide: `TONE: Knowledgeable guide. Warm, helpful, educational. Like a senior colleague walking someone through a process. Use "let me show you" and "here's what to look for." Be clear and approachable. Teach with patience but stay specific.`,
  authoritative_guide_mix: `TONE: Mix of authority and guidance. Lead with proof and specific results (authoritative), then walk through the process that achieved them (guide). Be data-driven but approachable.`,
};

const BRIDGE_INSTRUCTIONS: Record<string, string> = {
  woven_demonstration: `PRODUCT BRIDGE STYLE — WOVEN DEMONSTRATION:
The product appears naturally DURING the teaching. When explaining a step or criterion, demonstrate it using the product. "Open up [Product], go to [feature], and you'll see [result]." The product IS the method, not a separate pitch. Never create a dedicated pitch section. The viewer should barely notice the transition because the product was the tool used to teach.`,
  earned_recommendation: `PRODUCT BRIDGE STYLE — EARNED RECOMMENDATION:
Place the product bridge at approximately 60-70% of the script. The product enters AFTER you've established the problem and taught the framework. Reference a SPECIFIC problem raised in the body: "Now, the tool we use to handle exactly this is [Product]." Mention 1-2 specific features that map to problems you just discussed. Keep it to 30-60 seconds. Frame as advice, not a pitch.`,
};

function buildSystemInstruction(videoType: string): string {
  const config = VIDEO_TYPE_CONFIG[videoType] || VIDEO_TYPE_CONFIG['how-to'];
  const tone = TONE_INSTRUCTIONS[config.tone] || TONE_INSTRUCTIONS.knowledgeable_guide;
  const bridge = BRIDGE_INSTRUCTIONS[config.bridgeStyle] || BRIDGE_INSTRUCTIONS.earned_recommendation;

  return `You are a B2B YouTube script strategist. You write conversion-focused video scripts for businesses, not entertainment content for creators.

Your scripts are built on one principle: the right viewer finds this video via search, trusts the brand within 8 minutes, and takes one specific action.

${tone}

${bridge}

RULES YOU NEVER BREAK:

1. HOOK (first 15 seconds):
   - First sentence names the viewer's specific problem or decision. Never open with "Hey guys" or any personality introduction.
   - Within 5 seconds, the viewer must know whether this video is for them. The hook is a FILTER — attract the ideal buyer, signal to everyone else this is not for them.
   - Within 15 seconds, state exactly what this video delivers and who it is for.
   - Write WORD FOR WORD. Every word matters.
   - Use the target customer to make it hyper-specific. "If you're a SaaS founder evaluating CRMs for a team under 20" is 10x better than "If you're looking for a CRM."

2. SETUP (15-45 seconds):
   - Explain why this problem matters RIGHT NOW. Cost of getting it wrong? Cost of delaying?
   - Create tension that makes the rest of the video feel necessary.
   - Be specific: "You'll spend 6 months migrating data" beats "it will cause problems."
   - Write WORD FOR WORD.

3. BODY (3-5 points):
   - Every point: WHAT (state clearly) then WHY (why this matters to this viewer) then HOW (specific action or insight).
   - At least one concrete example, number, or real scenario per point.
   - Each point must teach or answer a question. Cut anything that is filler, obvious, or generic.
   - Write as FULL PROSE — complete sentences ready for a teleprompter or voiceover artist. Not bullets.
   - Transitions between points must be explicit: "Now that you understand [previous point], here's where most people get it wrong..."
   - Write for SPEAKING: short sentences, contractions, conversational rhythm. If a sentence has a subordinate clause, break it into two.

4. PRODUCT BRIDGE:
   - Must reference a SPECIFIC problem raised in the body. The viewer should already be thinking "I need to fix this" before the product appears.
   - If website content is available, use REAL feature names, real pricing, real value propositions from the scraped page. Never invent features.
   - NEVER use hype: no "amazing," "incredible," "game-changer." Just: what it does, who it's for, what result it produces.
   - Write WORD FOR WORD.

5. CTA (final 15-20 seconds):
   - One clear action. Infer the right CTA from the website's buttons if available. Otherwise infer from the product type:
     SaaS/app → "start a free trial" or "sign up free"
     Service/agency/consulting → "book a call" or "book a demo"
     Course/education → "enroll now" or "join the program"
     Lead magnet → "download the [specific resource]"
   - Reference the viewer's situation: "If you're a [target customer] evaluating [topic] right now, here's how to get started."
   - Mention "the link is in the description below."
   - Write WORD FOR WORD.

6. SPOKEN LANGUAGE RULES (entire script):
   - Every sentence must sound natural when read aloud by a voiceover artist.
   - Maximum 20 words per sentence.
   - Use contractions: "you'll" not "you will," "here's" not "here is."
   - No jargon unless the target audience uses it daily.
   - No filler: remove "basically," "actually," "essentially," "in order to," "it's important to note that."
   - Vary sentence length. Short punchy statements alternating with slightly longer explanatory sentences.
   - Include 2-3 rhetorical questions throughout: "So what does this actually mean for your bottom line?"

7. LENGTH:
   - Spoken rate: 150 words per minute.
   - Target: ${config.targetWords[0]}-${config.targetWords[1]} words (${config.targetMinutes} minutes).
   - Hit the range with substance. No padding or filler sections.

8. FULL SCRIPT TEXT:
   - Assemble the ENTIRE script as one continuous prose block: Hook, Setup, Body points with transitions, Product Bridge, CTA.
   - Copy-paste ready for teleprompter or voiceover. No section headers, no brackets, no stage directions, no bullet points. Just flowing spoken text.

Respond ONLY with valid JSON. No preamble, no markdown fences.`;
}

function buildUserPrompt(
  topic: string,
  videoType: string,
  targetCustomer: string,
  product: string,
  scraped: ScrapedContent | null
): string {
  const config = VIDEO_TYPE_CONFIG[videoType] || VIDEO_TYPE_CONFIG['how-to'];

  let websiteSection: string;
  if (scraped) {
    const parts = [
      `Website content (scraped from product URL):`,
      `- Page title: ${scraped.title}`,
      scraped.metaDescription ? `- Meta description: ${scraped.metaDescription}` : '',
      scraped.headings.length ? `- Key headings: ${scraped.headings.join(' | ')}` : '',
      `- Body text excerpt: ${scraped.bodyText}`,
      scraped.pricingMentions.length ? `- Pricing found: ${scraped.pricingMentions.join(' | ')}` : '',
      scraped.ctaButtons.length ? `- CTA buttons on page: ${scraped.ctaButtons.join(' | ')}` : '',
      '',
      'URL scraped successfully. Use REAL features, pricing, and CTAs from the website. Do NOT invent features.',
    ];
    websiteSection = parts.filter(Boolean).join('\n');
  } else {
    websiteSection =
      'No website URL provided or scraping failed. Infer the CTA from the product description (SaaS/app → free trial, service → book a call, course → enroll, lead magnet → download).';
  }

  return `Write a complete YouTube video script.

Video topic: ${topic}
Video type: ${videoType}
Target customer: ${targetCustomer}
Product/service: ${product}

${websiteSection}

Video type guidance: ${config.guidance}

Target length: ${config.targetWords[0]}-${config.targetWords[1]} words (${config.targetMinutes} minutes).

Return this exact JSON structure:
{
  "script_metadata": {
    "video_type": "${videoType}",
    "target_length_words": <number>,
    "target_duration_minutes": "${config.targetMinutes}",
    "target_keyword_suggestion": "<buyer-intent search query this video should rank for>"
  },
  "hook": {
    "writing_mode": "word_for_word",
    "duration_seconds": "0-15",
    "content": "<complete hook, every word scripted>"
  },
  "setup": {
    "writing_mode": "word_for_word",
    "duration_seconds": "15-45",
    "content": "<why this matters now, every word scripted>"
  },
  "body_sections": [
    {
      "section_number": 1,
      "title": "<point title>",
      "writing_mode": "prose",
      "content": "<full prose — WHAT, WHY, HOW with a concrete example, written as complete spoken sentences>",
      "transition_to_next": "<transition sentence to the next point>"
    }
  ],
  "product_bridge": {
    "writing_mode": "word_for_word",
    "duration_seconds": "30-60",
    "problem_it_solves": "<which body problem this addresses>",
    "content": "<product bridge, every word scripted>"
  },
  "cta": {
    "writing_mode": "word_for_word",
    "duration_seconds": "15-20",
    "action": "<the single action: book a demo, start trial, etc.>",
    "content": "<complete CTA, every word scripted>"
  },
  "full_script_text": "<entire script as one continuous prose block — hook, setup, all body points with transitions, product bridge, CTA. No headers. No bullets. Flowing spoken text ready for teleprompter or voiceover.>",
  "word_count": <number>,
  "estimated_duration_minutes": <number>
}`;
}

// --- Handler ---

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

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { topic, videoType, targetCustomer, product, websiteUrl } = body;

    if (!topic?.trim() || !videoType?.trim() || !targetCustomer?.trim() || !product?.trim()) {
      return new Response(
        JSON.stringify({ error: 'topic, videoType, targetCustomer, and product are required' }),
        { status: 400, headers }
      );
    }

    const MAX_LEN = 500;
    if (topic.trim().length > MAX_LEN || targetCustomer.trim().length > MAX_LEN || product.trim().length > MAX_LEN) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const validTypes = ['comparison', 'how-to', 'mistakes', 'results'];
    if (!validTypes.includes(videoType.trim())) {
      return new Response(
        JSON.stringify({ error: 'Invalid videoType. Must be one of: comparison, how-to, mistakes, results' }),
        { status: 400, headers }
      );
    }

    let urlToScrape: string | null = null;
    if (websiteUrl?.trim()) {
      const url = websiteUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        return new Response(JSON.stringify({ error: 'URL must start with http:// or https://' }), {
          status: 400,
          headers,
        });
      }
      if (/youtube\.com|youtu\.be/i.test(url)) {
        return new Response(
          JSON.stringify({ error: 'Please enter your website or product page URL, not a YouTube link' }),
          { status: 400, headers }
        );
      }
      if (url.length > 2000) {
        return new Response(JSON.stringify({ error: 'URL exceeds maximum length' }), { status: 400, headers });
      }
      urlToScrape = url;
    }

    // Scrape URL
    let scraped: ScrapedContent | null = null;
    if (urlToScrape) {
      scraped = await scrapeUrl(urlToScrape);
    }

    const systemInstruction = buildSystemInstruction(videoType.trim());
    const userPrompt = buildUserPrompt(topic.trim(), videoType.trim(), targetCustomer.trim(), product.trim(), scraped);

    const geminiBody = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.8,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }
      return new Response(
        JSON.stringify({
          error: 'AI service unavailable',
          geminiStatus: geminiRes.status,
          detail: errText.slice(0, 500),
        }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();

    const blockReason = geminiData?.promptFeedback?.blockReason;
    if (blockReason) {
      return new Response(
        JSON.stringify({ error: 'Content blocked by safety filter', detail: blockReason }),
        { status: 500, headers }
      );
    }

    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!raw) {
      return new Response(JSON.stringify({ error: 'Empty response from AI' }), { status: 500, headers });
    }

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    let result: Record<string, unknown>;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed on first attempt, retrying...');
      const retryRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({ ...geminiBody, generationConfig: { ...geminiBody.generationConfig, temperature: 0.6 } }),
      });

      if (!retryRes.ok) {
        return new Response(
          JSON.stringify({ error: 'Script generation failed', detail: 'json_parse_failure' }),
          { status: 500, headers }
        );
      }

      const retryData = await retryRes.json();
      const retryRaw = retryData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const retryCleaned = retryRaw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();

      try {
        result = JSON.parse(retryCleaned);
      } catch {
        return new Response(
          JSON.stringify({ error: 'Script generation failed', detail: 'json_parse_failure_after_retry' }),
          { status: 500, headers }
        );
      }
    }

    const r = result as Record<string, unknown>;
    const hook = r.hook as Record<string, unknown> | undefined;
    const setup = r.setup as Record<string, unknown> | undefined;
    const bodySections = r.body_sections as unknown[] | undefined;
    const productBridge = r.product_bridge as Record<string, unknown> | undefined;
    const cta = r.cta as Record<string, unknown> | undefined;

    if (
      !hook?.content ||
      !setup?.content ||
      !Array.isArray(bodySections) ||
      bodySections.length === 0 ||
      !productBridge?.content ||
      !cta?.content ||
      !r.full_script_text
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid script structure from AI', detail: 'missing_required_fields' }),
        { status: 500, headers }
      );
    }

    (r as Record<string, unknown>).url_scraped = !!scraped;

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error('generate-script error:', error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return new Response(JSON.stringify({ error: 'AI service timed out. Please try again.' }), {
        status: 503,
        headers,
      });
    }
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error).slice(0, 500) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-script',
};
