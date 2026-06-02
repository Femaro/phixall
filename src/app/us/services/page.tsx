import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { US_CORE_SERVICES } from '@/data/usCoreServices';

export const metadata: Metadata = {
  title: 'Facility Support Services | Phixall US',
  description:
    'Indiana-based facility support—maintenance assistance, light repairs, basic painting, vendor coordination, and materials handling. Services available only within Indiana.',
};

export default function USServicesIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] via-[#243b53] to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200/90">Service catalog</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Indiana facility support services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Five support programs for Indiana warehouses and commercial facilities—available only within Indiana.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/us/contact"
              className="inline-flex items-center rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-900 transition hover:bg-white/90"
            >
              Contact us
            </Link>
            <Link
              href="/us/contact"
              className="rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              Reach us now
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <ul className="grid gap-8 lg:grid-cols-2">
          {US_CORE_SERVICES.map((service) => (
            <li key={service.id}>
              <Link
                href={service.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#3498db]/40"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3498db]">{service.navLabel}</p>
                  <h2 className="mt-2 text-xl font-bold leading-snug text-neutral-900 group-hover:text-[#3498db] lg:text-2xl">
                    {service.headline}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{service.summary}</p>
                  <span className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#3498db]">
                    View detail →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
