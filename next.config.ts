import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [375, 768, 1024, 1440, 1920],
    imageSizes: [64, 128, 256, 512],
    remotePatterns: [
      { protocol: 'https', hostname: 'media.tacdn.com' },
    ],
  },
};

export default nextConfig;
