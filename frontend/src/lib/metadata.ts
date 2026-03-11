/**
 * Metadata Utilities for HackToLive
 * 
 * This file contains utility functions and constants for generating
 * consistent metadata across the application.
 */

export const SITE_CONFIG = {
  name: 'HackToLive',
  url: 'https://hacktolive.net',
  description: 'Expert cybersecurity training, web development services, and tech solutions.',
  ogImage: '/logo.svg', // Replace with actual OG image path when available (1200x630)
  links: {
    twitter: 'https://twitter.com/hacktolive',
    github: 'https://github.com/hacktolive',
    linkedin: 'https://linkedin.com/company/hacktolive',
  },
} as const

/**
 * Generate canonical URL for a page
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash and ensure path starts with /
  const normalizedPath = path.replace(/\/$/, '').replace(/^([^/])/, '/$1')
  return `${SITE_CONFIG.url}${normalizedPath}`
}

/**
 * Generate Open Graph image object
 */
export function getOgImage(imageUrl?: string) {
  return {
    url: imageUrl || SITE_CONFIG.ogImage,
    width: 1200,
    height: 630,
    alt: SITE_CONFIG.name,
  }
}

/**
 * Generate default metadata object
 */
export function getDefaultMetadata(overrides?: {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  path?: string
}) {
  const title = overrides?.title || SITE_CONFIG.name
  const description = overrides?.description || SITE_CONFIG.description
  const url = overrides?.path ? getCanonicalUrl(overrides.path) : SITE_CONFIG.url

  return {
    title,
    description,
    keywords: overrides?.keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [getOgImage(overrides?.ogImage)],
      locale: 'en_US',
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [overrides?.ogImage || SITE_CONFIG.ogImage],
    },
  }
}

/**
 * Common SEO keywords
 */
export const COMMON_KEYWORDS = {
  cybersecurity: [
    'cybersecurity',
    'ethical hacking',
    'penetration testing',
    'web security',
    'network security',
    'security audit',
  ],
  development: [
    'web development',
    'software development',
    'full stack development',
    'custom software',
    'tech solutions',
  ],
  training: [
    'online courses',
    'tech training',
    'cybersecurity courses',
    'professional certification',
    'hands-on learning',
  ],
  services: [
    'IT consulting',
    'tech consulting',
    'security consulting',
    'IT services',
    'tech services',
  ],
} as const
