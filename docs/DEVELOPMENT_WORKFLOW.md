# Echo Breaker - Development Workflow

**Goal:** Add enterprise improvements WITHOUT breaking production

---

## 🔒 PROTECTED PRODUCTION VERSION

**Branch:** `production-prooflayer`
**Commit:** `d6b1615` (Dec 17, 2025 - 2am)
**Status:** WORKING - DO NOT MODIFY DIRECTLY

---

## 🛠️ DEVELOPMENT WORKFLOW

### Step 1: Create Feature Branch
```bash
# Always branch from the working production commit
git checkout production-prooflayer
git pull origin production-prooflayer
git checkout -b feature/echo-breaker-improvements
```

### Step 2: Make Changes Locally
- Edit code on feature branch
- Test thoroughly on local dev server (http://localhost:3005)
- Verify all functionality works

### Step 3: Local Testing Checklist
```bash
# 1. Start dev server
npm run dev

# 2. Test in browser
# Go to: http://localhost:3005/echo-breaker
# Enter test claim: "The Earth orbits the Sun"
# Click "Verify Reality"
# Verify results appear correctly

# 3. Test API directly
curl -X POST http://localhost:3005/api/reality-scan \
  -H "Content-Type: application/json" \
  -d '{"claim":"The Earth orbits the Sun"}'

# 4. If health endpoint exists, test it
curl http://localhost:3005/api/health
```

### Step 4: Commit Changes
```bash
git add .
git commit -m "FEATURE: Description of improvement"
```

### Step 5: Push to Feature Branch
```bash
# Push to feature branch (NOT production)
git push origin feature/echo-breaker-improvements
```

### Step 6: Deploy to Vercel Preview
- Vercel will automatically create a preview deployment
- Test on the preview URL (e.g., `feature-echo-breaker-improvements-apexsalesai.vercel.app`)
- Verify everything works on preview

### Step 7: Merge to Production (ONLY IF VERIFIED)
```bash
# Only after confirming preview works
git checkout production-prooflayer
git merge feature/echo-breaker-improvements
git push origin production-prooflayer
```

---

## 📋 PLANNED IMPROVEMENTS

### Phase 1: Foundation (Current)
- ✅ Working base from commit d6b1615
- ✅ Feature branch created
- ✅ Local dev server running

### Phase 2: Health & Monitoring
**Goal:** Add observability without breaking core functionality

**Files to create:**
1. `pages/api/health.ts` - System health check
   - Validates API keys exist
   - Checks model configuration
   - Returns structured health status

2. `lib/monitoring/logger.ts` - Simple logging utility
   - Console logging with timestamps
   - Error tracking
   - No external dependencies

**Testing:**
- Test health endpoint locally
- Verify it doesn't interfere with reality-scan
- Deploy to preview, test again
- Only then merge to production

### Phase 3: Model Validation
**Goal:** Validate model name but allow fallback

**Changes:**
- Add validation in `llm-verify.ts`
- Log warning if invalid model
- Continue with fallback (don't fail)
- Return warning in response

**Testing:**
- Test with valid model name
- Test with invalid model name (should still work)
- Verify warnings appear in logs
- Deploy to preview, test again

### Phase 4: Error Handling
**Goal:** Better error messages without changing behavior

**Changes:**
- Add structured error responses
- Include debug information
- Maintain backward compatibility

**Testing:**
- Test normal flow (should work same as before)
- Test error scenarios
- Verify error messages are helpful
- Deploy to preview, test again

### Phase 5: E2E Tests
**Goal:** Automated testing for confidence

**Files to create:**
- `tests/echo-breaker.test.ts`
- Test suite for verification flow
- Run before every deployment

**Testing:**
- Run tests locally
- Integrate into CI/CD
- Don't block deployments initially

---

## 🚫 WHAT NOT TO DO

❌ **Don't modify production branch directly**
❌ **Don't skip local testing**
❌ **Don't skip preview testing**
❌ **Don't merge without verification**
❌ **Don't add breaking changes**
❌ **Don't change core logic without testing**

---

## ✅ TESTING CHECKLIST (Before Merge)

### Local Testing
- [ ] Dev server starts without errors
- [ ] Echo Breaker UI loads
- [ ] Can enter a claim
- [ ] Verification returns results
- [ ] Results display correctly
- [ ] No console errors
- [ ] API responds within 10 seconds

### Preview Testing (Vercel)
- [ ] Preview deployment succeeds
- [ ] Preview URL loads
- [ ] Echo Breaker works on preview
- [ ] Test multiple claims
- [ ] Check Vercel function logs
- [ ] No errors in logs

### Production Merge
- [ ] All local tests pass
- [ ] All preview tests pass
- [ ] Feature branch is up to date with production
- [ ] Commit messages are clear
- [ ] Changes are documented

---

## 🔄 ROLLBACK PROCEDURE

If something breaks after merge:

```bash
# Immediate rollback
git checkout production-prooflayer
git reset --hard d6b1615
git push --force origin production-prooflayer
```

Or in Vercel:
1. Go to Deployments
2. Find deployment `DyJcBLptA` (working version)
3. Click "Redeploy"

---

## 📊 CURRENT STATUS

**Production Branch:** `production-prooflayer` at commit `d6b1615` ✅ WORKING
**Feature Branch:** `feature/echo-breaker-improvements` ✅ CREATED
**Local Dev:** Running on http://localhost:3005 ✅ READY
**Next Step:** Add health monitoring endpoint and test locally

---

## 🎯 SUCCESS CRITERIA

An improvement is ready for production when:
1. ✅ Works perfectly on local dev
2. ✅ Works perfectly on Vercel preview
3. ✅ Doesn't change existing behavior
4. ✅ Adds value (monitoring, better errors, etc.)
5. ✅ Is documented
6. ✅ Has been tested with multiple claims

---

**Remember:** Production stability is more important than new features. Test everything thoroughly before merging.
