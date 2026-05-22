'use client';

import Link from 'next/link';

export default function AdvisoryServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2c3e50] to-[#34495e]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Expert Advisory
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Facility Management Advisory
              <span className="block text-[#3498db]">for Warehouse Operations</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Expert advisory services for warehouse facility optimization, compliance management, preventive maintenance planning, cost reduction strategies, and operational excellence for warehouse facilities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Advisory Service Offerings</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Facility Optimization',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                services: ['Operational efficiency audits', 'Workflow optimization', 'Space utilization analysis', 'Layout optimization', 'Energy efficiency consulting', 'Equipment upgrade planning', 'Process improvement', 'Performance metrics']
              },
              {
                title: 'Compliance Management',
                icon: '📋',
                services: ['Safety compliance consulting', 'Regulations guidance', 'Safety code compliance', 'Building code compliance', 'Fire safety regulations', 'Accessibility compliance', 'Industry-specific standards', 'Compliance documentation']
              },
              {
                title: 'Preventive Maintenance Planning',
                icon: '📅',
                services: ['Maintenance schedule development', 'Equipment lifecycle planning', 'Predictive maintenance strategies', 'Asset management', 'Inspection protocols', 'Maintenance budget planning', 'Vendor coordination', 'Downtime reduction strategies']
              },
              {
                title: 'Cost Reduction Strategies',
                icon: <svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                services: ['Utility cost analysis', 'Procurement optimization', 'Energy savings programs', 'Waste reduction', 'Operational cost analysis', 'ROI analysis', 'Budget optimization', 'Value engineering']
              },
              {
                title: 'Risk Management',
                icon: '🛡️',
                services: ['Risk assessments', 'Safety program development', 'Preparedness planning', 'Business continuity planning', 'Disaster recovery planning', 'Insurance optimization', 'Liability reduction', 'Safety training programs']
              },
              {
                title: 'Technology Integration',
                icon: '💻',
                services: ['Facility management systems', 'IoT sensor implementation', 'Monitoring systems', 'Automated controls', 'Data analytics', 'Digital work orders', 'Mobile solutions', 'Reporting dashboards']
              },
              {
                title: 'Sustainability Consulting',
                icon: '🌱',
                services: ['Green building practices', 'Waste management programs', 'Recycling initiatives', 'Carbon footprint reduction', 'Sustainable materials', 'Water conservation', 'Environmental compliance', 'Sustainability reporting']
              },
              {
                title: 'Strategic Planning',
                icon: '🎯',
                services: ['Long-term facility planning', 'Capital improvement planning', 'Expansion planning', 'Renovation strategies', 'Equipment replacement planning', 'Benchmarking analysis', 'Industry best practices', 'Strategic roadmaps']
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

      <section className="bg-gradient-to-br from-[#2c3e50] to-[#1e3a5f] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Expert Warehouse Facility Management Advisory</h2>
          <p className="mt-6 text-lg text-white/90">
            Strategic guidance to optimize your warehouse operations, reduce costs, ensure compliance, and improve overall facility performance.
          </p>
          <div className="mt-10">
            <Link href="/us/contact" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90">
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
