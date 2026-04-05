"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
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
  Wrap,
  Divider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { FiStar, FiUsers, FiBook, FiAward, FiTrendingUp, FiUser } from "react-icons/fi";
import { Instructor } from "@/types/academy";
import academyService from "@/lib/academy-service";
import { getFullImageUrl } from "@/lib/image-utils";

export default function InstructorsListPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
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

  const totalStudents = instructors.reduce(
    (sum, instructor) => sum + (instructor.totalStudents || 0),
    0
  );
  const avgRating = instructors.length
    ? instructors.reduce((sum, instructor) => sum + (instructor.rating || 0), 0) / instructors.length
    : 0;

  const formatCompactNumber = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();

  const getInstructorSkills = (skills: Instructor["skills"]): string[] => {
    if (Array.isArray(skills)) {
      return skills.filter(Boolean);
    }

    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

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
                bg={useColorModeValue('green.200', 'green.700')}
                color={useColorModeValue('green.900', 'white')}
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                World Class Instructors
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
                    {formatCompactNumber(totalStudents)}+
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Students Taught
                  </Text>
                </VStack>
                <Divider orientation="vertical" h="50px" borderColor="gray.700" />
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {avgRating.toFixed(1)}
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
            <Badge
              bg={useColorModeValue("blue.200", "blue.500")}
              color={useColorModeValue("blue.900", "white")}
              fontSize="sm"
              px={4}
              py={1}
              borderRadius="full"
              fontWeight="semibold"
            >
              Meet Our Expert
            </Badge>
            <Heading
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              textAlign="center"
            >
              Meet Our Expert Instructors
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textMuted}
              textAlign="center"
              maxW="2xl"
            >
              Learn from industry professionals with years of real-world experience in cybersecurity
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
                const skills = getInstructorSkills(instructor.skills).slice(0, 3);
                const title = instructor.experience || "Cybersecurity Expert";
                const bio =
                  instructor.user?.bio ||
                  "Learn practical cybersecurity from real-world professionals.";

                return (
                  <FallInPlace key={instructor.id} delay={0.05 * index}>
                    <Box
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="3xl"
                      overflow="hidden"
                      transition="all 0.4s ease"
                      position="relative"
                      _hover={{
                        transform: "translateY(-8px)",
                        shadow: "2xl",
                        borderColor: "purple.500",
                      }}
                      cursor="pointer"
                      h="full"
                      display="flex"
                      flexDirection="column"
                    >
                      {/* Instructor Image */}
                      <Box position="relative" overflow="hidden" aspectRatio="4 / 3">
                        {instructor.user?.avatar ? (
                          <Image
                            src={getFullImageUrl(instructor.user.avatar, "avatar")}
                            alt={instructor.user?.name || 'Instructor'}
                            width={400}
                            height={400}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center top",
                            }}
                          />
                        ) : (
                          <Box
                            position="relative"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg={useColorModeValue('gray.200', 'gray.700')}
                            w="full"
                            h="full"
                          >
                            <Icon as={FiUser} boxSize="80px" color={useColorModeValue('gray.500', 'gray.400')} />
                          </Box>
                        )}
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                          p={4}
                        >
                          {/* <Badge
                            bg={useColorModeValue("blue.200", "blue.500")}
                            color={useColorModeValue("blue.900", "white")}
                            fontSize="xs"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="semibold"
                          >
                            Expert Instructor
                          </Badge> */}
                        </Box>
                      </Box>

                      {/* Instructor Info */}
                      <VStack p={6} spacing={4} align="start" flex="1">
                        <VStack align="start" spacing={2} w="full">
                          <Heading size="md" color={headingColor}>
                            {instructor.user?.name || 'Instructor'}
                          </Heading>
                          <Text fontSize="sm" fontWeight="semibold" color="purple.500">
                            {instructor.user?.bio || 'No bio available'}
                          </Text>
                        </VStack>

                        {skills.length > 0 && (
                          <Wrap spacing={2}>
                            {skills.map((skill) => (
                              <Badge key={skill} colorScheme="green" fontSize="xs" borderRadius="full" px={2} py={1}>
                                {skill}
                              </Badge>
                            ))}
                          </Wrap>
                        )}

                        <Box w="full" pt={4} borderTopWidth="1px" borderColor={borderColor}>
                          <SimpleGrid columns={3} spacing={4} fontSize="sm">
                            <VStack spacing={1}>
                              <HStack spacing={1} color="yellow.500">
                                <Icon as={FiStar} />
                                <Text fontWeight="bold">{instructor.rating}</Text>
                              </HStack>
                              <Text fontSize="xs" color={textMuted}>Rating</Text>
                            </VStack>

                            <VStack spacing={1}>
                              <HStack spacing={1} color="purple.500">
                                <Icon as={FiUsers} />
                                <Text fontWeight="bold">
                                  {formatCompactNumber(instructor.totalStudents || 0)}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color={textMuted}>Students</Text>
                            </VStack>

                            <VStack spacing={1}>
                              <HStack spacing={1} color="blue.500">
                                <Icon as={FiBook} />
                                <Text fontWeight="bold">{instructor.totalCourses}</Text>
                              </HStack>
                              <Text fontSize="xs" color={textMuted}>Courses</Text>
                            </VStack>
                          </SimpleGrid>
                        </Box>

                        {/* CTA Button */}
                        <Button
                          as={NextLink}
                          href={`/academy/instructors/${instructor.id}`}
                          colorScheme="green"
                          size="md"
                          width="full"
                          mt={2}
                          borderRadius="md"
                        >
                          View Profile
                        </Button>
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
              <Badge bg={useColorModeValue('green.200', 'green.700')}
                color={useColorModeValue('green.900', 'white')} fontSize="sm" px={4} py={2} borderRadius="full">
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
