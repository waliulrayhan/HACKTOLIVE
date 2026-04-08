import type { MetadataRoute } from 'next'

const BASE_URL = 'https://hacktolive.net'

const routes = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/blog',
  '/academy',
  '/academy/courses',
  '/academy/instructors',
  '/career-paths',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))
}
