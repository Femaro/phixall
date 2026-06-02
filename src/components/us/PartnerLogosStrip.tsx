'use client';

import Image from 'next/image';

const logos = [
  {
    src: '/us/partners/conagra.png',
    alt: 'Conagra Brands',
    width: 262,
    height: 193,
    className: 'object-contain',
  },
  {
    src: '/us/partners/isnetworld.png',
    alt: 'ISNetworld — ISN',
    width: 228,
    height: 206,
    className: 'object-contain',
  },
] as const;

/** Partner logos from `/public/us/partners/` (see README for trademark usage). */
export default function PartnerLogosStrip() {
  return (
    <section className="border-b border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Trusted by Indiana facility operators
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-10 md:gap-x-16 lg:justify-between lg:gap-x-12">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex h-[4.75rem] w-[240px] max-w-[min(100%,280px)] items-center justify-center rounded-xl border border-slate-200/80 bg-white px-5 py-3 shadow-sm ring-1 ring-slate-900/[0.04] grayscale transition-[filter] duration-300 hover:grayscale-0 sm:w-[260px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`h-auto max-h-[52px] w-auto max-w-full ${logo.className ?? ''}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
