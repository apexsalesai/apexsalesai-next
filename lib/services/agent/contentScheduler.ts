/**
 * Content Scheduler Service
 * Automated scheduling for daily social media and weekly blog posts
 */

import { ContentGenerator, ContentGenerationRequest } from './contentGenerator';
import { logger } from '../../logger';

export interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:MM format
  contentType: 'blog' | 'social' | 'email';
  topics?: string[];
  autoPublish: boolean;
}

export interface ContentSchedule {
  id: string;
  name: string;
  config: ScheduleConfig;
  lastRun?: Date;
  nextRun?: Date;
  status: 'active' | 'paused' | 'error';
}

export class ContentScheduler {
  private static schedules: Map<string, ContentSchedule> = new Map();

  /**
   * Default schedules for ApexSalesAI content
   */
  static getDefaultSchedules(): ContentSchedule[] {
    return [
      {
        id: 'daily-social',
        name: 'Daily Social Media Updates',
        config: {
          enabled: true,
          frequency: 'daily',
          time: '09:00',
          contentType: 'social',
          topics: [
            'AI agents in sales',
            'Revenue operations tips',
            'Sales automation insights',
            'Predictive analytics',
            'Enterprise AI success stories'
          ],
          autoPublish: true
        },
        status: 'active'
      },
      {
        id: 'weekly-blog',
        name: 'Weekly Blog Posts',
        config: {
          enabled: true,
          frequency: 'weekly',
          dayOfWeek: 1, // Monday
          time: '10:00',
          contentType: 'blog',
          topics: [
            'How AI Agents Transform Revenue Operations',
            'The ROI of Autonomous Sales Execution',
            'Predictive Analytics for Sales Leaders',
            'Enterprise AI: Security and Compliance',
            'Multi-Agent Orchestration in Sales',
            'The Future of Revenue Intelligence'
          ],
          autoPublish: true
        },
        status: 'active'
      },
      {
        id: 'biweekly-video',
        name: 'Bi-weekly Video Content',
        config: {
          enabled: false, // Disabled until video generation is set up
          frequency: 'biweekly',
          dayOfWeek: 3, // Wednesday
          time: '14:00',
          contentType: 'blog', // Will be 'video' once implemented
          topics: [
            'ApexSalesAI Platform Demo',
            'AI Agent Workflows Explained',
            'Customer Success Stories',
            'Revenue Operations Best Practices'
          ],
          autoPublish: false
        },
        status: 'paused'
      }
    ];
  }

  /**
   * Initialize schedules
   */
  static initialize() {
    const defaultSchedules = this.getDefaultSchedules();
    defaultSchedules.forEach(schedule => {
      this.schedules.set(schedule.id, schedule);
      this.calculateNextRun(schedule);
    });
    
    logger.info(`Content scheduler initialized with ${this.schedules.size} schedules`);
  }

  /**
   * Calculate next run time for a schedule
   */
  static calculateNextRun(schedule: ContentSchedule): Date {
    const now = new Date();
    const [hours, minutes] = schedule.config.time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    // If time has passed today, move to next occurrence
    if (nextRun <= now) {
      switch (schedule.config.frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'biweekly':
          nextRun.setDate(nextRun.getDate() + 14);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }
    }

    // Adjust for day of week if specified
    if (schedule.config.dayOfWeek !== undefined) {
      const currentDay = nextRun.getDay();
      const targetDay = schedule.config.dayOfWeek;
      const daysUntilTarget = (targetDay - currentDay + 7) % 7;
      if (daysUntilTarget > 0) {
        nextRun.setDate(nextRun.getDate() + daysUntilTarget);
      }
    }

    schedule.nextRun = nextRun;
    return nextRun;
  }

  /**
   * Execute a scheduled content generation
   */
  static async executeSchedule(scheduleId: string): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule || !schedule.config.enabled) {
      return;
    }

    try {
      logger.info(`Executing content schedule: ${schedule.name} (${scheduleId})`);

      // Select a random topic if available
      const topics = schedule.config.topics || [];
      const topic = topics[Math.floor(Math.random() * topics.length)];

      if (!topic) {
        throw new Error('No topics configured for schedule');
      }

      const request: ContentGenerationRequest = {
        topic,
        contentType: schedule.config.contentType,
        tone: 'professional',
        length: schedule.config.contentType === 'blog' ? 'medium' : undefined,
        keywords: ['AI', 'sales', 'automation', 'revenue operations']
      };

      // Generate content based on type
      if (schedule.config.contentType === 'blog') {
        const blogPost = await ContentGenerator.generateBlogPost(request);
        
        if (schedule.config.autoPublish) {
          await ContentGenerator.saveBlogPost(blogPost);
          logger.info(`Blog post generated and published: ${blogPost.title} (${scheduleId})`);
        }
      } else if (schedule.config.contentType === 'social') {
        const socialContent = await ContentGenerator.generateSocialContent(request);
        logger.info(`Social content generated for schedule ${scheduleId}: ${Object.keys(socialContent).join(', ')}`);
        
        // TODO: Post to social media platforms
        // This would integrate with LinkedIn, Twitter, Facebook APIs
      }

      // Update schedule
      schedule.lastRun = new Date();
      this.calculateNextRun(schedule);
      schedule.status = 'active';

    } catch (error) {
      logger.error(`Error executing content schedule ${scheduleId}: ${error}`);
      schedule.status = 'error';
      throw error;
    }
  }

  /**
   * Check and run due schedules
   * This should be called by a cron job or scheduled task
   */
  static async checkAndRunSchedules(): Promise<void> {
    const now = new Date();
    
    for (const [id, schedule] of this.schedules.entries()) {
      if (!schedule.config.enabled || schedule.status !== 'active') {
        continue;
      }

      if (schedule.nextRun && schedule.nextRun <= now) {
        try {
          await this.executeSchedule(id);
        } catch (error) {
          logger.error(`Failed to execute schedule ${id}: ${error}`);
        }
      }
    }
  }

  /**
   * Get all schedules
   */
  static getAllSchedules(): ContentSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Update a schedule
   */
  static updateSchedule(id: string, updates: Partial<ContentSchedule>): void {
    const schedule = this.schedules.get(id);
    if (schedule) {
      Object.assign(schedule, updates);
      if (updates.config) {
        this.calculateNextRun(schedule);
      }
      logger.info(`Schedule updated: ${id}`);
    }
  }

  /**
   * Enable/disable a schedule
   */
  static toggleSchedule(id: string, enabled: boolean): void {
    const schedule = this.schedules.get(id);
    if (schedule) {
      schedule.config.enabled = enabled;
      schedule.status = enabled ? 'active' : 'paused';
      if (enabled) {
        this.calculateNextRun(schedule);
      }
      logger.info(`Schedule ${id} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// Initialize schedules on module load
ContentScheduler.initialize();
