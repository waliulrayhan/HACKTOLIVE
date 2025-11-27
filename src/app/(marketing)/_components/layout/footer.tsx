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
  useColorMode,
  Image,
} from '@chakra-ui/react'
import { Link, LinkProps } from '@saas-ui/react'
import { FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaDribbble, FaBehance, FaRss, FaArrowUp } from 'react-icons/fa'
import { useState, useEffect, useMemo, useRef } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion } from 'framer-motion'

import siteConfig from '@/lib/config/data/config'

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { ...rest } = props
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [particlesInit, setParticlesInit] = useState(false)
  const { colorMode } = useColorMode()
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return
      
      const footerRect = footerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Show button only when footer is visible in viewport
      const isFooterVisible = footerRect.top < windowHeight && footerRect.bottom > 0
      
      setShowBackToTop(isFooterVisible)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setParticlesInit(true)
    })
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const particlesOptions = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
      particles: {
        color: {
          value: colorMode === 'dark' ? ['#a3ea2a', '#84cc16', '#06b6d4'] : ['#84cc16', '#6ba80f', '#06b6d4'],
        },
        links: {
          color: colorMode === 'dark' ? '#a3ea2a' : '#84cc16',
          distance: 120,
          enable: true,
          opacity: 0.4,
          width: 1.5,
        },
        move: {
          enable: true,
          outModes: {
            default: 'bounce' as const,
          },
          random: false,
          speed: 0.8,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 600,
          },
          value: 100,
        },
        opacity: {
          value: 0.6,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 4 },
        },
      },
      detectRetina: true,
    }),
    [colorMode]
  )

  return (
    <Box
      ref={footerRef}
      position="relative"
      overflow="hidden"
      bg="gray.50"
      _dark={{ bg: 'gray.900', borderColor: 'gray.800' }}
      borderTop="1px"
      borderColor="gray.200"
      {...rest}
    >
      {/* Particle Animation Background */}
      {particlesInit && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={0}
        >
          <Particles
            id="tsparticles-footer"
            options={particlesOptions}
          />
        </Box>
      )}

      <Container maxW="container.2xl" px={{ base: '8', md: '12', lg: '20' }} py={{ base: '16', md: '20' }} position="relative" zIndex={1}>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 5 }}
          spacing={{ base: '10', md: '14', lg: '16' }}
          mb="16"
          justifyItems="start"
        >
          {/* Logo and Links Column */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 } as any}
          >
            <Stack spacing="8" align="flex-start">
              <Flex>
                <Box 
                  as={motion.div}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 } as any}
                >
                  <Link href="/">
                    <Image 
                      src={colorMode === 'dark' ? '/logo_white.png' : '/logo_black.png'}
                      alt={siteConfig.seo?.title}
                      height={{ base: '22px', sm: '20px', md: '22px', lg: '25px' }}
                      width="auto"
                      objectFit="contain"
                    />
                  </Link>
                </Box>
              </Flex>
              <Stack spacing="4">
                {siteConfig.footer.logoLinks?.map(({ href, label }, index) => (
                  <FooterLink key={`logo-${index}`} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* Resources Column */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 } as any}
          >
            <Stack spacing="8" align="flex-start">
            <Text
              fontSize="md"
              fontWeight="bold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Resources
            </Text>
              <Stack spacing="4">
                {siteConfig.footer.resources?.map(({ href, label }, index) => (
                  <FooterLink key={`resource-${index}`} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* Contact Column */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 } as any}
          >
            <Stack spacing="8" align="flex-start">
            <Text
              fontSize="md"
              fontWeight="bold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Contact
            </Text>
              <Stack spacing="4">
                {siteConfig.footer.contact?.map(({ href, label }, index) => (
                  <FooterLink key={`contact-${index}`} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* Legal Column */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 } as any}
          >
            <Stack spacing="8" align="flex-start">
            <Text
              fontSize="md"
              fontWeight="bold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Legal
            </Text>
              <Stack spacing="4">
                {siteConfig.footer.legal?.map(({ href, label }, index) => (
                  <FooterLink key={`legal-${index}`} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* Press Column */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 } as any}
          >
            <Stack spacing="8" align="flex-start">
            <Text
              fontSize="md"
              fontWeight="bold"
              color="gray.900"
              _dark={{ color: 'white' }}
            >
              Press
            </Text>
              <Stack spacing="4">
                {siteConfig.footer.press?.map(({ href, label }, index) => (
                  <FooterLink key={`press-${index}`} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </Stack>
            </Stack>
          </Box>
        </SimpleGrid>

        <Divider
          my="12"
          borderColor="gray.200"
          _dark={{ borderColor: 'gray.800' }}
        />

        {/* Bottom Section */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap="10"
        >
          {/* Social Icons */}
          <HStack spacing="3">
            {siteConfig.footer.socialIcons?.map(({ href, icon }) => (
              <Link
                key={href}
                href={href}
                isExternal
                _hover={{ opacity: 0.7 }}
              >
                <Icon
                  as={icon}
                  boxSize="4"
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

      {/* Back to Top Button - Only visible when footer is in view */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={showBackToTop ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' } as any}
        position="fixed"
        bottom="6"
        right="6"
        zIndex={1000}
        pointerEvents={showBackToTop ? 'auto' : 'none'}
      >
        <IconButton
          aria-label="Back to top"
          icon={<FaArrowUp />}
          size="md"
          colorScheme="primary"
          onClick={scrollToTop}
          boxShadow="lg"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          }}
          transition="all 0.2s ease"
        />
      </Box>
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
