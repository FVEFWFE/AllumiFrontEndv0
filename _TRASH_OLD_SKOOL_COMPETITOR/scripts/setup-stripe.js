#!/usr/bin/env node

/**
 * Allumi Stripe Setup Helper
 * Helps configure Stripe products, prices, and webhooks
 * Run: node scripts/setup-stripe.js
 */

const fs = require('fs');
const path = require('path');

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

// Stripe product configurations
const stripeProducts = {
  lifetime: {
    name: 'Allumi Lifetime Deal',
    description: 'Unlimited communities, courses, and members. Attribution tracking included. One-time payment, lifetime access.',
    price: 49700, // $497 in cents
    currency: 'usd',
    type: 'one_time',
    features: [
      'Unlimited communities',
      'Unlimited courses & content',
      'Unlimited members',
      'Attribution tracking',
      'Revenue analytics',
      'Custom domain',
      'Priority support',
      'All future updates'
    ]
  },
  monthly: {
    name: 'Allumi Monthly',
    description: 'Full access to Allumi platform with monthly billing',
    price: 9900, // $99 in cents
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    features: [
      'Unlimited communities',
      'Unlimited courses & content',
      'Unlimited members',
      'Attribution tracking',
      'Revenue analytics',
      'Custom domain',
      'Email support'
    ]
  },
  annual: {
    name: 'Allumi Annual',
    description: 'Full access to Allumi platform with annual billing (2 months free)',
    price: 99000, // $990 in cents (10 months price)
    currency: 'usd',
    type: 'recurring',
    interval: 'year',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early access to features'
    ]
  }
};

// Webhook events to subscribe to
const webhookEvents = [
  'checkout.session.completed',
  'customer.created',
  'customer.deleted',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed'
];

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

// Generate Stripe CLI commands
function generateStripeCLICommands(env) {
  const commands = [];
  const isTest = env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
  
  // Product creation commands
  commands.push('# Create Stripe Products and Prices');
  commands.push('# Run these commands with Stripe CLI\n');
  
  // Lifetime deal product
  commands.push('# 1. Create Lifetime Deal Product');
  commands.push(`stripe products create \\
  --name="${stripeProducts.lifetime.name}" \\
  --description="${stripeProducts.lifetime.description}" \\
  ${isTest ? '--test' : ''}`);
  commands.push('# Copy the product ID (prod_xxx)\n');
  
  commands.push('# 2. Create Lifetime Deal Price');
  commands.push(`stripe prices create \\
  --product=PRODUCT_ID \\
  --currency=${stripeProducts.lifetime.currency} \\
  --unit-amount=${stripeProducts.lifetime.price} \\
  ${isTest ? '--test' : ''}`);
  commands.push('# Copy the price ID (price_xxx) to your .env.local as STRIPE_LIFETIME_PRICE_ID\n');
  
  // Monthly subscription
  commands.push('# 3. Create Monthly Subscription Product');
  commands.push(`stripe products create \\
  --name="${stripeProducts.monthly.name}" \\
  --description="${stripeProducts.monthly.description}" \\
  ${isTest ? '--test' : ''}`);
  commands.push('# Copy the product ID\n');
  
  commands.push('# 4. Create Monthly Price');
  commands.push(`stripe prices create \\
  --product=PRODUCT_ID \\
  --currency=${stripeProducts.monthly.currency} \\
  --unit-amount=${stripeProducts.monthly.price} \\
  --recurring[interval]=${stripeProducts.monthly.interval} \\
  ${isTest ? '--test' : ''}`);
  commands.push('# Copy the price ID\n');
  
  // Annual subscription
  commands.push('# 5. Create Annual Subscription Product');
  commands.push(`stripe products create \\
  --name="${stripeProducts.annual.name}" \\
  --description="${stripeProducts.annual.description}" \\
  ${isTest ? '--test' : ''}`);
  commands.push('# Copy the product ID\n');
  
  commands.push('# 6. Create Annual Price');
  commands.push(`stripe prices create \\
  --product=PRODUCT_ID \\
  --currency=${stripeProducts.annual.currency} \\
  --unit-amount=${stripeProducts.annual.price} \\
  --recurring[interval]=${stripeProducts.annual.interval} \\
  ${isTest ? '--test' : ''}`);
  commands.push('# Copy the price ID\n');
  
  return commands;
}

// Generate webhook setup instructions
function generateWebhookInstructions(env) {
  const appUrl = env.NEXT_PUBLIC_APP_URL || 'YOUR_APP_URL';
  const instructions = [];
  
  instructions.push('# Webhook Setup Instructions\n');
  instructions.push('## For Local Development:');
  instructions.push('1. Install Stripe CLI: https://stripe.com/docs/stripe-cli');
  instructions.push('2. Login: stripe login');
  instructions.push('3. Forward webhooks:');
  instructions.push(`   stripe listen --forward-to ${appUrl}/api/webhooks/stripe\n`);
  
  instructions.push('## For Production:');
  instructions.push('1. Go to: https://dashboard.stripe.com/webhooks');
  instructions.push('2. Click "Add endpoint"');
  instructions.push(`3. Endpoint URL: ${appUrl}/api/webhooks/stripe`);
  instructions.push('4. Select events:');
  webhookEvents.forEach(event => {
    instructions.push(`   - ${event}`);
  });
  instructions.push('5. Copy the webhook secret (whsec_...)');
  instructions.push('6. Add to .env.local as STRIPE_WEBHOOK_SECRET\n');
  
  return instructions;
}

// Save setup files
function saveSetupFiles(commands, webhookInstructions) {
  const setupDir = path.join(process.cwd(), 'stripe-setup');
  
  if (!fs.existsSync(setupDir)) {
    fs.mkdirSync(setupDir, { recursive: true });
  }
  
  // Save CLI commands
  const cliPath = path.join(setupDir, 'stripe-cli-commands.sh');
  fs.writeFileSync(cliPath, commands.join('\n'));
  
  // Save webhook instructions
  const webhookPath = path.join(setupDir, 'webhook-setup.md');
  fs.writeFileSync(webhookPath, webhookInstructions.join('\n'));
  
  // Save product info as JSON
  const productsPath = path.join(setupDir, 'products.json');
  fs.writeFileSync(productsPath, JSON.stringify(stripeProducts, null, 2));
  
  return { cliPath, webhookPath, productsPath };
}

// Main setup function
async function setupStripe() {
  console.log(`${colors.blue}${colors.bright}
╔═══════════════════════════════════════╗
║   💳 Allumi Stripe Setup              ║
╚═══════════════════════════════════════╝${colors.reset}
`);

  const env = loadEnv();
  
  // Check if Stripe is configured
  if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || !env.STRIPE_SECRET_KEY) {
    console.log(`${colors.red}❌ Stripe not configured in .env.local${colors.reset}`);
    console.log(`${colors.yellow}   Run: node scripts/setup-env.js${colors.reset}`);
    process.exit(1);
  }
  
  const isTest = env.STRIPE_SECRET_KEY.startsWith('sk_test_');
  console.log(`${colors.green}✅ Found Stripe configuration${colors.reset}`);
  console.log(`${colors.cyan}   Mode: ${isTest ? 'TEST' : 'LIVE'}${colors.reset}\n`);
  
  if (!isTest) {
    console.log(`${colors.yellow}⚠️  WARNING: Using LIVE Stripe keys!${colors.reset}`);
    console.log(`${colors.yellow}   Be careful with any changes.${colors.reset}\n`);
  }
  
  // Generate setup files
  console.log(`${colors.blue}Generating setup files...${colors.reset}`);
  const commands = generateStripeCLICommands(env);
  const webhookInstructions = generateWebhookInstructions(env);
  const { cliPath, webhookPath, productsPath } = saveSetupFiles(commands, webhookInstructions);
  
  console.log(`${colors.green}✅ Setup files created:${colors.reset}`);
  console.log(`   - ${cliPath}`);
  console.log(`   - ${webhookPath}`);
  console.log(`   - ${productsPath}\n`);
  
  // Display pricing structure
  console.log(`${colors.magenta}${colors.bright}Pricing Structure:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  console.log(`\n${colors.yellow}Lifetime Deal (Limited Time):${colors.reset}`);
  console.log(`  💰 $497 one-time payment`);
  console.log(`  ✓ Everything included forever`);
  console.log(`  ✓ Best for early adopters\n`);
  
  console.log(`${colors.yellow}Monthly Subscription:${colors.reset}`);
  console.log(`  💰 $99/month`);
  console.log(`  ✓ Full platform access`);
  console.log(`  ✓ Cancel anytime\n`);
  
  console.log(`${colors.yellow}Annual Subscription:${colors.reset}`);
  console.log(`  💰 $990/year (save $198)`);
  console.log(`  ✓ 2 months free`);
  console.log(`  ✓ Priority support\n`);
  
  // Setup instructions
  console.log(`${colors.magenta}${colors.bright}Setup Steps:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}\n`);
  
  console.log(`${colors.blue}1. Create Products in Stripe:${colors.reset}`);
  console.log(`   Option A: Use Stripe Dashboard`);
  console.log(`   - Go to: https://dashboard.stripe.com/products`);
  console.log(`   - Create products manually\n`);
  
  console.log(`   Option B: Use Stripe CLI`);
  console.log(`   - Install: https://stripe.com/docs/stripe-cli`);
  console.log(`   - Run commands from: ${colors.cyan}stripe-setup/stripe-cli-commands.sh${colors.reset}\n`);
  
  console.log(`${colors.blue}2. Set up Webhooks:${colors.reset}`);
  console.log(`   - Follow instructions in: ${colors.cyan}stripe-setup/webhook-setup.md${colors.reset}\n`);
  
  console.log(`${colors.blue}3. Update Environment Variables:${colors.reset}`);
  console.log(`   - Add STRIPE_LIFETIME_PRICE_ID to .env.local`);
  console.log(`   - Add STRIPE_WEBHOOK_SECRET to .env.local\n`);
  
  console.log(`${colors.blue}4. Test Checkout:${colors.reset}`);
  console.log(`   - Visit: /demo`);
  console.log(`   - Click "Get Lifetime Access"`);
  console.log(`   - Use test card: 4242 4242 4242 4242\n`);
  
  // Quick wins
  console.log(`${colors.magenta}${colors.bright}Quick Revenue Wins:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  console.log(`🎯 Launch lifetime deal at $497`);
  console.log(`🎯 Target: 20 sales = $10k first month`);
  console.log(`🎯 Use urgency: "Only 100 spots available"`);
  console.log(`🎯 Emphasize ROI: "Track every dollar earned"`);
  console.log(`🎯 Social proof: "Join 500+ community builders"\n`);
  
  console.log(`${colors.green}${colors.bright}✅ Stripe setup guide ready!${colors.reset}`);
  console.log(`${colors.yellow}Next: Follow setup steps above${colors.reset}`);
}

// Run setup
setupStripe().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});