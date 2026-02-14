'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function USCorporatePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Corporate Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2c3e50] to-[#34495e]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 500+ Enterprise Clients
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
                Enterprise Facility Management
                <span className="block text-[#3498db]">Solutions for America</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/90">
                Comprehensive facility management services for commercial, industrial, and residential properties. From warehouses to offshore facilities, we deliver excellence across every sector.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
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
                  href="/us/services" 
                  className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
                >
                  View All Services
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="mt-1 text-sm text-white/80">Emergency Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">98.5%</div>
                  <div className="mt-1 text-sm text-white/80">Uptime Guaranteed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="mt-1 text-sm text-white/80">States Covered</div>
                </div>
              </div>
            </div>

            {/* Corporate Image Placeholder */}
            <div className="relative h-[500px] border border-white/20 bg-white/5 backdrop-blur-sm">
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-white/60">
                  <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="mt-4 text-sm">Corporate Facility Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Banner */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-neutral-600">Certified & Compliant:</div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {['ISO 9001', 'OSHA Certified', 'EPA Compliant', 'LEED Accredited', 'NFPA Certified'].map((cert) => (
                <div key={cert} className="flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2">
                  <svg className="h-5 w-5 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-neutral-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900">Comprehensive Facility Management Services</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
              End-to-end solutions for every facility type, backed by certified professionals and 24/7 support
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Commercial Facility Management',
                icon: '🏢',
                description: 'Complete management solutions for office buildings, retail spaces, corporate campuses, and educational institutions.',
                features: ['Office Buildings', 'Retail Spaces', 'Corporate Campuses', 'Government Facilities'],
                link: '/us/services/commercial'
              },
              {
                title: 'Warehouse & Industrial Services',
                icon: '🏭',
                description: 'Specialized maintenance for warehouses, distribution centers, manufacturing facilities, and logistics operations.',
                features: ['Warehouse Maintenance', 'Distribution Centers', 'Cold Storage', 'Manufacturing Support'],
                link: '/us/services/warehouse-industrial'
              },
              {
                title: 'Residential Property Management',
                icon: '🏘️',
                description: 'Professional services for multi-family complexes, condominiums, HOAs, and luxury residential buildings.',
                features: ['Multi-Family Complexes', 'Condominiums', 'HOA Communities', 'Senior Living'],
                link: '/us/services/residential'
              },
              {
                title: 'Offshore & Marine Services',
                icon: '⚓',
                description: 'Specialized support for port facilities, marine equipment, offshore platforms, and maritime operations.',
                features: ['Port Facilities', 'Marine Equipment', 'Offshore Platforms', 'Dock Maintenance'],
                link: '/us/services/offshore-marine'
              },
              {
                title: 'HVAC & Mechanical Systems',
                icon: '❄️',
                description: 'Commercial and industrial HVAC installation, maintenance, repair, and energy optimization services.',
                features: ['Commercial HVAC', 'Industrial Systems', 'Energy Management', 'Preventive Maintenance'],
                link: '/us/services/hvac-mechanical'
              },
              {
                title: 'Electrical & Power Systems',
                icon: '⚡',
                description: 'Comprehensive electrical services including power distribution, backup systems, and renewable energy integration.',
                features: ['Power Distribution', 'Backup Systems', 'Lighting Systems', 'Emergency Power'],
                link: '/us/services/electrical-power'
              },
              {
                title: 'Plumbing & Water Systems',
                icon: '🔧',
                description: 'Industrial and commercial plumbing services, water treatment, and wastewater management solutions.',
                features: ['Industrial Plumbing', 'Water Treatment', 'Wastewater Systems', 'Pipe Systems'],
                link: '/us/services/plumbing-water'
              },
              {
                title: 'Fire Safety & Suppression',
                icon: '🔥',
                description: 'Fire alarm systems, sprinkler maintenance, safety inspections, and compliance management.',
                features: ['Fire Alarm Systems', 'Sprinkler Systems', 'Safety Inspections', 'Code Compliance'],
                link: '/us/services/fire-safety'
              },
              {
                title: 'Supplies & Procurement',
                icon: '📦',
                description: 'MRO supplies, equipment parts, bulk procurement, vendor management, and just-in-time delivery services.',
                features: ['MRO Supplies', 'Equipment Parts', 'Vendor Management', 'Bulk Procurement'],
                link: '/us/services/supplies-procurement'
              }
            ].map((service) => (
              <Link 
                key={service.title}
                href={service.link}
                className="group border-2 border-neutral-200 bg-white p-8 transition-all hover:border-[#3498db] hover:shadow-lg"
              >
                <div className="text-5xl">{service.icon}</div>
                <h3 className="mt-4 text-xl font-bold text-neutral-900 group-hover:text-[#3498db]">{service.title}</h3>
                <p className="mt-3 text-neutral-600">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#3498db]">
                  Learn More
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900">Industries We Serve</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
              Specialized solutions tailored to your industry's unique requirements and compliance standards
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Healthcare', icon: '🏥', desc: 'Hospitals & Medical Facilities' },
              { name: 'Education', icon: '🎓', desc: 'Schools & Universities' },
              { name: 'Manufacturing', icon: '⚙️', desc: 'Production Facilities' },
              { name: 'Retail', icon: '🛍️', desc: 'Shopping Centers & Stores' },
              { name: 'Logistics', icon: '🚚', desc: 'Warehouses & Distribution' },
              { name: 'Hospitality', icon: '🏨', desc: 'Hotels & Resorts' },
              { name: 'Government', icon: '🏛️', desc: 'Federal & State Buildings' },
              { name: 'Technology', icon: '💻', desc: 'Data Centers & Tech Parks' }
            ].map((industry) => (
              <div key={industry.name} className="border border-neutral-300 bg-white p-6 text-center transition-all hover:border-[#3498db] hover:shadow-md">
                <div className="text-4xl">{industry.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-neutral-900">{industry.name}</h3>
                <p className="mt-1 text-sm text-neutral-600">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1e3a5f] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '50,000+', label: 'Jobs Completed', sublabel: 'Annually' },
              { value: '98.5%', label: 'Uptime Rate', sublabel: 'Across all facilities' },
              { value: '< 2 hrs', label: 'Avg Response Time', sublabel: 'Emergency services' },
              { value: '500+', label: 'Enterprise Clients', sublabel: 'Nationwide' }
            ].map((stat) => (
              <div key={stat.label} className="border-l-4 border-[#3498db] bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-lg font-semibold text-white/90">{stat.label}</div>
                <div className="mt-1 text-sm text-white/70">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Phixall */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900">Why Enterprise Clients Choose Phixall</h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Nationwide Coverage',
                icon: '🗺️',
                description: 'Service all 50 states with consistent quality and standardized procedures across all locations.'
              },
              {
                title: 'Certified Professionals',
                icon: '🎓',
                description: 'All technicians are background-checked, licensed, insured, and continuously trained on the latest standards.'
              },
              {
                title: 'Advanced Technology',
                icon: '📱',
                description: 'Real-time tracking, digital work orders, predictive maintenance analytics, and comprehensive reporting dashboards.'
              },
              {
                title: 'Compliance Expertise',
                icon: '✅',
                description: 'Stay compliant with OSHA, EPA, NFPA, and industry-specific regulations with our expert guidance.'
              },
              {
                title: 'Cost Optimization',
                icon: '💰',
                description: 'Reduce operational costs through preventive maintenance, energy management, and strategic procurement.'
              },
              {
                title: '24/7 Support',
                icon: '🕐',
                description: 'Round-the-clock emergency response teams and dedicated account management for peace of mind.'
              }
            ].map((benefit) => (
              <div key={benefit.title} className="border-2 border-neutral-200 p-8">
                <div className="text-5xl">{benefit.icon}</div>
                <h3 className="mt-4 text-xl font-bold text-neutral-900">{benefit.title}</h3>
                <p className="mt-3 text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-[#2c3e50] to-[#1e3a5f] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white">Ready to Transform Your Facility Management?</h2>
          <p className="mt-6 text-lg text-white/90">
            Request a custom quote and discover how Phixall can optimize your facility operations, reduce costs, and improve uptime.
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
              Schedule Consultation
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/70">
            Available 24/7 for emergency services • Response within 2 hours guaranteed
          </p>
        </div>
      </section>
    </main>
  );
}
