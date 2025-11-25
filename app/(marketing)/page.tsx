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
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  useClipboard,
} from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react'
import type { Metadata, NextPage } from 'next'
import Image from 'next/image'
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

import { ButtonLink } from '#components/button-link/button-link'
import { Faq } from '#components/faq'
import { Features } from '#components/features'
import { BackgroundGradient } from '#components/gradients/background-gradient'
import { Hero } from '#components/hero'
import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from '#components/highlights'
import { ChakraLogo, NextjsLogo } from '#components/logos'
import { FallInPlace } from '#components/motion/fall-in-place'
import { Pricing } from '#components/pricing/pricing'
import { Testimonial, Testimonials } from '#components/testimonials'
import { Em } from '#components/typography'
import faq from '#data/faq'
import pricing from '#data/pricing'
import testimonials from '#data/testimonials'

export const meta: Metadata = {
  title: 'HackToLive - Cybersecurity & Ethical Hacking Platform',
  description: 'Bangladesh\'s premier cybersecurity platform offering professional security services and ethical hacking academy with courses in Bengali.',
}

const Home: NextPage = () => {
  return (
    <Box>
      <HeroSection />

      <HighlightsSection />

      <FeaturesSection />

      <TestimonialsSection />

      <PricingSection />

      <FaqSection />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
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
        >
          <source src="/sample vedio.mp4" type="video/mp4" />
        </Box>
        {/* Dark overlay for better text readability */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="blackAlpha.600"
        />
      </Box>
      <BackgroundGradient height="100%" zIndex="-1" opacity="0.3" />
      <Container maxW="container.xl" pt={{ base: 52, lg: 72 }} pb="40">
        <Stack direction={{ base: 'column', lg: 'row' }} alignItems="center">
          <Hero
            id="home"
            justifyContent="flex-start"
            px="0"
            title={
              <FallInPlace>
                Master Cybersecurity
                <Br /> Defend Bangladesh
              </FallInPlace>
            }
            description={
              <FallInPlace delay={0.4} fontWeight="medium">
                HackToLive is <Em>Bangladesh's premier cybersecurity platform</Em>
                <Br /> offering professional security services and <Br />{' '}
                ethical hacking education in Bengali.
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <HStack pt="4" pb="12" spacing="8">
                <NextjsLogo height="28px" /> <ChakraLogo height="20px" />
              </HStack>

              <ButtonGroup spacing={4} alignItems="center">
                <ButtonLink colorScheme="primary" size="lg" href="/signup">
                  Enroll Now
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  href="#features"
                  variant="outline"
                  rightIcon={
                    <Icon
                      as={FiArrowRight}
                      sx={{
                        transitionProperty: 'common',
                        transitionDuration: 'normal',
                        '.chakra-button:hover &': {
                          transform: 'translate(5px)',
                        },
                      }}
                    />
                  }
                >
                  Our Services
                </ButtonLink>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
          <Box
            height="600px"
            position="absolute"
            display={{ base: 'none', lg: 'block' }}
            left={{ lg: '60%', xl: '55%' }}
            width="80vw"
            maxW="1100px"
            margin="0 auto"
          >
            <FallInPlace delay={1}>
              <Box overflow="hidden" height="100%">
                <Image
                  src="/static/screenshots/list.png"
                  width={1200}
                  height={762}
                  alt="Screenshot of a ListPage in Saas UI Pro"
                  quality="75"
                  priority
                />
              </Box>
            </FallInPlace>
          </Box>
        </Stack>
      </Container>

      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
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
