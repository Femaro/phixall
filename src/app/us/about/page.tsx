'use client';

import Link from 'next/link';
import TrustComplianceBadges from '@/components/us/TrustComplianceBadges';

export default function USAboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white lg:text-6xl">
              Indiana
              <span className="block text-[#3498db]">Facility Support Partner</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90">
              Phixall Facility Management LLC is a small, Indiana-based facility support company serving warehouses, distribution centers, and commercial facilities. Services are available only within Indiana.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Mission</h2>
              <p className="mt-6 text-lg text-neutral-600">
                To provide reliable, professional facility support that helps Indiana commercial and warehouse sites stay organized and operational—with consistency and care.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Our Commitment</h2>
              <p className="mt-6 text-lg text-neutral-600">
                Safety-minded operations. Quality service. We maintain clear standards for every facility support activity and communicate openly with site management throughout.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, title: 'Excellence', desc: 'Professional support delivered with attention to detail' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'Reliability', desc: 'Dependable support during business hours' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Value', desc: 'Cost-effective facility support for growing operations' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Compliance', desc: 'Clear scope boundaries and documented procedures' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Experience', desc: 'Our leadership brings years of experience supporting facility operations' },
              { icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Transparency', desc: 'Clear communication and straightforward reporting' }
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

      <TrustComplianceBadges />

      <section className="bg-gradient-to-br from-[#2c3e50] to-[#1e3a5f] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">
            Work with an Indiana-based facility support team
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Share your sites and priorities—we align facility support services within Indiana so your operations stay covered.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/us/contact" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90">
              Reach us now
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/us/services" className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10">
              View services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
