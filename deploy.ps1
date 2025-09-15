# Allumi Platform - Quick Deploy Script (Windows)
# This script automates the deployment process to get you live in minutes
# Run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\deploy.ps1

$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-Host "🚀 Allumi Quick Deploy Script" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host ""

# Function to check if command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to prompt with default value
function Prompt-WithDefault {
    param(
        [string]$Prompt,
        [string]$Default
    )
    
    $response = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($response)) {
        return $Default
    }
    return $response
}

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Blue

if (!(Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "Visit: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (!(Test-Command "npm")) {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

if (!(Test-Command "git")) {
    Write-Host "⚠️  Git is not installed. Installing git is recommended." -ForegroundColor Yellow
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "Step 2: Installing dependencies..." -ForegroundColor Blue
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Environment Setup
Write-Host "Step 3: Setting up environment variables..." -ForegroundColor Blue

if (!(Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
    }
    else {
        New-Item ".env.local" -ItemType File | Out-Null
    }
    
    Write-Host "Please enter your environment variables:" -ForegroundColor Yellow
    Write-Host ""
    
    # Supabase
    Write-Host "Supabase Configuration:" -ForegroundColor Yellow
    $supabaseUrl = Prompt-WithDefault "Supabase URL" "https://your-project.supabase.co"
    $supabaseAnonKey = Prompt-WithDefault "Supabase Anon Key" "your-anon-key"
    
    # Stripe
    Write-Host "Stripe Configuration:" -ForegroundColor Yellow
    $stripePublishableKey = Prompt-WithDefault "Stripe Publishable Key" "pk_test_..."
    $stripeSecretKey = Prompt-WithDefault "Stripe Secret Key" "sk_test_..."
    $stripeWebhookSecret = Prompt-WithDefault "Stripe Webhook Secret (optional)" "whsec_..."
    
    # Write to .env.local
    @"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripePublishableKey
STRIPE_SECRET_KEY=$stripeSecretKey
STRIPE_WEBHOOK_SECRET=$stripeWebhookSecret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
}
else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}
Write-Host ""

# Step 4: Database Setup
Write-Host "Step 4: Setting up database..." -ForegroundColor Blue

if (Test-Command "npx") {
    Write-Host "Database setup reminder:" -ForegroundColor Yellow
    Write-Host "  Please run: npx supabase db push" -ForegroundColor Yellow
}
else {
    Write-Host "⚠️  Please set up your Supabase database manually" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Build the application
Write-Host "Step 5: Building the application..." -ForegroundColor Blue

try {
    npm run build
    Write-Host "✅ Build successful" -ForegroundColor Green
}
catch {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Deploy to Vercel
Write-Host "Step 6: Deploying to Vercel..." -ForegroundColor Blue

if (Test-Command "vercel") {
    Write-Host "Starting Vercel deployment..." -ForegroundColor Yellow
    vercel --prod
}
else {
    Write-Host "Vercel CLI not installed. Installing..." -ForegroundColor Yellow
    npm i -g vercel
    Write-Host "Starting Vercel deployment..." -ForegroundColor Yellow
    vercel --prod
}

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Set up your custom domain in Vercel" -ForegroundColor Blue
Write-Host "2. Configure Stripe webhooks to your deployment URL" -ForegroundColor Blue
Write-Host "3. Test the attribution tracking at /demo" -ForegroundColor Blue
Write-Host "4. Launch your lifetime deal!" -ForegroundColor Blue
Write-Host ""
Write-Host "💡 Quick Links:" -ForegroundColor Yellow
Write-Host "  Sales Page: /demo" -ForegroundColor Blue
Write-Host "  Launch Checklist: /launch" -ForegroundColor Blue
Write-Host "  Sitemap: /sitemap-test" -ForegroundColor Blue
Write-Host ""
Write-Host "Ready to make your first `$10k! 🚀" -ForegroundColor Green