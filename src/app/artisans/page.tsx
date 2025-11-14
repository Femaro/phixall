import Link from 'next/link';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'For Artisans - Grow Your Business & Earn More',
  description: 'Join Nigeria\'s fastest-growing network of verified artisans. Get matched with high-quality jobs, build your reputation, earn competitive rates. Perfect for plumbers, electricians, HVAC technicians, and more.',
  keywords: [
    'artisan jobs Nigeria',
    'skilled technician jobs',
    'plumber jobs',
    'electrician jobs',
    'HVAC technician jobs',
    'artisan network',
    'grow artisan business',
    'earn more as artisan',
  ],
  openGraph: {
    title: 'Phixall for Artisans - Grow Your Business',
    description: 'Join Nigeria\'s fastest-growing network of verified artisans. Get matched with quality jobs and earn competitive rates.',
    url: '/artisans',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phixall Artisan Network',
      }
    ],
  },
  alternates: {
    canonical: '/artisans',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'For Artisans', url: '/artisans' },
]);

export default function ArtisansPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                For Skilled Artisans
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
                Grow Your Business on
                <span className="text-gradient"> Phixall</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                Join Nigeria&apos;s fastest-growing network of verified artisans. Get matched with high-quality jobs, build your reputation, and earn more doing what you love.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
                >
                  Join as an Artisan
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-6 py-3.5 text-base font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white/80 p-8 shadow-glow backdrop-blur-sm">
              <div className="space-y-4">
                {[
                  { icon: '💰', text: 'Earn more with transparent pricing' },
                  { icon: '📱', text: 'Instant job alerts on your phone' },
                  { icon: '⭐', text: 'Build your professional reputation' },
                  { icon: '📊', text: 'Track earnings and analytics' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-soft">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="font-medium text-neutral-900">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Why Join Phixall?
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              We are building a platform where skilled artisans thrive
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Higher Earnings',
                description: 'Set your own rates, receive upfront quotes, and keep more of what you earn with our competitive commission structure.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: 'Consistent Work',
                description: 'Get matched with jobs from top facilities in your area. Control your availability and never run out of opportunities.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Build Your Brand',
                description: 'Earn verified badges, collect ratings, showcase your best work, and establish yourself as a top-rated professional.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: 'Fast Payments',
                description: 'Get paid securely and quickly. Track all your earnings in one place and withdraw funds whenever you need.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: 'Skills Development',
                description: 'Access free training resources, earn certifications, and stay updated with the latest industry standards.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: '24/7 Support',
                description: 'Get help whenever you need it. Our dedicated artisan support team is here to ensure your success.',
              },
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft transition-all hover:shadow-glow">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  {benefit.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">{benefit.title}</h3>
                <p className="mt-3 text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Who Can Join?
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              We are looking for skilled professionals across multiple trades
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-soft">
              <h3 className="text-2xl font-bold text-neutral-900">Eligible Trades</h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  '🔧 Plumbers',
                  '⚡ Electricians',
                  '❄️ HVAC Technicians',
                  '🎨 Painters',
                  '🔨 Carpenters',
                  '🚪 Locksmiths',
                  '🏗️ Masons',
                  '🪟 Glaziers',
                  '🏠 Roofers',
                  '🧱 Tilers',
                  '🌿 Landscapers',
                  '🔌 Appliance Repair',
                ].map((trade) => (
                  <div key={trade} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-900">
                    {trade}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-soft">
              <h3 className="text-2xl font-bold text-neutral-900">Basic Requirements</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Valid government-issued ID',
                  'Proof of trade certification or 2+ years of experience',
                  'Clean background check',
                  'Basic smartphone with internet access',
                  'Professional tools and equipment',
                  'Ability to provide references (optional but recommended)',
                ].map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Simple Onboarding Process
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Get verified and start earning in 4 easy steps
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Apply Online',
                description: 'Fill out our simple application form with your trade details and experience.',
              },
              {
                step: '02',
                title: 'Document Verification',
                description: 'Upload your ID, certifications, and references for our team to review.',
              },
              {
                step: '03',
                title: 'Skills Assessment',
                description: 'Complete a brief skills evaluation (remote or in-person based on trade).',
              },
              {
                step: '04',
                title: 'Start Earning',
                description: 'Get approved, set your rates, toggle availability, and receive your first job!',
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-neutral-600">
            <strong>Average approval time: 3-5 business days</strong>
          </p>
        </div>
      </section>

      {/* Earnings */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
                Transparent Earnings & Payouts
              </h2>
              <p className="mt-6 text-lg text-neutral-600">
                Know exactly what you will earn before accepting any job. No hidden fees, no surprises.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'You set your own hourly rates and quote prices',
                  'Phixall takes a 15% service fee (one of the lowest in the industry)',
                  'Weekly direct bank transfers or instant withdrawals',
                  'Real-time earnings tracking and analytics',
                  'Bonus incentives for top-rated artisans',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-glow">
              <h3 className="text-xl font-bold text-neutral-900">Example Monthly Earnings</h3>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Jobs Completed</span>
                    <span className="font-bold text-neutral-900">40</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-neutral-600">Avg Job Value</span>
                    <span className="font-bold text-neutral-900">₦15,000</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-neutral-600">Gross Revenue</span>
                    <span className="font-bold text-neutral-900">₦600,000</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Platform Fee (15%)</span>
                    <span className="text-neutral-500">-₦90,000</span>
                  </div>
                  <div className="mt-4 border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-neutral-900">Your Earnings</span>
                      <span className="text-2xl font-bold text-brand-600">₦510,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-12">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-neutral-900">Your Safety is Our Priority</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
                We have built comprehensive safety features to protect you on every job.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { icon: '🛡️', title: 'Verified Clients', desc: 'All facility owners are identity-verified' },
                { icon: '📍', title: 'Live Location Sharing', desc: 'Optional GPS tracking for added security' },
                { icon: '💬', title: 'In-App Support', desc: '24/7 help with any safety concerns' },
                { icon: '📞', title: 'Emergency Line', desc: 'Direct hotline for urgent situations' },
                { icon: '⚖️', title: 'Dispute Resolution', desc: 'Fair mediation for any issues' },
                { icon: '💰', title: 'Payment Protection', desc: 'Guaranteed payment for completed work' },
              ].map((feature) => (
                <div key={feature.title} className="rounded-xl border border-brand-200 bg-white p-6 text-center">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="mt-4 font-bold text-neutral-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Ready to Join Phixall?
          </h2>
          <p className="mt-6 text-lg text-brand-100">
            Start your application today and get verified in as little as 3-5 business days.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Apply Now
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Have Questions?
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-100">
            Free to join • No upfront fees • Flexible availability
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
