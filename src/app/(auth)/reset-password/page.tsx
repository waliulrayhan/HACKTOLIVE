'use client'

import { 
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { PageTransition } from '@/components/shared/motion/page-transition'
import { Header } from '@/components/marketing/layout/header'
import { NextPage } from 'next'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa'
import { useState } from 'react'
import NextLink from 'next/link'

const ResetPassword: NextPage = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({ email: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const leftBgColor = useColorModeValue('#4d7c0f', '#365314')
  const rightBgColor = useColorModeValue('white', 'gray.800')
  const { colorMode } = useColorMode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({ email: '' })

    // Validation
    let hasError = false
    const newErrors = { email: '' }

    if (!email) {
      newErrors.email = 'Email is required'
      hasError = true
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    // Handle reset password logic here
    setIsLoading(true)
    
    try {
      console.log('Reset password for:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Reset password error:', error)
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
                  {!isSubmitted ? (
                    <>
                      {/* Title */}
                      <VStack spacing={2} align="center">
                        <Heading size="lg" textAlign="center">
                          Forgot your password?
                        </Heading>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          Enter the email address linked to your account, and we’ll send you a link to reset your password.
                        </Text>
                      </VStack>

                      {/* Reset Password Form */}
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
                                if (errors.email) setErrors({ email: '' })
                              }}
                              size="lg"
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            colorScheme="primary"
                            size="lg"
                            w="full"
                            isLoading={isLoading}
                            loadingText="Sending..."
                          >
                            Send reset link
                          </Button>
                        </VStack>
                      </form>

                      {/* Back to Login Link */}
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
                  ) : (
                    <>
                      {/* Success State */}
                      <VStack spacing={4} align="center" py={8}>
                        <Box
                          p={4}
                          borderRadius="full"
                          bg={colorMode === 'light' ? 'green.100' : 'green.900'}
                        >
                          <Icon 
                            as={FaEnvelope} 
                            w={8} 
                            h={8} 
                            color={colorMode === 'light' ? 'green.600' : 'green.300'}
                          />
                        </Box>
                        <Heading size="lg" textAlign="center">
                          Check your email
                        </Heading>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          We've sent a password reset link to <strong>{email}</strong>
                        </Text>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          Click the link in the email to reset your password. If you don't see it, check your spam folder.
                        </Text>
                      </VStack>

                      {/* Actions */}
                      <VStack spacing={3}>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          variant="outline"
                          size="lg"
                          w="full"
                        >
                          Try another email
                        </Button>
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
                      </VStack>
                    </>
                  )}

                  {/* Sign Up Link */}
                  {!isSubmitted && (
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
                  )}
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
