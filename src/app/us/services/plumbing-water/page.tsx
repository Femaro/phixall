'use client';

import Link from 'next/link';

export default function PlumbingWaterPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e40af]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Plumbing Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Plumbing & Water
              <span className="block text-blue-300">Systems Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Industrial and commercial plumbing services, water treatment, wastewater management, and complete water system solutions for facilities of all sizes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Plumbing Service Capabilities</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Commercial Plumbing',
                icon: '🔧',
                services: ['Pipe installation and repair', 'Fixture installation', 'Drain cleaning', 'Water heater service', 'Backflow prevention', 'Grease trap maintenance', 'Sump pump systems', 'Emergency leak repair']
              },
              {
                title: 'Industrial Plumbing',
                icon: '🏭',
                services: ['Process piping', 'High-pressure systems', 'Steam condensate systems', 'Industrial water supply', 'Chemical piping', 'Compressed air piping', 'Vacuum systems', 'Specialty gas piping']
              },
              {
                title: 'Water Treatment',
                icon: '💧',
                services: ['Water filtration systems', 'Water softeners', 'Reverse osmosis systems', 'UV disinfection', 'Chemical treatment', 'Cooling tower treatment', 'Boiler water treatment', 'Legionella prevention']
              },
              {
                title: 'Wastewater Systems',
                icon: '🚰',
                services: ['Wastewater treatment', 'Sewage ejector pumps', 'Lift station maintenance', 'Grinder pump service', 'Septic system service', 'Drainage systems', 'Storm water management', 'EPA compliance']
              },
              {
                title: 'Specialty Systems',
                icon: '⚙️',
                services: ['Medical gas systems', 'Laboratory plumbing', 'Kitchen equipment plumbing', 'Pool and spa systems', 'Irrigation systems', 'Fire protection water supply', 'Rainwater harvesting', 'Gray water systems']
              },
              {
                title: 'Emergency Services',
                icon: '🚨',
                services: ['24/7 emergency response', 'Water main breaks', 'Frozen pipe repair', 'Flood mitigation', 'Emergency shutoffs', 'Leak detection', 'Sewer backups', 'Critical system failures']
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

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Expert Plumbing & Water Solutions</h2>
          <p className="mt-6 text-lg text-white/90">
            From routine maintenance to complex water treatment systems, we handle all your plumbing needs.
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
