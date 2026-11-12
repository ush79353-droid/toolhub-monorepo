import type { NextConfig } from 'next';

function apiOrigin(): string {
  const raw = process.env.API_INTERNAL_URL || 'http://localhost:5001/api/v1';
  return new URL(raw).origin;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin()}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
