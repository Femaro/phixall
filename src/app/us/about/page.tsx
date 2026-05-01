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
              United States
              <span className="block text-[#3498db]">Facility Management Partner</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90">
              Phixall, powered by Phixall Facility Management LLC, delivers land-based facility management for commercial and industrial properties within Indiana service areas—coordinating on-site technicians for warehouses, distribution centers, and plant-adjacent facilities.
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
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, title: 'Excellence', desc: 'Certified professionals delivering exceptional results' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'Reliability', desc: '24/7 availability with guaranteed response times' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Value', desc: 'Cost-effective solutions that reduce operational expenses' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Compliance', desc: 'Expert guidance on all regulatory requirements' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Expertise', desc: 'Decades of combined facility management experience' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Transparency', desc: 'Real-time reporting and complete visibility' }
            ].map((value) => (
              <div key={value.title} className="border-2 border-neutral-200 p-6 text-center">
                <div className="mx-auto w-fit">{value.icon}</div>
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
              { value: '500+', label: 'Enterprise Clients', sublabel: 'Industrial & commercial' },
              { value: '50,000+', label: 'Jobs Completed', sublabel: 'Annually' },
              { value: '98.5%', label: 'Uptime Rate', sublabel: 'Guaranteed' },
              { value: 'IN', label: 'Primary geography', sublabel: 'Authorized Indiana operations' }
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
          <h2 className="text-4xl font-bold text-white">Partner with a land-based Indiana facility operator</h2>
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
