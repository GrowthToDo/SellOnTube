"use client";

interface DeviceRow {
  device: string;
  views: number;
  percentage: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function DeviceChart({ data }: { data: DeviceRow[] }) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Devices
        </h2>
        <p className="text-sm text-gray-400">No device data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Devices
        </h2>
      </div>
      <div className="px-5 py-4 space-y-3">
        {data.map((row, i) => (
          <div key={row.device}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium">{row.device}</span>
              <span className="text-gray-500 tabular-nums">
                {row.views.toLocaleString()} ({row.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${row.percentage}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
