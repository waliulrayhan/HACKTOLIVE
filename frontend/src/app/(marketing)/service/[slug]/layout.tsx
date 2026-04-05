import { Metadata } from 'next'
import { getServiceBySlug, serviceCategoryMap } from '../_data/services'

interface ServiceLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'Service Not Found - HackToLive',
      description: 'The service you are looking for could not be found.',
    }
  }

  const category = serviceCategoryMap[service.categoryId]
  const pageTitle = `${service.title} | ${category.label} - HackToLive`
  const pageDescription = service.shortDescription

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      service.title,
      category.label,
      'HackToLive service',
      'cybersecurity',
      'penetration testing',
      'security consulting',
      'Bangladesh cybersecurity',
    ],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://hacktolive.net/service/${slug}`,
      siteName: 'HackToLive',
      images: [
        {
          url: '/logo.svg',
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: ['/logo.svg'],
    },
  }
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children
}
