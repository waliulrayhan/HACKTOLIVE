"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogData from "./blogData";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

interface RelatedPostProps {
  currentBlogId?: string | number;
}

const RelatedPost = ({ currentBlogId }: RelatedPostProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  
  // Filter out current blog and get 3 related posts
  const relatedPosts = BlogData
    .filter(post => post._id !== currentBlogId)
    .slice(0, 3);

  return (
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
          Related Posts
        </Heading>

        <VStack spacing="6" align="stretch">
          {relatedPosts.map((post, key) => (
            <Link key={key} href={`/blog/${post.slug}`}>
              <HStack 
                spacing="4" 
                align="start"
                transition="all 0.2s"
                _hover={{ transform: "translateX(4px)" }}
              >
                <Box
                  position="relative"
                  width="80px"
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
                    transition="color 0.2s"
                    _hover={{ color: accentColor }}
                  >
                    {post.title}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    {post.publishDate}
                  </Text>
                </VStack>
              </HStack>
            </Link>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default RelatedPost;
