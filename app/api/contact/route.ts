import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendTeamsNotification } from '../teamsNotify';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const TO_EMAIL = 'info@apexsalesai.com';
const FROM_EMAIL = 'info@apexsalesai.com';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

import { verifyAuth } from '../_auth';

export async function POST(request: Request) {
  // JWT authentication
  const auth = verifyAuth(request as any);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.message || 'Unauthorized' }, { status: auth.status || 401 });
  }
  try {
    const data = await request.json();
    // Compose HTML email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #0078D7;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name || ''}</p>
        <p><strong>Email:</strong> ${data.email || ''}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Company:</strong> ${data.company || ''}</p>
        <p><strong>Interest:</strong> ${data.interest || ''}</p>
        <p><strong>Message:</strong><br/>${data.message || ''}</p>
      </div>
    `;
    // Compose Teams message
    const teamsMsg = `**New Contact Form Submission**\n\n- **Name:** ${data.name || ''}\n- **Email:** ${data.email || ''}` +
      (data.phone ? `\n- **Phone:** ${data.phone}` : '') +
      `\n- **Company:** ${data.company || ''}\n- **Interest:** ${data.interest || ''}\n- **Message:** ${data.message || ''}`;

    // Send email if Resend is configured
    if (resend) {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: 'New Contact Form Submission',
        html: htmlBody,
      });
      
      if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
      }
    }
    
    // Send Teams notification
    await sendTeamsNotification('New Contact Form Submission', teamsMsg);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}