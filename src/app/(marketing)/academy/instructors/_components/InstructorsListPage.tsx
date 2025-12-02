"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  Icon,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { instructors, courses } from "@/data/academy/courses";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { FiStar, FiUsers, FiBook } from "react-icons/fi";

export default function InstructorsListPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      {/* Header */}
      <Box py={{ base: "12", md: "20" }} position="relative" overflow="hidden">
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing="6" textAlign="center">
              <Badge colorScheme="purple" fontSize="sm" px="3" py="1" borderRadius="full">
                Expert Instructors
              </Badge>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} maxW="4xl">
                Learn from Industry Professionals
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="muted" maxW="3xl">
                Our instructors are seasoned cybersecurity experts with years of real-world experience
                in ethical hacking, penetration testing, and security consulting
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Instructors Grid */}
      <Box py={{ base: "12", md: "16" }} bg={bgColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="8">
            {instructors.map((instructor, index) => {
              const instructorCourses = courses.filter((c) => c.instructor.id === instructor.id);
              
              return (
                <FallInPlace key={instructor.id} delay={0.1 * index}>
                  <ButtonLink
                    href={`/academy/instructors/${instructor.id}`}
                    variant="unstyled"
                    height="auto"
                    display="block"
                  >
                    <Box
                      bg={cardBg}
                      borderRadius="2xl"
                      overflow="hidden"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-8px)",
                        shadow: "2xl",
                        borderColor: "purple.500",
                      }}
                      cursor="pointer"
                      h="full"
                    >
                      <Box position="relative" h="300px">
                        <Image
                          src={instructor.avatar}
                          alt={instructor.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <VStack p="6" spacing="4" align="start">
                        <VStack align="start" spacing="1">
                          <Heading size="md">{instructor.name}</Heading>
                          <Text fontSize="sm" color="muted" noOfLines={2}>
                            {instructor.experience}
                          </Text>
                        </VStack>

                        <HStack spacing="4" fontSize="sm" color="muted" flexWrap="wrap">
                          <HStack spacing="1">
                            <Icon as={FiStar} color="yellow.500" />
                            <Text fontWeight="semibold">{instructor.rating}</Text>
                          </HStack>
                          <HStack spacing="1">
                            <Icon as={FiUsers} />
                            <Text>{instructor.totalStudents.toLocaleString()}</Text>
                          </HStack>
                          <HStack spacing="1">
                            <Icon as={FiBook} />
                            <Text>{instructorCourses.length} courses</Text>
                          </HStack>
                        </HStack>

                        <Text fontSize="sm" color="muted" noOfLines={3} lineHeight="tall">
                          {instructor.bio}
                        </Text>

                        <Badge colorScheme="purple" fontSize="xs">
                          View Profile →
                        </Badge>
                      </VStack>
                    </Box>
                  </ButtonLink>
                </FallInPlace>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: "16", md: "24" }}>
        <Container maxW="container.xl">
          <FallInPlace>
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor="purple.500"
              p={{ base: "8", md: "12", lg: "16" }}
              borderRadius="3xl"
              textAlign="center"
            >
              <VStack spacing="6">
                <Badge colorScheme="purple" fontSize="md" px="4" py="2" borderRadius="full">
                  Join Us Today
                </Badge>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} maxW="3xl">
                  Ready to Learn from the Best?
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }} color="muted" maxW="2xl">
                  Browse our comprehensive course catalog and start your cybersecurity journey
                  with expert guidance from industry professionals.
                </Text>
                <ButtonLink
                  href="/academy/courses"
                  size="lg"
                  colorScheme="primary"
                >
                  Browse All Courses
                </ButtonLink>
              </VStack>
            </Box>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  );
}
