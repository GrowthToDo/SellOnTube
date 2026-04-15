import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const feedback = {
    timestamp: new Date().toISOString(),
    user: session?.user?.email || "anonymous",
    category: body.category || "other",
    message: body.message || "",
    contactEmail: body.email || null,
  };

  // Log to server console (visible in Netlify function logs)
  console.log("[FEEDBACK]", JSON.stringify(feedback));

  return NextResponse.json({ success: true });
}
