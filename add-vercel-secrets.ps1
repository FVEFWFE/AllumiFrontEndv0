# PowerShell script to add Vercel secrets

# Add required secrets
vercel env add NEXT_PUBLIC_SUPABASE_URL production < echo "https://fyvxgciqfifjsycibikn.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production < echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3Nzk5NjcsImV4cCI6MjA3MzM1NTk2N30._sJZpU22xSJlsePLPMjDql9vbZ1VPoPNmN4wLnO-XQ4"
vercel env add NEXT_PUBLIC_APP_URL production < echo "https://allumi-front-endv0.vercel.app"

Write-Host "Secrets added successfully!"