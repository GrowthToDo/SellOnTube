import { generateFixPlan } from '../../src/lib/grader/analyzer.js';
import {
  EMAIL_RATE_PER_DAY,
  PERSONAL_EMAIL_DOMAINS,
  type Finding,
} from '../../src/lib/grader/config.js';

// In-memory rate limit + lead log (v1; upgrade to KV for production)
const emailRateMap = new Map<string, { count: number; resetAt: number }>();
const leadLog: Array<{ ts: string; email: string; appName: string; ip: string }> = [];

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isBusinessEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
}

function checkEmailRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = emailRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    emailRateMap.set(ip, { count: 1, resetAt: now + 86_400_000 });
    return true;
  }
  if (entry.count >= EMAIL_RATE_PER_DAY) return false;
  entry.count++;
  return true;
}

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

  try {
    const body = await request.json();
    const { email, findings, appName } = body as {
      email: string;
      findings: Finding[];
      appName: string;
    };

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers }
      );
    }

    if (!isBusinessEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a business email address (not Gmail, Yahoo, etc.).' }),
        { status: 400, headers }
      );
    }

    if (!findings || !Array.isArray(findings) || findings.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No findings data provided.' }),
        { status: 400, headers }
      );
    }

    // Rate limit
    const ip = getClientIp(request);
    if (!checkEmailRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Daily email limit reached. Check back tomorrow.' }),
        { status: 429, headers }
      );
    }

    // Generate fix plan via AI
    const fixPlan = await generateFixPlan(findings, appName || 'Your App');

    if (!fixPlan) {
      return new Response(
        JSON.stringify({
          error: 'Could not generate the fix plan right now. Please try again in a moment.',
        }),
        { status: 503, headers }
      );
    }

    // Log the lead (v1: in-memory; later: KV or database)
    leadLog.push({
      ts: new Date().toISOString(),
      email,
      appName: appName || 'unknown',
      ip,
    });

    // Log to console for Netlify function logs
    console.log(`[lead] ${new Date().toISOString()} | ${email} | ${appName} | ${ip}`);

    // v1: Return the fix plan directly (no email sending yet — Resend not wired)
    // When Resend is set up, this will also email the plan to the submitted address
    return new Response(
      JSON.stringify({
        ok: true,
        fixPlan,
        message: 'Your fix plan is ready.',
      }),
      { status: 200, headers }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.', detail: msg }),
      { status: 503, headers }
    );
  }
};
