// summarize-transcript.ts
//
// Competitor-research brief for a video the user just transcribed. Runs AFTER the transcript
// is on screen (the page calls it asynchronously), so a slow or failed summary never delays
// the transcript itself. Reads the transcript from the shared adapter (cache hit, zero vendor
// cost) and asks Gemini for a structured brief. Briefs are cached per video for 30 days.
import { failureResponse } from './lib/upstream-error.js';
import { getTranscript, toTimestampedText } from './lib/transcript.js';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const BRIEF_STORE = 'transcript-briefs-v2'; // v2: adds `structure`; v1 briefs are ignored
const BRIEF_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface ProductMention {
  timestamp: string; // "m:ss"
  text: string; // what was said, one sentence
}

interface Section {
  timestamp: string; // "m:ss"
  label: string; // what this part of the video does
}

interface Brief {
  oneLiner: string;
  hook: string;
  keyClaims: string[];
  structure: Section[];
  productMentions: ProductMention[];
  cta: string;
  targetBuyer: string;
}

const SYSTEM_INSTRUCTION = `You are a B2B marketing analyst. A user pasted a competitor's YouTube video transcript to reverse-engineer how it sells. Produce a short research brief. Be concrete and quote the transcript where useful. Never invent facts that are not in the transcript. Write in plain English, no marketing jargon, no em dashes.

Return JSON only:
{
  "oneLiner": "What this video is and who it is for, in one sentence.",
  "hook": "How the first 30 seconds try to keep the viewer watching. Quote or closely paraphrase.",
  "keyClaims": ["3 to 5 concrete claims, results, or arguments the video makes, each one sentence"],
  "structure": [{"timestamp": "m:ss", "label": "What this section of the video does, under 60 characters"}],
  "productMentions": [{"timestamp": "m:ss", "text": "What product/offer/service is mentioned and how it is framed. One sentence."}],
  "cta": "What the viewer is asked to do and when. Say 'None found' if there is no call to action.",
  "targetBuyer": "Who this video is trying to convince, in one sentence."
}

Rules:
- structure: 5 to 8 sections in order, from the video's opening to its close, one per topic shift. Use the [m:ss] timestamps from the transcript. Labels describe the job of the section (for example "Hook: $500 challenge", "Origin story", "Step 1: keyword buckets", "Pitch: Starter Story Build", "Closing CTA").
- productMentions: only real mentions of a product, company, offer, course, tool, or service (the creator's own or a sponsor). Use the [m:ss] timestamps from the transcript. 0 to 6 entries.
- keyClaims must be specific (numbers, names, methods), not generic.
- Keep every string under 220 characters.`;

function buildPrompt(title: string, channel: string, transcript: string): string {
  return `Video title: ${title}
Channel: ${channel}

Transcript with timestamps (may be truncated):
${transcript.slice(0, 24000)}

Produce the JSON brief.`;
}

async function briefRead(videoId: string): Promise<Brief | null> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const raw = await getStore(BRIEF_STORE).get(videoId);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { fetchedAt: number; brief: Brief };
    if (Date.now() - entry.fetchedAt > BRIEF_TTL_MS) return null;
    return entry.brief;
  } catch (e) {
    console.warn('brief cache read skipped:', String(e).slice(0, 200));
    return null;
  }
}

async function briefWrite(videoId: string, brief: Brief): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    await getStore(BRIEF_STORE).set(videoId, JSON.stringify({ fetchedAt: Date.now(), brief }));
  } catch (e) {
    console.warn('brief cache write skipped:', String(e).slice(0, 200));
  }
}

function asStringArray(v: unknown, max: number): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).slice(0, max) : [];
}

export default async (request: Request) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    console.error('GEMINI_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Summary service is not configured.' }), { status: 503, headers });
  }

  try {
    const body = await request.json();
    const videoId: string = typeof body?.videoId === 'string' ? body.videoId.trim() : '';
    if (!/^[\w-]{11}$/.test(videoId)) {
      return new Response(JSON.stringify({ error: 'videoId is required' }), { status: 400, headers });
    }

    const cached = await briefRead(videoId);
    if (cached) {
      return new Response(JSON.stringify({ videoId, brief: cached, cached: true }), { status: 200, headers });
    }

    const tx = await getTranscript(videoId);
    if (tx.status !== 'ok') {
      // The page only calls this after a transcript rendered, so this is rare: cache expired
      // and the vendor is down, or the video changed.
      const status = tx.status === 'unavailable' ? 422 : tx.status === 'quota' ? 429 : 503;
      return new Response(JSON.stringify({ error: 'Transcript is not available for a summary right now.' }), { status, headers });
    }

    const { transcript } = tx;
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: buildPrompt(transcript.title || videoId, transcript.channel || '', toTimestampedText(transcript.segments)) }] }],
        // Thinking tokens count toward this cap; 4096 leaves room for the JSON after thinking.
        generationConfig: { responseMimeType: 'application/json', temperature: 0.3, maxOutputTokens: 4096 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText.slice(0, 500));
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }
      return new Response(JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status }), { status: 503, headers });
    }

    const geminiData = await geminiRes.json();
    const raw: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!raw.trim()) {
      const finish = geminiData?.candidates?.[0]?.finishReason ?? 'unknown';
      console.error('Gemini returned no text. finishReason:', finish, JSON.stringify(geminiData).slice(0, 400));
      return new Response(JSON.stringify({ error: 'AI service returned no output.', detail: 'finishReason=' + finish }), { status: 503, headers });
    }

    const parsed = JSON.parse(raw) as Partial<Brief>;
    const brief: Brief = {
      oneLiner: typeof parsed.oneLiner === 'string' ? parsed.oneLiner : '',
      hook: typeof parsed.hook === 'string' ? parsed.hook : '',
      keyClaims: asStringArray(parsed.keyClaims, 6),
      structure: Array.isArray(parsed.structure)
        ? parsed.structure
            .filter((x): x is Section => !!x && typeof x.label === 'string' && typeof x.timestamp === 'string')
            .slice(0, 8)
        : [],
      productMentions: Array.isArray(parsed.productMentions)
        ? parsed.productMentions
            .filter((m): m is ProductMention => !!m && typeof m.text === 'string' && typeof m.timestamp === 'string')
            .slice(0, 6)
        : [],
      cta: typeof parsed.cta === 'string' ? parsed.cta : '',
      targetBuyer: typeof parsed.targetBuyer === 'string' ? parsed.targetBuyer : '',
    };
    if (!brief.oneLiner && brief.keyClaims.length === 0) {
      throw new Error('Invalid response structure from Gemini');
    }

    await briefWrite(videoId, brief);
    return new Response(JSON.stringify({ videoId, brief, cached: false }), { status: 200, headers });
  } catch (error) {
    console.error('summarize-transcript error:', error);
    return failureResponse(error, 'Summary failed. The transcript above is unaffected.', headers);
  }
};

export const config = {
  path: '/api/summarize-transcript',
};
