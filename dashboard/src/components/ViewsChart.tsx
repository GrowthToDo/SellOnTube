"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DailyData {
  date: string;
  views: number;
  watchTimeMinutes: number;
  subscribersGained: number;
}

export default function ViewsChart({ data }: { data: DailyData[] }) {
  // Format dates for display (e.g., "Apr 1")
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Views Over Time
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Last 28 days</p>
      </div>
      <div className="px-4 py-4" style={{ height: 280 }}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#fff",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#viewsGradient)"
                name="Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
