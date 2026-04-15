interface GeoRow {
  country: string;
  views: number;
  percentage: number;
}

export default function GeographyTable({ data }: { data: GeoRow[] }) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Top Countries
        </h2>
        <p className="text-sm text-gray-400">No geography data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Top Countries
        </h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="px-5 py-2.5 font-medium">Country</th>
            <th className="px-5 py-2.5 font-medium text-right">Views</th>
            <th className="px-5 py-2.5 font-medium text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.country} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-5 py-2.5 text-gray-700">{row.country}</td>
              <td className="px-5 py-2.5 text-right text-gray-900 font-medium tabular-nums">
                {row.views.toLocaleString()}
              </td>
              <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                {row.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
