import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get export type from query params
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'conversions';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let data: any[] = [];
    let filename = '';

    switch (exportType) {
      case 'conversions':
        data = await exportConversions(user.id, startDate, endDate);
        filename = 'allumi-conversions.csv';
        break;
        
      case 'clicks':
        data = await exportClicks(user.id, startDate, endDate);
        filename = 'allumi-clicks.csv';
        break;
        
      case 'links':
        data = await exportLinks(user.id);
        filename = 'allumi-links.csv';
        break;
        
      case 'attribution':
        data = await exportAttribution(user.id, startDate, endDate);
        filename = 'allumi-attribution.csv';
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    // Convert to CSV
    const csv = stringify(data, {
      header: true,
      columns: Object.keys(data[0] || {})
    });

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function exportConversions(userId: string, startDate: string | null, endDate: string | null) {
  let query = supabase
    .from('conversions')
    .select('*')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (startDate) {
    query = query.gte('joined_at', startDate);
  }
  if (endDate) {
    query = query.lte('joined_at', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Format for CSV export
  return (data || []).map(conversion => ({
    'Date': new Date(conversion.joined_at).toLocaleDateString(),
    'Time': new Date(conversion.joined_at).toLocaleTimeString(),
    'Email': conversion.skool_email,
    'Name': conversion.skool_name,
    'Skool Group': conversion.skool_group,
    'Membership Level': conversion.membership_level || 'Standard',
    'Primary Source': Object.keys(conversion.attribution_data || {})[0] || 'Unknown',
    'Attribution': JSON.stringify(conversion.attribution_data),
    'Confidence Score': `${conversion.confidence_score}%`,
    'Revenue': conversion.revenue_tracked || 0,
    'LTV Estimate': conversion.ltv_estimate || 0
  }));
}

async function exportClicks(userId: string, startDate: string | null, endDate: string | null) {
  let query = supabase
    .from('clicks')
    .select('*')
    .eq('user_id', userId)
    .order('clicked_at', { ascending: false });

  if (startDate) {
    query = query.gte('clicked_at', startDate);
  }
  if (endDate) {
    query = query.lte('clicked_at', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(click => ({
    'Date': new Date(click.clicked_at).toLocaleDateString(),
    'Time': new Date(click.clicked_at).toLocaleTimeString(),
    'Campaign': click.campaign_name,
    'UTM Source': click.utm_source || '',
    'UTM Medium': click.utm_medium || '',
    'UTM Campaign': click.utm_campaign || '',
    'Recipient ID': click.recipient_id || '',
    'IP Address': click.ip_address,
    'User Agent': click.user_agent,
    'Device Fingerprint': click.device_fingerprint || ''
  }));
}

async function exportLinks(userId: string) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(link => ({
    'Created': new Date(link.created_at).toLocaleDateString(),
    'Campaign': link.campaign_name,
    'Short URL': `${process.env.NEXT_PUBLIC_APP_URL}/l/${link.short_id}`,
    'Destination': link.destination_url,
    'Total Clicks': link.clicks,
    'Last Click': link.last_clicked_at ? new Date(link.last_clicked_at).toLocaleDateString() : 'Never',
    'UTM Source': link.utm_source || '',
    'UTM Medium': link.utm_medium || '',
    'UTM Campaign': link.utm_campaign || '',
    'Status': link.is_active ? 'Active' : 'Inactive'
  }));
}

async function exportAttribution(userId: string, startDate: string | null, endDate: string | null) {
  // Get all conversions with attribution data
  let query = supabase
    .from('conversions')
    .select('*')
    .eq('user_id', userId);

  if (startDate) {
    query = query.gte('joined_at', startDate);
  }
  if (endDate) {
    query = query.lte('joined_at', endDate);
  }

  const { data: conversions, error } = await query;
  if (error) throw error;

  // Aggregate attribution data
  const attributionMap = new Map<string, any>();

  (conversions || []).forEach(conversion => {
    if (conversion.attribution_data) {
      Object.entries(conversion.attribution_data).forEach(([campaign, data]: [string, any]) => {
        if (!attributionMap.has(campaign)) {
          attributionMap.set(campaign, {
            campaign,
            conversions: 0,
            totalCredit: 0,
            revenue: 0
          });
        }
        const stats = attributionMap.get(campaign);
        stats.conversions++;
        stats.totalCredit += data.credit || 0;
        stats.revenue += (conversion.revenue_tracked || 0) * ((data.credit || 0) / 100);
      });
    }
  });

  // Get click data for each campaign
  const campaigns = Array.from(attributionMap.keys());
  const clickData = await Promise.all(
    campaigns.map(async (campaign) => {
      const { data, error } = await supabase
        .from('clicks')
        .select('id')
        .eq('user_id', userId)
        .eq('campaign_name', campaign);
      
      return {
        campaign,
        clicks: data?.length || 0
      };
    })
  );

  // Combine data
  return Array.from(attributionMap.values()).map(attr => {
    const clicks = clickData.find(c => c.campaign === attr.campaign)?.clicks || 0;
    return {
      'Campaign': attr.campaign,
      'Clicks': clicks,
      'Conversions': attr.conversions,
      'Conversion Rate': clicks > 0 ? `${((attr.conversions / clicks) * 100).toFixed(2)}%` : '0%',
      'Attribution Credit': `${attr.totalCredit.toFixed(2)}%`,
      'Attributed Revenue': `$${attr.revenue.toFixed(2)}`
    };
  });
}