'use client';

import Link from 'next/link';

export default function CarpentryServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#92400e] via-[#78350f] to-[#451a03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Warehouse Carpentry
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Carpentry Services
              <span className="block text-amber-200">for Warehouse Facilities</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Professional carpentry services for warehouse structures including shelving installation, loading dock repairs, custom woodwork, structural repairs, and all carpentry work needed for warehouse operations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Warehouse Carpentry Service Capabilities</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Shelving & Racking Support',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
                services: ['Wooden shelving installation', 'Pallet rack supports', 'Shelf backing installation', 'Custom shelving systems', 'Rack decking', 'Wood dividers', 'Storage platform construction', 'Shelving repairs']
              },
              {
                title: 'Loading Dock Services',
                icon: '🚚',
                services: ['Dock door frames', 'Dock seal repairs', 'Dock bumper installation', 'Wood dock boards', 'Dock plate support', 'Loading bay woodwork', 'Dock shelters', 'Dock maintenance']
              },
              {
                title: 'Structural Repairs',
                icon: '🔨',
                services: ['Floor joist repairs', 'Beam reinforcement', 'Stud wall framing', 'Support beam installation', 'Structural bracing', 'Truss repairs', 'Ceiling repairs', 'Foundation support']
              },
              {
                title: 'Doors & Access Points',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
                services: ['Door frame installation', 'Man door repairs', 'Threshold installation', 'Door hardware mounting', 'Roll-up door frames', 'Access door installation', 'Exit doors', 'Door weatherstripping']
              },
              {
                title: 'Office & Break Room Construction',
                icon: '🏢',
                services: ['Mezzanine office framing', 'Break room construction', 'Interior partitions', 'Wall framing', 'Counter installation', 'Cabinet mounting', 'Desk installation', 'Storage closets']
              },
              {
                title: 'Custom Woodwork',
                icon: '⚒️',
                services: ['Custom workbenches', 'Tool storage solutions', 'Parts bins and organizers', 'Shipping tables', 'Packing stations', 'Custom crating', 'Signage backing', 'Special projects']
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
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
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

      <section className="bg-gradient-to-br from-amber-900 to-yellow-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Professional Warehouse Carpentry</h2>
          <p className="mt-6 text-lg text-white/90">
            From loading dock repairs to custom shelving installations, we deliver quality carpentry solutions for your warehouse.
          </p>
          <div className="mt-10">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-amber-900 transition-all hover:bg-white/90">
              Request Carpentry Quote
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
