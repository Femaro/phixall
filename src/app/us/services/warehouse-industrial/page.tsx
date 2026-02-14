'use client';

import Link from 'next/link';

export default function WarehouseIndustrialPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Industrial Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Warehouse & Industrial
              <span className="block text-[#3498db]">Facility Management</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Specialized maintenance services for warehouses, distribution centers, manufacturing facilities, cold storage, and logistics operations. Minimize downtime and maximize operational efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Comprehensive Industrial Services</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Our industrial facility management services are designed to keep your operations running smoothly 24/7. We understand that downtime costs money, which is why we focus on preventive maintenance, rapid response, and long-term reliability.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'OSHA-compliant safety programs',
                  'Predictive maintenance technology',
                  '24/7 emergency response teams',
                  'Equipment lifecycle management',
                  'Energy efficiency optimization',
                  'Regulatory compliance support'
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
              <h3 className="text-2xl font-bold text-neutral-900">Service Capabilities</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-900">Coverage</h4>
                  <p className="mt-1 text-sm text-neutral-600">All 50 states with regional service centers</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Response Time</h4>
                  <p className="mt-1 text-sm text-neutral-600">Emergency: &lt; 2 hours | Routine: Same day</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Certifications</h4>
                  <p className="mt-1 text-sm text-neutral-600">OSHA, EPA, ISO 9001, NFPA</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Availability</h4>
                  <p className="mt-1 text-sm text-neutral-600">24/7/365 support and emergency services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Service Categories</h2>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Warehouse Maintenance',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
                services: [
                  'Loading dock equipment maintenance',
                  'Conveyor system repair and maintenance',
                  'Forklift charging station maintenance',
                  'Warehouse lighting systems',
                  'Floor coating and repair',
                  'Dock door and seal maintenance',
                  'Pallet racking inspection and repair',
                  'Material handling equipment service'
                ]
              },
              {
                title: 'Distribution Center Services',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>',
                services: [
                  'Automated sorting system maintenance',
                  'Package handling equipment service',
                  'Climate control systems',
                  'Facility-wide electrical systems',
                  'Backup power systems',
                  'Security system maintenance',
                  'Fire suppression systems',
                  'Energy management optimization'
                ]
              },
              {
                title: 'Cold Storage Facilities',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
                services: [
                  'Refrigeration system maintenance',
                  'Temperature monitoring systems',
                  'Insulation inspection and repair',
                  'Blast freezer maintenance',
                  'Humidity control systems',
                  'Emergency refrigeration repair',
                  'Ammonia refrigeration systems',
                  'Compliance documentation'
                ]
              },
              {
                title: 'Manufacturing Support',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
                services: [
                  'Production equipment maintenance',
                  'Compressed air systems',
                  'Industrial HVAC systems',
                  'Process cooling systems',
                  'Wastewater treatment maintenance',
                  'Dust collection systems',
                  'Industrial plumbing',
                  'Safety equipment inspection'
                ]
              },
              {
                title: 'Logistics Operations',
                icon: '📊',
                services: [
                  'Fleet maintenance coordination',
                  'Fueling system maintenance',
                  'Vehicle wash system service',
                  'Yard lighting maintenance',
                  'Gate and access control systems',
                  'Parking lot maintenance',
                  'Signage and wayfinding',
                  'Grounds maintenance'
                ]
              },
              {
                title: 'Equipment & Machinery',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
                services: [
                  'Preventive maintenance programs',
                  'Equipment calibration',
                  'Lubrication services',
                  'Vibration analysis',
                  'Thermal imaging inspections',
                  'Predictive maintenance',
                  'Emergency repairs',
                  'Spare parts management'
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

      {/* Preventive Maintenance Programs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Preventive Maintenance Programs</h2>
          <p className="mt-4 max-w-3xl text-lg text-neutral-600">
            Reduce costly downtime with our comprehensive preventive maintenance programs tailored to industrial facilities.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Bronze Plan',
                price: 'Custom Quote',
                features: [
                  'Quarterly equipment inspections',
                  'Annual HVAC maintenance',
                  'Emergency service priority',
                  'Basic reporting',
                  '8-hour response time',
                  'Parts discount: 10%'
                ]
              },
              {
                name: 'Silver Plan',
                price: 'Custom Quote',
                features: [
                  'Monthly equipment inspections',
                  'Quarterly HVAC maintenance',
                  'Priority emergency service',
                  'Detailed reporting & analytics',
                  '4-hour response time',
                  'Parts discount: 15%',
                  'Predictive maintenance tools',
                  'Compliance tracking'
                ],
                popular: true
              },
              {
                name: 'Platinum Plan',
                price: 'Custom Quote',
                features: [
                  'Weekly facility walkthroughs',
                  'Monthly equipment inspections',
                  'Dedicated account manager',
                  'Real-time monitoring dashboard',
                  '2-hour response time',
                  'Parts discount: 20%',
                  'Advanced predictive analytics',
                  'Full compliance management',
                  'Energy optimization reports'
                ]
              }
            ].map((plan) => (
              <div key={plan.name} className={`border-2 ${plan.popular ? 'border-[#3498db] bg-blue-50/30' : 'border-neutral-200 bg-white'} p-8`}>
                {plan.popular && (
                  <div className="mb-4 inline-flex border border-[#3498db] bg-[#3498db] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-neutral-900">{plan.name}</h3>
                <div className="mt-4 text-3xl font-bold text-neutral-900">{plan.price}</div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/us/request-quote"
                  className={`mt-8 block w-full border-2 ${plan.popular ? 'border-[#3498db] bg-[#3498db] text-white hover:bg-[#2980b9]' : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'} px-6 py-3 text-center font-bold uppercase tracking-wide transition-all`}
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border-2 border-neutral-200 bg-white p-12">
            <div className="mb-4 inline-flex border border-[#27ae60] bg-[#27ae60] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Case Study
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">350,000 sq ft Distribution Center</h2>
            <p className="mt-4 text-lg text-neutral-600">
              How we helped a major logistics company reduce maintenance costs by 32% while improving uptime to 99.8%
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-4xl font-bold text-[#3498db]">32%</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">Cost Reduction</div>
                <p className="mt-1 text-sm text-neutral-500">Annual maintenance costs</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#3498db]">99.8%</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">Uptime Rate</div>
                <p className="mt-1 text-sm text-neutral-500">Critical systems availability</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#3498db]">45min</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">Avg Response</div>
                <p className="mt-1 text-sm text-neutral-500">Emergency service time</p>
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-8">
              <h3 className="font-bold text-neutral-900">Solution Highlights</h3>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  'Implemented predictive maintenance program',
                  'Installed real-time monitoring systems',
                  'Optimized preventive maintenance schedule',
                  'Established 24/7 emergency response protocol',
                  'Integrated vendor management system',
                  'Provided quarterly compliance audits'
                ].map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-neutral-600">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Ready to Optimize Your Industrial Operations?</h2>
          <p className="mt-6 text-lg text-white/90">
            Get a custom quote for your warehouse or industrial facility. Our team will assess your needs and provide a comprehensive maintenance plan.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/us/request-quote"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90"
            >
              Request Custom Quote
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/us"
              className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
