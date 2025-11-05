# Script to save Docker images for offline distribution
# Run this on a machine with working internet connection

Write-Host "=== Saving Docker Images for Offline Distribution ===" -ForegroundColor Green
Write-Host ""

# Create directory for images
$imagesDir = "docker-images"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir | Out-Null
    Write-Host "✓ Created directory: $imagesDir" -ForegroundColor Green
}

# Pull required base images
Write-Host ""
Write-Host "Step 1: Pulling required base images..." -ForegroundColor Cyan
$images = @(
    "mysql:8.0",
    "node:18-alpine",
    "nginx:alpine",
    "adminer:latest"
)

foreach ($image in $images) {
    Write-Host "  Pulling $image..." -ForegroundColor Yellow
    docker pull $image
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Successfully pulled $image" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to pull $image" -ForegroundColor Red
        exit 1
    }
}

# Build project images
Write-Host ""
Write-Host "Step 2: Building project images..." -ForegroundColor Cyan
docker-compose build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed successfully" -ForegroundColor Green

# Save all images to tar files
Write-Host ""
Write-Host "Step 3: Saving images to tar files..." -ForegroundColor Cyan

$exportImages = @(
    @{Name="mysql:8.0"; File="mysql-8.0.tar"},
    @{Name="node:18-alpine"; File="node-18-alpine.tar"},
    @{Name="nginx:alpine"; File="nginx-alpine.tar"},
    @{Name="adminer:latest"; File="adminer-latest.tar"},
    @{Name="1-backend"; File="handmade-backend.tar"},
    @{Name="1-frontend"; File="handmade-frontend.tar"}
)

foreach ($img in $exportImages) {
    $outputPath = Join-Path $imagesDir $img.File
    Write-Host "  Saving $($img.Name) to $($img.File)..." -ForegroundColor Yellow
    docker save -o $outputPath $img.Name
    if ($LASTEXITCODE -eq 0) {
        $size = (Get-Item $outputPath).Length / 1MB
        Write-Host "  ✓ Saved ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to save $($img.Name)" -ForegroundColor Red
    }
}

# Calculate total size
$totalSize = (Get-ChildItem $imagesDir -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ""
Write-Host "=== Export Complete ===" -ForegroundColor Green
Write-Host "Total size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
Write-Host "Images saved to: $((Get-Item $imagesDir).FullName)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the '$imagesDir' folder to the target machine" -ForegroundColor White
Write-Host "2. Run load-docker-images.ps1 on the target machine" -ForegroundColor White
Write-Host ""
