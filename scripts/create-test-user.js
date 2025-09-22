const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  try {
    const testEmail = 'test@allumi.com';
    const testUserId = 'ed8ff25f-768f-413f-a73b-b8d02ca4e376';

    // Check if user exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking users table:', checkError);
      return;
    }

    if (!existingUser) {
      // Insert into users table
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: testUserId,
          email: testEmail,
          subscription_status: 'trial',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user:', insertError);
        return;
      }

      console.log('Test user created successfully in users table:', newUser);
    } else {
      console.log('Test user already exists in users table:', existingUser);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();
