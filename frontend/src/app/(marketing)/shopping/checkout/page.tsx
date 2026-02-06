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
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Image,
  Icon,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiArrowLeft,
} from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { cartService, orderService, Cart } from '@/lib/shop-service'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import { toast } from '@/components/ui/toast'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'
import { academyService } from '@/lib/academy-service'

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_PAYMENT')
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

  const router = useRouter()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const accentColor = useColorModeValue('primary.500', 'primary.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')

  useEffect(() => {
    // Auto-fill form with user data if logged in
    const user = authService.getUser()
    if (user) {
      setFormData((prev) => ({
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
      // For Cash on Delivery, create order directly
      if (paymentMethod === 'CASH_ON_DELIVERY') {
        const order = await orderService.createOrder({
          ...formData,
          paymentMethod: paymentMethod as any,
        })

        // Clear session ID since cart is now empty
        cartService.clearSessionId()

        toast.success('Order placed successfully!', {
          description: `Order number: ${order.orderNumber}. You'll pay when you receive your order.`,
          duration: 5000,
        })

        router.push(`/shopping/orders/${order.orderNumber}`)
        return
      }

      // For online payment (SSLCommerz), send cart items
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty')
      }

      const cartItems = cart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        voucherCode: item.voucherCode || undefined,
      }))

      // For online payment, use MOBILE_BANKING as default (SSLCommerz will show all options)
      const payment = await academyService.initiatePayment({
        cartItems,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingCountry: formData.shippingCountry,
        shippingPostalCode: formData.shippingZip,
      } as any)

      if (payment.success && payment.gatewayUrl) {
        // Clear cart session after successful payment initiation
        cartService.clearSessionId()
        
        // Redirect to SSLCommerz payment gateway
        window.location.href = payment.gatewayUrl
      } else {
        throw new Error('Failed to initialize payment')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error('Failed to process checkout', {
        description: error.response?.data?.message || error.message || 'Please try again',
        duration: 5000,
      })
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color={accentColor} thickness="4px" />
      </Box>
    )
  }

  if (!cart) {
    return null
  }

  // Calculate shipping (100 BDT) - matching backend calculation
  const tax = 0
  const shipping = 100
  const total = cart.subtotal + shipping

  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" zIndex={-1} />
      
      <Box pt={{ base: 28, md: 32 }} pb={16} bg={bgColor}>
        <Container maxW="container.xl">
          <FallInPlace>
            {/* Back Button */}
            <Box mb={6}>
              <Button
                as="a"
                href="/shopping/cart"
                variant="ghost"
                colorScheme="gray"
                leftIcon={<Icon as={FiArrowLeft} />}
                size="sm"
                _hover={{ bg: 'green.50', color: 'green.600', _dark: { bg: 'green.900', color: 'green.400' } }}
              >
                Back to Cart
              </Button>
            </Box>
            {/* Header */}
            <VStack spacing={3} mb={10} textAlign="center">
              <Flex
                w={14}
                h={14}
                align="center"
                justify="center"
                borderRadius="xl"
                bg={iconBg}
                color={iconColor}
              >
                <Icon as={FiShoppingBag} boxSize={7} />
              </Flex>
              <Heading size="2xl" fontWeight="bold">
                Checkout
              </Heading>
              <Text fontSize="lg" color={mutedColor} maxW="2xl">
                Complete your order securely
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                {/* Left Column - Forms */}
                <VStack spacing={6} gridColumn={{ base: 1, lg: 'span 2' }}>
                  {/* Contact Information */}
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                    width="100%"
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <CardBody p={6}>
                      <HStack spacing={3} mb={5}>
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                        >
                          <Icon as={FiUser} boxSize={5} />
                        </Flex>
                        <Heading size="md" fontWeight="semibold">
                          Contact Information
                        </Heading>
                      </HStack>

                      <VStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Full Name
                          </FormLabel>
                          <Input
                            value={formData.customerName}
                            onChange={(e) =>
                              setFormData({ ...formData, customerName: e.target.value })
                            }
                            placeholder="Enter your full name"
                            size="lg"
                            bg={inputBg}
                            borderColor={inputBorder}
                            _hover={{ borderColor: accentColor }}
                            _focus={{
                              borderColor: accentColor,
                              boxShadow: `0 0 0 1px ${accentColor}`,
                            }}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Email Address
                          </FormLabel>
                          <Input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) =>
                              setFormData({ ...formData, customerEmail: e.target.value })
                            }
                            placeholder="your@email.com"
                            size="lg"
                            bg={inputBg}
                            borderColor={inputBorder}
                            _hover={{ borderColor: accentColor }}
                            _focus={{
                              borderColor: accentColor,
                              boxShadow: `0 0 0 1px ${accentColor}`,
                            }}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Phone Number
                          </FormLabel>
                          <Input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) =>
                              setFormData({ ...formData, customerPhone: e.target.value })
                            }
                            placeholder="+880 1XXX XXXXXX"
                            size="lg"
                            bg={inputBg}
                            borderColor={inputBorder}
                            _hover={{ borderColor: accentColor }}
                            _focus={{
                              borderColor: accentColor,
                              boxShadow: `0 0 0 1px ${accentColor}`,
                            }}
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Shipping Address */}
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                    width="100%"
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <CardBody p={6}>
                      <HStack spacing={3} mb={5}>
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                        >
                          <Icon as={FiMapPin} boxSize={5} />
                        </Flex>
                        <Heading size="md" fontWeight="semibold">
                          Shipping Address
                        </Heading>
                      </HStack>

                      <VStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Address
                          </FormLabel>
                          <Textarea
                            value={formData.shippingAddress}
                            onChange={(e) =>
                              setFormData({ ...formData, shippingAddress: e.target.value })
                            }
                            placeholder="House/Flat, Street, Area"
                            rows={3}
                            size="lg"
                            bg={inputBg}
                            borderColor={inputBorder}
                            _hover={{ borderColor: accentColor }}
                            _focus={{
                              borderColor: accentColor,
                              boxShadow: `0 0 0 1px ${accentColor}`,
                            }}
                          />
                        </FormControl>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm" fontWeight="medium">
                              City
                            </FormLabel>
                            <Input
                              value={formData.shippingCity}
                              onChange={(e) =>
                                setFormData({ ...formData, shippingCity: e.target.value })
                              }
                              placeholder="e.g. Dhaka"
                              size="lg"
                              bg={inputBg}
                              borderColor={inputBorder}
                              _hover={{ borderColor: accentColor }}
                              _focus={{
                                borderColor: accentColor,
                                boxShadow: `0 0 0 1px ${accentColor}`,
                              }}
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontSize="sm" fontWeight="medium">
                              ZIP Code
                            </FormLabel>
                            <Input
                              value={formData.shippingZip}
                              onChange={(e) =>
                                setFormData({ ...formData, shippingZip: e.target.value })
                              }
                              placeholder="e.g. 1200"
                              size="lg"
                              bg={inputBg}
                              borderColor={inputBorder}
                              _hover={{ borderColor: accentColor }}
                              _focus={{
                                borderColor: accentColor,
                                boxShadow: `0 0 0 1px ${accentColor}`,
                              }}
                            />
                          </FormControl>
                        </SimpleGrid>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            Country
                          </FormLabel>
                          <Input
                            value={formData.shippingCountry}
                            isReadOnly
                            size="lg"
                            bg={inputBg}
                            borderColor={inputBorder}
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Payment Method */}
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                    width="100%"
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <CardBody p={6}>
                      <HStack spacing={3} mb={5}>
                        <Flex
                          w={10}
                          h={10}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                          color={iconColor}
                        >
                          <Icon as={FiCreditCard} boxSize={5} />
                        </Flex>
                        <Heading size="md" fontWeight="semibold">
                          Payment Method
                        </Heading>
                      </HStack>

                      <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                        <Stack spacing={3}>
                          <Box
                            p={4}
                            borderWidth="2px"
                            borderRadius="lg"
                            borderColor={
                              paymentMethod === 'ONLINE_PAYMENT' ? accentColor : borderColor
                            }
                            bg={paymentMethod === 'ONLINE_PAYMENT' ? iconBg : 'transparent'}
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ borderColor: accentColor, transform: 'translateY(-2px)', shadow: 'md' }}
                            onClick={() => setPaymentMethod('ONLINE_PAYMENT')}
                          >
                            <HStack spacing={3}>
                              <Flex
                                w={8}
                                h={8}
                                align="center"
                                justify="center"
                                borderRadius="md"
                                bg={paymentMethod === 'ONLINE_PAYMENT' ? accentColor : borderColor}
                                color="white"
                              >
                                <Icon as={FiCreditCard} boxSize={4} />
                              </Flex>
                              <Radio value="ONLINE_PAYMENT" size="lg" colorScheme="primary" flex={1}>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="semibold">Online Payment (SSLCommerz)</Text>
                                  <Text fontSize="xs" color={mutedColor}>
                                    Mobile Banking, Card, Bank Transfer
                                  </Text>
                                </VStack>
                              </Radio>
                            </HStack>
                          </Box>

                          <Box
                            p={4}
                            borderWidth="2px"
                            borderRadius="lg"
                            borderColor={
                              paymentMethod === 'CASH_ON_DELIVERY' ? accentColor : borderColor
                            }
                            bg={paymentMethod === 'CASH_ON_DELIVERY' ? iconBg : 'transparent'}
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ borderColor: accentColor, transform: 'translateY(-2px)', shadow: 'md' }}
                            onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                          >
                            <HStack spacing={3}>
                              <Flex
                                w={8}
                                h={8}
                                align="center"
                                justify="center"
                                borderRadius="md"
                                bg={paymentMethod === 'CASH_ON_DELIVERY' ? 'green.500' : borderColor}
                                color="white"
                              >
                                <Icon as={FiTruck} boxSize={4} />
                              </Flex>
                              <Radio value="CASH_ON_DELIVERY" size="lg" colorScheme="primary" flex={1}>
                                <HStack justify="space-between" width="100%">
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="semibold">Cash on Delivery</Text>
                                    <Text fontSize="xs" color={mutedColor}>
                                      Pay when you receive
                                    </Text>
                                  </VStack>
                                  <Box
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    bg="green.50"
                                    _dark={{ bg: 'green.900' }}
                                  >
                                    <Text fontSize="xs" fontWeight="semibold" color="green.600" _dark={{ color: 'green.400' }}>
                                      Popular
                                    </Text>
                                  </Box>
                                </HStack>
                              </Radio>
                            </HStack>
                          </Box>
                        </Stack>
                      </RadioGroup>
                    </CardBody>
                  </Card>

                  {/* Additional Notes */}
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Order Notes (Optional)
                    </FormLabel>
                    <Textarea
                      placeholder="Any special instructions for your order..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      size="lg"
                      bg={inputBg}
                      borderColor={inputBorder}
                      _hover={{ borderColor: accentColor }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                  </FormControl>
                </VStack>

                {/* Right Column - Order Summary */}
                <Box>
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                    shadow="sm"
                    position="sticky"
                    top="100px"
                  >
                    <CardBody p={6}>
                      <VStack spacing={5}>
                        <HStack spacing={3} width="100%">
                          <Flex
                            w={10}
                            h={10}
                            align="center"
                            justify="center"
                            borderRadius="lg"
                            bg={iconBg}
                            color={iconColor}
                          >
                            <Icon as={FiPackage} boxSize={5} />
                          </Flex>
                          <Heading size="md" fontWeight="semibold">
                            Order Summary
                          </Heading>
                        </HStack>

                        <Divider />

                        <VStack spacing={3} width="100%" maxH="300px" overflowY="auto">
                          {cart.items.map((item) => (
                            <HStack
                              key={item.id}
                              spacing={3}
                              width="100%"
                              align="start"
                              p={2}
                              borderRadius="md"
                              _hover={{ bg: iconBg }}
                              transition="all 0.2s"
                            >
                              <Box
                                position="relative"
                                boxSize="50px"
                                borderRadius="md"
                                overflow="hidden"
                                flexShrink={0}
                              >
                                <NextImage
                                  src={getFullImageUrl(
                                    item.product.thumbnail || item.product.images[0]
                                  )}
                                  alt={item.product.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </Box>
                              <VStack flex={1} align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                                  {item.product.name}
                                </Text>
                                <Text fontSize="xs" color={mutedColor}>
                                  Qty: {item.quantity}
                                </Text>
                              </VStack>
                              <Text fontSize="sm" fontWeight="bold" color={accentColor}>
                                {(item.price * item.quantity).toLocaleString()} BDT
                              </Text>
                            </HStack>
                          ))}
                        </VStack>

                        <Divider />

                        <VStack spacing={3} width="100%">
                          <HStack justify="space-between" width="100%">
                            <Text fontSize="sm" color={mutedColor}>
                              Subtotal
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">
                              {cart.subtotal.toLocaleString()} BDT
                            </Text>
                          </HStack>

                          <HStack justify="space-between" width="100%">
                            <HStack spacing={2}>
                              <Icon as={FiTruck} color={mutedColor} boxSize={4} />
                              <Text fontSize="sm" color={mutedColor}>
                                Shipping
                              </Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight="semibold">
                              {shipping.toLocaleString()} BDT
                            </Text>
                          </HStack>
                        </VStack>

                        <Divider />

                        <HStack justify="space-between" width="100%">
                          <Text fontSize="lg" fontWeight="bold">
                            Total
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                            {total.toLocaleString()} BDT
                          </Text>
                        </HStack>

                        <Button
                          type="submit"
                          colorScheme="primary"
                          size="lg"
                          width="100%"
                          isLoading={submitting}
                          loadingText="Processing..."
                          leftIcon={<Icon as={FiCheckCircle} />}
                          _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                          transition="all 0.2s"
                        >
                          Place Order
                        </Button>

                        <Text fontSize="xs" color={mutedColor} textAlign="center">
                          By placing your order, you agree to our terms and conditions
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </SimpleGrid>
            </form>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  )
}
