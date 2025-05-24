const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyBriBCgwiSg4PkhUJnPqHo1v0swzoqmLjk',
  },
  webpack: (config, { isServer }) => {
    // Fix for Firebase/undici compatibility issue
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    return config
  },
  experimental: {
    esmExternals: false,
  },
}

module.exports = withPWA(nextConfig) 