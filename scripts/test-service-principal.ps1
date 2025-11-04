# Test if Service Principal exists and can authenticate
$tenant = '2b9299fd-322f-4c29-83c0-7a10086e8d29'
$client = '8b232120-1a73-4db4-9b0d-9bd4d4b82c10'
$secret = 'f859b8f2-67d6-4be5-a3d5-edb401967468'

Write-Host "=== SERVICE PRINCIPAL VERIFICATION ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing if app can authenticate against Microsoft Graph..." -ForegroundColor Yellow
Write-Host "  Tenant: $tenant"
Write-Host "  Client: $client"
Write-Host ""

$tokenUrl = "https://login.microsoftonline.com/$tenant/oauth2/token"

$body = @{
    client_id     = $client
    client_secret = $secret
    grant_type    = 'client_credentials'
    resource      = 'https://graph.microsoft.com'
}

try {
    $response = Invoke-RestMethod -Method POST -Uri $tokenUrl -Body $body -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "SUCCESS! Service Principal exists and can authenticate" -ForegroundColor Green
    Write-Host "  Token Type: $($response.token_type)"
    Write-Host "  Expires In: $($response.expires_in) seconds"
    Write-Host "  Resource: $($response.resource)"
    Write-Host ""
    Write-Host "CONCLUSION: The service principal EXISTS in Azure AD" -ForegroundColor Green
    Write-Host "The issue is likely with Dataverse-specific configuration" -ForegroundColor Yellow
    
} catch {
    Write-Host "FAILED! Service Principal authentication failed" -ForegroundColor Red
    Write-Host ""
    
    $errorMessage = $_.Exception.Message
    Write-Host "Error: $errorMessage" -ForegroundColor Red
    
    # Try to get the response body
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "Response Body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
    }
    
    Write-Host ""
    
    if ($errorMessage -like "*700016*" -or $responseBody -like "*700016*") {
        Write-Host "CONCLUSION: Service Principal does NOT exist in Azure AD" -ForegroundColor Red
        Write-Host ""
        Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
        Write-Host "  1. Go to Enterprise Applications in Azure Portal"
        Write-Host "  2. Search for client ID: $client"
        Write-Host "  3. If not found, the service principal needs to be created"
    } else {
        Write-Host "CONCLUSION: Different authentication error" -ForegroundColor Yellow
        Write-Host "Review the error message above for details"
    }
}
