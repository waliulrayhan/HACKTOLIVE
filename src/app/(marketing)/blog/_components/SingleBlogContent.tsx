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
  _id: string;
  slug: string;
  title: string;
  metadata: string;
  mainImage: string;
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

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section with Image */}
      <Box position="relative" overflow="hidden" mb={{ base: "8", md: "12" }}>
        <Box 
          position="relative" 
          height={{ base: "300px", md: "400px", lg: "500px" }}
          width="100%"
        >
          <Image
            src={blog.mainImage}
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
            pb="8"
          >
            <FallInPlace>
              <VStack align="start" spacing="4" color="white">
                <Wrap spacing="3">
                  <Badge
                    colorScheme="green"
                    fontSize="md"
                    px="4"
                    py="2"
                    borderRadius="full"
                  >
                    {blog.category}
                  </Badge>
                  <Badge
                    colorScheme="gray"
                    fontSize="md"
                    px="4"
                    py="2"
                    borderRadius="full"
                  >
                    {blog.blogType}
                  </Badge>
                </Wrap>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
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

              <Divider />

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
                  {/* Author & Meta Information - Minimalistic */}
                  <FallInPlace delay={0.1}>
                    <HStack spacing="4" justify="space-between" flexWrap="wrap">
                      <HStack spacing="3">
                        {blog.author.avatar && (
                          <Avatar
                            size="md"
                            name={blog.author.name}
                            src={blog.author.avatar}
                          />
                        )}
                        <VStack align="start" spacing="0">
                          <Text fontSize="sm" fontWeight="semibold">
                            {blog.author.name}
                          </Text>
                          {blog.author.role && (
                            <Text fontSize="xs" color={mutedColor}>
                              {blog.author.role}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                      
                      <HStack spacing="4" fontSize="xs" color={mutedColor} divider={<Text>•</Text>}>
                        <Text>{blog.publishDate}</Text>
                        <Text>{blog.readTime}</Text>
                      </HStack>
                    </HStack>

                    {/* Social Links - Minimalistic */}
                    {(blog.author.twitter || blog.author.linkedin || blog.author.github) && (
                      <HStack spacing="2" pt="3" pl={{ base: "0", md: "52px" }}>
                        {blog.author.twitter && (
                          <Link
                            href={`https://twitter.com/${blog.author.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon
                              as={FiTwitter}
                              boxSize="4"
                              color={mutedColor}
                              _hover={{ color: accentColor }}
                              transition="color 0.2s"
                            />
                          </Link>
                        )}
                        {blog.author.linkedin && (
                          <Link
                            href={`https://linkedin.com/in/${blog.author.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon
                              as={FiLinkedin}
                              boxSize="4"
                              color={mutedColor}
                              _hover={{ color: accentColor }}
                              transition="color 0.2s"
                            />
                          </Link>
                        )}
                        {blog.author.github && (
                          <Link
                            href={`https://github.com/${blog.author.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon
                              as={FiGithub}
                              boxSize="4"
                              color={mutedColor}
                              _hover={{ color: accentColor }}
                              transition="color 0.2s"
                            />
                          </Link>
                        )}
                      </HStack>
                    )}
                  </FallInPlace>

                  <Divider opacity={0.3} />

                  {/* Article Content - Cleaner Layout */}
                  <FallInPlace delay={0.2}>
                    <VStack align="stretch" spacing="8">
                      <Text fontSize="lg" lineHeight="1.8" color={mutedColor}>
                        {blog.metadata}
                      </Text>

                      <Text fontSize="md" lineHeight="1.8">
                        In today's rapidly evolving digital landscape, cybersecurity
                        has become more critical than ever. Organizations face an
                        unprecedented array of threats, from sophisticated ransomware
                        attacks to advanced persistent threats (APTs) that can remain
                        undetected for months or even years.
                      </Text>

                      <Text fontSize="md" lineHeight="1.8">
                        This comprehensive guide explores the latest developments in
                        the field, providing actionable insights and practical
                        strategies that security professionals can implement
                        immediately. We'll examine real-world case studies, discuss
                        emerging trends, and outline best practices that have been
                        proven effective across various industries.
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4" py="2">
                        <Box position="relative" height="220px" borderRadius="md" overflow="hidden">
                          <Image
                            src={blog.mainImage}
                            alt="Security illustration 1"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Box position="relative" height="220px" borderRadius="md" overflow="hidden">
                          <Image
                            src="/images/grid-image/image-06.png"
                            alt="Security illustration 2"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                      </SimpleGrid>

                      <Heading size="md" pt="4" fontWeight="semibold">
                        Key Takeaways
                      </Heading>

                      <Text fontSize="md" lineHeight="1.8">
                        Understanding the evolving threat landscape is crucial for
                        maintaining a robust security posture. Whether you're dealing
                        with zero-day vulnerabilities, implementing new security
                        frameworks, or training your team on security awareness, the
                        principles outlined in this article will help guide your
                        decision-making process.
                      </Text>

                      <Box
                        py="4"
                        px="6"
                        borderLeft="3px solid"
                        borderColor={accentColor}
                      >
                        <Text fontSize="md" lineHeight="1.8" fontStyle="italic" color={mutedColor}>
                          "By staying informed about the latest security trends,
                          leveraging modern security tools, and fostering a
                          security-conscious culture within your organization, you can
                          significantly reduce your risk exposure and better protect
                          your critical assets."
                        </Text>
                      </Box>

                      <Text fontSize="md" lineHeight="1.8">
                        The cybersecurity landscape continues to evolve, and staying ahead
                        requires constant vigilance, continuous learning, and adaptation.
                        Organizations that prioritize security and invest in robust
                        protective measures will be better positioned to face future
                        challenges and protect their valuable digital assets.
                      </Text>
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
          <RecommendedPosts currentBlogId={blog._id} />
        </FallInPlace>
      </Container>

      {/* Newsletter Section - Full Width */}
      <FallInPlace delay={0.7}>
        <NewsletterSection />
      </FallInPlace>
    </Box>
  );
}
