/**
 * Fit Analyzer API
 * Compares resume against job description and scores alignment
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'AI service not configured',
          hint: 'OpenAI API key is missing. Please add OPENAI_API_KEY to your .env.local file.'
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { resumeData, jobData } = body;

    if (!resumeData || !jobData) {
      return NextResponse.json(
        { error: 'resumeData and jobData are required' },
        { status: 400 }
      );
    }

    // Analyze fit with OpenAI
    const fitPrompt = `You are an expert career advisor. Compare this resume against the job description and return ONLY valid JSON:

{
  "fitScore": 85,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "matchingExperience": ["experience point 1"],
  "gaps": ["gap 1", "gap 2"],
  "strengths": ["strength 1", "strength 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "rationale": "Brief explanation of the score and key factors"
}

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${JSON.stringify(jobData, null, 2)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a career fit analysis expert. Return only valid JSON with accurate scoring (0-100).',
        },
        { role: 'user', content: fitPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const fitAnalysis = JSON.parse(response.choices[0].message?.content || '{}');

    // TODO: Update database when Prisma migration is run
    // await prisma.jobAnalysis.update({
    //   where: { id: jobId },
    //   data: {
    //     fitScore: fitAnalysis.fitScore,
    //     matchSummary: fitAnalysis,
    //   },
    // });

    return NextResponse.json({
      success: true,
      fitScore: fitAnalysis.fitScore,
      matchingSkills: fitAnalysis.matchingSkills,
      missingSkills: fitAnalysis.missingSkills,
      strengths: fitAnalysis.strengths,
      gaps: fitAnalysis.gaps,
      recommendations: fitAnalysis.recommendations,
      rationale: fitAnalysis.rationale,
      message: 'Fit analysis completed successfully',
    });
  } catch (error: any) {
    console.error('Fit analysis error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
