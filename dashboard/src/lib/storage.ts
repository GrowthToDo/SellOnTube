import type { CompetitorVideo } from "./opportunity";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export interface RankEntry {
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  checkedAt: string;
  competitors?: CompetitorVideo[];
}

export interface KeywordsData {
  schemaVersion: number;
  keywords: string[];
  history: Record<string, RankEntry[]>;
}

export interface GA4Config {
  schemaVersion: number;
  ga4PropertyId: string;
  conversionEvent: string;
  siteUrl: string;
  signupValue: number;
}

function getStorageKey(prefix: string, userId: string): string {
  return `sot_${prefix}_${userId}`;
}

function pruneHistory(entries: RankEntry[]): RankEntry[] {
  const cutoff = new Date(Date.now() - NINETY_DAYS_MS).toISOString();
  return entries.filter((e) => e.checkedAt >= cutoff);
}

export function loadKeywords(userId: string): KeywordsData {
  const key = getStorageKey("keywords", userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { schemaVersion: 1, keywords: [], history: {} };
    const data = JSON.parse(raw);
    if (data.schemaVersion !== 1) return { schemaVersion: 1, keywords: [], history: {} };
    return data;
  } catch {
    return { schemaVersion: 1, keywords: [], history: {} };
  }
}

export function saveKeywords(userId: string, data: KeywordsData): void {
  const pruned: KeywordsData = {
    ...data,
    history: Object.fromEntries(
      Object.entries(data.history).map(([kw, entries]) => [kw, pruneHistory(entries)])
    ),
  };
  const key = getStorageKey("keywords", userId);
  localStorage.setItem(key, JSON.stringify(pruned));
}

export function loadGA4Config(userId: string): GA4Config | null {
  const key = getStorageKey("ga4", userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.schemaVersion !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveGA4Config(userId: string, config: GA4Config): void {
  const key = getStorageKey("ga4", userId);
  localStorage.setItem(key, JSON.stringify(config));
}

export function slugifyKeyword(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateUTMLink(
  siteUrl: string,
  keyword: string,
  videoId: string
): string {
  const base = siteUrl.replace(/\/+$/, "");
  const campaign = slugifyKeyword(keyword);
  return `${base}?utm_source=youtube&utm_medium=video&utm_campaign=${campaign}&utm_content=${videoId}`;
}
