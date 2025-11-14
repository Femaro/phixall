import Link from 'next/link';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { organizationSchema, generateBreadcrumbSchema } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with Our Team',
  description: 'Have questions about Phixall facility management services? Contact our support team via phone, email, or visit our office. We\'re available 24/7 for emergency support.',
  keywords: [
    'contact Phixall',
    'facility management support',
    'customer service',
    'get help',
    'support contact',
  ],
  openGraph: {
    title: 'Contact Phixall - We\'re Here to Help',
    description: 'Have questions? Reach out to our team. We\'re available 24/7 for emergency support.',
    url: '/contact',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Phixall',
      }
    ],
  },
  alternates: {
    canonical: '/contact',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Contact', url: '/contact' },
]);

export default function ContactPage() {
  return (
    <>
      <StructuredData data={[organizationSchema, breadcrumbSchema]} />
      <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              Get in Touch
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
              Let&apos;s Start a
              <span className="text-gradient"> Conversation</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Have questions about our services? Want to discuss your facility needs? We&apos;re here to help. Reach out through any channel below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Send us a Message</h2>
              <p className="mt-2 text-neutral-600">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
              <form className="mt-8 border border-neutral-200 bg-white p-8 shadow-soft">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-900">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="mt-2 w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-900">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="mt-2 w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900">
                      Phone Number <span className="text-neutral-400">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="mt-2 w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-neutral-900">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="mt-2 w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="services">Services Information</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="billing">Billing Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-neutral-900">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="mt-2 w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
                  >
                    Send Message
                    <svg className="ml-2 inline h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Contact Information</h2>
              <p className="mt-2 text-neutral-600">
                Choose the best way to reach us based on your needs.
              </p>

              <div className="mt-8 space-y-6">
                {/* General Support */}
                <div className="border border-neutral-200 bg-white p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-brand-100 text-2xl">
                      💬
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">General Support</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        For general inquiries, account questions, and platform assistance
                      </p>
                      <div className="mt-3 space-y-1">
                        <a href="mailto:support@phixall.com" className="block text-brand-600 hover:text-brand-700">
                          support@phixall.com
                        </a>
                        <p className="text-sm text-neutral-600">Response time: Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales */}
                <div className="border border-neutral-200 bg-white p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-brand-100 text-2xl">
                      💼
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">Sales & Partnerships</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        Interested in enterprise plans or becoming a partner?
                      </p>
                      <div className="mt-3 space-y-1">
                        <a href="mailto:sales@phixall.com" className="block text-brand-600 hover:text-brand-700">
                          sales@phixall.com
                        </a>
                        <p className="text-sm text-neutral-600">Response time: Within 4 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="border border-neutral-200 bg-white p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-brand-100 text-2xl">
                      📞
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">Phone Support</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        Available 24/7 for urgent matters and emergencies
                      </p>
                      <div className="mt-3 space-y-1">
                        <a href="tel:+234XXXXXXXXX" className="block text-brand-600 hover:text-brand-700">
                          +234 XXX XXX XXXX
                        </a>
                        <p className="text-sm text-neutral-600">Monday - Sunday, 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency */}
                <div className="border-2 border-red-200 bg-red-50 p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-red-600 text-white text-xl">
                      🚨
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">Emergency Hotline</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        For safety emergencies or urgent situations during active jobs
                      </p>
                      <div className="mt-3 space-y-1">
                        <a href="tel:+234XXXXXXXXX" className="block text-lg font-bold text-red-600 hover:text-red-700">
                          +234 XXX XXX XXXX
                        </a>
                        <p className="text-sm text-neutral-600">Available 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Address */}
              <div className="mt-8 border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="font-bold text-neutral-900">Office Address</h3>
                <p className="mt-2 text-neutral-700">
                  Phixall Technical Company Limited
                  <br />
                  Lagos, Nigeria
                </p>
                <p className="mt-4 text-sm text-neutral-600">
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM WAT
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900">Connect With Us</h2>
            <p className="mt-2 text-neutral-600">Follow us on social media for updates and tips</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {[
                { name: 'Twitter', icon: '🐦', href: '#' },
                { name: 'LinkedIn', icon: '💼', href: '#' },
                { name: 'Facebook', icon: '📘', href: '#' },
                { name: 'Instagram', icon: '📷', href: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex items-center gap-2 border border-neutral-300 bg-white px-6 py-3 text-neutral-700 transition-all hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600"
                >
                  <span className="text-xl">{social.icon}</span>
                  <span className="font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-6 text-lg text-brand-100">
            Join Phixall today and experience professional facility management.
          </p>
          <div className="mt-8">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Create Free Account
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
