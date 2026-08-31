/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't let a lint error abort the production build on deploy —
    // a failed build is what leaves _next/static chunks missing (404s).
    ignoreDuringBuilds: true,
  },
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
        // Baseline security headers. No CSP: this site loads Spline, GSAP,
        // GA4 and inline bootstrap scripts, so a policy tight enough to be
        // worth having would need its own pass with nonces.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Apex only — no includeSubDomains/preload, both of which are hard
          // to walk back if a subdomain ever needs plain HTTP.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
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
