# Sora Integration Guide - OpenAI Video Generation

## 🎯 **OVERVIEW**

This guide explains how to integrate OpenAI's Sora video generation API into ApexSalesAI's Video Generator.

---

## 📋 **PREREQUISITES**

### **1. OpenAI API Access**
- **Sora API Key** (currently in limited beta)
- **OpenAI Account** with Sora access enabled
- **Billing enabled** on OpenAI account

### **2. Environment Setup**
Add to your `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-...your-key...
SORA_API_ENDPOINT=https://api.openai.com/v1/video/generations
```

---

## 🔧 **IMPLEMENTATION STEPS**

### **Step 1: Install OpenAI SDK**

```bash
npm install openai@latest
```

### **Step 2: Create Sora API Route**

Create `/app/api/agent/generate-video/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, videoType } = await request.json();

    // Validate input
    if (!prompt || !videoType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Platform-specific settings
    const videoSpecs = {
      'youtube-short': {
        duration: 60,
        aspectRatio: '9:16',
        resolution: '1080x1920',
        fps: 30
      },
      'tiktok': {
        duration: 60,
        aspectRatio: '9:16',
        resolution: '1080x1920',
        fps: 30
      },
      'instagram-reel': {
        duration: 90,
        aspectRatio: '9:16',
        resolution: '1080x1920',
        fps: 30
      }
    };

    const specs = videoSpecs[videoType as keyof typeof videoSpecs];

    // Enhanced prompt with platform specs
    const enhancedPrompt = `${prompt}. 
      Video specifications: ${specs.aspectRatio} aspect ratio, ${specs.duration} seconds duration, 
      professional quality, smooth transitions, engaging visuals optimized for ${videoType}.`;

    // Call Sora API
    const response = await openai.videos.generate({
      model: 'sora-1.0', // Check OpenAI docs for latest model name
      prompt: enhancedPrompt,
      duration: specs.duration,
      aspect_ratio: specs.aspectRatio,
      resolution: specs.resolution,
      fps: specs.fps,
    });

    // Return video URL and metadata
    return NextResponse.json({
      success: true,
      video: {
        url: response.data[0].url,
        duration: specs.duration,
        format: videoType,
        resolution: specs.resolution,
        id: response.data[0].id,
      }
    });

  } catch (error: any) {
    console.error('Sora API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate video',
        details: error.response?.data 
      },
      { status: 500 }
    );
  }
}
```

### **Step 3: Update VideoGenerator Component**

The component is already set up! It will automatically work once the API route is created.

---

## 🎨 **SORA API PARAMETERS**

### **Available Models**
- `sora-1.0` - Latest Sora model (check OpenAI docs for current version)

### **Key Parameters**
```typescript
{
  model: string,           // Model version
  prompt: string,          // Video description (max 4000 chars)
  duration: number,        // Video length in seconds (1-60)
  aspect_ratio: string,    // '16:9', '9:16', '1:1', '4:3'
  resolution: string,      // '1080x1920', '1920x1080', etc.
  fps: number,            // Frames per second (24, 30, 60)
  style?: string,         // Optional: 'cinematic', 'realistic', 'animated'
  seed?: number,          // Optional: For reproducible results
}
```

---

## 💰 **PRICING CONSIDERATIONS**

### **Estimated Costs** (Check OpenAI pricing page for current rates)
- **60-second video**: ~$0.50 - $2.00 per generation
- **90-second video**: ~$0.75 - $3.00 per generation

### **Cost Optimization**
1. **Cache common videos**: Store frequently requested videos
2. **Implement rate limiting**: Prevent abuse
3. **Add user quotas**: Limit generations per user/day
4. **Preview mode**: Generate low-res previews first

---

## 🔐 **SECURITY BEST PRACTICES**

### **1. API Key Protection**
```typescript
// ✅ GOOD - Server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Never expose in client
});

// ❌ BAD - Never do this
// const apiKey = 'sk-proj-...'; // Hardcoded
```

### **2. Rate Limiting**
```typescript
// Add to API route
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // Limit to 5 video generations per hour per user
  const limiter = rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
  });

  try {
    await limiter.check(request, 5, 'VIDEO_GENERATION');
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // ... rest of video generation
}
```

### **3. Input Validation**
```typescript
// Sanitize user input
const sanitizePrompt = (prompt: string): string => {
  // Remove potentially harmful content
  return prompt
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?-]/g, '') // Remove special chars
    .slice(0, 4000); // Limit length
};
```

---

## 📊 **MONITORING & ANALYTICS**

### **Track Video Generations**
```typescript
// Add to API route
import { logActivity } from '@/lib/activityLogger';

await logActivity({
  type: 'video_generated',
  userId: session.user.id,
  metadata: {
    prompt: prompt.slice(0, 100),
    videoType,
    duration: specs.duration,
    cost: estimatedCost,
  }
});
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

- [ ] OpenAI API key added to environment variables
- [ ] Sora API route created and tested
- [ ] Rate limiting implemented
- [ ] Error handling added
- [ ] Cost tracking enabled
- [ ] User quotas configured
- [ ] Video storage solution ready (S3/Cloudinary)
- [ ] Analytics tracking implemented
- [ ] User notifications for completion
- [ ] Webhook for async processing (optional)

---

## 🎬 **ADVANCED FEATURES**

### **1. Async Processing with Webhooks**
For longer videos, use webhooks:

```typescript
const response = await openai.videos.generate({
  // ... params
  webhook_url: `${process.env.APP_URL}/api/webhooks/video-complete`,
  webhook_events: ['video.completed', 'video.failed'],
});
```

### **2. Video Storage**
Store generated videos in cloud storage:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function storeVideo(videoUrl: string, videoId: string) {
  const s3 = new S3Client({ region: 'us-east-1' });
  
  // Download video from Sora
  const videoBuffer = await fetch(videoUrl).then(r => r.arrayBuffer());
  
  // Upload to S3
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: `videos/${videoId}.mp4`,
    Body: Buffer.from(videoBuffer),
    ContentType: 'video/mp4',
  }));
  
  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/videos/${videoId}.mp4`;
}
```

### **3. YouTube Auto-Upload**
Integrate with YouTube API:

```typescript
import { google } from 'googleapis';

async function uploadToYouTube(videoUrl: string, metadata: any) {
  const youtube = google.youtube('v3');
  
  const response = await youtube.videos.insert({
    auth: oauth2Client,
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoUrl),
    },
  });
  
  return response.data.id;
}
```

---

## 🐛 **TROUBLESHOOTING**

### **Common Errors**

**1. "Insufficient quota"**
```
Solution: Check OpenAI billing, add payment method
```

**2. "Invalid aspect ratio"**
```
Solution: Use supported ratios: '16:9', '9:16', '1:1', '4:3'
```

**3. "Prompt too long"**
```
Solution: Limit prompt to 4000 characters
```

**4. "Generation timeout"**
```
Solution: Implement async processing with webhooks
```

---

## 📚 **RESOURCES**

- **OpenAI Sora Docs**: https://platform.openai.com/docs/guides/video
- **Sora API Reference**: https://platform.openai.com/docs/api-reference/video
- **Pricing**: https://openai.com/pricing
- **Rate Limits**: https://platform.openai.com/docs/guides/rate-limits

---

## ✅ **TESTING**

### **Test Video Generation**
```bash
curl -X POST http://localhost:3000/api/agent/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A professional explaining AI sales automation in a modern office",
    "videoType": "youtube-short"
  }'
```

### **Expected Response**
```json
{
  "success": true,
  "video": {
    "url": "https://cdn.openai.com/video/abc123.mp4",
    "duration": 60,
    "format": "youtube-short",
    "resolution": "1080x1920",
    "id": "video_abc123"
  }
}
```

---

**Ready to implement! The UI is already built and waiting for this API integration.** 🎥✨
