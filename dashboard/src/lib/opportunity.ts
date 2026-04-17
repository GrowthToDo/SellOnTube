export interface CompetitorVideo {
  position: number;
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;
  isOwnVideo: boolean;
}

export type SignalColor = "green" | "amber" | "red";

export interface VideoSignal {
  color: SignalColor;
  label: string;
}

export interface KeywordOpportunity {
  score: number;
  total: number;
  color: SignalColor;
  signals: VideoSignal[];
}

export function getVideoSignal(viewCount: number, publishedAt: string): VideoSignal {
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30.44);

  if (viewCount < 5000) {
    return { color: "green", label: "Easy" };
  }
  if (viewCount < 10000 && ageMonths > 12) {
    return { color: "green", label: "Easy" };
  }
  if (viewCount < 10000 && ageMonths <= 12) {
    return { color: "amber", label: "New" };
  }
  if (viewCount >= 10000 && viewCount <= 50000 && ageMonths > 18) {
    return { color: "amber", label: "Stale" };
  }
  if (viewCount >= 10000 && viewCount <= 50000 && ageMonths <= 18) {
    return { color: "red", label: "Solid" };
  }
  if (viewCount > 50000 && ageMonths < 12) {
    return { color: "red", label: "Strong" };
  }
  return { color: "red", label: "Solid" };
}

export function getKeywordOpportunity(competitors: CompetitorVideo[]): KeywordOpportunity {
  const signals = competitors
    .filter((c) => !c.isOwnVideo)
    .map((c) => getVideoSignal(c.viewCount, c.publishedAt));

  const beatable = signals.filter((s) => s.color === "green" || s.color === "amber").length;
  const total = signals.length;

  let color: SignalColor = "red";
  if (beatable >= 4) color = "green";
  else if (beatable >= 2) color = "amber";

  return { score: beatable, total, color, signals };
}

export function formatAge(publishedAt: string): string {
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  const totalMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}mo`;
}

export function formatViewCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}
