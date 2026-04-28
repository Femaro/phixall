'use client';

import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1581092160562-40aa08f9aefd?auto=format&fit=crop&q=80&w=1400';

const POSTER_IMAGE =
  'https://images.unsplash.com/photo-1581090570563-942d9e8c662d?auto=format&fit=crop&q=80&w=1200';

export default function EngineeringServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Technical specialists
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Engineering Services
              <span className="block text-indigo-200">for industrial facilities</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Field-aligned engineering—from concept checks and FAT/SAT facilitation to commissioning support and as-builts—grounded in warehouse throughput, uptime, code awareness, and safe energization milestones.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/us/request-quote"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-900 transition-all hover:bg-white/90"
              >
                Request engineering scope
              </Link>
              <Link
                href="/us/services/controls-and-automation"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white/10"
              >
                Controls &amp; automation
              </Link>
            </div>
          </div>
          <div className="relative h-[340px] overflow-hidden rounded-2xl ring-1 ring-white/20 lg:h-[460px]">
            <Image
              src={HERO_IMAGE}
              alt="Engineers collaborating on warehouse systems"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">What we solve</h2>
          <p className="mt-3 max-w-3xl text-lg text-neutral-600">
            Independent technical eyes on integrations, redundancy, grounding, conveyor interfaces, docks, coolers, cranes, sprinkler interfaces, compressed air loops, compressed schedules, and your actual operating constraints.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Studies & readiness',
                items: [
                  'Power budget / load summaries and tap evaluation with safety factors',
                  'Short-circuit and coordination viewpoints at pragmatic depth for installers',
                  'Arc flash labeling strategy tied to energized work controls',
                  'Equipment pad and anchorage guidance for docks, coolers, cranes (collaborate-with-others model)',
                  'Fire / life safety interface lists with AHJ-friendly clarity',
                  'Constructability checkpoints on routing, trenches, shafts, and egress',
                ],
              },
              {
                title: 'Field engineering & commissioning',
                items: [
                  'SAT walk-down support and punch refinement with prioritized lists',
                  'Start-up sequencing for mechanical, refrigeration, cranes, docks, feeders',
                  'Loop checks and witnessing plans with safe energization choreography',
                  'Control narratives review against vendor PLCs/HMIs/MCCs coordination',
                  'Balance reports and trend reviews for commissioning sign-off packages',
                  'As-built markups and digital deliverable hygiene for O&M handover',
                ],
              },
              {
                title: 'Documentation & technical reviews',
                items: [
                  'Single-line and panel schedule consistency sweeps',
                  'Sequence of operations peer review against site reality',
                  'RFI and submittal technical responses with risk callouts',
                  'Root-cause reads on trips, nuisance faults, harmonics symptoms',
                  'Vendor drawing redlines for field conditions',
                  'Training outlines for maintenance and operations teams',
                ],
              },
              {
                title: 'Performance & reliability',
                items: [
                  'Energy use spot-checks for lighting, HVAC, refrigeration',
                  'Backup power test witness plans and load bank coordination',
                  'Thermal imaging campaign planning for critical bus work',
                  'Condition assessment inputs for capital replacement windows',
                  'Spares strategy inputs for long-lead SKUs',
                  'Obsolescence planning for legacy motor control centers',
                ],
              },
            ].map((block) => (
              <div key={block.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900">{block.title}</h3>
                <ul className="mt-4 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">Briefing reel</h2>
          <p className="mt-2 max-w-2xl text-neutral-600">
            Drop your site walk-through or commissioning clip—drop-in path keeps URLs stable (
            <code className="rounded bg-neutral-200 px-1 py-0.5 text-xs">public/us/media/hero-placeholder.mp4</code>
            ).
          </p>
          <div className="relative mt-8 overflow-hidden rounded-2xl ring-1 ring-neutral-300">
            <video muted playsInline controls preload="metadata" className="aspect-video w-full bg-neutral-900 object-cover" poster={POSTER_IMAGE}>
              <source src="/us/media/hero-placeholder.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-violet-950 to-indigo-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white lg:text-4xl">Engineering horsepower without hiring a bench</h2>
          <p className="mt-4 text-lg text-white/90">
            Tell us your bottlenecks—power quality, cutover windows, documentation gaps. We build a scope that matches your risk tolerance and schedule.
          </p>
          <div className="mt-10">
            <Link
              href="/us/request-quote"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-indigo-950 transition-all hover:bg-white/90"
            >
              Request engineering quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
