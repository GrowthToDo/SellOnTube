"use client";

import { useState } from "react";
import UTMCopy from "./UTMCopy";
import OpportunityBar from "./OpportunityBar";
import CompetitorPanel from "./CompetitorPanel";
import type { CompetitorVideo } from "@/lib/opportunity";

interface KeywordRow {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  change: number | null;
  ytViews: number | null;
  sessions: number | null;
  signups: number | null;
  utmLink: string | null;
  competitors: CompetitorVideo[];
}

interface KeywordTableProps {
  rows: KeywordRow[];
  onDelete: (keyword: string) => void;
  checking: boolean;
  checkProgress: { current: number; total: number } | null;
}

function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">NEW</span>;
  }
  if (change > 0) {
    return <span className="text-green-600 text-sm font-medium">&#8593;{change}</span>;
  }
  if (change < 0) {
    return <span className="text-red-500 text-sm font-medium">&#8595;{Math.abs(change)}</span>;
  }
  return <span className="text-gray-400 text-sm">&mdash;</span>;
}

export default function KeywordTable({ rows, onDelete, checking, checkProgress }: KeywordTableProps) {
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  if (rows.length === 0) {
    return null;
  }

  function toggleExpand(keyword: string) {
    setExpandedKeyword((prev) => (prev === keyword ? null : keyword));
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Keyword Rankings</h2>
        {checking && checkProgress && (
          <span className="text-xs text-blue-600 font-medium">
            Checking {checkProgress.current} of {checkProgress.total}...
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="w-8 px-2 py-3"></th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Video</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="text-center px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Opp.</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">YT Views</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Signups</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">UTM</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedKeyword === row.keyword;
              const hasCompetitors = row.competitors.length > 0;

              return (
                <tr key={row.keyword} className="group/row contents">
                  <td
                    colSpan={11}
                    className="p-0"
                  >
                    <div
                      className={`flex items-center transition-colors duration-150 ${
                        isExpanded ? "bg-gray-50" : "hover:bg-gray-50/50"
                      } ${hasCompetitors ? "cursor-pointer" : ""}`}
                      onClick={() => hasCompetitors && toggleExpand(row.keyword)}
                    >
                      <div className="w-8 flex-none flex items-center justify-center px-2 py-3">
                        {hasCompetitors ? (
                          <svg
                            className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        ) : (
                          <span className="w-3.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-[140px] px-4 py-3 font-medium text-gray-900 truncate">
                        {row.keyword}
                      </div>

                      <div className="flex-1 min-w-[160px] max-w-[200px] px-4 py-3 text-gray-600 truncate">
                        {row.videoId ? (
                          <a
                            href={`https://youtube.com/watch?v=${row.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.videoTitle || row.videoId}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not ranked</span>
                        )}
                      </div>

                      <div className="flex-none w-16 px-3 py-3 text-center">
                        {row.rank ? (
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                            {row.rank}
                          </span>
                        ) : (
                          <span className="text-gray-400">&mdash;</span>
                        )}
                      </div>

                      <div className="flex-none w-16 px-3 py-3 text-center">
                        <ChangeIndicator change={row.change} />
                      </div>

                      <div className="flex-none w-14 px-2 py-3 flex items-center justify-center">
                        <OpportunityBar competitors={row.competitors} />
                      </div>

                      <div className="flex-none w-20 px-3 py-3 text-right text-gray-600">
                        {row.ytViews !== null ? row.ytViews.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      <div className="flex-none w-20 px-3 py-3 text-right text-gray-600">
                        {row.sessions !== null ? row.sessions.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      <div className="flex-none w-20 px-3 py-3 text-right text-gray-600">
                        {row.signups !== null ? row.signups.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      <div className="flex-none w-16 px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {row.utmLink ? <UTMCopy url={row.utmLink} /> : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      <div className="flex-none w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onDelete(row.keyword)}
                          className="opacity-0 group-hover/row:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                          title="Remove keyword"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-150 ease-out ${
                        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {isExpanded && (
                        <CompetitorPanel
                          competitors={row.competitors}
                          isRanked={row.rank !== null}
                        />
                      )}
                    </div>

                    <div className="border-b border-gray-100" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { KeywordRow };
