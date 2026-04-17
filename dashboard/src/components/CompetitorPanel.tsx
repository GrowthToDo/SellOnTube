"use client";

import type { CompetitorVideo } from "@/lib/opportunity";
import { getVideoSignal, formatAge, formatViewCount } from "@/lib/opportunity";

const DOT_COLORS = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
};

const LABEL_COLORS = {
  green: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

interface CompetitorPanelProps {
  competitors: CompetitorVideo[];
  isRanked: boolean;
}

export default function CompetitorPanel({ competitors, isRanked }: CompetitorPanelProps) {
  return (
    <div className="bg-gray-950 rounded-lg mx-3 mb-3 p-1 shadow-inner overflow-hidden">
      <div className="divide-y divide-gray-800/50">
        {competitors.map((comp) => {
          const signal = getVideoSignal(comp.viewCount, comp.publishedAt);

          return (
            <div
              key={comp.videoId}
              className={`flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-900/50 ${
                comp.isOwnVideo ? "border-l-2 border-brand-500" : ""
              }`}
            >
              <span className="flex-none w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[11px] font-mono font-medium text-gray-400">
                {comp.position}
              </span>

              <div className="flex-1 min-w-0">
                <a
                  href={`https://youtube.com/watch?v=${comp.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-white hover:underline decoration-gray-600 underline-offset-2 truncate block transition-colors"
                >
                  {comp.title}
                </a>
                <span className="text-[11px] text-gray-600">
                  {comp.isOwnVideo ? (
                    <span className="text-brand-500 font-medium">Your video</span>
                  ) : (
                    comp.channelTitle
                  )}
                </span>
              </div>

              <div className="flex-none flex items-center gap-3 text-[12px] font-mono text-gray-500">
                <span className="w-16 text-right tabular-nums">{formatViewCount(comp.viewCount)}</span>
                <span className="text-gray-700">&middot;</span>
                <span className="w-14 text-right tabular-nums">{formatAge(comp.publishedAt)}</span>
                <span className="text-gray-700">&middot;</span>
                <span className="flex items-center gap-1.5 w-16">
                  <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[signal.color]}`} />
                  <span className={`text-[11px] font-medium ${LABEL_COLORS[signal.color]}`}>
                    {signal.label}
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        {!isRanked && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <span className="flex-none w-6 h-6 rounded-full bg-gray-800/50 flex items-center justify-center text-[11px] font-mono text-gray-600">
              &mdash;
            </span>
            <span className="text-sm text-gray-600 italic">
              Your channel is not in the top 20 for this keyword
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
