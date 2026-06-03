/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  trailingSlash: true,
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon|.*\\.(?:js|css|png|jpg|jpeg|svg|webp|avif|ico|woff2?|ttf|otf|mp4)).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
