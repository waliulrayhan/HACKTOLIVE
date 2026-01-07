'use client'

import React from 'react'
import { Box, IconButton, Badge, useColorModeValue } from '@chakra-ui/react'
import { FiShoppingCart } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const FloatingCartButton: React.FC = () => {
  const router = useRouter()
  const { cartItemCount } = useCart()
  const bgColor = useColorModeValue('#2d3748', '#2d3748')
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.4)')

  return (
    <Box
      position="fixed"
      bottom="24px"
      left="24px"
      zIndex={1000}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        bg={bgColor}
        px={4}
        py={3}
        borderRadius="lg"
        boxShadow={`0 4px 12px ${shadowColor}`}
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: `0 6px 16px ${shadowColor}`,
        }}
        _active={{
          transform: 'scale(0.95)',
        }}
        onClick={() => router.push('/shopping/cart')}
      >
        <Box position="relative">
          <FiShoppingCart size={28} color="white" />
          {cartItemCount > 0 && (
            <Box
              position="absolute"
              top="-8px"
              right="-8px"
              bg="red.500"
              color="white"
              borderRadius="full"
              w="24px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
              boxShadow={`0 2px 8px ${shadowColor}`}
            >
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Box>
          )}
        </Box>

        <Box display="flex" flexDirection="column" gap={0}>
          <Box fontSize="sm" fontWeight="600" color="white">
            Cart
          </Box>
          <Box fontSize="xs" color="gray.300">
            {cartItemCount === 0 ? 'Empty' : `${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}`}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FloatingCartButton
