/**
 * AI Resume Rewriter API
 * Generates tailored resume, cover letter, and LinkedIn summary
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
    const { resumeData, jobData, artifacts = ['resume', 'coverLetter', 'linkedinAbout'] } = body;

    if (!resumeData || !jobData) {
      return NextResponse.json(
        { error: 'resumeData and jobData are required' },
        { status: 400 }
      );
    }

    const generated: any = {};

    // Generate Resume
    if (artifacts.includes('resume')) {
      const resumePrompt = `You are an expert resume writer. Rewrite this resume to be optimized for the target job description.

Requirements:
- Keep all truthful information from the original resume
- Add quantifiable metrics where possible
- Incorporate relevant keywords from the job description naturally
- Use strong action verbs
- Format in clean, ATS-friendly Markdown
- Highlight relevant experience and skills

Original Resume:
${JSON.stringify(resumeData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Return the rewritten resume in Markdown format.`;

      const resumeResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Create ATS-optimized, impactful resumes.',
          },
          { role: 'user', content: resumePrompt },
        ],
        temperature: 0.4,
      });

      generated.resume = resumeResponse.choices[0].message?.content || '';
    }

    // Generate Cover Letter
    if (artifacts.includes('coverLetter')) {
      const coverLetterPrompt = `You are an expert cover letter writer. Create a compelling cover letter for this candidate applying to the target role.

Requirements:
- Professional tone
- 250-350 words
- Highlight relevant experience and skills
- Show enthusiasm for the role
- Connect candidate's background to job requirements
- Include specific examples

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Return the cover letter in plain text format.`;

      const coverLetterResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional cover letter writer. Create compelling, personalized cover letters.',
          },
          { role: 'user', content: coverLetterPrompt },
        ],
        temperature: 0.5,
      });

      generated.coverLetter = coverLetterResponse.choices[0].message?.content || '';
    }

    // Generate LinkedIn About Section
    if (artifacts.includes('linkedinAbout')) {
      const linkedinPrompt = `You are a LinkedIn profile optimization expert. Create a compelling "About" section for this professional targeting the specified role.

Requirements:
- First-person narrative
- 150-200 words
- Highlight key achievements and skills
- Professional yet personable tone
- Include relevant keywords
- End with a call-to-action

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Target Role:
${jobData.role || 'Professional role'}

Return the LinkedIn About section in plain text.`;

      const linkedinResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a LinkedIn profile optimization expert. Create engaging, professional About sections.',
          },
          { role: 'user', content: linkedinPrompt },
        ],
        temperature: 0.5,
      });

      generated.linkedinAbout = linkedinResponse.choices[0].message?.content || '';
    }

    // TODO: Store in database when Prisma migration is run
    // await prisma.jobAnalysis.update({
    //   where: { id: jobId },
    //   data: { generated },
    // });

    return NextResponse.json({
      success: true,
      generated,
      message: 'Content generated successfully',
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
