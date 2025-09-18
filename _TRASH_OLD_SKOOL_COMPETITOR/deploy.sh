#!/bin/bash

# Allumi Platform - Quick Deploy Script
# This script automates the deployment process to get you live in minutes
# Run: chmod +x deploy.sh && ./deploy.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Allumi Quick Deploy Script${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    echo -e "${YELLOW}⚠️  Windows detected. Please use deploy.ps1 instead.${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local response

    read -p "$prompt [$default]: " response
    echo "${response:-$default}"
}

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

if ! command_exists git; then
    echo -e "${YELLOW}⚠️  Git is not installed. Installing git is recommended.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 2: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi
echo ""

# Step 3: Environment Setup
echo -e "${BLUE}Step 3: Setting up environment variables...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.local.example .env.local 2>/dev/null || touch .env.local
    
    echo "Please enter your environment variables:"
    echo ""
    
    # Supabase
    echo -e "${YELLOW}Supabase Configuration:${NC}"
    SUPABASE_URL=$(prompt_with_default "Supabase URL" "https://your-project.supabase.co")
    SUPABASE_ANON_KEY=$(prompt_with_default "Supabase Anon Key" "your-anon-key")
    
    # Stripe
    echo -e "${YELLOW}Stripe Configuration:${NC}"
    STRIPE_PUBLISHABLE_KEY=$(prompt_with_default "Stripe Publishable Key" "pk_test_...")
    STRIPE_SECRET_KEY=$(prompt_with_default "Stripe Secret Key" "sk_test_...")
    STRIPE_WEBHOOK_SECRET=$(prompt_with_default "Stripe Webhook Secret (optional)" "whsec_...")
    
    # Write to .env.local
    cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    
    echo -e "${GREEN}✅ Environment variables configured${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi
echo ""

# Step 4: Database Setup
echo -e "${BLUE}Step 4: Setting up database...${NC}"

if command_exists npx; then
    echo "Running Supabase migrations..."
    # Uncomment when Supabase CLI is set up
    # npx supabase db push
    echo -e "${YELLOW}⚠️  Please run database migrations manually:${NC}"
    echo "  npx supabase db push"
else
    echo -e "${YELLOW}⚠️  Please set up your Supabase database manually${NC}"
fi
echo ""

# Step 5: Build the application
echo -e "${BLUE}Step 5: Building the application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi
echo ""

# Step 6: Deploy to Vercel
echo -e "${BLUE}Step 6: Deploying to Vercel...${NC}"

if command_exists vercel; then
    echo "Starting Vercel deployment..."
    vercel --prod
else
    echo -e "${YELLOW}Vercel CLI not installed. Installing...${NC}"
    npm i -g vercel
    echo "Starting Vercel deployment..."
    vercel --prod
fi

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. ${BLUE}Set up your custom domain in Vercel${NC}"
echo -e "2. ${BLUE}Configure Stripe webhooks to your deployment URL${NC}"
echo -e "3. ${BLUE}Test the attribution tracking at /demo${NC}"
echo -e "4. ${BLUE}Launch your lifetime deal!${NC}"
echo ""
echo -e "${YELLOW}💡 Quick Links:${NC}"
echo -e "  Sales Page: ${BLUE}/demo${NC}"
echo -e "  Launch Checklist: ${BLUE}/launch${NC}"
echo -e "  Sitemap: ${BLUE}/sitemap-test${NC}"
echo ""
echo -e "${GREEN}Ready to make your first $10k! 🚀${NC}"