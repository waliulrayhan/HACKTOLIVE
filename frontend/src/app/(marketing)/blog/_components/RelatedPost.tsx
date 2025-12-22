"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogApi } from "@/lib/api/blog";
import {
  Box,
  Text,
  HStack,
  VStack,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";

interface RelatedPostProps {
  currentBlogId?: string | number;
}

interface RelatedBlog {
  id: string;
  slug: string;
  title: string;
  mainImage?: string;
  author: {
    name: string;
  };
  readTime?: string;
}

const RelatedPost = ({ currentBlogId }: RelatedPostProps) => {
  const [relatedPosts, setRelatedPosts] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!currentBlogId) return;
      
      try {
        setLoading(true);
        const posts = await blogApi.getRelatedBlogs(currentBlogId.toString(), 3);
        setRelatedPosts(posts);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentBlogId]);

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="sm" color="green.500" />
      </Box>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text 
        fontSize="xs" 
        fontWeight="bold" 
        textTransform="uppercase" 
        letterSpacing="wider"
        mb="3"
        color={mutedColor}
      >
        Related Posts
      </Text>

      <VStack spacing="4" align="stretch">
        {relatedPosts.map((post, key) => (
          <Link key={key} href={`/blog/${post.slug}`}>
            <Box
              p="2"
              transition="all 0.2s"
              _hover={{ 
                bg: hoverBg,
              }}
            >
              <HStack spacing="3" align="start">
                <Box
                  position="relative"
                  width="100px"
                  height="60px"
                  flexShrink={0}
                  borderRadius="md"
                  overflow="hidden"
                >
                  {post.mainImage ? (
                    <Image 
                      fill 
                      src={post.mainImage} 
                      alt={post.title}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box bg="gray.200" width="100%" height="100%" />
                  )}
                </Box>
                <VStack align="start" spacing="1" flex="1">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    noOfLines={2}
                    lineHeight="1.3"
                    transition="color 0.2s"
                    _hover={{ color: accentColor }}
                  >
                    {post.title}
                  </Text>
                  <Text color={mutedColor} fontSize="xs">
                    {post.author.name} · {post.readTime}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default RelatedPost;
