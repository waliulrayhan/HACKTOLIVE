'use client'

import { 
  Box,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
  FormErrorMessage,
  VStack,
  Text,
  Heading,
  useColorMode,
  Grid,
  GridItem,
  Image,
  PinInput,
  PinInputField,
  HStack,
  Center,
  Flex,
  IconButton,
} from '@chakra-ui/react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { PageTransition } from '@/components/shared/motion/page-transition'
import { Header } from '../../(marketing)/_components/layout/header'
import { NextPage } from 'next'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useState, useEffect, Suspense } from 'react'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from '@/components/ui/toast'
import ResendTimer from './_components/ResendTimer'

const VerifyOTPContent = () => {
  const searchParams = useSearchParams()
  const { verifyOtp, resendOtp } = useAuth()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const leftBgColor = useColorModeValue('#4d7c0f', '#365314')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode, toggleColorMode } = useColorMode()
  
  const userId = searchParams?.get('userId') || ''
  const email = searchParams?.get('email') || 'your email'
  const type = (searchParams?.get('type') || 'login') as 'registration' | 'login'
  const redirectTo = searchParams?.get('redirect') || undefined

  const handleOtpChange = (value: string) => {
    setOtp(value)
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }
if (!userId) {
      setError('Invalid verification session. Please try again.')
      return
    }

    setIsLoading(true)
    
    try {
      await verifyOtp(userId, otp, type, redirectTo)
      
      toast.success('Verification successful!', {
        description: type === 'registration' ? 'Welcome to HackToLive!' : 'Welcome back!',
        duration: 2000,
      })
      // Redirect is handled in AuthContext
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired verification code.'
      setError(errorMsg)
      toast.error('Verification failed', {
        description: errorMsg,
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!userId) {
      setError('Invalid verification session. Please try again.')
      return
    }
    
    setIsLoading(true)
    setOtp('')
    setError('')
    
    try {
      await resendOtp(userId, type)
      
      toast.success('Code resent successfully!', {
        description: 'Please check your email for the new verification code.',
        duration: 3000,
      })
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to resend code. Please try again.'
      setError(errorMsg)
      toast.error('Failed to resend code', {
        description: errorMsg,
        duration: 4000,
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
          {/* <Button
            as={NextLink}
            href="/"
            leftIcon={<FaHome />}
            variant="ghost"
            size="sm"
            display={{ base: 'flex', lg: 'none' }}
          >
            Back to Home
          </Button>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
          /> */}
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
                <VStack spacing={2} align="center">
                  <Heading 
                    size={{ base: 'md', md: 'lg' }} 
                    textAlign="center"
                  >
                    Enter Verification Code
                  </Heading>
                  <Text 
                    fontSize={{ base: 'xs', md: 'sm' }} 
                    color="muted" 
                    textAlign="center"
                    px={{ base: 2, md: 0 }}
                  >
                    We've sent a 6-digit code to{' '}
                    <Text as="span" color="blue.500" fontWeight="semibold">
                      {email}
                    </Text>
                  </Text>
                </VStack>
email
                {/* OTP Form */}
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!error}>
                      <FormLabel 
                        textAlign="center"
                        fontSize={{ base: 'sm', md: 'md' }}
                      >
                        Enter Code
                      </FormLabel>
                      <Center>
                        <HStack spacing={{ base: 2, sm: 3 }}>
                          <PinInput
                            otp
                            size={{ base: 'md', md: 'lg' }}
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="○"
                            isDisabled={isLoading}
                            focusBorderColor="blue.500"
                            errorBorderColor="red.500"
                          >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                          </PinInput>
                        </HStack>
                      </Center>
                      {error && (
                        <FormErrorMessage 
                          justifyContent="center"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          {error}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="primary"
                      size={{ base: 'md', md: 'lg' }}
                      w="full"
                      isLoading={isLoading}
                      loadingText="Verifying..."
                    >
                      Verify Code
                    </Button>

                    <ResendTimer
                      initialTime={300}
                      onResend={handleResendCode}
                      isLoading={isLoading}
                    />

                    <Button
                      as={NextLink}
                      href="/login"
                      variant="ghost"
                      size={{ base: 'sm', md: 'md' }}
                      w="full"
                    >
                      ← Back to Login
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>
          </PageTransition>
        </Flex>
      </GridItem>
    </Grid>
    </>
  )
}

const VerifyOTP: NextPage = () => {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <VerifyOTPContent />
    </Suspense>
  )
}

export default VerifyOTP
