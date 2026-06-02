import type { NextConfig } from "next";

const LEGACY_SERVICE_REDIRECTS = [
  // General Trades & MRO
  'electrical',
  'plumbing',
  'carpentry',
  'electrical-power',
  'plumbing-water',
  'warehouse-industrial',
  'inland-industrial',
  // Industrial Coatings
  'painting',
  // MRO Procurement
  'supplies',
  'supplies-procurement',
  // Facility Project Management & Advisory
  'advisory',
  'engineering-project-management-support',
  'controls-and-automation',
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/us/services/offshore-marine',
        destination: '/us/services/general-trades-mro',
        permanent: true,
      },
      {
        source: '/us/request-quote',
        destination: '/us/contact',
        permanent: true,
      },
      {
        source: '/us/industries/:slug',
        destination: '/us/industries',
        permanent: true,
      },
      ...LEGACY_SERVICE_REDIRECTS.map((slug) => ({
        source: `/us/services/${slug}`,
        destination: `/us/services/${redirectTarget(slug)}`,
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

function redirectTarget(slug: (typeof LEGACY_SERVICE_REDIRECTS)[number]): string {
  switch (slug) {
    case 'painting':
      return 'industrial-coatings';
    case 'supplies':
    case 'supplies-procurement':
      return 'mro-procurement';
    case 'advisory':
    case 'engineering-project-management-support':
    case 'controls-and-automation':
      return 'facility-project-management';
    default:
      return 'general-trades-mro';
  }
}

export default nextConfig;
