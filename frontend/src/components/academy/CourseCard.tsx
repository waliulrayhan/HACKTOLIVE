"use client";

import { Box, Badge, HStack, VStack, Text, Image, useColorModeValue, Flex, Icon } from "@chakra-ui/react";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { Course } from "@/types/academy";
import { FiStar, FiUsers, FiClock, FiBook, FiArrowRight, FiVideo } from "react-icons/fi";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact";
}

export default function CourseCard({ course, variant = "default" }: CourseCardProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("green.500", "green.400");
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const levelColors = {
    fundamental: "green",
    intermediate: "blue",
    advanced: "purple",
  };

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      bg={cardBg}
      transition="all 0.3s"
      _hover={{ 
        transform: "translateY(-4px)", 
        shadow: "xl",
        borderColor: hoverBorderColor 
      }}
      h="full"
      display="flex"
      flexDirection="column"
    >
      {/* Thumbnail */}
      <Box position="relative" h={variant === "compact" ? "150px" : "200px"}>
        {course.thumbnail && course.thumbnail !== '/images/placeholder-course.jpg' ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : (
          <Box
            w="full"
            h="full"
            bg={useColorModeValue('gray.200', 'gray.700')}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiBook} boxSize="12" color={useColorModeValue('gray.400', 'gray.500')} />
          </Box>
        )}
        {/* Tier Badge */}
        <Badge
          position="absolute"
          top="3"
          right="3"
          colorScheme={course.tier === "premium" ? "purple" : "green"}
          fontSize="xs"
          fontWeight="bold"
        >
          {course.tier.toUpperCase()}
        </Badge>
        
        {/* Level Badge */}
        <Badge
          position="absolute"
          top="3"
          left="3"
          colorScheme={levelColors[course.level]}
          fontSize="xs"
          textTransform="capitalize"
        >
          {course.level}
        </Badge>
        
        {/* Delivery Mode Badge */}
        {course.deliveryMode === "live" && (
          <Badge
            position="absolute"
            bottom="3"
            left="3"
            colorScheme="red"
            fontSize="xs"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            gap="1"
          >
            <Icon as={FiVideo} boxSize="10px" />
            LIVE
          </Badge>
        )}
      </Box>

      {/* Content */}
      <VStack align="stretch" p="5" spacing="3" flex="1">
        {/* Category */}
        <Text
          fontSize="xs"
          color="blue.500"
          fontWeight="semibold"
          textTransform="uppercase"
        >
          {course.category.replace("-", " ")}
        </Text>

        {/* Title */}
        <Text
          fontSize={variant === "compact" ? "md" : "lg"}
          fontWeight="bold"
          noOfLines={2}
          minH={variant === "compact" ? "40px" : "56px"}
        >
          {course.title}
        </Text>

        {/* Description */}
        {variant !== "compact" && (
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} noOfLines={2}>
            {course.shortDescription}
          </Text>
        )}

        {/* Instructor */}
        <HStack spacing="2">
          <Image
            src={course.instructor.avatar || undefined}
            alt={course.instructor.name}
            boxSize="24px"
            borderRadius="full"
          />
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {course.instructor.name}
          </Text>
        </HStack>

        {/* Stats */}
        <HStack spacing="4" fontSize="sm" color="muted">
          <HStack spacing="1">
            <Icon as={FiStar} color="yellow.500" />
            <Text fontWeight="semibold">{course.rating}</Text>
            <Text color="muted">({course.totalRatings})</Text>
          </HStack>
          <HStack spacing="1">
            <Icon as={FiUsers} />
            <Text>{course.totalStudents.toLocaleString()}</Text>
          </HStack>
        </HStack>

        {/* Live Class Info */}
        {course.deliveryMode === "live" && course.liveSchedule && (
          <Box
            bg="red.100"
            _dark={{ bg: "red.900" }}
            p="2"
            borderRadius="md"
            fontSize="xs"
          >
            <Text fontWeight="semibold" color="red.600" _dark={{ color: "red.400" }}>
              📅 {course.liveSchedule}
            </Text>
            {course.maxStudents && course.enrolledStudents !== undefined && (
              <Text color="muted" mt="1">
                {course.enrolledStudents >= course.maxStudents ? (
                  <Badge colorScheme="red" fontSize="xs">FULL</Badge>
                ) : (
                  `${course.enrolledStudents}/${course.maxStudents} enrolled`
                )}
              </Text>
            )}
          </Box>
        )}

        {variant !== "compact" && (
          <HStack spacing="4" fontSize="xs" color="muted">
            <HStack spacing="1">
              <Icon as={FiBook} />
              <Text>{course.totalLessons} lessons</Text>
            </HStack>
            <HStack spacing="1">
              <Icon as={FiClock} />
              <Text>{formatDuration(course.duration)}</Text>
            </HStack>
          </HStack>
        )}

        {/* Price & CTA */}
        <HStack justify="space-between" align="center" mt="auto" pt="3">
          <Text fontSize="2xl" fontWeight="bold" color="green.500">
            {course.price === 0 ? "Free" : `৳${course.price}`}
          </Text>
          <ButtonLink
            href={`/academy/courses/${course.slug}`}
            colorScheme="primary"
            size={variant === "compact" ? "sm" : "md"}
            rightIcon={<Icon as={FiArrowRight} boxSize="14px" />}
          >
            Enroll Now
          </ButtonLink>
        </HStack>
      </VStack>
    </Box>
  );
}
