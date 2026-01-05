'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Image,
  Badge,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { cartService, orderService, Cart } from '@/lib/shop-service'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('MOBILE_BANKING')
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: 'Bangladesh',
    notes: '',
  })

  const toast = useToast()
  const router = useRouter()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  useEffect(() => {
    
    // Auto-fill form with user data if logged in
    const user = authService.getUser()
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: user.phone || '',
      }))
    }
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart()
      if (!data || data.items.length === 0) {
        router.push('/shopping/cart')
        return
      }
      setCart(data)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      router.push('/shopping/cart')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const order = await orderService.createOrder({
        ...formData,
        paymentMethod: paymentMethod as any,
      })

      // Clear session ID since cart is now empty
      cartService.clearSessionId()

      toast({
        title: 'Order placed successfully!',
        description: `Order number: ${order.orderNumber}`,
        status: 'success',
        duration: 5000,
      })

      router.push(`/shopping/orders/${order.orderNumber}`)
    } catch (error: any) {
      toast({
        title: 'Failed to create order',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" />
      </Box>
    )
  }

  if (!cart) {
    return null
  }

  const tax = cart.subtotal * 0.0
  const shipping = 0
  const total = cart.subtotal + tax + shipping

  return (
    <Box pt={{ base: 28, md: 32 }} pb={12}>
      <Container maxW="container.xl">
        <FallInPlace>
          <Heading size="xl" mb={8}>
            Checkout
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack direction={{ base: 'column', lg: 'row' }} spacing={8} align="start">
              {/* Checkout Form */}
              <VStack spacing={6} flex={1} width="100%">
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" width="100%">
                  <CardBody>
                    <VStack spacing={4}>
                      <Heading size="md" alignSelf="start">
                        Contact Information
                      </Heading>

                      <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" width="100%">
                  <CardBody>
                    <VStack spacing={4}>
                      <Heading size="md" alignSelf="start">
                        Shipping Address
                      </Heading>

                      <FormControl isRequired>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                          value={formData.shippingAddress}
                          onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input
                          value={formData.shippingCity}
                          onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>ZIP Code</FormLabel>
                        <Input
                          value={formData.shippingZip}
                          onChange={(e) => setFormData({ ...formData, shippingZip: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Country</FormLabel>
                        <Input value={formData.shippingCountry} isReadOnly />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" width="100%">
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Heading size="md">Payment Method</Heading>

                      <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                        <Stack spacing={3}>
                          <Radio value="MOBILE_BANKING">Mobile Banking (bKash, Nagad, Rocket)</Radio>
                          <Radio value="CARD">Credit/Debit Card</Radio>
                          <Radio value="BANK_TRANSFER">Bank Transfer</Radio>
                          <Radio value="CASH_ON_DELIVERY">Cash on Delivery</Radio>
                        </Stack>
                      </RadioGroup>
                    </VStack>
                  </CardBody>
                </Card>

                <FormControl>
                  <FormLabel>Order Notes (Optional)</FormLabel>
                  <Textarea
                    placeholder="Any special instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </FormControl>
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
                  <VStack spacing={4}>
                    <Heading size="md" alignSelf="start">
                      Order Summary
                    </Heading>

                    <Divider />

                    <VStack spacing={3} width="100%">
                      {cart.items.map((item) => (
                        <HStack key={item.id} spacing={3} width="100%" align="start">
                          <Image
                            src={item.product.thumbnail || item.product.images[0]}
                            alt={item.product.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <VStack flex={1} align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="semibold" noOfLines={2}>
                              {item.product.name}
                            </Text>
                            <Text fontSize="xs" color={mutedColor}>
                              Qty: {item.quantity}
                            </Text>
                          </VStack>
                          <Text fontSize="sm" fontWeight="semibold">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <Divider />

                    <HStack justify="space-between" width="100%">
                      <Text>Subtotal</Text>
                      <Text fontWeight="semibold">৳{cart.subtotal.toLocaleString()}</Text>
                    </HStack>

                    <HStack justify="space-between" width="100%">
                      <Text>Shipping</Text>
                      <Text fontWeight="semibold" color="green.500">
                        FREE
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
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      width="100%"
                      isLoading={submitting}
                      leftIcon={<FiCheckCircle />}
                    >
                      Place Order
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </Stack>
          </form>
        </FallInPlace>
      </Container>
    </Box>
  )
}
