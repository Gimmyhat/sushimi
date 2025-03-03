/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
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
