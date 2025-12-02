"use client";

import { Box, Spinner, VStack, Text, Button, Icon, Heading } from "@chakra-ui/react";
import { FaExclamationTriangle, FaInbox } from "react-icons/fa";

// Loading State Component
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <VStack spacing="4" py="20" justify="center" align="center">
      <Spinner size="xl" color="blue.500" thickness="4px" />
      <Text color="gray.600" _dark={{ color: "gray.400" }}>
        {message}
      </Text>
    </VStack>
  );
}

// Empty State Component
export function EmptyState({
  title = "No items found",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  icon = FaInbox,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: any;
}) {
  return (
    <VStack spacing="4" py="20" justify="center" align="center">
      <Icon as={icon} boxSize="64px" color="gray.400" />
      <Heading size="md" color="gray.700" _dark={{ color: "gray.300" }}>
        {title}
      </Heading>
      <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center" maxW="md">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button colorScheme="blue" onClick={onAction} mt="4">
          {actionLabel}
        </Button>
      )}
    </VStack>
  );
}

// Error State Component
export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading the content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <VStack spacing="4" py="20" justify="center" align="center">
      <Icon as={FaExclamationTriangle} boxSize="64px" color="red.500" />
      <Heading size="md" color="red.600" _dark={{ color: "red.400" }}>
        {title}
      </Heading>
      <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center" maxW="md">
        {description}
      </Text>
      {onRetry && (
        <Button colorScheme="blue" onClick={onRetry} mt="4">
          Try Again
        </Button>
      )}
    </VStack>
  );
}

// Skeleton Loader for Course Card
export function CourseCardSkeleton() {
  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      _dark={{ bg: "gray.800" }}
      h="full"
    >
      <Box bg="gray.200" _dark={{ bg: "gray.700" }} h="200px" />
      <VStack align="stretch" p="5" spacing="3">
        <Box bg="gray.200" _dark={{ bg: "gray.700" }} h="20px" w="60%" borderRadius="md" />
        <Box bg="gray.200" _dark={{ bg: "gray.700" }} h="40px" borderRadius="md" />
        <Box bg="gray.200" _dark={{ bg: "gray.700" }} h="30px" borderRadius="md" />
        <Box bg="gray.200" _dark={{ bg: "gray.700" }} h="20px" w="80%" borderRadius="md" />
      </VStack>
    </Box>
  );
}
