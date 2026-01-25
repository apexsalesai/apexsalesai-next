import { Resend } from 'resend';
import { sendTeamsNotification } from '../api/teamsNotify';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@apexsalesai.com';
const TO_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@apexsalesai.com';

export interface EmailOptions {
  to?: string;
  subject: string;
  html: string;
  replyTo?: string;
  apiKey?: string; // Optional API key override
}

export async function sendEmailWithAlert({ to, subject, html, replyTo, apiKey }: EmailOptions) {
  try {
    const resendInstance = apiKey ? new Resend(apiKey) : resend;
    
    if (!resendInstance) {
      console.warn('Resend not configured, skipping email send');
      await sendTeamsNotification(subject, html);
      return { data: null, error: null };
    }
    
    const result = await resendInstance.emails.send({
      from: FROM_EMAIL,
      to: to || TO_EMAIL,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (result.error) {
      await sendTeamsNotification(
        'Email Delivery Failure',
        `**Subject:** ${subject}\n**To:** ${to || TO_EMAIL}\n**Error:** ${result.error}`
      );
    }
    return result;
  } catch (error: any) {
    await sendTeamsNotification(
      'Email Delivery Exception',
      `**Subject:** ${subject}\n**To:** ${to || TO_EMAIL}\n**Exception:** ${error?.message || error}`
    );
    return { error };
  }
}
