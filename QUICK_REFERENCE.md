# ApexSalesAI - Quick Reference Guide

**Last Updated:** November 3, 2025

---

## 📚 **DOCUMENTATION INDEX**

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **PROJECT_STATUS.md** | Overall project health & status | Weekly reviews, status updates |
| **PHASE_2-3_STATUS.md** | Current phase detailed status | Daily work, sprint planning |
| **TECH_DECISIONS.md** | Technology choices & reasoning | When evaluating new tech |
| **WINDSURF_PHASE3_DIRECTIVE.md** | Original Phase 3 plan | Historical reference |
| **QUICK_REFERENCE.md** | This file - quick links | When you need to find something fast |

---

## 🎯 **CURRENT STATUS AT A GLANCE**

**Phase:** 2-3 (Marketing Studio)  
**Completion:** 70%  
**Status:** 🟢 ON TRACK  
**Next Milestone:** Tier 1 Channels Live (Nov 10, 2025)

**What's Working:**
- ✅ Blog publishing (production-ready)
- ✅ Agent orchestration
- ✅ Studio UI
- ✅ Dataverse telemetry

**What's Needed:**
- ⏳ API credentials (SendGrid, LinkedIn, YouTube, X)
- ⏳ Multi-channel publishing UI
- ⏳ Max agent → Channel pipeline

---

## 🔧 **ACTIVE TECHNOLOGY STACK**

### **Core**
- Next.js 14, React 18, TypeScript
- Tailwind CSS + shadcn/ui
- Vercel (hosting)

### **Data**
- Neon PostgreSQL (primary)
- Microsoft Dataverse (telemetry)
- Prisma (ORM)

### **AI**
- OpenAI GPT-4o
- Azure OpenAI
- Anthropic Claude

### **Auth**
- Clerk (users)
- Azure AD (enterprise)

---

## 📁 **KEY DIRECTORIES**

```
apexsalesai-next/
├── app/                    # Next.js pages & API routes
│   ├── api/               # Backend endpoints
│   ├── studio/            # Studio UI pages
│   └── blog/              # Blog pages
├── components/            # React components
│   ├── studio/           # Studio-specific
│   └── ui/               # shadcn/ui components
├── lib/                   # Core libraries
│   ├── agents/           # AI agents
│   ├── channels/         # Channel adapters
│   ├── dataverse/        # Dataverse integration
│   └── logger.ts         # Logging
├── content/              # Content files
│   └── blog/            # Blog posts (Markdown)
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── e2e/                  # E2E tests
```

---

## 🚀 **COMMON COMMANDS**

### **Development**
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run type-check       # TypeScript check
```

### **Testing**
```bash
npx tsx scripts/test-blog-publish.ts           # Test blog adapter
npx tsx scripts/test-dataverse-integration.ts  # Test Dataverse
npx playwright test                             # E2E tests
```

### **Database**
```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio
```

---

## 🔑 **ENVIRONMENT VARIABLES**

### **Required for Development**
```bash
# Database
DATABASE_URL=
DIRECT_URL=

# Dataverse
DATAVERSE_CLIENT_ID=
DATAVERSE_CLIENT_SECRET=
DATAVERSE_TENANT_ID=
NEXT_PUBLIC_DATAVERSE_URL=

# AI
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### **Channel Credentials (Pending)**
```bash
# Email
SENDGRID_API_KEY=

# LinkedIn
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_PERSON_URN=

# YouTube
YOUTUBE_ACCESS_TOKEN=

# X (Twitter)
X_BEARER_TOKEN=
```

---

## 📊 **CHANNEL ADAPTER STATUS**

| Channel | Status | Credentials | Notes |
|---------|--------|-------------|-------|
| Blog | ✅ READY | None needed | Production-ready |
| Email | ⏳ PENDING | Need SendGrid | Code complete |
| LinkedIn | ⏳ PENDING | Need API token | Code complete |
| YouTube | ⏳ PENDING | Need OAuth | Code complete |
| X | ⏳ PENDING | Need bearer token | Code complete |
| TikTok | ❌ NOT STARTED | Need business acct | Future |
| Instagram | ❌ NOT STARTED | Need business acct | Future |
| Reddit | ❌ NOT STARTED | Need app | Future |
| Pinterest | ❌ NOT STARTED | Need business acct | Future |

---

## 🐛 **TROUBLESHOOTING**

### **TypeScript Errors**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### **Database Issues**
```bash
# Reset database
npx prisma migrate reset
npx prisma generate
```

### **Dataverse Connection**
```bash
# Test connection
npx tsx scripts/test-dataverse-integration.ts
```

---

## 📞 **QUICK LINKS**

### **Production**
- Website: https://www.apexsalesai.com
- App: https://apexsalesai.vercel.app
- Blog: https://www.apexsalesai.com/blog

### **Development**
- GitHub: (repo URL)
- Vercel: https://vercel.com/dashboard
- Neon: https://console.neon.tech
- Dataverse: https://apexai-dev.crm.dynamics.com

### **API Documentation**
- SendGrid: https://docs.sendgrid.com
- LinkedIn: https://learn.microsoft.com/en-us/linkedin/
- YouTube: https://developers.google.com/youtube
- X: https://developer.twitter.com

---

## 🎯 **IMMEDIATE TODOS**

### **This Week**
- [ ] Get SendGrid API key
- [ ] Set up LinkedIn Developer App
- [ ] Configure YouTube OAuth
- [ ] Get X API credentials
- [ ] Build multi-channel publishing UI
- [ ] Test all Tier 1 channels

### **Next Week**
- [ ] Wire Max agent to channels
- [ ] Add approval workflow
- [ ] Create Dataverse table for channel metrics
- [ ] Build analytics dashboard
- [ ] End-to-end testing

---

## 📝 **NOTES**

### **Important Reminders**
- ✅ Blog adapter is production-ready (COO approved)
- ✅ All channel adapters have Dataverse telemetry
- ✅ Graceful degradation if Dataverse unavailable
- ⏳ Need to create `apex_channelpublishes` table in Dataverse
- ⏳ Studio UI for multi-channel publishing is next priority

### **Recent Changes**
- **Nov 3, 2025:** Blog adapter completed with telemetry
- **Nov 3, 2025:** Integration test suite created
- **Nov 3, 2025:** COO review feedback addressed
- **Nov 3, 2025:** Project tracking system established

---

## 🔄 **UPDATE SCHEDULE**

- **Daily:** Update PHASE_2-3_STATUS.md during active work
- **Weekly:** Update PROJECT_STATUS.md
- **Monthly:** Review TECH_DECISIONS.md
- **As Needed:** Update this QUICK_REFERENCE.md

---

**Need Help?** Check the relevant document above or ask Windsurf AI! 🚀
