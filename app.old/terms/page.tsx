import { AllumiHeader } from '@/components/allumi-header';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: January 2025</p>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Allumi ("the Service"), you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are 
              prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily access and use Allumi for personal or commercial purposes 
              subject to the restrictions in these Terms of Service. This license does not include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modifying or copying our materials without permission</li>
              <li>Using materials for any unlawful purpose or solicitation</li>
              <li>Attempting to reverse engineer any software</li>
              <li>Removing any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. 
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information remains accurate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Community Guidelines</h2>
            <p className="mb-4">
              When participating in Allumi communities, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respect other community members</li>
              <li>Not post harmful, offensive, or illegal content</li>
              <li>Not spam or engage in harassment</li>
              <li>Respect intellectual property rights</li>
              <li>Follow specific community rules and guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Subscription and Payments</h2>
            <p className="mb-4">
              Certain features of Allumi require a paid subscription. By subscribing:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You authorize us to charge your payment method</li>
              <li>You agree to pay all fees according to the pricing plan</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Refunds are subject to our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Content Ownership</h2>
            <p>
              You retain ownership of content you create and share on Allumi. By posting content, you grant 
              us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content 
              in connection with the Service. We retain all rights to the Allumi platform, including design, 
              functionality, and proprietary technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Prohibited Uses</h2>
            <p className="mb-4">You may not use Allumi to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware or harmful code</li>
              <li>Engage in fraudulent activities</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt unauthorized access to any systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express 
              or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free. 
              You use the Service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Allumi shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use or inability to use the Service, 
              even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Allumi and its affiliates from any claims, 
              damages, obligations, losses, liabilities, costs, or expenses arising from your violation of 
              these Terms or your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account immediately, without prior notice, 
              for any reason, including breach of these Terms. Upon termination, your right to use the Service 
              will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions. Any disputes shall be resolved in the courts 
              of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material 
              changes via email or through the Service. Your continued use of the Service after such modifications 
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">14. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              Email: legal@allumi.com<br />
              Website: www.allumi.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}