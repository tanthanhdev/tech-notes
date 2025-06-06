/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint checks during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
