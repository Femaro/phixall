import Link from 'next/link';

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                For Facility Owners
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
                Streamline Your
                <span className="text-gradient"> Facility Operations</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                Access vetted artisans on-demand, track every job in real-time, and manage your entire facility maintenance from one powerful dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
                >
                  Get Started Free
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-6 py-3.5 text-base font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                >
                  Schedule a Demo
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white/80 p-8 shadow-glow backdrop-blur-sm">
              <div className="space-y-4">
                {[
                  { icon: '🎯', text: 'Request services in under 2 minutes' },
                  { icon: '📍', text: 'Track artisan location in real-time' },
                  { icon: '💳', text: 'Transparent pricing with digital invoices' },
                  { icon: '📊', text: 'Analytics and reporting dashboard' },
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

      {/* Key Features */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Everything You Need to Manage Your Facilities
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Powerful tools designed for modern facility management
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Smart Request Forms',
                description: 'Multi-step forms with photo/video uploads, priority levels, and preferred scheduling.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: 'Instant Matching',
                description: 'Our AI matches you with qualified artisans based on skills, location, availability, and ratings.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                title: 'Live Tracking',
                description: 'Monitor artisan location with real-time GPS, ETA updates, and arrival notifications.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Transparent Pricing',
                description: 'Upfront quotes, itemized invoices, and secure digital payments with full transaction history.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Analytics Dashboard',
                description: 'Track spending, job completion rates, artisan performance, and facility health metrics.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: 'Team Collaboration',
                description: 'Add facility managers, set approval workflows, and manage permissions across your organization.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft transition-all hover:shadow-glow">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="mt-3 text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Trusted Across Industries
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Facilities of all types rely on Phixall for their maintenance needs
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🏢', name: 'Corporate Offices', desc: '24/7 support for commercial buildings' },
              { icon: '🏨', name: 'Hospitality', desc: 'Rapid response for hotels and resorts' },
              { icon: '🏭', name: 'Industrial', desc: 'Specialized maintenance for factories' },
              { icon: '🏫', name: 'Education', desc: 'Campus-wide facility management' },
              { icon: '🏥', name: 'Healthcare', desc: 'Critical maintenance for medical facilities' },
              { icon: '🏬', name: 'Retail', desc: 'Multi-location support for stores' },
              { icon: '🏘️', name: 'Residential', desc: 'Property management for complexes' },
              { icon: '⚡', name: 'Data Centers', desc: 'Mission-critical uptime support' },
            ].map((industry) => (
              <div key={industry.name} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-soft transition-all hover:shadow-glow">
                <div className="text-4xl">{industry.icon}</div>
                <h3 className="mt-4 font-semibold text-neutral-900">{industry.name}</h3>
                <p className="mt-2 text-sm text-neutral-600">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Enterprise-Grade Solutions
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Built for organizations managing multiple facilities
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-soft">
              <h3 className="text-2xl font-bold text-neutral-900">Multi-Location Management</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Unified dashboard for all your facilities',
                  'Custom approval workflows and budget controls',
                  'Centralized billing and consolidated invoicing',
                  'Role-based access and permission management',
                  'Cross-facility analytics and reporting',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-soft">
              <h3 className="text-2xl font-bold text-neutral-900">Dedicated Support</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Dedicated account manager',
                  'Priority response times (SLA guarantees)',
                  'Custom integrations with your systems',
                  'Quarterly business reviews',
                  'White-glove onboarding and training',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Subscriptions */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              Premium Plans Available
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Predictable Pricing with Premium Subscriptions
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Subscribe to a monthly plan and enjoy hassle-free facility maintenance with priority service
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Bronze Tier */}
            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/30 p-8 shadow-soft">
              <div className="text-center">
                <div className="text-5xl">🥉</div>
                <h3 className="mt-4 text-2xl font-bold text-neutral-900">Bronze</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-neutral-900">₦25,000</span>
                  <span className="text-neutral-600">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">3 Services Included</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">2 Service Calls/Month</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">24-48 Hour Response</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">5% Discount on Extras</span>
                </li>
              </ul>
            </div>

            {/* Gold Tier */}
            <div className="relative rounded-2xl border-2 border-brand-600 bg-gradient-to-br from-white to-brand-50/30 p-8 shadow-xl ring-4 ring-brand-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  ⭐ Most Popular
                </span>
              </div>
              <div className="text-center">
                <div className="text-5xl">🥇</div>
                <h3 className="mt-4 text-2xl font-bold text-neutral-900">Gold</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-neutral-900">₦50,000</span>
                  <span className="text-neutral-600">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">6 Services Included</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">5 Service Calls/Month</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">12-24 Hour Response</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">10% Discount on Extras</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">Quarterly Inspections</span>
                </li>
              </ul>
            </div>

            {/* Platinum Tier */}
            <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 p-8 shadow-soft">
              <div className="text-center">
                <div className="text-5xl">💎</div>
                <h3 className="mt-4 text-2xl font-bold text-neutral-900">Platinum</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-neutral-900">₦100,000</span>
                  <span className="text-neutral-600">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">10 Services + Emergency</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700 font-semibold">Unlimited Service Calls</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">2-4 Hour Emergency Response</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">20% Discount on Extras</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-neutral-700">Dedicated Account Manager</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg"
            >
              Compare All Plans
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Seamless Integrations
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Connect Phixall with the tools you already use
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              'Accounting Software',
              'Property Management Systems',
              'Building Automation',
              'Asset Management',
              'CMMS Platforms',
              'Slack & Teams',
              'Calendar Systems',
              'Custom APIs',
            ].map((integration) => (
              <div key={integration} className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-soft">
                <div className="mx-auto h-12 w-12 rounded-lg bg-brand-100" />
                <p className="mt-4 font-medium text-neutral-900">{integration}</p>
              </div>
            ))}
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
            Start with a free account or schedule a personalized demo for your organization.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Start Free Trial
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-100">
            No credit card required • Free for up to 5 requests/month • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  );
}
