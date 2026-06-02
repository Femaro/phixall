import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrustComplianceBadges from '@/components/us/TrustComplianceBadges';
import { US_CORE_SERVICES, getUSCoreServiceBySlug } from '@/data/usCoreServices';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return US_CORE_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getUSCoreServiceBySlug(slug);
  if (!service) return { title: 'Service | Phixall US' };

  return {
    title: `${service.navLabel} | Phixall US`,
    description: service.body,
  };
}

export default async function USCoreServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getUSCoreServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200/90">{service.navLabel}</p>
              <h1 className="mt-2 max-w-4xl text-4xl font-bold text-white lg:text-5xl">{service.headline}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/90">{service.body}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/20">
              <Image
                src={service.imageSrc}
                alt={service.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">Capabilities Include</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {service.capabilities.map((cap) => (
              <li
                key={cap}
                className="rounded-2xl border border-neutral-200 bg-slate-50/50 p-6 text-sm leading-relaxed text-neutral-700"
              >
                {cap}
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Link
              href="/us/contact"
              className="inline-flex rounded-xl border-2 border-[#3498db] bg-[#3498db] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#2980b9]"
            >
              Reach us now
            </Link>
          </div>
        </div>
      </section>

      <TrustComplianceBadges />
    </main>
  );
}
