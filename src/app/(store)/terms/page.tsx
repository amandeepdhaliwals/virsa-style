export const metadata = {
  title: "Terms of Service | ਵਿਰਸਾ Style",
  description: "Terms and conditions for using ਵਿਰਸਾ Style website and services.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Terms of Service</h1>
        <p className="text-sm text-luxury-text mt-4">Last updated: March 25, 2026</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">1. Acceptance of Terms</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            By accessing and using the ਵਿਰਸਾ Style website (virsastyle.com), you agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">2. Eligibility</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            You must be at least 18 years of age to make purchases on our website. By placing an order,
            you represent that you are of legal age and have the authority to enter into a binding agreement.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">3. Products & Pricing</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
            <li>We reserve the right to modify prices at any time without prior notice.</li>
            <li>Product images are for illustration purposes. Actual colors may vary slightly due to screen settings.</li>
            <li>We make every effort to display accurate product information but do not guarantee that descriptions are error-free.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">4. Orders & Payments</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order.</li>
            <li>Orders are confirmed only upon successful payment processing.</li>
            <li>We accept payments via UPI, credit/debit cards, net banking, and cash on delivery (select locations).</li>
            <li>All payment information is processed securely through our payment partners.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">5. Account Responsibilities</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">6. Intellectual Property</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            All content on this website — including text, images, logos, graphics, and software — is the property
            of ਵਿਰਸਾ Style and is protected by Indian intellectual property laws. You may not reproduce, distribute,
            or use any content without our written permission.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">7. User Conduct</h2>
          <p className="text-luxury-text leading-relaxed text-sm">You agree not to:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-luxury-text">
            <li>Use the website for any unlawful purpose</li>
            <li>Submit false or misleading information</li>
            <li>Interfere with or disrupt the website&apos;s functionality</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Post reviews or content that is defamatory, abusive, or inappropriate</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">8. Limitation of Liability</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            ਵਿਰਸਾ Style shall not be liable for any indirect, incidental, or consequential damages arising from
            the use of our website or products. Our total liability shall not exceed the amount paid for the
            specific product giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">9. Governing Law</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            These terms shall be governed by and construed in accordance with the laws of India.
            Any disputes shall be subject to the exclusive jurisdiction of the courts in Punjab, India.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">10. Changes to Terms</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We may update these Terms of Service at any time. Changes will be posted on this page with an updated date.
            Continued use of the website after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">11. Contact</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            For questions regarding these Terms of Service:
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
