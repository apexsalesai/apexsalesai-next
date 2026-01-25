import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, company, jobTitle, phone, teamSize, industry, message } = data;
    if (!name || !email || !company || !jobTitle || !teamSize || !industry) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Compose email content
    const emailHtml = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Team Size:</strong> ${teamSize}</p>
      <p><strong>Industry:</strong> ${industry}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `;

    await resend.emails.send({
      from: 'demo@apexsalesai.com',
      to: process.env.DEMO_NOTIFICATION_EMAIL || 'demo@apexsalesai.com',
      subject: 'New Demo Request',
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Demo request error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
