import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TrustComplianceBadges from '@/components/us/TrustComplianceBadges';
import { US_CORE_SERVICES } from '@/data/usCoreServices';
import { US_INDUSTRIES } from '@/data/usIndustries';
import { US_SITE_IMAGES } from '@/data/usSiteImages';

export const metadata: Metadata = {
  title: 'Industries We Serve | Phixall US',
  description:
    'Facility programs for warehouse, distribution, food manufacturing, and industrial sites across Indiana—delivered through four integrated service categories.',
};

export default function USIndustriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200/90">Sectors we support</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold text-white lg:text-5xl">Industries we serve</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            One program model across warehouse and industrial environments—scoped through our four core service categories.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl ring-1 ring-neutral-200 lg:min-h-[420px]">
              <Image
                src={US_SITE_IMAGES.logisticsFulfillment.src}
                alt={US_SITE_IMAGES.logisticsFulfillment.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 via-[#1e3a5f]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                <p className="max-w-sm text-sm leading-relaxed text-white/90">
                  Programs built for throughput, food-safe environments, and plant-adjacent sites across authorized Indiana locations.
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ring-1 ring-neutral-100 lg:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Supported sectors</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Facility management tailored to each operating environment.
              </p>
              <ul className="mt-6 divide-y divide-neutral-100">
                {US_INDUSTRIES.map((industry) => (
                  <li key={industry.id} id={industry.id} className="scroll-mt-24 py-4 first:pt-0">
                    <p className="font-semibold text-neutral-900">{industry.label}</p>
                    <p className="mt-1 text-sm text-neutral-600">{industry.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50/60 py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3498db]">How we deliver</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">Service categories by sector</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600">
              Every industry program routes through the same four capabilities—trades, coatings, procurement, and project support including automation coordination and owner&apos;s-representative services.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {US_CORE_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#3498db]/40 hover:shadow-md"
              >
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#3498db]">{service.navLabel}</h3>
                <p className="mt-2 text-sm text-neutral-600">{service.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#3498db]">
                  View service
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 py-14">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">Discuss your facility program</h2>
          <p className="mt-3 text-neutral-600">
            Tell us your sector, sites, and priorities—we align trades, coatings, procurement, and coordination under one desk.
          </p>
          <Link
            href="/us/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#3498db] bg-[#3498db] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#2980b9]"
          >
            Reach us now
          </Link>
        </div>
      </section>

      <TrustComplianceBadges />
    </main>
  );
}
