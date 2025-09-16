export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">1. Acceptance of Terms</h2>
            <p>By accessing and using Allumi ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">2. Description of Service</h2>
            <p>Allumi provides attribution tracking and analytics services for Skool community owners. We help you understand which marketing channels and content drive paying members to your community.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">3. Account Registration</h2>
            <p>To use our Service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">4. Subscription and Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>14-day free trial available for new users</li>
              <li>Subscription fees are billed monthly in advance</li>
              <li>All payments are processed securely through Stripe</li>
              <li>Refunds are handled on a case-by-case basis</li>
              <li>You may cancel your subscription at any time</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit malware or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">6. Intellectual Property</h2>
            <p>All content, features, and functionality of the Service are owned by Allumi and are protected by international copyright, trademark, and other intellectual property laws.</p>
            <p>You retain ownership of your data. By using our Service, you grant us a license to use your data solely for providing the Service to you.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">7. Data and Privacy</h2>
            <p>Your use of our Service is also governed by our Privacy Policy. By using the Service, you consent to our collection and use of your information as described in the Privacy Policy.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">8. Disclaimer of Warranties</h2>
            <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">9. Limitation of Liability</h2>
            <p>IN NO EVENT SHALL ALLUMI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.</p>
            <p>Our total liability shall not exceed the amount paid by you to Allumi in the twelve (12) months preceding the claim.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">10. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Allumi from any claims, damages, losses, and expenses arising from your use of the Service or violation of these Terms.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">11. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice, for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Breach of these Terms</li>
              <li>Non-payment of fees</li>
              <li>Any conduct we believe harms the Service or other users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">12. Third-Party Services</h2>
            <p>Allumi integrates with third-party services like Skool and Zapier. We are not responsible for the availability or accuracy of these services. Your use of third-party services is subject to their respective terms and policies.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">13. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after changes constitutes acceptance of the modified Terms.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">14. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Allumi operates, without regard to conflict of law principles.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-8">15. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p>Email: legal@allumi.io</p>
          </section>
        </div>
      </div>
    </div>
  )
}