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
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from 'components/gradients/background-gradient'
import { PageTransition } from 'components/motion/page-transition'
import { Section } from 'components/section'
import { NextPage } from 'next'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
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
  const bgColor = useColorModeValue('white', 'gray.800')

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
    <Section 
      minHeight="calc(100vh - 200px)" 
      innerWidth="container.sm" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <BackgroundGradient zIndex="-1" />

      <Center width="100%">
        <PageTransition width="100%">
          <Box maxW="md" w="full">
            <VStack spacing={6} align="stretch">
              {/* Title */}
              <Heading size="lg" textAlign="center">
                Log in
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

                  {/* Forgot Password */}
                  <Box w="full" textAlign="left">
                    <Link
                      as={NextLink}
                      href="/forgot-password"
                      fontSize="sm"
                      color="primary"
                    >
                      Forgot Password?
                    </Link>
                  </Box>

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

                  {/* Keep me signed in */}
                  {/* <Box w="full">
                    <Checkbox
                      isChecked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      size="sm"
                    >
                      Keep me signed in
                    </Checkbox>
                  </Box> */}

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
                  color="primary"
                >
                  Sign up
                </Link>
              </Text>
            </VStack>
          </Box>
        </PageTransition>
      </Center>
    </Section>
  )
}

export default Login
