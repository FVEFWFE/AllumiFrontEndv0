const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConversionSimple() {
  console.log('🧪 Testing conversion tracking...\n');

  // Simple conversion without the problematic column
  const conversionData = {
    skool_email: 'test-conversion@allumi.com',
    skool_name: 'Test Conversion User',
    skool_username: 'testconvert',
    joined_at: new Date().toISOString(),
    membership_type: 'paid',
    revenue_tracked: 59,
    attribution_data: {
      direct: {
        source: 'instagram',
        medium: 'social',
        campaign: 'test-campaign',
        clicked_at: new Date().toISOString(),
        attribution_weight: 1.0
      }
    },
    confidence_score: 0.95,
    device_fingerprint: 'test_fingerprint_' + Date.now(),
    metadata: {
      price_paid: 59,
      attributed_revenue: { direct: 59 },
      attribution_method: 'direct_link',
      attribution_signals: {
        hasDirectLink: true,
        hasDeviceFingerprint: true,
        hasEmail: true
      }
    }
  };

  try {
    // Try to insert conversion without attributed_link_id
    console.log('📝 Inserting conversion...');
    const { data, error } = await supabase
      .from('conversions')
      .insert(conversionData)
      .select()
      .single();

    if (error) {
      console.log('❌ Error inserting conversion:', error.message);

      // Try without some fields
      console.log('\n📝 Retrying with minimal fields...');
      const minimalData = {
        skool_email: conversionData.skool_email,
        membership_type: conversionData.membership_type,
        revenue_tracked: conversionData.revenue_tracked,
        confidence_score: conversionData.confidence_score
      };

      const { data: minimalResult, error: minimalError } = await supabase
        .from('conversions')
        .insert(minimalData)
        .select()
        .single();

      if (minimalError) {
        console.log('❌ Minimal insert also failed:', minimalError.message);
      } else {
        console.log('✅ Minimal conversion created:', minimalResult.id);

        // Clean up
        await supabase
          .from('conversions')
          .delete()
          .eq('id', minimalResult.id);
      }
    } else {
      console.log('✅ Conversion created successfully!');
      console.log('Conversion ID:', data.id);
      console.log('Revenue tracked:', data.revenue_tracked);

      // Clean up test data
      await supabase
        .from('conversions')
        .delete()
        .eq('id', data.id);

      console.log('🧹 Test data cleaned up');
    }

    // Check existing conversions
    console.log('\n📊 Checking existing conversions...');
    const { data: existing, error: fetchError } = await supabase
      .from('conversions')
      .select('id, skool_email, revenue_tracked, created_at')
      .limit(5);

    if (fetchError) {
      console.log('❌ Error fetching conversions:', fetchError.message);
    } else {
      console.log('Found', existing.length, 'conversions in database');
      if (existing.length > 0) {
        console.log('Sample conversions:', existing);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConversionSimple();