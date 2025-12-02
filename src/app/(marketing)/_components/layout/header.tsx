'use client'

import {
  Box,
  BoxProps,
  Container,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import { usePathname } from 'next/navigation'

import * as React from 'react'

import { Logo } from './logo'
import Navigation from './navigation'

export interface HeaderProps extends Omit<BoxProps, 'children'> {}

export const Header = (props: HeaderProps) => {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const [y, setY] = React.useState(0)
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}
  const pathname = usePathname()

  const { scrollY } = useScroll()
  React.useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith('/login') || 
                     pathname?.startsWith('/signup') || 
                     pathname?.startsWith('/reset-password') ||
                     pathname?.startsWith('/verify-otp')

  const bgScrolled = useColorModeValue('whiteAlpha.800', 'rgba(29, 32, 37, 0.7)')
  const bgDefault = useColorModeValue('whiteAlpha.700', 'transparent')

  return (
    <Box
      ref={ref}
      as="header"
      top="0"
      w="full"
      position="fixed"
      backdropFilter="blur(5px)"
      zIndex="sticky"
      borderColor="whiteAlpha.100"
      transitionProperty="common"
      transitionDuration="normal"
      bg={isAuthPage ? 'transparent' : (y > height ? bgScrolled : bgDefault)}
      boxShadow={isAuthPage ? '' : (y > height ? 'md' : '')}
      borderBottomWidth={isAuthPage ? '' : (y > height ? '1px' : '')}
      {...props}
    >
      <Container maxW="container.2xl" px={{ base: '8', md: '12', lg: '20' }} py="4">
        <Flex width="full" align="center" justify="space-between">
          <Logo
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
            }}
          />
          <Navigation />
        </Flex>
      </Container>
    </Box>
  )
}
