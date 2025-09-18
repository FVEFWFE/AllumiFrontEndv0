#!/usr/bin/env node

/**
 * Allumi Environment Checker
 * Validates all required environment variables and services
 * Run: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Required environment variables
const requiredVars = {
  critical: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_APP_URL',
  ],
  recommended: [
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_LIFETIME_PRICE_ID',
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ],
  optional: [
    'NEXT_PUBLIC_POSTHOG_KEY',
    'NEXT_PUBLIC_POSTHOG_HOST',
    'NEXT_PUBLIC_GA_ID',
  ]
};

// Check if .env.local exists
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ .env.local file not found${colors.reset}`);
    console.log(`${colors.yellow}   Run: node scripts/setup-env.js${colors.reset}`);
    return false;
  }
  return true;
}

// Load environment variables
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

// Validate Supabase URL
async function validateSupabaseUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('https://')) {
      resolve({ valid: false, error: 'Invalid URL format' });
      return;
    }
    
    try {
      const urlObj = new URL(url);
      https.get(`${url}/rest/v1/`, (res) => {
        resolve({ valid: res.statusCode < 500, error: res.statusCode >= 500 ? 'Server error' : null });
      }).on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });
    } catch (e) {
      resolve({ valid: false, error: 'Invalid URL' });
    }
  });
}

// Validate Stripe keys
function validateStripeKey(key, type) {
  if (!key) return { valid: false, error: 'Missing key' };
  
  const prefixes = {
    publishable: ['pk_test_', 'pk_live_'],
    secret: ['sk_test_', 'sk_live_'],
    webhook: ['whsec_'],
    price: ['price_']
  };
  
  const validPrefixes = prefixes[type] || [];
  const valid = validPrefixes.some(prefix => key.startsWith(prefix));
  
  return {
    valid,
    error: valid ? null : `Invalid ${type} key format`,
    isLive: key.includes('_live_')
  };
}

// Main check function
async function checkEnvironment() {
  console.log(`${colors.blue}${colors.bright}
╔═══════════════════════════════════════╗
║   🔍 Allumi Environment Check         ║
╚═══════════════════════════════════════╝${colors.reset}
`);

  let hasErrors = false;
  let hasWarnings = false;
  
  // Check env file exists
  if (!checkEnvFile()) {
    return false;
  }
  
  const env = loadEnv();
  console.log(`${colors.green}✅ Found .env.local file${colors.reset}\n`);
  
  // Check critical variables
  console.log(`${colors.magenta}${colors.bright}Critical Variables:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  for (const varName of requiredVars.critical) {
    const value = env[varName];
    let status = '✅';
    let message = 'Set';
    
    if (!value || value === '' || value.includes('your-')) {
      status = '❌';
      message = 'Missing or invalid';
      hasErrors = true;
    } else {
      // Additional validation
      if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
        const validation = await validateSupabaseUrl(value);
        if (!validation.valid) {
          status = '⚠️';
          message = `Set but ${validation.error}`;
          hasWarnings = true;
        }
      } else if (varName === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') {
        const validation = validateStripeKey(value, 'publishable');
        if (!validation.valid) {
          status = '❌';
          message = validation.error;
          hasErrors = true;
        } else if (validation.isLive) {
          status = '⚠️';
          message = 'Using LIVE key';
          hasWarnings = true;
        }
      } else if (varName === 'STRIPE_SECRET_KEY') {
        const validation = validateStripeKey(value, 'secret');
        if (!validation.valid) {
          status = '❌';
          message = validation.error;
          hasErrors = true;
        } else if (validation.isLive) {
          status = '⚠️';
          message = 'Using LIVE key';
          hasWarnings = true;
        }
      }
    }
    
    console.log(`${status} ${varName}: ${message}`);
  }
  
  // Check recommended variables
  console.log(`\n${colors.magenta}${colors.bright}Recommended Variables:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  for (const varName of requiredVars.recommended) {
    const value = env[varName];
    let status = '✅';
    let message = 'Set';
    
    if (!value || value === '' || value.includes('your-') || value.includes('_...')) {
      status = '⚠️';
      message = 'Not configured';
      hasWarnings = true;
    } else {
      // Additional validation
      if (varName === 'STRIPE_WEBHOOK_SECRET') {
        const validation = validateStripeKey(value, 'webhook');
        if (!validation.valid && value !== 'whsec_...') {
          status = '⚠️';
          message = 'Invalid format';
          hasWarnings = true;
        }
      } else if (varName === 'STRIPE_LIFETIME_PRICE_ID') {
        const validation = validateStripeKey(value, 'price');
        if (!validation.valid && value !== 'price_') {
          status = '⚠️';
          message = 'Invalid format';
          hasWarnings = true;
        }
      }
    }
    
    console.log(`${status} ${varName}: ${message}`);
  }
  
  // Check optional variables
  console.log(`\n${colors.magenta}${colors.bright}Optional Variables:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  for (const varName of requiredVars.optional) {
    const value = env[varName];
    const status = value && value !== '' ? '✅' : '○';
    const message = value && value !== '' ? 'Set' : 'Not set';
    console.log(`${status} ${varName}: ${message}`);
  }
  
  // Summary
  console.log(`\n${colors.blue}${colors.bright}Summary:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  if (hasErrors) {
    console.log(`${colors.red}❌ Critical issues found. Please fix before deploying.${colors.reset}`);
    console.log(`${colors.yellow}   Run: node scripts/setup-env.js${colors.reset}`);
    return false;
  } else if (hasWarnings) {
    console.log(`${colors.yellow}⚠️  Some warnings found but you can proceed.${colors.reset}`);
    console.log(`${colors.green}✅ Ready to deploy with basic functionality${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.green}✅ All environment variables properly configured!${colors.reset}`);
    console.log(`${colors.green}🚀 Ready for production deployment${colors.reset}`);
    return true;
  }
}

// Run the check
checkEnvironment().then(success => {
  console.log(`\n${colors.blue}${colors.bright}Next Steps:${colors.reset}`);
  if (success) {
    console.log(`1. ${colors.cyan}Build:${colors.reset} npm run build`);
    console.log(`2. ${colors.cyan}Deploy:${colors.reset} npm run deploy`);
    console.log(`3. ${colors.cyan}Test:${colors.reset} Visit /demo to test attribution`);
  } else {
    console.log(`1. ${colors.cyan}Fix:${colors.reset} Update your .env.local file`);
    console.log(`2. ${colors.cyan}Re-check:${colors.reset} node scripts/check-env.js`);
  }
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});