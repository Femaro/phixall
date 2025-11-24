import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Our Mission & What Makes a Phixer',
  description: "Learn about Phixall's mission to revolutionize facility management in Africa. Discover who our Phixers are - verified, skilled professionals transforming the maintenance industry.",
  keywords: [
    'about Phixall',
    'facility management company',
    'Phixer network Nigeria',
    'who is a Phixer',
    'company mission',
    'maintenance platform',
  ],
  openGraph: {
    title: 'About Phixall - Revolutionizing Facility Management',
    description: "Building Africa's leading platform for on-demand facility maintenance. Meet our team and learn our story.",
    url: '/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phixall - Meet Our Phixers',
      }
    ],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              About Us
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
              Revolutionizing Facility
              <span className="text-gradient"> Management</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              We&apos;re building Africa&apos;s leading platform for on-demand facility maintenance, connecting property owners with verified skilled Artisans called Phixall's Phixers.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-neutral-600">
                <p>
                  Phixall was founded in 2021 with a simple mission: make professional facility maintenance accessible, transparent, and reliable for everyone.
                </p>
                <p>
                  We saw firsthand how difficult it was for facility owners to find trustworthy artisans, get fair quotes, and track work progress. At the same time, skilled tradespeople struggled to find consistent work and build their professional reputation.
                </p>
                <p>
                  Today, Phixall serves over 500 facilities across Nigeria, completing more than 10,000 jobs annually. Our platform has become the trusted bridge between property owners seeking quality maintenance and artisans building thriving careers.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-brand-50 to-brand-100 p-12 shadow-glow">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: '2021', label: 'Founded' },
                  { value: '10K+', label: 'Jobs Completed' },
                  { value: '500+', label: 'Active Facilities' },
                  { value: '6', label: 'Cities' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-bold text-brand-700">{stat.value}</div>
                    <div className="mt-2 text-sm font-medium text-neutral-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-soft">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-neutral-900">Our Mission</h3>
              <p className="mt-4 text-neutral-600">
                To empower facilities and Phixers across Africa with technology that makes maintenance simple, transparent, and efficient. We&apos;re committed to building a platform that creates economic opportunities while delivering world-class service.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-soft">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-neutral-900">Our Vision</h3>
              <p className="mt-4 text-neutral-600">
                To become the leading facility management platform across Africa, known for connecting world-class Phixers with the facilities that need them. We envision a future where every property owner has instant access to reliable maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🔒',
                title: 'Trust & Transparency',
                description: 'Every interaction on our platform is built on verified identities, clear pricing, and honest communication.',
              },
              {
                icon: '⚡',
                title: 'Speed & Reliability',
                description: 'We obsess over response times, uptime, and delivering on our promises—every single time.',
              },
              {
                icon: '🎯',
                title: 'Quality First',
                description: 'From Phixer vetting to customer support, we never compromise on the quality of service.',
              },
              {
                icon: '🤝',
                title: 'Community Focus',
                description: 'We are building a supportive ecosystem where both clients and Phixers can thrive together.',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                description: 'We leverage cutting-edge technology to solve real problems and create seamless experiences.',
              },
              {
                icon: '💚',
                title: 'Sustainability',
                description: 'We promote responsible practices and long-term thinking in every aspect of facility management.',
              },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft transition-all hover:shadow-glow">
                <div className="text-5xl">{value.icon}</div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">{value.title}</h3>
                <p className="mt-3 text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is a Phixer */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Who is a Phixer?
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              The skilled professionals transforming facility management across Africa
            </p>
          </div>
          
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft lg:p-12">
            <p className="text-lg leading-relaxed text-neutral-700 text-center">
              A <span className="font-bold text-brand-600">Phixer</span> is more than just a skilled tradesperson. They are verified, professional service providers who have been thoroughly vetted through our comprehensive onboarding process. Every Phixer on our platform represents excellence, reliability, and expertise in their craft.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '✅',
                title: 'Verified Professionals',
                description: 'All Phixers undergo identity verification, background checks, and skills assessments before joining our platform.',
              },
              {
                icon: '🎓',
                title: 'Certified & Trained',
                description: 'Phixers complete our specialized training modules covering safety protocols, customer service, and industry best practices.',
              },
              {
                icon: '⭐',
                title: 'Quality Guaranteed',
                description: 'Every job is rated by clients, ensuring Phixers maintain high standards and deliver exceptional service.',
              },
              {
                icon: '🛠️',
                title: 'Multi-Skilled Experts',
                description: 'From plumbing and electrical to HVAC and carpentry, our Phixers specialize in diverse facility maintenance trades.',
              },
              {
                icon: '📱',
                title: 'Tech-Enabled',
                description: 'Phixers use our platform for job management, real-time tracking, and seamless communication with clients.',
              },
              {
                icon: '💼',
                title: 'Professional Growth',
                description: 'We support Phixers with steady work opportunities, fair compensation, and tools to build their professional reputation.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft transition-all hover:shadow-glow">
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="mt-3 text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-purple-50 p-8 shadow-glow lg:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neutral-900">Become a Phixer</h3>
              <p className="mt-4 text-lg text-neutral-600">
                Join our growing network of skilled professionals and access consistent work, competitive pay, and professional development opportunities.
              </p>
              <Link 
                href="/register/phixer" 
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-700 hover:shadow-xl"
              >
                Apply to Become a Phixer
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Join Us on Our Mission
          </h2>
          <p className="mt-6 text-lg text-brand-100">
            Whether you&apos;re a facility owner or a skilled Phixer, there&apos;s a place for you on Phixall.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Get Started
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
