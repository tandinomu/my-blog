/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    staleTimes: { dynamic: 0, static: 0 },
  },
};
module.exports = nextConfig;
