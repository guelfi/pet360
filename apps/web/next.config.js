const basePath = process.env.NEXT_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@pet360/shared'],
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // O otimizador de imagens do Next.js (/_next/image) nao respeita
    // basePath ao buscar a imagem original localmente, quebrando toda
    // imagem local quando a app roda sob um subpath (ex: /pet360/).
    // As imagens locais continuam servidas normalmente via /public,
    // so sem o redimensionamento/otimizacao automatica.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
