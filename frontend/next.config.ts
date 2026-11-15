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
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          // Public calculators may be framed by third-party sites when embedEnabled.
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/((?!embed/).*)',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
