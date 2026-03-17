"use client"

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
import { toast } from '@/components/ui/toast';
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
  
  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const categoryGroups: { label: string; items: BlogCategory[] }[] = [
    {
      label: "Fundamentals",
      items: ["Cybersecurity Basics", "Networking & Network Security", "Privacy & Online Safety", "Cryptography", "Programming for Cybersecurity"],
    },
    {
      label: "Offensive Security",
      items: ["Ethical Hacking", "Penetration Testing", "Red Teaming", "Kali Linux & Linux Security"],
    },
    {
      label: "Defensive Security",
      items: ["Blue Teaming", "Incident Response & SOC", "Security Best Practices", "Digital Forensics"],
    },
    {
      label: "Technical Domains",
      items: ["Web Application Security", "Mobile Security", "Cloud Security", "IoT Security", "AI in Cybersecurity", "Cloud & DevSecOps"],
    },
    {
      label: "Threats & Attacks",
      items: ["Cyber Threats & Attacks", "Malware & Ransomware", "Vulnerabilities & Exploits", "OSINT (Open-Source Intelligence)"],
    },
    {
      label: "Tools & Resources",
      items: ["Cybersecurity Tools", "Security Tools Tutorials"],
    },
    {
      label: "Learning & Career",
      items: ["Security Certifications", "Career Guides", "CTF Walkthroughs & Labs", "Guides & Step-by-Step Tutorials"],
    },
    {
      label: "News & Updates",
      items: ["Cybersecurity News & Updates"],
    },
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
          'Cybersecurity Basics': 'CYBERSECURITY_BASICS',
          'Ethical Hacking': 'ETHICAL_HACKING',
          'Penetration Testing': 'PENETRATION_TESTING',
          'Kali Linux & Linux Security': 'KALI_LINUX_AND_LINUX_SECURITY',
          'Cybersecurity Tools': 'CYBERSECURITY_TOOLS',
          'Networking & Network Security': 'NETWORKING_AND_NETWORK_SECURITY',
          'Web Application Security': 'WEB_APPLICATION_SECURITY',
          'Mobile Security': 'MOBILE_SECURITY',
          'Cloud Security': 'CLOUD_SECURITY',
          'Digital Forensics': 'DIGITAL_FORENSICS',
          'Cyber Threats & Attacks': 'CYBER_THREATS_AND_ATTACKS',
          'Malware & Ransomware': 'MALWARE_AND_RANSOMWARE',
          'Privacy & Online Safety': 'PRIVACY_AND_ONLINE_SAFETY',
          'Cryptography': 'CRYPTOGRAPHY',
          'Programming for Cybersecurity': 'PROGRAMMING_FOR_CYBERSECURITY',
          'Incident Response & SOC': 'INCIDENT_RESPONSE_AND_SOC',
          'Red Teaming': 'RED_TEAMING',
          'Blue Teaming': 'BLUE_TEAMING',
          'Security Certifications': 'SECURITY_CERTIFICATIONS',
          'Career Guides': 'CAREER_GUIDES',
          'Cybersecurity News & Updates': 'CYBERSECURITY_NEWS_AND_UPDATES',
          'Vulnerabilities & Exploits': 'VULNERABILITIES_AND_EXPLOITS',
          'Security Best Practices': 'SECURITY_BEST_PRACTICES',
          'OSINT (Open-Source Intelligence)': 'OSINT_OPEN_SOURCE_INTELLIGENCE',
          'IoT Security': 'IOT_SECURITY',
          'AI in Cybersecurity': 'AI_IN_CYBERSECURITY',
          'Cloud & DevSecOps': 'CLOUD_AND_DEVSECOPS',
          'Security Tools Tutorials': 'SECURITY_TOOLS_TUTORIALS',
          'CTF Walkthroughs & Labs': 'CTF_WALKTHROUGHS_AND_LABS',
          'Guides & Step-by-Step Tutorials': 'GUIDES_AND_STEP_BY_STEP_TUTORIALS',
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

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail) {
      toast.error('Validation Error', {
        description: 'Please enter your email address',
        duration: 3000,
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: newsletterEmail,
            name: newsletterName,
            source: 'blog',
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully Subscribed!', {
          description: data.message || 'Check your email for confirmation.',
          duration: 5000,
        });
        setNewsletterEmail('');
        setNewsletterName('');
      } else {
        toast.error('Subscription Failed', {
          description: data.message || 'Failed to subscribe. Please try again.',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Something Went Wrong', {
        description: 'An error occurred. Please try again later.',
        duration: 4000,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

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
            'linear-gradient(135deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.88) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={{ base: "4", md: "6" }} textAlign="center">
            <FallInPlace>
              <Badge
                bg={useColorModeValue('green.200', 'green.700')}
                color={useColorModeValue('green.900', 'white')}
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
                fontWeight="semibold"
              >
                Knowledge Hub
              </Badge>
            </FallInPlace>
            <FallInPlace delay={0.1}>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }} fontWeight="bold" color="white">
                Hack To Live Blog
              </Heading>
            </FallInPlace>
            <Box
              width="120px"
              height="4px"
              bg={useColorModeValue('green.400', 'green.500')}
              mx="auto"
              borderRadius="full"
            />
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
          <Grid templateColumns={isDesktop ? "240px 1fr" : "1fr"} gap={{ base: "8", lg: "10" }}>
            {isDesktop && (
              <GridItem>
                <VStack spacing="4" align="stretch" position="sticky" top="24" maxH="calc(100vh - 7rem)" overflowY="auto" pr="1"
                  css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-gray-300)', borderRadius: '4px' } }}
                >
                  <Box>
                    <Button
                      size="sm" variant="ghost" onClick={() => setSelectedCategory("All")}
                      justifyContent="flex-start"
                      fontWeight={selectedCategory === "All" ? "semibold" : "normal"}
                      color={selectedCategory === "All" ? accentColor : undefined}
                      w="full" px="2"
                      _hover={{ bg: hoverBg }}
                      transition="all 0.2s"
                      borderLeftWidth="2px"
                      borderLeftColor={selectedCategory === "All" ? accentColor : "transparent"}
                      borderRadius="0"
                      mb="2"
                    >
                      All Categories
                    </Button>
                    {categoryGroups.map((group) => (
                      <Box key={group.label} mb="3">
                        <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="muted" px="2" mb="1">
                          {group.label}
                        </Text>
                        <Stack spacing="0">
                          {group.items.map((category) => (
                            <Button
                              key={category}
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedCategory(category)}
                              justifyContent="flex-start"
                              fontWeight={selectedCategory === category ? "semibold" : "normal"}
                              color={selectedCategory === category ? accentColor : undefined}
                              px="2"
                              h="7"
                              fontSize="xs"
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
                    ))}
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
                    <Badge
                      bg={useColorModeValue('green.200', 'green.700')}
                      color={useColorModeValue('green.900', 'white')}
                      fontSize="sm"
                      px="3"
                      py="1"
                      borderRadius="full"
                      fontWeight="semibold"
                    >
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
                <Button
                  size="sm" variant="ghost" onClick={() => { setSelectedCategory("All"); onClose(); }}
                  justifyContent="flex-start"
                  fontWeight={selectedCategory === "All" ? "semibold" : "normal"}
                  color={selectedCategory === "All" ? accentColor : undefined}
                  w="full" px="2" mb="2"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s"
                  borderLeftWidth="2px"
                  borderLeftColor={selectedCategory === "All" ? accentColor : "transparent"}
                  borderRadius="0"
                >
                  All Categories
                </Button>
                {categoryGroups.map((group) => (
                  <Box key={group.label} mb="3">
                    <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="muted" px="2" mb="1">
                      {group.label}
                    </Text>
                    <Stack spacing="0">
                      {group.items.map((category) => (
                        <Button key={category} size="sm" variant="ghost"
                          onClick={() => { setSelectedCategory(category); onClose(); }}
                          justifyContent="flex-start"
                          fontWeight={selectedCategory === category ? "semibold" : "normal"}
                          color={selectedCategory === category ? accentColor : undefined}
                          px="2" h="7" fontSize="xs"
                          _hover={{ bg: hoverBg, pl: "3" }} transition="all 0.2s"
                          borderLeftWidth="2px"
                          borderLeftColor={selectedCategory === category ? accentColor : "transparent"}
                          borderRadius="0"
                        >
                          {category}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                ))}
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
            <Badge
              bg={useColorModeValue('green.200', 'green.700')}
              color={useColorModeValue('green.900', 'white')}
              fontSize="sm"
              px="3"
              py="1"
              borderRadius="full"
              fontWeight="semibold"
            >
              Stay Updated
            </Badge>
            <Heading size={{ base: "xl", md: "2xl" }}>Subscribe to Our Newsletter</Heading>
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
              onSubmit={handleNewsletterSubmit}
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
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                isDisabled={isSubscribing}
                required
              />
              <Button 
                type="submit" 
                colorScheme="green" 
                size="lg" 
                rightIcon={<Icon as={FiMail} />} 
                h="12" 
                flexShrink={{ base: "auto", md: 0 }}
                isLoading={isSubscribing}
                loadingText="Subscribing..."
              >
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
