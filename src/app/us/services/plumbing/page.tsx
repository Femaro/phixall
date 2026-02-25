'use client';

import Link from 'next/link';

export default function PlumbingServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Warehouse Plumbing
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Plumbing Services
              <span className="block text-blue-200">for Warehouse Facilities</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Industrial plumbing solutions for warehouse facilities including pipe systems, water distribution, drainage, wastewater management, and all plumbing installations needed for warehouse operations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Warehouse Plumbing Service Capabilities</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Industrial Plumbing Systems',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
                services: ['Large-bore piping', 'Process water systems', 'Industrial water supply', 'High-pressure systems', 'Water distribution', 'Boiler systems', 'Cooling water systems', 'Industrial fixtures']
              },
              {
                title: 'Drainage & Wastewater',
                icon: '🚰',
                services: ['Floor drains', 'Trench drains', 'Storm water systems', 'Sump pump systems', 'Wastewater management', 'Grease trap service', 'Sewage ejector pumps', 'Drainage maintenance']
              },
              {
                title: 'Pipe Systems Installation',
                icon: '🔧',
                services: ['PVC pipe systems', 'Copper piping', 'Steel pipe installation', 'Cast iron drainage', 'PEX systems', 'Pipe insulation', 'Pipe hangers and supports', 'Pipe repair and replacement']
              },
              {
                title: 'Facility Restrooms & Break Rooms',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                services: ['Restroom plumbing', 'Water fountains', 'Break room sinks', 'Ice machine connections', 'Commercial toilets', 'Sensor faucets', 'Water heaters', 'Fixture repairs']
              },
              {
                title: 'Fire Protection Systems',
                icon: '🔥',
                services: ['Sprinkler system plumbing', 'Fire suppression lines', 'Backflow preventers', 'Fire pump connections', 'Standpipe systems', 'Hydrant connections', 'Protection systems', 'System testing']
              },
              {
                title: 'Service & Repairs',
                icon: '⚠️',
                services: ['Leak detection', 'Repair services', 'Maintenance service', 'Burst pipe repair', 'Pipe service', 'Drain clearing', 'Water shutoff', 'Damage prevention']
              }
            ].map((category) => (
              <div key={category.title} className="border-2 border-neutral-200 bg-white p-8">
                <div className="flex items-start gap-4">
                  <div>{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900">{category.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {category.services.map((service) => (
                        <li key={service} className="flex items-start gap-2 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Expert Warehouse Plumbing Solutions</h2>
          <p className="mt-6 text-lg text-white/90">
            From industrial pipe systems to repairs, we provide comprehensive plumbing services for warehouse operations.
          </p>
          <div className="mt-10">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-blue-700 transition-all hover:bg-white/90">
              Request Plumbing Quote
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
