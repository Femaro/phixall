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
  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Exclude mobile directory from build
    resolveAlias: {
      // Mobile directory is already excluded via tsconfig.json
    },
  },
};

export default nextConfig;
