import { MarketingLayout } from './_components/layout'
import { ChakraProvider } from '../chakra-provider'
import { CartProvider } from '@/context/CartContext'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <CartProvider>
        <MarketingLayout>{props.children}</MarketingLayout>
      </CartProvider>
    </ChakraProvider>
  )
}
