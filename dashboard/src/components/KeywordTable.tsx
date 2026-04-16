"use client";

import UTMCopy from "./UTMCopy";

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
  if (rows.length === 0) {
    return null;
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
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Video</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">YT Views</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Signups</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">UTM</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.keyword} className="hover:bg-gray-50/50 group">
                <td className="px-5 py-3 font-medium text-gray-900">{row.keyword}</td>
                <td className="px-5 py-3 text-gray-600 max-w-[200px] truncate">
                  {row.videoId ? (
                    <a
                      href={`https://youtube.com/watch?v=${row.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {row.videoTitle || row.videoId}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not ranked</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {row.rank ? (
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                      {row.rank}
                    </span>
                  ) : (
                    <span className="text-gray-400">&mdash;</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <ChangeIndicator change={row.change} />
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  {row.ytViews !== null ? row.ytViews.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  {row.sessions !== null ? row.sessions.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  {row.signups !== null ? row.signups.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  {row.utmLink ? <UTMCopy url={row.utmLink} /> : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => onDelete(row.keyword)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    title="Remove keyword"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { KeywordRow };
