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
} from 'react-icons/fi'

import * as React from 'react'

import { ButtonLink } from '@/components/shared/button-link/button-link'
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

      <BenefitsSection />

      <HighlightsSection />

      <FeaturesSection />

      <TestimonialsSection />

      <PricingSection />

      <FaqSection />
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
        />
      </Box>
      
      <Container 
        maxW="container.xl" 
        pt={{ base: '120px', md: '140px', lg: '180px' }} 
        pb={{ base: '60px', md: '80px', lg: '100px' }}
        height="100%"
        display="flex"
        alignItems="center"
      >
        <Stack direction={{ base: 'column', lg: 'row' }} alignItems="center" width="100%" spacing={{ base: '8', lg: '12' }}>
          <VStack 
            flex="1" 
            alignItems={{ base: 'center', md: 'flex-start' }} 
            spacing={{ base: '6', md: '8' }}
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

            <FallInPlace delay={0.6}>
              <Flex 
                direction={{ base: 'row', sm: 'row' }} 
                gap={{ base: '8', sm: '10', md: '12' }} 
                pt="4"
                width="100%"
                justify={{ base: 'center', md: 'flex-start' }}
              >
                <VStack alignItems="center" spacing="1" flex={{ base: '1', sm: 'none' }}>
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                    5000+
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} textAlign="center" whiteSpace="nowrap">
                    Students Trained
                  </Text>
                </VStack>
                <VStack alignItems="center" spacing="1" flex={{ base: '1', sm: 'none' }}>
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                    50+
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} textAlign="center" whiteSpace="nowrap">
                    Security Audits
                  </Text>
                </VStack>
                <VStack alignItems="center" spacing="1" flex={{ base: '1', sm: 'none' }}>
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
          <Box
            position="absolute"
            display={{ base: 'none', lg: 'flex' }}
            right={{ lg: '5%', xl: '8%' }}
            top="50%"
            transform="translateY(-50%)"
            alignItems="center"
            justifyContent="center"
          >
            <FallInPlace delay={1}>
              <Box>
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{ width: '600px', height: '600px' }}
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

const BenefitsSection = () => {
  return (
    <Box py="20">
      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        features={[
          {
            title: 'Bengali Learning',
            icon: FiSmile,
            description: 'All courses taught in Bengali for easy understanding and accessibility.',
            iconPosition: 'left',
            delay: 0.6,
          },
          {
            title: 'Hands-on Training',
            icon: FiSliders,
            description:
              'Practical labs and real-world scenarios with tools like Metasploit, BurpSuite, and Nmap.',
            iconPosition: 'left',
            delay: 0.8,
          },
          {
            title: 'Expert Team',
            icon: FiGrid,
            description:
              'Learn from experienced security professionals with extensive industry experience.',
            iconPosition: 'left',
            delay: 1,
          },
          {
            title: 'CTF Competitions',
            icon: FiThumbsUp,
            description:
              'Join H4K2LIV3_Academy team in competitive Capture-The-Flag challenges worldwide.',
            iconPosition: 'left',
            delay: 1.1,
          },
        ]}
        reveal={FallInPlace}
      />
    </Box>
  )
}

const HighlightsSection = () => {
  const { value, onCopy, hasCopied } = useClipboard('contact@hacktolive.net')

  return (
    <Highlights>
      <HighlightsItem colSpan={[1, null, 2]} title="Professional Services">
        <VStack alignItems="flex-start" spacing="8">
          <Text color="muted" fontSize="xl">
            Get enterprise-grade security with our <Em>comprehensive service offerings</Em>.
            Including penetration testing, vulnerability assessments, and digital forensics.
            Expert OSINT investigations and 24/7 SOC monitoring available.
          </Text>

          <Flex
            rounded="full"
            borderWidth="1px"
            flexDirection="row"
            alignItems="center"
            py="1"
            ps="8"
            pe="2"
            bg="primary.900"
            _dark={{ bg: 'gray.900' }}
          >
            <Box>
              <Text color="yellow.400" display="inline">
                📞 Call:
              </Text>{' '}
              <Text color="cyan.300" display="inline">
                +880 1521-416287
              </Text>
            </Box>
            <IconButton
              icon={hasCopied ? <FiCheck /> : <FiCopy />}
              aria-label="Copy contact"
              onClick={onCopy}
              variant="ghost"
              ms="4"
              isRound
              color="white"
            />
          </Flex>
        </VStack>
      </HighlightsItem>
      <HighlightsItem title="Academy Programs">
        <Text color="muted" fontSize="lg">
          Our structured learning paths take you from beginner to expert. 
          We combine theoretical knowledge with practical skills using industry-standard 
          tools and real-world scenarios.
        </Text>
      </HighlightsItem>
      <HighlightsTestimonialItem
        name="Sarah Begum"
        description="Security Analyst"
        avatar="/static/images/avatar.jpg"
        gradient={['pink.200', 'green.500']}
      >
        "HackToLive Academy gave me the skills I needed to break into cybersecurity. 
        The Bengali instruction made complex topics clear, and the hands-on labs 
        prepared me for real-world security challenges."
      </HighlightsTestimonialItem>
      <HighlightsItem
        colSpan={[1, null, 2]}
        title="Comprehensive Cybersecurity Coverage"
      >
        <Text color="muted" fontSize="lg">
          From beginner fundamentals to advanced penetration testing, we cover 
          everything you need to become a skilled ethical hacker and security professional.
        </Text>
        <Wrap mt="8">
          {[
            'network security',
            'web pentesting',
            'mobile security',
            'linux mastery',
            'osint',
            'metasploit',
            'burp suite',
            'nmap',
            'sql injection',
            'xss attacks',
            'cryptography',
            'forensics',
            'malware analysis',
            'ctf challenges',
            'bug bounty',
            'soc operations',
            'vulnerability assessment',
          ].map((value) => (
            <Tag
              key={value}
              variant="subtle"
              colorScheme="green"
              rounded="full"
              px="3"
            >
              {value}
            </Tag>
          ))}
        </Wrap>
      </HighlightsItem>
    </Highlights>
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
