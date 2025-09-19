const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://fyvxgciqfifjsycibikn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnhnY2lxZmlmanN5Y2liaWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3OTk2NywiZXhwIjoyMDczMzU1OTY3fQ.ZDCs4ugkEVlmq0ujnC-Mf3Pn3ejJwdgPEd81gZZ-maU'
);

async function createTestUser() {
  console.log('Setting up test user...');

  // First, try to get the existing user
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const existingUser = existingUsers.users.find(u => u.email === 'test@allumi.com');

  let userId;

  if (existingUser) {
    console.log('User already exists, updating password...');

    // Update the existing user's password
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: 'test123456',
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      return;
    }

    userId = existingUser.id;
    console.log('Password updated successfully');

  } else {
    // Create new auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@allumi.com',
      password: 'test123456',
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    userId = authData.user.id;
    console.log('Auth user created:', userId);
  }

  // Check if user profile exists
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('users')
    .select()
    .eq('id', userId)
    .single();

  if (!existingProfile && !profileCheckError) {
    // Create user profile if it doesn't exist
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
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
      return;
    }
    console.log('User profile created');
  } else {
    console.log('User profile already exists');
  }

  console.log('\n✅ Test user ready!');
  console.log('Email: test@allumi.com');
  console.log('Password: test123456');
  console.log('User ID:', userId);
}

createTestUser();