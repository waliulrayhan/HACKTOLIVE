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
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiCompass,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
  FiTarget,
} from 'react-icons/fi'
import { ConsultationModal } from './_components/ConsultationModal'
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const pageBg = useColorModeValue('gray.50', '#030712')
  const heroGradient = useColorModeValue(
    'linear(128deg, #0a0f1f 0%, #0d1b2c 50%, #052e2b 100%)',
    'linear(128deg, #05080f 0%, #081121 50%, #052918 100%)'
  )
  const panelBg = useColorModeValue('white', 'rgba(10, 16, 30, 0.9)')
  const panelBorder = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.2)')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')

  const highlightMeta: Record<string, { icon: any; insight: string }> = {
    'Security Engagements': {
      icon: FiShield,
      insight: 'Delivered across enterprise, startup, and public-sector environments.',
    },
    'Learners Trained': {
      icon: FiBookOpen,
      insight: 'Hands-on practical learning through live cohorts and labs.',
    },
    'Client Renewal Rate': {
      icon: FiRefreshCw,
      insight: 'Long-term delivery relationships built on measurable outcomes.',
    },
    'Incident Coverage': {
      icon: FiActivity,
      insight: 'Always-on support model for detection, escalation, and response.',
    },
  }

  const engagementMethodology = [
    {
      step: '01',
      title: 'Scoping & NDA',
      description: 'Define targets, rules of engagement, timelines, and sign mutual NDA before execution.',
      icon: FiTarget,
    },
    {
      step: '02',
      title: 'Reconnaissance',
      description: 'Passive and active intelligence gathering to map attack surface and exposure paths.',
      icon: FiCompass,
    },
    {
      step: '03',
      title: 'Exploitation',
      description: 'Controlled attack simulation aligned with modern adversary techniques.',
      icon: FiAlertCircle,
    },
    {
      step: '04',
      title: 'Reporting',
      description: 'Executive summary plus technical deep-dive with severity, evidence, and fix roadmap.',
      icon: FiFileText,
    },
    {
      step: '05',
      title: 'Remediation Support',
      description: 'Guided verification sessions with your team to close findings correctly.',
      icon: FiCheckCircle,
    },
    {
      step: '06',
      title: 'Retest & Sign-off',
      description: 'Retest critical and high issues and issue final closure confirmation.',
      icon: FiRefreshCw,
    },
  ]

  const engagementIncludes = [
    {
      step: '01',
      title: 'Executive Summary Report',
      description: 'Board-ready summary of findings, risk impact, and strategic recommendations.',
    },
    {
      step: '02',
      title: 'Technical Findings Report',
      description: 'Detailed writeups with CVSS scoring, proof evidence, and reproduction path.',
    },
    {
      step: '03',
      title: 'Remediation Roadmap',
      description: 'Prioritized fix guidance by business impact and exploitability.',
    },
    {
      step: '04',
      title: 'Retest for Critical & High',
      description: 'Validation of key remediations after your team applies fixes.',
    },
    {
      step: '05',
      title: 'Debrief Session',
      description: 'Live walkthrough for engineering and leadership stakeholders.',
    },
    {
      step: '06',
      title: 'Certificate of Testing',
      description: 'Signed completion certificate with scope and assessment methodology.',
    },
  ]

  const clientFeedback = [
    {
      quote:
        'HackToLive identified a critical authentication bypass our internal team had missed. The report was practical, and the retest confirmed complete remediation.',
      name: 'Tanvir Ahmed',
      role: 'CTO, FinTech startup - Dhaka',
    },
    {
      quote:
        'Professional, discreet, and highly thorough. Executive reporting was clear enough for leadership while technical details were strong for engineering.',
      name: 'Sabrina Rahman',
      role: 'Head of IT, E-commerce platform',
    },
    {
      quote:
        'We brought in HackToLive before an ISO 27001 audit. They uncovered multiple serious issues and guided fast remediation before audit week - we passed with zero non-conformities.',
      name: 'Masud Khan',
      role: 'CISO, Healthcare SaaS company',
    },
  ]

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
                  onClick={onOpen}
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
        <Box
          borderWidth="1px"
          borderColor={panelBorder}
          borderRadius="2xl"
          bg={useColorModeValue('white', 'rgba(10, 16, 30, 0.9)')}
          p={{ base: 5, md: 7 }}
          boxShadow={useColorModeValue('0 14px 34px rgba(2, 6, 23, 0.07)', 'none')}
          backdropFilter="blur(8px)"
        >
          <HStack justify="space-between" align={{ base: 'start', md: 'center' }} mb={5} flexWrap="wrap" gap={2}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
                Measurable Performance Snapshot
              </Text>
              <Text color={mutedColor} fontSize="sm">
                Trusted delivery metrics across consulting, response, and training programs.
              </Text>
            </VStack>
            <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
              Live Service Benchmarks
            </Badge>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
            {serviceHighlights.map((metric) => {
              const meta = highlightMeta[metric.label]

              return (
                <Box
                  key={metric.label}
                  p={5}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="xl"
                  bg={useColorModeValue('gray.50', 'rgba(15, 23, 42, 0.75)')}
                  _hover={{
                    transform: 'translateY(-3px)',
                    borderColor: useColorModeValue('green.200', 'rgba(52, 211, 153, 0.5)'),
                  }}
                  transition="all 0.25s ease"
                >
                  <HStack justify="space-between" align="start" mb={3}>
                    <Text color="green.300" fontWeight="black" fontSize={{ base: '2xl', md: '3xl' }} lineHeight="1">
                      {metric.value}
                    </Text>
                    {meta ? (
                      <Box
                        p={2}
                        borderRadius="md"
                        bg={useColorModeValue('green.50', 'rgba(16, 185, 129, 0.14)')}
                        color={useColorModeValue('green.700', 'green.300')}
                      >
                        <meta.icon size={18} />
                      </Box>
                    ) : null}
                  </HStack>

                  <Text fontWeight="semibold" mb={1.5}>
                    {metric.label}
                  </Text>

                  {meta ? (
                    <Text color={mutedColor} fontSize="sm" lineHeight="1.7">
                      {meta.insight}
                    </Text>
                  ) : null}
                </Box>
              )
            })}
          </SimpleGrid>
        </Box>

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
                            badgeTone={service.badgeTone}
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
          <VStack align="start" spacing={4} mb={8}>
            <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
              How We Work
            </Badge>
            <Heading as="h3" fontSize={{ base: '2xl', md: '4xl' }}>
              Our Engagement Methodology
            </Heading>
            <Text color={mutedColor} maxW="3xl" lineHeight="1.8">
              Every HackToLive engagement follows a structured, transparent process from scoping to final sign-off.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
            {engagementMethodology.map((item) => (
              <Box
                key={item.step}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="xl"
                p={5}
                bg={useColorModeValue('white', 'rgba(15, 23, 42, 0.75)')}
                _hover={{ borderColor: 'rgba(52, 211, 153, 0.42)', transform: 'translateY(-2px)' }}
                transition="all 0.25s ease"
              >
                <Text color="green.300" fontSize="3xl" lineHeight="1" fontWeight="light" mb={3}>
                  {item.step}
                </Text>
                <HStack spacing={2} mb={3} color="green.300">
                  <item.icon size={16} />
                  <Text fontWeight="semibold">{item.title}</Text>
                </HStack>
                <Text color={mutedColor} fontSize="sm" lineHeight="1.8">
                  {item.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </MotionBox>

        <MotionBox
          mt={{ base: 16, md: 20 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <VStack align="start" spacing={4} mb={8}>
            <Badge colorScheme="yellow" variant="subtle" px={3} py={1} borderRadius="full">
              What You Get
            </Badge>
            <Heading as="h3" fontSize={{ base: '2xl', md: '4xl' }}>
              Every Engagement Includes
            </Heading>
            <Text color={mutedColor} maxW="3xl" lineHeight="1.8">
              Each project is delivered with actionable outputs your team can execute immediately.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
            {engagementIncludes.map((item) => (
              <Box
                key={item.step}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="xl"
                p={5}
                bg={useColorModeValue('white', 'rgba(15, 23, 42, 0.75)')}
              >
                <HStack spacing={4} align="start">
                  <Text color="green.300" fontSize="3xl" lineHeight="1" fontWeight="light" minW="40px">
                    {item.step}
                  </Text>
                  <VStack align="start" spacing={1.5}>
                    <Text fontWeight="semibold">{item.title}</Text>
                    <Text color={mutedColor} fontSize="sm" lineHeight="1.8">
                      {item.description}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </MotionBox>

        <MotionBox
          mt={{ base: 16, md: 20 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <VStack align="start" spacing={4} mb={8}>
            <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
              Client Feedback
            </Badge>
            <Heading as="h3" fontSize={{ base: '2xl', md: '4xl' }}>
              Trusted by Security Teams Across Bangladesh
            </Heading>
            <Text color={mutedColor} maxW="3xl" lineHeight="1.8">
              From startups to enterprise teams, our clients value practical findings and fast remediation support.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
            {clientFeedback.map((item) => (
              <Box
                key={item.name}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="xl"
                p={6}
                bg={useColorModeValue('white', 'rgba(15, 23, 42, 0.75)')}
              >
                <Text color={useColorModeValue('gray.700', 'gray.100')} lineHeight="1.9" mb={5}>
                  {item.quote}
                </Text>
                <HStack justify="space-between" align="end">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text fontSize="sm" color={mutedColor}>{item.role}</Text>
                  </VStack>
                  <HStack spacing={1} color="yellow.400">
                    <FiTrendingUp size={14} />
                    <FiTrendingUp size={14} />
                    <FiTrendingUp size={14} />
                    <FiTrendingUp size={14} />
                    <FiTrendingUp size={14} />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
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
            borderColor="rgba(16, 185, 129, 0.32)"
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            bgGradient={useColorModeValue(
              'linear(135deg, #f8fafc 0%, #ecfdf5 45%, #eef2ff 100%)',
              'linear(135deg, #0b1220 0%, #0f2a2a 45%, #111827 100%)'
            )}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-30%',
              right: '-8%',
              width: '320px',
              height: '320px',
              borderRadius: 'full',
              bg: useColorModeValue('rgba(16, 185, 129, 0.12)', 'rgba(16, 185, 129, 0.16)'),
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          >
            <Grid templateColumns={{ base: '1fr', lg: '1.45fr 1fr' }} gap={8} alignItems="stretch" position="relative" zIndex={1}>
              <GridItem>
                <VStack align="start" spacing={5}>
                  <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                    Consultation Studio
                  </Badge>

                  <Heading as="h3" fontSize={{ base: '2xl', md: '3xl' }} lineHeight="1.2">
                    Get a 30-Minute Security Strategy Session
                  </Heading>

                  <Text color={mutedColor} fontSize={{ base: 'md', md: 'lg' }} maxW="3xl" lineHeight="1.8">
                    Share your current environment and risk priorities. Our specialists will suggest the right
                    service path, timeline, and execution model for your team.
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="full" maxW="3xl">
                    <HStack spacing={3} p={3} borderWidth="1px" borderColor={panelBorder} borderRadius="lg" bg={panelBg}>
                      <FiTarget color="#34d399" />
                      <Text color={mutedColor}>Service recommendation tailored to your goals</Text>
                    </HStack>
                    <HStack spacing={3} p={3} borderWidth="1px" borderColor={panelBorder} borderRadius="lg" bg={panelBg}>
                      <FiClock color="#34d399" />
                      <Text color={mutedColor}>Clear timeline and expected milestones</Text>
                    </HStack>
                    <HStack spacing={3} p={3} borderWidth="1px" borderColor={panelBorder} borderRadius="lg" bg={panelBg}>
                      <FiShield color="#34d399" />
                      <Text color={mutedColor}>Prioritized security outcomes and deliverables</Text>
                    </HStack>
                    <HStack spacing={3} p={3} borderWidth="1px" borderColor={panelBorder} borderRadius="lg" bg={panelBg}>
                      <FiCheckCircle color="#34d399" />
                      <Text color={mutedColor}>No-obligation planning conversation</Text>
                    </HStack>
                  </SimpleGrid>
                </VStack>
              </GridItem>

              <GridItem>
                <VStack
                  spacing={4}
                  align="stretch"
                  p={{ base: 5, md: 6 }}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="xl"
                  bg={panelBg}
                >
                  <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
                    What to Prepare
                  </Text>

                  <VStack spacing={2} align="stretch">
                    <HStack spacing={2} color={mutedColor}>
                      <FiLock />
                      <Text>Current infrastructure overview</Text>
                    </HStack>
                    <HStack spacing={2} color={mutedColor}>
                      <FiLock />
                      <Text>Security pain points or incidents</Text>
                    </HStack>
                    <HStack spacing={2} color={mutedColor}>
                      <FiLock />
                      <Text>Compliance or deadline expectations</Text>
                    </HStack>
                  </VStack>

                  <Button onClick={onOpen} colorScheme="green" size="lg" rightIcon={<FiCompass />}>
                    Start Consultation
                  </Button>

                  <Button as={Link} href="/about" variant="outline" size="lg">
                    Meet HackToLive Team
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

      <ConsultationModal
        isOpen={isOpen}
        onClose={onClose}
        serviceName="General Security Consultation"
        heading="Book a Security Consultation"
      />
    </Box>
  )
}
