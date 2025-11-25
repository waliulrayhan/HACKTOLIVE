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
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from 'components/gradients/background-gradient'
import { PageTransition } from 'components/motion/page-transition'
import { NextPage } from 'next'
import { FaGoogle, FaEye, FaEyeSlash, FaMoon, FaSun, FaHome } from 'react-icons/fa'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import NextLink from 'next/link'

const providers = {
  google: {
    name: 'Google',
    icon: FaGoogle,
  },
}

const Login: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', captcha: '' })
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const captchaTheme = useColorModeValue('light', 'dark')
  const leftBgColor = useColorModeValue('blue.600', 'blue.900')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode, toggleColorMode } = useColorMode()

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
    if (value) {
      setErrors(prev => ({ ...prev, captcha: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({ email: '', password: '', captcha: '' })

    // Validation
    let hasError = false
    const newErrors = { email: '', password: '', captcha: '' }

    if (!email) {
      newErrors.email = 'Email is required'
      hasError = true
    }

    if (!password) {
      newErrors.password = 'Password is required'
      hasError = true
    }

    if (!captchaValue) {
      newErrors.captcha = 'Please complete the captcha'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    // Handle login logic here
    console.log('Login:', { email, password, keepSignedIn, captchaValue })
  }

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
    // Implement Google OAuth logic here
  }

  return (
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
        <BackgroundGradient zIndex="0" opacity={0.3} />
        
        {/* Back to Home Button */}
        <Button
          as={NextLink}
          href="/"
          leftIcon={<FaHome />}
          variant="ghost"
          size="sm"
          position="absolute"
          top={6}
          left={6}
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          zIndex={2}
        >
          Back to Home
        </Button>
        
        <VStack spacing={4} zIndex={1} px={8}>
          <Box 
            fontSize="6xl" 
            fontWeight="bold" 
            color="white"
            bg="blue.500"
            px={6}
            py={4}
            borderRadius="xl"
            boxShadow="2xl"
          >
            |||
          </Box>
          <Heading size="2xl" color="white" textAlign="center">
            TailAdmin
          </Heading>
          <Text color="whiteAlpha.900" fontSize="lg" textAlign="center" maxW="md">
            Free and Open-Source Tailwind CSS Admin Dashboard Template
          </Text>
        </VStack>
      </GridItem>

      {/* Right Column - Form Section */}
      <GridItem bg={rightBgColor} position="relative">
        <BackgroundGradient zIndex="-1" opacity={0.1} />
        
        {/* Theme Toggle */}
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant="ghost"
          size="md"
          position="absolute"
          top={6}
          right={6}
          zIndex={10}
        />

        {/* Form Content */}
        <Flex minH="100vh" alignItems="center" justifyContent="center" px={{ base: 6, md: 12, lg: 16 }}>
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
                        href="/forgot-password"
                        fontSize="sm"
                        color="blue.500"
                        _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                      >
                        Forgot Password?
                      </Link>
                    </HStack>

                    {/* reCAPTCHA */}
                    {/* <FormControl isInvalid={!!errors.captcha}>
                      <Box display="flex" justifyContent="center" my={2}>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={handleCaptchaChange}
                          theme={captchaTheme}
                        />
                      </Box>
                      <FormErrorMessage justifyContent="center">{errors.captcha}</FormErrorMessage>
                    </FormControl> */}

                    {/* Login Button */}
                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      w="full"
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
                    href="/signup"
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
  )
}

export default Login
