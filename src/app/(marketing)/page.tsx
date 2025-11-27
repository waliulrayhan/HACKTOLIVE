'use client'

import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  useClipboard,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  AvatarGroup,
  Divider,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react'
import type { Metadata, NextPage } from 'next'
import Image from 'next/image'
import Lottie from 'lottie-react'
import {
  FiArrowRight,
  FiBox,
  FiCheck,
  FiCode,
  FiCopy,
  FiFlag,
  FiGrid,
  FiLock,
  FiSearch,
  FiSliders,
  FiSmile,
  FiTerminal,
  FiThumbsUp,
  FiToggleLeft,
  FiTrendingUp,
  FiUserPlus,
  FiShield,
  FiAward,
  FiUsers,
  FiTarget,
  FiBookOpen,
  FiZap,
  FiGlobe,
  FiActivity,
  FiStar,
  FiTool,
} from 'react-icons/fi'

import * as React from 'react'

import { ButtonLink } from '@/components/shared/button-link/button-link'
import { keyframes } from '@chakra-ui/react'
import { Faq } from '@/components/marketing/faq'
import { Features } from '@/components/marketing/features'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { Hero } from '@/components/marketing/hero'
import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from '@/components/marketing/highlights'
import { ChakraLogo, NextjsLogo } from '@/components/marketing/logos'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { Pricing } from '@/components/marketing/pricing/pricing'
import { Testimonial, Testimonials } from '@/components/marketing/testimonials'
import { Em } from '@/components/shared/typography'
import faq from '@/lib/config/data/faq'
import pricing from '@/lib/config/data/pricing'
import testimonials from '@/lib/config/data/testimonials'

export const meta: Metadata = {
  title: 'HackToLive - Cybersecurity & Ethical Hacking Platform',
  description: 'Bangladesh\'s premier cybersecurity platform offering professional security services and ethical hacking academy with courses in Bengali.',
}

const Home: NextPage = () => {
  return (
    <Box>
      <HeroSection />

      <ServicesOverviewSection />

      <AcademyProgramsSection />

      <KeyAchievementsSection />

      <TestimonialsSection />

      <TrustedBySection />

      <FeaturesSection />

      <PricingSection />

      <FaqSection />

      <FinalCTASection />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  const overlayBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.700')
  const videoFilter = useColorModeValue('brightness(1.2) contrast(0.9)', 'brightness(0.7)')
  const accentColor = useColorModeValue('green.500', 'green.400')
  
  const [animationData, setAnimationData] = React.useState<any>(null)

  React.useEffect(() => {
    // Load local astronaut animation
    fetch('/astronaut-with-space-shuttle.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Animation error:', error))
  }, [])
  
  return (
    <Box 
      position="relative" 
      overflow="hidden"
      height="100vh"
    >
      {/* Background Video */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="-2"
        overflow="hidden"
      >
        <Box
          as="video"
          autoPlay
          loop
          muted
          playsInline
          position="absolute"
          top="50%"
          left="50%"
          minWidth="100%"
          minHeight="100%"
          width="auto"
          height="auto"
          transform="translate(-50%, -50%)"
          objectFit="cover"
          filter={videoFilter}
          style={{ willChange: 'filter' }}
        >
          <source src="/sample vedio.mp4" type="video/mp4" />
        </Box>
        {/* Adaptive overlay for better text readability */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg={overlayBg}
          style={{ willChange: 'background-color' }}
        />
      </Box>
      
      <Container 
        maxW="container.xl" 
        pt={{ base: '80px', md: '140px', lg: '180px' }} 
        pb={{ base: '60px', md: '80px', lg: '100px' }}
        height="100%"
        display="flex"
        alignItems="center"
      >
        <Stack direction={{ base: 'column', lg: 'row' }} alignItems="center" width="100%" spacing={{ base: '8', lg: '12' }}>
          <VStack 
            flex="1" 
            alignItems={{ base: 'center', md: 'flex-start' }} 
            spacing={{ base: '4', md: '8' }}
            maxW={{ base: '100%', lg: '50%' }}
            width="100%"
            px={{ base: '2', sm: '3', md: '0' }}
          >
            <FallInPlace>
              <Heading
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                lineHeight="1.2"
                textAlign={{ base: 'center', md: 'left' }}
              >
                Master Cybersecurity
                <Br />
                Defend Bangladesh
              </Heading>
            </FallInPlace>

            <FallInPlace delay={0.2}>
              <Text 
                fontSize={{ base: 'md', sm: 'lg', md: 'xl' }} 
                fontWeight="medium"
                textAlign={{ base: 'center', md: 'left' }}
              >
                HackToLive is <Em>Bangladesh's premier cybersecurity platform</Em>
                offering professional security services and
                ethical hacking education in Bengali.
              </Text>
            </FallInPlace>

            <FallInPlace delay={0.4}>
                <Flex 
                  gap={{ base: '2', sm: '4' }} 
                flexDirection={{ base: 'row', sm: 'row' }}
                  width="100%"
                  justifyContent={{ base: 'center', md: 'flex-start' }}
                >
                  <ButtonLink 
                    colorScheme="primary" 
                    size={{ base: 'md', md: 'lg' }}
                  href="/signup"
                  rightIcon={<Icon as={FiArrowRight} />}
                    flex={{ base: '1', sm: 'none' }}
                  >
                  Start Learning
                  </ButtonLink>
                  <ButtonLink
                    size={{ base: 'md', md: 'lg' }}
                  href="#features"
                    variant="outline"
                    flex={{ base: '1', sm: 'none' }}
                  >
                  Explore Courses
                  </ButtonLink>
                </Flex>
            </FallInPlace>

            <FallInPlace delay={0.3}>
              <Flex 
                direction={{ base: 'row', sm: 'row' }} 
                gap={{ base: '8', sm: '10', md: '12' }} 
                pt="4"
                width="100%"
                justify={{ base: 'center', md: 'flex-start' }}
                style={{ willChange: 'transform, opacity' }}
              >
                <VStack 
                  alignItems="center" 
                  spacing="1" 
                  flex={{ base: '1', sm: 'none' }}
                  animation="float 3s ease-in-out infinite"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                    5000+
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} textAlign="center" whiteSpace="nowrap">
                    Students Trained
                  </Text>
                </VStack>
                <VStack 
                  alignItems="center" 
                  spacing="1" 
                  flex={{ base: '1', sm: 'none' }}
                  animation="float 3s ease-in-out infinite"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                    animationDelay: '0.5s',
                  }}
                >
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                    50+
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} textAlign="center" whiteSpace="nowrap">
                    Security Audits
                  </Text>
                </VStack>
                <VStack 
                  alignItems="center" 
                  spacing="1" 
                  flex={{ base: '1', sm: 'none' }}
                  animation="float 3s ease-in-out infinite"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                    animationDelay: '1s',
                  }}
                >
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                    100%
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} textAlign="center" whiteSpace="nowrap">
                    Bengali Content
                  </Text>
                </VStack>
              </Flex>
            </FallInPlace>
          </VStack>

          {/* Lottie Animation - Desktop (absolute positioned) */}
          <Box
            position="absolute"
            display={{ base: 'none', lg: 'flex' }}
            right={{ lg: '5%', xl: '8%' }}
            top="50%"
            transform="translateY(-50%)"
            alignItems="center"
            justifyContent="center"
            style={{ willChange: 'transform, opacity' }}
          >
            <FallInPlace delay={0.4}>
              <Box style={{ willChange: 'transform' }}>
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{ width: '600px', height: '600px', willChange: 'transform' }}
                    rendererSettings={{
                      preserveAspectRatio: 'xMidYMid slice',
                      progressiveLoad: true,
                    }}
                  />
                )}
              </Box>
            </FallInPlace>
          </Box>

          {/* Lottie Animation - Mobile (bottom, small, centered) */}
          <Box
            display={{ base: 'flex', lg: 'none' }}
            alignItems="center"
            justifyContent="center"
            width="100%"
            mt="4"
            style={{ willChange: 'transform, opacity' }}
          >
            <FallInPlace delay={0.3}>
              <Box style={{ willChange: 'transform' }}>
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{ width: '250px', height: '250px', willChange: 'transform' }}
                    rendererSettings={{
                      preserveAspectRatio: 'xMidYMid slice',
                      progressiveLoad: true,
                    }}
                  />
                )}
              </Box>
            </FallInPlace>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

const ServicesOverviewSection = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const accentColor = useColorModeValue('green.500', 'green.400')
  const hoverBg = useColorModeValue('green.50', 'green.900')
  const hoverBorder = useColorModeValue('green.500', 'green.400')

  const services = [
    {
      icon: FiShield,
      title: 'Penetration Testing',
      description: 'Comprehensive security testing for web and mobile applications to identify vulnerabilities.',
      color: 'blue',
      features: ['Web App Testing', 'Mobile Security', 'API Testing', 'Network Pentesting']
    },
    {
      icon: FiSearch,
      title: 'Vulnerability Assessment',
      description: 'Thorough security evaluations with detailed remediation guidance and compliance reports.',
      color: 'purple',
      features: ['Infrastructure Audit', 'Code Review', 'Security Scanning', 'Risk Analysis']
    },
    {
      icon: FiActivity,
      title: 'SOC Services',
      description: '24/7 security monitoring and incident response to protect your organization.',
      color: 'red',
      features: ['Threat Monitoring', 'Incident Response', 'Log Analysis', 'Security Alerts']
    },
    {
      icon: FiGlobe,
      title: 'OSINT & Forensics',
      description: 'Intelligence gathering and digital forensics investigation services.',
      color: 'cyan',
      features: ['OSINT Investigation', 'Digital Forensics', 'Threat Intelligence', 'Evidence Analysis']
    },
  ]

  return (
    <Box py={{ base: '16', md: '24' }} bg={bgColor} position="relative" overflow="hidden">
      {/* Background decoration */}
      <Box
        position="absolute"
        top="0"
        right="0"
        width="400px"
        height="400px"
        borderRadius="full"
        bg={accentColor}
        opacity="0.05"
        filter="blur(100px)"
        pointerEvents="none"
      />
      
      <Container maxW="container.xl">
        <VStack spacing={{ base: '8', md: '12' }}>
          <FallInPlace>
            <VStack spacing="4" textAlign="center">
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px="3" 
                py="1" 
                borderRadius="full"
                animation="slideInDown 0.5s ease-out"
                sx={{
                  '@keyframes slideInDown': {
                    '0%': { transform: 'translateY(-20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                  },
                }}
              >
                Professional Services
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                Enterprise-Grade Security Solutions
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted" maxW="3xl">
                Protect your business with our comprehensive cybersecurity services delivered by certified professionals
              </Text>
            </VStack>
          </FallInPlace>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: '6', md: '8' }} width="100%">
            {services.map((service, index) => (
              <FallInPlace key={service.title} delay={0.1 * index}>
                <Card
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  _hover={{
                    transform: 'translateY(-8px)',
                    borderColor: hoverBorder,
                    bg: hoverBg,
                    shadow: 'xl',
                  }}
                  height="100%"
                >
                  <CardBody p={{ base: '6', md: '8' }}>
                    <VStack align="start" spacing="4" height="100%">
                      <Flex
                        width="60px"
                        height="60px"
                        borderRadius="xl"
                        bg={`${service.color}.50`}
                        _dark={{ bg: `${service.color}.900` }}
                        align="center"
                        justify="center"
                        animation="pulse 2s ease-in-out infinite"
                        sx={{
                          '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.05)', opacity: 0.9 },
                          },
                        }}
                      >
                        <Icon as={service.icon} boxSize="8" color={`${service.color}.500`} />
                      </Flex>
                      
                      <VStack align="start" spacing="2" flex="1">
                        <Heading size="md">{service.title}</Heading>
                        <Text color="muted" fontSize="md">
                          {service.description}
                        </Text>
                      </VStack>

                      <Wrap spacing="2">
                        {service.features.map((feature) => (
                          <Tag
                            key={feature}
                            size="sm"
                            colorScheme={service.color}
                            borderRadius="full"
                          >
                            {feature}
                          </Tag>
                        ))}
                      </Wrap>
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>
            ))}
          </SimpleGrid>

          <FallInPlace delay={0.5}>
            <ButtonLink
              colorScheme="primary"
              size="lg"
              href="/service"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              View All Services
            </ButtonLink>
          </FallInPlace>
        </VStack>
      </Container>
    </Box>
  )
}

const AcademyProgramsSection = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const accentColor = useColorModeValue('green.500', 'green.400')
  const hoverBg = useColorModeValue('green.50', 'green.900')

  const programs = [
    {
      icon: FiBookOpen,
      title: 'Ethical Hacking Fundamentals',
      level: 'Beginner',
      duration: '8 Weeks',
      students: '2000+',
      description: 'Start your cybersecurity journey with comprehensive basics in Bengali.',
      topics: ['Linux Basics', 'Networking', 'Basic Tools', 'Web Fundamentals'],
      color: 'green'
    },
    {
      icon: FiTool,
      title: 'Web Application Pentesting',
      level: 'Intermediate',
      duration: '10 Weeks',
      students: '1500+',
      description: 'Master web application security testing with hands-on practice.',
      topics: ['OWASP Top 10', 'BurpSuite', 'SQL Injection', 'XSS'],
      color: 'blue'
    },
    {
      icon: FiTarget,
      title: 'Advanced Penetration Testing',
      level: 'Advanced',
      duration: '12 Weeks',
      students: '800+',
      description: 'Become an expert with advanced exploitation techniques.',
      topics: ['Metasploit', 'Post Exploitation', 'Privilege Escalation', 'Red Teaming'],
      color: 'purple'
    },
    {
      icon: FiFlag,
      title: 'CTF & Bug Bounty',
      level: 'All Levels',
      duration: 'Ongoing',
      students: '1000+',
      description: 'Join competitions and earn from bug bounty programs.',
      topics: ['CTF Challenges', 'Bug Hunting', 'Write-ups', 'Live Practice'],
      color: 'orange'
    },
  ]

  return (
    <Box py={{ base: '16', md: '24' }} position="relative">
      <Container maxW="container.xl">
        <VStack spacing={{ base: '8', md: '12' }}>
          <FallInPlace>
            <VStack spacing="4" textAlign="center">
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px="3" 
                py="1" 
                borderRadius="full"
                animation="slideInDown 0.5s ease-out"
                sx={{
                  '@keyframes slideInDown': {
                    '0%': { transform: 'translateY(-20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                  },
                }}
              >
                Academy Programs
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                Learn Cybersecurity in Bengali
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted" maxW="3xl">
                Structured learning paths from beginner to expert with hands-on labs and real-world scenarios
              </Text>
            </VStack>
          </FallInPlace>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: '6', md: '6' }} width="100%">
            {programs.map((program, index) => (
              <FallInPlace key={program.title} delay={0.1 * index}>
                <Card
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  _hover={{
                    transform: 'translateY(-8px)',
                    borderColor: `${program.color}.500`,
                    bg: hoverBg,
                    shadow: 'xl',
                  }}
                  height="100%"
                >
                  <CardBody p={{ base: '5', md: '6' }}>
                    <VStack align="start" spacing="4" height="100%">
                      <Flex
                        width="50px"
                        height="50px"
                        borderRadius="lg"
                        bg={`${program.color}.50`}
                        _dark={{ bg: `${program.color}.900` }}
                        align="center"
                        justify="center"
                        transition="all 0.3s ease"
                        _hover={{
                          transform: 'rotate(10deg) scale(1.1)',
                        }}
                      >
                        <Icon as={program.icon} boxSize="6" color={`${program.color}.500`} />
                      </Flex>

                      <VStack align="start" spacing="2" flex="1">
                        <Heading size="sm" fontSize={{ base: 'md', md: 'lg' }}>
                          {program.title}
                        </Heading>
                        
                        <HStack spacing="2" flexWrap="wrap">
                          <Badge colorScheme={program.color} fontSize="xs">
                            {program.level}
                          </Badge>
                          <Badge colorScheme="gray" fontSize="xs">
                            {program.duration}
                          </Badge>
                        </HStack>

                        <Text color="muted" fontSize="sm">
                          {program.description}
                        </Text>

                        <Wrap spacing="1" pt="2">
                          {program.topics.map((topic) => (
                            <Tag key={topic} size="sm" variant="subtle" colorScheme={program.color}>
                              {topic}
                            </Tag>
                          ))}
                        </Wrap>
                      </VStack>

                      <Divider />

                      <HStack justify="space-between" width="100%">
                        <HStack>
                          <Icon as={FiUsers} color="muted" boxSize="4" />
                          <Text fontSize="sm" color="muted">{program.students}</Text>
                        </HStack>
                        <Icon as={FiArrowRight} color={`${program.color}.500`} boxSize="5" />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>
            ))}
          </SimpleGrid>

          <FallInPlace delay={0.5}>
            <ButtonLink
              colorScheme="primary"
              size="lg"
              href="/academy"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              Explore All Courses
            </ButtonLink>
          </FallInPlace>
        </VStack>
      </Container>
    </Box>
  )
}

const KeyAchievementsSection = () => {
  const bgColor = useColorModeValue('green.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const accentColor = useColorModeValue('green.500', 'green.400')
  const borderColor = useColorModeValue('green.200', 'green.700')

  const achievements = [
    {
      icon: FiAward,
      number: '10+',
      label: 'Certifications',
      description: 'Industry-recognized credentials',
      color: 'yellow',
      details: ['OSCP', 'CEH', 'CISSP', 'Security+']
    },
    {
      icon: FiTrendingUp,
      number: '5+',
      label: 'Years Experience',
      description: 'In cybersecurity industry',
      color: 'blue',
      details: ['2019-Present', 'Growing Team', 'Trusted Partner']
    },
    {
      icon: FiUsers,
      number: '100+',
      label: 'Clients Served',
      description: 'Across various industries',
      color: 'purple',
      details: ['Banks', 'E-commerce', 'Telecom', 'Government']
    },
    {
      icon: FiShield,
      number: '500+',
      label: 'Security Audits',
      description: 'Successfully completed',
      color: 'green',
      details: ['Web Apps', 'Mobile Apps', 'Networks', 'APIs']
    },
    {
      icon: FiTarget,
      number: '5000+',
      label: 'Students Trained',
      description: 'In ethical hacking',
      color: 'red',
      details: ['Online', 'Offline', 'Corporate', 'University']
    },
    {
      icon: FiFlag,
      number: '50+',
      label: 'CTF Wins',
      description: 'Competition victories',
      color: 'orange',
      details: ['National', 'International', 'H4K2LIV3', 'Community']
    },
  ]

  return (
    <Box py={{ base: '16', md: '24' }} bg={bgColor} position="relative" overflow="hidden">
      {/* Background decoration */}
      <Box
        position="absolute"
        bottom="-100px"
        left="-100px"
        width="500px"
        height="500px"
        borderRadius="full"
        bg={accentColor}
        opacity="0.1"
        filter="blur(120px)"
        pointerEvents="none"
      />
      
      <Container maxW="container.xl">
        <VStack spacing={{ base: '8', md: '12' }}>
          <FallInPlace>
            <VStack spacing="4" textAlign="center">
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px="3" 
                py="1" 
                borderRadius="full"
                animation="slideInDown 0.5s ease-out"
                sx={{
                  '@keyframes slideInDown': {
                    '0%': { transform: 'translateY(-20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                  },
                }}
              >
                Our Achievements
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                Proven Track Record
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted" maxW="3xl">
                Numbers that speak for our expertise and commitment to cybersecurity excellence
              </Text>
            </VStack>
          </FallInPlace>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: '6', md: '8' }} width="100%">
            {achievements.map((achievement, index) => (
              <FallInPlace key={achievement.label} delay={0.1 * index}>
                <Card
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'scale(1.05)',
                    borderColor: `${achievement.color}.500`,
                    shadow: '2xl',
                  }}
                  height="100%"
                >
                  <CardBody p={{ base: '6', md: '8' }} textAlign="center">
                    <VStack spacing="4">
                      <Flex
                        width="70px"
                        height="70px"
                        borderRadius="full"
                        bg={`${achievement.color}.50`}
                        _dark={{ bg: `${achievement.color}.900` }}
                        align="center"
                        justify="center"
                        mx="auto"
                      >
                        <Icon as={achievement.icon} boxSize="8" color={`${achievement.color}.500`} />
                      </Flex>

                      <VStack spacing="2">
                        <Text 
                          fontSize={{ base: '3xl', md: '4xl' }} 
                          fontWeight="bold" 
                          color={accentColor}
                          animation="countUp 1s ease-out"
                          sx={{
                            '@keyframes countUp': {
                              '0%': { transform: 'scale(0.5)', opacity: 0 },
                              '60%': { transform: 'scale(1.1)' },
                              '100%': { transform: 'scale(1)', opacity: 1 },
                            },
                          }}
                        >
                          {achievement.number}
                        </Text>
                        <Heading size="sm" fontSize={{ base: 'lg', md: 'xl' }}>
                          {achievement.label}
                        </Heading>
                        <Text color="muted" fontSize="sm">
                          {achievement.description}
                        </Text>
                      </VStack>

                      <Wrap spacing="2" justify="center">
                        {achievement.details.map((detail) => (
                          <Tag
                            key={detail}
                            size="sm"
                            colorScheme={achievement.color}
                            variant="subtle"
                            borderRadius="full"
                          >
                            {detail}
                          </Tag>
                        ))}
                      </Wrap>
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

const TrustedBySection = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const logoFilter = useColorModeValue('grayscale(100%)', 'grayscale(100%) brightness(0.8)')
  const logoHoverFilter = useColorModeValue('grayscale(0%)', 'grayscale(0%) brightness(1.2)')

  // Sample partners/clients
  const partners = [
    { name: 'Government', category: 'Public Sector' },
    { name: 'BRAC Bank', category: 'Financial' },
    { name: 'Robi Axiata', category: 'Telecom' },
    { name: 'Daraz', category: 'E-commerce' },
    { name: 'BUET', category: 'Education' },
    { name: 'City Bank', category: 'Financial' },
    { name: 'Grameenphone', category: 'Telecom' },
    { name: 'Pathao', category: 'Tech' },
  ]

  return (
    <Box py={{ base: '12', md: '16' }} bg={bgColor} borderY="1px" borderColor={borderColor}>
      <Container maxW="container.xl">
        <VStack spacing={{ base: '8', md: '10' }}>
          <FallInPlace>
            <VStack spacing="3" textAlign="center">
              <Text fontSize="sm" fontWeight="semibold" color="muted" textTransform="uppercase" letterSpacing="wide">
                Trusted By Leading Organizations
              </Text>
              <Heading fontSize={{ base: 'xl', md: '2xl' }}>
                Protecting Bangladesh's Digital Infrastructure
              </Heading>
            </VStack>
          </FallInPlace>

          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={{ base: '6', md: '8' }} width="100%">
            {partners.map((partner, index) => (
              <FallInPlace key={partner.name} delay={0.05 * index}>
                <Card
                  variant="outline"
                  borderRadius="lg"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'md',
                    borderColor: 'green.500',
                  }}
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(72, 187, 120, 0.1), transparent)',
                    animation: 'shimmer 3s infinite',
                  }}
                  sx={{
                    '@keyframes shimmer': {
                      '0%': { left: '-100%' },
                      '100%': { left: '100%' },
                    },
                  }}
                >
                  <CardBody p={{ base: '4', md: '6' }} textAlign="center">
                    <VStack spacing="2">
                      <Flex
                        width="60px"
                        height="60px"
                        borderRadius="lg"
                        bg="gray.100"
                        _dark={{ bg: 'gray.700' }}
                        align="center"
                        justify="center"
                        mx="auto"
                        transition="transform 0.3s ease"
                        _groupHover={{ transform: 'scale(1.1)' }}
                      >
                        <Icon as={FiShield} boxSize="8" color="green.500" />
                      </Flex>
                      <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                        {partner.name}
                      </Text>
                      <Badge colorScheme="green" fontSize="xs">
                        {partner.category}
                      </Badge>
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>
            ))}
          </SimpleGrid>

          <FallInPlace delay={0.5}>
            <HStack spacing="4" pt="4">
              <Icon as={FiCheck} color="green.500" boxSize="5" />
              <Text color="muted" fontSize={{ base: 'sm', md: 'md' }}>
                Protecting 100+ organizations across Bangladesh since 2019
              </Text>
            </HStack>
          </FallInPlace>
        </VStack>
      </Container>
    </Box>
  )
}

const FinalCTASection = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, green.400, green.600)',
    'linear(to-br, green.600, green.800)'
  )
  const overlayBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.700')

  return (
    <Box position="relative" overflow="hidden">
      {/* Background with gradient */}
      <Box bgGradient={bgGradient} py={{ base: '16', md: '24' }}>
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          width="300px"
          height="300px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(60px)"
          pointerEvents="none"
          animation="floatSlow 6s ease-in-out infinite"
          sx={{
            '@keyframes floatSlow': {
              '0%, 100%': { transform: 'translate(0, 0)' },
              '50%': { transform: 'translate(-20px, -20px)' },
            },
          }}
        />
        <Box
          position="absolute"
          bottom="-50px"
          left="-50px"
          width="300px"
          height="300px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(60px)"
          pointerEvents="none"
          animation="floatSlow 8s ease-in-out infinite"
          sx={{
            '@keyframes floatSlow': {
              '0%, 100%': { transform: 'translate(0, 0)' },
              '50%': { transform: 'translate(20px, 20px)' },
            },
          }}
        />

        <Container maxW="container.xl" position="relative" zIndex="1">
          <FallInPlace>
            <VStack spacing={{ base: '6', md: '8' }} textAlign="center" color="white">
              <VStack spacing="4">
                <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                  Ready to Secure Your Future?
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="3xl" opacity="0.9">
                  Whether you need professional security services or want to start your cybersecurity journey,
                  we're here to help you succeed.
                </Text>
              </VStack>

              <HStack spacing={{ base: '3', md: '4' }} flexWrap="wrap" justify="center">
                <ButtonLink
                  size="lg"
                  bg="white"
                  color="green.600"
                  _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-2px)' }}
                  rightIcon={<Icon as={FiArrowRight} />}
                  href="/signup"
                  px={{ base: '6', md: '8' }}
                >
                  Get Started Today
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200', borderColor: 'white' }}
                  href="/contact"
                  px={{ base: '6', md: '8' }}
                >
                  Contact Us
                </ButtonLink>
              </HStack>

              <HStack spacing="8" pt="4" flexWrap="wrap" justify="center">
                <HStack>
                  <Icon as={FiShield} boxSize="5" />
                  <Text fontSize="sm">Trusted Security</Text>
                </HStack>
                <HStack>
                  <Icon as={FiUsers} boxSize="5" />
                  <Text fontSize="sm">5000+ Students</Text>
                </HStack>
                <HStack>
                  <Icon as={FiAward} boxSize="5" />
                  <Text fontSize="sm">Certified Experts</Text>
                </HStack>
              </HStack>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  )
}



const FeaturesSection = () => {
  return (
    <Features
      id="features"
      title={
        <Heading
          lineHeight="short"
          fontSize={['2xl', null, '4xl']}
          textAlign="left"
          as="p"
        >
          Why Choose
          <Br /> HackToLive?
        </Heading>
      }
      description={
        <>
          We provide comprehensive cybersecurity services and education.
          <Br />
          From professional security audits to hands-on ethical hacking courses,
          we've got you covered.
        </>
      }
      align="left"
      columns={[1, 2, 3]}
      iconSize={4}
      features={[
        {
          title: 'Penetration Testing.',
          icon: FiBox,
          description:
            'Comprehensive web and mobile application security testing to identify vulnerabilities before attackers do.',
          variant: 'inline',
        },
        {
          title: 'Vulnerability Assessment.',
          icon: FiLock,
          description:
            'Thorough security evaluations of your infrastructure and applications with detailed remediation guidance.',
          variant: 'inline',
        },
        {
          title: 'Digital Forensics.',
          icon: FiSearch,
          description:
            'Expert investigation and analysis services for security incidents and digital evidence collection.',
          variant: 'inline',
        },
        {
          title: 'Academy Courses.',
          icon: FiUserPlus,
          description:
            'Structured ethical hacking courses taught in Bengali, from fundamentals to advanced penetration testing.',
          variant: 'inline',
        },
        {
          title: 'CTF Participation.',
          icon: FiFlag,
          description:
            "Join our H4K2LIV3_Academy team in competitive cybersecurity challenges. Learn by competing with the best.",
          variant: 'inline',
        },
        {
          title: 'SOC Services.',
          icon: FiTrendingUp,
          description:
            'Security Operations Center monitoring and incident response to keep your organization protected 24/7.',
          variant: 'inline',
        },
        {
          title: 'OSINT.',
          icon: FiToggleLeft,
          description:
            'Open Source Intelligence investigations and reconnaissance for security assessments and threat analysis.',
          variant: 'inline',
        },
        {
          title: 'Practical Labs.',
          icon: FiTerminal,
          description:
            'Hands-on training environments with real-world scenarios, teaching tools like Metasploit, BurpSuite, and Nmap.',
          variant: 'inline',
        },
        {
          title: 'Expert Team.',
          icon: FiCode,
          description: (
            <>
              Learn from security professionals with extensive experience in{' '}
              <Link href="https://ctftime.org">CTF competitions</Link> and real-world pentesting.
            </>
          ),
          variant: 'inline',
        },
      ]}
    />
  )
}

const TestimonialsSection = () => {
  const columns = React.useMemo(() => {
    return testimonials.items.reduce<Array<typeof testimonials.items>>(
      (columns, t, i) => {
        columns[i % 3].push(t)

        return columns
      },
      [[], [], []],
    )
  }, [])

  return (
    <Testimonials
      title={testimonials.title}
      columns={[1, 2, 3]}
      innerWidth="container.xl"
    >
      <>
        {columns.map((column, i) => (
          <Stack key={i} spacing="8">
            {column.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
          </Stack>
        ))}
      </>
    </Testimonials>
  )
}

const PricingSection = () => {
  return (
    <Pricing {...pricing}>
      <Text p="8" textAlign="center" color="muted">
        VAT may be applicable depending on your location.
      </Text>
    </Pricing>
  )
}

const FaqSection = () => {
  return <Faq {...faq} />
}

export default Home
