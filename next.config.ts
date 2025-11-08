import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  // Ensure fonts can be downloaded
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
