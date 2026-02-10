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
import OTPInput from '@/app/(auth)/verify-otp/_components/OTPInput'
import ResendTimer from '@/app/(auth)/verify-otp/_components/ResendTimer'
import { NextPage } from 'next'
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useState, useMemo } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import { toast } from '@/components/ui/toast'

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
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
  const passwordBoxBg = useColorModeValue('gray.50', 'gray.700')

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
      // Check if user exists and send OTP
      const response = await authService.forgotPassword(email)
      setUserId(response.userId) // Store the userId
      toast.success('OTP sent!', {
        description: 'A 6-digit verification code has been sent to your email.',
        duration: 3000,
      })
      setStep('otp')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.'
      
      // Check if the error is about user not being registered
      if (errorMessage.includes('No account found') || errorMessage.includes('not found')) {
        toast.error('Account not found', {
          description: 'No account exists with this email. Please check your email or sign up for a new account.',
          duration: 5000,
        })
        setErrors(prev => ({ ...prev, email: 'This email is not registered with us' }))
      } else {
        toast.error('Failed to send OTP', {
          description: errorMessage,
          duration: 5000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleResendOtp = async () => {
    if (!userId) {
      toast.error('Session expired', {
        description: 'Please start the password reset process again.',
        duration: 4000,
      })
      setStep('email')
      return
    }

    setIsLoading(true)
    setOtp('')
    setErrors({ email: '', otp: '', password: '', confirmPassword: '' })

    try {
      await authService.resendOtp(userId, 'PASSWORD_RESET')
      toast.success('Code resent successfully!', {
        description: 'Please check your email for the new verification code.',
        duration: 3000,
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      toast.error('Failed to resend code', {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ email: '', otp: '', password: '', confirmPassword: '' })
    
    if (otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter the complete 6-digit code' }))
      return
    }

    setIsLoading(true)
    try {
      // Verify OTP with backend before proceeding to password form
      await authService.verifyPasswordResetOtp(email, otp)
      toast.success('Code verified!', {
        description: 'Please enter your new password.',
        duration: 2000,
      })
      setStep('password')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired OTP code.'
      toast.error('Verification failed', {
        description: errorMessage,
        duration: 5000,
      })
      setErrors(prev => ({ ...prev, otp: 'Invalid or expired OTP. Please try again.' }))
    } finally {
      setIsLoading(false)
    }
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
                          <OTPInput
                            value={otp}
                            onChange={(value) => {
                              setOtp(value)
                              if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }))
                            }}
                            onComplete={(value) => {
                              // Auto-verify on complete (optional)
                            }}
                            isInvalid={!!errors.otp}
                            error={errors.otp}
                            label="Enter Verification Code"
                            helperText="Enter the 6-digit code sent to your email"
                          />

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

                          <ResendTimer
                            initialTime={300}
                            onResend={handleResendOtp}
                            isLoading={isLoading}
                          />
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
                            <InputGroup size="lg">
                              <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
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
                            {password && (
                              <Box mt={2} p={3} bg={passwordBoxBg} borderRadius="md">
                                <Text fontSize="xs" fontWeight="semibold" mb={2}>
                                  Password requirements:
                                </Text>
                                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                  <GridItem>
                                    <HStack spacing={1}>
                                      <Icon
                                        as={passwordRequirements.minLength ? FaCheckCircle : FaTimesCircle}
                                        color={passwordRequirements.minLength ? 'green.500' : 'gray.400'}
                                        boxSize={3}
                                      />
                                      <Text fontSize="xs">At least 8 characters</Text>
                                    </HStack>
                                  </GridItem>
                                  <GridItem>
                                    <HStack spacing={1}>
                                      <Icon
                                        as={passwordRequirements.hasUpperCase ? FaCheckCircle : FaTimesCircle}
                                        color={passwordRequirements.hasUpperCase ? 'green.500' : 'gray.400'}
                                        boxSize={3}
                                      />
                                      <Text fontSize="xs">One uppercase letter</Text>
                                    </HStack>
                                  </GridItem>
                                  <GridItem>
                                    <HStack spacing={1}>
                                      <Icon
                                        as={passwordRequirements.hasLowerCase ? FaCheckCircle : FaTimesCircle}
                                        color={passwordRequirements.hasLowerCase ? 'green.500' : 'gray.400'}
                                        boxSize={3}
                                      />
                                      <Text fontSize="xs">One lowercase letter</Text>
                                    </HStack>
                                  </GridItem>
                                  <GridItem>
                                    <HStack spacing={1}>
                                      <Icon
                                        as={passwordRequirements.hasNumber ? FaCheckCircle : FaTimesCircle}
                                        color={passwordRequirements.hasNumber ? 'green.500' : 'gray.400'}
                                        boxSize={3}
                                      />
                                      <Text fontSize="xs">One number</Text>
                                    </HStack>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <HStack spacing={1}>
                                      <Icon
                                        as={passwordRequirements.hasSpecialChar ? FaCheckCircle : FaTimesCircle}
                                        color={passwordRequirements.hasSpecialChar ? 'green.500' : 'gray.400'}
                                        boxSize={3}
                                      />
                                      <Text fontSize="xs">One special character (!@#$%^&*)</Text>
                                    </HStack>
                                  </GridItem>
                                </Grid>
                              </Box>
                            )}
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                            <InputGroup size="lg">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value)
                                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                                }}
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