import { NextResponse } from 'next/server';
import { sendEmailWithAlert } from '../../lib/sendEmailWithAlert';
import { logSubmission } from '../../lib/submissionLogger';

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@apexsalesai.com';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@apexsalesai.com';


export async function POST(request: Request) {
  console.log("RESEND_API_KEY in subscribe route:", process.env.RESEND_API_KEY);
  const timestamp = new Date().toISOString();
  try {
    const { email } = await request.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      logSubmission({ timestamp, endpoint: '/api/subscribe', data: { email }, success: false, error: 'Invalid email address.' });
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    // 1. Send admin notification
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #0078D7;">New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${email}</p>
      </div>
    `;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const adminRes = await sendEmailWithAlert({
      to: NOTIFICATION_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: adminHtml,
      replyTo: email,
      apiKey: RESEND_API_KEY
    });
    if (adminRes.error) {
      logSubmission({ timestamp, endpoint: '/api/subscribe', data: { email }, success: false, error: adminRes.error.message || 'Failed to notify admin.' });
      return NextResponse.json({ error: 'Failed to notify admin.' }, { status: 500 });
    }
    // 2. Send welcome email to subscriber
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #0078D7;">Welcome to ApexSalesAI Updates!</h2>
        <p>Thank you for subscribing to our newsletter. You’ll now receive the latest on AI innovation, consulting tips, and product news from ApexSalesAI.</p>
        <p>If you have any questions or want to learn more, just reply to this email or visit our website.</p>
        <p style="margin-top:2em; color:#888; font-size:13px;">ApexSalesAI &mdash; Intelligent AI agents for revenue growth</p>
      </div>
    `;
    const welcomeRes = await sendEmailWithAlert({
      to: email,
      subject: 'Welcome to ApexSalesAI!',
      html: welcomeHtml,
      replyTo: NOTIFICATION_EMAIL,
      apiKey: RESEND_API_KEY
    });
    if (welcomeRes.error) {
      logSubmission({ timestamp, endpoint: '/api/subscribe', data: { email }, success: false, error: welcomeRes.error.message || 'Failed to send welcome email.' });
      return NextResponse.json({ error: 'Failed to send welcome email.' }, { status: 500 });
    }
    logSubmission({ timestamp, endpoint: '/api/subscribe', data: { email }, success: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    logSubmission({ timestamp, endpoint: '/api/subscribe', data: {}, success: false, error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
