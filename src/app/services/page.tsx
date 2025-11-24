import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      category: 'Plumbing Services',
      icon: '🔧',
      description: 'Expert plumbing solutions for all your water and drainage needs',
      services: [
        'Leak Detection & Repair',
        'Pipe Installation & Replacement',
        'Drain Cleaning & Unclogging',
        'Water Heater Installation & Repair',
        'Faucet & Fixture Installation',
        'Toilet Repair & Replacement',
        'Sewer Line Services',
        'Water Pressure Solutions',
        'Emergency Plumbing Services',
      ],
    },
    {
      category: 'Electrical Services',
      icon: '⚡',
      description: 'Licensed electricians for safe and reliable electrical work',
      services: [
        'Electrical Wiring & Rewiring',
        'Circuit Breaker Installation',
        'Lighting Installation & Repair',
        'Outlet & Switch Installation',
        'Electrical Panel Upgrades',
        'Generator Installation',
        'Electrical Safety Inspections',
        'Emergency Electrical Services',
        'Surge Protection Installation',
      ],
    },
    {
      category: 'HVAC Services',
      icon: '❄️',
      description: 'Climate control solutions for optimal comfort',
      services: [
        'Air Conditioning Installation',
        'AC Repair & Maintenance',
        'Heating System Installation',
        'Furnace Repair & Service',
        'Duct Cleaning & Repair',
        'Thermostat Installation',
        'Ventilation System Services',
        'Indoor Air Quality Solutions',
        'Emergency HVAC Services',
      ],
    },
    {
      category: 'Carpentry & Woodwork',
      icon: '🔨',
      description: 'Skilled carpentry for repairs, installations, and custom work',
      services: [
        'Door Installation & Repair',
        'Window Installation & Repair',
        'Cabinet Installation',
        'Furniture Assembly',
        'Deck & Fence Construction',
        'Trim & Molding Installation',
        'Drywall Installation & Repair',
        'Custom Woodwork',
        'Flooring Installation',
      ],
    },
    {
      category: 'Painting & Finishing',
      icon: '🎨',
      description: 'Professional painting services for interior and exterior',
      services: [
        'Interior Painting',
        'Exterior Painting',
        'Wall Texture & Finishing',
        'Cabinet Refinishing',
        'Pressure Washing',
        'Wallpaper Installation & Removal',
        'Staining & Varnishing',
        'Color Consultation',
        'Commercial Painting',
      ],
    },
    {
      category: 'Appliance Services',
      icon: '🔌',
      description: 'Installation, repair, and maintenance of household appliances',
      services: [
        'Refrigerator Repair',
        'Washing Machine Repair',
        'Dryer Repair',
        'Dishwasher Installation & Repair',
        'Oven & Stove Repair',
        'Microwave Repair',
        'Appliance Installation',
        'Water Dispenser Services',
        'Small Appliance Repair',
      ],
    },
    {
      category: 'Roofing Services',
      icon: '🏠',
      description: 'Complete roofing solutions from repairs to replacement',
      services: [
        'Roof Inspection',
        'Leak Detection & Repair',
        'Roof Replacement',
        'Shingle Installation',
        'Gutter Installation & Cleaning',
        'Roof Maintenance',
        'Skylight Installation',
        'Emergency Roof Repair',
        'Waterproofing',
      ],
    },
    {
      category: 'Locksmith Services',
      icon: '🔐',
      description: 'Security solutions and lock services for your property',
      services: [
        'Lock Installation',
        'Lock Repair & Rekeying',
        'Key Duplication',
        'Smart Lock Installation',
        'Deadbolt Installation',
        'Safe Installation & Opening',
        'Emergency Lockout Services',
        'Security System Installation',
        'Master Key Systems',
      ],
    },
    {
      category: 'Masonry & Tilework',
      icon: '🧱',
      description: 'Expert masonry and tile installation services',
      services: [
        'Tile Installation',
        'Tile Repair & Regrouting',
        'Brick & Stonework',
        'Concrete Work',
        'Patio & Walkway Installation',
        'Retaining Wall Construction',
        'Chimney Repair',
        'Flooring Installation',
        'Waterproofing',
      ],
    },
    {
      category: 'Landscaping & Outdoor',
      icon: '🌿',
      description: 'Outdoor maintenance and landscaping services',
      services: [
        'Lawn Mowing & Maintenance',
        'Garden Design & Installation',
        'Tree Trimming & Removal',
        'Irrigation System Installation',
        'Outdoor Lighting',
        'Fence Installation & Repair',
        'Patio & Deck Construction',
        'Landscape Design',
        'Seasonal Cleanup',
      ],
    },
    {
      category: 'Cleaning Services',
      icon: '🧹',
      description: 'Professional cleaning for facilities and properties',
      services: [
        'Deep Cleaning',
        'Regular Maintenance Cleaning',
        'Carpet Cleaning',
        'Window Cleaning',
        'Post-Construction Cleaning',
        'Pressure Washing',
        'Sanitization Services',
        'Floor Polishing',
        'Upholstery Cleaning',
      ],
    },
    {
      category: 'Emergency Services',
      icon: '🚨',
      description: '24/7 emergency response for urgent facility issues',
      services: [
        '24/7 Emergency Response',
        'Water Damage Restoration',
        'Emergency Plumbing',
        'Emergency Electrical',
        'Emergency HVAC',
        'Emergency Locksmith',
        'Disaster Recovery',
        'Emergency Boarding Up',
        'Emergency Roof Repair',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              Our Services
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
              Complete Facility
              <span className="text-gradient"> Maintenance Solutions</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              From routine maintenance to emergency repairs, our vetted Phixers provide comprehensive services to keep your facilities running smoothly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow"
              >
                Request a Service
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 border-2 border-neutral-200 bg-white px-6 py-3.5 text-base font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12">
            {services.map((service) => (
              <div key={service.category} className="border border-neutral-200 bg-white p-8 shadow-soft lg:p-12">
                <div className="grid gap-8 lg:grid-cols-3">
                  <div>
                    <div className="inline-flex h-16 w-16 items-center justify-center bg-brand-100 text-4xl">
                      {service.icon}
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-neutral-900">{service.category}</h2>
                    <p className="mt-3 text-neutral-600">{service.description}</p>
                    <Link 
                      href="/register"
                      className="mt-6 inline-flex items-center gap-2 bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
                    >
                      Request Service
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">What We Offer</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {service.services.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-neutral-700">{item}</span>
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

      {/* Why Choose Us */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Why Choose Phixall Services
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Quality, reliability, and professionalism in every job
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '✓', title: 'Vetted Professionals', desc: 'All Phixers are background-checked and certified' },
              { icon: '⚡', title: 'Fast Response', desc: 'Same-day service available for most requests' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'Upfront quotes with no hidden fees' },
              { icon: '🛡️', title: 'Quality Guarantee', desc: '100% satisfaction guarantee on all work' },
            ].map((item) => (
              <div key={item.title} className="border border-neutral-200 bg-white p-6 text-center shadow-soft">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center bg-brand-600 text-2xl text-white">
                  {item.icon}
                </div>
                <h3 className="mt-4 font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-6 text-lg text-brand-100">
            Request a service today and experience the Phixall difference.
          </p>
          <div className="mt-8">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Request a Service
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-100">
            Available 24/7 • Emergency services • Free quotes
          </p>
        </div>
      </section>
    </main>
  );
}









