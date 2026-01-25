# ApexSalesAI Documentation

This folder contains all project documentation optimized for AI assistant access (Claude, Windsurf, etc.).

---

## 📁 File Structure

### Core Status Documents
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Master project status (update daily)
  - Current sprint focus
  - Completed items with metrics
  - In-progress work
  - Blockers summary
  - Key metrics and performance data

- **[DAILY_STANDUP.md](./DAILY_STANDUP.md)** - Quick daily updates
  - Yesterday's work
  - Today's focus
  - Current blockers
  - Progress tracking

- **[BLOCKERS.md](./BLOCKERS.md)** - Detailed blocker tracking
  - Active blockers with severity
  - Workarounds in place
  - Unblocking plans
  - Escalation paths

### Implementation Details
- **[ITEM_B_STUDIO_UI.md](./ITEM_B_STUDIO_UI.md)** - Studio Workspace UI implementation
  - Component architecture
  - API routes
  - Features and functionality
  - Testing strategy

- **[ITEM_C_CHANNEL_ADAPTERS.md](./ITEM_C_CHANNEL_ADAPTERS.md)** - Channel publishing adapters
  - Blog, Email, LinkedIn, X/Twitter
  - Publishing flow
  - Environment variables
  - Implementation roadmap

- **[PHASE_6_CONTENT_ENGINE.md](./PHASE_6_CONTENT_ENGINE.md)** - AI Content Generation
  - B2B and B2C content types
  - OpenAI integration
  - Content Studio UI

### Acceptance & Scope
- **[WINDSURF_SCOPE_LOCK_ITEM_B.md](./WINDSURF_SCOPE_LOCK_ITEM_B.md)** - Item B acceptance package
  - Scope lock acknowledgment
  - Complete deliverables
  - Definition of done
  - Known gaps and patches

---

## 🔗 Related Folders

### `/reports/`
- `validation-report.json` - Agent execution metrics
- `ui-validation-report.json` - E2E test results (when run)
- `screenshots/` - UI screenshots for documentation

### `/app/`
- Next.js application code
- API routes
- UI components
- Pages

### `/lib/`
- Shared utilities
- Agent logic
- Telemetry functions

### `/prisma/`
- Database schema
- Migrations
- Seed scripts

---

## 🤖 For AI Assistants

### Quick Context Files (Read These First)
1. `PROJECT_STATUS.md` - Current state
2. `DAILY_STANDUP.md` - Recent work
3. `BLOCKERS.md` - Current issues

### Deep Dive Files (When Needed)
- `ITEM_B_STUDIO_UI.md` - Studio implementation details
- `ITEM_C_CHANNEL_ADAPTERS.md` - Publishing architecture
- `WINDSURF_SCOPE_LOCK_ITEM_B.md` - Acceptance criteria

### Data Files
- `../reports/validation-report.json` - Real performance metrics

---

## 📊 Access via GitHub Raw URLs

For Claude and other AI assistants to fetch these files directly:

```
https://raw.githubusercontent.com/apexsalesai/apexsalesai-next/main/docs/PROJECT_STATUS.md
https://raw.githubusercontent.com/apexsalesai/apexsalesai-next/main/docs/DAILY_STANDUP.md
https://raw.githubusercontent.com/apexsalesai/apexsalesai-next/main/docs/BLOCKERS.md
https://raw.githubusercontent.com/apexsalesai/apexsalesai-next/main/reports/validation-report.json
```

**Note:** Repository must be public OR AI assistant needs read access token.

---

## ✏️ Update Guidelines

### Daily Updates
- Update `DAILY_STANDUP.md` at end of each work session
- Keep entries brief (3-5 bullets per section)

### Weekly Updates
- Review and update `PROJECT_STATUS.md`
- Update completion percentages
- Add new metrics

### As Needed
- Update `BLOCKERS.md` when issues arise or resolve
- Update implementation docs when architecture changes
- Keep acceptance docs frozen once approved

---

## 🎯 Purpose

This documentation structure enables:
1. **AI Context** - Quick onboarding for AI assistants
2. **Team Handoffs** - Clear status for human developers
3. **Progress Tracking** - Metrics and completion percentages
4. **Issue Management** - Centralized blocker tracking
5. **Historical Record** - Daily standup log

---

**Maintained By:** Development team + AI assistants  
**Last Reorganized:** October 26, 2025  
**Structure Version:** 1.0
