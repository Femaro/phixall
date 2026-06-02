import type { NextConfig } from "next";

const LEGACY_SERVICE_REDIRECTS = [
  // Licensed-trade & legacy service pages
  'electrical',
  'plumbing',
  'carpentry',
  'electrical-power',
  'plumbing-water',
  'warehouse-industrial',
  'inland-industrial',
  'painting',
  'supplies',
  'supplies-procurement',
  'advisory',
  'engineering-project-management-support',
  'controls-and-automation',
  // Previous consolidated buckets
  'general-trades-mro',
  'industrial-coatings',
  'mro-procurement',
  'facility-project-management',
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/us/services/offshore-marine',
        destination: '/us/services/facility-maintenance-support',
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
    case 'industrial-coatings':
      return 'facility-painting';
    case 'supplies':
    case 'supplies-procurement':
    case 'mro-procurement':
      return 'materials-procurement';
    case 'advisory':
    case 'engineering-project-management-support':
    case 'controls-and-automation':
    case 'facility-project-management':
      return 'vendor-coordination';
    case 'electrical':
    case 'plumbing':
    case 'carpentry':
    case 'electrical-power':
    case 'plumbing-water':
    case 'general-trades-mro':
      return 'light-repairs-upkeep';
    default:
      return 'facility-maintenance-support';
  }
}

export default nextConfig;
