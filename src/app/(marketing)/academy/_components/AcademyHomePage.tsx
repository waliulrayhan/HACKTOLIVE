"use client";

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
} from "@chakra-ui/react";
import Image from "next/image";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { courses } from "@/data/academy/courses";
import { liveCourses } from "@/data/academy/batches";
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
  FiStar
} from "react-icons/fi";

export default function AcademyHomePage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const bgColorAlt = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const heroOverlay = useColorModeValue(
    'linear-gradient(135deg, rgba(26, 32, 44, 0.88) 0%, rgba(45, 55, 72, 0.92) 100%)',
    'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(26, 32, 44, 0.80) 100%)'
  );
  
  const freeCourses = courses.filter((c) => c.tier === "free").slice(0, 3);
  const premiumCourses = courses.filter((c) => c.tier === "premium").slice(0, 3);
  const upcomingLiveCourses = liveCourses.slice(0, 3);

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

            <FallInPlace delay={0.3}>
              <Flex 
                gap="4" 
                flexDirection={{ base: 'column', sm: 'row' }}
                width={{ base: '100%', sm: 'auto' }}
                pt="2"
              >
                <ButtonLink 
                  colorScheme="primary" 
                  size="lg"
                  href="/academy/courses"
                  rightIcon={<Icon as={FiArrowRight} />}
                  flex={{ base: '1', sm: 'none' }}
                >
                  Browse All Courses
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  href="/signup"
                  variant="outline"
                  flex={{ base: '1', sm: 'none' }}
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

      {/* Stats Section */}
      <Box py={{ base: '12', md: '16' }} bg={bgColorAlt}>
        <Container maxW="container.xl">
          <FallInPlace delay={0.2}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: '6', md: '8' }}>
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="green.50"
                  _dark={{ bg: "green.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiUsers} boxSize={{ base: '6', md: '8' }} color="green.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  50,000+
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={textMuted} textAlign="center">
                  Students Enrolled
                </Text>
              </VStack>
              
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="blue.50"
                  _dark={{ bg: "blue.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiBook} boxSize={{ base: '6', md: '8' }} color="blue.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  50+
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={textMuted} textAlign="center">
                  Expert Courses
                </Text>
              </VStack>
              
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="purple.50"
                  _dark={{ bg: "purple.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiAward} boxSize={{ base: '6', md: '8' }} color="purple.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  30,000+
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={textMuted} textAlign="center">
                  Certificates Issued
                </Text>
              </VStack>
              
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="orange.50"
                  _dark={{ bg: "orange.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiTrendingUp} boxSize={{ base: '6', md: '8' }} color="orange.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  95%
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={textMuted} textAlign="center">
                  Success Rate
                </Text>
              </VStack>
            </SimpleGrid>
          </FallInPlace>
        </Container>
      </Box>

      {/* Popular Courses Carousel */}
      {/* <Box py={{ base: '16', md: '24' }}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing="2">
                  <Badge colorScheme="blue" fontSize="sm" px="3" py="1" borderRadius="full">
                    Most Popular
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Trending Courses
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="muted">
                    Join our most popular courses taken by thousands of students
                  </Text>
                </VStack>
              </Flex>
            </FallInPlace>
            
            <Box>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
                {courses
                  .sort((a, b) => b.totalStudents - a.totalStudents)
                  .slice(0, 6)
                  .map((course, index) => (
                    <FallInPlace key={course.id} delay={0.05 * index}>
                      <CourseCard course={course} />
                    </FallInPlace>
                  ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box> */}

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

            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing="6">
              {[
                { name: "Web Security", icon: "🌐", count: courses.filter(c => c.category === "web-security").length, color: "blue" },
                { name: "Network Security", icon: "🔒", count: courses.filter(c => c.category === "network-security").length, color: "purple" },
                { name: "Penetration Testing", icon: "🎯", count: courses.filter(c => c.category === "penetration-testing").length, color: "red" },
                { name: "Malware Analysis", icon: "🦠", count: courses.filter(c => c.category === "malware-analysis").length, color: "orange" },
                { name: "Cloud Security", icon: "☁️", count: courses.filter(c => c.category === "cloud-security").length, color: "cyan" },
                { name: "Cryptography", icon: "🔐", count: courses.filter(c => c.category === "cryptography").length, color: "green" },
              ].map((category, index) => (
                <FallInPlace key={category.name} delay={0.1 * index}>
                  <ButtonLink
                    href={`/academy/courses?category=${category.name.toLowerCase().replace(" ", "-")}`}
                    variant="unstyled"
                    height="auto"
                    display="block"
                  >
                    <VStack
                      p="6"
                      bg={cardBg}
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      spacing="3"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-4px)",
                        shadow: "xl",
                        borderColor: `${category.color}.500`,
                      }}
                      cursor="pointer"
                    >
                      <Text fontSize="3xl">{category.icon}</Text>
                      <Text fontWeight="bold" fontSize="sm" textAlign="center" noOfLines={2}>
                        {category.name}
                      </Text>
                      <Badge colorScheme={category.color} fontSize="xs">
                        {category.count} {category.count === 1 ? "course" : "courses"}
                      </Badge>
                    </VStack>
                  </ButtonLink>
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
              {freeCourses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.1 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
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
              {premiumCourses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.1 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Upcoming Live Batches Section */}
      {/* <Box py={{ base: '16', md: '24' }} position="relative" overflow="hidden">
        <Box
          position="absolute"
          bottom="-10%"
          left="-5%"
          width="500px"
          height="500px"
          borderRadius="full"
          bg={accentColor}
          opacity="0.08"
          filter="blur(100px)"
          pointerEvents="none"
        />
        
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
                    🔴 Live Training
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Live Classes Available
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="muted">
                    Join live interactive sessions with expert instructors
                  </Text>
                </VStack>
                <ButtonLink 
                  href="/academy/courses?deliveryMode=live" 
                  colorScheme="primary"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  View All Live Courses
                </ButtonLink>
              </Flex>
            </FallInPlace>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {upcomingLiveCourses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.1 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box> */}

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
                    bg="green.50"
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
                    bg="blue.50"
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
                    bg="purple.50"
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
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {[
                {
                  name: "Alex Thompson",
                  avatar: "/images/user/user-05.jpg",
                  role: "Security Engineer",
                  rating: 5,
                  comment: "HACKTOLIVE Academy completely changed my career path. The hands-on approach and expert instructors helped me land my dream job in cybersecurity!"
                },
                {
                  name: "Sarah Johnson",
                  avatar: "/images/user/user-06.jpg",
                  role: "Penetration Tester",
                  rating: 5,
                  comment: "The best investment I've made in my career. The courses are practical, up-to-date, and taught by industry professionals who actually know their stuff."
                },
                {
                  name: "Rahul Sharma",
                  avatar: "/images/user/user-07.jpg",
                  role: "Cybersecurity Analyst",
                  rating: 5,
                  comment: "Learning in Bengali made complex concepts so much easier to understand. The community support and lifetime access make it worth every penny!"
                }
              ].map((testimonial, index) => (
                <FallInPlace key={testimonial.name} delay={0.1 * index}>
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
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          style={{ borderRadius: "50%" }}
                        />
                        <VStack align="start" spacing="0">
                          <Text fontWeight="bold" fontSize="sm">
                            {testimonial.name}
                          </Text>
                          <Text fontSize="xs" color="muted">
                            {testimonial.role}
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
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {courses.slice(0, 3).map((course, index) => (
                <FallInPlace key={course.instructor.id} delay={0.1 * index}>
                  <ButtonLink
                    href={`/academy/instructors/${course.instructor.id}`}
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
                        transform: "translateY(-4px)",
                        shadow: "xl",
                        borderColor: "purple.500"
                      }}
                      cursor="pointer"
                    >
                      <Image
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        width={400}
                        height={400}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <VStack p="6" spacing="3" align="start">
                        <Heading size="md">{course.instructor.name}</Heading>
                        <Text fontSize="sm" color={textMuted} noOfLines={2}>
                          {course.instructor.experience}
                        </Text>
                        <HStack spacing="4" fontSize="sm" color="muted">
                          <HStack spacing="1">
                            <Icon as={FiStar} color="yellow.500" />
                            <Text fontWeight="semibold">{course.instructor.rating}</Text>
                          </HStack>
                          <HStack spacing="1">
                            <Icon as={FiUsers} />
                            <Text>{course.instructor.totalStudents.toLocaleString()}</Text>
                          </HStack>
                          <HStack spacing="1">
                            <Icon as={FiBook} />
                            <Text>{course.instructor.totalCourses} courses</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Box>
                  </ButtonLink>
                </FallInPlace>
              ))}
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
                <Flex gap="4" flexDirection={{ base: 'column', sm: 'row' }} pt="4">
                  <ButtonLink
                    href="/academy/courses"
                    size="lg"
                    colorScheme="primary"
                    rightIcon={<Icon as={FiArrowRight} />}
                    flex={{ base: '1', sm: 'none' }}
                  >
                    Explore Courses
                  </ButtonLink>
                  <ButtonLink
                    href="/signup"
                    size="lg"
                    variant="outline"
                    flex={{ base: '1', sm: 'none' }}
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
