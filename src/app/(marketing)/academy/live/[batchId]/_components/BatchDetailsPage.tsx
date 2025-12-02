"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import Image from "next/image";
import { batches } from "@/data/academy/batches";
import { courses } from "@/data/academy/courses";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { Em } from "@/components/shared/typography";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiVideo,
  FiCheckCircle,
  FiMapPin,
  FiAward,
  FiBookOpen,
  FiZap,
} from "react-icons/fi";

interface BatchDetailsPageProps {
  batchId: string;
}

export default function BatchDetailsPage({ batchId }: BatchDetailsPageProps) {
  const batch = batches.find((b) => b.id === batchId);
  const course = batch ? courses.find((c) => c.id === batch.courseId) : null;
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const statusColors = {
    upcoming: "blue",
    ongoing: "green",
    completed: "gray",
  };

  const statusLabels = {
    upcoming: "Starting Soon",
    ongoing: "Live Now",
    completed: "Completed",
  };

  if (!batch) {
    return (
      <Container maxW="container.xl" py="20">
        <VStack spacing="4">
          <Heading>Batch Not Found</Heading>
          <Text color="muted">The batch you're looking for doesn't exist.</Text>
          <ButtonLink href="/academy/live" colorScheme="primary">
            View All Batches
          </ButtonLink>
        </VStack>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const spotsLeft = batch.maxStudents - batch.enrolledStudents;
  const isFull = spotsLeft === 0;
  const isAlmostFull = spotsLeft <= 10 && !isFull;

  return (
    <Box>
      {/* Hero Section */}
      <Box py={{ base: "12", md: "16" }} bg={bgColor} borderBottomWidth="1px" borderColor={borderColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: "8", md: "12" }} alignItems="center">
            <FallInPlace>
              <VStack align="start" spacing="6">
                <HStack spacing="3" flexWrap="wrap">
                  <Badge
                    colorScheme={statusColors[batch.status]}
                    fontSize="sm"
                    px="3"
                    py="1"
                    borderRadius="full"
                  >
                    {statusLabels[batch.status]}
                  </Badge>
                  {isFull && (
                    <Badge colorScheme="red" fontSize="sm" px="3" py="1" borderRadius="full">
                      FULL
                    </Badge>
                  )}
                  {isAlmostFull && (
                    <Badge colorScheme="orange" fontSize="sm" px="3" py="1" borderRadius="full">
                      Almost Full
                    </Badge>
                  )}
                </HStack>

                <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                  {batch.name}
                </Heading>

                <Text fontSize={{ base: "md", md: "lg" }} color="muted">
                  {batch.description}
                </Text>

                <VStack align="start" spacing="3" w="full">
                  <HStack spacing="3">
                    <Icon as={FiCalendar} color="primary.500" boxSize="20px" />
                    <VStack align="start" spacing="0">
                      <Text fontSize="sm" color="muted">
                        Duration
                      </Text>
                      <Text fontWeight="medium">
                        {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing="3">
                    <Icon as={FiClock} color="primary.500" boxSize="20px" />
                    <VStack align="start" spacing="0">
                      <Text fontSize="sm" color="muted">
                        Schedule
                      </Text>
                      <Text fontWeight="medium">{batch.schedule}</Text>
                    </VStack>
                  </HStack>

                  <HStack spacing="3">
                    <Icon as={FiUsers} color="primary.500" boxSize="20px" />
                    <VStack align="start" spacing="0">
                      <Text fontSize="sm" color="muted">
                        Enrollment
                      </Text>
                      <Text fontWeight="medium">
                        {batch.enrolledStudents}/{batch.maxStudents} students
                        {!isFull && ` (${spotsLeft} spots left)`}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>

                <Divider />

                <HStack spacing="4" pt="2">
                  <VStack align="start" spacing="0">
                    <Text fontSize="sm" color="muted">
                      Batch Fee
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="primary.500">
                      ₹{batch.price.toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing="4">
                  <ButtonLink
                    href={batch.status === "ongoing" ? batch.meetingLink : `/academy/enroll/batch/${batch.id}`}
                    colorScheme="primary"
                    size="lg"
                    isDisabled={isFull || batch.status === "completed"}
                  >
                    {isFull
                      ? "Batch Full"
                      : batch.status === "ongoing"
                      ? "Join Live Session"
                      : "Enroll Now"}
                  </ButtonLink>
                  {course && (
                    <ButtonLink
                      href={`/academy/courses/${course.slug}`}
                      variant="outline"
                      colorScheme="primary"
                      size="lg"
                    >
                      View Course
                    </ButtonLink>
                  )}
                </HStack>
              </VStack>
            </FallInPlace>

            <FallInPlace delay={0.2}>
              <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
                <Image
                  src={batch.thumbnail}
                  alt={batch.name}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
            </FallInPlace>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Main Content */}
      <Box py={{ base: "16", md: "24" }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "12", lg: "16" }}>
            {/* Left Column */}
            <Box gridColumn={{ lg: "span 2" }}>
              <VStack spacing="12" align="stretch">
                <FallInPlace>
                  <Box>
                    <Heading size="lg" mb="6">
                      About This Batch
                    </Heading>
                    <Text color="muted" lineHeight="tall" mb="6">
                      {batch.description}
                    </Text>
                    <Text color="muted" lineHeight="tall">
                      This is a live instructor-led training batch where you'll learn directly from
                      industry experts. The sessions are interactive with real-time Q&A, hands-on labs,
                      and personalized feedback. You'll also get lifetime access to all recorded sessions.
                    </Text>
                  </Box>
                </FallInPlace>

                <FallInPlace delay={0.1}>
                  <Box>
                    <Heading size="lg" mb="6">
                      What's Included
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                      <HStack align="start" spacing="3">
                        <Icon as={FiVideo} color="green.500" mt="1" flexShrink={0} boxSize="20px" />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="medium">Live Interactive Sessions</Text>
                          <Text fontSize="sm" color="muted">
                            Real-time learning with instructor
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack align="start" spacing="3">
                        <Icon as={FiBookOpen} color="blue.500" mt="1" flexShrink={0} boxSize="20px" />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="medium">Recorded Sessions</Text>
                          <Text fontSize="sm" color="muted">
                            Lifetime access to recordings
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack align="start" spacing="3">
                        <Icon as={FiCheckCircle} color="purple.500" mt="1" flexShrink={0} boxSize="20px" />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="medium">Hands-on Labs</Text>
                          <Text fontSize="sm" color="muted">
                            Practice with real scenarios
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack align="start" spacing="3">
                        <Icon as={FiUsers} color="orange.500" mt="1" flexShrink={0} boxSize="20px" />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="medium">Community Access</Text>
                          <Text fontSize="sm" color="muted">
                            Connect with peers
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack align="start" spacing="3">
                        <Icon as={FiAward} color="cyan.500" mt="1" flexShrink={0} boxSize="20px" />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="medium">Certificate</Text>
                          <Text fontSize="sm" color="muted">
                            Upon completion
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack align="start" spacing="3">
                        <Icon as={FiZap} color="yellow.500" mt="1" flexShrink={0} boxSize="20px" />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="medium">1-on-1 Mentorship</Text>
                          <Text fontSize="sm" color="muted">
                            Personalized guidance
                          </Text>
                        </VStack>
                      </HStack>
                    </SimpleGrid>
                  </Box>
                </FallInPlace>

                {course && (
                  <FallInPlace delay={0.2}>
                    <Box>
                      <Heading size="lg" mb="6">
                        Course Curriculum
                      </Heading>
                      <VStack align="stretch" spacing="4">
                        <Text color="muted">
                          This batch covers the complete <strong>{course.title}</strong> curriculum:
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                          <HStack>
                            <Icon as={FiBookOpen} color="primary.500" />
                            <Text>{course.totalModules} Modules</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiVideo} color="primary.500" />
                            <Text>{course.totalLessons} Lessons</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiClock} color="primary.500" />
                            <Text>
                              {Math.floor(course.duration / 60)}h {course.duration % 60}m Duration
                            </Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiAward} color="primary.500" />
                            <Text>Certificate Included</Text>
                          </HStack>
                        </SimpleGrid>
                        <ButtonLink
                          href={`/academy/courses/${course.slug}`}
                          variant="outline"
                          colorScheme="primary"
                          mt="4"
                        >
                          View Full Course Details
                        </ButtonLink>
                      </VStack>
                    </Box>
                  </FallInPlace>
                )}
              </VStack>
            </Box>

            {/* Right Column - Instructor */}
            <VStack spacing="8" align="stretch">
              <FallInPlace delay={0.3}>
                <Box>
                  <Heading size="md" mb="6">
                    Your Instructor
                  </Heading>
                  <VStack align="stretch" spacing="4" p="6" bg={bgColor} borderRadius="2xl" borderWidth="1px">
                    <HStack spacing="4">
                      <Avatar
                        src={batch.instructor.avatar}
                        name={batch.instructor.name}
                        size="xl"
                        border="4px solid"
                        borderColor="primary.500"
                      />
                      <VStack align="start" spacing="1">
                        <Text fontWeight="bold" fontSize="lg">
                          {batch.instructor.name}
                        </Text>
                        <Badge colorScheme="primary" borderRadius="full" px="2">
                          {batch.instructor.experience}
                        </Badge>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="muted">
                      {batch.instructor.bio}
                    </Text>
                    <SimpleGrid columns={3} spacing="4" pt="4" borderTopWidth="1px">
                      <VStack spacing="0">
                        <Text fontSize="xl" fontWeight="bold" color="primary.500">
                          {batch.instructor.rating}
                        </Text>
                        <Text fontSize="xs" color="muted">
                          Rating
                        </Text>
                      </VStack>
                      <VStack spacing="0">
                        <Text fontSize="xl" fontWeight="bold" color="primary.500">
                          {batch.instructor.totalStudents.toLocaleString()}
                        </Text>
                        <Text fontSize="xs" color="muted">
                          Students
                        </Text>
                      </VStack>
                      <VStack spacing="0">
                        <Text fontSize="xl" fontWeight="bold" color="primary.500">
                          {batch.instructor.totalCourses}
                        </Text>
                        <Text fontSize="xs" color="muted">
                          Courses
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </FallInPlace>

              {isAlmostFull && !isFull && (
                <FallInPlace delay={0.4}>
                  <Box p="6" bg="orange.50" _dark={{ bg: "orange.900/20" }} borderRadius="2xl">
                    <VStack spacing="3">
                      <Icon as={FiZap} boxSize="10" color="orange.500" />
                      <VStack spacing="2">
                        <Heading size="sm" textAlign="center" color="orange.600" _dark={{ color: "orange.400" }}>
                          Only {spotsLeft} Spots Left!
                        </Heading>
                        <Text fontSize="sm" color="muted" textAlign="center">
                          This batch is filling up fast. Enroll now to secure your spot.
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                </FallInPlace>
              )}

              <FallInPlace delay={0.5}>
                <Box p="6" bg="primary.50" _dark={{ bg: "primary.900/20" }} borderRadius="2xl">
                  <VStack spacing="4">
                    <Icon as={FiAward} boxSize="12" color="primary.500" />
                    <VStack spacing="2">
                      <Heading size="sm" textAlign="center">
                        Get Certified
                      </Heading>
                      <Text fontSize="sm" color="muted" textAlign="center">
                        Earn a verified certificate upon successful completion of the batch
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              </FallInPlace>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
