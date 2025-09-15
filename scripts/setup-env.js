#!/usr/bin/env node

/**
 * Allumi Environment Setup Helper
 * This script helps you quickly set up all required environment variables
 * Run: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
const question = (query, defaultValue = '') => {
  const displayQuery = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
  return new Promise((resolve) => {
    rl.question(displayQuery, (answer) => {
      resolve(answer || defaultValue);
    });
  });
};

// Generate random secret
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Environment variable template
const envTemplate = {
  supabase: {
    title: 'Supabase Configuration',
    vars: [
      {
        key: 'NEXT_PUBLIC_SUPABASE_URL',
        prompt: 'Supabase Project URL',
        default: 'https://your-project.supabase.co',
        required: true,
        help: 'Get this from your Supabase project settings'
      },
      {
        key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        prompt: 'Supabase Anon/Public Key',
        default: '',
        required: true,
        help: 'Found in Settings > API in your Supabase dashboard'
      },
      {
        key: 'SUPABASE_SERVICE_ROLE_KEY',
        prompt: 'Supabase Service Role Key (for server-side)',
        default: '',
        required: false,
        help: 'Keep this secret! Only for server-side operations'
      }
    ]
  },
  stripe: {
    title: 'Stripe Configuration',
    vars: [
      {
        key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        prompt: 'Stripe Publishable Key',
        default: 'pk_test_',
        required: true,
        help: 'Get from https://dashboard.stripe.com/apikeys'
      },
      {
        key: 'STRIPE_SECRET_KEY',
        prompt: 'Stripe Secret Key',
        default: 'sk_test_',
        required: true,
        help: 'Keep this secret! Get from Stripe dashboard'
      },
      {
        key: 'STRIPE_WEBHOOK_SECRET',
        prompt: 'Stripe Webhook Secret',
        default: 'whsec_',
        required: false,
        help: 'Set up webhooks at https://dashboard.stripe.com/webhooks'
      },
      {
        key: 'STRIPE_LIFETIME_PRICE_ID',
        prompt: 'Stripe Price ID for Lifetime Deal',
        default: 'price_',
        required: false,
        help: 'Create a one-time product in Stripe for $497'
      }
    ]
  },
  email: {
    title: 'Email Configuration (Resend)',
    vars: [
      {
        key: 'RESEND_API_KEY',
        prompt: 'Resend API Key',
        default: 're_',
        required: false,
        help: 'Get from https://resend.com/api-keys'
      },
      {
        key: 'EMAIL_FROM',
        prompt: 'From Email Address',
        default: 'hello@allumi.com',
        required: false,
        help: 'Must be verified in Resend'
      }
    ]
  },
  app: {
    title: 'Application Settings',
    vars: [
      {
        key: 'NEXT_PUBLIC_APP_URL',
        prompt: 'Application URL',
        default: 'http://localhost:3000',
        required: true,
        help: 'Your production URL (e.g., https://allumi.com)'
      },
      {
        key: 'NEXTAUTH_SECRET',
        prompt: 'NextAuth Secret (auto-generated)',
        default: generateSecret(),
        required: true,
        help: 'Used to encrypt cookies and tokens'
      },
      {
        key: 'NEXTAUTH_URL',
        prompt: 'NextAuth URL',
        default: 'http://localhost:3000',
        required: true,
        help: 'Same as APP_URL in production'
      }
    ]
  },
  analytics: {
    title: 'Analytics (Optional)',
    vars: [
      {
        key: 'NEXT_PUBLIC_POSTHOG_KEY',
        prompt: 'PostHog Project API Key',
        default: '',
        required: false,
        help: 'Get from https://posthog.com'
      },
      {
        key: 'NEXT_PUBLIC_POSTHOG_HOST',
        prompt: 'PostHog Host',
        default: 'https://app.posthog.com',
        required: false,
        help: 'Usually https://app.posthog.com'
      },
      {
        key: 'NEXT_PUBLIC_GA_ID',
        prompt: 'Google Analytics ID',
        default: 'G-',
        required: false,
        help: 'Optional: For additional tracking'
      }
    ]
  }
};

// Check existing .env.local
const checkExistingEnv = () => {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log(`${colors.yellow}⚠️  .env.local already exists${colors.reset}`);
    return true;
  }
  return false;
};

// Main setup function
async function setupEnvironment() {
  console.log(`${colors.blue}${colors.bright}
╔═══════════════════════════════════════╗
║   🚀 Allumi Environment Setup         ║
╚═══════════════════════════════════════╝${colors.reset}
`);

  const existingEnv = checkExistingEnv();
  if (existingEnv) {
    const overwrite = await question('Do you want to overwrite it? (y/N)', 'N');
    if (overwrite.toLowerCase() !== 'y') {
      console.log(`${colors.green}✅ Keeping existing .env.local${colors.reset}`);
      rl.close();
      return;
    }
  }

  console.log(`${colors.cyan}Let's set up your environment variables...${colors.reset}\n`);

  const envVars = [];
  envVars.push('# Allumi Platform Environment Variables');
  envVars.push(`# Generated on ${new Date().toISOString()}\n`);

  // Quick setup option
  const quickSetup = await question('Use quick setup with defaults? (Y/n)', 'Y');
  const useQuickSetup = quickSetup.toLowerCase() !== 'n';

  // Go through each category
  for (const [category, config] of Object.entries(envTemplate)) {
    console.log(`\n${colors.magenta}${colors.bright}${config.title}${colors.reset}`);
    console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
    
    envVars.push(`\n# ${config.title}`);
    
    for (const varConfig of config.vars) {
      if (useQuickSetup && !varConfig.required) {
        // Skip optional vars in quick setup
        if (varConfig.key === 'NEXTAUTH_SECRET') {
          // Always include NextAuth secret
          envVars.push(`${varConfig.key}=${varConfig.default}`);
        }
        continue;
      }

      if (varConfig.help) {
        console.log(`${colors.yellow}ℹ️  ${varConfig.help}${colors.reset}`);
      }

      const value = await question(
        `${varConfig.required ? '*' : ' '}${varConfig.prompt}`,
        varConfig.default
      );

      if (varConfig.required && !value) {
        console.log(`${colors.red}❌ This field is required!${colors.reset}`);
        process.exit(1);
      }

      if (value) {
        envVars.push(`${varConfig.key}=${value}`);
      }
    }
  }

  // Add some helpful comments
  envVars.push(`
# ═══════════════════════════════════════
# Additional Configuration Notes:
# ═══════════════════════════════════════
# 
# 1. Supabase Database:
#    - Run: npx supabase db push
#    - Import schema from /supabase/schema.sql
# 
# 2. Stripe Webhooks:
#    - Endpoint: YOUR_URL/api/webhooks/stripe
#    - Events: checkout.session.completed, customer.subscription.*
# 
# 3. Custom Domain:
#    - Add to Vercel: YOUR_DOMAIN.com
#    - Update NEXT_PUBLIC_APP_URL
# 
# 4. Email Setup:
#    - Verify domain in Resend
#    - Set up SPF/DKIM records
# 
# Need help? Visit: /launch for complete checklist
`);

  // Write to file
  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envVars.join('\n'));

  console.log(`\n${colors.green}${colors.bright}✅ Environment setup complete!${colors.reset}`);
  console.log(`${colors.green}File created: .env.local${colors.reset}\n`);

  // Next steps
  console.log(`${colors.blue}${colors.bright}Next Steps:${colors.reset}`);
  console.log(`1. ${colors.cyan}Run:${colors.reset} npm run dev`);
  console.log(`2. ${colors.cyan}Visit:${colors.reset} http://localhost:3000/launch`);
  console.log(`3. ${colors.cyan}Test:${colors.reset} Attribution at /demo`);
  console.log(`4. ${colors.cyan}Deploy:${colors.reset} npm run deploy\n`);

  // Show critical setup tasks
  console.log(`${colors.yellow}${colors.bright}⚠️  Critical Setup Tasks:${colors.reset}`);
  console.log(`${colors.yellow}• Connect Supabase database${colors.reset}`);
  console.log(`${colors.yellow}• Create Stripe products${colors.reset}`);
  console.log(`${colors.yellow}• Configure domain${colors.reset}\n`);

  console.log(`${colors.green}${colors.bright}Ready to launch! 🚀${colors.reset}`);
  
  rl.close();
}

// Run setup
setupEnvironment().catch((error) => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
});