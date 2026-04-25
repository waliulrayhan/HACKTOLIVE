'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Icon,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Spinner,
  Divider,
  Badge,
  Stack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus, FiPackage, FiArrowLeft } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { cartService, Cart } from '@/lib/shop-service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/context/CartContext'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()
  const { refreshCart } = useCart()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const accentColor = useColorModeValue('primary.500', 'primary.400')
  const iconBg = useColorModeValue('primary.50', 'primary.900')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart()
      setCart(data)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    setUpdating(itemId)
    try {
      const data = await cartService.updateCartItem(itemId, quantity)
      setCart(data)
      await refreshCart()
      toast.success('Cart updated', {
        duration: 2000,
      })
    } catch (error: any) {
      toast.error('Failed to update cart', {
        description: error.response?.data?.message || 'Please try again',
        duration: 3000,
      })
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const data = await cartService.removeFromCart(itemId)
      setCart(data)
      await refreshCart()
      toast.success('Item removed from cart', {
        duration: 2000,
      })
    } catch (error: any) {
      toast.error('Failed to remove item', {
        description: error.response?.data?.message || 'Please try again',
        duration: 3000,
      })
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    try {
      const data = await cartService.clearCart()
      setCart(data)
      await refreshCart()
      toast.success('Cart cleared', {
        duration: 2000,
      })
    } catch (error: any) {
      toast.error('Failed to clear cart', {
        description: 'Please try again',
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <Box position="relative" minH="100vh">
        <BackgroundGradient height="100%" zIndex={-1} />
        <Container maxW="container.xl" pt={{ base: 32, md: 40 }}>
          <VStack spacing={8}>
            <Spinner size="xl" color={accentColor} thickness="4px" />
            <Text color={mutedColor}>Loading your cart...</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Box position="relative" minH="100vh">
        <BackgroundGradient height="100%" zIndex={-1} />
        <Container maxW="container.lg" pt={{ base: 32, md: 40 }} pb={20}>
          <FallInPlace>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="xl">
              <CardBody>
                <VStack spacing={8} py={12} textAlign="center">
                  <Flex
                    align="center"
                    justify="center"
                    w={20}
                    h={20}
                    borderRadius="full"
                    bg={iconBg}
                  >
                    <Icon as={FiShoppingBag} boxSize={10} color={accentColor} />
                  </Flex>
                  <VStack spacing={3}>
                    <Heading size="lg">Your Cart is Empty</Heading>
                    <Text color={mutedColor} maxW="md">
                      Looks like you haven't added anything to your cart yet. Explore our products and find something you'll love!
                    </Text>
                  </VStack>
                  <Button
                    as={Link}
                    href="/shopping"
                    colorScheme="primary"
                    size="lg"
                    rightIcon={<FiArrowRight />}
                  >
                    Continue Shopping
                  </Button>
                </VStack>
              </CardBody>
             </Card>
           </FallInPlace>
         </Container>
      </Box>
    )
  }

  const tax: number = cart.subtotal * 0.0
  const shipping: number = 0
  const total: number = cart.subtotal + tax + shipping

  return (
    <Box position="relative" minH="100vh">
      <BackgroundGradient height="100%" zIndex={-1} />
      <Container maxW="container.xl" pt={{ base: 32, md: 40 }} pb={20}>
        <FallInPlace>
          <VStack spacing={8} align="stretch">
            {/* Back Button */}
            <Box>
              <Button
                as={Link}
                href="/shopping"
                variant="ghost"
                colorScheme="gray"
                leftIcon={<Icon as={FiArrowLeft} />}
                size="sm"
                _hover={{ bg: 'green.50', color: 'green.600', _dark: { bg: 'green.900', color: 'green.400' } }}
              >
                Back to Shop
              </Button>
            </Box>
            {/* Header */}
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Heading size="xl">Shopping Cart</Heading>
                <Text color={mutedColor}>{cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart</Text>
              </VStack>
              <Button
                variant="ghost"
                colorScheme="red"
                size="sm"
                onClick={clearCart}
                leftIcon={<FiTrash2 />}
              >
                Clear Cart
              </Button>
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
              {/* Cart Items */}
              <Box gridColumn={{ base: 'span 1', lg: 'span 2' }}>
                <VStack spacing={4} align="stretch">
                  {cart.items.map((item, index) => (
                    <FallInPlace key={item.id} delay={index * 0.1}>
                      <Card
                        bg={cardBg}
                        borderColor={borderColor}
                        borderWidth="1px"
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        transition="all 0.2s"
                      >
                        <CardBody p={4}>
                          <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                            {/* Product Image */}
                            <Box
                              flexShrink={0}
                              w={{ base: '100%', sm: '120px' }}
                              h={{ base: '200px', sm: '120px' }}
                              position="relative"
                              borderRadius="md"
                              overflow="hidden"
                              bg={borderColor}
                            >
                              <NextImage
                                src={getFullImageUrl(item.product.thumbnail || item.product.images[0], 'general')}
                                alt={item.product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 640px) 100vw, 120px"
                              />
                            </Box>

                            {/* Product Info */}
                            <VStack flex={1} align="start" spacing={2}>
                              <Link href={`/shopping/${item.product.slug}`}>
                                <Heading
                                  size="sm"
                                  noOfLines={2}
                                  _hover={{ color: accentColor }}
                                  cursor="pointer"
                                  transition="color 0.2s"
                                >
                                  {item.product.name}
                                </Heading>
                              </Link>

                              {item.selectedOptions && (
                                <HStack spacing={2} flexWrap="wrap">
                                  {item.selectedOptions.size && (
                                    <Badge colorScheme="blue" fontSize="xs">
                                      Size: {item.selectedOptions.size}
                                    </Badge>
                                  )}
                                  {item.selectedOptions.color && (
                                    <Badge colorScheme="purple" fontSize="xs">
                                      Color: {item.selectedOptions.color}
                                    </Badge>
                                  )}
                                </HStack>
                              )}

                              <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                                {item.price.toLocaleString()} BDT
                              </Text>

                              {/* Quantity Controls */}
                              <HStack spacing={3} mt={2}>
                                <HStack
                                  bg={iconBg}
                                  borderRadius="md"
                                  p={1}
                                  spacing={0}
                                >
                                  <IconButton
                                    aria-label="Decrease quantity"
                                    icon={<FiMinus />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    isLoading={updating === item.id}
                                    isDisabled={item.quantity <= 1}
                                    _hover={{ bg: 'whiteAlpha.300' }}
                                  />
                                  <Text
                                    fontWeight="semibold"
                                    minW="40px"
                                    textAlign="center"
                                    px={2}
                                  >
                                    {item.quantity}
                                  </Text>
                                  <IconButton
                                    aria-label="Increase quantity"
                                    icon={<FiPlus />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    isLoading={updating === item.id}
                                    isDisabled={item.quantity >= item.product.stockQuantity}
                                    _hover={{ bg: 'whiteAlpha.300' }}
                                  />
                                </HStack>

                                <IconButton
                                  aria-label="Remove item"
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => removeItem(item.id)}
                                  isLoading={updating === item.id}
                                />
                              </HStack>

                              {item.product.stockQuantity < 10 && (
                                <Text fontSize="xs" color="orange.500">
                                  Only {item.product.stockQuantity} left in stock
                                </Text>
                              )}
                            </VStack>

                            {/* Item Total */}
                            <VStack align="end" justify="space-between" minW="100px">
                              <Text fontSize="lg" fontWeight="bold">
                                {(item.price * item.quantity).toLocaleString()} BDT
                              </Text>
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    </FallInPlace>
                  ))}
                </VStack>
              </Box>

              {/* Order Summary */}
              <Box gridColumn="span 1">
                <FallInPlace delay={0.2}>
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    shadow="xl"
                    position="sticky"
                    top="100px"
                  >
                    <CardBody p={6}>
                      <VStack spacing={5} align="stretch">
                        <Heading size="md">Order Summary</Heading>

                        <Divider />

                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <Text color={mutedColor}>Subtotal</Text>
                            <Text fontWeight="semibold">
                              {cart.subtotal.toLocaleString()} BDT
                            </Text>
                          </HStack>

                          <HStack justify="space-between">
                            <Text color={mutedColor}>Shipping</Text>
                            <Text fontWeight="semibold" color="green.500">
                              {shipping === 0 ? 'FREE' : `${shipping.toLocaleString()} BDT`}
                            </Text>
                          </HStack>

                          <HStack justify="space-between">
                            <Text color={mutedColor}>Tax</Text>
                            <Text fontWeight="semibold">
                              {tax.toLocaleString()} BDT
                            </Text>
                          </HStack>
                        </VStack>

                        <Divider />

                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold">
                            Total
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                            {total.toLocaleString()} BDT
                          </Text>
                        </HStack>

                        <VStack spacing={3} pt={2}>
                          <Button
                            colorScheme="primary"
                            size="lg"
                            width="100%"
                            rightIcon={<FiArrowRight />}
                            onClick={() => router.push('/shopping/checkout')}
                          >
                            Proceed to Checkout
                          </Button>

                          <Button
                            as={Link}
                            href="/shopping"
                            variant="outline"
                            size="md"
                            width="100%"
                          >
                            Continue Shopping
                          </Button>
                        </VStack>

                        {/* Trust Badges */}
                        <Divider />
                        <VStack spacing={2} pt={2}>
                          <HStack color={mutedColor} fontSize="sm">
                            <Icon as={FiPackage} />
                            <Text>Free shipping on all orders</Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </FallInPlace>
              </Box>
            </SimpleGrid>
          </VStack>
        </FallInPlace>
      </Container>
    </Box>
  )
}
