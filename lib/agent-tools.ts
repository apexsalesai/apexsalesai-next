// Agent Tools - External API integrations for the Autonomous Sequence Engine
import { Lead } from '../types/agent';
import { TokenRefreshService } from './token-refresh-service';
import { logger } from './logger';
import { withRetry, DEFAULT_RETRY_CONFIG } from './error-handling';

/**
 * AgentTools - Provides real-world integrations for agent actions
 * 
 * This service connects our sequence engine to external APIs for email, SMS,
 * calendar, CRM, and other tools needed for autonomous operation.
 */
export class AgentTools {
  private apiKeys: Record<string, string>;
  private tokenService: TokenRefreshService;
  private defaultUserId: number = 1; // Default user ID for development
  private defaultTenantId: number = 1; // Default tenant ID for development
  
  constructor() {
    // In production, these would be loaded from environment variables
    this.apiKeys = {
      email: process.env.EMAIL_API_KEY || '',
      sms: process.env.SMS_API_KEY || '',
      crm: process.env.CRM_API_KEY || '',
      calendar: process.env.CALENDAR_API_KEY || ''
    };
    
    // Initialize token refresh service
    this.tokenService = new TokenRefreshService();
    
    logger.info('AgentTools initialized', {
      context: 'agent_tools',
      metadata: { environment: process.env.NODE_ENV }
    });
  }
  
  /**
   * Send an email to a lead
   */
  async sendEmail(to: string, subject: string, body: string, templateId?: string): Promise<any> {
    console.log(`[EMAIL] Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    
    // In development, just log the email
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        message_id: `dev-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // In production, this would use a real email API like SendGrid or Mailgun
      // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKeys.email}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     personalizations: [{ to: [{ email: to }] }],
      //     subject,
      //     content: [{ type: 'text/html', value: body }],
      //     template_id: templateId
      //   })
      // });
      
      // return await response.json();
      
      // For now, simulate a successful response
      return {
        success: true,
        message_id: `prod-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }
  
  /**
   * Send an SMS to a lead
   */
  async sendSMS(to: string, message: string): Promise<any> {
    console.log(`[SMS] Sending SMS to ${to}`);
    console.log(`Message: ${message}`);
    
    // In development, just log the SMS
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        message_id: `dev-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // In production, this would use a real SMS API like Twilio
      // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Basic ${Buffer.from(`${accountSid}:${this.apiKeys.sms}`).toString('base64')}`,
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   body: new URLSearchParams({
      //     To: to,
      //     From: process.env.TWILIO_PHONE_NUMBER || '',
      //     Body: message
      //   }).toString()
      // });
      
      // return await response.json();
      
      // For now, simulate a successful response
      return {
        success: true,
        message_id: `prod-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error}`);
    }
  }
  
  /**
   * Book a calendar event
   */
  async bookCalendarEvent(title: string, startTime: string, endTime: string, attendees: string[], details?: string, userId?: number, tenantId?: number): Promise<any> {
    const uid = userId || this.defaultUserId;
    const tid = tenantId || this.defaultTenantId;
    
    logger.info(`Booking calendar event: ${title}`, {
      context: 'agent_tools',
      metadata: { 
        title, 
        startTime, 
        endTime, 
        attendees, 
        userId: uid, 
        tenantId: tid 
      }
    });
    
    // In development, just log the calendar event
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('Development mode: Simulating calendar booking', {
        context: 'agent_tools',
        metadata: { title, startTime, endTime, attendees }
      });
      
      return {
        success: true,
        event_id: `dev-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // Get a valid token for Microsoft 365
      const token = await this.tokenService.getValidToken('microsoft365', uid, tid);
      
      if (!token) {
        throw new Error('No valid Microsoft 365 token available');
      }
      
      // Use retry logic for the API call
      return await withRetry(
        async () => {
          // In production, this would use Microsoft Graph API
          const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              subject: title,
              start: { dateTime: startTime, timeZone: 'UTC' },
              end: { dateTime: endTime, timeZone: 'UTC' },
              attendees: attendees.map(email => ({
                emailAddress: { address: email },
                type: 'required'
              })),
              body: {
                contentType: 'text',
                content: details || ''
              }
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Microsoft Graph API error: ${response.status} ${response.statusText} - ${errorText}`);
          }
          
          return await response.json();
        },
        DEFAULT_RETRY_CONFIG,
        `book calendar event ${title}`
      );
    } catch (error) {
      logger.error('Error booking calendar event', error instanceof Error ? error : new Error(String(error)), {
        context: 'agent_tools',
        metadata: { title, userId: uid, tenantId: tid }
      });
      
      // Return a structured error response
      return {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Update lead in CRM
   */
  async updateCRMLead(leadId: number, data: Record<string, any>, userId?: number, tenantId?: number): Promise<any> {
    const uid = userId || this.defaultUserId;
    const tid = tenantId || this.defaultTenantId;
    
    logger.info(`Updating lead ${leadId} in CRM`, {
      context: 'agent_tools',
      metadata: { leadId, userId: uid, tenantId: tid, data }
    });
    
    // In development, just log the CRM update
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('Development mode: Simulating CRM update', {
        context: 'agent_tools',
        metadata: { leadId, data }
      });
      
      return {
        success: true,
        lead_id: leadId,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // Get a valid token for HubSpot
      const token = await this.tokenService.getValidToken('hubspot', uid, tid);
      
      if (!token) {
        throw new Error('No valid HubSpot token available');
      }
      
      // Use retry logic for the API call
      return await withRetry(
        async () => {
          // In production, this would use a real CRM API like HubSpot
          const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${leadId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              properties: data
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HubSpot API error: ${response.status} ${response.statusText} - ${errorText}`);
          }
          
          return await response.json();
        },
        DEFAULT_RETRY_CONFIG,
        `update CRM lead ${leadId}`
      );
    } catch (error) {
      logger.error('Error updating CRM lead', error instanceof Error ? error : new Error(String(error)), {
        context: 'agent_tools',
        metadata: { leadId, userId: uid, tenantId: tid }
      });
      
      // Return a structured error response
      return {
        success: false,
        lead_id: leadId,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Log agent action for analytics
   */
  async logAgentAction(leadId: number, actionType: string, details: Record<string, any>): Promise<any> {
    logger.info(`Logging agent action for lead ${leadId}`, {
      context: 'agent_tools',
      metadata: { leadId, actionType, details }
    });
    
    // In development, just log the action
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        action_id: `dev-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // Use retry logic for the API call
      return await withRetry(
        async () => {
          // In production, this would log to a database or analytics service
          const response = await fetch('/api/log-agent-action', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              lead_id: leadId,
              action_type: actionType,
              details,
              timestamp: new Date().toISOString()
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Log API error: ${response.status} ${response.statusText} - ${errorText}`);
          }
          
          return await response.json();
        },
        DEFAULT_RETRY_CONFIG,
        `log agent action ${actionType} for lead ${leadId}`
      );
    } catch (error) {
      logger.error('Error logging agent action', error instanceof Error ? error : new Error(String(error)), {
        context: 'agent_tools',
        metadata: { leadId, actionType }
      });
      
      // Return a structured error response but don't throw - logging failures shouldn't break the sequence
      return {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
