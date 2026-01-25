import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { sendEmailWithAlert } from '../lib/sendEmailWithAlert';
import { logSubmission } from '../lib/submissionLogger';
import { sendTeamsNotification } from './teamsNotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, company, interest, message, phone, type } = req.body;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'info@apexsalesai.com';
  const TO_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@apexsalesai.com';
  const resend = new Resend(RESEND_API_KEY);

  try {
    if (type === 'callback') {
      if (!name || !phone) {
        return res.status(400).json({ message: 'Missing required fields for callback' });
      }
      logSubmission({
  timestamp: new Date().toISOString(),
  endpoint: '/api/contact (callback)',
  data: { name, phone },
  success: true
});
      await sendTeamsNotification(
        'New Callback Request',
        `**Name:** ${name}\n**Phone:** ${phone}`
      );
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #0078D7;">New Callback Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
      `;
      const { error } = await sendEmailWithAlert({
        subject: 'New Callback Request',
        html: htmlBody,
      });
      if (error) {
        logSubmission({
          timestamp: new Date().toISOString(),
          endpoint: '/api/contact (callback)',
          data: { name, phone },
          success: false,
          error: error.message || String(error),
        });
        return res.status(500).json({ message: 'Failed to send callback email.' });
      }
      logSubmission({
        timestamp: new Date().toISOString(),
        endpoint: '/api/contact (callback)',
        data: { name, phone },
        success: true,
      });
      // Google Analytics event tracking
      try {
        const { trackEvent } = await import('../lib/analytics');
        await trackEvent('Callback Requested', { name, phone });
      } catch (err) {
        console.warn('[Analytics] Callback Requested event not sent:', err);
      }
      return res.status(200).json({ message: 'Callback request sent successfully' });
    } else {
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      logSubmission({
  timestamp: new Date().toISOString(),
  endpoint: '/api/contact',
  data: { name, email, company, interest, message },
  success: true
});
      await sendTeamsNotification(
        'New Contact Form Submission',
        `**Name:** ${name}\n**Email:** ${email}\n**Company:** ${company || ''}\n**Interest:** ${interest || ''}\n**Message:** ${message}`
      );
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #0078D7;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Company:</strong> ${company || ''}</p>
          <p><strong>Interest:</strong> ${interest || ''}</p>
          <p><strong>Message:</strong><br/>${message || ''}</p>
        </div>
      `;
      const { error } = await sendEmailWithAlert({
        subject: 'New Contact Form Submission',
        html: htmlBody,
        replyTo: email,
      });
      if (error) {
        logSubmission({
          timestamp: new Date().toISOString(),
          endpoint: '/api/contact',
          data: { name, email, company, interest, message, phone },
          success: false,
          error: error.message || String(error),
        });
        return res.status(500).json({ message: 'Failed to send contact email.' });
      }
      logSubmission({
        timestamp: new Date().toISOString(),
        endpoint: '/api/contact',
        data: { name, email, company, interest, message, phone },
        success: true,
      });
      // Google Analytics event tracking
      try {
        const { trackEvent } = await import('../lib/analytics');
        await trackEvent('Contact Submitted', { name, email, company, interest, message, phone });
      } catch (err) {
        console.warn('[Analytics] Contact Submitted event not sent:', err);
      }
      return res.status(200).json({ message: 'Message sent successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message', error });
  }
}


