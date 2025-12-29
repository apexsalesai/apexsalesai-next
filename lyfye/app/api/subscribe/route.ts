import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = SubscribeSchema.parse(body);

    const provider = process.env.NEWSLETTER_PROVIDER || 'mailchimp';

    // Provider-specific logic
    switch (provider) {
      case 'mailchimp':
        if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_AUDIENCE_ID) {
          console.warn('Mailchimp credentials not configured');
          return NextResponse.json(
            { message: 'Subscription service not configured. Please contact support.' },
            { status: 500 }
          );
        }

        const mailchimpServer = process.env.MAILCHIMP_API_KEY.split('-')[1];
        const mailchimpUrl = `https://${mailchimpServer}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`;

        const mailchimpResponse = await fetch(mailchimpUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: name ? { FNAME: name } : {},
          }),
        });

        if (!mailchimpResponse.ok) {
          const error = await mailchimpResponse.json();
          console.error('Mailchimp error:', error);

          if (error.title === 'Member Exists') {
            return NextResponse.json(
              { message: 'This email is already subscribed.' },
              { status: 400 }
            );
          }

          throw new Error('Failed to subscribe');
        }
        break;

      case 'convertkit':
        if (!process.env.CONVERTKIT_API_KEY || !process.env.CONVERTKIT_FORM_ID) {
          console.warn('ConvertKit credentials not configured');
          return NextResponse.json(
            { message: 'Subscription service not configured. Please contact support.' },
            { status: 500 }
          );
        }

        const convertkitResponse = await fetch(
          `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: process.env.CONVERTKIT_API_KEY,
              email,
              first_name: name,
            }),
          }
        );

        if (!convertkitResponse.ok) {
          throw new Error('Failed to subscribe');
        }
        break;

      default:
        // Fallback: log to file in development
        if (process.env.NODE_ENV === 'development') {
          const fs = await import('fs');
          const path = await import('path');
          const logPath = path.join(process.cwd(), 'newsletter-subscribers.log');
          fs.appendFileSync(
            logPath,
            `${new Date().toISOString()} - ${email} ${name ? `(${name})` : ''}\n`
          );
          console.log('Newsletter subscription logged:', email);
        }
    }

    return NextResponse.json(
      { message: 'Successfully subscribed! Check your email for confirmation.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid email address', errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Subscribe error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
