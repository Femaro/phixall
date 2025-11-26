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
  // Empty config to silence the webpack/turbopack warning
  turbopack: {},
};

export default nextConfig;
