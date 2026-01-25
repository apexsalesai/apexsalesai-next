/**
 * Career Profile API (Mock Version)
 * Returns mock data until Prisma models are added
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock profile data
const mockProfile = {
  id: 'profile-1',
  userId: 'demo-user',
  headline: 'Senior Product Manager & AI Strategist',
  bio: 'Passionate about building products that make a difference. 10+ years in tech, specializing in AI/ML and product strategy.',
  skills: ['Product Management', 'AI Strategy', 'React', 'TypeScript', 'Leadership', 'UX Design'],
  portfolioUrls: [
    'https://github.com/demo',
    'https://linkedin.com/in/demo',
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/demo',
    github: 'https://github.com/demo',
    twitter: 'https://twitter.com/demo',
    website: 'https://demo.com',
  },
  resumeUrl: null,
  visibility: 'public',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * GET - Fetch career profile
 */
export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      profile: mockProfile,
    });
  } catch (error: any) {
    console.error('[API] GET /api/career/profile error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Create or update career profile
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Update mock profile
    Object.assign(mockProfile, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      profile: mockProfile,
    });
  } catch (error: any) {
    console.error('[API] PUT /api/career/profile error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
