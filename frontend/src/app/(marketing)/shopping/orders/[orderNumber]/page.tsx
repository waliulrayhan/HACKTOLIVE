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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  Image,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect, use } from 'react'
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { orderService, Order } from '@/lib/shop-service'
import Link from 'next/link'

export default function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const successBg = useColorModeValue('green.50', 'green.900')
  const successColor = useColorModeValue('green.600', 'green.200')

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
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" />
      </Box>
    )
  }

  if (!order) {
    return (
      <Box pt={{ base: 28, md: 32 }} pb={12}>
        <Container maxW="container.md">
          <VStack spacing={6} py={12} textAlign="center">
            <Heading size="lg">Order not found</Heading>
            <Button as={Link} href="/shopping" colorScheme="primary">
              Continue Shopping
            </Button>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box pt={{ base: 28, md: 32 }} pb={12}>
      <Container maxW="container.xl">
        <FallInPlace>
          <VStack spacing={8} align="start">
            {/* Success Message */}
            <Card bg={successBg} borderWidth="2px" borderColor={successColor} borderRadius="lg" width="100%">
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={FiCheckCircle} boxSize={16} color={successColor} />
                  <Heading size="lg">Order Placed Successfully!</Heading>
                  <Text color={mutedColor} textAlign="center">
                    Thank you for your order. We've received your order and will process it shortly.
                  </Text>
                  <HStack spacing={4} flexWrap="wrap" justify="center">
                    <Badge colorScheme={getStatusColor(order.status)} px={4} py={2} borderRadius="full" fontSize="md">
                      {order.status}
                    </Badge>
                    <Badge colorScheme={getStatusColor(order.paymentStatus)} px={4} py={2} borderRadius="full" fontSize="md">
                      Payment: {order.paymentStatus}
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Order Details */}
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" width="100%">
              <CardBody>
                <VStack spacing={6} align="start">
                  <Heading size="md">Order Details</Heading>

                  <Stack direction={{ base: 'column', md: 'row' }} spacing={8} width="100%">
                    <VStack align="start" flex={1}>
                      <Text fontWeight="semibold">Order Number</Text>
                      <Text color={mutedColor}>{order.orderNumber}</Text>
                    </VStack>

                    <VStack align="start" flex={1}>
                      <Text fontWeight="semibold">Order Date</Text>
                      <Text color={mutedColor}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                    </VStack>

                    <VStack align="start" flex={1}>
                      <Text fontWeight="semibold">Payment Method</Text>
                      <Text color={mutedColor}>{order.paymentMethod?.replace('_', ' ')}</Text>
                    </VStack>

                    {order.trackingNumber && (
                      <VStack align="start" flex={1}>
                        <Text fontWeight="semibold">Tracking Number</Text>
                        <Text color={mutedColor}>{order.trackingNumber}</Text>
                      </VStack>
                    )}
                  </Stack>
                </VStack>
              </CardBody>
            </Card>

            {/* Items */}
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" width="100%">
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md">Order Items</Heading>

                  <VStack spacing={3} width="100%">
                    {order.items.map((item) => (
                      <HStack key={item.id} spacing={4} width="100%" align="start" p={3} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                        <Image
                          src={item.productImage || '/images/placeholder.png'}
                          alt={item.productName}
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <VStack flex={1} align="start" spacing={1}>
                          <Text fontWeight="semibold">{item.productName}</Text>
                          <Text fontSize="sm" color={mutedColor}>
                            Quantity: {item.quantity}
                          </Text>
                          {item.selectedOptions && (
                            <HStack spacing={2}>
                              {Object.entries(item.selectedOptions).map(([key, value]) => (
                                <Badge key={key}>
                                  {key}: {value}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                          {item.voucherCode && (
                            <Badge colorScheme="purple">Voucher: {item.voucherCode}</Badge>
                          )}
                        </VStack>
                        <Text fontWeight="bold">৳{item.total.toLocaleString()}</Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Divider />

                  <VStack spacing={2} width="100%" align="end">
                    <HStack justify="space-between" width={{ base: '100%', md: '300px' }}>
                      <Text>Subtotal</Text>
                      <Text fontWeight="semibold">৳{order.subtotal.toLocaleString()}</Text>
                    </HStack>
                    <HStack justify="space-between" width={{ base: '100%', md: '300px' }}>
                      <Text>Shipping</Text>
                      <Text fontWeight="semibold">৳{order.shippingCost.toLocaleString()}</Text>
                    </HStack>
                    <HStack justify="space-between" width={{ base: '100%', md: '300px' }}>
                      <Text>Tax</Text>
                      <Text fontWeight="semibold">৳{order.tax.toLocaleString()}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" width={{ base: '100%', md: '300px' }}>
                      <Text fontSize="xl" fontWeight="bold">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="primary.500">
                        ৳{order.total.toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Shipping Address */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6} width="100%">
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" flex={1}>
                <CardBody>
                  <VStack spacing={3} align="start">
                    <Heading size="sm">Shipping Address</Heading>
                    <Text>{order.customerName}</Text>
                    <Text color={mutedColor}>{order.shippingAddress}</Text>
                    <Text color={mutedColor}>
                      {order.shippingCity}, {order.shippingZip}
                    </Text>
                    <Text color={mutedColor}>{order.shippingCountry}</Text>
                    <Text color={mutedColor}>{order.customerPhone}</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" flex={1}>
                <CardBody>
                  <VStack spacing={3} align="start">
                    <Heading size="sm">Contact Information</Heading>
                    <Text>{order.customerEmail}</Text>
                    <Text color={mutedColor}>{order.customerPhone}</Text>
                  </VStack>
                </CardBody>
              </Card>
            </Stack>

            {/* Actions */}
            <HStack spacing={4} width="100%">
              <Button as={Link} href="/shopping" colorScheme="primary" leftIcon={<FiHome />}>
                Continue Shopping
              </Button>
              {order.status === 'PENDING' && (
                <Button variant="outline" colorScheme="red">
                  Cancel Order
                </Button>
              )}
            </HStack>
          </VStack>
        </FallInPlace>
      </Container>
    </Box>
  )
}
