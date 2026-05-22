'use client';

import Link from 'next/link';

export default function SuppliesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#059669] via-[#047857] to-[#065f46]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Warehouse Supplies
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Installation Item Supplies
              <span className="block text-green-200">& Procurement Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Supply and procurement of installation materials, equipment parts, MRO supplies, and facility maintenance items for warehouse operations. We provide everything you need to keep your warehouse running.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Warehouse Supply Categories</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Electrical Installation Supplies',
                icon: '⚡',
                services: ['Circuit breakers & panels', 'Conduit & fittings', 'Wire & cable', 'Lighting fixtures', 'Junction boxes', 'Electrical outlets & switches', 'Cable ties & management', 'Electrical tape & tools']
              },
              {
                title: 'Plumbing Installation Materials',
                icon: '🔧',
                services: ['Pipes & fittings', 'Valves & connectors', 'Drain systems', 'Plumbing fixtures', 'Water heaters', 'Sump pumps', 'Pipe insulation', 'Plumbing tools & accessories']
              },
              {
                title: 'Carpentry & Building Materials',
                icon: '🪚',
                services: ['Lumber & plywood', 'Fasteners & hardware', 'Doors & frames', 'Wood treatments', 'Building adhesives', 'Brackets & supports', 'Shelving materials', 'Finishing supplies']
              },
              {
                title: 'Painting & Coating Supplies',
                icon: '🎨',
                services: ['Industrial paints', 'Epoxy floor coatings', 'Primers & sealers', 'Line marking paint', 'Protective coatings', 'Paint supplies & tools', 'Safety marking materials', 'Surface prep materials']
              },
              {
                title: 'MRO (Maintenance, Repair, Operations)',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                services: ['Hand tools & power tools', 'Safety equipment', 'Cleaning supplies', 'Lubricants & chemicals', 'Fasteners & adhesives', 'Maintenance tools', 'Shop supplies', 'Spare parts inventory']
              },
              {
                title: 'Material Handling Equipment Parts',
                icon: '🚜',
                services: ['Forklift parts', 'Pallet jack components', 'Conveyor parts', 'Lift equipment parts', 'Wheels & casters', 'Hydraulic components', 'Battery supplies', 'Safety accessories']
              },
              {
                title: 'Facility Safety Supplies',
                icon: '⚠️',
                services: ['Safety signs & labels', 'Floor marking tape', 'Barriers & guards', 'First aid supplies', 'Spill containment', 'Personal protective equipment', 'Fire safety equipment', 'Safety supplies']
              },
              {
                title: 'Procurement Services',
                icon: '📦',
                services: ['Vendor management', 'Bulk ordering', 'Just-in-time delivery', 'Inventory management', 'Price negotiation', 'Quality assurance', 'Supply chain coordination', 'Procurement services']
              }
            ].map((category) => (
              <div key={category.title} className="border-2 border-neutral-200 bg-white p-8">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900">{category.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {category.services.map((service) => (
                        <li key={service} className="flex items-start gap-2 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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

      <section className="bg-gradient-to-br from-green-600 to-green-800 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Complete Supply & Procurement Solutions</h2>
          <p className="mt-6 text-lg text-white/90">
            From installation materials to MRO supplies, we provide comprehensive procurement services for your warehouse facility.
          </p>
          <div className="mt-10">
            <Link href="/us/contact" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-green-700 transition-all hover:bg-white/90">
              Contact us
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
