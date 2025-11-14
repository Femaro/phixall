import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://phixall.vercel.app'),
  title: {
    default: 'Phixall - Professional Facility Management & Maintenance Services',
    template: '%s | Phixall'
  },
  description: 'Connect with verified, skilled artisans for all your facility maintenance needs. Professional plumbing, electrical, HVAC, and more. Trusted by businesses across Nigeria.',
  keywords: [
    'facility management',
    'maintenance services',
    'artisan services',
    'plumbing services',
    'electrical services',
    'HVAC services',
    'professional artisans',
    'Nigeria facility management',
    'building maintenance',
    'preventive maintenance',
    'emergency repairs',
    'skilled technicians'
  ],
  authors: [{ name: 'Phixall' }],
  creator: 'Phixall',
  publisher: 'Phixall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Phixall',
    title: 'Phixall - Professional Facility Management & Maintenance Services',
    description: 'Connect with verified, skilled artisans for all your facility maintenance needs. Professional services across Nigeria.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phixall - Professional Facility Management',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phixall - Professional Facility Management',
    description: 'Connect with verified artisans for all your facility maintenance needs.',
    images: ['/og-image.png'],
    creator: '@phixall',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  category: 'business',
};


