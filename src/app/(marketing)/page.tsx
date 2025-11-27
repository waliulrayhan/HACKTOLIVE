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
  FiPlay,
  FiClock,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
} from 'react-icons/fi'

import * as React from 'react'

import { ButtonLink } from '@/components/shared/button-link/button-link'
import { Faq } from './_components/faq'
import { Features } from './_components/features'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { Hero } from './_components/hero'
import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from './_components/highlights'
import { ChakraLogo, NextjsLogo } from './_components/logos'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { Pricing } from './_components/pricing/pricing'
import { Testimonial, Testimonials } from './_components/testimonials'
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

      <VideoShowcaseSection />

      <TrustedBySection />

      <PhotoGallerySection />

      <BlogSection />

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
                  Get Started
                  </ButtonLink>
                  <ButtonLink
                    size={{ base: 'md', md: 'lg' }}
                  href="/academy"
                    variant="outline"
                    flex={{ base: '1', sm: 'none' }}
                  >
                  Enroll in Academy
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
                  // animation="float 3s ease-in-out infinite"
                  // sx={{
                  //   '@keyframes float': {
                  //     '0%, 100%': { transform: 'translateY(0px)' },
                  //     '50%': { transform: 'translateY(-10px)' },
                  //   },
                  // }}
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
                  // animation="float 3s ease-in-out infinite"
                  // sx={{
                  //   '@keyframes float': {
                  //     '0%, 100%': { transform: 'translateY(0px)' },
                  //     '50%': { transform: 'translateY(-10px)' },
                  //   },
                  //   animationDelay: '0.5s',
                  // }}
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
                  // animation="float 3s ease-in-out infinite"
                  // sx={{
                  //   '@keyframes float': {
                  //     '0%, 100%': { transform: 'translateY(0px)' },
                  //     '50%': { transform: 'translateY(-10px)' },
                  //   },
                  //   animationDelay: '1s',
                  // }}
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
  const [activeService, setActiveService] = React.useState(0)

  const services = [
    {
      icon: FiShield,
      title: 'Penetration Testing',
      description: 'Comprehensive security testing for web and mobile applications to identify vulnerabilities.',
      color: 'blue',
      features: ['Web App Testing', 'Mobile Security', 'API Testing', 'Network Pentesting'],
      image: '/images/grid-image/image-01.png'
    },
    {
      icon: FiSearch,
      title: 'Vulnerability Assessment',
      description: 'Thorough security evaluations with detailed remediation guidance and compliance reports.',
      color: 'purple',
      features: ['Infrastructure Audit', 'Code Review', 'Security Scanning', 'Risk Analysis'],
      image: '/images/grid-image/image-02.png'
    },
    {
      icon: FiActivity,
      title: 'SOC Services',
      description: '24/7 security monitoring and incident response to protect your organization.',
      color: 'red',
      features: ['Threat Monitoring', 'Incident Response', 'Log Analysis', 'Security Alerts'],
      image: '/images/grid-image/image-03.png'
    },
    {
      icon: FiGlobe,
      title: 'OSINT & Forensics',
      description: 'Intelligence gathering and digital forensics investigation services.',
      color: 'cyan',
      features: ['OSINT Investigation', 'Digital Forensics', 'Threat Intelligence', 'Evidence Analysis'],
      image: '/images/grid-image/image-04.png'
    },
  ]

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Touch handlers for mobile swipe support
  const touchStartXRef = React.useRef<number | null>(null)
  const touchCurrentXRef = React.useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null
    touchCurrentXRef.current = touchStartXRef.current
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentXRef.current = e.touches[0]?.clientX ?? touchCurrentXRef.current
  }

  const handleTouchEnd = () => {
    const start = touchStartXRef.current
    const end = touchCurrentXRef.current
    if (start == null || end == null) return

    const delta = start - end
    const threshold = 50 // px

    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        // swiped left -> next
        setActiveService((prev) => (prev + 1) % services.length)
      } else {
        // swiped right -> previous
        setActiveService((prev) => (prev - 1 + services.length) % services.length)
      }
    }

    touchStartXRef.current = null
    touchCurrentXRef.current = null
  }

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

          {/* Featured Service Carousel */}
          <Box
            width="100%"
            position="relative"
            mb="8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Featured services carousel"
          >
            <Card
              bg={cardBg}
              borderWidth="2px"
              borderColor={`${services[activeService].color}.500`}
              borderRadius="2xl"
              overflow="hidden"
              transition="all 0.5s ease"
            >
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="0">
                <Box position="relative" height={{ base: '300px', lg: '400px' }}>
                  <Image
                    src={services[activeService].image}
                    alt={services[activeService].title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bgGradient={`linear(to-r, ${services[activeService].color}.500, ${services[activeService].color}.600)`}
                    opacity="0.3"
                  />
                </Box>
                <CardBody p={{ base: '8', md: '12' }}>
                  <VStack align="start" spacing="6" height="100%">
                    <Flex
                      width="80px"
                      height="80px"
                      borderRadius="2xl"
                      bg={`${services[activeService].color}.50`}
                      _dark={{ bg: `${services[activeService].color}.900` }}
                      align="center"
                      justify="center"
                    >
                      <Icon as={services[activeService].icon} boxSize="10" color={`${services[activeService].color}.500`} />
                    </Flex>
                    
                    <VStack align="start" spacing="3" flex="1">
                      <Heading size="lg">{services[activeService].title}</Heading>
                      <Text color="muted" fontSize="lg">
                        {services[activeService].description}
                      </Text>
                    </VStack>

                    <Wrap spacing="3">
                      {services[activeService].features.map((feature) => (
                        <Tag
                          key={feature}
                          size="md"
                          colorScheme={services[activeService].color}
                          borderRadius="full"
                        >
                          {feature}
                        </Tag>
                      ))}
                    </Wrap>

                    <HStack spacing="2" pt="4">
                      {services.map((_, index) => (
                        <Box
                          key={index}
                          width={activeService === index ? '40px' : '12px'}
                          height="4px"
                          borderRadius="full"
                          bg={activeService === index ? `${services[activeService].color}.500` : 'gray.300'}
                          cursor="pointer"
                          onClick={() => setActiveService(index)}
                          transition="all 0.3s ease"
                        />
                      ))}
                    </HStack>
                  </VStack>
                </CardBody>
              </Grid>
            </Card>
            
            <IconButton
              aria-label="Previous service"
              icon={<FiChevronLeft />}
              position="absolute"
              left="4"
              top="50%"
              transform="translateY(-50%)"
              onClick={() => setActiveService((prev) => (prev - 1 + services.length) % services.length)}
              colorScheme="whiteAlpha"
              bg="blackAlpha.600"
              _hover={{ bg: 'blackAlpha.800' }}
              size="lg"
              borderRadius="full"
              display={{ base: 'none', md: 'flex' }}
            />
            <IconButton
              aria-label="Next service"
              icon={<FiChevronRight />}
              position="absolute"
              right="4"
              top="50%"
              transform="translateY(-50%)"
              onClick={() => setActiveService((prev) => (prev + 1) % services.length)}
              colorScheme="whiteAlpha"
              bg="blackAlpha.600"
              _hover={{ bg: 'blackAlpha.800' }}
              size="lg"
              borderRadius="full"
              display={{ base: 'none', md: 'flex' }}
            />
          </Box>

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
      color: 'green',
      image: '/images/cards/card-01.jpg',
      instructor: {
        name: 'Md. Rayhan Ahmed',
        title: 'Senior Security Researcher',
        avatar: '/images/user/user-01.jpg',
        certifications: ['OSCP', 'CEH']
      },
      rating: 4.8,
      reviews: 450
    },
    {
      icon: FiTool,
      title: 'Web Application Pentesting',
      level: 'Intermediate',
      duration: '10 Weeks',
      students: '1500+',
      description: 'Master web application security testing with hands-on practice.',
      topics: ['OWASP Top 10', 'BurpSuite', 'SQL Injection', 'XSS'],
      color: 'blue',
      image: '/images/cards/card-02.jpg',
      instructor: {
        name: 'Fahim Hassan',
        title: 'Penetration Testing Lead',
        avatar: '/images/user/user-02.jpg',
        certifications: ['OSWE', 'OSCE']
      },
      rating: 4.9,
      reviews: 380
    },
    {
      icon: FiTarget,
      title: 'Advanced Penetration Testing',
      level: 'Advanced',
      duration: '12 Weeks',
      students: '800+',
      description: 'Become an expert with advanced exploitation techniques.',
      topics: ['Metasploit', 'Post Exploitation', 'Privilege Escalation', 'Red Teaming'],
      color: 'purple',
      image: '/images/cards/card-03.jpg',
      instructor: {
        name: 'Sakib Rahman',
        title: 'Red Team Specialist',
        avatar: '/images/user/user-03.jpg',
        certifications: ['OSEP', 'CRTO']
      },
      rating: 4.7,
      reviews: 220
    },
    {
      icon: FiFlag,
      title: 'CTF & Bug Bounty',
      level: 'All Levels',
      duration: 'Ongoing',
      students: '1000+',
      description: 'Join competitions and earn from bug bounty programs.',
      topics: ['CTF Challenges', 'Bug Hunting', 'Write-ups', 'Live Practice'],
      color: 'orange',
      image: '/images/cards/card-01.jpg',
      instructor: {
        name: 'Tanvir Islam',
        title: 'Bug Bounty Hunter',
        avatar: '/images/user/user-04.jpg',
        certifications: ['CTF Champion', 'HackerOne MVH']
      },
      rating: 4.9,
      reviews: 520
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
                    shadow: 'xl',
                  }}
                  height="100%"
                >
                  {/* Course Image */}
                  <Box position="relative" height="180px">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <Badge
                      position="absolute"
                      top="3"
                      right="3"
                      colorScheme={program.color}
                    >
                      {program.level}
                    </Badge>
                  </Box>

                  <CardBody p={{ base: '5', md: '6' }}>
                    <VStack align="start" spacing="4" height="100%">
                      <VStack align="start" spacing="2" flex="1" width="100%">
                        <Heading size="sm" fontSize={{ base: 'md', md: 'lg' }} noOfLines={2}>
                          {program.title}
                        </Heading>
                        
                        {/* Rating */}
                        <HStack spacing="2">
                          <HStack spacing="1">
                            <Icon as={FiStar} color="yellow.400" boxSize="4" fill="currentColor" />
                            <Text fontWeight="bold" fontSize="sm">{program.rating}</Text>
                          </HStack>
                          <Text fontSize="xs" color="muted">({program.reviews} reviews)</Text>
                        </HStack>

                        <Text color="muted" fontSize="sm" noOfLines={2}>
                          {program.description}
                        </Text>

                        <Wrap spacing="1" pt="1">
                          {program.topics.slice(0, 3).map((topic) => (
                            <Tag key={topic} size="sm" variant="subtle" colorScheme={program.color}>
                              {topic}
                            </Tag>
                          ))}
                        </Wrap>
                      </VStack>

                      <Divider />

                      {/* Instructor Info */}
                      <HStack width="100%" spacing="3">
                        <Avatar
                          src={program.instructor.avatar}
                          name={program.instructor.name}
                          size="sm"
                        />
                        <VStack align="start" spacing="0" flex="1">
                          <Text fontSize="xs" fontWeight="semibold" noOfLines={1}>
                            {program.instructor.name}
                          </Text>
                          <Text fontSize="xs" color="muted" noOfLines={1}>
                            {program.instructor.title}
                          </Text>
                        </VStack>
                      </HStack>

                      <Divider />

                      <HStack justify="space-between" width="100%">
                        <HStack>
                          <Icon as={FiUsers} color="muted" boxSize="4" />
                          <Text fontSize="sm" color="muted">{program.students}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiClock} color="muted" boxSize="4" />
                          <Text fontSize="sm" color="muted">{program.duration}</Text>
                        </HStack>
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
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const [counts, setCounts] = React.useState({ certifications: 0, years: 0, clients: 0, audits: 0, students: 0, ctf: 0 })

  const achievements = [
    {
      icon: FiAward,
      number: 10,
      suffix: '+',
      label: 'Certifications',
      description: 'Industry-recognized credentials',
      color: 'yellow',
      details: ['OSCP', 'CEH', 'CISSP', 'Security+'],
      key: 'certifications'
    },
    {
      icon: FiTrendingUp,
      number: 5,
      suffix: '+',
      label: 'Years Experience',
      description: 'In cybersecurity industry',
      color: 'blue',
      details: ['2019-Present', 'Growing Team', 'Trusted Partner'],
      key: 'years'
    },
    {
      icon: FiUsers,
      number: 100,
      suffix: '+',
      label: 'Clients Served',
      description: 'Across various industries',
      color: 'purple',
      details: ['Banks', 'E-commerce', 'Telecom', 'Government'],
      key: 'clients'
    },
    {
      icon: FiShield,
      number: 500,
      suffix: '+',
      label: 'Security Audits',
      description: 'Successfully completed',
      color: 'green',
      details: ['Web Apps', 'Mobile Apps', 'Networks', 'APIs'],
      key: 'audits'
    },
    {
      icon: FiTarget,
      number: 5000,
      suffix: '+',
      label: 'Students Trained',
      description: 'In ethical hacking',
      color: 'red',
      details: ['Online', 'Offline', 'Corporate', 'University'],
      key: 'students'
    },
    {
      icon: FiFlag,
      number: 50,
      suffix: '+',
      label: 'CTF Wins',
      description: 'Competition victories',
      color: 'orange',
      details: ['National', 'International', 'H4K2LIV3', 'Community'],
      key: 'ctf'
    },
  ]

  React.useEffect(() => {
    if (!hasAnimated) {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      achievements.forEach((achievement) => {
        let currentStep = 0
        const increment = achievement.number / steps
        
        const timer = setInterval(() => {
          currentStep++
          setCounts((prev) => ({
            ...prev,
            [achievement.key]: Math.min(Math.round(increment * currentStep), achievement.number)
          }))
          
          if (currentStep >= steps) {
            clearInterval(timer)
          }
        }, stepDuration)
      })
      
      setHasAnimated(true)
    }
  }, [hasAnimated])

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
                        >
                          {counts[achievement.key as keyof typeof counts]}{achievement.suffix}
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

const VideoShowcaseSection = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [activeVideo, setActiveVideo] = React.useState('/sample vedio.mp4')

  const videos = [
    { 
      title: 'Penetration Testing Demo', 
      duration: '5:30', 
      views: '2.3K',
      url: '/sample vedio.mp4',
      thumbnail: '/images/video-thumb/thumb-16.png'
    },
    { 
      title: 'Student Success Stories', 
      duration: '3:45', 
      views: '1.8K',
      url: '/sample vedio.mp4',
      thumbnail: '/images/video-thumb/thumb-16.png'
    },
    { 
      title: 'CTF Competition Highlights', 
      duration: '4:20', 
      views: '3.1K',
      url: '/sample vedio.mp4',
      thumbnail: '/images/video-thumb/thumb-16.png'
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
              >
                Video Showcase
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                See Our Work in Action
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted" maxW="3xl">
                Watch demonstrations of our security testing and training programs
              </Text>
            </VStack>
          </FallInPlace>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="6" width="100%">
            <FallInPlace delay={0.2}>
              <Card
                bg={cardBg}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="2xl"
                overflow="hidden"
                position="relative"
                height={{ base: '300px', md: '400px', lg: '500px' }}
              >
                <Box 
                  width="100%" 
                  height="100%"
                  as="video"
                  src={activeVideo}
                  controls
                  autoPlay={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  borderRadius="16px"
                  objectFit="cover"
                  sx={{
                    '&::-webkit-media-controls-panel': {
                      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.8))',
                    },
                  }}
                />
              </Card>
            </FallInPlace>

            <VStack spacing="6" align="stretch">
              {videos.map((video, index) => (
                <FallInPlace key={video.title} delay={0.3 + index * 0.1}>
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    overflow="hidden"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'translateX(8px)',
                      borderColor: 'green.500',
                      shadow: 'md',
                    }}
                  >
                    <CardBody p="4">
                      <HStack spacing="4">
                        <Flex
                          width="60px"
                          height="60px"
                          borderRadius="lg"
                          bg="green.50"
                          _dark={{ bg: 'green.900' }}
                          align="center"
                          justify="center"
                          flexShrink="0"
                        >
                          <Icon as={FiPlay} boxSize="6" color="green.500" />
                        </Flex>
                        <VStack align="start" spacing="1" flex="1">
                          <Text fontWeight="semibold" fontSize="sm">{video.title}</Text>
                          <HStack spacing="3" fontSize="xs" color="muted">
                            <HStack spacing="1">
                              <Icon as={FiClock} />
                              <Text>{video.duration}</Text>
                            </HStack>
                            <HStack spacing="1">
                              <Icon as={FiUsers} />
                              <Text>{video.views} views</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </FallInPlace>
              ))}
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}

const PhotoGallerySection = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const overlayBg = useColorModeValue('blackAlpha.700', 'blackAlpha.800')
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null)

  const galleryImages = [
    { 
      src: '/images/grid-image/image-01.png', 
      title: 'Security Workshop 2024', 
      category: 'Training',
      description: 'Hands-on penetration testing workshop with 50+ participants',
      tall: true
    },
    { 
      src: '/images/grid-image/image-02.png', 
      title: 'CTF Competition', 
      category: 'Events',
      description: 'National CTF championship finals',
      tall: false
    },
    { 
      src: '/images/grid-image/image-03.png', 
      title: 'Client Presentation', 
      category: 'Services',
      description: 'Security audit results presentation for enterprise client',
      tall: false
    },
    { 
      src: '/images/grid-image/image-04.png', 
      title: 'Team Building', 
      category: 'Team',
      description: 'Annual team retreat and strategy planning',
      tall: true
    },
    { 
      src: '/images/carousel/carousel-01.png', 
      title: 'Academy Graduation', 
      category: 'Training',
      description: 'Batch 12 graduation ceremony',
      tall: false
    },
    { 
      src: '/images/carousel/carousel-02.png', 
      title: 'Security Audit', 
      category: 'Services',
      description: 'On-site security assessment in progress',
      tall: false
    },
  ]

  return (
    <Box py={{ base: '16', md: '24' }} bg={useColorModeValue('gray.50', 'gray.900')}>
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
              >
                Gallery
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                Moments That Matter
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted" maxW="3xl">
                Explore our journey through training sessions, events, and successful projects
              </Text>
            </VStack>
          </FallInPlace>

          {/* Masonry Gallery Layout */}
          <Grid
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap="6"
            width="100%"
            autoFlow="dense"
          >
            {galleryImages.map((image, index) => (
              <FallInPlace key={image.src} delay={0.1 * index}>
                <GridItem rowSpan={{ base: 1, lg: image.tall ? 2 : 1 }}>
                  <Card
                    bg={cardBg}
                    borderWidth="2px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    overflow="hidden"
                    cursor="pointer"
                    position="relative"
                    height={image.tall ? { base: '300px', lg: '620px' } : '300px'}
                    transition="all 0.4s ease"
                    onClick={() => setSelectedImage(index)}
                    _hover={{
                      transform: 'translateY(-8px)',
                      shadow: '2xl',
                      borderColor: 'green.500',
                      '& .overlay': { opacity: 1 },
                      '& img': { transform: 'scale(1.1)' },
                    }}
                  >
                    <Box
                      position="relative"
                      width="100%"
                      height="100%"
                      overflow="hidden"
                    >
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    </Box>
                    <Box
                      className="overlay"
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      bgGradient="linear(to-t, blackAlpha.900, blackAlpha.300, transparent)"
                      opacity="0"
                      transition="opacity 0.4s ease"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      p="6"
                    >
                      <HStack justify="space-between" align="start">
                        <Badge 
                          colorScheme="green" 
                          fontSize="sm"
                          px="3"
                          py="1"
                          borderRadius="full"
                        >
                          {image.category}
                        </Badge>
                        <IconButton
                          aria-label="View fullscreen"
                          icon={<Icon as={FiExternalLink} />}
                          size="sm"
                          colorScheme="whiteAlpha"
                          borderRadius="full"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedImage(index)
                          }}
                        />
                      </HStack>
                      
                      <VStack align="start" spacing="2" color="white">
                        <Heading size="md">{image.title}</Heading>
                        <Text fontSize="sm" opacity="0.9">
                          {image.description}
                        </Text>
                      </VStack>
                    </Box>
                  </Card>
                </GridItem>
              </FallInPlace>
            ))}
          </Grid>

          <FallInPlace delay={0.6}>
            <ButtonLink
              variant="outline"
              size="lg"
              href="/gallery"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              View Full Gallery
            </ButtonLink>
          </FallInPlace>
        </VStack>
      </Container>
    </Box>
  )
}

const BlogSection = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const blogPosts = [
    {
      title: 'Top 10 Web Application Vulnerabilities in 2024',
      excerpt: 'Learn about the most common security vulnerabilities found in modern web applications and how to prevent them.',
      author: 'H4K2LIV3 Team',
      date: 'Nov 20, 2024',
      readTime: '8 min read',
      category: 'Security',
      image: '/images/cards/card-01.jpg'
    },
    {
      title: 'Getting Started with Bug Bounty Hunting',
      excerpt: 'A comprehensive guide for beginners to start their journey in bug bounty programs and ethical hacking.',
      author: 'Security Expert',
      date: 'Nov 18, 2024',
      readTime: '12 min read',
      category: 'Tutorial',
      image: '/images/cards/card-02.jpg'
    },
    {
      title: 'Our Team Won the National CTF Championship',
      excerpt: 'Read about our recent victory at the national Capture The Flag competition and the challenges we solved.',
      author: 'CTF Team',
      date: 'Nov 15, 2024',
      readTime: '5 min read',
      category: 'News',
      image: '/images/cards/card-03.jpg'
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
              >
                Latest from Blog
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                Insights & Updates
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted" maxW="3xl">
                Stay updated with the latest cybersecurity trends, tutorials, and our community news
              </Text>
            </VStack>
          </FallInPlace>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="8" width="100%">
            {blogPosts.map((post, index) => (
              <FallInPlace key={post.title} delay={0.1 * index}>
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  _hover={{
                    transform: 'translateY(-8px)',
                    shadow: '2xl',
                    borderColor: 'green.500',
                  }}
                  height="100%"
                >
                  <Box position="relative" height="200px">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <Badge
                      position="absolute"
                      top="4"
                      right="4"
                      colorScheme="green"
                    >
                      {post.category}
                    </Badge>
                  </Box>
                  <CardBody p="6">
                    <VStack align="start" spacing="4" height="100%">
                      <Heading size="md" noOfLines={2}>
                        {post.title}
                      </Heading>
                      <Text color="muted" fontSize="sm" noOfLines={3} flex="1">
                        {post.excerpt}
                      </Text>
                      <Divider />
                      <HStack justify="space-between" width="100%" fontSize="xs" color="muted">
                        <HStack spacing="4">
                          <HStack spacing="1">
                            <Icon as={FiUsers} />
                            <Text>{post.author}</Text>
                          </HStack>
                          <HStack spacing="1">
                            <Icon as={FiCalendar} />
                            <Text>{post.date}</Text>
                          </HStack>
                        </HStack>
                        <HStack spacing="1">
                          <Icon as={FiClock} />
                          <Text>{post.readTime}</Text>
                        </HStack>
                      </HStack>
                      <ButtonLink
                        href="/blog"
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        rightIcon={<Icon as={FiExternalLink} />}
                        width="100%"
                      >
                        Read More
                      </ButtonLink>
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>
            ))}
          </SimpleGrid>

          <FallInPlace delay={0.4}>
            <ButtonLink
              colorScheme="primary"
              size="lg"
              href="/blog"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              View All Articles
            </ButtonLink>
          </FallInPlace>
        </VStack>
      </Container>
    </Box>
  )
}

const TrustedBySection = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [isPaused, setIsPaused] = React.useState(false)

  // Sample partners/clients - duplicated for infinite scroll
  const partners = [
    { name: 'Government of Bangladesh', category: 'Public Sector', logo: '/images/country/country-01.svg' },
    { name: 'BRAC Bank', category: 'Financial', logo: '/images/brand/brand-01.svg' },
    { name: 'Robi Axiata', category: 'Telecom', logo: '/images/brand/brand-02.svg' },
    { name: 'Daraz Bangladesh', category: 'E-commerce', logo: '/images/brand/brand-03.svg' },
    { name: 'BUET', category: 'Education', logo: '/images/brand/brand-04.svg' },
    { name: 'City Bank', category: 'Financial', logo: '/images/brand/brand-05.svg' },
    { name: 'Grameenphone', category: 'Telecom', logo: '/images/brand/brand-06.svg' },
    { name: 'Pathao', category: 'Tech', logo: '/images/brand/brand-07.svg' },
    { name: 'bKash', category: 'FinTech', logo: '/images/brand/brand-08.svg' },
    { name: 'Nagad', category: 'FinTech', logo: '/images/brand/brand-09.svg' },
  ]

  // Duplicate for seamless loop
  const allPartners = [...partners, ...partners]

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

          {/* Auto-scrolling Partner Slider */}
          <Box
            width="100%"
            overflow="hidden"
            position="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            py="4"
          >
            <Flex
              gap="8"
              animation={isPaused ? 'none' : 'scroll 40s linear infinite'}
              sx={{
                '@keyframes scroll': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-50%)' },
                },
              }}
            >
              {allPartners.map((partner, index) => (
                <Card
                  key={`${partner.name}-${index}`}
                  variant="outline"
                  borderRadius="xl"
                  minW="280px"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  bg={bgColor}
                  _hover={{
                    transform: 'translateY(-8px)',
                    shadow: 'xl',
                    borderColor: 'green.500',
                  }}
                >
                  <CardBody p="6">
                    <VStack spacing="4">
                      <Flex
                        width="100px"
                        height="100px"
                        borderRadius="xl"
                        bg="gray.50"
                        _dark={{ bg: 'gray.700' }}
                        align="center"
                        justify="center"
                        position="relative"
                        overflow="hidden"
                      >
                        <Box
                          position="relative"
                          width="70px"
                          height="70px"
                        >
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            style={{ objectFit: 'contain' }}
                          />
                        </Box>
                      </Flex>
                      <VStack spacing="1">
                        <Text fontWeight="bold" fontSize="md" textAlign="center" noOfLines={2}>
                          {partner.name}
                        </Text>
                        <Badge colorScheme="green" fontSize="xs">
                          {partner.category}
                        </Badge>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </Box>

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
