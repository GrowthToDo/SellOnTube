import type { CompetitorVideo } from "./opportunity";

interface ChannelStats {
  videoCount: number;
  subscriberCount: number;
  viewCount: number;
}

interface AnalyticsData {
  views: number;
  likes: number;
  subscribersGained: number;
  averageViewDuration: number;
  watchTimeMinutes: number;
  videoCount: number;
  impressions: number;
  ctr: number;
  trafficSources: { source: string; views: number; percentage: number }[];
  searchTerms: { term: string; views: number }[];
  dailyViews: { date: string; views: number; watchTimeMinutes: number; subscribersGained: number }[];
  topVideos: { videoId: string; title: string; views: number; watchTimeMinutes: number; likes: number; comments: number; shares: number; avgRetention: number }[];
  geography: { country: string; views: number; percentage: number }[];
  deviceTypes: { device: string; views: number; percentage: number }[];
}

export async function getChannelStats(
  accessToken: string
): Promise<ChannelStats> {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`YouTube Data API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const stats = data.items?.[0]?.statistics;

  if (!stats) throw new Error("No channel found for this account");

  return {
    videoCount: parseInt(stats.videoCount || "0", 10),
    subscriberCount: parseInt(stats.subscriberCount || "0", 10),
    viewCount: parseInt(stats.viewCount || "0", 10),
  };
}

export async function getAnalytics(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{
  views: number;
  watchTimeMinutes: number;
  likes: number;
  subscribersGained: number;
  averageViewDuration: number;
}> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics:
      "views,estimatedMinutesWatched,likes,subscribersGained,averageViewDuration",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`YouTube Analytics API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const row = data.rows?.[0] || [0, 0, 0, 0, 0];

  return {
    views: row[0] || 0,
    watchTimeMinutes: Math.round(row[1] || 0),
    likes: row[2] || 0,
    subscribersGained: row[3] || 0,
    averageViewDuration: Math.round(row[4] || 0),
  };
}

export async function getTrafficSources(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{ source: string; views: number; percentage: number }[]> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views",
    dimensions: "insightTrafficSourceType",
    sort: "-views",
    maxResults: "10",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Traffic sources API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows: [string, number][] = data.rows || [];
  const totalViews = rows.reduce((sum, r) => sum + r[1], 0);

  const sourceLabels: Record<string, string> = {
    YT_SEARCH: "YouTube Search",
    EXT_URL: "External",
    RELATED_VIDEO: "Suggested Videos",
    YT_CHANNEL: "Channel Pages",
    YT_OTHER_PAGE: "Browse Features",
    NOTIFICATION: "Notifications",
    PLAYLIST: "Playlists",
    NO_LINK_OTHER: "Direct / Unknown",
    SUBSCRIBER: "Subscribers",
    ADVERTISING: "YouTube Ads",
    SHORTS: "Shorts Feed",
    YT_PLAYLIST_PAGE: "Playlist Page",
    END_SCREEN: "End Screens",
    ANNOTATION: "Cards & Annotations",
    CAMPAIGN_CARD: "Campaign Cards",
  };

  return rows.map(([source, views]) => ({
    source: sourceLabels[source] || source,
    views,
    percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
  }));
}

export async function getSearchTerms(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{ term: string; views: number }[]> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views",
    dimensions: "insightTrafficSourceDetail",
    filters: "insightTrafficSourceType==YT_SEARCH",
    sort: "-views",
    maxResults: "20",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Search terms API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows: [string, number][] = data.rows || [];

  return rows.map(([term, views]) => ({ term, views }));
}

export async function getDailyViews(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{ date: string; views: number; watchTimeMinutes: number; subscribersGained: number }[]> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views,estimatedMinutesWatched,subscribersGained",
    dimensions: "day",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Daily views API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows: [string, number, number, number][] = data.rows || [];

  return rows.map(([date, views, watchTime, subs]) => ({
    date,
    views: views || 0,
    watchTimeMinutes: Math.round(watchTime || 0),
    subscribersGained: subs || 0,
  }));
}

async function getVideoTitles(
  accessToken: string,
  videoIds: string[]
): Promise<Record<string, string>> {
  if (videoIds.length === 0) return {};

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(",")}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Video titles API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const titleMap: Record<string, string> = {};
  for (const item of data.items || []) {
    titleMap[item.id] = item.snippet?.title || "Untitled";
  }
  return titleMap;
}

export async function getTopVideos(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{ videoId: string; title: string; views: number; watchTimeMinutes: number; likes: number; comments: number; shares: number; avgRetention: number }[]> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views,estimatedMinutesWatched,likes,comments,shares,averageViewPercentage",
    dimensions: "video",
    sort: "-views",
    maxResults: "10",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Top videos API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows: [string, number, number, number, number, number, number][] = data.rows || [];

  const videoIds = rows.map((r) => r[0]);
  const titleMap = await getVideoTitles(accessToken, videoIds);

  return rows.map(([videoId, views, watchTime, likes, comments, shares, avgRetention]) => ({
    videoId,
    title: titleMap[videoId] || videoId,
    views: views || 0,
    watchTimeMinutes: Math.round(watchTime || 0),
    likes: likes || 0,
    comments: comments || 0,
    shares: shares || 0,
    avgRetention: Math.round((avgRetention || 0) * 100) / 100,
  }));
}

export async function getGeography(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{ country: string; views: number; percentage: number }[]> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views",
    dimensions: "country",
    sort: "-views",
    maxResults: "10",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Geography API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows: [string, number][] = data.rows || [];
  const totalViews = rows.reduce((sum, r) => sum + r[1], 0);

  const countryNames: Record<string, string> = {
    US: "United States",
    IN: "India",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    BR: "Brazil",
    JP: "Japan",
    MX: "Mexico",
    PH: "Philippines",
    ID: "Indonesia",
    KR: "South Korea",
  };

  return rows.map(([code, views]) => ({
    country: countryNames[code] || code,
    views,
    percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
  }));
}

export async function getDeviceTypes(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<{ device: string; views: number; percentage: number }[]> {
  const params = new URLSearchParams({
    ids: "channel==MINE",
    startDate,
    endDate,
    metrics: "views",
    dimensions: "deviceType",
    sort: "-views",
  });

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Device types API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows: [string, number][] = data.rows || [];
  const totalViews = rows.reduce((sum, r) => sum + r[1], 0);

  const deviceLabels: Record<string, string> = {
    MOBILE: "Mobile",
    DESKTOP: "Desktop",
    TABLET: "Tablet",
    TV: "Smart TV",
    GAME_CONSOLE: "Game Console",
    OTHER: "Other",
  };

  return rows.map(([device, views]) => ({
    device: deviceLabels[device] || "Other",
    views,
    percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
  }));
}

export async function fetchDashboardData(
  accessToken: string,
  rangeDays?: number
): Promise<AnalyticsData> {
  const endDate = new Date().toISOString().split("T")[0];
  const days = rangeDays || 28;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [channelStats, analytics, trafficSources, searchTerms, dailyViews, topVideos, geography, deviceTypes] =
    await Promise.all([
      getChannelStats(accessToken),
      getAnalytics(accessToken, startDate, endDate),
      getTrafficSources(accessToken, startDate, endDate),
      getSearchTerms(accessToken, startDate, endDate),
      getDailyViews(accessToken, startDate, endDate),
      getTopVideos(accessToken, startDate, endDate),
      getGeography(accessToken, startDate, endDate),
      getDeviceTypes(accessToken, startDate, endDate),
    ]);

  return {
    views: analytics.views,
    likes: analytics.likes,
    subscribersGained: analytics.subscribersGained,
    averageViewDuration: analytics.averageViewDuration,
    watchTimeMinutes: analytics.watchTimeMinutes,
    videoCount: channelStats.videoCount,
    impressions: 0,
    ctr: 0,
    trafficSources,
    searchTerms,
    dailyViews,
    topVideos,
    geography,
    deviceTypes,
  };
}

export async function getChannelId(accessToken: string): Promise<string> {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Channel ID API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const channelId = data.items?.[0]?.id;
  if (!channelId) throw new Error("No channel found for this account");
  return channelId;
}

async function getVideoStats(
  accessToken: string,
  videoIds: string[]
): Promise<Record<string, number>> {
  if (videoIds.length === 0) return {};

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return {};

  const data = await res.json();
  const views: Record<string, number> = {};

  for (const item of data.items || []) {
    views[item.id] = parseInt(item.statistics?.viewCount || "0", 10);
  }

  return views;
}

export async function checkKeywordRank(
  accessToken: string,
  keyword: string,
  channelId: string
): Promise<{
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  competitors: CompetitorVideo[];
}> {
  const params = new URLSearchParams({
    part: "snippet",
    q: keyword,
    type: "video",
    maxResults: "20",
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Search API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const items: any[] = data.items || [];

  let rank: number | null = null;
  let userVideoId: string | null = null;
  let userVideoTitle: string | null = null;

  for (let i = 0; i < items.length; i++) {
    if (items[i].snippet?.channelId === channelId) {
      rank = i + 1;
      userVideoId = items[i].id?.videoId || null;
      userVideoTitle = items[i].snippet?.title || null;
      break;
    }
  }

  const top5 = items.slice(0, 5);
  const videoIds = top5.map((item: any) => item.id?.videoId).filter(Boolean);
  const viewCounts = await getVideoStats(accessToken, videoIds);

  const competitors: CompetitorVideo[] = top5.map((item: any, i: number) => {
    const vid = item.id?.videoId || "";
    return {
      position: i + 1,
      videoId: vid,
      title: item.snippet?.title || "",
      channelTitle: item.snippet?.channelTitle || "",
      viewCount: viewCounts[vid] || 0,
      publishedAt: item.snippet?.publishedAt || "",
      isOwnVideo: item.snippet?.channelId === channelId,
    };
  });

  return { keyword, rank, videoId: userVideoId, videoTitle: userVideoTitle, competitors };
}
