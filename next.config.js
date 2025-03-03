/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'foodiesfeed.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.foodiesfeed.com',
        pathname: '**',
      }
    ],
  },
};

module.exports = nextConfig;
