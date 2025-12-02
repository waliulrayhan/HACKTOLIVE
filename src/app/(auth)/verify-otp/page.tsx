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
import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

const VerifyOTP: NextPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(120)
  const [canResend, setCanResend] = useState(false)
  const leftBgColor = useColorModeValue('#4d7c0f', '#365314')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode, toggleColorMode } = useColorMode()
  
  const contact = searchParams?.get('contact') || searchParams?.get('email') || 'your email'
  const verificationType = searchParams?.get('type') || '2fa'

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (otp === '123456') {
        toast.success('Verification successful! Redirecting...', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        })
        
        setTimeout(() => {
          if (verificationType === 'signup') {
            router.push('/dashboard')
          } else if (verificationType === 'reset-password') {
            router.push('/reset-password?verified=true')
          } else {
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        setError('Invalid verification code. Please try again.')
        toast.error('Invalid verification code. Please try again.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        })
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    setOtp('')
    setError('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`A new verification code has been sent to ${contact}`, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      })
      
      setTimer(120)
      setCanResend(false)
    } catch (err) {
      toast.error('Failed to resend code. Please try again.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster />
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
                      {contact}
                    </Text>
                  </Text>
                </VStack>

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

                    <Text
                      fontSize={{ base: 'xs', md: 'sm' }}
                      color="muted"
                      textAlign="center"
                    >
                      {canResend ? (
                        <Text as="span" color="red.500" fontWeight="medium">
                          Code expired
                        </Text>
                      ) : (
                        <>
                          Code expires in{' '}
                          <Text as="span" fontWeight="bold" color="blue.500">
                            {formatTime(timer)}
                          </Text>
                        </>
                      )}
                    </Text>

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

                    <Text 
                      textAlign="center" 
                      fontSize={{ base: 'xs', md: 'sm' }} 
                      color="muted"
                      px={{ base: 2, md: 0 }}
                    >
                      Didn't receive the code?{' '}
                      <Button
                        variant="link"
                        colorScheme="blue"
                        size="sm"
                        onClick={handleResendCode}
                        isDisabled={!canResend || isLoading}
                        fontWeight="semibold"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        Resend Code
                      </Button>
                    </Text>

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

                {/* Demo Info */}
                <Box
                  p={{ base: 3, md: 4 }}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  borderRadius="md"
                  borderLeft="4px"
                  borderColor="blue.500"
                  mx={{ base: 2, md: 0 }}
                >
                  <Text
                    fontSize={{ base: '2xs', md: 'xs' }}
                    color={useColorModeValue('blue.700', 'blue.200')}
                    fontWeight="medium"
                  >
                    <strong>Demo Mode:</strong> Use code "123456" to verify
                  </Text>
                </Box>
              </VStack>
            </Box>
          </PageTransition>
        </Flex>
      </GridItem>
    </Grid>
    </>
  )
}

export default VerifyOTP
