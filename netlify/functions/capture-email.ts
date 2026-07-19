import type { Handler } from '@netlify/functions';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwNJSU1oWry-OSkFGit4OCs1f_0W6KX9K9WASHhah5ZXcDSxjZWUQ5Uw2S4PSSoZhgD/exec';

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const source = (payload.source as string) || 'unknown';

  // Human-readable tool names for email copy ({toolLabel} merge tag in Loops).
  // Keys match the `source` value each tool page / widget sends.
  const TOOL_LABELS: Record<string, string> = {
    'youtube-autocomplete-keywords': 'YouTube Autocomplete Keywords tool',
    'youtube-channel-audit': 'YouTube Channel Audit tool',
    'youtube-competitor-analysis': 'YouTube Competitor Analysis tool',
    'youtube-description-generator': 'YouTube Description Generator',
    'youtube-ranking-checker': 'YouTube Ranking Checker',
    'youtube-script-generator': 'YouTube Script Generator',
    'youtube-seo-tool': 'YouTube SEO tool',
    'youtube-tag-generator': 'YouTube Tag Generator',
    'youtube-title-generator': 'YouTube Title Generator',
    'youtube-transcript-generator': 'YouTube Transcript Generator',
    'youtube-video-ideas-evaluator': 'YouTube Video Idea Evaluator',
    'youtube-video-ideas-generator': 'YouTube Video Ideas Generator',
    'youtube-video-keyword-finder': 'YouTube Video Keyword Finder',
    'youtube-video-keyword-finder-csv': 'YouTube Video Keyword Finder',
    'roi-calculator': 'YouTube ROI Calculator',
    fab: 'YouTube keyword analysis offer',
    popup: 'YouTube ROI Calculator',
    'sticky-bar': 'YouTube keyword analysis offer',
  };
  const toolLabel = TOOL_LABELS[source] || 'YouTube tool';

  // Widget signups (homepage analysis offer etc.) never used a tool, so email 1's
  // "you just used our free X" would be false for them. They join the Loops audience
  // but are NOT enrolled in the nurture sequence; their promised follow-up is manual.
  const WIDGET_SOURCES = new Set(['fab', 'popup', 'sticky-bar']);
  const enrollInNurture = !WIDGET_SOURCES.has(source);

  const sheetsCall = fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => console.error(`[sheets] Write failed: ${err.message}`));

  const loopsApiKey = process.env.LOOPS_API_KEY;
  // Tool signups: events/send upserts the contact, sets contact properties (top-level
  // keys) and fires the nurture_start event that triggers the Loops nurture workflow.
  // Widget signups: contacts/update upserts into the audience without any event.
  const loopsEndpoint = enrollInNurture
    ? 'https://app.loops.so/api/v1/events/send'
    : 'https://app.loops.so/api/v1/contacts/update';
  const loopsBody: Record<string, unknown> = {
    email,
    source: 'sellontube-tool',
    toolName: source,
    toolLabel,
  };
  if (enrollInNurture) {
    loopsBody.eventName = 'nurture_start';
    loopsBody.cohort = 'live';
    loopsBody.eventProperties = { toolName: source, toolLabel };
  }
  const loopsCall = loopsApiKey
    ? fetch(loopsEndpoint, {
        method: enrollInNurture ? 'POST' : 'PUT',
        headers: {
          Authorization: `Bearer ${loopsApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loopsBody),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error(`[loops] ${enrollInNurture ? 'nurture_start event' : 'contact upsert'} failed for ${email}: ${res.status} - ${text}`);
          } else {
            console.log(`[loops] ${enrollInNurture ? 'Contact upserted + nurture_start fired' : 'Contact upserted (no nurture)'}: ${email} (source: ${source})`);
          }
        })
        .catch((err) => console.error(`[loops] Network error: ${err.message}`))
    : Promise.resolve();

  await Promise.allSettled([sheetsCall, loopsCall]);

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({ ok: true }),
  };
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

export { handler };
