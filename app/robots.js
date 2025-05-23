export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '',
      },
      sitemap: 'https://microflix.in/api/sitemap',
    }
  }