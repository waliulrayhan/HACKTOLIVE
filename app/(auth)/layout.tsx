import { Box } from '@chakra-ui/react'
import { ChakraProvider } from '../chakra-provider'
import { Header } from '#components/layout'
import { Footer } from '#components/layout'

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Header />
        <Box flex="1">{props.children}</Box>
        <Footer />
      </Box>
    </ChakraProvider>
  )
}
