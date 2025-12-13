"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Select,
  Button,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  Checkbox,
  CheckboxGroup,
  useColorModeValue,
  Flex,
  Icon,
  chakra,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiFilter, FiX } from "react-icons/fi";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import CourseCard from "@/components/academy/CourseCard";
import SearchBar from "@/components/academy/SearchBar";
import { EmptyState } from "@/components/academy/UIStates";
import { Course } from "@/types/academy";
import academyService from "@/lib/academy-service";

export default function AllCoursesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

  // API state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const allCourses = await academyService.getCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const levels = [
    { value: "fundamental", label: "Fundamental" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const tiers = [
    { value: "free", label: "Free" },
    { value: "premium", label: "Premium" },
  ];

  const deliveryModes = [
    { value: "recorded", label: "Recorded Videos" },
    { value: "live", label: "Live Classes" },
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    // Search filter
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Level filter
    if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
      return false;
    }

    // Price filter
    if (course.price < minPrice || course.price > maxPrice) {
      return false;
    }

    // Tier filter
    if (selectedTiers.length > 0 && !selectedTiers.includes(course.tier)) {
      return false;
    }

    // Delivery mode filter
    if (selectedDeliveryModes.length > 0 && !selectedDeliveryModes.includes(course.deliveryMode)) {
      return false;
    }

    return true;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.totalStudents - a.totalStudents;
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedLevels([]);
    setSelectedTiers([]);
    setSelectedDeliveryModes([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const FilterSection = () => (
    <VStack align="stretch" spacing="6">
      {/* Levels */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb="4" color="muted" textTransform="uppercase" letterSpacing="wide">
          Level
        </Text>
        <CheckboxGroup
          value={selectedLevels}
          onChange={(values) => setSelectedLevels(values as string[])}
        >
          <Stack spacing="3">
            {levels.map((level) => (
              <Checkbox key={level.value} value={level.value} colorScheme="primary">
                {level.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

      {/* Price Range */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb="4" color="muted" textTransform="uppercase" letterSpacing="wide">
          Price Range
        </Text>
        <VStack spacing="4" align="stretch">
          {/* Price Display */}
          <HStack justify="space-between">
            <InputGroup size="xs" maxW="120px">
              <InputLeftAddon children="Min" />
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setMinPrice(Math.min(val, maxPrice));
                  handleFilterChange();
                }}
                min={0}
                max={maxPrice}
                focusBorderColor="primary.500"
              />
            </InputGroup>
            <Text fontSize="sm" color="muted">to</Text>
            <InputGroup size="xs" maxW="120px">
              <InputLeftAddon children="Max" />
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 10000;
                  setMaxPrice(Math.max(val, minPrice));
                  handleFilterChange();
                }}
                min={minPrice}
                max={100000}
                focusBorderColor="primary.500"
              />
            </InputGroup>
          </HStack>
          
          {/* Range Slider */}
          <Box>
            <Text fontSize="xs" mb="2" color="muted">{minPrice} Tk - {maxPrice} Tk</Text>
            <RangeSlider
              value={[minPrice, maxPrice]}
              onChange={(val) => {
                setMinPrice(val[0]);
                setMaxPrice(val[1]);
              }}
              onChangeEnd={handleFilterChange}
              min={0}
              max={10000}
              step={100}
              colorScheme="primary"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} boxSize={5} />
              <RangeSliderThumb index={1} boxSize={5} />
            </RangeSlider>
          </Box>
        </VStack>
      </Box>

      {/* Tier */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb="4" color="muted" textTransform="uppercase" letterSpacing="wide">
          Course Tier
        </Text>
        <CheckboxGroup
          value={selectedTiers}
          onChange={(values) => setSelectedTiers(values as string[])}
        >
          <Stack spacing="3">
            {tiers.map((tier) => (
              <Checkbox key={tier.value} value={tier.value} colorScheme="primary">
                {tier.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

      {/* Delivery Mode */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb="4" color="muted" textTransform="uppercase" letterSpacing="wide">
          Delivery Mode
        </Text>
        <CheckboxGroup
          value={selectedDeliveryModes}
          onChange={(values) => setSelectedDeliveryModes(values as string[])}
        >
          <Stack spacing="3">
            {deliveryModes.map((mode) => (
              <Checkbox key={mode.value} value={mode.value} colorScheme="primary">
                {mode.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

      {/* Reset */}
      <Button colorScheme="red" variant="outline" size="sm" onClick={resetFilters} width="full">
        Reset Filters
      </Button>
    </VStack>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        position="relative" 
        overflow="hidden" 
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2000')"
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
                px="4" 
                py="2" 
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Browse Courses
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
                  Explore Our Course Catalog
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
                Choose from 50+ expert-led cybersecurity courses designed to take you from beginner to advanced professional
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
                    50+
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Expert Courses
                  </Text>
                </VStack>
                <VStack spacing="1">
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="green.400">
                    10K+
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Active Students
                  </Text>
                </VStack>
                <VStack spacing="1">
                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="green.400">
                    4.8/5
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Average Rating
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

      {/* Filters & Content */}
      <Box py={{ base: '8', md: '12' }} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing="8" align="stretch">

          {/* Search & Filters */}
          <Box>
            {/* Search Bar - Full width on mobile */}
            <Box mb="4">
              <SearchBar
                placeholder="Search courses by title or description..."
                onSearch={setSearchQuery}
              />
            </Box>
            
            {/* Results Count - Mobile Only (Above Sort/Filter) */}
            <Text 
              fontSize="sm" 
              color="muted" 
              fontWeight="medium" 
              display={{ base: "block", lg: "none" }}
              mb="3"
            >
              Showing <chakra.span color="primary.500" fontWeight="semibold">{currentCourses.length}</chakra.span> of {sortedCourses.length} courses
            </Text>
            
            {/* Sort & Filter Row - Mobile */}
            <Flex 
              gap="3" 
              display={{ base: "flex", lg: "none" }}
              align="center"
            >
              <Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                flex="1"
                borderRadius="lg"
                focusBorderColor="primary.500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </Select>
              <Button
                leftIcon={<Icon as={FiFilter} />}
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

          {/* Results Header - Desktop Only */}
          <Flex justify="space-between" align="center" wrap="wrap" gap="4" display={{ base: "none", lg: "flex" }}>
            <Text fontSize="md" color="muted" fontWeight="medium">
              Showing <chakra.span color="primary.500" fontWeight="semibold">{currentCourses.length}</chakra.span> of {sortedCourses.length} courses
            </Text>
            <HStack spacing="3">
              <Text fontSize="sm" color="muted">
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
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </Select>
            </HStack>
          </Flex>

          {/* Main Content */}
          <HStack align="start" spacing="8">
            {/* Sidebar Filters (Desktop) */}
            <Box
              w="280px"
              display={{ base: "none", lg: "block" }}
              position="sticky"
              top="100px"
            >
              <Box
                borderWidth="1px"
                borderRadius="2xl"
                borderColor={borderColor}
                p="6"
                bg={cardBg}
              >
                <FilterSection />
              </Box>
            </Box>

            {/* Course Grid */}
            <Box flex="1">
              {loading ? (
                <Center py="20">
                  <VStack spacing="4">
                    <Spinner size="xl" color="primary.500" thickness="4px" />
                    <Text color="muted">Loading courses...</Text>
                  </VStack>
                </Center>
              ) : sortedCourses.length === 0 ? (
                <EmptyState
                  title="No courses found"
                  description="Try adjusting your filters or search query to find what you're looking for."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              ) : (
                <VStack spacing="8" align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="6">
                    {currentCourses.map((course, index) => (
                      <FallInPlace key={course.id} delay={0.05 * index}>
                        <CourseCard course={course} />
                      </FallInPlace>
                    ))}
                  </SimpleGrid>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Flex justify="center" align="center" gap="2" flexWrap="wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="primary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isDisabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      <HStack spacing="1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            size="sm"
                            variant={currentPage === page ? "solid" : "ghost"}
                            colorScheme="primary"
                            onClick={() => setCurrentPage(page)}
                            minW="40px"
                          >
                            {page}
                          </Button>
                        ))}
                      </HStack>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="primary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        isDisabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </Flex>
                  )}
                </VStack>
              )}
            </Box>
          </HStack>
        </VStack>
      </Container>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" fontWeight="semibold" py="4">
            <Flex align="center" justify="space-between">
              <Text>Filter Courses</Text>
              <DrawerCloseButton position="relative" top="0" right="0" />
            </Flex>
          </DrawerHeader>
          <DrawerBody py="6">
            <FilterSection />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* CTA Section */}
      <Box py={{ base: '16', md: '24' }} position="relative" overflow="hidden">
        <Container maxW="container.xl">
          <Box
            bg={useColorModeValue('linear-gradient(135deg, #f7fee7 0%, #ecfccb 40%, #cffafe 100%)', 'linear-gradient(135deg, #1a2e05 0%, #0f172a 100%)')}
            borderRadius="3xl"
            px={{ base: '6', md: '12', lg: '16' }}
            py={{ base: '12', md: '16' }}
            position="relative"
            overflow="hidden"
            boxShadow="xl"
          >
            {/* Floating orbs with animation */}
            <Box
              position="absolute"
              top="20%"
              right="10%"
              width="200px"
              height="200px"
              borderRadius="full"
              filter="blur(40px)"
              animation="float 6s ease-in-out infinite"
              sx={{
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' }
                }
              }}
            />
            <Box
              position="absolute"
              bottom="15%"
              left="15%"
              width="180px"
              height="180px"
              borderRadius="full"
              filter="blur(40px)"
              animation="float 8s ease-in-out infinite"
              sx={{
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' }
                }
              }}
            />
            <Box
              position="absolute"
              top="40%"
              left="5%"
              width="150px"
              height="150px"
              borderRadius="full"
              filter="blur(35px)"
              animation="float 7s ease-in-out infinite"
              sx={{
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-15px)' }
                }
              }}
            />
            
            <VStack spacing={{ base: '6', md: '8' }} textAlign="center" position="relative" zIndex="1">
              <VStack spacing="4">
                <Heading
                  fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                  maxW="3xl"
                  bgGradient={useColorModeValue('linear(to-r, primary.600)', 'linear(to-r, primary.300)')}
                  bgClip="text"
                  animation="fadeIn 0.8s ease-out"
                  sx={{
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  Ready to Start Your Cybersecurity Journey?
                </Heading>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={useColorModeValue('gray.700', 'gray.300')}
                  maxW="2xl"
                  animation="fadeIn 1s ease-out"
                  sx={{
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  Join thousands of students learning from industry experts. Get instant access to all courses with our premium membership.
                </Text>
              </VStack>

              <HStack spacing="4" flexWrap="wrap" justify="center">
                <Button
                  size="lg"
                  colorScheme="primary"
                  _hover={{ 
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '2xl'
                  }}
                  px="8"
                  borderRadius="full"
                  fontWeight="semibold"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="lg"
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="primary"
                  _hover={{ 
                    transform: 'translateY(-3px) scale(1.02)',
                    bg: useColorModeValue('primary.50', 'whiteAlpha.100')
                  }}
                  px="8"
                  borderRadius="full"
                  fontWeight="semibold"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  View Pricing
                </Button>
              </HStack>

              <HStack 
                spacing="8" 
                pt="4" 
                flexWrap="wrap" 
                justify="center"
                animation="fadeIn 1.2s ease-out"
                sx={{
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <VStack spacing="1">
                  <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('primary.600', 'primary.300')}>
                    50+
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Expert Courses
                  </Text>
                </VStack>
                <VStack spacing="1">
                  <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('primary.600', 'primary.300')}>
                    10K+
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Active Students
                  </Text>
                </VStack>
                <VStack spacing="1">
                  <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('primary.600', 'primary.300')}>
                    4.8/5
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Average Rating
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
