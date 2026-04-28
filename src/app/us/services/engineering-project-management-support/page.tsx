'use client';

import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGE = '/us/images/us-proof-planning.jpg';

export default function EngineeringPMPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-950">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Programs & portfolios
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Engineering Project
              <span className="block text-cyan-300">Management Support</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Integrated PM support so your upgrades, installs, relocations, and modernization programs ship on scope, schedule, and documented controls—without overloading your internal team.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/us/request-quote"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-900 transition-all hover:bg-white/90"
              >
                Request a quote
              </Link>
              <Link
                href="/us/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white/10"
              >
                Talk to ops
              </Link>
            </div>
          </div>
          <div className="relative h-[340px] overflow-hidden rounded-2xl ring-1 ring-white/20 lg:h-[460px]">
            <Image
              src={HERO_IMAGE}
              alt="Industrial project coordination and oversight"
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
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Capability areas</h2>
          <p className="mt-3 max-w-3xl text-lg text-neutral-600">
            We align execution plans with permitting, EH&amp;S, and vendor sequencing so work happens once—correctly—with traceable approvals and actionable documentation.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Portfolio & schedule stewardship',
                services: [
                  'Integrated milestone plans with predecessor logic for multi-trade installs',
                  'Short-interval planning cadence tailored to blackout windows',
                  'Resource & vendor coordination with clear deliverable owners',
                  'Critical path monitoring and recovery options when risks materialize',
                  'Look-ahead meetings with cross-functional alignment',
                ],
              },
              {
                title: 'Governance, risk & change',
                services: [
                  'Change control with impact analysis (scope, schedule, cost, safety)',
                  'Issue & risk registers with mitigation owners and due dates',
                  'Quality holds and release criteria for major cutovers',
                  'Turnover prerequisites and commissioning readiness checkpoints',
                  'Lessons-learned captures for continuous improvement cycles',
                ],
              },
              {
                title: 'Documentation & stakeholder comms',
                services: [
                  'RFIs, PCOs, baseline schedules, field reports aligned to stakeholder needs',
                  'Executive snapshots and escalation paths for decisive decisions',
                  'Submittals and construction documentation cadence oversight',
                  'Handover packages bridging construction to Operations & Maintenance',
                  'Facility condition baselines feeding capital planning narratives',
                ],
              },
              {
                title: 'Procurement-aware execution context',
                services: [
                  'Support for long-lead equipment tracking and substitutions',
                  'Alignment with warehousing slotting, docks, refrigeration, conveyor, MEPS dependencies',
                  'Site logistics awareness for forklift paths, docks, egress, crane windows',
                  'Coordination with contractors and inspectors on practical sequences',
                  'Operational readiness rehearsals before go-live',
                ],
              },
            ].map((category) => (
              <div
                key={category.title}
                className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200"
              >
                <h3 className="text-xl font-bold text-neutral-900">{category.title}</h3>
                <ul className="mt-4 space-y-2">
                  {category.services.map((service) => (
                    <li key={service} className="flex items-start gap-2 text-sm text-neutral-600">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {service}
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
          <h2 className="text-3xl font-bold text-neutral-900">How we partner with your team</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              { step: '01', label: 'Align', text: 'Validate outcomes, constraints, stakeholders, and success measures.' },
              { step: '02', label: 'Plan', text: 'Draft schedule, scope packages, and risk register with clear owners.' },
              { step: '03', label: 'Execute', text: 'Facilitate field cadence, change control, and communication loops.' },
              { step: '04', label: 'Close', text: 'Turnover, documentation, and transfer to steady-state operations.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                <div className="text-sm font-bold uppercase tracking-wider text-cyan-700">{item.step}</div>
                <div className="mt-2 text-lg font-bold text-neutral-900">{item.label}</div>
                <p className="mt-2 text-sm text-neutral-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-950 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white lg:text-4xl">Run your next upgrade with disciplined PM support</h2>
          <p className="mt-4 text-lg text-white/90">
            Share timelines, sketches, scopes of work—we will map sequencing, stakeholder touchpoints, and documentation deliverables tailored to how your facility operates.
          </p>
          <div className="mt-10">
            <Link
              href="/us/request-quote"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-slate-900 transition-all hover:bg-white/90"
            >
              Request project support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
