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
  Badge,
  useColorModeValue,
  Flex,
  SimpleGrid,
  Center,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiShoppingCart, FiClock, FiTrendingUp, FiZap, FiCheck } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { productService, cartService, Product } from '@/lib/shop-service'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'
import { useCart } from '@/context/CartContext'

export default function DailyDealsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const router = useRouter()
  const { incrementCartCount } = useCart()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const accentBg = useColorModeValue('orange.50', 'orange.900')
  const accentColor = useColorModeValue('orange.600', 'orange.400')

  useEffect(() => {
    fetchDailyDeals()
  }, [])

  const fetchDailyDeals = async () => {
    setLoading(true)
    try {
      // Fetch DAILY_SPECIAL type products
      const response = await productService.getProducts({
        page: 1,
        limit: 20,
        status: 'ACTIVE',
        type: 'DAILY_SPECIAL',
        sort: 'createdAt',
        order: 'desc',
      })
      
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch daily deals:', error)
      toast.error('Error loading deals', {
        description: 'Please try again later',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId)
    try {
      await cartService.addToCart({
        productId,
        quantity: 1,
      })

      setAddedToCart(prev => new Set(prev).add(productId))
      incrementCartCount(1)

      toast.success('Added to cart', {
        description: 'Product successfully added to your cart',
        duration: 3000,
      })
    } catch (error: any) {
      toast.error('Failed to add to cart', {
        description: error.response?.data?.message || 'Please try again later',
        duration: 5000,
      })
    } finally {
      setAddingToCart(null)
    }
  }

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgGradient={useColorModeValue(
          'linear(to-br, orange.500, red.500)',
          'linear(to-br, orange.600, red.600)'
        )}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={{ base: 4, md: 6 }} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                colorScheme="yellow"
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                <HStack spacing={2}>
                  <Icon as={FiZap} />
                  <Text>Limited Time Offers</Text>
                </HStack>
              </Badge>

              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}
                  fontWeight="bold"
                  lineHeight="1.2"
                  mb={4}
                  color="white"
                >
                  Daily Deals & Special Offers
                </Heading>
                <Box
                  width="120px"
                  height="4px"
                  bg="yellow.400"
                  mx="auto"
                  borderRadius="full"
                />
              </Box>

              <Text
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                color="whiteAlpha.900"
                maxW="3xl"
              >
                Don't miss out on today's incredible deals on courses, merchandise, and more!
              </Text>

              <HStack spacing={2} fontSize="sm" color="whiteAlpha.900">
                <Icon as={FiClock} />
                <Text>Deals refresh daily at midnight</Text>
              </HStack>
            </VStack>
          </FallInPlace>
        </Container>

        {/* Decorative elements */}
        <Box
          position="absolute"
          top="10%"
          right="5%"
          width="150px"
          height="150px"
          borderRadius="full"
          bg="yellow.400"
          opacity="0.2"
          filter="blur(40px)"
          display={{ base: 'none', md: 'block' }}
        />
      </Box>

      {/* Main Content */}
      <Box py={{ base: 8, md: 12 }} bg={bgColor}>
        <Container maxW="container.xl">
          {/* Stats */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={6}
            mb={12}
          >
            <Card bg={accentBg} borderColor={accentColor} borderWidth="1px">
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={FiTrendingUp} boxSize={8} color={accentColor} />
                  <Heading size="lg" color={accentColor}>
                    Up to 50%
                  </Heading>
                  <Text color={mutedColor} textAlign="center">
                    Discount on selected items
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={accentBg} borderColor={accentColor} borderWidth="1px">
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={FiZap} boxSize={8} color={accentColor} />
                  <Heading size="lg" color={accentColor}>
                    {products.length}+
                  </Heading>
                  <Text color={mutedColor} textAlign="center">
                    Active deals today
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={accentBg} borderColor={accentColor} borderWidth="1px">
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={FiClock} boxSize={8} color={accentColor} />
                  <Heading size="lg" color={accentColor}>
                    24h
                  </Heading>
                  <Text color={mutedColor} textAlign="center">
                    Time remaining
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Products Grid */}
          {loading ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Text color={mutedColor}>Loading today's deals...</Text>
              </VStack>
            </Center>
          ) : products.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Icon as={FiShoppingCart} boxSize={16} color={mutedColor} />
                <Heading size="md" color={mutedColor}>
                  No deals available
                </Heading>
                <Text color={mutedColor}>Check back tomorrow for new deals!</Text>
                <Button onClick={() => router.push('/shopping')} variant="outline" colorScheme="primary">
                  Browse All Products
                </Button>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {products.map((product) => {
                const discount = product.compareAtPrice
                  ? calculateDiscount(product.price, product.compareAtPrice)
                  : 0

                return (
                  <Card
                    key={product.id}
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="xl"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      borderColor: 'orange.500',
                      boxShadow: 'xl',
                      transform: 'translateY(-4px)',
                    }}
                    cursor="pointer"
                    onClick={() => {
                      if (product.slug) {
                        router.push(`/shopping/${product.slug}`)
                      }
                    }}
                  >
                    <Box position="relative" height="240px" overflow="hidden" bg={borderColor}>
                      <NextImage
                        src={getFullImageUrl(product.thumbnail || product.images[0], 'general')}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {discount > 0 && (
                        <Badge
                          position="absolute"
                          top={3}
                          right={3}
                          colorScheme="red"
                          px={3}
                          py={2}
                          borderRadius="full"
                          fontSize="lg"
                          fontWeight="bold"
                        >
                          -{discount}%
                        </Badge>
                      )}
                    </Box>

                    <CardBody>
                      <VStack spacing={3} align="start">
                        {product.type && (
                          <Badge colorScheme="purple" size="sm" fontSize="xs">
                            {product.type.replace(/_/g, ' ')}
                          </Badge>
                        )}

                        <Heading size="sm" noOfLines={2} lineHeight="1.4">
                          {product.name}
                        </Heading>

                        <Text color={mutedColor} fontSize="sm" noOfLines={2}>
                          {product.shortDescription || product.description}
                        </Text>

                        <Flex justify="space-between" width="100%" align="center" pt={2}>
                          <VStack align="start" spacing={0}>
                            <HStack spacing={2}>
                              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                                {product.price.toLocaleString()} BDT
                              </Text>
                              {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <Text
                                  fontSize="md"
                                  color={mutedColor}
                                  textDecoration="line-through"
                                >
                                  {product.compareAtPrice.toLocaleString()} BDT
                                </Text>
                              )}
                            </HStack>
                            <Text fontSize="xs" color="green.500" fontWeight="medium">
                              Save {product.compareAtPrice ? (product.compareAtPrice - product.price).toLocaleString() : 0} BDT
                            </Text>
                          </VStack>

                          <Button
                            colorScheme={addedToCart.has(product.id) ? "green" : "orange"}
                            size="sm"
                            leftIcon={addedToCart.has(product.id) ? <FiCheck /> : <FiShoppingCart />}
                            isDisabled={
                              (product.stockQuantity === 0 && !product.allowBackorder) ||
                              addedToCart.has(product.id)
                            }
                            isLoading={addingToCart === product.id}
                            loadingText="Adding"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!addedToCart.has(product.id)) {
                                handleAddToCart(product.id)
                              }
                            }}
                          >
                            {addedToCart.has(product.id) ? 'Added' : 'Add'}
                          </Button>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                )
              })}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </Box>
  )
}
