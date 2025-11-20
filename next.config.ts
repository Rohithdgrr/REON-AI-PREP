import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  },
  devIndicators: {
    buildActivity: false,
  },
  // Adding this experimental flag to allow cross-origin requests
  // in the development environment.
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1763465027242.cluster-nle52mxuvfhlkrzyrq6g2cwb52.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
