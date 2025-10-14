/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent bundling Node-only modules in client bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
