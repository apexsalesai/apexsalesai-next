/**
 * Channel Publishing API
 * 
 * POST /api/channels/publish
 * Publishes content to one or more channels
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChannelRegistry, PublishOptions, ChannelType } from '@/lib/channels';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channels, content, title, excerpt, media, tags, categories, channelOptions } = body;
    
    if (!channels || !Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json(
        { error: 'At least one channel must be specified' },
        { status: 400 }
      );
    }
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Prepare publish options
    const publishOptions: PublishOptions = {
      title,
      content,
      excerpt,
      media,
      tags,
      categories,
      channelOptions,
    };
    
    // Publish to each channel
    const results = await Promise.all(
      channels.map(async (channelType: ChannelType) => {
        const adapter = ChannelRegistry.get(channelType);
        
        if (!adapter) {
          return {
            channel: channelType,
            success: false,
            error: `Channel ${channelType} is not enabled or configured`,
          };
        }
        
        try {
          const result = await adapter.publish(publishOptions);
          return {
            channel: channelType,
            ...result,
          };
        } catch (error) {
          return {
            channel: channelType,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );
    
    // Check if any succeeded
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        total: channels.length,
        succeeded: successCount,
        failed: failureCount,
      },
    });
  } catch (error) {
    console.error('Channel publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    );
  }
}
