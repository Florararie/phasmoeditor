/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages project site: https://<user>.github.io/phasmoeditor/
  basePath: '/phasmoeditor',
  assetPrefix: '/phasmoeditor/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
