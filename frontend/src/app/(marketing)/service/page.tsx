import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services - HACKTOLIVE | Web Development & Cybersecurity Solutions',
  description: 'Professional web development, cybersecurity consulting, penetration testing, and custom software solutions. HACKTOLIVE delivers enterprise-grade tech services tailored to your needs.',
  keywords: [
    'web development services',
    'cybersecurity consulting',
    'penetration testing',
    'security audit',
    'custom software development',
    'IT services',
    'tech consulting',
    'security solutions'
  ],
  openGraph: {
    title: 'HACKTOLIVE Services - Web Development & Cybersecurity',
    description: 'Professional web development, cybersecurity consulting, and custom software solutions. Enterprise-grade tech services.',
    url: 'https://hacktolive.io/service',
    siteName: 'HACKTOLIVE',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HACKTOLIVE Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HACKTOLIVE Services - Web Development & Cybersecurity',
    description: 'Professional web development, cybersecurity consulting, and custom software solutions.',
    images: ['/logo.svg'],
  },
}

'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { services } from './_data/services'
import { ServiceCard } from './_components/ServiceCard'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'

export default function ServicesPage() {
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2000')"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: useColorModeValue(
            'linear-gradient(135deg, rgba(26, 32, 44, 0.85) 0%, rgba(45, 55, 72, 0.90) 100%)',
            'linear-gradient(135deg, rgba(26, 32, 44, 0.70) 0%, rgba(45, 55, 72, 0.75) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={6} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                colorScheme="green"
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                Professional Cybersecurity Services
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                color="white"
                lineHeight="shorter"
              >
                Comprehensive Security{' '}
                <Text as="span" color="green.400">
                  Solutions
                </Text>
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.200"
                maxW="3xl"
              >
                Protect your organization from evolving threats with our expert cybersecurity
                services and ensure compliance with industry standards
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Services Grid */}
      <Box py={20}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            mb={12}
          >
            <VStack spacing={4} mb={12}>
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                textAlign="center"
              >
                Choose Your Service
              </Heading>
              <Text
                textAlign="center"
                fontSize="lg"
                color={useColorModeValue('gray.600', 'gray.400')}
                maxW="2xl"
              >
                From vulnerability assessments to compliance certifications, we provide expert
                cybersecurity services to strengthen your security posture
              </Text>
            </VStack>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {services.map((service, index) => (
              <MotionBox
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.shortDescription}
                  icon={service.icon}
                  href={`/service/${service.slug}`}
                  badge={service.badge}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg={sectionBg} py={20}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              bg={cardBg}
              borderRadius="2xl"
              p={{ base: 8, md: 12 }}
              textAlign="center"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              shadow="lg"
            >
              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} mb={4}>
                Not Sure Which Service You Need?
              </Heading>
              <Text fontSize="lg" mb={6} color={useColorModeValue('gray.600', 'gray.400')}>
                Contact our security experts for a free consultation and we'll help you determine
                the best approach for your organization's security needs
              </Text>
              <Box
                as="a"
                href="/contact"
                display="inline-block"
                bg="green.500"
                color="white"
                px={8}
                py={3}
                borderRadius="lg"
                fontWeight="semibold"
                fontSize="lg"
                _hover={{
                  bg: 'green.600',
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                transition="all 0.3s"
              >
                Schedule a Consultation
              </Box>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  )
}
