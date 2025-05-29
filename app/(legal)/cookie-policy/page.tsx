import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Fashion AI",
  description: "The terms and conditions governing your use of our services",
}

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-gray-500 mb-6">Last Updated: May 8, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            Welcome to Fashion AI. These Terms of Service ("Terms") govern your access to and use of our website,
            applications, and services (collectively, the "Services"). By accessing or using our Services, you agree to
            be bound by these Terms and our Privacy Policy.
          </p>
          <p>If you do not agree to these Terms, you may not access or use the Services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will provide notice of any material changes by posting the updated
            Terms on our website and updating the "Last Updated" date. Your continued use of the Services after any such
            changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may need to create an account. You agree to provide
            accurate, current, and complete information during the registration process and to update such information
            to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your password and for all activities that occur under your account. You
            agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          <h3 className="text-xl font-medium mb-3">4.1 Content Ownership</h3>
          <p>
            You retain ownership of any content you upload, submit, or create through our Services, including photos of
            your clothing items and outfits ("User Content"). By uploading or creating User Content, you grant us a
            non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and display such
            User Content for the purpose of providing and improving our Services.
          </p>

          <h3 className="text-xl font-medium mb-3">4.2 Content Restrictions</h3>
          <p>You agree not to upload, submit, or create User Content that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Infringes on the intellectual property rights of others</li>
            <li>Contains offensive, harmful, or inappropriate content</li>
            <li>Violates any applicable law or regulation</li>
            <li>Contains malware, viruses, or other harmful code</li>
            <li>Impersonates any person or entity</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">4.3 Content Removal</h3>
          <p>
            We reserve the right to remove any User Content that violates these Terms or that we find objectionable for
            any reason, without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. AI-Generated Content</h2>
          <p>
            Our Services include AI-generated content such as outfit suggestions, virtual try-on images, and style
            recommendations. You acknowledge that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>AI-generated content is provided for informational and entertainment purposes only</li>
            <li>We do not guarantee the accuracy, completeness, or suitability of AI-generated content</li>
            <li>AI-generated content may not always reflect current fashion trends or personal style preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. E-Commerce and Purchases</h2>
          <p>
            Our Services may include e-commerce functionality that allows you to purchase products from third-party
            retailers. You acknowledge that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              We are not responsible for the quality, safety, or availability of products sold by third-party retailers
            </li>
            <li>All purchases are subject to the terms and conditions of the respective retailers</li>
            <li>We may earn commissions from purchases made through affiliate links</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Subscription and Payments</h2>
          <p>
            We offer subscription plans with different features and pricing. By subscribing to a paid plan, you agree to
            pay all fees in accordance with the pricing and terms in effect at the time of your subscription.
          </p>
          <p>
            You authorize us to charge your payment method for all fees incurred. Subscription fees are non-refundable
            except as required by law or as explicitly stated in these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p>
            The Services, including all content, features, and functionality (excluding User Content), are owned by
            Fashion AI or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
            republish, download, store, or transmit any of the material on our Services, except as permitted by these
            Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Fashion AI and its affiliates, officers, employees, agents,
            partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
            losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to or use of or inability to access or use the Services</li>
            <li>Any conduct or content of any third party on the Services</li>
            <li>Any content obtained from the Services</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Disclaimer of Warranties</h2>
          <p>
            The Services are provided on an "as is" and "as available" basis, without warranties of any kind, either
            express or implied. Fashion AI disclaims all warranties, including implied warranties of merchantability,
            fitness for a particular purpose, non-infringement, and any warranties arising out of course of dealing or
            usage of trade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Fashion AI and its officers, directors, employees, agents,
            and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable
            attorneys' fees, arising out of or in any way connected with your access to or use of the Services or your
            violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Services at any time, without prior notice or
            liability, for any reason, including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Services will immediately cease. All provisions of these Terms which
            by their nature should survive termination shall survive termination, including ownership provisions,
            warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California,
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Dispute Resolution</h2>
          <p>
            Any dispute arising from or relating to these Terms or the Services shall be resolved through binding
            arbitration in accordance with the American Arbitration Association's rules. The arbitration shall be
            conducted in San Francisco, California, and judgment on the arbitration award may be entered in any court
            having jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">
            Email: legal@fashionai.com
            <br />
            Address: 123 Fashion Street, Style City, SC 12345
          </p>
        </section>

        <div className="mt-12 border-t pt-6">
          <p>
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/cookie-policy" className="text-blue-600 hover:underline ml-2">
              Cookie Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
