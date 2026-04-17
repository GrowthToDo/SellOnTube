"use client";

import { useState, useRef } from "react";
import type { CompetitorVideo } from "@/lib/opportunity";
import { getKeywordOpportunity } from "@/lib/opportunity";

const SIGNAL_COLORS = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  neutral: "bg-gray-300",
};

interface OpportunityBarProps {
  competitors: CompetitorVideo[];
}

export default function OpportunityBar({ competitors }: OpportunityBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (competitors.length === 0) {
    return (
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[3px] h-4 rounded-[1px] bg-gray-200" />
        ))}
      </div>
    );
  }

  const opportunity = getKeywordOpportunity(competitors);

  const TOOLTIP_COLORS = {
    green: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <div
      ref={ref}
      className="relative inline-flex items-center gap-[2px] cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {opportunity.signals.map((signal, i) => (
        <div
          key={i}
          className={`w-[3px] h-4 rounded-[1px] transition-all duration-200 ${SIGNAL_COLORS[signal.color]}`}
          style={{ opacity: showTooltip ? 1 : 0.8 }}
        />
      ))}
      {Array.from({ length: Math.max(0, 5 - opportunity.signals.length) }).map((_, i) => (
        <div key={`pad-${i}`} className="w-[3px] h-4 rounded-[1px] bg-gray-200" />
      ))}

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 rounded-md shadow-lg whitespace-nowrap z-50">
          <span className={`text-xs font-semibold ${TOOLTIP_COLORS[opportunity.color]}`}>
            {opportunity.score}/{opportunity.total}
          </span>
          <span className="text-xs text-gray-400 ml-1">beatable</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
