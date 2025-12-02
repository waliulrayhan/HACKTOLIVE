'use client'

import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
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

  const handleResend = () => {
    setTimer(initialTime)
    setCanResend(false)
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
