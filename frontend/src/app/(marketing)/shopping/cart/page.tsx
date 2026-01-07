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
  Image,
  IconButton,
  useToast,
  Spinner,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { cartService, Cart } from '@/lib/shop-service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()
  const { refreshCart } = useCart()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const totalBg = useColorModeValue('gray.50', 'gray.700')

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
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" />
      </Box>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Box pt={{ base: 28, md: 32 }} pb={12}>
        <Container maxW="container.md">
          <FallInPlace>
            <VStack spacing={6} py={12} textAlign="center">
              <Icon as={FiShoppingBag} boxSize={16} color={mutedColor} />
              <Heading size="lg">Your cart is empty</Heading>
              <Text color={mutedColor}>Add some products to get started</Text>
              <Button as={Link} href="/shopping" colorScheme="primary" rightIcon={<FiArrowRight />}>
                Continue Shopping
              </Button>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>
    )
  }

  const tax: number = cart.subtotal * 0.0 // No tax for now
  const shipping: number = 0 // Free shipping
  const total: number = cart.subtotal + tax + shipping

  return (
    <Box pt={{ base: 28, md: 32 }} pb={12}>
      <Container maxW="container.xl">
        <FallInPlace>
          <VStack spacing={8} align="start">
            <HStack justify="space-between" width="100%">
              <Heading size="xl">Shopping Cart ({cart.itemCount} items)</Heading>
              <Button
                variant="ghost"
                colorScheme="red"
                size="sm"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </HStack>

            <Stack direction={{ base: 'column', lg: 'row' }} spacing={8} width="100%" align="start">
              {/* Cart Items */}
              <VStack spacing={4} flex={1} width="100%">
                {cart.items.map((item) => (
                  <Card
                    key={item.id}
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="lg"
                    width="100%"
                  >
                    <CardBody>
                      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                        <Image
                          src={item.product.thumbnail || item.product.images[0] || '/images/placeholder.png'}
                          alt={item.product.name}
                          boxSize={{ base: '100%', md: '120px' }}
                          objectFit="cover"
                          borderRadius="md"
                        />

                        <VStack flex={1} align="start" spacing={2}>
                          <Link href={`/shopping/${item.product.slug}`}>
                            <Heading size="md" _hover={{ color: 'primary.500' }}>
                              {item.product.name}
                            </Heading>
                          </Link>

                          {item.selectedOptions && (
                            <HStack spacing={2} flexWrap="wrap">
                              {item.selectedOptions.size && (
                                <Badge>Size: {item.selectedOptions.size}</Badge>
                              )}
                              {item.selectedOptions.color && (
                                <Badge>Color: {item.selectedOptions.color}</Badge>
                              )}
                            </HStack>
                          )}

                          <Text fontSize="lg" fontWeight="bold" color="primary.500">
                            ৳{item.price.toLocaleString()}
                          </Text>

                          <HStack spacing={4} mt={2}>
                            <HStack>
                              <IconButton
                                aria-label="Decrease quantity"
                                icon={<FiMinus />}
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                isLoading={updating === item.id}
                                isDisabled={item.quantity <= 1}
                              />
                              <Text fontWeight="semibold" minW="40px" textAlign="center">
                                {item.quantity}
                              </Text>
                              <IconButton
                                aria-label="Increase quantity"
                                icon={<FiPlus />}
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                isLoading={updating === item.id}
                                isDisabled={item.quantity >= item.product.stockQuantity}
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
                        </VStack>

                        <VStack align="end" justify="space-between" minW="100px">
                          <Text fontSize="xl" fontWeight="bold">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </Text>
                        </VStack>
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>

              {/* Order Summary */}
              <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="lg"
                width={{ base: '100%', lg: '400px' }}
                position={{ base: 'relative', lg: 'sticky' }}
                top={{ base: 0, lg: '100px' }}
              >
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md">Order Summary</Heading>

                    <Divider />

                    <HStack justify="space-between" width="100%">
                      <Text>Subtotal</Text>
                      <Text fontWeight="semibold">৳{cart.subtotal.toLocaleString()}</Text>
                    </HStack>

                    <HStack justify="space-between" width="100%">
                      <Text>Shipping</Text>
                      <Text fontWeight="semibold" color="green.500">
                        {shipping === 0 ? 'FREE' : `৳${shipping.toLocaleString()}`}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" width="100%">
                      <Text>Tax</Text>
                      <Text fontWeight="semibold">৳{tax.toLocaleString()}</Text>
                    </HStack>

                    <Divider />

                    <HStack justify="space-between" width="100%">
                      <Text fontSize="xl" fontWeight="bold">
                        Total
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                        ৳{total.toLocaleString()}
                      </Text>
                    </HStack>

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
                      size="lg"
                      width="100%"
                    >
                      Continue Shopping
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </Stack>
          </VStack>
        </FallInPlace>
      </Container>
    </Box>
  )
}
