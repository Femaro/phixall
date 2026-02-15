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

            {/* Corporate Video */}
            <div className="relative h-[500px] overflow-hidden border border-white/20">
              <video 
                className="h-full w-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/banner video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                description: 'Complete management solutions for office buildings, retail spaces, corporate campuses, and educational institutions.',
                features: ['Office Buildings', 'Retail Spaces', 'Corporate Campuses', 'Government Facilities'],
                link: '/us/services/commercial'
              },
              {
                title: 'Warehouse & Industrial Services',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
                description: 'Specialized maintenance for warehouses, distribution centers, manufacturing facilities, and logistics operations.',
                features: ['Warehouse Maintenance', 'Distribution Centers', 'Cold Storage', 'Manufacturing Support'],
                link: '/us/services/warehouse-industrial'
              },
              {
                title: 'Residential Property Management',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                description: 'Professional services for multi-family complexes, condominiums, HOAs, and luxury residential buildings.',
                features: ['Multi-Family Complexes', 'Condominiums', 'HOA Communities', 'Senior Living'],
                link: '/us/services/residential'
              },
              {
                title: 'Offshore & Marine Services',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>,
                description: 'Specialized support for port facilities, marine equipment, offshore platforms, and maritime operations.',
                features: ['Port Facilities', 'Marine Equipment', 'Offshore Platforms', 'Dock Maintenance'],
                link: '/us/services/offshore-marine'
              },
              {
                title: 'HVAC & Mechanical Systems',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                description: 'Commercial and industrial HVAC installation, maintenance, repair, and energy optimization services.',
                features: ['Commercial HVAC', 'Industrial Systems', 'Energy Management', 'Preventive Maintenance'],
                link: '/us/services/hvac-mechanical'
              },
              {
                title: 'Electrical & Power Systems',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                description: 'Comprehensive electrical services including power distribution, backup systems, and renewable energy integration.',
                features: ['Power Distribution', 'Backup Systems', 'Lighting Systems', 'Emergency Power'],
                link: '/us/services/electrical-power'
              },
              {
                title: 'Plumbing & Water Systems',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
                description: 'Industrial and commercial plumbing services, water treatment, and wastewater management solutions.',
                features: ['Industrial Plumbing', 'Water Treatment', 'Wastewater Systems', 'Pipe Systems'],
                link: '/us/services/plumbing-water'
              },
              {
                title: 'Fire Safety & Suppression',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
                description: 'Fire alarm systems, sprinkler maintenance, safety inspections, and compliance management.',
                features: ['Fire Alarm Systems', 'Sprinkler Systems', 'Safety Inspections', 'Code Compliance'],
                link: '/us/services/fire-safety'
              },
              {
                title: 'Supplies & Procurement',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
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
                <div>{service.icon}</div>
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
              { name: 'Healthcare', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, desc: 'Hospitals & Medical Facilities' },
              { name: 'Education', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>, desc: 'Schools & Universities' },
              { name: 'Manufacturing', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, desc: 'Production Facilities' },
              { name: 'Retail', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, desc: 'Shopping Centers & Stores' },
              { name: 'Logistics', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>, desc: 'Warehouses & Distribution' },
              { name: 'Hospitality', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, desc: 'Hotels & Resorts' },
              { name: 'Government', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, desc: 'Federal & State Buildings' },
              { name: 'Technology', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, desc: 'Data Centers & Tech Parks' }
            ].map((industry) => (
              <div key={industry.name} className="border border-neutral-300 bg-white p-6 text-center transition-all hover:border-[#3498db] hover:shadow-md">
                <div className="mx-auto w-fit">{industry.icon}</div>
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
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Service all 50 states with consistent quality and standardized procedures across all locations.'
              },
              {
                title: 'Certified Professionals',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
                description: 'All technicians are background-checked, licensed, insured, and continuously trained on the latest standards.'
              },
              {
                title: 'Advanced Technology',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                description: 'Real-time tracking, digital work orders, predictive maintenance analytics, and comprehensive reporting dashboards.'
              },
              {
                title: 'Compliance Expertise',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Stay compliant with OSHA, EPA, NFPA, and industry-specific regulations with our expert guidance.'
              },
              {
                title: 'Cost Optimization',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Reduce operational costs through preventive maintenance, energy management, and strategic procurement.'
              },
              {
                title: '24/7 Support',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Round-the-clock emergency response teams and dedicated account management for peace of mind.'
              }
            ].map((benefit) => (
              <div key={benefit.title} className="border-2 border-neutral-200 p-8">
                <div>{benefit.icon}</div>
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
