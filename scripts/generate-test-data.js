const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Traffic sources for realistic attribution
const trafficSources = [
  { utm_source: 'facebook', utm_medium: 'social', utm_campaign: 'winter_promo' },
  { utm_source: 'instagram', utm_medium: 'social', utm_campaign: 'influencer_collab' },
  { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'brand_search' },
  { utm_source: 'youtube', utm_medium: 'video', utm_campaign: 'tutorial_series' },
  { utm_source: 'twitter', utm_medium: 'social', utm_campaign: 'product_launch' },
  { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'b2b_outreach' },
  { utm_source: 'tiktok', utm_medium: 'social', utm_campaign: 'viral_challenge' },
  { utm_source: 'email', utm_medium: 'newsletter', utm_campaign: 'weekly_digest' },
  { utm_source: 'reddit', utm_medium: 'community', utm_campaign: 'ama_session' },
  { utm_source: 'podcast', utm_medium: 'audio', utm_campaign: 'guest_appearance' }
];

// Realistic names and emails
const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Chris', 'Amy', 'Ryan', 'Jessica'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me', 'company.com'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail() {
  const firstName = randomElement(firstNames).toLowerCase();
  const lastName = randomElement(lastNames).toLowerCase();
  const domain = randomElement(domains);
  const number = Math.random() > 0.7 ? Math.floor(Math.random() * 99) : '';
  return `${firstName}.${lastName}${number}@${domain}`;
}

function generateDeviceFingerprint() {
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const os = ['Windows', 'macOS', 'iOS', 'Android'];
  const resolutions = ['1920x1080', '1366x768', '1440x900', '2560x1440'];

  return {
    browser: randomElement(browsers),
    os: randomElement(os),
    resolution: randomElement(resolutions),
    timezone: 'America/New_York',
    language: 'en-US'
  };
}

async function generateTestData() {
  console.log('🚀 Starting test data generation...\n');

  // Get or create a test user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: 'test@allumi.com',
    password: 'testpassword123',
    email_confirm: true
  }).catch(err => ({ data: null, error: err }));

  let userId;
  if (userError?.message?.includes('already been registered')) {
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const testUser = existingUsers?.users?.find(u => u.email === 'test@allumi.com');
    userId = testUser?.id;
    console.log('✓ Using existing test user');
  } else if (userData?.user) {
    userId = userData.user.id;
    console.log('✓ Created test user');
  } else {
    console.error('Could not create or find test user:', userError);
    userId = 'test-user-id'; // Fallback ID
  }

  // 1. Generate Identities (visitors)
  console.log('\n📊 Generating identities...');
  const identities = [];

  for (let i = 0; i < 200; i++) {
    const identity = {
      anonymous_id: `anon_${Date.now()}_${i}`,
      fingerprint: JSON.stringify(generateDeviceFingerprint()),
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      email_captured: Math.random() > 0.4 ? generateEmail() : null,
      user_id: userId
    };
    identities.push(identity);
  }

  const { data: insertedIdentities, error: idError } = await supabase
    .from('identities')
    .insert(identities)
    .select();

  if (idError) {
    console.error('Error inserting identities:', idError);
  } else {
    console.log(`✓ Created ${insertedIdentities.length} identities`);
  }

  // 2. Generate Clicks (tracking link clicks)
  console.log('\n🔗 Generating tracking link clicks...');
  const clicks = [];
  const identityIds = insertedIdentities?.map(i => i.id) || [];

  for (let i = 0; i < 500; i++) {
    const source = randomElement(trafficSources);
    const click = {
      identity_id: randomElement(identityIds),
      url: `https://allumi.com/join?${new URLSearchParams(source).toString()}`,
      utm_source: source.utm_source,
      utm_medium: source.utm_medium,
      utm_campaign: source.utm_campaign,
      referrer: `https://${source.utm_source}.com`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    };
    clicks.push(click);
  }

  const { data: insertedClicks, error: clickError } = await supabase
    .from('clicks')
    .insert(clicks)
    .select();

  if (clickError) {
    console.error('Error inserting clicks:', clickError);
  } else {
    console.log(`✓ Created ${insertedClicks?.length || 0} tracking link clicks`);
  }

  // 3. Generate Conversions (successful signups/purchases)
  console.log('\n💰 Generating conversions...');
  const conversions = [];
  const conversionRate = 0.15; // 15% conversion rate

  for (let i = 0; i < identityIds.length * conversionRate; i++) {
    const identityId = identityIds[Math.floor(i)];
    const matchedClick = clicks.find(c => c.identity_id === identityId);

    const conversion = {
      identity_id: identityId,
      skool_email: generateEmail(),
      revenue_tracked: [29, 49, 79, 99][Math.floor(Math.random() * 4)],
      attribution_data: {
        source: matchedClick?.utm_source || 'direct',
        medium: matchedClick?.utm_medium || 'none',
        campaign: matchedClick?.utm_campaign || 'none',
        path: matchedClick ? 'tracked_link' : 'organic',
        timestamp: new Date().toISOString()
      },
      confidence_score: 0.65 + Math.random() * 0.3, // 65-95% confidence
      created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    };
    conversions.push(conversion);
  }

  const { data: insertedConversions, error: convError } = await supabase
    .from('conversions')
    .insert(conversions)
    .select();

  if (convError) {
    console.error('Error inserting conversions:', convError);
  } else {
    console.log(`✓ Created ${insertedConversions?.length || 0} conversions`);
    const totalRevenue = conversions.reduce((sum, c) => sum + c.revenue_tracked, 0);
    console.log(`  💵 Total revenue tracked: $${totalRevenue.toLocaleString()}`);
  }

  // 4. Generate Bio Pages
  console.log('\n📱 Generating Link-in-Bio pages...');
  const bioPages = [];

  for (let i = 0; i < 5; i++) {
    const page = {
      user_id: userId,
      slug: `testuser${i + 1}`,
      title: `${randomElement(firstNames)}'s Skool Community`,
      bio: `Join my exclusive community for entrepreneurs and creators. Learn, grow, and network with like-minded individuals.`,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      theme: JSON.stringify({
        backgroundColor: ['#1a1a1a', '#ffffff', '#f3f4f6'][i % 3],
        textColor: ['#ffffff', '#000000', '#374151'][i % 3],
        accentColor: ['#8b5cf6', '#3b82f6', '#10b981'][i % 3]
      }),
      views: Math.floor(Math.random() * 5000),
      created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
    };
    bioPages.push(page);
  }

  const { data: insertedPages, error: pageError } = await supabase
    .from('bio_pages')
    .insert(bioPages)
    .select();

  if (pageError) {
    console.error('Error inserting bio pages:', pageError);
  } else {
    console.log(`✓ Created ${insertedPages?.length || 0} bio pages`);
  }

  // 5. Generate Bio Links
  console.log('\n🔗 Generating bio page links...');
  const bioLinks = [];
  const pageIds = insertedPages?.map(p => p.id) || [];

  const linkTemplates = [
    { title: 'Join My Skool Community', icon: '🎓' },
    { title: 'Free Training Video', icon: '📹' },
    { title: 'Download My Guide', icon: '📚' },
    { title: 'Book a Call', icon: '📞' },
    { title: 'Follow on Instagram', icon: '📸' },
    { title: 'Subscribe on YouTube', icon: '▶️' },
    { title: 'Weekly Newsletter', icon: '📧' }
  ];

  for (const pageId of pageIds) {
    for (let j = 0; j < 5; j++) {
      const template = randomElement(linkTemplates);
      const link = {
        page_id: pageId,
        title: template.title,
        url: `https://example.com/link${j}`,
        icon: template.icon,
        order: j,
        clicks: Math.floor(Math.random() * 1000),
        is_active: Math.random() > 0.1,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      bioLinks.push(link);
    }
  }

  const { data: insertedLinks, error: linkError } = await supabase
    .from('bio_links')
    .insert(bioLinks)
    .select();

  if (linkError) {
    console.error('Error inserting bio links:', linkError);
  } else {
    console.log(`✓ Created ${insertedLinks?.length || 0} bio links`);
  }

  // 6. Generate Tracking Links
  console.log('\n📊 Generating tracking links...');
  const trackingLinks = [];

  const campaigns = [
    'Black Friday Sale',
    'New Year Special',
    'Influencer Partnership',
    'Webinar Funnel',
    'Free Trial Offer'
  ];

  for (let i = 0; i < 20; i++) {
    const source = randomElement(trafficSources);
    const link = {
      user_id: userId,
      name: randomElement(campaigns),
      url: `https://allumi.com/special-offer-${i}`,
      utm_source: source.utm_source,
      utm_medium: source.utm_medium,
      utm_campaign: source.utm_campaign,
      clicks: Math.floor(Math.random() * 500),
      conversions: Math.floor(Math.random() * 50),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    trackingLinks.push(link);
  }

  const { data: insertedTrackingLinks, error: trackingError } = await supabase
    .from('tracking_links')
    .insert(trackingLinks)
    .select();

  if (trackingError) {
    console.error('Error inserting tracking links:', trackingError);
  } else {
    console.log(`✓ Created ${insertedTrackingLinks?.length || 0} tracking links`);
  }

  console.log('\n✅ Test data generation complete!');
  console.log('\n📊 Summary:');
  console.log(`  • ${identities.length} visitor identities`);
  console.log(`  • ${clicks.length} tracking clicks`);
  console.log(`  • ${conversions.length} conversions`);
  console.log(`  • ${bioPages.length} bio pages`);
  console.log(`  • ${bioLinks.length} bio links`);
  console.log(`  • ${trackingLinks.length} tracking links`);
  console.log(`\n🎉 Dashboards should now display rich data!`);
}

// Run the generator
generateTestData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });