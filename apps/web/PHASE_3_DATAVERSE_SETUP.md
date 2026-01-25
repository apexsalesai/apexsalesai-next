# Phase 3: Dataverse Integration Setup Guide

**Purpose:** Enterprise telemetry pipeline from Apex agents to Neon to Dataverse  
**Status:** Implementation Ready  
**Estimated Time:** 2-3 hours manual Azure setup + 1 hour testing

---

## Architecture Overview

Apex Agents → Neon campaign_metrics → Power Automate → Dataverse Apex_CampaignMetrics
                                                                    ↓
                                                        Studio API Next.js → Metrics Panel

**Why This Design:**
- Decouples app from Dataverse auth complexity
- Power Automate handles ETL rate limits retries
- Dataverse becomes enterprise source of truth for KPIs
- Studio reads via secure service principal

---

## Step 1: Create Neon Postgres Table

**Status:** Migration Ready

**Run Migration:**
```bash
npx prisma migrate deploy
```

**What It Creates:**
- campaign_metrics table with 13 columns
- Indexes for performance
- v_campaign_metrics_pending view for Power Automate
- exported_at column for tracking sync status

---

## Step 2: Create Dataverse Table

**Manual Setup Required:**

1. Go to https://make.powerapps.com
2. Select environment: apexsalesai
3. Navigate to Tables → New table
4. Display Name: Apex Campaign Metrics
5. Schema Name: apex_campaignmetrics
6. Add columns as documented in migration file

---

## Step 3: Create Azure AD Service Principal

**Manual Setup Required:**

1. Azure Portal → App registrations → New
2. Name: apex-dataverse-sp
3. Create client secret
4. Add Dynamics CRM user_impersonation permission
5. Grant admin consent

**Record these values:**
- AZURE_TENANT_ID
- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET
- DATAVERSE_RESOURCE

---

## Step 4: Power Automate Flow

**Create scheduled flow every 5 minutes:**

1. PostgreSQL Get rows from v_campaign_metrics_pending
2. Apply to each row
3. Dataverse Add new row to Apex Campaign Metrics
4. PostgreSQL Update exported_at timestamp

---

## Step 5: Test End-to-End

1. Write test metric to Neon
2. Wait for flow to run
3. Verify row in Dataverse
4. Check Studio Metrics Panel

---

**Full documentation in repository**
