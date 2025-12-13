"use client";

import { Box, HStack, VStack, Text, Image, Badge, Icon } from "@chakra-ui/react";
import { Instructor } from "@/types/academy";
import { FiStar, FiUsers, FiBook } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link";

interface InstructorCardProps {
  instructor: Instructor;
  showFullBio?: boolean;
}

export default function InstructorCard({ instructor, showFullBio = false }: InstructorCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      p="6"
      transition="all 0.3s"
      _hover={{ shadow: "xl", borderColor: "primary.500", transform: "translateY(-4px)" }}
      h="full"
    >
      <VStack spacing="5" align="center" textAlign="center">
        {/* Avatar */}
        <Image
          src={instructor.avatar || undefined}
          alt={instructor.name}
          boxSize="120px"
          borderRadius="full"
          objectFit="cover"
          border="4px solid"
          borderColor="primary.500"
        />

        {/* Name */}
        <VStack spacing="2">
          <Text fontSize="xl" fontWeight="bold">
            {instructor.name}
          </Text>
          <Badge colorScheme="primary" fontSize="xs" borderRadius="full" px="3" py="1">
            {instructor.bio}
          </Badge>
        </VStack>

        {/* Bio */}
        {/* <Text
          fontSize="sm"
          color="muted"
          lineHeight="tall"
          noOfLines={showFullBio ? undefined : 3}
        >
          {instructor.bio}
        </Text> */}

        {/* Stats */}
        <HStack
          spacing="6"
          fontSize="sm"
          w="full"
          justify="center"
          py="4"
          borderTopWidth="1px"
          borderBottomWidth="1px"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.700" }}
        >
          <VStack spacing="1">
            <HStack spacing="1">
              <Icon as={FiStar} color="yellow.500" boxSize="18px" />
              <Text fontWeight="bold" fontSize="lg">{instructor.rating}</Text>
            </HStack>
            <Text fontSize="xs" color="muted">
              Rating
            </Text>
          </VStack>
          <VStack spacing="1">
            <HStack spacing="1">
              <Icon as={FiUsers} color="primary.500" boxSize="18px" />
              <Text fontWeight="bold" fontSize="lg">{instructor.totalStudents.toLocaleString()}</Text>
            </HStack>
            <Text fontSize="xs" color="muted">
              Students
            </Text>
          </VStack>
          <VStack spacing="1">
            <HStack spacing="1">
              <Icon as={FiBook} color="secondary.500" boxSize="18px" />
              <Text fontWeight="bold" fontSize="lg">{instructor.totalCourses}</Text>
            </HStack>
            <Text fontSize="xs" color="muted">
              Courses
            </Text>
          </VStack>
        </HStack>

        {/* Skills */}
        {!showFullBio && (
          <HStack spacing="2" flexWrap="wrap" justify="center">
            {instructor.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} colorScheme="primary" fontSize="xs" borderRadius="full" px="3" py="1">
                {skill}
              </Badge>
            ))}
          </HStack>
        )}

        {/* CTA Button */}
        {!showFullBio && (
          <ButtonLink
            href={`/academy/instructors/${instructor.id}`}
            colorScheme="primary"
            variant="outline"
            size="md"
            w="full"
          >
            View Profile
          </ButtonLink>
        )}
      </VStack>
    </Box>
  );
}
