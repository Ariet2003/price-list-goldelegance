/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
    unoptimized: true, // Отключаем оптимизацию изображений для локальных файлов
  },
};

module.exports = nextConfig; 