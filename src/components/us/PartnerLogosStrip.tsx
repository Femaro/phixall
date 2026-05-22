'use client';

import Image from 'next/image';

const logos = [
  {
    src: '/us/partners/conagra.svg',
    alt: 'Conagra Brands',
    width: 200,
    height: 52,
    className: 'object-contain',
  },
  {
    src: '/us/partners/isnetworld.svg',
    alt: 'ISNetworld',
    width: 200,
    height: 52,
    className: 'object-contain',
  },
  {
    src: '/us/partners/osha.svg',
    alt: 'OSHA — Occupational Safety and Health Administration, U.S. Department of Labor',
    width: 200,
    height: 62,
    className: 'object-contain',
  },
] as const;

/** Partner logo strip — uses files under `/public/us/partners/`. Swap SVGs per brand guidelines (see README in that folder). */
export default function PartnerLogosStrip() {
  return (
    <section className="border-b border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Trusted by operators &amp; aligned with rigorous safety programs
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-10 md:gap-x-16 lg:justify-between lg:gap-x-12">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex h-[4.25rem] w-[220px] max-w-[min(100%,220px)] items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.04] grayscale transition-[filter] duration-300 hover:grayscale-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`h-auto max-h-[62px] w-auto max-w-full ${logo.className ?? ''}`}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
