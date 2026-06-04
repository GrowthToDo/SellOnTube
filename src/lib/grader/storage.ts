// Persistent storage for report snapshots and analytics.
// Uses Netlify Blobs — no external services needed.
// No Astro imports — portable across Netlify Functions.

import { getStore } from '@netlify/blobs';

const REPORT_TTL_DAYS = 30;
const REPORT_STORE = 'grader-reports';
const ANALYTICS_STORE = 'grader-analytics';

function generateShortId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function buildReportId(handle: string): string {
  return `${handle}-${generateShortId()}`;
}

export function buildReportUrl(reportId: string): string {
  return `https://sellontube.com/shopify-app/tools/shopify-app-store-listing-grader/report/${reportId}`;
}

// ── Layer 1: Report Snapshots (30-day TTL) ──

export interface ReportSnapshot {
  reportId: string;
  reportUrl: string;
  createdAt: string;
  expiresAt: string;
  gradeResult: Record<string, unknown>;
}

export async function saveReport(reportId: string, gradeResult: Record<string, unknown>): Promise<ReportSnapshot> {
  const store = getStore(REPORT_STORE);
  const now = new Date();
  const expires = new Date(now.getTime() + REPORT_TTL_DAYS * 86_400_000);

  const snapshot: ReportSnapshot = {
    reportId,
    reportUrl: buildReportUrl(reportId),
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    gradeResult,
  };

  await store.setJSON(reportId, snapshot);
  return snapshot;
}

export async function getReport(reportId: string): Promise<ReportSnapshot | null> {
  const store = getStore(REPORT_STORE);
  try {
    const snapshot = await store.get(reportId, { type: 'json' }) as ReportSnapshot | null;
    if (!snapshot) return null;
    if (new Date(snapshot.expiresAt) < new Date()) {
      await store.delete(reportId);
      return null;
    }
    return snapshot;
  } catch {
    return null;
  }
}

// ── Layer 2: Analytics Database (permanent) ──

export interface AnalyticsRecord {
  reportId: string;
  timestamp: string;
  appName: string;
  appHandle: string;
  appUrl: string;
  developerName: string;
  category: string;
  rating: number;
  reviewCount: number;
  healthScore: number;
  grade: string;
  structuralScore: number;
  qualityScore: number;
  coherenceMultiplier: number;
  screenshotCount: number;
  hasVideo: boolean;
  hasFreeplan: boolean;
  builtForShopify: boolean;
  titleLength: number;
  introLength: number;
  descriptionLength: number;
  findingsCount: number;
  overridesCount: number;
  topIssue: string;
}

export async function saveAnalytics(record: AnalyticsRecord): Promise<void> {
  const store = getStore(ANALYTICS_STORE);
  const key = `${record.appHandle}-${Date.now()}`;
  await store.setJSON(key, record);

  // Update summary index (append)
  try {
    const existingIndex = await store.get('_index', { type: 'json' }) as AnalyticsRecord[] | null;
    const index = existingIndex || [];
    index.push(record);
    await store.setJSON('_index', index);
  } catch {
    await store.setJSON('_index', [record]);
  }
}

export async function getAnalyticsIndex(): Promise<AnalyticsRecord[]> {
  const store = getStore(ANALYTICS_STORE);
  try {
    const index = await store.get('_index', { type: 'json' }) as AnalyticsRecord[] | null;
    return index || [];
  } catch {
    return [];
  }
}
