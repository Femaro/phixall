# Vercel Environment Variables Setup Script
# This script adds all Firebase environment variables to your Vercel project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel Firebase Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelVersion = vercel --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Vercel CLI is not installed!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "Vercel CLI version: $vercelVersion" -ForegroundColor Green
Write-Host ""

# Environment variables to add
$envVars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyAEoieAgpx2ExNauC1IoauAZV-UsXh1MTg"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "phixall-4c0a2.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "phixall-4c0a2"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "phixall-4c0a2.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "116906563573"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:116906563573:web:4ac86209e77ed2c98432bc"
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" = "G-2BXK7BFXF3"
}

Write-Host "This script will add the following environment variables:" -ForegroundColor Yellow
$envVars.Keys | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
Write-Host ""

Write-Host "Note: You'll need to confirm each variable addition." -ForegroundColor Yellow
Write-Host "Press Enter to continue or Ctrl+C to cancel..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Adding environment variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding: $key" -ForegroundColor Green
    
    # Use echo to pipe the value to vercel env add
    # This avoids the interactive prompt
    $value | vercel env add $key production preview development
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Successfully added!" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to add (might already exist)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment Variables Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify variables in Vercel Dashboard:" -ForegroundColor White
Write-Host "   https://vercel.com/femaros-projects/phixall-web/settings/environment-variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Redeploy your application:" -ForegroundColor White
Write-Host "   vercel --prod --yes" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Whitelist your Vercel domain in Firebase:" -ForegroundColor White
Write-Host "   - Go to Firebase Console > Authentication > Settings" -ForegroundColor White
Write-Host "   - Add: phixall-35p43jlhs-femaros-projects.vercel.app" -ForegroundColor Cyan
Write-Host ""

