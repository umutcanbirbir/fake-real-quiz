import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sdfjmjzwrmossqulowti.supabase.co",
      },
    ],
  },
};

export default nextConfig;
