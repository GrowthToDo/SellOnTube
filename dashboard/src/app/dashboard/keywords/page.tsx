"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import KeywordTable, { KeywordRow } from "@/components/KeywordTable";
import KeywordSuggestions from "@/components/KeywordSuggestions";
import ROIScorecard from "@/components/ROIScorecard";
import GA4Setup from "@/components/GA4Setup";
import {
  loadKeywords,
  saveKeywords,
  loadGA4Config,
  GA4Config,
  RankEntry,
  slugifyKeyword,
  generateUTMLink,
} from "@/lib/storage";
import type { CompetitorVideo } from "@/lib/opportunity";

interface RankResult {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  competitors: CompetitorVideo[];
}

interface GA4ChannelTotals {
  totalSessions: number;
  totalKeyEvents: number;
  byCampaign: Record<string, { sessions: number; keyEvents: number }>;
}

export default function KeywordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [newKeyword, setNewKeyword] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState<{ current: number; total: number } | null>(null);
  const [searchTerms, setSearchTerms] = useState<{ term: string; views: number }[]>([]);
  const [ga4Config, setGA4Config] = useState<GA4Config | null>(null);
  const [ga4Data, setGA4Data] = useState<GA4ChannelTotals | null>(null);
  const [showGA4Setup, setShowGA4Setup] = useState(false);

  // Keywords state from localStorage
  const [keywords, setKeywords] = useState<string[]>([]);
  const [history, setHistory] = useState<Record<string, RankEntry[]>>({});

  const userId = (session as any)?.userId || session?.user?.email || "";

  // Load keywords from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    const data = loadKeywords(userId);
    setKeywords(data.keywords);
    setHistory(data.history);

    const config = loadGA4Config(userId);
    setGA4Config(config);
    if (!config) setShowGA4Setup(true);
  }, [userId]);

  // Fetch search terms for suggestions
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/analytics?range=28d")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.searchTerms) setSearchTerms(data.searchTerms);
      })
      .catch(() => {});
  }, [status]);

  // Fetch GA4 data when config is available
  const fetchGA4Data = useCallback(() => {
    if (!ga4Config) return;
    const params = new URLSearchParams({
      propertyId: ga4Config.ga4PropertyId,
      conversionEvent: ga4Config.conversionEvent,
      range: "28d",
    });
    fetch(`/api/ga4/report?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setGA4Data(data);
      })
      .catch(() => {});
  }, [ga4Config]);

  useEffect(() => {
    fetchGA4Data();
  }, [fetchGA4Data]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  function addKeyword(kw: string) {
    const trimmed = kw.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed) || keywords.length >= 50) return;

    const updated = [...keywords, trimmed];
    setKeywords(updated);
    saveKeywords(userId, { schemaVersion: 1, keywords: updated, history });
    setNewKeyword("");
  }

  function deleteKeyword(kw: string) {
    const updated = keywords.filter((k) => k !== kw);
    const updatedHistory = { ...history };
    delete updatedHistory[kw];
    setKeywords(updated);
    setHistory(updatedHistory);
    saveKeywords(userId, { schemaVersion: 1, keywords: updated, history: updatedHistory });
  }

  async function checkAllRanks() {
    if (checking || keywords.length === 0) return;
    setChecking(true);
    setCheckProgress({ current: 0, total: keywords.length });

    try {
      const res = await fetch("/api/keywords/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });

      if (!res.ok) {
        setChecking(false);
        setCheckProgress(null);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";
      const newHistory = { ...history };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const match = line.match(/^data: (.+)$/);
          if (!match) continue;
          const payload = match[1].trim();
          if (payload === "[DONE]") continue;

          try {
            const result: RankResult & { index: number; total: number } = JSON.parse(payload);
            setCheckProgress({ current: result.index + 1, total: result.total });

            // Update history
            const entry: RankEntry = {
              rank: result.rank,
              videoId: result.videoId,
              videoTitle: result.videoTitle,
              checkedAt: new Date().toISOString(),
              competitors: result.competitors || [],
            };

            if (!newHistory[result.keyword]) {
              newHistory[result.keyword] = [];
            }
            newHistory[result.keyword] = [entry, ...newHistory[result.keyword]];
            setHistory({ ...newHistory });
          } catch {
            // Skip malformed SSE data
          }
        }
      }

      // Save to localStorage
      saveKeywords(userId, { schemaVersion: 1, keywords, history: newHistory });
    } finally {
      setChecking(false);
      setCheckProgress(null);
    }
  }

  // Build table rows
  function buildRows(): KeywordRow[] {
    return keywords.map((kw) => {
      const entries = history[kw] || [];
      const latest = entries[0] || null;
      const previous = entries[1] || null;

      let change: number | null = null;
      if (latest && previous && latest.rank !== null && previous.rank !== null) {
        change = previous.rank - latest.rank; // positive = improved
      } else if (latest && !previous) {
        change = null; // first check = "NEW"
      } else if (latest && latest.rank !== null && previous && previous.rank === null) {
        change = null; // was not ranked, now ranked = "NEW"
      }

      // Match search terms to get YT views
      const matchedTerm = searchTerms.find(
        (t) => t.term.toLowerCase() === kw.toLowerCase()
      );

      // Match GA4 data by campaign slug
      const slug = slugifyKeyword(kw);
      const ga4Campaign = ga4Data?.byCampaign?.[slug];

      // UTM link
      const utmLink =
        latest?.videoId && ga4Config?.siteUrl
          ? generateUTMLink(ga4Config.siteUrl, kw, latest.videoId)
          : null;

      return {
        keyword: kw,
        rank: latest?.rank || null,
        videoId: latest?.videoId || null,
        videoTitle: latest?.videoTitle || null,
        change,
        ytViews: matchedTerm?.views ?? null,
        sessions: ga4Campaign?.sessions ?? null,
        signups: ga4Campaign?.keyEvents ?? null,
        utmLink,
        competitors: latest?.competitors || [],
      };
    });
  }

  // Calculate scorecard totals
  const rows = buildRows();
  const totalYTViews = rows.reduce((sum, r) => sum + (r.ytViews || 0), 0);
  const sessionsFromYouTube = ga4Data?.totalSessions || 0;
  const signupsFromYouTube = ga4Data?.totalKeyEvents || 0;

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show GA4 setup if not configured
  if (showGA4Setup && !ga4Config) {
    return (
      <div className="px-8 py-12">
        <GA4Setup
          userId={userId}
          onComplete={(config) => {
            setGA4Config(config);
            setShowGA4Setup(false);
          }}
          onSkip={() => setShowGA4Setup(false)}
        />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Keyword Rankings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {keywords.length} keyword{keywords.length !== 1 ? "s" : ""} tracked
            {history[keywords[0]]?.[0]?.checkedAt && (
              <span className="ml-1">
                &middot; Last checked {new Date(history[keywords[0]]?.[0]?.checkedAt).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ga4Config && (
            <button
              onClick={() => setShowGA4Setup(true)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              GA4 Settings
            </button>
          )}
          <button
            onClick={checkAllRanks}
            disabled={checking || keywords.length === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {checking ? "Checking..." : "Check All Rankings"}
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* ROI Scorecard */}
        {ga4Config && (
          <ROIScorecard
            totalYTViews={totalYTViews}
            sessionsFromYouTube={sessionsFromYouTube}
            signupsFromYouTube={signupsFromYouTube}
            signupValue={ga4Config.signupValue}
          />
        )}

        {/* Add keyword input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword(newKeyword);
              }
            }}
            placeholder="Add a keyword (e.g. best crm for agencies)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            disabled={keywords.length >= 50}
          />
          <button
            onClick={() => addKeyword(newKeyword)}
            disabled={!newKeyword.trim() || keywords.length >= 50}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
        {keywords.length >= 50 && (
          <p className="text-xs text-amber-600">Maximum 50 keywords reached (API quota limit)</p>
        )}

        {/* Empty state */}
        {keywords.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-16 text-center">
            <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <p className="text-sm font-medium text-gray-900">Add keywords you want to rank for</p>
            <p className="text-xs text-gray-500 mt-1">
              We'll check where your videos appear in YouTube search results
            </p>
          </div>
        )}

        {/* Keyword Table */}
        <KeywordTable
          rows={rows}
          onDelete={deleteKeyword}
          checking={checking}
          checkProgress={checkProgress}
        />

        {/* Keyword Suggestions */}
        <KeywordSuggestions
          searchTerms={searchTerms}
          trackedKeywords={keywords}
          onAdd={addKeyword}
        />
      </div>
    </>
  );
}
