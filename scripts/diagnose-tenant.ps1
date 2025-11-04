# Diagnose Tenant and Dataverse Configuration

Write-Host "=== DATAVERSE TENANT DIAGNOSTIC ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$dataverseUrl = "https://lyfye-default.crm.dynamics.com"

Write-Host "Step 1: Checking Dataverse environment metadata..." -ForegroundColor Yellow

try {
    # Try to get OpenID configuration from Dataverse
    $metadataUrl = "$dataverseUrl/.well-known/openid-configuration"
    Write-Host "Fetching: $metadataUrl" -ForegroundColor Gray
    
    $metadata = Invoke-RestMethod -Uri $metadataUrl -Method Get
    
    Write-Host ""
    Write-Host "Dataverse OpenID Configuration:" -ForegroundColor Green
    Write-Host "  Issuer: $($metadata.issuer)" -ForegroundColor White
    Write-Host "  Authorization Endpoint: $($metadata.authorization_endpoint)" -ForegroundColor White
    Write-Host "  Token Endpoint: $($metadata.token_endpoint)" -ForegroundColor White
    
    # Extract tenant ID from issuer
    if ($metadata.issuer -match '([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})') {
        $extractedTenantId = $matches[1]
        Write-Host ""
        Write-Host "EXTRACTED TENANT ID FROM DATAVERSE: $extractedTenantId" -ForegroundColor Cyan
        Write-Host ""
    }
    
} catch {
    Write-Host "Could not fetch OpenID configuration" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Checking configured values..." -ForegroundColor Yellow
Write-Host "  Configured Tenant ID: 2b9299fd-322f-4c29-83c0-7a10086e8d29" -ForegroundColor White
Write-Host "  Configured Client ID: 8b232120-1a73-4db4-9b0d-9bd4d4b82c10" -ForegroundColor White
Write-Host "  Dataverse URL: $dataverseUrl" -ForegroundColor White

Write-Host ""
Write-Host "=== RECOMMENDATION ===" -ForegroundColor Cyan

if ($extractedTenantId -and $extractedTenantId -ne "2b9299fd-322f-4c29-83c0-7a10086e8d29") {
    Write-Host "MISMATCH DETECTED!" -ForegroundColor Red
    Write-Host "  Your Dataverse environment is in tenant: $extractedTenantId" -ForegroundColor Yellow
    Write-Host "  Your app registration is in tenant: 2b9299fd-322f-4c29-83c0-7a10086e8d29" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ACTION REQUIRED:" -ForegroundColor Red
    Write-Host "  Create a new app registration in the correct tenant: $extractedTenantId" -ForegroundColor White
} elseif ($extractedTenantId) {
    Write-Host "Tenant IDs match! The issue is likely with API permissions or app configuration." -ForegroundColor Green
} else {
    Write-Host "Could not determine Dataverse tenant ID from metadata." -ForegroundColor Yellow
}
