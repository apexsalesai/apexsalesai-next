import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json();

    // Mock AI scoring recommendations
    const recommendations = [
      {
        category: 'Engagement',
        score: 85,
        insight: 'High email open rate (72%) and website visits',
        action: 'Strike while hot - schedule demo within 48 hours',
      },
      {
        category: 'Fit',
        score: 78,
        insight: 'Company size and industry align with ICP',
        action: 'Emphasize enterprise features and compliance',
      },
      {
        category: 'Intent',
        score: 92,
        insight: 'Viewed pricing page 3x, downloaded case study',
        action: 'Lead is in buying mode - prioritize immediate outreach',
      },
    ];

    return NextResponse.json({
      leadId,
      overallScore: 85,
      recommendations,
      nextBestAction: 'Schedule personalized demo focusing on ROI and compliance',
    });
  } catch (error: any) {
    console.error('Error generating AI score:', error);
    return NextResponse.json(
      { error: 'Failed to generate score', message: error.message },
      { status: 500 }
    );
  }
}
