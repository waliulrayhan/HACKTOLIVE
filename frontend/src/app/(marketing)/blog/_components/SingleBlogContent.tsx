"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Avatar,
  Divider,
  Wrap,
  Tag,
  Icon,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiCalendar, FiClock, FiUser, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import SharePost from "./SharePost";
import RelatedPost from "./RelatedPost";
import CategoriesSidebar from "./CategoriesSidebar";
import BlogTypesSidebar from "./BlogTypesSidebar";
import LikeButton from "./LikeButton";
import NewsletterSection from "./NewsletterSection";
import RecommendedPosts from "./RecommendedPosts";

interface Blog {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  metadata: string;
  mainImage: string;
  content?: string;
  category: string;
  blogType: string;
  author: {
    name: string;
    role?: string;
    bio?: string;
    avatar?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  publishDate: string;
  readTime: string;
  tags: string[];
}

interface SingleBlogContentProps {
  blog: Blog;
}

export default function SingleBlogContent({ blog }: SingleBlogContentProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Get blog ID (support both _id and id)
  const blogId = blog._id || blog.id || '';

  // Construct full image URLs
  const mainImageUrl = blog.mainImage?.startsWith('http') 
    ? blog.mainImage 
    : `${process.env.NEXT_PUBLIC_API_URL}${blog.mainImage}`;
  
  const avatarUrl = blog.author?.avatar 
    ? (blog.author.avatar.startsWith('http') 
        ? blog.author.avatar 
        : `${process.env.NEXT_PUBLIC_API_URL}${blog.author.avatar}`)
    : undefined;

  // Format publish date
  const formattedDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section with Image */}
      <Box position="relative" overflow="hidden" mb={{ base: "6", md: "8", lg: "12" }}>
        <Box 
          position="relative" 
          height={{ base: "300px", sm: "450px", md: "500px", lg: "500px" }}
          width="100%"
        >
          <Image
            src={mainImageUrl}
            alt={blog.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
          />
          <Container 
            maxW="container.xl" 
            position="absolute" 
            bottom="0" 
            left="0" 
            right="0"
            pb={{ base: "6", md: "8" }}
            px={{ base: "4", sm: "6", md: "8" }}
          >
            <FallInPlace>
              <VStack align="start" spacing={{ base: "3", md: "4" }} color="white">
                <Wrap spacing={{ base: "2", md: "3" }}>
                  <Badge
                    colorScheme="green"
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: "3", md: "4" }}
                    py={{ base: "1", md: "2" }}
                    borderRadius="full"
                  >
                    {blog.category}
                  </Badge>
                  <Badge
                    colorScheme="gray"
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: "3", md: "4" }}
                    py={{ base: "1", md: "2" }}
                    borderRadius="full"
                  >
                    {blog.blogType.replace(/_/g, ' ')}
                  </Badge>
                </Wrap>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  lineHeight="1.2"
                  textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                >
                  {blog.title}
                </Heading>
              </VStack>
            </FallInPlace>
          </Container>
        </Box>
      </Box>

      <Container maxW="container.xl" pb={{ base: "20", md: "24" }}>
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: "8", lg: "10" }}>
          {/* Sidebar */}
          <Box gridColumn={{ base: "span 1", lg: "span 4" }} order={{ base: 2, lg: 1 }}>
            <VStack spacing="6" align="stretch" position="sticky" top="100px">
              {/* Categories */}
              <CategoriesSidebar />

              <Divider />

              {/* Blog Types */}
              <BlogTypesSidebar />

              <Divider />I

              {/* Related Posts */}
              <RelatedPost currentBlogId={blog._id} />
            </VStack>
          </Box>

          {/* Main Content */}
          <Box gridColumn={{ base: "span 1", lg: "span 8" }} order={{ base: 1, lg: 2 }}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
            >
              <CardBody p={{ base: "6", md: "12" }}>
                <VStack align="stretch" spacing={{ base: "8", md: "10" }}>
                  {/* Author & Meta Information - Redesigned */}
                  <FallInPlace delay={0.1}>
                    <VStack 
                      spacing={{ base: "3", lg: "0" }} 
                      align="stretch"
                    >
                      {/* Base Device: Stacked Layout */}
                      <Box display={{ base: "block", lg: "none" }}>
                        <VStack spacing="3" align="stretch">
                          <HStack spacing="2.5">
                            {blog.author.avatar && (
                              <Avatar
                                size="md"
                                name={blog.author.name}
                                src={avatarUrl}
                                borderWidth="2px"
                                borderColor={accentColor}
                              />
                            )}
                            <VStack align="start" spacing="0.5" flex="1">
                              <Text fontSize="sm" fontWeight="bold">
                                {blog.author.name}
                              </Text>
                              {blog.author.role && (
                                <Text fontSize="xs" color={mutedColor}>
                                  {blog.author.role}
                                </Text>
                              )}
                              <HStack spacing="2" fontSize="2xs" color={mutedColor} pt="0.5">
                                <HStack spacing="1">
                                  <Icon as={FiCalendar} boxSize="2.5" />
                                  <Text>{formattedDate}</Text>
                                </HStack>
                                <Text>•</Text>
                                <HStack spacing="1">
                                  <Icon as={FiClock} boxSize="2.5" />
                                  <Text>{blog.readTime}</Text>
                                </HStack>
                              </HStack>
                            </VStack>
                          </HStack>
                          
                          {/* Social Links for Base */}
                          {(blog.author.twitter || blog.author.linkedin || blog.author.github) && (
                            <HStack 
                              spacing="2" 
                              justify="space-between"
                              align="center"
                              py="2"
                              px="3"
                              borderRadius="md"
                              bg={useColorModeValue("gray.50", "gray.700")}
                            >
                              <Text fontSize="2xs" fontWeight="semibold" color={mutedColor} textTransform="uppercase" letterSpacing="wide">
                                Follow on
                              </Text>
                              <HStack spacing="2">
                                {blog.author.twitter && (
                                  <Link
                                    href={`https://twitter.com/${blog.author.twitter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <HStack spacing="1" align="center">
                                      <Box
                                        p="1.5"
                                        borderRadius="md"
                                        bg={cardBg}
                                        _hover={{ bg: accentColor, transform: "translateY(-2px)" }}
                                        transition="all 0.3s"
                                      >
                                        <Icon
                                          as={FiTwitter}
                                          boxSize="3.5"
                                          color={mutedColor}
                                          _hover={{ color: "white" }}
                                        />
                                      </Box>
                                      <Text fontSize="2xs" color={mutedColor} display={{ base: "none", sm: "block" }}>
                                        Twitter
                                      </Text>
                                    </HStack>
                                  </Link>
                                )}
                                {blog.author.linkedin && (
                                  <Link
                                    href={`https://linkedin.com/in/${blog.author.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <HStack spacing="1" align="center">
                                      <Box
                                        p="1.5"
                                        borderRadius="md"
                                        bg={cardBg}
                                        _hover={{ bg: accentColor, transform: "translateY(-2px)" }}
                                        transition="all 0.3s"
                                      >
                                        <Icon
                                          as={FiLinkedin}
                                          boxSize="3.5"
                                          color={mutedColor}
                                          _hover={{ color: "white" }}
                                        />
                                      </Box>
                                      <Text fontSize="2xs" color={mutedColor} display={{ base: "none", sm: "block" }}>
                                        LinkedIn
                                      </Text>
                                    </HStack>
                                  </Link>
                                )}
                                {blog.author.github && (
                                  <Link
                                    href={`https://github.com/${blog.author.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <HStack spacing="1" align="center">
                                      <Box
                                        p="1.5"
                                        borderRadius="md"
                                        bg={cardBg}
                                        _hover={{ bg: accentColor, transform: "translateY(-2px)" }}
                                        transition="all 0.3s"
                                      >
                                        <Icon
                                          as={FiGithub}
                                          boxSize="3.5"
                                          color={mutedColor}
                                          _hover={{ color: "white" }}
                                        />
                                      </Box>
                                      <Text fontSize="2xs" color={mutedColor} display={{ base: "none", sm: "block" }}>
                                        GitHub
                                      </Text>
                                    </HStack>
                                  </Link>
                                )}
                              </HStack>
                            </HStack>
                          )}
                        </VStack>
                      </Box>

                      {/* Large Device: Horizontal Layout */}
                      <Box display={{ base: "none", lg: "flex" }}>
                        <HStack spacing="6" justify="space-between" w="full" align="center">
                          <HStack spacing="4" flex="1">
                            {avatarUrl && (
                              <Avatar
                                size="xl"
                                name={blog.author.name}
                                src={avatarUrl}
                                borderWidth="3px"
                                borderColor={accentColor}
                              />
                            )}
                            <VStack align="start" spacing="1">
                              <Text fontSize="lg" fontWeight="bold">
                                {blog.author.name}
                              </Text>
                              {blog.author.role && (
                                <Text fontSize="md" color={mutedColor}>
                                  {blog.author.role}
                                </Text>
                              )}
                              <HStack spacing="4" fontSize="sm" color={mutedColor} pt="1">
                                <HStack spacing="2">
                                  <Icon as={FiCalendar} boxSize="4" />
                                  <Text>{formattedDate}</Text>
                                </HStack>
                                <Text>•</Text>
                                <HStack spacing="2">
                                  <Icon as={FiClock} boxSize="4" />
                                  <Text>{blog.readTime}</Text>
                                </HStack>
                              </HStack>
                            </VStack>
                          </HStack>

                          {/* Social Links for Large Device */}
                          {(blog.author.twitter || blog.author.linkedin || blog.author.github) && (
                            <HStack spacing="3">
                              {blog.author.twitter && (
                                <Link
                                  href={`https://twitter.com/${blog.author.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Box
                                    p="3"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    _hover={{ 
                                      borderColor: accentColor, 
                                      bg: accentColor,
                                      transform: "translateY(-3px)",
                                      boxShadow: "lg"
                                    }}
                                    transition="all 0.3s"
                                  >
                                    <Icon
                                      as={FiTwitter}
                                      boxSize="5"
                                      color={mutedColor}
                                      _hover={{ color: "white" }}
                                    />
                                  </Box>
                                </Link>
                              )}
                              {blog.author.linkedin && (
                                <Link
                                  href={`https://linkedin.com/in/${blog.author.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Box
                                    p="3"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    _hover={{ 
                                      borderColor: accentColor, 
                                      bg: accentColor,
                                      transform: "translateY(-3px)",
                                      boxShadow: "lg"
                                    }}
                                    transition="all 0.3s"
                                  >
                                    <Icon
                                      as={FiLinkedin}
                                      boxSize="5"
                                      color={mutedColor}
                                      _hover={{ color: "white" }}
                                    />
                                  </Box>
                                </Link>
                              )}
                              {blog.author.github && (
                                <Link
                                  href={`https://github.com/${blog.author.github}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Box
                                    p="3"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    _hover={{ 
                                      borderColor: accentColor, 
                                      bg: accentColor,
                                      transform: "translateY(-3px)",
                                      boxShadow: "lg"
                                    }}
                                    transition="all 0.3s"
                                  >
                                    <Icon
                                      as={FiGithub}
                                      boxSize="5"
                                      color={mutedColor}
                                      _hover={{ color: "white" }}
                                    />
                                  </Box>
                                </Link>
                              )}
                            </HStack>
                          )}
                        </HStack>
                      </Box>
                    </VStack>
                  </FallInPlace>

                  <Divider opacity={0.3} />

                  {/* Article Content - Real Data */}
                  <FallInPlace delay={0.2}>
                    <VStack align="stretch" spacing="6">
                      {/* Metadata/Description */}
                      {blog.metadata && (
                        <Text 
                          fontSize="lg" 
                          lineHeight="1.8" 
                          color={mutedColor}
                          fontWeight="medium"
                        >
                          {blog.metadata}
                        </Text>
                      )}

                      {/* Main Content */}
                      {blog.content ? (
                        <Box
                          className="blog-content"
                          fontSize="md"
                          lineHeight="1.8"
                          sx={{
                            '& h1': { fontSize: '2xl', fontWeight: 'bold', mt: 6, mb: 4 },
                            '& h2': { fontSize: 'xl', fontWeight: 'bold', mt: 6, mb: 3 },
                            '& h3': { fontSize: 'lg', fontWeight: 'semibold', mt: 5, mb: 3 },
                            '& p': { mb: 4 },
                            '& ul, & ol': { pl: 6, mb: 4 },
                            '& li': { mb: 2 },
                            '& blockquote': {
                              borderLeft: '4px solid',
                              borderColor: accentColor,
                              pl: 6,
                              py: 4,
                              fontStyle: 'italic',
                              color: mutedColor,
                              bg: useColorModeValue('gray.50', 'gray.900'),
                              borderRadius: 'md',
                              my: 6
                            },
                            '& strong': { fontWeight: 'bold' },
                            '& em': { fontStyle: 'italic' },
                            '& u': { textDecoration: 'underline' },
                            '& a': { color: accentColor, textDecoration: 'underline' },
                            '& code': {
                              bg: useColorModeValue('gray.100', 'gray.700'),
                              px: 2,
                              py: 1,
                              borderRadius: 'sm',
                              fontSize: 'sm'
                            },
                            '& pre': {
                              bg: useColorModeValue('gray.100', 'gray.700'),
                              p: 4,
                              borderRadius: 'md',
                              overflowX: 'auto',
                              my: 4
                            }
                          }}
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                      ) : (
                        <Text fontSize="md" lineHeight="1.8" color={mutedColor}>
                          No content available for this article.
                        </Text>
                      )}
                    </VStack>
                  </FallInPlace>

                  <Divider opacity={0.3} />

                  {/* Tags - Simplified */}
                  <FallInPlace delay={0.3}>
                    <VStack align="start" spacing="3">
                      <Text fontSize="xs" fontWeight="semibold" color={mutedColor} textTransform="uppercase" letterSpacing="wide">
                        Tags
                      </Text>
                      <Wrap spacing="2">
                        {blog.tags.map((tag, index) => (
                          <Tag
                            key={index}
                            size="md"
                            colorScheme="green"
                            variant="subtle"
                            borderRadius="md"
                            fontWeight="medium"
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Wrap>
                    </VStack>
                  </FallInPlace>

                  <Divider opacity={0.3} />

                  {/* Share and Like Section - Cleaner */}
                  <FallInPlace delay={0.4}>
                    <HStack 
                      spacing="6" 
                      align="center"
                      justify="space-between"
                      flexWrap="wrap"
                    >
                      <LikeButton initialLikes={42} articleId={blog.slug} />
                      
                      <HStack spacing="3">
                        <Text fontSize="xs" fontWeight="medium" color={mutedColor}>
                          SHARE
                        </Text>
                        <SharePost title={blog.title} />
                      </HStack>
                    </HStack>
                  </FallInPlace>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Recommended Posts Section - Full Width */}
      <Container maxW="container.xl" py="12">
        <FallInPlace delay={0.6}>
          <RecommendedPosts currentBlogId={blogId} />
        </FallInPlace>
      </Container>

      {/* Newsletter Section - Full Width */}
      <FallInPlace delay={0.7}>
        <NewsletterSection />
      </FallInPlace>
    </Box>
  );
}
