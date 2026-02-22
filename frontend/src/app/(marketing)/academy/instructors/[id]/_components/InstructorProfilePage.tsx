"use client";

import { useState, useEffect } from "react";
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
  Spinner,
  Center,
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
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiMessageCircle,
  FiUser
} from "react-icons/fi";
import academyService from "@/lib/academy-service";
import { getFullImageUrl } from "@/lib/image-utils";

interface InstructorProfilePageProps {
  id: string;
}

export default function InstructorProfilePage({ id }: InstructorProfilePageProps) {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const heroBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("green.500", "green.400");

  useEffect(() => {
    const fetchInstructorData = async () => {
      setLoading(true);
      try {
        const instructorData = await academyService.getInstructorById(id);
        setInstructor(instructorData);

        // Fetch all courses and filter by instructor
        const allCourses = await academyService.getCourses();
        const instructorCourses = allCourses.filter(
          (course) => course.instructor?.id === id
        );
        setCourses(instructorCourses);

        // Fetch reviews for all instructor's courses
        if (instructorCourses.length > 0) {
          const reviewsPromises = instructorCourses.map(course => 
            academyService.getCourseReviews(course.id)
          );
          const allReviews = await Promise.all(reviewsPromises);
          const flatReviews = allReviews.flat();
          // Get top 6 recent 5-star reviews
          const topReviews = flatReviews
            .filter(r => r.rating === 5 && r.comment)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6);
          setReviews(topReviews);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [id]);

  const socialIcons: Record<string, any> = {
    linkedin: FiLinkedin,
    twitter: FiTwitter,
    github: FiGithub,
    website: FiGlobe,
    facebook: FiFacebook,
    instagram: FiInstagram,
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py="20">
        <Center>
          <VStack spacing="4">
            <Spinner size="xl" color="green.500" thickness="4px" />
            <Text color={textMuted}>Loading instructor profile...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (!instructor) {
    return (
      <Container maxW="container.xl" py="20">
        <Center>
          <VStack spacing="4">
            <Heading>Instructor Not Found</Heading>
            <Text color={textMuted}>The instructor you're looking for doesn't exist.</Text>
            <ButtonLink href="/academy/instructors" colorScheme="primary">
              Browse All Instructors
            </ButtonLink>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section - Clean Header */}
      <Box
        bg={useColorModeValue("gray.900", "gray.950")}
        pt={{ base: "120px", md: "140px" }}
        pb={{ base: "80px", md: "100px" }}
      >
        <Container maxW="container.xl">
          <VStack spacing={8}>
            {/* Instructor Avatar and Name */}
            <FallInPlace>
              <VStack spacing={6} textAlign="center">
                <Box position="relative">
                  {instructor.user?.avatar ? (
                    <Box
                      position="relative"
                      w={{ base: "150px", md: "200px" }}
                      h={{ base: "150px", md: "200px" }}
                      borderRadius="full"
                      overflow="hidden"
                      borderWidth="4px"
                      borderColor="green.500"
                      boxShadow="xl"
                    >
                      <Image
                        src={getFullImageUrl(instructor.user.avatar, 'avatar')}
                        alt={instructor.user?.name || 'Instructor'}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  ) : (
                    <Flex
                      w={{ base: "150px", md: "200px" }}
                      h={{ base: "150px", md: "200px" }}
                      borderRadius="full"
                      bg={useColorModeValue('gray.700', 'gray.800')}
                      borderWidth="4px"
                      borderColor="green.500"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiUser} boxSize={{ base: "60px", md: "80px" }} color="gray.500" />
                    </Flex>
                  )}
                </Box>

                <VStack spacing={3}>
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    fontWeight="extrabold"
                    color="white"
                    lineHeight="1.1"
                  >
                    {instructor.user?.name || 'Instructor'}
                  </Heading>
                  
                  {instructor.user?.bio && (
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      color="gray.400"
                      maxW="2xl"
                      lineHeight="tall"
                    >
                      {instructor.user.bio}
                    </Text>
                  )}
                </VStack>

                {/* Contact & Location */}
                <HStack spacing={6} flexWrap="wrap" justify="center" pt={4}>
                  {(instructor.user?.city || instructor.user?.country) && (
                    <HStack spacing={2} color="gray.400">
                      <Icon as={FiMapPin} boxSize={4} />
                      <Text fontSize="sm">
                        {[instructor.user?.city, instructor.user?.country].filter(Boolean).join(", ")}
                      </Text>
                    </HStack>
                  )}
                  {instructor.user?.email && (
                    <HStack spacing={2} color="gray.400">
                      <Icon as={FiMail} boxSize={4} />
                      <Link href={`mailto:${instructor.user.email}`} fontSize="sm">
                        {instructor.user.email}
                      </Link>
                    </HStack>
                  )}
                </HStack>

                {/* Social Links */}
                {(instructor.user?.linkedinUrl || 
                  instructor.user?.twitterUrl || 
                  instructor.user?.githubUrl || 
                  instructor.user?.websiteUrl ||
                  instructor.user?.facebookUrl ||
                  instructor.user?.instagramUrl) && (
                  <Wrap spacing={3} justify="center" pt={4}>
                    {instructor.user?.linkedinUrl && (
                      <WrapItem>
                        <Link href={instructor.user.linkedinUrl} isExternal>
                          <Icon as={FiLinkedin} boxSize={5} color="gray.400" _hover={{ color: "green.400" }} />
                        </Link>
                      </WrapItem>
                    )}
                    {instructor.user?.twitterUrl && (
                      <WrapItem>
                        <Link href={instructor.user.twitterUrl} isExternal>
                          <Icon as={FiTwitter} boxSize={5} color="gray.400" _hover={{ color: "green.400" }} />
                        </Link>
                      </WrapItem>
                    )}
                    {instructor.user?.githubUrl && (
                      <WrapItem>
                        <Link href={instructor.user.githubUrl} isExternal>
                          <Icon as={FiGithub} boxSize={5} color="gray.400" _hover={{ color: "green.400" }} />
                        </Link>
                      </WrapItem>
                    )}
                    {instructor.user?.websiteUrl && (
                      <WrapItem>
                        <Link href={instructor.user.websiteUrl} isExternal>
                          <Icon as={FiGlobe} boxSize={5} color="gray.400" _hover={{ color: "green.400" }} />
                        </Link>
                      </WrapItem>
                    )}
                    {instructor.user?.facebookUrl && (
                      <WrapItem>
                        <Link href={instructor.user.facebookUrl} isExternal>
                          <Icon as={FiFacebook} boxSize={5} color="gray.400" _hover={{ color: "green.400" }} />
                        </Link>
                      </WrapItem>
                    )}
                    {instructor.user?.instagramUrl && (
                      <WrapItem>
                        <Link href={instructor.user.instagramUrl} isExternal>
                          <Icon as={FiInstagram} boxSize={5} color="gray.400" _hover={{ color: "green.400" }} />
                        </Link>
                      </WrapItem>
                    )}
                  </Wrap>
                )}
              </VStack>
            </FallInPlace>

            {/* Stats Bar */}
            <FallInPlace delay={0.1}>
              <SimpleGrid
                columns={{ base: 2, md: 4 }}
                spacing={{ base: 6, md: 8 }}
                w="full"
                maxW="4xl"
              >
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {instructor.rating}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Rating
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {(instructor.totalStudents / 1000).toFixed(0)}K+
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Students
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {instructor.totalCourses}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Courses
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {reviews.length}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                    Reviews
                  </Text>
                </VStack>
              </SimpleGrid>
            </FallInPlace>
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
                  bg={useColorModeValue('green.200', 'green.700')}
                  color={useColorModeValue('green.900', 'white')}
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  Available Courses
                </Badge>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                  Courses by {instructor.user?.name?.split(" ")[0] || 'Instructor'}
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

      {/* Student Reviews Section */}
      {reviews.length > 0 && (
        <Box py={{ base: "60px", md: "80px" }} bg={cardBg}>
          <Container maxW="container.xl">
            <VStack spacing={10} align="stretch">
              <FallInPlace>
                <VStack spacing={3} textAlign="center">
                  <Badge
                    colorScheme="purple"
                    fontSize="sm"
                    px={4}
                    py={2}
                    borderRadius="full"
                  >
                    Student Testimonials
                  </Badge>
                  <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                    What Students Say
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} color={textMuted} maxW="2xl">
                    Real feedback from students who learned from {instructor.user?.name?.split(" ")[0] || 'the instructor'}
                  </Text>
                </VStack>
              </FallInPlace>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {reviews.map((review, index) => (
                  <FallInPlace key={review.id} delay={0.05 * index}>
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      h="full"
                    >
                      <VStack spacing={4} align="start" h="full">
                        <HStack spacing={1}>
                          {[...Array(review.rating)].map((_, i) => (
                            <Icon key={i} as={FiStar} color="yellow.500" fill="yellow.500" boxSize={4} />
                          ))}
                        </HStack>
                        <Text color={textMuted} fontSize="sm" lineHeight="tall" flex="1">
                          "{review.comment}"
                        </Text>
                        <HStack spacing={3} mt="auto">
                          <Avatar
                            size="sm"
                            name={review.user?.name || 'User'}
                            src={review.user?.avatar || '/images/default-avatar.png'}
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="sm">
                              {review.user?.name || 'Anonymous'}
                            </Text>
                            <Text fontSize="xs" color="muted">
                              Verified Student
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                    </Box>
                  </FallInPlace>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      )}

      {/* CTA Section */}
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
            >
              <VStack spacing={6}>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  color="white"
                >
                  Ready to Start Learning?
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.900"
                  maxW="2xl"
                >
                  Enroll in {instructor.user?.name?.split(" ")[0] || 'this instructor'}'s courses and begin your journey
                </Text>
                <HStack spacing={4} pt={4} flexWrap="wrap" justify="center">
                  <ButtonLink
                    href="/academy/courses"
                    size="lg"
                    bg="white"
                    color="green.600"
                    _hover={{ bg: "gray.100" }}
                  >
                    Browse All Courses
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
