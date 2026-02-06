import { Metadata } from 'next'

interface ProductLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  // Transform slug to title
  const productTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return {
    title: `${productTitle} - HackToLive Shop`,
    description: `Buy ${productTitle} from HackToLive. Quality tech products with secure checkout and fast delivery.`,
    keywords: [
      productTitle,
      'buy tech product',
      'cybersecurity tools',
      'tech equipment',
      'HackToLive shop',
    ],
    openGraph: {
      title: `${productTitle} - HackToLive Shop`,
      description: `Buy ${productTitle} from HackToLive. Quality products with secure checkout and fast delivery.`,
      url: `https://hacktolive.io/shopping/${slug}`,
      siteName: 'HackToLive',
      images: [
        {
          url: '/logo.svg',
          width: 1200,
          height: 630,
          alt: productTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productTitle} - HackToLive Shop`,
      description: `Buy ${productTitle} from HackToLive.`,
      images: ['/logo.svg'],
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
