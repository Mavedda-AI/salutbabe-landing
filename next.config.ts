import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['firebase'],
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.salutbabe.com/:path*'
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'api.salutbabe.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
