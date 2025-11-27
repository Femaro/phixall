import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Disable Turbopack for production builds to avoid dependency tracking issues
  // Turbopack is still available for dev with `next dev --turbopack`
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
