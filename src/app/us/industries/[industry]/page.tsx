'use client';
import Link from 'next/link';

const industries = {
  education: {
    title: 'Education',
    color: 'from-[#7c3aed] via-[#6d28d9] to-[#5b21b6]',
    accent: 'purple',
    icon: '🎓',
    description: 'Specialized facility management for schools, colleges, universities, and educational campuses.',
    services: [
      { title: 'Campus Infrastructure', icon: '🏫', items: ['Classroom maintenance', 'Laboratory facilities', 'Library systems', 'Administrative buildings', 'Athletic facilities', 'Dormitories', 'Dining halls', 'Student centers'] },
      { title: 'Safety & Security', icon: '🔒', items: ['Access control', 'Emergency systems', 'Fire safety', 'Security cameras', 'Campus lighting', 'Emergency communications', 'ADA compliance', 'Student safety'] }
    ]
  },
  manufacturing: {
    title: 'Manufacturing',
    color: 'from-[#059669] via-[#047857] to-[#065f46]',
    accent: 'emerald',
    icon: '⚙️',
    description: 'Industrial facility management for manufacturing plants, production facilities, and processing centers.',
    services: [
      { title: 'Production Support', icon: '🏭', items: ['Production equipment', 'Process systems', 'Material handling', 'Conveyor systems', 'Compressed air', 'Industrial HVAC', 'Power distribution', 'Safety systems'] },
      { title: 'Compliance', icon: '✅', items: ['OSHA standards', 'EPA regulations', 'ISO certifications', 'Safety audits', 'Environmental compliance', 'Quality systems', 'Documentation', 'Regulatory reporting'] }
    ]
  },
  retail: {
    title: 'Retail',
    color: 'from-[#ec4899] via-[#db2777] to-[#be185d]',
    accent: 'pink',
    icon: '🛍️',
    description: 'Facility management for retail stores, shopping centers, malls, and retail distribution centers.',
    services: [
      { title: 'Store Operations', icon: '🏬', items: ['Storefront maintenance', 'HVAC comfort control', 'Lighting systems', 'Parking facilities', 'Signage', 'Customer areas', 'Restroom facilities', 'Security systems'] },
      { title: 'Back of House', icon: '📦', items: ['Receiving areas', 'Storage facilities', 'Break rooms', 'Loading docks', 'Trash compactors', 'Refrigeration', 'Kitchen equipment', 'Inventory areas'] }
    ]
  },
  logistics: {
    title: 'Logistics & Distribution',
    color: 'from-[#0891b2] via-[#0e7490] to-[#155e75]',
    accent: 'cyan',
    icon: '🚛',
    description: 'Comprehensive services for warehouses, distribution centers, fulfillment centers, and logistics hubs.',
    services: [
      { title: 'Warehouse Systems', icon: '📦', items: ['Material handling equipment', 'Conveyor systems', 'Dock equipment', 'Loading systems', 'Racking systems', 'Forklift charging', 'Warehouse lighting', 'Climate control'] },
      { title: 'Operations Support', icon: '🔧', items: ['Fleet maintenance coordination', 'Fueling systems', 'Yard management', 'Security systems', 'Access control', 'Inventory systems', 'Automation equipment', '24/7 operations support'] }
    ]
  },
  hospitality: {
    title: 'Hospitality',
    color: 'from-[#f59e0b] via-[#d97706] to-[#b45309]',
    accent: 'amber',
    icon: '🏨',
    description: 'Facility management for hotels, resorts, restaurants, entertainment venues, and hospitality properties.',
    services: [
      { title: 'Guest Experience', icon: '✨', items: ['Guest room maintenance', 'Lobby areas', 'Pool and spa', 'Fitness centers', 'Conference facilities', 'Restaurant equipment', 'Elevators', 'Landscaping'] },
      { title: 'Operations', icon: '🔧', items: ['Kitchen equipment', 'Laundry facilities', 'HVAC comfort', 'Hot water systems', 'Plumbing systems', 'Emergency services', 'Preventive maintenance', 'Energy management'] }
    ]
  },
  government: {
    title: 'Government',
    color: 'from-[#1e40af] via-[#1e3a8a] to-[#1e3a8a]',
    accent: 'blue',
    icon: '🏛️',
    description: 'Facility management for federal, state, and local government buildings, military bases, and public facilities.',
    services: [
      { title: 'Security & Access', icon: '🔐', items: ['High-security systems', 'Access control', 'Surveillance', 'Perimeter security', 'Screening equipment', 'Emergency systems', 'Communications', 'Classified facility support'] },
      { title: 'Compliance', icon: '📋', items: ['Federal standards', 'ADA compliance', 'Security clearances', 'Energy mandates', 'Sustainability requirements', 'Historic preservation', 'LEED certification', 'Audit support'] }
    ]
  },
  technology: {
    title: 'Technology & Data Centers',
    color: 'from-[#6366f1] via-[#4f46e5] to-[#4338ca]',
    accent: 'indigo',
    icon: '💻',
    description: 'Specialized services for data centers, tech campuses, server facilities, and technology infrastructure.',
    services: [
      { title: 'Critical Systems', icon: '🖥️', items: ['Precision cooling', 'Power distribution', 'UPS systems', 'Generator backup', 'Environmental monitoring', 'Hot/cold aisle', 'Cable management', 'Fire suppression'] },
      { title: 'Infrastructure', icon: '⚡', items: ['Redundant power', 'Network infrastructure', 'Server room maintenance', 'Clean power systems', 'Energy efficiency', 'Capacity planning', 'Uptime optimization', '24/7 monitoring'] }
    ]
  }
};

export default function IndustryTemplate({ params }: { params: { industry: string } }) {
  const industry = industries[params.industry as keyof typeof industries];
  
  if (!industry) {
    return <div>Industry not found</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className={`relative overflow-hidden bg-gradient-to-br ${industry.color}`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Industry Solutions
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              {industry.title}
              <span className="block opacity-80">Facility Management</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">{industry.description}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">{industry.title} Solutions</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {industry.services.map((category) => (
              <div key={category.title} className="border-2 border-neutral-200 p-8">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{category.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{category.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
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

      <section className={`bg-gradient-to-br ${industry.color} py-20`}>
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-white">Specialized {industry.title} Solutions</h2>
          <p className="mt-6 text-lg text-white/90">
            Request a quote tailored to your {industry.title.toLowerCase()} facility's unique needs.
          </p>
          <div className="mt-10">
            <Link href="/us/request-quote" className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-neutral-900 transition-all hover:bg-white/90">
              Request Industry Quote
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
