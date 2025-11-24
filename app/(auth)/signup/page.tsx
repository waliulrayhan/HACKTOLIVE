'use client'

import { Box, Center, Stack, Text } from '@chakra-ui/react'
import { Auth } from '@saas-ui/auth'
import { Link } from '@saas-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { FaGithub, FaGoogle } from 'react-icons/fa'

import { Features } from '#components/features'
import { BackgroundGradient } from '#components/gradients/background-gradient'
import { PageTransition } from '#components/motion/page-transition'
import { Section } from '#components/section'
import siteConfig from '#data/config'

const providers = {
  google: {
    name: 'Google',
    icon: FaGoogle,
  },
  github: {
    name: 'Github',
    icon: FaGithub,
    variant: 'solid',
  },
}

const Login: NextPage = () => {
  return (
    <Section minHeight="calc(100vh - 200px)" innerWidth="container.xl" display="flex" alignItems="center" justifyContent="center">
      <BackgroundGradient
        zIndex="-1"
        width={{ base: 'full', lg: '50%' }}
        left="auto"
        right="0"
        borderLeftWidth="1px"
        borderColor="gray.200"
        _dark={{
          borderColor: 'gray.700',
        }}
      />
      <PageTransition width="100%" display="flex" alignItems="center" justifyContent="center">
        <Stack
          width="100%"
          alignItems="center"
          spacing={{ base: '8', lg: '20' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          justifyContent="center"
          py={{ base: '8', md: '0' }}
        >
          <Box pe={{ base: '0', lg: '20' }} width={{ base: '100%', lg: 'auto' }}>
            <NextLink href="/">
              <Box
                as={siteConfig.logo}
                width="160px"
                ms={{ base: '0', lg: '4' }}
                mb={{ base: '8', lg: 16 }}
                mx={{ base: 'auto', lg: '0' }}
              />
            </NextLink>
            <Features
              display={{ base: 'none', lg: 'flex' }}
              columns={1}
              iconSize={4}
              flex="1"
              py="0"
              ps="0"
              maxW={{ base: '100%', xl: '80%' }}
              features={siteConfig.signup.features.map((feature) => ({
                iconPosition: 'left',
                variant: 'left-icon',

                ...feature,
              }))}
            />
          </Box>
          <Center height="100%" flex="1" width="100%">
            <Box 
              width={{ base: '100%', sm: 'container.sm' }} 
              maxW="100%"
              pt={{ base: '0', md: '8' }}
            >
              <Auth
                view="signup"
                title={siteConfig.signup.title}
                providers={providers}
                loginLink={<Link href="/login">Log in</Link>}
              >
                <Text color="muted" fontSize="sm">
                  By signing up you agree to our{' '}
                  <Link href={siteConfig.termsUrl} color="white">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href={siteConfig.privacyUrl} color="white">
                    Privacy Policy
                  </Link>
                </Text>
              </Auth>
            </Box>
          </Center>
        </Stack>
      </PageTransition>
    </Section>
  )
}

export default Login
