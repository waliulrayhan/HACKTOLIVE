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
  Button,
  Badge,
  useColorModeValue,
  Icon,
  Flex,
  Stack,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { FiSearch, FiMail } from "react-icons/fi";
import SearchBar from "@/components/academy/SearchBar";
import BlogItem from "./_components/BlogItem";
import { useState, useEffect } from "react";
import { chakra } from "@chakra-ui/react";
import { BlogCategory, BlogType, Blog } from "@/types/blog";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";

const ITEMS_PER_PAGE = 10;

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "All">("All");
  const [selectedType, setSelectedType] = useState<BlogType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
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

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const categoryMap: Record<string, string> = {
          'Cybersecurity Insights': 'CYBERSECURITY_INSIGHTS',
          'News': 'NEWS',
          'Tutorials': 'TUTORIALS',
        };

        const blogTypeMap: Record<string, string> = {
          'Threat Alerts': 'THREAT_ALERTS',
          'How-to Tutorials': 'HOW_TO_TUTORIALS',
          'Best Security Practices': 'BEST_SECURITY_PRACTICES',
          'Compliance Guides': 'COMPLIANCE_GUIDES',
          'Case Study Stories': 'CASE_STUDY_STORIES',
        };

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          status: 'PUBLISHED',
        });

        if (selectedCategory !== "All") {
          params.append('category', categoryMap[selectedCategory] || selectedCategory);
        }

        if (selectedType !== "All") {
          params.append('blogType', blogTypeMap[selectedType] || selectedType);
        }

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/blog?${params}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch blogs");
        
        const data = await response.json();
        
        const convertedBlogs = data.data.map((blog: any) => ({
          ...blog,
          _id: blog.id,
          category: Object.keys(categoryMap).find(key => categoryMap[key] === blog.category) || blog.category,
          blogType: Object.keys(blogTypeMap).find(key => blogTypeMap[key] === blog.blogType) || blog.blogType,
          author: {
            name: blog.author.name,
            avatar: blog.author.avatar,
            role: blog.author.role,
            bio: blog.author.bio,
            twitter: blog.author.twitterUrl,
            linkedin: blog.author.linkedinUrl,
            github: blog.author.githubUrl,
          },
        }));

        setBlogs(convertedBlogs);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory, selectedType, searchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, searchQuery]);

  return (
    <Box>
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
              <Badge colorScheme="green" fontSize="sm" px="4" py="2" borderRadius="full" textTransform="uppercase" letterSpacing="wide">
                Knowledge Hub
              </Badge>
            </FallInPlace>
            <FallInPlace delay={0.1}>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }} fontWeight="bold" color="white">
                Hack To Live Blog
              </Heading>
            </FallInPlace>
            <FallInPlace delay={0.2}>
              <Text fontSize={{ base: "lg", md: "xl" }} color="whiteAlpha.900" maxW="2xl">
                Stay informed with the latest security insights, tutorials, and threat intelligence
              </Text>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      <Box py={{ base: "10", md: "12", lg: "16" }} bg={bgColor}>
        <Container maxW="container.xl">
          <Grid templateColumns={isDesktop ? "280px 1fr" : "1fr"} gap={{ base: "8", lg: "10" }}>
            {isDesktop && (
              <GridItem>
                <VStack spacing="4" align="stretch" position="sticky" top="24">
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb="3" color="muted">
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

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb="3" color="muted">
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

            <GridItem>
              <VStack spacing="6" align="stretch">
                <Box>
                  <Box mb="4">
                    <SearchBar placeholder="Search articles, tags, or topics..." onSearch={setSearchQuery} />
                  </Box>

                  <Text fontSize="sm" color="muted" fontWeight="medium" display={{ base: "block", lg: "none" }} mb="3">
                    {loading ? "Loading..." : (<>Showing <chakra.span color="primary.500" fontWeight="semibold">{blogs.length}</chakra.span> articles</>)}
                  </Text>

                  <Flex gap="3" display={{ base: "flex", lg: "none" }} align="center">
                    <Button onClick={onOpen} colorScheme="primary" variant="outline" size="sm" flexShrink={0}>
                      Filters
                    </Button>
                  </Flex>
                </Box>

                <Flex justify="space-between" align="center" wrap="wrap" gap="4" display={{ base: "none", lg: "flex" }}>
                  <Text fontSize="md" color="muted" fontWeight="medium">
                    {loading ? "Loading..." : (<>Showing <chakra.span color="primary.500" fontWeight="semibold">{blogs.length}</chakra.span> articles</>)}
                  </Text>
                  <HStack spacing="3">
                    <Text fontSize="sm" color="muted">Sort by:</Text>
                    <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                      Page {currentPage} of {totalPages || 1}
                    </Badge>
                  </HStack>
                </Flex>

                {loading ? (
                  <Box textAlign="center" py="20">
                    <VStack spacing="4">
                      <Spinner size="xl" color="green.500" thickness="4px" />
                      <Text color="muted">Loading blogs...</Text>
                    </VStack>
                  </Box>
                ) : blogs.length > 0 ? (
                  <VStack spacing="6" align="stretch">
                    {blogs.map((blog, index) => (
                      <FallInPlace key={blog._id} delay={0.1 * index}>
                        <BlogItem blog={blog} />
                      </FallInPlace>
                    ))}
                  </VStack>
                ) : (
                  <Box textAlign="center" py="20">
                    <VStack spacing="4">
                      <Icon as={FiSearch} boxSize="12" color="gray.400" />
                      <Heading size="md" color="muted">No articles found</Heading>
                      <Text color="muted">Try adjusting your filters or search query</Text>
                    </VStack>
                  </Box>
                )}

                {totalPages > 1 && (
                  <Flex justify="center" align="center" pt="8" gap="2">
                    <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} isDisabled={currentPage === 1} variant="outline" colorScheme="green">
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button key={page} onClick={() => setCurrentPage(page)} variant={currentPage === page ? "solid" : "outline"} colorScheme="green" size="sm">
                          {page}
                        </Button>
                      );
                    })}
                    <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} isDisabled={currentPage === totalPages} variant="outline" colorScheme="green">
                      Next
                    </Button>
                  </Flex>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top="4" />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <VStack spacing="4" align="stretch">
              <Box>
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb="3" color="muted">
                  Categories
                </Text>
                <Stack spacing="1">
                  {categories.map((category) => (
                    <Button key={category} size="sm" variant="ghost" onClick={() => { setSelectedCategory(category); onClose(); }} justifyContent="flex-start" fontWeight={selectedCategory === category ? "semibold" : "normal"} color={selectedCategory === category ? accentColor : undefined} px="2" _hover={{ bg: hoverBg, pl: "3" }} transition="all 0.2s" borderLeftWidth="2px" borderLeftColor={selectedCategory === category ? accentColor : "transparent"} borderRadius="0">
                      {category}
                    </Button>
                  ))}
                </Stack>
              </Box>
              <Divider />
              <Box>
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb="3" color="muted">
                  Blog Types
                </Text>
                <Stack spacing="1">
                  {blogTypes.map((type) => (
                    <Button key={type} size="sm" variant="ghost" onClick={() => { setSelectedType(type); onClose(); }} justifyContent="flex-start" fontWeight={selectedType === type ? "semibold" : "normal"} color={selectedType === type ? accentColor : undefined} px="2" _hover={{ bg: hoverBg, pl: "3" }} transition="all 0.2s" borderLeftWidth="2px" borderLeftColor={selectedType === type ? accentColor : "transparent"} borderRadius="0">
                      {type}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box py={{ base: "16", md: "20" }} bg={useColorModeValue("green.50", "green.900")} borderTopWidth="1px" borderColor={borderColor}>
        <Container maxW="container.md">
          <VStack spacing="6" textAlign="center">
            <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">Stay Updated</Badge>
            <Heading size={{ base: "xl", md: "2xl" }}>Subscribe to Our Newsletter</Heading>
            <Text fontSize="lg" color="muted" maxW="xl">
              Get the latest cybersecurity insights, threat alerts, and tutorials delivered directly to your inbox.
            </Text>
            <Stack as="form" w="full" maxW="md" spacing="3" direction={{ base: "column", md: "row" }} px={{ base: "4", md: "0" }} onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" type="email" size="lg" bg={cardBg} borderWidth="2px" _focus={{ borderColor: accentColor }} h="12" flex={{ base: "auto", md: "1" }} />
              <Button type="submit" colorScheme="green" size="lg" rightIcon={<Icon as={FiMail} />} h="12" flexShrink={{ base: "auto", md: 0 }}>
                Subscribe
              </Button>
            </Stack>
            <Text fontSize="sm" color="muted">Join 10,000+ security professionals. Unsubscribe anytime.</Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogPage;
