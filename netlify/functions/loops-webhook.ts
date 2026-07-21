import type { Handler } from '@netlify/functions';
import crypto from 'node:crypto';

// Loops webhook receiver: marks contacts as engaged (hasOpened) when they open or
// click any email. Powers the sunset email's audience filter ("hasOpened is not true")
// and newsletter exclusions, since Loops has no native "has not opened" filter.
// Loops signs webhooks in the standard webhook (Svix) format: the signed content is
// `${webhook-id}.${webhook-timestamp}.${rawBody}` with the base64 secret after "whsec_".

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const secret = process.env.LOOPS_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[loops-webhook] LOOPS_WEBHOOK_SECRET not configured');
    return { statusCode: 503, body: JSON.stringify({ error: 'Webhook not configured' }) };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';

  const msgId = event.headers['webhook-id'] || '';
  const timestamp = event.headers['webhook-timestamp'] || '';
  const sigHeader = event.headers['webhook-signature'] || '';

  // Reject stale timestamps (replay protection, 5 min window)
  const ts = parseInt(timestamp, 10);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Stale or missing timestamp' }) };
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const signedContent = `${msgId}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64');

  // Header may contain multiple space-separated signatures like "v1,<base64>"
  const valid = sigHeader.split(' ').some((part) => {
    const sig = part.split(',')[1] || '';
    return (
      sig.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    );
  });
  if (!valid) {
    console.error('[loops-webhook] Invalid webhook signature');
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  let body: { eventName?: string; type?: string; email?: string; contact?: { email?: string } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Loops' payload field for the event name is not firmly documented; accept both
  // common shapes and log anything unrecognized so a mismatch is visible in logs.
  const eventName = body.eventName || body.type || '';
  if (eventName !== 'email.opened' && eventName !== 'email.clicked') {
    console.log(`[loops-webhook] Ignored event '${eventName || 'UNKNOWN'}': ${rawBody.slice(0, 300)}`);
    return { statusCode: 200, body: JSON.stringify({ ok: true, ignored: eventName }) };
  }

  // Field name defensively resolved; log unknown shapes so we can adjust after first real event.
  const email = (body.email || body.contact?.email || '').trim().toLowerCase();
  if (!email) {
    console.error(`[loops-webhook] No email in ${eventName} payload: ${rawBody.slice(0, 500)}`);
    return { statusCode: 200, body: JSON.stringify({ ok: true, warning: 'no email in payload' }) };
  }

  const loopsApiKey = process.env.LOOPS_API_KEY;
  if (!loopsApiKey) {
    console.error('[loops-webhook] LOOPS_API_KEY not configured');
    return { statusCode: 503, body: JSON.stringify({ error: 'Loops not configured' }) };
  }

  try {
    const res = await fetch('https://app.loops.so/api/v1/contacts/update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${loopsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, hasOpened: true }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[loops-webhook] hasOpened update failed for ${email}: ${res.status} - ${text}`);
      return { statusCode: 503, body: JSON.stringify({ error: 'Upstream failure' }) };
    }
    console.log(`[loops-webhook] hasOpened set: ${email} (${eventName})`);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(`[loops-webhook] Network error: ${(err as Error).message}`);
    return { statusCode: 503, body: JSON.stringify({ error: 'Upstream failure' }) };
  }
};

export { handler };
