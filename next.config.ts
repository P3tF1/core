import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "fastly.picsum.photos",
      port: '',
      pathname: "/id/**"
    }]
  }
};

export default nextConfig;
