import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/youtube";

const VALID_RANGES: Record<string, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
  "365d": 365,
};

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = request.nextUrl.searchParams.get("range") || "28d";
  const rangeDays = VALID_RANGES[range] || 28;

  try {
    const data = await fetchDashboardData(
      (session as any).accessToken,
      rangeDays
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Dashboard API error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data", detail: error.message },
      { status: 503 }
    );
  }
}
