'use client'

import Link from 'next/link'
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiArrowRight, FiCompass, FiShield } from 'react-icons/fi'
import { ServiceCard } from './_components/ServiceCard'
import {
  getServicesByCategory,
  serviceCategories,
  serviceHighlights,
  serviceTrustPillars,
} from './_data/services'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'

export default function ServicesPage() {
  const pageBg = useColorModeValue('gray.50', '#030712')
  const heroGradient = useColorModeValue(
    'linear(128deg, #0a0f1f 0%, #0d1b2c 50%, #052e2b 100%)',
    'linear(128deg, #05080f 0%, #081121 50%, #052918 100%)'
  )
  const panelBg = useColorModeValue('white', 'rgba(10, 16, 30, 0.9)')
  const panelBorder = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.2)')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Box bg={pageBg}>
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 28, md: 36 }}
        pb={{ base: 16, md: 20 }}
        bgGradient={heroGradient}
        borderBottomWidth="1px"
        borderColor={panelBorder}
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          bgImage:
            'radial-gradient(circle at 20% 20%, rgba(34,197,94,0.22) 0%, transparent 35%), radial-gradient(circle at 80% 10%, rgba(56,189,248,0.15) 0%, transparent 28%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.12) 0%, transparent 35%)',
          pointerEvents: 'none',
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={7} maxW="5xl" mx="auto" textAlign="center">
              <Badge
                px={4}
                py={1.5}
                borderRadius="full"
                borderWidth="1px"
                borderColor="rgba(34,197,94,0.45)"
                bg="rgba(22, 101, 52, 0.28)"
                color="green.200"
                fontWeight="semibold"
                letterSpacing="0.03em"
              >
                Bangladesh&#39;s Premier Cybersecurity Partner
              </Badge>

              <Heading as="h1" fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }} color="white" lineHeight="1.12">
                Offensive Security.{' '}
                <Text as="span" color="green.300">
                  Defensive Strength.
                </Text>{' '}
                Real-World Results.
              </Heading>

              <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.200" maxW="4xl" lineHeight="1.9">
                HackToLive delivers enterprise-grade penetration testing, security assessments, SOC operations,
                forensics, and practical cybersecurity training. We help you reduce cyber risk with clear,
                measurable outcomes.
              </Text>

              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  as={Link}
                  href="/contact"
                  rightIcon={<FiArrowRight />}
                  colorScheme="green"
                  size="lg"
                  px={8}
                >
                  Request a Consultation
                </Button>
                <Button
                  as={Link}
                  href="/academy"
                  variant="outline"
                  size="lg"
                  px={8}
                  borderColor="rgba(148, 163, 184, 0.45)"
                  color="gray.100"
                  _hover={{ bg: 'rgba(15, 23, 42, 0.8)' }}
                >
                  Explore Academy
                </Button>
              </HStack>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      <Container maxW="container.xl" mt={{ base: -6, md: -8 }} pb={{ base: 16, md: 24 }}>
        <Grid
          templateColumns={{ base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }}
          borderWidth="1px"
          borderColor={panelBorder}
          borderRadius="2xl"
          overflow="hidden"
          bg={panelBg}
          backdropFilter="blur(8px)"
        >
          {serviceHighlights.map((metric) => (
            <GridItem key={metric.label} p={{ base: 5, md: 6 }} borderRightWidth={{ base: 0, lg: '1px' }} borderBottomWidth={{ base: '1px', lg: 0 }} borderColor={panelBorder}>
              <Text color="green.300" fontWeight="bold" fontSize={{ base: '2xl', md: '3xl' }} lineHeight="1">
                {metric.value}
              </Text>
              <Text mt={2} color={useColorModeValue('gray.600', 'gray.300')} fontWeight="medium" letterSpacing="0.01em">
                {metric.label}
              </Text>
            </GridItem>
          ))}
        </Grid>

        <MotionBox
          mt={{ base: 16, md: 20 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <VStack align="start" spacing={4} mb={8}>
            <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
              Our Services
            </Badge>
            <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }}>
              Comprehensive Security Programs, Built for Real Threats
            </Heading>
            <Text color={mutedColor} fontSize={{ base: 'md', md: 'lg' }} maxW="4xl">
              Choose from offensive testing, governance assessments, SOC operations, and practical training.
              Every service is designed to produce measurable security outcomes, not just reports.
            </Text>
          </VStack>

          <Tabs variant="unstyled" isLazy>
            <TabList
              display="inline-flex"
              borderWidth="1px"
              borderColor={panelBorder}
              borderRadius="xl"
              bg={useColorModeValue('gray.100', 'rgba(10, 16, 30, 0.9)')}
              p={1.5}
              mb={8}
              flexWrap="wrap"
              gap={1}
            >
              {serviceCategories.map((category) => (
                <Tab
                  key={category.id}
                  borderRadius="lg"
                  px={5}
                  py={2.5}
                  fontWeight="semibold"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  _selected={{
                    bg: useColorModeValue('white', 'rgba(30, 41, 59, 0.9)'),
                    color: useColorModeValue('gray.900', 'white'),
                    boxShadow: 'sm',
                  }}
                >
                  {category.label}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {serviceCategories.map((category) => {
                const categoryServices = getServicesByCategory(category.id)

                return (
                  <TabPanel key={category.id} px={0} py={0}>
                    <Box mb={6}>
                      <Heading as="h3" fontSize={{ base: 'xl', md: '2xl' }}>
                        {category.heading}
                      </Heading>
                      <Text mt={2} color={mutedColor} maxW="4xl">
                        {category.description}
                      </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                      {categoryServices.map((service, index) => (
                        <MotionBox
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-80px' }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                        >
                          <ServiceCard
                            title={service.title}
                            description={service.shortDescription}
                            icon={service.icon}
                            href={`/service/${service.slug}`}
                            badge={service.badge}
                            categoryLabel={category.label}
                          />
                        </MotionBox>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                )
              })}
            </TabPanels>
          </Tabs>
        </MotionBox>

        <MotionBox
          mt={{ base: 16, md: 20 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <Box
            borderWidth="1px"
            borderColor={panelBorder}
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            bg={panelBg}
          >
            <Grid templateColumns={{ base: '1fr', lg: '1.6fr 1fr' }} gap={8} alignItems="center">
              <GridItem>
                <Badge colorScheme="green" variant="subtle" mb={3} px={3} py={1} borderRadius="full">
                  Free Consultation
                </Badge>
                <Heading as="h3" fontSize={{ base: '2xl', md: '3xl' }} mb={3}>
                  Not Sure Where to Start?
                </Heading>
                <Text color={mutedColor} fontSize={{ base: 'md', md: 'lg' }}>
                  Talk to our security advisors. We will review your current security posture, business risk,
                  and compliance objectives, then recommend the right service plan with no obligation.
                </Text>
              </GridItem>

              <GridItem>
                <VStack spacing={3} align="stretch">
                  <Button as={Link} href="/contact" colorScheme="green" size="lg" rightIcon={<FiCompass />}>
                    Book Free Consultation
                  </Button>
                  <Button as={Link} href="/about" variant="outline" size="lg">
                    Learn More About Us
                  </Button>
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        </MotionBox>

        <MotionBox
          mt={{ base: 16, md: 20 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <VStack spacing={4} textAlign="center" mb={8}>
            <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
              Why HackToLive
            </Badge>
            <Heading as="h3" fontSize={{ base: '2xl', md: '4xl' }}>
              Built by Hackers. Trusted by Professionals.
            </Heading>
            <Text color={mutedColor} maxW="3xl">
              We combine offensive realism with business-aligned reporting so security leaders and technical teams can act with confidence.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
            {serviceTrustPillars.map((pillar) => (
              <Box
                key={pillar.title}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="xl"
                p={6}
                bg={panelBg}
              >
                <HStack mb={3} spacing={2} color="green.400">
                  <FiShield />
                  <Text fontWeight="semibold">{pillar.title}</Text>
                </HStack>
                <Text color={mutedColor} fontSize="sm" lineHeight="1.8">
                  {pillar.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  )
}
