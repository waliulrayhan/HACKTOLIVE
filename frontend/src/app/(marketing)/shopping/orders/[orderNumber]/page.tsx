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
  Spinner,
  Badge,
  Divider,
  Stack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { useState, useEffect, use } from 'react'
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiHome,
  FiShoppingBag,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCreditCard,
  FiArrowLeft,
} from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { orderService, Order } from '@/lib/shop-service'
import Link from 'next/link'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'

export default function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const successBg = useColorModeValue('green.50', 'green.900')
  const successColor = useColorModeValue('green.600', 'green.200')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const accentColor = useColorModeValue('primary.500', 'primary.400')

  useEffect(() => {
    fetchOrder()
  }, [resolvedParams.orderNumber])

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderByNumber(resolvedParams.orderNumber)
      setOrder(data)
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDING: 'yellow',
      CONFIRMED: 'blue',
      PROCESSING: 'purple',
      SHIPPED: 'cyan',
      DELIVERED: 'green',
      CANCELLED: 'red',
      REFUNDED: 'orange',
    }
    return colors[status] || 'gray'
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color={accentColor} thickness="4px" />
      </Box>
    )
  }

  if (!order) {
    return (
      <Box position="relative" overflow="hidden">
        <BackgroundGradient height="100%" zIndex={-1} />
        <Box pt={{ base: 28, md: 32 }} pb={12} bg={bgColor}>
          <Container maxW="container.md">
            <VStack spacing={6} py={12} textAlign="center">
              <Flex
                w={20}
                h={20}
                align="center"
                justify="center"
                borderRadius="2xl"
                bg={iconBg}
                color={iconColor}
              >
                <Icon as={FiShoppingBag} boxSize={10} />
              </Flex>
              <Heading size="lg">Order not found</Heading>
              <Text color={mutedColor}>The order you're looking for doesn't exist</Text>
              <Button
                as={Link}
                href="/shopping"
                colorScheme="primary"
                size="lg"
                leftIcon={<Icon as={FiHome} />}
              >
                Continue Shopping
              </Button>
            </VStack>
          </Container>
        </Box>
      </Box>
    )
  }

  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" zIndex={-1} />

      <Box pt={{ base: 28, md: 32 }} pb={16} bg={bgColor}>
        <Container maxW="container.xl">
          <FallInPlace>
            {/* Back Button */}
            <Box mb={6}>
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
                Order Details
              </Heading>
              <Text fontSize="lg" color={mutedColor}>
                Order #{order.orderNumber}
              </Text>
            </VStack>

            <VStack spacing={6} align="stretch">
              {/* Success Message */}
              <Card
                bg={successBg}
                borderWidth="2px"
                borderColor={successColor}
                borderRadius="xl"
                shadow="lg"
              >
                <CardBody p={8}>
                  <VStack spacing={4}>
                    <Flex
                      w={20}
                      h={20}
                      align="center"
                      justify="center"
                      borderRadius="2xl"
                      bg="white"
                      color={successColor}
                    >
                      <Icon as={FiCheckCircle} boxSize={10} />
                    </Flex>
                    <Heading size="lg" color={successColor}>
                      Order Placed Successfully!
                    </Heading>
                    <Text color={mutedColor} textAlign="center" fontSize="md">
                      Thank you for your order. We've received your order and will process it
                      shortly.
                    </Text>
                    <HStack spacing={4} flexWrap="wrap" justify="center" pt={2}>
                      <Badge
                        colorScheme={getStatusColor(order.status)}
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontSize="md"
                        fontWeight="semibold"
                      >
                        {order.status}
                      </Badge>
                      <Badge
                        colorScheme={getStatusColor(order.paymentStatus)}
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontSize="md"
                        fontWeight="semibold"
                      >
                        Payment: {order.paymentStatus}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Order Details */}
              <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                shadow="sm"
                _hover={{ shadow: 'md' }}
                transition="all 0.2s"
              >
                <CardBody p={6}>
                  <HStack spacing={3} mb={6}>
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
                      Order Information
                    </Heading>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={FiShoppingBag} color={iconColor} boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
                          Order Number
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">{order.orderNumber}</Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={FiCalendar} color={iconColor} boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
                          Order Date
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={FiCreditCard} color={iconColor} boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
                          Payment Method
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold">
                        {order.paymentMethod?.replace('_', ' ')}
                      </Text>
                    </Box>

                    {order.trackingNumber && (
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Icon as={FiTruck} color={iconColor} boxSize={4} />
                          <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
                            Tracking Number
                          </Text>
                        </HStack>
                        <Text fontWeight="semibold">{order.trackingNumber}</Text>
                      </Box>
                    )}
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Items */}
              <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                shadow="sm"
                _hover={{ shadow: 'md' }}
                transition="all 0.2s"
              >
                <CardBody p={6}>
                  <HStack spacing={3} mb={6}>
                    <Flex
                      w={10}
                      h={10}
                      align="center"
                      justify="center"
                      borderRadius="lg"
                      bg={iconBg}
                      color={iconColor}
                    >
                      <Icon as={FiShoppingBag} boxSize={5} />
                    </Flex>
                    <Heading size="md" fontWeight="semibold">
                      Order Items
                    </Heading>
                  </HStack>

                  <VStack spacing={4} width="100%">
                    {order.items.map((item) => (
                      <HStack
                        key={item.id}
                        spacing={4}
                        width="100%"
                        align="start"
                        p={4}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{ bg: iconBg }}
                        transition="all 0.2s"
                      >
                        <Box
                          position="relative"
                          boxSize="80px"
                          borderRadius="lg"
                          overflow="hidden"
                          flexShrink={0}
                        >
                          <NextImage
                            src={getFullImageUrl(item.productImage || '/images/placeholder.png')}
                            alt={item.productName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                        <VStack flex={1} align="start" spacing={2}>
                          <Text fontWeight="semibold" fontSize="md">
                            {item.productName}
                          </Text>
                          <HStack spacing={2}>
                            <Text fontSize="sm" color={mutedColor}>
                              Qty: {item.quantity}
                            </Text>
                            {item.selectedOptions &&
                              Object.entries(item.selectedOptions).map(([key, value]) => (
                                <Badge key={key} colorScheme="purple" fontSize="xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                          </HStack>
                          {item.voucherCode && (
                            <Badge colorScheme="green" fontSize="xs">
                              Voucher: {item.voucherCode}
                            </Badge>
                          )}
                        </VStack>
                        <Text fontWeight="bold" fontSize="lg" color={accentColor}>
                          ৳{item.total.toLocaleString()}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Divider mt={2} />

                  <VStack spacing={3} width="100%" pt={4}>
                    <HStack justify="space-between" width="100%">
                      <Text fontSize="sm" color={mutedColor}>
                        Subtotal
                      </Text>
                      <Text fontWeight="semibold">৳{order.subtotal.toLocaleString()}</Text>
                    </HStack>
                    <HStack justify="space-between" width="100%">
                      <HStack spacing={2}>
                        <Icon as={FiTruck} color={mutedColor} boxSize={4} />
                        <Text fontSize="sm" color={mutedColor}>
                          Shipping
                        </Text>
                      </HStack>
                      <Text
                        fontWeight="semibold"
                        color={order.shippingCost === 0 ? 'green.500' : 'inherit'}
                      >
                        {order.shippingCost === 0
                          ? 'FREE'
                          : `৳${order.shippingCost.toLocaleString()}`}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" width="100%">
                      <Text fontSize="sm" color={mutedColor}>
                        Tax
                      </Text>
                      <Text fontWeight="semibold">৳{order.tax.toLocaleString()}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" width="100%" pt={2}>
                      <Text fontSize="xl" fontWeight="bold">
                        Total
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                        ৳{order.total.toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Shipping & Contact Information */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card
                  bg={cardBg}
                  borderColor={borderColor}
                  borderWidth="1px"
                  borderRadius="xl"
                  shadow="sm"
                  _hover={{ shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <CardBody p={6}>
                    <HStack spacing={3} mb={4}>
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
                      <Heading size="sm" fontWeight="semibold">
                        Shipping Address
                      </Heading>
                    </HStack>
                    <VStack spacing={2} align="start">
                      <Text fontWeight="semibold">{order.customerName}</Text>
                      <Text color={mutedColor} fontSize="sm">
                        {order.shippingAddress}
                      </Text>
                      <Text color={mutedColor} fontSize="sm">
                        {order.shippingCity}, {order.shippingZip}
                      </Text>
                      <Text color={mutedColor} fontSize="sm">
                        {order.shippingCountry}
                      </Text>
                      <HStack spacing={2} pt={2}>
                        <Icon as={FiPhone} color={iconColor} boxSize={4} />
                        <Text fontSize="sm">{order.customerPhone}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card
                  bg={cardBg}
                  borderColor={borderColor}
                  borderWidth="1px"
                  borderRadius="xl"
                  shadow="sm"
                  _hover={{ shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <CardBody p={6}>
                    <HStack spacing={3} mb={4}>
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
                      <Heading size="sm" fontWeight="semibold">
                        Contact Information
                      </Heading>
                    </HStack>
                    <VStack spacing={3} align="start">
                      <HStack spacing={2}>
                        <Icon as={FiMail} color={iconColor} boxSize={4} />
                        <Text fontSize="sm">{order.customerEmail}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon as={FiPhone} color={iconColor} boxSize={4} />
                        <Text fontSize="sm">{order.customerPhone}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Actions */}
              <HStack spacing={4} width="100%" pt={4} flexWrap="wrap">
                <Button
                  as={Link}
                  href="/shopping"
                  colorScheme="primary"
                  size="lg"
                  leftIcon={<Icon as={FiHome} />}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Continue Shopping
                </Button>
                {order.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="lg"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Cancel Order
                  </Button>
                )}
              </HStack>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  )
}
