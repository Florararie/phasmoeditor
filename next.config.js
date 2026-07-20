/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  // GitHub Pages project site: https://<user>.github.io/phasmoeditor/
  // Only applied for production builds so `pnpm dev` still serves at the root.
  basePath: isProd ? '/phasmoeditor' : '',
  assetPrefix: isProd ? '/phasmoeditor/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

