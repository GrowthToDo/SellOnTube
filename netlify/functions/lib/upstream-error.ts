// Classifies a thrown error as an upstream (third-party) failure or our own fault.
//
// Why this exists: on 2026-07-08 the transcript vendor's TLS handshake started failing.
// `fetch()` throws in that case rather than returning a non-ok response, so the throw landed
// in a catch-all that returned 500. The tool looked like OUR server was broken, and the
// outage went unnoticed for seven weeks while the page lost 28 ranking positions.
//
// A non-ok upstream response was already handled correctly as 503 everywhere. This closes the
// other half: a fetch that never completes at all is equally an upstream problem.
//
// Never return 502. Cloudflare replaces a 502 body with its own error page and hides the cause.

const UPSTREAM_CAUSE_CODES = new Set([
  'ENOTFOUND', // DNS: host does not resolve
  'EAI_AGAIN', // DNS: temporary resolution failure
  'ECONNREFUSED', // nothing listening
  'ECONNRESET', // peer dropped the connection
  'EPIPE',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EPROTO', // TLS/protocol failure — the 2026-07 transcript outage
  'ERR_TLS_CERT_ALTNAME_INVALID',
  'CERT_HAS_EXPIRED',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'ERR_SSL_WRONG_VERSION_NUMBER',
]);

function causeCodes(error: unknown, depth = 0): string[] {
  if (depth > 4 || !error || typeof error !== 'object') return [];
  const e = error as { code?: unknown; cause?: unknown };
  const own = typeof e.code === 'string' ? [e.code] : [];
  return [...own, ...causeCodes(e.cause, depth + 1)];
}

/**
 * True when the error means "we could not reach or complete a call to a third party",
 * as opposed to a bug in our own handler.
 */
export function isUpstreamError(error: unknown): boolean {
  if (!error) return false;

  // AbortSignal.timeout() and manual aborts
  const name = (error as { name?: unknown }).name;
  if (name === 'TimeoutError' || name === 'AbortError') return true;

  // undici wraps every transport failure as `TypeError: fetch failed`, with the real
  // reason on `.cause`. Match the message too, so a genuine TypeError in our own code
  // (calling undefined, bad argument) still reports as 500.
  const message = String((error as { message?: unknown }).message ?? '');
  if (error instanceof TypeError && /fetch failed|network|socket/i.test(message)) return true;

  if (causeCodes(error).some((c) => UPSTREAM_CAUSE_CODES.has(c) || c.startsWith('UND_ERR_'))) {
    return true;
  }

  return false;
}

/**
 * Status to return for a caught error: 503 when a third party let us down, 500 when we did.
 */
export function statusForError(error: unknown): 503 | 500 {
  return isUpstreamError(error) ? 503 : 500;
}

/**
 * User-facing message matching the status. Kept vague on purpose: it is shown in the browser,
 * so it must not leak vendor names, hosts, or stack detail. The real cause goes to the logs.
 */
export function messageForError(error: unknown): string {
  return isUpstreamError(error)
    ? 'This tool is temporarily unavailable because an upstream service is not responding. Please try again later.'
    : 'Something went wrong. Please try again later.';
}

/**
 * Standard failure Response for a caught error.
 *
 * Upstream failures (dead vendor, DNS, TLS, timeout) become 503 with a message that says so.
 * Our own faults keep the caller's own message and stay 500. `detail` is preserved because
 * several tool pages already surface it, and it is what made the 2026-07 outage diagnosable.
 */
export function failureResponse(error: unknown, fallbackMessage: string, headers: Record<string, string>): Response {
  const upstream = isUpstreamError(error);
  return new Response(
    JSON.stringify({
      error: upstream ? messageForError(error) : fallbackMessage,
      detail: String(error),
    }),
    { status: upstream ? 503 : 500, headers }
  );
}
