import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getChannelId, checkKeywordRank } from "@/lib/youtube";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const accessToken = (session as any).accessToken;
  const body = await request.json();
  const keywords: string[] = body.keywords || [];

  if (keywords.length === 0) {
    return new Response(JSON.stringify({ error: "No keywords provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (keywords.length > 50) {
    return new Response(JSON.stringify({ error: "Maximum 50 keywords allowed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let channelId: string;
  try {
    channelId = await getChannelId(accessToken);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Failed to get channel ID", detail: err.message }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < keywords.length; i++) {
        try {
          const result = await checkKeywordRank(accessToken, keywords[i], channelId);
          const data = JSON.stringify({ ...result, index: i, total: keywords.length });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (err: any) {
          const errorData = JSON.stringify({
            keyword: keywords[i],
            error: err.message,
            index: i,
            total: keywords.length,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        }

        if (i < keywords.length - 1) {
          await sleep(200);
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
