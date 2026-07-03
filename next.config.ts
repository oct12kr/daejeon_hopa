import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'daejeonhopa.com',
          },
        ],
        destination: 'https://www.daejeonhopa.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wordpress-1628102-6434425.cloudwaysapps.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "wordpress-1628102-6481493.cloudwaysapps.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "wordpress-1628102-6522287.cloudwaysapps.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
