/**
 * Job Description Ingestor API
 * Accepts job description text and extracts key requirements
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
    const { profileId, jobSource, rawText } = body;

    if (!profileId || !rawText) {
      return NextResponse.json(
        { error: 'profileId and rawText are required' },
        { status: 400 }
      );
    }

    // Parse job description with OpenAI
    const parsePrompt = `You are an expert job description analyzer. Extract the following information and return ONLY valid JSON:

{
  "role": "Job Title",
  "level": "Entry/Mid/Senior/Executive",
  "industry": "Industry name",
  "company": "Company name (if mentioned)",
  "location": "Location (if mentioned)",
  "skillsRequired": ["Required skill 1", "Required skill 2"],
  "skillsPreferred": ["Preferred skill 1", "Preferred skill 2"],
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "qualifications": ["Qualification 1", "Qualification 2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "experienceYears": "X-Y years or null",
  "educationRequired": "Degree requirement or null"
}

Job Description:
${rawText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a job description parsing expert. Return only valid JSON matching the schema provided.',
        },
        { role: 'user', content: parsePrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const parsedData = JSON.parse(response.choices[0].message?.content || '{}');

    // TODO: Store in database when Prisma migration is run
    // const jobAnalysis = await prisma.jobAnalysis.create({
    //   data: {
    //     profileId,
    //     jobSource: jobSource || 'paste',
    //     rawText,
    //     parsedJson: parsedData,
    //   },
    // });

    return NextResponse.json({
      success: true,
      jobId: `job-${Date.now()}`, // Mock ID until DB is ready
      parsed: parsedData,
      message: 'Job description parsed successfully',
    });
  } catch (error: any) {
    console.error('Job ingestion error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Ingestion failed' },
      { status: 500 }
    );
  }
}
