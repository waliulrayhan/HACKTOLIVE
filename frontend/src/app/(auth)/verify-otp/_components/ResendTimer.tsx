'use client'

import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react'

interface ResendTimerProps {
  initialTime?: number // in seconds
  onResend: () => void
  isLoading?: boolean
}

export default function ResendTimer({
  initialTime = 120,
  onResend,
  isLoading = false,
}: ResendTimerProps) {
  const [timer, setTimer] = useState(initialTime)
  const [canResend, setCanResend] = useState(false)
  const endTimeRef = useRef<number | null>(null)

  // Initialize or reset the timer with timestamp-based calculation
  const resetTimer = () => {
    const now = Date.now()
    endTimeRef.current = now + initialTime * 1000
    setTimer(initialTime)
    setCanResend(false)
  }

  useEffect(() => {
    // Initialize timer on mount
    resetTimer()
  }, [initialTime])

  useEffect(() => {
    if (!endTimeRef.current) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000))
      
      setTimer(remaining)
      
      if (remaining === 0) {
        setCanResend(true)
      }
    }

    // Update immediately
    updateTimer()

    // Then update every second
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [endTimeRef.current])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = () => {
    resetTimer()
    onResend()
  }

  return (
    <Box textAlign="center">
      {!canResend ? (
        <Text
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
        >
          Resend code in{' '}
          <Text as="span" fontWeight="bold" color="lime.600">
            {formatTime(timer)}
          </Text>
        </Text>
      ) : (
        <Button
          variant="link"
          colorScheme="lime"
          size="sm"
          onClick={handleResend}
          isLoading={isLoading}
          fontWeight="semibold"
        >
          Resend Verification Code
        </Button>
      )}
    </Box>
  )
}
