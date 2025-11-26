'use client'

import { Box, Flex, Image, useColorMode, VisuallyHidden } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'

import * as React from 'react'

import siteConfig from '@/lib/config/data/config'

export interface LogoProps {
  href?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const Logo = ({ href = '/', onClick }: LogoProps) => {
  const { colorMode } = useColorMode()
  
  const logoSrc = colorMode === 'dark' ? '/logo_white.png' : '/logo_black.png'

  return (
    <Flex 
      h={{ base: '8', md: '10' }} 
      flexShrink="0" 
      alignItems="center"
      justifyContent="center"
    >
      <Link
        href={href}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="1"
        borderRadius="sm"
        onClick={onClick}
      >
        <Image 
          src={logoSrc} 
          alt={siteConfig.seo?.title}
          height={{ base: '22px', sm: '20px', md: '22px', lg: '25px' }}
          width="auto"
          objectFit="contain"
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.05)' }}
        />
        <VisuallyHidden>{siteConfig.seo?.title}</VisuallyHidden>
      </Link>
    </Flex>
  )
}
