"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Icon,
  Flex,
  useColorModeValue,
  Divider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import CourseCard from "@/components/academy/CourseCard";
import SearchBar from "@/components/academy/SearchBar";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { Em } from "@/components/shared/typography";
import {
  FiArrowRight,
  FiAward,
  FiUsers,
  FiBook,
  FiTrendingUp,
  FiStar,
  FiGlobe,
  FiShield,
  FiTarget,
  FiActivity,
  FiCloud,
  FiLock,
  FiUser
} from "react-icons/fi";
import { Course } from "@/types/academy";
import academyService from "@/lib/academy-service";
import { getFullImageUrl } from "@/lib/image-utils";

export default function AcademyHomePage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const bgColorAlt = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const heroOverlay = useColorModeValue(
    'linear-gradient(135deg, rgba(26, 32, 44, 0.88) 0%, rgba(45, 55, 72, 0.92) 100%)',
    'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(26, 32, 44, 0.80) 100%)'
  );

  const [courses, setCourses] = useState<Course[]>([]);
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [premiumCourses, setPremiumCourses] = useState<Course[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all courses and reviews
        const [allCourses, allReviews] = await Promise.all([
          academyService.getCourses(),
          academyService.getReviews({ take: 100 })
        ]);
        
        // Filter only PUBLISHED courses
        const publishedCourses = allCourses.filter((c) => c.status === "published");
        setCourses(publishedCourses);

        // Filter free and premium courses from published courses only
        const free = publishedCourses.filter((c) => c.tier === "free").slice(0, 3);
        const premium = publishedCourses.filter((c) => c.tier === "premium").slice(0, 3);
        
        setFreeCourses(free);
        setPremiumCourses(premium);

        // Get top-rated reviews (5 stars) for testimonials
        const topReviews = allReviews
          .filter((r) => r.rating === 5 && r.comment && r.comment.length > 50)
          .slice(0, 3);
        setFeaturedReviews(topReviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        overflow="hidden"
        bgImage="url('https://images.unsplash.com/photo-1518770660439-4636190af475')"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: useColorModeValue(
            'linear-gradient(135deg, rgba(26, 32, 44, 0.85) 0%, rgba(45, 55, 72, 0.90) 100%)',
            'linear-gradient(135deg, rgba(26, 32, 44, 0.70) 0%, rgba(45, 55, 72, 0.75) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={{ base: "4", md: "6" }} textAlign="center">
            <FallInPlace>
              <Badge
                colorScheme="green"
                fontSize="sm"
                px="4"
                py="2"
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Hack To Live Academy
              </Badge>
            </FallInPlace>

            <FallInPlace delay={0.1}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }}
                fontWeight="bold"
                color="white"
                lineHeight="1.2"
              >
                Master Cybersecurity Skills From Industry Experts
              </Heading>
            </FallInPlace>

            <FallInPlace delay={0.2}>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="whiteAlpha.900"
                maxW="3xl"
              >
                Join thousands of students learning ethical hacking, penetration testing,
                and web security. Get certified and launch your cybersecurity career with
                hands-on training in Bengali.
              </Text>
            </FallInPlace>

            {/* Stats */}
            <SimpleGrid
              columns={{ base: 2, sm: 2, md: 4 }}
              spacing={{ base: 4, sm: 6, md: 8 }}
              pt={{ base: 6, md: 8 }}
              w="full"
              maxW="4xl"
            >
              <VStack spacing="1">
                <Text fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }} fontWeight="bold" color="green.400">
                  50K+
                </Text>
                <Text fontSize={{ base: 'xs', sm: 'sm' }} color="whiteAlpha.800" textAlign="center">
                  Student Enrolled
                </Text>
              </VStack>
              <VStack spacing="1">
                <Text fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }} fontWeight="bold" color="green.400">
                  50+
                </Text>
                <Text fontSize={{ base: 'xs', sm: 'sm' }} color="whiteAlpha.800" textAlign="center">
                  Expert Courses
                </Text>
              </VStack>
              <VStack spacing="1">
                <Text fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }} fontWeight="bold" color="green.400">
                  3K+
                </Text>
                <Text fontSize={{ base: 'xs', sm: 'sm' }} color="whiteAlpha.800" textAlign="center">
                  Certificate Issued
                </Text>
              </VStack>
              <VStack spacing="1">
                <Text fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }} fontWeight="bold" color="green.400">
                  95%
                </Text>
                <Text fontSize={{ base: 'xs', sm: 'sm' }} color="whiteAlpha.800" textAlign="center">
                  Success Rate
                </Text>
              </VStack>
            </SimpleGrid>

            <FallInPlace delay={0.3}>
              <Flex
                gap={{ base: '2', sm: '4' }}
                flexDirection="row"
                width="100%"
                maxW={{ base: '100%', sm: 'auto' }}
                pt="2"
              >
                <ButtonLink
                  colorScheme="primary"
                  size={{ base: 'md', sm: 'lg' }}
                  href="/academy/courses"
                  rightIcon={<Icon as={FiArrowRight} />}
                  flex="1"
                >
                  Browse All Courses
                </ButtonLink>
                <ButtonLink
                  size={{ base: 'md', sm: 'lg' }}
                  href="/signup"
                  variant="outline"
                  flex="1"
                  borderColor="whiteAlpha.400"
                  color="white"
                  _hover={{
                    bg: "whiteAlpha.200",
                    borderColor: "whiteAlpha.600"
                  }}
                >
                  Sign Up Free
                </ButtonLink>
              </Flex>
            </FallInPlace>

            <FallInPlace delay={0.4}>
              <Box w="full" maxW="2xl" pt="4">
                <SearchBar placeholder="Search cybersecurity courses..." />
              </Box>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box
        py={{ base: '16', md: '24' }}
        bg={bgColor}
        position="relative"
      >
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <VStack spacing="4" textAlign="center">
                <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                  Browse by Category
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                  Explore Course Categories
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={textMuted} maxW="3xl">
                  Choose from our comprehensive range of cybersecurity specializations
                </Text>
              </VStack>
            </FallInPlace>

            <SimpleGrid columns={{ base: 2, md: 3, lg: 8 }} spacing={{ base: "4", md: "6" }}>
              {[
                { name: "Web Security", icon: FiGlobe, count: courses.filter(c => c.category === "web-security").length, color: "blue" },
                { name: "Network Security", icon: FiShield, count: courses.filter(c => c.category === "network-security").length, color: "purple" },
                { name: "Penetration Testing", icon: FiTarget, count: courses.filter(c => c.category === "penetration-testing").length, color: "red" },
                { name: "Malware Analysis", icon: FiActivity, count: courses.filter(c => c.category === "malware-analysis").length, color: "orange" },
                { name: "Cloud Security", icon: FiCloud, count: courses.filter(c => c.category === "cloud-security").length, color: "cyan" },
                { name: "Cryptography", icon: FiLock, count: courses.filter(c => c.category === "cryptography").length, color: "green" },
                { name: "Security Fundamentals", icon: FiShield, count: courses.filter(c => c.category === "security-fundamentals").length, color: "teal" },
                { name: "Incident Response", icon: FiActivity, count: courses.filter(c => c.category === "incident-response").length, color: "pink" },
              ].map((category, index) => (
                <FallInPlace key={category.name} delay={0.1 * index}>
                  <Box position="relative" w="100%" h="100%">
                    <ButtonLink
                      href={`/academy/courses?category=${category.name.toLowerCase().replace(" ", "-")}`}
                      variant="unstyled"
                      height="100%"
                      width="100%"
                      display="block"
                    >
                      <VStack
                        bg={cardBg}
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        _hover={{
                          transform: "translateY(-4px)",
                          shadow: "xl",
                          borderColor: `${category.color}.500`,
                        }}
                        cursor="pointer"
                        position="relative"
                        w="100%"
                        h="100%"
                        aspectRatio="1"
                        p={{ base: "4", md: "5" }}
                        spacing="3"
                        justify="center"
                        align="center"
                      >
                        <Flex
                          width={{ base: "45px", md: "55px" }}
                          height={{ base: "45px", md: "55px" }}
                          borderRadius="xl"
                          bg={`${category.color}.100`}
                          _dark={{ bg: `${category.color}.900` }}
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Icon as={category.icon} boxSize={{ base: "5", md: "6" }} color={`${category.color}.500`} />
                        </Flex>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "xs", md: "sm" }}
                          textAlign="center"
                          lineHeight="1.3"
                          px="2"
                        >
                          {category.name}
                        </Text>
                        <Badge colorScheme={category.color} fontSize={{ base: "2xs", md: "xs" }} flexShrink={0}>
                          {category.count} {category.count === 1 ? "course" : "courses"}
                        </Badge>
                      </VStack>
                    </ButtonLink>
                  </Box>
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Free Courses Section */}
      <Box py={{ base: '16', md: '24' }} position="relative" bg={bgColorAlt}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <Flex
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap="4"
              >
                <VStack align="start" spacing="2">
                  <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                    Free Access
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Start Learning For Free
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color={textMuted}>
                    Begin your cybersecurity journey with our free courses
                  </Text>
                </VStack>
                <ButtonLink
                  href="/academy/courses?free=true"
                  colorScheme="primary"
                  variant="outline"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  View All Free Courses
                </ButtonLink>
              </Flex>
            </FallInPlace>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {loading ? (
                <Center gridColumn="1 / -1" py="12">
                  <Spinner size="xl" color="green.500" thickness="4px" />
                </Center>
              ) : freeCourses.length > 0 ? (
                freeCourses.map((course, index) => (
                  <FallInPlace key={course.id} delay={0.1 * index}>
                    <CourseCard course={course} />
                  </FallInPlace>
                ))
              ) : (
                <Center gridColumn="1 / -1" py="12">
                  <Text color={textMuted}>No free courses available at the moment.</Text>
                </Center>
              )}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Premium Courses Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <Flex
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap="4"
              >
                <VStack align="start" spacing="2">
                  <Badge colorScheme="purple" fontSize="sm" px="3" py="1" borderRadius="full">
                    Premium Content
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Advanced Training Programs
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color={textMuted}>
                    Professional courses with industry-recognized certifications
                  </Text>
                </VStack>
                <ButtonLink
                  href="/academy/courses?premium=true"
                  colorScheme="primary"
                  variant="outline"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  View All Premium
                </ButtonLink>
              </Flex>
            </FallInPlace>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {loading ? (
                <Center gridColumn="1 / -1" py="12">
                  <Spinner size="xl" color="purple.500" thickness="4px" />
                </Center>
              ) : premiumCourses.length > 0 ? (
                premiumCourses.map((course, index) => (
                  <FallInPlace key={course.id} delay={0.1 * index}>
                    <CourseCard course={course} />
                  </FallInPlace>
                ))
              ) : (
                <Center gridColumn="1 / -1" py="12">
                  <Text color={textMuted}>No premium courses available at the moment.</Text>
                </Center>
              )}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColorAlt}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }}>
            <FallInPlace>
              <VStack spacing="4" textAlign="center">
                <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                  Simple Process
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                  How It Works
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="muted" maxW="2xl">
                  Start your cybersecurity journey in three simple steps
                </Text>
              </VStack>
            </FallInPlace>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: '8', md: '12' }}>
              <FallInPlace delay={0.1}>
                <VStack spacing="4" textAlign="center">
                  <Flex
                    w="100px"
                    h="100px"
                    borderRadius="2xl"
                    bg="green.100"
                    _dark={{ bg: "green.900" }}
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="green.500">
                      1
                    </Text>
                  </Flex>
                  <Heading size="md">Choose Your Course</Heading>
                  <Text color={textMuted}>
                    Browse our extensive catalog and select the course that matches your
                    goals and skill level.
                  </Text>
                </VStack>
              </FallInPlace>

              <FallInPlace delay={0.2}>
                <VStack spacing="4" textAlign="center">
                  <Flex
                    w="100px"
                    h="100px"
                    borderRadius="2xl"
                    bg="blue.100"
                    _dark={{ bg: "blue.900" }}
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="blue.500">
                      2
                    </Text>
                  </Flex>
                  <Heading size="md">Learn at Your Pace</Heading>
                  <Text color={textMuted}>
                    Access high-quality video lectures, hands-on labs, and practical
                    exercises anytime, anywhere.
                  </Text>
                </VStack>
              </FallInPlace>

              <FallInPlace delay={0.3}>
                <VStack spacing="4" textAlign="center">
                  <Flex
                    w="100px"
                    h="100px"
                    borderRadius="2xl"
                    bg="purple.100"
                    _dark={{ bg: "purple.900" }}
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="purple.500">
                      3
                    </Text>
                  </Flex>
                  <Heading size="md">Get Certified</Heading>
                  <Text color={textMuted}>
                    Complete the course, pass the assessments, and earn your industry-recognized
                    certificate.
                  </Text>
                </VStack>
              </FallInPlace>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Student Reviews Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }}>
            <FallInPlace>
              <VStack spacing="4" textAlign="center">
                <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                  Success Stories
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                  What Our Students Say
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={textMuted} maxW="3xl">
                  Join thousands of satisfied students who have transformed their cybersecurity careers
                </Text>
              </VStack>
            </FallInPlace>

            {featuredReviews.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
                {featuredReviews.map((testimonial, index) => (
                  <FallInPlace key={testimonial.id || index} delay={0.1 * index}>
                    <Box
                      bg={cardBg}
                      p="6"
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      h="full"
                    >
                      <VStack spacing="4" align="start">
                        <HStack spacing="1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Icon key={i} as={FiStar} color="yellow.500" fill="yellow.500" />
                          ))}
                        </HStack>
                        <Text color={textMuted} fontSize="sm" lineHeight="tall">
                          "{testimonial.comment}"
                        </Text>
                        <HStack spacing="3" mt="auto">
                          <Image
                            src={getFullImageUrl(testimonial.user?.avatar || '/images/default-avatar.png', 'avatar')}
                            alt={testimonial.user?.name || 'User'}
                            width={48}
                            height={48}
                            style={{ borderRadius: "50%" }}
                          />
                          <VStack align="start" spacing="0">
                            <Text fontWeight="bold" fontSize="sm">
                              {testimonial.user?.name || 'Anonymous'}
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
            )}
            
            {featuredReviews.length === 0 && !loading && (
              <Box textAlign="center" py="12">
                <Text color={textMuted} fontSize="lg">
                  No reviews yet. Be the first to share your experience!
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Instructor Highlights Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }}>
            <FallInPlace>
              <VStack spacing="4" textAlign="center">
                <Badge colorScheme="purple" fontSize="sm" px="3" py="1" borderRadius="full">
                  Learn from the Best
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                  Meet Our Expert Instructors
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={textMuted} maxW="3xl">
                  Learn from industry professionals with years of real-world experience
                </Text>
              </VStack>
            </FallInPlace>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="8">
              {(() => {
                // Get unique instructors from published courses
                const publishedCourses = courses.filter(c => c.status === "published");
                const uniqueInstructors = Array.from(
                  new Map(publishedCourses.map(course => [course.instructor.id, course.instructor])).values()
                ).slice(0, 3);
                
                return uniqueInstructors.map((instructor, index) => (
                  <FallInPlace key={instructor.id} delay={0.1 * index}>
                    <ButtonLink
                      href={`/academy/instructors/${instructor.id}`}
                      variant="unstyled"
                      height="auto"
                      display="block"
                    >
                    <Box
                      bg={cardBg}
                      borderRadius="3xl"
                      overflow="hidden"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.4s ease"
                      position="relative"
                      _hover={{
                        transform: "translateY(-8px)",
                        shadow: "2xl",
                        borderColor: "purple.500",
                        _before: {
                          opacity: 1
                        }
                      }}
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bg: "linear-gradient(135deg, purple.500, pink.500)",
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        borderRadius: "3xl",
                        zIndex: -1,
                        filter: "blur(20px)",
                      }}
                      cursor="pointer"
                      h="full"
                    >
                      <Box position="relative" overflow="hidden">
                      {instructor.avatar ? (
                        <Image
                          src={getFullImageUrl(instructor.avatar, 'avatar')}
                          alt={instructor.name}
                          width={400}
                          height={400}
                          unoptimized
                          style={{
                            width: "100%",
                            height: "280px",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bg={useColorModeValue('gray.200', 'gray.700')}
                          style={{
                            width: "100%",
                            height: "280px"
                          }}
                        >
                          <Icon as={FiUser} boxSize="80px" color={useColorModeValue('gray.500', 'gray.400')} />
                        </Box>
                      )}
                        <Box
                          position="absolute"
                          bottom="0"
                          left="0"
                          right="0"
                          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                          p="4"
                        >
                          <Badge
                            colorScheme="purple"
                            fontSize="xs"
                            px="3"
                            py="1"
                            borderRadius="full"
                          >
                            Expert Instructor
                          </Badge>
                        </Box>
                      </Box>

                      <VStack p="6" spacing="4" align="start">
                        <VStack align="start" spacing="2" w="full">
                          <Heading size="md" color={headingColor}>
                            {instructor.name}
                          </Heading>
                          <Text fontSize="sm" color={textMuted} noOfLines={2} lineHeight="tall">
                            {instructor.bio || "Expert Cybersecurity Instructor"}
                          </Text>
                        </VStack>

                        <Box
                          w="full"
                          pt="4"
                          borderTopWidth="1px"
                          borderColor={borderColor}
                        >
                          <SimpleGrid columns={3} spacing="4" fontSize="sm">
                            <VStack spacing="1">
                              <HStack spacing="1" color="yellow.500">
                                <Icon as={FiStar} />
                                <Text fontWeight="bold">{instructor.rating}</Text>
                              </HStack>
                              <Text fontSize="xs" color={textMuted}>Rating</Text>
                            </VStack>

                            <VStack spacing="1">
                              <HStack spacing="1" color="purple.500">
                                <Icon as={FiUsers} />
                                <Text fontWeight="bold">
                                  {instructor.totalStudents > 999
                                    ? `${(instructor.totalStudents / 1000).toFixed(1)}k`
                                    : instructor.totalStudents}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color={textMuted}>Students</Text>
                            </VStack>

                            <VStack spacing="1">
                              <HStack spacing="1" color="blue.500">
                                <Icon as={FiBook} />
                                <Text fontWeight="bold">{instructor.totalCourses}</Text>
                              </HStack>
                              <Text fontSize="xs" color={textMuted}>Courses</Text>
                            </VStack>
                          </SimpleGrid>
                        </Box>
                      </VStack>
                    </Box>
                  </ButtonLink>
                </FallInPlace>
              ));
              })()}
            </SimpleGrid>

            <FallInPlace delay={0.4}>
              <ButtonLink
                href="/academy/instructors"
                colorScheme="primary"
                variant="outline"
                size="lg"
                rightIcon={<Icon as={FiArrowRight} />}
              >
                View All Instructors
              </ButtonLink>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColorAlt}>
        <Container maxW="container.xl">
          <FallInPlace>
            <Box
              bg={useColorModeValue('green.50', 'gray.800')}
              borderWidth="2px"
              borderColor={useColorModeValue('green.400', 'green.600')}
              p={{ base: '8', md: '12', lg: '16' }}
              borderRadius="3xl"
              textAlign="center"
              position="relative"
              overflow="hidden"
              shadow="xl"
            >
              <Box
                position="absolute"
                top="-50%"
                right="-20%"
                width="400px"
                height="400px"
                borderRadius="full"
                bg={accentColor}
                opacity="0.1"
                filter="blur(80px)"
                pointerEvents="none"
              />

              <VStack spacing="6" position="relative" zIndex="1">
                <Badge colorScheme="green" fontSize="md" px="4" py="2" borderRadius="full">
                  Start Today
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} maxW="3xl">
                  Ready to Start Your <Em>Cybersecurity Journey?</Em>
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={textMuted} maxW="2xl">
                  Join HACKTOLIVE Academy today and learn from the best. Get lifetime access to all
                  course materials and join our thriving community of cyber warriors.
                </Text>
                <Flex gap={{ base: '2', sm: '4' }} flexDirection="row" pt="4" width="100%" justify="center">
                  <ButtonLink
                    href="/academy/courses"
                    size={{ base: 'md', sm: 'lg' }}
                    colorScheme="primary"
                    rightIcon={<Icon as={FiArrowRight} />}
                  >
                    Explore Courses
                  </ButtonLink>
                  <ButtonLink
                    href="/signup"
                    size={{ base: 'md', sm: 'lg' }}
                    variant="outline"
                  >
                    Sign Up Free
                  </ButtonLink>
                </Flex>
              </VStack>
            </Box>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  );
}
