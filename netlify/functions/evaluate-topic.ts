import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a YouTube content strategy expert specializing in B2B customer acquisition. You evaluate YouTube topics for their ability to attract buyers and generate qualified leads, not just views.

Always respond with valid JSON only. No markdown code fences, no explanation text — just the raw JSON object.`;

function buildPrompt(
  topic: string,
  targetCustomer: string,
  businessModel: string,
  product: string
): string {
  return `Evaluate this YouTube topic for customer acquisition potential:

Topic: "${topic}"
Target Customer: "${targetCustomer}"
Business Model: "${businessModel}"
${product ? `Product/Service: "${product}"` : ""}

Respond with this exact JSON structure:
{
  "evaluation": {
    "buyerIntent": "Low|Medium|High",
    "audienceRelevance": "Low|Medium|High",
    "problemProximity": "Low|Medium|High",
    "conversionOpportunity": "Weak|Moderate|Strong",
    "searchIntent": "Educational|Research|Problem Solving|Tool Evaluation|Purchase Decision"
  },
  "verdict": {
    "label": "Educational Topic|Research Topic|Buyer-Intent Topic",
    "acquisitionPotential": "Low|Moderate|High"
  },
  "explanation": "3-5 sentences explaining the verdict. Be specific — reference the topic, the viewer it actually attracts, how that compares to ${targetCustomer}, and whether the product can be introduced naturally.",
  "alternatives": [
    {
      "topic": "Specific, searchable alternative topic title",
      "explanation": "1-2 sentences on why this scores higher for ${targetCustomer}."
    }
  ]
}

Scoring criteria:
- Buyer Intent HIGH: topic contains signals like best / alternatives / comparison / vs / review / pricing / tutorial / setup / fix / mistakes / how to [do a specific thing] / cost
- Buyer Intent LOW: educational / overview / what is / history / theory / how it works / industry explanation
- Audience Relevance HIGH: the topic primarily attracts ${targetCustomer} as the searcher
- Audience Relevance LOW: the topic attracts a different audience (developers, hobbyists, general public) instead of ${targetCustomer}
- Problem Proximity HIGH: topic addresses an urgent, active problem ${targetCustomer} is trying to solve right now
- Problem Proximity LOW: conceptual, informational, or curiosity-driven — no immediate action implied
- Conversion Opportunity STRONG: the video can naturally demonstrate or recommend ${product || "the product/service"} as a direct solution
- Conversion Opportunity WEAK: the product fit would feel forced or the video does not reach a purchase-relevant conclusion
- Search Intent: classify the most likely reason someone searches this topic as Educational, Research, Problem Solving, Tool Evaluation, or Purchase Decision

For alternatives: generate exactly 4 specific, searchable topic titles that score High on Buyer Intent AND attract ${targetCustomer} AND allow natural demonstration of ${product || "the product/service"}. Each title must be realistic enough to use as an actual YouTube video title — not vague or generic.

Return ONLY the JSON object.`;
}

export default async (request: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await request.json();
    const { topic, targetCustomer, businessModel, product = "" } = body;

    if (!topic?.trim() || !targetCustomer?.trim() || !businessModel?.trim()) {
      return new Response(
        JSON.stringify({ error: "topic, targetCustomer, and businessModel are required" }),
        { status: 400, headers }
      );
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildPrompt(
            topic.trim(),
            targetCustomer.trim(),
            businessModel.trim(),
            product.trim()
          ),
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Strip markdown fences if Claude includes them despite instructions
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error("evaluate-topic error:", error);
    return new Response(
      JSON.stringify({ error: "Analysis failed. Please try again." }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/api/evaluate-topic",
};
