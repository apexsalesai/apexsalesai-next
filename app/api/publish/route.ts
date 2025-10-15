import { NextRequest, NextResponse } from 'next/server';
import { publishMarkdown } from '@lib/services/agent/publishToGithub';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { title, excerpt, content, tags = [], slug } = await req.json();

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Build frontmatter
    const frontmatter = {
      title: title.trim(),
      slug: slug || '',
      date: new Date().toISOString().slice(0, 10),
      author: 'ApexSalesAI',
      excerpt: excerpt || '',
      tags: Array.isArray(tags) ? tags : [],
    };

    // Publish to GitHub
    const result = await publishMarkdown({
      title: title.trim(),
      slug,
      frontmatter,
      body: content.trim(),
    });

    return NextResponse.json({
      success: true,
      published: result,
      message: 'Blog post published successfully. Vercel will rebuild automatically.',
    }, { status: 200 });
  } catch (err: any) {
    console.error('Publish API error:', err);
    return NextResponse.json({
      error: err?.message || 'Publish failed',
      details: err?.toString(),
    }, { status: 500 });
  }
}
