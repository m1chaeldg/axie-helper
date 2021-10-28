const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' *;img-src * 'self' data: https:;"
  },
  {
    key: 'Access-Control-Allow-Origin',
    value: "*"
  }, {
    key: 'Access-Control-Allow-Headers',
    value: "*"
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: "*"
  }
]
//*.axieinfinity.com vitals.vercel-insights.com api.coingecko.com *.coins.ph *.binance.com graphql-gateway.axieinfinity.com *.gstatic.com
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'assets.coingecko.com']
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
