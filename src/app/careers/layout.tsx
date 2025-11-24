import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at Phixall - Join Our Team',
  description: 'Join Phixall and help revolutionize facility management in Africa. Explore career opportunities and open positions with our growing team.',
  keywords: [
    'Phixall careers',
    'jobs at Phixall',
    'facility management jobs',
    'Nigeria jobs',
    'remote jobs',
    'administrative jobs',
  ],
  openGraph: {
    title: 'Careers at Phixall - Join Our Team',
    description: 'Explore career opportunities with Phixall. We\'re building Africa\'s leading platform for facility management.',
    url: '/careers',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Careers at Phixall',
      }
    ],
  },
  alternates: {
    canonical: '/careers',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

