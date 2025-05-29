import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Fashion AI",
  description: "Our commitment to protecting your privacy and personal data",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-gray-500 mb-6">Last Updated: May 8, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Fashion AI ("we," "our," or "us"). We are committed to protecting your privacy and personal data.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
            website and services, including our virtual try-on, outfit suggestions, and wardrobe management features.
          </p>
          <p>By accessing or using our services, you consent to the practices described in this Privacy Policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-medium mb-3">2.1 Personal Information</h3>
          <p>We may collect the following personal information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Contact information (name, email address)</li>
            <li>Account credentials</li>
            <li>Profile information (style preferences, body measurements, etc.)</li>
            <li>Payment information (processed through secure third-party payment processors)</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">2.2 Images and Content</h3>
          <p>Our services involve the collection and processing of:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Photos of your clothing items uploaded to your virtual wardrobe</li>
            <li>Photos used for virtual try-on features</li>
            <li>User-generated content such as saved outfits and style preferences</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">2.3 Usage Data</h3>
          <p>We automatically collect certain information when you use our services:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Device information (browser type, operating system, device type)</li>
            <li>Log data (IP address, access times, pages viewed)</li>
            <li>Usage patterns and preferences</li>
            <li>Cookies and similar tracking technologies (see our Cookie Policy)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Generate AI-powered outfit suggestions and virtual try-on experiences</li>
            <li>Personalize your experience and content</li>
            <li>Communicate with you about our services, updates, and promotions</li>
            <li>Respond to your requests and customer service needs</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Protect against unauthorized access and ensure the security of our services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. AI Processing and Image Analysis</h2>
          <p>
            Our services use artificial intelligence to analyze images, generate outfit suggestions, and provide virtual
            try-on experiences. This processing involves:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Analyzing clothing items in uploaded images to categorize and tag them</li>
            <li>Processing user photos for virtual try-on features</li>
            <li>Generating personalized outfit recommendations based on your wardrobe and preferences</li>
          </ul>
          <p>
            We implement technical safeguards to protect your images and limit their use to the specific features you've
            requested.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service providers who perform services on our behalf (hosting, payment processing, analytics)</li>
            <li>Partners for product recommendations and e-commerce functionality</li>
            <li>Legal authorities when required by law or to protect our rights</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information.
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive
            to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute
            security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access and review your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Delete your personal information</li>
            <li>Restrict or object to certain processing activities</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
            information from children. If you believe we have collected information from a child, please contact us
            immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <p className="mt-2">
            Email: privacy@fashionai.com
            <br />
            Address: 123 Fashion Street, Style City, SC 12345
          </p>
        </section>

        <div className="mt-12 border-t pt-6">
          <p>
            <Link href="/terms-of-service" className="text-blue-600 hover:underline">
              Terms of Service
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
