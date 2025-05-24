import { NextResponse } from 'next/server';
import { sendEmailWithAlert } from '../lib/sendEmailWithAlert';
import { logSubmission } from '../lib/submissionLogger';

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@apexsalesai.com';
const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@apexsalesai.com';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    // 1. Send admin notification
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #0078D7;">New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${email}</p>
      </div>
    `;
    const adminRes = await sendEmailWithAlert({
      to: ADMIN_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: adminHtml,
    });
    if (adminRes.error) {
      logSubmission({
        timestamp: new Date().toISOString(),
        endpoint: '/api/subscribe (admin)',
        data: { email },
        success: false,
        error: adminRes.error.message || String(adminRes.error),
      });
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
    });
    if (welcomeRes.error) {
      logSubmission({
        timestamp: new Date().toISOString(),
        endpoint: '/api/subscribe (welcome)',
        data: { email },
        success: false,
        error: welcomeRes.error.message || String(welcomeRes.error),
      });
      return NextResponse.json({ error: 'Failed to send welcome email.' }, { status: 500 });
    }
    // Google Analytics event tracking
    try {
      const { trackEvent } = await import('../lib/analytics');
      await trackEvent('Subscribed', { email });
    } catch (err) {
      console.warn('[Analytics] Subscribed event not sent:', err);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
