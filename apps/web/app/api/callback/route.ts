import { NextResponse } from 'next/server';
import { sendEmailWithAlert } from '../../lib/sendEmailWithAlert';
import { sendTeamsNotification } from '../teamsNotify';
import { logSubmission } from '../../lib/submissionLogger';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Compose HTML email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #0078D7;">New Callback Request</h2>
        <p><strong>Name:</strong> ${data.name || ''}</p>
        <p><strong>Phone:</strong> ${data.phone || ''}</p>
      </div>
    `;
    // Compose Teams message
    const teamsMsg = `**New Callback Request**\n\n- **Name:** ${data.name || ''}\n- **Phone:** ${data.phone || ''}`;

    // Send email using the centralized utility
    const { error } = await sendEmailWithAlert({
      subject: 'New Callback Request',
      html: htmlBody,
    });
    // Send Teams notification for successful lead (optional)
    await sendTeamsNotification('New Callback Request', teamsMsg);
    if (error) {
      logSubmission({
        timestamp: new Date().toISOString(),
        endpoint: '/api/callback',
        data: { name: data.name, phone: data.phone },
        success: false,
        error: error.message || String(error),
      });
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }
    logSubmission({
      timestamp: new Date().toISOString(),
      endpoint: '/api/callback',
      data: { name: data.name, phone: data.phone },
      success: true,
    });
    // Google Analytics event tracking
    try {
      const { trackEvent } = await import('../../lib/analytics');
      await trackEvent('Callback Requested', { name: data.name, phone: data.phone });
    } catch (err) {
      console.warn('[Analytics] Callback Requested event not sent:', err);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback API error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
