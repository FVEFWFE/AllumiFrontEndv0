const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixTestUser() {
  try {
    const testEmail = 'test@allumi.com';
    const testUserId = 'ed8ff25f-768f-413f-a73b-b8d02ca4e376';

    // First check if a user with this email exists
    const { data: existingByEmail, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (emailError && emailError.code !== 'PGRST116') {
      console.error('Error checking by email:', emailError);
      return;
    }

    if (existingByEmail) {
      console.log('Found existing user with email:', existingByEmail);
      
      // Update the ID if different
      if (existingByEmail.id !== testUserId) {
        console.log('Updating user ID from', existingByEmail.id, 'to', testUserId);
        
        // Delete the old record
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', existingByEmail.id);
          
        if (deleteError) {
          console.error('Error deleting old record:', deleteError);
          return;
        }
        
        // Insert with correct ID
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
          console.error('Error inserting with new ID:', insertError);
          return;
        }
        
        console.log('User updated successfully:', newUser);
      } else {
        console.log('User ID is already correct');
      }
    } else {
      // Create new user
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
        console.error('Error creating user:', insertError);
        return;
      }
      
      console.log('User created successfully:', newUser);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

fixTestUser();
