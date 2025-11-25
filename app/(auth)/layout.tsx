import { Box } from '@chakra-ui/react'
import { ChakraProvider } from '../chakra-provider'

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <Box minHeight="100vh">
        {props.children}
      </Box>
    </ChakraProvider>
  )
}
