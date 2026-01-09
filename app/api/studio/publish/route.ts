/**
 * Social Media Publishing API (Mock Version)
 * Returns mock data until Prisma models are added
 */

import { NextRequest, NextResponse } from 'next/server';

// Type definition for jobs
type PublishJob = {
  id: string;
  platform: string;
  status: string;
  scheduledAt: string | null;
  postedAt: string | null;
  postUrl: string | null;
  errorMessage: string | null;
  assetId: string;
  createdAt: string;
};

// Mock data
const mockJobs: PublishJob[] = [
  {
    id: '1',
    platform: 'linkedin',
    status: 'success',
    scheduledAt: null,
    postedAt: new Date().toISOString(),
    postUrl: 'https://linkedin.com/post/demo1',
    errorMessage: null,
    assetId: 'asset-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    platform: 'x',
    status: 'posting',
    scheduledAt: null,
    postedAt: null,
    postUrl: null,
    errorMessage: null,
    assetId: 'asset-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    platform: 'instagram',
    status: 'queued',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    postedAt: null,
    postUrl: null,
    errorMessage: null,
    assetId: 'asset-3',
    createdAt: new Date().toISOString(),
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, scheduledAt } = body;

    // Create mock job
    const newJob = {
      id: String(mockJobs.length + 1),
      platform,
      status: scheduledAt ? 'queued' : 'posting',
      scheduledAt: scheduledAt || null,
      postedAt: scheduledAt ? null : new Date().toISOString(),
      postUrl: scheduledAt ? null : `https://${platform}.com/post/demo`,
      errorMessage: null,
      assetId: `asset-${mockJobs.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    mockJobs.push(newJob);

    return NextResponse.json({
      success: true,
      message: scheduledAt ? 'Post scheduled successfully' : 'Published successfully',
      job: newJob,
    });
  } catch (error: any) {
    console.error('[API] POST /api/studio/publish error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to publish' },
      { status: 500 }
    );
  }
}

/**
 * GET - List publish jobs
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    let filteredJobs = [...mockJobs];

    if (platform) {
      filteredJobs = filteredJobs.filter(j => j.platform === platform);
    }

    if (status) {
      filteredJobs = filteredJobs.filter(j => j.status === status);
    }

    return NextResponse.json({
      success: true,
      jobs: filteredJobs,
      count: filteredJobs.length,
    });
  } catch (error: any) {
    console.error('[API] GET /api/studio/publish error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
