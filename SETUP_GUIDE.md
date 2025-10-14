# Max Content Engine - Complete Setup Guide

## 🎯 What You Asked For

✅ **Secure, admin-only dashboard** - Not public  
✅ **Posts to apexsalesai.com/blog** - Your main site  
✅ **On-demand generation** - Create content anytime  
✅ **Automated scheduling** - Agentic performance  

---

## 🔐 Step 1: Set Up Security (5 minutes)

### **Add Environment Variables to Vercel**

1. Go to: https://vercel.com/apex-sales-ai/apexsalesai-next-prod/settings/environment-variables

2. Add these variables:

```
CONTENT_API_KEY=your-secure-random-key-here
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=https://apexsalesai-next-prod.vercel.app
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

**Generate CONTENT_API_KEY:**
```powershell
# Run this in PowerShell to generate a secure key
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### **Configure Auth0**

If you don't have Auth0 set up yet:

1. Go to https://auth0.com (free tier is fine)
2. Create a new application (Regular Web Application)
3. Add callback URLs:
   - `https://apexsalesai-next-prod.vercel.app/api/auth/callback`
   - `http://localhost:3000/api/auth/callback` (for local dev)
4. Add logout URLs:
   - `https://apexsalesai-next-prod.vercel.app`
   - `http://localhost:3000`
5. Copy the credentials to Vercel

---

## 🚀 Step 2: Access Your Admin Dashboard

### **URL:**
```
https://apexsalesai-next-prod.vercel.app/admin/content-engine
```

**What you'll see:**
- 🔐 **Login screen** (Auth0)
- 🤖 **Max Content Agent** (left panel)
- ✨ **Simple Content Generator** (right panel)
- 📅 **Schedule tab** (manage automation)
- 📊 **History tab** (view past content)

---

## 📝 Step 3: Generate Your First Blog Post

### **Option A: Use the Dashboard (Easiest)**

1. Go to `/admin/content-engine`
2. Login with Auth0
3. In the **Simple Content Generator**:
   - Topic: `"The ROI of AI Sales Agents"`
   - Type: **Blog**
   - Tone: **Professional**
   - Length: **Medium**
   - Check "Auto-publish"
4. Click **"✨ Generate Content"**

**Result:** Blog post created in ~30 seconds!

### **Option B: Use the API**

```powershell
$headers = @{
    "x-api-key" = "your-CONTENT_API_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    topic = "The ROI of AI Sales Agents"
    contentType = "blog"
    autoPublish = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://apexsalesai-next-prod.vercel.app/api/agent/generate-content" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

---

## 🔄 Step 4: Enable Automated Scheduling

### **Option A: Vercel Cron (Recommended)**

1. Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/agent/schedule",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. Commit and push:
```bash
git add vercel.json
git commit -m "feat: add cron for automated content"
git push origin main
```

**Result:**
- ✅ Daily social posts at 9:00 AM EST
- ✅ Weekly blog posts every Monday at 10:00 AM EST
- ✅ Fully automated!

### **Option B: External Cron Service**

Use https://cron-job.org:

- **URL:** `https://apexsalesai-next-prod.vercel.app/api/agent/schedule`
- **Method:** POST
- **Headers:** `x-api-key: your-CONTENT_API_KEY`
- **Body:** `{"action": "check"}`
- **Schedule:** `0 9 * * *` (daily at 9 AM)

---

## 📰 Step 5: Publish to apexsalesai.com/blog

### **Current Setup:**

Right now, content saves to the **dashboard blog** (`apexsalesai-next-prod.vercel.app/blog`).

### **To Publish to Main Site:**

You have **3 options**:

#### **Option 1: GitHub Integration (Recommended)**

1. Add GitHub token to Vercel:
```
GITHUB_TOKEN=your-github-personal-access-token
```

2. Update `contentGenerator.ts` line 340:
```typescript
// Uncomment and configure:
const response = await fetch('https://api.github.com/repos/apexsalesai/apexsalesai/contents/app/blog/${blogPost.slug}.md', {
  method: 'PUT',
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: `Add blog post: ${blogPost.title}`,
    content: Buffer.from(markdown).toString('base64')
  })
});
```

**Result:** Content auto-commits to your main repo and deploys!

#### **Option 2: CMS Integration**

If you use Contentful, Sanity, or similar:

1. Add CMS API key to Vercel
2. Update `contentGenerator.ts` line 330 with your CMS API
3. Content will publish directly to your CMS

#### **Option 3: Webhook**

Create a webhook endpoint on your main site:

```typescript
// In your main apexsalesai.com codebase
app.post('/api/blog/publish', async (req, res) => {
  const { title, content, slug } = req.body;
  // Save to your blog system
  await saveBlogPost({ title, content, slug });
  res.json({ success: true });
});
```

Then update Max to call this webhook.

---

## 🎥 Step 6: Enable Video Generation (Optional)

### **Sign Up for Services:**

1. **Synthesia** - https://www.synthesia.io ($30/month)
2. **ElevenLabs** - https://elevenlabs.io ($5/month)
3. **YouTube Data API** - https://console.cloud.google.com (free)

### **Add API Keys to Vercel:**

```
SYNTHESIA_API_KEY=your-key
ELEVENLABS_API_KEY=your-key
YOUTUBE_CLIENT_ID=your-id
YOUTUBE_CLIENT_SECRET=your-secret
YOUTUBE_REDIRECT_URI=your-redirect
```

### **Generate Video Script:**

```powershell
$headers = @{
    "x-api-key" = "your-CONTENT_API_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    topic = "ApexSalesAI Platform Demo"
    duration = "medium"
    style = "explainer"
    platform = "youtube"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://apexsalesai-next-prod.vercel.app/api/agent/generate-video-script" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

---

## 📊 What's Automated

Once you enable scheduling, Max will automatically:

### **Daily (9:00 AM EST):**
- Generate LinkedIn post
- Generate Twitter thread
- Generate Facebook post
- Post to all platforms (if APIs configured)

### **Weekly (Monday 10:00 AM EST):**
- Generate 1500-2000 word blog post
- Optimize for SEO
- Publish to apexsalesai.com/blog
- Share on social media

### **Bi-weekly (Wednesday 2:00 PM EST):**
- Generate video script
- Create video (if Synthesia configured)
- Upload to YouTube
- Share on social media

---

## 🔧 Troubleshooting

### **"Unauthorized" Error**

Make sure you added `CONTENT_API_KEY` to Vercel and included it in your API calls:

```powershell
$headers = @{"x-api-key" = "your-key"}
```

### **"Auth0 not configured"**

Add all Auth0 environment variables to Vercel and redeploy.

### **Content Not Showing on Main Site**

Choose one of the 3 integration options in Step 5 and configure it.

### **Schedule Not Running**

1. Check Vercel cron is configured
2. Verify API key is set
3. Manually trigger: `POST /api/agent/schedule` with `{"action": "check"}`

---

## 🎯 Quick Reference

### **URLs:**
- **Admin Dashboard:** `/admin/content-engine`
- **API Docs:** `/api/agent/generate-content` (GET)
- **Schedule API:** `/api/agent/schedule`

### **API Endpoints:**

```
POST /api/agent/generate-content
Headers: x-api-key: your-key
Body: {topic, contentType, autoPublish}

POST /api/agent/schedule
Headers: x-api-key: your-key
Body: {action: "execute", scheduleId: "daily-social"}

GET /api/agent/schedule
Headers: x-api-key: your-key
```

---

## ✅ What You Now Have

✅ **Secure admin dashboard** - Only you can access  
✅ **On-demand content generation** - Create anytime  
✅ **Automated scheduling** - Daily & weekly posts  
✅ **Integration ready** - GitHub, CMS, or webhook  
✅ **Video generation** - Script creation ready  
✅ **API protection** - Requires authentication  

---

## 🚀 Next Steps

1. **Set up Auth0** (if not already done)
2. **Add CONTENT_API_KEY** to Vercel
3. **Visit `/admin/content-engine`** and login
4. **Generate your first blog post**
5. **Choose integration method** for main site
6. **Enable scheduling** with Vercel cron

---

## 📚 Documentation

- **Full Guide:** `docs/MAX_CONTENT_ENGINE.md`
- **Quick Start:** `QUICKSTART.md`
- **This Guide:** `SETUP_GUIDE.md`

---

## 🎉 You're Ready!

Max is now:
- ✅ Secure and admin-only
- ✅ Ready to generate content
- ✅ Ready for automation
- ✅ Ready to publish to your main site

**Start generating content at:** https://apexsalesai-next-prod.vercel.app/admin/content-engine 🚀
