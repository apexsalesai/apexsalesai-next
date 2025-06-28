/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.botpress.cloud',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable App Directory feature
  experimental: {},
  // Redirect dashboard routes to the Pages Router implementation
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
        has: [
          {
            type: 'header',
            key: 'x-use-pages-router',
            value: 'true',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
