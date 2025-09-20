const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

async function createTestUser() {
  console.log('🚀 Creating test user account for dashboard access\n');

  const testEmail = 'test@allumi.com';
  const testPassword = 'Test123!@#';

  try {
    // First, try to delete any existing test user
    console.log('Checking for existing test user...');
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === testEmail);

    if (existingUser) {
      console.log('Found existing test user, deleting...');
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.log('Warning: Could not delete existing user:', deleteError.message);
      } else {
        console.log('✅ Deleted existing test user');
      }
    }

    // Create new test user
    console.log('\nCreating new test user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User',
        whop_customer_id: 'test_customer_123'
      }
    });

    if (authError) {
      console.error('❌ Error creating user:', authError.message);
      return;
    }

    console.log('✅ Test user created successfully!');
    console.log('   User ID:', authData.user.id);

    // Add user to public.users table
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: testEmail,
        full_name: 'Test User',
        username: 'testuser',
        whop_customer_id: 'test_customer_123',
        allumi_subscription_status: 'active',
        allumi_subscription_plan: 'beta',
        allumi_trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        onboarding_completed: true
      });

    if (dbError) {
      console.log('Warning: Could not add user to database:', dbError.message);
    } else {
      console.log('✅ User added to database');
    }

    // Create some test data for the dashboard
    console.log('\n📊 Creating test attribution data...');

    // Create a test link
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .insert({
        user_id: authData.user.id,
        short_id: 'test' + Math.random().toString(36).substr(2, 9),
        destination_url: 'https://skool.com/test-community',
        campaign_name: 'Test Campaign',
        utm_source: 'twitter',
        utm_medium: 'social',
        utm_campaign: 'test',
        clicks: Math.floor(Math.random() * 100) + 50,
        created_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (!linkError && linkData) {
      console.log('✅ Created test link:', linkData.short_id);

      // Add some test clicks
      for (let i = 0; i < 5; i++) {
        await supabase.from('clicks').insert({
          link_id: linkData.id,
          user_id: authData.user.id,
          short_id: linkData.short_id,
          campaign_name: linkData.campaign_name,
          utm_source: linkData.utm_source,
          utm_medium: linkData.utm_medium,
          utm_campaign: linkData.utm_campaign,
          ip_address: `192.168.1.${i + 1}`,
          clicked_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
        });
      }
      console.log('✅ Added test clicks');

      // Add test conversions
      const conversions = [
        { email: 'buyer1@example.com', revenue: 59, type: 'paid' },
        { email: 'buyer2@example.com', revenue: 59, type: 'paid' },
        { email: 'free1@example.com', revenue: 0, type: 'free' }
      ];

      for (const conv of conversions) {
        await supabase.from('conversions').insert({
          user_id: authData.user.id,
          skool_email: conv.email,
          skool_name: conv.email.split('@')[0],
          membership_type: conv.type,
          price_paid: conv.revenue,
          revenue_tracked: conv.revenue,
          attributed_link_id: linkData.short_id,
          attributed_campaign: linkData.campaign_name,
          attribution_confidence: 0.85,
          created_at: new Date().toISOString()
        });
      }
      console.log('✅ Added test conversions');
    }

    console.log('\n========================================');
    console.log('📧 TEST USER CREDENTIALS');
    console.log('========================================');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('Dashboard URL: http://localhost:3004/dashboard');
    console.log('========================================\n');

    console.log('✨ Test user setup complete! You can now log in to the dashboard.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
createTestUser().catch(console.error);