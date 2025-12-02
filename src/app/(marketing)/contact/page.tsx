'use client'

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { toast } from '@/components/ui/toast'
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiSend,
  FiClock,
  FiMessageCircle,
  FiUsers,
} from 'react-icons/fi'
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa'
import { useState } from 'react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')
  const accentBg = useColorModeValue('primary.500', 'primary.400')
  const dividerColor = useColorModeValue('primary.500', 'primary.400')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully!', {
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      })
      
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        position="relative" 
        overflow="hidden" 
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000')"
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
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                  fontWeight="bold"
                  lineHeight="1.2"
                  mb={4}
                  color="white"
                >
                  Get in Touch
                </Heading>
                <Box
                  width="120px"
                  height="4px"
                  bg={dividerColor}
                  mx="auto"
                  borderRadius="full"
                />
              </Box>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.900">
                Have questions about our services or courses? We're here to help.
                Reach out to our team and we'll respond as soon as possible.
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Contact Cards Section */}
      <Container maxW="container.xl" py={{ base: 0, md: 0 }}>
        <Grid 
          templateColumns={{ 
            base: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          }} 
          gap={6} 
          mt={{ base: 6, md: 8 }}
          mb={16}
        >
          <FallInPlace delay={0.1}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              borderRadius="lg"
              height="100%"
              display="flex"
              flexDirection="column"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: iconColor,
                transition: 'all 0.3s',
              }}
              transition="all 0.3s"
            >
              <VStack spacing={4} align="center" justify="center" flex="1">
                <Flex
                  w={14}
                  h={14}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={iconBg}
                >
                  <Icon as={FiPhone} boxSize={7} color={iconColor} />
                </Flex>
                <Heading size="sm" textAlign="center">
                  Call Us
                </Heading>
                <VStack spacing={1}>
                  <Link
                    href="tel:+8801521416287"
                    fontSize="sm"
                    color={mutedColor}
                    _hover={{ color: iconColor }}
                  >
                    +880 1521-416287
                  </Link>
                  <Link
                    href="tel:+8801601020699"
                    fontSize="sm"
                    color={mutedColor}
                    _hover={{ color: iconColor }}
                  >
                    +880 1601-020699
                  </Link>
                </VStack>
              </VStack>
            </Card>
          </FallInPlace>

          <FallInPlace delay={0.2}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              borderRadius="lg"
              height="100%"
              display="flex"
              flexDirection="column"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: iconColor,
                transition: 'all 0.3s',
              }}
              transition="all 0.3s"
            >
              <VStack spacing={4} align="center" justify="center" flex="1">
                <Flex
                  w={14}
                  h={14}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={iconBg}
                >
                  <Icon as={FiMail} boxSize={7} color={iconColor} />
                </Flex>
                <Heading size="sm" textAlign="center">
                  Email Us
                </Heading>
                <Link
                  href="mailto:contact@hacktolive.net"
                  fontSize="sm"
                  textAlign="center"
                  color={mutedColor}
                  _hover={{ color: iconColor }}
                >
                  contact@hacktolive.net
                  <br />
                  support@hacktolive.net
                </Link>
              </VStack>
            </Card>
          </FallInPlace>

          <FallInPlace delay={0.3}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              borderRadius="lg"
              height="100%"
              display="flex"
              flexDirection="column"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: iconColor,
                transition: 'all 0.3s',
              }}
              transition="all 0.3s"
            >
              <VStack spacing={4} align="center" justify="center" flex="1">
                <Flex
                  w={14}
                  h={14}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={iconBg}
                >
                  <Icon as={FiMapPin} boxSize={7} color={iconColor} />
                </Flex>
                <Heading size="sm" textAlign="center">
                  Visit Us
                </Heading>
                <Text fontSize="sm" textAlign="center" color={mutedColor}>
                  Mohammadpur, Dhaka
                  <br />
                  Bangladesh
                </Text>
              </VStack>
            </Card>
          </FallInPlace>

          <FallInPlace delay={0.4}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={6}
              borderRadius="lg"
              height="100%"
              display="flex"
              flexDirection="column"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: iconColor,
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ willChange: 'transform, box-shadow' }}
            >
              <VStack spacing={4} align="center" justify="center" flex="1">
                <Flex
                  w={14}
                  h={14}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={iconBg}
                >
                  <Icon as={FiClock} boxSize={7} color={iconColor} />
                </Flex>
                <Heading size="sm" textAlign="center">
                  Working Hours
                </Heading>
                <Text fontSize="sm" textAlign="center" color={mutedColor}>
                  Sat - Thu: 9AM - 6PM
                  <br />
                  Friday: Closed
                </Text>
              </VStack>
            </Card>
          </FallInPlace>
        </Grid>

        {/* Main Contact Section */}
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={8}
          alignItems="start"
        >
          {/* Contact Form */}
          <GridItem>
            <FallInPlace delay={0.5}>
              <Card
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={{ base: 6, md: 8 }}
                borderRadius="lg"
              >
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="lg" mb={2}>
                      Send us a Message
                    </Heading>
                    <Text color={mutedColor}>
                      Fill out the form below and we'll get back to you within 24
                      hours.
                    </Text>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.subject}>
                        <FormLabel>Subject</FormLabel>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.subject}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.message}>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.message}</FormErrorMessage>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="primary"
                        size="lg"
                        rightIcon={<Icon as={FiSend} />}
                        isLoading={isSubmitting}
                        loadingText="Sending..."
                        width="full"
                      >
                        Send Message
                      </Button>
                    </Stack>
                  </form>
                </VStack>
              </Card>
            </FallInPlace>
          </GridItem>

          {/* Additional Info */}
          <GridItem>
            <Stack spacing={6}>
              <FallInPlace delay={0.6}>
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={{ base: 6, md: 8 }}
                  borderRadius="lg"
                >
                  <VStack spacing={6} align="stretch">
                    <Flex align="center" gap={3}>
                      <Icon as={FiMessageCircle} boxSize={6} color={iconColor} />
                      <Heading size="md">Quick Response</Heading>
                    </Flex>
                    <Text color={mutedColor}>
                      Our team typically responds to inquiries within 24 hours
                      during business days. For urgent matters, please call us
                      directly.
                    </Text>
                  </VStack>
                </Card>
              </FallInPlace>

              <FallInPlace delay={0.7}>
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={{ base: 6, md: 8 }}
                  borderRadius="lg"
                >
                  <VStack spacing={6} align="stretch">
                    <Flex align="center" gap={3}>
                      <Icon as={FiUsers} boxSize={6} color={iconColor} />
                      <Heading size="md">What We Offer</Heading>
                    </Flex>
                    <VStack align="stretch" spacing={3}>
                      <Flex align="center" gap={2}>
                        <Icon as={FiGlobe} color={iconColor} />
                        <Text>Cybersecurity Services</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Icon as={FiGlobe} color={iconColor} />
                        <Text>Ethical Hacking Courses</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Icon as={FiGlobe} color={iconColor} />
                        <Text>Penetration Testing</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Icon as={FiGlobe} color={iconColor} />
                        <Text>Security Consultancy</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Icon as={FiGlobe} color={iconColor} />
                        <Text>Digital Forensics</Text>
                      </Flex>
                    </VStack>
                  </VStack>
                </Card>
              </FallInPlace>

              <FallInPlace delay={0.8}>
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={{ base: 6, md: 8 }}
                  borderRadius="lg"
                >
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Connect With Us</Heading>
                    <Flex gap={4} wrap="wrap">
                      <Link
                        href="https://facebook.com/hacktolive"
                        isExternal
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ willChange: 'transform' }}
                      >
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                          _hover={{ bg: iconColor, color: 'white' }}
                          transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                          style={{ willChange: 'background-color, color' }}
                        >
                          <Icon as={FaFacebook} boxSize={5} />
                        </Flex>
                      </Link>
                      <Link
                        href="https://twitter.com/hacktolive"
                        isExternal
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ willChange: 'transform' }}
                      >
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                          _hover={{ bg: iconColor, color: 'white' }}
                          transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                          style={{ willChange: 'background-color, color' }}
                        >
                          <Icon as={FaTwitter} boxSize={5} />
                        </Flex>
                      </Link>
                      <Link
                        href="https://linkedin.com/company/hacktolive"
                        isExternal
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ willChange: 'transform' }}
                      >
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                          _hover={{ bg: iconColor, color: 'white' }}
                          transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                          style={{ willChange: 'background-color, color' }}
                        >
                          <Icon as={FaLinkedin} boxSize={5} />
                        </Flex>
                      </Link>
                      <Link
                        href="https://github.com/hacktolive"
                        isExternal
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ willChange: 'transform' }}
                      >
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                          _hover={{ bg: iconColor, color: 'white' }}
                          transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                          style={{ willChange: 'background-color, color' }}
                        >
                          <Icon as={FaGithub} boxSize={5} />
                        </Flex>
                      </Link>
                      <Link
                        href="https://youtube.com/@hacktolive"
                        isExternal
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ willChange: 'transform' }}
                      >
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                          _hover={{ bg: iconColor, color: 'white' }}
                          transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                          style={{ willChange: 'background-color, color' }}
                        >
                          <Icon as={FaYoutube} boxSize={5} />
                        </Flex>
                      </Link>
                    </Flex>
                    <Text fontSize="sm" color={mutedColor}>
                      Follow us on social media for the latest updates, security tips,
                      and course announcements.
                    </Text>
                  </VStack>
                </Card>
              </FallInPlace>
            </Stack>
          </GridItem>
        </Grid>

        {/* Map Section */}
        <Box mt={16} mb={{ base: 12, md: 16 }}>
          <FallInPlace delay={0.9}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              borderRadius="lg"
            >
              <Box
                as="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14604.663715283464!2d90.36036!3d23.765736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0c1f6c0d4e1%3A0x2c8e4a0e2e9c8c0!2sMohammadpur%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890"
                width="100%"
                height={{ base: '300px', md: '400px' }}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </FallInPlace>
        </Box>
      </Container>
    </Box>
  )
}
