# ============================================================================
# DATAVERSE OAUTH2 TOKEN TEST
# ============================================================================
# Purpose: Validate Azure AD Service Principal credentials and obtain access token
# Usage:   pwsh ./scripts/test-dataverse-token.ps1
# Expected: 200 OK + Bearer token (expires in 3599 seconds)
# ============================================================================

Write-Host "`n🔐 Testing Dataverse OAuth2 Token Acquisition..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# ============================================================================
# STEP 1: Load Environment Variables
# ============================================================================

Write-Host "📋 Loading credentials from .env.local..." -ForegroundColor Yellow

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ ERROR: .env.local not found!" -ForegroundColor Red
    Write-Host "   Create .env.local with the following variables:" -ForegroundColor Red
    Write-Host "   - AZURE_TENANT_ID" -ForegroundColor Red
    Write-Host "   - AZURE_CLIENT_ID" -ForegroundColor Red
    Write-Host "   - AZURE_CLIENT_SECRET" -ForegroundColor Red
    Write-Host "   - DATAVERSE_RESOURCE`n" -ForegroundColor Red
    exit 1
}

# Parse .env.local
$envVars = @{}
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        $envVars[$key] = $value
    }
}

$tenantId = $envVars['AZURE_TENANT_ID']
$clientId = $envVars['AZURE_CLIENT_ID']
$clientSecret = $envVars['AZURE_CLIENT_SECRET']
$resource = $envVars['DATAVERSE_RESOURCE']

# Validate required variables
$missing = @()
if (-not $tenantId) { $missing += "AZURE_TENANT_ID" }
if (-not $clientId) { $missing += "AZURE_CLIENT_ID" }
if (-not $clientSecret) { $missing += "AZURE_CLIENT_SECRET" }
if (-not $resource) { $missing += "DATAVERSE_RESOURCE" }

if ($missing.Count -gt 0) {
    Write-Host "❌ ERROR: Missing required environment variables:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
    exit 1
}

Write-Host "✅ Credentials loaded successfully`n" -ForegroundColor Green

# Display masked credentials
Write-Host "📌 Configuration:" -ForegroundColor Cyan
Write-Host "   Tenant ID:  $($tenantId.Substring(0, 8))..." -ForegroundColor Gray
Write-Host "   Client ID:  $($clientId.Substring(0, 8))..." -ForegroundColor Gray
Write-Host "   Secret:     $($clientSecret.Substring(0, 8))..." -ForegroundColor Gray
Write-Host "   Resource:   $resource`n" -ForegroundColor Gray

# ============================================================================
# STEP 2: Request OAuth2 Token
# ============================================================================

Write-Host "🔄 Requesting OAuth2 token from Azure AD..." -ForegroundColor Yellow

$scope = "$resource/.default"
$tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"

$body = @{
    client_id     = $clientId
    client_secret = $clientSecret
    grant_type    = "client_credentials"
    scope         = $scope
}

try {
    $response = Invoke-RestMethod -Method Post `
        -Uri $tokenUrl `
        -ContentType "application/x-www-form-urlencoded" `
        -Body $body `
        -ErrorAction Stop

    Write-Host "✅ Token acquired successfully!`n" -ForegroundColor Green

    # Display token details
    Write-Host "📊 Token Details:" -ForegroundColor Cyan
    Write-Host "   Token Type:  $($response.token_type)" -ForegroundColor Gray
    Write-Host "   Expires In:  $($response.expires_in) seconds ($([math]::Round($response.expires_in / 60)) minutes)" -ForegroundColor Gray
    Write-Host "   Scope:       $($response.scope)`n" -ForegroundColor Gray

    # Display truncated token
    $token = $response.access_token
    Write-Host "🎫 Access Token (truncated):" -ForegroundColor Cyan
    Write-Host "   $($token.Substring(0, 50))...`n" -ForegroundColor Gray

    # ============================================================================
    # STEP 3: Validate Token (Optional - Test Dataverse API)
    # ============================================================================

    Write-Host "🧪 Testing token with Dataverse API..." -ForegroundColor Yellow

    $testUrl = "$resource/api/data/v9.2/WhoAmI"
    
    try {
        $whoAmI = Invoke-RestMethod -Method Get `
            -Uri $testUrl `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Accept" = "application/json"
                "OData-MaxVersion" = "4.0"
                "OData-Version" = "4.0"
            } `
            -ErrorAction Stop

        Write-Host "✅ Token validated successfully!`n" -ForegroundColor Green
        Write-Host "📌 Dataverse Connection Details:" -ForegroundColor Cyan
        Write-Host "   User ID:          $($whoAmI.UserId)" -ForegroundColor Gray
        Write-Host "   Business Unit ID: $($whoAmI.BusinessUnitId)" -ForegroundColor Gray
        Write-Host "   Organization ID:  $($whoAmI.OrganizationId)`n" -ForegroundColor Gray

    } catch {
        Write-Host "⚠️  Token acquired but Dataverse API test failed:" -ForegroundColor Yellow
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   This may indicate missing API permissions or incorrect resource URL.`n" -ForegroundColor Yellow
    }

    # ============================================================================
    # SUCCESS SUMMARY
    # ============================================================================

    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ OAUTH2 TOKEN TEST PASSED" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Verify API permissions in Azure Portal" -ForegroundColor Gray
    Write-Host "   2. Create Dataverse table (apex_campaignmetrics)" -ForegroundColor Gray
    Write-Host "   3. Configure Power Automate flow" -ForegroundColor Gray
    Write-Host "   4. Test end-to-end telemetry pipeline`n" -ForegroundColor Gray

    exit 0

} catch {
    Write-Host "❌ Token request failed!`n" -ForegroundColor Red
    Write-Host "📋 Error Details:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)`n" -ForegroundColor Red

    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   HTTP Status: $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            Write-Host "   Response: $responseBody`n" -ForegroundColor Red
        } catch {
            Write-Host "   (Unable to read response body)`n" -ForegroundColor Red
        }
    }

    Write-Host "🔍 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Verify AZURE_TENANT_ID is correct" -ForegroundColor Yellow
    Write-Host "   2. Verify AZURE_CLIENT_ID matches App Registration" -ForegroundColor Yellow
    Write-Host "   3. Verify AZURE_CLIENT_SECRET is valid and not expired" -ForegroundColor Yellow
    Write-Host "   4. Verify DATAVERSE_RESOURCE URL is correct" -ForegroundColor Yellow
    Write-Host "   5. Check Azure AD App Registration permissions`n" -ForegroundColor Yellow

    exit 1
}
