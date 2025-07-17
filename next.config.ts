import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile images
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
