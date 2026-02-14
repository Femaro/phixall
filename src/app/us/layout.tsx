import { Metadata } from 'next';
import USCorporateHeader from '@/components/us/USCorporateHeader';
import USCorporateFooter from '@/components/us/USCorporateFooter';

export const metadata: Metadata = {
  title: 'Enterprise Facility Management Solutions | Phixall US',
  description: 'Comprehensive facility management services for commercial, industrial, and residential properties. Warehouse maintenance, offshore services, HVAC, electrical, plumbing, and supplies. Serving all 50 states.',
  keywords: [
    'enterprise facility management',
    'commercial facility services',
    'warehouse maintenance services',
    'industrial facility management',
    'offshore facility services',
    'facility management company USA',
    'commercial property maintenance',
    'corporate facility solutions',
    'MRO supplies procurement',
    'preventive maintenance programs'
  ],
  openGraph: {
    title: 'Enterprise Facility Management Solutions | Phixall US',
    description: 'Comprehensive facility management services for commercial, industrial, and residential properties across the United States.',
    type: 'website',
  },
};

export default function USLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <USCorporateHeader />
      {children}
      <USCorporateFooter />
    </>
  );
}
