# Max Content Engine - Integration Guide

## Overview

The **Max Content Engine** is an autonomous AI agent built to handle all marketing content creation for ApexSalesAI. It combines OpenAI's Agent Builder (ChatKit) with custom content generation services to create blog posts, social media updates, and video content.

## Architecture

### Components

1. **OpenAI ChatKit Agent** (External)
   - Visual workflow builder
   - Conversational interface
   - Agent orchestration

2. **Content Generator Service** (`lib/services/agent/contentGenerator.ts`)
   - Blog post generation (800-3000 words)
   - Social media content (LinkedIn, Twitter, Facebook)
   - Email marketing content
   - SEO optimization
   - Auto-publishing

3. **Content Scheduler** (`lib/services/agent/contentScheduler.ts`)
   - Daily social media automation
   - Weekly blog post scheduling
   - Bi-weekly video content
   - Cron-based execution

4. **Video Generator** (`lib/services/agent/videoGenerator.ts`)
   - AI script generation
   - Integration points for Synthesia, D-ID, Runway ML
   - YouTube upload automation
   - Voiceover generation (ElevenLabs)

## Features

### ✅ Currently Implemented

- **Blog Post Generation**
  - AI-powered content creation using GPT-4o
  - SEO optimization with meta tags
  - Multiple tone options (professional, casual, technical, executive)
  - Length options (short, medium, long)
  - Auto-save to markdown files
  - Brand voice consistency

- **Social Media Content**
  - Platform-specific optimization (LinkedIn, Twitter, Facebook)
  - Hashtag generation
  - Engagement-focused copy
  - Call-to-action optimization

- **Email Marketing**
  - Subject line generation
  - Preheader text
  - Value-focused body content
  - CTA optimization

- **Scheduling System**
  - Daily social media posts (9:00 AM EST)
  - Weekly blog posts (Monday 10:00 AM EST)
  - Configurable schedules
  - Manual execution option

### 🚧 Planned Features

- **Video Generation**
  - AI script generation ✅ (implemented)
  - Synthesia/D-ID integration (pending API keys)
  - YouTube auto-upload (pending OAuth)
  - Thumbnail generation
  - Voiceover synthesis

- **Analytics & Optimization**
  - Content performance tracking
  - A/B testing
  - Topic recommendations based on engagement
  - SEO ranking monitoring

## API Endpoints

### 1. Generate Content
```
POST /api/agent/generate-content
```

**Request:**
```json
{
  "topic": "How AI Agents Transform Revenue Operations",
  "contentType": "blog",
  "tone": "professional",
  "targetAudience": "C-level executives",
  "keywords": ["AI", "revenue operations", "automation"],
  "length": "medium",
  "vertical": "SaaS",
  "autoPublish": true
}
```

**Response:**
```json
{
  "success": true,
  "contentType": "blog",
  "data": {
    "title": "...",
    "slug": "...",
    "content": "...",
    "excerpt": "...",
    "tags": [...],
    "seoMetadata": {...}
  },
  "published": true,
  "message": "Blog post generated and published successfully!"
}
```

### 2. Manage Schedules
```
GET /api/agent/schedule
```

**Response:**
```json
{
  "success": true,
  "schedules": [
    {
      "id": "daily-social",
      "name": "Daily Social Media Updates",
      "config": {...},
      "nextRun": "2025-05-15T09:00:00Z",
      "status": "active"
    }
  ]
}
```

```
POST /api/agent/schedule
```

**Actions:**
- `execute` - Run a schedule manually
- `toggle` - Enable/disable a schedule
- `update` - Update schedule configuration
- `check` - Trigger schedule check

### 3. Publish Content
```
POST /api/agent/publish-content
```

**Request:**
```json
{
  "title": "Blog post title",
  "content": "Full markdown content...",
  "excerpt": "Brief summary",
  "tags": ["tag1", "tag2"]
}
```

## Integration with OpenAI ChatKit

### Step 1: Embed ChatKit in Dashboard

Add to your dashboard component:

```tsx
import { MaxContentAgent } from '@/components/MaxContentAgent';

export default function Dashboard() {
  return (
    <div>
      <MaxContentAgent 
        agentId="your-chatkit-agent-id"
        onContentCreated={(content) => {
          console.log('Content created:', content);
        }}
      />
    </div>
  );
}
```

### Step 2: Configure ChatKit Workflow

Your ChatKit agent should:
1. Accept user input (topic, content type)
2. Call the `/api/agent/generate-content` endpoint
3. Display results to user
4. Optionally publish or schedule

### Step 3: Set Up Webhooks

Configure ChatKit to send webhooks to:
```
POST https://your-domain.vercel.app/api/agent/webhook
```

## Scheduling Setup

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/agent/schedule",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Option 2: External Cron Service

Use services like:
- **Cron-job.org**
- **EasyCron**
- **AWS EventBridge**

Configure to hit:
```
POST https://your-domain.vercel.app/api/agent/schedule
Body: { "action": "check" }
```

## Video Generation Setup

### Required API Keys

1. **Synthesia** (AI Avatar Videos)
   ```
   SYNTHESIA_API_KEY=your-key
   ```

2. **ElevenLabs** (AI Voiceovers)
   ```
   ELEVENLABS_API_KEY=your-key
   ```

3. **YouTube Data API**
   ```
   YOUTUBE_CLIENT_ID=your-client-id
   YOUTUBE_CLIENT_SECRET=your-secret
   YOUTUBE_REDIRECT_URI=your-redirect-uri
   ```

### Video Generation Flow

1. Generate script using `VideoGenerator.generateVideoScript()`
2. Create video using `VideoGenerator.generateVideo()`
3. Upload to YouTube using `VideoGenerator.uploadToYouTube()`

## Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Video Generation (Optional)
SYNTHESIA_API_KEY=...
ELEVENLABS_API_KEY=...

# YouTube Upload (Optional)
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REDIRECT_URI=...

# Social Media APIs (Optional)
LINKEDIN_ACCESS_TOKEN=...
TWITTER_API_KEY=...
FACEBOOK_PAGE_TOKEN=...
```

## Usage Examples

### Generate a Blog Post

```typescript
import { ContentGenerator } from '@lib/services/agent/contentGenerator';

const blogPost = await ContentGenerator.generateBlogPost({
  topic: 'The ROI of AI Agents in Sales',
  contentType: 'blog',
  tone: 'professional',
  length: 'medium',
  keywords: ['AI', 'ROI', 'sales automation']
});

// Auto-publish
await ContentGenerator.saveBlogPost(blogPost);
```

### Schedule Daily Social Posts

```typescript
import { ContentScheduler } from '@lib/services/agent/contentScheduler';

ContentScheduler.updateSchedule('daily-social', {
  config: {
    enabled: true,
    frequency: 'daily',
    time: '09:00',
    contentType: 'social',
    autoPublish: true
  }
});
```

### Generate Video Script

```typescript
import { VideoGenerator } from '@lib/services/agent/videoGenerator';

const script = await VideoGenerator.generateVideoScript({
  topic: 'How ApexSalesAI Transforms Revenue Operations',
  duration: 'medium',
  style: 'explainer',
  platform: 'youtube',
  voiceOver: true,
  subtitles: true
});

console.log(script.scenes);
```

## Best Practices

1. **Content Quality**
   - Review AI-generated content before publishing
   - Maintain brand voice consistency
   - Include real data and case studies

2. **SEO Optimization**
   - Use keyword research tools
   - Optimize meta descriptions
   - Include internal links

3. **Scheduling**
   - Post during peak engagement times
   - Maintain consistent posting schedule
   - Monitor performance metrics

4. **Video Content**
   - Keep videos concise (under 10 minutes)
   - Add captions for accessibility
   - Optimize thumbnails for clicks

## Monitoring & Analytics

### Track Content Performance

```typescript
// TODO: Implement analytics tracking
const analytics = await ContentAnalytics.getPerformance({
  contentType: 'blog',
  dateRange: 'last-30-days'
});

console.log(analytics.views, analytics.engagement, analytics.conversions);
```

### Monitor Schedule Execution

```typescript
const schedules = ContentScheduler.getAllSchedules();
schedules.forEach(schedule => {
  console.log(`${schedule.name}: ${schedule.status}`);
  console.log(`Next run: ${schedule.nextRun}`);
});
```

## Troubleshooting

### Content Not Publishing

1. Check OpenAI API key is set
2. Verify file permissions for blog directory
3. Check logs: `logger.info` messages

### Schedules Not Running

1. Verify cron job is configured
2. Check schedule status: `GET /api/agent/schedule`
3. Manually trigger: `POST /api/agent/schedule` with `action: "check"`

### Video Generation Failing

1. Ensure video API keys are set
2. Check API rate limits
3. Verify script format is correct

## Future Enhancements

- [ ] Multi-language support
- [ ] A/B testing for content
- [ ] Advanced analytics dashboard
- [ ] Integration with more social platforms (Instagram, TikTok)
- [ ] Podcast generation
- [ ] Interactive content (quizzes, calculators)
- [ ] Content repurposing (blog → social → video)

## Support

For issues or questions:
- Check logs in Vercel dashboard
- Review API responses
- Contact: support@apexsalesai.com
