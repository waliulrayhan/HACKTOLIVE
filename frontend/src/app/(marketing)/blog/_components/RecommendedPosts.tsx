"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Badge,
  VStack,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { blogApi } from "@/lib/api/blog";

interface RecommendedPostsProps {
  currentBlogId?: string | number;
}

interface RecommendedBlog {
  id: string;
  slug: string;
  title: string;
  mainImage?: string;
  metadata: string;
  category: string;
  author: {
    name: string;
  };
  readTime?: string;
}

const RecommendedPosts = ({ currentBlogId }: RecommendedPostsProps) => {
  const [recommendedPosts, setRecommendedPosts] = useState<RecommendedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        setLoading(true);
        // Fetch featured blogs
        const featured = await blogApi.getFeaturedBlogs(6);
        // Filter out current blog and take only 3
        const filtered = featured
          .filter(post => post.id !== currentBlogId)
          .slice(0, 3);
        setRecommendedPosts(filtered);
      } catch (error) {
        console.error("Error fetching recommended posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedPosts();
  }, [currentBlogId]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="green.500" />
      </Box>
    );
  }

  if (recommendedPosts.length === 0) {
    return null;
  }

  return (
    <Box w="full">
      <Heading size="lg" mb="6">
        Recommended for You
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" w="full">
        {recommendedPosts.map((post, index) => {
          const imageUrl = post.mainImage?.startsWith('http') 
            ? post.mainImage 
            : `${process.env.NEXT_PUBLIC_API_URL}${post.mainImage}`;
          
          return (
            <Link key={index} href={`/blog/${post.slug}`}>
              <Card
                bg={cardBg}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-4px)",
                  borderColor: accentColor,
                  shadow: "xl"
                }}
                h="full"
              >
                <Box position="relative" height="180px" width="100%">
                  {post.mainImage ? (
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box bg="gray.200" width="100%" height="100%" />
                  )}
                </Box>
                <CardBody p="5">
                  <VStack align="start" spacing="3">
                    <Badge colorScheme="green" fontSize="xs" borderRadius="full">
                      {post.category}
                    </Badge>
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      noOfLines={2}
                      lineHeight="1.4"
                      transition="color 0.2s"
                      _hover={{ color: accentColor }}
                    >
                      {post.title}
                    </Text>
                    <Text fontSize="sm" color={mutedColor} noOfLines={2} lineHeight="1.4">
                      {post.metadata}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      {post.author.name} · {post.readTime}
                    </Text>
                    <Text fontSize="sm" color={accentColor} fontWeight="medium">
                      Read more...
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default RecommendedPosts;
