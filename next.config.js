/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
