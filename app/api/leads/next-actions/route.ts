import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json();

    // Mock AI-generated next best actions
    const actions = [
      '📧 Send personalized follow-up email highlighting ROI case study',
      '📞 Schedule discovery call to discuss pain points',
      '🎯 Share relevant content: "5 Ways AI Transforms Sales"',
      '🤝 Introduce to customer success team for technical demo',
    ];

    return NextResponse.json({
      leadId,
      actions,
      confidence: 0.87,
      reasoning: 'Based on engagement history and industry benchmarks',
    });
  } catch (error: any) {
    console.error('Error generating next actions:', error);
    return NextResponse.json(
      { error: 'Failed to generate actions', message: error.message },
      { status: 500 }
    );
  }
}
