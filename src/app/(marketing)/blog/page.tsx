"use client";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Badge,
  Wrap,
  useColorModeValue,
  Icon,
  Flex,
  Stack,
  Divider,
  Card,
  CardBody,
  Avatar,
  LinkBox,
  LinkOverlay,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiSearch, FiArrowRight, FiMail } from "react-icons/fi";
import BlogData from "./_components/blogData";
import { useState, useMemo } from "react";
import { BlogCategory, BlogType, Blog } from "@/types/blog";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import Link from "next/link";
import Image from "next/image";

const ITEMS_PER_PAGE = 6;

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "All">("All");
  const [selectedType, setSelectedType] = useState<BlogType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const categories: (BlogCategory | "All")[] = [
    "All",
    "Cybersecurity Insights",
    "News",
    "Tutorials"
  ];

  const blogTypes: (BlogType | "All")[] = [
    "All",
    "Threat Alerts",
    "How-to Tutorials",
    "Best Security Practices",
    "Compliance Guides",
    "Case Study Stories"
  ];

  const filteredBlogs = useMemo(() => {
    return BlogData.filter(blog => {
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      const matchesType = selectedType === "All" || blog.blogType === selectedType;
      const matchesSearch = searchQuery === "" || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.metadata.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [selectedCategory, selectedType, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, searchQuery]);

  return (
    <Box>
      {/* Header Section with Background Image */}
      <Box
        position="relative"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        overflow="hidden"
        bgImage="url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000')"
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
            'linear-gradient(135deg, rgba(26, 32, 44, 0.85) 0%, rgba(45, 55, 72, 0.90) 100%)',
            'linear-gradient(135deg, rgba(26, 32, 44, 0.70) 0%, rgba(45, 55, 72, 0.75) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={{ base: "4", md: "6" }} textAlign="center">
            <FallInPlace>
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px="4" 
                py="2" 
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Knowledge Hub
              </Badge>
            </FallInPlace>
            <FallInPlace delay={0.1}>
              <Heading 
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }}
                fontWeight="bold"
                color="white"
              >
                Hack To Live Blog
              </Heading>
            </FallInPlace>
            <FallInPlace delay={0.2}>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                color="whiteAlpha.900" 
                maxW="2xl"
              >
                Stay informed with the latest security insights, tutorials, and threat intelligence
              </Text>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Main Content Section - Two Panel Layout */}
      <Box py={{ base: "10", md: "12", lg: "16" }} bg={bgColor}>
        <Container maxW="container.xl">
          <Grid
            templateColumns={isDesktop ? "280px 1fr" : "1fr"}
            gap={{ base: "8", lg: "10" }}
          >
            {/* Left Sidebar - Filters */}
            {isDesktop && (
              <GridItem>
                <VStack spacing="4" align="stretch" position="sticky" top="24">
                  {/* Category Filter */}
                  <Box>
                    <Text 
                      fontSize="xs" 
                      fontWeight="bold" 
                      textTransform="uppercase" 
                      letterSpacing="wider"
                      mb="3"
                      color="muted"
                    >
                      Categories
                    </Text>
                    <Stack spacing="1">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedCategory(category)}
                          justifyContent="flex-start"
                          fontWeight={selectedCategory === category ? "semibold" : "normal"}
                          color={selectedCategory === category ? accentColor : undefined}
                          px="2"
                          _hover={{ bg: hoverBg, pl: "3" }}
                          transition="all 0.2s"
                          borderLeftWidth="2px"
                          borderLeftColor={selectedCategory === category ? accentColor : "transparent"}
                          borderRadius="0"
                        >
                          {category}
                        </Button>
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Blog Type Filter */}
                  <Box>
                    <Text 
                      fontSize="xs" 
                      fontWeight="bold" 
                      textTransform="uppercase" 
                      letterSpacing="wider"
                      mb="3"
                      color="muted"
                    >
                      Blog Types
                    </Text>
                    <Stack spacing="1">
                      {blogTypes.map((type) => (
                        <Button
                          key={type}
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedType(type)}
                          justifyContent="flex-start"
                          fontWeight={selectedType === type ? "semibold" : "normal"}
                          color={selectedType === type ? accentColor : undefined}
                          px="2"
                          _hover={{ bg: hoverBg, pl: "3" }}
                          transition="all 0.2s"
                          borderLeftWidth="2px"
                          borderLeftColor={selectedType === type ? accentColor : "transparent"}
                          borderRadius="0"
                        >
                          {type}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                </VStack>
              </GridItem>
            )}

            {/* Right Panel - Blog List */}
            <GridItem>
              <VStack spacing="6" align="stretch">
                {/* Filters Button for Mobile */}
                <Box display={{ base: "block", lg: "none" }}>
                  <Button onClick={onOpen} variant="outline" colorScheme="green" size="sm">
                    Open Filters
                  </Button>
                </Box>

                {/* Search Bar */}
                <FallInPlace delay={0.3}>
                  <InputGroup size="lg">
                    <Input
                      placeholder="Search articles, tags, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg={cardBg}
                      borderColor={borderColor}
                      borderWidth="2px"
                      borderRadius="xl"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: "lg" }}
                      fontSize={{ base: "md", md: "lg" }}
                      py={{ base: "6", md: "7" }}
                    />
                    <InputRightElement h="full" pr="4">
                      <Icon as={FiSearch} boxSize="5" color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                </FallInPlace>

                {/* Results Header */}
                <Flex 
                  justify="space-between" 
                  align="center" 
                  pb="4"
                  borderBottomWidth="2px"
                  borderColor={borderColor}
                >
                  <Text fontSize="lg" fontWeight="semibold">
                    {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Article' : 'Articles'} Found
                  </Text>
                  <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                    Page {currentPage} of {totalPages || 1}
                  </Badge>
                </Flex>

                {/* Blog List */}
                {currentBlogs.length > 0 ? (
                  <VStack spacing="6" align="stretch">
                    {currentBlogs.map((blog, index) => (
                      <FallInPlace key={blog._id} delay={0.1 * index}>
                        <BlogListItem blog={blog} />
                      </FallInPlace>
                    ))}
                  </VStack>
                ) : (
                  <Box textAlign="center" py="20">
                    <VStack spacing="4">
                      <Icon as={FiSearch} boxSize="12" color="gray.400" />
                      <Heading size="md" color="muted">
                        No articles found
                      </Heading>
                      <Text color="muted">
                        Try adjusting your filters or search query
                      </Text>
                    </VStack>
                  </Box>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Flex justify="center" align="center" pt="8" gap="2">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      isDisabled={currentPage === 1}
                      variant="outline"
                      colorScheme="green"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "solid" : "outline"}
                        colorScheme="green"
                        size="sm"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      isDisabled={currentPage === totalPages}
                      variant="outline"
                      colorScheme="green"
                    >
                      Next
                    </Button>
                  </Flex>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Drawer for Mobile Filters */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top="4" />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <VStack spacing="4" align="stretch">
              {/* Category Filter */}
              <Box>
                <Text 
                  fontSize="xs" 
                  fontWeight="bold" 
                  textTransform="uppercase" 
                  letterSpacing="wider"
                  mb="3"
                  color="muted"
                >
                  Categories
                </Text>
                <Stack spacing="1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant="ghost"
                      onClick={() => { setSelectedCategory(category); onClose(); }}
                      justifyContent="flex-start"
                      fontWeight={selectedCategory === category ? "semibold" : "normal"}
                      color={selectedCategory === category ? accentColor : undefined}
                      px="2"
                      _hover={{ bg: hoverBg, pl: "3" }}
                      transition="all 0.2s"
                      borderLeftWidth="2px"
                      borderLeftColor={selectedCategory === category ? accentColor : "transparent"}
                      borderRadius="0"
                    >
                      {category}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Divider />

              {/* Blog Type Filter */}
              <Box>
                <Text 
                  fontSize="xs" 
                  fontWeight="bold" 
                  textTransform="uppercase" 
                  letterSpacing="wider"
                  mb="3"
                  color="muted"
                >
                  Blog Types
                </Text>
                <Stack spacing="1">
                  {blogTypes.map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant="ghost"
                      onClick={() => { setSelectedType(type); onClose(); }}
                      justifyContent="flex-start"
                      fontWeight={selectedType === type ? "semibold" : "normal"}
                      color={selectedType === type ? accentColor : undefined}
                      px="2"
                      _hover={{ bg: hoverBg, pl: "3" }}
                      transition="all 0.2s"
                      borderLeftWidth="2px"
                      borderLeftColor={selectedType === type ? accentColor : "transparent"}
                      borderRadius="0"
                    >
                      {type}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* CTA Section */}
      <Box 
        py={{ base: "16", md: "20" }} 
        bg={useColorModeValue("green.50", "green.900")}
        borderTopWidth="1px"
        borderColor={borderColor}
      >
        <Container maxW="container.md">
          <VStack spacing="6" textAlign="center">
            <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
              Stay Updated
            </Badge>
            <Heading size={{ base: "xl", md: "2xl" }}>
              Subscribe to Our Newsletter
            </Heading>
            <Text fontSize="lg" color="muted" maxW="xl">
              Get the latest cybersecurity insights, threat alerts, and tutorials delivered directly to your inbox.
            </Text>
            <Stack 
              as="form" 
              w="full" 
              maxW="md" 
              spacing="3"
              direction={{ base: "column", md: "row" }}
              px={{ base: "4", md: "0" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                placeholder="Enter your email"
                type="email"
                size="lg"
                bg={cardBg}
                borderWidth="2px"
                _focus={{ borderColor: accentColor }}
                h="12"
                flex={{ base: "auto", md: "1" }}
              />
              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                rightIcon={<Icon as={FiMail} />}
                h="12"
                flexShrink={{ base: "auto", md: 0 }}
              >
                Subscribe
              </Button>
            </Stack>
            <Text fontSize="sm" color="muted">
              Join 10,000+ security professionals. Unsubscribe anytime.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

// Blog List Item Component (Row Layout)
const BlogListItem = ({ blog }: { blog: Blog }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <LinkBox as={Card}
      bg={cardBg}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      cursor="pointer"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: accentColor,
        shadow: "xl",
      }}
    >
      <CardBody p="0">
        <Grid templateColumns={{ base: "1fr", md: "280px 1fr" }} gap="0">
          {/* Image */}
          <Box position="relative" height={{ base: "200px", md: "220px" }}>
            <Image 
              src={blog.mainImage} 
              alt={blog.title} 
              fill 
              style={{ objectFit: "cover" }}
            />
            {blog.featured && (
              <Badge
                position="absolute"
                top="3"
                left="3"
                colorScheme="green"
                fontSize="xs"
                px="2"
                py="1"
              >
                Featured
              </Badge>
            )}
          </Box>

          {/* Content */}
          <VStack align="stretch" spacing="4" p={{ base: "5", md: "6" }}>
            <VStack align="stretch" spacing="3">
              <HStack spacing="2" flexWrap="wrap">
                <Badge colorScheme="green" fontSize="xs">
                  {blog.category}
                </Badge>
                <Badge colorScheme="blue" fontSize="xs">
                  {blog.blogType}
                </Badge>
              </HStack>

              <LinkOverlay as={Link} href={`/blog/${blog.slug}`}>
                <Heading 
                  size={{ base: "md", md: "lg" }}
                  noOfLines={2}
                  _hover={{ color: accentColor }}
                  transition="color 0.2s"
                >
                  {blog.title}
                </Heading>
              </LinkOverlay>

              <Text color={mutedColor} noOfLines={2} fontSize="sm">
                {blog.metadata}
              </Text>
            </VStack>

            <HStack spacing="4" pt="2" borderTopWidth="1px" borderColor={borderColor}>
              <HStack spacing="3">
                <Avatar size="sm" name={blog.author.name} src={blog.author.avatar} />
                <VStack align="start" spacing="0">
                  <Text fontSize="sm" fontWeight="semibold">
                    {blog.author.name}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    {blog.author.role}
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="xs" color={mutedColor} ml="auto">
                {blog.publishDate} • {blog.readTime}
              </Text>
            </HStack>
          </VStack>
        </Grid>
      </CardBody>
    </LinkBox>
  );
};

export default BlogPage;
