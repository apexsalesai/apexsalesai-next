# Item C: Channel Adapters - Implementation Plan

**Status:** IN PROGRESS  
**Priority:** HIGH - Required for actual delivery (not simulation)  
**Scope:** Production-ready publishing to Blog, Email, LinkedIn, X

---

## ✅ Completed Prerequisites

1. **Agent Runner** - `lib/agents/runner.ts` exists and working
2. **Agent Run API** - Fixed to accept optional agents array (defaults to all 5)
3. **Prisma Models** - Added `ScheduledPublish` model
4. **Validators** - Added publish schemas to `lib/validators.ts`
5. **Dependencies** - Installed `zod` for validation

---

## 🎯 Deliverables

### 1. Blog Publishing
**Route:** `POST /api/publish/blog`
- Upsert to existing `BlogPost` model
- Mark `ContentAsset` as published
- Revalidate `/blog` path
- Support scheduling via `ScheduledPublish`
- Write `AuditLog` entry

### 2. Email Publishing  
**Route:** `POST /api/publish/email`
- Support Resend OR SendGrid (env-based)
- Require: `to[]`, `subject`, `assetId`
- Convert body to HTML
- Store `externalId` (messageId) in asset metadata
- Support scheduling
- Write `AuditLog` entry

### 3. LinkedIn Publishing
**Route:** `POST /api/publish/linkedin`
- Use LinkedIn UGC Posts API
- Require: `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_ACTOR_URN`
- Support PUBLIC/CONNECTIONS visibility
- 3000 char limit (enforced client-side)
- Store post URN in asset metadata
- Support scheduling
- Write `AuditLog` entry

### 4. X/Twitter Publishing
**Route:** `POST /api/publish/x`
- Use Twitter API v2
- OAuth 1.0a (4 credentials required)
- 280 char limit (enforced client-side)
- Store tweet ID in asset metadata
- Support scheduling
- Write `AuditLog` entry

### 5. Social Fan-Out
**Route:** `POST /api/publish/social`
- Accept `channels[]` array
- Fan out to multiple adapters
- Return aggregated results
- Useful for multi-channel campaigns

### 6. UI Integration
**Hook:** `app/studio/hooks/usePublish.ts`
- Wrapper for all publish endpoints
- Loading/error states
- Toast notifications
- Used by RichEditor and AssetTabs

---

## 📋 Environment Variables Required

```env
# Email (choose one)
RESEND_API_KEY=re_...
SENDGRID_API_KEY=SG...
EMAIL_FROM="ApexSalesAI <no-reply@apexsalesai.com>"

# LinkedIn
LINKEDIN_ACCESS_TOKEN=...
LINKEDIN_ACTOR_URN=urn:li:organization:123456789

# X/Twitter (OAuth 1.0a)
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_TOKEN_SECRET=...
```

---

## 🔄 Publishing Flow

```
User clicks "Publish to LinkedIn" in Studio
  ↓
UI calls POST /api/publish/linkedin { assetId, title, body }
  ↓
Route validates input (zod schema)
  ↓
Fetch ContentAsset from DB
  ↓
If scheduledAt in future → Create ScheduledPublish record → Return 202
  ↓
Otherwise → Call LinkedIn API
  ↓
Update ContentAsset: status='published', publishedAt=now(), metadata.linkedin={externalId}
  ↓
Write AuditLog: entity='ContentAsset', action='publish', status='success'
  ↓
Return { ok: true, externalId, asset }
```

---

## 🧪 Testing Strategy

### Unit Tests
- Validate schemas with invalid data
- Test scheduling logic
- Test error handling

### Integration Tests
- Mock external APIs (Resend, LinkedIn, X)
- Verify DB updates
- Verify AuditLog writes

### E2E Tests (Playwright)
1. Create campaign
2. Run agents
3. Edit blog content
4. Click "Publish to Blog"
5. Verify BlogPost created
6. Verify asset marked published
7. Navigate to /blog
8. Verify post appears

---

## 📊 Success Criteria

- [ ] All 5 routes implemented and tested
- [ ] Scheduling works (creates ScheduledPublish records)
- [ ] Asset metadata updated correctly
- [ ] AuditLog entries created
- [ ] UI hook integrated
- [ ] Error handling robust
- [ ] No hardcoded secrets
- [ ] Documentation complete
- [ ] E2E tests passing

---

## 🚀 Implementation Order

1. ✅ Fix agent run route (422 error)
2. ✅ Add ScheduledPublish model
3. ✅ Add publish validators
4. ⏳ Create Blog adapter
5. ⏳ Create Email adapter (Resend)
6. ⏳ Create LinkedIn adapter
7. ⏳ Create X adapter
8. ⏳ Create Social fan-out
9. ⏳ Create usePublish hook
10. ⏳ Update RichEditor with publish buttons
11. ⏳ Add E2E tests
12. ⏳ Update .env.example

---

## 📝 Notes

- **No simulation** - All adapters call real APIs
- **Graceful degradation** - Missing env vars return 422 with clear message
- **Audit everything** - Every publish action logged
- **Idempotent** - Re-publishing updates existing post (blog) or creates new (social)
- **Scheduling** - Phase 1: Store intent. Phase 2: Add cron worker to process queue

---

## 🔗 Related Files

- `lib/agents/runner.ts` - Agent execution
- `app/api/studio/agents/run/route.ts` - Trigger agents
- `prisma/schema.prisma` - Data models
- `lib/validators.ts` - Request validation
- `lib/telemetry-phase2.ts` - Audit logging
- `app/studio/[id]/page.tsx` - Workspace UI
- `app/studio/components/RichEditor.tsx` - Content editor

---

**Next Step:** Implement Blog adapter first (simplest, uses existing BlogPost model)
