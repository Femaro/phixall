import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phixall.vercel.app';
  
  const routes = [
    '',
    '/about',
    '/clients',
    '/phixers',
    '/contact',
    '/subscription',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : route === '/clients' || route === '/phixers' ? 0.9 : 0.8,
  }));
}


