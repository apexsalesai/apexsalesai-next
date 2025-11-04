$tenantId = "2b9299fd-322f-4c29-83c0-7a10086e8d29"
$clientId = "8b232120-1a73-4db4-9b0d-9bd4d4b82c10"
$clientSecret = "f859b8f2-67d6-4be5-a3d5-edb401967468"
$resource = "https://apexai-dev.crm.dynamics.com"

Write-Host "=== DATAVERSE TOKEN TEST (VERBOSE) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Tenant ID: $tenantId"
Write-Host "  Client ID: $clientId"
Write-Host "  Resource: $resource"
Write-Host ""

# Try OAuth v1 endpoint
Write-Host "Attempting OAuth v1 endpoint..." -ForegroundColor Yellow
$tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/token"

$body = @{
    client_id     = $clientId
    client_secret = $clientSecret
    resource      = $resource
    grant_type    = "client_credentials"
}

Write-Host "Token URL: $tokenUrl" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Method Post -Uri $tokenUrl -Body $body -ContentType "application/x-www-form-urlencoded" -Verbose
    
    Write-Host "SUCCESS! Token acquired" -ForegroundColor Green
    Write-Host "  Token Type: $($response.token_type)"
    Write-Host "  Expires In: $($response.expires_in) seconds"
    Write-Host "  Resource: $($response.resource)"
    Write-Host ""
    
    # Test WhoAmI
    $token = $response.access_token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
        "OData-MaxVersion" = "4.0"
        "OData-Version" = "4.0"
    }
    
    $whoAmIUrl = "$resource/api/data/v9.2/WhoAmI"
    Write-Host "Testing WhoAmI API: $whoAmIUrl" -ForegroundColor Yellow
    
    $whoAmI = Invoke-RestMethod -Method Get -Uri $whoAmIUrl -Headers $headers
    
    Write-Host "SUCCESS! Dataverse API access verified" -ForegroundColor Green
    Write-Host "  User ID: $($whoAmI.UserId)"
    Write-Host "  Business Unit ID: $($whoAmI.BusinessUnitId)"
    Write-Host "  Organization ID: $($whoAmI.OrganizationId)"
    
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Message:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Red
    }
}
