import { Outfit } from 'next/font/google'
import '@fontsource-variable/inter'
import '@/styles/globals.css'

import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { GlobalLoading } from '@/components/shared/global-loading'
import { Toaster } from '@/components/ui/toast'

const outfit = Outfit({
  subsets: ['latin'],
})

export const metadata = {
  metadataBase: new URL('https://hacktolive.io'),
  title: {
    default: 'HackToLive - Cybersecurity, Development & Tech Solutions',
    template: '%s | HackToLive',
  },
  description: 'HackToLive offers expert cybersecurity training, web development services, software solutions, and tech consultancy. Learn from industry experts and grow your tech career.',
  keywords: [
    'HackToLive',
    'cybersecurity',
    'ethical hacking',
    'web development',
    'tech training',
    'penetration testing',
    'IT services',
    'online courses',
  ],
  authors: [{ name: 'HackToLive' }],
  creator: 'HackToLive',
  publisher: 'HackToLive',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'HackToLive - Cybersecurity, Development & Tech Solutions',
    description: 'Expert cybersecurity training, web development services, and tech solutions. Learn from industry professionals.',
    url: 'https://hacktolive.io',
    siteName: 'HackToLive',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HackToLive Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HackToLive - Cybersecurity, Development & Tech Solutions',
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
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/favicons/manifest.json" />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <GlobalLoading />
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
