# 🏁 PHASE 3 ACTIVATION — ENTERPRISE SIGN-OFF

**Status:** Code Complete | Infrastructure Ready | Deploy Immediately  
**Branch:** `main` (`v2.6-3.0-stable`)  
**ETA:** 2–3 hours  
**Objective:** Dataverse Telemetry → Studio Live KPIs

---

## 🎯 Mission

You are executing the **Apex Phase 3 Activation** — the bridge between a functioning product and a measurable enterprise platform.

This task converts our telemetry pipeline into **live, investor-grade observability**.

**Precision over creativity. Evidence over assumption.**

---

## ⚙️ Execution Timeline (≈ 2–3 hrs)

| Time | Action | Outcome |
|------|--------|---------|
| **T + 0 min** | `pwsh ./scripts/phase3_execute.ps1` | Repo validation + migration + env vars populated |
| **T + 15 min** | Create Azure AD Service Principal (`apex-dataverse-sp`) | Client ID/Secret generated, permissions granted |
| **T + 60 min** | Create Dataverse table → Apex Campaign Metrics | 13 columns per setup guide + API access verified |
| **T + 90 min** | Import Power Automate Flow (JSON template) | Neon → Dataverse sync active (every 5 min) |
| **T + 120 min** | Run validation suite (`npm run build/lint/test`) | 0 errors → ✅ All checks pass |
| **T + 150 min** | Record screenshots + fill `PHASE_3_COMPLETE.md` | Evidence + KPI metrics attached |
| **T + 165 min** | `git commit -m "Phase 3 Complete: Dataverse telemetry live"` | Pushed → `v3.0-complete` tag created |

---

## 📦 Deliverables Required (Non-Negotiable)

| Deliverable | Evidence | Destination |
|-------------|----------|-------------|
| **Dataverse table live** | `screenshots/dataverse_rows.png` | Commit + attach |
| **Power Automate flow success** | `screenshots/power_automate_run.png` | Commit + attach |
| **Studio MetricsPanel with live KPIs** | `screenshots/metrics_panel_live.png` | Commit + attach |
| **Completed PHASE_3_COMPLETE.md** | Filled + signed | Root directory |
| **COO_APPROVAL_NOTE.md** | Signed by Tim Bryant / GPT-5 | Root directory |

---

## ✅ Quality Gates (10 / 10 Required)

| Gate | Metric | Pass |
|------|--------|------|
| **Build** | `npm run build` = 0 errors | ✅ |
| **Lint** | `npm run lint` = 0 warnings | ✅ |
| **Tests** | All unit + integration pass | ✅ |
| **TypeScript** | No `any` usage | ✅ |
| **Telemetry** | Neon → Dataverse sync confirmed | ✅ |
| **Performance** | LCP < 1.8s | ✅ |
| **Security** | Secrets masked | ✅ |
| **Documentation** | All files filled | ✅ |
| **Screenshots** | 3 attached | ✅ |
| **Commit Tag** | `v3.0-complete` created | ✅ |

**Failure = rollback to `v2.6-3.0-stable` and retry.**

---

## 🔐 Security & Compliance Checklist

- ✅ OAuth2 Service Principal (least privilege)
- ✅ No hard-coded secrets (`.env` only)
- ✅ Transport encryption verified (HTTPS + TLS 1.2+)
- ✅ Audit trail persisted in Dataverse
- ✅ SOC2/HIPAA alignment validated by data model design

---

## 📈 Expected Outcomes (Post-Execution)

- ✅ **10+ Dataverse records** flowing from Neon
- ✅ **Power Automate runs** every 5 min successfully
- ✅ **MetricsPanel displaying live KPIs** (Cost, Latency, Tokens, SuccessRate, Agents)
- ✅ **Phase 2-3 → 100% Complete**
- ✅ **Apex platform → Series A-Ready Demo Certified**

---

## 🧭 Governance & Reporting Protocol

1. Commit evidence + screenshots
2. File `PHASE_3_COMPLETE.md` and `COO_APPROVAL_NOTE.md`
3. Notify via Teams channel: `#phase-3-activation`
4. CTO/COO sign-off within 24 hrs

---

## 🏆 Closing Statement for Windsurf

**"This activation moves Apex from an intelligent system to an intelligent enterprise.**

**You are executing the most important 2 hours of our Series A readiness.**

**Precision is non-negotiable. Evidence is mandatory.**

**Execute the script. Validate the pipeline. File the proof.**

**When done — Apex Sales AI becomes an observable platform."**

---

## 🕓 ETA to Series A Demo

**Today + 3 hours = Phase 2-3 100% + Series A infrastructure complete**

---

## 📋 Step-by-Step Execution Guide

### **Step 1: Run Automation Script (5 minutes)**

```powershell
pwsh ./scripts/phase3_execute.ps1
```

**Expected Output:**
- ✅ Repository state verified
- ✅ Prisma migration applied
- ✅ Environment variables documented
- ✅ Power Automate template generated
- ✅ Build validation passed

---

### **Step 2: Azure AD Service Principal (15 minutes)**

**Navigate to:** Azure Portal → Azure Active Directory → App registrations

1. Click **New registration**
2. **Name:** `apex-dataverse-sp`
3. **Supported account types:** Single tenant
4. Click **Register**

**Create Client Secret:**
1. Go to **Certificates & secrets**
2. Click **New client secret**
3. **Description:** `Dataverse API Access`
4. **Expires:** 90 days
5. **COPY THE SECRET VALUE** immediately

**Add API Permissions:**
1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Dynamics CRM**
4. Choose **Delegated permissions**
5. Check **user_impersonation**
6. Click **Add permissions**
7. Click **Grant admin consent**

**Record These Values:**
```bash
AZURE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_SECRET=********************************
DATAVERSE_RESOURCE=https://apexsalesai.crm.dynamics.com
```

**Add to `.env.local` and Vercel Environment Variables**

---

### **Step 3: Create Dataverse Table (45 minutes)**

**Navigate to:** https://make.powerapps.com

1. Select environment: `apexsalesai`
2. Go to **Tables** → **New table** → **New table**
3. **Display Name:** `Apex Campaign Metrics`
4. **Plural Name:** `Apex Campaign Metrics`
5. **Name (Schema):** `apex_campaignmetrics`

**Add Columns:**

| Display Name | Schema Name | Type | Required |
|--------------|-------------|------|----------|
| Campaign ID | apex_campaignid | Text (64) | Yes |
| Run ID | apex_runid | Text (64) | Yes |
| Phase | apex_phase | Text (16) | Yes |
| Agents Total | apex_agents_total | Whole Number | Yes |
| Agents Successful | apex_agents_success | Whole Number | Yes |
| Assets Generated | apex_assets_generated | Whole Number | Yes |
| Tokens In | apex_tokens_in | Whole Number | Yes |
| Tokens Out | apex_tokens_out | Whole Number | Yes |
| Cost (USD) | apex_cost_usd | Decimal (10,5) | Yes |
| Latency P95 (ms) | apex_latency_p95_ms | Whole Number | Yes |
| Latency Avg (ms) | apex_latency_avg_ms | Whole Number | Yes |
| Success Rate (%) | apex_success_rate | Decimal (5,2) | Yes |
| Created At | apex_created_at | Date and Time | Yes |

**Enable:**
- ✅ Change tracking
- ✅ Audit changes

**Save the table**

**Take Screenshot:** `screenshots/dataverse_table.png`

---

### **Step 4: Configure Power Automate Flow (30 minutes)**

**Navigate to:** https://make.powerautomate.com

1. Click **Create** → **Automated cloud flow**
2. **Flow name:** `Apex Campaign Metrics Sync`
3. **Trigger:** Skip for now
4. Click **Create**

**Import Template:**
1. Click **My flows** → **Import** → **Import Package (Legacy)**
2. Upload `scripts/power-automate-flow.json`
3. Configure connections:
   - **PostgreSQL:** Connect to Neon database
   - **Dataverse:** Connect to `apexsalesai` environment

**Or Build Manually:**

**Trigger:**
- Type: **Recurrence**
- Interval: **5 minutes**

**Action 1: Get Rows (PostgreSQL)**
- Connection: Neon
- Table: `v_campaign_metrics_pending`

**Action 2: Apply to each**
- Input: `@body('Get_Rows')?['value']`

**Inside Loop - Action 1: Create Record (Dataverse)**
- Table: `apex_campaignmetricses`
- Map fields:
  - `apex_campaignid` ← `@items('Apply_to_each')?['campaign_id']`
  - `apex_runid` ← `@items('Apply_to_each')?['run_id']`
  - (Continue for all 13 fields)

**Inside Loop - Action 2: Execute SQL (PostgreSQL)**
- Query: `UPDATE campaign_metrics SET exported_at = NOW() WHERE run_id = '@{items('Apply_to_each')?['run_id']}'`

**Save and Test Flow**

**Take Screenshot:** `screenshots/power_automate_flow.png`

---

### **Step 5: Validation (30 minutes)**

**Run Build & Tests:**
```bash
npm run build
npm run lint
npm run test
```

**Expected:** 0 errors, 0 warnings

**Test End-to-End:**
```bash
# Write test metric
node -e "
const { writeCampaignMetrics } = require('./lib/metrics/writeCampaignMetrics');
writeCampaignMetrics({
  campaignId: 'test-campaign-001',
  runId: 'test-run-001',
  agentsTotal: 5,
  agentsSuccessful: 5,
  assetsGenerated: 12,
  tokensIn: 1500,
  tokensOut: 3000,
  costUSD: 0.00348,
  latencyP95Ms: 51200,
  latencyAvgMs: 42000
});
"
```

**Wait 5 minutes for Power Automate flow to run**

**Verify:**
1. Check Dataverse table for new record
2. Check `exported_at` timestamp in Neon
3. Navigate to Studio → Metrics Panel
4. Verify 5 KPI tiles display data

**Take Screenshot:** `screenshots/metrics_panel_live.png`

---

### **Step 6: Documentation (30 minutes)**

**Fill `PHASE_3_COMPLETE.md`:**
1. Add actual KPI values
2. Insert 3 screenshots
3. Fill commit hash
4. Update completion date
5. Sign developer line

**Fill `COO_APPROVAL_NOTE.md`:**
1. Add actual KPI values
2. Update completion date
3. Sign all lines

**Create screenshots directory:**
```bash
mkdir screenshots
# Move all 3 screenshots into this directory
```

---

### **Step 7: Commit & Tag (5 minutes)**

```bash
git add -A
git commit -m "Phase 3 Complete: Dataverse telemetry live - Studio metrics active"
git tag -a v3.0-complete -m "Phase 3 Dataverse integration complete and verified"
git push origin main
git push origin v3.0-complete
```

---

## 🎯 Success Criteria

**Phase 3 is COMPLETE when:**
- ✅ All 10 quality gates passed
- ✅ 3 screenshots committed
- ✅ `PHASE_3_COMPLETE.md` filled and signed
- ✅ `COO_APPROVAL_NOTE.md` filled and signed
- ✅ Tag `v3.0-complete` created
- ✅ MetricsPanel showing live data
- ✅ Power Automate flow running successfully

---

## 📞 Support & Escalation

**If you encounter issues:**
1. Check `PHASE_3_VALIDATION_CHECKLIST.md` for troubleshooting
2. Review `PHASE_3_DATAVERSE_SETUP.md` for detailed steps
3. Verify all environment variables are set correctly
4. Check Power Automate run history for errors
5. Escalate to Tim Bryant if blocked

---

## 🏁 Final Verification

**Before marking complete, verify:**
- [ ] Dataverse table has at least 1 record
- [ ] Power Automate flow shows "Succeeded" status
- [ ] Studio MetricsPanel displays 5 KPI tiles
- [ ] All KPI values are non-zero
- [ ] Build/lint/test all pass
- [ ] 3 screenshots committed
- [ ] Both completion docs signed
- [ ] Tag `v3.0-complete` pushed

---

**Status:** ✅ **READY FOR EXECUTION**  
**Start Time:** _[RECORD START TIME]_  
**Expected Completion:** _[START TIME + 3 hours]_

**Execute with precision. Document with evidence. Deliver with excellence.**

🚀 **BEGIN PHASE 3 ACTIVATION NOW** 🚀
