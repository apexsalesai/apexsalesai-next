# 🧠 Dev Journal – ApexSalesAI

This journal logs daily and weekly engineering progress, major implementation decisions, blockers, and current goals. Shared between Founder (Tim), ChatGPT (AI COO), and Windsurf AI.

---

## 🔄 Historical Progress

### 🏷️ 2025-06-29 – Released v0.3.0
- Implemented Dataverse OAuth integration with Prisma workaround and error logging


### 📅 June 25, 2025 – Added Level 3+ Agent Plan
- Created `plan.md` defining autonomous agent goals
- Drafted task list for real estate/mortgage-specific flows
- Defined multi-agent architecture with LangGraph
- Established vertical-specific lead intake flows

### 📅 June 26, 2025 – CRM Integration Strategy
- Pivoted from HubSpot to Microsoft Dataverse as primary CRM
- Deprecated PostgreSQL for entity storage in favor of Dataverse CDM
- Designed OAuth token storage with encryption for Dataverse
- Mapped initial real estate/mortgage entities to Dataverse schema

### 📅 June 27, 2025 – GitHub Push + Dev Journal Setup
- Fixed Git sync error (fatal: updating an unborn branch)
- Committed and pushed project files to GitHub
- Initialized Husky and set up automated `dev-journal.md` logging
- Established 5-phase implementation plan with daily sprints

---

## 🧩 Dev Status Overview

| Component        | Owner       | Status     | Last Update |
|-----------------|-------------|------------|-------------|
| LangGraph Agent  | Claude      | 🔄 In Dev   | Jun 28      |
| Microsoft OAuth  | Windsurf    | ✅ Done     | Jun 28      |
| Dataverse Tokens | Windsurf    | ✅ Done     | Jun 28      |
| Dashboard KPIs   | Claude      | 🔄 In Dev   | Jun 28      |
| Deploy to Vercel | Tim         | ⏳ Pending | N/A         |
| Error Logging    | Windsurf    | 🔄 In Dev   | Jun 28      |

## 🔧 What's Next (as of 2025-06-28)
- [ ] Implement Microsoft Identity OAuth flow
- [ ] Finalize `tokenService.ts` logic and Dataverse connector
- [ ] Wire LangGraph lead intake with entity creation
- [ ] Update dashboard metrics to pull from Dataverse
- [ ] Resolve Prisma client generation permission issue

---

## 📅 2025-06-28 – Major Progress Update

### ✅ Git Push Fixed & Plan Sync (Windsurf)
- Fixed: Git issue blocking push (`Can't push refs to remote`)
- Command: `git add . && git commit -m "Initial commit with Level 3+ agent plan and Dataverse integration" && git push`
- Result: Repo pushed to [GitHub Remote](https://github.com/APEXsalesAI2/apexsalesai-next)

### 🧠 Clarity Improvements to Plan.md
- Defined "Level 3+" agents explicitly
- Tagged all Dataverse-related tasks clearly for vertical clarity

### 🔄 Dataverse Integration Progress
- Updated Prisma schema to add metadata field to AuthToken model
- Successfully migrated database with new schema
- Enhanced tokenService.ts for Dataverse OAuth integration
- [BLOCKER] Encountered permission issue with Prisma client generation

---

## 📅 2025-06-27 – Strategic Architecture Shift

### 🔁 CRM Stack Decision Finalized
- ✅ Adopted Microsoft Dataverse as the core CRM
- Deprecated PostgreSQL and paused HubSpot sync
- Advantages: Better native integration, security, Power Platform support

### 🧱 Feature Updates Planned:
- Microsoft Identity auth via `tokenService.ts`
- New Dataverse connector service
- `install.tsx` now supports environment + tenant setup

---

## ✅ Completed (Last 24–72 hrs)
- ✅ 2025-06-28: Updated Prisma schema for AuthToken metadata field
- ✅ 2025-06-28: Created dev-journal.md structure and automation plan
- ✅ 2025-06-27: Resolved Git push error via Windsurf (initial commit fixed)
- ✅ 2025-06-27: Added Level 3+ agent plan to `plan.md`
- ✅ 2025-06-27: Synced changes to GitHub + validated Vercel deployment

---

## ⛔ Blockers / Issues
- 2025-06-28: Prisma client generation fails with EPERM error - need admin rights
- 2025-06-27: HubSpot OAuth flow not stable — moving to optional sync via Power Automate
- 2025-06-26: PostgreSQL token logic not scalable; deprecated in favor of Dataverse

---

## 🧠 Decisions / Architecture Notes
- 2025-06-28: Added metadata field to AuthToken model for Dataverse environment URL storage
- 2025-06-27: Moving CRM logic to Dataverse permanently
- 2025-06-27: MVP will support Real Estate, Mortgage, Consulting, MSP, Solar verticals
- 2025-06-27: Added `.env.local.updated` as system backup reference

---

## 📈 Sprint Goal
**Goal:** Deliver Level 3+ AI agent demo with Dataverse, live UI, and KPI integration  
**Due Date:** July 5, 2025

---

## 📌 Dev Tip of the Day
> "Build your agents like modular workers. The logic should live outside the UI."

---

## 🔁 Automation Setup

### Git Pre-commit Hook (via husky)
```bash
#!/bin/bash
echo "- ✅ $(date +%Y-%m-%d): $(git log -1 --pretty=%s)" >> dev-journal.md
```

### Manual Update Command
```bash
echo "- ✅ $(date +%Y-%m-%d): [Your commit message here]" >> dev-journal.md
```

## ⏭️ What’s Next (As of Today)
- [ ] Implement Microsoft Identity OAuth
- [ ] Finalize `/tokenService.ts` updates
- [ ] Push LangGraph agent flow with real estate logic
- [ ] Replace dashboard mock data with Dataverse-connected KPIs
- ✅ 2025-06-28: Initial commit with Level 3+ agent plan and Dataverse integration
- ✅ 2025-06-30: Release v0.3.0: Implemented Dataverse OAuth integration with Prisma workaround and error logging
- ✅ 2025-10-12: Merge pull request #1 from apexsalesai/apexsalesai-admin-patch-1

Delete pages/api/kpis.ts
- ✅ 2025-10-12: chore: trigger redeploy after removing pages/api/kpis.ts
- ✅ 2025-10-13: chore: trigger deploy
- ✅ 2025-10-13: chore: trigger Vercel build
- ✅ 2025-10-13: Merge pull request #3 from apexsalesai/fix-build-datefns

Fix build datefns
- ✅ 2025-10-13: chore: trigger prod deploy
- ✅ 2025-10-13: chore: trigger prod deploy
- ✅ 2025-10-13: build: ignore Node-only modules in client bundle
- ✅ 2025-10-14: build: ignore Node-only modules in client bundle
- ✅ 2025-10-14: fix(build): add webpack path aliases for Vercel deployment

- Configure webpack resolve.alias in next.config.js
- Map @, @components, @lib to correct directories
- Resolves module not found errors in Vercel build
- Ensures path aliases work in both dev and production
- ✅ 2025-10-14: merge: resolve conflict in dataverseApi.ts
- ✅ 2025-10-14: fix(dataverse): refactor to static methods and fix import paths

BREAKING CHANGES:
- DataverseApiService now uses static methods instead of instance methods
- All KPI services updated to use static DataverseApiService.query()

FIXES:
- Fix @/lib path alias to @lib for correct webpack resolution
- Remove NextAuth dependencies (app uses Auth0)
- Fix app/api/loads/route.ts to use correct imports
- Update all KPI services to use static methods
- Add type annotations for implicit any errors
- Remove orderBy from query options (not supported)

RESULT: Build compiles successfully, zero type errors
- ✅ 2025-10-14: fix(prisma): add postinstall script for Vercel deployment

- Add 'prisma generate' to postinstall script
- Update build script to run prisma generate before next build
- Resolves Prisma Client outdated cache issue on Vercel

This ensures Prisma Client is regenerated after npm install on Vercel
- ✅ 2025-10-14: fix(auth): prevent Auth0 initialization errors during build

- Wrap handleAuth() in runtime check for environment variables
- Return 501 error if Auth0 not configured instead of crashing build
- Prevents 'invalid_client_credential' error during Vercel build

This allows the build to complete even if Auth0 env vars aren't set,
while still providing clear error messages at runtime.
- ✅ 2025-10-14: fix(auth): lazy initialize MSAL client to prevent build errors

CRITICAL FIX:
- MSAL ConfidentialClientApplication was initializing at module load time
- This caused 'invalid_client_credential' errors during Vercel build
- Changed to lazy initialization using getter pattern

CHANGES:
- Convert msalClient from static property to lazy-loaded getter
- Only initializes when actually accessed (runtime, not build time)
- Prevents build failures when DATAVERSE env vars not set

This is the root cause of the deployment failures.
- ✅ 2025-10-15: fix: temporarily remove problematic files to get build working
