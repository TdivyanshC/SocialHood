/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
