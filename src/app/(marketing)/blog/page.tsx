"use client";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Badge,
  Wrap,
  useColorModeValue,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import BlogData from "@/components/Blog/blogData";
import BlogItem from "@/components/Blog/BlogItem";
import { useState, useMemo } from "react";
import { BlogCategory, BlogType } from "@/types/blog";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "All">("All");
  const [selectedType, setSelectedType] = useState<BlogType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");

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

  return (
    <Box>
      {/* Header Section */}
      <Box py={{ base: "16", md: "24", lg: "32" }} position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="0"
          right="0"
          width="400px"
          height="400px"
          borderRadius="full"
          bg={accentColor}
          opacity="0.05"
          filter="blur(100px)"
          pointerEvents="none"
        />
        <Container maxW="container.xl">
          <VStack spacing={{ base: "4", md: "6" }} textAlign="center">
            <FallInPlace>
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px="3" 
                py="1" 
                borderRadius="full"
              >
                Knowledge Hub
              </Badge>
            </FallInPlace>
            <FallInPlace delay={0.1}>
              <Heading 
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }}
                fontWeight="bold"
              >
                Cybersecurity Blog
              </Heading>
            </FallInPlace>
            <FallInPlace delay={0.2}>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                color="muted" 
                maxW="2xl"
              >
                Stay informed with the latest security insights, tutorials, and threat intelligence
              </Text>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Search and Filters Section */}
      <Box pb={{ base: "10", md: "16" }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: "6", md: "8" }} align="stretch">
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

            {/* Category Filter */}
            <FallInPlace delay={0.4}>
              <Box>
                <Text 
                  fontSize="sm" 
                  fontWeight="semibold" 
                  mb="3"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  color="muted"
                >
                  Filter by Category
                </Text>
                <Wrap spacing="3">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      size="md"
                      variant={selectedCategory === category ? "solid" : "outline"}
                      colorScheme={selectedCategory === category ? "green" : "gray"}
                      onClick={() => setSelectedCategory(category)}
                      borderRadius="full"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </Wrap>
              </Box>
            </FallInPlace>

            {/* Blog Type Filter */}
            <FallInPlace delay={0.5}>
              <Box>
                <Text 
                  fontSize="sm" 
                  fontWeight="semibold" 
                  mb="3"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  color="muted"
                >
                  Filter by Type
                </Text>
                <Wrap spacing="3">
                  {blogTypes.map((type) => (
                    <Button
                      key={type}
                      size="md"
                      variant={selectedType === type ? "solid" : "outline"}
                      colorScheme={selectedType === type ? "green" : "gray"}
                      onClick={() => setSelectedType(type)}
                      borderRadius="full"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </Wrap>
              </Box>
            </FallInPlace>

            {/* Results Count */}
            <FallInPlace delay={0.6}>
              <Flex 
                justify="space-between" 
                align="center" 
                pt="4"
                borderTopWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" fontWeight="medium" color="muted">
                  Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
                </Text>
              </Flex>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Blog Grid Section */}
      <Box pb={{ base: "20", md: "24", lg: "32" }}>
        <Container maxW="container.xl">
          {filteredBlogs.length > 0 ? (
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={{ base: "8", md: "8", lg: "10" }}
            >
              {filteredBlogs.map((post, key) => (
                <FallInPlace key={key} delay={0.1 * (key % 6)}>
                  <BlogItem blog={post} />
                </FallInPlace>
              ))}
            </SimpleGrid>
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
        </Container>
      </Box>
    </Box>
  );
};

export default BlogPage;
