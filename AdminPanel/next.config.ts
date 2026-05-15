import type { NextConfig } from "next";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://adminbackend-qzb4.onrender.com";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/admin/:path*',
          destination: `${backendBaseUrl}/api/admin/:path*`,
        },
        {
          source: '/api/auth/:path*',
          destination: `${backendBaseUrl}/api/auth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
