# Script to load Docker images from offline files
# Run this on the target machine after copying docker-images folder

Write-Host "=== Loading Docker Images from Offline Files ===" -ForegroundColor Green
Write-Host ""

$imagesDir = "docker-images"

# Check if directory exists
if (-not (Test-Path $imagesDir)) {
    Write-Host "✗ Error: '$imagesDir' directory not found!" -ForegroundColor Red
    Write-Host "Please copy the docker-images folder to this directory first." -ForegroundColor Yellow
    exit 1
}

# Get all tar files
$tarFiles = Get-ChildItem -Path $imagesDir -Filter "*.tar"
if ($tarFiles.Count -eq 0) {
    Write-Host "✗ Error: No .tar files found in '$imagesDir'!" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($tarFiles.Count) image files to load" -ForegroundColor Cyan
Write-Host ""

# Load each image
$loaded = 0
$failed = 0

foreach ($tarFile in $tarFiles) {
    Write-Host "Loading $($tarFile.Name)..." -ForegroundColor Yellow
    docker load -i $tarFile.FullName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Loaded successfully" -ForegroundColor Green
        $loaded++
    } else {
        Write-Host "✗ Failed to load" -ForegroundColor Red
        $failed++
    }
    Write-Host ""
}

# Summary
Write-Host "=== Loading Complete ===" -ForegroundColor Green
Write-Host "Successfully loaded: $loaded" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Failed: $failed" -ForegroundColor Red
}
Write-Host ""

# Verify images
Write-Host "Verifying loaded images..." -ForegroundColor Cyan
docker images | Select-String -Pattern "mysql|node|nginx|adminer|backend|frontend"
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All images loaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure .env file is configured" -ForegroundColor White
    Write-Host "2. Run: docker-compose up -d" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠ Some images failed to load. Please check errors above." -ForegroundColor Yellow
}
