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
} from '@chakra-ui/react'
import { Link, LinkProps } from '@saas-ui/react'
import { FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaDribbble, FaBehance, FaRss } from 'react-icons/fa'

import siteConfig from '#data/config'

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { ...rest } = props
  return (
    <Box
      bg="gray.50"
      _dark={{ bg: 'gray.900', borderColor: 'gray.800' }}
      borderTop="1px"
      borderColor="gray.200"
      {...rest}
    >
      <Container maxW="container.2xl" px={{ base: '4', md: '8' }} py={{ base: '12', md: '16' }}>
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
