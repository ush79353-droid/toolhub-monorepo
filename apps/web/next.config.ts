import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mega-tools/shared', '@mega-tools/validation', '@mega-tools/ui'],
};

export default nextConfig;
