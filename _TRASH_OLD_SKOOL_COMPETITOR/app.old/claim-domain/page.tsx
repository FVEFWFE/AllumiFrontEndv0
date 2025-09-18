import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons"

export default function ClaimDomainPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Claim Your Custom Domain</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Run your community on your own professional domain. Build your brand authority, not someone else's.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Domain Claim Form */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl">Your Professional Domain</CardTitle>
                <CardDescription>
                  Enter your desired domain name. We'll help you set up your own professional domain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="domain">Your Custom Domain</Label>
                  <div className="flex">
                    <Input id="domain" placeholder="academy" className="rounded-r-none" />
                    <div className="bg-muted border border-l-0 px-3 py-2 rounded-r-md text-muted-foreground">
                      .yourdomain.com
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Check Domain Setup
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p>✓ Your own professional domain</p>
                  <p>✓ SSL certificate automatically configured</p>
                  <p>✓ Build your brand authority, not ours</p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Why Own Your Domain?</h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Build Your Authority",
                    description:
                      "academy.yourdomain.com builds YOUR brand equity. Every visitor strengthens your authority, not a platform's.",
                  },
                  {
                    title: "Professional Credibility",
                    description:
                      "Custom domains signal legitimacy. Members trust yourdomain.com more than platform.com/yourname.",
                  },
                  {
                    title: "SEO Ownership",
                    description:
                      "All SEO juice flows to YOUR domain. Build long-term search authority that you own forever.",
                  },
                  {
                    title: "Migration Freedom",
                    description:
                      "Keep your domain when switching platforms. Your members always find you at the same professional URL.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckIcon className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 p-8">
              <h3 className="text-2xl font-semibold mb-4">Ready to Own Your Community?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Stop building someone else's empire. Get your custom domain and start building authority that you own
                forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
