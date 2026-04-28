'use client';

import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGE = '/us/images/us-proof-controls.jpg';

export default function ControlsAutomationPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-slate-900 to-emerald-950">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
              Industrial controls
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
              Controls &amp; Automation
              <span className="block text-emerald-300">for operations that cannot stop</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              Control panels, instrumentation, sequences of operations, MES touchpoints, validation plans, and commissioning support that keep conveyors, docks, refrigeration, and building systems aligned with how your floor actually runs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/us/request-quote"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-900 transition-all hover:bg-white/90"
              >
                Request controls scope
              </Link>
              <Link
                href="/us/services/engineering-services"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white/10"
              >
                Engineering services
              </Link>
            </div>
          </div>
          <div className="relative h-[340px] overflow-hidden rounded-2xl ring-1 ring-white/20 lg:h-[460px]">
            <Image
              src={HERO_IMAGE}
              alt="Industrial automation and control systems"
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
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Where we plug in</h2>
          <p className="mt-3 max-w-3xl text-lg text-neutral-600">
            Marketing-level depth: we align electrical, controls, and software layers so operators get predictable behavior during starts, stops, alarms, overrides, and recovery scenarios.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                title: 'Control systems & integration',
                items: [
                  'PLC / DCS cutover planning with freeze windows and rollback thinking',
                  'HMI / SCADA narrative alignment to SOPs and alarm philosophy',
                  'Panel build reviews: wiring, segregation, arc flash labels, network drops',
                  'Motor control strategies and VFD parameterization checks',
                  'Safety instrumented function awareness with machine builders',
                  'MES / WMS API touchpoints for order flow, exceptions, and traceability',
                ],
              },
              {
                title: 'Instrumentation & field devices',
                items: [
                  'Sensor selection for dust, cold, washdown, vibration, and EMC',
                  'Calibration plans, loop folders, and loop sign-off discipline',
                  'Network segmentation inputs for OT / IT boundaries',
                  'Wireless site surveys for challenging RF environments',
                  'Spares and interchangeability notes for long-lead hardware',
                  'Digital twin handoff strategy when applicable',
                ],
              },
              {
                title: 'Sequences, testing, validation',
                items: [
                  'Step-by-step sequences for mode changes and fault recovery',
                  'FAT / SAT script leadership with bounded pass/fail criteria',
                  'Alarm rationalization snapshots and operator acknowledgement paths',
                  'Batch and recipe strategy when integrating process skids',
                  'Cyber hygiene inputs: patch windows, backups, restores on controllers',
                  'Turnover dossier readiness for auditors and insurers',
                ],
              },
              {
                title: 'Performance & modernization',
                items: [
                  'Legacy automation risk reads and phased upgrade roadmaps',
                  'Energy and demand tie-ins where controls drive consumption',
                  'Throughput experiments with rate limits and interlocks',
                  'Redundant controller cutovers with rehearsed choreography',
                  'Remote access guardrails for vendors and internal teams',
                  'Training aids for maintenance and operations teams',
                ],
              },
            ].map((block) => (
              <div key={block.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900">{block.title}</h3>
                <ul className="mt-4 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-950 to-sky-950 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white lg:text-4xl">Make overrides boring—in a good way</h2>
          <p className="mt-4 text-lg text-white/90">
            Tell us what misbehaved last quarter: nuisance trips, spooky network events, forklift overrides, refrigeration swings. We will shape a disciplined scope tied to uptime.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/us/request-quote"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-emerald-950 transition-all hover:bg-white/90"
            >
              Request automation quote
            </Link>
            <Link href="/us/contact" className="rounded-xl border-2 border-white/40 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white/10">
              Contact ops
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
