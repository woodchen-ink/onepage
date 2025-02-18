import { NextConfig } from 'next'

const config: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/dplayer/:path*',
        destination: '/dplayer/',
      },
      {
        source: '/aliplayer/:path*',
        destination: '/aliplayer/',
      },
      {
        source: '/ckplayer/:path*',
        destination: '/ckplayer/',
      },
      {
        source: '/xgplayer/:path*',
        destination: '/xgplayer/',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      dgram: false,
      tls: false,
    }
    return config
  },
}

export default config
