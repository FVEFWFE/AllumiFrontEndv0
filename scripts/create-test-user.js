const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

async function createTestUser() {
  console.log('Creating test user...');

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'test@allumi.com',
    password: 'test123456',
    email_confirm: true
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    return;
  }

  console.log('Auth user created:', authData.user.id);

  // Create user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: 'test@allumi.com',
      skool_group_url: 'https://www.skool.com/test-group',
      subscription_status: 'trial',
      subscription_plan: 'beta',
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    .select()
    .single();

  if (userError) {
    console.error('Error creating user profile:', userError);
    await supabase.auth.admin.deleteUser(authData.user.id);
    return;
  }

  console.log('Test user created successfully!');
  console.log('Email: test@allumi.com');
  console.log('Password: test123456');
  console.log('User ID:', userData.id);
}

createTestUser();