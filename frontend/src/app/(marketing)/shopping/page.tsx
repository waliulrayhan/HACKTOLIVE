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
  Image,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  SimpleGrid,
  useToast,
  Skeleton,
  SkeletonText,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiSearch, FiShoppingCart, FiFilter, FiX, FiCheck } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { productService, categoryService, cartService, Product, ProductCategory } from '@/lib/shop-service'
import { useRouter } from 'next/navigation'
import { chakra } from '@chakra-ui/react'
import { toast } from '@/components/ui/toast'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'
import { useCart } from '@/context/CartContext'

export default function ShoppingPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const router = useRouter()
  const { incrementCartCount } = useCart()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const overlayBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.800')

  const productTypes = [
    { value: 'COURSE_VOUCHER', label: 'Course Vouchers' },
    { value: 'TSHIRT', label: 'T-Shirts' },
    { value: 'MERCHANDISE', label: 'Merchandise' },
    { value: 'TRAINING_BUNDLE', label: 'Training Bundles' },
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, searchQuery ? 500 : 0) // Debounce search queries

    return () => clearTimeout(timer)
  }, [selectedCategory, selectedTypes.join(','), searchQuery, sortBy, minPrice, maxPrice, page])

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: any = {
        page,
        limit: 12,
        sort: sortBy,
        order: 'desc',
        status: 'ACTIVE',
      }

      if (selectedCategory) params.category = selectedCategory
      if (selectedTypes.length > 0) params.type = selectedTypes.join(',')
      if (searchQuery) params.search = searchQuery
      if (minPrice > 0) params.minPrice = minPrice
      if (maxPrice < 50000) params.maxPrice = maxPrice

      const response = await productService.getProducts(params)
      setProducts(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Error loading products', {
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

      // Mark as added - will persist until page reload or manual clear
      setAddedToCart(prev => new Set(prev).add(productId))

      // Increment cart count in context
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

  const resetFilters = () => {
    setSelectedCategory('')
    setSelectedTypes([])
    setSearchQuery('')
    setMinPrice(0)
    setMaxPrice(50000)
    setPage(1)
  }

  const FilterSection = () => (
    <VStack align="stretch" spacing={6}>
      {/* Categories */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb={3} color="muted" textTransform="uppercase" letterSpacing="wide">
          Category
        </Text>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat._count?.products || 0})
            </option>
          ))}
        </Select>
      </Box>

      {/* Product Types */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb={3} color="muted" textTransform="uppercase" letterSpacing="wide">
          Product Type
        </Text>
        <CheckboxGroup
          value={selectedTypes}
          onChange={(values) => setSelectedTypes(values as string[])}
        >
          <Stack spacing={3}>
            {productTypes.map((type) => (
              <Checkbox key={type.value} value={type.value} colorScheme="primary">
                {type.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

      {/* Price Range */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb={3} color="muted" textTransform="uppercase" letterSpacing="wide">
          Price Range
        </Text>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color={mutedColor}>৳{minPrice}</Text>
            <Text fontSize="sm" color={mutedColor}>৳{maxPrice}</Text>
          </HStack>
          <RangeSlider
            value={[minPrice, maxPrice]}
            onChange={(val) => {
              setMinPrice(val[0])
              setMaxPrice(val[1])
            }}
            min={0}
            max={50000}
            step={500}
            colorScheme="primary"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} boxSize={5} />
            <RangeSliderThumb index={1} boxSize={5} />
          </RangeSlider>
        </VStack>
      </Box>

      {/* Sort By */}
      {/* <Box>
        <Text fontWeight="semibold" fontSize="sm" mb={3} color="muted" textTransform="uppercase" letterSpacing="wide">
          Sort By
        </Text>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="name">Name: A to Z</option>
        </Select>
      </Box> */}

      {/* Reset */}
      <Button colorScheme="red" variant="outline" size="sm" onClick={resetFilters} leftIcon={<FiX />}>
        Reset Filters
      </Button>
    </VStack>
  )

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000')"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: useColorModeValue(
            'linear-gradient(135deg, rgba(26, 32, 44, 0.88) 0%, rgba(45, 55, 72, 0.92) 100%)',
            'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(26, 32, 44, 0.85) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={{ base: 4, md: 6 }} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                colorScheme="green"
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                Let's Start Shop Now
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
                  HackToLive Store
                </Heading>
                <Box
                  width="120px"
                  height="4px"
                  bg={useColorModeValue('green.400', 'green.500')}
                  mx="auto"
                  borderRadius="full"
                />
              </Box>

              <Text
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                color="whiteAlpha.900"
                maxW="3xl"
              >
                Premium cybersecurity tools, exclusive courses, and professional merchandise for ethical hackers
              </Text>

              {/* Stats */}
              <HStack
                spacing={{ base: 6, md: 12 }}
                pt={4}
                flexWrap="wrap"
                justify="center"
              >
                <VStack spacing="1">
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="green.400">
                    100+
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Products
                  </Text>
                </VStack>
                <VStack spacing="1">
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="green.400">
                    5K+
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Happy Customers
                  </Text>
                </VStack>
                <VStack spacing="1">
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="green.400">
                    4.9/5
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Customer Rating
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </FallInPlace>
        </Container>

        {/* Decorative floating elements */}
        <Box
          position="absolute"
          top="10%"
          right="5%"
          width="150px"
          height="150px"
          borderRadius="full"
          bg={useColorModeValue('green.400', 'green.500')}
          opacity="0.1"
          filter="blur(40px)"
          display={{ base: 'none', md: 'block' }}
        />
        <Box
          position="absolute"
          bottom="15%"
          left="8%"
          width="200px"
          height="200px"
          borderRadius="full"
          bg={useColorModeValue('blue.400', 'blue.500')}
          opacity="0.1"
          filter="blur(50px)"
          display={{ base: 'none', md: 'block' }}
        />
      </Box>

      {/* Main Content */}
      <Box py={{ base: 8, md: 12 }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Search Bar - Full width */}
            <Box>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color={mutedColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="full"
                  bg={cardBg}
                  _focus={{
                    borderColor: 'primary.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                  }}
                />
              </InputGroup>
            </Box>

            {/* Results Count and Sort - Mobile */}
            <Box display={{ base: 'block', lg: 'none' }}>
              <Text fontSize="sm" color="muted" fontWeight="medium" mb={3}>
                {loading ? 'Loading...' : (
                  <>
                    Showing <chakra.span color="primary.500" fontWeight="semibold">{products.length}</chakra.span> products
                  </>
                )}
              </Text>
              <Flex gap={3} align="center">
                <Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  flex="1"
                  borderRadius="lg"
                  focusBorderColor="primary.500"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="name">Name: A to Z</option>
                </Select>
                <Button
                  leftIcon={<FiFilter />}
                  onClick={onOpen}
                  colorScheme="primary"
                  variant="outline"
                  size="sm"
                  flexShrink={0}
                >
                  Filters
                </Button>
              </Flex>
            </Box>
          </VStack>

          <Flex gap={8} direction={{ base: 'column', lg: 'row' }} mt={8}>
            {/* Desktop Filters */}
            <Box
              display={{ base: 'none', lg: 'block' }}
              width="280px"
              flexShrink={0}
            >
              <Box
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                position="sticky"
                top={4}
              >
                <HStack justify="space-between" mb={6}>
                  <Heading size="md">Filters</Heading>
                </HStack>
                <FilterSection />
              </Box>
            </Box>

            {/* Mobile Filter Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Filters</DrawerHeader>
                <DrawerBody>
                  <FilterSection />
                </DrawerBody>
              </DrawerContent>
            </Drawer>

            {/* Products Grid */}
            <Box flex={1}>
              {/* Results Count and Sort - Desktop */}
              <Flex justify="space-between" align="center" mb={6} display={{ base: 'none', lg: 'flex' }}>
                <Text fontSize="md" color="muted" fontWeight="medium">
                  {loading ? 'Loading...' : (
                    <>
                      Showing <chakra.span color="primary.500" fontWeight="semibold">{products.length}</chakra.span> products
                    </>
                  )}
                </Text>
                <HStack spacing={3}>
                  <Text fontSize="sm" color={mutedColor}>
                    Sort by:
                  </Text>
                  <Select
                    size="sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    w="200px"
                    borderRadius="lg"
                    focusBorderColor="primary.500"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="name">Name: A to Z</option>
                  </Select>
                </HStack>
              </Flex>

              {/* Products */}
              {loading ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} bg={cardBg} borderColor={borderColor} borderWidth="1px">
                      <CardBody>
                        <Skeleton height="240px" borderRadius="md" mb={4} />
                        <SkeletonText noOfLines={3} spacing={2} />
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              ) : products.length === 0 ? (
                <Center py={20}>
                  <VStack spacing={4}>
                    <Icon as={FiShoppingCart} boxSize={16} color={mutedColor} />
                    <Heading size="md" color={mutedColor}>
                      No products found
                    </Heading>
                    <Text color={mutedColor}>Try adjusting your filters</Text>
                    <Button onClick={resetFilters} variant="outline" colorScheme="primary">
                      Reset Filters
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      bg={cardBg}
                      borderColor={borderColor}
                      borderWidth="1px"
                      borderRadius="xl"
                      overflow="hidden"
                      transition="all 0.3s"
                      _hover={{
                        borderColor: 'primary.500',
                        boxShadow: 'lg',
                        transform: 'translateY(-4px)',
                      }}
                      cursor="pointer"
                      onClick={() => {
                        if (product.slug) {
                          router.push(`/shopping/${product.slug}`)
                        } else {
                          toast.error('Product link is invalid', {
                            description: 'Unable to view product details',
                            duration: 3000,
                          })
                        }
                      }}
                    >
                      <Box position="relative" height="240px" overflow="hidden" bg={borderColor}>
                        {(product.thumbnail || product.images[0]) ? (
                          <NextImage
                            src={getFullImageUrl(product.thumbnail || product.images[0], 'general')}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <Flex align="center" justify="center" height="100%" bg={borderColor}>
                            <Icon as={FiShoppingCart} boxSize={16} color={mutedColor} />
                          </Flex>
                        )}
                        {product.featured && (
                          <Badge
                            position="absolute"
                            top={3}
                            left={3}
                            colorScheme="green"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            Featured
                          </Badge>
                        )}
                        {product.stockQuantity === 0 && !product.allowBackorder && (
                          <Badge
                            position="absolute"
                            top={3}
                            right={3}
                            colorScheme="red"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            Out of Stock
                          </Badge>
                        )}
                        {product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockThreshold || 10) && (
                          <Badge
                            position="absolute"
                            top={3}
                            right={3}
                            colorScheme="orange"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            Low Stock
                          </Badge>
                        )}
                      </Box>

                      <CardBody>
                        <VStack spacing={3} align="start">
                          <Badge colorScheme="purple" size="sm" fontSize="xs">
                            {product.type.replace(/_/g, ' ')}
                          </Badge>

                          <Heading size="sm" noOfLines={2} lineHeight="1.4">
                            {product.name}
                          </Heading>

                          <Text color={mutedColor} fontSize="sm" noOfLines={2}>
                            {product.shortDescription || product.description}
                          </Text>

                          <Flex justify="space-between" width="100%" align="center" pt={2}>
                            <VStack align="start" spacing={0}>
                              <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                                  ৳{product.price.toLocaleString()}
                                </Text>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                  <Text
                                    fontSize="sm"
                                    color={mutedColor}
                                    textDecoration="line-through"
                                  >
                                    ৳{product.compareAtPrice.toLocaleString()}
                                  </Text>
                                )}
                              </HStack>
                            </VStack>

                            <Button
                              colorScheme={addedToCart.has(product.id) ? "green" : "primary"}
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
                  ))}
                </SimpleGrid>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <Flex justify="center" mt={10} gap={2} flexWrap="wrap">
                  <Button
                    onClick={() => setPage(page - 1)}
                    isDisabled={page === 1}
                    size="sm"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? 'solid' : 'outline'}
                        colorScheme={page === pageNum ? 'primary' : 'gray'}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  <Button
                    onClick={() => setPage(page + 1)}
                    isDisabled={page === totalPages}
                    size="sm"
                    variant="outline"
                  >
                    Next
                  </Button>
                </Flex>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
