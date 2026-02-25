import { Metadata } from 'next';
import USCorporateHeader from '@/components/us/USCorporateHeader';
import USCorporateFooter from '@/components/us/USCorporateFooter';

export const metadata: Metadata = {
  title: 'Warehouse Facility Management Solutions | Phixall US',
  description: 'Specialized warehouse facility management services including electrical, plumbing, carpentry, painting, installation supplies, and facility advisory. Expert warehouse operations support across all 50 states.',
  keywords: [
    'warehouse facility management',
    'warehouse electrical services',
    'warehouse plumbing services',
    'warehouse carpentry services',
    'warehouse painting services',
    'warehouse installation supplies',
    'facility management advisory',
    'warehouse maintenance USA',
    'distribution center services',
    'warehouse operations management'
  ],
  openGraph: {
    title: 'Warehouse Facility Management Solutions | Phixall US',
    description: 'Specialized warehouse facility management services including electrical, plumbing, carpentry, painting, and supplies across the United States.',
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
