"use client";
import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  HStack,
  Avatar,
  Badge,
  Wrap,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

const BlogItem = ({ blog }: { blog: Blog }) => {
  const { mainImage, title, metadata, slug, category, blogType, author, readTime, tags } = blog;
  
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const hoverBg = useColorModeValue("green.50", "green.900");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Link href={`/blog/${slug}`}>
      <Card
        bg={cardBg}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        transition="all 0.3s ease"
        cursor="pointer"
        height="100%"
        _hover={{
          transform: "translateY(-8px)",
          borderColor: accentColor,
          shadow: "xl",
        }}
      >
        {/* Image */}
        <Box position="relative" width="100%" height="220px" overflow="hidden">
          <Image 
            src={mainImage} 
            alt={title} 
            fill 
            style={{ objectFit: "cover" }}
          />
        </Box>

        <CardBody p="6">
          <VStack align="stretch" spacing="4" height="100%">
            {/* Category and Type Badges */}
            <Wrap spacing="2">
              <Badge
                colorScheme="green"
                fontSize="xs"
                px="3"
                py="1"
                borderRadius="full"
              >
                {category}
              </Badge>
              <Badge
                colorScheme="gray"
                fontSize="xs"
                px="3"
                py="1"
                borderRadius="full"
              >
                {blogType}
              </Badge>
            </Wrap>

            {/* Title */}
            <Heading
              size="md"
              fontWeight="semibold"
              noOfLines={2}
              transition="color 0.2s"
              _groupHover={{ color: accentColor }}
            >
              {title}
            </Heading>

            {/* Description */}
            <Text fontSize="sm" color={mutedColor} noOfLines={3} flex="1">
              {metadata}
            </Text>

            {/* Meta Info */}
            <HStack spacing="3" fontSize="xs" color={mutedColor}>
              {author.avatar && (
                <Avatar
                  size="xs"
                  name={author.name}
                  src={author.avatar}
                />
              )}
              <Text fontWeight="medium">{author.name}</Text>
              <Text>•</Text>
              <Text>{readTime}</Text>
            </HStack>

            {/* Tags */}
            <Wrap spacing="2" fontSize="xs" color={mutedColor}>
              {tags.slice(0, 3).map((tag, index) => (
                <Text key={index}>
                  #{tag.toLowerCase().replace(/\s+/g, '')}
                </Text>
              ))}
            </Wrap>

            {/* Read More Link */}
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={accentColor}
              _hover={{ textDecoration: "underline" }}
            >
              Read full article →
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
};

export default BlogItem;
