"use client";

import type { CompetitorVideo } from "@/lib/opportunity";
import { getKeywordOpportunity, getSignalSummary } from "@/lib/opportunity";

const SIGNAL_COLORS = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
};

const SCORE_COLORS = {
  green: "text-emerald-600",
  amber: "text-amber-600",
  red: "text-red-500",
};

interface OpportunityBarProps {
  competitors: CompetitorVideo[];
}

export default function OpportunityBar({ competitors }: OpportunityBarProps) {
  if (competitors.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[3px] h-4 rounded-[1px] bg-gray-200" />
          ))}
        </div>
        <span className="text-[11px] text-gray-300">&mdash;</span>
      </div>
    );
  }

  const opportunity = getKeywordOpportunity(competitors);
  const summary = getSignalSummary(competitors);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[2px] flex-none">
        {opportunity.signals.map((signal, i) => (
          <div
            key={i}
            className={`w-[3px] h-4 rounded-[1px] ${SIGNAL_COLORS[signal.color]}`}
          />
        ))}
        {Array.from({ length: Math.max(0, 5 - opportunity.signals.length) }).map((_, i) => (
          <div key={`pad-${i}`} className="w-[3px] h-4 rounded-[1px] bg-gray-200" />
        ))}
      </div>
      <span className={`text-[11px] font-semibold tabular-nums flex-none ${SCORE_COLORS[opportunity.color]}`}>
        {opportunity.score}/{opportunity.total}
      </span>
      <span className="text-[10px] text-gray-400 truncate">
        {summary}
      </span>
    </div>
  );
}
