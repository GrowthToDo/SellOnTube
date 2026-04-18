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

  const sheetsCall = fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => console.error(`[sheets] Write failed: ${err.message}`));

  const loopsApiKey = process.env.LOOPS_API_KEY;
  const loopsCall = loopsApiKey
    ? fetch('https://app.loops.so/api/v1/contacts/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loopsApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'sellontube-tool',
          toolName: source,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error(`[loops] Contact create failed for ${email}: ${res.status} - ${text}`);
          } else {
            console.log(`[loops] Contact created/updated: ${email} (tool: ${source})`);
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
