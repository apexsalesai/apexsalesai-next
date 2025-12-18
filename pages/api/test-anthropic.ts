import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ error: "No API key found" });
  }

  console.log("Testing Anthropic API...");
  console.log("API Key present:", !!apiKey);
  console.log("API Key prefix:", apiKey.slice(0, 20));
  console.log("API Key length:", apiKey.length);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: "Say hello in one word",
          },
        ],
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const text = await response.text();
    console.log("Response body:", text);

    if (!response.ok) {
      return res.status(200).json({
        error: "API call failed",
        status: response.status,
        body: text,
      });
    }

    const json = JSON.parse(text);
    return res.status(200).json({
      success: true,
      response: json,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(200).json({
      error: "Exception thrown",
      message: error.message,
      stack: error.stack,
    });
  }
}
