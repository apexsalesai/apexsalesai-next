/**
 * PATCH /api/studio/assets/:id
 * Update asset with optional versioning
 * Query param: ?newVersion=true to create new version
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, audit, wordCount, charCount, readingTime } from '@lib/telemetry-phase2';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const newVersion = searchParams.get('newVersion') === 'true';

    const body = await request.json();
    const { title, body: content, metadata } = body;

    // Fetch current asset
    const currentAsset = await prisma.contentAsset.findUnique({
      where: { id },
    });

    if (!currentAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    let asset;

    if (newVersion) {
      // Create new version (clone with incremented version)
      asset = await prisma.contentAsset.create({
        data: {
          campaignId: currentAsset.campaignId,
          type: currentAsset.type,
          title: title || currentAsset.title,
          body: content || currentAsset.body,
          version: currentAsset.version + 1,
          parentId: currentAsset.id,
          status: 'draft',
          metadata: metadata || {
            wordCount: wordCount(content || currentAsset.body),
            charCount: charCount(content || currentAsset.body),
            readingTime: readingTime(content || currentAsset.body),
          },
        },
      });

      await audit('system-user', 'asset.version', { type: 'asset', id: asset.id }, {
        parentId: currentAsset.id,
        version: asset.version,
        previousVersion: currentAsset.version,
      });
    } else {
      // Update existing asset
      const updateData: any = {};
      
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) {
        updateData.body = content;
        updateData.metadata = {
          ...currentAsset.metadata as object,
          wordCount: wordCount(content),
          charCount: charCount(content),
          readingTime: readingTime(content),
        };
      }
      if (metadata !== undefined) {
        updateData.metadata = {
          ...currentAsset.metadata as object,
          ...metadata,
        };
      }

      asset = await prisma.contentAsset.update({
        where: { id },
        data: updateData,
      });

      await audit('system-user', 'asset.update', { type: 'asset', id: asset.id }, {
        type: asset.type,
        changes: Object.keys(updateData),
      });
    }

    return NextResponse.json({ data: asset });
  } catch (error: any) {
    console.error('[API] PATCH /api/studio/assets/:id error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update asset' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get asset with version history
    const asset = await prisma.contentAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Get all versions (same campaignId + type + title pattern)
    const versions = await prisma.contentAsset.findMany({
      where: {
        campaignId: asset.campaignId,
        type: asset.type,
        OR: [
          { id: asset.id },
          { parentId: asset.id },
          { parentId: asset.parentId || 'none' },
        ],
      },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({ data: asset, versions });
  } catch (error: any) {
    console.error('[API] GET /api/studio/assets/:id error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}
