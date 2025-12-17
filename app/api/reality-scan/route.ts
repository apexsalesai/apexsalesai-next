import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Force Node.js runtime (Edge runtime doesn't support node:http)
export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { claim, link } = await req.json();

    if (!claim) {
      return NextResponse.json(
        { error: "Claim is required" },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set!");
      return NextResponse.json(
        { error: "API configuration error - ANTHROPIC_API_KEY not set" },
        { status: 500 }
      );
    }

    console.log("Anthropic key loaded:", !!process.env.ANTHROPIC_API_KEY);
    console.log("Anthropic key prefix:", process.env.ANTHROPIC_API_KEY?.slice(0, 15));
    console.log("Requesting model:", process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20241022");

    const systemPrompt = `You are a neutral, institutional-grade fact verification system called ProofLayer.

Your role is to analyze claims using official sources and provide publication-ready verification.

CRITICAL OUTPUT RULES:
You MUST return valid JSON with this EXACT structure:
{
  "verificationId": "unique-id",
  "verdict": "true|false|misleading|inconclusive",
  "confidence": number (0-100),
  "summary": "One sentence executive summary",
  "bottomLine": "2-3 sentence executive summary for decision makers",
  "whatDataShows": ["fact 1", "fact 2", "fact 3"],
  "spreadFactors": ["reason 1", "reason 2"],
  "sources": {
    "tier1": [{"title": "", "url": "", "domain": "", "snippet": "", "tier": "tier1", "reason": ""}],
    "tier2": [],
    "tier3": []
  }
}

VERDICT LANGUAGE (use these exact terms):
- "true" → Claim is substantiated
- "false" → Claim is not supported by evidence
- "misleading" → Claim is contextually incomplete
- "inconclusive" → Insufficient data

CONFIDENCE RULES:
- 85-100%: Strong consensus from multiple Tier-1 sources
- 50-84%: Partial evidence or mixed source agreement
- 0-49%: Weak evidence or contradicted by sources

SOURCE TIERS:
- Tier 1: Government data, academic research, official statistics
- Tier 2: Reputable news, fact-checkers, research organizations
- Tier 3: Supporting context, opinion, analysis

TONE: Neutral, calm, institutional. No moral judgments.`;

    const userPrompt = `Verify this claim using official sources:

CLAIM: "${claim}"
${link ? `SOURCE URL: ${link}` : ""}

Analyze and return JSON with:
1. verdict (true/false/misleading/inconclusive)
2. confidence (0-100)
3. summary (one sentence)
4. bottomLine (2-3 sentences for executives)
5. whatDataShows (3-5 key facts)
6. spreadFactors (why this claim spread)
7. sources (tier1, tier2, tier3 with full details)

Return ONLY valid JSON, no markdown.`;

    // Use the correct Anthropic model name
    const modelName = process.env.ANTHROPIC_MODEL === "claude-sonnet-4-5" 
      ? "claude-sonnet-4-20250514" 
      : (process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514");

    const requestBody: Anthropic.MessageCreateParams = {
      model: modelName,
      max_tokens: 4000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: "user" as const,
          content: userPrompt,
        },
      ],
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const message = await anthropic.messages.create(requestBody);

    console.log("Anthropic response:", JSON.stringify(message, null, 2));

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic");
    }

    let responseText = content.text.trim();
    
    // Remove markdown code blocks if present
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (responseText.startsWith("```")) {
      responseText = responseText.replace(/```\n?/g, "");
    }

    const result = JSON.parse(responseText);

    // Add verification ID if not present
    if (!result.verificationId) {
      result.verificationId = `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Reality scan error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Verification failed",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
