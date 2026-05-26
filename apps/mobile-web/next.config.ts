import type { NextConfig } from "next";

const apiTarget = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
