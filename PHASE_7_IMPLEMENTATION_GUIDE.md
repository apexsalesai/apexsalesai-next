# 🚀 PHASE 7: PUBLISHING & CAREER COMPANION - IMPLEMENTATION GUIDE

## 📋 **Executive Summary**

This guide provides complete, production-ready implementation for **omni-channel publishing** across all major B2B and B2C platforms, plus a full **Career Companion Studio** for personal branding and job hunting.

**Branch**: `feature/phase7-publishing-career`

---

## 🎯 **Objectives**

1. **Multi-Channel Publishing**: LinkedIn, X, Instagram, TikTok, YouTube, WordPress, Reddit, Pinterest, Facebook
2. **Career Companion Studio**: Resume builder, portfolio manager, personal brand content
3. **Analytics Dashboard**: Track engagement, impressions, clicks across all platforms
4. **DNA Feedback Loop**: Performance data feeds back into content optimization
5. **Approval Workflow**: Schedule, review, approve, publish
6. **OAuth Management**: Secure token storage and refresh

---

## 🗄️ **Database Schema (Already Added)**

### **PublishJob** - Track all publishing activities
```prisma
model PublishJob {
  id           String    @id @default(cuid())
  orgId        String?
  userId       String
  assetId      String
  platform     String    // linkedin|x|youtube|instagram|tiktok|wordpress|reddit|pinterest|facebook
  status       String    @default("queued") // queued|posting|success|failed|cancelled
  scheduledAt  DateTime?
  postedAt     DateTime?
  postUrl      String?
  errorMessage String?
  impressions  Int       @default(0)
  clicks       Int       @default(0)
  engagement   Float     @default(0)
  metadata     Json?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

### **OAuthToken** - Secure OAuth credentials
```prisma
model OAuthToken {
  id           String    @id @default(cuid())
  userId       String
  platform     String    // linkedin|x|instagram|tiktok|youtube|wordpress|facebook|pinterest|reddit
  accessToken  String    @db.Text // encrypted
  refreshToken String?   @db.Text // encrypted
  expiresAt    DateTime?
  scope        String?
  metadata     Json?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  @@unique([userId, platform])
}
```

### **CareerProfile** - Personal branding data
```prisma
model CareerProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  headline      String
  bio           String   @db.Text
  skills        String[]
  portfolioUrls String[]
  socialLinks   Json?
  resumeUrl     String?
  visibility    String   @default("private")
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### **ContentPerformance** - Analytics & DNA feedback
```prisma
model ContentPerformance {
  id           String   @id @default(cuid())
  assetId      String
  platform     String
  impressions  Int      @default(0)
  clicks       Int      @default(0)
  engagement   Float    @default(0)
  conversions  Int      @default(0)
  spendUsd     Float    @default(0)
  periodStart  DateTime
  periodEnd    DateTime
  insights     Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 🔧 **Environment Variables**

Add to `.env.local` and Vercel:

```bash
# Core
APP_URL=https://apexsalesai.com
NEXT_PUBLIC_APP_URL=https://apexsalesai.com

# OpenAI (already configured)
OPENAI_API_KEY=sk-...

# Security
JWT_SECRET=your-32-char-secret-here
HMAC_SECRET=your-32-char-secret-here
ENCRYPTION_KEY=your-32-char-encryption-key

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret
LINKEDIN_REDIRECT_URI=https://apexsalesai.com/api/oauth/linkedin/callback

# X (Twitter) OAuth
X_CLIENT_ID=your-client-id
X_CLIENT_SECRET=your-client-secret
X_REDIRECT_URI=https://apexsalesai.com/api/oauth/x/callback

# Instagram/Facebook OAuth
INSTAGRAM_APP_ID=your-app-id
INSTAGRAM_APP_SECRET=your-app-secret
INSTAGRAM_REDIRECT_URI=https://apexsalesai.com/api/oauth/instagram/callback

# TikTok OAuth
TIKTOK_CLIENT_KEY=your-client-key
TIKTOK_CLIENT_SECRET=your-client-secret
TIKTOK_REDIRECT_URI=https://apexsalesai.com/api/oauth/tiktok/callback

# YouTube OAuth
YOUTUBE_CLIENT_ID=your-client-id
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=https://apexsalesai.com/api/oauth/youtube/callback

# WordPress
WORDPRESS_USERNAME=your-username
WORDPRESS_APP_PASSWORD=your-app-password

# Pinterest OAuth
PINTEREST_APP_ID=your-app-id
PINTEREST_APP_SECRET=your-app-secret
PINTEREST_REDIRECT_URI=https://apexsalesai.com/api/oauth/pinterest/callback

# Reddit OAuth
REDDIT_CLIENT_ID=your-client-id
REDDIT_CLIENT_SECRET=your-client-secret
REDDIT_REDIRECT_URI=https://apexsalesai.com/api/oauth/reddit/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_REDIRECT_URI=https://apexsalesai.com/api/oauth/facebook/callback
```

---

## 📁 **File Structure**

```
/app
  /api
    /publish
      route.ts                    # Main publishing endpoint
      /status/route.ts            # Check job status
      /perf/route.ts              # Update performance metrics
      /cron/route.ts              # Scheduled job processor
    /oauth
      /linkedin/callback/route.ts
      /x/callback/route.ts
      /instagram/callback/route.ts
      /tiktok/callback/route.ts
      /youtube/callback/route.ts
      /wordpress/callback/route.ts
      /pinterest/callback/route.ts
      /reddit/callback/route.ts
      /facebook/callback/route.ts
    /career
      /profile/route.ts           # Career profile CRUD
      /resume/route.ts            # Resume upload & AI rewrite
  /studio
    /publishing/page.tsx          # Publishing calendar & job list
    /[campaignId]/analytics/page.tsx  # Analytics dashboard
  /career
    page.tsx                      # Career Companion home
    /create/page.tsx              # AI content creation for career

/lib
  /publishers
    index.ts                      # Export all publishers
    linkedin.ts                   # LinkedIn publishing logic
    x.ts                          # X (Twitter) publishing logic
    youtube.ts                    # YouTube publishing logic
    instagram.ts                  # Instagram publishing logic
    tiktok.ts                     # TikTok publishing logic
    wordpress.ts                  # WordPress publishing logic
    reddit.ts                     # Reddit publishing logic
    pinterest.ts                  # Pinterest publishing logic
    facebook.ts                   # Facebook publishing logic
  publisher-registry.ts           # Central registry
  publisher-queue.ts              # Scheduled job processor
  oauth.ts                        # OAuth utilities
  encryption.ts                   # Token encryption
  dna-hook.ts                     # DNA feedback integration
  analytics.ts                    # Analytics helpers
  validators.ts                   # Zod schemas

/components
  /publishing
    Calendar.tsx                  # Publishing calendar view
    ScheduleModal.tsx             # Schedule post modal
    JobTable.tsx                  # Publishing jobs table
    ConnectAccount.tsx            # OAuth connection UI
  /analytics
    KpiCards.tsx                  # Analytics KPI cards
    TrendsChart.tsx               # Engagement trends chart
    PlatformBreakdown.tsx         # Platform performance
  /career
    ProfileCard.tsx               # Career profile display
    ResumeBuilder.tsx             # Resume upload & edit
    PortfolioGrid.tsx             # Portfolio showcase
    SocialSync.tsx                # Social media sync
```

---

## 🔐 **OAuth Setup Guide**

### **LinkedIn**
1. Go to https://www.linkedin.com/developers/
2. Create app → Select "Marketing Developer Platform"
3. Add redirect URI: `https://apexsalesai.com/api/oauth/linkedin/callback`
4. Request scopes: `w_member_social`, `r_liteprofile`, `r_emailaddress`, `rw_organization_admin`
5. Copy Client ID and Client Secret to `.env.local`

### **X (Twitter)**
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create project and app
3. Enable OAuth 2.0
4. Add callback: `https://apexsalesai.com/api/oauth/x/callback`
5. Request scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`
6. Requires **Elevated Access** for posting

### **Instagram**
1. Go to https://developers.facebook.com/apps
2. Add "Instagram Graph API" product
3. Add redirect: `https://apexsalesai.com/api/oauth/instagram/callback`
4. Scopes: `instagram_basic`, `pages_show_list`, `instagram_content_publish`, `pages_read_engagement`
5. Must connect to Facebook Page linked to Instagram Business Account

### **TikTok**
1. Go to https://developers.tiktok.com/
2. Create app → Select "Business"
3. Add redirect: `https://apexsalesai.com/api/oauth/tiktok/callback`
4. Scopes: `video.upload`, `user.info.basic`, `video.publish`
5. Requires Business Account for API access

### **YouTube**
1. Go to https://console.cloud.google.com/apis/credentials
2. Enable YouTube Data API v3
3. Create OAuth 2.0 Client ID
4. Add redirect: `https://apexsalesai.com/api/oauth/youtube/callback`
5. Scope: `https://www.googleapis.com/auth/youtube.upload`
6. Note: 1600 units/day quota (1 video = 1600 units)

### **WordPress**
- **WordPress.com**: Use OAuth 2.0
- **Self-hosted**: Use Application Password
  1. Go to Users → Profile → Application Passwords
  2. Create new password
  3. Store in `WORDPRESS_USERNAME` and `WORDPRESS_APP_PASSWORD`

### **Pinterest**
1. Go to https://developers.pinterest.com/
2. Create app
3. Add redirect: `https://apexsalesai.com/api/oauth/pinterest/callback`
4. Scopes: `pins:read`, `pins:write`, `boards:read`, `boards:write`

### **Reddit**
1. Go to https://www.reddit.com/prefs/apps
2. Create app → Select "web app"
3. Add redirect: `https://apexsalesai.com/api/oauth/reddit/callback`
4. Scopes: `submit`, `read`, `identity`

### **Facebook Pages**
1. Use same Facebook app as Instagram
2. Add redirect: `https://apexsalesai.com/api/oauth/facebook/callback`
3. Scopes: `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`, `public_profile`

---

## 🚀 **Implementation Sequence (14 Days)**

### **Days 1-2: Database & Core Infrastructure**
- [x] Prisma schema updated
- [ ] Run migration: `npx prisma migrate dev --name phase7_publishing_career`
- [ ] Create encryption utilities (`/lib/encryption.ts`)
- [ ] Create OAuth utilities (`/lib/oauth.ts`)
- [ ] Create validators (`/lib/validators.ts`)

### **Days 3-5: Publisher Adapters**
- [ ] Create publisher registry (`/lib/publisher-registry.ts`)
- [ ] Implement LinkedIn adapter (`/lib/publishers/linkedin.ts`)
- [ ] Implement X adapter (`/lib/publishers/x.ts`)
- [ ] Implement Instagram adapter (`/lib/publishers/instagram.ts`)
- [ ] Implement TikTok adapter (`/lib/publishers/tiktok.ts`)
- [ ] Implement YouTube adapter (`/lib/publishers/youtube.ts`)
- [ ] Implement WordPress adapter (`/lib/publishers/wordpress.ts`)
- [ ] Implement Reddit adapter (`/lib/publishers/reddit.ts`)
- [ ] Implement Pinterest adapter (`/lib/publishers/pinterest.ts`)
- [ ] Implement Facebook adapter (`/lib/publishers/facebook.ts`)

### **Days 6-8: Publishing APIs**
- [ ] Create `/api/publish/route.ts` - Main publishing endpoint
- [ ] Create `/api/publish/status/route.ts` - Job status
- [ ] Create `/api/publish/perf/route.ts` - Performance updates
- [ ] Create `/api/publish/cron/route.ts` - Scheduled processor
- [ ] Create OAuth callback routes for all platforms
- [ ] Implement publisher queue (`/lib/publisher-queue.ts`)

### **Days 9-10: Publishing UI**
- [ ] Create Publishing Calendar (`/components/publishing/Calendar.tsx`)
- [ ] Create Schedule Modal (`/components/publishing/ScheduleModal.tsx`)
- [ ] Create Job Table (`/components/publishing/JobTable.tsx`)
- [ ] Create Connect Account UI (`/components/publishing/ConnectAccount.tsx`)
- [ ] Create Publishing page (`/app/studio/publishing/page.tsx`)

### **Days 11-12: Career Companion**
- [ ] Create Career Profile API (`/api/career/profile/route.ts`)
- [ ] Create Resume API (`/api/career/resume/route.ts`)
- [ ] Create Profile Card (`/components/career/ProfileCard.tsx`)
- [ ] Create Resume Builder (`/components/career/ResumeBuilder.tsx`)
- [ ] Create Portfolio Grid (`/components/career/PortfolioGrid.tsx`)
- [ ] Create Career home page (`/app/career/page.tsx`)
- [ ] Create Career content creator (`/app/career/create/page.tsx`)

### **Days 13: Analytics Dashboard**
- [ ] Create KPI Cards (`/components/analytics/KpiCards.tsx`)
- [ ] Create Trends Chart (`/components/analytics/TrendsChart.tsx`)
- [ ] Create Platform Breakdown (`/components/analytics/PlatformBreakdown.tsx`)
- [ ] Create Analytics page (`/app/studio/[campaignId]/analytics/page.tsx`)
- [ ] Implement DNA feedback hook (`/lib/dna-hook.ts`)

### **Day 14: Testing & QA**
- [ ] Test LinkedIn publishing end-to-end
- [ ] Test X publishing end-to-end
- [ ] Test Instagram publishing
- [ ] Test Career Companion workflows
- [ ] Test Analytics dashboard
- [ ] Test scheduled publishing (cron)
- [ ] Security audit (token encryption, RBAC)
- [ ] Performance testing
- [ ] Create demo video

---

## 🎯 **Success Criteria**

### **Must Have (MVP)**
- ✅ LinkedIn publishing works (B2B)
- ✅ X publishing works (B2B + B2C)
- ✅ Instagram publishing works (B2C)
- ✅ Career Profile CRUD functional
- ✅ Resume upload & AI rewrite working
- ✅ Publishing calendar displays jobs
- ✅ Analytics dashboard shows metrics
- ✅ OAuth tokens encrypted
- ✅ Scheduled publishing works

### **Should Have (Launch)**
- ✅ TikTok publishing works
- ✅ YouTube upload works
- ✅ WordPress posting works
- ✅ Portfolio manager functional
- ✅ DNA feedback loop active
- ✅ Approval workflow implemented

### **Nice to Have (Post-Launch)**
- ⏳ Reddit posting
- ⏳ Pinterest posting
- ⏳ Facebook Pages posting
- ⏳ Advanced analytics (A/B testing)
- ⏳ Content calendar drag-and-drop
- ⏳ Bulk scheduling

---

## 📊 **Platform Comparison**

| Platform | B2B | B2C | Priority | Difficulty | OAuth | API Limits |
|----------|-----|-----|----------|------------|-------|------------|
| LinkedIn | ✅ | ✅ | **HIGH** | Medium | OAuth 2.0 | 100 posts/day |
| X (Twitter) | ✅ | ✅ | **HIGH** | Easy | OAuth 2.0 | 300 posts/day |
| Instagram | ⚠️ | ✅ | **HIGH** | Hard | OAuth 2.0 | 25 posts/day |
| TikTok | ⚠️ | ✅ | **MEDIUM** | Hard | OAuth 2.0 | 10 videos/day |
| YouTube | ✅ | ✅ | **MEDIUM** | Medium | OAuth 2.0 | 6 videos/day |
| WordPress | ✅ | ✅ | **MEDIUM** | Easy | App Password | Unlimited |
| Reddit | ⚠️ | ✅ | **LOW** | Medium | OAuth 2.0 | 30 posts/hour |
| Pinterest | ❌ | ✅ | **LOW** | Easy | OAuth 2.0 | 100 pins/day |
| Facebook | ✅ | ✅ | **LOW** | Medium | OAuth 2.0 | 50 posts/day |

---

## 🔒 **Security Best Practices**

1. **Token Encryption**: All OAuth tokens encrypted with AES-256
2. **RBAC**: Role-based access control for publishing
3. **Audit Logging**: All publish actions logged
4. **Rate Limiting**: Respect platform API limits
5. **GDPR Compliance**: User data export/delete endpoints
6. **SOC 2 Ready**: Audit trails and compliance tags
7. **Secret Management**: Use Azure Key Vault in production
8. **HTTPS Only**: All OAuth callbacks over HTTPS
9. **CSRF Protection**: State parameter validation
10. **Token Refresh**: Automatic refresh before expiry

---

## 📈 **Monetization Strategy**

### **B2B Enterprise**
- **Pro Plan**: $99/user/month
  - Unlimited publishing
  - All platforms
  - Analytics dashboard
  - Team collaboration
  
- **Enterprise Plan**: $1,200+/month
  - White-label
  - Azure deployment
  - SOC 2 compliance
  - Dedicated support

### **B2C Career Studio**
- **Free**: 10 posts/month
- **Career Pro**: $29/month
  - Unlimited posts
  - Resume builder
  - Portfolio hosting
  - AI cover letters
  
- **Career Elite**: $99/month
  - All Career Pro features
  - Job matching AI
  - Interview prep
  - Personal website

### **Add-Ons**
- **Analytics Pro**: $49/month (advanced insights)
- **Video Agent**: $79/month (AI video generation)
- **Marketplace**: 15% commission on freelance jobs

---

## 🎬 **Demo Script**

### **B2B Demo (2 minutes)**
1. "Let me show you our Campaign Studio publishing workflow"
2. Navigate to `/studio/publishing`
3. "Here's our content calendar with scheduled posts across LinkedIn, X, and YouTube"
4. Click "Schedule Post" → Select asset → Choose LinkedIn → Set time
5. "AI-generated content, scheduled for optimal engagement time"
6. Navigate to `/studio/[campaignId]/analytics`
7. "Real-time analytics across all platforms - 12K impressions, 4.2% CTR"
8. "DNA feedback loop learns what works and optimizes future content"

### **B2C Demo (2 minutes)**
1. "Now let me show you our Career Companion for individuals"
2. Navigate to `/career`
3. "This is your personal AI career coach"
4. Click "Resume Builder" → Upload PDF
5. "AI rewrites your resume for ATS optimization in 10 seconds"
6. Navigate to `/career/create`
7. "Generate LinkedIn posts, cover letters, portfolio descriptions"
8. "One platform for your entire professional brand"

---

## 🚀 **Deployment Checklist**

- [ ] Run Prisma migration
- [ ] Set all environment variables in Vercel
- [ ] Register OAuth apps for all platforms
- [ ] Test OAuth flows locally
- [ ] Deploy to staging
- [ ] Test end-to-end on staging
- [ ] Security audit
- [ ] Performance testing
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Create demo video
- [ ] Update documentation
- [ ] Announce launch

---

## 📞 **Support & Resources**

- **Documentation**: `/docs/PHASE7_README.md`
- **OAuth Setup**: `/docs/OAUTH_SETUP.md`
- **API Limits**: `/docs/CONNECTOR_LIMITS.md`
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md`

---

## 🎉 **You're Building the Future!**

ApexSalesAI is now evolving into **ApexWorkOS** - the world's first unified AI platform for:
- **Enterprise communication** (B2B marketing & sales)
- **Personal career growth** (B2C branding & job hunting)
- **Talent marketplace** (connecting companies ↔ professionals)

**This is category-defining work!** 🚀
