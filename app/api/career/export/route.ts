/**
 * Export API
 * Converts generated content to PDF or DOCX format
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, content, filename } = body;

    if (!type || !content || !filename) {
      return NextResponse.json(
        { error: 'type, content, and filename are required' },
        { status: 400 }
      );
    }

    if (!['pdf', 'docx', 'txt'].includes(type)) {
      return NextResponse.json(
        { error: 'type must be pdf, docx, or txt' },
        { status: 400 }
      );
    }

    // For now, export as plain text
    // TODO: Implement PDF generation with puppeteer or jsPDF
    // TODO: Implement DOCX generation with docx library

    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const exportPath = join(process.cwd(), 'public', 'downloads', sanitizedFilename);

    if (type === 'txt') {
      await writeFile(exportPath, content, 'utf-8');
    } else if (type === 'pdf') {
      // TODO: Convert markdown/html to PDF
      // For now, save as text with .pdf extension
      await writeFile(exportPath, content, 'utf-8');
    } else if (type === 'docx') {
      // TODO: Convert to DOCX format
      // For now, save as text with .docx extension
      await writeFile(exportPath, content, 'utf-8');
    }

    return NextResponse.json({
      success: true,
      downloadUrl: `/downloads/${sanitizedFilename}`,
      message: 'File exported successfully',
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Export failed' },
      { status: 500 }
    );
  }
}
