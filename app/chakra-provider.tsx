'use client'

import { AuthProvider } from '@saas-ui/auth'
import { SaasProvider } from '@saas-ui/react'
import { ColorModeScript } from '@chakra-ui/react'

import { theme } from '#theme'

export function ChakraProvider(props: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SaasProvider theme={theme}>
        <AuthProvider>{props.children}</AuthProvider>
      </SaasProvider>
    </>
  )
}
