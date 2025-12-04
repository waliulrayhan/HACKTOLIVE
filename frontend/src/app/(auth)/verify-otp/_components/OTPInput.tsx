'use client'

import {
  Box,
  HStack,
  PinInput,
  PinInputField,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  isDisabled?: boolean
  isInvalid?: boolean
  error?: string
  label?: string
  helperText?: string
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  isDisabled = false,
  isInvalid = false,
  error = '',
  label = 'Enter Verification Code',
  helperText,
}: OTPInputProps) {
  const inputBg = useColorModeValue('gray.50', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')
  const inputHoverBorder = useColorModeValue('gray.400', 'gray.500')

  const handleComplete = (value: string) => {
    if (onComplete) {
      onComplete(value)
    }
  }

  return (
    <FormControl isInvalid={isInvalid}>
      {label && (
        <FormLabel
          textAlign="center"
          color={useColorModeValue('gray.700', 'gray.300')}
          mb={4}
        >
          {label}
        </FormLabel>
      )}
      
      <HStack justify="center" spacing={3}>
        <PinInput
          otp
          size="lg"
          value={value}
          onChange={onChange}
          onComplete={handleComplete}
          placeholder="○"
          isDisabled={isDisabled}
          focusBorderColor="lime.500"
          errorBorderColor="red.500"
        >
          {Array.from({ length }).map((_, index) => (
            <PinInputField
              key={index}
              bg={inputBg}
              borderColor={inputBorder}
              _hover={{
                borderColor: inputHoverBorder,
              }}
            />
          ))}
        </PinInput>
      </HStack>

      {helperText && !error && (
        <Text
          mt={3}
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
          textAlign="center"
        >
          {helperText}
        </Text>
      )}

      {error && (
        <FormErrorMessage justifyContent="center" mt={3}>
          {error}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}
