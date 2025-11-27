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
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  useColorModeValue,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiSearch, FiCalendar, FiClock, FiUser, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import SharePost from "./SharePost";
import RelatedPost from "./RelatedPost";

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

  const categories = [
    { name: "Cybersecurity Insights", href: "/blog" },
    { name: "News", href: "/blog" },
    { name: "Tutorials", href: "/blog" },
  ];

  const contentTypes = [
    { name: "Threat Alerts", href: "/blog" },
    { name: "How-to Tutorials", href: "/blog" },
    { name: "Best Security Practices", href: "/blog" },
    { name: "Compliance Guides", href: "/blog" },
    { name: "Case Study Stories", href: "/blog" },
  ];

  return (
    <Box>
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
        </Box>
      </Box>

      <Container maxW="container.xl" pb={{ base: "20", md: "24" }}>
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: "8", lg: "12" }}>
          {/* Sidebar */}
          <Box gridColumn={{ base: "span 1", lg: "span 4" }} order={{ base: 2, lg: 1 }}>
            <VStack spacing={{ base: "6", md: "8" }} position="sticky" top="100px">
              {/* Search Box */}
              <FallInPlace>
                <Card
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  width="100%"
                >
                  <CardBody p="6">
                    <form action="/blog" method="GET">
                      <InputGroup>
                        <Input
                          name="search"
                          placeholder="Search articles..."
                          borderColor={borderColor}
                          _hover={{ borderColor: accentColor }}
                          _focus={{ borderColor: accentColor }}
                        />
                        <InputRightElement>
                          <Icon as={FiSearch} color="gray.400" />
                        </InputRightElement>
                      </InputGroup>
                    </form>
                  </CardBody>
                </Card>
              </FallInPlace>

              {/* Categories */}
              <FallInPlace delay={0.1}>
                <Card
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  width="100%"
                >
                  <CardBody p="6">
                    <Heading size="md" mb="6">
                      Categories
                    </Heading>
                    <VStack align="stretch" spacing="3">
                      {categories.map((category, index) => (
                        <Link key={index} href={category.href}>
                          <Text
                            fontSize="md"
                            transition="all 0.2s"
                            _hover={{ color: accentColor, pl: "2" }}
                          >
                            {category.name}
                          </Text>
                        </Link>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>

              {/* Content Types */}
              <FallInPlace delay={0.2}>
                <Card
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  width="100%"
                >
                  <CardBody p="6">
                    <Heading size="md" mb="6">
                      Content Types
                    </Heading>
                    <VStack align="stretch" spacing="3">
                      {contentTypes.map((type, index) => (
                        <Link key={index} href={type.href}>
                          <Text
                            fontSize="md"
                            transition="all 0.2s"
                            _hover={{ color: accentColor, pl: "2" }}
                          >
                            {type.name}
                          </Text>
                        </Link>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </FallInPlace>

              {/* Related Posts */}
              <Box width="100%">
                <RelatedPost currentBlogId={blog._id} />
              </Box>
            </VStack>
          </Box>

          {/* Main Content */}
          <Box gridColumn={{ base: "span 1", lg: "span 8" }} order={{ base: 1, lg: 2 }}>
            <Card
              bg={cardBg}
              borderWidth="2px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
            >
              <CardBody p={{ base: "6", md: "10" }}>
                <VStack align="stretch" spacing={{ base: "6", md: "8" }}>
                  {/* Category and Type Badges */}
                  <FallInPlace>
                    <Wrap spacing="3">
                      <Badge
                        colorScheme="green"
                        fontSize="sm"
                        px="4"
                        py="2"
                        borderRadius="full"
                      >
                        {blog.category}
                      </Badge>
                      <Badge
                        colorScheme="gray"
                        fontSize="sm"
                        px="4"
                        py="2"
                        borderRadius="full"
                      >
                        {blog.blogType}
                      </Badge>
                    </Wrap>
                  </FallInPlace>

                  {/* Title */}
                  <FallInPlace delay={0.1}>
                    <Heading
                      fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="bold"
                      lineHeight="1.2"
                    >
                      {blog.title}
                    </Heading>
                  </FallInPlace>

                  {/* Meta Information */}
                  <FallInPlace delay={0.2}>
                    <Wrap spacing={{ base: "4", md: "6" }} color={mutedColor}>
                      <HStack spacing="2">
                        <Icon as={FiUser} />
                        <Text fontSize="sm">{blog.author.name}</Text>
                      </HStack>
                      <HStack spacing="2">
                        <Icon as={FiCalendar} />
                        <Text fontSize="sm">{blog.publishDate}</Text>
                      </HStack>
                      <HStack spacing="2">
                        <Icon as={FiClock} />
                        <Text fontSize="sm">{blog.readTime}</Text>
                      </HStack>
                    </Wrap>
                  </FallInPlace>

                  <Divider />

                  {/* Author Profile */}
                  <FallInPlace delay={0.3}>
                    <Card
                      bg={bgColor}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                    >
                      <CardBody p="6">
                        <HStack spacing="4" align="start">
                          {blog.author.avatar && (
                            <Avatar
                              size="lg"
                              name={blog.author.name}
                              src={blog.author.avatar}
                            />
                          )}
                          <VStack align="start" spacing="2" flex="1">
                            <Heading size="sm">{blog.author.name}</Heading>
                            {blog.author.role && (
                              <Text fontSize="sm" color={mutedColor}>
                                {blog.author.role}
                              </Text>
                            )}
                            {blog.author.bio && (
                              <Text fontSize="sm" color={mutedColor}>
                                {blog.author.bio}
                              </Text>
                            )}
                            {/* Social Links */}
                            <HStack spacing="3" pt="2">
                              {blog.author.twitter && (
                                <Link
                                  href={`https://twitter.com/${blog.author.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Icon
                                    as={FiTwitter}
                                    boxSize="5"
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
                                    boxSize="5"
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
                                    boxSize="5"
                                    color={mutedColor}
                                    _hover={{ color: accentColor }}
                                    transition="color 0.2s"
                                  />
                                </Link>
                              )}
                            </HStack>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  </FallInPlace>

                  <Divider />

                  {/* Article Content */}
                  <FallInPlace delay={0.4}>
                    <VStack align="stretch" spacing="6">
                      <Text fontSize="lg" lineHeight="tall">
                        {blog.metadata}
                      </Text>

                      <Text fontSize="md" lineHeight="tall">
                        In today's rapidly evolving digital landscape, cybersecurity
                        has become more critical than ever. Organizations face an
                        unprecedented array of threats, from sophisticated ransomware
                        attacks to advanced persistent threats (APTs) that can remain
                        undetected for months or even years.
                      </Text>

                      <Text fontSize="md" lineHeight="tall">
                        This comprehensive guide explores the latest developments in
                        the field, providing actionable insights and practical
                        strategies that security professionals can implement
                        immediately. We'll examine real-world case studies, discuss
                        emerging trends, and outline best practices that have been
                        proven effective across various industries.
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6" py="4">
                        <Box position="relative" height="200px" borderRadius="lg" overflow="hidden">
                          <Image
                            src={blog.mainImage}
                            alt="Security illustration 1"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Box position="relative" height="200px" borderRadius="lg" overflow="hidden">
                          <Image
                            src="/images/grid-image/image-06.png"
                            alt="Security illustration 2"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                      </SimpleGrid>

                      <Heading size="lg" pt="4">
                        Key Takeaways
                      </Heading>

                      <Text fontSize="md" lineHeight="tall">
                        Understanding the evolving threat landscape is crucial for
                        maintaining a robust security posture. Whether you're dealing
                        with zero-day vulnerabilities, implementing new security
                        frameworks, or training your team on security awareness, the
                        principles outlined in this article will help guide your
                        decision-making process.
                      </Text>

                      <Text fontSize="md" lineHeight="tall">
                        By staying informed about the latest security trends,
                        leveraging modern security tools, and fostering a
                        security-conscious culture within your organization, you can
                        significantly reduce your risk exposure and better protect
                        your critical assets.
                      </Text>
                    </VStack>
                  </FallInPlace>

                  <Divider />

                  {/* Tags */}
                  <FallInPlace delay={0.5}>
                    <Box>
                      <Heading size="sm" mb="4">
                        Tags
                      </Heading>
                      <Wrap spacing="2">
                        {blog.tags.map((tag, index) => (
                          <Tag
                            key={index}
                            size="md"
                            colorScheme="gray"
                            borderRadius="full"
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Wrap>
                    </Box>
                  </FallInPlace>

                  <Divider />

                  {/* Share Post */}
                  <FallInPlace delay={0.6}>
                    <SharePost title={blog.title} />
                  </FallInPlace>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
