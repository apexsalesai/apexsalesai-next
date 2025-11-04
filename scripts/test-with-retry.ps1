# Test Dataverse authentication with retry logic
# Waits for Azure AD propagation

$tenant = '2b9299fd-322f-4c29-83c0-7a10086e8d29'
$client = '8b232120-1a73-4db4-9b0d-9bd4d4b82c10'
$secret = 'f859b8f2-67d6-4be5-a3d5-edb401967468'
$resource = 'https://apexai-dev.crm.dynamics.com'

$maxAttempts = 10
$waitSeconds = 120  # 2 minutes between attempts

Write-Host "=== DATAVERSE AUTHENTICATION TEST WITH RETRY ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Principal was just created. Testing authentication..." -ForegroundColor Yellow
Write-Host "Will retry every $waitSeconds seconds for up to $maxAttempts attempts" -ForegroundColor Gray
Write-Host ""

$tokenUrl = "https://login.microsoftonline.com/$tenant/oauth2/token"

for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    Write-Host "Attempt $attempt of $maxAttempts..." -ForegroundColor Cyan
    Write-Host "  Time: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
    
    $body = @{
        client_id     = $client
        client_secret = $secret
        grant_type    = 'client_credentials'
        resource      = $resource
    }
    
    try {
        $response = Invoke-RestMethod -Method POST -Uri $tokenUrl -Body $body -ContentType "application/x-www-form-urlencoded"
        
        Write-Host ""
        Write-Host "SUCCESS! Authentication working!" -ForegroundColor Green
        Write-Host "  Token Type: $($response.token_type)" -ForegroundColor White
        Write-Host "  Expires In: $($response.expires_in) seconds" -ForegroundColor White
        Write-Host "  Resource: $($response.resource)" -ForegroundColor White
        Write-Host ""
        Write-Host "Azure AD propagation complete!" -ForegroundColor Green
        Write-Host "You can now run: npx tsx scripts/test-dataverse-integration.ts" -ForegroundColor Cyan
        exit 0
        
    } catch {
        $errorMessage = $_.Exception.Message
        
        if ($errorMessage -like "*700016*") {
            Write-Host "  Status: Still propagating (Error 700016)" -ForegroundColor Yellow
        } else {
            Write-Host "  Status: Different error - $errorMessage" -ForegroundColor Red
        }
        
        if ($attempt -lt $maxAttempts) {
            Write-Host "  Waiting $waitSeconds seconds before next attempt..." -ForegroundColor Gray
            Write-Host ""
            Start-Sleep -Seconds $waitSeconds
        }
    }
}

Write-Host ""
Write-Host "TIMEOUT: Authentication still failing after $maxAttempts attempts" -ForegroundColor Red
Write-Host "Azure AD propagation may take longer than expected (up to 24 hours in rare cases)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Recommended actions:" -ForegroundColor Cyan
Write-Host "1. Wait another 30 minutes and try again"
Write-Host "2. Contact Microsoft Support if issue persists beyond 24 hours"
