'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setToken } = useAuth()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const token = searchParams.get('token')
        const userString = searchParams.get('user')

        if (!token || !userString) {
          toast.error('Authentication failed', {
            description: 'Invalid callback parameters',
          })
          router.push('/login')
          return
        }

        const user = JSON.parse(decodeURIComponent(userString))

        // Store token and user using context methods
        setToken(token)
        setUser(user)

        toast.success('Login successful!', {
          description: 'Welcome to HACKTOLIVE',
          duration: 2000,
        })

        // Redirect based on role
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else if (user.role === 'INSTRUCTOR') {
          router.push('/instructor/dashboard')
        } else {
          router.push('/student/dashboard')
        }
      } catch (error) {
        console.error('Google callback error:', error)
        toast.error('Authentication failed', {
          description: 'Unable to complete Google sign-in',
        })
        router.push('/login')
      }
    }

    handleGoogleCallback()
  }, [searchParams, router, setUser, setToken])

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text fontSize="lg" fontWeight="medium">
          Completing sign-in...
        </Text>
      </VStack>
    </Box>
  )
}
