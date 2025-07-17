import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // 确保静态资源的正确加载
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  trailingSlash: true,
  // 静态导出模式下不支持这些配置
  // rewrites() 和 headers() 需要在 EdgeOne Pages 的配置中设置
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
  // /api接口rewrite到 localhost:8088/api
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8088/api/:path*',
      },
    ]
  },
}

export default config
