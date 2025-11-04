# Create Service Principal using Microsoft Graph PowerShell
# This explicitly creates the Enterprise Application object

Write-Host "=== CREATE SERVICE PRINCIPAL VIA MICROSOFT GRAPH ===" -ForegroundColor Cyan
Write-Host ""

$appId = "8b232120-1a73-4db4-9b0d-9bd4d4b82c10"
$tenantId = "2b9299fd-322f-4c29-83c0-7a10086e8d29"

Write-Host "Checking if Microsoft.Graph module is installed..." -ForegroundColor Yellow

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {
    Write-Host "Microsoft.Graph module not found. Installing..." -ForegroundColor Yellow
    Install-Module Microsoft.Graph -Scope CurrentUser -Force
}

Write-Host "Importing Microsoft.Graph.Applications module..." -ForegroundColor Yellow
Import-Module Microsoft.Graph.Applications

Write-Host ""
Write-Host "Connecting to Microsoft Graph..." -ForegroundColor Yellow
Write-Host "A browser window will open for authentication" -ForegroundColor Gray
Write-Host ""

try {
    Connect-MgGraph -TenantId $tenantId -Scopes "Application.ReadWrite.All", "Directory.ReadWrite.All"
    
    Write-Host ""
    Write-Host "Checking if Service Principal already exists..." -ForegroundColor Yellow
    
    $existingSp = Get-MgServicePrincipal -Filter "appId eq '$appId'" -ErrorAction SilentlyContinue
    
    if ($existingSp) {
        Write-Host "Service Principal already exists!" -ForegroundColor Green
        Write-Host "  Object ID: $($existingSp.Id)" -ForegroundColor White
        Write-Host "  Display Name: $($existingSp.DisplayName)" -ForegroundColor White
        Write-Host "  Enabled: $($existingSp.AccountEnabled)" -ForegroundColor White
        Write-Host ""
        
        if (-not $existingSp.AccountEnabled) {
            Write-Host "WARNING: Service Principal is DISABLED!" -ForegroundColor Red
            Write-Host "Enabling it now..." -ForegroundColor Yellow
            Update-MgServicePrincipal -ServicePrincipalId $existingSp.Id -AccountEnabled:$true
            Write-Host "Service Principal enabled!" -ForegroundColor Green
        }
        
    } else {
        Write-Host "Service Principal does NOT exist. Creating it now..." -ForegroundColor Yellow
        Write-Host ""
        
        $params = @{
            AppId = $appId
            AccountEnabled = $true
        }
        
        $newSp = New-MgServicePrincipal -BodyParameter $params
        
        Write-Host "SUCCESS! Service Principal created" -ForegroundColor Green
        Write-Host "  Object ID: $($newSp.Id)" -ForegroundColor White
        Write-Host "  Display Name: $($newSp.DisplayName)" -ForegroundColor White
        Write-Host "  App ID: $($newSp.AppId)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "1. Wait 5 minutes for propagation"
    Write-Host "2. Run: npx tsx scripts/test-dataverse-integration.ts"
    Write-Host ""
    
    Disconnect-MgGraph
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure you have admin permissions in the tenant" -ForegroundColor Yellow
}
