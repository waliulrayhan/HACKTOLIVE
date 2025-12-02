import { Outfit } from 'next/font/google'
import '@fontsource-variable/inter'
import '@/styles/globals.css'

import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { GlobalLoading } from '@/components/shared/global-loading'

const outfit = Outfit({
  subsets: ['latin'],
})

export const metadata = {
  title: 'HACKTOLIVE',
  description: 'Platform with landing page, authentication, and admin dashboard',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'HACKTOLIVE',
    description: 'Platform with landing page, authentication, and admin dashboard',
    images: ['/logo.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HACKTOLIVE',
    description: 'Platform with landing page, authentication, and admin dashboard',
    images: ['/logo.svg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <GlobalLoading />
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
