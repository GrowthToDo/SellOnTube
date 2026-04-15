interface TopVideo {
  videoId: string;
  title: string;
  views: number;
  watchTimeMinutes: number;
  likes: number;
  comments: number;
  shares: number;
  avgRetention: number;
}

export default function TopVideosTable({ data }: { data: TopVideo[] }) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Top Videos
        </h2>
        <p className="text-sm text-gray-400">No video data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Top Videos
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="px-5 py-2.5 font-medium">Video</th>
              <th className="px-5 py-2.5 font-medium text-right">Views</th>
              <th className="px-5 py-2.5 font-medium text-right">Watch Time</th>
              <th className="px-5 py-2.5 font-medium text-right">Likes</th>
              <th className="px-5 py-2.5 font-medium text-right">Comments</th>
              <th className="px-5 py-2.5 font-medium text-right">Retention</th>
            </tr>
          </thead>
          <tbody>
            {data.map((video) => (
              <tr key={video.videoId} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-2.5 text-gray-700 max-w-xs truncate">
                  <a
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 hover:underline"
                  >
                    {video.title || video.videoId}
                  </a>
                </td>
                <td className="px-5 py-2.5 text-right text-gray-900 font-medium tabular-nums">
                  {video.views.toLocaleString()}
                </td>
                <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                  {Math.round(video.watchTimeMinutes).toLocaleString()}m
                </td>
                <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                  {video.likes.toLocaleString()}
                </td>
                <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                  {video.comments.toLocaleString()}
                </td>
                <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                  {video.avgRetention.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
