/** @type {import('next').NextConfig} */
import type { Configuration } from 'webpack';

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  // Required for Replit
  webpack: (config: Configuration) => {
    config.externals = Array.isArray(config.externals) ? [...config.externals, { canvas: "canvas" }] : [{ canvas: "canvas" }];
    return config;
  },
}

export default nextConfig;
