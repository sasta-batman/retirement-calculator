import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In production, use the Env Variable. In local dev, default to localhost.
    const apiUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/python/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
