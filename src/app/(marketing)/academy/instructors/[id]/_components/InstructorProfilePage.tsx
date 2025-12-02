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
} from "react-icons/fi";

interface InstructorProfilePageProps {
  instructor: Instructor;
  courses: Course[];
}

export default function InstructorProfilePage({ instructor, courses }: InstructorProfilePageProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const socialIcons = {
    linkedin: FiLinkedin,
    twitter: FiTwitter,
    github: FiGithub,
    website: FiGlobe,
  };

  return (
    <Box>
      {/* Header Section */}
      <Box py={{ base: "12", md: "16" }} bg={bgColor} borderBottomWidth="1px">
        <Container maxW="container.xl">
          <FallInPlace>
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "8", lg: "12" }} alignItems="center">
              <Box>
                <Image
                  src={instructor.avatar}
                  alt={instructor.name}
                  width={400}
                  height={400}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "1rem",
                  }}
                />
              </Box>

              <VStack align="start" spacing="6" gridColumn={{ lg: "span 2" }}>
                <VStack align="start" spacing="3">
                  <Badge colorScheme="purple" fontSize="sm" px="3" py="1" borderRadius="full">
                    Instructor Profile
                  </Badge>
                  <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                    {instructor.name}
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} color="muted">
                    {instructor.experience}
                  </Text>
                </VStack>

                {/* Stats */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing="6" w="full">
                  <VStack spacing="1">
                    <HStack spacing="1">
                      <Icon as={FiStar} color="yellow.500" />
                      <Text fontSize="2xl" fontWeight="bold">
                        {instructor.rating}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="muted">
                      Instructor Rating
                    </Text>
                  </VStack>

                  <VStack spacing="1">
                    <HStack spacing="1">
                      <Icon as={FiUsers} color="primary.500" />
                      <Text fontSize="2xl" fontWeight="bold">
                        {instructor.totalStudents.toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="muted">
                      Students
                    </Text>
                  </VStack>

                  <VStack spacing="1">
                    <HStack spacing="1">
                      <Icon as={FiBook} color="blue.500" />
                      <Text fontSize="2xl" fontWeight="bold">
                        {instructor.totalCourses}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="muted">
                      Courses
                    </Text>
                  </VStack>

                  <VStack spacing="1">
                    <HStack spacing="1">
                      <Icon as={FiAward} color="orange.500" />
                      <Text fontSize="2xl" fontWeight="bold">
                        {courses.length}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="muted">
                      Available
                    </Text>
                  </VStack>
                </SimpleGrid>

                {/* Social Links */}
                {instructor.socialLinks && (
                  <HStack spacing="3">
                    {Object.entries(instructor.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                      return (
                        <Link key={platform} href={url} isExternal>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Icon as={IconComponent} />}
                            textTransform="capitalize"
                          >
                            {platform}
                          </Button>
                        </Link>
                      );
                    })}
                  </HStack>
                )}
              </VStack>
            </SimpleGrid>
          </FallInPlace>
        </Container>
      </Box>

      {/* Main Content */}
      <Box py={{ base: "16", md: "24" }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "12", lg: "16" }}>
            {/* Left Column - About & Skills */}
            <Box gridColumn={{ lg: "span 2" }}>
              <VStack spacing="8" align="stretch">
                {/* About */}
                <FallInPlace>
                  <VStack align="stretch" spacing="4">
                    <Heading size="lg">About {instructor.name}</Heading>
                    <Text color="muted" lineHeight="tall">
                      {instructor.bio}
                    </Text>
                  </VStack>
                </FallInPlace>

                {/* Courses Taught */}
                <FallInPlace delay={0.1}>
                  <VStack align="stretch" spacing="6">
                    <Heading size="lg">Courses by {instructor.name.split(" ")[0]}</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                      {courses.map((course, index) => (
                        <FallInPlace key={course.id} delay={0.05 * index}>
                          <CourseCard course={course} />
                        </FallInPlace>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </FallInPlace>
              </VStack>
            </Box>

            {/* Right Column - Skills */}
            <VStack spacing="8" align="stretch">
              <FallInPlace delay={0.2}>
                <Box p="6" bg={cardBg} borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="4" align="stretch">
                    <Heading size="md">Expertise & Skills</Heading>
                    <Wrap spacing="2">
                      {instructor.skills.map((skill, index) => (
                        <WrapItem key={index}>
                          <Badge
                            colorScheme="primary"
                            fontSize="sm"
                            px="3"
                            py="1"
                            borderRadius="full"
                          >
                            {skill}
                          </Badge>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </VStack>
                </Box>
              </FallInPlace>

              <FallInPlace delay={0.3}>
                <Box p="6" bg={cardBg} borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="4" align="stretch">
                    <Heading size="md">Experience</Heading>
                    <Text fontSize="sm" color="muted" lineHeight="tall">
                      {instructor.experience}
                    </Text>
                    <Divider />
                    <VStack spacing="3" align="start">
                      <HStack>
                        <Icon as={FiBook} color="primary.500" />
                        <Text fontSize="sm">
                          Teaching for {instructor.totalCourses}+ years
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiUsers} color="primary.500" />
                        <Text fontSize="sm">
                          Mentored {instructor.totalStudents.toLocaleString()}+ students
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiAward} color="primary.500" />
                        <Text fontSize="sm">Industry-recognized expert</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              </FallInPlace>

              {/* CTA */}
              <FallInPlace delay={0.4}>
                <Box
                  p="6"
                  bg="primary.50"
                  _dark={{ bg: "primary.900" }}
                  borderRadius="2xl"
                  textAlign="center"
                >
                  <VStack spacing="4">
                    <Heading size="md">Want to Learn More?</Heading>
                    <Text fontSize="sm" color="muted">
                      Enroll in one of {instructor.name.split(" ")[0]}'s courses today
                    </Text>
                    <ButtonLink
                      href="/academy/courses"
                      colorScheme="primary"
                      size="md"
                      width="full"
                    >
                      Browse All Courses
                    </ButtonLink>
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
