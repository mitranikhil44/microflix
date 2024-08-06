/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  basePath: "",
  assetPrefix: "",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'vegamovies.dad',
      'dotmovies.bet',
      'imgbb.ink',
      'vegamovies.ngo',
      'vegamovies.ong',
      'vegamovies.yt',
      'image.tmdb.org',
      'www.themoviedb.org',
      'catimages.org',
      'm.media-amazon.com',
      'imagetot.com',
      'myimg.bid',
      'i3.extraimage.xyz',
      'images.justwatch.com',
      'extraimage.net',
      'www.jiopic.com',
      '1.bp.blogspot.com',
      'keepimg.com',
      'img1.imageride.net',
      'img.imageride.net',
      'imgshare.info',
      '3.bp.blogspot.com',
      'vegamovies.cash',
      'vegamovies.rsvp',
      'vegamovies.ph',
      'ww5.gogoanimes.fi',
      'gogocdn.net',
      'vegamovies.ist',
      'luxmovies.vip',
      'vegamovies.mex.com',
      'm.vegamovies.yt',
      'vegamovies.nz',
      'vegamovies.tw',
      'luxmovies.live',
      'microflix.in',
      'microflix.vercel.app',
      "localhost"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vegamovies.dad',
      },
      {
        protocol: 'https',
        hostname: 'dotmovies.bet',
      },
      {
        protocol: 'https',
        hostname: 'imgbb.ink',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.ngo',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.ong',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.yt',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'www.themoviedb.org',
      },
      {
        protocol: 'https',
        hostname: 'catimages.org',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'imagetot.com',
      },
      {
        protocol: 'https',
        hostname: 'myimg.bid',
      },
      {
        protocol: 'https',
        hostname: 'i3.extraimage.xyz',
      },
      {
        protocol: 'https',
        hostname: 'images.justwatch.com',
      },
      {
        protocol: 'https',
        hostname: 'extraimage.net',
      },
      {
        protocol: 'https',
        hostname: 'www.jiopic.com',
      },
      {
        protocol: 'https',
        hostname: '1.bp.blogspot.com',
      },
      {
        protocol: 'https',
        hostname: 'keepimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img1.imageride.net',
      },
      {
        protocol: 'https',
        hostname: 'img.imageride.net',
      },
      {
        protocol: 'https',
        hostname: 'imgshare.info',
      },
      {
        protocol: 'https',
        hostname: '3.bp.blogspot.com',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.cash',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.rsvp',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.ph',
      },
      {
        protocol: 'https',
        hostname: 'ww5.gogoanimes.fi',
      },
      {
        protocol: 'https',
        hostname: 'gogocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.ist',
      },
      {
        protocol: 'https',
        hostname: 'luxmovies.vip',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.mex.com',
      },
      {
        protocol: 'https',
        hostname: 'm.vegamovies.yt',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.nz',
      },
      {
        protocol: 'https',
        hostname: 'vegamovies.tw',
      },
      {
        protocol: 'https',
        hostname: 'luxmovies.live',
      },
    ],
  },
};

module.exports = nextConfig;
