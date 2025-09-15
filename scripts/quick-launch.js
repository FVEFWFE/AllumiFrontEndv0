#!/usr/bin/env node

/**
 * Allumi Quick Launch Script
 * The fastest way to go from zero to deployed
 * Run: node scripts/quick-launch.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Helper to run commands
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Helper to ask questions
const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

// Check if command exists
const commandExists = async (command) => {
  try {
    await runCommand(`which ${command} 2>/dev/null || where ${command} 2>nul`);
    return true;
  } catch {
    return false;
  }
};

// Main launch sequence
async function quickLaunch() {
  console.log(`${colors.blue}${colors.bright}
╔═══════════════════════════════════════╗
║   🚀 ALLUMI QUICK LAUNCH              ║
║   From Zero to $10k in 30 Minutes     ║
╚═══════════════════════════════════════╝${colors.reset}
`);

  console.log(`${colors.cyan}This script will:${colors.reset}`);
  console.log(`  1. Set up environment variables`);
  console.log(`  2. Configure Supabase database`);
  console.log(`  3. Set up Stripe products`);
  console.log(`  4. Deploy to Vercel`);
  console.log(`  5. Launch your lifetime deal\n`);

  const ready = await question(`${colors.yellow}Ready to launch? (Y/n): ${colors.reset}`);
  if (ready.toLowerCase() === 'n') {
    console.log(`${colors.yellow}Launch cancelled. Come back when you're ready! 🚀${colors.reset}`);
    rl.close();
    return;
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 1: Prerequisites Check${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  // Check Node.js
  const hasNode = await commandExists('node');
  console.log(`${hasNode ? '✅' : '❌'} Node.js ${hasNode ? 'installed' : 'not found'}`);
  
  // Check npm
  const hasNpm = await commandExists('npm');
  console.log(`${hasNpm ? '✅' : '❌'} npm ${hasNpm ? 'installed' : 'not found'}`);
  
  // Check Git
  const hasGit = await commandExists('git');
  console.log(`${hasGit ? '✅' : '❌'} Git ${hasGit ? 'installed' : 'not found (optional)'}`);
  
  if (!hasNode || !hasNpm) {
    console.log(`\n${colors.red}❌ Missing prerequisites. Please install Node.js first.${colors.reset}`);
    console.log(`${colors.yellow}   Visit: https://nodejs.org/${colors.reset}`);
    rl.close();
    return;
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 2: Install Dependencies${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  if (!fs.existsSync('node_modules')) {
    console.log(`Installing dependencies...`);
    try {
      await runCommand('npm install');
      console.log(`${colors.green}✅ Dependencies installed${colors.reset}`);
    } catch (err) {
      console.log(`${colors.red}❌ Failed to install dependencies${colors.reset}`);
      console.log(err.message);
      rl.close();
      return;
    }
  } else {
    console.log(`${colors.green}✅ Dependencies already installed${colors.reset}`);
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 3: Environment Setup${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  if (!fs.existsSync('.env.local')) {
    console.log(`Setting up environment variables...`);
    try {
      await runCommand('node scripts/setup-env.js');
      console.log(`${colors.green}✅ Environment configured${colors.reset}`);
    } catch (err) {
      console.log(`${colors.yellow}⚠️  Please run: node scripts/setup-env.js manually${colors.reset}`);
    }
  } else {
    console.log(`${colors.green}✅ Environment already configured${colors.reset}`);
  }

  // Check environment
  console.log(`\nValidating configuration...`);
  try {
    const checkResult = await runCommand('node scripts/check-env.js');
    console.log(`${colors.green}✅ Configuration validated${colors.reset}`);
  } catch (err) {
    console.log(`${colors.yellow}⚠️  Some configuration issues found${colors.reset}`);
    console.log(`${colors.yellow}   Run: node scripts/check-env.js for details${colors.reset}`);
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 4: Database Setup${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  console.log(`Generating Supabase schema...`);
  try {
    await runCommand('node scripts/setup-supabase.js');
    console.log(`${colors.green}✅ Database schema generated${colors.reset}`);
    console.log(`${colors.yellow}📋 Next: Copy schema from supabase/schema.sql to Supabase SQL editor${colors.reset}`);
  } catch (err) {
    console.log(`${colors.yellow}⚠️  Please set up Supabase manually${colors.reset}`);
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 5: Stripe Setup${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  console.log(`Generating Stripe setup files...`);
  try {
    await runCommand('node scripts/setup-stripe.js');
    console.log(`${colors.green}✅ Stripe setup files generated${colors.reset}`);
    console.log(`${colors.yellow}📋 Next: Follow instructions in stripe-setup/ folder${colors.reset}`);
  } catch (err) {
    console.log(`${colors.yellow}⚠️  Please set up Stripe manually${colors.reset}`);
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 6: Build Application${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  const buildNow = await question(`${colors.yellow}Build the application now? (Y/n): ${colors.reset}`);
  if (buildNow.toLowerCase() !== 'n') {
    console.log(`Building application...`);
    try {
      await runCommand('npm run build');
      console.log(`${colors.green}✅ Build successful${colors.reset}`);
    } catch (err) {
      console.log(`${colors.red}❌ Build failed${colors.reset}`);
      console.log(`${colors.yellow}   Fix errors and run: npm run build${colors.reset}`);
    }
  }

  console.log(`\n${colors.magenta}${colors.bright}Step 7: Deploy to Vercel${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}`);
  
  const deployNow = await question(`${colors.yellow}Deploy to Vercel now? (Y/n): ${colors.reset}`);
  if (deployNow.toLowerCase() !== 'n') {
    // Check if Vercel CLI is installed
    const hasVercel = await commandExists('vercel');
    if (!hasVercel) {
      console.log(`Installing Vercel CLI...`);
      try {
        await runCommand('npm i -g vercel');
        console.log(`${colors.green}✅ Vercel CLI installed${colors.reset}`);
      } catch (err) {
        console.log(`${colors.yellow}⚠️  Please install Vercel CLI manually: npm i -g vercel${colors.reset}`);
      }
    }
    
    console.log(`${colors.cyan}Starting deployment...${colors.reset}`);
    console.log(`${colors.yellow}Follow the Vercel prompts to complete deployment${colors.reset}`);
    console.log(`\nRun: ${colors.cyan}vercel --prod${colors.reset}`);
  }

  // Launch checklist
  console.log(`\n${colors.green}${colors.bright}
╔═══════════════════════════════════════╗
║   ✅ LAUNCH PREPARATION COMPLETE      ║
╚═══════════════════════════════════════╝${colors.reset}
`);

  console.log(`${colors.magenta}${colors.bright}Your Launch Checklist:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}\n`);

  const checklist = [
    { done: fs.existsSync('.env.local'), task: 'Environment variables configured' },
    { done: fs.existsSync('supabase/schema.sql'), task: 'Database schema ready' },
    { done: fs.existsSync('stripe-setup'), task: 'Stripe setup files created' },
    { done: fs.existsSync('.next'), task: 'Application built' },
    { done: false, task: 'Deployed to Vercel' },
    { done: false, task: 'Custom domain configured' },
    { done: false, task: 'Stripe products created' },
    { done: false, task: 'Database tables created' },
    { done: false, task: 'Webhooks configured' },
    { done: false, task: 'Test purchase completed' }
  ];

  checklist.forEach(item => {
    console.log(`${item.done ? '✅' : '⬜'} ${item.task}`);
  });

  console.log(`\n${colors.magenta}${colors.bright}Quick Revenue Path:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}\n`);

  console.log(`${colors.yellow}Week 1: Launch${colors.reset}`);
  console.log(`  • Deploy to production`);
  console.log(`  • Set up lifetime deal at $497`);
  console.log(`  • Create urgency: "First 100 founders only"`);
  
  console.log(`\n${colors.yellow}Week 2: Promote${colors.reset}`);
  console.log(`  • Post in 10 Facebook groups`);
  console.log(`  • Launch on Product Hunt`);
  console.log(`  • Reach out to your network`);
  
  console.log(`\n${colors.yellow}Week 3-4: Scale${colors.reset}`);
  console.log(`  • Target: 20 sales = $10k`);
  console.log(`  • Add testimonials to /demo`);
  console.log(`  • Run limited-time flash sale`);

  console.log(`\n${colors.blue}${colors.bright}Important URLs:${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(40)}${colors.reset}\n`);
  
  console.log(`📊 Launch Dashboard: ${colors.cyan}/launch${colors.reset}`);
  console.log(`💰 Sales Page: ${colors.cyan}/demo${colors.reset}`);
  console.log(`🗺️ Sitemap: ${colors.cyan}/sitemap-test${colors.reset}`);
  console.log(`📈 Attribution Setup: ${colors.cyan}/c/demo/attribution/setup${colors.reset}`);
  console.log(`💵 Revenue Analytics: ${colors.cyan}/c/demo/revenue${colors.reset}`);

  console.log(`\n${colors.green}${colors.bright}🎉 You're ready to make your first $10k!${colors.reset}`);
  console.log(`${colors.yellow}${colors.bright}Remember: Speed > Perfection. Launch NOW! 🚀${colors.reset}\n`);

  rl.close();
}

// Run the quick launch
quickLaunch().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  rl.close();
  process.exit(1);
});