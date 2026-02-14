'use client';

import Link from 'next/link';

export default function OffshoreMarinePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#075985] to-[#0369a1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Marine & Offshore Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Offshore & Marine
              <span className="block text-cyan-300">Facility Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Specialized maintenance and support services for port facilities, marine equipment, offshore platforms, docks, harbors, and maritime operations across coastal regions.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Marine-Grade Facility Management</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Our offshore and marine services are built for the harshest environments. We understand the unique challenges of saltwater exposure, extreme weather, and critical safety requirements in maritime operations.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'USCG and OSHA maritime compliance',
                  'Corrosion-resistant materials & coatings',
                  '24/7 emergency marine response',
                  'Certified marine technicians',
                  'Environmental protection protocols',
                  'Underwater inspection capabilities'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-neutral-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
              <h3 className="text-2xl font-bold text-neutral-900">Coverage Areas</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-900">East Coast</h4>
                  <p className="mt-1 text-sm text-neutral-600">Maine to Florida, including Gulf Coast</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">West Coast</h4>
                  <p className="mt-1 text-sm text-neutral-600">California, Oregon, Washington, Alaska</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Offshore Platforms</h4>
                  <p className="mt-1 text-sm text-neutral-600">Gulf of Mexico, Pacific Coast operations</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Great Lakes</h4>
                  <p className="mt-1 text-sm text-neutral-600">All major ports and maritime facilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Marine Service Capabilities</h2>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Port Facility Maintenance',
                icon: '🚢',
                services: [
                  'Container terminal equipment service',
                  'Crane maintenance and inspection',
                  'Cargo handling equipment repair',
                  'Port lighting systems',
                  'Warehouse and storage maintenance',
                  'Security and access control systems',
                  'Fire suppression and safety systems',
                  'Bulk material handling equipment'
                ]
              },
              {
                title: 'Marine Equipment Services',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a2 2 0 110 4 2 2 0 010-4z" /></svg>,
                services: [
                  'Mooring system maintenance',
                  'Winch and capstan service',
                  'Anchor handling equipment',
                  'Navigation equipment support',
                  'Communication systems',
                  'Marine HVAC systems',
                  'Hydraulic systems maintenance',
                  'Deck machinery service'
                ]
              },
              {
                title: 'Offshore Platform Support',
                icon: '🛢️',
                services: [
                  'Platform structural inspections',
                  'Drilling equipment maintenance',
                  'Production facility services',
                  'Helicopter pad maintenance',
                  'Living quarters systems',
                  'Water treatment systems',
                  'Emergency power systems',
                  'Safety equipment inspection'
                ]
              },
              {
                title: 'Dock & Harbor Maintenance',
                icon: '⛵',
                services: [
                  'Pier and wharf repairs',
                  'Dock piling inspection',
                  'Fendering system maintenance',
                  'Floating dock service',
                  'Marina electrical systems',
                  'Fuel dock maintenance',
                  'Sewage pump-out systems',
                  'Marina lighting and utilities'
                ]
              },
              {
                title: 'Shipyard Services',
                icon: '🏗️',
                services: [
                  'Drydock facility maintenance',
                  'Heavy lifting equipment service',
                  'Welding and fabrication support',
                  'Painting and coating systems',
                  'Compressed air systems',
                  'Industrial power distribution',
                  'Wastewater treatment',
                  'Environmental compliance'
                ]
              },
              {
                title: 'Marine Environmental Systems',
                icon: '🌊',
                services: [
                  'Ballast water treatment systems',
                  'Oil-water separator maintenance',
                  'Spill containment systems',
                  'Wastewater treatment',
                  'Air quality monitoring',
                  'Environmental monitoring equipment',
                  'Discharge compliance systems',
                  'Hazmat storage maintenance'
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

      {/* Specialized Capabilities */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Specialized Marine Capabilities</h2>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Corrosion Control',
                icon: '🛡️',
                description: 'Advanced corrosion prevention, cathodic protection systems, marine-grade coatings, and regular inspection programs.'
              },
              {
                title: 'Underwater Services',
                icon: '🤿',
                description: 'Certified commercial divers for underwater inspections, repairs, hull maintenance, and submerged equipment service.'
              },
              {
                title: 'Storm Response',
                icon: '⛈️',
                description: 'Rapid deployment teams for hurricane preparation, storm damage assessment, and emergency restoration services.'
              },
              {
                title: 'USCG Compliance',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
                description: 'Full compliance support for Coast Guard regulations, documentation, inspection preparation, and audit support.'
              },
              {
                title: 'Marine Electronics',
                icon: '📡',
                description: 'Navigation systems, radar, sonar, communication equipment, AIS, and electronic chart display maintenance.'
              },
              {
                title: 'Offshore Logistics',
                icon: '🚁',
                description: 'Helicopter coordination, supply vessel support, crew change logistics, and emergency evacuation planning.'
              }
            ].map((capability) => (
              <div key={capability.title} className="border-2 border-neutral-200 p-6">
                <div className="mx-auto w-fit">{capability.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-neutral-900">{capability.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Safety & Regulatory Compliance</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Maritime operations demand the highest safety standards. We maintain full compliance with all federal and international regulations.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="border-l-4 border-cyan-600 bg-white p-6">
                  <h3 className="font-bold text-neutral-900">U.S. Coast Guard (USCG)</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    Full compliance with USCG maritime safety regulations, vessel inspections, and facility security plans (FSP).
                  </p>
                </div>
                
                <div className="border-l-4 border-cyan-600 bg-white p-6">
                  <h3 className="font-bold text-neutral-900">OSHA Maritime Standards</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    Adherence to OSHA maritime industry standards including confined space entry, fall protection, and hazmat handling.
                  </p>
                </div>
                
                <div className="border-l-4 border-cyan-600 bg-white p-6">
                  <h3 className="font-bold text-neutral-900">Environmental Protection</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    EPA compliance for discharge regulations, spill prevention (SPCC), and Clean Water Act requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-neutral-200 bg-white p-8">
              <h3 className="text-2xl font-bold text-neutral-900">Certifications & Training</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'TWIC (Transportation Worker Identification Credential)',
                  'Commercial Diving Certifications',
                  'Marine Engineering Licenses',
                  'Confined Space Entry Certified',
                  'HAZWOPER Training',
                  'Crane Operator Certifications',
                  'Maritime First Aid & CPR',
                  'Offshore Survival Training (HUET)',
                  'API 510/570 Pressure Vessel Inspector',
                  'NACE Corrosion Specialist'
                ].map((cert) => (
                  <li key={cert} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-neutral-700">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Response */}
      <section className="bg-[#0c4a6e] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">24/7 Marine Emergency Response</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/90">
              Rapid response teams ready for maritime emergencies, equipment failures, and critical system repairs
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: 'Equipment Failure', time: '< 2 hours' },
              { icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>, title: 'Fire Suppression', time: 'Immediate' },
              { icon: '⚠️', title: 'Structural Damage', time: '< 3 hours' },
              { icon: '🛑', title: 'Environmental Spill', time: 'Immediate' }
            ].map((emergency) => (
              <div key={emergency.title} className="border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                <div>{emergency.icon}</div>
                <h3 className="mt-3 font-bold text-white">{emergency.title}</h3>
                <div className="mt-2 text-sm text-cyan-300">Response: {emergency.time}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a 
              href="tel:1-800-PHIXALL"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-[#0c4a6e] transition-all hover:bg-white/90"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Emergency Hotline: 1-800-PHIXALL
            </a>
            <p className="mt-4 text-sm text-white/70">Available 24/7/365 • All coastal regions</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-neutral-900">Get Expert Marine Facility Services</h2>
          <p className="mt-6 text-lg text-neutral-600">
            Contact our marine specialists for a comprehensive assessment of your port, offshore platform, or maritime facility needs.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/us/request-quote"
              className="inline-flex items-center gap-2 border-2 border-[#0c4a6e] bg-[#0c4a6e] px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-[#075985]"
            >
              Request Marine Services Quote
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/us"
              className="inline-flex items-center gap-2 border-2 border-neutral-300 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-neutral-700 transition-all hover:border-neutral-400 hover:bg-neutral-50"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
