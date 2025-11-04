# Detailed diagnostic of the token request
# This will show us exactly what Azure AD sees

$tenant = '2b9299fd-322f-4c29-83c0-7a10086e8d29'
$client = '8b232120-1a73-4db4-9b0d-9bd4d4b82c10'
$secret = 'f859b8f2-67d6-4be5-a3d5-edb401967468'
$resource = 'https://apexai-dev.crm.dynamics.com'

Write-Host "=== DETAILED TOKEN REQUEST DIAGNOSTIC ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Tenant ID: $tenant"
Write-Host "  Client ID: $client"
Write-Host "  Resource: $resource"
Write-Host ""

# Test 1: Try with Dataverse resource
Write-Host "TEST 1: Token request for Dataverse" -ForegroundColor Cyan
Write-Host "  Endpoint: https://login.microsoftonline.com/$tenant/oauth2/token" -ForegroundColor Gray
Write-Host "  Resource: $resource" -ForegroundColor Gray
Write-Host ""

$tokenUrl = "https://login.microsoftonline.com/$tenant/oauth2/token"
$body = @{
    client_id     = $client
    client_secret = $secret
    grant_type    = 'client_credentials'
    resource      = $resource
}

try {
    $response = Invoke-RestMethod -Method POST -Uri $tokenUrl -Body $body -ContentType "application/x-www-form-urlencoded"
    Write-Host "  Result: SUCCESS" -ForegroundColor Green
    Write-Host "  Token acquired for: $($response.resource)" -ForegroundColor White
} catch {
    Write-Host "  Result: FAILED" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        $errorObj = $responseBody | ConvertFrom-Json
        
        Write-Host "  Error Code: $($errorObj.error)" -ForegroundColor Yellow
        Write-Host "  Error: $($errorObj.error_description)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 2: Try with Microsoft Graph (to verify service principal exists)
Write-Host "TEST 2: Token request for Microsoft Graph (verification)" -ForegroundColor Cyan
Write-Host "  Endpoint: https://login.microsoftonline.com/$tenant/oauth2/token" -ForegroundColor Gray
Write-Host "  Resource: https://graph.microsoft.com" -ForegroundColor Gray
Write-Host ""

$body2 = @{
    client_id     = $client
    client_secret = $secret
    grant_type    = 'client_credentials'
    resource      = 'https://graph.microsoft.com'
}

try {
    $response2 = Invoke-RestMethod -Method POST -Uri $tokenUrl -Body $body2 -ContentType "application/x-www-form-urlencoded"
    Write-Host "  Result: SUCCESS" -ForegroundColor Green
    Write-Host "  Token acquired for: $($response2.resource)" -ForegroundColor White
    Write-Host ""
    Write-Host "CONCLUSION: Service Principal EXISTS and can authenticate" -ForegroundColor Green
    Write-Host "The issue is specific to Dataverse resource access" -ForegroundColor Yellow
} catch {
    Write-Host "  Result: FAILED" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        $errorObj = $responseBody | ConvertFrom-Json
        
        Write-Host "  Error Code: $($errorObj.error)" -ForegroundColor Yellow
        Write-Host "  Error: $($errorObj.error_description)" -ForegroundColor Red
        Write-Host ""
        Write-Host "CONCLUSION: Service Principal does NOT exist or is misconfigured" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 3: Check tenant info
Write-Host "TEST 3: Verify tenant endpoint" -ForegroundColor Cyan
$tenantInfoUrl = "https://login.microsoftonline.com/$tenant/v2.0/.well-known/openid-configuration"
Write-Host "  Fetching: $tenantInfoUrl" -ForegroundColor Gray

try {
    $tenantInfo = Invoke-RestMethod -Uri $tenantInfoUrl -Method Get
    Write-Host "  Result: SUCCESS" -ForegroundColor Green
    Write-Host "  Tenant: $($tenantInfo.issuer)" -ForegroundColor White
    Write-Host "  Token Endpoint: $($tenantInfo.token_endpoint)" -ForegroundColor White
} catch {
    Write-Host "  Result: FAILED" -ForegroundColor Red
    Write-Host "  Tenant ID might be incorrect" -ForegroundColor Yellow
}
