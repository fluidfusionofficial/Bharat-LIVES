/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['@bhoomi/ui', '@bhoomi/api-client', '@bhoomi/types'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
