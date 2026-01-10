import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - HACKTOLIVE | Our Mission, Vision & Values',
  description: 'Learn about HACKTOLIVE\'s mission to empower individuals and organizations with cutting-edge cybersecurity knowledge and technology solutions. Meet our team and discover our vision.',
  keywords: [
    'about HACKTOLIVE',
    'cybersecurity company',
    'tech education',
    'our mission',
    'our vision',
    'about us',
    'company values',
    'tech team'
  ],
  openGraph: {
    title: 'About HACKTOLIVE - Our Mission, Vision & Values',
    description: 'Discover HACKTOLIVE\'s mission to empower through cybersecurity education and technology solutions. Learn about our team, values, and vision for the future.',
    url: 'https://hacktolive.io/about',
    siteName: 'HACKTOLIVE',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HACKTOLIVE - About Us',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About HACKTOLIVE - Our Mission, Vision & Values',
    description: 'Discover HACKTOLIVE\'s mission to empower through cybersecurity education and technology solutions.',
    images: ['/logo.svg'],
  },
}

'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Flex,
  Stack,
  Badge,
  useColorModeValue,
  Grid,
  GridItem,
  Avatar,
  HStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import {
  FiTarget,
  FiEye,
  FiHeart,
  FiAward,
  FiShield,
  FiUsers,
  FiGlobe,
  FiTrendingUp,
  FiZap,
  FiBook,
  FiCheckCircle,
  FiStar,
  FiClock,
  FiFlag,
  FiLayers,
  FiCode,
} from 'react-icons/fi'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'
import { useEffect, useRef, useState } from 'react'

export default function AboutPage() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const accentBg = useColorModeValue('primary.500', 'primary.400')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const timelineBorderColor = useColorModeValue('primary.200', 'primary.700')

  // Scroll animation states
  const [scrollY, setScrollY] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const achievementsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll carousel for team
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || isPaused) return

    let scrollAmount = 0
    const scrollSpeed = 1 // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollAmount += scrollSpeed
        scrollContainer.scrollLeft = scrollAmount

        // Reset scroll when reaching the end
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0
        }
      }
      requestAnimationFrame(scroll)
    }

    const animationFrame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPaused])

  const isInView = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return false
    const rect = ref.current.getBoundingClientRect()
    return rect.top < window.innerHeight && rect.bottom > 0
  }

  const stats = [
    { label: 'Students Trained', value: '5,000+', icon: FiUsers },
    { label: 'Security Audits', value: '500+', icon: FiShield },
    { label: 'CTF Challenges', value: '200+', icon: FiFlag },
    { label: 'Years of Excellence', value: '5+', icon: FiAward },
  ]

  const values = [
    {
      icon: FiShield,
      title: 'Security First',
      description: 'We prioritize security in everything we do, ensuring the highest standards of protection for our clients and students.',
    },
    {
      icon: FiHeart,
      title: 'Integrity',
      description: 'We maintain the highest ethical standards in all our operations, building trust through transparency and honesty.',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'We foster a collaborative learning environment where knowledge sharing and mutual growth are encouraged.',
    },
    {
      icon: FiTrendingUp,
      title: 'Excellence',
      description: 'We strive for excellence in our training programs, security services, and continuous innovation.',
    },
    {
      icon: FiGlobe,
      title: 'Accessibility',
      description: 'We make cybersecurity education accessible to everyone through Bengali language content and affordable pricing.',
    },
    {
      icon: FiZap,
      title: 'Innovation',
      description: 'We stay ahead of emerging threats and technologies, constantly updating our curriculum and methodologies.',
    },
  ]

  const milestones = [
    {
      year: '2019',
      title: 'Foundation',
      description: 'HackToLive was founded with a vision to democratize cybersecurity education in Bangladesh.',
    },
    {
      year: '2020',
      title: 'First Academy Launch',
      description: 'Launched our first ethical hacking course in Bengali, reaching 500+ students in the first year.',
    },
    {
      year: '2021',
      title: 'Service Expansion',
      description: 'Expanded into professional security services, conducting our first penetration testing engagements.',
    },
    {
      year: '2022',
      title: 'CTF Platform',
      description: 'Launched our Capture The Flag platform, hosting Bangladesh\'s largest cybersecurity competitions.',
    },
    {
      year: '2023',
      title: 'Industry Recognition',
      description: 'Recognized as Bangladesh\'s leading cybersecurity education platform with 3,000+ active students.',
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Partnered with international organizations and expanded our reach to serve clients across South Asia.',
    },
  ]

  const team = [
    {
      name: 'MD. Sabbir Ahmed',
      role: 'Founder & CEO',
      expertise: 'Offensive Security, OSCP',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Fatima Rahman',
      role: 'Head of Education',
      expertise: 'Cybersecurity Training, CEH',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Kamal Hassan',
      role: 'Lead Security Consultant',
      expertise: 'Penetration Testing, CISSP',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Nusrat Jahan',
      role: 'SOC Manager',
      expertise: 'Threat Intelligence, GCIH',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    {
      name: 'Rafiq Ahmed',
      role: 'Chief Technology Officer',
      expertise: 'Cloud Security, AWS Certified',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      name: 'Saima Hossain',
      role: 'Head of Research',
      expertise: 'Malware Analysis, GREM',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      name: 'Imran Khan',
      role: 'Senior Red Team Lead',
      expertise: 'Advanced Penetration Testing, OSEP',
      avatar: 'https://i.pravatar.cc/150?img=13',
    },
    {
      name: 'Ayesha Malik',
      role: 'Compliance & Risk Manager',
      expertise: 'ISO 27001, Risk Assessment',
      avatar: 'https://i.pravatar.cc/150?img=16',
    },
  ]

  const achievements = [
    'First Bengali cybersecurity academy in Bangladesh',
    'ISO 27001 certified security operations',
    'Trained 5,000+ cybersecurity professionals',
    'Conducted 500+ successful security audits',
    'Partnership with leading tech companies',
    'Active community of 10,000+ members',
  ]

  const certifications = [
    {
      name: 'ISO 27001',
      description: 'Information Security Management System',
      icon: FiShield,
    },
    {
      name: 'OSCP',
      description: 'Offensive Security Certified Professional',
      icon: FiAward,
    },
    {
      name: 'CEH',
      description: 'Certified Ethical Hacker',
      icon: FiCode,
    },
    {
      name: 'CISSP',
      description: 'Certified Information Systems Security Professional',
      icon: FiShield,
    },
    {
      name: 'GCIH',
      description: 'GIAC Certified Incident Handler',
      icon: FiFlag,
    },
    {
      name: 'GREM',
      description: 'GIAC Reverse Engineering Malware',
      icon: FiLayers,
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000')"
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
                About HackToLive (H4K2LIV3)
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                color="white"
                lineHeight="shorter"
              >
                Empowering Bangladesh Through{' '}
                <Text as="span" color="green.400">
                  Cybersecurity Excellence
                </Text>
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.200"
                maxW="3xl"
              >
                Bangladesh's premier cybersecurity platform, dedicated to providing professional
                security services and ethical hacking training in Bengali.
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Company Overview Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <VStack align="start" spacing={6}>
                  <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                    Company Overview
                  </Badge>
                  <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                    Leading the Cybersecurity Revolution in Bangladesh
                  </Heading>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    Founded in 2019, HackToLive (H4K2LIV3) has emerged as Bangladesh's most 
                    trusted cybersecurity platform. We bridge the gap between traditional education 
                    and industry needs by providing world-class security training in Bengali, making 
                    cybersecurity accessible to millions.
                  </Text>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    Our comprehensive approach combines professional security services, hands-on 
                    training programs, and a vibrant community of ethical hackers. We've trained 
                    over 5,000 professionals and conducted 500+ successful security audits for 
                    leading organizations across South Asia.
                  </Text>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    What sets us apart is our commitment to quality education in Bengali, practical 
                    hands-on training, and real-world experience through CTF challenges and live projects. 
                    We're not just teaching cybersecurity – we're building Bangladesh's digital defense force.
                  </Text>
                </VStack>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <SimpleGrid columns={2} spacing={6}>
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.3s"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={3}>
                        <Icon as={FiUsers} boxSize={12} color={iconColor} />
                        <Stat textAlign="center">
                          <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                            5,000+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Students</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.3s"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={3}>
                        <Icon as={FiShield} boxSize={12} color={iconColor} />
                        <Stat textAlign="center">
                          <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                            500+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Security Audits</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.3s"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={3}>
                        <Icon as={FiAward} boxSize={12} color={iconColor} />
                        <Stat textAlign="center">
                          <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                            50+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Courses</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.3s"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={3}>
                        <Icon as={FiGlobe} boxSize={12} color={iconColor} />
                        <Stat textAlign="center">
                          <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                            10+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Countries</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      {/* <Box py={16} bg={sectionBg} ref={statsRef}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  _hover={{ 
                    transform: 'translateY(-8px) scale(1.05)', 
                    shadow: '2xl',
                    borderColor: iconColor,
                  }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  h="full"
                >
                  <CardBody>
                    <VStack spacing={4}>
                      <Flex
                        w={16}
                        h={16}
                        align="center"
                        justify="center"
                        rounded="full"
                        bg={iconBg}
                        transition="all 0.3s"
                      >
                        <Icon as={stat.icon} boxSize={8} color={iconColor} />
                      </Flex>
                      <Stat textAlign="center">
                        <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                          {stat.value}
                        </StatNumber>
                        <StatLabel fontSize="md" color={mutedColor}>
                          {stat.label}
                        </StatLabel>
                      </Stat>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box> */}

      {/* Mission & Vision Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={12}>
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  p={2}
                >
                  <CardBody>
                    <VStack align="start" spacing={6} h="full">
                      <Flex
                        w={16}
                        h={16}
                        align="center"
                        justify="center"
                        rounded="full"
                        bg={iconBg}
                      >
                        <Icon as={FiTarget} boxSize={8} color={iconColor} />
                      </Flex>
                      <Heading as="h2" size="xl" color={iconColor}>
                        Our Mission
                      </Heading>
                      <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                        To empower individuals and organizations in Bangladesh with world-class
                        cybersecurity knowledge and skills, making digital security accessible
                        through education in Bengali. We strive to build a safer digital
                        ecosystem by training the next generation of ethical hackers and
                        providing professional security services that protect businesses from
                        cyber threats.
                      </Text>
                      <List spacing={3} pt={4}>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          <Text as="span" fontSize="md">
                            Provide quality cybersecurity education in Bengali
                          </Text>
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          <Text as="span" fontSize="md">
                            Deliver professional security services
                          </Text>
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          <Text as="span" fontSize="md">
                            Foster a community of security professionals
                          </Text>
                        </ListItem>
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  p={2}
                >
                  <CardBody>
                    <VStack align="start" spacing={6} h="full">
                      <Flex
                        w={16}
                        h={16}
                        align="center"
                        justify="center"
                        rounded="full"
                        bg={iconBg}
                      >
                        <Icon as={FiEye} boxSize={8} color={iconColor} />
                      </Flex>
                      <Heading as="h2" size="xl" color={iconColor}>
                        Our Vision
                      </Heading>
                      <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                        To become South Asia's leading cybersecurity platform, recognized
                        globally for excellence in ethical hacking education and security
                        services. We envision a future where Bangladesh is known for its
                        cybersecurity expertise, with thousands of certified professionals
                        protecting the digital infrastructure of businesses worldwide.
                      </Text>
                      <List spacing={3} pt={4}>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          <Text as="span" fontSize="md">
                            Lead cybersecurity innovation in South Asia
                          </Text>
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          <Text as="span" fontSize="md">
                            Create 50,000+ certified security professionals
                          </Text>
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          <Text as="span" fontSize="md">
                            Build a safer digital Bangladesh
                          </Text>
                        </ListItem>
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Box py={20} bg={sectionBg} ref={valuesRef}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                  Our Core Values
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  What Drives Us Forward
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Our values guide every decision we make and shape the culture of our organization.
                </Text>
              </FallInPlace>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {values.map((value, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    h="full"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.3s"
                  >
                    <CardBody>
                      <VStack align="start" spacing={4} h="full">
                        <Flex
                          w={14}
                          h={14}
                          align="center"
                          justify="center"
                          rounded="full"
                          bg={iconBg}
                        >
                          <Icon as={value.icon} boxSize={7} color={iconColor} />
                        </Flex>
                        <Heading as="h3" size="md">
                          {value.title}
                        </Heading>
                        <Text color={mutedColor} lineHeight="tall">
                          {value.description}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Our Story / Timeline Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                  Our Journey
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Our Story of Growth
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  From a small initiative to Bangladesh's leading cybersecurity platform.
                </Text>
              </FallInPlace>
            </VStack>

            <VStack spacing={0} w="full" align="stretch" position="relative">
              {/* Timeline Line */}
              <Box
                position="absolute"
                left={{ base: '20px', md: '50%' }}
                top={0}
                bottom={0}
                w="2px"
                bg={timelineBorderColor}
                transform={{ base: 'none', md: 'translateX(-50%)' }}
              />

              {milestones.map((milestone, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Flex
                    direction={{ base: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
                    align="center"
                    mb={12}
                    position="relative"
                  >
                    <Box
                      flex={{ base: 'none', md: 1 }}
                      textAlign={{ base: 'left', md: index % 2 === 0 ? 'right' : 'left' }}
                      pl={{ base: 16, md: index % 2 === 0 ? 0 : 8 }}
                      pr={{ base: 0, md: index % 2 === 0 ? 8 : 0 }}
                    >
                      <Card
                        bg={cardBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{ shadow: 'lg' }}
                        transition="all 0.3s"
                      >
                        <CardBody>
                          <VStack
                            align={{ base: 'start', md: index % 2 === 0 ? 'end' : 'start' }}
                            spacing={2}
                          >
                            <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                              {milestone.year}
                            </Badge>
                            <Heading as="h3" size="md">
                              {milestone.title}
                            </Heading>
                            <Text color={mutedColor}>{milestone.description}</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>

                    {/* Timeline Dot */}
                    <Flex
                      position="absolute"
                      left={{ base: '12px', md: '50%' }}
                      transform={{ base: 'none', md: 'translateX(-50%)' }}
                      w={4}
                      h={4}
                      align="center"
                      justify="center"
                      bg={accentBg}
                      rounded="full"
                      border="4px solid"
                      borderColor={cardBg}
                      zIndex={1}
                    />

                    <Box flex={{ base: 'none', md: 1 }} />
                  </Flex>
                </MotionBox>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Leadership Team Section */}
      <Box py={20} bg={sectionBg}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                  Leadership Team
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Meet Our Experts
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Led by industry veterans with decades of combined experience in cybersecurity.
                </Text>
              </FallInPlace>
            </VStack>

            {/* Auto-scrolling carousel */}
            <Box
              w="full"
              overflow="hidden"
              position="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Flex
                ref={scrollContainerRef}
                gap={8}
                overflow="hidden"
                css={{
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {/* Duplicate team array for seamless loop */}
                {[...team, ...team].map((member, index) => (
                  <Box
                    key={index}
                    minW={{ base: '280px', sm: '320px', md: '280px' }}
                    flexShrink={0}
                  >
                    <Card
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ 
                        transform: 'translateY(-8px) scale(1.02)', 
                        shadow: '2xl',
                        borderColor: iconColor,
                      }}
                      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                      h="full"
                    >
                      <CardBody>
                        <VStack spacing={4}>
                          <Avatar 
                            size="2xl" 
                            src={member.avatar} 
                            name={member.name}
                            transition="all 0.3s"
                            _hover={{ transform: 'scale(1.1)' }}
                          />
                          <VStack spacing={1} textAlign="center">
                            <Heading as="h3" size="md" noOfLines={1}>
                              {member.name}
                            </Heading>
                            <Text color={iconColor} fontWeight="semibold" noOfLines={1}>
                              {member.role}
                            </Text>
                            <Text color={mutedColor} fontSize="sm" noOfLines={2}>
                              {member.expertise}
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Box>
                ))}
              </Flex>
              
              {/* Gradient overlays for visual effect */}
              <Box
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                w="100px"
                bgGradient={`linear(to-r, ${sectionBg}, transparent)`}
                pointerEvents="none"
                zIndex={1}
              />
              <Box
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                w="100px"
                bgGradient={`linear(to-l, ${sectionBg}, transparent)`}
                pointerEvents="none"
                zIndex={1}
              />
            </Box>

            <Text fontSize="sm" color={mutedColor} textAlign="center" fontStyle="italic">
              Hover over the cards to pause the carousel
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Certifications Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                  Certifications
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Industry-Recognized Certifications
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Our team holds prestigious cybersecurity certifications from globally recognized organizations.
                </Text>
              </FallInPlace>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8} w="full">
              {certifications.map((cert, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    h="full"
                    _hover={{
                      transform: 'translateY(-8px) scale(1.02)',
                      shadow: '2xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Flex
                          w={16}
                          h={16}
                          align="center"
                          justify="center"
                          rounded="full"
                          bg={iconBg}
                        >
                          <Icon as={cert.icon} boxSize={8} color={iconColor} />
                        </Flex>
                        <VStack align="start" spacing={2}>
                          <Heading as="h3" size="md" color={iconColor}>
                            {cert.name}
                          </Heading>
                          <Text color={mutedColor} fontSize="sm">
                            {cert.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>

            <Card
              bg={iconBg}
              borderWidth="1px"
              borderColor={borderColor}
              w="full"
            >
              <CardBody>
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <Icon as={FiCheckCircle} color={iconColor} boxSize={6} />
                  <Text fontSize="lg" fontWeight="semibold">
                    All instructors are certified professionals with active industry experience
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Box py={20} ref={achievementsRef}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <VStack align="start" spacing={6}>
                  <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                    Our Achievements
                  </Badge>
                  <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                    Milestones That Define Us
                  </Heading>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    Over the years, HackToLive has achieved significant milestones that
                    demonstrate our commitment to cybersecurity excellence and education in
                    Bangladesh.
                  </Text>
                  <List spacing={4} pt={4}>
                    {achievements.map((achievement, index) => (
                      <ListItem key={index}>
                        <HStack align="start">
                          <Icon as={FiCheckCircle} color="green.500" mt={1} boxSize={5} />
                          <Text fontSize="md">{achievement}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <SimpleGrid columns={2} spacing={6}>
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ 
                      transform: 'scale(1.1) rotate(2deg)', 
                      shadow: 'xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    cursor="pointer"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={2}>
                        <Icon 
                          as={FiAward} 
                          boxSize={10} 
                          color={iconColor}
                          transition="all 0.3s"
                          _groupHover={{ transform: 'scale(1.2)' }}
                        />
                        <Stat textAlign="center">
                          <StatNumber fontSize="2xl" fontWeight="bold">
                            15+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Certifications</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ 
                      transform: 'scale(1.1) rotate(-2deg)', 
                      shadow: 'xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    cursor="pointer"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={2}>
                        <Icon 
                          as={FiCode} 
                          boxSize={10} 
                          color={iconColor}
                          transition="all 0.3s"
                          _groupHover={{ transform: 'scale(1.2)' }}
                        />
                        <Stat textAlign="center">
                          <StatNumber fontSize="2xl" fontWeight="bold">
                            50+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Courses</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ 
                      transform: 'scale(1.1) rotate(2deg)', 
                      shadow: 'xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    cursor="pointer"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={2}>
                        <Icon 
                          as={FiGlobe} 
                          boxSize={10} 
                          color={iconColor}
                          transition="all 0.3s"
                          _groupHover={{ transform: 'scale(1.2)' }}
                        />
                        <Stat textAlign="center">
                          <StatNumber fontSize="2xl" fontWeight="bold">
                            10+
                          </StatNumber>
                          <StatLabel color={mutedColor}>Countries</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{ 
                      transform: 'scale(1.1) rotate(-2deg)', 
                      shadow: 'xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    cursor="pointer"
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={2}>
                        <Icon 
                          as={FiStar} 
                          boxSize={10} 
                          color={iconColor}
                          transition="all 0.3s"
                          _groupHover={{ transform: 'scale(1.2)' }}
                        />
                        <Stat textAlign="center">
                          <StatNumber fontSize="2xl" fontWeight="bold">
                            4.9/5
                          </StatNumber>
                          <StatLabel color={mutedColor}>Rating</StatLabel>
                        </Stat>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box py={20} bg={sectionBg}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge colorScheme="green" fontSize="sm" px={4} py={1} borderRadius="full">
                  Why Choose Us
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  What Makes Us Different
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  We combine world-class training with practical experience and local expertise.
                </Text>
              </FallInPlace>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  _hover={{ borderColor: iconColor, shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={FiBook} boxSize={10} color={iconColor} />
                      <Heading as="h3" size="md">
                        Bengali Education
                      </Heading>
                      <Text color={mutedColor}>
                        First and only comprehensive cybersecurity platform offering training in
                        Bengali language, making it accessible to millions.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  _hover={{ borderColor: iconColor, shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={FiLayers} boxSize={10} color={iconColor} />
                      <Heading as="h3" size="md">
                        Hands-on Learning
                      </Heading>
                      <Text color={mutedColor}>
                        Learn by doing with our extensive lab environment, CTF challenges, and
                        real-world scenarios from actual security engagements.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  _hover={{ borderColor: iconColor, shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={FiUsers} boxSize={10} color={iconColor} />
                      <Heading as="h3" size="md">
                        Expert Instructors
                      </Heading>
                      <Text color={mutedColor}>
                        Learn from certified professionals with years of industry experience in
                        penetration testing, security audits, and ethical hacking.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  _hover={{ borderColor: iconColor, shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={FiClock} boxSize={10} color={iconColor} />
                      <Heading as="h3" size="md">
                        Flexible Learning
                      </Heading>
                      <Text color={mutedColor}>
                        Self-paced courses with lifetime access, allowing you to learn at your own
                        speed while balancing work and personal commitments.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  _hover={{ borderColor: iconColor, shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={FiAward} boxSize={10} color={iconColor} />
                      <Heading as="h3" size="md">
                        Industry Recognition
                      </Heading>
                      <Text color={mutedColor}>
                        Earn certificates recognized by leading companies in Bangladesh and build a
                        portfolio through our CTF competitions.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  _hover={{ borderColor: iconColor, shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={FiShield} boxSize={10} color={iconColor} />
                      <Heading as="h3" size="md">
                        Professional Services
                      </Heading>
                      <Text color={mutedColor}>
                        Beyond training, we offer penetration testing, security audits, and SOC
                        services to protect your organization.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <FallInPlace>
            <Card
              bg={"primary.600"}
              color="white"
              borderWidth="1px"
              borderColor="transparent"
              overflow="hidden"
              position="relative"
            >
              <CardBody p={{ base: 8, md: 12 }}>
                <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
                  <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                    Ready to Start Your Cybersecurity Journey?
                  </Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    Join thousands of students and professionals who trust HackToLive for their
                    cybersecurity education and security needs.
                  </Text>
                  <HStack spacing={4} pt={4}>
                    <Box
                      as="a"
                      href="/academy"
                      bg="white"
                      color="primary.500"
                      px={8}
                      py={3}
                      rounded="md"
                      fontWeight="semibold"
                      _hover={{ bg: 'gray.100' }}
                      transition="all 0.3s"
                    >
                      Explore Courses
                    </Box>
                    <Box
                      as="a"
                      href="/contact"
                      bg="transparent"
                      color="white"
                      px={8}
                      py={3}
                      rounded="md"
                      fontWeight="semibold"
                      borderWidth="2px"
                      borderColor="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      transition="all 0.3s"
                    >
                      Contact Us
                    </Box>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  )
}
