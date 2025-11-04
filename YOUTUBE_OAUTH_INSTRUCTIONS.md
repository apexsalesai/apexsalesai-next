# 🎥 YouTube OAuth - Complete the Flow NOW!

**Status:** ✅ Dev server running at http://localhost:3000  
**Time:** November 3, 2025, 9:25 PM EST

---

## 🚀 **YOUR DEV SERVER IS READY!**

The app is now running at:
```
http://localhost:3000
```

---

## 📋 **COMPLETE OAUTH FLOW (5 MINUTES)**

### **Step 1: Open OAuth Start URL** 🌐

Click this link or copy to your browser:
```
http://localhost:3000/api/oauth/google/start?channel=youtube
```

**What happens:**
- You'll be redirected to Google's authorization page
- Google will ask you to sign in

---

### **Step 2: Sign In with Test Account** 👤

Use your test account:
```
Email: support@apexsalesai.com
Password: [your password]
```

**Important:** This email must match the test user in your Google Cloud Console OAuth consent screen.

---

### **Step 3: Grant Permissions** ✅

Google will ask for these permissions:
- ✅ View your YouTube account
- ✅ Manage your YouTube videos
- ✅ See, edit, and permanently delete your YouTube videos

**Click "Allow" or "Continue"**

---

### **Step 4: Copy Your Tokens** 📋

You'll be redirected to:
```
http://localhost:3000/studio/oauth-success
```

You'll see two tokens:

**Access Token:**
```
ya29.a0AfB_byC...
```
Click the copy button → Token copied!

**Refresh Token:**
```
1//0gHZ...
```
Click the copy button → Token copied!

---

### **Step 5: Add Tokens to .env.local** 📝

Open `.env.local` and update these lines:

**Find this section:**
```bash
# YouTube (Google OAuth)
YOUTUBE_ENABLED=false
GOOGLE_CLIENT_ID="780789134177-jl5go737rt1k0uootcqlepp9sp4ce1bi.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
GOOGLE_REDIRECT_URI="https://apexsalesai.com/api/oauth/google/callback"
YOUTUBE_SCOPES="https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/youtube.force-ssl"
YOUTUBE_ACCESS_TOKEN=""
YOUTUBE_REFRESH_TOKEN=""
```

**Update to:**
```bash
# YouTube (Google OAuth)
YOUTUBE_ENABLED=true
GOOGLE_CLIENT_ID="780789134177-jl5go737rt1k0uootcqlepp9sp4ce1bi.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
GOOGLE_REDIRECT_URI="https://apexsalesai.com/api/oauth/google/callback"
YOUTUBE_SCOPES="https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/youtube.force-ssl"
YOUTUBE_ACCESS_TOKEN="[paste your access token here]"
YOUTUBE_REFRESH_TOKEN="[paste your refresh token here]"
```

**Save the file!**

---

### **Step 6: Restart Dev Server** 🔄

In your terminal:
1. Press `Ctrl+C` to stop the server
2. Run: `npm run dev`
3. Wait for "Ready in..."

---

### **Step 7: Test Connection** ✅

Open in browser:
```
http://localhost:3000/api/channels/status?channel=youtube
```

**Expected response:**
```json
{
  "channel": "youtube",
  "connected": true,
  "channelInfo": {
    "title": "Your Channel Name",
    "id": "UCxxxxx",
    "subscriberCount": 123
  }
}
```

**If you see this, YOU'RE DONE!** 🎉

---

## 🎊 **WHAT YOU CAN DO NOW:**

### **1. Publish a Test Video** 🎥
```bash
curl -X POST http://localhost:3000/api/channels/publish \
  -H "Content-Type: application/json" \
  -d '{
    "channels": ["youtube"],
    "title": "Test Video from ApexSalesAI",
    "content": "This is a test video description. #test #apexsalesai",
    "tags": ["test", "apexsalesai", "automation"],
    "channelOptions": {
      "videoFile": "path/to/video.mp4",
      "privacy": "unlisted",
      "category": "22"
    }
  }'
```

### **2. Check Channel Status** 📊
```
http://localhost:3000/api/channels/status
```

### **3. View Telemetry** 📈
All YouTube uploads are logged to Dataverse in the `apex_channelpublishes` table.

---

## 🐛 **TROUBLESHOOTING**

### **"Invalid OAuth state"**
- The OAuth flow took too long (>5 minutes)
- Start over from Step 1

### **"Access denied"**
- Make sure you're using `support@apexsalesai.com`
- Verify this email is added as a test user in Google Cloud Console

### **"Token exchange failed"**
- Verify Client Secret is correct in `.env.local`
- Check that redirect URI matches exactly

### **Connection test shows "not connected"**
- Verify `YOUTUBE_ENABLED=true`
- Check that tokens are pasted completely (no truncation)
- Restart the dev server

---

## 📞 **QUICK LINKS**

- **OAuth Start:** http://localhost:3000/api/oauth/google/start?channel=youtube
- **Test Connection:** http://localhost:3000/api/channels/status?channel=youtube
- **Studio:** http://localhost:3000/studio
- **Google Cloud Console:** https://console.cloud.google.com

---

## ✅ **CHECKLIST**

- [x] Dev server running
- [x] Client ID configured
- [x] Client Secret configured
- [ ] OAuth flow completed
- [ ] Access token obtained
- [ ] Refresh token obtained
- [ ] Tokens added to .env.local
- [ ] YOUTUBE_ENABLED=true
- [ ] Dev server restarted
- [ ] Connection tested
- [ ] Test video published

---

## 🎯 **YOUR NEXT STEP:**

**Click this link NOW:**
```
http://localhost:3000/api/oauth/google/start?channel=youtube
```

**Then follow the steps above!** 🚀

---

**Need help?** See `docs/YOUTUBE_SETUP_GUIDE.md` for detailed troubleshooting.
