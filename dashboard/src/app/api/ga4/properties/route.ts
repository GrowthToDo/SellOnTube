import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listGA4Properties } from "@/lib/ga4";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const properties = await listGA4Properties((session as any).accessToken);
    return Response.json({ properties });
  } catch (err: any) {
    if (err.message === "scope_missing") {
      return Response.json({ error: "scope_missing" }, { status: 403 });
    }
    if (err.message === "api_not_enabled") {
      return Response.json(
        { error: "api_not_enabled", detail: "Google Analytics Admin API is not enabled in your Google Cloud project. Enable it at: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com" },
        { status: 403 }
      );
    }
    return Response.json(
      { error: "Failed to list GA4 properties", detail: err.message },
      { status: 503 }
    );
  }
}
