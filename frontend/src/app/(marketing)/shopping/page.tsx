'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiMail, FiShoppingBag, FiBook, FiGift, FiArrowRight, FiCheck, FiPackage } from 'react-icons/fi'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'

export default function ShoppingPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const dividerColor = useColorModeValue('primary.500', 'primary.400')
  const badgeBg = useColorModeValue('primary.100', 'primary.900')
  const badgeColor = useColorModeValue('primary.800', 'primary.200')

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: 'Please enter your email',
        status: 'error',
        duration: 3,
        isClosable: true,
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Invalid email format',
        status: 'error',
        duration: 3,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: 'Success!',
        description: 'We will notify you when our store launches.',
        status: 'success',
        duration: 5,
        isClosable: true,
      })
      setEmail('')
    }, 1000)
  }

  const productCategories = [
    {
      id: 1,
      title: 'Security Tools',
      description: 'Premium cybersecurity utilities and professional-grade tools',
      icon: FiShoppingBag,
      features: ['Advanced penetration testing tools', 'Network security utilities', 'Vulnerability scanners'],
    },
    {
      id: 2,
      title: 'Courses & Certifications',
      description: 'Expert-led courses with hands-on labs and certifications',
      icon: FiBook,
      features: ['Ethical Hacking Bootcamp', 'Web Security Mastery', 'Penetration Testing Pro'],
    },
    {
      id: 3,
      title: 'Merchandise',
      description: 'Exclusive branded items for security professionals',
      icon: FiGift,
      features: ['Branded apparel', 'Tech accessories', 'Limited edition items'],
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
        bgImage="url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000')"
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
            <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
              <HStack spacing={2} justify="center">
                <Badge bg={badgeBg} color={badgeColor} px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="600">
                  <Icon as={FiPackage} mr={2} />
                  Coming Soon
                </Badge>
              </HStack>

              <VStack spacing={4}>
                <Heading
                  as="h1"
                  fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                  fontWeight="900"
                  lineHeight="1.1"
                  color="white"
                >
                  HackToLive Store
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.200" maxW="2xl">
                  Discover premium cybersecurity tools, professional courses, and exclusive merchandise designed for security professionals and ethical hackers.
                </Text>
              </VStack>

              {/* <Button
                size="lg"
                colorScheme="primary"
                rightIcon={<FiArrowRight />}
                mt={4}
                onClick={() => document.getElementById('notify-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Notified
              </Button> */}
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Notification Section */}
      <Box id="notify-section" py={{ base: 12, md: 16 }} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.lg">
          <FallInPlace>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="xl">
              <CardBody>
                <VStack spacing={6}>
                  <VStack spacing={2} textAlign="center">
                    <Heading size="lg">Be the First to Know</Heading>
                    <Text color={mutedColor}>Get exclusive early access and updates when we launch</Text>
                  </VStack>

                  <Stack as="form" onSubmit={handleNotify} spacing={4} width="100%" maxW="500px" mx="auto">
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">
                        Email Address
                      </FormLabel>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        bg={inputBg}
                        borderColor={inputBorder}
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'primary.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        }}
                        _hover={{
                          borderColor: 'primary.400',
                        }}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      isLoading={isLoading}
                      loadingText="Sending..."
                      leftIcon={<FiMail />}
                      width="100%"
                    >
                      Notify Me When Ready
                    </Button>

                    <Text fontSize="xs" color={mutedColor} textAlign="center">
                      We respect your privacy. Unsubscribe at any time.
                    </Text>
                  </Stack>
                </VStack>
              </CardBody>
            </Card>
          </FallInPlace>
        </Container>
      </Box>

      {/* Products Categories Section */}
      <Box py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading size="2xl">What's Coming</Heading>
                <Text color={mutedColor} maxW="2xl" fontSize="lg">
                  Explore the categories we're preparing for our launch
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="100%">
                {productCategories.map((category) => (
                  <Card
                    key={category.id}
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                    transition="all 0.3s ease"
                    _hover={{
                      borderColor: 'primary.500',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-4px)',
                    }}
                  >
                    <CardBody>
                      <VStack spacing={4} align="start" height="100%">
                        <Box
                          p={3}
                          bg={iconBg}
                          borderRadius="lg"
                          color={iconColor}
                        >
                          <Icon as={category.icon} boxSize={6} />
                        </Box>

                        <VStack spacing={2} align="start">
                          <Heading size="md">{category.title}</Heading>
                          <Text color={mutedColor} fontSize="sm">
                            {category.description}
                          </Text>
                        </VStack>

                        <Divider borderColor={borderColor} my={2} />

                        <VStack spacing={2} align="start" width="100%">
                          {category.features.map((feature, idx) => (
                            <HStack key={idx} spacing={2}>
                              <Icon as={FiCheck} color={iconColor} boxSize={4} />
                              <Text fontSize="sm">{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Why HackToLive Store Section */}
      {/* <Box py={{ base: 12, md: 16 }} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading size="2xl">Why HackToLive Store?</Heading>
                <Text color={mutedColor} maxW="2xl" fontSize="lg">
                  Curated resources from Bangladesh's leading cybersecurity platform
                </Text>
              </VStack>

              <Grid
                templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                gap={8}
                width="100%"
              >
                {[
                  {
                    title: 'Expert Vetted',
                    description: 'All tools and courses are carefully reviewed by security professionals',
                  },
                  {
                    title: 'Locally Relevant',
                    description: 'Content tailored for South Asian cybersecurity landscape and needs',
                  },
                  {
                    title: 'Community Driven',
                    description: 'Built with feedback from our active cybersecurity community',
                  },
                  {
                    title: '24/7 Support',
                    description: 'Get help from our team whenever you need it',
                  },
                ].map((item, idx) => (
                  <Card
                    key={idx}
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                  >
                    <CardBody>
                      <VStack spacing={3} align="start">
                        <Icon as={FiCheck} boxSize={6} color={iconColor} />
                        <Heading size="md">{item.title}</Heading>
                        <Text color={mutedColor}>{item.description}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </VStack>
          </FallInPlace>
        </Container>
      </Box> */}

      {/* CTA Section */}
      <Box py={{ base: 12, md: 16 }}>
        <Container maxW="container.lg">
          <FallInPlace>
            <Card
              bg={useColorModeValue(
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              )}
              borderRadius="xl"
              borderWidth="0"
            >
              <CardBody>
                <VStack spacing={6} textAlign="center" py={8}>
                  <VStack spacing={2}>
                    <Heading as="h2" size="lg" color="white">
                      Ready for Launch?
                    </Heading>
                    <Text color="whiteAlpha.800" fontSize="lg">
                      Join thousands of security professionals waiting for our store
                    </Text>
                  </VStack>

                  <Button
                    bg="white"
                    color="purple.600"
                    size="lg"
                    _hover={{
                      bg: 'whiteAlpha.900',
                    }}
                    leftIcon={<FiMail />}
                    onClick={() => document.getElementById('notify-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Notified Now
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  )
}
