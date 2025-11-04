$tenantId = "2b9299fd-322f-4c29-83c0-7a10086e8d29"
$clientId = "8b232120-1a73-4db4-9b0d-9bd4d4b82c10"
$clientSecret = "f859b8f2-67d6-4be5-a3d5-edb401967468"
$resource = "https://lyfye-default.crm.dynamics.com"

Write-Host "Testing Dataverse OAuth2 Integration..." -ForegroundColor Cyan

$tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/token"

$body = @{
    client_id     = $clientId
    client_secret = $clientSecret
    resource      = $resource
    grant_type    = "client_credentials"
}

$response = Invoke-RestMethod -Method Post -Uri $tokenUrl -Body $body

Write-Host "Token acquired! Expires in: $($response.expires_in) seconds" -ForegroundColor Green

$token = $response.access_token

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "OData-MaxVersion" = "4.0"
    "OData-Version" = "4.0"
}

$whoAmIUrl = "$resource/api/data/v9.2/WhoAmI"
$whoAmI = Invoke-RestMethod -Method Get -Uri $whoAmIUrl -Headers $headers

Write-Host "Dataverse API access verified!" -ForegroundColor Green
Write-Host "User ID: $($whoAmI.UserId)"
Write-Host "Business Unit ID: $($whoAmI.BusinessUnitId)"
Write-Host "Organization ID: $($whoAmI.OrganizationId)"
