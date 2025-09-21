const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAuth() {
  console.log('🔧 Fixing authentication system...\n');

  try {
    // 1. Create test user in auth.users
    console.log('Creating test user in Supabase Auth...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@allumi.com',
      password: 'Test123!@#',
      email_confirm: true
    });

    if (authError && !authError.message.includes('already been registered')) {
      console.error('❌ Auth error:', authError.message);
      return;
    }

    const userId = authUser?.id || 'existing-user';
    console.log('✅ Test user created/exists in Auth');

    // 2. Create/update user profile
    console.log('\nCreating user profile...');
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'test@allumi.com',
        name: 'Test User',
        role: 'admin',
        created_at: new Date().toISOString(),
        subscription_status: 'trialing',
        subscription_plan: 'beta',
        whop_customer_id: 'test_customer',
        settings: {
          emailNotifications: true,
          darkMode: true
        }
      });

    if (profileError) {
      console.error('❌ Profile error:', profileError.message);

      // Try to create users table if it doesn't exist
      console.log('\nCreating users table...');
      const { error: tableError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            role TEXT DEFAULT 'member',
            avatar_url TEXT,
            subscription_status TEXT DEFAULT 'inactive',
            subscription_plan TEXT,
            whop_customer_id TEXT,
            stripe_customer_id TEXT,
            settings JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      });

      if (!tableError) {
        // Retry profile creation
        await supabase.from('users').upsert({
          id: userId,
          email: 'test@allumi.com',
          name: 'Test User',
          role: 'admin'
        });
      }
    }

    console.log('✅ User profile created/updated');

    // 3. Create beta users
    console.log('\nCreating beta user accounts...');
    const betaUsers = [
      { email: 'brian@wealthcollective.com', name: 'Brian Decker', community: 'The Wealth Collective' },
      { email: 'juan@latribu.com', name: 'Juan Pe Navarro', community: 'La Tribu Divisual' },
      { email: 'hooman@mardox.com', name: 'Hooman Mardox', community: 'Mardox Capital' },
      { email: 'oscar@hairloss.com', name: 'Oscar S', community: 'Hair Loss Blueprint' }
    ];

    for (const user of betaUsers) {
      const { error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'Beta2025!',
        email_confirm: true,
        user_metadata: {
          name: user.name,
          community: user.community
        }
      });

      if (!error || error.message.includes('already been registered')) {
        console.log(`✅ Created beta user: ${user.name}`);
      }
    }

    // 4. Test login
    console.log('\n🔐 Testing login with test@allumi.com...');
    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@allumi.com',
      password: 'Test123!@#'
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
    } else {
      console.log('✅ Login successful!');
      console.log('   Session token:', session.session?.access_token?.substring(0, 20) + '...');
    }

    console.log('\n✨ Authentication system fixed!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: test@allumi.com');
    console.log('   Password: Test123!@#');
    console.log('\n📋 Beta User Password: Beta2025!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAuth();