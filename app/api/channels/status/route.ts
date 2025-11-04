/**
 * Channel Status API
 * 
 * GET /api/channels/status
 * Returns the status of all configured channels
 */

import { NextResponse } from 'next/server';
import { ChannelRegistry } from '@/lib/channels';

export async function GET() {
  try {
    const enabledChannels = ChannelRegistry.getEnabledChannels();
    const validationResults = await ChannelRegistry.validateAll();
    
    const channels = enabledChannels.map(type => {
      const adapter = ChannelRegistry.get(type);
      return {
        type,
        name: adapter?.name || type,
        enabled: true,
        validated: validationResults[type] || false,
      };
    });
    
    return NextResponse.json({
      channels,
      summary: {
        total: channels.length,
        validated: channels.filter(c => c.validated).length,
        invalid: channels.filter(c => !c.validated).length,
      },
    });
  } catch (error) {
    console.error('Channel status error:', error);
    return NextResponse.json(
      { error: 'Failed to get channel status' },
      { status: 500 }
    );
  }
}
