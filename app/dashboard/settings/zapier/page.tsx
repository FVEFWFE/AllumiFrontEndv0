'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Copy,
  Check,
  Zap,
  ArrowRight,
  ExternalLink,
  FileText,
  Code2,
  Webhook,
  TestTube,
  Info
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ZapierIntegrationPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/skool`;
  const apiKey = 'YOUR_API_KEY'; // This should be fetched from user settings

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const testWebhook = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const testData = {
        event_type: 'member.joined',
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        joined_at: new Date().toISOString(),
        membership_type: 'paid',
        price_paid: 59,
        community_name: 'Test Community',
        referrer_tracking_id: 'test123'
      };

      const response = await fetch('/api/webhooks/skool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      setTestResult({
        success: response.ok,
        status: response.status,
        data: result
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setTesting(false);
    }
  };

  const zapTemplates = [
    {
      name: 'Google Sheets → Allumi',
      description: 'Track members from Google Sheets exports',
      trigger: 'New Spreadsheet Row',
      action: 'Webhooks by Zapier',
      popular: true
    },
    {
      name: 'Email Parser → Allumi',
      description: 'Parse Skool notification emails',
      trigger: 'Email Parser by Zapier',
      action: 'Webhooks by Zapier',
      recommended: true
    },
    {
      name: 'Scheduled CSV Import',
      description: 'Daily automated member sync',
      trigger: 'Schedule by Zapier',
      action: 'Google Sheets + Webhooks'
    }
  ];

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Zapier Integration</h1>
        <p className="text-muted-foreground mt-2">
          Automate Skool member tracking with Zapier webhooks
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Since Skool doesn't have a native API, we use Zapier to automate data flow from
          Google Sheets exports or email notifications into Allumi.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Config</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Guide</CardTitle>
              <CardDescription>
                Connect Skool to Allumi in 3 steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold">Export Skool Members to Google Sheets</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your Skool members CSV and import into Google Sheets.
                    Set up daily exports for automation.
                  </p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-mono">
                      Skool Admin → Members → Export CSV → Import to Google Sheets
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold">Create Zapier Automation</h3>
                  <p className="text-sm text-muted-foreground">
                    Use Zapier to watch for new rows in Google Sheets and send to Allumi
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Trigger</Badge>
                      <span className="text-sm">Google Sheets - New Spreadsheet Row</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Action</Badge>
                      <span className="text-sm">Webhooks by Zapier - POST</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Open Zapier Template
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold">Configure Webhook in Zapier</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your Allumi webhook URL and map the fields
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Webhook URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={webhookUrl} readOnly className="text-xs font-mono" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                        >
                          {copied === 'webhook' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Technical details for your Zapier webhook setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Endpoint URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(webhookUrl, 'endpoint')}
                  >
                    {copied === 'endpoint' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Method</Label>
                <Input value="POST" readOnly className="font-mono" />
              </div>

              <div>
                <Label>Required Fields</Label>
                <div className="bg-muted p-3 rounded-lg mt-1">
                  <pre className="text-xs">
{`{
  "event_type": "member.joined",
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe",
  "joined_at": "2024-01-20T10:00:00Z",
  "membership_type": "paid",
  "price_paid": 59,
  "referrer_tracking_id": "abc123"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <Label>Field Mapping Guide</Label>
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Google Sheets Column</div>
                    <div className="font-medium">Allumi Field</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Email</div>
                    <div>email</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Full Name</div>
                    <div>name</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Username</div>
                    <div>username</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Join Date</div>
                    <div>joined_at</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Plan Type</div>
                    <div>membership_type</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Amount Paid</div>
                    <div>price_paid</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={testWebhook}
                  disabled={testing}
                  className="w-full"
                >
                  {testing ? (
                    <>Testing...</>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Webhook
                    </>
                  )}
                </Button>

                {testResult && (
                  <Alert className={`mt-4 ${testResult.success ? 'border-green-500' : 'border-red-500'}`}>
                    <AlertDescription>
                      {testResult.success ? (
                        <div>
                          <p className="font-medium text-green-700">✓ Webhook test successful!</p>
                          <pre className="text-xs mt-2 bg-muted p-2 rounded">
                            {JSON.stringify(testResult.data, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-red-700">✗ Webhook test failed</p>
                          <p className="text-sm mt-1">{testResult.error}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zapier Templates</CardTitle>
              <CardDescription>
                Pre-built automation templates for common scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {zapTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{template.name}</h3>
                        {template.popular && (
                          <Badge variant="secondary">Popular</Badge>
                        )}
                        {template.recommended && (
                          <Badge className="bg-green-500">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {template.trigger}
                        </Badge>
                        <ArrowRight className="w-3 h-3" />
                        <Badge variant="outline" className="text-xs">
                          {template.action}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Use Template
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alternative: Email Parser Method</CardTitle>
              <CardDescription>
                Automatically capture new members from Skool notification emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you receive email notifications when members join your Skool community,
                  you can use Email Parser by Zapier to automatically extract member data.
                </p>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    Forward Skool notifications to Email Parser
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    Train the parser to extract member details
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    Connect to Allumi webhook
                  </li>
                </ol>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  View Email Parser Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}