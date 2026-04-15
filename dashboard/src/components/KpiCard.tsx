const ACCENT_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  gray: "#6b7280",
};

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
}

export default function KpiCard({ label, value, subtitle, accent = "gray" }: KpiCardProps) {
  const borderColor = ACCENT_COLORS[accent] || ACCENT_COLORS.gray;

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-4xl font-semibold text-gray-900 tracking-tight">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
