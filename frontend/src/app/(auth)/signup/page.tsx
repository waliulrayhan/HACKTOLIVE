'use client'

import { 
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  FormErrorMessage,
  VStack,
  Divider,
  Text,
  Heading,
  useColorMode,
  Grid,
  GridItem,
  Flex,
  Image,
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { PageTransition } from '@/components/shared/motion/page-transition'
import { Header } from '../../(marketing)/_components/layout/header'
import { NextPage } from 'next'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from '@/components/ui/toast'

const Signup: NextPage = () => {
  const router = useRouter()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: '',
    terms: '',
  })
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const captchaTheme = useColorModeValue('light', 'dark')
  const leftBgColor = useColorModeValue('#4d7c0f', '#365314')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode, toggleColorMode } = useColorMode()

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
    if (value) {
      setErrors(prev => ({ ...prev, captcha: '' }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
      terms: '',
    })

    // Validation
    let hasError = false
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
      terms: '',
    }

    if (!formData.name) {
      newErrors.name = 'Name is required'
      hasError = true
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
      hasError = true
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
      hasError = true
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      hasError = true
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      hasError = true
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
      hasError = true
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      hasError = true
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Signup is only for students
      await signup(formData.name, formData.email, formData.password)
      toast.success('Account created successfully!', {
        description: 'Welcome to HACKTOLIVE! Redirecting to your dashboard...',
        duration: 3000,
      })
      // Router redirect is handled in AuthContext
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error('Signup failed', {
        description: error.response?.data?.message || 'Unable to create account. Please try again.',
        duration: 5000,
      })
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    console.log('Google signup clicked')
    // Implement Google OAuth logic here
  }

  return (
    <>
      <Header />
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} minH="100vh">
        {/* Left Column - Logo Section */}
        <GridItem 
          bg={leftBgColor}
          display={{ base: 'none', lg: 'flex' }}
          alignItems="center"
          justifyContent="center"
          position="relative"
          overflow="hidden"
        >
          {/* Animated Geometric Background */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex={0}
            pointerEvents="none"
            overflow="hidden"
            opacity={{ base: 0.3, lg: 1 }}
          >
            {/* Rotating geometric shapes */}
            <Box
              position="absolute"
              top="15%"
              left="15%"
              w="150px"
              h="150px"
              border="2px solid"
              borderColor="whiteAlpha.300"
              transform="rotate(45deg)"
              animation="rotateShape 20s linear infinite"
            />
            <Box
              position="absolute"
              top="60%"
              right="20%"
              w="100px"
              h="100px"
              borderRadius="50%"
              border="2px solid"
              borderColor="whiteAlpha.200"
              animation="float 15s ease-in-out infinite"
            />
            <Box
              position="absolute"
              bottom="20%"
              left="25%"
              w="80px"
              h="80px"
              border="2px solid"
              borderColor="whiteAlpha.300"
              transform="rotate(30deg)"
              animation="rotateShapeReverse 25s linear infinite"
            />
            {/* Animated lines */}
            <Box
              position="absolute"
              top="30%"
              left="0"
              right="0"
              h="1px"
              bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
              animation="slideRight 8s linear infinite"
            />
            <Box
              position="absolute"
              top="70%"
              left="0"
              right="0"
              h="1px"
              bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
              animation="slideLeft 10s linear infinite"
            />
            {/* Floating dots */}
            <Box
              position="absolute"
              top="25%"
              right="30%"
              w="8px"
              h="8px"
              borderRadius="full"
              bg="whiteAlpha.400"
              animation="floatDot 6s ease-in-out infinite"
            />
            <Box
              position="absolute"
              top="45%"
              left="40%"
              w="6px"
              h="6px"
              borderRadius="full"
              bg="whiteAlpha.300"
              animation="floatDot 8s ease-in-out infinite"
              sx={{ animationDelay: '-2s' }}
            />
            <Box
              position="absolute"
              bottom="35%"
              right="15%"
              w="10px"
              h="10px"
              borderRadius="full"
              bg="whiteAlpha.500"
              animation="floatDot 7s ease-in-out infinite"
              sx={{ animationDelay: '-4s' }}
            />
          </Box>
          
        <VStack spacing={4} zIndex={1} px={8}>
          <Image 
            src="/logo_white.png"
            alt="HackToLive Logo"
            height={{ base: '20px', md: '25px', lg: '30px' }}
            width="auto"
            objectFit="contain"
          />
          <Text color="whiteAlpha.900" fontSize="lg" textAlign="center" maxW="md">
            Bangladesh's Premier Cybersecurity & Ethical Hacking Platform
          </Text>
        </VStack>
      </GridItem>

        {/* Right Column - Form Section */}
        <GridItem bg={rightBgColor} position="relative">
          <BackgroundGradient zIndex="-1" opacity={0.1} />
          
          <Flex
            position="absolute"
            top={6}
            left={{ base: 6, lg: 'auto' }}
            right={6}
            justify={{ base: 'space-between', lg: 'flex-end' }}
            align="center"
            zIndex={10}
          >
          </Flex>

          {/* Form Content */}
          <Flex 
            minH="100vh" 
            alignItems="center" 
            justifyContent="center" 
            px={{ base: 6, sm: 8, md: 12, lg: 16, xl: 20 }}
            py={{ base: 20, md: 24, lg: 12 }}
            pt={{ base: 24, md: 28, lg: 20 }}
          >
            <PageTransition width="100%">
              <Box maxW="md" w="full" mx="auto">
                <VStack spacing={6} align="stretch">
                  {/* Title */}
                  <Heading size="lg" textAlign="center">
                    Create your account
                  </Heading>

                  {/* Signup Form */}
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      {/* Name Field */}
                      <FormControl isInvalid={!!errors.name}>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          size="lg"
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      {/* Email Field */}
                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          size="lg"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      {/* Password Field */}
                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup size="lg">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              size="sm"
                              _hover={{ bg: 'transparent' }}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>

                      {/* Confirm Password Field */}
                      <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <InputGroup size="lg">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              variant="ghost"
                              size="sm"
                              _hover={{ bg: 'transparent' }}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                      </FormControl>

                      {/* Terms and Conditions */}
                      <FormControl isInvalid={!!errors.terms}>
                        <Checkbox
                          isChecked={agreeToTerms}
                          onChange={(e) => {
                            setAgreeToTerms(e.target.checked)
                            if (e.target.checked) {
                              setErrors(prev => ({ ...prev, terms: '' }))
                            }
                          }}
                          size="md"
                        >
                          <Text fontSize="sm">
                            I agree to the{' '}
                            <Link
                              as={NextLink}
                              href="/terms-of-service"
                              color="blue.500"
                              _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                            >
                              Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link
                              as={NextLink}
                              href="/privacy-policy"
                              color="blue.500"
                              _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                            >
                              Privacy Policy
                            </Link>
                          </Text>
                        </Checkbox>
                        <FormErrorMessage>{errors.terms}</FormErrorMessage>
                      </FormControl>

                      {/* Signup Button */}
                      <Button
                        type="submit"
                        colorScheme="primary"
                        size="lg"
                        w="full"
                        isLoading={isLoading}
                        loadingText="Creating account..."
                      >
                        Sign up
                      </Button>
                    </VStack>
                  </form>

                  {/* Divider */}
                  <HStack>
                    <Divider />
                    <Text fontSize="sm" color="muted" whiteSpace="nowrap">
                      or continue with
                    </Text>
                    <Divider />
                  </HStack>

                  {/* Google Sign Up Button */}
                  <Button
                    leftIcon={<FaGoogle />}
                    onClick={handleGoogleSignup}
                    variant="outline"
                    size="lg"
                    w="full"
                  >
                    Continue with Google
                  </Button>

                  {/* Login Link */}
                  <Text textAlign="center" fontSize="sm" color="muted">
                    Already have an account?{' '}
                    <Link
                      as={NextLink}
                      href="/login"
                      color="blue.500"
                      fontWeight="semibold"
                      _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                    >
                      Log in
                    </Link>
                  </Text>
                </VStack>
              </Box>
            </PageTransition>
          </Flex>
        </GridItem>
      </Grid>
    </>
  )
}

export default Signup
