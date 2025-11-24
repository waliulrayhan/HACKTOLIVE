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

const Signup: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
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

    if (!captchaValue) {
      newErrors.captcha = 'Please complete the captcha'
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

    // Handle signup logic here
    console.log('Signup:', { ...formData, captchaValue, agreeToTerms })
  }

  const handleGoogleSignup = () => {
    console.log('Google signup clicked')
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
                Sign up
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
                          href="/terms"
                          color="blue.500"
                          _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                        >
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link
                          as={NextLink}
                          href="/privacy"
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
      </Center>
    </Section>
  )
}

export default Signup
