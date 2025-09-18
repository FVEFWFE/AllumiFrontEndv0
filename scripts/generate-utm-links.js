/**
 * Generate UTM-tracked Allumi links for different channels
 * Run: node scripts/generate-utm-links.js
 */

const BASE_URL = 'https://allumi.com';
const SHORT_URL = 'https://allumi.to';

// UTM configurations for each channel
const UTM_CONFIGS = [
  {
    name: 'Instagram Bio Link',
    destination: BASE_URL,
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'whale_outreach',
    short_id: 'ig-bio'
  },
  {
    name: 'Skool Community Link',
    destination: BASE_URL,
    utm_source: 'skool',
    utm_medium: 'community',
    utm_campaign: 'community_presence',
    short_id: 'skool-com'
  },
  {
    name: 'dexvolkov.com Link',
    destination: BASE_URL,
    utm_source: 'website',
    utm_medium: 'dexvolkov',
    utm_campaign: 'personal_site',
    short_id: 'dex-site'
  },
  {
    name: "Jan's X/Twitter Bio",
    destination: BASE_URL,
    utm_source: 'twitter',
    utm_medium: 'bio',
    utm_campaign: 'jan',
    short_id: 'x-jan'
  },
  {
    name: "Dex's X/Twitter Bio", 
    destination: BASE_URL,
    utm_source: 'twitter',
    utm_medium: 'bio',
    utm_campaign: 'dex',
    short_id: 'x-dex'
  }
];

// Generate full URLs with UTM parameters
function generateUTMLinks() {
  console.log('=== ALLUMI UTM-TRACKED LINKS ===\n');
  console.log('Use these links to track attribution across channels:\n');
  
  UTM_CONFIGS.forEach(config => {
    // Build UTM parameters
    const params = new URLSearchParams({
      utm_source: config.utm_source,
      utm_medium: config.utm_medium,
      utm_campaign: config.utm_campaign
    });
    
    // Full URL with UTM
    const fullUrl = `${config.destination}?${params.toString()}`;
    
    // Short URL (will redirect with UTM params preserved)
    const shortUrl = `${SHORT_URL}/${config.short_id}`;
    
    console.log(`📍 ${config.name}`);
    console.log(`   Short URL: ${shortUrl}`);
    console.log(`   Full URL:  ${fullUrl}`);
    console.log(`   UTM: source=${config.utm_source}, medium=${config.utm_medium}, campaign=${config.utm_campaign}`);
    console.log('');
  });
  
  console.log('=== POSTHOG TRACKING ===\n');
  console.log('These UTM parameters will be automatically captured by PostHog for:');
  console.log('✓ Source attribution');
  console.log('✓ Channel performance');
  console.log('✓ Campaign effectiveness');
  console.log('✓ Conversion tracking\n');
  
  console.log('=== NEXT STEPS ===\n');
  console.log('1. Create these short links in your Allumi dashboard');
  console.log('2. Update your bio links on each platform');
  console.log('3. Monitor performance in PostHog analytics');
  console.log('4. A/B test different UTM campaigns for optimization\n');
}

// SQL to insert these links into Supabase
function generateSQL() {
  console.log('=== SUPABASE SQL ===\n');
  console.log('Run this SQL to create the short links in your database:\n');
  console.log('```sql');
  
  UTM_CONFIGS.forEach(config => {
    const sql = `
INSERT INTO links (short_id, destination_url, campaign_name, utm_source, utm_medium, utm_campaign, user_id)
VALUES ('${config.short_id}', '${config.destination}', '${config.name}', '${config.utm_source}', '${config.utm_medium}', '${config.utm_campaign}', (SELECT id FROM users LIMIT 1));`;
    console.log(sql);
  });
  
  console.log('```\n');
}

// Run the generators
generateUTMLinks();
generateSQL();

// Export for use in other scripts
module.exports = { UTM_CONFIGS };