'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Avatar,
  Stack,
  SimpleGrid,
  Flex,
  AspectRatio,
  Center,
} from '@chakra-ui/react'
import { useState, useEffect, use } from 'react'
import {
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronRight,
  FiStar,
  FiCheck,
} from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { productService, cartService, Product } from '@/lib/shop-service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/context/CartContext'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<any>({})
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const router = useRouter()
  const { incrementCartCount } = useCart()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const badgeBg = useColorModeValue('primary.100', 'primary.900')
  const badgeColor = useColorModeValue('primary.800', 'primary.200')
  const priceBg = useColorModeValue('purple.50', 'purple.900')
  const priceColor = useColorModeValue('purple.700', 'purple.200')

  useEffect(() => {
    fetchProduct()
    checkIfInCart()
  }, [resolvedParams.slug])

  const checkIfInCart = async () => {
    try {
      const cart = await cartService.getCart()
      const isInCart = cart?.items?.some((item: any) => item.productId === product?.id || item.product?.id === product?.id)
      setAddedToCart(isInCart)
    } catch (error) {
      console.error('Failed to check cart:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductBySlug(resolvedParams.slug)
      setProduct(data)
      
      // Check if product is in cart after loading
      const cart = await cartService.getCart()
      const isInCart = cart?.items?.some((item: any) => item.productId === data.id || item.product?.id === data.id)
      setAddedToCart(isInCart)
    } catch (error) {
      console.error('Failed to fetch product:', error)
      toast.error('Product not found', {
        description: 'Redirecting to shop...',
        duration: 3000,
      })
      router.push('/shopping')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product || addedToCart) return

    setAddingToCart(true)
    try {
      await cartService.addToCart({
        productId: product.id,
        quantity,
        selectedOptions,
      })
      setAddedToCart(true)
      incrementCartCount(quantity)
      toast.success('Added to cart', {
        description: `${product.name} (${quantity}) added to your cart`,
        duration: 3000,
      })
    } catch (error: any) {
      toast.error('Failed to add to cart', {
        description: error.response?.data?.message || 'Please try again',
        duration: 3000,
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push('/shopping/cart')
  }

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" />
      </Box>
    )
  }

  if (!product) {
    return null
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail || '/images/placeholder.png']
  const averageRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  return (
    <Box pt={{ base: 28, md: 32 }} pb={12}>
      <Container maxW="container.xl">
        {/* Breadcrumb */}
        <Breadcrumb
          spacing={2}
          separator={<Icon as={FiChevronRight} color={mutedColor} />}
          mb={6}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/shopping">
              Shop
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <FallInPlace>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Image Gallery */}
            <Box>
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="xl" overflow="hidden">
                <AspectRatio ratio={1}>
                  <Box position="relative" width="100%" height="100%">
                    {images[selectedImage] ? (
                      <NextImage
                        src={getFullImageUrl(images[selectedImage], 'general')}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <Center height="100%" bg={borderColor}>
                        <Icon as={FiShoppingCart} boxSize={16} color={mutedColor} />
                      </Center>
                    )}
                  </Box>
                </AspectRatio>
              </Card>

              {images.length > 1 && (
                <SimpleGrid columns={4} spacing={2} mt={4}>
                  {images.map((img, idx) => (
                    <Card
                      key={idx}
                      bg={cardBg}
                      borderColor={selectedImage === idx ? 'primary.500' : borderColor}
                      borderWidth="2px"
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      onClick={() => setSelectedImage(idx)}
                      transition="all 0.2s"
                      _hover={{ borderColor: 'primary.400' }}
                    >
                      <AspectRatio ratio={1}>
                        <Box position="relative">
                          {img ? (
                            <NextImage
                              src={getFullImageUrl(img, 'general')}
                              alt={`${product.name} ${idx + 1}`}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="150px"
                            />
                          ) : (
                            <Center height="100%" bg={borderColor}>
                              <Icon as={FiShoppingCart} boxSize={6} color={mutedColor} />
                            </Center>
                          )}
                        </Box>
                      </AspectRatio>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </Box>

            {/* Product Info */}
            <VStack spacing={6} align="start">
              <VStack spacing={3} align="start" width="100%">
                {product.type && (
                  <Badge colorScheme="purple" fontSize="sm">
                    {product.type.replace('_', ' ')}
                  </Badge>
                )}

                <Heading size="xl">{product.name}</Heading>

                {product.reviews && product.reviews.length > 0 && (
                  <HStack>
                    <HStack spacing={1}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          as={FiStar}
                          color={i < Math.round(averageRating) ? 'yellow.400' : 'gray.300'}
                          fill={i < Math.round(averageRating) ? 'yellow.400' : 'transparent'}
                        />
                      ))}
                    </HStack>
                    <Text fontSize="sm" color={mutedColor}>
                      ({product.reviews.length} reviews)
                    </Text>
                  </HStack>
                )}

                <HStack spacing={3} align="baseline">
                  <Text fontSize="3xl" fontWeight="bold" color="primary.500">
                    {product.price.toLocaleString()} BDT
                  </Text>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <VStack spacing={0} align="start">
                      <Text
                        fontSize="lg"
                        color={mutedColor}
                        textDecoration="line-through"
                      >
                        {product.compareAtPrice.toLocaleString()} BDT
                      </Text>
                      <Badge colorScheme="green" fontSize="xs">
                        {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                      </Badge>
                    </VStack>
                  )}
                </HStack>

                <Text color={mutedColor} whiteSpace="pre-wrap">{product.shortDescription}</Text>
              </VStack>

              <Divider />

              {/* Options */}
              {product.sizes && product.sizes.length > 0 && (
                <VStack spacing={2} align="start" width="100%">
                  <Text fontWeight="semibold">Size</Text>
                  <Select
                    placeholder="Select size"
                    value={selectedOptions.size || ''}
                    onChange={(e) =>
                      setSelectedOptions({ ...selectedOptions, size: e.target.value })
                    }
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Select>
                </VStack>
              )}

              {product.colors && product.colors.length > 0 && (
                <VStack spacing={2} align="start" width="100%">
                  <Text fontWeight="semibold">Color</Text>
                  <Select
                    placeholder="Select color"
                    value={selectedOptions.color || ''}
                    onChange={(e) =>
                      setSelectedOptions({ ...selectedOptions, color: e.target.value })
                    }
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </Select>
                </VStack>
              )}

              {/* Quantity */}
              <VStack spacing={2} align="start" width="100%">
                <Text fontWeight="semibold">Quantity</Text>
                <NumberInput
                  value={quantity}
                  onChange={(_, val) => setQuantity(val)}
                  min={1}
                  max={product.stockQuantity}
                  maxW="120px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {product.stockQuantity > 0 ? (
                  <HStack>
                    <Badge colorScheme={product.stockQuantity <= (product.lowStockThreshold || 10) ? 'orange' : 'green'}>
                      {product.stockQuantity} in stock
                    </Badge>
                    {product.stockQuantity <= (product.lowStockThreshold || 10) && (
                      <Text fontSize="sm" color="orange.500">Low stock!</Text>
                    )}
                  </HStack>
                ) : (
                  <Badge colorScheme="red">Out of stock</Badge>
                )}
              </VStack>

              {/* Actions */}
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
                <Button
                  colorScheme={addedToCart ? "green" : "primary"}
                  size="lg"
                  leftIcon={addedToCart ? <FiCheck /> : <FiShoppingCart />}
                  isLoading={addingToCart}
                  loadingText="Adding..."
                  isDisabled={(product.stockQuantity === 0 && !product.allowBackorder) || addedToCart}
                  onClick={handleAddToCart}
                  flex={1}
                >
                  {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  size="lg"
                  isDisabled={product.stockQuantity === 0 && !product.allowBackorder}
                  onClick={handleBuyNow}
                  flex={1}
                >
                  Buy Now
                </Button>
              </Stack>

              {/* Features */}
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" p={4} width="100%">
                <VStack spacing={3} align="start">
                  <HStack>
                    <Icon as={FiTruck} color="primary.500" />
                    <Text fontSize="sm">Free shipping on orders over 1000 BDT</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiShield} color="primary.500" />
                    <Text fontSize="sm">Secure payment</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiRefreshCw} color="primary.500" />
                    <Text fontSize="sm">7-day return policy</Text>
                  </HStack>
                </VStack>
              </Card>
            </VStack>
          </Grid>

          {/* Product Details Tabs */}
          <Box mt={12}>
            <Tabs colorScheme="primary">
              <TabList>
                <Tab>Description</Tab>
                {product.reviews && product.reviews.length > 0 && <Tab>Reviews ({product.reviews.length})</Tab>}
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" p={6}>
                    <Text whiteSpace="pre-wrap" color={mutedColor}>
                      {product.description}
                    </Text>
                  </Card>
                </TabPanel>

                {product.reviews && product.reviews.length > 0 && (
                  <TabPanel>
                    <VStack spacing={4} align="start">
                      {product.reviews.map((review) => (
                        <Card key={review.id} bg={cardBg} borderColor={borderColor} borderWidth="1px" p={6} width="100%">
                          <HStack spacing={4} align="start">
                            <Avatar name={review.user?.name} src={review.user?.avatar} />
                            <VStack spacing={2} align="start" flex={1}>
                              <HStack justify="space-between" width="100%">
                                <VStack spacing={0} align="start">
                                  <Text fontWeight="semibold">{review.user?.name}</Text>
                                  <HStack spacing={1}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Icon
                                        key={i}
                                        as={FiStar}
                                        color={i < review.rating ? 'yellow.400' : 'gray.300'}
                                        fill={i < review.rating ? 'yellow.400' : 'transparent'}
                                        boxSize={4}
                                      />
                                    ))}
                                  </HStack>
                                </VStack>
                                {review.verified && (
                                  <Badge colorScheme="green">Verified Purchase</Badge>
                                )}
                              </HStack>
                              {review.title && <Text fontWeight="semibold">{review.title}</Text>}
                              <Text color={mutedColor}>{review.comment}</Text>
                              <Text fontSize="xs" color={mutedColor}>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Text>
                            </VStack>
                          </HStack>
                        </Card>
                      ))}
                    </VStack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Box>
        </FallInPlace>
      </Container>
    </Box>
  )
}
