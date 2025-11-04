# Azure App Registration Governance Policy
**ApexSalesAI - Azure AD & Power Platform Standards**

## 📋 Purpose
Establish strict naming conventions and validation procedures for all Azure AD app registrations to prevent orphaned apps, authentication failures, and configuration drift.

---

## 🏷️ Naming Convention

### **Format:**
```
ApexSalesAI-{System}-{Purpose}-v{Version}
```

### **Examples:**
- `ApexSalesAI-Dataverse-v2` - Dataverse integration (current)
- `ApexSalesAI-AgentHub-v1` - Agent orchestration service
- `ApexSalesAI-Studio-v1` - Studio backend API

### **Rules:**
1. **Always include version suffix** (`-v1`, `-v2`, etc.)
2. **Never reuse orphaned app IDs** - create new registration with incremented version
3. **System names:** `Dataverse`, `AgentHub`, `Studio`, `API`, `Frontend`
4. **Purpose:** Brief descriptor (optional, e.g., `-Auth`, `-Integration`)

---

## 🔐 App Registration Checklist

### **Before Creating:**
- [ ] Verify app doesn't already exist: `az ad app list --display-name "<name>"`
- [ ] Document purpose in team wiki/docs
- [ ] Assign owner/responsible team member

### **During Creation:**
- [ ] Use standard naming convention
- [ ] Set `--sign-in-audience AzureADMyOrg` (single tenant)
- [ ] Create service principal immediately: `az ad sp create --id <appId>`
- [ ] Generate and securely store client secret

### **After Creation:**
- [ ] Validate app exists: `az ad app show --id <appId>`
- [ ] Validate service principal exists: `az ad sp show --id <appId>`
- [ ] Grant required API permissions
- [ ] Grant admin consent
- [ ] Document in App Registry (see below)

---

## 📊 App Registry

Maintain `config/azure-apps.json` with all active registrations:

```json
{
  "apps": [
    {
      "name": "ApexSalesAI-Dataverse-v2",
      "appId": "<guid>",
      "purpose": "Dataverse integration for campaign metrics",
      "created": "2025-11-01",
      "owner": "Engineering Team",
      "status": "active",
      "environments": ["production"],
      "permissions": ["Dynamics CRM - user_impersonation"]
    }
  ]
}
```

---

## ✅ Validation Commands

### **Verify App Registration:**
```bash
az ad app show --id <appId> --query "{Name:displayName,AppId:appId,Created:createdDateTime}" -o table
```

### **Verify Service Principal:**
```bash
az ad sp show --id <appId> --query "{Name:displayName,AppId:appId,Enabled:accountEnabled}" -o table
```

### **Test Token Acquisition:**
```bash
az account get-access-token --resource https://apexai-dev.crm.dynamics.com --query accessToken -o tsv
```

---

## 🚨 Troubleshooting Protocol

### **If Error 700016 Occurs:**
1. **Verify tenant:** `az account show --query tenantId -o tsv`
2. **Check app exists:** `az ad app show --id <appId>`
3. **Check SP exists:** `az ad sp show --id <appId>`
4. **If app is orphaned:** Create new registration with incremented version
5. **Never delete and recreate** - always increment version

### **If Permissions Fail:**
1. Verify admin consent granted: Check Azure Portal → App → API permissions
2. Wait 5-10 minutes for propagation
3. Clear token cache if testing locally

---

## 📝 Change Log

| Date | App Name | Action | Reason |
|------|----------|--------|--------|
| 2025-11-01 | ApexSalesAI-Dataverse-v2 | Created | Replaced orphaned v1 app (8b232120-1a73-4db4-9b0d-9bd4d4b82c10) |

---

## 🎯 Accountability

- **Engineering Lead:** Approves all new app registrations
- **DevOps:** Validates service principals before deployment
- **Security:** Reviews permissions quarterly
- **All Team Members:** Follow this standard for ALL Azure resources

---

**Last Updated:** 2025-11-01  
**Owner:** ApexSalesAI Engineering Team  
**Review Cycle:** Quarterly
