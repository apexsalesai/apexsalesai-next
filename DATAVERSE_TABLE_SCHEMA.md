# Dataverse Table Schema - Campaign Metrics

**Table Created:** October 30, 2025  
**Status:** ✅ LIVE AND CONFIGURED

---

## Table Information

- **Display Name:** `Campaign Metrics`
- **Plural Name:** `Campaign Metrics`
- **Schema Name:** `apex_campaignmetrics`
- **Logical Name:** `apex_campaignmetrics`
- **Entity Set Name:** `apex_campaignmetricses`
- **Type:** Standard
- **Change Tracking:** ✅ Enabled
- **Auditing:** ✅ Enabled

---

## Column Schema (13 Custom Columns)

| # | Display Name | Schema Name | Logical Name | Type | Precision | Required |
|---|--------------|-------------|--------------|------|-----------|----------|
| 1 | Campaign ID | `apex_campaignid` | `apex_campaignid` | Text | Max: 64 | ✅ Yes |
| 2 | Run ID | `apex_runid` | `apex_runid` | Text | Max: 64 | ✅ Yes |
| 3 | Phase | `apex_phase` | `apex_phase` | Text | Max: 16 | ✅ Yes |
| 4 | Agents Total | `apex_agentstotal` | `apex_agentstotal` | Whole Number | - | ✅ Yes |
| 5 | Agents Successful | `apex_agentssuccessful` | `apex_agentssuccessful` | Whole Number | - | ✅ Yes |
| 6 | Assets Generated | `apex_assetsgenerated` | `apex_assetsgenerated` | Whole Number | - | ✅ Yes |
| 7 | Tokens In | `apex_tokensin` | `apex_tokensin` | Whole Number | - | ✅ Yes |
| 8 | Tokens Out | `apex_tokensout` | `apex_tokensout` | Whole Number | - | ✅ Yes |
| 9 | Cost USD | `apex_costusd` | `apex_costusd` | Decimal | 10,5 | ✅ Yes |
| 10 | Latency P95 ms | `apex_latencyp95ms` | `apex_latencyp95ms` | Whole Number | - | ✅ Yes |
| 11 | Latency Avg ms | `apex_latencyavgms` | `apex_latencyavgms` | Whole Number | - | ✅ Yes |
| 12 | Success Rate | `apex_successrate` | `apex_successrate` | Decimal | 5,2 | ✅ Yes |
| 13 | Created At | `apex_createdat` | `apex_createdat` | Date/Time | - | ✅ Yes |

---

## API Endpoint

**Base URL:** `https://apexsalesai.crm.dynamics.com/api/data/v9.2`

**Entity Set:** `apex_campaignmetricses`

**Full Endpoint:** `https://apexsalesai.crm.dynamics.com/api/data/v9.2/apex_campaignmetricses`

---

## Sample API Request

### Create Record (POST)

```http
POST https://apexsalesai.crm.dynamics.com/api/data/v9.2/apex_campaignmetricses
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "apex_campaignid": "campaign-001",
  "apex_runid": "run-001",
  "apex_phase": "2-3",
  "apex_agentstotal": 5,
  "apex_agentssuccessful": 5,
  "apex_assetsgenerated": 12,
  "apex_tokensin": 1500,
  "apex_tokensout": 3000,
  "apex_costusd": 0.00348,
  "apex_latencyp95ms": 51200,
  "apex_latencyavgms": 42000,
  "apex_successrate": 100.00,
  "apex_createdat": "2025-10-30T13:00:00Z"
}
```

### Query Records (GET)

```http
GET https://apexsalesai.crm.dynamics.com/api/data/v9.2/apex_campaignmetricses?$select=apex_campaignid,apex_runid,apex_costusd,apex_successrate&$orderby=apex_createdat desc&$top=10
Authorization: Bearer {access_token}
```

---

## Power Automate Field Mapping

When creating the Power Automate flow, use these exact field names:

| Neon Column | Dataverse Field |
|-------------|-----------------|
| `campaign_id` | `apex_campaignid` |
| `run_id` | `apex_runid` |
| `phase` | `apex_phase` |
| `agents_total` | `apex_agentstotal` |
| `agents_successful` | `apex_agentssuccessful` |
| `assets_generated` | `apex_assetsgenerated` |
| `tokens_in` | `apex_tokensin` |
| `tokens_out` | `apex_tokensout` |
| `cost_usd` | `apex_costusd` |
| `latency_p95_ms` | `apex_latencyp95ms` |
| `latency_avg_ms` | `apex_latencyavgms` |
| `success_rate` | `apex_successrate` |
| `created_at` | `apex_createdat` |

---

## Notes

- **Schema Name Format:** All column schema names use **no underscores** between words (e.g., `agentstotal` not `agents_total`)
- **Decimal Precision:** Cost USD has 5 decimal places, Success Rate has 2
- **Primary Column:** Auto-generated "Name" column exists but is not used
- **Change Tracking:** Enabled for incremental sync support
- **Auditing:** Enabled for compliance and audit trail

---

## Status: ✅ READY FOR PHASE 3 INTEGRATION

**Next Steps:**
1. Create Power Automate flow with field mappings above
2. Test API endpoint with OAuth2 token
3. Verify data sync from Neon to Dataverse
4. Update Studio MetricsPanel to display live KPIs

---

**Created:** October 30, 2025  
**Last Updated:** October 30, 2025  
**Version:** 1.0
