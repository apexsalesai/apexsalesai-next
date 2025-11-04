# YouTube Integration Setup Guide

**Last Updated:** November 3, 2025  
**Status:** ✅ OAuth Configured, Ready for Testing

---

## 🎯 **OVERVIEW**

This guide walks you through connecting your YouTube channel to ApexSalesAI for automated video publishing.

**What You'll Get:**
- ✅ Automated video uploads from Max agent
- ✅ Video metadata management (title, description, tags)
- ✅ Privacy settings control
- ✅ Category and playlist assignment
- ✅ Dataverse telemetry tracking

---

## ✅ **PREREQUISITES**

### **1. Google Cloud Project** ✅ COMPLETE
- Project: ApexSalesAI Marketing
- Client ID: `780789134177-jl5go737rt1k0uootcqlepp9sp4ce1bi.apps.googleusercontent.com`
- Client Secret: (needs to be added to .env.local)

### **2. OAuth Consent Screen** ✅ COMPLETE
- Type: External
- Status: Testing
- Test User: support@apexsalesai.com ✅

### **3. YouTube Data API v3** ✅ ENABLED
- API Status: Enabled
- Scopes:
  - `https://www.googleapis.com/auth/youtube.upload`
  - `https://www.googleapis.com/auth/youtube.readonly`
  - `https://www.googleapis.com/auth/youtube.force-ssl`

---

## 🚀 **SETUP STEPS**

### **Step 1: Add Client Secret to Environment**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Copy the **Client Secret**
5. Add to `.env.local`:

```bash
GOOGLE_CLIENT_SECRET="your_client_secret_here"
```

---

### **Step 2: Configure Redirect URI**

Verify this redirect URI is added in Google Cloud Console:

```
https://apexsalesai.com/api/oauth/google/callback
```

**How to verify:**
1. Go to: APIs & Services → Credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", ensure the above URL is listed
4. If not, click "Add URI" and save

---

### **Step 3: Start OAuth Flow**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the OAuth start URL:**
   ```
   http://localhost:3000/api/oauth/google/start?channel=youtube
   ```
   
   Or in production:
   ```
   https://apexsalesai.com/api/oauth/google/start?channel=youtube
   ```

3. **Sign in with your test account:**
   - Email: `support@apexsalesai.com`
   - This must be the email added to your OAuth consent screen test users

4. **Grant permissions:**
   - View your YouTube account
   - Manage your YouTube videos
   - See, edit, and permanently delete your YouTube videos

5. **You'll be redirected to:**
   ```
   https://apexsalesai.com/studio/oauth-success
   ```

---

### **Step 4: Copy Tokens to Environment**

On the success page, you'll see:
- **Access Token** - Valid for ~1 hour
- **Refresh Token** - Valid indefinitely (until revoked)

**Copy both tokens to `.env.local`:**

```bash
YOUTUBE_ENABLED=true
YOUTUBE_ACCESS_TOKEN="ya29.a0AfB_..."
YOUTUBE_REFRESH_TOKEN="1//0gHZ..."
```

---

### **Step 5: Restart Application**

```bash
npm run dev
```

Or deploy to Vercel:
```bash
vercel --prod
```

---

### **Step 6: Test Connection**

**Option A: Via API**
```bash
curl https://apexsalesai.com/api/channels/status?channel=youtube
```

**Expected Response:**
```json
{
  "channel": "youtube",
  "connected": true,
  "channelInfo": {
    "title": "Your Channel Name",
    "id": "UC...",
    "subscriberCount": 123
  }
}
```

**Option B: Via Browser**
Navigate to:
```
https://apexsalesai.com/api/channels/status?channel=youtube
```

---

## 🔧 **CONFIGURATION REFERENCE**

### **Environment Variables**

```bash
# YouTube (Google OAuth)
YOUTUBE_ENABLED=true
GOOGLE_CLIENT_ID="780789134177-jl5go737rt1k0uootcqlepp9sp4ce1bi.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_client_secret_here"
GOOGLE_REDIRECT_URI="https://apexsalesai.com/api/oauth/google/callback"
YOUTUBE_SCOPES="https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/youtube.force-ssl"
YOUTUBE_ACCESS_TOKEN="ya29.a0AfB_..."
YOUTUBE_REFRESH_TOKEN="1//0gHZ..."
```

### **OAuth Endpoints**

| Endpoint | Purpose |
|----------|---------|
| `/api/oauth/google/start?channel=youtube` | Initiate OAuth flow |
| `/api/oauth/google/callback` | Handle OAuth callback |
| `/studio/oauth-success` | Display tokens |
| `/api/channels/status?channel=youtube` | Test connection |

---

## 📺 **USAGE**

### **Publishing a Video**

```typescript
const response = await fetch('/api/channels/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    channels: ['youtube'],
    title: 'My Video Title',
    content: 'Video description with #hashtags',
    tags: ['marketing', 'ai', 'sales'],
    channelOptions: {
      videoFile: 'path/to/video.mp4', // or video URL
      privacy: 'public', // or 'private', 'unlisted'
      category: '22', // People & Blogs
      playlist: 'PLxxxxx', // Optional
      thumbnail: 'path/to/thumbnail.jpg', // Optional
    }
  })
});
```

### **Response**

```json
{
  "success": true,
  "results": [{
    "channel": "youtube",
    "success": true,
    "publishedUrl": "https://youtube.com/watch?v=xxxxx",
    "publishedId": "xxxxx",
    "publishedAt": "2025-11-03T20:00:00Z",
    "metadata": {
      "videoId": "xxxxx",
      "channelId": "UCxxxxx",
      "privacy": "public"
    }
  }]
}
```

---

## 🔄 **TOKEN REFRESH**

Access tokens expire after ~1 hour. The YouTube adapter will automatically refresh them using the refresh token.

**Manual Refresh (if needed):**

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=${GOOGLE_CLIENT_ID}" \
  -d "client_secret=${GOOGLE_CLIENT_SECRET}" \
  -d "refresh_token=${YOUTUBE_REFRESH_TOKEN}" \
  -d "grant_type=refresh_token"
```

---

## 🐛 **TROUBLESHOOTING**

### **Error: "Missing Google OAuth configuration"**
- Verify all environment variables are set in `.env.local`
- Restart your development server

### **Error: "Invalid OAuth state"**
- The OAuth flow took too long (>5 minutes)
- Start the flow again from `/api/oauth/google/start`

### **Error: "Token exchange failed"**
- Verify your Client Secret is correct
- Check that the redirect URI matches exactly

### **Error: "Access denied"**
- Ensure you're signing in with `support@apexsalesai.com`
- This email must be added as a test user in Google Cloud Console

### **Error: "Insufficient permissions"**
- Verify all YouTube scopes are included in `YOUTUBE_SCOPES`
- Re-authorize with the correct scopes

---

## 📊 **TELEMETRY**

Every YouTube publish event is logged to Dataverse:

```typescript
{
  channel: 'youtube',
  title: 'Video Title',
  publishedUrl: 'https://youtube.com/watch?v=xxxxx',
  publishedId: 'xxxxx',
  status: 'published',
  latencyMs: 2500,
  contentLength: 1500,
  tags: ['marketing', 'ai'],
  timestamp: '2025-11-03T20:00:00Z'
}
```

**View telemetry:**
- Dataverse table: `apex_channelpublishes`
- Filter by: `apex_channel eq 'youtube'`

---

## 🎯 **NEXT STEPS**

### **Immediate:**
1. ✅ Add Client Secret to `.env.local`
2. ✅ Complete OAuth flow
3. ✅ Test connection
4. ✅ Publish test video

### **Integration:**
1. ⏳ Wire Max agent to YouTube publishing
2. ⏳ Add YouTube to Studio UI
3. ⏳ Create video upload workflow
4. ⏳ Add thumbnail generation

### **Advanced:**
1. ⏳ Add YouTube Analytics API
2. ⏳ Track video performance
3. ⏳ Automated playlist management
4. ⏳ Comment moderation

---

## 📞 **RESOURCES**

- **Google Cloud Console:** https://console.cloud.google.com
- **YouTube Data API Docs:** https://developers.google.com/youtube/v3
- **OAuth 2.0 Playground:** https://developers.google.com/oauthplayground
- **YouTube API Explorer:** https://developers.google.com/youtube/v3/docs

---

## ✅ **CHECKLIST**

- [x] Google Cloud Project created
- [x] OAuth consent screen configured
- [x] YouTube Data API v3 enabled
- [x] Client ID obtained
- [ ] Client Secret added to `.env.local`
- [ ] OAuth flow completed
- [ ] Tokens added to `.env.local`
- [ ] Connection tested
- [ ] Test video published

---

**Status:** 🟡 **READY FOR OAUTH FLOW** (waiting for Client Secret)  
**Next:** Complete OAuth flow and test video upload
