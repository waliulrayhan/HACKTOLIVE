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
  useColorMode,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { normalizeMarkdownForRender } from "@/lib/markdown-utils";
import { FiCalendar, FiClock, FiUser, FiLinkedin, FiFacebook, FiInstagram } from "react-icons/fi";
import { RiTwitterXLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import SharePost from "./SharePost";
import RelatedPost from "./RelatedPost";
import CategoriesSidebar from "./CategoriesSidebar";
import BlogTypesSidebar from "./BlogTypesSidebar";
import LikeButton from "./LikeButton";
import NewsletterSection from "./NewsletterSection";
import RecommendedPosts from "./RecommendedPosts";
import CommentSection from "./CommentSection";

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
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  publishDate: string;
  readTime: string;
  tags: string[];
}

interface SingleBlogContentProps {
  blog: Blog;
}

export default function SingleBlogContent({ blog }: SingleBlogContentProps) {
  const { colorMode } = useColorMode();
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
  const staticHeroImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000";

  // Format publish date
  const formattedDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section with Static Background */}
      <Box
        position="relative"
        overflow="hidden"
        mt={{ base: "14", md: "16" }}
        mb={{ base: "6", md: "8", lg: "10" }}
        minH={{ base: "220px", md: "280px", lg: "320px" }}
        bgImage={`url(${staticHeroImage})`}
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={useColorModeValue(
            "linear-gradient(135deg, rgba(26, 32, 44, 0.75) 0%, rgba(45, 55, 72, 0.85) 100%)",
            "linear-gradient(135deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.88) 100%)"
          )}
        />
        <Container
          maxW="container.xl"
          position="relative"
          minH={{ base: "220px", md: "280px", lg: "320px" }}
          display="flex"
          alignItems="flex-end"
          pb={{ base: "5", md: "7" }}
          px={{ base: "4", sm: "6", md: "8" }}
        >
          <FallInPlace>
            <VStack align="start" spacing={{ base: "3", md: "4" }} color="white" maxW="container.md">
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
                fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
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

      <Container maxW="container.xl" pb={{ base: "20", md: "24" }}>
        <Box mb={{ base: "5", md: "6" }}>
          <ButtonLink href="/blog" variant="link" colorScheme="primary">
            ← Back to Blog
          </ButtonLink>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: "8", lg: "10" }}>
          {/* Sidebar */}
          <Box gridColumn={{ base: "span 1", lg: "span 3" }} order={{ base: 2, lg: 1 }}>
            <VStack spacing="6" align="stretch" position="sticky" top="100px">
              {/* Categories */}
              <CategoriesSidebar />

              <Divider />

              {/* Blog Types */}
              <BlogTypesSidebar />

              <Divider />

              {/* Related Posts */}
              <RelatedPost currentBlogId={blogId} />
            </VStack>
          </Box>

          {/* Main Content */}
          <Box gridColumn={{ base: "span 1", lg: "span 9" }} order={{ base: 1, lg: 2 }}>
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
                              {(blog.author.role || blog.author.bio) && (
                                <Text fontSize="xs" color={mutedColor}>
                                  {[blog.author.role, blog.author.bio].filter(Boolean).join(' | ')}
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
                          {(blog.author.facebook || blog.author.twitter || blog.author.linkedin || blog.author.instagram) && (
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
                                {blog.author.facebook && (
                                  <Link
                                    href={`https://facebook.com/${blog.author.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <HStack spacing="1" align="center">
                                      <Box
                                        p="1.5"
                                        borderRadius="md"
                                        bg={cardBg}
                                        _hover={{ bg: "#1877F2", transform: "translateY(-2px)" }}
                                        transition="all 0.3s"
                                      >
                                        <Icon
                                          as={FiFacebook}
                                          boxSize="3.5"
                                          color={mutedColor}
                                          _hover={{ color: "white" }}
                                        />
                                      </Box>
                                      <Text fontSize="2xs" color={mutedColor} display={{ base: "none", sm: "block" }}>
                                        Facebook
                                      </Text>
                                    </HStack>
                                  </Link>
                                )}
                                {blog.author.twitter && (
                                  <Link
                                    href={`https://x.com/${blog.author.twitter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <HStack spacing="1" align="center">
                                      <Box
                                        p="1.5"
                                        borderRadius="md"
                                        bg={cardBg}
                                        _hover={{ bg: "#000000", transform: "translateY(-2px)" }}
                                        transition="all 0.3s"
                                      >
                                        <Icon
                                          as={RiTwitterXLine}
                                          boxSize="3.5"
                                          color={mutedColor}
                                          _hover={{ color: "white" }}
                                        />
                                      </Box>
                                      <Text fontSize="2xs" color={mutedColor} display={{ base: "none", sm: "block" }}>
                                        X
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
                                        _hover={{ bg: "#0A66C2", transform: "translateY(-2px)" }}
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
                                {blog.author.instagram && (
                                  <Link
                                    href={`https://instagram.com/${blog.author.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <HStack spacing="1" align="center">
                                      <Box
                                        p="1.5"
                                        borderRadius="md"
                                        bg={cardBg}
                                        _hover={{ bg: "#E4405F", transform: "translateY(-2px)" }}
                                        transition="all 0.3s"
                                      >
                                        <Icon
                                          as={FiInstagram}
                                          boxSize="3.5"
                                          color={mutedColor}
                                          _hover={{ color: "white" }}
                                        />
                                      </Box>
                                      <Text fontSize="2xs" color={mutedColor} display={{ base: "none", sm: "block" }}>
                                        Instagram
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
                              {(blog.author.role || blog.author.bio) && (
                                <Text fontSize="md" color={mutedColor}>
                                  {[blog.author.role, blog.author.bio].filter(Boolean).join(' | ')}
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
                          {(blog.author.facebook || blog.author.twitter || blog.author.linkedin || blog.author.instagram) && (
                            <HStack spacing="3">
                              {blog.author.facebook && (
                                <Link
                                  href={`https://facebook.com/${blog.author.facebook}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Box
                                    p="3"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    _hover={{ 
                                      borderColor: "#1877F2", 
                                      bg: "#1877F2",
                                      transform: "translateY(-3px)",
                                      boxShadow: "lg"
                                    }}
                                    transition="all 0.3s"
                                  >
                                    <Icon
                                      as={FiFacebook}
                                      boxSize="5"
                                      color={mutedColor}
                                      _hover={{ color: "white" }}
                                    />
                                  </Box>
                                </Link>
                              )}
                              {blog.author.twitter && (
                                <Link
                                  href={`https://x.com/${blog.author.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Box
                                    p="3"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    _hover={{ 
                                      borderColor: "#000000", 
                                      bg: "#000000",
                                      transform: "translateY(-3px)",
                                      boxShadow: "lg"
                                    }}
                                    transition="all 0.3s"
                                  >
                                    <Icon
                                      as={RiTwitterXLine}
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
                                      borderColor: "#0A66C2", 
                                      bg: "#0A66C2",
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
                              {blog.author.instagram && (
                                <Link
                                  href={`https://instagram.com/${blog.author.instagram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Box
                                    p="3"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    _hover={{ 
                                      borderColor: "#E4405F", 
                                      bg: "#E4405F",
                                      transform: "translateY(-3px)",
                                      boxShadow: "lg"
                                    }}
                                    transition="all 0.3s"
                                  >
                                    <Icon
                                      as={FiInstagram}
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

                      {/* Featured Image (4:3) */}
                      {blog.mainImage && (
                        <Box
                          position="relative"
                          width="100%"
                          aspectRatio={4 / 3}
                          borderRadius="xl"
                          overflow="hidden"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Image
                            src={mainImageUrl}
                            alt={blog.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 900px"
                          />
                        </Box>
                      )}

                      {/* Main Content */}
                      {blog.content ? (
                        <Box className="blog-markdown-preview" data-color-mode={colorMode}>
                          <MarkdownPreview
                            source={normalizeMarkdownForRender(blog.content)}
                            wrapperElement={{ "data-color-mode": colorMode }}
                            className="blog-markdown-preview"
                          />
                        </Box>
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
                      <LikeButton blogId={blogId} />
                      
                      <HStack spacing="3">
                        <Text fontSize="xs" fontWeight="medium" color={mutedColor}>
                          SHARE
                        </Text>
                        <SharePost title={blog.title} />
                      </HStack>
                    </HStack>
                  </FallInPlace>

                  <Divider opacity={0.3} />

                  {/* Comments Section - Inside Card */}
                  <FallInPlace delay={0.5}>
                    <CommentSection blogId={blogId} />
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

      <style jsx global>{`
        .blog-markdown-preview,
        .blog-markdown-preview.wmde-markdown {
          background: transparent !important;
          color: #334155 !important;
          box-shadow: none !important;
          --color-canvas-default: transparent;
          --color-fg-default: #334155;
          --color-canvas-subtle: rgba(148, 163, 184, 0.08);
          --color-border-default: rgba(148, 163, 184, 0.25);
        }

        .blog-markdown-preview[data-color-mode="dark"],
        .blog-markdown-preview[data-color-mode="dark"].wmde-markdown {
          color: #e5e7eb !important;
          --color-fg-default: #e5e7eb;
          --color-canvas-subtle: rgba(148, 163, 184, 0.12);
          --color-border-default: rgba(148, 163, 184, 0.32);
        }
      `}</style>
    </Box>
  );
}
