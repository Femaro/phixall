'use client';

import Link from 'next/link';
import Image from 'next/image';
import TrustComplianceBadges from '@/components/us/TrustComplianceBadges';
import PartnerLogosStrip from '@/components/us/PartnerLogosStrip';
import { US_CORE_SERVICES, US_HOMEPAGE_SPOTLIGHTS } from '@/data/usCoreServices';
import { US_SITE_IMAGES } from '@/data/usSiteImages';

export default function USCorporatePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Corporate Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2c3e50] to-[#34495e]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
                Indiana Facility Support Services
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/90">
                Phixall provides facility support services for Indiana commercial sites including maintenance assistance, repairs, painting, vendor coordination, and materials handling.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/us/contact" 
                  className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90"
                >
                  Reach us now
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/us/services" 
                  className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
                >
                  View All Services
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/20 pt-8">
                <div>
                  <div className="text-3xl font-bold text-[#5dade2]">2026</div>
                  <div className="mt-1 text-sm text-white/80">Established</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#5dade2]">IN</div>
                  <div className="mt-1 text-sm text-white/80">Service Coverage</div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] overflow-hidden rounded-2xl border border-white/20">
              <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                <source src="/banner video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <PartnerLogosStrip />

      {/* Service categories — compact overview */}
      <section className="relative border-t border-neutral-200/80 bg-gradient-to-b from-slate-100/90 via-white to-[#3498db]/[0.06] py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3498db]/40 to-transparent" aria-hidden />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3498db]">What we do</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">Service Categories</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {US_CORE_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="group rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#3498db]/40 hover:shadow-md"
              >
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#3498db]">{service.navLabel}</h3>
                <p className="mt-1 text-xs text-neutral-500">{service.navSubtext}</p>
                <p className="mt-3 text-sm leading-snug text-neutral-600">{service.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#3498db]">
                  Learn more
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services — image + text spotlight rows */}
      <section className="border-t border-neutral-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="py-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1e3a5f]">Featured services</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">Facility support coordination</h2>
          </div>

          <div className="space-y-16 pb-16 lg:space-y-24">
            {US_HOMEPAGE_SPOTLIGHTS.map((spotlight, index) => {
              const imageFirst = index % 2 === 0;
              return (
                <div
                  key={spotlight.id}
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${imageFirst ? '' : ''}`}
                >
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-neutral-200 ${imageFirst ? 'lg:order-1' : 'lg:order-2'}`}>
                    <Image
                      src={spotlight.imageSrc}
                      alt={spotlight.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 lg:text-3xl">{spotlight.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-neutral-600">{spotlight.description}</p>
                    <Link
                      href={spotlight.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#3498db] transition-colors hover:text-[#2980b9]"
                    >
                      {spotlight.cta}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TrustComplianceBadges />

      {/* Company foundation + how we deliver */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#243b55] to-[#1e3a5f] py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3498db]/15 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3498db]">Our foundation</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Phixall Facility Management Company
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">
              Our leadership brings years of experience supporting facility operations. Phixall was established in 2026 to serve Indiana commercial facilities.
            </p>
          </div>
          <p className="mt-14 text-center text-sm font-semibold uppercase tracking-wider text-[#3498db]">
            How we deliver
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Vendor communication',
                body: 'Vendor communication and documentation support—scheduling visits, tracking requests, and keeping facility managers informed on routine activities.',
                icon: (
                  <svg className="h-8 w-8 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
              },
              {
                title: 'On-site assistance',
                body: 'On-site assistance for routine facility activities—non-technical support that helps warehouses and logistics sites stay organized and operational.',
                icon: (
                  <svg className="h-8 w-8 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Indiana-based operations',
                body: 'Indiana-based operations with services available only within Indiana—focused support for warehouses, logistics, and commercial facilities.',
                icon: (
                  <svg className="h-8 w-8 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border-l-4 border-[#3498db] bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/15"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3498db]/20 ring-1 ring-[#3498db]/35">{item.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/us/contact"
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90"
            >
              Contact us
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/us/services"
              className="text-sm font-semibold text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Browse service lines
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Phixall */}
      <section className="border-t border-neutral-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3498db]">Why Phixall</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 lg:text-3xl">
              Built for Indiana warehouse &amp; logistics facilities
            </h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <ul className="space-y-0 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-slate-50/50">
              {[
                {
                  title: 'Indiana footprint',
                  description: 'Indiana-based operations with services available only within Indiana.',
                },
                {
                  title: 'Experienced support staff',
                  description: 'Background-checked support staff trained for warehouse and commercial facility environments.',
                },
                {
                  title: 'Safety-minded approach',
                  description: 'Safety-conscious procedures for all on-site facility support activities.',
                },
              ].map((item) => (
                <li key={item.title} className="px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.description}</p>
                </li>
              ))}
            </ul>

            <ul className="space-y-0 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-slate-50/50">
              {[
                {
                  title: 'Warehouse & distribution know-how',
                  description: 'Support shaped around docks, throughput, and the realities of fulfillment operations in Indiana.',
                },
                {
                  title: 'Cost-smart delivery',
                  description: 'Bundled facility support and coordinated vendor communication that reduces administrative overhead.',
                },
                {
                  title: 'Responsive account support',
                  description: 'Dedicated coordination from first inquiry through service delivery—one desk, clear accountability.',
                },
              ].map((item) => (
                <li key={item.title} className="px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-neutral-200 bg-gradient-to-br from-[#3498db]/30 via-[#2c3e50] to-[#1e3a5f] py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white">Ready to discuss facility support?</h2>
          <p className="mt-6 text-lg text-white/90">
            Contact our Indiana team to learn how Phixall can support your warehouse or commercial facility.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/us/contact" 
              className="inline-flex items-center gap-2 border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[#1e3a5f] transition-all hover:bg-white/90"
            >
              Reach us now
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/us/contact" 
              className="inline-flex items-center gap-2 border-2 border-white/50 bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
            >
              Schedule Consultation
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/70">
            Indiana-based facility support services
          </p>
        </div>
      </section>
    </main>
  );
}
