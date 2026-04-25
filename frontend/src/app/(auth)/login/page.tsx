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
import { FaGoogle, FaEye, FaEyeSlash, FaMoon, FaSun, FaHome } from 'react-icons/fa'
import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from '@/components/ui/toast'

const providers = {
  google: {
    name: 'Google',
    icon: FaGoogle,
  },
}

const Login: NextPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', turnstile: '' })
  const turnstileTheme = useColorModeValue('light', 'dark')
  const leftBgColor = useColorModeValue('#4d7c0f', '#365314')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode, toggleColorMode } = useColorMode()
  const redirectTo = searchParams?.get('redirect') || undefined

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
    setErrors(prev => ({ ...prev, turnstile: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Reset errors
    setErrors({ email: '', password: '', turnstile: '' })

    // Validation
    let hasError = false
    const newErrors = { email: '', password: '', turnstile: '' }

    if (!email) {
      newErrors.email = 'Email is required'
      hasError = true
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
      hasError = true
    }

    if (!password) {
      newErrors.password = 'Password is required'
      hasError = true
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      hasError = true
    }
    
    // Skip Turnstile validation in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && !turnstileToken) {
      newErrors.turnstile = 'Please complete the security verification'
      hasError = true
    }
    
    if (hasError) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Use 'dev-bypass' token in development if no turnstile token
      const token = turnstileToken || (isDevelopment ? 'dev-bypass' : '')
      const result = await login(email, password, token, redirectTo)
      
      if (result.requiresOtp) {
        // For INSTRUCTOR and ADMIN - show success and redirect to OTP
        toast.success('Credentials verified!', {
          description: 'Please enter the OTP sent to your email.',
          duration: 3000,
        })
        // Redirect to OTP verification
        const otpQuery = new URLSearchParams({
          userId: result.userId!,
          email: result.email!,
          type: 'login',
        })

        if (redirectTo) {
          otpQuery.set('redirect', redirectTo)
        }

        router.push(`/verify-otp?${otpQuery.toString()}`)
      } else {
        // For STUDENT - direct login, show success message
        toast.success('Login successful!', {
          description: 'Welcome back! Redirecting to your dashboard...',
          duration: 2000,
        })
        // AuthContext already handles the redirect to /student/dashboard
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed', {
        description: error.response?.data?.message || 'Invalid email or password. Please try again.',
        duration: 5000,
      })
      
      // Refresh page to reset Turnstile token for retry
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } finally {
      // Always set loading to false on error or success
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    toast.info('This feature will be coming soon!', {
      description: 'Google login is under development.',
      duration: 3000,
    })
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
        {/* <BackgroundGradient zIndex="-1" opacity={0.1} /> */}
        
        {/* Header - Back to Home (mobile) and Theme Toggle */}
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
                  Welcome back!
                </Heading>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    {/* Email Field */}
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                        }}
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
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                          }}
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

                    {/* Keep me signed in and Forgot Password */}
                    <HStack justify="space-between" w="full">
                      <Checkbox
                        isChecked={keepSignedIn}
                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                        size="md"
                      >
                        Keep me signed in
                      </Checkbox>
                      <Link
                        as={NextLink}
                        href="/reset-password"
                        fontSize="sm"
                        color="blue.500"
                        _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                      >
                        Forgot Password?
                      </Link>
                    </HStack>

                    {/* Cloudflare Turnstile - Only in Production */}
                    {process.env.NODE_ENV !== 'development' && (
                      <FormControl isInvalid={!!errors.turnstile}>
                        <Box display="flex" justifyContent="center" my={2}>
                          <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={handleTurnstileVerify}
                            options={{ theme: turnstileTheme as 'light' | 'dark' }}
                          />
                        </Box>
                        <FormErrorMessage justifyContent="center">{errors.turnstile}</FormErrorMessage>
                      </FormControl>
                    )}

                    {/* Login Button */}
                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      w="full"
                      isLoading={isLoading}
                      loadingText="Logging in..."
                    >
                      Log in
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

                {/* Google Sign In Button */}
                <Button
                  leftIcon={<FaGoogle />}
                  onClick={handleGoogleLogin}
                  variant="outline"
                  size="lg"
                  w="full"
                >
                  Continue with Google
                </Button>

                {/* Sign Up Link */}
                <Text textAlign="center" fontSize="sm" color="muted">
                  No account yet?{' '}
                  <Link
                    as={NextLink}
                    href={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup'}
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                  >
                    Sign up
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

export default Login
