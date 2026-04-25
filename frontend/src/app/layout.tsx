import { Outfit } from 'next/font/google'
import Script from 'next/script'
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
  metadataBase: new URL('https://hacktolive.net'),
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
    icon: [
      { url: '/brand.png', type: 'image/png' },
    ],
    shortcut: ['/brand.png'],
    apple: [{ url: '/brand.png', type: 'image/png' }],
  },
  openGraph: {
    title: 'HackToLive - Cybersecurity, Development & Tech Solutions',
    description: 'Expert cybersecurity training, web development services, and tech solutions. Learn from industry professionals.',
    url: 'https://hacktolive.net',
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
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PJTV3JTX');`}
        </Script>
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PJTV3JTX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
