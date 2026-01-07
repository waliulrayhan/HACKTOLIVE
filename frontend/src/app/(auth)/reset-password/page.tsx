'use client'

import { 
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  FormErrorMessage,
  VStack,
  Text,
  Heading,
  useColorMode,
  Grid,
  GridItem,
  Flex,
  Icon,
  Image,
  PinInput,
  PinInputField,
  HStack,
  Center,
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { PageTransition } from '@/components/shared/motion/page-transition'
import { Header } from '../../(marketing)/_components/layout/header'
import { NextPage } from 'next'
import { FaArrowLeft, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState, useMemo } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import { toast } from '@/components/ui/toast'

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', otp: '', password: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(false)
  const leftBgColor = useColorModeValue('#4d7c0f', '#365314')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode } = useColorMode()

  // Password complexity requirements
  const passwordRequirements = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }
  }, [password])

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordRequirements).every(req => req)
  }, [passwordRequirements])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ email: '', otp: '', password: '', confirmPassword: '' })

    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email is invalid' }))
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      toast.success('OTP sent!', {
        description: 'Check your email for the verification code.',
        duration: 3000,
      })
      setStep('otp')
    } catch (error: any) {
      toast.error('Failed to send OTP', {
        description: error.response?.data?.message || 'Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter the complete 6-digit code' }))
      return
    }

    setStep('password')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ email: '', otp: '', password: '', confirmPassword: '' })

    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }))
      return
    }
    if (!isPasswordValid) {
      setErrors(prev => ({ ...prev, password: 'Password does not meet all requirements' }))
      return
    }
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(email, otp, password)
      toast.success('Password reset successful!', {
        description: 'You can now login with your new password.',
        duration: 3000,
      })
      router.push('/login')
    } catch (error: any) {
      toast.error('Failed to reset password', {
        description: error.response?.data?.message || 'Invalid or expired OTP.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
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
          
          {/* Animated Geometric Background for right column */}
          {/* <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex={0}
            pointerEvents="none"
            overflow="hidden"
            opacity={{ base: 0.1, md: 0.5, lg: 1 }}
          > */}
            {/* Rotating geometric shapes */}
            {/* <Box
              position="absolute"
              top="20%"
              right="10%"
              w="120px"
              h="120px"
              border="2px solid"
              borderColor={colorMode === 'light' ? 'blue.200' : 'blue.500'}
              borderRadius="20px"
              transform="rotate(25deg)"
              animation="rotateShape 18s linear infinite"
              opacity={0.4}
            /> */}
            {/* <Box
              position="absolute"
              bottom="25%"
              left="15%"
              w="90px"
              h="90px"
              border="2px solid"
              borderColor={colorMode === 'light' ? 'purple.200' : 'purple.500'}
              borderRadius="50%"
              animation="floatReverse 20s ease-in-out infinite"
              opacity={0.3}
            />
            <Box
              position="absolute"
              top="50%"
              left="5%"
              w="60px"
              h="60px"
              border="2px solid"
              borderColor={colorMode === 'light' ? 'cyan.200' : 'cyan.500'}
              transform="rotate(60deg)"
              animation="rotateShapeReverse 22s linear infinite"
              opacity={0.35}
            /> */}
            {/* Diagonal lines */}
            {/* <Box
              position="absolute"
              top="10%"
              left="-10%"
              w="150%"
              h="1px"
              bg={colorMode === 'light' 
                ? 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
              }
              transform="rotate(-15deg)"
              animation="slideRight 12s linear infinite"
            />
            <Box
              position="absolute"
              bottom="20%"
              left="-10%"
              w="150%"
              h="1px"
              bg={colorMode === 'light'
                ? 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.2), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)'
              }
              transform="rotate(15deg)"
              animation="slideLeft 15s linear infinite"
            /> */}
            {/* Floating dots grid pattern */}
            {/* <Box
              position="absolute"
              top="15%"
              left="20%"
              w="6px"
              h="6px"
              borderRadius="full"
              bg={colorMode === 'light' ? 'blue.300' : 'blue.400'}
              animation="floatDot 5s ease-in-out infinite"
              opacity={0.4}
            />
            <Box
              position="absolute"
              top="35%"
              right="25%"
              w="8px"
              h="8px"
              borderRadius="full"
              bg={colorMode === 'light' ? 'purple.300' : 'purple.400'}
              animation="floatDot 7s ease-in-out infinite"
              sx={{ animationDelay: '-2s' }}
              opacity={0.4}
            />
            <Box
              position="absolute"
              bottom="30%"
              left="30%"
              w="7px"
              h="7px"
              borderRadius="full"
              bg={colorMode === 'light' ? 'cyan.300' : 'cyan.400'}
              animation="floatDot 6s ease-in-out infinite"
              sx={{ animationDelay: '-4s' }}
              opacity={0.4}
            />
            <Box
              position="absolute"
              top="60%"
              right="15%"
              w="5px"
              h="5px"
              borderRadius="full"
              bg={colorMode === 'light' ? 'pink.300' : 'pink.400'}
              animation="floatDot 8s ease-in-out infinite"
              sx={{ animationDelay: '-1s' }}
              opacity={0.4}
            />
          </Box> */}
          
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
                  {step === 'email' && (
                    <>
                      {/* Email Step */}
                      <VStack spacing={2} align="center">
                        <Heading size="lg" textAlign="center">
                          Forgot your password?
                        </Heading>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          Enter your email address to receive a password reset code.
                        </Text>
                      </VStack>

                      <form onSubmit={handleRequestOtp}>
                        <VStack spacing={4}>
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

                          <Button
                            type="submit"
                            colorScheme="primary"
                            size="lg"
                            w="full"
                            isLoading={isLoading}
                            loadingText="Sending code..."
                          >
                            Send reset code
                          </Button>
                        </VStack>
                      </form>

                      <Button
                        as={NextLink}
                        href="/login"
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        size="md"
                        w="full"
                      >
                        Back to login
                      </Button>
                    </>
                  )}

                  {step === 'otp' && (
                    <>
                      {/* OTP Verification Step */}
                      <VStack spacing={2} align="center">
                        <Heading size="lg" textAlign="center">
                          Verify your email
                        </Heading>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          We've sent a 6-digit code to <strong>{email}</strong>
                        </Text>
                      </VStack>

                      <form onSubmit={handleVerifyOtp}>
                        <VStack spacing={4}>
                          <FormControl isInvalid={!!errors.otp}>
                            <FormLabel htmlFor="otp">Verification Code</FormLabel>
                            <Input
                              id="otp"
                              type="text"
                              placeholder="Enter 6-digit code"
                              value={otp}
                              onChange={(e) => {
                                setOtp(e.target.value)
                                if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }))
                              }}
                              size="lg"
                              maxLength={6}
                            />
                            <FormErrorMessage>{errors.otp}</FormErrorMessage>
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="primary"
                            size="lg"
                            w="full"
                            isLoading={isLoading}
                            loadingText="Verifying..."
                          >
                            Verify code
                          </Button>
                        </VStack>
                      </form>

                      <Button
                        onClick={() => setStep('email')}
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        size="md"
                        w="full"
                      >
                        Back to email
                      </Button>
                    </>
                  )}

                  {step === 'password' && (
                    <>
                      {/* New Password Step */}
                      <VStack spacing={2} align="center">
                        <Heading size="lg" textAlign="center">
                          Set new password
                        </Heading>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          Choose a strong password for your account.
                        </Text>
                      </VStack>

                      <form onSubmit={handleResetPassword}>
                        <VStack spacing={4}>
                          <FormControl isInvalid={!!errors.password}>
                            <FormLabel htmlFor="password">New Password</FormLabel>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter new password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                              }}
                              size="lg"
                            />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                              }}
                              size="lg"
                            />
                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="primary"
                            size="lg"
                            w="full"
                            isLoading={isLoading}
                            loadingText="Resetting..."
                          >
                            Reset password
                          </Button>
                        </VStack>
                      </form>

                      <Button
                        onClick={() => setStep('otp')}
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        size="md"
                        w="full"
                      >
                        Back to verification
                      </Button>
                    </>
                  )}

                  {/* Sign Up Link */}
                  <Text textAlign="center" fontSize="sm" color="muted">
                    Don't have an account?{' '}
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
    </>
  )
}

export default ResetPassword