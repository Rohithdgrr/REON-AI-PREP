
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://reon.ai';

  // Public pages
  const publicPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];

  // Dashboard pages (assuming they are accessible after login, but good to have for discoverability if ever public)
  const dashboardPages: MetadataRoute.Sitemap = [
    '/',
    '/knowledge-hub',
    '/mock',
    '/notifications',
    '/podcasts',
    '/practice',
    '/prep',
    '/quiz',
    '/roadmap',
    '/settings',
    '/suggestions',
  ].map((route) => ({
    url: `${baseUrl}/dashboard${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...publicPages, ...dashboardPages];
}
