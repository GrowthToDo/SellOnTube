"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

export default function SubscriberChart({ data }: { data: DailyData[] }) {
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
          Subscriber Growth
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Daily new subscribers</p>
      </div>
      <div className="px-4 py-4" style={{ height: 220 }}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
                width={30}
                allowDecimals={false}
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
              <Bar
                dataKey="subscribersGained"
                fill="#10b981"
                radius={[3, 3, 0, 0]}
                name="Subscribers"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
