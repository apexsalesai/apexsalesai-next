import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

/**
 * Test endpoint to verify OpenAI API configuration
 * Access: /api/test-openai
 */
export async function GET(req: NextRequest) {
  try {
    // Check if API key exists
    const apiKey = 
      process.env.OPENAI_API_KEY || 
      process.env.AZURE_OPENAI_API_KEY || 
      process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No OpenAI API key found in environment variables',
        checked: [
          'OPENAI_API_KEY',
          'AZURE_OPENAI_API_KEY',
          'NEXT_PUBLIC_OPENAI_API_KEY'
        ]
      }, { status: 500 });
    }

    // Mask the key for security
    const maskedKey = `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`;

    // Test the API key with a simple completion
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with exactly: "API key is working!"'
        },
        {
          role: 'user',
          content: 'Test'
        }
      ],
      max_tokens: 20,
      temperature: 0
    });

    const response = completion.choices[0]?.message?.content || 'No response';

    return NextResponse.json({
      success: true,
      message: 'OpenAI API is working correctly',
      apiKeyMasked: maskedKey,
      testResponse: response,
      model: 'gpt-4o',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (err: any) {
    console.error('OpenAI test error:', err);

    // Parse specific OpenAI errors
    let errorDetails = {
      message: err?.message || 'Unknown error',
      type: err?.type || 'unknown',
      code: err?.code || 'unknown',
      status: err?.status || 500
    };

    // Check for common errors
    if (err?.status === 401) {
      errorDetails.message = 'Invalid API key - please check your OPENAI_API_KEY in Vercel';
    } else if (err?.status === 429) {
      errorDetails.message = 'Rate limit exceeded or insufficient quota';
    } else if (err?.status === 404) {
      errorDetails.message = 'Model not found - gpt-4o might not be available on your API key';
    }

    return NextResponse.json({
      success: false,
      error: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: errorDetails.status });
  }
}
