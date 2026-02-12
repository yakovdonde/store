# Store Type Switcher Script (PowerShell)
# Usage: .\switch-store.ps1 [store-type]
# Example: .\switch-store.ps1 car-parts

param(
    [Parameter(Mandatory=$true)]
    [string]$StoreType
)

$validTypes = @('judaica', 'car-parts')

if ($validTypes -notcontains $StoreType) {
    Write-Host "❌ Invalid store type: $StoreType" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available store types:" -ForegroundColor Yellow
    Write-Host "  - judaica"
    Write-Host "  - car-parts"
    Write-Host ""
    Write-Host "Example: .\switch-store.ps1 car-parts"
    exit 1
}

Write-Host "🔄 Switching store type to: $StoreType" -ForegroundColor Cyan
Write-Host ""

# Update docker-compose.yml
if (Test-Path "docker-compose.yml") {
    $content = Get-Content "docker-compose.yml" -Raw
    $content = $content -replace "NEXT_PUBLIC_STORE_TYPE: .*", "NEXT_PUBLIC_STORE_TYPE: $StoreType"
    Set-Content "docker-compose.yml" -Value $content
    Write-Host "✅ Updated docker-compose.yml" -ForegroundColor Green
}

# Update frontend/.env.local if it exists
$envPath = "frontend\.env.local"
if (Test-Path $envPath) {
    $content = Get-Content $envPath -Raw
    if ($content -match "NEXT_PUBLIC_STORE_TYPE") {
        $content = $content -replace "NEXT_PUBLIC_STORE_TYPE=.*", "NEXT_PUBLIC_STORE_TYPE=$StoreType"
    } else {
        $content += "`nNEXT_PUBLIC_STORE_TYPE=$StoreType"
    }
    Set-Content $envPath -Value $content
    Write-Host "✅ Updated $envPath" -ForegroundColor Green
} else {
    "NEXT_PUBLIC_STORE_TYPE=$StoreType" | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ Created $envPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Store type switched to: $StoreType" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Rebuild Docker containers: docker-compose down; docker-compose up --build -d"
Write-Host "  2. Or restart dev server: npm run dev"
Write-Host ""
Write-Host "Visit http://localhost:3000 to see your $StoreType store!" -ForegroundColor Cyan
