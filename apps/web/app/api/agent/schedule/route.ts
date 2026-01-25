import { NextRequest, NextResponse } from 'next/server';
import { ContentScheduler } from '../../../../lib/services/agent/contentScheduler';

/**
 * API Route: /api/agent/schedule
 * Purpose: Manage content generation schedules
 */

/**
 * GET: List all schedules
 */
export async function GET() {
  try {
    const schedules = ContentScheduler.getAllSchedules();
    
    return NextResponse.json({
      success: true,
      schedules,
      message: `Found ${schedules.length} content schedules`
    });
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Execute a schedule manually or update schedule config
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, scheduleId, updates } = body;

    switch (action) {
      case 'execute':
        if (!scheduleId) {
          return NextResponse.json(
            { error: 'Schedule ID is required' },
            { status: 400 }
          );
        }
        
        await ContentScheduler.executeSchedule(scheduleId);
        
        return NextResponse.json({
          success: true,
          message: `Schedule "${scheduleId}" executed successfully`
        });

      case 'toggle':
        if (!scheduleId || typeof updates?.enabled !== 'boolean') {
          return NextResponse.json(
            { error: 'Schedule ID and enabled status are required' },
            { status: 400 }
          );
        }
        
        ContentScheduler.toggleSchedule(scheduleId, updates.enabled);
        
        return NextResponse.json({
          success: true,
          message: `Schedule "${scheduleId}" ${updates.enabled ? 'enabled' : 'disabled'}`
        });

      case 'update':
        if (!scheduleId || !updates) {
          return NextResponse.json(
            { error: 'Schedule ID and updates are required' },
            { status: 400 }
          );
        }
        
        ContentScheduler.updateSchedule(scheduleId, updates);
        
        return NextResponse.json({
          success: true,
          message: `Schedule "${scheduleId}" updated successfully`
        });

      case 'check':
        // Manually trigger schedule check
        await ContentScheduler.checkAndRunSchedules();
        
        return NextResponse.json({
          success: true,
          message: 'Schedule check completed'
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error managing schedule:', error);
    return NextResponse.json(
      { error: 'Failed to manage schedule', message: error.message },
      { status: 500 }
    );
  }
}
