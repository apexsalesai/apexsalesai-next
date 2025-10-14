# Max Content Engine - Quick Start Guide

## 🚀 Get Max Creating Content in 5 Minutes

### Step 1: Test the API (Right Now!)

Open PowerShell and run:

```powershell
$body = @{
    topic = "How AI Agents Transform Sales Teams"
    contentType = "blog"
    autoPublish = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://apexsalesai-next-prod.vercel.app/api/agent/generate-content" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

**What happens:**
- ✅ Max generates a 1500-2000 word blog post
- ✅ Saves it to `app/blog/how-ai-agents-transform-sales-teams.md`
- ✅ Returns full content with SEO metadata

---

### Step 2: View Max in Your Dashboard

**URL:** https://apexsalesai-next-prod.vercel.app/dashboard/operator-agent-fixed

**What you'll see:**
- 🤖 **Max Content Agent** - Full UI with scheduling
- ✨ **Content Generator Panel** - Simple form to create content

---

### Step 3: Generate Social Media Posts

```powershell
$body = @{
    topic = "The ROI of AI Sales Agents"
    contentType = "social"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://apexsalesai-next-prod.vercel.app/api/agent/generate-content" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

**Returns:**
- LinkedIn post (professional, 300 chars)
- Twitter thread (engaging, 280 chars per tweet)
- Facebook post (conversational, 500 chars)

---

### Step 4: Check Schedules

```powershell
Invoke-RestMethod -Uri "https://apexsalesai-next-prod.vercel.app/api/agent/schedule"
```

**Shows:**
- Daily social media (9:00 AM EST)
- Weekly blog posts (Monday 10:00 AM EST)
- Bi-weekly videos (Wednesday 2:00 PM EST)

---

### Step 5: Enable Automated Posting

**Option A: Vercel Cron (Recommended)**

1. Create `vercel.json` in root:
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

2. Commit and push:
```bash
git add vercel.json
git commit -m "feat: add cron job for content scheduling"
git push origin main
```

**Option B: External Cron Service**

Use https://cron-job.org:
- URL: `https://apexsalesai-next-prod.vercel.app/api/agent/schedule`
- Method: POST
- Body: `{"action": "check"}`
- Schedule: Every hour

---

## 🎯 What Each Component Does

### **MaxContentAgent** (Full UI)
- Chat interface for Max
- Schedule management (enable/disable)
- Content history
- Performance stats

### **ContentGeneratorPanel** (Simple Form)
- Topic input
- Content type selector (blog/social/email)
- Tone and length options
- One-click generation

---

## 📝 Example: Generate Your First Blog Post

**In the dashboard:**

1. Scroll to "AI Content Generator" section
2. Enter topic: `"The Future of Autonomous Sales"`
3. Select: **Blog**, **Professional**, **Medium**
4. Add keywords: `AI, sales, automation`
5. Check "Auto-publish to blog"
6. Click **"✨ Generate Content"**

**Result:**
- Blog post created in ~30 seconds
- Saved to `app/blog/the-future-of-autonomous-sales.md`
- Viewable at `/blog/the-future-of-autonomous-sales`

---

## 🎥 Video Generation (Coming Soon)

**Generate a video script:**

```powershell
$body = @{
    topic = "ApexSalesAI Platform Demo"
    duration = "medium"
    style = "explainer"
    platform = "youtube"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://apexsalesai-next-prod.vercel.app/api/agent/generate-video-script" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

**To enable full video generation:**
1. Sign up for Synthesia ($30/month)
2. Add API key to Vercel: `SYNTHESIA_API_KEY`
3. Videos will auto-generate and upload to YouTube

---

## 🔧 Troubleshooting

### "OpenAI API key not set"
Add to Vercel environment variables:
```
OPENAI_API_KEY=sk-...
```

### "Content not publishing"
Check file permissions:
```bash
ls -la app/blog/
```

### "Schedule not running"
Verify cron job is configured in Vercel dashboard

---

## 📚 Full Documentation

See `docs/MAX_CONTENT_ENGINE.md` for:
- Complete API reference
- Integration guides
- Advanced configuration
- Video generation setup

---

## 🎉 You're Ready!

Max is now:
- ✅ Generating blog posts on demand
- ✅ Creating social media content
- ✅ Ready for automated scheduling
- ✅ Prepared for video generation

**Next:** Set up the cron job and watch Max create content automatically! 🚀
