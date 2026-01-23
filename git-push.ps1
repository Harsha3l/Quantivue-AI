# Auto Git Push Script
# This script refreshes PATH and automatically pushes code to GitHub

# Refresh PATH to include Git
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Get commit message (use provided message or default with timestamp)
param($message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")

Write-Host "Auto Git Push Script" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is available
try {
    $gitVersion = git --version
    Write-Host "[OK] Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Checking status..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
Write-Host "   Message: $message" -ForegroundColor Gray
git commit -m $message

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[SUCCESS] Pushed to GitHub!" -ForegroundColor Green
        Write-Host "Repository: https://github.com/Harsha3l/Quantivue-AI" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "[ERROR] Push failed. Check the error above." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "[INFO] No changes to commit (working tree clean)" -ForegroundColor Cyan
}

Write-Host ""
