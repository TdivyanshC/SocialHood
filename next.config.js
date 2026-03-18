/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment
  output: 'export',
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable image optimization (works with static export when using unoptimized for some formats)
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Enable trailing slash for proper static file paths
  trailingSlash: true,
  
  // Transpile Spline packages
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  
  // Disable server features for static export
  // Note: Some Next.js features won't work in static export mode
};

module.exports = nextConfig;
