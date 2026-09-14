import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      ...["/staff/:path*", "/api/:path*", "/referral"].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d8j0ntlcm91z4.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
