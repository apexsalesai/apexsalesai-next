import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  return NextResponse.json({ status: 'API is working' });
}

export async function POST(req: NextRequest) {
  // Load company info dynamically
  let companyInfo = null;
  try {
    const infoPath = path.join(process.cwd(), 'company-info.json');
    const infoRaw = await fs.readFile(infoPath, 'utf8');
    companyInfo = JSON.parse(infoRaw);
  } catch (e) {
    companyInfo = null;
  }
  // DEBUG: Output env variables for troubleshooting
  if (req.nextUrl?.searchParams?.get('debug') === '1') {
    return NextResponse.json({
      AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
      AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT,
      AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION,
      // Do NOT output API key for security
    });
  }
  try {
    const { messages, user } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required.' }, { status: 400 });
    }

    // Prepare Azure OpenAI API call
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

    if (!apiKey || !endpoint || !deployment || !apiVersion) {
      console.error('Azure OpenAI credentials are missing or invalid.');
      return NextResponse.json({ error: 'Azure OpenAI credentials are missing. Please contact the site administrator.' }, { status: 500 });
    }

    // Build dynamic system prompt
    let sysPrompt = '';
    if (companyInfo) {
      sysPrompt += `You are Max, the executive AI assistant for ${companyInfo.companyName}.\n\n`;
      sysPrompt += `Company Profile:\n${companyInfo.companyName} is the leader in Predictive Autonomous Revenue Execution. The CEO is ${companyInfo.ceo}. Our mission is: ${companyInfo.mission}\n\n`;
      sysPrompt += `Key Facts:\n- CEO: ${companyInfo.ceo}\n- Headquarters: ${companyInfo.headquarters}\n- Website: ${companyInfo.website}\n`;
      sysPrompt += companyInfo.productHighlights ? `- ${companyInfo.productHighlights.join('\n- ')}\n` : '';
      sysPrompt += `\nBrand Voice:\nYou are helpful, concise, professional, warm, and witty. Always answer as Max. If you are unsure, say so and offer to find out.\n`;
      sysPrompt += `\nProactive Experience:\nIf users ask about demos, features, or pricing, offer to schedule a demo or connect them with sales.\n`;
      sysPrompt += `\nAlways use the above facts to answer company-specific questions.\n`;
      sysPrompt += `\nIf asked about the CEO, always answer: The CEO of ${companyInfo.companyName} is ${companyInfo.ceo}.\n`;
      if (user && user.name) {
        sysPrompt += `\nGreet the user by their name (${user.name}) if possible.\n`;
      }
      if (companyInfo.faq && Array.isArray(companyInfo.faq)) {
        sysPrompt += '\nFAQs:\n';
        companyInfo.faq.forEach((f: { question: string; answer: string }) => {
          sysPrompt += `Q: ${f.question}\nA: ${f.answer}\n`;
        });
      }
      sysPrompt += '\nAfter each answer, suggest 2-3 relevant follow-up questions or actions for the user (as a list, not as part of your main answer).';
      sysPrompt += '\nIf your answer includes a link, image, or video, format it as a markdown link or image.';
      sysPrompt += '\nIf the user requests a human, offer to connect them and let them know a real person will follow up.';
    } else {
      sysPrompt = 'You are Max, the executive AI assistant for ApexSalesAI.';
    }

    const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const azureRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        model: deployment, // Azure OpenAI requires the model name
        messages: [
          { role: 'system', content: sysPrompt },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        stream: false,
      }),
    });

    if (!azureRes.ok) {
      let errorMsg = 'An error occurred while contacting the AI assistant.';
      try {
        const error = await azureRes.json();
        errorMsg = error?.error?.message || errorMsg;
      } catch (e) {}
      return NextResponse.json({ error: errorMsg }, { status: azureRes.status });
    }

    const data = await azureRes.json();
    // Extract suggestions from the assistant's response (if present)
    let suggestions: string[] = [];
    let media: string[] = [];
    let escalation: boolean = false;
    let feedback = true;
    let answer = '';
    if (data.choices && data.choices[0]?.message?.content) {
      answer = data.choices[0].message.content;
      // Look for suggestions in a markdown list at the end of the answer
      const suggestionMatch = answer.match(/Suggestions?:\s*([\s\S]*)/i);
      if (suggestionMatch) {
        suggestions = suggestionMatch[1]
          .split(/\n|\r/)
          .map(s => s.replace(/^[-*]\s*/, '').trim())
          .filter(Boolean)
          .slice(0, 3);
        answer = answer.replace(/Suggestions?:[\s\S]*/, '').trim();
      }
      // Look for markdown images or links for rich media
      const mediaMatch = answer.match(/(!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))/g);
      if (mediaMatch) {
        media = mediaMatch;
      }
      // Look for escalation phrases
      if (/connect (me )?with (sales|support|a human|real person)/i.test(answer)) {
        escalation = true;
      }
    }
    return NextResponse.json({
      answer,
      suggestions,
      media,
      escalation,
      feedback
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unexpected error.' }, { status: 500 });
  }
}
