// scripts/x-agent/validate-x-post.js
// Pure mechanical assert for a repurposed X post. Returns {ok, reasons}.
// This stream is deliberately link-free: X suppresses reach on outbound links,
// and the whole point of the blog-repurpose stream is reach, not referral.

const BANNED = [
  "in today's", "in today's", 'game-chang', 'unlock the power',
  'here are 5', 'here are five', 'dive into', 'leverage', 'delve',
  'take your channel to the next level', 'the future is',
];
const URL_RE = /https?:\/\//i;
const DASH_RE = /[—–]/;
const X_LIMIT = 280;

export function validateXPost(post, recentHooks = []) {
  const reasons = [];
  const body = (post.xPost || '').trim();

  if (!body) {
    reasons.push('empty xPost');
  } else if (body.length > X_LIMIT) {
    reasons.push(`length ${body.length} exceeds ${X_LIMIT}`);
  }

  if (URL_RE.test(body)) reasons.push('contains a URL');
  if (DASH_RE.test(body)) reasons.push('contains em/en dash');

  const lower = body.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) reasons.push(`banned phrase: "${phrase}"`);
  }

  if (!post.sourceSlug) reasons.push('missing sourceSlug');

  // Weekday guard. Parse as UTC so the check never drifts with local timezone.
  const d = new Date(`${post.scheduledDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    reasons.push(`unparseable scheduledDate: ${post.scheduledDate}`);
  } else {
    const day = d.getUTCDay();
    if (day === 0 || day === 6) reasons.push(`scheduledDate falls on a weekend: ${post.scheduledDate}`);
  }

  const hook = body.split('\n')[0].trim();
  if (hook && recentHooks.some((h) => h.trim() === hook)) {
    reasons.push('dedup: hook already used in recent history');
  }

  return { ok: reasons.length === 0, reasons };
}
