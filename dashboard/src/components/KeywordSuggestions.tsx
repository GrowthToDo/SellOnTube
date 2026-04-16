"use client";

interface KeywordSuggestionsProps {
  searchTerms: { term: string; views: number }[];
  trackedKeywords: string[];
  onAdd: (keyword: string) => void;
}

export default function KeywordSuggestions({ searchTerms, trackedKeywords, onAdd }: KeywordSuggestionsProps) {
  const trackedSet = new Set(trackedKeywords.map((k) => k.toLowerCase()));
  const suggestions = searchTerms
    .filter((t) => !trackedSet.has(t.term.toLowerCase()))
    .slice(0, 10);

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Suggested Keywords</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          People found your channel by searching these terms. Track them?
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {suggestions.map((s) => (
          <div key={s.term} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
            <div>
              <span className="text-sm text-gray-900">{s.term}</span>
              <span className="ml-2 text-xs text-gray-400">{s.views.toLocaleString()} views</span>
            </div>
            <button
              onClick={() => onAdd(s.term)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              + Track
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
