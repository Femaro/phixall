'use client';

import Link from 'next/link';

export default function SuppliesProcurementPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Supply Chain Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Facility Supplies &
              <span className="block text-purple-300">Procurement Services</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Comprehensive MRO supplies, equipment parts, bulk procurement, vendor management, and just-in-time delivery services for commercial and industrial facilities nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Streamlined Procurement Solutions</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Reduce costs, eliminate procurement headaches, and ensure your facility always has the supplies it needs. Our procurement services integrate seamlessly with your maintenance operations.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Single-source procurement management',
                  'Just-in-time delivery scheduling',
                  'Volume pricing and discounts',
                  'Inventory management support',
                  'Vendor consolidation savings',
                  'Emergency supply availability'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-neutral-200 bg-gradient-to-br from-purple-50 to-violet-50 p-8">
              <h3 className="text-2xl font-bold text-neutral-900">Procurement Benefits</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-900">Cost Savings</h4>
                  <p className="mt-1 text-sm text-neutral-600">Average 15-30% reduction in supply costs through volume purchasing and vendor consolidation</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Time Savings</h4>
                  <p className="mt-1 text-sm text-neutral-600">Eliminate hours of procurement management with automated ordering and delivery</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Stock Optimization</h4>
                  <p className="mt-1 text-sm text-neutral-600">Never run out of critical supplies while reducing excess inventory costs</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Quality Assurance</h4>
                  <p className="mt-1 text-sm text-neutral-600">Pre-vetted suppliers and guaranteed genuine parts and materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MRO Supplies Categories */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">MRO Supply Categories</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Complete range of Maintenance, Repair, and Operations supplies for every facility need
          </p>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                category: 'HVAC & Refrigeration',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
                items: [
                  'Air filters (all sizes)',
                  'Refrigerant gases',
                  'Belts and pulleys',
                  'Compressor parts',
                  'Thermostats and controls',
                  'Ductwork and fittings',
                  'Coils and condensers',
                  'Insulation materials'
                ]
              },
              {
                category: 'Electrical Supplies',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
                items: [
                  'Circuit breakers',
                  'Wiring and cables',
                  'Conduit and fittings',
                  'Lighting fixtures & bulbs',
                  'Switches and outlets',
                  'Electrical panels',
                  'Transformers',
                  'Emergency lighting'
                ]
              },
              {
                category: 'Plumbing Supplies',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
                items: [
                  'Pipes and fittings',
                  'Valves and actuators',
                  'Pumps and seals',
                  'Drain cleaning supplies',
                  'Water heater parts',
                  'Fixtures and faucets',
                  'Backflow preventers',
                  'Pipe insulation'
                ]
              },
              {
                category: 'Safety Equipment',
                icon: '⚠️',
                items: [
                  'Fire extinguishers',
                  'First aid supplies',
                  'PPE (gloves, masks, goggles)',
                  'Safety signage',
                  'Spill containment',
                  'Lockout/tagout devices',
                  'Fall protection gear',
                  'Emergency equipment'
                ]
              },
              {
                category: 'Janitorial Supplies',
                icon: '🧹',
                items: [
                  'Cleaning chemicals',
                  'Mops and brooms',
                  'Paper products',
                  'Trash bags and containers',
                  'Floor care equipment',
                  'Disinfectants',
                  'Hand soap and sanitizer',
                  'Cleaning cloths'
                ]
              },
              {
                category: 'Tools & Equipment',
                icon: '🛠️',
                items: [
                  'Power tools',
                  'Hand tools',
                  'Ladders and scaffolding',
                  'Measuring instruments',
                  'Testing equipment',
                  'Tool storage',
                  'Safety equipment',
                  'Workshop supplies'
                ]
              },
              {
                category: 'Building Materials',
                icon: '🏗️',
                items: [
                  'Lumber and plywood',
                  'Drywall and plaster',
                  'Paint and primers',
                  'Concrete and mortar',
                  'Roofing materials',
                  'Doors and windows',
                  'Hardware and fasteners',
                  'Sealants and adhesives'
                ]
              },
              {
                category: 'Industrial Supplies',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
                items: [
                  'Bearings and bushings',
                  'Lubricants and oils',
                  'Hydraulic hoses',
                  'Pneumatic fittings',
                  'Chain and sprockets',
                  'Motors and drives',
                  'Gaskets and seals',
                  'Industrial fasteners'
                ]
              },
              {
                category: 'Office & Facility',
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
                items: [
                  'Office supplies',
                  'Break room supplies',
                  'Furniture and fixtures',
                  'Signage materials',
                  'Access control supplies',
                  'Security equipment',
                  'Communication devices',
                  'IT accessories'
                ]
              }
            ].map((category) => (
              <div key={category.category} className="border-2 border-neutral-200 bg-white p-6">
                <div className="flex items-start gap-3">
                  <div className="mx-auto w-fit">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900">{category.category}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {category.items.map((item) => (
                        <li key={item} className="text-sm text-neutral-600">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Parts */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Equipment Parts & Components</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Genuine OEM and certified aftermarket parts for all major equipment brands
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              {
                title: 'HVAC Equipment Parts',
                brands: ['Carrier', 'Trane', 'Lennox', 'York', 'Daikin', 'Mitsubishi', 'Goodman', 'Rheem'],
                icon: '🌡️'
              },
              {
                title: 'Electrical Equipment',
                brands: ['Siemens', 'Square D', 'Allen-Bradley', 'GE', 'Eaton', 'Schneider', 'ABB', 'Cutler-Hammer'],
                icon: '<svg className="h-10 w-10 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>'
              },
              {
                title: 'Plumbing Fixtures',
                brands: ['Kohler', 'American Standard', 'Moen', 'Delta', 'Grohe', 'Sloan', 'Zurn', 'Toto'],
                icon: '🚰'
              },
              {
                title: 'Material Handling',
                brands: ['Toyota', 'Crown', 'Raymond', 'Yale', 'Hyster', 'Kion', 'Jungheinrich', 'Clark'],
                icon: '🏗️'
              }
            ].map((equipment) => (
              <div key={equipment.title} className="border-2 border-neutral-200 p-8">
                <div className="flex items-center gap-3">
                  <div className="mx-auto w-fit">{equipment.icon}</div>
                  <h3 className="text-xl font-bold text-neutral-900">{equipment.title}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {equipment.brands.map((brand) => (
                    <span key={brand} className="border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procurement Programs */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Procurement Program Options</h2>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: 'Basic Supply Program',
                description: 'Standard procurement services for facilities with occasional supply needs',
                features: [
                  'Competitive pricing on all orders',
                  'Online ordering portal access',
                  'Standard delivery (2-5 business days)',
                  'Email order confirmations',
                  'Invoice consolidation (monthly)',
                  'Basic inventory reporting'
                ]
              },
              {
                name: 'Managed Procurement',
                description: 'Comprehensive supply chain management with dedicated support',
                features: [
                  'Volume pricing (15% avg savings)',
                  'Dedicated account manager',
                  'Expedited delivery (1-2 business days)',
                  'Inventory management tools',
                  'Automated reordering',
                  'Quarterly usage reports',
                  'Vendor consolidation',
                  'Emergency supply priority'
                ],
                popular: true
              },
              {
                name: 'Enterprise Supply Chain',
                description: 'Full-service procurement with integrated inventory and logistics',
                features: [
                  'Maximum volume pricing (up to 30% savings)',
                  'On-site inventory management',
                  'Just-in-time delivery',
                  'Real-time inventory dashboard',
                  'Predictive ordering AI',
                  'Multi-location management',
                  'Custom vendor integration',
                  '24/7 emergency supply',
                  'Supply chain optimization',
                  'Annual cost analysis'
                ]
              }
            ].map((program) => (
              <div key={program.name} className={`border-2 ${program.popular ? 'border-purple-600 bg-purple-50/30' : 'border-neutral-200 bg-white'} p-8`}>
                {program.popular && (
                  <div className="mb-4 inline-flex border border-purple-600 bg-purple-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Recommended
                  </div>
                )}
                <h3 className="text-2xl font-bold text-neutral-900">{program.name}</h3>
                <p className="mt-3 text-sm text-neutral-600">{program.description}</p>
                <ul className="mt-6 space-y-3">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-600">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/us/request-quote"
                  className={`mt-8 block w-full border-2 ${program.popular ? 'border-purple-600 bg-purple-600 text-white hover:bg-purple-700' : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'} px-6 py-3 text-center font-bold uppercase tracking-wide transition-all`}
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Management */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Vendor Management Services</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Simplify your supply chain with our comprehensive vendor management. We handle relationships with hundreds of suppliers so you don't have to.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-purple-600 bg-purple-50 text-2xl">
                    📊
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Vendor Consolidation</h3>
                    <p className="mt-1 text-sm text-neutral-600">Reduce from dozens of vendors to a single point of contact, streamlining purchasing and invoicing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-purple-600 bg-purple-50 text-2xl">
                    💰
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Price Negotiation</h3>
                    <p className="mt-1 text-sm text-neutral-600">Leverage our bulk purchasing power to secure better pricing than direct vendor relationships.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-purple-600 bg-purple-50 text-2xl">
                    ✅
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Quality Control</h3>
                    <p className="mt-1 text-sm text-neutral-600">All vendors are pre-vetted for quality, reliability, and compliance with industry standards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-purple-600 bg-purple-50 text-2xl">
                    📦
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Delivery Coordination</h3>
                    <p className="mt-1 text-sm text-neutral-600">Consolidated deliveries reduce shipping costs and streamline receiving operations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-neutral-200 bg-gradient-to-br from-purple-50 to-violet-50 p-8">
              <h3 className="text-2xl font-bold text-neutral-900">By The Numbers</h3>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-purple-600">500+</div>
                  <div className="mt-2 font-semibold text-neutral-900">Vetted Suppliers</div>
                  <p className="mt-1 text-sm text-neutral-600">Nationwide network of quality vendors</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600">50,000+</div>
                  <div className="mt-2 font-semibold text-neutral-900">Products in Catalog</div>
                  <p className="mt-1 text-sm text-neutral-600">MRO supplies and equipment parts</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600">24hrs</div>
                  <div className="mt-2 font-semibold text-neutral-900">Emergency Availability</div>
                  <p className="mt-1 text-sm text-neutral-600">Rush delivery for critical supplies</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600">25%</div>
                  <div className="mt-2 font-semibold text-neutral-900">Average Cost Savings</div>
                  <p className="mt-1 text-sm text-neutral-600">vs. direct vendor purchasing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-purple-600 to-violet-700 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Streamline Your Facility Supply Chain</h2>
          <p className="mt-6 text-lg text-white/90">
            Let us handle your procurement so you can focus on operations. Request a quote and discover how much you can save with managed procurement.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/us/request-quote"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-purple-600 transition-all hover:bg-white/90"
            >
              Get Procurement Quote
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
          <p className="mt-8 text-sm text-white/70">
            Same-day quotes available • Volume discounts up to 30% • Nationwide delivery
          </p>
        </div>
      </section>
    </main>
  );
}
