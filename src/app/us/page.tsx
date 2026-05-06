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
                Trusted by 200+ Enterprise Clients
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
                Enterprise Facility Management
                <span className="block text-[#3498db]">On-shore solutions in Indiana</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/90">
                Specialized facility management services for warehouse and distribution operations. We deliver comprehensive electrical, plumbing, carpentry, painting, and supply services to keep your warehouse running efficiently.
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
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/20 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white">98.5%</div>
                  <div className="mt-1 text-sm text-white/80">Uptime Guaranteed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">IN</div>
                  <div className="mt-1 text-sm text-white/80">Primary service state</div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] overflow-hidden rounded-2xl border border-white/20">
              <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                <source src="/banner video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900">Enterprise Facility Management Services</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
              Specialized solutions for warehouse installations and operations with professional support
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Electrical Services',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                description: 'Complete electrical installation and maintenance for warehouse facilities including power distribution, lighting systems, and backup power solutions.',
                features: ['Power Distribution', 'Lighting Systems', 'Backup Systems', 'Equipment Power'],
                link: '/us/services/electrical'
              },
              {
                title: 'Plumbing Services',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
                description: 'Industrial plumbing solutions for warehouse facilities including pipe systems, water distribution, drainage, and wastewater management.',
                features: ['Industrial Plumbing', 'Pipe Systems', 'Water Distribution', 'Drainage Systems'],
                link: '/us/services/plumbing'
              },
              {
                title: 'Carpentry Services',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
                description: 'Professional carpentry services for warehouse structures including shelving installation, loading dock repairs, and custom woodwork.',
                features: ['Shelving Installation', 'Dock Repairs', 'Custom Woodwork', 'Structural Repairs'],
                link: '/us/services/carpentry'
              },
              {
                title: 'Painting Services',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
                description: 'Industrial painting and coating services for warehouse facilities including floor coatings, wall finishes, and protective sealants.',
                features: ['Floor Coatings', 'Wall Painting', 'Protective Sealants', 'Line Marking'],
                link: '/us/services/painting'
              },
              {
                title: 'Installation Item Supplies',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
                description: 'Supply and procurement of installation materials, equipment parts, MRO supplies, and facility maintenance items for warehouse operations.',
                features: ['Installation Materials', 'Equipment Parts', 'MRO Supplies', 'Bulk Procurement'],
                link: '/us/services/supplies'
              },
              {
                title: 'Facility Management Advisory',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                description: 'Expert advisory services for warehouse facility optimization, compliance management, preventive maintenance planning, and cost reduction strategies.',
                features: ['Facility Optimization', 'Compliance Advisory', 'Maintenance Planning', 'Cost Analysis'],
                link: '/us/services/advisory'
              }
            ].map((service) => (
              <Link 
                key={service.title}
                href={service.link}
                className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 transition-all hover:-translate-y-0.5 hover:border-[#3498db] hover:shadow-lg hover:ring-[#3498db]/25"
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

      {/* Engineering & automation */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">Engineering runway</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-neutral-900">Program management &amp; technical depth</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
              Layer PM discipline with controls and engineering services so warehouse upgrades stay coordinated from kickoff packets through energized checkout.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Engineering PM Support',
                href: '/us/services/engineering-project-management-support',
                copy: 'Milestones, change control boards, turnovers, stakeholder cadence—all aligned with how your docks and lines actually behave.',
              },
              {
                title: 'Engineering Services',
                href: '/us/services/engineering-services',
                copy: 'Studies, commissioning, field troubleshooting, FAT/SAT—without losing context on warehouse uptime risks.',
              },
              {
                title: 'Controls & Automation',
                href: '/us/services/controls-and-automation',
                copy: 'Panels, PLC-era stacks, HMIs/MES bridges, sequencing, validation plans—wired to pragmatic operator reality.',
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col rounded-2xl bg-white p-8 shadow-md ring-1 ring-neutral-200 transition hover:-translate-y-1 hover:shadow-xl hover:ring-cyan-200"
              >
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-cyan-800">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">{item.copy}</p>
                <span className="mt-8 text-xs font-semibold uppercase tracking-wide text-[#3498db]">Explore specialty</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Proof strip — on-brand generated photography */}
      <section className="border-y border-neutral-200 bg-neutral-900 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { src: '/us/images/us-proof-mechanical.jpg', alt: 'Precision mechanical fabrication on the shop floor', caption: 'Mechanical & fabrication' },
              { src: '/us/images/us-proof-planning.jpg', alt: 'Team reviewing facility plans and schedules', caption: 'Facility planning & programs' },
              { src: '/us/images/us-proof-controls.jpg', alt: 'Industrial control panels and automation hardware', caption: 'Automation & controls' },
            ].map((img) => (
              <figure key={img.src} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <div className="relative aspect-[4/3]">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <figcaption className="bg-neutral-950 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-300">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-neutral-500">
            Facility programs from fabrication through commissioning—documented, coordinated, on-site across authorized Indiana locations.
          </p>
        </div>
      </section>

      {/* Industries Served */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900">Warehouse Industries We Serve</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
              Specialized warehouse facility management solutions tailored to your industry's unique requirements
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'E-Commerce Warehouses', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, desc: 'Fulfillment & Distribution Centers' },
              { name: 'Logistics', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>, desc: '3PL & Distribution Facilities' },
              { name: 'Manufacturing', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, desc: 'Production Warehouse Facilities' },
              { name: 'Cold Storage', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, desc: 'Refrigerated facilities—including ammonia refrigeration envelopes coordinated with your site safety programs' },
              { name: 'Retail Distribution', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, desc: 'Retail Supply Chain Warehouses' },
              { name: 'Food & Beverage', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>, desc: 'Food Distribution Warehouses' },
              { name: 'Pharmaceutical', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, desc: 'Medical Supply Warehouses' },
              { name: 'Automotive Parts', icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, desc: 'Auto Parts Distribution Centers' }
            ].map((industry) => (
              <div key={industry.name} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm ring-1 ring-neutral-100 transition-all hover:border-[#3498db]/40 hover:shadow-md">
                <div className="mx-auto w-fit">{industry.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-neutral-900">{industry.name}</h3>
                <p className="mt-1 text-sm text-neutral-600">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company foundation + how we deliver */}
      <section className="bg-[#1e3a5f] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3498db]">Our foundation</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Phixall Facility Management Company
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">
              Building on a legacy of managing over 10,000 facility projects, Phixall Facility Management Company was formally established in 2026 to provide dedicated, high-compliance solutions for enterprise partners.
            </p>
          </div>
          <p className="mt-14 text-center text-sm font-semibold uppercase tracking-wider text-[#3498db]">
            How we deliver
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'End-to-end coordination',
                body: 'Kickoff packets, change control, and turnovers aligned with how your lines and docks actually run—not generic checklists.',
                icon: (
                  <svg className="h-8 w-8 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
              },
              {
                title: 'Qualified field execution',
                body: 'Licensed, insured technicians trained for industrial and logistics environments—with safety and compliance treated as part of the job.',
                icon: (
                  <svg className="h-8 w-8 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Indiana enterprise coverage',
                body: 'On-shore coordination for authorized commercial and industrial sites across Indiana—responsive support scoped to your contract and locations.',
                icon: (
                  <svg className="h-8 w-8 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border-l-4 border-[#3498db] bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/15"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">{item.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/us/request-quote"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90"
            >
              Request enterprise quote
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/us/services"
              className="text-sm font-semibold text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Browse service lines
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Phixall */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900">Why Warehouse Clients Choose Phixall</h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Authorized Indiana footprint',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'On-shore, inland commercial and industrial facility services coordinated from Indiana—with consistent quality and documented procedures at contracted sites.'
              },
              {
                title: 'Professional Team',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
                description: 'All technicians are background-checked, licensed, insured, and trained in warehouse facility standards.'
              },
              {
                title: 'Warehouse Expertise',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
                description: 'Specialized knowledge of warehouse operations, safety requirements, and distribution center needs.'
              },
              {
                title: 'Safety Expertise',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Maintain compliance with safety regulations and warehouse-specific safety requirements.'
              },
              {
                title: 'Cost Optimization',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Reduce operational costs through preventive maintenance, efficient installations, and bulk procurement.'
              },
              {
                title: 'Reliable Support',
                icon: <svg className="h-12 w-12 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                description: 'Dedicated account management and support teams for warehouse operations.'
              }
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm ring-1 ring-neutral-100">
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
          <h2 className="text-4xl font-bold tracking-tight text-white">Ready to Optimize Your Warehouse Facility?</h2>
          <p className="mt-6 text-lg text-white/90">
            Request a custom quote and discover how Phixall can enhance your warehouse operations, reduce costs, and improve efficiency.
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
            Professional enterprise facility management services
          </p>
        </div>
      </section>
    </main>
  );
}
