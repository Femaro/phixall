import { Metadata } from 'next';
import USCorporateHeader from '@/components/us/USCorporateHeader';
import USCorporateFooter from '@/components/us/USCorporateFooter';
import PhixallUsJsonLd from '@/components/us/PhixallUsJsonLd';
import { getMarketingSiteOrigin, getPhixallUsOrigin } from '@/lib/phixallUsSite';

const phixallUsOrigin = getPhixallUsOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(phixallUsOrigin),
  title: 'Indiana Facility Support Services | Phixall US',
  description:
    'Indiana-based facility support for warehouses and commercial sites—maintenance support, light repairs, basic painting, vendor and project coordination, and materials handling. Services available only within Indiana.',
  keywords: [
    'Indiana facility support',
    'warehouse facility maintenance',
    'facility painting Indiana',
    'vendor and project coordination',
    'materials handling support',
    'commercial facility upkeep',
    'logistics facility support',
    'distribution center support Indiana',
  ],
  alternates: {
    languages: {
      'en-US': `${phixallUsOrigin}/us`,
      'x-default': `${getMarketingSiteOrigin()}/`,
    },
  },
  openGraph: {
    title: 'Indiana Facility Support Services | Phixall US',
    description:
      'Facility support for Indiana warehouses and commercial facilities—maintenance, light repairs, painting, vendor and project coordination, and materials handling.',
    type: 'website',
    url: '/us',
  },
};

export default function USLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="isolate min-h-[100dvh] bg-[var(--background)] font-sans tracking-tight text-neutral-950 antialiased">
      <PhixallUsJsonLd />
      <USCorporateHeader />
      {children}
      <USCorporateFooter />
    </div>
  );
}
