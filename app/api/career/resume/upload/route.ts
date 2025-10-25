/**
 * Resume Upload & Parse API
 * Uploads resume file, extracts text, and parses with OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Force Node.js runtime for file operations
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check OpenAI API key first
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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const profileId = formData.get('profileId') as string;

    if (!file || !profileId) {
      return NextResponse.json(
        { success: false, error: 'file and profileId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOC/DOCX allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `resume-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(process.cwd(), 'public', 'uploads', 'resumes', fileName);

    await writeFile(filePath, buffer);

    // Extract text from PDF
    let extractedText = '';
    if (file.type === 'application/pdf') {
      try {
        // Use require for pdf-parse (CommonJS module)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (pdfError: any) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to parse PDF file',
            hint: 'Please ensure the PDF contains extractable text (not scanned images)'
          },
          { status: 422 }
        );
      }
    } else {
      // For DOC/DOCX, use basic text extraction (can be enhanced with mammoth.js)
      extractedText = buffer.toString('utf-8');
    }
    
    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not extract text from file',
          hint: 'Please ensure the file contains readable text'
        },
        { status: 422 }
      );
    }

    // Parse with OpenAI
    const parsePrompt = `You are an expert resume parser. Extract the following information from this resume and return ONLY valid JSON:

{
  "name": "Full Name",
  "title": "Current/Target Job Title",
  "contact": {
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State"
  },
  "summary": "Professional summary or objective",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2020 - Present",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "year": "2020"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}

Resume text:
${extractedText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a resume parsing expert. Return only valid JSON matching the schema provided.',
        },
        { role: 'user', content: parsePrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const parsedData = JSON.parse(response.choices[0].message?.content || '{}');

    // TODO: Store in database when Prisma migration is run
    // const resume = await prisma.resume.create({
    //   data: {
    //     profileId,
    //     storagePath: `/uploads/resumes/${fileName}`,
    //     parsedJson: parsedData,
    //     originalFilename: file.name,
    //     mimetype: file.type,
    //     bytes: file.size,
    //   },
    // });

    return NextResponse.json({
      success: true,
      resumeId: `resume-${Date.now()}`, // Mock ID until DB is ready
      storagePath: `/uploads/resumes/${fileName}`,
      parsed: parsedData,
      message: 'Resume uploaded and parsed successfully',
    });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
