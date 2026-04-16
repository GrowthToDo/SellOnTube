"use client";

import KpiCard from "./KpiCard";

interface ROIScorecardProps {
  totalYTViews: number;
  sessionsFromYouTube: number;
  signupsFromYouTube: number;
  signupValue: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function ROIScorecard({
  totalYTViews,
  sessionsFromYouTube,
  signupsFromYouTube,
  signupValue,
}: ROIScorecardProps) {
  const revenueValue = signupsFromYouTube * signupValue;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard
        label="YT Views"
        value={formatNumber(totalYTViews)}
        subtitle="From tracked keywords"
        accent="blue"
      />
      <KpiCard
        label="Site Sessions"
        value={formatNumber(sessionsFromYouTube)}
        subtitle="From YouTube"
        accent="violet"
      />
      <KpiCard
        label="Signups"
        value={formatNumber(signupsFromYouTube)}
        subtitle="From YouTube"
        accent="green"
      />
      <KpiCard
        label="Revenue Value"
        value={`$${formatNumber(revenueValue)}`}
        subtitle={`${signupsFromYouTube} x $${signupValue}`}
        accent="amber"
      />
    </div>
  );
}
