import { Metadata } from 'next'
import { services } from '../_data/services'

interface ServiceLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return {
      title: 'Service Not Found - HACKTOLIVE',
      description: 'The service you are looking for could not be found.',
    }
  }

  return {
    title: `${service.title} - HACKTOLIVE Services`,
    description: service.shortDescription,
    keywords: [
      service.title,
      'HACKTOLIVE service',
      'cybersecurity',
      'tech services',
      'consulting',
    ],
    openGraph: {
      title: `${service.title} - HACKTOLIVE`,
      description: service.shortDescription,
      url: `https://hacktolive.io/service/${slug}`,
      siteName: 'HACKTOLIVE',
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
      title: `${service.title} - HACKTOLIVE`,
      description: service.shortDescription,
      images: ['/logo.svg'],
    },
  }
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children
}
