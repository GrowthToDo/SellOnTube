import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGA4Report } from "@/lib/ga4";

const VALID_RANGES: Record<string, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
  "365d": 365,
};

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = request.nextUrl.searchParams.get("propertyId");
  const conversionEvent = request.nextUrl.searchParams.get("conversionEvent") || "sign_up";
  const range = request.nextUrl.searchParams.get("range") || "28d";

  if (!propertyId) {
    return Response.json({ error: "propertyId is required" }, { status: 400 });
  }

  const rangeDays = VALID_RANGES[range] || 28;
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  try {
    const report = await getGA4Report(
      (session as any).accessToken,
      propertyId,
      conversionEvent,
      startDate,
      endDate
    );
    return Response.json(report);
  } catch (err: any) {
    if (err.message === "scope_missing") {
      return Response.json({ error: "scope_missing" }, { status: 403 });
    }
    return Response.json(
      { error: "Failed to fetch GA4 report", detail: err.message },
      { status: 503 }
    );
  }
}
