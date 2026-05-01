import { Metadata } from 'next';
import { getMarketingSiteOrigin, getPhixallUsHomeUrl } from '@/lib/phixallUsSite';

const marketingSite = getMarketingSiteOrigin();

export const defaultMetadata: Metadata = {
  metadataBase: new URL(marketingSite),
  title: {
    default: 'Phixall - Professional Facility Management & Maintenance Services',
    template: '%s | Phixall'
  },
  description: 'Phixall, powered by Phixall Facility Management LLC, connects you with verified, skilled artisans for facility maintenance. Professional plumbing, electrical, HVAC, and more—focused on domestic U.S. facility operations.',
  keywords: [
    'facility management',
    'maintenance services',
    'artisan services',
    'plumbing services',
    'electrical services',
    'HVAC services',
    'professional artisans',
    'US facility management',
    'United States facility management',
    'Indiana facility management',
    'building maintenance',
    'preventive maintenance',
    'emergency repairs',
    'skilled technicians',
    'Phixall Facility Management LLC'
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
    locale: 'en_US',
    url: '/',
    siteName: 'Phixall',
    title: 'Phixall - Professional Facility Management & Maintenance Services',
    description: 'Phixall, powered by Phixall Facility Management LLC, connects you with verified, skilled artisans for facility maintenance across domestic U.S. programs.',
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
    creator: '@phixallng',
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
      { url: '/favicon.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: [
      { url: '/favicon.png', type: 'image/png' },
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
    languages: {
      'en-US': getPhixallUsHomeUrl(),
      'x-default': `${marketingSite}/`,
    },
  },
  category: 'business',
};


