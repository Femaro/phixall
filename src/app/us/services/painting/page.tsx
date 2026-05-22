'use client';

import Link from 'next/link';

export default function PaintingServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Warehouse Painting
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Painting Services
              <span className="block text-purple-200">for Warehouse Facilities</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Industrial painting and coating services for warehouse facilities including floor coatings, wall finishes, protective sealants, line marking, and all painting services needed for warehouse operations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Warehouse Painting Service Capabilities</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Floor Coatings',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
                services: ['Epoxy floor coatings', 'Concrete sealing', 'Anti-slip coatings', 'Chemical-resistant floors', 'High-traffic areas', 'Warehouse floor paint', 'Polyurethane coatings', 'Floor restoration']
              },
              {
                title: 'Line Marking & Striping',
                icon: '📏',
                services: ['Safety line marking', 'Forklift lane striping', 'Parking space lines', 'Loading zone marking', 'Pedestrian walkways', 'Hazard zone marking', 'Directional arrows', 'Custom safety markings']
              },
              {
                title: 'Wall & Ceiling Painting',
                icon: '🎨',
                services: ['Interior wall painting', 'High-ceiling painting', 'Steel beam painting', 'Concrete wall coating', 'Warehouse wall prep', 'Texture coating', 'Rust prevention', 'Mold-resistant paint']
              },
              {
                title: 'Protective Coatings',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                services: ['Rust inhibitor coatings', 'Waterproof sealants', 'Moisture barriers', 'Industrial sealers', 'Corrosion protection', 'Weather protection', 'UV protection', 'Protective clear coats']
              },
              {
                title: 'Dock & Exterior Painting',
                icon: '🏭',
                services: ['Loading dock painting', 'Exterior walls', 'Dock door painting', 'Overhead door coating', 'Building facade', 'Metal structure painting', 'Signage areas', 'Parking lot striping']
              },
              {
                title: 'Specialty Services',
                icon: '✨',
                services: ['High-visibility safety colors', 'Color-coded zones', 'Traffic flow markings', 'Exit routes', 'Fire lane marking', 'Equipment identification', 'Custom graphics', 'Reflective coatings']
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
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
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

      <section className="bg-gradient-to-br from-purple-600 to-purple-800 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Professional Warehouse Painting & Coating</h2>
          <p className="mt-6 text-lg text-white/90">
            From durable floor coatings to safety line marking, we provide comprehensive painting services for warehouse facilities.
          </p>
          <div className="mt-10">
            <Link href="/us/contact" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-purple-700 transition-all hover:bg-white/90">
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
