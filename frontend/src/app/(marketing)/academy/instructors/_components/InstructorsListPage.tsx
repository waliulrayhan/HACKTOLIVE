"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  HStack,
  useColorModeValue,
  Icon,
  Badge,
  Flex,
  Divider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { FiStar, FiUsers, FiBook, FiAward, FiTrendingUp } from "react-icons/fi";
import { Instructor } from "@/types/academy";
import academyService from "@/lib/academy-service";

export default function InstructorsListPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const heroBg = useColorModeValue("gray.900", "gray.950");
  const accentColor = useColorModeValue("green.500", "green.400");

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const instructorData = await academyService.getInstructors();
        setInstructors(instructorData);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section - Clean and Separated */}
      <Box
        bg={heroBg}
        pt={{ base: "120px", md: "140px" }}
        pb={{ base: "80px", md: "100px" }}
        mb={0}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <FallInPlace>
              <Badge
                colorScheme="green"
                fontSize="sm"
                px={5}
                py={2}
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wider"
                fontWeight="bold"
              >
                World-Class Instructors
              </Badge>
            </FallInPlace>

            <FallInPlace delay={0.1}>
              <Heading
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="extrabold"
                color="white"
                lineHeight="1.1"
                letterSpacing="tight"
              >
                Learn from Industry
                <br />
                <Text as="span" color={accentColor}>
                  Experts
                </Text>
              </Heading>
            </FallInPlace>

            <FallInPlace delay={0.2}>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.400"
                maxW="2xl"
                lineHeight="tall"
              >
                Our instructors are seasoned cybersecurity professionals with decades of
                combined experience in ethical hacking, penetration testing, and security
                consulting.
              </Text>
            </FallInPlace>

            {/* Stats Bar */}
            <FallInPlace delay={0.3}>
              <HStack
                spacing={{ base: 6, md: 12 }}
                pt={8}
                flexWrap="wrap"
                justify="center"
              >
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {instructors.length}+
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Instructors
                  </Text>
                </VStack>
                <Divider orientation="vertical" h="50px" borderColor="gray.700" />
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    50K+
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Students Taught
                  </Text>
                </VStack>
                <Divider orientation="vertical" h="50px" borderColor="gray.700" />
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    4.8
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Avg Rating
                  </Text>
                </VStack>
              </HStack>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Instructors Grid Section - Completely Separated */}
      <Box py={{ base: "60px", md: "80px" }} bg={bgColor}>
        <Container maxW="container.xl">
          {/* Section Header */}
          <VStack spacing={4} mb={{ base: 10, md: 14 }}>
            <Heading
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              textAlign="center"
            >
              Meet Our Expert Team
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textMuted}
              textAlign="center"
              maxW="2xl"
            >
              Each instructor brings unique expertise and real-world experience to help you
              master cybersecurity.
            </Text>
          </VStack>

          {/* Instructors Grid */}
          {loading ? (
            <Center py="20">
              <VStack spacing="4">
                <Spinner size="xl" color="green.500" thickness="4px" />
                <Text color={textMuted}>Loading instructors...</Text>
              </VStack>
            </Center>
          ) : instructors.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 8, md: 10 }}
            >
              {instructors.map((instructor, index) => {
                return (
                  <FallInPlace key={instructor.id} delay={0.05 * index}>
                    <Box
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="xl"
                      overflow="hidden"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "translateY(-8px)",
                        shadow: "2xl",
                        borderColor: accentColor,
                      }}
                      h="full"
                      display="flex"
                      flexDirection="column"
                    >
                      {/* Instructor Image */}
                    <Box position="relative" h="280px" w="full" overflow="hidden">
                      <Image
                        src={instructor.avatar}
                        alt={instructor.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <Box
                        position="absolute"
                        top={4}
                        right={4}
                        bg="blackAlpha.700"
                        backdropFilter="blur(10px)"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        <HStack spacing={1}>
                          <Icon as={FiStar} color="yellow.400" boxSize={4} />
                          <Text color="white" fontWeight="bold" fontSize="sm">
                            {instructor.rating}
                          </Text>
                        </HStack>
                      </Box>
                    </Box>

                    {/* Instructor Info */}
                    <VStack p={6} spacing={4} align="stretch" flex="1">
                      {/* Name & Badge */}
                      <Box>
                        <Heading size="md" mb={2}>
                          {instructor.name}
                        </Heading>
                        <Badge
                          colorScheme="green"
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="semibold"
                        >
                          {instructor.experience}
                        </Badge>
                      </Box>

                      {/* Bio */}
                      <Text
                        fontSize="sm"
                        color={textMuted}
                        lineHeight="tall"
                        noOfLines={3}
                      >
                        {instructor.bio}
                      </Text>

                      {/* Divider */}
                      <Divider borderColor={borderColor} />

                      {/* Stats Grid */}
                      <SimpleGrid columns={3} spacing={4}>
                        <VStack spacing={1}>
                          <Flex
                            w="40px"
                            h="40px"
                            borderRadius="lg"
                            bg={useColorModeValue("blue.50", "blue.900")}
                            align="center"
                            justify="center"
                          >
                            <Icon
                              as={FiBook}
                              color={useColorModeValue("blue.500", "blue.300")}
                              boxSize={5}
                            />
                          </Flex>
                          <Text fontWeight="bold" fontSize="lg">
                            {instructor.totalCourses}
                          </Text>
                          <Text fontSize="xs" color={textMuted}>
                            Courses
                          </Text>
                        </VStack>

                        <VStack spacing={1}>
                          <Flex
                            w="40px"
                            h="40px"
                            borderRadius="lg"
                            bg={useColorModeValue("green.50", "green.900")}
                            align="center"
                            justify="center"
                          >
                            <Icon
                              as={FiUsers}
                              color={useColorModeValue("green.500", "green.300")}
                              boxSize={5}
                            />
                          </Flex>
                          <Text fontWeight="bold" fontSize="lg">
                            {(instructor.totalStudents / 1000).toFixed(0)}K
                          </Text>
                          <Text fontSize="xs" color={textMuted}>
                            Students
                          </Text>
                        </VStack>

                        <VStack spacing={1}>
                          <Flex
                            w="40px"
                            h="40px"
                            borderRadius="lg"
                            bg={useColorModeValue("purple.50", "purple.900")}
                            align="center"
                            justify="center"
                          >
                            <Icon
                              as={FiAward}
                              color={useColorModeValue("purple.500", "purple.300")}
                              boxSize={5}
                            />
                          </Flex>
                          <Text fontWeight="bold" fontSize="lg">
                            {instructor.rating}
                          </Text>
                          <Text fontSize="xs" color={textMuted}>
                            Rating
                          </Text>
                        </VStack>
                      </SimpleGrid>

                      {/* CTA Button */}
                      <ButtonLink
                        href={`/academy/instructors/${instructor.id}`}
                        colorScheme="green"
                        size="md"
                        width="full"
                        mt={2}
                      >
                        View Profile
                      </ButtonLink>
                    </VStack>
                  </Box>
                </FallInPlace>
              );
            })}
          </SimpleGrid>
          ) : (
            <Center py="20">
              <Text color={textMuted}>No instructors found.</Text>
            </Center>
          )}
        </Container>
      </Box>

      {/* Why Learn From Us Section - Separated */}
      <Box py={{ base: "60px", md: "80px" }} bg={cardBg}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: 10, md: 14 }}>
            {/* Section Header */}
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="green" fontSize="sm" px={4} py={2} borderRadius="full">
                Our Advantage
              </Badge>
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                Why Learn From Our Instructors?
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color={textMuted} maxW="2xl">
                Our instructors aren't just teachers—they're active practitioners in the
                cybersecurity field.
              </Text>
            </VStack>

            {/* Features Grid */}
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={{ base: 6, md: 8 }}
              w="full"
            >
              <FallInPlace delay={0.1}>
                <VStack
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  spacing={4}
                  align="start"
                  h="full"
                >
                  <Flex
                    w="56px"
                    h="56px"
                    borderRadius="xl"
                    bg={useColorModeValue("green.100", "green.900")}
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiTrendingUp} color="green.500" boxSize={7} />
                  </Flex>
                  <Heading size="md">Real-World Experience</Heading>
                  <Text fontSize="sm" color={textMuted} lineHeight="tall">
                    Learn from professionals actively working in cybersecurity, bringing
                    current industry practices to every lesson.
                  </Text>
                </VStack>
              </FallInPlace>

              <FallInPlace delay={0.2}>
                <VStack
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  spacing={4}
                  align="start"
                  h="full"
                >
                  <Flex
                    w="56px"
                    h="56px"
                    borderRadius="xl"
                    bg={useColorModeValue("blue.100", "blue.900")}
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiBook} color="blue.500" boxSize={7} />
                  </Flex>
                  <Heading size="md">Comprehensive Curriculum</Heading>
                  <Text fontSize="sm" color={textMuted} lineHeight="tall">
                    Structured courses covering everything from fundamentals to advanced
                    penetration testing techniques.
                  </Text>
                </VStack>
              </FallInPlace>

              <FallInPlace delay={0.3}>
                <VStack
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  spacing={4}
                  align="start"
                  h="full"
                >
                  <Flex
                    w="56px"
                    h="56px"
                    borderRadius="xl"
                    bg={useColorModeValue("purple.100", "purple.900")}
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiUsers} color="purple.500" boxSize={7} />
                  </Flex>
                  <Heading size="md">Personalized Support</Heading>
                  <Text fontSize="sm" color={textMuted} lineHeight="tall">
                    Get direct feedback and mentorship from instructors who care about your
                    success.
                  </Text>
                </VStack>
              </FallInPlace>

              <FallInPlace delay={0.4}>
                <VStack
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  spacing={4}
                  align="start"
                  h="full"
                >
                  <Flex
                    w="56px"
                    h="56px"
                    borderRadius="xl"
                    bg={useColorModeValue("orange.100", "orange.900")}
                    align="center"
                    justify="center"
                  >
                    <Icon as={FiAward} color="orange.500" boxSize={7} />
                  </Flex>
                  <Heading size="md">Industry Recognition</Heading>
                  <Text fontSize="sm" color={textMuted} lineHeight="tall">
                    Learn from certified professionals with credentials from top security
                    organizations.
                  </Text>
                </VStack>
              </FallInPlace>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section - Final Separated Section */}
      <Box py={{ base: "60px", md: "80px" }} bg={bgColor}>
        <Container maxW="container.xl">
          <FallInPlace>
            <Box
              bg={useColorModeValue(
                "linear-gradient(135deg, #48BB78 0%, #38A169 100%)",
                "linear-gradient(135deg, #2F855A 0%, #276749 100%)"
              )}
              p={{ base: 12, md: 16 }}
              borderRadius="2xl"
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <VStack spacing={6} position="relative" zIndex={1}>
                <Icon as={FiAward} color="white" boxSize={12} />
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  color="white"
                  maxW="3xl"
                >
                  Ready to Start Your Cybersecurity Journey?
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.900"
                  maxW="2xl"
                  lineHeight="tall"
                >
                  Join thousands of students learning from the best instructors in the
                  industry. Browse our courses and start building your cybersecurity career
                  today.
                </Text>
                <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                  <ButtonLink
                    href="/academy/courses"
                    size="lg"
                    bg="white"
                    color="green.600"
                    _hover={{ bg: "gray.100" }}
                    fontWeight="bold"
                  >
                    Explore All Courses
                  </ButtonLink>
                  <ButtonLink
                    href="/signup"
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                    fontWeight="bold"
                  >
                    Get Started Free
                  </ButtonLink>
                </HStack>
              </VStack>
            </Box>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  );
}
