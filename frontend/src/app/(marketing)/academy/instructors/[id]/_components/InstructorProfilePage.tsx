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
  Icon,
  Button,
  useColorModeValue,
  Flex,
  Avatar,
  Wrap,
  WrapItem,
  Divider,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";
import { Instructor, Course } from "@/types/academy";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import CourseCard from "@/components/academy/CourseCard";
import {
  FiStar,
  FiUsers,
  FiBook,
  FiAward,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiGlobe,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

interface InstructorProfilePageProps {
  instructor: Instructor;
  courses: Course[];
}

export default function InstructorProfilePage({
  instructor,
  courses,
}: InstructorProfilePageProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const heroBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("green.500", "green.400");

  const socialIcons = {
    linkedin: FiLinkedin,
    twitter: FiTwitter,
    github: FiGithub,
    website: FiGlobe,
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section with Profile Header */}
      <Box bg={heroBg} pt={{ base: "120px", md: "140px" }} pb={0}>
        <Container maxW="container.xl">
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, lg: 12 }}
            alignItems="center"
          >
            {/* Profile Image */}
            <FallInPlace>
              <Box position="relative">
                <Box
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="2xl"
                >
                  <Image
                    src={instructor.avatar}
                    alt={instructor.name}
                    width={600}
                    height={600}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </Box>
                {/* Floating Rating Badge */}
                <Box
                  position="absolute"
                  top={6}
                  right={6}
                  bg="white"
                  _dark={{ bg: "gray.900" }}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  boxShadow="xl"
                >
                  <VStack spacing={1}>
                    <HStack spacing={2}>
                      <Icon as={FiStar} color="yellow.400" boxSize={5} />
                      <Text fontSize="2xl" fontWeight="bold">
                        {instructor.rating}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={textMuted} fontWeight="medium">
                      Rating
                    </Text>
                  </VStack>
                </Box>
              </Box>
            </FallInPlace>

            {/* Profile Info */}
            <FallInPlace delay={0.1}>
              <VStack align="start" spacing={6}>
                <Badge
                  colorScheme="green"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                  textTransform="uppercase"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  Expert Instructor
                </Badge>

                <VStack align="start" spacing={3}>
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    fontWeight="extrabold"
                    lineHeight="1.1"
                  >
                    {instructor.name}
                  </Heading>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    color={accentColor}
                    fontWeight="semibold"
                  >
                    {instructor.experience}
                  </Text>
                </VStack>

                <Text fontSize="lg" color={textMuted} lineHeight="tall">
                  {instructor.bio}
                </Text>

                {/* Social Links */}
                {instructor.socialLinks && (
                  <HStack spacing={3} pt={2}>
                    {Object.entries(instructor.socialLinks).map(
                      ([platform, url]) => {
                        if (!url) return null;
                        const IconComponent =
                          socialIcons[platform as keyof typeof socialIcons];
                        return (
                          <Link key={platform} href={url} isExternal>
                            <Button
                              size="md"
                              variant="outline"
                              leftIcon={<Icon as={IconComponent} />}
                              textTransform="capitalize"
                              borderRadius="lg"
                              fontWeight="semibold"
                            >
                              {platform}
                            </Button>
                          </Link>
                        );
                      }
                    )}
                  </HStack>
                )}
              </VStack>
            </FallInPlace>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Section - Separated */}
      <Box bg={heroBg} pt={12} pb={{ base: "60px", md: "80px" }}>
        <Container maxW="container.xl">
          <FallInPlace delay={0.2}>
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={6}
              p={8}
              bg={useColorModeValue(
                "linear-gradient(135deg, #48BB78 0%, #38A169 100%)",
                "linear-gradient(135deg, #2F855A 0%, #276749 100%)"
              )}
              borderRadius="2xl"
              boxShadow="xl"
            >
              <VStack spacing={2}>
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="xl"
                  bg="whiteAlpha.300"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiStar} color="white" boxSize={7} />
                </Flex>
                <Text fontSize="3xl" fontWeight="bold" color="white">
                  {instructor.rating}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                  Instructor Rating
                </Text>
              </VStack>

              <VStack spacing={2}>
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="xl"
                  bg="whiteAlpha.300"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiUsers} color="white" boxSize={7} />
                </Flex>
                <Text fontSize="3xl" fontWeight="bold" color="white">
                  {(instructor.totalStudents / 1000).toFixed(0)}K+
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                  Students Taught
                </Text>
              </VStack>

              <VStack spacing={2}>
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="xl"
                  bg="whiteAlpha.300"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiBook} color="white" boxSize={7} />
                </Flex>
                <Text fontSize="3xl" fontWeight="bold" color="white">
                  {instructor.totalCourses}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                  Total Courses
                </Text>
              </VStack>

              <VStack spacing={2}>
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="xl"
                  bg="whiteAlpha.300"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiAward} color="white" boxSize={7} />
                </Flex>
                <Text fontSize="3xl" fontWeight="bold" color="white">
                  {courses.length}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                  Available Now
                </Text>
              </VStack>
            </SimpleGrid>
          </FallInPlace>
        </Container>
      </Box>

      {/* Skills & Expertise Section - Separated */}
      <Box py={{ base: "60px", md: "80px" }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <FallInPlace>
              <VStack spacing={3} textAlign="center">
                <Badge
                  colorScheme="green"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  Skills & Expertise
                </Badge>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                  Technical Expertise
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }} color={textMuted} maxW="2xl">
                  Specialized in cutting-edge cybersecurity techniques and methodologies
                </Text>
              </VStack>
            </FallInPlace>

            <FallInPlace delay={0.1}>
              <Box
                w="full"
                bg={cardBg}
                p={8}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Wrap spacing={3} justify="center">
                  {instructor.skills.map((skill, index) => (
                    <WrapItem key={index}>
                      <Badge
                        colorScheme="green"
                        fontSize="md"
                        px={5}
                        py={3}
                        borderRadius="lg"
                        fontWeight="semibold"
                      >
                        {skill}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Experience Highlights Section - Separated */}
      <Box py={{ base: "60px", md: "80px" }} bg={cardBg}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <FallInPlace>
              <VStack spacing={3} textAlign="center">
                <Badge
                  colorScheme="green"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  Professional Background
                </Badge>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                  Experience & Achievements
                </Heading>
              </VStack>
            </FallInPlace>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={8}
              w="full"
            >
              <FallInPlace delay={0.1}>
                <Box
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                >
                  <VStack spacing={4} align="start">
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
                    <Heading size="md">Teaching Excellence</Heading>
                    <Text color={textMuted} lineHeight="tall">
                      {instructor.totalCourses}+ years of experience teaching
                      cybersecurity courses to students worldwide
                    </Text>
                  </VStack>
                </Box>
              </FallInPlace>

              <FallInPlace delay={0.2}>
                <Box
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                >
                  <VStack spacing={4} align="start">
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
                    <Heading size="md">Student Success</Heading>
                    <Text color={textMuted} lineHeight="tall">
                      Mentored {instructor.totalStudents.toLocaleString()}+ students,
                      helping them launch successful cybersecurity careers
                    </Text>
                  </VStack>
                </Box>
              </FallInPlace>

              <FallInPlace delay={0.3}>
                <Box
                  p={8}
                  bg={bgColor}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                >
                  <VStack spacing={4} align="start">
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
                    <Text color={textMuted} lineHeight="tall">
                      Industry-recognized expert with certifications from top security
                      organizations
                    </Text>
                  </VStack>
                </Box>
              </FallInPlace>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Courses Section - Separated */}
      <Box py={{ base: "60px", md: "80px" }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={10} align="stretch">
            <FallInPlace>
              <VStack spacing={3} textAlign="center">
                <Badge
                  colorScheme="green"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  Available Courses
                </Badge>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                  Courses by {instructor.name.split(" ")[0]}
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }} color={textMuted} maxW="2xl">
                  Explore comprehensive courses designed to take you from beginner to expert
                </Text>
              </VStack>
            </FallInPlace>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {courses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.05 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section - Final Separated */}
      <Box py={{ base: "60px", md: "80px" }} bg={cardBg}>
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
                <Icon as={FiTrendingUp} color="white" boxSize={12} />
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  color="white"
                  maxW="3xl"
                >
                  Ready to Start Learning?
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.900"
                  maxW="2xl"
                  lineHeight="tall"
                >
                  Enroll in one of {instructor.name.split(" ")[0]}'s courses and begin
                  your journey to becoming a cybersecurity expert
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
                    View All Courses
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
