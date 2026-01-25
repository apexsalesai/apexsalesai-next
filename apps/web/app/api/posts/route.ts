import { NextResponse } from 'next/server';
import { PrismaClient, BlogPostStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as BlogPostStatus } : {};

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ posts, count: posts.length });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
