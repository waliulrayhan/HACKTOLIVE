'use client'

import {
  Box,
  BoxProps,
  Container,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  Divider,
  IconButton,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link, LinkProps } from '@saas-ui/react'
import { FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaDribbble, FaBehance, FaRss, FaArrowUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

import siteConfig from '#data/config'

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { ...rest } = props
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg="gray.50"
      _dark={{ bg: 'gray.900', borderColor: 'gray.800' }}
      borderTop="1px"
      borderColor="gray.200"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 25%, rgba(59, 130, 246, 0.03) 50%, rgba(139, 92, 246, 0.03) 75%, rgba(99, 102, 241, 0.03) 100%)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 15s ease infinite`,
        opacity: 1,
        _dark: {
          background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 50%, rgba(139, 92, 246, 0.05) 75%, rgba(99, 102, 241, 0.05) 100%)',
        },
      }}
      {...rest}
    >
      <Container maxW="container.2xl" px={{ base: '4', md: '8' }} py={{ base: '12', md: '16' }} position="relative" zIndex={1}>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 5 }}
          spacing={{ base: '8', md: '12' }}
          mb="12"
          justifyItems="center"
        >
          {/* Logo and Links Column */}
          <Stack spacing="6" align="center" textAlign="center">
            <Flex justify="center">
              <Box as={siteConfig.logo} height="32px" />
            </Flex>
            <Stack spacing="3">
              {siteConfig.footer.logoLinks?.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </Stack>
          </Stack>

          {/* Resources Column */}
          <Stack spacing="6" align="center" textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Resources
            </Text>
            <Stack spacing="3">
              {siteConfig.footer.resources?.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </Stack>
          </Stack>

          {/* Contact Column */}
          <Stack spacing="6" align="center" textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Contact
            </Text>
            <Stack spacing="3">
              {siteConfig.footer.contact?.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </Stack>
          </Stack>

          {/* Legal Column */}
          <Stack spacing="6" align="center" textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Legal
            </Text>
            <Stack spacing="3">
              {siteConfig.footer.legal?.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </Stack>
          </Stack>

          {/* Press Column */}
          <Stack spacing="6" align="center" textAlign="center">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Press
            </Text>
            <Stack spacing="3">
              {siteConfig.footer.press?.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>

        <Divider
          mb="8"
          borderColor="gray.200"
          _dark={{ borderColor: 'gray.800' }}
        />

        {/* Bottom Section */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap="6"
        >
          {/* Social Icons */}
          <HStack spacing="4">
            {siteConfig.footer.socialIcons?.map(({ href, icon }) => (
              <Link
                key={href}
                href={href}
                isExternal
                _hover={{ opacity: 0.7 }}
              >
                <Icon
                  as={icon}
                  boxSize="5"
                  color="gray.500"
                  _dark={{ color: 'gray.400' }}
                />
              </Link>
            ))}
          </HStack>

          {/* Bottom Links and Copyright */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: '4', md: '8' }}
            align={{ base: 'flex-start', md: 'center' }}
          >
            <HStack spacing="6" fontSize="sm">
              {siteConfig.footer.bottomLinks?.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </HStack>
            <Copyright>{siteConfig.footer.copyright}</Copyright>
          </Flex>
        </Flex>
      </Container>

      {/* Back to Top Button */}
      {showBackToTop && (
        <IconButton
          aria-label="Back to top"
          icon={<FaArrowUp />}
          position="fixed"
          bottom="8"
          right="8"
          size="md"
          colorScheme="blue"
          onClick={scrollToTop}
          zIndex={1000}
          boxShadow="lg"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          }}
          transition="all 0.3s ease"
        />
      )}
    </Box>
  )
}

export interface CopyrightProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export const Copyright: React.FC<CopyrightProps> = ({
  title,
  children,
}: CopyrightProps) => {
  let content
  if (title && !children) {
    content = `© ${new Date().getFullYear()} - ${title}`
  }
  return (
    <Text
      color="gray.500"
      _dark={{ color: 'gray.400' }}
      fontSize="sm"
    >
      {content || children}
    </Text>
  )
}

export const FooterLink: React.FC<LinkProps> = (props) => {
  const { children, ...rest } = props
  return (
    <Link
      color="gray.600"
      _dark={{ color: 'gray.400' }}
      fontSize="sm"
      textDecoration="none"
      _hover={{
        color: 'gray.900',
        _dark: { color: 'white' },
        transition: 'color .2s ease-in',
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
