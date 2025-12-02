"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  HStack,
  useColorModeValue,
  Flex,
  Select,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { liveCourses } from "@/data/academy/batches";
import CourseCard from "@/components/academy/CourseCard";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { Em } from "@/components/shared/typography";
import { FiCalendar } from "react-icons/fi";
import { EmptyState } from "@/components/academy/UIStates";

export default function LiveBatchesPage() {
  const [tierFilter, setTierFilter] = useState<string>("all");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Filter live courses by tier
  const filteredCourses = liveCourses.filter((course) => {
    if (tierFilter === "all") return true;
    return course.tier === tierFilter;
  });

  // Calculate stats
  const totalStudents = liveCourses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0);
  const freeLiveCount = liveCourses.filter((c) => c.tier === "free").length;
  const premiumLiveCount = liveCourses.filter((c) => c.tier === "premium").length;

  return (
    <Box>
      {/* Header */}
      <Box py={{ base: "12", md: "20" }} position="relative" overflow="hidden">
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing="6" textAlign="center">
              <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                <HStack spacing="2">
                  <Icon as={FiCalendar} />
                  <Text>Live Training</Text>
                </HStack>
              </Badge>
              <Heading fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}>
                Live <Em>Batches</Em>
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="muted" maxW="2xl">
                Join our live instructor-led training sessions with real-time interaction,
                hands-on labs, and personalized mentorship
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Stats Banner */}
      <Box py="8" bg={bgColor}>
        <Container maxW="container.xl">
          <FallInPlace delay={0.2}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="6">
              <VStack spacing="1">
                <Text fontSize="3xl" fontWeight="bold" color="green.500">
                  {liveCourses.length}
                </Text>
                <Text fontSize="sm" color="muted">
                  Live Courses
                </Text>
              </VStack>
              <VStack spacing="1">
                <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                  {freeLiveCount}
                </Text>
                <Text fontSize="sm" color="muted">
                  Free Courses
                </Text>
              </VStack>
              <VStack spacing="1">
                <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                  {premiumLiveCount}
                </Text>
                <Text fontSize="sm" color="muted">
                  Premium Courses
                </Text>
              </VStack>
              <VStack spacing="1">
                <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                  {totalStudents}+
                </Text>
                <Text fontSize="sm" color="muted">
                  Active Students
                </Text>
              </VStack>
            </SimpleGrid>
          </FallInPlace>
        </Container>
      </Box>

      {/* Batches Section */}
      <Box py={{ base: "16", md: "24" }}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: "8", md: "12" }} align="stretch">
            {/* Filter */}
            <FallInPlace>
              <Flex
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap="4"
              >
                <VStack align={{ base: "center", md: "start" }} spacing="2">
                  <Heading size="lg">Available Live Courses</Heading>
                  <Text color="muted">
                    {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}{" "}
                    available
                  </Text>
                </VStack>

                <HStack spacing="3">
                  <Text fontSize="sm" color="muted">
                    Filter by:
                  </Text>
                  <Select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    w="200px"
                    size="sm"
                    borderRadius="lg"
                    focusBorderColor="primary.500"
                  >
                    <option value="all">All Courses</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </Select>
                </HStack>
              </Flex>
            </FallInPlace>

            {/* Live Courses Grid */}
            <Box>
              {filteredCourses.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="6">
                  {filteredCourses.map((course, index) => (
                    <FallInPlace key={course.id} delay={0.05 * index}>
                      <CourseCard course={course} />
                    </FallInPlace>
                  ))}
                </SimpleGrid>
              ) : (
                <EmptyState
                  title="No live courses found"
                  description="Try adjusting your filters to see more results"
                />
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
