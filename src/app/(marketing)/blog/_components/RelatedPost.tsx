"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogData from "./blogData";
import {
  Box,
  Text,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

interface RelatedPostProps {
  currentBlogId?: string | number;
}

const RelatedPost = ({ currentBlogId }: RelatedPostProps) => {
  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  
  // Filter out current blog and get 3 related posts
  const relatedPosts = BlogData
    .filter(post => post._id !== currentBlogId)
    .slice(0, 3);

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
                  width="60px"
                  height="45px"
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
                    {post.readTime}
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
