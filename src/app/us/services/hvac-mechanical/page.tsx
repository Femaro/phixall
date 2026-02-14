'use client';

import Link from 'next/link';

export default function HVACMechanicalPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0891b2] via-[#0e7490] to-[#155e75]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              HVAC Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              HVAC & Mechanical
              <span className="block text-cyan-300">Systems Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Commercial and industrial HVAC installation, maintenance, repair, optimization, and energy management services. From rooftop units to central plants and industrial climate control systems.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">HVAC Service Capabilities</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Commercial HVAC Systems',
                icon: '🏢',
                services: ['Rooftop unit (RTU) service', 'Split system maintenance', 'Variable refrigerant flow (VRF)', 'Package unit service', 'Heat pump systems', 'Ductless mini-splits', 'Ventilation systems', 'Air quality management']
              },
              {
                title: 'Industrial Climate Control',
                icon: '🏭',
                services: ['Process cooling systems', 'Large-scale chillers', 'Boiler systems', 'Steam systems', 'Compressed air cooling', 'Industrial ventilation', 'Dust collection systems', 'Clean room HVAC']
              },
              {
                title: 'Central Plant Operations',
                icon: '⚙️',
                services: ['Chiller plant management', 'Boiler room operations', 'Cooling tower maintenance', 'Pump station service', 'Building automation (BAS)', 'Energy management systems', 'District heating/cooling', 'Thermal storage systems']
              },
              {
                title: 'Energy Management',
                icon: '💡',
                services: ['Energy audits', 'System optimization', 'Smart controls installation', 'Variable speed drives (VSD)', 'Heat recovery systems', 'Demand response programs', 'Energy monitoring', 'Cost reduction analysis']
              },
              {
                title: 'Preventive Maintenance',
                icon: '📋',
                services: ['Filter replacement programs', 'Belt and bearing inspection', 'Refrigerant leak detection', 'Coil cleaning', 'Duct cleaning', 'Control calibration', 'Performance testing', 'Seasonal tune-ups']
              },
              {
                title: 'Emergency Services',
                icon: '🚨',
                services: ['24/7 emergency response', 'System failure diagnosis', 'Refrigerant recovery', 'Emergency repairs', 'Temporary climate solutions', 'After-hours service', 'Holiday coverage', 'Critical system priority']
              }
            ].map((category) => (
              <div key={category.title} className="border-2 border-neutral-200 bg-white p-8">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900">{category.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {category.services.map((service) => (
                        <li key={service} className="flex items-start gap-2 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
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

      <section className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Optimize Your HVAC Systems</h2>
          <p className="mt-6 text-lg text-white/90">
            Reduce energy costs, improve comfort, and extend equipment life with our comprehensive HVAC services.
          </p>
          <div className="mt-10">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-cyan-700 transition-all hover:bg-white/90">
              Request HVAC Quote
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
