'use client';

import Link from 'next/link';

export default function ElectricalServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Warehouse Electrical
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Electrical Services
              <span className="block text-amber-200">for Warehouse Facilities</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Complete electrical installation and maintenance for warehouse facilities including power distribution, lighting systems, backup power solutions, and all electrical installations needed for warehouse operations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Warehouse Electrical Service Capabilities</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Power Distribution',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                services: ['Main service panels', 'Switchgear installation', 'Circuit breaker service', 'Power factor correction', 'Load balancing', 'Transformer maintenance', 'Three-phase power systems', 'High-voltage installations']
              },
              {
                title: 'Warehouse Lighting Systems',
                icon: '💡',
                services: ['High-bay LED lighting', 'Motion sensor systems', 'Safety lighting', 'Exit sign installation', 'Loading dock lighting', 'Security lighting', 'Energy-efficient upgrades', 'Smart lighting controls']
              },
              {
                title: 'Backup Power Systems',
                icon: '🔋',
                services: ['Generator installation', 'UPS systems', 'Transfer switch installation', 'Battery backup systems', 'Power testing', 'Generator load testing', 'Fuel system maintenance', 'Automatic failover systems']
              },
              {
                title: 'Material Handling Equipment',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
                services: ['Forklift charging stations', 'Conveyor electrical systems', 'Crane power systems', 'Dock leveler electrical', 'Electric pallet jack charging', 'Material handling controls', 'Automated system power', 'Equipment electrical service']
              },
              {
                title: 'Safety & Compliance',
                icon: '⚠️',
                services: ['Electrical code compliance', 'Arc flash labeling', 'Safety compliance', 'Ground fault protection', 'Safety audits', 'Infrared inspections', 'Documentation', 'Lighting testing']
              },
              {
                title: 'Installation Items',
                icon: '🔧',
                services: ['Electrical panels', 'Conduit and wiring', 'Junction boxes', 'Lighting fixtures', 'Breakers and fuses', 'Electrical outlets', 'Cable management', 'Electrical hardware']
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
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
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

      <section className="bg-gradient-to-br from-amber-600 to-orange-700 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Power Your Warehouse Operations</h2>
          <p className="mt-6 text-lg text-white/90">
            From routine electrical maintenance to complete installations, we keep your warehouse operations running safely and efficiently.
          </p>
          <div className="mt-10">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-amber-700 transition-all hover:bg-white/90">
              Request Electrical Quote
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
