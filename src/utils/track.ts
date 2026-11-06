/**
 * Tool error tracking for the /tools/* pages.
 *
 * Sends the page's EXISTING GA4 event name, so report history stays intact, and adds
 * four params: tool, reason, http_status, error_class. Event names are NOT renamed here.
 *
 * Sends through window.gtag only (installed by components/common/Analytics.astro).
 * Never touch window.dataLayer directly: gtag.js ignores GTM-style pushes.
 *
 * error_class values:
 *   validation  the visitor's input was rejected (4xx, malformed input, unknown channel/video)
 *   quota       our AI or vendor budget is exhausted (429, quota codes)
 *   upstream    our server or a vendor failed (5xx, 503)
 *   network     the request never got a response (offline, DNS, aborted)
 *   unknown     none of the above
 */

export type ToolErrorClass = 'validation' | 'quota' | 'upstream' | 'network' | 'unknown';

/** Existing event name per page. Anything not listed uses tool_generate_error. */
const EVENT_BY_TOOL: Record<string, string> = {
  'youtube-seo-tool': 'tool_analyse_error',
  'autocomplete-keywords': 'tool_cluster_fallback',
  'video-ideas-evaluator': 'tool_evaluate_error',
};
const DEFAULT_EVENT = 'tool_generate_error';

const QUOTA_REASONS = new Set(['quota_exceeded', 'budget_exhausted', 'rate_limited']);

/** Derive error_class when the caller does not pass one. */
export function classifyToolError(reason: string, status?: number): ToolErrorClass {
  if (status === 429 || QUOTA_REASONS.has(reason)) return 'quota';
  if (typeof status === 'number') {
    if (status >= 500) return 'upstream';
    if (status >= 400) return 'validation';
  }
  if (reason === 'network_error') return 'network';
  if (reason === 'upstream_unavailable') return 'upstream';
  if (reason === 'validation_failed') return 'validation';
  return 'unknown';
}

/** Event name used for a tool. Exported so a check can assert history is preserved. */
export function toolErrorEventName(tool: string): string {
  return EVENT_BY_TOOL[tool] ?? DEFAULT_EVENT;
}

export function trackToolError(
  tool: string,
  reason: string,
  status?: number,
  errorClass?: ToolErrorClass
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  // A non-HTTP throw that is not a network failure is a bug in our own page code, not a network
  // problem. Relabel the reason so it does not pollute the network_error count.
  if (reason === 'network_error' && errorClass === 'unknown') reason = 'client_error';
  const params: Record<string, string | number> = {
    tool,
    reason,
    error_class: errorClass ?? classifyToolError(reason, status),
  };
  if (typeof status === 'number') params.http_status = status;
  window.gtag('event', toolErrorEventName(tool), params);
}

/**
 * Error class for a failed fetch() that threw (no Response). A TypeError from fetch means the
 * network failed; anything else (for example our own JSON or structure check) is unknown.
 */
export function classifyThrown(err: unknown): ToolErrorClass {
  // fetch() rejects with a TypeError whose message is "Failed to fetch" (Chrome), "NetworkError
  // when attempting to fetch resource." (Firefox) or "Load failed" (Safari). A TypeError from our
  // own render code ("Cannot read properties of null") is not a network failure.
  return err instanceof TypeError && /fetch|network|load failed/i.test(err.message) ? 'network' : 'unknown';
}
