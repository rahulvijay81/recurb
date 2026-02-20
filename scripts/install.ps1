# Recurb Installation Script for Windows
$ErrorActionPreference = "Stop"

Write-Host "=== Recurb Installation Script ===" -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node -v
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($versionNumber -lt 18) {
        Write-Host "Error: Node.js 18+ required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green
}
catch {
    Write-Host "Error: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Create data directory
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
}

# Copy environment file
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file" -ForegroundColor Green
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npm run migrate

# Build application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "=== Installation Complete ===" -ForegroundColor Green
Write-Host "Start the server with: npm start"
Write-Host "Visit http://localhost:3000/setup to complete setup"
