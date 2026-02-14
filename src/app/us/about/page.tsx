'use client';

import Link from 'next/link';

export default function USAboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white lg:text-6xl">
              America's Leading
              <span className="block text-[#3498db]">Facility Management Partner</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90">
              Phixall, powered by Phixall Facility Management LLC, delivers comprehensive facility management solutions to commercial, industrial, and residential properties across all 50 states.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Mission</h2>
              <p className="mt-6 text-lg text-neutral-600">
                To provide enterprise-grade facility management services that maximize uptime, minimize costs, and ensure compliance across every facility we serve. We combine cutting-edge technology with certified professionals to deliver unmatched reliability.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Commitment</h2>
              <p className="mt-6 text-lg text-neutral-600">
                Safety first. Quality always. We're committed to maintaining the highest standards of service, ensuring every facility operates at peak performance while meeting all regulatory requirements.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { icon: '🎯', title: 'Excellence', desc: 'Certified professionals delivering exceptional results' },
              { icon: '🔒', title: 'Reliability', desc: '24/7 availability with guaranteed response times' },
              { icon: '💰', title: 'Value', desc: 'Cost-effective solutions that reduce operational expenses' },
              { icon: '✅', title: 'Compliance', desc: 'Expert guidance on all regulatory requirements' },
              { icon: '🔧', title: 'Expertise', desc: 'Decades of combined facility management experience' },
              { icon: '📊', title: 'Transparency', desc: 'Real-time reporting and complete visibility' }
            ].map((value) => (
              <div key={value.title} className="border-2 border-neutral-200 p-6 text-center">
                <div className="text-5xl">{value.icon}</div>
                <h3 className="mt-4 text-xl font-bold text-neutral-900">{value.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1e3a5f] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: '500+', label: 'Enterprise Clients', sublabel: 'Nationwide' },
              { value: '50,000+', label: 'Jobs Completed', sublabel: 'Annually' },
              { value: '98.5%', label: 'Uptime Rate', sublabel: 'Guaranteed' },
              { value: '50', label: 'States Covered', sublabel: 'Full US Coverage' }
            ].map((stat) => (
              <div key={stat.label} className="border-l-4 border-[#3498db] bg-white/10 p-6 text-center backdrop-blur-sm">
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-sm font-semibold text-white/90">{stat.label}</div>
                <div className="mt-1 text-xs text-white/70">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900">Certifications & Compliance</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-600">
            We maintain the highest industry certifications to ensure quality and compliance.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {[
              { name: 'ISO 9001', desc: 'Quality Management' },
              { name: 'OSHA Certified', desc: 'Safety Standards' },
              { name: 'EPA Compliant', desc: 'Environmental' },
              { name: 'LEED Accredited', desc: 'Green Building' },
              { name: 'NFPA Certified', desc: 'Fire Safety' }
            ].map((cert) => (
              <div key={cert.name} className="border-2 border-neutral-200 bg-white p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="mt-4 font-bold text-neutral-900">{cert.name}</h3>
                <p className="mt-1 text-xs text-neutral-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#2c3e50] to-[#1e3a5f] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Partner With America's Facility Management Leader</h2>
          <p className="mt-6 text-lg text-white/90">
            Join 500+ enterprise clients who trust Phixall for their facility management needs.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90">
              Request Quote
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/us/contact" className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
