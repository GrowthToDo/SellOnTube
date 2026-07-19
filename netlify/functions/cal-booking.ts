import type { Handler } from '@netlify/functions';
import crypto from 'node:crypto';

// Cal.com webhook receiver: marks discovery-call bookers in Loops so they exit
// the nurture workflow (audience filter on bookedCall) and can trigger call flows.
// Cal.com signs the RAW request body with the webhook secret (HMAC-SHA256 hex,
// header x-cal-signature-256) — verify against the raw body, never re-serialized JSON.

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[cal-booking] CAL_WEBHOOK_SECRET not configured');
    return { statusCode: 503, body: JSON.stringify({ error: 'Webhook not configured' }) };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';

  const given = event.headers['x-cal-signature-256'] || '';
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (
    given.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  ) {
    console.error('[cal-booking] Invalid webhook signature');
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  let body: {
    triggerEvent?: string;
    payload?: {
      uid?: string;
      attendees?: Array<{ email?: string; name?: string }>;
    };
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // One subscription can carry multiple triggers; only new bookings enroll.
  // Reschedules fire BOOKING_RESCHEDULED and must not re-trigger call flows.
  if (body.triggerEvent !== 'BOOKING_CREATED') {
    return { statusCode: 200, body: JSON.stringify({ ok: true, ignored: body.triggerEvent }) };
  }

  // The booker is attendees[0]; organizer.email is our own calendar owner.
  const attendee = body.payload?.attendees?.[0];
  const email = typeof attendee?.email === 'string' ? attendee.email.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('[cal-booking] No valid attendee email in payload');
    return { statusCode: 400, body: JSON.stringify({ error: 'No attendee email' }) };
  }

  const loopsApiKey = process.env.LOOPS_API_KEY;
  if (!loopsApiKey) {
    console.error('[cal-booking] LOOPS_API_KEY not configured');
    return { statusCode: 503, body: JSON.stringify({ error: 'Loops not configured' }) };
  }

  const bookingUid = body.payload?.uid;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${loopsApiKey}`,
    'Content-Type': 'application/json',
  };
  // Cal.com delivery is at-least-once; the booking uid dedupes retries in Loops (24h window).
  if (bookingUid) headers['Idempotency-Key'] = bookingUid;

  try {
    const res = await fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        eventName: 'bookedCall',
        bookedCall: true,
        bookedCallAt: new Date().toISOString(),
      }),
    });

    // 409 = duplicate Idempotency-Key, i.e. a webhook retry we already handled.
    if (!res.ok && res.status !== 409) {
      const text = await res.text();
      console.error(`[cal-booking] Loops event failed for ${email}: ${res.status} - ${text}`);
      return { statusCode: 503, body: JSON.stringify({ error: 'Upstream failure' }) };
    }

    console.log(`[cal-booking] bookedCall marked: ${email} (booking: ${bookingUid || 'no-uid'})`);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(`[cal-booking] Network error: ${(err as Error).message}`);
    return { statusCode: 503, body: JSON.stringify({ error: 'Upstream failure' }) };
  }
};

export { handler };
