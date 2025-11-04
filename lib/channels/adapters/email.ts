/**
 * Email Channel Adapter
 * 
 * Sends email campaigns via SendGrid.
 * Supports transactional emails and marketing campaigns.
 */

import { BaseChannelAdapter } from '../base';
import { PublishOptions, PublishResult } from '../types';

export class EmailAdapter extends BaseChannelAdapter {
  readonly type = 'email' as const;
  readonly name = 'Email';
  
  async publish(options: PublishOptions): Promise<PublishResult> {
    try {
      this.validateConfig(['apiKey', 'fromEmail', 'fromName']);
      
      const { apiKey, fromEmail, fromName } = this.config;
      const { title, content, channelOptions } = options;
      
      const subject = channelOptions?.subject || title || 'Newsletter';
      const preheader = channelOptions?.preheader;
      const recipients = channelOptions?.recipients || [];
      
      if (recipients.length === 0) {
        throw new Error('No recipients specified for email');
      }
      
      // SendGrid API endpoint
      const endpoint = 'https://api.sendgrid.com/v3/mail/send';
      
      // Prepare email data
      const emailData = {
        personalizations: recipients.map(email => ({
          to: [{ email }],
          subject,
        })),
        from: {
          email: fromEmail,
          name: fromName,
        },
        content: [
          {
            type: 'text/html',
            value: this.formatEmailContent(content, preheader),
          },
        ],
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(emailData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`SendGrid API error: ${error}`);
      }
      
      // SendGrid returns 202 Accepted with X-Message-Id header
      const messageId = response.headers.get('X-Message-Id');
      
      return this.createSuccessResult(
        undefined,
        messageId || undefined,
        {
          recipientCount: recipients.length,
          subject,
        }
      );
    } catch (error) {
      return this.createErrorResult(error as Error);
    }
  }
  
  async validate(): Promise<boolean> {
    try {
      this.validateConfig(['apiKey']);
      
      const { apiKey } = this.config;
      
      // Validate API key by checking account details
      const response = await fetch('https://api.sendgrid.com/v3/user/account', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Format content as HTML email with preheader
   */
  private formatEmailContent(content: string, preheader?: string): string {
    const preheaderHtml = preheader
      ? `<div style="display:none;max-height:0px;overflow:hidden;">${preheader}</div>`
      : '';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${preheaderHtml}
  <div style="background: #ffffff; padding: 30px; border-radius: 8px;">
    ${content}
  </div>
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
    <p>Sent by ApexSalesAI Marketing Studio</p>
  </div>
</body>
</html>
    `.trim();
  }
}
