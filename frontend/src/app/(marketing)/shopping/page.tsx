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
  Image,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  SimpleGrid,
  IconButton,
  useToast,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiSearch, FiShoppingCart, FiHeart, FiFilter, FiGrid, FiList } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { productService, categoryService, cartService, Product, ProductCategory } from '@/lib/shop-service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ShoppingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const toast = useToast()
  const router = useRouter()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const badgeBg = useColorModeValue('primary.100', 'primary.900')
  const badgeColor = useColorModeValue('primary.800', 'primary.200')
  const priceBg = useColorModeValue('purple.50', 'purple.900')
  const priceColor = useColorModeValue('purple.700', 'purple.200')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedType, searchQuery, sortBy, page])

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
      if (selectedType) params.type = selectedType
      if (searchQuery) params.search = searchQuery

      const response = await productService.getProducts(params)
      console.log('Products fetched:', response.data) // Debug log
      setProducts(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast({
        title: 'Error loading products',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await cartService.addToCart({
        productId,
        quantity: 1,
      })
      toast({
        title: 'Added to cart',
        status: 'success',
        duration: 2000,
      })
    } catch (error: any) {
      toast({
        title: 'Failed to add to cart',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const ProductTypeOptions = [
    { value: '', label: 'All Products' },
    { value: 'COURSE_VOUCHER', label: 'Course Vouchers' },
    { value: 'TSHIRT', label: 'T-Shirts' },
    { value: 'MERCHANDISE', label: 'Merchandise' },
    { value: 'TRAINING_BUNDLE', label: 'Training Bundles' },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        pt={{ base: 32, md: 36 }}
        pb={{ base: 12, md: 16 }}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="900"
              >
                HackToLive Store
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color={mutedColor} maxW="2xl">
                Discover premium cybersecurity tools, professional courses, and exclusive merchandise
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Filters & Search */}
      <Box py={8} bg={useColorModeValue('white', 'gray.800')} borderBottomWidth="1px" borderColor={borderColor}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <InputGroup>
              <InputLeftElement>
                <Icon as={FiSearch} color={mutedColor} />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

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

            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {ProductTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </Select>
          </Grid>

          <HStack mt={4} justify="space-between">
            <Text color={mutedColor} fontSize="sm">
              {products.length} products found
            </Text>
            <HStack spacing={2}>
              <IconButton
                aria-label="Grid view"
                icon={<FiGrid />}
                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                colorScheme="primary"
                size="sm"
                onClick={() => setViewMode('grid')}
              />
              <IconButton
                aria-label="List view"
                icon={<FiList />}
                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                colorScheme="primary"
                size="sm"
                onClick={() => setViewMode('list')}
              />
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Products Grid */}
      <Box py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} bg={cardBg} borderColor={borderColor} borderWidth="1px">
                  <CardBody>
                    <Skeleton height="200px" borderRadius="md" mb={4} />
                    <SkeletonText noOfLines={3} spacing={2} />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : products.length === 0 ? (
            <VStack spacing={4} py={12}>
              <Icon as={FiShoppingCart} boxSize={16} color={mutedColor} />
              <Heading size="md" color={mutedColor}>
                No products found
              </Heading>
              <Text color={mutedColor}>Try adjusting your filters</Text>
            </VStack>
          ) : (
            <SimpleGrid
              columns={{
                base: 1,
                md: viewMode === 'grid' ? 2 : 1,
                lg: viewMode === 'grid' ? 3 : 1,
                xl: viewMode === 'grid' ? 4 : 1,
              }}
              spacing={6}
            >
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
                    console.log('Product clicked:', product) // Debug log
                    if (product.slug) {
                      router.push(`/shopping/${product.slug}`)
                    } else {
                      console.error('Product has no slug:', product)
                      toast({
                        title: 'Error',
                        description: 'Product link is invalid',
                        status: 'error',
                        duration: 3000,
                      })
                    }
                  }}
                >
                  <Box position="relative">
                    <Image
                      src={product.thumbnail || product.images[0] || '/images/placeholder.png'}
                      alt={product.name}
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />
                    {product.featured && (
                      <Badge
                        position="absolute"
                        top={2}
                        left={2}
                        bg={badgeBg}
                        color={badgeColor}
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        Featured
                      </Badge>
                    )}
                    {product.stockQuantity <= (product.lowStockThreshold || 10) && product.stockQuantity > 0 && (
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme="orange"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        Low Stock
                      </Badge>
                    )}
                    {product.stockQuantity === 0 && !product.allowBackorder && (
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme="red"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </Box>

                  <CardBody>
                    <VStack spacing={3} align="start">
                      <Badge colorScheme="purple" size="sm">
                        {product.type.replace('_', ' ')}
                      </Badge>

                      <Heading size="md" noOfLines={2}>
                        {product.name}
                      </Heading>

                      <Text color={mutedColor} fontSize="sm" noOfLines={2}>
                        {product.shortDescription || product.description}
                      </Text>

                      <HStack justify="space-between" width="100%">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color={priceColor}>
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
                        </VStack>

                        <Button
                          colorScheme="primary"
                          size="sm"
                          leftIcon={<FiShoppingCart />}
                          isDisabled={product.stockQuantity === 0 && !product.allowBackorder}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(product.id)
                          }}
                        >
                          Add
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="center" mt={8} gap={2}>
              <Button
                onClick={() => setPage(page - 1)}
                isDisabled={page === 1}
                size="sm"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={page === p ? 'solid' : 'outline'}
                  colorScheme="primary"
                  size="sm"
                >
                  {p}
                </Button>
              ))}
              <Button
                onClick={() => setPage(page + 1)}
                isDisabled={page === totalPages}
                size="sm"
              >
                Next
              </Button>
            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  )
}
