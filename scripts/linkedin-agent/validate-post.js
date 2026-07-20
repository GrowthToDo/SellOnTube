// scripts/linkedin-agent/validate-post.js
// Pure last-line assert for a generated LinkedIn post. Returns {ok, reasons}.
// This is the mechanical safety net behind hands-off publishing; the real
// quality work happens in generation (see docs/social-media/linkedin/).

const BANNED = [
  'in today’s', "in today's", 'game-chang', 'unlock the power',
  'here are 5', 'here are five', 'dive into', 'leverage', 'delve',
  'take your channel to the next level', 'the future is',
];
const URL_RE = /https?:\/\//i;
const DASH_RE = /[—–]/; // em dash, en dash

export function validatePost(post, recentHooks = []) {
  const reasons = [];
  const body = post.linkedinPost || '';
  const len = body.length;

  if (len < 900 || len > 1700) {
    reasons.push(`length ${len} outside 900-1700`);
  }
  if (DASH_RE.test(body)) {
    reasons.push('contains em/en dash');
  }
  const lower = body.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) { reasons.push(`banned phrase: "${phrase}"`); }
  }

  const hashtags = post.hashtags || [];
  if (hashtags.length > 3) {
    reasons.push(`hashtag count ${hashtags.length} > 3`);
  }

  const hasBodyUrl = URL_RE.test(body);
  const comment = post.firstComment || '';
  const hasComment = Boolean(comment);
  const commentHasUrl = URL_RE.test(comment);
  // The pinned first comment may carry the CTA link and/or a ChatGPT prompt.
  switch (post.linkLocation) {
    case 'comment':
      if (!hasComment) reasons.push('linkLocation=comment but firstComment missing');
      if (!commentHasUrl) reasons.push('linkLocation=comment but firstComment has no URL');
      if (hasBodyUrl) reasons.push('linkLocation=comment but body contains a URL');
      break;
    case 'body':
      // Link is in the body; a first comment here is a prompt (must carry no URL).
      if (!hasBodyUrl) reasons.push('linkLocation=body but body has no URL');
      if (commentHasUrl) reasons.push('linkLocation=body but firstComment also contains a URL');
      break;
    case null:
    case undefined:
      // No-link post; a first comment is allowed only as a prompt (no URL).
      if (hasBodyUrl) reasons.push('no-link post but body contains a URL');
      if (commentHasUrl) reasons.push('no-link post but firstComment contains a URL');
      break;
    default:
      reasons.push(`unknown linkLocation: ${post.linkLocation}`);
  }

  const hook = body.split('\n')[0].trim();
  if (hook && recentHooks.some((h) => h.trim() === hook)) {
    reasons.push('dedup: hook already used in recent history');
  }

  return { ok: reasons.length === 0, reasons };
}
