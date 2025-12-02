"use client";

import { useState } from "react";
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
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  useColorModeValue,
  Flex,
  Icon,
  chakra,
} from "@chakra-ui/react";
import { FiFilter, FiX } from "react-icons/fi";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { courses } from "@/data/academy/courses";
import CourseCard from "@/components/academy/CourseCard";
import SearchBar from "@/components/academy/SearchBar";
import { EmptyState } from "@/components/academy/UIStates";

export default function AllCoursesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    { value: "web-security", label: "Web Security" },
    { value: "network-security", label: "Network Security" },
    { value: "penetration-testing", label: "Penetration Testing" },
    { value: "malware-analysis", label: "Malware Analysis" },
    { value: "cloud-security", label: "Cloud Security" },
    { value: "cryptography", label: "Cryptography" },
  ];

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

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
      return false;
    }

    // Level filter
    if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
      return false;
    }

    // Price filter
    if (course.price < priceRange[0] || course.price > priceRange[1]) {
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

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedTiers([]);
    setSelectedDeliveryModes([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
  };

  const FilterSection = () => (
    <VStack align="stretch" spacing="6">
      {/* Categories */}
      <Box>
        <Text fontWeight="semibold" fontSize="sm" mb="4" color="muted" textTransform="uppercase" letterSpacing="wide">
          Categories
        </Text>
        <CheckboxGroup
          value={selectedCategories}
          onChange={(values) => setSelectedCategories(values as string[])}
        >
          <Stack spacing="3">
            {categories.map((cat) => (
              <Checkbox key={cat.value} value={cat.value} colorScheme="primary">
                {cat.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

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
        <Text fontWeight="semibold" fontSize="sm" mb="2" color="muted" textTransform="uppercase" letterSpacing="wide">
          Price Range
        </Text>
        <Text fontSize="md" mb="4" fontWeight="medium">
          ₹{priceRange[0]} - ₹{priceRange[1]}
        </Text>
        <RangeSlider
          min={0}
          max={10000}
          step={500}
          value={priceRange}
          onChange={setPriceRange}
          colorScheme="primary"
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
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
      {/* Header */}
      <Box py={{ base: '12', md: '20' }} position="relative" overflow="hidden">
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing="6" textAlign="center">
              <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                Browse Courses
              </Badge>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} maxW="4xl">
                Explore Our Course Catalog
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="muted" maxW="3xl">
                Choose from 50+ expert-led cybersecurity courses designed to take you from beginner to advanced professional
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Filters & Content */}
      <Box py={{ base: '8', md: '12' }} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing="8" align="stretch">

          {/* Search & Filters */}
          <Flex gap="4" align="start" direction={{ base: "column", sm: "row" }}>
            <Box flex="1">
              <SearchBar
                placeholder="Search courses by title or description..."
                onSearch={setSearchQuery}
              />
            </Box>
            <Button
              leftIcon={<Icon as={FiFilter} />}
              onClick={onOpen}
              display={{ base: "flex", lg: "none" }}
              colorScheme="primary"
              variant="outline"
            >
              Filters
            </Button>
          </Flex>

          {/* Results Header */}
          <Flex justify="space-between" align="center" wrap="wrap" gap="4">
            <Text fontSize="md" color="muted" fontWeight="medium">
              Showing <chakra.span color="primary.500" fontWeight="semibold">{sortedCourses.length}</chakra.span> of {courses.length} courses
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
              {sortedCourses.length === 0 ? (
                <EmptyState
                  title="No courses found"
                  description="Try adjusting your filters or search query to find what you're looking for."
                  actionLabel="Reset Filters"
                  onAction={resetFilters}
                />
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="6">
                  {sortedCourses.map((course, index) => (
                    <FallInPlace key={course.id} delay={0.05 * index}>
                      <CourseCard course={course} />
                    </FallInPlace>
                  ))}
                </SimpleGrid>
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
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" fontWeight="semibold">
            Filter Courses
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
