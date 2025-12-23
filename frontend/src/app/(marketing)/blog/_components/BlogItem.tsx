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
  Divider,
  Icon,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { FiStar, FiCalendar, FiClock } from "react-icons/fi";

const BlogItem = ({ blog }: { blog: Blog }) => {
  const { 
    mainImage, 
    title, 
    metadata, 
    slug, 
    category, 
    blogType, 
    author, 
    readTime, 
    tags,
    publishDate,
    featured 
  } = blog;
  
  // Construct full image URL if path is relative
  const imageUrl = mainImage.startsWith('http') 
    ? mainImage 
    : `${process.env.NEXT_PUBLIC_API_URL}${mainImage}`;
  
  const avatarUrl = author.avatar 
    ? (author.avatar.startsWith('http') 
        ? author.avatar 
        : `${process.env.NEXT_PUBLIC_API_URL}${author.avatar}`)
    : undefined;
  
  // Format publish date
  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");
  const featuredBg = useColorModeValue("yellow.50", "yellow.900");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const overlayGradient = useColorModeValue(
    "linear(to-b, transparent, rgba(0,0,0,0.4))",
    "linear(to-b, transparent, rgba(0,0,0,0.7))"
  );

  return (
    <Link href={`/blog/${slug}`}>
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={featured ? accentColor : borderColor}
        borderRadius="xl"
        overflow="hidden"
        transition="all 0.3s ease"
        cursor="pointer"
        height="100%"
        position="relative"
        _hover={{
          transform: "translateY(-8px)",
          borderColor: accentColor,
          shadow: "2xl",
        }}
      >
        {/* Featured Badge */}
        {featured && (
          <Badge
            position="absolute"
            top="4"
            left="4"
            colorScheme="yellow"
            fontSize="xs"
            px="3"
            py="1.5"
            borderRadius="full"
            zIndex="2"
            display="flex"
            alignItems="center"
            gap="1"
            fontWeight="bold"
            bg="yellow.400"
            color="gray.900"
            boxShadow="lg"
          >
            <Icon as={FiStar} />
            Featured
          </Badge>
        )}

        <Flex direction={{ base: "column", md: "row" }} height="100%">
          {/* Image with Overlay - Left Side */}
          <Box 
            position="relative" 
            width={{ base: "100%", md: "320px" }} 
            height={{ base: "220px", md: "100%" }}
            minHeight={{ md: "300px" }}
            overflow="hidden"
            flexShrink="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              style={{ objectFit: "cover" }}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient={overlayGradient}
            />
          </Box>

          {/* Content - Right Side */}
          <CardBody p="6" flex="1">
            <VStack align="stretch" spacing="4" height="100%">
              {/* Category, Blog Type & Date */}
              <Flex justify="space-between" align="center" wrap="wrap" gap="2">
                <HStack spacing="2">
                  <Badge
                    colorScheme="green"
                    fontSize="xs"
                    px="3"
                    py="1"
                    borderRadius="full"
                    textTransform="uppercase"
                    fontWeight="bold"
                  >
                    {category}
                  </Badge>
                  <Badge
                    colorScheme="purple"
                    fontSize="xs"
                    px="3"
                    py="1"
                    borderRadius="full"
                    variant="subtle"
                  >
                    {blogType.replace(/_/g, ' ')}
                  </Badge>
                </HStack>
                
                {/* Publish Date */}
                <HStack spacing="1" fontSize="xs" color={mutedColor}>
                  <Icon as={FiCalendar} />
                  <Text>{formattedDate}</Text>
                </HStack>
              </Flex>

              {/* Title */}
              <Heading
                size="lg"
                fontWeight="bold"
                noOfLines={2}
                transition="color 0.2s"
                _hover={{ color: accentColor }}
                lineHeight="1.3"
              >
                {title}
              </Heading>

              {/* Description */}
              <Text 
                fontSize="md" 
                color={mutedColor} 
                noOfLines={3} 
                lineHeight="1.6"
                flex="1"
              >
                {metadata}
              </Text>

              {/* Read More Link */}
              <Flex justify="space-between" align="center" pt="2">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={accentColor}
                  _hover={{ textDecoration: "underline" }}
                >
                  Read full article →
                </Text>
              </Flex>

              <Divider borderColor={dividerColor} />

              {/* Author Info */}
              <HStack spacing="3" align="start">
                <Avatar
                  size="sm"
                  name={author.name}
                  src={avatarUrl}
                />
                <VStack align="start" spacing="0" flex="1">
                  <Text fontWeight="bold" fontSize="sm">
                    {author.name}
                  </Text>
                  {author.role || author.bio ? (
                    <Text fontSize="xs" color={mutedColor}>
                      {author.role} | {author.bio}
                    </Text>
                  ) : null}
                </VStack>
                
                {/* Read Time */}
                {readTime && (
                  <Flex
                    align="center"
                    gap="1"
                    px="3"
                    py="1.5"
                    bg={useColorModeValue("gray.100", "gray.700")}
                    borderRadius="full"
                    fontSize="xs"
                    color={mutedColor}
                    flexShrink="0"
                  >
                    <Icon as={FiClock} />
                    <Text fontWeight="medium">{readTime}</Text>
                  </Flex>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Flex>
      </Card>
    </Link>
  );
};

export default BlogItem;
