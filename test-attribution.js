const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

async function testAttribution() {
  console.log('🚀 Testing Allumi Attribution System\n');

  // Step 1: Create a test user
  console.log('1️⃣ Creating test user...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'test@allumi.com',
    password: 'testpass123',
    email_confirm: true
  });

  let userId;
  if (authError && authError.code === 'email_exists') {
    // User exists, use a known test ID or get it from the database
    const { data: users } = await supabase.auth.admin.listUsers();
    const testUser = users?.users?.find(u => u.email === 'test@allumi.com');
    userId = testUser?.id || 'cb0e6b9f-2961-4e14-8b95-9e5fb5d37e49';
    console.log('✅ Using existing user');
  } else if (authError) {
    console.error('Error creating user:', authError);
    return;
  } else {
    userId = authData?.user?.id;
    console.log('✅ Created new user');
  }
  console.log('   User ID:', userId);

  // Step 2: Create a tracking link
  console.log('\n2️⃣ Creating tracking link...');
  const linkResponse = await fetch('http://localhost:3002/api/links/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId,
      destinationUrl: 'https://skool.com/allumi',
      campaignName: 'test-twitter-campaign',
      utmSource: 'twitter',
      utmMedium: 'social',
      utmCampaign: 'launch-week'
    })
  });

  const linkData = await linkResponse.json();

  if (linkData.success) {
    console.log('✅ Link created successfully!');
    console.log('   Short URL:', linkData.shortUrl);
    console.log('   Short ID:', linkData.shortId);

    // Step 3: Simulate a click
    console.log('\n3️⃣ Simulating click on tracking link...');
    const clickResponse = await fetch(`http://localhost:3002/l/${linkData.shortId}`, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Test Browser)',
        'X-Forwarded-For': '192.168.1.1'
      }
    });

    if (clickResponse.status === 307 || clickResponse.status === 302) {
      console.log('✅ Click tracked! Redirecting to:', clickResponse.headers.get('location'));

      // Step 4: Check click was recorded
      console.log('\n4️⃣ Verifying click was recorded...');
      const { data: clicks, error: clickError } = await supabase
        .from('clicks')
        .select('*')
        .eq('short_id', linkData.shortId)
        .order('clicked_at', { ascending: false })
        .limit(1);

      if (clicks && clicks.length > 0) {
        console.log('✅ Click recorded in database!');
        console.log('   Campaign:', clicks[0].campaign_name);
        console.log('   UTM Source:', clicks[0].utm_source);
        console.log('   Timestamp:', clicks[0].clicked_at);
      } else {
        console.log('❌ Click not found in database');
      }

      // Step 5: Check link click count was updated
      console.log('\n5️⃣ Checking link statistics...');
      const { data: linkStats } = await supabase
        .from('links')
        .select('clicks, last_clicked_at')
        .eq('short_id', linkData.shortId)
        .single();

      if (linkStats) {
        console.log('✅ Link stats updated!');
        console.log('   Total clicks:', linkStats.clicks);
        console.log('   Last clicked:', linkStats.last_clicked_at);
      }
    } else {
      console.log('❌ Click tracking failed. Status:', clickResponse.status);
    }

    console.log('\n🎉 Attribution test complete!');
    console.log('📊 Dashboard: http://localhost:3002/dashboard');
    console.log('🔗 Your tracking link:', linkData.shortUrl);

  } else {
    console.error('❌ Failed to create link:', linkData.error);
  }
}

// Run the test
testAttribution().catch(console.error);