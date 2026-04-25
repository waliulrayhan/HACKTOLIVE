"use client";

import { Box, Badge, HStack, VStack, Text, Image, useColorModeValue, Flex, Icon, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { Course } from "@/types/academy";
import { getDiscountPercentage, getFinalPrice, getOriginalPrice, hasDiscount } from "@/lib/course-pricing";
import { getCoursePrioritySerial } from "@/lib/course-priority";
import { getFallbackImageUrl, getFullImageUrl } from "@/lib/image-utils";
import { FiStar, FiUsers, FiClock, FiBook, FiArrowRight, FiVideo, FiPlay } from "react-icons/fi";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact";
  isEnrolled?: boolean;
  showPriorityBadge?: boolean;
}

export default function CourseCard({ course, variant = "default", isEnrolled = false, showPriorityBadge = false }: CourseCardProps) {
  const router = useRouter();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("green.500", "green.400");
  const originalPrice = getOriginalPrice(course);
  const finalPrice = getFinalPrice(course);
  const discounted = hasDiscount(course);
  const discountPercentage = Math.round(getDiscountPercentage(course));
  const prioritySerial = showPriorityBadge ? getCoursePrioritySerial(course.title) : null;
  const isComingSoon = course.ctaText === "COMING_SOON";
  const ctaLabel = isComingSoon ? "Coming Soon" : "Enroll Now";
  const detailsHref = `/academy/courses/${course.slug}`;
  
  const formatDuration = (number) => {
    return `${number}h`;
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
      cursor="pointer"
      role="link"
      tabIndex={0}
      onClick={() => router.push(detailsHref)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(detailsHref);
        }
      }}
    >
      {/* Thumbnail */}
      <Box position="relative" aspectRatio="2/1">
        <Image
          src={getFullImageUrl(course.thumbnail, 'course')}
          fallbackSrc={getFallbackImageUrl('course')}
          alt={course.title}
          w="full"
          h="full"
          objectFit="cover"
        />
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

        {prioritySerial && (
          <Badge
            position="absolute"
            bottom="3"
            right="3"
            colorScheme="orange"
            fontSize="10px"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wide"
            px="2"
            py="1"
          >
            Featured #{prioritySerial}
          </Badge>
        )}
        
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
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} noOfLines={2} whiteSpace="pre-wrap">
            {course.shortDescription}
          </Text>
        )}

        {/* Instructor */}
        <HStack spacing="2">
          <Image
            src={getFullImageUrl(course.instructor.user?.avatar, 'avatar')}
            fallbackSrc={getFallbackImageUrl('avatar')}
            objectFit="cover"
            alt={course.instructor.user?.name || 'Instructor'}
            boxSize="24px"
            borderRadius="full"
          />
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {course.instructor.user?.name || 'Instructor'}
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
        {/* {course.deliveryMode === "live" && course.liveSchedule && (
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
        )} */}

        {variant !== "compact" && (
          <HStack spacing="4" fontSize="xs" color="muted">
            <HStack spacing="1">
              <Icon as={FiBook} />
              <Text>{course.totalLessons} lessons</Text>
            </HStack>
            <HStack spacing="1">
              <Icon as={FiClock} />
              <Text>{course.duration}+ hour</Text>
            </HStack>
          </HStack>
        )}

        {/* Price & CTA */}
        <HStack justify="space-between" align="center" mt="auto" pt="3">
          <VStack align="start" spacing="0">
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {finalPrice === 0 ? "Free" : `${finalPrice} Tk`}
            </Text>
            {discounted && originalPrice > finalPrice && (
              <HStack spacing="2">
                <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                  {originalPrice} Tk
                </Text>
                <Badge colorScheme="red" fontSize="10px">
                  {discountPercentage}% OFF
                </Badge>
              </HStack>
            )}
          </VStack>
          {isEnrolled ? (
            <ButtonLink
              href={`/student/courses/${course.id}`}
              colorScheme="green"
              size={variant === "compact" ? "sm" : "md"}
              rightIcon={<Icon as={FiPlay} boxSize="14px" />}
              onClick={(event) => event.stopPropagation()}
            >
              Continue Learning
            </ButtonLink>
          ) : isComingSoon ? (
            <Button
              colorScheme="orange"
              size={variant === "compact" ? "sm" : "md"}
              rightIcon={<Icon as={FiArrowRight} boxSize="14px" />}
              isDisabled
              _disabled={{
                opacity: 1,
                bg: useColorModeValue("orange.100", "orange.700"),
                color: useColorModeValue("orange.800", "orange.100"),
                cursor: "not-allowed",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              {ctaLabel}
            </Button>
          ) : (
            <ButtonLink
              href={detailsHref}
              colorScheme="primary"
              size={variant === "compact" ? "sm" : "md"}
              rightIcon={<Icon as={FiArrowRight} boxSize="14px" />}
              onClick={(event) => event.stopPropagation()}
            >
              {ctaLabel}
            </ButtonLink>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
