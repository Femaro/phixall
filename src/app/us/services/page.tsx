import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Facility Services Catalog | Phixall US',
  description:
    'Warehouse trades, procurement, advisory, engineering PM, and controls—coordinated for inland commercial and industrial facilities in authorized Indiana service areas.',
};

const sections = [
  {
    id: 'trades',
    title: 'Field & building trades',
    description:
      'Installation, preventive maintenance, and emergency response disciplines for warehousing and logistics environments.',
    items: [
      { href: '/us/services/electrical', label: 'Electrical Services', blurb: 'Power, lighting, material-handling electrification' },
      { href: '/us/services/plumbing', label: 'Plumbing Services', blurb: 'Industrial piping and distribution systems' },
      { href: '/us/services/carpentry', label: 'Carpentry Services', blurb: 'Shelving, docks, fixtures, carpentry installs' },
      { href: '/us/services/painting', label: 'Painting Services', blurb: 'Floor coatings, lines, protective finishes' },
      { href: '/us/services/electrical-power', label: 'Electrical & Power', blurb: 'Distribution, backup power, selective projects' },
      { href: '/us/services/plumbing-water', label: 'Plumbing & Water', blurb: 'Water systems aligned to facility throughput' },
    ],
  },
  {
    id: 'programs',
    title: 'Programs & facility verticals',
    description:
      'Full-service footprints for common industrial and logistics footprints—with procurement and operations alignment.',
    items: [
      { href: '/us/services/warehouse-industrial', label: 'Warehouse & Industrial', blurb: 'Distribution, manufacturing adjacent, throughput' },
      { href: '/us/services/inland-industrial', label: 'Inland Industrial & Commercial', blurb: 'On-shore facilities, warehouses, and plant-adjacent sites' },
      { href: '/us/services/supplies', label: 'Installation Item Supplies', blurb: 'MRO stocking and rollout materials' },
      { href: '/us/services/supplies-procurement', label: 'Supplies & Procurement', blurb: 'Programmatic sourcing and invoicing hygiene' },
    ],
  },
  {
    id: 'engineering',
    title: 'Engineering & automation',
    description:
      'PM rigor and technical horsepower for modernization, commissioning, integrations, panels, instrumentation, sequences, reliability.',
    items: [
      { href: '/us/services/engineering-project-management-support', label: 'Engineering PM Support', blurb: 'Schedules, change control, turnovers' },
      { href: '/us/services/controls-and-automation', label: 'Controls & Automation', blurb: 'PLC-era controls stacks, integrations, FAT/SAT' },
    ],
  },
  {
    id: 'advisory',
    title: 'Advisory',
    description: 'Executive-level optimization across compliance, capex planning, preventive programs, supplier landscape.',
    items: [{ href: '/us/services/advisory', label: 'Facility Management Advisory', blurb: 'Optimization, capex pacing, playbook design' }],
  },
] as const;

export default function USServicesIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] via-[#243b53] to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200/90">Service catalog</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white lg:text-5xl">Every Phixall US capability</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Browse specialties by practice area—then contact us for a bundled program combining trades, procurement, advisory, engineering PM, and automation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/us/contact"
              className="inline-flex items-center rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-900 transition hover:bg-white/90"
            >
              Contact us
            </Link>
            <Link href="/us/contact" className="rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10">
              Contact ops
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16 lg:px-8 lg:py-24">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{section.title}</h2>
            <p className="mt-2 max-w-3xl text-neutral-600">{section.description}</p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#3498db]/40"
                  >
                    <span className="text-lg font-bold text-neutral-900 group-hover:text-[#3498db]">{item.label}</span>
                    <span className="mt-2 flex-1 text-sm text-neutral-600">{item.blurb}</span>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#3498db]">View detail</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
