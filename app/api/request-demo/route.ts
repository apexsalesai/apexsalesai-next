import { NextResponse } from 'next/server';
import { sendEmailWithAlert } from '../../lib/sendEmailWithAlert';
import { logSubmission } from '../../lib/submissionLogger';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, company, jobTitle, phone, teamSize, industry, message } = data;
    if (!name || !email || !company || !jobTitle || !teamSize || !industry) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Compose HTML email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #0078D7;">New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Team Size:</strong> ${teamSize}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Message:</strong> ${message || 'N/A'}</p>
      </div>
    `;
    // Compose Teams message
    const teamsMsg = `**New Demo Request**\n\n- **Name:** ${name}\n- **Email:** ${email}\n- **Company:** ${company}\n- **Job Title:** ${jobTitle}\n- **Phone:** ${phone || 'N/A'}\n- **Team Size:** ${teamSize}\n- **Industry:** ${industry}\n- **Message:** ${message || 'N/A'}`;
    // Send email using the centralized utility
    const { error } = await sendEmailWithAlert({
      subject: 'New Demo Request',
      html: htmlBody,
    });
    if (error) {
      logSubmission({
        timestamp: new Date().toISOString(),
        endpoint: '/api/request-demo',
        data: { name, email, company, jobTitle, phone, teamSize, industry, message },
        success: false,
        error: error.message || String(error),
      });
      return NextResponse.json({ error: 'Failed to send demo request email.' }, { status: 500 });
    }
    logSubmission({
      timestamp: new Date().toISOString(),
      endpoint: '/api/request-demo',
      data: { name, email, company, jobTitle, phone, teamSize, industry, message },
      success: true,
    });
    // Google Analytics event tracking
    try {
      const { trackEvent } = await import('../../lib/analytics');
      await trackEvent('Demo Requested', { name, email, company, jobTitle, phone, teamSize, industry });
    } catch (err) {
      console.warn('[Analytics] Demo Requested event not sent:', err);
    }
    // Optionally send a Teams notification for successful lead (not failure)
    // await sendTeamsNotification('New Demo Request', teamsMsg);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Demo request API error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
