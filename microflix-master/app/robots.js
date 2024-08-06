export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '',
      },
      sitemap: 'https://microflix.vercel.app/api/sitemap',
    }
  }