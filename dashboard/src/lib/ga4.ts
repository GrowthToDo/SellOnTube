export interface GA4Property {
  name: string;
  displayName: string;
}

export interface GA4ChannelTotals {
  totalSessions: number;
  totalKeyEvents: number;
  byCampaign: Record<string, { sessions: number; keyEvents: number }>;
}

export async function listGA4Properties(
  accessToken: string
): Promise<GA4Property[]> {
  const res = await fetch(
    "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    // Check if it's specifically a scope/permission issue vs API not enabled
    if (res.status === 403) {
      if (error.includes("accessNotConfigured") || error.includes("API has not been used")) {
        throw new Error("api_not_enabled");
      }
      throw new Error("scope_missing");
    }
    throw new Error(`GA4 Admin API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const properties: GA4Property[] = [];

  for (const account of data.accountSummaries || []) {
    for (const prop of account.propertySummaries || []) {
      properties.push({
        name: prop.property,
        displayName: prop.displayName || prop.property,
      });
    }
  }

  return properties;
}

export async function getGA4Report(
  accessToken: string,
  propertyId: string,
  conversionEvent: string,
  startDate: string,
  endDate: string
): Promise<GA4ChannelTotals> {
  const body = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: "sessionCampaignName" },
      { name: "sessionSource" },
      { name: "sessionMedium" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "keyEvents" },
    ],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "sessionSource",
              stringFilter: { matchType: "EXACT", value: "youtube" },
            },
          },
          {
            filter: {
              fieldName: "sessionMedium",
              stringFilter: { matchType: "EXACT", value: "video" },
            },
          },
        ],
      },
    },
  };

  const numericId = propertyId.replace("properties/", "");

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${numericId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (res.status === 403) {
    throw new Error("scope_missing");
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GA4 Data API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows = data.rows || [];

  let totalSessions = 0;
  let totalKeyEvents = 0;
  const byCampaign: Record<string, { sessions: number; keyEvents: number }> = {};

  for (const row of rows) {
    const campaign = row.dimensionValues?.[0]?.value || "(not set)";
    const sessions = parseInt(row.metricValues?.[0]?.value || "0", 10);
    const keyEvents = parseInt(row.metricValues?.[1]?.value || "0", 10);

    totalSessions += sessions;
    totalKeyEvents += keyEvents;

    if (campaign !== "(not set)") {
      byCampaign[campaign] = {
        sessions: (byCampaign[campaign]?.sessions || 0) + sessions,
        keyEvents: (byCampaign[campaign]?.keyEvents || 0) + keyEvents,
      };
    }
  }

  return { totalSessions, totalKeyEvents, byCampaign };
}
