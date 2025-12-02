"use client";

import { Box, HStack, VStack, Text, Image, Icon } from "@chakra-ui/react";
import { Review } from "@/types/academy";
import { FaStar } from "react-icons/fa";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        as={FaStar}
        color={index < rating ? "yellow.400" : "gray.300"}
        boxSize="16px"
      />
    ));
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p="5"
      bg="white"
      _dark={{ bg: "gray.800" }}
      h="full"
    >
      <VStack align="stretch" spacing="3">
        {/* Student Info & Rating */}
        <HStack justify="space-between" align="start">
          <HStack spacing="3">
            <Image
              src={review.studentAvatar}
              alt={review.studentName}
              boxSize="48px"
              borderRadius="full"
              objectFit="cover"
            />
            <VStack align="start" spacing="0">
              <Text fontWeight="bold">{review.studentName}</Text>
              <Text fontSize="xs" color="gray.500">
                {formatDate(review.createdAt)}
              </Text>
            </VStack>
          </HStack>
          <HStack spacing="1">{renderStars(review.rating)}</HStack>
        </HStack>

        {/* Comment */}
        <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
          {review.comment}
        </Text>
      </VStack>
    </Box>
  );
}
