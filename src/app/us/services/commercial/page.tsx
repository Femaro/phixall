'use client';

import Link from 'next/link';

export default function CommercialPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Commercial Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Commercial Facility
              <span className="block text-[#3498db]">Management Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Comprehensive facility management for office buildings, retail spaces, corporate campuses, educational institutions, healthcare facilities, and government buildings at inland commercial sites within authorized Indiana service areas.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Professional Commercial Services</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Our commercial facility management services ensure your business operations run smoothly with minimal downtime. We provide comprehensive maintenance, repairs, and improvements for all types of commercial properties.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  '24/7 emergency service response',
                  'Preventive maintenance programs',
                  'Energy efficiency optimization',
                  'Compliance and safety management',
                  'Tenant satisfaction programs',
                  'Cost-effective solutions'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-neutral-200 bg-neutral-50 p-8">
              <h3 className="text-2xl font-bold text-neutral-900">Service Coverage</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-900">Property Types</h4>
                  <p className="mt-1 text-sm text-neutral-600">Office, Retail, Healthcare, Education, Government</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Response Time</h4>
                  <p className="mt-1 text-sm text-neutral-600">Emergency: &lt; 2 hours | Routine: Same/Next day</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Service Hours</h4>
                  <p className="mt-1 text-sm text-neutral-600">24/7/365 availability</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Geographic coverage</h4>
                  <p className="mt-1 text-sm text-neutral-600">Indiana—contracted on-shore facilities only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Commercial Service Categories</h2>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Office Buildings',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                services: [
                  'HVAC system maintenance',
                  'Elevator and escalator service',
                  'Lighting and electrical systems',
                  'Plumbing and restroom facilities',
                  'Common area maintenance',
                  'Parking facility upkeep',
                  'Security system maintenance',
                  'Building automation systems'
                ]
              },
              {
                title: 'Retail Spaces',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
                services: [
                  'Storefront maintenance',
                  'Climate control systems',
                  'Point-of-sale infrastructure',
                  'Customer area upkeep',
                  'Parking lot maintenance',
                  'Signage and lighting',
                  'Loading dock maintenance',
                  'Emergency system testing'
                ]
              },
              {
                title: 'Corporate Campuses',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                services: [
                  'Multi-building coordination',
                  'Grounds maintenance',
                  'Central plant operations',
                  'Campus-wide utilities',
                  'Cafeteria and kitchen facilities',
                  'Fitness center maintenance',
                  'Conference room systems',
                  'Parking structure care'
                ]
              },
              {
                title: 'Healthcare Facilities',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
                services: [
                  'Critical systems maintenance',
                  'HVAC air quality control',
                  'Medical gas systems',
                  'Emergency power systems',
                  'Water treatment systems',
                  'Sterilization equipment',
                  'Compliance documentation',
                  'Infection control measures'
                ]
              },
              {
                title: 'Educational Institutions',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
                services: [
                  'Classroom maintenance',
                  'Laboratory equipment service',
                  'Athletic facility upkeep',
                  'Dormitory maintenance',
                  'Campus infrastructure',
                  'Food service facilities',
                  'Library systems',
                  'Student safety systems'
                ]
              },
              {
                title: 'Government Buildings',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                services: [
                  'Security system maintenance',
                  'Public area upkeep',
                  'Accessibility compliance',
                  'Energy conservation',
                  'Historical preservation',
                  'Emergency preparedness',
                  'IT infrastructure support',
                  'Records facility maintenance'
                ]
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
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3498db]" fill="currentColor" viewBox="0 0 20 20">
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

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Transform Your Commercial Facility Management</h2>
          <p className="mt-6 text-lg text-white/90">
            Request a custom quote for your commercial property. Our team will assess your needs and provide a comprehensive maintenance solution.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/us/request-quote"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90"
            >
              Request Enterprise Quote
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/us/contact"
              className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
