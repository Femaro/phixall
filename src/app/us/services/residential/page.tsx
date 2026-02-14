'use client';

import Link from 'next/link';

export default function ResidentialPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Residential Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Residential Property
              <span className="block text-purple-300">Management Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Professional facility management for multi-family complexes, condominiums, HOA communities, luxury residential buildings, senior living facilities, and student housing across the United States.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Residential Property Services</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Multi-Family Complexes',
                icon: '🏢',
                services: ['Common area maintenance', 'Unit turnover services', 'Pool and spa maintenance', 'Fitness center equipment', 'Parking facility upkeep', 'Landscaping coordination', 'Security system maintenance', 'Tenant work orders']
              },
              {
                title: 'Condominium Associations',
                icon: '🏘️',
                services: ['HOA board support', 'Reserve study planning', 'Building envelope maintenance', 'Shared utility systems', 'Amenity maintenance', 'Compliance documentation', 'Emergency response', 'Capital improvement projects']
              },
              {
                title: 'Luxury Residential',
                icon: '✨',
                services: ['Concierge maintenance', 'High-end finishes care', 'Smart home systems', 'Private amenities', 'Elevator modernization', 'Security and access control', 'Guest services support', 'White-glove service']
              },
              {
                title: 'Senior Living Facilities',
                icon: '🏥',
                services: ['ADA compliance', 'Safety system maintenance', 'Medical equipment support', 'Emergency call systems', 'Mobility aid infrastructure', 'Dining facility maintenance', 'Healthcare system integration', 'Resident safety programs']
              },
              {
                title: 'Student Housing',
                icon: '🎓',
                services: ['High-volume turnover support', 'Dorm facility maintenance', 'Common study areas', 'Laundry facility service', 'Internet/WiFi infrastructure', 'Security systems', 'Bike storage maintenance', 'Move-in/out coordination']
              },
              {
                title: 'Property Management',
                icon: '📋',
                services: ['Preventive maintenance scheduling', 'Vendor coordination', 'Cost tracking and reporting', 'Emergency response coordination', 'Tenant communication', 'Work order management', 'Budget planning', 'Asset management']
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

      <section className="bg-gradient-to-br from-purple-600 to-violet-700 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Get Expert Residential Property Services</h2>
          <p className="mt-6 text-lg text-white/90">
            Request a custom quote for your residential property. Our team specializes in multi-family and HOA facility management.
          </p>
          <div className="mt-10">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-purple-600 transition-all hover:bg-white/90">
              Request Quote
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
