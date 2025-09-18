#!/bin/bash

# Add environment variables to Vercel
echo "Setting environment variables on Vercel..."

# Supabase
echo "https://fyvxgciqfifjsycibikn.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3Nzk5NjcsImV4cCI6MjA3MzM1NTk2N30._sJZpU22xSJlsePLPMjDql9vbZ1VPoPNmN4wLnO-XQ4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# App Configuration
echo "https://allumi.to" | vercel env add NEXT_PUBLIC_APP_URL production
echo "Allumi" | vercel env add NEXT_PUBLIC_SITE_NAME production

# Placeholder values for other services
echo "placeholder" | vercel env add WHOP_API_KEY production
echo "placeholder" | vercel env add WHOP_WEBHOOK_SECRET production
echo "placeholder" | vercel env add WHOP_CLIENT_ID production
echo "placeholder" | vercel env add WHOP_CLIENT_SECRET production
echo "placeholder" | vercel env add NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY production
echo "placeholder" | vercel env add FINGERPRINT_SECRET_KEY production
echo "placeholder" | vercel env add ZAPIER_WEBHOOK_SECRET production
echo "placeholder" | vercel env add NEXT_PUBLIC_POSTHOG_KEY production
echo "https://app.posthog.com" | vercel env add NEXT_PUBLIC_POSTHOG_HOST production

echo "Environment variables set successfully!"