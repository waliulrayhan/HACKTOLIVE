"use client";
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
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import BlogData from "./blogData";

interface RecommendedPostsProps {
  currentBlogId?: string | number;
}

const RecommendedPosts = ({ currentBlogId }: RecommendedPostsProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Get 3 recommended posts (featured or random, excluding current)
  const recommendedPosts = BlogData
    .filter(post => post._id !== currentBlogId)
    .filter(post => post.featured)
    .slice(0, 3);

  // If not enough featured posts, fill with other posts
  const finalPosts = recommendedPosts.length >= 3 
    ? recommendedPosts 
    : [
        ...recommendedPosts,
        ...BlogData
          .filter(post => post._id !== currentBlogId && !post.featured)
          .slice(0, 3 - recommendedPosts.length)
      ];

  return (
    <Box w="full">
      <Heading size="lg" mb="6">
        Recommended for You
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" w="full">
        {finalPosts.map((post, index) => (
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
                <Image
                  src={post.mainImage}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
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
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecommendedPosts;
