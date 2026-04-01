export const metadata = {
  title: "Shipping Policy | ਵਿਰਸਾ Style",
  description: "Shipping information and delivery timelines for ਵਿਰਸਾ Style orders.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Customer Care</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Shipping Policy</h1>
        <p className="text-sm text-luxury-text mt-4">Last updated: March 25, 2026</p>
      </div>

      <div className="space-y-8">
        {/* Delivery timeline table */}
        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-4">Delivery Timelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pastel-pink">
                  <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-accent">Shipping Method</th>
                  <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-accent">Delivery Time</th>
                  <th className="text-left py-3 px-4 text-xs tracking-wider uppercase text-accent">Cost</th>
                </tr>
              </thead>
              <tbody className="text-luxury-text">
                <tr className="border-b border-pastel-cream">
                  <td className="py-3 px-4">Standard Shipping</td>
                  <td className="py-3 px-4">5-7 business days</td>
                  <td className="py-3 px-4">Free on orders above ₹999</td>
                </tr>
                <tr className="border-b border-pastel-cream">
                  <td className="py-3 px-4">Express Shipping</td>
                  <td className="py-3 px-4">2-3 business days</td>
                  <td className="py-3 px-4">₹149</td>
                </tr>
                <tr className="border-b border-pastel-cream">
                  <td className="py-3 px-4">Same Day (Metro cities)</td>
                  <td className="py-3 px-4">Same day (order before 12 PM)</td>
                  <td className="py-3 px-4">₹299</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Standard (below ₹999)</td>
                  <td className="py-3 px-4">5-7 business days</td>
                  <td className="py-3 px-4">₹79</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Order Processing</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>Orders are processed within 1-2 business days after payment confirmation.</li>
            <li>Orders placed on weekends or holidays will be processed on the next business day.</li>
            <li>You will receive a confirmation email/WhatsApp message with tracking details once your order ships.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Shipping Locations</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We currently ship across India. Delivery to remote/rural areas may take an additional 2-3 business days.
            We do not ship internationally at this time.
          </p>
          <div className="mt-4 bg-pastel-cream p-4">
            <p className="text-sm text-luxury-dark font-medium">Metro Cities (Fastest Delivery)</p>
            <p className="text-sm text-luxury-text mt-1">
              Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Chandigarh, Jaipur
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Cash on Delivery (COD)</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>COD is available for orders up to ₹5,000</li>
            <li>A nominal COD handling fee of ₹49 applies</li>
            <li>COD is available only at select pin codes — check availability at checkout</li>
            <li>Please keep the exact change ready at the time of delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Order Tracking</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            Once your order is shipped, you will receive a tracking link via WhatsApp and email.
            You can also track your order through your account dashboard. For any tracking issues,
            please contact us with your order number.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Delivery Issues</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>If your order is delayed beyond the estimated delivery time, please contact us.</li>
            <li>We are not responsible for delays caused by incorrect address or unavailability at the delivery location.</li>
            <li>Two delivery attempts will be made. After that, the package will be returned to us.</li>
            <li>For returned-to-origin packages, we will contact you to arrange re-delivery.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">Contact</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            For shipping queries, reach us at:
          </p>
          <ul className="list-none mt-3 space-y-1 text-sm text-luxury-text">
            <li>WhatsApp: +91 8289012150</li>
            <li>Email: hello@virsastyle.com</li>
            <li>Business Hours: Mon-Sat, 10 AM - 8 PM</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
