import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy | ਵਿਰਸਾ Style",
  description: "Return and refund policy for ਵਿਰਸਾ Style purchases.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Customer Care</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Return & Refund Policy</h1>
        <p className="text-sm text-luxury-text mt-4">Last updated: March 25, 2026</p>
      </div>

      <div className="space-y-8">
        {/* Highlight box */}
        <div className="bg-pastel-cream border border-pastel-pink p-6">
          <p className="text-sm text-luxury-dark font-medium mb-2">Quick Overview</p>
          <ul className="space-y-1 text-sm text-luxury-text">
            <li><strong>Footwear (Juttis, Boots, Chappals):</strong> 7-day returns — unworn, with original tags</li>
            <li><strong>Unstitched Suits:</strong> 7-day returns — unused, original packaging intact</li>
            <li><strong>Stitched Suits:</strong> Non-returnable (custom-made to your measurements)</li>
            <li><strong>Dresses:</strong> 7-day returns — unworn, with original tags</li>
            <li>Prepaid orders only — no COD available</li>
            <li>Refund processed within 7-10 business days to original payment method</li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-6">
          <p className="text-sm text-orange-800 font-medium mb-1">⚠ Important Note</p>
          <p className="text-sm text-orange-700">
            Stitched/tailored suits are custom-made to your measurements and design preferences.
            These are <strong>non-returnable and non-refundable</strong>. Please double-check your
            measurements and design choices before placing your order. Our tailor will confirm
            details on WhatsApp before starting.
          </p>
        </div>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">1. Return Eligibility</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We want you to love your purchase. If you&apos;re not satisfied, you may return eligible items within
            <strong> 7 days</strong> of delivery. To qualify for a return:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-luxury-text">
            <li>Items must be unworn, unwashed, and in original condition</li>
            <li>All original tags and packaging must be intact</li>
            <li>Items must not have any signs of use, alteration, or damage by the customer</li>
            <li>Return request must be initiated within 7 days of delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">2. Non-Returnable Items</h2>
          <p className="text-luxury-text leading-relaxed text-sm">The following items cannot be returned:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-luxury-text">
            <li><strong>Stitched/tailored suits</strong> (custom-made to your measurements)</li>
            <li>Items altered or customized per your request</li>
            <li>Customized or altered items</li>
            <li>Items purchased during final sale or clearance events</li>
            <li>Gift cards and vouchers</li>
            <li>Items with removed tags or signs of wear</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">3. How to Initiate a Return</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-white text-sm flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium text-luxury-dark">Contact Us</p>
                <p className="text-sm text-luxury-text">Message us on WhatsApp at +91 8289012150 or email hello@virsastyle.com with your order number.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-white text-sm flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium text-luxury-dark">Get Approval</p>
                <p className="text-sm text-luxury-text">Our team will review your request and provide return instructions within 24 hours.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-white text-sm flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-medium text-luxury-dark">Ship the Item</p>
                <p className="text-sm text-luxury-text">Pack the item securely and ship it to the address provided. Keep the tracking number.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-accent text-white text-sm flex items-center justify-center">4</span>
              <div>
                <p className="text-sm font-medium text-luxury-dark">Receive Refund</p>
                <p className="text-sm text-luxury-text">Once we receive and inspect the item, your refund will be processed within 7-10 business days.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">4. Refund Details</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-luxury-text">
            <li>Refunds are credited to the original payment method</li>
            <li>Shipping charges are non-refundable (unless the item was defective or wrong)</li>
            <li>For COD orders, refund will be processed via bank transfer</li>
            <li>Partial refunds may be issued for items not in original condition</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">5. Exchanges</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            We currently offer exchanges for size-related issues only. To exchange, initiate a return and
            place a new order for the desired size. If the item is available, we&apos;ll prioritize your exchange.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-luxury-dark mb-3">6. Damaged or Defective Items</h2>
          <p className="text-luxury-text leading-relaxed text-sm">
            If you receive a damaged or defective item, please contact us within 48 hours of delivery with
            photos of the damage. We will arrange a free return pickup and send a replacement or full refund
            at no additional cost.
          </p>
        </section>

        <div className="bg-pastel-lavender/50 p-6 text-center">
          <p className="text-sm text-luxury-dark mb-3">Need help with a return?</p>
          <Link href="/contact" className="btn-luxury inline-block">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
