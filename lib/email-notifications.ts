import MailerLite from '@mailerlite/mailerlite-nodejs';

// Initialize MailerLite
const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMThkN2IxODRhNjQ1NDBiYmY4ZTBjNjgxNzhjNTdkYTU2M2EyMGI4ZjAwZmYyMjljY2YxZTg4Y2Y0ZGI4ZTIyODE5NzZlMGVkYTg4NWJlMGUiLCJpYXQiOjE3NTgyOTY2NjMuNjM0MTYxLCJuYmYiOjE3NTgyOTY2NjMuNjM0MTY0LCJleHAiOjQ5MTM5NzAyNjMuNjI4Njk1LCJzdWIiOiIxNzUxMDI4Iiwic2NvcGVzIjpbXX0.cKV8X0jPADQsDH1OK04gY_0Zsj3FzSRvwZXQ8F8nSyxXgUe-98JJkefHFPRTevqedH_DBJOaTpms9ZLSR9th5_ko1bUBBFYyVN36mxycg0azPuUOVFrJJsnyhupL55L3VauP8dC4EQ1xlKNX6l6hXewiyVtFCjj0upJ2uuEk8SYt3dgHOxQRyNVHsuHsbhLWPEsB9gvmpVK_ZM5Ozhsp5BCRqOPN0dv17Ki8VQdZYTys1ckhIB1g0er0jaFKczxYmzNQiUcjPa_5LsoOd3lNCFWiO6sWrfxXlneUQeldxtsJnK6tN6YXBhCR4B2DfvuenvGVBbzef1IXTzjcBcATatsfwAD5KQa1gOEjiJ8b-gmdo3-oluwoNnDtHmsoULea5qpgEfhfQR0CGA2qfKr4pyU4FkD7-kKQ-ha_KOky8xSCmAFdToOD34ShBnlfBq32YVZ7d0Iu03WMipZBJDQMKqYqh52Ij2SfKOBwXmjbr8Ta2pScgRla4r_A9sv9RrJBrO5oPAqDuJnD1bnImmNHYQVWtRzimC2gqJsmi5XsY7A81kdoqmQ5XGVJCBlv_mvhgMt4S1DmwcSaNHhxEtPW-InZ_n1nQ7obPk2ty8zNflYmaLWpeYIukb-RSsNemq6C697r5P5wtJeU-dpkBUVrX_ktUTMG6jFo9SbFXUwv6Ks'
});

const ALLUMI_DEMO_GROUP_ID = '165986164130448577';

interface DemoNotificationData {
  email: string;
  firstName: string;
  skoolUrl?: string;
  skoolUsername?: string;
  source: string;
  captureType: string;
  leadScore?: number;
  enrichedExisting?: boolean;
}

export async function sendDemoNotification(data: DemoNotificationData) {
  try {
    // Add subscriber to MailerLite demo group
    const subscriberData = {
      email: data.email,
      fields: {
        name: data.firstName,
        skool_url: data.skoolUrl || '',
        skool_username: data.skoolUsername || '',
        lead_source: data.source,
        lead_score: data.leadScore?.toString() || '0',
        enriched_profile: data.enrichedExisting ? 'yes' : 'no',
        demo_requested_at: new Date().toISOString()
      },
      groups: [ALLUMI_DEMO_GROUP_ID]
    };

    // Create or update subscriber in MailerLite
    const result = await mailerlite.subscribers.createOrUpdate(subscriberData);

    console.log('✅ Added to MailerLite demo group:', data.email);

    // Also send a simple notification email to Jan
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">🎯 New Demo Request!</h2>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Contact Details:</h3>
          <p><strong>Name:</strong> ${data.firstName}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.skoolUrl ? `<p><strong>Skool Profile:</strong> <a href="https://${data.skoolUrl}">${data.skoolUsername || data.skoolUrl}</a></p>` : ''}
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">📊 Lead Intelligence:</h4>
          <p><strong>Source:</strong> ${data.source}</p>
          <p><strong>Capture Type:</strong> ${data.captureType}</p>
          ${data.leadScore ? `<p><strong>Lead Score:</strong> ${data.leadScore}/100</p>` : ''}
          ${data.enrichedExisting ? '<p style="color: #059669;"><strong>✅ Enriched existing Skool profile!</strong></p>' : ''}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This notification was sent because someone requested a demo on Allumi.com
          </p>
        </div>
      </div>
    `;

    // Send transactional email to Jan
    // NOTE: This requires a verified sending domain in MailerLite
    // For now, rely on MailerLite automation rules for the demo group
    try {
      const emailPayload = {
        from: {
          email: 'noreply@allumi.com',
          name: 'Allumi System'
        },
        to: [{
          email: 'jan@allumi.com',
          name: 'Jan'
        }],
        subject: `🎯 Demo Request: ${data.firstName} (${data.email})`,
        html: emailContent,
        text: `New Demo Request!\n\nName: ${data.firstName}\nEmail: ${data.email}\n${data.skoolUrl ? `Skool: https://${data.skoolUrl}\n` : ''}Source: ${data.source}\nLead Score: ${data.leadScore || 0}/100`
      };

      console.log('Attempting to send email notification...');
      const emailResponse = await mailerlite.emails.send(emailPayload);
      console.log('✅ Notification email sent to jan@allumi.com', emailResponse);
    } catch (emailError: any) {
      console.error('Email notification failed:', emailError?.response?.data || emailError?.message || emailError);
      console.log('⚠️ Direct email not sent (likely needs verified domain), but subscriber was added to MailerLite demo group');
      console.log('💡 To receive notifications: Set up an automation in MailerLite for the demo group');
    }

    return { success: true, subscriberId: result.data?.id };
  } catch (error) {
    console.error('Failed to add to MailerLite:', error);
    // Don't fail the whole request if MailerLite fails
    return { success: false, error };
  }
}

// Alternative: Simple webhook notification to a service like Zapier or Make
export async function sendWebhookNotification(data: DemoNotificationData) {
  try {
    const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log('No notification webhook configured');
      return { success: true, skipped: true };
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'demo_requested',
        timestamp: new Date().toISOString(),
        data
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    console.log('✅ Webhook notification sent');
    return { success: true };
  } catch (error) {
    console.error('Failed to send webhook notification:', error);
    return { success: false, error };
  }
}