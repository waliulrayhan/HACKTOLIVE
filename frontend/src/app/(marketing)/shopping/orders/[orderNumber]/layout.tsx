import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Details - HACKTOLIVE Shop',
  description: 'View your order details, shipping information, and order status.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children
}
