import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
