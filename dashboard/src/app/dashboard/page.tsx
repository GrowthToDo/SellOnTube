"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import KpiCard from "@/components/KpiCard";
import ViewsChart from "@/components/ViewsChart";
import SubscriberChart from "@/components/SubscriberChart";
import TopVideosTable from "@/components/TopVideosTable";
import TrafficSourcesTable from "@/components/TrafficSourcesTable";
import SearchTermsTable from "@/components/SearchTermsTable";
import GeographyTable from "@/components/GeographyTable";
import DeviceChart from "@/components/DeviceChart";

interface DashboardData {
  views: number;
  likes: number;
  subscribersGained: number;
  averageViewDuration: number;
  watchTimeMinutes: number;
  videoCount: number;
  impressions: number;
  ctr: number;
  trafficSources: { source: string; views: number; percentage: number }[];
  searchTerms: { term: string; views: number }[];
  dailyViews: {
    date: string;
    views: number;
    watchTimeMinutes: number;
    subscribersGained: number;
  }[];
  topVideos: {
    videoId: string;
    title: string;
    views: number;
    watchTimeMinutes: number;
    likes: number;
    comments: number;
    shares: number;
    avgRetention: number;
  }[];
  geography: { country: string; views: number; percentage: number }[];
  deviceTypes: { device: string; views: number; percentage: number }[];
}

const RANGES = [
  { key: "7d", label: "7 days" },
  { key: "28d", label: "28 days" },
  { key: "90d", label: "90 days" },
  { key: "365d", label: "12 months" },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function formatMinutes(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toLocaleString()}h ${m}m`;
  }
  return `${mins}m`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("28d");

  const fetchData = useCallback(
    (selectedRange: RangeKey) => {
      setLoading(true);
      setError(null);
      fetch(`/api/analytics?range=${selectedRange}`)
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(
              body.detail || body.error || "Failed to load data"
            );
          }
          return res.json();
        })
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetchData(range);
    }
  }, [status, router, range, fetchData]);

  function handleRangeChange(newRange: RangeKey) {
    setRange(newRange);
  }

  const rangeLabel = RANGES.find((r) => r.key === range)?.label || range;

  if (status === "loading" || (status === "authenticated" && loading && !data)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="h-8 w-8 mx-auto border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-sm text-center space-y-3">
          <p className="text-red-600 font-medium">Something went wrong</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={() => fetchData(range)}
            className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with range picker */}
      <div className="px-8 py-5 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Last {rangeLabel}
            {loading && data && (
              <span className="ml-2 text-blue-500">Updating...</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => handleRangeChange(r.key)}
              disabled={loading}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                range === r.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <KpiCard
            label="Views"
            value={formatNumber(data?.views || 0)}
            subtitle="Total video views"
            accent="blue"
          />
          <KpiCard
            label="Watch Time"
            value={formatMinutes(data?.watchTimeMinutes || 0)}
            subtitle="Total minutes watched"
            accent="violet"
          />
          <KpiCard
            label="Avg. Duration"
            value={formatDuration(data?.averageViewDuration || 0)}
            subtitle="Per view"
            accent="amber"
          />
          <KpiCard
            label="Likes"
            value={formatNumber(data?.likes || 0)}
            subtitle="Total likes"
            accent="rose"
          />
          <KpiCard
            label="Subscribers"
            value={`+${formatNumber(data?.subscribersGained || 0)}`}
            subtitle="New this period"
            accent="green"
          />
          <KpiCard
            label="Videos"
            value={data?.videoCount || 0}
            subtitle="Published total"
            accent="gray"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ViewsChart data={data?.dailyViews || []} />
          <SubscriberChart data={data?.dailyViews || []} />
        </div>

        {/* Top videos */}
        <TopVideosTable data={data?.topVideos || []} />

        {/* Traffic + Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficSourcesTable data={data?.trafficSources || []} />
          <SearchTermsTable data={data?.searchTerms || []} />
        </div>

        {/* Geography + Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GeographyTable data={data?.geography || []} />
          <DeviceChart data={data?.deviceTypes || []} />
        </div>
      </div>
    </>
  );
}
