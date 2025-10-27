# Phase 3: Dataverse Integration - Validation Checklist

**Phase:** 3 - Dataverse Integration  
**Status:** In Progress  
**Owner:** ApexOps Team  
**Target Completion:** 24-48 hours from merge

---

## 🎯 Acceptance Criteria

### Code Quality Standards
- [ ] No `any` types in TypeScript (strict typing enforced)
- [ ] All API routes return structured JSON: `{ ok: boolean, data?: any, error?: string }`
- [ ] Zero `console.log` statements in production code (use proper logging)
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied to all files
- [ ] All functions have JSDoc comments with `@param` and `@returns`

### Database & Schema
- [ ] `campaign_metrics` table created in Neon
- [ ] `v_campaign_metrics_pending` view created
- [ ] Indexes applied for performance (created_at, campaign_id, exported_at)
- [ ] Migration file committed: `20251026235900_add_campaign_metrics`
- [ ] Prisma schema updated (if using Prisma models)

### Azure Infrastructure
- [ ] Azure AD App Registration created: `apex-dataverse-sp`
- [ ] Client secret generated (90-day expiry documented)
- [ ] API permissions added: Dynamics CRM `user_impersonation`
- [ ] Admin consent granted
- [ ] Service principal has least-privilege access

### Dataverse Configuration
- [ ] Table created: `Apex Campaign Metrics` (`apex_campaignmetrics`)
- [ ] All 13 columns added with correct types
- [ ] Change tracking enabled
- [ ] Security roles configured (read/write access)
- [ ] Test record manually created and verified

### Power Automate Flow
- [ ] Flow created: "Apex Campaign Metrics Sync"
- [ ] Trigger: Recurrence (every 5 minutes)
- [ ] PostgreSQL connection configured (Neon)
- [ ] Dataverse connection configured
- [ ] Flow tested with sample data
- [ ] Error handling configured (retry policy)
- [ ] Run history shows successful executions

### Application Code
- [ ] `lib/dataverse/token.ts` - OAuth2 token client with caching
- [ ] `lib/dataverse/getMetrics.ts` - Dataverse API reader
- [ ] `lib/metrics/writeCampaignMetrics.ts` - Metrics writer function
- [ ] `app/api/metrics/recent/route.ts` - API endpoint
- [ ] `app/studio/components/MetricsPanel.tsx` - UI component
- [ ] All imports resolve correctly
- [ ] No circular dependencies

### Environment Variables
- [ ] `AZURE_TENANT_ID` set in `.env.local`
- [ ] `AZURE_CLIENT_ID` set in `.env.local`
- [ ] `AZURE_CLIENT_SECRET` set in `.env.local`
- [ ] `DATAVERSE_RESOURCE` set in `.env.local`
- [ ] All 4 variables added to Vercel Environment Variables
- [ ] Secrets masked in Vercel dashboard
- [ ] Variables documented in `PHASE_3_DATAVERSE_SETUP.md`

---

## 🧪 Testing Requirements

### Unit Tests
- [ ] `writeCampaignMetrics()` writes to database correctly
- [ ] `getDataverseToken()` returns valid access token
- [ ] `getRecentMetrics()` fetches data from Dataverse
- [ ] Token caching works (no redundant auth requests)
- [ ] Error handling graceful (missing credentials, network failures)

### Integration Tests
- [ ] Write test metric to `campaign_metrics` table
- [ ] Power Automate flow picks up pending metrics
- [ ] Dataverse record created successfully
- [ ] `exported_at` timestamp updated in Neon
- [ ] Studio API `/api/metrics/recent` returns data
- [ ] MetricsPanel component displays live KPIs

### End-to-End Validation
- [ ] Run full campaign in Studio
- [ ] Metrics written to Neon automatically
- [ ] Flow syncs to Dataverse within 5 minutes
- [ ] Metrics Panel shows updated data
- [ ] All 5 KPI tiles display correct values
- [ ] Refresh works (10s polling interval)

### Performance Benchmarks
- [ ] API response time < 2.5s (P95)
- [ ] Token acquisition < 1s
- [ ] Dataverse query < 2s
- [ ] MetricsPanel load time < 1.8s (LCP)
- [ ] No memory leaks in token caching
- [ ] Database queries use indexes efficiently

---

## 📊 KPI Targets

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Build Success Rate | 100% | CI/CD logs |
| TypeScript Errors | 0 | `npx tsc --noEmit` |
| Lint Warnings | 0 | `npm run lint` |
| Test Pass Rate | 100% | `npm run test` |
| API Latency (P95) | < 2.5s | Studio console logs |
| UI Load Time (LCP) | < 1.8s | Lighthouse audit |
| Dataverse Sync Delay | < 5 min | Power Automate run history |
| Token Cache Hit Rate | > 95% | Application logs |
| Success Rate | 100% | Metrics validation |

---

## 🔐 Security Checklist

- [ ] Client secrets stored in environment variables (never hardcoded)
- [ ] Service principal uses least-privilege permissions
- [ ] API routes validate authentication
- [ ] No credentials logged to console
- [ ] Secrets masked in Vercel dashboard
- [ ] Token cache cleared on auth failures
- [ ] HTTPS enforced for all Dataverse requests
- [ ] CORS configured correctly
- [ ] Rate limiting considered for API routes

---

## 📝 Documentation Requirements

- [ ] `PHASE_3_DATAVERSE_SETUP.md` complete
- [ ] `PHASE_3_COMPLETE.md` created with:
  - [ ] Screenshots of Dataverse table
  - [ ] Screenshot of Power Automate run history
  - [ ] Screenshot of Studio MetricsPanel with live data
  - [ ] Commit hashes and file changes
  - [ ] KPI deltas (before/after metrics)
- [ ] Code comments added to all new functions
- [ ] README updated with Phase 3 status
- [ ] Environment variable documentation updated

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Lint passes: `npm run lint`
- [ ] Environment variables documented

### Deployment
- [ ] Merge to `main` branch
- [ ] Vercel environment variables configured
- [ ] Vercel build succeeds
- [ ] Preview deployment tested
- [ ] Production deployment verified

### Post-Deployment
- [ ] Smoke tests pass in production
- [ ] Metrics Panel loads successfully
- [ ] API endpoints respond correctly
- [ ] No errors in Vercel logs
- [ ] Dataverse sync working in production
- [ ] Performance metrics within targets

---

## 🎯 Sign-Off Criteria

**Phase 3 is COMPLETE when:**

1. ✅ All code quality standards met
2. ✅ All Azure infrastructure configured
3. ✅ Power Automate flow running successfully
4. ✅ End-to-end tests passing
5. ✅ Performance benchmarks achieved
6. ✅ Security checklist complete
7. ✅ Documentation finalized
8. ✅ Production deployment verified
9. ✅ `PHASE_3_COMPLETE.md` committed
10. ✅ Team sign-off obtained

---

## 📋 Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | Windsurf AI | __________ | __________ |
| Tech Lead | Tim Bryant | __________ | __________ |
| QA | ApexOps | __________ | __________ |

---

## 🔄 Continuous Improvement

**Post-Phase 3 Enhancements:**
- [ ] Add retry logic for failed Dataverse syncs
- [ ] Implement metrics aggregation (daily/weekly rollups)
- [ ] Add alerting for sync failures
- [ ] Create Dataverse dashboard in Power BI
- [ ] Optimize token caching strategy
- [ ] Add metrics export to CSV
- [ ] Implement historical metrics view

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Status:** Active Validation
