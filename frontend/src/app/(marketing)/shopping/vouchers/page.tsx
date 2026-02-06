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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FiShoppingCart, FiGift, FiCheck, FiMinus, FiPlus, FiAward, FiPackage } from 'react-icons/fi'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { productService, cartService, Product } from '@/lib/shop-service'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'
import NextImage from 'next/image'
import { getFullImageUrl } from '@/lib/image-utils'
import { useCart } from '@/context/CartContext'

export default function VouchersPage() {
  const [voucherProducts, setVoucherProducts] = useState<Product[]>([])
  const [bundleProducts, setBundleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  
  // Voucher builder state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [duration, setDuration] = useState(6) // months
  const [quantity, setQuantity] = useState(1)
  
  const router = useRouter()
  const { incrementCartCount } = useCart()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const voucherCardBg = useColorModeValue('#1a2332', '#0f1419')
  const accentGreen = useColorModeValue('green.500', 'green.400')

  useEffect(() => {
    fetchVouchers()
  }, [])

  useEffect(() => {
    // Auto-select first voucher product if available
    if (voucherProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(voucherProducts[0])
    }
  }, [voucherProducts, selectedProduct])

  const fetchVouchers = async () => {
    setLoading(true)
    try {
      const response = await productService.getProducts({
        page: 1,
        limit: 50,
        status: 'ACTIVE',
        type: 'COURSE_VOUCHER,TRAINING_BUNDLE',
        sort: 'price',
        order: 'asc',
      })
      
      const vouchers = response.data.filter(p => p.type === 'COURSE_VOUCHER')
      const bundles = response.data.filter(p => p.type === 'TRAINING_BUNDLE')
      
      setVoucherProducts(vouchers)
      setBundleProducts(bundles)
    } catch (error) {
      console.error('Failed to fetch vouchers:', error)
      toast.error('Error loading vouchers', {
        description: 'Please try again later',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product?: Product, customQuantity?: number) => {
    const productToAdd = product || selectedProduct
    if (!productToAdd) return

    setAddingToCart(productToAdd.id)
    try {
      await cartService.addToCart({
        productId: productToAdd.id,
        quantity: customQuantity || quantity,
      })

      incrementCartCount(customQuantity || quantity)

      toast.success('Added to cart', {
        description: 'Voucher successfully added to your cart',
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

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.price * quantity
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgGradient={useColorModeValue(
          'linear(to-br, gray.800, gray.900)',
          'linear(to-br, gray.900, black)'
        )}
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
                bg={accentGreen}
                color="white"
              >
                Purchase Gift Vouchers
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
                  HackToLive Gift Vouchers
                </Heading>
                <Box
                  width="120px"
                  height="4px"
                  bg={accentGreen}
                  mx="auto"
                  borderRadius="full"
                />
              </Box>

              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="whiteAlpha.900"
                maxW="2xl"
              >
                Purchase vouchers and gift a HackToLive premium subscription
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Main Content */}
      <Box py={useColorModeValue(8, 12)} bg={bgColor}>
        <Container maxW={'container.xl'}>
          {/* Voucher Builder Section */}
          {voucherProducts.length > 0 && (
            <Box mb={12}>
              <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
                {/* Voucher Card - Left */}
                <Box flex="1" minW={{ lg: '400px' }} maxW={{ lg: '500px' }}>
                  <Box
                    bg={voucherCardBg}
                    borderRadius="2xl"
                    p={8}
                    position="relative"
                    overflow="hidden"
                    boxShadow="2xl"
                  >
                    {/* Background Pattern */}
                    <Box
                      position="absolute"
                      top="-50%"
                      right="-20%"
                      width="400px"
                      height="400px"
                      bg="green.500"
                      opacity="0.1"
                      borderRadius="full"
                      filter="blur(100px)"
                      pointerEvents="none"
                    />
                    
                    <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
                      <Heading size="lg" color="white">
                        Your voucher
                      </Heading>

                      {/* Duration Slider */}
                      <Box>
                        <HStack justify="space-between" mb={3}>
                          <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium">
                            Duration
                          </Text>
                          <HStack spacing={2}>
                            <Text fontSize="3xl" fontWeight="bold" color={accentGreen}>
                              {duration}
                            </Text>
                            <Text color="whiteAlpha.800" fontSize="sm">
                              months
                            </Text>
                          </HStack>
                        </HStack>
                        <Slider
                          value={duration}
                          onChange={setDuration}
                          min={1}
                          max={12}
                          step={1}
                          colorScheme="green"
                        >
                          <SliderTrack bg="whiteAlpha.200">
                            <SliderFilledTrack bg={accentGreen} />
                          </SliderTrack>
                          <SliderThumb boxSize={6} bg={accentGreen} />
                        </Slider>
                      </Box>

                      {/* Quantity */}
                      <Box>
                        <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium" mb={3}>
                          Quantity
                        </Text>
                        <HStack spacing={4}>
                          <IconButton
                            aria-label="Decrease"
                            icon={<FiMinus />}
                            onClick={decrementQuantity}
                            size="md"
                            bg="whiteAlpha.100"
                            color="white"
                            _hover={{ bg: 'whiteAlpha.200' }}
                            borderRadius="md"
                          />
                          <NumberInput
                            value={quantity}
                            onChange={(_, val) => setQuantity(val || 1)}
                            min={1}
                            max={100}
                            flex="1"
                          >
                            <NumberInputField
                              textAlign="center"
                              fontSize="xl"
                              fontWeight="bold"
                              bg="whiteAlpha.100"
                              border="none"
                              color="white"
                              _focus={{ bg: 'whiteAlpha.200' }}
                            />
                          </NumberInput>
                          <IconButton
                            aria-label="Increase"
                            icon={<FiPlus />}
                            onClick={incrementQuantity}
                            size="md"
                            bg="whiteAlpha.100"
                            color="white"
                            _hover={{ bg: 'whiteAlpha.200' }}
                            borderRadius="md"
                          />
                        </HStack>
                        <Text color="whiteAlpha.600" fontSize="xs" mt={2}>
                          Voucher
                        </Text>
                      </Box>

                      {/* Total Price */}
                      <Box
                        bg="whiteAlpha.100"
                        borderRadius="lg"
                        p={4}
                        borderWidth="1px"
                        borderColor="whiteAlpha.200"
                      >
                        <VStack spacing={1} align="stretch">
                          <HStack justify="space-between">
                            <Text color="whiteAlpha.800" fontSize="lg" fontWeight="bold">
                              Total
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color={accentGreen}>
                              {calculateTotal().toLocaleString()} BDT
                            </Text>
                          </HStack>
                          <Text color="whiteAlpha.600" fontSize="xs">
                            You are buying {quantity} subscription voucher{quantity > 1 ? 's' : ''} that have {duration} months expiry date (once redeemed)
                          </Text>
                        </VStack>
                      </Box>

                      {/* Buy Button */}
                      <Button
                        size="lg"
                        bg={accentGreen}
                        color="white"
                        _hover={{ bg: 'green.600' }}
                        leftIcon={<FiShoppingCart />}
                        isLoading={addingToCart === selectedProduct?.id}
                        loadingText="Adding to cart"
                        onClick={() => handleAddToCart()}
                        borderRadius="lg"
                        fontSize="md"
                        fontWeight="bold"
                        boxShadow="lg"
                      >
                        Add to Cart
                      </Button>
                    </VStack>
                  </Box>
                </Box>

                {/* Steps Section - Right */}
                <Box flex="1">
                  <VStack spacing={6} align="stretch">
                    <Heading size="lg">How it works</Heading>
                    
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      {[
                        {
                          step: '1',
                          title: 'Purchase',
                          description: 'Select the amount and length of subscription of your voucher.',
                          icon: FiShoppingCart,
                        },
                        {
                          step: '2',
                          title: 'View in your Account',
                          description: 'View your voucher codes and their status by going to Manage Account → Subscription.',
                          icon: FiPackage,
                        },
                        {
                          step: '3',
                          title: 'Allocate',
                          description: 'Share the voucher codes with others for them to redeem.',
                          icon: FiGift,
                        },
                      ].map((item) => (
                        <Card key={item.step} bg={cardBg} borderColor={borderColor} borderWidth="1px">
                          <CardBody>
                            <VStack spacing={3} align="start">
                              <Flex
                                bg="primary.500"
                                color="white"
                                w={12}
                                h={12}
                                borderRadius="lg"
                                align="center"
                                justify="center"
                                fontWeight="bold"
                                fontSize="xl"
                              >
                                {item.step}
                              </Flex>
                              <Heading size="sm">{item.title}</Heading>
                              <Text color={mutedColor} fontSize="sm">
                                {item.description}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>

                    {/* Benefits */}
                    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" mt={4}>
                      <CardBody>
                        <VStack spacing={3} align="start">
                          <Heading size="sm">Why gift vouchers?</Heading>
                          <VStack spacing={2} align="start">
                            {[
                              'Perfect gift for cybersecurity enthusiasts',
                              'Instant delivery - no waiting',
                              'Flexible duration from 1 to 12 months',
                              'Access to all premium courses and features',
                              'Easy redemption process',
                            ].map((benefit, i) => (
                              <HStack key={i} spacing={2}>
                                <Icon as={FiCheck} color="green.500" />
                                <Text fontSize="sm" color={mutedColor}>
                                  {benefit}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </Box>
              </Flex>
            </Box>
          )}

          {/* Training Bundles Section */}
          {bundleProducts.length > 0 && (
            <Box mt={16}>
              <VStack spacing={6} align="stretch" mb={8}>
                <Heading size="xl">Training Bundles</Heading>
                <Text color={mutedColor} maxW="3xl">
                  Complete training packages with multiple courses at discounted prices
                </Text>
              </VStack>

              {loading ? (
                <Center py={20}>
                  <VStack spacing={4}>
                    <Text color={mutedColor}>Loading bundles...</Text>
                  </VStack>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {bundleProducts.map((product) => (
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
                      <Box position="relative" height="200px" overflow="hidden" bg={borderColor}>
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
                            <Icon as={FiPackage} boxSize={16} color={mutedColor} />
                          </Flex>
                        )}
                        {product.featured && (
                          <Badge
                            position="absolute"
                            top={3}
                            left={3}
                            colorScheme="yellow"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            <HStack spacing={1}>
                              <Icon as={FiAward} boxSize={3} />
                              <Text>Popular</Text>
                            </HStack>
                          </Badge>
                        )}
                      </Box>

                      <CardBody>
                        <VStack spacing={3} align="start">
                          <Badge colorScheme="blue" size="sm" fontSize="xs">
                            Training Bundle
                          </Badge>

                          <Heading size="sm" noOfLines={2} lineHeight="1.4">
                            {product.name}
                          </Heading>

                          <Text color={mutedColor} fontSize="sm" noOfLines={3}>
                            {product.shortDescription || product.description}
                          </Text>

                          <Flex justify="space-between" width="100%" align="center" pt={2}>
                            <VStack align="start" spacing={0}>
                              <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                                  {product.price.toLocaleString()} BDT
                                </Text>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                  <Text
                                    fontSize="sm"
                                    color={mutedColor}
                                    textDecoration="line-through"
                                  >
                                    {product.compareAtPrice.toLocaleString()} BDT
                                  </Text>
                                )}
                              </HStack>
                            </VStack>

                            <Button
                              colorScheme="primary"
                              size="sm"
                              leftIcon={<FiShoppingCart />}
                              isDisabled={product.stockQuantity === 0 && !product.allowBackorder}
                              isLoading={addingToCart === product.id}
                              loadingText="Adding"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart(product, 1)
                              }}
                            >
                              Add to Cart
                            </Button>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}
