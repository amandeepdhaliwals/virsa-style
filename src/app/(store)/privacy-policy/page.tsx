export const metadata = {
  title: "Privacy Policy | ਵਿਰਸਾ Style",
  description: "Privacy Policy for ਵਿਰਸਾ Style - how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Privacy Policy</h1>
        <p className="text-sm text-luxury-text mt-4">Last updated: March 25, 2026</p>
      </div>

      <div className="prose-luxury space-y-8">
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">1. Information We Collect</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            At ਵਿਰਸਾ Style, we collect information you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-luxury-text">
            <li>Create an account or place an order</li>
            <li>Subscribe to our newsletter or marketing communications</li>
            <li>Contact us via WhatsApp, email, or contact form</li>
            <li>Browse our website (cookies and analytics data)</li>
          </ul>
          <p className="text-luxury-text leading-relaxed text-sm mt-3">
            This may include your name, email address, phone number, shipping address, payment information, and browsing activity.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our website, products, and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">3. Information Sharing</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only with:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-luxury-text">
            <li>Payment processors to complete transactions</li>
            <li>Shipping partners to deliver your orders</li>
            <li>Analytics providers to improve our services</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">4. Cookies & Tracking</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We use cookies and similar technologies to enhance your browsing experience, remember your preferences,
            and analyze website traffic. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">5. Data Security</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We implement industry-standard security measures including SSL encryption, secure payment processing,
            and regular security audits to protect your personal information. However, no method of transmission
            over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">6. Your Rights</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            Under applicable Indian data protection laws, you have the right to:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-luxury-text">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Lodge a complaint with the relevant data protection authority</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">7. Data Retention</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We retain your personal information for as long as your account is active or as needed to provide services,
            comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">8. Contact Us</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none mt-3 space-y-1 text-sm text-luxury-text">
            <li>Email: hello@virsastyle.com</li>
            <li>WhatsApp: +91 8289012150</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
