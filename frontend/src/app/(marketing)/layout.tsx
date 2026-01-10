import { MarketingLayout } from './_components/layout'
import { ChakraProvider } from '../chakra-provider'
import { CartProvider } from '@/context/CartContext'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HACKTOLIVE - Cybersecurity, Development & Tech Solutions',
  description: 'HACKTOLIVE offers expert cybersecurity training, web development services, software solutions, and tech consultancy. Learn from industry experts, build secure applications, and grow your career in technology.',
  keywords: [
    'cybersecurity',
    'ethical hacking',
    'web development',
    'software development',
    'tech training',
    'penetration testing',
    'security consulting',
    'online courses',
    'IT services',
    'HACKTOLIVE'
  ],
  authors: [{ name: 'HACKTOLIVE' }],
  openGraph: {
    title: 'HACKTOLIVE - Cybersecurity, Development & Tech Solutions',
    description: 'Expert cybersecurity training, web development services, and tech solutions. Learn from industry professionals and advance your tech career.',
    url: 'https://hacktolive.io',
    siteName: 'HACKTOLIVE',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HACKTOLIVE Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HACKTOLIVE - Cybersecurity, Development & Tech Solutions',
    description: 'Expert cybersecurity training, web development services, and tech solutions.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <CartProvider>
        <MarketingLayout>{props.children}</MarketingLayout>
      </CartProvider>
    </ChakraProvider>
  )
}
