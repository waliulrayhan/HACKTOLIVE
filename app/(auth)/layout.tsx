import { ChakraProvider } from '../chakra-provider'

export default function AuthLayout(props: { children: React.ReactNode }) {
  return <ChakraProvider>{props.children}</ChakraProvider>
}
