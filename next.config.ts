import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/chemnet_project_frontend' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/chemnet_project_frontend/' : '',
};

export default nextConfig;