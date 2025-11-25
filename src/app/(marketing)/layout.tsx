import { MarketingLayout } from '@/components/marketing/layout'
import { ChakraProvider } from '../chakra-provider'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <MarketingLayout>{props.children}</MarketingLayout>
    </ChakraProvider>
  )
}
