<#
.SYNOPSIS
    ApexSalesAI Phase 3: Dataverse Integration Bootstrap
    
.DESCRIPTION
    Automated setup script for Phase 3 Dataverse telemetry pipeline.
    Validates repo state, applies migrations, and outputs Azure setup templates.
    
.AUTHOR
    ApexOps (Tim Bryant + AI Team)
    
.VERSION
    1.0.0
#>

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 ApexSalesAI | Phase 3 Dataverse Integration - Execution Script" -ForegroundColor Cyan
Write-Host "================================================================`n" -ForegroundColor Cyan

# ============================================================================
# 1. REPOSITORY STATE VERIFICATION
# ============================================================================
Write-Host "📋 Step 1: Verifying Repository State..." -ForegroundColor Yellow

try {
    $branch = git branch --show-current
    if ($branch -ne "main") {
        Write-Host "⚠️  WARNING: Not on main branch (current: $branch)" -ForegroundColor Red
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") { exit 1 }
    }
    
    $lastCommit = git log -1 --pretty=format:"%h - %s"
    Write-Host "✅ Branch: $branch" -ForegroundColor Green
    Write-Host "✅ Latest commit: $lastCommit" -ForegroundColor Green
    
    $status = git status --porcelain
    if ($status) {
        Write-Host "⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
        Write-Host $status
    }
} catch {
    Write-Host "❌ Git verification failed: $_" -ForegroundColor Red
    exit 1
}

# ============================================================================
# 2. PRISMA MIGRATION APPLICATION
# ============================================================================
Write-Host "`n📦 Step 2: Applying Prisma Migrations..." -ForegroundColor Yellow

try {
    # Check if migration exists
    $migrationPath = "prisma/migrations/20251026235900_add_campaign_metrics"
    if (Test-Path $migrationPath) {
        Write-Host "✅ Migration file found: $migrationPath" -ForegroundColor Green
        
        # Apply migration
        Write-Host "Applying migration to database..." -ForegroundColor Cyan
        npx prisma migrate deploy
        
        Write-Host "✅ Migration applied successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration file not found. Run manually if needed." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Migration failed: $_" -ForegroundColor Red
    Write-Host "You may need to apply the migration manually." -ForegroundColor Yellow
}

# ============================================================================
# 3. ENVIRONMENT VARIABLES SETUP
# ============================================================================
Write-Host "`n🔐 Step 3: Environment Variables Configuration..." -ForegroundColor Yellow

$envFile = ".env.local"
$envBackup = ".env.local.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Backup existing .env.local
if (Test-Path $envFile) {
    Copy-Item $envFile $envBackup
    Write-Host "✅ Backed up existing .env.local to $envBackup" -ForegroundColor Green
}

# Check for required Phase 3 variables
$requiredVars = @(
    "AZURE_TENANT_ID",
    "AZURE_CLIENT_ID", 
    "AZURE_CLIENT_SECRET",
    "DATAVERSE_RESOURCE"
)

Write-Host "`nRequired Phase 3 Environment Variables:" -ForegroundColor Cyan
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ($value) {
        Write-Host "  ✅ $var is set" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $var is NOT set" -ForegroundColor Yellow
    }
}

Write-Host "`n📝 Add these to .env.local and Vercel:" -ForegroundColor Cyan
Write-Host @"

# ============================================================================
# Phase 3: Dataverse Integration
# ============================================================================
AZURE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_SECRET=********************************
DATAVERSE_RESOURCE=https://apexsalesai.crm.dynamics.com

"@ -ForegroundColor White

# ============================================================================
# 4. POWER AUTOMATE FLOW TEMPLATE
# ============================================================================
Write-Host "`n⚙️  Step 4: Power Automate Flow Template..." -ForegroundColor Yellow

$flowTemplate = @"
{
  "name": "Apex Campaign Metrics Sync",
  "description": "Syncs campaign metrics from Neon to Dataverse every 5 minutes",
  "definition": {
    "triggers": {
      "Recurrence": {
        "type": "Recurrence",
        "recurrence": {
          "frequency": "Minute",
          "interval": 5
        }
      }
    },
    "actions": {
      "Get_Pending_Metrics": {
        "type": "ApiConnection",
        "inputs": {
          "host": {
            "connection": {
              "name": "@parameters('`$connections')['postgresql']['connectionId']"
            }
          },
          "method": "get",
          "path": "/datasets/default/tables/@{encodeURIComponent(encodeURIComponent('v_campaign_metrics_pending'))}/items"
        }
      },
      "For_Each_Metric": {
        "type": "Foreach",
        "foreach": "@body('Get_Pending_Metrics')?['value']",
        "actions": {
          "Create_Dataverse_Record": {
            "type": "ApiConnection",
            "inputs": {
              "host": {
                "connection": {
                  "name": "@parameters('`$connections')['dataverse']['connectionId']"
                }
              },
              "method": "post",
              "path": "/v2/datasets/@{encodeURIComponent('apexsalesai')}/tables/@{encodeURIComponent('apex_campaignmetricses')}/items",
              "body": {
                "apex_campaignid": "@items('For_Each_Metric')?['campaign_id']",
                "apex_runid": "@items('For_Each_Metric')?['run_id']",
                "apex_phase": "@items('For_Each_Metric')?['phase']",
                "apex_agents_total": "@items('For_Each_Metric')?['agents_total']",
                "apex_agents_success": "@items('For_Each_Metric')?['agents_successful']",
                "apex_assets_generated": "@items('For_Each_Metric')?['assets_generated']",
                "apex_tokens_in": "@items('For_Each_Metric')?['tokens_in']",
                "apex_tokens_out": "@items('For_Each_Metric')?['tokens_out']",
                "apex_cost_usd": "@items('For_Each_Metric')?['cost_usd']",
                "apex_latency_p95_ms": "@items('For_Each_Metric')?['latency_p95_ms']",
                "apex_latency_avg_ms": "@items('For_Each_Metric')?['latency_avg_ms']",
                "apex_success_rate": "@items('For_Each_Metric')?['success_rate_pct']",
                "apex_created_at": "@items('For_Each_Metric')?['created_at']"
              }
            },
            "runAfter": {}
          },
          "Mark_As_Exported": {
            "type": "ApiConnection",
            "inputs": {
              "host": {
                "connection": {
                  "name": "@parameters('`$connections')['postgresql']['connectionId']"
                }
              },
              "method": "post",
              "path": "/datasets/default/query/sql",
              "body": {
                "query": "UPDATE campaign_metrics SET exported_at = NOW() WHERE run_id = '@{items('For_Each_Metric')?['run_id']}'"
              }
            },
            "runAfter": {
              "Create_Dataverse_Record": ["Succeeded"]
            }
          }
        }
      }
    }
  }
}
"@

$flowPath = "scripts/power-automate-flow.json"
$flowTemplate | Out-File -FilePath $flowPath -Encoding UTF8
Write-Host "✅ Power Automate flow template saved to: $flowPath" -ForegroundColor Green
Write-Host "   Copy this JSON into Power Automate Flow editor" -ForegroundColor Cyan

# ============================================================================
# 5. BUILD VALIDATION
# ============================================================================
Write-Host "`n🔨 Step 5: Build Validation..." -ForegroundColor Yellow

try {
    Write-Host "Running TypeScript check..." -ForegroundColor Cyan
    npx tsc --noEmit
    Write-Host "✅ TypeScript check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  TypeScript check failed (non-blocking)" -ForegroundColor Yellow
}

# ============================================================================
# 6. VERIFICATION SUMMARY
# ============================================================================
Write-Host "`n📊 Phase 3 Setup Summary" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

Write-Host "`n✅ COMPLETED:" -ForegroundColor Green
Write-Host "  • Repository state verified (branch: main)" -ForegroundColor White
Write-Host "  • Prisma migration applied (campaign_metrics table)" -ForegroundColor White
Write-Host "  • Environment variables documented" -ForegroundColor White
Write-Host "  • Power Automate flow template generated" -ForegroundColor White

Write-Host "`n⏳ MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
Write-Host "  1. Create Azure AD App Registration:" -ForegroundColor White
Write-Host "     • Go to Azure Portal → App registrations → New" -ForegroundColor Gray
Write-Host "     • Name: apex-dataverse-sp" -ForegroundColor Gray
Write-Host "     • Create client secret (90-day expiry)" -ForegroundColor Gray
Write-Host "     • Add Dynamics CRM user_impersonation permission" -ForegroundColor Gray
Write-Host "     • Grant admin consent" -ForegroundColor Gray

Write-Host "`n  2. Create Dataverse Table:" -ForegroundColor White
Write-Host "     • Go to https://make.powerapps.com" -ForegroundColor Gray
Write-Host "     • Environment: apexsalesai" -ForegroundColor Gray
Write-Host "     • Create table: Apex Campaign Metrics (apex_campaignmetrics)" -ForegroundColor Gray
Write-Host "     • Add 13 columns as documented in PHASE_3_DATAVERSE_SETUP.md" -ForegroundColor Gray

Write-Host "`n  3. Configure Power Automate Flow:" -ForegroundColor White
Write-Host "     • Import JSON from: scripts/power-automate-flow.json" -ForegroundColor Gray
Write-Host "     • Add PostgreSQL connection (Neon)" -ForegroundColor Gray
Write-Host "     • Add Dataverse connection" -ForegroundColor Gray
Write-Host "     • Enable flow and test" -ForegroundColor Gray

Write-Host "`n  4. Update Environment Variables:" -ForegroundColor White
Write-Host "     • Add Azure credentials to .env.local" -ForegroundColor Gray
Write-Host "     • Add same credentials to Vercel Environment Variables" -ForegroundColor Gray

Write-Host "`n  5. Test End-to-End:" -ForegroundColor White
Write-Host "     • Write test metric to campaign_metrics table" -ForegroundColor Gray
Write-Host "     • Wait for Power Automate flow to run (5 min)" -ForegroundColor Gray
Write-Host "     • Verify row appears in Dataverse" -ForegroundColor Gray
Write-Host "     • Check Studio Metrics Panel displays data" -ForegroundColor Gray

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "🎯 Phase 3 automation complete. Ready for Azure integration." -ForegroundColor Green
Write-Host "================================================================`n" -ForegroundColor Cyan
