import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
