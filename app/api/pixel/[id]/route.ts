import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1x1 transparent GIF
const PIXEL_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pixelId = params.id.replace('.gif', '');
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Parse pixel ID - format: campaignId_recipientId_timestamp
    const [campaignId, recipientId] = pixelId.split('_');

    if (campaignId && recipientId) {
      // Track email open
      await supabase.from('email_opens').insert({
        campaign_id: campaignId,
        recipient_id: recipientId,
        ip_address: ip,
        user_agent: userAgent,
        opened_at: new Date().toISOString()
      });

      // Update or create identity
      const { data: identity } = await supabase
        .from('identities')
        .upsert({
          recipient_id: recipientId,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'recipient_id'
        })
        .select()
        .single();

      console.log(`Email opened: Campaign ${campaignId}, Recipient ${recipientId}`);
    }

    // Return transparent pixel
    return new NextResponse(PIXEL_GIF, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Pixel tracking error:', error);
    
    // Still return pixel even if tracking fails
    return new NextResponse(PIXEL_GIF, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

// Generate pixel URL for emails
export async function POST(request: NextRequest) {
  try {
    const { campaignId, recipientId, recipientEmail } = await request.json();

    if (!campaignId || !recipientId) {
      return NextResponse.json(
        { error: 'Campaign ID and recipient ID required' },
        { status: 400 }
      );
    }

    // Store recipient mapping if email provided
    if (recipientEmail) {
      await supabase
        .from('identities')
        .upsert({
          recipient_id: recipientId,
          emails: [recipientEmail],
          created_at: new Date().toISOString()
        }, {
          onConflict: 'recipient_id'
        });
    }

    const pixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/pixel/${campaignId}_${recipientId}.gif`;

    return NextResponse.json({
      success: true,
      pixelUrl,
      html: `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`
    });

  } catch (error) {
    console.error('Error generating pixel URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}