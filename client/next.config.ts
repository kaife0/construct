import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxies to the separate Express server (../server). Keeps the browser
      // talking same-origin, which is what lets the admin session cookie work
      // without cross-site cookie headaches — and mirrors how production will
      // be set up (one domain routing /api and /uploads to the Node backend).
      { source: "/api/:path*", destination: `${API_URL}/api/:path*` },
      // Admin-uploaded images served by the backend.
      { source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` },
    ];
  },
  images: {
    // Placeholder image hosts. Replace service/plan images with the client's own
    // photos (ideally served locally from /public) before launch.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
