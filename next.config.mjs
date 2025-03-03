/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'api.sushimi.ru',
      'www.foodiesfeed.com',
      'foodiesfeed.com',
      'sitebuilderreport.com',
      'www.sitebuilderreport.com',
      'images.sitebuilderreport.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.sushimi.ru',
      },
      {
        protocol: 'https',
        hostname: '**.foodiesfeed.com',
      },
      {
        protocol: 'https',
        hostname: '**.sitebuilderreport.com',
      },
    ],
  },
};

export default nextConfig; 