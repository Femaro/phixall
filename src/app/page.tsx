import Link from 'next/link';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { organizationSchema, servicesSchema } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Professional Facility Management & Maintenance Services in Nigeria',
  description: 'Connect with verified, skilled artisans for plumbing, electrical, HVAC, carpentry, and more. Trusted facility management platform serving 500+ businesses across Nigeria. Get instant quotes and 24/7 support.',
  keywords: [
    'facility management Nigeria',
    'maintenance services Lagos',
    'professional artisans',
    'plumbing services',
    'electrical repairs',
    'HVAC maintenance',
    'building maintenance',
    'skilled technicians',
    'verified artisans',
    'facility services',
  ],
  openGraph: {
    title: 'Phixall - Professional Facility Management Made Simple',
    description: 'Connect with verified artisans for all your facility maintenance needs. Trusted by 500+ businesses across Nigeria.',
    url: '/',
    siteName: 'Phixall',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phixall Facility Management Platform',
      }
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phixall - Professional Facility Management',
    description: 'Connect with verified artisans for all your maintenance needs. Trusted by 500+ businesses.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <StructuredData data={[organizationSchema, ...servicesSchema]} />
      <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Trusted by 500+ facilities
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
                Professional facility management,
                <span className="text-gradient"> simplified</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                Connect with vetted artisans for all your maintenance needs. Request services, track progress in real-time, and manage payments—all from one powerful platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/register" 
                  className="group inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
                >
                  Get Started Free
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/clients" 
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-6 py-3.5 text-base font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  24/7 Support
                </div>
              </div>
            </div>
            <div className="relative lg:h-[500px]">
              <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-blue-50 via-brand-50 to-purple-50 shadow-glow">
                {/* Background Pattern */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Platform Illustration */}
                <div className="relative flex h-full flex-col items-center justify-center gap-6 p-8">
                  {/* Top Row - Service Icons */}
                  <div className="flex gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg ring-2 ring-brand-200">
                      <span className="text-3xl">🔧</span>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg ring-2 ring-brand-200">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg ring-2 ring-brand-200">
                      <span className="text-3xl">❄️</span>
                    </div>
                  </div>

                  {/* Connection Lines */}
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-0.5 bg-gradient-to-b from-brand-400 to-brand-600"></div>
                    <div className="h-12 w-0.5 bg-gradient-to-b from-brand-400 to-brand-600"></div>
                    <div className="h-12 w-0.5 bg-gradient-to-b from-brand-400 to-brand-600"></div>
                  </div>

                  {/* Center - Platform Dashboard Card */}
                  <div className="w-full max-w-md rounded-xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-semibold text-neutral-700">Live Service Request</span>
                      </div>
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">Active</span>
                    </div>
                    
                    <div className="mb-4 rounded-lg bg-gradient-to-br from-brand-50 to-purple-50 p-4">
                      <h4 className="mb-2 text-lg font-bold text-neutral-900">HVAC Repair Request</h4>
                      <div className="mb-3 flex items-center gap-2 text-sm text-neutral-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Victoria Island, Lagos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Scheduled: Today, 2:00 PM</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg text-white font-semibold">
                          JA
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">John Adebayo</p>
                          <div className="flex items-center gap-1 text-xs text-neutral-600">
                            <span className="text-yellow-500">★★★★★</span>
                            <span>4.9 (156)</span>
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">En Route</span>
                    </div>
                  </div>

                  {/* Bottom Row - Status Indicators */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-brand-600">500+</div>
                      <div className="text-xs text-neutral-600">Active Artisans</div>
                    </div>
                    <div className="h-10 w-px bg-neutral-300"></div>
                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-brand-600">10K+</div>
                      <div className="text-xs text-neutral-600">Jobs Completed</div>
                    </div>
                    <div className="h-10 w-px bg-neutral-300"></div>
                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-brand-600">98%</div>
                      <div className="text-xs text-neutral-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              How Phixall Works
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Three simple steps to get professional maintenance done
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Request Service',
                description: 'Describe your maintenance need, upload photos, and select your preferred time window.',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'Our system connects you with verified artisans nearby. Review profiles, ratings, and accept quotes.',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Track & Pay',
                description: 'Monitor artisan location in real-time, review work upon completion, and pay securely online.',
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft transition-all hover:shadow-glow">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    {item.icon}
                  </div>
                  <div className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-600">
                    Step {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Popular Services
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              From routine maintenance to emergency repairs
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🔧', name: 'Plumbing & Leak Repair', desc: 'Pipes, faucets, drainage, water heaters' },
              { icon: '⚡', name: 'Electrical & Lighting', desc: 'Wiring, outlets, fixtures, circuit breakers' },
              { icon: '❄️', name: 'HVAC & Ventilation', desc: 'AC units, heating, air quality systems' },
              { icon: '🔨', name: 'Appliance Installation', desc: 'Washers, dryers, ovens, dishwashers' },
              { icon: '🎨', name: 'Painting & Drywall', desc: 'Interior/exterior painting, patching, finishing' },
              { icon: '🚪', name: 'Carpentry & Doors', desc: 'Door repair, frames, cabinets, trim work' },
            ].map((service) => (
              <div key={service.name} className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all hover:border-brand-200 hover:shadow-glow">
                <div className="text-4xl">{service.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">{service.name}</h3>
                <p className="mt-2 text-sm text-neutral-600">{service.desc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                  Learn more
                  <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phixall Services Showcase */}
      <section className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-brand-50 to-brand-100 shadow-glow">
                <div className="relative h-full w-full">
                  {/* Decorative Background Pattern */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  
                  {/* Main Visual Content */}
                  <div className="relative flex h-full flex-col items-center justify-center p-8">
                    <div className="mb-8 flex gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg">
                        <span className="text-3xl">🔧</span>
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg">
                        <span className="text-3xl">⚡</span>
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg">
                        <span className="text-3xl">🎨</span>
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md rounded-xl border border-white/50 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-neutral-600">Service Request</span>
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Active</span>
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-neutral-900">HVAC Maintenance</h4>
                      <p className="mb-4 text-sm text-neutral-600">Scheduled for today, 2:00 PM</p>
                      <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Artisan" className="h-10 w-10 rounded-full border-2 border-brand-200" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-neutral-900">John Adebayo</p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-yellow-500">★★★★★</span>
                            <span className="text-xs text-neutral-500">4.9 (156)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Service Features Card */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Comprehensive Services
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
                Everything Your Facility Needs
              </h2>
              
              <p className="mt-4 text-lg text-neutral-600">
                From emergency repairs to routine maintenance, Phixall connects you with skilled professionals for every facility need.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: '🔧',
                    title: 'On-Demand Services',
                    desc: 'Access verified artisans 24/7 for immediate assistance'
                  },
                  {
                    icon: '📍',
                    title: 'Real-Time Tracking',
                    desc: 'Monitor service progress and artisan location live'
                  },
                  {
                    icon: '💳',
                    title: 'Secure Payments',
                    desc: 'Transparent pricing with secure online transactions'
                  },
                  {
                    icon: '⭐',
                    title: 'Quality Guaranteed',
                    desc: '100% satisfaction guarantee on all completed work'
                  }
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-soft transition-all hover:shadow-glow">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
                      <p className="mt-1 text-sm text-neutral-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link 
                  href="/services" 
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
                >
                  View All Services
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Subscriptions */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
                <span className="text-base">💎</span>
                Premium Plans
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
                Predictable Pricing with Monthly Subscriptions
              </h2>
              
              <p className="mt-4 text-lg text-neutral-600">
                Say goodbye to surprise maintenance costs. Our subscription plans offer comprehensive facility services with priority support and exclusive discounts.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                    🥉
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Bronze Tier</h3>
                    <p className="mt-1 text-neutral-600">Perfect for small facilities. Get essential maintenance services with standard response times and reliable support for your basic facility needs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                    🥇
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-neutral-900">Gold Tier</h3>
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">Most Popular</span>
                    </div>
                    <p className="mt-1 text-neutral-600">Ideal for growing businesses. Access more services with priority response times, quarterly inspections, and enhanced support for your expanding operations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                    💎
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Platinum Tier</h3>
                    <p className="mt-1 text-neutral-600">Enterprise solution for large facilities. Unlimited service calls, 24/7 emergency response, dedicated account manager, and comprehensive facility management support.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link 
                  href="/subscription" 
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
                >
                  View All Plans
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/clients" 
                  className="inline-flex items-center gap-2 text-base font-medium text-neutral-700 transition-colors hover:text-brand-600"
                >
                  Learn more about subscriptions
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right - Visual Card */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-brand-50 via-purple-50 to-amber-50 shadow-glow">
                <div className="relative h-full w-full">
                  {/* Decorative Background Pattern */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
                  
                  {/* Main Visual Content */}
                  <div className="relative flex h-full flex-col items-center justify-center p-8">
                    {/* Top: Tier Icons */}
                    <div className="mb-8 flex gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-amber-300 bg-white shadow-xl">
                        <span className="text-4xl">🥉</span>
                      </div>
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-brand-600 bg-white shadow-xl ring-4 ring-brand-100">
                        <span className="text-4xl">🥇</span>
                      </div>
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-purple-300 bg-white shadow-xl">
                        <span className="text-4xl">💎</span>
                      </div>
                    </div>
                    
                    {/* Center: Feature Card */}
                    <div className="w-full max-w-md rounded-xl border border-white/50 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-xl text-white">💎</span>
                        <div>
                          <h4 className="font-bold text-neutral-900">Premium Subscription</h4>
                          <p className="text-xs text-neutral-600">Gold Tier • Active</p>
                        </div>
                      </div>
                      
                      <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-neutral-50 p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-600">6</div>
                          <div className="text-xs text-neutral-600">Services</div>
                        </div>
                        <div className="text-center border-x border-neutral-200">
                          <div className="text-2xl font-bold text-brand-600">5</div>
                          <div className="text-xs text-neutral-600">Calls/mo</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-600">10%</div>
                          <div className="text-xs text-neutral-600">Discount</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Priority Response (12-24hrs)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Quarterly Facility Inspections</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Access to Premium Artisans</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Trusted by Facilities Nationwide
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Hear from clients and artisans using Phixall every day
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote: 'Phixall transformed our maintenance workflow. Real-time tracking and vetted professionals mean we can focus on our core business.',
                author: 'Sarah Okafor',
                role: 'Facility Manager, Retail Chain',
                rating: 5,
              },
              {
                quote: 'Crystal-clear quotes, fast response times, and excellent communication. This platform is a game-changer for property management.',
                author: 'Emeka Adekunle',
                role: 'Property Owner',
                rating: 5,
              },
              {
                quote: 'Reliable artisans, transparent pricing, and on-time delivery every single time. Highly recommend for any facility needs.',
                author: 'Chioma Nwosu',
                role: 'Operations Lead',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg key={j} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-neutral-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6 border-t border-neutral-200 pt-6">
                  <p className="font-semibold text-neutral-900">{testimonial.author}</p>
                  <p className="mt-1 text-sm text-neutral-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Everything you need to know about Phixall
            </p>
          </div>
          <div className="mt-16 space-y-4">
            {[
              {
                q: 'How quickly can I book a service?',
                a: 'Most service requests are confirmed within 2-4 hours. We offer same-day and emergency options in all supported areas, with average artisan arrival times of 45-90 minutes.',
              },
              {
                q: 'Are artisans vetted and insured?',
                a: 'Yes. Every artisan undergoes identity verification, skills assessment, and background checks. We maintain ongoing performance reviews and require valid trade certifications.',
              },
              {
                q: 'Do you support corporate and enterprise facilities?',
                a: 'Absolutely. Our corporate plan includes multi-location dashboards, approval workflows, centralized billing, detailed reporting, and dedicated account managers.',
              },
              {
                q: 'What payment methods are supported?',
                a: 'We accept all major debit and credit cards via secure checkout. Invoices and digital receipts are automatically generated. Corporate clients can also set up monthly billing.',
              },
              {
                q: 'What is your coverage area?',
                a: 'We currently operate in Lagos, Abuja, Port Harcourt, Kano, Ibadan, and Abeokuta, with expansion plans for additional cities. Contact us to confirm service availability in your area.',
              },
              {
                q: 'What if I\'m not satisfied with the work?',
                a: 'We offer a 100% satisfaction guarantee. If you\'re not happy with the completed work, we\'ll send another artisan at no additional charge or provide a full refund.',
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-neutral-900">
                  {faq.q}
                  <svg className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-neutral-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Download */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Available on Mobile
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
                Take Phixall with You
                <span className="text-gradient"> Anywhere</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                Download our mobile app for iOS and Android to manage your facility services on the go. Request services, track jobs in real-time, and communicate with Phixers—all from your smartphone.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://apps.apple.com/app/phixall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border-2 border-neutral-300 bg-white px-6 py-4 shadow-soft transition-all hover:border-brand-300 hover:shadow-glow"
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-neutral-500">Download on the</div>
                    <div className="text-lg font-semibold text-neutral-900">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.phixall.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border-2 border-neutral-300 bg-white px-6 py-4 shadow-soft transition-all hover:border-brand-300 hover:shadow-glow"
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L6.05,2.66L14.54,11.15L20.16,10.81M17.3,12L6.05,2.66L14.54,11.15L17.3,12Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-neutral-500">Get it on</div>
                    <div className="text-lg font-semibold text-neutral-900">Google Play</div>
                  </div>
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Real-time job tracking
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Push notifications
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Offline access
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative mx-auto max-w-sm">
                <div className="aspect-[9/19] overflow-hidden rounded-[2.5rem] border-8 border-neutral-900 bg-neutral-900 shadow-2xl">
                  <div className="h-full w-full bg-gradient-to-br from-brand-50 to-brand-100 p-8">
                    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
                        <span className="text-4xl">🔧</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">Phixall</h3>
                        <p className="mt-1 text-sm text-neutral-600">Facility Management</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-32 rounded-full bg-neutral-200"></div>
                        <div className="h-2 w-24 rounded-full bg-neutral-200"></div>
                        <div className="h-2 w-28 rounded-full bg-neutral-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-200/30 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-200/30 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Ready to Transform Your Facility Management?
          </h2>
          <p className="mt-6 text-lg text-brand-100">
            Join hundreds of facilities already using Phixall. Create your free account and request your first service in minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Get Started Free
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Contact Sales
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-100">
            No credit card required • Free forever for basic users • Cancel anytime
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
