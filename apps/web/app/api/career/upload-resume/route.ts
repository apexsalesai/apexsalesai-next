/**
 * Resume Upload API
 * Handles file upload for career profiles
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only PDF and DOC/DOCX files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `resume-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = join(process.cwd(), 'public', 'uploads', 'resumes', fileName);
    
    await writeFile(path, buffer);
    
    const resumeUrl = `/uploads/resumes/${fileName}`;

    // TODO: Update profile in database when Prisma model is ready
    // const userId = req.headers.get('x-user-id') || 'demo-user';
    // await prisma.careerProfile.update({
    //   where: { userId },
    //   data: { resumeUrl }
    // });

    return NextResponse.json({ 
      success: true, 
      resumeUrl,
      fileName: file.name,
      message: 'Resume uploaded successfully'
    });
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
}
