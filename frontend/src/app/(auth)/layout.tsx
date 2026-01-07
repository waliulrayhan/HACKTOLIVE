import { Box } from '@chakra-ui/react'
import { ChakraProvider } from '../chakra-provider'
import { CartProvider } from '@/context/CartContext'

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <CartProvider>
        <Box minHeight="100vh">
          {props.children}
        </Box>
      </CartProvider>
    </ChakraProvider>
  )
}
