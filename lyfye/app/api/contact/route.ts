import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = ContactSchema.parse(body);

    // Check if SMTP is configured
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !process.env.CONTACT_EMAIL_TO
    ) {
      console.warn('SMTP not configured, logging contact submission');

      // In development, log to file
      if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs');
        const path = await import('path');
        const logPath = path.join(process.cwd(), 'contact-submissions.log');
        fs.appendFileSync(
          logPath,
          `${new Date().toISOString()}\nName: ${name}\nEmail: ${email}\n${
            company ? `Company: ${company}\n` : ''
          }Message: ${message}\n\n---\n\n`
        );
      }

      return NextResponse.json(
        {
          message:
            'Thank you for your message. Contact form is in development mode. Please email us directly at hello@lyfye.com',
        },
        { status: 200 }
      );
    }

    // Create transporter for Microsoft 365 SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email to company
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting Lyfye',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Lyfye. We've received your message and will get back to you shortly.</p>
        <p>Best regards,<br>The Lyfye Team</p>
      `,
    });

    return NextResponse.json(
      { message: 'Thank you! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Please check your input', errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later or email us directly.' },
      { status: 500 }
    );
  }
}
