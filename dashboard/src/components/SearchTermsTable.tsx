interface SearchTerm {
  term: string;
  views: number;
}

export default function SearchTermsTable({ data }: { data: SearchTerm[] }) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Search Terms
        </h2>
        <p className="text-sm text-gray-400">No search term data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Search Terms
        </h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="px-5 py-2.5 font-medium">Keyword</th>
            <th className="px-5 py-2.5 font-medium text-right">Views</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.term} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-5 py-2.5 text-gray-700">{row.term}</td>
              <td className="px-5 py-2.5 text-right text-gray-900 font-medium tabular-nums">
                {row.views.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
