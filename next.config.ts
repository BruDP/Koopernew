import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.satur.it',
      },
      {
        protocol: 'https',
        hostname: 'satur.it',
      }
    ],
  },
  // Consenti accesso da altri device in rete locale (Next 15)
  allowedDevOrigins: ["10.84.22.204", "localhost"],
};

export default nextConfig;
