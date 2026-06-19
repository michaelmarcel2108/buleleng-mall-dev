import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/api/', 
        '/_next/', 
        '/admin/login'
      ],
    },
    sitemap: 'https://bulelengmall.com/sitemap.xml', //belum deploy nunggu uang publish
  };
}