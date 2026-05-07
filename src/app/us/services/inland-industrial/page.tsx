'use client';

import Link from 'next/link';

export default function InlandIndustrialPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              On-shore &amp; inland facilities
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Land-based industrial
              <span className="block text-[#3498db]">&amp; commercial facilities</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Phixall Facility Management LLC coordinates on-site technicians for inland warehouses, distribution centers, food manufacturing plants, and commercial industrial campuses within our authorized Indiana service areas—no offshore, coastal port, or maritime scopes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Inland facility operations</h2>
              <p className="mt-4 text-lg text-neutral-600">
                We focus on predictable, land-based environments: MEP trades, building envelope upkeep, materials handling adjacency, and commissioning support aligned to OSHA and site-specific programs—similar to how large food and consumer packaged goods producers run distribution and plant networks.
              </p>
              <ul className="mt-8 space-y-3 text-neutral-700">
                {[
                  'On-site technician coordination for industrial and commercial footprints',
                  'Preventive and corrective maintenance on inland logistics and plant assets',
                  'Documentation and turnover packages for capital and sustaining work',
                  'Low-risk domestic operations—Indiana as primary authorized service geography',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-neutral-200 bg-neutral-50 p-8">
              <h3 className="text-2xl font-bold text-neutral-900">Service footprint</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-900">Geography</h4>
                  <p className="mt-1 text-sm text-neutral-600">
                    Program management from Indiana, with field execution limited to contracted, authorized inland sites in Indiana unless otherwise agreed in writing.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Client profile</h4>
                  <p className="mt-1 text-sm text-neutral-600">
                    Industrial and commercial operators—distribution, cold chain, food processing adjacency, and manufacturing support buildings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-gradient-to-br from-[#2c3e50] to-[#1e3a5f] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">Discuss an inland facility program</h2>
          <p className="mt-4 text-white/85">
            Request a scoped quote for land-based warehouse, plant-adjacent, or commercial industrial work in Indiana.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/us/request-quote"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-[#1e3a5f] transition hover:bg-white/90"
            >
              Request quote
            </Link>
            <Link
              href="/us/contact"
              className="inline-flex items-center gap-2 border-2 border-white/50 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              Contact ops
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
