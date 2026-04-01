"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    category: "Orders & Payments",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our shop, add items to your cart, and proceed to checkout. You can also order directly via WhatsApp by sending us your cart details at +91 8289012150.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit/debit cards, net banking, digital wallets, and Cash on Delivery (COD) for select locations. All payments are processed securely.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 2 hours of placing them. After that, the order enters processing and cannot be changed. Contact us immediately on WhatsApp if you need to make changes.",
      },
      {
        q: "Is Cash on Delivery (COD) available?",
        a: "Yes, COD is available for orders up to ₹5,000 at select pin codes. A nominal handling fee of ₹49 applies. Check COD availability at checkout.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) and same-day delivery (metro cities, order before 12 PM) are also available.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders above ₹999. Orders below ₹999 have a flat shipping fee of ₹79.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive a tracking link via WhatsApp and email. You can also track orders from your account dashboard.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within India only. International shipping is coming soon — follow us on Instagram @virsastyle for updates!",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return window from the date of delivery. Items must be unworn, unwashed, and with original tags attached. See our full Return Policy for details.",
      },
      {
        q: "How do I return an item?",
        a: "Contact us on WhatsApp (+91 8289012150) or email (hello@virsastyle.com) with your order number. Our team will guide you through the return process within 24 hours.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 7-10 business days after we receive and inspect the returned item. The refund goes back to your original payment method.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes! For size exchanges, initiate a return and place a new order for the desired size. We'll prioritize processing your exchange.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "How do I find my correct size?",
        a: "Check our Size Guide for detailed measurements. If you're between sizes, we recommend going one size up. You can also WhatsApp us for personalized sizing help.",
      },
      {
        q: "Are the product colors accurate?",
        a: "We make every effort to display accurate colors, but slight variations may occur due to screen settings and photography lighting. Product descriptions include specific color details.",
      },
      {
        q: "Do you restock sold-out items?",
        a: "Popular items are restocked regularly. Contact us on WhatsApp to get notified when a specific item is back in stock.",
      },
      {
        q: "Are your products authentic/original?",
        a: "Absolutely! All ਵਿਰਸਾ Style products are 100% authentic and sourced from verified manufacturers. We guarantee premium quality fabrics and craftsmanship.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the navigation bar, enter your details, and you're all set! Having an account lets you track orders, save addresses, and manage wishlists.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Click 'Forgot Password' on the login page. Enter your email, and we'll send you a reset link. If you still face issues, contact us on WhatsApp.",
      },
      {
        q: "What are your business hours?",
        a: "Our customer support is available Monday to Saturday, 10 AM to 8 PM IST. You can reach us on WhatsApp, email, or through our contact form.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-pastel-pink">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-luxury-dark pr-4">{question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-accent transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-luxury-text leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Help Center</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-luxury-text mt-4">
          Can&apos;t find what you&apos;re looking for?{" "}
          <Link href="/contact" className="text-accent hover:text-accent-dark underline">
            Contact us
          </Link>
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map((section) => (
          <section key={section.category}>
            <h2 className="font-serif text-xl text-luxury-dark mb-4">{section.category}</h2>
            <div>
              {section.questions.map((faq) => (
                <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 bg-pastel-cream p-8 text-center">
        <h3 className="font-serif text-xl text-luxury-dark mb-2">Still have questions?</h3>
        <p className="text-sm text-luxury-text mb-6">
          Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/918289012150"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury inline-block"
          >
            WhatsApp Us
          </a>
          <Link href="/contact" className="btn-outline-luxury inline-block">
            Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
